import type { PrismaClient } from '@prisma/client';
import { computeEffectiveServings, convertQuantity } from '@homeshared/shared';
import {
  type IngredientMatchProfile,
  fridgeItemMatchesProfile,
  totalFridgeQuantityForIngredient,
} from './ingredient-normalize.service.js';
import { ensureMealSettings } from './group-permissions.service.js';

export interface PlannedMealRef {
  entryId: string;
  title: string;
  dayOfWeek: number;
  mealSlot: string;
}

export interface IngredientReservation {
  slug: string;
  nameFr: string;
  reservedQuantity: number;
  unit: string | null;
  plannedMeals: PlannedMealRef[];
}

export interface FridgeItemAvailability {
  id: string;
  name: string;
  quantity: number;
  unit: string | null;
  expiresAt: Date | null;
  addedAt: Date;
  reservedQuantity: number;
  availableQuantity: number;
}

/**
 * Quantités réservées par les repas planifiés non encore cuisinés (slug catalogue).
 * Les produits restent dans le frigo mais ne sont plus « libres » pour d'autres recettes.
 */
export async function computeMealPlanReservations(
  prisma: PrismaClient,
  groupId: string,
  options?: { excludeEntryId?: string },
): Promise<Map<string, IngredientReservation>> {
  const [entries, mealSettings, memberCount] = await Promise.all([
    prisma.mealPlanEntry.findMany({
      where: { groupId, cookedAt: null },
      include: {
        recipe: {
          select: {
            title: true,
            servings: true,
            ingredients: {
              include: {
                ingredient: {
                  select: { slug: true, nameFr: true, defaultUnit: true, aliases: true },
                },
              },
            },
          },
        },
      },
    }),
    ensureMealSettings(prisma, groupId),
    prisma.membership.count({ where: { groupId } }),
  ]);

  const adults = mealSettings.servingsFromMemberCount
    ? Math.max(1, memberCount)
    : Math.max(1, mealSettings.adultEaters);
  const defaultServings = computeEffectiveServings(adults, mealSettings.childEaters);

  const bySlug = new Map<string, IngredientReservation>();

  for (const entry of entries) {
    if (options?.excludeEntryId && entry.id === options.excludeEntryId) continue;
    const portions = entry.servings ?? defaultServings;
    const scale = portions / Math.max(1, entry.recipe.servings);

    for (const line of entry.recipe.ingredients) {
      if (line.optional) continue;
      const ing = line.ingredient;
      const reqUnit = line.unit ?? ing.defaultUnit;
      const addQty = Number((Number(line.quantity) * scale).toFixed(2));

      const existing = bySlug.get(ing.slug) ?? {
        slug: ing.slug,
        nameFr: ing.nameFr,
        reservedQuantity: 0,
        unit: reqUnit,
        plannedMeals: [],
      };

      const converted = convertQuantity(
        addQty,
        reqUnit,
        existing.unit,
        ing.defaultUnit,
        ing.defaultUnit,
      );
      existing.reservedQuantity += converted ?? addQty;
      if (!existing.plannedMeals.some((m) => m.entryId === entry.id)) {
        existing.plannedMeals.push({
          entryId: entry.id,
          title: entry.recipe.title,
          dayOfWeek: entry.dayOfWeek,
          mealSlot: entry.mealSlot,
        });
      }
      bySlug.set(ing.slug, existing);
    }
  }

  for (const r of bySlug.values()) {
    r.reservedQuantity = Number(r.reservedQuantity.toFixed(2));
  }
  return bySlug;
}

/** Quantité réservée pour un ingrédient (profil catalogue, clé = slug). */
export function reservedQuantityForProfile(
  profile: IngredientMatchProfile,
  reservationsBySlug: Map<string, IngredientReservation>,
  targetUnit: string | null,
  defaultUnit: string | null,
): number {
  const res = reservationsBySlug.get(profile.slug);
  if (!res) return 0;
  const converted = convertQuantity(
    res.reservedQuantity,
    res.unit,
    targetUnit,
    defaultUnit,
    defaultUnit,
  );
  return Number((converted ?? 0).toFixed(2));
}

/** Stock physique − réservations planifiées. */
export function availableFridgeQuantityForIngredient(
  profile: IngredientMatchProfile,
  fridgeItems: Array<{ name: string; quantity: number; unit: string | null }>,
  reservationsBySlug: Map<string, IngredientReservation>,
  targetUnit: string | null,
  defaultUnit: string | null,
): number {
  const physical = totalFridgeQuantityForIngredient(
    profile,
    fridgeItems,
    targetUnit,
    defaultUnit,
  );
  const reserved = reservedQuantityForProfile(
    profile,
    reservationsBySlug,
    targetUnit,
    defaultUnit,
  );
  return Number(Math.max(0, physical - reserved).toFixed(2));
}

type RecipeIngredientLine = {
  optional: boolean;
  quantity: { toString(): string } | number;
  unit: string | null;
  ingredient: { slug: string; nameFr: string; defaultUnit: string | null; aliases: string[] };
};

type RecipeForFridgeScore = {
  servings: number;
  ingredients: RecipeIngredientLine[];
};

/** Score 0–1 sans requête DB (frigo + réservations déjà chargés). */
export function scoreRecipeWithFridge(
  recipe: RecipeForFridgeScore,
  targetServings: number,
  fridgeItems: Array<{ name: string; quantity: number; unit: string | null }>,
  reservationsBySlug: Map<string, IngredientReservation>,
): number {
  const scale = targetServings / Math.max(1, recipe.servings);
  let matched = 0;
  let required = 0;

  for (const line of recipe.ingredients) {
    if (line.optional) continue;
    required += 1;
    const ing = line.ingredient;
    const profile = { slug: ing.slug, nameFr: ing.nameFr, aliases: ing.aliases };
    const reqUnit = line.unit ?? ing.defaultUnit;
    const requiredQty = Number((Number(line.quantity) * scale).toFixed(2));
    const available = availableFridgeQuantityForIngredient(
      profile,
      fridgeItems,
      reservationsBySlug,
      reqUnit,
      ing.defaultUnit,
    );
    if (available >= requiredQty) matched += 1;
  }

  return required > 0 ? Math.round((matched / required) * 100) / 100 : 1;
}

/** Réservations globales sans la contribution d’un repas (pour son propre score). */
export function reservationsWithoutEntry(
  all: Map<string, IngredientReservation>,
  entry: {
    id: string;
    servings: number | null;
    recipe: RecipeForFridgeScore;
  },
  defaultServings: number,
): Map<string, IngredientReservation> {
  const next = new Map<string, IngredientReservation>();
  for (const [slug, res] of all) {
    next.set(slug, {
      ...res,
      plannedMeals: res.plannedMeals.filter((m) => m.entryId !== entry.id),
    });
  }

  const portions = entry.servings ?? defaultServings;
  const scale = portions / Math.max(1, entry.recipe.servings);

  for (const line of entry.recipe.ingredients) {
    if (line.optional) continue;
    const ing = line.ingredient;
    const reqUnit = line.unit ?? ing.defaultUnit;
    const addQty = Number((Number(line.quantity) * scale).toFixed(2));
    const existing = next.get(ing.slug);
    if (!existing) continue;

    const converted =
      convertQuantity(addQty, reqUnit, existing.unit, ing.defaultUnit, ing.defaultUnit) ?? addQty;
    existing.reservedQuantity = Number(
      Math.max(0, existing.reservedQuantity - converted).toFixed(2),
    );
    if (existing.reservedQuantity <= 0.01) {
      next.delete(ing.slug);
    }
  }

  return next;
}

let ingredientCatalogCache: {
  at: number;
  data: Array<{ slug: string; nameFr: string; aliases: string[]; defaultUnit: string | null }>;
} | null = null;

const INGREDIENT_CATALOG_TTL_MS = 5 * 60 * 1000;

async function getIngredientCatalog(prisma: PrismaClient) {
  const now = Date.now();
  if (ingredientCatalogCache && now - ingredientCatalogCache.at < INGREDIENT_CATALOG_TTL_MS) {
    return ingredientCatalogCache.data;
  }
  const data = await prisma.ingredient.findMany({
    select: { slug: true, nameFr: true, aliases: true, defaultUnit: true },
  });
  ingredientCatalogCache = { at: now, data };
  return data;
}

function profileForFridgeName(
  name: string,
  catalog: Array<{ slug: string; nameFr: string; aliases: string[]; defaultUnit: string | null }>,
): IngredientMatchProfile | null {
  for (const ing of catalog) {
    const profile = { slug: ing.slug, nameFr: ing.nameFr, aliases: ing.aliases };
    if (fridgeItemMatchesProfile(name, profile)) return profile;
  }
  return null;
}

export async function getFridgeAvailability(
  prisma: PrismaClient,
  groupId: string,
): Promise<{
  items: FridgeItemAvailability[];
  reservations: IngredientReservation[];
}> {
  const [rawItems, reservationsBySlug, catalog] = await Promise.all([
    prisma.fridgeItem.findMany({
      where: { groupId },
      orderBy: [{ expiresAt: { sort: 'asc', nulls: 'last' } }, { name: 'asc' }],
    }),
    computeMealPlanReservations(prisma, groupId),
    getIngredientCatalog(prisma),
  ]);

  type Row = {
    id: string;
    name: string;
    quantity: number;
    unit: string | null;
    expiresAt: Date | null;
    addedAt: Date;
    profile: IngredientMatchProfile | null;
    defaultUnit: string | null;
  };

  const rows: Row[] = rawItems.map((item) => {
    const profile = profileForFridgeName(item.name, catalog);
    return {
      id: item.id,
      name: item.name,
      quantity: Number(item.quantity),
      unit: item.unit,
      expiresAt: item.expiresAt,
      addedAt: item.addedAt,
      profile,
      defaultUnit: profile
        ? (catalog.find((c) => c.slug === profile.slug)?.defaultUnit ?? item.unit)
        : item.unit,
    };
  });

  const reservedAllocated = new Map<string, number>();

  for (const slug of reservationsBySlug.keys()) {
    const res = reservationsBySlug.get(slug)!;
    const profile = { slug: res.slug, nameFr: res.nameFr, aliases: [] as string[] };
    const matching = rows.filter((r) => r.profile?.slug === slug);
    if (matching.length === 0) continue;

    const totalPhysical = totalFridgeQuantityForIngredient(
      profile,
      matching.map((r) => ({ name: r.name, quantity: r.quantity, unit: r.unit })),
      res.unit,
      matching[0]?.defaultUnit ?? null,
    );
    const totalReserved = res.reservedQuantity;
    let remainingReserve = totalReserved;

    for (let i = 0; i < matching.length; i += 1) {
      const row = matching[i]!;
      const linePhysical = totalFridgeQuantityForIngredient(
        profile,
        [{ name: row.name, quantity: row.quantity, unit: row.unit }],
        res.unit,
        row.defaultUnit,
      );
      const share =
        i === matching.length - 1
          ? remainingReserve
          : totalPhysical > 0
            ? Number(((linePhysical / totalPhysical) * totalReserved).toFixed(2))
            : 0;
      remainingReserve -= share;
      reservedAllocated.set(row.id, share);
    }
  }

  const items: FridgeItemAvailability[] = rows.map((row) => {
    const reservedOnLine = reservedAllocated.get(row.id) ?? 0;
    const reservedConverted = row.profile
      ? convertQuantity(reservedOnLine, reservationsBySlug.get(row.profile.slug)?.unit ?? row.unit, row.unit, row.defaultUnit, row.defaultUnit) ?? reservedOnLine
      : reservedOnLine;
    const reservedOnLineQty = Math.min(reservedConverted, row.quantity);
    return {
      id: row.id,
      name: row.name,
      quantity: row.quantity,
      unit: row.unit,
      expiresAt: row.expiresAt,
      addedAt: row.addedAt,
      reservedQuantity: Number(reservedOnLineQty.toFixed(2)),
      availableQuantity: Number(Math.max(0, row.quantity - reservedOnLineQty).toFixed(2)),
    };
  });

  return {
    items,
    reservations: [...reservationsBySlug.values()],
  };
}

/** Charge frigo + réservations pour le matching (une requête planning). */
export async function loadFridgeMatchingContext(
  prisma: PrismaClient,
  groupId: string,
  options?: { excludeEntryId?: string },
) {
  const [fridge, reservationsBySlug] = await Promise.all([
    prisma.fridgeItem.findMany({
      where: { groupId },
      select: { name: true, quantity: true, unit: true },
    }),
    computeMealPlanReservations(prisma, groupId, options),
  ]);
  const fridgeItems = fridge.map((f) => ({
    name: f.name,
    quantity: Number(f.quantity),
    unit: f.unit,
  }));
  return { fridgeItems, reservationsBySlug };
}

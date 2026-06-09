import type { PrismaClient } from '@prisma/client';
import { convertQuantity } from '@homeshared/shared';
import {
  type IngredientMatchProfile,
  fridgeItemMatchesProfile,
  totalFridgeQuantityForIngredient,
} from './ingredient-normalize.service.js';
import { parseWeekStartUtc, resolveGroupServings } from './meal-plan.service.js';

export interface IngredientDemandLine {
  slug: string;
  nameFr: string;
  quantity: number;
  unit: string | null;
  defaultUnit: string | null;
  recipeTitles: string[];
}

type CatalogRow = {
  slug: string;
  nameFr: string;
  aliases: string[];
  defaultUnit: string | null;
};

function profileFromCatalogName(name: string, catalog: CatalogRow[]): IngredientMatchProfile | null {
  for (const ing of catalog) {
    const profile = { slug: ing.slug, nameFr: ing.nameFr, aliases: ing.aliases };
    if (fridgeItemMatchesProfile(name, profile)) return profile;
  }
  return null;
}

/** Besoins cumulés des repas planifiés (non cuisinés) d'une semaine, fusionnés par slug. */
export async function aggregateWeekIngredientDemand(
  prisma: PrismaClient,
  groupId: string,
  weekStart: string,
): Promise<IngredientDemandLine[]> {
  const week = parseWeekStartUtc(weekStart);
  const weekSettings = await resolveGroupServings(prisma, groupId);

  const entries = await prisma.mealPlanEntry.findMany({
    where: { groupId, weekStart: week, cookedAt: null },
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
  });

  const bySlug = new Map<string, IngredientDemandLine>();

  for (const entry of entries) {
    const portions = entry.servings ?? weekSettings.effectiveServings;
    const scale = portions / Math.max(1, entry.recipe.servings);
    const title = entry.recipe.title;

    for (const line of entry.recipe.ingredients) {
      if (line.optional) continue;
      const ing = line.ingredient;
      const reqUnit = line.unit ?? ing.defaultUnit;
      const addQty = Number((Number(line.quantity) * scale).toFixed(2));

      const existing = bySlug.get(ing.slug) ?? {
        slug: ing.slug,
        nameFr: ing.nameFr,
        quantity: 0,
        unit: reqUnit,
        defaultUnit: ing.defaultUnit,
        recipeTitles: [],
      };

      const converted =
        convertQuantity(addQty, reqUnit, existing.unit, ing.defaultUnit, ing.defaultUnit) ?? addQty;
      existing.quantity = Number((existing.quantity + converted).toFixed(2));
      if (!existing.recipeTitles.includes(title)) {
        existing.recipeTitles.push(title);
      }
      bySlug.set(ing.slug, existing);
    }
  }

  return [...bySlug.values()];
}

/** Quantités déjà sur la liste de courses (articles non achetés), par slug catalogue. */
export async function pendingShoppingBySlug(
  prisma: PrismaClient,
  groupId: string,
  catalog: CatalogRow[],
): Promise<Map<string, { quantity: number; unit: string | null; itemId: string }>> {
  const pending = await prisma.shoppingItem.findMany({
    where: { groupId, purchasedAt: null },
    select: { id: true, name: true, quantity: true, unit: true },
  });

  const bySlug = new Map<string, { quantity: number; unit: string | null; itemId: string }>();

  for (const item of pending) {
    const profile = profileFromCatalogName(item.name, catalog);
    if (!profile) continue;

    const qty = Number(item.quantity);
    const existing = bySlug.get(profile.slug);
    if (!existing) {
      bySlug.set(profile.slug, {
        quantity: qty,
        unit: item.unit,
        itemId: item.id,
      });
      continue;
    }

    const defaultUnit =
      catalog.find((c) => c.slug === profile.slug)?.defaultUnit ?? existing.unit;
    const converted =
      convertQuantity(qty, item.unit, existing.unit, defaultUnit, defaultUnit) ?? qty;
    existing.quantity = Number((existing.quantity + converted).toFixed(2));
  }

  return bySlug;
}

export interface PurchaseGap {
  slug: string;
  nameFr: string;
  quantity: number;
  unit: string | null;
  recipeTitles: string[];
  existingItemId: string | null;
}

/** Ce qu'il reste à acheter après frigo + liste de courses en attente. */
export function computePurchaseGaps(
  demand: IngredientDemandLine[],
  fridgeItems: Array<{ name: string; quantity: number; unit: string | null }>,
  onShopping: Map<string, { quantity: number; unit: string | null; itemId: string }>,
): PurchaseGap[] {
  const gaps: PurchaseGap[] = [];

  for (const line of demand) {
    const profile = {
      slug: line.slug,
      nameFr: line.nameFr,
      aliases: [] as string[],
    };
    const physical = totalFridgeQuantityForIngredient(
      profile,
      fridgeItems,
      line.unit,
      line.defaultUnit,
    );
    const stillNeeded = Number(Math.max(0, line.quantity - physical).toFixed(2));
    if (stillNeeded <= 0.01) continue;

    const pending = onShopping.get(line.slug);
    let onList = 0;
    if (pending) {
      onList =
        convertQuantity(
          pending.quantity,
          pending.unit,
          line.unit,
          line.defaultUnit,
          line.defaultUnit,
        ) ?? pending.quantity;
    }

    const toAdd = Number(Math.max(0, stillNeeded - onList).toFixed(2));
    if (toAdd <= 0.01) continue;

    gaps.push({
      slug: line.slug,
      nameFr: line.nameFr,
      quantity: toAdd,
      unit: line.unit,
      recipeTitles: line.recipeTitles,
      existingItemId: pending?.itemId ?? null,
    });
  }

  return gaps;
}

function formatWeekShoppingNotes(recipeTitles: string[]): string {
  const list = recipeTitles.slice(0, 4).join(', ');
  const suffix = recipeTitles.length > 4 ? '…' : '';
  return `Semaine : ${list}${suffix}`;
}

/**
 * Ajoute à la liste de courses les ingrédients manquants pour la semaine (repas non cuisinés).
 * Fusionne les doublons, ignore ce qui est déjà au frigo ou déjà sur la liste.
 */
export async function addMealPlanWeekMissingToShopping(
  prisma: PrismaClient,
  userId: string,
  groupId: string,
  weekStart: string,
): Promise<{
  added: number;
  updated: number;
  skipped: number;
  items: Array<{ id: string; name: string }>;
}> {
  const demand = await aggregateWeekIngredientDemand(prisma, groupId, weekStart);
  if (demand.length === 0) {
    return { added: 0, updated: 0, skipped: 0, items: [] };
  }

  const catalog = await prisma.ingredient.findMany({
    select: { slug: true, nameFr: true, aliases: true, defaultUnit: true },
  });

  const [fridgeRows, onShopping] = await Promise.all([
    prisma.fridgeItem.findMany({
      where: { groupId },
      select: { name: true, quantity: true, unit: true },
    }),
    pendingShoppingBySlug(prisma, groupId, catalog),
  ]);

  const fridgeItems = fridgeRows.map((f) => ({
    name: f.name,
    quantity: Number(f.quantity),
    unit: f.unit,
  }));

  const gaps = computePurchaseGaps(demand, fridgeItems, onShopping);
  if (gaps.length === 0) {
    return { added: 0, updated: 0, skipped: demand.length, items: [] };
  }

  const items: Array<{ id: string; name: string }> = [];
  let added = 0;
  let updated = 0;

  await prisma.$transaction(async (tx) => {
    for (const gap of gaps) {
      const notes = formatWeekShoppingNotes(gap.recipeTitles);
      if (gap.existingItemId) {
        const existing = await tx.shoppingItem.findUnique({
          where: { id: gap.existingItemId },
        });
        if (existing) {
          const prev = Number(existing.quantity);
          const row = await tx.shoppingItem.update({
            where: { id: gap.existingItemId },
            data: {
              quantity: Number((prev + gap.quantity).toFixed(2)),
              notes: existing.notes ? `${existing.notes} · ${notes}` : notes,
            },
            select: { id: true, name: true },
          });
          items.push(row);
          updated += 1;
          continue;
        }
      }

      const row = await tx.shoppingItem.create({
        data: {
          groupId,
          name: gap.nameFr,
          quantity: gap.quantity,
          unit: gap.unit,
          notes,
          addedById: userId,
        },
        select: { id: true, name: true },
      });
      items.push(row);
      added += 1;
    }
  });

  const skipped = demand.length - gaps.length;
  return { added, updated, skipped, items };
}

import type { PrismaClient } from '@prisma/client';
import type { MatchRecipesInput } from '@homeshared/shared';
import {
  findFridgeStockForIngredient,
  normalizeIngredientKey,
} from './ingredient-normalize.service.js';
import {
  availableFridgeQuantityForIngredient,
  loadFridgeMatchingContext,
} from './fridge-availability.service.js';

export interface MatchedRecipe {
  recipeId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  cuisine?: string;
  /** Portions réalisables avec le frigo actuel (0 si ingrédient manquant). */
  maxFeasibleServings: number;
  matchedIngredients: number;
  missingIngredients: Array<{
    name: string;
    slug: string;
    quantity: number;
    availableQuantity: number;
    unit: string | null;
    optional: boolean;
    reason: 'missing' | 'insufficient';
  }>;
  score: number;
}

/**
 * Matching recettes ↔ frigo via le catalogue d'ingrédients (aliases + unités g/kg/ml…).
 */
export async function matchRecipesAgainstFridge(
  prisma: PrismaClient,
  input: MatchRecipesInput,
): Promise<MatchedRecipe[]> {
  const { fridgeItems: fridge, reservationsBySlug } = await loadFridgeMatchingContext(
    prisma,
    input.groupId,
  );

  const fridgeIndex = new Map<string, { quantity: number; unit: string | null }>();
  for (const item of fridge) {
    fridgeIndex.set(normalizeIngredientKey(item.name), {
      quantity: item.quantity,
      unit: item.unit,
    });
  }

  const recipes = await prisma.recipe.findMany({
    where: input.cuisine ? { cuisine: input.cuisine } : undefined,
    include: {
      ingredients: {
        include: { ingredient: true },
      },
    },
  });

  const matches: MatchedRecipe[] = [];

  for (const recipe of recipes) {
    const targetServings = input.targetServings ?? recipe.servings;
    const scale = targetServings / Math.max(1, recipe.servings);

    let matched = 0;
    const missing: MatchedRecipe['missingIngredients'] = [];
    let maxFeasibleServings = targetServings;

    for (const line of recipe.ingredients) {
      const ing = line.ingredient;
      const profile = { slug: ing.slug, nameFr: ing.nameFr, aliases: ing.aliases };
      const reqUnit = line.unit ?? ing.defaultUnit;
      const requiredQty = Number((Number(line.quantity) * scale).toFixed(2));

      const availableQty = availableFridgeQuantityForIngredient(
        profile,
        fridge,
        reservationsBySlug,
        reqUnit,
        ing.defaultUnit,
      );

      const hasStock = findFridgeStockForIngredient(profile, fridgeIndex) !== undefined;
      const hasEnough = availableQty >= requiredQty;

      if (hasEnough) {
        matched += 1;
        if (!line.optional && requiredQty > 0) {
          const perServing = Number(line.quantity) / Math.max(1, recipe.servings);
          const feasible = Math.floor(availableQty / perServing);
          maxFeasibleServings = Math.min(maxFeasibleServings, feasible);
        }
      } else if (!line.optional || input.includeOptionalMissing) {
        missing.push({
          name: ing.nameFr,
          slug: ing.slug,
          quantity: requiredQty,
          availableQuantity: hasStock ? availableQty : 0,
          unit: reqUnit,
          optional: line.optional,
          reason: hasStock ? 'insufficient' : 'missing',
        });
        if (!line.optional) maxFeasibleServings = 0;
      } else {
        matched += 1;
      }
    }

    const missingRequired = missing.filter((m) => !m.optional).length;
    if (missingRequired > input.missingMaxCount) continue;

    const totalLines = recipe.ingredients.length;
    const score = totalLines > 0 ? matched / totalLines : 0;

    matches.push({
      recipeId: recipe.id,
      title: recipe.title,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
      prepMinutes: recipe.prepMinutes,
      cookMinutes: recipe.cookMinutes,
      servings: targetServings,
      cuisine: recipe.cuisine,
      maxFeasibleServings,
      matchedIngredients: matched,
      missingIngredients: missing,
      score: Number(score.toFixed(2)),
    });
  }

  return matches.sort(
    (a, b) => b.score - a.score || a.missingIngredients.length - b.missingIngredients.length,
  );
}

function matchOneRecipe(
  recipe: {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    prepMinutes: number;
    cookMinutes: number;
    servings: number;
    cuisine: string | null;
    ingredients: Array<{
      optional: boolean;
      quantity: unknown;
      unit: string | null;
      ingredient: { slug: string; nameFr: string; aliases: string[]; defaultUnit: string | null };
    }>;
  },
  input: MatchRecipesInput,
  fridge: Array<{ name: string; quantity: number; unit: string | null }>,
  reservationsBySlug: Awaited<ReturnType<typeof loadFridgeMatchingContext>>['reservationsBySlug'],
  fridgeIndex: Map<string, { quantity: number; unit: string | null }>,
): MatchedRecipe | null {
  const targetServings = input.targetServings ?? recipe.servings;
  const scale = targetServings / Math.max(1, recipe.servings);

  let matched = 0;
  const missing: MatchedRecipe['missingIngredients'] = [];
  let maxFeasibleServings = targetServings;

  for (const line of recipe.ingredients) {
    const ing = line.ingredient;
    const profile = { slug: ing.slug, nameFr: ing.nameFr, aliases: ing.aliases };
    const reqUnit = line.unit ?? ing.defaultUnit;
    const requiredQty = Number((Number(line.quantity) * scale).toFixed(2));

    const availableQty = availableFridgeQuantityForIngredient(
      profile,
      fridge,
      reservationsBySlug,
      reqUnit,
      ing.defaultUnit,
    );

    const hasStock = findFridgeStockForIngredient(profile, fridgeIndex) !== undefined;
    const hasEnough = availableQty >= requiredQty;

    if (hasEnough) {
      matched += 1;
      if (!line.optional && requiredQty > 0) {
        const perServing = Number(line.quantity) / Math.max(1, recipe.servings);
        const feasible = Math.floor(availableQty / perServing);
        maxFeasibleServings = Math.min(maxFeasibleServings, feasible);
      }
    } else if (!line.optional || input.includeOptionalMissing) {
      missing.push({
        name: ing.nameFr,
        slug: ing.slug,
        quantity: requiredQty,
        availableQuantity: hasStock ? availableQty : 0,
        unit: reqUnit,
        optional: line.optional,
        reason: hasStock ? 'insufficient' : 'missing',
      });
      if (!line.optional) maxFeasibleServings = 0;
    } else {
      matched += 1;
    }
  }

  const missingRequired = missing.filter((m) => !m.optional).length;
  if (missingRequired > input.missingMaxCount) return null;

  const totalLines = recipe.ingredients.length;
  const score = totalLines > 0 ? matched / totalLines : 0;

  return {
    recipeId: recipe.id,
    title: recipe.title,
    description: recipe.description,
    imageUrl: recipe.imageUrl,
    prepMinutes: recipe.prepMinutes,
    cookMinutes: recipe.cookMinutes,
    servings: targetServings,
    cuisine: recipe.cuisine ?? undefined,
    maxFeasibleServings,
    matchedIngredients: matched,
    missingIngredients: missing,
    score: Number(score.toFixed(2)),
  };
}

/** Matching d'une seule recette (1 requête DB, pas tout le catalogue). */
export async function matchSingleRecipeAgainstFridge(
  prisma: PrismaClient,
  recipeId: string,
  groupId: string,
  targetServings?: number,
): Promise<MatchedRecipe | null> {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      ingredients: { include: { ingredient: true } },
    },
  });
  if (!recipe) return null;

  const { fridgeItems: fridge, reservationsBySlug } = await loadFridgeMatchingContext(
    prisma,
    groupId,
  );

  const fridgeIndex = new Map<string, { quantity: number; unit: string | null }>();
  for (const item of fridge) {
    fridgeIndex.set(normalizeIngredientKey(item.name), {
      quantity: item.quantity,
      unit: item.unit,
    });
  }

  return matchOneRecipe(
    recipe,
    {
      groupId,
      missingMaxCount: 50,
      includeOptionalMissing: false,
      targetServings,
    },
    fridge,
    reservationsBySlug,
    fridgeIndex,
  );
}

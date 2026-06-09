import type { PrismaClient } from '@prisma/client';
import { ApiError } from '@homeshared/shared';
import { fridgeItemMatchesProfile } from './ingredient-normalize.service.js';
import {
  computeMealPlanReservations,
  reservationsWithoutEntry,
  scoreRecipeWithFridge,
} from './fridge-availability.service.js';

/**
 * Déduit du frigo les ingrédients d'une recette planifiée (repas terminé).
 */
export async function consumeMealPlanEntryFromFridge(
  prisma: PrismaClient,
  entryId: string,
  userId: string,
  targetServings: number,
): Promise<{ consumed: number; partial: string[] }> {
  const entry = await prisma.mealPlanEntry.findUnique({
    where: { id: entryId },
    include: {
      recipe: {
        include: {
          ingredients: { include: { ingredient: true } },
        },
      },
    },
  });
  if (!entry) throw new ApiError('NOT_FOUND', 'Repas planifié introuvable.');
  if (entry.cookedAt) throw new ApiError('VALIDATION_ERROR', 'Ce repas est déjà marqué comme cuisiné.');

  const membership = await prisma.membership.findUnique({
    where: { groupId_userId: { groupId: entry.groupId, userId } },
  });
  if (!membership) throw new ApiError('FORBIDDEN', 'Tu n\'es pas membre de ce groupe.');

  const scale = targetServings / Math.max(1, entry.recipe.servings);
  const fridgeItems = await prisma.fridgeItem.findMany({ where: { groupId: entry.groupId } });
  const partial: string[] = [];
  let consumed = 0;

  for (const line of entry.recipe.ingredients) {
    if (line.optional) continue;
    const ing = line.ingredient;
    const profile = { slug: ing.slug, nameFr: ing.nameFr, aliases: ing.aliases };
    const reqUnit = line.unit ?? ing.defaultUnit;
    const requiredQty = Number((Number(line.quantity) * scale).toFixed(2));

    let remaining = requiredQty;
    const matching = fridgeItems.filter((f) => fridgeItemMatchesProfile(f.name, profile));

    for (const item of matching) {
      if (remaining <= 0) break;
      const available = Number(item.quantity);
      const deduct = Math.min(available, remaining);
      remaining -= deduct;
      const left = available - deduct;
      if (left <= 0.01) {
        await prisma.fridgeItem.delete({ where: { id: item.id } });
        const idx = fridgeItems.findIndex((f) => f.id === item.id);
        if (idx >= 0) fridgeItems.splice(idx, 1);
      } else {
        await prisma.fridgeItem.update({
          where: { id: item.id },
          data: { quantity: left },
        });
        item.quantity = left as unknown as typeof item.quantity;
      }
      consumed += 1;
    }

    if (remaining > 0.05) {
      partial.push(ing.nameFr);
    }
  }

  await prisma.mealPlanEntry.update({
    where: { id: entryId },
    data: { cookedAt: new Date() },
  });

  return { consumed, partial };
}

/** Score frigo 0–1 pour une recette à N portions. */
export async function fridgeScoreForRecipe(
  prisma: PrismaClient,
  groupId: string,
  recipeId: string,
  targetServings: number,
  options?: { excludeEntryId?: string },
): Promise<number> {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: { ingredients: { include: { ingredient: true } } },
  });
  if (!recipe) return 0;

  const [fridgeItems, reservationsBySlug] = await Promise.all([
    prisma.fridgeItem.findMany({ where: { groupId } }),
    computeMealPlanReservations(prisma, groupId, options),
  ]);
  const fridgeRows = fridgeItems.map((f) => ({
    name: f.name,
    quantity: Number(f.quantity),
    unit: f.unit,
  }));

  return scoreRecipeWithFridge(recipe, targetServings, fridgeRows, reservationsBySlug);
}

/** Scores frigo pour toute la semaine — 3 requêtes DB au lieu de N. */
export async function fridgeScoresForMealPlanEntries(
  prisma: PrismaClient,
  groupId: string,
  rows: Array<{
    id: string;
    recipeId: string;
    servings: number | null;
    cookedAt: Date | null;
  }>,
  defaultServings: number,
): Promise<Map<string, number>> {
  const scores = new Map<string, number>();
  const uncooked = rows.filter((r) => !r.cookedAt);
  for (const r of rows) {
    if (r.cookedAt) scores.set(r.id, 1);
  }
  if (uncooked.length === 0) return scores;

  const recipeIds = [...new Set(uncooked.map((r) => r.recipeId))];
  const [fridgeItems, allReservations, recipes] = await Promise.all([
    prisma.fridgeItem.findMany({ where: { groupId } }),
    computeMealPlanReservations(prisma, groupId),
    prisma.recipe.findMany({
      where: { id: { in: recipeIds } },
      include: { ingredients: { include: { ingredient: true } } },
    }),
  ]);

  const fridgeRows = fridgeItems.map((f) => ({
    name: f.name,
    quantity: Number(f.quantity),
    unit: f.unit,
  }));
  const recipeById = new Map(recipes.map((r) => [r.id, r]));

  for (const row of uncooked) {
    const recipe = recipeById.get(row.recipeId);
    if (!recipe) {
      scores.set(row.id, 0);
      continue;
    }
    const portions = row.servings ?? defaultServings;
    const adjusted = reservationsWithoutEntry(
      allReservations,
      { id: row.id, servings: row.servings, recipe },
      defaultServings,
    );
    scores.set(row.id, scoreRecipeWithFridge(recipe, portions, fridgeRows, adjusted));
  }

  return scores;
}

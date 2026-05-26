import type { PrismaClient } from '@prisma/client';
import type { MatchRecipesInput } from '@homeshared/shared';

export interface MatchedRecipe {
  recipeId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  matchedIngredients: number;
  missingIngredients: Array<{ name: string; quantity: number; unit: string | null; optional: boolean }>;
  /** Score de matching : 1.0 = parfait, 0.0 = rien dispo. */
  score: number;
}

/**
 * Algorithme de matching v1 : pour chaque recette du catalogue, on regarde si
 * les ingrédients requis sont présents dans le frigo du groupe (en quantité
 * suffisante, comparaison case-insensitive sur le nom).
 *
 * On garde les recettes qui ont au plus `missingMaxCount` ingrédients manquants
 * (les ingrédients optionnels manquants ne comptent que si `includeOptionalMissing`).
 *
 * Trade-off v1 : pas de normalisation des unités. "1 L de lait" ne matchera pas
 * "1000 ml de lait". Ce sera amélioré en v1.x via une brique d'unités.
 */
export async function matchRecipesAgainstFridge(
  prisma: PrismaClient,
  input: MatchRecipesInput,
): Promise<MatchedRecipe[]> {
  const fridge = await prisma.fridgeItem.findMany({
    where: { groupId: input.groupId },
    select: { name: true, quantity: true, unit: true },
  });

  const fridgeIndex = new Map<string, { quantity: number; unit: string | null }>();
  for (const item of fridge) {
    fridgeIndex.set(item.name.trim().toLowerCase(), {
      quantity: Number(item.quantity),
      unit: item.unit,
    });
  }

  const recipes = await prisma.recipe.findMany({ include: { ingredients: true } });

  const matches: MatchedRecipe[] = [];

  for (const recipe of recipes) {
    let matched = 0;
    const missing: MatchedRecipe['missingIngredients'] = [];

    for (const ing of recipe.ingredients) {
      const fridgeEntry = fridgeIndex.get(ing.name.trim().toLowerCase());
      const requiredQty = Number(ing.quantity);
      const hasEnough = fridgeEntry !== undefined && fridgeEntry.quantity >= requiredQty;
      if (hasEnough) {
        matched += 1;
      } else if (!ing.optional || input.includeOptionalMissing) {
        missing.push({
          name: ing.name,
          quantity: requiredQty,
          unit: ing.unit,
          optional: ing.optional,
        });
      } else {
        matched += 1; // optionnel et exclu : on le considère "OK"
      }
    }

    const requiredCount = recipe.ingredients.filter(
      (i) => !i.optional || input.includeOptionalMissing,
    ).length;
    const missingRequired = missing.length;

    if (missingRequired > input.missingMaxCount) continue;

    const score = requiredCount > 0 ? matched / recipe.ingredients.length : 0;

    matches.push({
      recipeId: recipe.id,
      title: recipe.title,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
      prepMinutes: recipe.prepMinutes,
      cookMinutes: recipe.cookMinutes,
      servings: recipe.servings,
      matchedIngredients: matched,
      missingIngredients: missing,
      score: Number(score.toFixed(2)),
    });
  }

  return matches.sort((a, b) => b.score - a.score || a.missingIngredients.length - b.missingIngredients.length);
}

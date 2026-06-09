import type { PrismaClient } from '@prisma/client';
import type { AddRecipeMissingToShoppingInput } from '@homeshared/shared';
import { ApiError } from '@homeshared/shared';
import { matchSingleRecipeAgainstFridge } from './recipe-matching.service.js';
import { pendingShoppingBySlug } from './meal-plan-shopping.service.js';
import { convertQuantity } from '@homeshared/shared';

/**
 * Ajoute à la liste de courses les ingrédients manquants pour une recette.
 */
export async function addRecipeMissingToShopping(
  prisma: PrismaClient,
  recipeId: string,
  userId: string,
  input: AddRecipeMissingToShoppingInput,
) {
  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe) throw new ApiError('NOT_FOUND', 'Recette introuvable.');

  const match = await matchSingleRecipeAgainstFridge(
    prisma,
    recipeId,
    input.groupId,
    input.targetServings ?? recipe.servings,
  );

  const catalog = await prisma.ingredient.findMany({
    select: { slug: true, nameFr: true, aliases: true, defaultUnit: true },
  });
  const onShopping = await pendingShoppingBySlug(prisma, input.groupId, catalog);

  const toAdd: Array<{
    slug: string;
    name: string;
    quantity: number;
    unit: string | null;
    existingItemId: string | null;
  }> = [];

  for (const ing of match?.missingIngredients.filter((m) => !m.optional) ?? []) {
    const shortfall = Number(
      Math.max(0, ing.quantity - (ing.availableQuantity ?? 0)).toFixed(2),
    );
    if (shortfall <= 0.01) continue;

    const pending = onShopping.get(ing.slug);
    let onList = 0;
    if (pending) {
      onList =
        convertQuantity(
          pending.quantity,
          pending.unit,
          ing.unit,
          ing.unit,
          ing.unit,
        ) ?? pending.quantity;
    }
    const delta = Number(Math.max(0, shortfall - onList).toFixed(2));
    if (delta <= 0.01) continue;

    toAdd.push({
      slug: ing.slug,
      name: ing.name,
      quantity: delta,
      unit: ing.unit,
      existingItemId: pending?.itemId ?? null,
    });
  }

  if (toAdd.length === 0) {
    return { added: 0, updated: 0, items: [] as Array<{ id: string; name: string }> };
  }

  const items: Array<{ id: string; name: string }> = [];
  let added = 0;
  let updated = 0;

  await prisma.$transaction(async (tx) => {
    for (const line of toAdd) {
      const notes = `Recette : ${recipe.title}`;
      if (line.existingItemId) {
        const existing = await tx.shoppingItem.findUnique({ where: { id: line.existingItemId } });
        if (existing) {
          const row = await tx.shoppingItem.update({
            where: { id: line.existingItemId },
            data: {
              quantity: Number((Number(existing.quantity) + line.quantity).toFixed(2)),
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
          groupId: input.groupId,
          name: line.name,
          quantity: line.quantity,
          unit: line.unit,
          notes,
          addedById: userId,
        },
        select: { id: true, name: true },
      });
      items.push(row);
      added += 1;
    }
  });

  return { added, updated, items };
}

import { PrismaClient } from '@prisma/client';
import { ALL_INGREDIENT_CATALOG } from './data/ingredient.catalog.js';
import { RECIPE_CATALOG } from './data/recipe.catalog.js';
import { inferRecipeCuisine } from './data/recipe-category.js';

const prisma = new PrismaClient();

/**
 * Seed idempotent : catalogue d'ingrédients + recettes liées.
 * En dev, on réinitialise recettes/lignes pour refléter le catalogue à jour.
 */
async function main() {
  const ingredientIdBySlug = new Map<string, string>();

  for (const entry of ALL_INGREDIENT_CATALOG) {
    const row = await prisma.ingredient.upsert({
      where: { slug: entry.slug },
      create: {
        slug: entry.slug,
        nameFr: entry.nameFr,
        nameEn: entry.nameEn ?? null,
        category: entry.category,
        defaultUnit: entry.defaultUnit,
        aliases: entry.aliases,
      },
      update: {
        nameFr: entry.nameFr,
        nameEn: entry.nameEn ?? null,
        category: entry.category,
        defaultUnit: entry.defaultUnit,
        aliases: entry.aliases,
      },
    });
    ingredientIdBySlug.set(entry.slug, row.id);
  }

  await prisma.recipeIngredient.deleteMany();
  await prisma.recipe.deleteMany();

  for (const recipe of RECIPE_CATALOG) {
    const lines = recipe.lines.map((line) => {
      const ingredientId = ingredientIdBySlug.get(line.ingredientSlug);
      if (!ingredientId) {
        throw new Error(`Ingrédient inconnu dans le catalogue recettes : ${line.ingredientSlug}`);
      }
      return {
        ingredientId,
        quantity: line.quantity,
        unit: line.unit ?? null,
        optional: line.optional ?? false,
        notes: line.notes ?? null,
      };
    });

    await prisma.recipe.create({
      data: {
        slug: recipe.slug,
        title: recipe.title,
        description: recipe.description,
        instructions: recipe.instructions,
        prepMinutes: recipe.prepMinutes,
        cookMinutes: recipe.cookMinutes,
        servings: recipe.servings,
        cuisine: inferRecipeCuisine(recipe.slug, recipe.title),
        ingredients: { create: lines },
      },
    });
  }

  console.log(
    `Seed OK : ${ALL_INGREDIENT_CATALOG.length} ingrédients, ${RECIPE_CATALOG.length} recettes.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

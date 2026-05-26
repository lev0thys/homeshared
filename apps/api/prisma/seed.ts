import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed du catalogue de recettes de démarrage.
 * Quantités exprimées dans une unité "logique" partagée par les FridgeItem.
 */
async function main() {
  const recipes = [
    {
      title: 'Pâtes au pesto',
      description: 'Un grand classique rapide.',
      instructions: '1. Faire cuire les pâtes 10 min.\n2. Mélanger avec le pesto.\n3. Servir avec du parmesan.',
      prepMinutes: 5,
      cookMinutes: 10,
      servings: 2,
      ingredients: [
        { name: 'pâtes', quantity: 200, unit: 'g', optional: false },
        { name: 'pesto', quantity: 4, unit: 'càs', optional: false },
        { name: 'parmesan', quantity: 30, unit: 'g', optional: true },
      ],
    },
    {
      title: 'Omelette nature',
      description: 'Simple et efficace.',
      instructions: '1. Battre les œufs avec sel et poivre.\n2. Cuire dans la poêle avec un peu de beurre.',
      prepMinutes: 3,
      cookMinutes: 5,
      servings: 1,
      ingredients: [
        { name: 'œuf', quantity: 3, unit: null, optional: false },
        { name: 'beurre', quantity: 10, unit: 'g', optional: false },
        { name: 'sel', quantity: 1, unit: 'pincée', optional: true },
      ],
    },
    {
      title: 'Salade tomate-mozza',
      description: 'Été, fraîcheur, simplicité.',
      instructions: '1. Couper tomates et mozza.\n2. Arroser d\'huile d\'olive, ajouter basilic.',
      prepMinutes: 5,
      cookMinutes: 0,
      servings: 2,
      ingredients: [
        { name: 'tomate', quantity: 2, unit: null, optional: false },
        { name: 'mozzarella', quantity: 125, unit: 'g', optional: false },
        { name: 'basilic', quantity: 5, unit: 'feuilles', optional: true },
        { name: 'huile d\'olive', quantity: 2, unit: 'càs', optional: false },
      ],
    },
  ];

  for (const r of recipes) {
    await prisma.recipe.create({
      data: { ...r, ingredients: { create: r.ingredients } },
    });
  }

  console.log(`Seed OK : ${recipes.length} recettes insérées.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

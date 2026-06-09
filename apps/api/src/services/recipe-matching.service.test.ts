import { describe, expect, it, vi } from 'vitest';
import { matchRecipesAgainstFridge } from './recipe-matching.service.js';

function mockPrisma(
  fridge: Array<{ name: string; quantity: number; unit: string | null }>,
  recipes: unknown[],
) {
  return {
    fridgeItem: {
      findMany: vi.fn().mockResolvedValue(fridge),
    },
    recipe: {
      findMany: vi.fn().mockResolvedValue(recipes),
    },
    mealPlanEntry: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    groupMealSettings: {
      upsert: vi.fn().mockResolvedValue({
        servingsFromMemberCount: true,
        adultEaters: 2,
        childEaters: 0,
      }),
    },
    membership: {
      count: vi.fn().mockResolvedValue(2),
    },
  } as never;
}

describe('matchRecipesAgainstFridge', () => {
  it('matche via alias ingrédient (œufs au frigo → recette œuf)', async () => {
    const prisma = mockPrisma([{ name: 'œufs', quantity: 6, unit: null }], [
      {
        id: 'r1',
        title: 'Omelette',
        description: null,
        imageUrl: null,
        prepMinutes: 3,
        cookMinutes: 5,
        servings: 1,
        ingredients: [
          {
            quantity: 3,
            unit: null,
            optional: false,
            ingredient: {
              slug: 'oeuf',
              nameFr: 'Œuf',
              aliases: ['oeufs', 'œufs'],
              defaultUnit: null,
            },
          },
        ],
      },
    ]);

    const results = await matchRecipesAgainstFridge(prisma, {
      groupId: 'g1',
      missingMaxCount: 2,
      includeOptionalMissing: false,
    });

    expect(results).toHaveLength(1);
    expect(results[0]?.score).toBe(1);
    expect(results[0]?.missingIngredients).toHaveLength(0);
  });

  it('signale les ingrédients manquants avec slug', async () => {
    const prisma = mockPrisma([{ name: 'pâtes', quantity: 200, unit: 'g' }], [
      {
        id: 'r2',
        title: 'Pâtes pesto',
        description: null,
        imageUrl: null,
        prepMinutes: 5,
        cookMinutes: 10,
        servings: 2,
        ingredients: [
          {
            quantity: 200,
            unit: 'g',
            optional: false,
            ingredient: { slug: 'pates', nameFr: 'Pâtes', aliases: ['pate'], defaultUnit: 'g' },
          },
          {
            quantity: 4,
            unit: 'càs',
            optional: false,
            ingredient: { slug: 'pesto', nameFr: 'Pesto', aliases: [], defaultUnit: 'càs' },
          },
        ],
      },
    ]);

    const results = await matchRecipesAgainstFridge(prisma, {
      groupId: 'g1',
      missingMaxCount: 2,
      includeOptionalMissing: false,
    });

    expect(results[0]?.missingIngredients[0]?.slug).toBe('pesto');
    expect(results[0]?.maxFeasibleServings).toBeDefined();
  });
});

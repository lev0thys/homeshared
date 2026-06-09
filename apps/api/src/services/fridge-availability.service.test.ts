import { describe, expect, it } from 'vitest';
import {
  availableFridgeQuantityForIngredient,
  reservationsWithoutEntry,
  reservedQuantityForProfile,
  scoreRecipeWithFridge,
  type IngredientReservation,
} from './fridge-availability.service.js';

describe('fridge-availability', () => {
  const tomatoRes = new Map<string, IngredientReservation>([
    [
      'tomate',
      {
        slug: 'tomate',
        nameFr: 'Tomate',
        reservedQuantity: 500,
        unit: 'g',
        plannedMeals: [{ entryId: 'e1', title: 'Salade', dayOfWeek: 2, mealSlot: 'LUNCH' }],
      },
    ],
  ]);

  it('soustrait les réservations du stock physique', () => {
    const profile = { slug: 'tomate', nameFr: 'Tomate', aliases: ['tomates'] };
    const fridge = [{ name: 'Tomates', quantity: 1000, unit: 'g' }];
    const available = availableFridgeQuantityForIngredient(
      profile,
      fridge,
      tomatoRes,
      'g',
      'g',
    );
    expect(available).toBe(500);
  });

  it('retourne 0 si tout est réservé', () => {
    const profile = { slug: 'tomate', nameFr: 'Tomate', aliases: [] };
    const fridge = [{ name: 'Tomate', quantity: 300, unit: 'g' }];
    const available = availableFridgeQuantityForIngredient(
      profile,
      fridge,
      tomatoRes,
      'g',
      'g',
    );
    expect(available).toBe(0);
  });

  it('réservation par slug uniquement', () => {
    const qty = reservedQuantityForProfile(
      { slug: 'tomate', nameFr: 'Tomate', aliases: [] },
      tomatoRes,
      'g',
      'g',
    );
    expect(qty).toBe(500);
    const other = reservedQuantityForProfile(
      { slug: 'oignon', nameFr: 'Oignon', aliases: [] },
      tomatoRes,
      'g',
      'g',
    );
    expect(other).toBe(0);
  });

  it('reservationsWithoutEntry libère le stock du repas scoré', () => {
    const profile = { slug: 'tomate', nameFr: 'Tomate', aliases: [] };
    const fridge = [{ name: 'Tomate', quantity: 600, unit: 'g' }];
    const without = reservationsWithoutEntry(
      tomatoRes,
      {
        id: 'e1',
        servings: 2,
        recipe: {
          servings: 2,
          ingredients: [
            {
              optional: false,
              quantity: 500,
              unit: 'g',
              ingredient: {
                slug: 'tomate',
                nameFr: 'Tomate',
                defaultUnit: 'g',
                aliases: [],
              },
            },
          ],
        },
      },
      2,
    );
    const available = availableFridgeQuantityForIngredient(
      profile,
      fridge,
      without,
      'g',
      'g',
    );
    expect(available).toBe(600);
  });

  it('scoreRecipeWithFridge compte les ingrédients couverts', () => {
    const score = scoreRecipeWithFridge(
      {
        servings: 2,
        ingredients: [
          {
            optional: false,
            quantity: 400,
            unit: 'g',
            ingredient: {
              slug: 'tomate',
              nameFr: 'Tomate',
              defaultUnit: 'g',
              aliases: [],
            },
          },
          {
            optional: false,
            quantity: 1,
            unit: 'pièce',
            ingredient: {
              slug: 'oignon',
              nameFr: 'Oignon',
              defaultUnit: 'pièce',
              aliases: [],
            },
          },
        ],
      },
      2,
      [{ name: 'Tomate', quantity: 1000, unit: 'g' }],
      new Map(),
    );
    expect(score).toBe(0.5);
  });
});

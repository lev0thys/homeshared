import { describe, expect, it } from 'vitest';
import {
  computePurchaseGaps,
  type IngredientDemandLine,
} from './meal-plan-shopping.service.js';

describe('computePurchaseGaps', () => {
  it('fusionne les besoins et ignore frigo + liste déjà couverts', () => {
    const demand: IngredientDemandLine[] = [
      {
        slug: 'pomme-de-terre',
        nameFr: 'Pomme de terre',
        quantity: 4,
        unit: 'kg',
        defaultUnit: 'kg',
        recipeTitles: ['Gratin', 'Purée'],
      },
    ];
    const fridge = [{ name: 'Pomme de terre', quantity: 3, unit: 'kg' }];
    const onShopping = new Map([
      ['pomme-de-terre', { quantity: 0.5, unit: 'kg', itemId: 'item-1' }],
    ]);

    const gaps = computePurchaseGaps(demand, fridge, onShopping);
    expect(gaps).toHaveLength(1);
    expect(gaps[0]?.quantity).toBe(0.5);
    expect(gaps[0]?.existingItemId).toBe('item-1');
  });

  it('ne propose rien si frigo et courses couvrent déjà', () => {
    const demand: IngredientDemandLine[] = [
      {
        slug: 'lait',
        nameFr: 'Lait',
        quantity: 1,
        unit: 'L',
        defaultUnit: 'L',
        recipeTitles: ['Crêpes'],
      },
    ];
    const gaps = computePurchaseGaps(
      demand,
      [{ name: 'Lait', quantity: 2, unit: 'L' }],
      new Map([['lait', { quantity: 1, unit: 'L', itemId: 'x' }]]),
    );
    expect(gaps).toHaveLength(0);
  });
});

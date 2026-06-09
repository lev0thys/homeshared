import { describe, expect, it } from 'vitest';
import {
  findFridgeStockForIngredient,
  ingredientMatchKeys,
  normalizeIngredientKey,
} from './ingredient-normalize.service.js';

describe('ingredient-normalize.service', () => {
  it('normalise accents et casse', () => {
    expect(normalizeIngredientKey('  Œufs  ')).toBe('oeufs');
    expect(normalizeIngredientKey('Crème fraîche')).toBe('creme fraiche');
  });

  it('matche un alias frigo', () => {
    const keys = ingredientMatchKeys({
      slug: 'oeuf',
      nameFr: 'Œuf',
      aliases: ['oeufs', 'œufs'],
    });
    expect(keys).toContain('oeufs');

    const fridge = new Map([['oeufs', { quantity: 6, unit: null }]]);
    const stock = findFridgeStockForIngredient(
      { slug: 'oeuf', nameFr: 'Œuf', aliases: ['oeufs'] },
      fridge,
    );
    expect(stock?.quantity).toBe(6);
  });
});

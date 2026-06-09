import { describe, expect, it } from 'vitest';
import {
  groupItemsByStoreAisle,
  ingredientCategoryToAisle,
  resolveShoppingAisle,
} from './shopping-aisles.js';

describe('resolveShoppingAisle', () => {
  it('mappe les catégories catalogue vers les rayons français', () => {
    expect(ingredientCategoryToAisle('VEGETABLE')).toBe('PRODUCE');
    expect(ingredientCategoryToAisle('MEAT')).toBe('MEAT');
    expect(ingredientCategoryToAisle('GRAIN')).toBe('DRY_GROCERY');
    expect(ingredientCategoryToAisle('OIL')).toBe('SAUCES_GROCERY');
  });

  it('range le basilic frais avec les fruits & légumes', () => {
    expect(ingredientCategoryToAisle('SPICE', 'basilic')).toBe('PRODUCE');
  });

  it('infère le rayon depuis le libellé libre', () => {
    expect(resolveShoppingAisle({ name: 'Bœuf haché 5%' })).toBe('MEAT');
    expect(resolveShoppingAisle({ name: 'Baguette tradition' })).toBe('BAKERY');
    expect(resolveShoppingAisle({ name: 'Huile olive vierge' })).toBe('SAUCES_GROCERY');
  });
});

describe('groupItemsByStoreAisle', () => {
  it('trie les rayons dans l’ordre de passage magasin', () => {
    const groups = groupItemsByStoreAisle([
      { name: 'Riz', aisle: 'DRY_GROCERY' },
      { name: 'Carotte', aisle: 'PRODUCE' },
      { name: 'Steak', aisle: 'MEAT' },
    ]);
    expect(groups.map((g) => g.aisleId)).toEqual(['PRODUCE', 'MEAT', 'DRY_GROCERY']);
  });
});

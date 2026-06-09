import { describe, expect, it } from 'vitest';
import { compareShoppingList, findStoreProductsForName } from '../prisma/data/store.catalog.js';

describe('store.catalog', () => {
  it('trouve des offres pour lait', () => {
    const hits = findStoreProductsForName('lait');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => h.store === 'leclerc')).toBe(true);
  });

  it('compare une liste et retourne la moins chère', () => {
    const result = compareShoppingList(['lait', 'poulet']);
    expect(result.lines.length).toBe(2);
    expect(['leclerc', 'auchan', 'carrefour']).toContain(result.cheapestStore);
  });
});

import { describe, expect, it } from 'vitest';
import { convertQuantity, compareQuantities } from '@homeshared/shared';

describe('units', () => {
  it('convertit kg vers g', () => {
    expect(convertQuantity(1, 'kg', 'g')).toBe(1000);
    expect(convertQuantity(100, 'g', 'kg')).toBe(0.1);
  });

  it('convertit gousse et pièce (ail)', () => {
    expect(convertQuantity(2, 'gousse', 'gousse')).toBe(2);
    expect(convertQuantity(1, 'pièce', 'gousse')).toBe(1);
  });

  it('refuse des familles incompatibles', () => {
    expect(convertQuantity(100, 'g', 'pièce')).toBeNull();
  });

  it('signale un manque de poulet pour la recette', () => {
    const check = compareQuantities(100, 'g', 200, 'g', 'g');
    expect(check.sufficient).toBe(false);
    expect(check.shortfall).toBe(100);
    expect(check.available).toBe(100);
  });
});

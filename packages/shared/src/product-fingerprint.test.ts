import { describe, expect, it } from 'vitest';
import { productFingerprint } from './product-fingerprint.js';

describe('productFingerprint', () => {
  it('normalise casse et espaces', () => {
    expect(productFingerprint('  Lait   demi-écrémé  ')).toBe('lait demi-ecreme');
  });

  it('est stable pour le même libellé', () => {
    const a = productFingerprint('Tomates cerises');
    const b = productFingerprint('tomates cerises');
    expect(a).toBe(b);
  });
});

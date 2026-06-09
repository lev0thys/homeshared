import { describe, expect, it } from 'vitest';
import { computeEffectiveServings, PORTION_CHILD_EQUIVALENT } from '@homeshared/shared';

describe('computeEffectiveServings', () => {
  it('2 adultes = 2 portions', () => {
    expect(computeEffectiveServings(2, 0)).toBe(2);
  });

  it('2 adultes + 2 enfants > 2 adultes seuls', () => {
    const withChildren = computeEffectiveServings(2, 2);
    expect(withChildren).toBeGreaterThan(2);
    expect(withChildren).toBe(2 + 2 * PORTION_CHILD_EQUIVALENT);
  });

  it('minimum 1 portion', () => {
    expect(computeEffectiveServings(0, 0)).toBe(1);
  });
});

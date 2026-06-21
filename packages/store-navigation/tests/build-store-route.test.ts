import { describe, expect, it } from 'vitest';
import { buildStoreRoute, computeRouteProgress } from '../src/index.js';
import type { StoreAisleId } from '@homeshared/shared';

describe('buildStoreRoute', () => {
  it('ordonne les rayons et trace une polyline', () => {
    const route = buildStoreRoute({
      items: [
        { id: '1', name: 'Lait', aisle: 'DAIRY', purchased: false },
        { id: '2', name: 'Pommes', aisle: 'PRODUCE', purchased: false },
        { id: '3', name: 'Riz', aisle: 'DRY_GROCERY', purchased: true },
      ],
    });

    expect(route.steps.map((s) => s.aisle)).toEqual(['PRODUCE', 'DAIRY']);
    expect(route.polyline.length).toBeGreaterThanOrEqual(3);
    expect(route.estimatedAisles).toBe(2);
  });

  it('calcule la progression', () => {
    const route = buildStoreRoute({
      items: [
        { id: 'a', name: 'A', aisle: 'PRODUCE' as StoreAisleId, purchased: false },
        { id: 'b', name: 'B', aisle: 'DAIRY' as StoreAisleId, purchased: false },
      ],
    });
    const p1 = computeRouteProgress(route, new Set(['a']));
    expect(p1.percent).toBe(50);
    expect(p1.remainingItems).toBe(1);
  });
});

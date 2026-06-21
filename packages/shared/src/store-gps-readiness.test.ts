import { describe, expect, it } from 'vitest';
import {
  getStoreMappingProgress,
  isStoreGpsNavigationReady,
  isStoreMappingPhase,
  STORE_GPS_MIN_BATCH_COUNT,
} from './store-gps-readiness.js';

describe('store-gps-readiness', () => {
  it('seuil GPS à 20 sessions validées', () => {
    expect(STORE_GPS_MIN_BATCH_COUNT).toBe(20);
    expect(isStoreMappingPhase(19)).toBe(true);
    expect(isStoreGpsNavigationReady(19)).toBe(false);
    expect(isStoreGpsNavigationReady(20)).toBe(true);
  });

  it('getStoreMappingProgress calcule la progression', () => {
    const p = getStoreMappingProgress(5);
    expect(p.current).toBe(5);
    expect(p.target).toBe(20);
    expect(p.remaining).toBe(15);
    expect(p.percent).toBe(25);
  });
});

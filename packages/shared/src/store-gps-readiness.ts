/** Sessions validées requises avant de proposer la navigation GPS guidée. */
export const STORE_GPS_MIN_BATCH_COUNT = 20;

export interface StoreMappingProgress {
  current: number;
  target: number;
  remaining: number;
  percent: number;
}

/** Phase 1 : enregistrement des parcours + cartographie communautaire. */
export function isStoreMappingPhase(batchCount: number): boolean {
  return batchCount < STORE_GPS_MIN_BATCH_COUNT;
}

/** Phase 2 : navigation GPS (itinéraire rayons) proposable. */
export function isStoreGpsNavigationReady(batchCount: number): boolean {
  return batchCount >= STORE_GPS_MIN_BATCH_COUNT;
}

/** @deprecated Alias — préférer isStoreGpsNavigationReady */
export function isStoreGpsReady(batchCount: number): boolean {
  return isStoreGpsNavigationReady(batchCount);
}

export function getStoreMappingProgress(batchCount: number): StoreMappingProgress {
  const current = Math.max(0, batchCount);
  const target = STORE_GPS_MIN_BATCH_COUNT;
  const remaining = Math.max(0, target - current);
  const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  return { current, target, remaining, percent };
}

export interface StoreGpsReadinessEntry {
  batchCount: number;
  gpsReady: boolean;
  mappingPhase: boolean;
}

export function toStoreGpsReadinessEntry(batchCount: number): StoreGpsReadinessEntry {
  return {
    batchCount,
    gpsReady: isStoreGpsNavigationReady(batchCount),
    mappingPhase: isStoreMappingPhase(batchCount),
  };
}

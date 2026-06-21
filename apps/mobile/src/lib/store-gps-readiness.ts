import { api } from '@/lib/api-client';
import type { StoreGpsReadinessEntry } from '@homeshared/shared';

export type StoreReadinessMap = Record<string, StoreGpsReadinessEntry>;

export async function fetchStoresGpsReadiness(storeOsmIds: string[]): Promise<StoreReadinessMap> {
  const unique = [...new Set(storeOsmIds.filter(Boolean))];
  if (unique.length === 0) return {};

  const qs = encodeURIComponent(unique.join(','));
  return api.get<StoreReadinessMap>(`/api/stores/contributions/readiness?storeOsmIds=${qs}`);
}

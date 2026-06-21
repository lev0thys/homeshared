import type { StoreLayoutProfileId } from '@homeshared/store-navigation';
import { getLocalCache, localCacheKeys, setLocalCache } from '@/lib/local-cache';
import { LOCAL_CACHE_LAYOUT_MS } from '@/lib/query-options';
import { DEFAULT_STORE_OSM_ID } from '@/hooks/store-mode/useStoreSession';

/** Fusionne détection OSM + override utilisateur mémorisé pour ce magasin. */
export async function resolveLayoutProfileForStore(
  storeOsmId: string,
  detected: StoreLayoutProfileId,
): Promise<StoreLayoutProfileId> {
  if (storeOsmId === DEFAULT_STORE_OSM_ID) return detected;
  const cached = await getLocalCache<StoreLayoutProfileId>(localCacheKeys.layoutProfile(storeOsmId));
  return cached?.value ?? detected;
}

export async function persistLayoutProfileForStore(
  storeOsmId: string,
  profile: StoreLayoutProfileId,
): Promise<void> {
  if (storeOsmId === DEFAULT_STORE_OSM_ID) return;
  await setLocalCache(localCacheKeys.layoutProfile(storeOsmId), profile, LOCAL_CACHE_LAYOUT_MS);
}

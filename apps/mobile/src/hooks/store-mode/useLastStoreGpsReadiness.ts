import { useQuery } from '@tanstack/react-query';
import { DEFAULT_STORE_OSM_ID, useStoreSession } from '@/hooks/store-mode/useStoreSession';
import { fetchStoresGpsReadiness } from '@/lib/store-gps-readiness';

/** Indique si le dernier magasin connu a assez de données pour proposer le GPS. */
export function useLastStoreGpsReadiness() {
  const { session, loaded } = useStoreSession();
  const hasLastStore = loaded && session.storeOsmId !== DEFAULT_STORE_OSM_ID;

  const query = useQuery({
    queryKey: ['store-gps-readiness', session.storeOsmId],
    queryFn: () => fetchStoresGpsReadiness([session.storeOsmId]),
    enabled: hasLastStore,
    staleTime: 5 * 60_000,
  });

  const entry = hasLastStore ? query.data?.[session.storeOsmId] : undefined;

  return {
    hasLastStore,
    isLoading: hasLastStore && query.isLoading,
    gpsReady: entry?.gpsReady === true,
    mappingPhase: entry?.mappingPhase !== false,
    batchCount: entry?.batchCount ?? 0,
  };
}

import { useCallback, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import type { StoreLayoutProfileId } from '@homeshared/store-navigation';
import { fetchNearbyStoresFromOverpass, type NearbyStorePoi } from '@/lib/overpass-stores';
import { requestForegroundLocation } from '@/lib/store-location';
import { persistLayoutProfileForStore, resolveLayoutProfileForStore } from '@/lib/resolve-store-layout';
import { fetchStoresGpsReadiness, type StoreReadinessMap } from '@/lib/store-gps-readiness';
import {
  DEFAULT_STORE_OSM_ID,
  useStoreSession,
  type BeginStoreSessionInput,
  type StoreSessionKind,
} from '@/hooks/store-mode/useStoreSession';
import type { StorePickerSelection } from '@/components/store-mode/StorePickerSheet';
import { useStoreModeStore, type ShoppingSnapshotItem } from '@/stores/store-mode.store';

const AUTO_PICK_CLOSE_M = 80;
const AUTO_PICK_LOOSE_M = 150;
const AUTO_PICK_GAP_M = 40;

interface UseStartStoreModeOptions {
  groupId: string;
  navigateOnStart?: boolean;
}

function filterGpsReadyStores(stores: NearbyStorePoi[], readiness: StoreReadinessMap): NearbyStorePoi[] {
  return stores.filter((poi) => readiness[poi.osmId]?.gpsReady === true);
}

export function useStartStoreMode({ groupId, navigateOnStart = true }: UseStartStoreModeOptions) {
  const { session, loaded, beginSession } = useStoreSession();
  const qc = useQueryClient();
  const enterStoreMode = useStoreModeStore((s) => s.enterStoreMode);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<NearbyStorePoi[]>([]);
  const [readinessByOsmId, setReadinessByOsmId] = useState<StoreReadinessMap>({});
  const [locationDenied, setLocationDenied] = useState(false);
  const [noGpsReadyStores, setNoGpsReadyStores] = useState(false);
  const [allowGeneric, setAllowGeneric] = useState(false);
  const [sessionKind, setSessionKind] = useState<StoreSessionKind>('mapping');
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lon: number } | null>(null);

  const navigateToStoreMode = useCallback(() => {
    if (!navigateOnStart) return;
    router.push(`/(app)/groups/${groupId}/store-mode` as never);
  }, [groupId, navigateOnStart]);

  const finalize = useCallback(
    async (input: BeginStoreSessionInput) => {
      const layoutProfile = await resolveLayoutProfileForStore(input.storeOsmId, input.layoutProfile);
      const list = qc.getQueryData<ShoppingSnapshotItem[]>(['shopping', groupId]);
      if (list?.length && navigateOnStart) {
        enterStoreMode(groupId, list);
        qc.setQueryData(['shopping', groupId], list);
      }
      await persistLayoutProfileForStore(input.storeOsmId, layoutProfile);
      beginSession({ ...input, layoutProfile, sessionKind: input.sessionKind ?? sessionKind });
      setPickerVisible(false);
      setAllowGeneric(false);
      navigateToStoreMode();
    },
    [beginSession, enterStoreMode, groupId, navigateOnStart, navigateToStoreMode, qc, sessionKind],
  );

  const tryAutoPick = useCallback(
    (nearby: NearbyStorePoi[], coords: { lat: number; lon: number }) => {
      if (nearby.length === 0) return false;
      const closest = nearby[0]!;
      const second = nearby[1];
      const clearlyClosest =
        closest.distanceMeters <= AUTO_PICK_CLOSE_M ||
        (closest.distanceMeters <= AUTO_PICK_LOOSE_M &&
          (!second || closest.distanceMeters + AUTO_PICK_GAP_M < second.distanceMeters));

      if (!clearlyClosest) return false;

      void finalize({
        storeOsmId: closest.osmId,
        storeName: closest.brand ? `${closest.brand} — ${closest.name}` : closest.name,
        layoutProfile: closest.suggestedLayout,
        entryLat: coords.lat,
        entryLng: coords.lon,
      });
      return true;
    },
    [finalize],
  );

  const openPickerFlow = useCallback(
    async (options: { kind: StoreSessionKind }) => {
      if (!loaded) return;
      setSessionKind(options.kind);
      setLoading(true);
      setLocationDenied(false);
      setStores([]);
      setReadinessByOsmId({});
      setNoGpsReadyStores(false);
      setAllowGeneric(options.kind === 'dev');
      setPickerVisible(true);

      if (options.kind === 'dev') {
        setLoading(false);
        return;
      }

      const gpsOnly = options.kind === 'navigation';

      try {
        const coords = await requestForegroundLocation();
        setPendingCoords(coords);
        const nearby = await fetchNearbyStoresFromOverpass(coords.lat, coords.lon);
        const osmIds = nearby.map((s) => s.osmId);
        if (session.storeOsmId !== DEFAULT_STORE_OSM_ID) {
          osmIds.push(session.storeOsmId);
        }
        const readiness = await fetchStoresGpsReadiness(osmIds);
        setReadinessByOsmId(readiness);

        const listed = gpsOnly ? filterGpsReadyStores(nearby, readiness) : nearby;
        setStores(listed);
        setNoGpsReadyStores(gpsOnly && nearby.length > 0 && listed.length === 0);

        if (tryAutoPick(listed, coords)) {
          setLoading(false);
          return;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : '';
        if (msg === 'LOCATION_DENIED') setLocationDenied(true);
        setStores([]);
      } finally {
        setLoading(false);
      }
    },
    [loaded, session.storeOsmId, tryAutoPick],
  );

  /** Phase cartographie : enregistre les parcours, sans navigation GPS guidée. */
  const startMapping = useCallback(() => openPickerFlow({ kind: 'mapping' }), [openPickerFlow]);

  /** Phase GPS : navigation guidée (magasins avec ≥ 20 sessions validées). */
  const start = useCallback(() => openPickerFlow({ kind: 'navigation' }), [openPickerFlow]);

  const startDevPreview = useCallback(() => openPickerFlow({ kind: 'dev' }), [openPickerFlow]);

  const confirmPicker = useCallback(
    (selection: StorePickerSelection) => {
      void finalize({
        storeOsmId: selection.storeOsmId,
        storeName: selection.storeName,
        layoutProfile: selection.layoutProfile,
        sessionKind,
        entryLat: pendingCoords?.lat,
        entryLng: pendingCoords?.lon,
      });
    },
    [finalize, pendingCoords, sessionKind],
  );

  const closePicker = useCallback(() => {
    setPickerVisible(false);
    setLoading(false);
    setAllowGeneric(false);
  }, []);

  const hasLastStore = session.storeOsmId !== DEFAULT_STORE_OSM_ID;
  const lastReady = hasLastStore && readinessByOsmId[session.storeOsmId]?.gpsReady === true;
  const showLastForKind =
    hasLastStore &&
    (sessionKind === 'mapping' || sessionKind === 'dev' || lastReady);

  return useMemo(
    () => ({
      start,
      startMapping,
      startDevPreview,
      pickerVisible,
      loading,
      stores,
      readinessByOsmId,
      noGpsReadyStores,
      allowGeneric,
      sessionKind,
      locationDenied,
      confirmPicker,
      closePicker,
      lastStoreOsmId: showLastForKind ? session.storeOsmId : undefined,
      lastStoreName: showLastForKind ? session.storeName : undefined,
      lastLayoutProfile: showLastForKind ? (session.layoutProfile as StoreLayoutProfileId) : undefined,
    }),
    [
      allowGeneric,
      closePicker,
      confirmPicker,
      loading,
      locationDenied,
      noGpsReadyStores,
      pickerVisible,
      readinessByOsmId,
      session.layoutProfile,
      session.storeName,
      session.storeOsmId,
      sessionKind,
      showLastForKind,
      start,
      startDevPreview,
      startMapping,
      stores,
    ],
  );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StoreLayoutProfileId } from '@homeshared/store-navigation';

const STORAGE_KEY = 'homeshared:store-session:v1';

/** Magasin inconnu — template générique jusqu'à sélection Overpass. */
export const DEFAULT_STORE_OSM_ID = '0';

export type StoreSessionKind = 'mapping' | 'navigation' | 'dev';

export interface StoreSession {
  storeOsmId: string;
  storeName?: string;
  layoutProfile: StoreLayoutProfileId;
  sessionStartedAt: string;
  sessionKind: StoreSessionKind;
  entryLat?: number;
  entryLng?: number;
}

const DEFAULT_SESSION: StoreSession = {
  storeOsmId: DEFAULT_STORE_OSM_ID,
  layoutProfile: 'HYPERMARKET_FR',
  sessionStartedAt: new Date().toISOString(),
  sessionKind: 'mapping',
};

export interface BeginStoreSessionInput {
  storeOsmId: string;
  storeName?: string;
  layoutProfile: StoreLayoutProfileId;
  sessionKind?: StoreSessionKind;
  entryLat?: number;
  entryLng?: number;
}

export function useStoreSession() {
  const [session, setSession] = useState<StoreSession>(DEFAULT_SESSION);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && !cancelled) {
          const parsed = JSON.parse(raw) as StoreSession;
          setSession({ ...DEFAULT_SESSION, ...parsed });
        }
      } catch {
        /* garde les défauts */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: StoreSession) => {
    setSession(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const beginSession = useCallback(
    (input: BeginStoreSessionInput) => {
      void persist({
        storeOsmId: input.storeOsmId,
        storeName: input.storeName,
        layoutProfile: input.layoutProfile,
        sessionKind: input.sessionKind ?? 'mapping',
        entryLat: input.entryLat,
        entryLng: input.entryLng,
        sessionStartedAt: new Date().toISOString(),
      });
    },
    [persist],
  );

  const setLayoutProfile = useCallback(
    (layoutProfile: StoreLayoutProfileId) => {
      void persist({ ...session, layoutProfile });
    },
    [persist, session],
  );

  const setStore = useCallback(
    (storeOsmId: string, storeName?: string) => {
      void persist({
        ...session,
        storeOsmId,
        storeName,
        sessionStartedAt: new Date().toISOString(),
      });
    },
    [persist, session],
  );

  const resetSessionClock = useCallback(() => {
    void persist({ ...session, sessionStartedAt: new Date().toISOString() });
  }, [persist, session]);

  return useMemo(
    () => ({
      session,
      loaded,
      beginSession,
      setLayoutProfile,
      setStore,
      resetSessionClock,
    }),
    [beginSession, loaded, resetSessionClock, session, setLayoutProfile, setStore],
  );
}

export async function markPioneerBannerSeen(storeOsmId: string) {
  await AsyncStorage.setItem(`homeshared:pioneer-seen:${storeOsmId}`, '1');
}

export async function hasSeenPioneerBanner(storeOsmId: string): Promise<boolean> {
  const v = await AsyncStorage.getItem(`homeshared:pioneer-seen:${storeOsmId}`);
  return v === '1';
}

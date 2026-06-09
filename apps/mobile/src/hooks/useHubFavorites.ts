import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  modules: '@homeshared/hub-fav-modules',
  groups: '@homeshared/hub-fav-groups',
  seasonProduce: '@homeshared/season-fav-produce',
  gardenTasks: '@homeshared/garden-fav-tasks',
} as const;

export type HubFavoriteKind = keyof typeof KEYS;

async function loadSet(key: string): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

async function saveSet(key: string, ids: Set<string>): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify([...ids]));
}

/** Favoris hub (modules perso ou espaces groupe), triés en tête des carrousels. */
export function useHubFavorites(kind: HubFavoriteKind) {
  const storageKey = KEYS[kind];
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadSet(storageKey).then((set) => {
      if (!cancelled) {
        setFavorites(set);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  const toggle = useCallback(
    async (id: string) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        void saveSet(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  const sortByFavorites = useCallback(
    <T extends { id: string }>(items: T[]): T[] => {
      const fav: T[] = [];
      const rest: T[] = [];
      for (const item of items) {
        if (favorites.has(item.id)) fav.push(item);
        else rest.push(item);
      }
      return [...fav, ...rest];
    },
    [favorites],
  );

  return { favorites, toggle, sortByFavorites, ready, isFavorite: (id: string) => favorites.has(id) };
}

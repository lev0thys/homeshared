import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CacheEnvelope, LocalCacheHit } from './types';

const PREFIX = 'lc:';

function storageKey(key: string) {
  return `${PREFIX}${key}`;
}

export async function getLocalCache<T>(key: string): Promise<LocalCacheHit<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(storageKey(key));
    if (!raw) return null;
    const env = JSON.parse(raw) as CacheEnvelope<T>;
    if (env.expiresAt <= Date.now()) {
      await AsyncStorage.removeItem(storageKey(key));
      return null;
    }
    return { value: env.value, savedAt: env.savedAt };
  } catch {
    return null;
  }
}

export async function setLocalCache<T>(key: string, value: T, ttlMs: number): Promise<void> {
  const now = Date.now();
  const envelope: CacheEnvelope<T> = {
    expiresAt: now + ttlMs,
    savedAt: now,
    value,
  };
  await AsyncStorage.setItem(storageKey(key), JSON.stringify(envelope));
}

export async function removeLocalCache(key: string): Promise<void> {
  await AsyncStorage.removeItem(storageKey(key));
}

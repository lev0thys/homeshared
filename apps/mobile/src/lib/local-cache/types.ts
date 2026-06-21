export interface CacheEnvelope<T> {
  expiresAt: number;
  savedAt: number;
  value: T;
}

export interface LocalCacheHit<T> {
  value: T;
  savedAt: number;
}

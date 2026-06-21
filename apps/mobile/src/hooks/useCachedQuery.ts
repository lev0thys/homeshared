import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLocalCache, setLocalCache } from '@/lib/local-cache';

interface UseCachedQueryOptions<T> {
  queryKey: readonly unknown[];
  cacheKey: string;
  ttlMs: number;
  queryFn: () => Promise<T>;
  enabled?: boolean;
}

/**
 * TanStack Query + cache AsyncStorage.
 * Si le cache est encore frais (savedAt + staleTime), pas de refetch au montage.
 */
export function useCachedQuery<T>({
  queryKey,
  cacheKey,
  ttlMs,
  queryFn,
  enabled = true,
}: UseCachedQueryOptions<T>) {
  const [hydrated, setHydrated] = useState(false);
  const [initialHit, setInitialHit] = useState<{ value: T; savedAt: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getLocalCache<T>(cacheKey).then((hit) => {
      if (cancelled) return;
      if (hit) setInitialHit(hit);
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [cacheKey]);

  return useQuery({
    queryKey,
    enabled: enabled && hydrated,
    staleTime: ttlMs,
    gcTime: ttlMs * 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: initialHit?.value,
    initialDataUpdatedAt: initialHit?.savedAt,
    queryFn: async () => {
      const data = await queryFn();
      await setLocalCache(cacheKey, data, ttlMs);
      return data;
    },
  });
}

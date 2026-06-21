import type { QueryClient, QueryKey } from '@tanstack/react-query';
import { DEFERRED_INVALIDATION_MS } from '@/lib/query-options';

const timers = new Map<string, ReturnType<typeof setTimeout>>();

function timerKey(queryKey: QueryKey) {
  return JSON.stringify(queryKey);
}

/** Regroupe les invalidations lourdes (fridge, recipes-match) après rafale de coches. */
export function scheduleDeferredInvalidation(
  qc: QueryClient,
  queryKey: QueryKey,
  delayMs = DEFERRED_INVALIDATION_MS,
) {
  const key = timerKey(queryKey);
  const prev = timers.get(key);
  if (prev) clearTimeout(prev);
  timers.set(
    key,
    setTimeout(() => {
      void qc.invalidateQueries({ queryKey });
      timers.delete(key);
    }, delayMs),
  );
}

export function scheduleDeferredShoppingSideEffects(qc: QueryClient, groupId: string) {
  scheduleDeferredInvalidation(qc, ['fridge', groupId]);
  scheduleDeferredInvalidation(qc, ['recipes-match', groupId]);
}

export function flushDeferredInvalidations() {
  for (const t of timers.values()) clearTimeout(t);
  timers.clear();
}

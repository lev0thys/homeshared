import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { shouldAutoCommitShoppingTrip } from '@homeshared/shared';
import { api } from '@/lib/api-client';
import {
  clearShoppingTripWatch,
  getShoppingTripWatch,
  markShoppingTripBackground,
} from '@/lib/shopping-trip-watch';
import { scheduleDeferredShoppingSideEffects } from '@/lib/debounced-query-invalidation';

async function tryAutoCommitCart(qc: ReturnType<typeof useQueryClient>): Promise<void> {
  const watch = await getShoppingTripWatch();
  if (!watch?.backgroundAt || watch.purchasedCount <= 0) return;

  const idleMs = Date.now() - new Date(watch.backgroundAt).getTime();
  if (!shouldAutoCommitShoppingTrip(watch.purchasedCount, watch.totalCount, idleMs)) return;

  const result = await api.post<{ committed: number }>(
    `/api/shopping/${watch.groupId}/commit-cart`,
    {},
  );

  if (result.committed > 0) {
    await clearShoppingTripWatch();
    void qc.invalidateQueries({ queryKey: ['shopping', watch.groupId] });
    scheduleDeferredShoppingSideEffects(qc, watch.groupId);
  }
}

/** Auto-commit du caddie après 10 min d'inactivité si ≥ 60 % coché. */
export function useShoppingTripAutoCommit() {
  const qc = useQueryClient();

  useEffect(() => {
    void tryAutoCommitCart(qc);

    function onChange(next: AppStateStatus) {
      if (next === 'background' || next === 'inactive') {
        void markShoppingTripBackground();
        return;
      }
      if (next === 'active') {
        void tryAutoCommitCart(qc);
      }
    }

    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [qc]);
}

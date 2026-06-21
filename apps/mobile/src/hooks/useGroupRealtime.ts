import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/env';
import { isStoreModeActiveForGroup } from '@/hooks/store-mode/useStoreModeQueryPolicy';

interface RealtimeTableConfig {
  table: string;
  invalidate: (groupId: string) => Array<{ queryKey: readonly unknown[] }>;
}

const GROUP_REALTIME_TABLES: RealtimeTableConfig[] = [
  {
    table: 'ShoppingItem',
    invalidate: (groupId) => [
      { queryKey: ['shopping', groupId] },
      { queryKey: ['recipes-match', groupId] },
    ],
  },
  {
    table: 'FridgeItem',
    invalidate: (groupId) => [
      { queryKey: ['fridge', groupId] },
      { queryKey: ['recipes-match', groupId] },
      { queryKey: ['meal-plan', groupId] },
    ],
  },
  {
    table: 'MealPlanEntry',
    invalidate: (groupId) => [
      { queryKey: ['meal-plan', groupId] },
      { queryKey: ['recipes-match', groupId] },
      { queryKey: ['fridge', groupId] },
    ],
  },
  {
    table: 'HouseholdTask',
    invalidate: (groupId) => [{ queryKey: ['tasks', groupId] }],
  },
  {
    table: 'GroupMessage',
    invalidate: (groupId) => [{ queryKey: ['chat', groupId] }],
  },
];

/**
 * Invalide les queries TanStack Query quand un autre membre modifie courses, frigo, planning, etc.
 * En mode magasin : pas d'invalidation (snapshot local, sync à la sortie).
 */
export function useGroupRealtime(groupId: string | undefined): void {
  const qc = useQueryClient();

  useEffect(() => {
    if (!groupId || !isSupabaseConfigured()) return;

    const channels: RealtimeChannel[] = [];

    for (const { table, invalidate } of GROUP_REALTIME_TABLES) {
      const channel = supabase
        .channel(`group-${groupId}-${table}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
            filter: `groupId=eq.${groupId}`,
          },
          () => {
            if (isStoreModeActiveForGroup(groupId)) return;
            for (const query of invalidate(groupId)) {
              void qc.invalidateQueries(query);
            }
          },
        )
        .subscribe();

      channels.push(channel);
    }

    return () => {
      for (const channel of channels) {
        void supabase.removeChannel(channel);
      }
    };
  }, [groupId, qc]);
}

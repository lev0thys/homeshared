import { useStoreModeStore } from '@/stores/store-mode.store';

/** True si le mode magasin est actif pour ce groupe (désactive refetch / invalidations lourdes). */
export function useIsStoreModeActive(groupId: string | undefined): boolean {
  return useStoreModeStore((s) => (groupId ? s.activeGroupId === groupId : false));
}

export function isStoreModeActiveForGroup(groupId: string): boolean {
  return useStoreModeStore.getState().isStoreModeActive(groupId);
}

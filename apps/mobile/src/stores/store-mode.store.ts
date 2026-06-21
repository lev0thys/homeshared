import { create } from 'zustand';
import type { StoreAisleId } from '@homeshared/shared';

/** Item courses figé au début du mode magasin (snapshot local). */
export interface ShoppingSnapshotItem {
  id: string;
  name: string;
  quantity: string;
  unit: string | null;
  purchasedAt: string | null;
  aisle: StoreAisleId;
}

interface StoreModeState {
  activeGroupId: string | null;
  snapshots: Record<string, ShoppingSnapshotItem[]>;
  enterStoreMode: (groupId: string, items: ShoppingSnapshotItem[]) => void;
  exitStoreMode: (groupId: string) => void;
  patchSnapshotPurchased: (
    groupId: string,
    itemId: string,
    purchased: boolean,
    purchasedAt: string | null,
  ) => void;
  isStoreModeActive: (groupId: string) => boolean;
}

export const useStoreModeStore = create<StoreModeState>((set, get) => ({
  activeGroupId: null,
  snapshots: {},

  enterStoreMode(groupId, items) {
    set({
      activeGroupId: groupId,
      snapshots: { ...get().snapshots, [groupId]: items },
    });
  },

  exitStoreMode(groupId) {
    const { snapshots, activeGroupId } = get();
    const next = { ...snapshots };
    delete next[groupId];
    set({
      snapshots: next,
      activeGroupId: activeGroupId === groupId ? null : activeGroupId,
    });
  },

  patchSnapshotPurchased(groupId, itemId, purchased, purchasedAt) {
    const snap = get().snapshots[groupId];
    if (!snap) return;
    set({
      snapshots: {
        ...get().snapshots,
        [groupId]: snap.map((item) =>
          item.id === itemId ? { ...item, purchasedAt: purchased ? purchasedAt : null } : item,
        ),
      },
    });
  },

  isStoreModeActive(groupId) {
    return get().activeGroupId === groupId;
  },
}));

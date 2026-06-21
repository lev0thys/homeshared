import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useStoreModeStore } from '@/stores/store-mode.store';
export interface ShoppingItemPurchasable {
  id: string;
  purchasedAt: string | null;
}

type ShoppingList = ShoppingItemPurchasable[];

function patchPurchased(
  items: ShoppingList | undefined,
  itemId: string,
  purchased: boolean,
  purchasedAt: string | null,
): ShoppingList | undefined {
  if (!items) return items;
  return items.map((item) =>
    item.id === itemId ? { ...item, purchasedAt: purchased ? purchasedAt : null } : item,
  );
}

interface UseOptimisticPurchaseOptions {
  groupId: string;
  /** En mode magasin : zéro invalidation jusqu'à la sortie. */
  storeMode?: boolean;
  onError?: (err: unknown) => void;
  purchaseFn: (itemId: string) => Promise<unknown>;
  unpurchaseFn: (itemId: string) => Promise<unknown>;
}

export function useOptimisticPurchase({
  groupId,
  storeMode = false,
  onError,
  purchaseFn,
  unpurchaseFn,
}: UseOptimisticPurchaseOptions) {
  const qc = useQueryClient();
  const queryKey = ['shopping', groupId] as const;
  const patchSnapshot = useStoreModeStore((s) => s.patchSnapshotPurchased);

  function applyOptimistic(itemId: string, purchased: boolean, purchasedAt: string | null) {
    qc.setQueryData(queryKey, (old: ShoppingList | undefined) =>
      patchPurchased(old, itemId, purchased, purchasedAt),
    );
    if (storeMode) {
      patchSnapshot(groupId, itemId, purchased, purchasedAt);
    }
  }

  const purchaseMutation = useMutation({
    mutationFn: purchaseFn,
    onMutate: async (itemId: string) => {
      await qc.cancelQueries({ queryKey });
      const prev = qc.getQueryData<ShoppingList>(queryKey);
      const now = new Date().toISOString();
      applyOptimistic(itemId, true, now);
      return { prev };
    },
    onError: (err, _itemId, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKey, ctx.prev);
      onError?.(err);
    },
  });

  const unpurchaseMutation = useMutation({
    mutationFn: unpurchaseFn,
    onMutate: async (itemId: string) => {
      await qc.cancelQueries({ queryKey });
      const prev = qc.getQueryData<ShoppingList>(queryKey);
      applyOptimistic(itemId, false, null);
      return { prev };
    },
    onError: (err, _itemId, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKey, ctx.prev);
      onError?.(err);
    },
  });

  function togglePurchased(item: ShoppingItemPurchasable) {
    if (item.purchasedAt) unpurchaseMutation.mutate(item.id);
    else purchaseMutation.mutate(item.id);
  }

  return {
    purchaseMutation,
    unpurchaseMutation,
    togglePurchased,
    isPending: purchaseMutation.isPending || unpurchaseMutation.isPending,
  };
}

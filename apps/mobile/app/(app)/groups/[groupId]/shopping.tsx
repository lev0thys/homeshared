import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  SectionList,
  Share,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { groupItemsByStoreAisle, type StoreAisleId } from '@homeshared/shared';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { LoadingCenter } from '@/components/LoadingCenter';
import { EmptyState } from '@/components/EmptyState';
import { IngredientSuggestInput } from '@/components/IngredientSuggestInput';
import { IngredientAvatar } from '@/components/IngredientAvatar';
import { UnitPicker } from '@/components/UnitPicker';
import { Input } from '@/components/Input';
import { ListProgressBar } from '@/components/ListProgressBar';
import { ChecklistToggle } from '@/components/ChecklistToggle';
import { ShoppingManagePanel } from '@/components/shopping/ShoppingManagePanel';
import { ShoppingAisleSectionHeader } from '@/components/shopping/ShoppingAisleSectionHeader';
import { api } from '@/lib/api-client';
import { useMutationError } from '@/hooks/useMutationError';
import { useGroupId } from '@/hooks/useGroupId';
import { useUserCapabilities } from '@/hooks/useUserCapabilities';
import { useSessionStore } from '@/stores/session.store';

interface ShoppingItemRow {
  id: string;
  name: string;
  quantity: string;
  unit: string | null;
  notes: string | null;
  purchasedAt: string | null;
  aisle: StoreAisleId;
  ingredientCategory: string | null;
  addedBy: { displayName: string };
}

interface ShoppingListSection {
  key: string;
  title: string;
  hint?: string;
  emoji?: string;
  itemCount: number;
  data: ShoppingItemRow[];
}

type StoreOffer = { store: string; label: string; priceEur: number; searchUrl: string };

export default function ShoppingListScreen() {
  const groupId = useGroupId();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('pièce');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingQtyId, setEditingQtyId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState('');
  const [expandedStoreId, setExpandedStoreId] = useState<string | null>(null);
  const [panelExpanded, setPanelExpanded] = useState(true);
  const [panelTouched, setPanelTouched] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const { error, capture, clearError } = useMutationError();
  const sessionUserId = useSessionStore((s) => s.user?.id);
  const { canManageShopping } = useUserCapabilities(groupId, sessionUserId);

  const {
    data: items,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<ShoppingItemRow[]>({
    queryKey: ['shopping', groupId],
    queryFn: (): Promise<ShoppingItemRow[]> =>
      api.get<ShoppingItemRow[]>(`/api/shopping/${groupId}`),
    enabled: !!groupId,
  });

  const addMutation = useMutation({
    mutationFn: () => {
      if (!groupId) throw new Error('Groupe introuvable.');
      const qty = Number.parseFloat(quantity.replace(',', '.'));
      return api.post('/api/shopping', {
        groupId,
        name: name.trim(),
        quantity: Number.isFinite(qty) && qty > 0 ? qty : 1,
        unit,
      });
    },
    onSuccess: () => {
      clearError();
      setName('');
      setQuantity('1');
      qc.invalidateQueries({ queryKey: ['shopping', groupId] });
    },
    onError: (err) => capture(err),
  });

  const purchaseMutation = useMutation({
    mutationFn: (itemId: string) => api.post(`/api/shopping/${itemId}/purchase`, {}),
    onSuccess: () => {
      clearError();
      qc.invalidateQueries({ queryKey: ['shopping', groupId] });
      qc.invalidateQueries({ queryKey: ['fridge', groupId] });
      qc.invalidateQueries({ queryKey: ['recipes-match', groupId] });
    },
    onError: (err) => capture(err),
  });

  const unpurchaseMutation = useMutation({
    mutationFn: (itemId: string) => api.post(`/api/shopping/${itemId}/unpurchase`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shopping', groupId] });
      qc.invalidateQueries({ queryKey: ['fridge', groupId] });
      qc.invalidateQueries({ queryKey: ['recipes-match', groupId] });
    },
    onError: (err) => capture(err),
  });

  const updateQtyMutation = useMutation({
    mutationFn: ({ itemId, quantity: q }: { itemId: string; quantity: number }) =>
      api.patch(`/api/shopping/${itemId}`, { quantity: q }),
    onSuccess: () => {
      setEditingQtyId(null);
      qc.invalidateQueries({ queryKey: ['shopping', groupId] });
    },
    onError: (err) => capture(err),
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) await api.delete(`/api/shopping/${id}`);
    },
    onSuccess: () => {
      setSelected(new Set());
      setSelectionMode(false);
      qc.invalidateQueries({ queryKey: ['shopping', groupId] });
    },
    onError: (err) => capture(err),
  });

  const purchaseAllMutation = useMutation({
    mutationFn: () => api.post(`/api/shopping/${groupId}/purchase-all`, {}),
    onSuccess: () => {
      clearError();
      qc.invalidateQueries({ queryKey: ['shopping', groupId] });
      qc.invalidateQueries({ queryKey: ['fridge', groupId] });
      qc.invalidateQueries({ queryKey: ['recipes-match', groupId] });
    },
    onError: (err) => capture(err),
  });

  const finalizeMutation = useMutation({
    mutationFn: (discardUnpurchased: boolean) =>
      api.post(`/api/shopping/${groupId}/finalize`, { discardUnpurchased }),
    onSuccess: () => {
      clearError();
      qc.invalidateQueries({ queryKey: ['shopping', groupId] });
    },
    onError: (err) => capture(err),
  });

  function exportList() {
    const groups = groupItemsByStoreAisle<ShoppingItemRow>(pendingItems);
    const lines: string[] = [];
    for (const group of groups) {
      lines.push(`${group.emoji} ${t(`shopping.aisles.${group.aisleId}.title`)}`);
      lines.push(t(`shopping.aisles.${group.aisleId}.hint`));
      for (const item of group.items) {
        const qty = `${Number(item.quantity)}${item.unit ? ` ${item.unit}` : ''}`;
        const note = item.notes ? ` — ${item.notes}` : '';
        lines.push(`• ${qty} ${item.name}${note}`);
      }
      lines.push('');
    }
    void Share.share({ message: lines.join('\n').trim() || t('shopping.empty') });
  }

  function confirmFinalize() {
    if (pendingItems.length > 0) {
      Alert.alert(t('shopping.finalizeTitle'), t('shopping.finalizePending'), [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('shopping.finalizeDiscardRest'),
          style: 'destructive',
          onPress: () => finalizeMutation.mutate(true),
        },
      ]);
      return;
    }
    finalizeMutation.mutate(false);
  }

  const expandedItem = items?.find((i: ShoppingItemRow) => i.id === expandedStoreId);
  const { data: storeOffers, isFetching: storeOffersLoading } = useQuery({
    queryKey: ['store-suggest-item', expandedStoreId, expandedItem?.name],
    queryFn: () =>
      api.get<StoreOffer[]>(
        `/api/stores/suggest?q=${encodeURIComponent(expandedItem!.name)}`,
      ),
    enabled: !!expandedStoreId && !!expandedItem?.name,
  });

  const allItems = items ?? [];
  const pendingItems = allItems.filter((i: ShoppingItemRow) => !i.purchasedAt);
  const doneItems = allItems.filter((i: ShoppingItemRow) => i.purchasedAt);

  useEffect(() => {
    setPanelTouched(false);
    setPanelExpanded(true);
    setCollapsedSections(new Set());
  }, [groupId]);

  useEffect(() => {
    if (isLoading) return;
    if (allItems.length === 0) {
      setPanelExpanded(true);
      return;
    }
    if (selectionMode) {
      setPanelExpanded(true);
      return;
    }
    if (!panelTouched) {
      setPanelExpanded(false);
    }
  }, [isLoading, allItems.length, selectionMode, panelTouched]);

  function toggleManagePanel() {
    setPanelTouched(true);
    setPanelExpanded((open) => !open);
  }

  function toggleAisleSection(sectionKey: string) {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) next.delete(sectionKey);
      else next.add(sectionKey);
      return next;
    });
  }

  const sections = useMemo((): ShoppingListSection[] => {
    const result: ShoppingListSection[] = [];

    if (pendingItems.length > 0) {
      for (const group of groupItemsByStoreAisle<ShoppingItemRow>(pendingItems)) {
        const key = group.aisleId;
        result.push({
          key,
          title: t(`shopping.aisles.${group.aisleId}.title`),
          hint: t(`shopping.aisles.${group.aisleId}.hint`),
          emoji: group.emoji,
          itemCount: group.items.length,
          data: collapsedSections.has(key) ? [] : group.items,
        });
      }
    }

    if (doneItems.length > 0) {
      const key = 'DONE';
      result.push({
        key,
        title: t('shopping.sectionDone'),
        itemCount: doneItems.length,
        data: collapsedSections.has(key) ? [] : doneItems,
      });
    }

    return result;
  }, [pendingItems, doneItems, collapsedSections, t]);

  const allSectionsCollapsed =
    sections.length > 0 && sections.every((s) => collapsedSections.has(s.key));
  const stickySectionHeadersEnabled =
    Platform.OS !== 'web' && collapsedSections.size === 0 && !allSectionsCollapsed;

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function renderSectionHeader(section: ShoppingListSection) {
    const collapsed = collapsedSections.has(section.key);
    return (
      <ShoppingAisleSectionHeader
        title={section.title}
        hint={section.hint}
        emoji={section.emoji}
        itemCount={section.itemCount}
        collapsed={collapsed}
        compact={collapsed || !stickySectionHeadersEnabled}
        onToggle={() => toggleAisleSection(section.key)}
      />
    );
  }

  function saveQuantity(itemId: string) {
    const q = Number.parseFloat(editQty.replace(',', '.'));
    if (!Number.isFinite(q) || q <= 0) return;
    updateQtyMutation.mutate({ itemId, quantity: q });
  }

  function togglePurchased(item: ShoppingItemRow) {
    if (item.purchasedAt) unpurchaseMutation.mutate(item.id);
    else purchaseMutation.mutate(item.id);
  }

  const managePanelContent = (
    <View className="gap-3">
      {allItems.length > 0 ? (
        <ListProgressBar done={doneItems.length} total={allItems.length} />
      ) : null}

      {pendingItems.length > 0 ? (
        <Text className="text-xs text-ink-500 text-center px-1">{t('shopping.aisleOrderHint')}</Text>
      ) : null}

      {canManageShopping ? (
      <View className="bg-white rounded-2xl border border-ink-100 p-3 gap-2">
        <Text className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
          {t('shopping.addItem')}
        </Text>
        <View className="flex-row gap-2">
          <View className="flex-1">
            <IngredientSuggestInput
              placeholder={t('shopping.itemName')}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View className="w-20">
            <Input
              placeholder={t('shopping.quantity')}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="decimal-pad"
            />
          </View>
        </View>
        <UnitPicker value={unit} onChange={setUnit} />
        <Button
          onPress={() => addMutation.mutate(undefined)}
          disabled={!name.trim()}
          loading={addMutation.isPending}
        >
          + {t('shopping.addItem')}
        </Button>
      </View>
      ) : null}

      {selectionMode ? (
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Button variant="secondary" onPress={() => { setSelectionMode(false); setSelected(new Set()); }}>
              {t('common.cancel')}
            </Button>
          </View>
          <View className="flex-1">
            <Button
              variant="ghost"
              onPress={() => selected.size > 0 && deleteMutation.mutate([...selected])}
              disabled={selected.size === 0 || deleteMutation.isPending}
            >
              {t('shopping.deleteSelected', { count: selected.size })}
            </Button>
          </View>
        </View>
      ) : (
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Button variant="secondary" onPress={() => setSelectionMode(true)}>
              {t('shopping.selectMode')}
            </Button>
          </View>
          {pendingItems.length > 0 ? (
            <View className="flex-1">
              <Button
                variant="secondary"
                onPress={() =>
                  router.push({
                    pathname: '/(app)/tools/stores' as never,
                    params: { prefill: pendingItems.map((i: ShoppingItemRow) => i.name).join('\n') },
                  })
                }
              >
                {t('shopping.comparePrices')}
              </Button>
            </View>
          ) : null}
        </View>
      )}

      {doneItems.length > 0 && !selectionMode ? (
        <View className="gap-2">
          <Button
            onPress={confirmFinalize}
            loading={finalizeMutation.isPending}
          >
            {t('shopping.finalizeCheckout')}
          </Button>
          <Text className="text-xs text-ink-500 text-center">{t('shopping.finalizeHint')}</Text>
        </View>
      ) : null}

      {pendingItems.length > 0 && !selectionMode ? (
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Button
              variant="secondary"
              onPress={() => purchaseAllMutation.mutate(undefined)}
              loading={purchaseAllMutation.isPending}
            >
              {t('shopping.purchaseAll')}
            </Button>
          </View>
          <View className="flex-1">
            <Button variant="ghost" onPress={exportList}>
              {t('shopping.exportList')}
            </Button>
          </View>
        </View>
      ) : null}

      {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
    </View>
  );

  const managePanel = (
    <View className="z-20 bg-ink-50 border-b border-ink-200 pb-2">
      <ShoppingManagePanel
      expanded={panelExpanded}
      onToggle={toggleManagePanel}
      done={doneItems.length}
      total={allItems.length}
      pendingCount={pendingItems.length}
    >
      {managePanelContent}
    </ShoppingManagePanel>
    </View>
  );

  if (!groupId) {
    return (
      <Screen>
        <EmptyState message={t('groups.notFound')} icon="🔍" />
      </Screen>
    );
  }

  return (
    <Screen keyboard safeBottom={false}>
      {isLoading ? (
        <LoadingCenter />
      ) : (
        <View className="flex-1">
          {managePanel}
          {allItems.length === 0 ? (
            <EmptyState
              icon="🛒"
              title={t('shopping.emptyTitle')}
              message={t('shopping.empty')}
            />
          ) : allSectionsCollapsed ? (
            <ScrollView
              className="flex-1 bg-ink-50"
              refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
              }
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {sections.map((section) => (
                <View key={section.key}>{renderSectionHeader(section)}</View>
              ))}
            </ScrollView>
          ) : (
            <View className="flex-1 overflow-hidden bg-ink-50">
            <SectionList
              sections={sections}
              keyExtractor={(item) => item.id}
              stickySectionHeadersEnabled={stickySectionHeadersEnabled}
              style={{ flex: 1 }}
              refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
              }
              renderSectionHeader={({ section }) => renderSectionHeader(section)}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => {
            const isPurchased = !!item.purchasedAt;
            const isSelected = selected.has(item.id);
            const isEditing = editingQtyId === item.id;

            return (
              <Pressable
                onLongPress={() => {
                  setSelectionMode(true);
                  setSelected(new Set([item.id]));
                }}
                delayLongPress={400}
                className={`bg-white rounded-2xl px-2 py-2 border ${
                  isSelected
                    ? 'border-primary-400 bg-primary-50'
                    : isPurchased
                      ? 'border-emerald-100 bg-emerald-50/50'
                      : 'border-ink-100'
                }`}
              >
                <View className="flex-row items-center">
                  {selectionMode ? (
                    <ChecklistToggle
                      selection
                      selected={isSelected}
                      checked={false}
                      onPress={() => toggleSelect(item.id)}
                      accessibilityLabel={item.name}
                    />
                  ) : (
                    <ChecklistToggle
                      checked={isPurchased}
                      onPress={() => togglePurchased(item)}
                      accessibilityLabel={
                        isPurchased ? t('shopping.uncheck') : t('shopping.markPurchased')
                      }
                    />
                  )}

                  {!selectionMode ? (
                    <IngredientAvatar
                      name={item.name}
                      category={item.ingredientCategory}
                      size="sm"
                    />
                  ) : null}

                  <View className="flex-1 ml-1">
                    <Text
                      className={`text-base font-semibold ${
                        isPurchased ? 'text-ink-400 line-through' : 'text-ink-900'
                      }`}
                    >
                      {item.name}
                    </Text>
                    {item.notes && !isPurchased ? (
                      <Text className="text-[11px] text-amber-800 mt-0.5 leading-4" numberOfLines={2}>
                        {item.notes}
                      </Text>
                    ) : null}
                    {!isPurchased && !selectionMode ? (
                      <Pressable
                        onPress={() =>
                          setExpandedStoreId(expandedStoreId === item.id ? null : item.id)
                        }
                        className="py-1"
                      >
                        <Text className="text-xs text-primary-600">{t('shopping.viewInStore')}</Text>
                      </Pressable>
                    ) : (
                      <Text className="text-xs text-ink-400 mt-0.5">
                        {t('shopping.addedBy', { name: item.addedBy.displayName })}
                      </Text>
                    )}
                  </View>

                  <Pressable
                    onPress={() => {
                      if (selectionMode) {
                        toggleSelect(item.id);
                        return;
                      }
                      if (isEditing) saveQuantity(item.id);
                      else {
                        setEditingQtyId(item.id);
                        setEditQty(String(Number(item.quantity)));
                      }
                    }}
                    className="min-w-[56px] min-h-[44px] items-end justify-center px-2"
                  >
                    {isEditing ? (
                      <View className="flex-row items-center gap-1">
                        <Input
                          value={editQty}
                          onChangeText={setEditQty}
                          keyboardType="decimal-pad"
                          className="w-14 text-center py-1"
                        />
                        <Text className="text-primary-700 text-sm font-bold">OK</Text>
                      </View>
                    ) : (
                      <View className="bg-ink-100 rounded-lg px-2 py-1">
                        <Text className="font-bold text-ink-800 text-sm">
                          {Number(item.quantity)} {item.unit ?? ''}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                </View>

                {expandedStoreId === item.id ? (
                  <View className="mt-2 ml-14 pt-2 border-t border-ink-100 gap-1">
                    {storeOffersLoading ? (
                      <Text className="text-xs text-ink-400">{t('common.loading')}</Text>
                    ) : (storeOffers ?? []).length === 0 ? (
                      <Text className="text-xs text-ink-400">{t('stores.noOffers')}</Text>
                    ) : (
                      (storeOffers ?? []).slice(0, 3).map((offer: StoreOffer) => (
                        <Pressable
                          key={`${offer.store}-${offer.label}`}
                          onPress={() => Linking.openURL(offer.searchUrl)}
                          className="flex-row justify-between items-center min-h-[44px] px-1"
                        >
                          <View className="flex-1 mr-2">
                            <Text className="text-xs font-semibold text-ink-800 capitalize">
                              {offer.store}
                            </Text>
                            <Text className="text-xs text-ink-500" numberOfLines={1}>
                              {offer.label}
                            </Text>
                          </View>
                          <Text className="text-sm font-bold text-primary-700">
                            {offer.priceEur.toFixed(2)} €
                          </Text>
                        </Pressable>
                      ))
                    )}
                  </View>
                ) : null}
              </Pressable>
            );
          }}
          contentContainerStyle={{ paddingBottom: 24 }}
            />
            </View>
          )}
        </View>
      )}
    </Screen>
  );
}

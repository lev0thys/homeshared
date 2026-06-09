import { useEffect, useMemo, useState } from 'react';

import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';

import { router } from 'expo-router';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useTranslation } from 'react-i18next';

import { Screen } from '@/components/Screen';

import { Input } from '@/components/Input';

import { Button } from '@/components/Button';

import { LoadingCenter } from '@/components/LoadingCenter';

import { EmptyState } from '@/components/EmptyState';

import { IngredientSuggestInput } from '@/components/IngredientSuggestInput';

import { IngredientAvatar } from '@/components/IngredientAvatar';

import { UnitPicker } from '@/components/UnitPicker';

import { CollapsibleManagePanel } from '@/components/shopping/ShoppingManagePanel';

import { api } from '@/lib/api-client';

import { useMutationError } from '@/hooks/useMutationError';

import { useGroupId } from '@/hooks/useGroupId';

import { expiryUrgency, sortFridgeByExpiry } from '@/lib/fridge-expiry';



interface FridgeItemRow {

  id: string;

  name: string;

  quantity: string;

  reservedQuantity?: string;

  availableQuantity?: string;

  unit: string | null;

  expiresAt: string | null;

}



interface FridgeListResponse {

  items: FridgeItemRow[];

  reservations: Array<{

    slug: string;

    nameFr: string;

    reservedQuantity: number;

    unit: string | null;

    plannedMeals: Array<{ entryId: string; title: string; dayOfWeek: number; mealSlot: string }>;

  }>;

}



export default function FridgeScreen() {

  const groupId = useGroupId();

  const { t } = useTranslation();

  const qc = useQueryClient();

  const [name, setName] = useState('');

  const [quantity, setQuantity] = useState('1');

  const [unit, setUnit] = useState('g');

  const [selectionMode, setSelectionMode] = useState(false);

  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [editingId, setEditingId] = useState<string | null>(null);

  const [editQty, setEditQty] = useState('');

  const [editUnit, setEditUnit] = useState('g');

  const [panelExpanded, setPanelExpanded] = useState(true);

  const [panelTouched, setPanelTouched] = useState(false);

  const { error, capture, clearError } = useMutationError();



  const {

    data: fridgeData,

    isLoading,

    refetch,

    isRefetching,

  } = useQuery<FridgeListResponse>({

    queryKey: ['fridge', groupId],

    queryFn: (): Promise<FridgeListResponse> => api.get<FridgeListResponse>(`/api/fridge/${groupId}`),

    enabled: !!groupId,

  });



  const sortedItems = useMemo(

    () => sortFridgeByExpiry<FridgeItemRow>(fridgeData?.items ?? []),

    [fridgeData?.items],

  );

  const reservations = fridgeData?.reservations ?? [];



  useEffect(() => {

    setPanelTouched(false);

    setPanelExpanded(true);

  }, [groupId]);



  useEffect(() => {

    if (isLoading) return;

    if (sortedItems.length === 0) {

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

  }, [isLoading, sortedItems.length, selectionMode, panelTouched]);



  function toggleManagePanel() {

    setPanelTouched(true);

    setPanelExpanded((open) => !open);

  }



  const addMutation = useMutation({

    mutationFn: () => {

      if (!groupId) throw new Error('Groupe introuvable.');

      const qty = Number.parseFloat(quantity.replace(',', '.'));

      return api.post('/api/fridge', {

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

      qc.invalidateQueries({ queryKey: ['fridge', groupId] });

      qc.invalidateQueries({ queryKey: ['recipes-match', groupId] });

      qc.invalidateQueries({ queryKey: ['meal-plan', groupId] });

    },

    onError: (err) => capture(err),

  });



  const updateMutation = useMutation({

    mutationFn: ({ itemId, quantity: q, unit: u }: { itemId: string; quantity: number; unit: string }) =>

      api.patch(`/api/fridge/${itemId}`, { quantity: q, unit: u }),

    onSuccess: () => {

      setEditingId(null);

      qc.invalidateQueries({ queryKey: ['fridge', groupId] });

      qc.invalidateQueries({ queryKey: ['recipes-match', groupId] });

      qc.invalidateQueries({ queryKey: ['meal-plan', groupId] });

    },

    onError: (err) => capture(err),

  });



  const deleteMutation = useMutation({

    mutationFn: async (ids: string[]) => {

      for (const id of ids) {

        await api.delete(`/api/fridge/${id}`);

      }

    },

    onSuccess: () => {

      setEditingId(null);

      setSelected(new Set());

      setSelectionMode(false);

      qc.invalidateQueries({ queryKey: ['fridge', groupId] });

      qc.invalidateQueries({ queryKey: ['recipes-match', groupId] });

      qc.invalidateQueries({ queryKey: ['meal-plan', groupId] });

    },

    onError: (err) => capture(err),

  });



  function toggleSelect(id: string) {

    setSelected((prev) => {

      const next = new Set(prev);

      if (next.has(id)) next.delete(id);

      else next.add(id);

      return next;

    });

  }



  function startEdit(item: FridgeItemRow) {

    setEditingId(item.id);

    setEditQty(String(Number(item.quantity)));

    setEditUnit(item.unit ?? 'pièce');

  }



  function saveEdit(itemId: string) {

    const q = Number.parseFloat(editQty.replace(',', '.'));

    if (!Number.isFinite(q) || q <= 0) return;

    updateMutation.mutate({ itemId, quantity: q, unit: editUnit });

  }



  const panelSummary =

    reservations.length > 0

      ? t('fridge.panelSummaryWithReservations', { count: sortedItems.length })

      : t('fridge.panelSummary', { count: sortedItems.length });



  const managePanelContent = (

    <View className="gap-3">

      <View className="flex-row gap-2">

        <View className="flex-1">

          <IngredientSuggestInput

            placeholder={t('fridge.itemName')}

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

        {t('fridge.addItem')}

      </Button>



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

        <Button variant="secondary" onPress={() => setSelectionMode(true)}>

          {t('shopping.selectMode')}

        </Button>

      )}



      {error ? <Text className="text-sm text-red-600">{error}</Text> : null}

      <Text className="text-xs text-ink-400">{t('fridge.editHint')}</Text>

      {reservations.length > 0 ? (
        <Pressable
          onPress={() =>
            router.push(`/(app)/groups/${groupId}/recipes/meal-plan` as never)
          }
          className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 active:bg-amber-100 min-h-[44px] justify-center"
          accessibilityRole="button"
          accessibilityLabel={`${t('fridge.reservedOneLine')} ${t('fridge.goToMealPlan')}`}
        >
          <Text className="text-xs leading-4" numberOfLines={2}>
            <Text className="text-amber-900">{t('fridge.reservedOneLine')}</Text>
            <Text className="text-primary-700 font-semibold"> {t('fridge.goToMealPlan')} →</Text>
          </Text>
        </Pressable>
      ) : null}

    </View>

  );



  if (!groupId) {

    return (

      <Screen>

        <EmptyState message={t('groups.notFound')} />

      </Screen>

    );

  }



  return (

    <Screen keyboard safeBottom={false}>

      <View className="flex-1">

        <View className="z-20 bg-ink-50 border-b border-ink-200 pb-2">

          <CollapsibleManagePanel

            expanded={panelExpanded}

            onToggle={toggleManagePanel}

            expandLabel={t('fridge.expandPanel')}

            collapseLabel={t('fridge.collapsePanel')}

            collapsedSummary={sortedItems.length > 0 ? panelSummary : undefined}

            showProgressBar={false}

          >

            {managePanelContent}

          </CollapsibleManagePanel>

        </View>



        {isLoading ? (

          <LoadingCenter />

        ) : (

          <FlatList

            data={sortedItems}

            keyExtractor={(i) => i.id}

            style={{ flex: 1 }}

            refreshControl={

              <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />

            }

            ItemSeparatorComponent={() => <View className="h-2" />}

            ListEmptyComponent={<EmptyState message={t('fridge.empty')} />}

            renderItem={({ item }) => {

              const urgency = expiryUrgency(item.expiresAt);

              const isEditing = editingId === item.id;

              const isSelected = selected.has(item.id);

              const reserved = Number(item.reservedQuantity ?? 0);

              const available = Number(item.availableQuantity ?? item.quantity);



              return (

                <Pressable

                  onLongPress={() => {

                    setSelectionMode(true);

                    setSelected(new Set([item.id]));

                  }}

                  delayLongPress={400}

                  className={`bg-white rounded-2xl px-4 py-3 border ${

                    isSelected ? 'border-primary-400 bg-primary-50' : 'border-ink-100'

                  }`}

                >

                  {isEditing ? (

                    <View className="gap-2">

                      <Text className="font-medium text-ink-900 capitalize">{item.name}</Text>

                      <View className="flex-row gap-2 items-center">

                        <View className="w-24">

                          <Input value={editQty} onChangeText={setEditQty} keyboardType="decimal-pad" />

                        </View>

                        <Text className="text-ink-500 text-sm">{t('shopping.unit')}</Text>

                      </View>

                      <UnitPicker value={editUnit} onChange={setEditUnit} />

                      <View className="flex-row gap-2 mt-1">

                        <View className="flex-1">

                          <Button variant="secondary" onPress={() => setEditingId(null)}>

                            {t('common.cancel')}

                          </Button>

                        </View>

                        <View className="flex-1">

                          <Button onPress={() => saveEdit(item.id)} loading={updateMutation.isPending}>

                            {t('common.save')}

                          </Button>

                        </View>

                      </View>

                      <Button

                        variant="ghost"

                        onPress={() => deleteMutation.mutate([item.id])}

                        loading={deleteMutation.isPending}

                      >

                        {t('common.delete')}

                      </Button>

                    </View>

                  ) : (

                    <View className="flex-row items-center gap-2">

                      {selectionMode ? (

                        <Pressable

                          onPress={() => toggleSelect(item.id)}

                          className={`w-6 h-6 rounded-md border-2 items-center justify-center ${

                            isSelected ? 'bg-primary-600 border-primary-600' : 'border-ink-300'

                          }`}

                        >

                          {isSelected ? <Text className="text-white text-xs">✓</Text> : null}

                        </Pressable>

                      ) : (

                        <IngredientAvatar name={item.name} size="sm" />

                      )}

                      <Pressable

                        className="flex-1"

                        onPress={() => {

                          if (selectionMode) toggleSelect(item.id);

                          else startEdit(item);

                        }}

                      >

                        <Text className="text-base font-medium text-ink-900 capitalize">{item.name}</Text>

                        <Text className="text-xs text-ink-400 mt-1">{t('shopping.tapToEditQty')}</Text>

                      </Pressable>

                      <Pressable

                        onPress={() => {

                          if (selectionMode) toggleSelect(item.id);

                          else startEdit(item);

                        }}

                      >

                        <View className="items-end">

                          <Text className="font-semibold text-ink-700">

                            {Number(item.quantity)} {item.unit ?? 'pièce'}

                          </Text>

                          {reserved > 0 ? (

                            <Text className="text-xs text-amber-700 mt-0.5">

                              {t('fridge.reservedQty', { qty: reserved, unit: item.unit ?? 'pièce' })}

                            </Text>

                          ) : null}

                          {reserved > 0 && available < Number(item.quantity) ? (

                            <Text className="text-xs text-ink-500">

                              {t('fridge.availableQty', { qty: available, unit: item.unit ?? 'pièce' })}

                            </Text>

                          ) : null}

                        </View>

                      </Pressable>

                    </View>

                  )}

                  {!isEditing && item.expiresAt ? (

                    <Text

                      className={`text-xs mt-1 ${

                        urgency === 'urgent'

                          ? 'text-red-600 font-semibold'

                          : urgency === 'soon'

                            ? 'text-amber-700 font-medium'

                            : 'text-ink-500'

                      }`}

                    >

                      {urgency === 'urgent'

                        ? t('fridge.expiresUrgent', {

                            date: new Date(item.expiresAt).toLocaleDateString('fr-FR'),

                          })

                        : urgency === 'soon'

                          ? t('fridge.expiresSoon', {

                              date: new Date(item.expiresAt).toLocaleDateString('fr-FR'),

                            })

                          : t('fridge.expiresOn', {

                              date: new Date(item.expiresAt).toLocaleDateString('fr-FR'),

                            })}

                    </Text>

                  ) : null}

                </Pressable>

              );

            }}

            contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }}

          />

        )}

      </View>

    </Screen>

  );

}



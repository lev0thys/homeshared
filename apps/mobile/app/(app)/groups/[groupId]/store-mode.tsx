import { useCallback, useEffect, useMemo, useState } from 'react';

import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { router, Stack } from 'expo-router';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useTranslation } from 'react-i18next';

import {

  buildStoreRoute,

  computeRouteProgress,

  getLayoutProfileMeta,

  getStoreLayout,

  STORE_LAYOUT_PROFILE_LABELS,

  type RouteItem,
  type StoreLayoutProfileId,
} from '@homeshared/store-navigation';

import { getStoreAisleDefinition, getStoreMappingProgress, STORE_GPS_MIN_BATCH_COUNT, type StoreAisleId } from '@homeshared/shared';

import { Screen } from '@/components/Screen';

import { Button } from '@/components/Button';

import { LoadingCenter } from '@/components/LoadingCenter';

import { EmptyState } from '@/components/EmptyState';

import { ChecklistToggle } from '@/components/ChecklistToggle';

import { ListProgressBar } from '@/components/ListProgressBar';

import { StoreMap2D } from '@/components/store-mode/StoreMap2D';
import { buildItemPinsForAisle } from '@/components/store-mode/store-item-pins';

import { StorePickerSheet } from '@/components/store-mode/StorePickerSheet';

import { StoreSessionBanner } from '@/components/store-mode/StoreSessionBanner';
import { StoreModeSplitLayout } from '@/components/store-mode/StoreModeSplitLayout';
import { StoreUnknownHintSheet } from '@/components/store-mode/StoreUnknownHintSheet';

import { api } from '@/lib/api-client';

import { productFingerprint } from '@/lib/product-fingerprint';

import { useGroupId } from '@/hooks/useGroupId';

import { useOptimisticPurchase } from '@/hooks/useOptimisticPurchase';

import { useMutationError } from '@/hooks/useMutationError';

import { DEFAULT_STORE_OSM_ID, useStoreSession } from '@/hooks/store-mode/useStoreSession';
import { persistLayoutProfileForStore } from '@/lib/resolve-store-layout';

import { useStartStoreMode } from '@/hooks/store-mode/useStartStoreMode';

import { usePdrSession } from '@/hooks/store-mode/usePdrSession';

import { useContributionDraft } from '@/hooks/store-mode/useContributionDraft';

import { useCachedQuery } from '@/hooks/useCachedQuery';

import { localCacheKeys } from '@/lib/local-cache';

import { LOCAL_CACHE_CONTRIBUTIONS_MS, shoppingQueryOptions } from '@/lib/query-options';

import { useStoreModeStore } from '@/stores/store-mode.store';
import { updateShoppingTripProgress, clearShoppingTripWatch } from '@/lib/shopping-trip-watch';



interface ShoppingItemRow {

  id: string;

  name: string;

  quantity: string;

  unit: string | null;

  purchasedAt: string | null;

  aisle: StoreAisleId;

}



interface StoreContributionsResponse {

  stats: { batchCount: number; pioneer: boolean };

  placements: Array<{

    productFingerprint: string;

    aisle: string;

    schematicX: number;

    schematicY: number;

    voteWeight: number;

  }>;

  outOfStock: unknown[];

}



export default function StoreModeScreen() {

  const groupId = useGroupId();

  const { t } = useTranslation();

  const qc = useQueryClient();

  const { error, capture, clearError } = useMutationError();

  const [submitting, setSubmitting] = useState(false);

  const { session, loaded: sessionLoaded, setLayoutProfile } = useStoreSession();

  const [unknownHintVisible, setUnknownHintVisible] = useState(false);

  const storePicker = useStartStoreMode({ groupId: groupId ?? '', navigateOnStart: false });

  const draft = useContributionDraft();

  const snapshotItems = useStoreModeStore((s) => (groupId ? s.snapshots[groupId] : undefined));

  const exitStoreModeSnapshot = useStoreModeStore((s) => s.exitStoreMode);



  const { data: networkItems, isLoading: networkLoading } = useQuery<ShoppingItemRow[]>({

    queryKey: ['shopping', groupId],

    queryFn: () => api.get<ShoppingItemRow[]>(`/api/shopping/${groupId}`),

    enabled: !!groupId && !snapshotItems,

    ...shoppingQueryOptions,

  });



  const items = snapshotItems ?? networkItems;

  const isLoading = !snapshotItems && networkLoading;



  const { data: contributions } = useCachedQuery<StoreContributionsResponse>({

    queryKey: ['store-contributions', session.storeOsmId],

    cacheKey: localCacheKeys.contributions(session.storeOsmId),

    ttlMs: LOCAL_CACHE_CONTRIBUTIONS_MS,

    enabled: sessionLoaded,

    queryFn: () =>

      api.get<StoreContributionsResponse>(

        `/api/stores/contributions?storeOsmId=${encodeURIComponent(session.storeOsmId)}`,

      ),

  });



  const { togglePurchased } = useOptimisticPurchase({

    groupId: groupId ?? '',

    storeMode: true,

    onError: capture,

    purchaseFn: (itemId) => api.post(`/api/shopping/${itemId}/purchase`, {}),

    unpurchaseFn: (itemId) => api.post(`/api/shopping/${itemId}/unpurchase`, {}),

  });



  const pending = useMemo(

    () => (items ?? []).filter((i: ShoppingItemRow) => !i.purchasedAt),

    [items],

  );

  useEffect(() => {
    if (!groupId) return;
    const all = items ?? [];
    if (all.length === 0) return;
    const done = all.filter((i: ShoppingItemRow) => i.purchasedAt).length;
    void updateShoppingTripProgress(groupId, done, all.length);
  }, [groupId, items]);



  const route = useMemo(

    () =>

      buildStoreRoute({

        profile: session.layoutProfile,

        items: (items ?? []).map((i: ShoppingItemRow) => ({

          id: i.id,

          name: i.name,

          aisle: i.aisle,

          purchased: !!i.purchasedAt,

          quantity: i.quantity,

          unit: i.unit,

        })),

      }),

    [items, session.layoutProfile],

  );



  const purchasedIds = useMemo(

    () =>

      new Set<string>(

        (items ?? []).filter((i: ShoppingItemRow) => i.purchasedAt).map((i: ShoppingItemRow) => i.id),

      ),

    [items],

  );



  const progress = useMemo(

    () => computeRouteProgress(route, purchasedIds),

    [route, purchasedIds],

  );



  const currentStep = route.steps[progress.currentStepIndex];

  const layout = getStoreLayout(session.layoutProfile);

  const layoutMeta = getLayoutProfileMeta(session.layoutProfile);

  const itemPins = useMemo(
    () =>
      currentStep
        ? buildItemPinsForAisle(layout, currentStep.aisle, currentStep.items)
        : [],
    [currentStep, layout],
  );

  const communityPins = useMemo(

    () =>

      (contributions?.placements ?? []).map((p: { schematicX: number; schematicY: number }) => ({

        x: p.schematicX,

        y: p.schematicY,

      })),

    [contributions?.placements],

  );

  const entryPosition = useMemo(() => ({ x: layout.entry.x, y: layout.entry.y }), [layout.entry]);

  const isStoreUnknown =
    session.storeOsmId === DEFAULT_STORE_OSM_ID || contributions?.stats.pioneer === true;

  const isNavigationSession =
    session.sessionKind === 'navigation' || session.sessionKind === 'dev';

  const mappingProgress = getStoreMappingProgress(contributions?.stats.batchCount ?? 0);

  const handleLayoutChange = useCallback(
    (profile: StoreLayoutProfileId) => {
      setLayoutProfile(profile);
      void persistLayoutProfileForStore(session.storeOsmId, profile);
    },
    [session.storeOsmId, setLayoutProfile],
  );

  const { position: pdrPosition, recalibrate, stepCount, estimatedMeters } = usePdrSession({

    polyline: route.polyline,

    initialPosition: entryPosition,

    enabled: pending.length > 0,

  });



  const recalibrateToAisle = useCallback(() => {

    if (!currentStep) return;

    const node = layout.nodes.find((n) => n.aisle === currentStep.aisle);

    if (node) recalibrate(node.x, node.y);

  }, [currentStep, layout.nodes, recalibrate]);



  useEffect(() => {

    recalibrateToAisle();

  }, [progress.currentStepIndex, recalibrateToAisle]);



  const handleRecalibrate = useCallback(

    (position: { x: number; y: number }) => {

      recalibrate(position.x, position.y);

      draft.recordPositionFix({

        schematicX: position.x,

        schematicY: position.y,

        aisle: currentStep?.aisle,

      });

    },

    [currentStep?.aisle, draft, recalibrate],

  );



  function handleToggle(row: ShoppingItemRow) {

    const wasPurchased = !!row.purchasedAt;

    togglePurchased(row);

    if (!wasPurchased) {

      draft.recordFound({

        productFingerprint: productFingerprint(row.name),

        aisle: row.aisle,

        schematicX: pdrPosition.x,

        schematicY: pdrPosition.y,

      });

      const node = layout.nodes.find((n) => n.aisle === row.aisle);

      if (node) recalibrate(node.x, node.y);

    }

  }



  function handleOutOfStock(row: ShoppingItemRow) {

    draft.recordOutOfStock({

      productFingerprint: productFingerprint(row.name),

      aisle: row.aisle,

    });

    Alert.alert(t('storeMode.outOfStockRecordedTitle'), t('storeMode.outOfStockRecordedBody'));

  }



  async function exitStoreMode() {

    clearError();

    setSubmitting(true);

    try {

      if (draft.eventCount > 0) {

        await draft.submitBatch({

          storeOsmId: session.storeOsmId,

          layoutProfile: session.layoutProfile,

          sessionStartedAt: session.sessionStartedAt,

        });

        void qc.invalidateQueries({ queryKey: ['store-contributions', session.storeOsmId] });

        Alert.alert(t('storeMode.contributionsSentTitle'), t('storeMode.contributionsSentBody'));

      }

      const purchasedCount = (items ?? []).filter((i: ShoppingItemRow) => i.purchasedAt).length;
      if (groupId && purchasedCount > 0) {
        await api.post(`/api/shopping/${groupId}/commit-cart`, {});
        await clearShoppingTripWatch();
      }

    } catch (err) {

      capture(err);

      setSubmitting(false);

      return;

    }

    setSubmitting(false);

    if (groupId) exitStoreModeSnapshot(groupId);

    void qc.invalidateQueries({ queryKey: ['shopping', groupId] });

    void qc.invalidateQueries({ queryKey: ['fridge', groupId] });

    void qc.invalidateQueries({ queryKey: ['recipes-match', groupId] });

    router.back();

  }



  if (!groupId) {

    return (

      <Screen>

        <EmptyState message={t('groups.notFound')} icon="🔍" />

      </Screen>

    );

  }



  return (

    <>

      <Stack.Screen

        options={{

          title: session.storeName ?? t('storeMode.title'),

          headerBackTitle: t('common.back'),

        }}

      />

      <Screen keyboard safeBottom>

        {isLoading ? (

          <LoadingCenter />

        ) : pending.length === 0 ? (

          <EmptyState

            icon="✅"

            title={t('storeMode.allDoneTitle')}

            message={t('storeMode.allDoneMessage')}

          />

        ) : (

          <View className="flex-1">

            <View className="px-4 pt-2 gap-2 shrink-0">

              <StoreSessionBanner

                storeOsmId={session.storeOsmId}

                storeName={session.storeName}

                showUnknownIndicator={isStoreUnknown}

                onOpenUnknownHint={() => setUnknownHintVisible(true)}

                onChangeStore={() =>
                  void (isNavigationSession ? storePicker.start() : storePicker.startMapping())
                }

              />

              <ListProgressBar done={purchasedIds.size} total={(items ?? []).length} />

              {!isNavigationSession ? (
                <View className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                  <Text className="text-sm font-semibold text-amber-900">
                    {t('storeMode.mappingModeTitle')}
                  </Text>
                  <Text className="text-xs text-amber-800 mt-1 leading-5">
                    {t('storeMode.mappingModeBody', {
                      current: mappingProgress.current,
                      target: STORE_GPS_MIN_BATCH_COUNT,
                    })}
                  </Text>
                </View>
              ) : null}

            </View>

            <StoreModeSplitLayout
              navigationLayout={isNavigationSession}
              map={
              <StoreMap2D

                fullScreen

                layout={layout}

                polyline={route.polyline}

                showRoute={isNavigationSession}

                currentAisle={isNavigationSession ? currentStep?.aisle : undefined}

                userPosition={pdrPosition}

                onRecalibrate={handleRecalibrate}

                communityPins={communityPins}

                itemPins={isNavigationSession ? itemPins : []}

                layoutBadge={`${layoutMeta.emoji} ${layoutMeta.labelFr}`}

                zoomHint={t('storeMode.mapZoomHint')}

                centerOnMeLabel={t('storeMode.mapCenterOnMe')}

                fitAllLabel={t('storeMode.mapFitAll')}

              />
              }
              list={
              <>
              {communityPins.length > 0 ? (

                <Text className="text-xs text-ink-400 text-center">

                  {t('storeMode.communityPinsHint')}

                </Text>

              ) : null}

              {stepCount > 0 ? (

                <Text className="text-xs text-ink-400 text-center">

                  {t('storeMode.pdrEstimate', { meters: Math.round(estimatedMeters) })}

                </Text>

              ) : null}

            {!isNavigationSession ? (
              <View className="gap-2">
                <Text className="text-sm font-semibold text-ink-800">{t('storeMode.mappingListTitle')}</Text>
                {pending.map((row: ShoppingItemRow) => {
                  const purchased = !!row.purchasedAt;
                  const qty = `${Number(row.quantity)}${row.unit ? ` ${row.unit}` : ''}`;
                  return (
                    <View key={row.id} className="flex-row items-center gap-2">
                      <Pressable
                        onPress={() => handleToggle(row)}
                        className="flex-1 flex-row items-center gap-3 bg-white rounded-xl border border-ink-100 px-3 py-3"
                      >
                        <ChecklistToggle
                          checked={purchased}
                          onPress={() => handleToggle(row)}
                          accessibilityLabel={t('shopping.markPurchased')}
                        />
                        <View className="flex-1">
                          <Text className={`text-base ${purchased ? 'text-ink-400 line-through' : 'text-ink-900'}`}>
                            {row.name}
                          </Text>
                          {qty ? <Text className="text-xs text-ink-500">{qty}</Text> : null}
                        </View>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            ) : null}

            {currentStep && isNavigationSession ? (

              <View className="gap-3">

                <View className="flex-row items-center justify-between">

                  <Text className="text-lg font-bold text-ink-900">

                    {getStoreAisleDefinition(currentStep.aisle).emoji}{' '}

                    {t(`shopping.aisles.${currentStep.aisle}.title`)}

                  </Text>

                  <Text className="text-sm text-ink-500">

                    {t('storeMode.aisleProgress', {

                      current: progress.currentStepIndex + 1,

                      total: route.steps.length,

                    })}

                  </Text>

                </View>

                <Text className="text-xs text-ink-500">

                  {t(`shopping.aisles.${currentStep.aisle}.hint`)}

                </Text>



                {currentStep.items.map((item: RouteItem) => {

                  const row = items?.find((i: ShoppingItemRow) => i.id === item.id);

                  const purchased = !!row?.purchasedAt;

                  const qty = row ? `${Number(row.quantity)}${row.unit ? ` ${row.unit}` : ''}` : '';

                  return (

                    <View key={item.id} className="flex-row items-center gap-2">

                      <Pressable

                        onPress={() => row && handleToggle(row)}

                        className="flex-1 flex-row items-center gap-3 bg-white rounded-xl border border-ink-100 px-3 py-3"

                      >

                        <ChecklistToggle

                          checked={purchased}

                          onPress={() => row && handleToggle(row)}

                          accessibilityLabel={t('shopping.markPurchased')}

                        />

                        <View className="flex-1">

                          <Text

                            className={`text-base ${purchased ? 'text-ink-400 line-through' : 'text-ink-900'}`}

                          >

                            {item.name}

                          </Text>

                          {qty ? <Text className="text-xs text-ink-500">{qty}</Text> : null}

                        </View>

                      </Pressable>

                      {!purchased && row ? (

                        <Pressable

                          onPress={() => handleOutOfStock(row)}

                          className="px-2 py-3"

                          accessibilityLabel={t('storeMode.outOfStock')}

                        >

                          <Text className="text-lg">🚫</Text>

                        </Pressable>

                      ) : null}

                    </View>

                  );

                })}

              </View>

            ) : null}



            {draft.eventCount > 0 ? (

              <Text className="text-xs text-ink-500 text-center">

                {t('storeMode.draftPending', { count: draft.eventCount })}

              </Text>

            ) : null}



            {error ? <Text className="text-sm text-red-600">{error}</Text> : null}



            <Button onPress={() => void exitStoreMode()} disabled={submitting}>

              {submitting ? t('common.loading') : t('storeMode.finishShopping')}

            </Button>

            <Text className="text-xs text-ink-500 text-center">{t('storeMode.finishHint')}</Text>

            </>
              }
            />

          </View>

        )}

      </Screen>



      <StoreUnknownHintSheet

        visible={unknownHintVisible}

        layoutProfile={session.layoutProfile}

        onClose={() => setUnknownHintVisible(false)}

        onLayoutChange={handleLayoutChange}

        onLayoutMismatch={() => draft.recordLayoutFeedback('WRONG_PROFILE')}

      />

      <StorePickerSheet

        visible={storePicker.pickerVisible}

        loading={storePicker.loading}

        stores={storePicker.stores}

        locationDenied={storePicker.locationDenied}

        noGpsReadyStores={storePicker.noGpsReadyStores}

        allowGeneric={storePicker.allowGeneric}

        lastStoreName={storePicker.lastStoreName}

        lastStoreOsmId={storePicker.lastStoreOsmId}

        lastLayoutProfile={storePicker.lastLayoutProfile}

        onClose={storePicker.closePicker}

        onConfirm={storePicker.confirmPicker}

      />

    </>

  );

}


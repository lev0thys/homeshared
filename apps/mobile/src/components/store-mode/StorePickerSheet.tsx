import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getLayoutProfileMeta,
  STORE_LAYOUT_PROFILE_LABELS,
  type StoreLayoutProfileId,
} from '@homeshared/store-navigation';
import { Button } from '@/components/Button';
import { FilterChip } from '@/components/FilterChip';
import { LoadingCenter } from '@/components/LoadingCenter';
import { StoreLayoutPreview } from '@/components/store-mode/StoreLayoutPreview';
import type { NearbyStorePoi } from '@/lib/overpass-stores';
import { DEFAULT_STORE_OSM_ID } from '@/hooks/store-mode/useStoreSession';

const LAYOUT_OPTIONS: StoreLayoutProfileId[] = ['HYPERMARKET_FR', 'SUPERMARKET_FR', 'PROXI_FR'];

export interface StorePickerSelection {
  storeOsmId: string;
  storeName?: string;
  layoutProfile: StoreLayoutProfileId;
}

interface StorePickerSheetProps {
  visible: boolean;
  loading?: boolean;
  stores: NearbyStorePoi[];
  locationDenied?: boolean;
  noGpsReadyStores?: boolean;
  allowGeneric?: boolean;
  lastStoreName?: string;
  lastStoreOsmId?: string;
  lastLayoutProfile?: StoreLayoutProfileId;
  onClose: () => void;
  onConfirm: (selection: StorePickerSelection) => void;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function confidenceLabel(
  t: (key: string) => string,
  confidence: NearbyStorePoi['layoutConfidence'],
): string | null {
  if (confidence === 'high') return t('storeMode.layoutConfidenceHigh');
  if (confidence === 'medium') return t('storeMode.layoutConfidenceMedium');
  return null;
}

export function StorePickerSheet({
  visible,
  loading,
  stores,
  locationDenied,
  noGpsReadyStores,
  allowGeneric = false,
  lastStoreName,
  lastStoreOsmId,
  lastLayoutProfile,
  onClose,
  onConfirm,
}: StorePickerSheetProps) {
  const { t } = useTranslation();
  const [manualLayout, setManualLayout] = useState<StoreLayoutProfileId>(
    lastLayoutProfile ?? 'HYPERMARKET_FR',
  );

  function confirmStore(poi: NearbyStorePoi) {
    onConfirm({
      storeOsmId: poi.osmId,
      storeName: poi.brand ? `${poi.brand} — ${poi.name}` : poi.name,
      layoutProfile: poi.suggestedLayout,
    });
  }

  function confirmGeneric() {
    onConfirm({
      storeOsmId: DEFAULT_STORE_OSM_ID,
      storeName: undefined,
      layoutProfile: manualLayout,
    });
  }

  function confirmLastStore() {
    if (!lastStoreOsmId || lastStoreOsmId === DEFAULT_STORE_OSM_ID) return;
    onConfirm({
      storeOsmId: lastStoreOsmId,
      storeName: lastStoreName,
      layoutProfile: lastLayoutProfile ?? 'HYPERMARKET_FR',
    });
  }

  const showLastStore =
    lastStoreOsmId && lastStoreOsmId !== DEFAULT_STORE_OSM_ID && lastStoreName;
  const closestId = stores[0]?.osmId;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={onClose}>
        <Pressable className="bg-white rounded-t-3xl max-h-[85%]" onPress={(e) => e.stopPropagation()}>
          <View className="w-10 h-1 rounded-full bg-ink-200 self-center mt-3 mb-2" />
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28, gap: 12 }}>
            <Text className="text-lg font-bold text-ink-900">{t('storeMode.pickStoreTitle')}</Text>
            <Text className="text-sm text-ink-500">
              {allowGeneric ? t('storeMode.pickStoreHintDev') : t('storeMode.pickStoreHint')}
            </Text>

            {noGpsReadyStores && !allowGeneric ? (
              <View className="bg-ink-50 border border-ink-200 rounded-xl px-3 py-3">
                <Text className="text-sm font-medium text-ink-800">{t('storeMode.gpsNotReadyTitle')}</Text>
                <Text className="text-xs text-ink-600 mt-1 leading-5">{t('storeMode.gpsNotReadyBody')}</Text>
              </View>
            ) : null}

            {locationDenied ? (
              <View className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                <Text className="text-xs text-amber-900">{t('storeMode.locationDenied')}</Text>
              </View>
            ) : null}

            {loading ? (
              <View className="py-8">
                <LoadingCenter />
                <Text className="text-xs text-ink-500 text-center mt-2">
                  {t('storeMode.searchingStores')}
                </Text>
              </View>
            ) : (
              <>
                {showLastStore ? (
                  <Pressable
                    onPress={confirmLastStore}
                    className="border border-emerald-200 bg-emerald-50 rounded-xl px-3 py-3"
                  >
                    <Text className="text-sm font-semibold text-emerald-900">
                      {t('storeMode.useLastStore')}
                    </Text>
                    <Text className="text-xs text-emerald-800 mt-1">{lastStoreName}</Text>
                  </Pressable>
                ) : null}

                {stores.length > 0 ? (
                  <View className="gap-2">
                    <Text className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                      {t('storeMode.nearbyStores')}
                    </Text>
                    {stores.slice(0, 8).map((poi) => {
                      const meta = getLayoutProfileMeta(poi.suggestedLayout);
                      const conf = confidenceLabel(t, poi.layoutConfidence);
                      const isClosest = poi.osmId === closestId;
                      return (
                        <Pressable
                          key={poi.osmId}
                          onPress={() => confirmStore(poi)}
                          className={`flex-row items-center gap-3 border rounded-xl px-3 py-3 bg-white ${
                            isClosest ? 'border-emerald-300 bg-emerald-50/50' : 'border-ink-100'
                          }`}
                        >
                          <StoreLayoutPreview profile={poi.suggestedLayout} width={72} height={48} />
                          <View className="flex-1">
                            <Text className="text-base font-medium text-ink-900">{poi.name}</Text>
                            {poi.brand && poi.brand !== poi.name ? (
                              <Text className="text-xs text-ink-500">{poi.brand}</Text>
                            ) : null}
                            <Text className="text-xs text-ink-600 mt-0.5">
                              {meta.emoji}{' '}
                              {t('storeMode.layoutSuggestion', {
                                layout: STORE_LAYOUT_PROFILE_LABELS[poi.suggestedLayout],
                              })}
                              {conf ? ` · ${conf}` : ''}
                            </Text>
                            {isClosest ? (
                              <Text className="text-xs text-emerald-700 mt-0.5">
                                {t('storeMode.closestStore')}
                              </Text>
                            ) : null}
                          </View>
                          <Text className="text-sm text-ink-500">{formatDistance(poi.distanceMeters)}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : !loading && !noGpsReadyStores ? (
                  <Text className="text-sm text-ink-500">{t('storeMode.noStoresFound')}</Text>
                ) : null}

                {allowGeneric ? (
                <View className="gap-2 pt-2 border-t border-ink-100">
                  <Text className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                    {t('storeMode.genericStoreTitle')}
                  </Text>
                  <Text className="text-xs text-ink-500">{t('storeMode.genericStoreHint')}</Text>
                  <View className="flex-row gap-2 justify-between">
                    {LAYOUT_OPTIONS.map((id) => (
                      <View key={id} className="items-center gap-1 flex-1">
                        <Pressable onPress={() => setManualLayout(id)}>
                          <StoreLayoutPreview profile={id} active={manualLayout === id} />
                        </Pressable>
                        <FilterChip
                          active={manualLayout === id}
                          onPress={() => setManualLayout(id)}
                          variant="rounded"
                        >
                          {STORE_LAYOUT_PROFILE_LABELS[id]}
                        </FilterChip>
                      </View>
                    ))}
                  </View>
                  <Text className="text-xs text-ink-400">
                    {getLayoutProfileMeta(manualLayout).descriptionFr}
                  </Text>
                  <Button variant="secondary" onPress={confirmGeneric}>
                    {t('storeMode.continueGeneric')}
                  </Button>
                </View>
                ) : null}

                <Button variant="ghost" onPress={onClose}>
                  {t('common.cancel')}
                </Button>
              </>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

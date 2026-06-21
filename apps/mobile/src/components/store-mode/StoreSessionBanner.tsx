import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DEFAULT_STORE_OSM_ID } from '@/hooks/store-mode/useStoreSession';

interface StoreSessionBannerProps {
  storeOsmId: string;
  storeName?: string;
  /** Magasin pas encore cartographié par la communauté. */
  showUnknownIndicator?: boolean;
  onOpenUnknownHint?: () => void;
  onChangeStore: () => void;
}

export function StoreSessionBanner({
  storeOsmId,
  storeName,
  showUnknownIndicator = false,
  onOpenUnknownHint,
  onChangeStore,
}: StoreSessionBannerProps) {
  const { t } = useTranslation();
  const hasRealStore = storeOsmId !== DEFAULT_STORE_OSM_ID && !!storeName;

  return (
    <View className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
      <View className="flex-row items-center gap-2">
        {showUnknownIndicator && onOpenUnknownHint ? (
          <Pressable
            onPress={onOpenUnknownHint}
            className="w-8 h-8 rounded-full bg-amber-100 border border-amber-400 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel={t('storeMode.unknownStoreHintA11y')}
          >
            <Text className="text-sm font-bold text-amber-800">!</Text>
          </Pressable>
        ) : null}
        <View className="flex-1 min-w-0">
          <Text className="text-xs text-emerald-800 font-medium uppercase tracking-wide">
            {t('storeMode.activeStoreLabel')}
          </Text>
          <Text className="text-sm font-semibold text-emerald-950" numberOfLines={2}>
            {hasRealStore ? storeName : t('storeMode.genericStoreActive')}
          </Text>
        </View>
        <Pressable
          onPress={onChangeStore}
          className="bg-white border border-emerald-300 rounded-lg px-3 py-2"
          accessibilityRole="button"
        >
          <Text className="text-xs font-semibold text-emerald-800">{t('storeMode.changeStore')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

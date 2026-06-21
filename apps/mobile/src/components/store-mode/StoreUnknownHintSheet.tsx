import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { StoreLayoutProfileId } from '@homeshared/store-navigation';
import { StoreLayoutSwitcher } from '@/components/store-mode/StoreLayoutSwitcher';

interface StoreUnknownHintSheetProps {
  visible: boolean;
  layoutProfile: StoreLayoutProfileId;
  onClose: () => void;
  onLayoutChange: (profile: StoreLayoutProfileId) => void;
  onLayoutMismatch?: () => void;
}

/** Fiche « magasin pas encore connu » — plan type + contribution. */
export function StoreUnknownHintSheet({
  visible,
  layoutProfile,
  onClose,
  onLayoutChange,
  onLayoutMismatch,
}: StoreUnknownHintSheetProps) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={onClose}>
        <Pressable className="bg-white rounded-t-3xl max-h-[80%]" onPress={(e) => e.stopPropagation()}>
          <View className="w-10 h-1 rounded-full bg-ink-200 self-center mt-3 mb-2" />
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28, gap: 14 }}>
            <View className="flex-row items-start gap-3">
              <View className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 items-center justify-center">
                <Text className="text-lg font-bold text-amber-800">!</Text>
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-base font-semibold text-ink-900">{t('storeMode.pioneerTitle')}</Text>
                <Text className="text-sm text-ink-600 leading-5">{t('storeMode.pioneerBody')}</Text>
              </View>
            </View>

            <Text className="text-xs text-ink-500">{t('storeMode.unknownStorePlanHint')}</Text>

            <StoreLayoutSwitcher
              value={layoutProfile}
              emphasized
              onChange={(profile) => {
                onLayoutChange(profile);
              }}
            />

            <View className="flex-row gap-2 flex-wrap">
              {onLayoutMismatch ? (
                <Pressable
                  onPress={() => {
                    onLayoutMismatch();
                    onClose();
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-50 border border-ink-200"
                >
                  <Text className="text-sm font-medium text-ink-700">{t('storeMode.layoutMismatch')}</Text>
                </Pressable>
              ) : null}
              <Pressable onPress={onClose} className="px-4 py-2.5 rounded-xl bg-amber-600 flex-1 min-w-[120px]">
                <Text className="text-sm font-semibold text-white text-center">{t('storeMode.pioneerDismiss')}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

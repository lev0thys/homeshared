import { Pressable, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  getLayoutProfileMeta,
  STORE_LAYOUT_PROFILE_LABELS,
  type StoreLayoutProfileId,
} from '@homeshared/store-navigation';
import { FilterChip } from '@/components/FilterChip';
import { StoreLayoutPreview } from '@/components/store-mode/StoreLayoutPreview';

const OPTIONS: StoreLayoutProfileId[] = ['HYPERMARKET_FR', 'SUPERMARKET_FR', 'PROXI_FR'];

interface StoreLayoutSwitcherProps {
  value: StoreLayoutProfileId;
  autoDetected?: boolean;
  /** Mise en avant pour les premiers passages. */
  emphasized?: boolean;
  /** Affiche uniquement le plan choisi (après validation). */
  compact?: boolean;
  onRequestEdit?: () => void;
  onChange: (profile: StoreLayoutProfileId) => void;
}

export function StoreLayoutSwitcher({
  value,
  autoDetected,
  emphasized = false,
  compact = false,
  onRequestEdit,
  onChange,
}: StoreLayoutSwitcherProps) {
  const { t } = useTranslation();
  const meta = getLayoutProfileMeta(value);

  if (compact) {
    return (
      <View className="flex-row items-center gap-3 rounded-xl p-3 bg-slate-50 border border-ink-100">
        <StoreLayoutPreview profile={value} width={52} height={36} active />
        <View className="flex-1 min-w-0">
          <Text className="text-sm font-semibold text-ink-900">
            {meta.emoji} {STORE_LAYOUT_PROFILE_LABELS[value]}
          </Text>
          <Text className="text-xs text-ink-500" numberOfLines={2}>
            {meta.aisleFlowHint}
          </Text>
        </View>
        {onRequestEdit ? (
          <Pressable
            onPress={onRequestEdit}
            className="px-2 py-2 min-h-[44px] justify-center"
            accessibilityLabel={t('storeMode.layoutEditPlan')}
          >
            <Text className="text-sm font-medium text-primary-700">{t('storeMode.layoutEditPlan')}</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View
      className={`gap-2 rounded-xl p-3 border ${
        emphasized ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-ink-100'
      }`}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-ink-900">{t('storeMode.layoutPlanTitle')}</Text>
        {autoDetected ? (
          <Text className="text-xs text-emerald-700">{t('storeMode.layoutAutoDetected')}</Text>
        ) : null}
      </View>
      <Text className="text-xs text-ink-500">
        {meta.emoji} {meta.descriptionFr}
      </Text>
      <View className="flex-row gap-2 justify-between">
        {OPTIONS.map((id) => (
          <View key={id} className="items-center gap-1 flex-1">
            <StoreLayoutPreview profile={id} active={value === id} />
            <FilterChip active={value === id} onPress={() => onChange(id)} variant="rounded">
              {STORE_LAYOUT_PROFILE_LABELS[id]}
            </FilterChip>
          </View>
        ))}
      </View>
      <Text className="text-xs text-ink-400">{meta.aisleFlowHint}</Text>
    </View>
  );
}

import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { formatServingsLabel } from '@homeshared/shared';

interface MealPlanServingsBarProps {
  settings: {
    effectiveServings: number;
    adultEaters: number;
    childEaters: number;
    servingsFromMemberCount: boolean;
    memberCount: number;
  };
  onAdjust?: () => void;
}

export function MealPlanServingsBar({ settings, onAdjust }: MealPlanServingsBarProps) {
  const { t } = useTranslation();
  const label = formatServingsLabel(
    settings.effectiveServings,
    settings.adultEaters,
    settings.childEaters,
  );

  return (
    <View className="bg-primary-700 rounded-2xl px-4 py-3 mb-3 flex-row items-center justify-between">
      <View className="flex-1 mr-2">
        <Text className="text-xs text-primary-100 uppercase font-semibold">
          {t('mealPlan.portionsTitle')}
        </Text>
        <Text className="text-xl font-bold text-white mt-0.5">{label}</Text>
        <Text className="text-xs text-primary-100 mt-1">
          {settings.servingsFromMemberCount
            ? t('mealPlan.portionsFromGroup', { count: settings.memberCount })
            : t('mealPlan.portionsManual')}
        </Text>
      </View>
      {onAdjust ? (
        <Pressable
          onPress={onAdjust}
          className="bg-white/20 rounded-xl px-3 py-2 min-h-[44px] justify-center"
        >
          <Text className="text-white text-sm font-medium">{t('mealPlan.adjust')}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

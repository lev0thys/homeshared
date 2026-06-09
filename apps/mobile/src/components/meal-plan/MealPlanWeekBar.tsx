import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  addWeeksToMonday,
  formatWeekRangeLabel,
  mondayIsoUtc,
} from '@/lib/week-dates';

interface MealPlanWeekBarProps {
  weekStart: string;
  onWeekStartChange: (iso: string) => void;
}

export function MealPlanWeekBar({ weekStart, onWeekStartChange }: MealPlanWeekBarProps) {
  const { t, i18n } = useTranslation();
  const currentMonday = mondayIsoUtc();
  const isCurrentWeek = weekStart === currentMonday;
  const locale = i18n.language?.startsWith('en') ? 'en-GB' : 'fr-FR';

  return (
    <View className="flex-row items-center gap-2 mb-3">
      <Pressable
        onPress={() => onWeekStartChange(addWeeksToMonday(weekStart, -1))}
        accessibilityRole="button"
        accessibilityLabel={t('mealPlan.weekPrev')}
        className="w-11 h-11 rounded-xl border border-ink-200 bg-white items-center justify-center active:bg-ink-50"
      >
        <Text className="text-lg text-ink-700">‹</Text>
      </Pressable>

      <View className="flex-1 items-center px-1">
        <Text className="text-sm font-semibold text-ink-900 text-center">
          {formatWeekRangeLabel(weekStart, locale)}
        </Text>
        {!isCurrentWeek ? (
          <Pressable
            onPress={() => onWeekStartChange(currentMonday)}
            className="mt-1 py-1 px-2"
            accessibilityRole="button"
            accessibilityLabel={t('mealPlan.thisWeek')}
          >
            <Text className="text-xs font-medium text-primary-700">{t('mealPlan.thisWeek')}</Text>
          </Pressable>
        ) : (
          <Text className="text-xs text-ink-500 mt-0.5">{t('mealPlan.thisWeekBadge')}</Text>
        )}
      </View>

      <Pressable
        onPress={() => onWeekStartChange(addWeeksToMonday(weekStart, 1))}
        accessibilityRole="button"
        accessibilityLabel={t('mealPlan.weekNext')}
        className="w-11 h-11 rounded-xl border border-ink-200 bg-white items-center justify-center active:bg-ink-50"
      >
        <Text className="text-lg text-ink-700">›</Text>
      </Pressable>
    </View>
  );
}

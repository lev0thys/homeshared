import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { MealSlot } from './types';

const SLOT_ORDER: MealSlot[] = ['BREAKFAST', 'LUNCH', 'DINNER'];

interface MealSlotVisibilityBarProps {
  showBreakfast: boolean;
  showLunch: boolean;
  showDinner: boolean;
  onToggle: (slot: MealSlot, value: boolean) => void;
  canEdit: boolean;
}

export function MealSlotVisibilityBar({
  showBreakfast,
  showLunch,
  showDinner,
  onToggle,
  canEdit,
}: MealSlotVisibilityBarProps) {
  const { t } = useTranslation();
  const state: Record<MealSlot, boolean> = {
    BREAKFAST: showBreakfast,
    LUNCH: showLunch,
    DINNER: showDinner,
  };

  return (
    <View className="mb-3">
      <Text className="text-xs font-semibold text-ink-500 uppercase mb-2">
        {t('mealPlan.visibleSlots')}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {SLOT_ORDER.map((slot) => {
          const on = state[slot];
          return (
            <Pressable
              key={slot}
              disabled={!canEdit}
              onPress={() => canEdit && onToggle(slot, !on)}
              className={`px-4 py-3 rounded-full border min-h-[44px] justify-center ${
                on ? 'bg-ink-900 border-ink-900' : 'bg-white border-ink-200 opacity-60'
              }`}
            >
              <Text className={`text-sm font-medium ${on ? 'text-white' : 'text-ink-600'}`}>
                {t(`mealPlan.slots.${slot}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

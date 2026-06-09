import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fridgeScoreTextClass } from '@/lib/fridge-score-style';
import {
  DAY_KEYS,
  type MealSlot,
  type MealPlanWeekSettings,
  type PlanEntry,
  visibleSlotsFromSettings,
} from './types';

interface MealPlanListViewProps {
  settings: MealPlanWeekSettings;
  entryMap: Map<string, PlanEntry>;
  accessMap: Map<string, boolean>;
  onSlotPress: (day: number, slot: MealSlot) => void;
  onClearSlot: (day: number, slot: MealSlot) => void;
  onComplete: (entry: PlanEntry) => void;
  canManageShopping?: boolean;
  shoppingEntryId?: string | null;
  onAddToShopping?: (entry: PlanEntry) => void;
}

export function MealPlanListView({
  settings,
  entryMap,
  accessMap,
  onSlotPress,
  onClearSlot,
  onComplete,
  canManageShopping = false,
  shoppingEntryId = null,
  onAddToShopping,
}: MealPlanListViewProps) {
  const { t } = useTranslation();
  const visibleSlots = visibleSlotsFromSettings(settings);

  return (
    <>
      {DAY_KEYS.map((dayKey, dayIndex) => (
        <View key={dayKey} className="mb-4">
          <Text className="text-base font-bold text-ink-900 mb-2">
            {t(`mealPlan.days.${dayKey}`)}
          </Text>
          {visibleSlots.map((slot) => {
            const key = `${dayIndex}-${slot}`;
            const entry = entryMap.get(key);
            const canEdit = accessMap.get(key) ?? false;
            const cooked = !!entry?.cookedAt;

            return (
              <View
                key={slot}
                className={`bg-white border rounded-xl px-3 py-3 mb-2 ${
                  cooked ? 'border-emerald-200' : 'border-ink-100'
                }`}
              >
                <Pressable
                  disabled={!canEdit && !entry}
                  onPress={() => canEdit && onSlotPress(dayIndex, slot)}
                  className="flex-row items-center justify-between"
                >
                  <Text className="text-sm text-ink-500 w-20">{t(`mealPlan.slots.${slot}`)}</Text>
                  <View className="flex-1">
                    <Text className="text-sm text-ink-900 font-medium" numberOfLines={2}>
                      {entry?.recipe.title ??
                        (canEdit ? t('mealPlan.emptySlot') : t('mealPlan.readOnlySlot'))}
                    </Text>
                    {entry ? (
                      <Text
                        className={`text-xs font-medium mt-0.5 ${fridgeScoreTextClass(entry.fridgeScore)}`}
                      >
                        {t('mealPlan.fridgePct', { pct: Math.round(entry.fridgeScore * 100) })}
                        {cooked ? ` · ${t('mealPlan.cooked')}` : ''}
                      </Text>
                    ) : null}
                  </View>
                  {canEdit ? <Text className="text-primary-600 text-sm">›</Text> : null}
                </Pressable>
                {entry && canEdit && !cooked ? (
                  <View className="gap-2 mt-2 pt-2 border-t border-ink-100">
                    <View className="flex-row gap-2">
                      <Pressable
                        onPress={() => onSlotPress(dayIndex, slot)}
                        className="flex-1 py-2 items-center rounded-lg bg-ink-50"
                      >
                        <Text className="text-xs text-ink-700">{t('mealPlan.changeRecipe')}</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => onComplete(entry)}
                        className="flex-1 py-2 items-center rounded-lg bg-emerald-50"
                      >
                        <Text className="text-xs text-emerald-800 font-medium">
                          {t('mealPlan.markDone')}
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => onClearSlot(dayIndex, slot)}
                        className="px-3 py-2 rounded-lg"
                      >
                        <Text className="text-xs text-red-600">{t('mealPlan.remove')}</Text>
                      </Pressable>
                    </View>
                    {canManageShopping && onAddToShopping ? (
                      <Pressable
                        disabled={shoppingEntryId === entry.id}
                        onPress={() => onAddToShopping(entry)}
                        className="py-2 items-center rounded-lg bg-amber-50 border border-amber-200"
                      >
                        <Text
                          className={`text-xs font-medium ${
                            shoppingEntryId === entry.id ? 'text-ink-400' : 'text-amber-900'
                          }`}
                        >
                          {shoppingEntryId === entry.id
                            ? t('mealPlan.addRecipeToShoppingPending')
                            : t('mealPlan.addRecipeToShopping')}
                        </Text>
                      </Pressable>
                    ) : null}
                  </View>
                ) : null}
                {entry && canEdit && cooked ? (
                  <Pressable
                    onPress={() => onClearSlot(dayIndex, slot)}
                    className="mt-2 py-2"
                  >
                    <Text className="text-xs text-red-600 text-center">{t('mealPlan.clearSlot')}</Text>
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </View>
      ))}
    </>
  );
}

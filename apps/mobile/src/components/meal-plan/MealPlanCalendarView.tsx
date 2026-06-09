import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HorizontalSwipeRow } from '@/components/HorizontalSwipeRow';
import { fridgeScoreTextClass } from '@/lib/fridge-score-style';
import {
  DAY_KEYS,
  type MealSlot,
  type MealPlanWeekSettings,
  type PlanEntry,
  visibleSlotsFromSettings,
} from './types';

interface MealPlanCalendarViewProps {
  settings: MealPlanWeekSettings;
  entryMap: Map<string, PlanEntry>;
  accessMap: Map<string, boolean>;
  /** Colonne « aujourd’hui » (0=lun) si semaine courante. */
  highlightDayIndex?: number | null;
  onCellPress: (day: number, slot: MealSlot) => void;
  onComplete: (entry: PlanEntry) => void;
  canManageShopping?: boolean;
  shoppingEntryId?: string | null;
  onAddToShopping?: (entry: PlanEntry) => void;
}

const CELL_MIN = 72;

export function MealPlanCalendarView({
  settings,
  entryMap,
  accessMap,
  highlightDayIndex = null,
  onCellPress,
  onComplete,
  canManageShopping = false,
  shoppingEntryId = null,
  onAddToShopping,
}: MealPlanCalendarViewProps) {
  const { t } = useTranslation();
  const visibleSlots = visibleSlotsFromSettings(settings);

  return (
    <HorizontalSwipeRow className="mb-2">
      <View>
        <View className="flex-row border-b border-ink-200 pb-2 mb-1">
          <View style={{ width: 56 }} />
          {DAY_KEYS.map((dayKey, dayIndex) => {
            const isToday = highlightDayIndex === dayIndex;
            return (
              <View key={dayKey} style={{ width: CELL_MIN }} className="items-center px-1">
                <View
                  className={`px-1.5 py-0.5 rounded-md ${isToday ? 'bg-primary-600' : ''}`}
                >
                  <Text
                    className={`text-xs font-bold ${isToday ? 'text-white' : 'text-ink-800'}`}
                  >
                    {t(`mealPlan.daysShort.${dayKey}`)}
                  </Text>
                </View>
                {isToday ? (
                  <Text className="text-[8px] text-primary-600 font-medium mt-0.5">
                    {t('mealPlan.today')}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>

        {visibleSlots.map((slot) => (
          <View key={slot} className="flex-row items-stretch mb-1">
            <View style={{ width: 56 }} className="justify-center pr-1">
              <Text className="text-xs text-ink-600 font-medium">
                {t(`mealPlan.slots.${slot}`)}
              </Text>
            </View>
            {DAY_KEYS.map((dayKey, dayIndex) => {
              const key = `${dayIndex}-${slot}`;
              const entry = entryMap.get(key);
              const canEdit = accessMap.get(key) ?? false;
              const cooked = !!entry?.cookedAt;
              const isTodayCol = highlightDayIndex === dayIndex;

              return (
                <Pressable
                  key={key}
                  disabled={!canEdit && !entry}
                  onPress={() => {
                    if (entry && canEdit) onCellPress(dayIndex, slot);
                    else if (!entry && canEdit) onCellPress(dayIndex, slot);
                  }}
                  style={{ width: CELL_MIN, minHeight: 64 }}
                  className={`mx-0.5 p-1 rounded-lg border ${
                    cooked
                      ? 'bg-emerald-50 border-emerald-200'
                      : entry
                        ? 'bg-white border-primary-200'
                        : canEdit
                          ? 'bg-ink-50 border-ink-200 border-dashed'
                          : 'bg-ink-50 border-ink-100 opacity-50'
                  } ${isTodayCol && !cooked ? 'border-primary-300' : ''}`}
                >
                  {entry ? (
                    <>
                      <Text className="text-[10px] font-semibold text-ink-900" numberOfLines={2}>
                        {entry.recipe.title}
                      </Text>
                      <Text
                        className={`text-[9px] font-medium mt-0.5 ${fridgeScoreTextClass(entry.fridgeScore)}`}
                      >
                        {t('mealPlan.fridgePct', { pct: Math.round(entry.fridgeScore * 100) })}
                      </Text>
                      {cooked ? (
                        <Text className="text-[9px] text-emerald-700 font-medium mt-0.5">✓</Text>
                      ) : canEdit ? (
                        <View className="mt-1 gap-0.5">
                          {canManageShopping && onAddToShopping ? (
                            <Pressable
                              disabled={shoppingEntryId === entry.id}
                              onPress={(e) => {
                                e.stopPropagation?.();
                                onAddToShopping(entry);
                              }}
                            >
                              <Text
                                className={`text-[9px] font-medium ${
                                  shoppingEntryId === entry.id ? 'text-ink-400' : 'text-amber-700'
                                }`}
                              >
                                {shoppingEntryId === entry.id
                                  ? t('mealPlan.addRecipeToShoppingPending')
                                  : t('mealPlan.addRecipeToShoppingShort')}
                              </Text>
                            </Pressable>
                          ) : null}
                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation?.();
                              onComplete(entry);
                            }}
                          >
                            <Text className="text-[9px] text-primary-700">{t('mealPlan.markDone')}</Text>
                          </Pressable>
                        </View>
                      ) : null}
                    </>
                  ) : (
                    <Text className="text-[10px] text-ink-400 text-center">
                      {canEdit ? '+' : '—'}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </HorizontalSwipeRow>
  );
}

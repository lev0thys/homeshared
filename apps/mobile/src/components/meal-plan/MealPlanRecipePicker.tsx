import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChipScrollRow } from '@/components/ChipScrollRow';
import { FilterChip } from '@/components/FilterChip';
import type { MealSlot, SuggestionRecipe, Suggestions } from './types';

interface MealPlanRecipePickerProps {
  visible: boolean;
  day: number;
  slot: MealSlot;
  tab: 'habits' | 'favorites' | 'proposals' | 'seasonal' | 'discovery';
  onTabChange: (tab: MealPlanRecipePickerProps['tab']) => void;
  suggestions: Suggestions | undefined;
  isLoading: boolean;
  isAssigning: boolean;
  assignError: string | null;
  onSelect: (recipeId: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export function MealPlanRecipePicker({
  visible,
  tab,
  onTabChange,
  suggestions,
  isLoading,
  isAssigning,
  assignError,
  onSelect,
  onClear,
  onClose,
}: MealPlanRecipePickerProps) {
  const { t } = useTranslation();

  const tabLists: Record<typeof tab, SuggestionRecipe[]> = {
    habits: suggestions?.habits ?? [],
    favorites: suggestions?.favorites ?? [],
    proposals: suggestions?.proposals ?? [],
    seasonal: suggestions?.seasonal ?? [],
    discovery: suggestions?.discovery ?? [],
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-3xl max-h-[85%] px-4 pt-4 pb-8"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-lg font-bold text-ink-900 mb-1">{t('mealPlan.pickRecipe')}</Text>
          <Text className="text-xs text-ink-500 mb-3">{t('mealPlan.pickFridgeHint')}</Text>

          <ChipScrollRow>
            {(['habits', 'favorites', 'proposals', 'seasonal', 'discovery'] as const).map((key) => {
              const active = tab === key;
              return (
                <FilterChip
                  key={key}
                  active={active}
                  onPress={() => onTabChange(key)}
                  className={active ? 'bg-primary-700 border-primary-700' : ''}
                  textClassName={`text-xs ${active ? 'text-white' : 'text-ink-700'}`}
                >
                  {t(`mealPlan.tabs.${key}`)}
                </FilterChip>
              );
            })}
          </ChipScrollRow>

          {isLoading ? (
            <ActivityIndicator className="my-8" />
          ) : (
            <ScrollView className="max-h-80" keyboardShouldPersistTaps="handled">
              {tabLists[tab].length === 0 ? (
                <Text className="text-sm text-ink-500 py-4">{t('mealPlan.noSuggestions')}</Text>
              ) : (
                tabLists[tab].map((r) => (
                  <Pressable
                    key={r.id}
                    disabled={isAssigning}
                    onPress={() => onSelect(r.id)}
                    className="flex-row items-center py-3 border-b border-ink-100 min-h-[48px] active:bg-ink-50"
                  >
                    <Text className="flex-1 text-ink-900">{r.title}</Text>
                    {r.score !== undefined ? (
                      <Text className="text-xs text-ink-500 mr-2">
                        {Math.round(r.score * 100)}%
                      </Text>
                    ) : null}
                    {r.isFavorite ? <Text className="text-amber-500 mr-2">★</Text> : null}
                  </Pressable>
                ))
              )}
            </ScrollView>
          )}

          {assignError ? <Text className="text-sm text-red-600 mt-2">{assignError}</Text> : null}
          {isAssigning ? <ActivityIndicator className="mt-2" /> : null}

          <Pressable
            onPress={onClear}
            disabled={isAssigning}
            className="mt-4 py-3 items-center min-h-[44px] justify-center"
          >
            <Text className="text-red-600 text-sm font-medium">{t('mealPlan.clearSlot')}</Text>
          </Pressable>
          <Pressable onPress={onClose} className="mt-2 py-3 items-center min-h-[44px] justify-center">
            <Text className="text-ink-500">{t('common.cancel')}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

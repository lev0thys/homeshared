import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FavoriteStar } from '@/components/FavoriteStar';
import { RecipeMissingBlock } from '@/components/RecipeMissingBlock';
import { CUISINE_EMOJI } from '@/lib/recipe-categories';
import type { MatchedRecipe } from '@/types/matched-recipe';

interface RecipeListCardProps {
  item: MatchedRecipe;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export function RecipeListCard({ item, onPress, onToggleFavorite }: RecipeListCardProps) {
  const { t } = useTranslation();
  const totalMin = item.prepMinutes + item.cookMinutes;

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl p-4 border border-ink-100 active:bg-ink-50 min-h-[88px]"
    >
      <View className="flex-row items-start gap-3">
        <FavoriteStar active={!!item.isFavorite} size="sm" onPress={onToggleFavorite} />
        <View className="flex-1">
          <Text className="text-lg font-bold text-ink-900 leading-snug">{item.title}</Text>
          <View className="flex-row flex-wrap items-center gap-2 mt-2">
            {item.cuisine ? (
              <View className="flex-row items-center bg-ink-50 px-2 py-1 rounded-full">
                <Text className="text-xs mr-1">{CUISINE_EMOJI[item.cuisine] ?? '🍽️'}</Text>
                <Text className="text-xs text-ink-600">
                  {t(`cuisines.${item.cuisine}`, { defaultValue: item.cuisine })}
                </Text>
              </View>
            ) : null}
            <Text className="text-xs text-ink-500">
              ⏱ {totalMin} min · {t('recipes.servingsShort', { count: item.servings })}
            </Text>
          </View>
          <View className="mt-2">
            <RecipeMissingBlock missing={item.missingIngredients} score={item.score} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

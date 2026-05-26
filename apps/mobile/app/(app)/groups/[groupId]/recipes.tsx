import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { api } from '@/lib/api-client';
import type { MatchedRecipe } from '@/types/matched-recipe';

export default function RecipesScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { t } = useTranslation();

  const { data: matches, isLoading } = useQuery({
    queryKey: ['recipes-match', groupId],
    queryFn: () =>
      api.post<MatchedRecipe[]>('/api/recipes/match', {
        groupId,
        missingMaxCount: 3,
      }),
    enabled: !!groupId,
  });

  return (
    <Screen>
      <Text className="text-lg font-semibold text-ink-900 mb-3">{t('recipes.matchTitle')}</Text>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={matches ?? []}
          keyExtractor={(r) => r.recipeId}
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListEmptyComponent={
            <Text className="text-center text-ink-500 mt-12 px-4">{t('recipes.matchEmpty')}</Text>
          }
          renderItem={({ item }) => (
            <View className="bg-white rounded-2xl p-4 border border-ink-100">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-ink-900 flex-1 mr-2">{item.title}</Text>
                <View className="bg-primary-50 px-2 py-1 rounded-full">
                  <Text className="text-xs font-semibold text-primary-700">
                    {Math.round(item.score * 100)} %
                  </Text>
                </View>
              </View>
              {item.description ? (
                <Text className="text-sm text-ink-500 mt-1" numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}
              <View className="flex-row gap-3 mt-2">
                <Text className="text-xs text-ink-400">{t('recipes.prepTime', { minutes: item.prepMinutes })}</Text>
                <Text className="text-xs text-ink-400">{t('recipes.cookTime', { minutes: item.cookMinutes })}</Text>
                <Text className="text-xs text-ink-400">{t('recipes.servings', { count: item.servings })}</Text>
              </View>
              {item.missingIngredients.length > 0 ? (
                <Text className="text-xs text-amber-700 mt-2">
                  ⚠ {t('recipes.missingIngredients', { count: item.missingIngredients.length })} :{' '}
                  {item.missingIngredients.map((i) => i.name).join(', ')}
                </Text>
              ) : null}
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 60 }}
        />
      )}
    </Screen>
  );
}

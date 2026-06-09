import { useEffect } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { LoadingCenter } from '@/components/LoadingCenter';
import { EmptyState } from '@/components/EmptyState';
import { RecipeNavHub } from '@/components/recipes/RecipeNavHub';
import { api } from '@/lib/api-client';
import { useGroupId } from '@/hooks/useGroupId';

interface SuggestionRecipe {
  id: string;
  title: string;
  cuisine: string;
  prepMinutes: number;
  isFavorite?: boolean;
}

interface Suggestions {
  discovery: SuggestionRecipe[];
  seasonal: SuggestionRecipe[];
}

export default function RecipesDiscoverScreen() {
  const groupId = useGroupId();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery<Suggestions>({
    queryKey: ['meal-plan-discovery', groupId],
    queryFn: (): Promise<Suggestions> =>
      api.get<Suggestions>(
        `/api/meal-plan/suggestions?groupId=${groupId}&dayOfWeek=2&mealSlot=LUNCH`,
      ),
    enabled: !!groupId,
  });

  const dismissMutation = useMutation({
    mutationFn: (recipeIds: string[]) =>
      api.post('/api/meal-plan/dismiss-proposals', { recipeIds }),
  });

  useEffect(() => {
    const ids = [...(data?.discovery ?? []), ...(data?.seasonal ?? [])].map((r) => r.id);
    if (ids.length > 0) dismissMutation.mutate(ids);
  }, [data?.discovery, data?.seasonal]);

  const sections = [
    { key: 'discovery', title: t('discover.outOfComfort'), items: data?.discovery ?? [] },
    { key: 'seasonal', title: t('discover.seasonal'), items: data?.seasonal ?? [] },
  ];

  if (!groupId) return null;

  return (
    <Screen>
      <Stack.Screen options={{ title: t('discover.title') }} />
      <RecipeNavHub groupId={groupId} activeKey="discover" />
      <Text className="text-sm text-ink-600 mb-3">{t('discover.hint')}</Text>

      {isLoading ? (
        <LoadingCenter />
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(s) => s.key}
          ListEmptyComponent={<EmptyState message={t('discover.empty')} />}
          renderItem={({ item: section }) => (
            <View className="mb-6">
              <Text className="text-base font-bold text-ink-900 mb-2">{section.title}</Text>
              {section.items.length === 0 ? (
                <Text className="text-sm text-ink-500">{t('discover.sectionEmpty')}</Text>
              ) : (
                section.items.map((recipe: SuggestionRecipe) => (
                  <Pressable
                    key={recipe.id}
                    onPress={() =>
                      router.push({
                        pathname: '/(app)/groups/[groupId]/recipes/[recipeId]',
                        params: { groupId, recipeId: recipe.id },
                      })
                    }
                    className="flex-row items-center bg-white rounded-xl border border-ink-100 p-3 mb-2 active:bg-ink-50"
                  >
                    <View className="flex-1">
                      <Text className="font-semibold text-ink-900">{recipe.title}</Text>
                      <Text className="text-xs text-ink-500 mt-1">
                        {t(`cuisines.${recipe.cuisine}`, { defaultValue: recipe.cuisine })}
                      </Text>
                    </View>
                    {recipe.isFavorite ? <Text className="text-amber-500 text-xl mr-2">★</Text> : null}
                  </Pressable>
                ))
              )}
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 48 }}
        />
      )}
    </Screen>
  );
}

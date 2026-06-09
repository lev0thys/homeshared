import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { LoadingCenter } from '@/components/LoadingCenter';
import { EmptyState } from '@/components/EmptyState';
import { FavoriteStar } from '@/components/FavoriteStar';
import { ChipScrollRow } from '@/components/ChipScrollRow';
import { FilterChip } from '@/components/FilterChip';
import { api } from '@/lib/api-client';

interface RecipeRow {
  id: string;
  title: string;
  description: string | null;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  cuisine: string;
  isFavorite?: boolean;
}

export default function RecipesBrowseScreen() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [cuisine, setCuisine] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['recipe-categories'],
    queryFn: () => api.get<Array<{ cuisine: string; count: number }>>('/api/recipes/categories'),
  });

  const { data: recipes, isLoading } = useQuery<RecipeRow[]>({
    queryKey: ['recipes-all', cuisine],
    queryFn: (): Promise<RecipeRow[]> =>
      api.get<RecipeRow[]>(cuisine ? `/api/recipes?cuisine=${cuisine}` : '/api/recipes'),
  });

  const favoriteMutation = useMutation({
    mutationFn: ({ recipeId, next }: { recipeId: string; next: boolean }) =>
      next
        ? api.post(`/api/recipes/${recipeId}/favorite`, {})
        : api.delete(`/api/recipes/${recipeId}/favorite`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipes-all'] }),
  });

  return (
    <Screen>
      <Stack.Screen options={{ title: t('modules.RECIPES_BROWSE') }} />
      <View className="shrink-0 grow-0">
        <Text className="text-sm text-ink-600 mb-3">{t('recipesBrowse.hint')}</Text>

        <ChipScrollRow>
          <FilterChip active={cuisine === null} onPress={() => setCuisine(null)}>
            {t('recipes.allCategories')}
          </FilterChip>
          {(categories ?? []).map((c: { cuisine: string; count: number }) => (
            <FilterChip
              key={c.cuisine}
              active={cuisine === c.cuisine}
              onPress={() => setCuisine(c.cuisine)}
            >
              {t(`cuisines.${c.cuisine}`, { defaultValue: c.cuisine })} ({c.count})
            </FilterChip>
          ))}
        </ChipScrollRow>
      </View>

      {isLoading ? (
        <LoadingCenter />
      ) : (
        <FlatList
          className="flex-1"
          data={recipes ?? []}
          keyExtractor={(r) => r.id}
          ListEmptyComponent={<EmptyState message={t('recipesBrowse.empty')} />}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/(app)/tools/recipe/[recipeId]' as never,
                  params: { recipeId: item.id },
                })
              }
              className="flex-row items-center bg-white rounded-2xl p-4 border border-ink-100 active:bg-ink-50"
            >
              <FavoriteStar
                active={!!item.isFavorite}
                size="sm"
                onPress={() => favoriteMutation.mutate({ recipeId: item.id, next: !item.isFavorite })}
              />
              <View className="flex-1 ml-1">
                <Text className="text-lg font-bold text-ink-900">{item.title}</Text>
                {item.description ? (
                  <Text className="text-sm text-ink-500 mt-1" numberOfLines={2}>
                    {item.description}
                  </Text>
                ) : null}
                <Text className="text-xs text-ink-400 mt-2">
                  {t(`cuisines.${item.cuisine}`, { defaultValue: item.cuisine })} ·{' '}
                  {t('recipes.prepTime', { minutes: item.prepMinutes })}
                </Text>
              </View>
            </Pressable>
          )}
          contentContainerStyle={{ paddingBottom: 48 }}
        />
      )}
    </Screen>
  );
}

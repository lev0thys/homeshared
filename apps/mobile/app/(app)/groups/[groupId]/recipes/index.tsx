import { useCallback, useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { LoadingCenter } from '@/components/LoadingCenter';
import { EmptyState } from '@/components/EmptyState';
import { RecipeNavHub } from '@/components/recipes/RecipeNavHub';
import { SuperCategoryBar } from '@/components/recipes/SuperCategoryBar';
import { CuisineFilterBar } from '@/components/recipes/CuisineFilterBar';
import { RecipeListCard } from '@/components/recipes/RecipeListCard';
import { ServingsStepper } from '@/components/recipes/ServingsStepper';
import { api } from '@/lib/api-client';
import { useGroupId } from '@/hooks/useGroupId';
import {
  cuisineMatchesSuperGroup,
  type RecipeQuickFilter,
} from '@/lib/recipe-categories';
import type { MatchedRecipe } from '@/types/matched-recipe';

export default function RecipesScreen() {
  const groupId = useGroupId();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [targetServings, setTargetServings] = useState(2);
  const [cuisine, setCuisine] = useState<string | null>(null);
  const [superGroup, setSuperGroup] = useState('ALL');
  const [quickFilter, setQuickFilter] = useState<RecipeQuickFilter>('ALL');

  const { data: categories } = useQuery({
    queryKey: ['recipe-categories'],
    queryFn: () => api.get<Array<{ cuisine: string; count: number }>>('/api/recipes/categories'),
  });

  const { data: matches, isLoading } = useQuery<MatchedRecipe[]>({
    queryKey: ['recipes-match', groupId, targetServings, cuisine],
    queryFn: (): Promise<MatchedRecipe[]> =>
      api.post<MatchedRecipe[]>('/api/recipes/match', {
        groupId: groupId!,
        missingMaxCount: 8,
        targetServings,
        ...(cuisine ? { cuisine } : {}),
      }),
    enabled: !!groupId,
    refetchOnMount: 'always',
  });

  const filteredMatches = useMemo(() => {
    let list = matches ?? [];
    if (superGroup !== 'ALL') {
      list = list.filter((r: MatchedRecipe) => cuisineMatchesSuperGroup(r.cuisine, superGroup));
    }
    if (quickFilter === 'FAVORITES') {
      list = list.filter((r: MatchedRecipe) => r.isFavorite);
    } else if (quickFilter === 'QUICK') {
      list = list.filter(
        (r: MatchedRecipe) => (r.prepMinutes ?? 0) + (r.cookMinutes ?? 0) <= 30,
      );
    } else if (quickFilter === 'FRIDGE_READY') {
      list = list.filter(
        (r: MatchedRecipe) =>
          r.score >= 0.95 && r.missingIngredients.filter((m) => !m.optional).length === 0,
      );
    }
    return list;
  }, [matches, superGroup, quickFilter]);

  const favoriteMutation = useMutation({
    mutationFn: ({ recipeId, next }: { recipeId: string; next: boolean }) =>
      next
        ? api.post(`/api/recipes/${recipeId}/favorite`, {})
        : api.delete(`/api/recipes/${recipeId}/favorite`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipes-match', groupId] }),
  });

  const listHeader = useCallback(
    () => (
      <View className="pb-3">
        <RecipeNavHub groupId={groupId!} />
        <ServingsStepper value={targetServings} onChange={setTargetServings} />
        <SuperCategoryBar value={superGroup} onChange={setSuperGroup} />
        <CuisineFilterBar
          categories={categories ?? []}
          cuisine={cuisine}
          onCuisineChange={setCuisine}
          quickFilter={quickFilter}
          onQuickFilterChange={setQuickFilter}
        />
        {isLoading ? (
          <View className="py-8">
            <LoadingCenter />
          </View>
        ) : null}
      </View>
    ),
    [
      groupId,
      t,
      targetServings,
      superGroup,
      cuisine,
      quickFilter,
      categories,
      isLoading,
    ],
  );

  if (!groupId) {
    return (
      <Screen>
        <EmptyState message={t('groups.notFound')} />
      </Screen>
    );
  }

  return (
    <Screen safeBottom={false}>
      <FlatList
        style={{ flex: 1 }}
        data={isLoading ? [] : filteredMatches}
        keyExtractor={(r) => r.recipeId}
        ListHeaderComponent={listHeader}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListEmptyComponent={
          isLoading ? null : <EmptyState message={t('recipes.matchEmpty')} />
        }
        renderItem={({ item }) => (
          <View className="max-w-xl w-full self-center">
            <RecipeListCard
              item={item}
              onPress={() =>
                router.push({
                  pathname: '/(app)/groups/[groupId]/recipes/[recipeId]',
                  params: { groupId, recipeId: item.recipeId, servings: String(targetServings) },
                })
              }
              onToggleFavorite={() =>
                favoriteMutation.mutate({ recipeId: item.recipeId, next: !item.isFavorite })
              }
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        scrollEventThrottle={16}
        directionalLockEnabled
      />
    </Screen>
  );
}

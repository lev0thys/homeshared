import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { parseRecipeSteps } from '@homeshared/shared';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { LoadingCenter } from '@/components/LoadingCenter';
import { RecipeStepper } from '@/components/RecipeStepper';
import { FavoriteStar } from '@/components/FavoriteStar';
import { RecipeMissingBlock } from '@/components/RecipeMissingBlock';
import { IngredientAvatar } from '@/components/IngredientAvatar';
import { api } from '@/lib/api-client';
import { useGroupId } from '@/hooks/useGroupId';
import { useMutationError } from '@/hooks/useMutationError';
import { useUserCapabilities } from '@/hooks/useUserCapabilities';
import { useSessionStore } from '@/stores/session.store';
import type { MatchedRecipe } from '@/types/matched-recipe';

interface RecipeDetail {
  id: string;
  title: string;
  description: string | null;
  instructions: string;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  imageUrl: string | null;
  isFavorite?: boolean;
  ingredients: Array<{
    quantity: string;
    unit: string | null;
    optional: boolean;
    notes: string | null;
    ingredient: { nameFr: string; slug: string; category: string };
  }>;
}

export default function RecipeDetailScreen() {
  const groupId = useGroupId();
  const { recipeId, servings: servingsParam } = useLocalSearchParams<{
    recipeId: string;
    servings?: string;
  }>();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { error, capture, clearError } = useMutationError();
  const sessionUserId = useSessionStore((s) => s.user?.id);
  const { canManageShopping } = useUserCapabilities(groupId, sessionUserId);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(true);
  const targetServings = Math.max(1, Number.parseInt(servingsParam ?? '2', 10) || 2);

  const { data: recipe, isLoading } = useQuery<RecipeDetail>({
    queryKey: ['recipe', recipeId],
    queryFn: (): Promise<RecipeDetail> => api.get<RecipeDetail>(`/api/recipes/${recipeId}`),
    enabled: !!recipeId,
  });

  const { data: fridgeMatch } = useQuery({
    queryKey: ['recipe-fridge-match', recipeId, groupId, targetServings],
    queryFn: () =>
      api.get<MatchedRecipe>(
        `/api/recipes/${recipeId}/fridge-match?groupId=${groupId}&targetServings=${targetServings}`,
      ),
    enabled: !!recipeId && !!groupId,
  });

  const favoriteMutation = useMutation({
    mutationFn: (next: boolean) =>
      next
        ? api.post(`/api/recipes/${recipeId}/favorite`, {})
        : api.delete(`/api/recipes/${recipeId}/favorite`),
    onSuccess: () => {
      clearError();
      qc.invalidateQueries({ queryKey: ['recipe', recipeId] });
      qc.invalidateQueries({ queryKey: ['recipes-match', groupId] });
      qc.invalidateQueries({ queryKey: ['recipes-all'] });
    },
    onError: (err) => capture(err),
  });

  const addMissingMutation = useMutation({
    mutationFn: () =>
      api.post<{ added: number }>(`/api/recipes/${recipeId}/shopping-missing`, {
        groupId: groupId!,
        targetServings,
      }),
    onSuccess: (result) => {
      clearError();
      qc.invalidateQueries({ queryKey: ['shopping', groupId] });
      qc.invalidateQueries({ queryKey: ['recipe-fridge-match', recipeId, groupId] });
      qc.invalidateQueries({ queryKey: ['recipes-match', groupId] });
      setSuccessMsg(t('recipes.addedToShopping', { count: result.added }));
    },
    onError: (err) => capture(err),
  });

  const scale = recipe ? targetServings / Math.max(1, recipe.servings) : 1;
  const steps = recipe ? parseRecipeSteps(recipe.instructions) : [];

  return (
    <Screen>
      <Stack.Screen options={{ title: recipe?.title ?? t('recipes.title') }} />
      {isLoading || !recipe ? (
        <LoadingCenter />
      ) : (
        <ScrollView className="gap-4" contentContainerStyle={{ paddingBottom: 48 }}>
          <View className="flex-row items-center justify-between">
            <FavoriteStar
              active={!!recipe.isFavorite}
              onPress={() => favoriteMutation.mutate(!recipe.isFavorite)}
              disabled={favoriteMutation.isPending}
            />
            {groupId && canManageShopping ? (
              <Button
                variant="secondary"
                onPress={() => addMissingMutation.mutate(undefined)}
                loading={addMissingMutation.isPending}
              >
                {t('recipes.addMissingToShopping')}
              </Button>
            ) : null}
          </View>

          {recipe.description ? (
            <Text className="text-base text-ink-600">{recipe.description}</Text>
          ) : null}

          <View className="flex-row flex-wrap gap-3">
            <Text className="text-sm text-ink-500">
              {t('recipes.prepTime', { minutes: recipe.prepMinutes })}
            </Text>
            <Text className="text-sm text-ink-500">
              {t('recipes.cookTime', { minutes: recipe.cookMinutes })}
            </Text>
            <Text className="text-sm text-ink-500">
              {t('recipes.servings', { count: targetServings })}
            </Text>
          </View>

          {fridgeMatch && groupId ? (
            <View className="bg-ink-50 rounded-xl p-3">
              <Text className="text-sm font-semibold text-ink-800 mb-1">{t('recipes.fridgeMatch')}</Text>
              <RecipeMissingBlock
                missing={fridgeMatch.missingIngredients}
                score={fridgeMatch.score}
              />
            </View>
          ) : null}

          <View>
            <Text className="text-lg font-bold text-ink-900 mb-2">{t('recipes.ingredients')}</Text>
            {recipe.ingredients.map((line: RecipeDetail['ingredients'][number]) => {
              const q = Math.ceil(Number(line.quantity) * scale * 10) / 10;
              const missingLine = fridgeMatch?.missingIngredients.find(
                (m: MatchedRecipe['missingIngredients'][number]) => m.slug === line.ingredient.slug,
              );
              return (
                <View key={line.ingredient.slug} className="flex-row items-center gap-3 py-2">
                  <IngredientAvatar
                    name={line.ingredient.nameFr}
                    category={line.ingredient.category}
                    size="sm"
                  />
                  <Text
                    className={`flex-1 ${missingLine && !line.optional ? 'text-amber-800' : 'text-ink-800'}`}
                  >
                    {line.ingredient.nameFr} — {q} {line.unit ?? ''}
                    {line.optional ? ` (${t('recipes.optional')})` : ''}
                    {missingLine && !line.optional ? ' ⚠' : ''}
                  </Text>
                </View>
              );
            })}
          </View>

          <View>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-ink-900">{t('recipes.instructions')}</Text>
              <Pressable onPress={() => setShowSteps((v) => !v)} className="min-h-[44px] justify-center">
                <Text className="text-sm text-primary-700 font-medium">
                  {showSteps ? t('recipes.viewPlain') : t('recipes.viewSteps')}
                </Text>
              </Pressable>
            </View>
            {showSteps ? (
              <RecipeStepper steps={steps} />
            ) : (
              <Text className="text-ink-800 leading-6 whitespace-pre-wrap">{recipe.instructions}</Text>
            )}
          </View>

          {successMsg ? <Text className="text-sm text-emerald-700 mt-2">{successMsg}</Text> : null}
          {error ? <Text className="text-sm text-red-600 mt-2">{error}</Text> : null}
        </ScrollView>
      )}
    </Screen>
  );
}

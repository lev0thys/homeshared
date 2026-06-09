import { ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { parseRecipeSteps } from '@homeshared/shared';
import { Screen } from '@/components/Screen';
import { LoadingCenter } from '@/components/LoadingCenter';
import { RecipeStepper } from '@/components/RecipeStepper';
import { IngredientAvatar } from '@/components/IngredientAvatar';
import { api } from '@/lib/api-client';

interface RecipeDetail {
  id: string;
  title: string;
  description: string | null;
  instructions: string;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  ingredients: Array<{
    quantity: string;
    unit: string | null;
    optional: boolean;
    ingredient: { nameFr: string; slug: string; category: string };
  }>;
}

export default function RecipeBrowseDetailScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const { t } = useTranslation();

  const { data: recipe, isLoading } = useQuery<RecipeDetail>({
    queryKey: ['recipe', recipeId],
    queryFn: (): Promise<RecipeDetail> => api.get<RecipeDetail>(`/api/recipes/${recipeId}`),
    enabled: !!recipeId,
  });

  const steps = recipe ? parseRecipeSteps(recipe.instructions) : [];

  return (
    <Screen>
      <Stack.Screen options={{ title: recipe?.title ?? t('recipes.title') }} />
      {isLoading || !recipe ? (
        <LoadingCenter />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 48 }} className="gap-4">
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
              {t('recipes.servings', { count: recipe.servings })}
            </Text>
          </View>

          <View>
            <Text className="text-lg font-bold text-ink-900 mb-2">{t('recipes.ingredients')}</Text>
            {recipe.ingredients.map((line: RecipeDetail['ingredients'][number]) => (
              <View key={line.ingredient.slug} className="flex-row items-center gap-3 py-2">
                <IngredientAvatar name={line.ingredient.nameFr} category={line.ingredient.category} size="sm" />
                <Text className="text-ink-800 flex-1">
                  {line.ingredient.nameFr} — {Number(line.quantity)} {line.unit ?? ''}
                  {line.optional ? ` (${t('recipes.optional')})` : ''}
                </Text>
              </View>
            ))}
          </View>

          <View>
            <Text className="text-lg font-bold text-ink-900 mb-3">{t('recipes.instructions')}</Text>
            <RecipeStepper steps={steps} />
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}

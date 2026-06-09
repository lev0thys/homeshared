import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { MatchedRecipe } from '@/types/matched-recipe';

function formatMissingLine(
  ing: MatchedRecipe['missingIngredients'][number],
  t: (key: string, opts?: Record<string, unknown>) => string,
): string {
  const unit = ing.unit ? ` ${ing.unit}` : '';
  if (ing.reason === 'insufficient') {
    return t('recipes.insufficientIngredient', {
      name: ing.name,
      have: ing.availableQuantity,
      need: ing.quantity,
      unit: ing.unit ?? '',
    });
  }
  return `${ing.name} (${ing.quantity}${unit})`;
}

interface RecipeMissingBlockProps {
  missing: MatchedRecipe['missingIngredients'];
  score: number;
}

export function RecipeMissingBlock({ missing, score }: RecipeMissingBlockProps) {
  const { t } = useTranslation();
  const required = missing.filter((m) => !m.optional);

  return (
    <View className="mt-2 gap-1">
      <View className="flex-row items-center gap-2">
        <View className="bg-primary-50 px-2 py-1 rounded-full">
          <Text className="text-xs font-semibold text-primary-700">
            {Math.round(score * 100)} %
          </Text>
        </View>
        {required.length === 0 ? (
          <Text className="text-xs text-emerald-700">{t('recipes.allIngredientsOk')}</Text>
        ) : (
          <Text className="text-xs text-amber-800 font-medium">
            {t('recipes.missingCount', { count: required.length })}
          </Text>
        )}
      </View>
      {required.length > 0 ? (
        <Text className="text-xs text-amber-700 leading-5">
          {required.map((ing) => formatMissingLine(ing, t)).join(' · ')}
        </Text>
      ) : null}
    </View>
  );
}

import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChipScrollRow } from '@/components/ChipScrollRow';
import { ChipWrapRow } from '@/components/ChipWrapRow';
import { FilterChip } from '@/components/FilterChip';
import { CUISINE_EMOJI, type RecipeQuickFilter, RECIPE_QUICK_FILTERS } from '@/lib/recipe-categories';

interface CuisineFilterBarProps {
  categories: Array<{ cuisine: string; count: number }>;
  cuisine: string | null;
  onCuisineChange: (cuisine: string | null) => void;
  quickFilter: RecipeQuickFilter;
  onQuickFilterChange: (filter: RecipeQuickFilter) => void;
}

export function CuisineFilterBar({
  categories,
  cuisine,
  onCuisineChange,
  quickFilter,
  onQuickFilterChange,
}: CuisineFilterBarProps) {
  const { t } = useTranslation();

  return (
    <View className="shrink-0 grow-0 w-full">
      <ChipWrapRow>
        {RECIPE_QUICK_FILTERS.map((key) => (
          <FilterChip
            key={key}
            active={quickFilter === key}
            onPress={() => onQuickFilterChange(key)}
          >
            {t(`recipes.quickFilters.${key}`)}
          </FilterChip>
        ))}
      </ChipWrapRow>

      <ChipScrollRow>
        <FilterChip active={cuisine === null} onPress={() => onCuisineChange(null)}>
          {t('recipes.allCategories')}
        </FilterChip>
        {categories.map((c) => (
          <FilterChip
            key={c.cuisine}
            active={cuisine === c.cuisine}
            variant="rounded"
            onPress={() => onCuisineChange(c.cuisine)}
          >
            <Text className={`text-sm ${cuisine === c.cuisine ? 'text-white font-medium' : 'text-ink-700'}`}>
              {CUISINE_EMOJI[c.cuisine] ?? '🍽️'}{' '}
              {t(`cuisines.${c.cuisine}`, { defaultValue: c.cuisine })} ({c.count})
            </Text>
          </FilterChip>
        ))}
      </ChipScrollRow>
    </View>
  );
}

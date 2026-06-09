import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChipWrapRow } from '@/components/ChipWrapRow';
import { FilterChip } from '@/components/FilterChip';
import { RECIPE_SUPER_GROUPS } from '@/lib/recipe-categories';

interface SuperCategoryBarProps {
  value: string;
  onChange: (id: string) => void;
}

export function SuperCategoryBar({ value, onChange }: SuperCategoryBarProps) {
  const { t } = useTranslation();

  return (
    <ChipWrapRow>
      {RECIPE_SUPER_GROUPS.map((group) => {
        const active = value === group.id;
        return (
          <FilterChip
            key={group.id}
            active={active}
            variant="rounded"
            onPress={() => onChange(group.id)}
            className={active ? 'bg-primary-700 border-primary-700' : ''}
          >
            <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-ink-800'}`}>
              {t(`recipes.superGroups.${group.id}`)}
            </Text>
          </FilterChip>
        );
      })}
    </ChipWrapRow>
  );
}

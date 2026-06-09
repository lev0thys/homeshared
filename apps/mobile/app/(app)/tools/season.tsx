import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { LoadingCenter } from '@/components/LoadingCenter';
import { ChipScrollRow } from '@/components/ChipScrollRow';
import { FilterChip } from '@/components/FilterChip';
import { SeasonAccordionSection } from '@/components/season/SeasonAccordionSection';
import { SeasonProduceRow } from '@/components/season/SeasonProduceRow';
import { api } from '@/lib/api-client';
import { useMonthLabels } from '@/hooks/useMonthLabels';
import { useHubFavorites } from '@/hooks/useHubFavorites';
import { staticCatalogQueryOptions } from '@/lib/query-options';

interface SeasonProduce {
  slug: string;
  nameFr: string;
  category: 'FRUIT' | 'VEGETABLE';
  months: number[];
  tip?: string;
}

type SectionId = 'favorites' | 'fruits' | 'vegetables';

const DEFAULT_OPEN: Record<SectionId, boolean> = {
  favorites: false,
  fruits: false,
  vegetables: false,
};

export default function SeasonScreen() {
  const { t } = useTranslation();
  const months = useMonthLabels();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [openSections, setOpenSections] = useState(DEFAULT_OPEN);
  const { favorites, toggle, isFavorite } = useHubFavorites('seasonProduce');

  const { data, isLoading } = useQuery<{ month: number; produce: SeasonProduce[] }>({
    queryKey: ['tools-season', month],
    queryFn: (): Promise<{ month: number; produce: SeasonProduce[] }> =>
      api.get<{ month: number; produce: SeasonProduce[] }>(`/api/tools/season?month=${month}`),
    ...staticCatalogQueryOptions,
  });

  const produce = data?.produce ?? [];

  const { favoriteItems, fruits, vegetables } = useMemo(() => {
    const favoriteItems: SeasonProduce[] = [];
    const fruits: SeasonProduce[] = [];
    const vegetables: SeasonProduce[] = [];
    for (const p of produce) {
      if (favorites.has(p.slug)) {
        favoriteItems.push(p);
      } else if (p.category === 'FRUIT') {
        fruits.push(p);
      } else {
        vegetables.push(p);
      }
    }
    return { favoriteItems, fruits, vegetables };
  }, [produce, favorites]);

  const toggleSection = (id: SectionId) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderList = (items: SeasonProduce[], emptyKey: 'season.empty' | 'season.favoritesEmpty') => {
    if (items.length === 0) {
      return <Text className="text-ink-400 text-sm mb-2">{t(emptyKey)}</Text>;
    }
    return items.map((p) => (
      <SeasonProduceRow
        key={p.slug}
        item={p}
        isFavorite={isFavorite(p.slug)}
        onToggleFavorite={() => void toggle(p.slug)}
      />
    ));
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t('modules.SEASON') }} />
      <View className="shrink-0 grow-0">
        <Text className="text-sm text-ink-600 mb-4">{t('season.hint')}</Text>

        <ChipScrollRow className="mb-4">
          {months.map((item) => (
            <FilterChip
              key={item.value}
              active={month === item.value}
              onPress={() => setMonth(item.value)}
              className={
                month === item.value ? 'bg-primary-600 border-primary-600' : undefined
              }
              textClassName={month === item.value ? 'text-white' : 'text-ink-700'}
            >
              {item.short}
            </FilterChip>
          ))}
        </ChipScrollRow>
      </View>

      {isLoading ? (
        <LoadingCenter />
      ) : (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
          <SeasonAccordionSection
            title={t('season.favorites')}
            count={favoriteItems.length}
            open={openSections.favorites}
            onToggle={() => toggleSection('favorites')}
          >
            {renderList(favoriteItems, 'season.favoritesEmpty')}
          </SeasonAccordionSection>

          <SeasonAccordionSection
            title={t('season.fruits')}
            count={fruits.length}
            open={openSections.fruits}
            onToggle={() => toggleSection('fruits')}
          >
            {renderList(fruits, 'season.empty')}
          </SeasonAccordionSection>

          <SeasonAccordionSection
            title={t('season.vegetables')}
            count={vegetables.length}
            open={openSections.vegetables}
            onToggle={() => toggleSection('vegetables')}
          >
            {renderList(vegetables, 'season.empty')}
          </SeasonAccordionSection>
        </ScrollView>
      )}
    </Screen>
  );
}

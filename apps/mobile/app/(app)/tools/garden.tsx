import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { LoadingCenter } from '@/components/LoadingCenter';
import { ChipScrollRow } from '@/components/ChipScrollRow';
import { FilterChip } from '@/components/FilterChip';
import { GardenTaskRow, type GardenAction, type GardenTaskItem } from '@/components/garden/GardenTaskRow';
import { SeasonAccordionSection } from '@/components/season/SeasonAccordionSection';
import { api } from '@/lib/api-client';
import { useMonthLabels } from '@/hooks/useMonthLabels';
import { useHubFavorites } from '@/hooks/useHubFavorites';
import { staticCatalogQueryOptions } from '@/lib/query-options';

const GARDEN_ACTIONS: GardenAction[] = ['semis', 'plantation', 'bouture', 'recolte'];

type SectionId = 'favorites' | GardenAction;

const DEFAULT_OPEN: Record<SectionId, boolean> = {
  favorites: false,
  semis: false,
  plantation: false,
  bouture: false,
  recolte: false,
};

export default function GardenScreen() {
  const { t } = useTranslation();
  const months = useMonthLabels();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [openSections, setOpenSections] = useState(DEFAULT_OPEN);
  const { favorites, toggle, isFavorite } = useHubFavorites('gardenTasks');

  const { data, isLoading } = useQuery({
    queryKey: ['tools-garden', month],
    queryFn: () =>
      api.get<{ month: number; tasks: GardenTaskItem[] }>(`/api/tools/garden?month=${month}`),
    ...staticCatalogQueryOptions,
  });

  const tasks = data?.tasks ?? [];

  const { favoriteItems, byAction } = useMemo(() => {
    const favoriteItems: GardenTaskItem[] = [];
    const byAction: Record<GardenAction, GardenTaskItem[]> = {
      semis: [],
      plantation: [],
      bouture: [],
      recolte: [],
    };

    for (const task of tasks) {
      if (favorites.has(task.slug)) {
        favoriteItems.push(task);
      } else {
        const action = task.action as GardenAction;
        byAction[action].push(task);
      }
    }

    return { favoriteItems, byAction };
  }, [tasks, favorites]);

  const toggleSection = (id: SectionId) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderList = (items: GardenTaskItem[], emptyKey: 'garden.empty' | 'garden.favoritesEmpty') => {
    if (items.length === 0) {
      return <Text className="text-ink-400 text-sm mb-2">{t(emptyKey)}</Text>;
    }
    return items.map((task) => (
      <GardenTaskRow
        key={task.slug}
        item={task}
        isFavorite={isFavorite(task.slug)}
        onToggleFavorite={() => void toggle(task.slug)}
      />
    ));
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t('modules.GARDEN') }} />
      <View className="shrink-0 grow-0">
        <Text className="text-sm text-ink-600 mb-1">{t('garden.hint')}</Text>
        <Text className="text-xs text-amber-700 mb-3">{t('garden.betaNote')}</Text>

        <ChipScrollRow className="mb-4">
          {months.map((item) => (
            <FilterChip
              key={item.value}
              active={month === item.value}
              onPress={() => setMonth(item.value)}
              className={
                month === item.value ? 'bg-emerald-600 border-emerald-600' : undefined
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
            title={t('garden.favorites')}
            count={favoriteItems.length}
            open={openSections.favorites}
            onToggle={() => toggleSection('favorites')}
          >
            {renderList(favoriteItems, 'garden.favoritesEmpty')}
          </SeasonAccordionSection>

          {GARDEN_ACTIONS.map((action) => (
            <SeasonAccordionSection
              key={action}
              title={t(`garden.action.${action}`)}
              count={byAction[action].length}
              open={openSections[action]}
              onToggle={() => toggleSection(action)}
            >
              {renderList(byAction[action], 'garden.empty')}
            </SeasonAccordionSection>
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}

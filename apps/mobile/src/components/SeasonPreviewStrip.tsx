import { Pressable, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api-client';
import { IngredientAvatar } from '@/components/IngredientAvatar';
import { HorizontalSwipeRow } from '@/components/HorizontalSwipeRow';
import { staticCatalogQueryOptions } from '@/lib/query-options';

interface SeasonProduce {
  slug: string;
  nameFr: string;
  category: 'FRUIT' | 'VEGETABLE';
}

/** Produits de saison — swipe horizontal (pas de Pressable parent qui bloque le geste). */
export function SeasonPreviewStrip() {
  const { t } = useTranslation();
  const month = new Date().getMonth() + 1;

  const { data } = useQuery<{ produce: SeasonProduce[] }>({
    queryKey: ['tools-season-preview', month],
    queryFn: (): Promise<{ produce: SeasonProduce[] }> =>
      api.get<{ produce: SeasonProduce[] }>(`/api/tools/season?month=${month}`),
    ...staticCatalogQueryOptions,
  });

  const produce = (data?.produce ?? []).slice(0, 6);
  if (produce.length === 0) return null;

  return (
    <View className="bg-emerald-50/90 border border-emerald-100 rounded-2xl py-2 mb-3">
      <View className="flex-row items-center justify-between px-3 pb-1">
        <Text className="text-xs font-semibold text-emerald-900">🍂 {t('modules.SEASON')}</Text>
        <Pressable
          onPress={() => router.push('/(app)/tools/season' as never)}
          accessibilityRole="button"
          accessibilityLabel={t('modules.SEASON')}
          hitSlop={8}
          className="active:opacity-70"
        >
          <Text className="text-xs font-medium text-primary-700">{t('common.seeAll')}</Text>
        </Pressable>
      </View>
      <HorizontalSwipeRow contentContainerStyle={{ paddingHorizontal: 10, gap: 8, alignItems: 'center' }}>
        {produce.map((p: SeasonProduce) => (
          <Pressable
            key={p.slug}
            onPress={() => router.push('/(app)/tools/season' as never)}
            className="flex-row items-center gap-1 bg-white/90 rounded-xl px-2 py-1 border border-emerald-100/80 active:opacity-80"
          >
            <IngredientAvatar name={p.nameFr} category={p.category} size="sm" />
            <Text className="text-xs text-ink-800">{p.nameFr}</Text>
          </Pressable>
        ))}
      </HorizontalSwipeRow>
    </View>
  );
}

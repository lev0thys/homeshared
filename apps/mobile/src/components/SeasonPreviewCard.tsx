import { Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { api } from '@/lib/api-client';
import { IngredientAvatar } from '@/components/IngredientAvatar';
import { staticCatalogQueryOptions } from '@/lib/query-options';

interface SeasonProduce {
  slug: string;
  nameFr: string;
  category: 'FRUIT' | 'VEGETABLE';
  tip?: string;
}

/** Aperçu saison sur le hub — incite à ouvrir l'écran complet. */
export function SeasonPreviewCard() {
  const { t } = useTranslation();
  const month = new Date().getMonth() + 1;

  const { data } = useQuery<{ produce: SeasonProduce[] }>({
    queryKey: ['tools-season-preview', month],
    queryFn: (): Promise<{ produce: SeasonProduce[] }> =>
      api.get<{ produce: SeasonProduce[] }>(`/api/tools/season?month=${month}`),
    ...staticCatalogQueryOptions,
  });

  const produce = (data?.produce ?? []).slice(0, 4);
  if (produce.length === 0) return null;

  return (
    <Pressable
      onPress={() => router.push('/(app)/tools/season' as never)}
      className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4 active:bg-emerald-100"
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="font-bold text-emerald-900">{t('season.previewTitle')}</Text>
        <Text className="text-xs text-emerald-700">{t('season.previewSeeAll')} →</Text>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {produce.map((p: SeasonProduce) => (
          <View key={p.slug} className="flex-row items-center gap-1.5 bg-white/80 rounded-xl px-2 py-1">
            <IngredientAvatar name={p.nameFr} category={p.category} size="sm" />
            <Text className="text-sm text-ink-800">{p.nameFr}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

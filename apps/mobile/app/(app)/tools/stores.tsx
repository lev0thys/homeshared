import { useState, useEffect } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { LoadingCenter } from '@/components/LoadingCenter';
import { api } from '@/lib/api-client';
import { useMutationError } from '@/hooks/useMutationError';

interface StoreProduct {
  store: string;
  label: string;
  priceEur: number;
  unit: string;
  searchUrl: string;
}

interface CompareResult {
  lines: Array<{
    itemName: string;
    bestStore: string;
    bestPriceEur: number;
    offers: StoreProduct[];
  }>;
  totals: Record<string, number>;
  cheapestStore: string;
}

function parseListText(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

export default function StoresScreen() {
  const { t } = useTranslation();
  const { prefill } = useLocalSearchParams<{ prefill?: string }>();
  const [query, setQuery] = useState('');
  const [listText, setListText] = useState('');
  const { error, capture, clearError } = useMutationError();

  const compareMutation = useMutation({
    mutationFn: (itemsOverride?: string[]) => {
      const items = itemsOverride ?? parseListText(listText);
      return api.post<CompareResult>('/api/stores/compare', { items });
    },
    onSuccess: () => clearError(),
    onError: (err) => capture(err),
  });

  useEffect(() => {
    if (!prefill?.trim()) return;
    setListText(prefill);
    const items = parseListText(prefill);
    if (items.length > 0) compareMutation.mutate(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill]);

  const { data: suggestions, isFetching } = useQuery({
    queryKey: ['stores-suggest', query],
    queryFn: () => api.get<StoreProduct[]>(`/api/stores/suggest?q=${encodeURIComponent(query)}`),
    enabled: query.trim().length >= 2,
  });

  const result = compareMutation.data;

  return (
    <Screen keyboard>
      <Stack.Screen options={{ title: t('modules.STORES') }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
      <Text className="text-sm text-ink-600 mb-1">{t('stores.hint')}</Text>
      <Text className="text-xs text-amber-700 mb-4">{t('stores.betaNote')}</Text>

      <Text className="font-semibold text-ink-900 mb-2">{t('stores.searchTitle')}</Text>
      <Input placeholder={t('stores.searchPlaceholder')} value={query} onChangeText={setQuery} />
      {isFetching ? <LoadingCenter /> : null}
      {(suggestions ?? []).slice(0, 6).map((p: StoreProduct) => (
        <Pressable
          key={`${p.store}-${p.label}`}
          onPress={() => Linking.openURL(p.searchUrl)}
          className="bg-white rounded-xl p-3 mt-2 border border-ink-100 flex-row justify-between items-center min-h-[48px]"
        >
          <View className="flex-1 mr-2">
            <Text className="font-medium text-ink-900">{p.label}</Text>
            <Text className="text-xs text-ink-400 capitalize">{p.store}</Text>
          </View>
          <Text className="font-bold text-primary-700">{p.priceEur.toFixed(2)} €</Text>
        </Pressable>
      ))}

      <View className="h-6" />

      <Text className="font-semibold text-ink-900 mb-2">{t('stores.compareTitle')}</Text>
      <Input
        placeholder={t('stores.comparePlaceholder')}
        value={listText}
        onChangeText={setListText}
        multiline
        className="min-h-[100px]"
      />
      <View className="mt-2">
        <Button
          onPress={() => compareMutation.mutate(undefined)}
          loading={compareMutation.isPending}
          disabled={!listText.trim()}
        >
          {t('stores.compareButton')}
        </Button>
      </View>

      {error ? <Text className="text-red-600 text-sm mt-2">{error}</Text> : null}

      {result ? (
        <View className="mt-4 gap-3">
          <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <Text className="font-bold text-emerald-900">{t('stores.cheapest')}</Text>
            <Text className="text-lg capitalize text-emerald-800 mt-1">
              {result.cheapestStore} — {result.totals[result.cheapestStore]?.toFixed(2)} €
            </Text>
          </View>

          {(['leclerc', 'auchan', 'carrefour'] as const).map((chain) => (
            <Text key={chain} className="text-sm text-ink-600 capitalize">
              {chain}: {result.totals[chain]?.toFixed(2)} €
            </Text>
          ))}

          {result.lines.map((item) => (
            <View key={item.itemName} className="bg-white rounded-xl p-3 mb-2 border border-ink-100">
              <Text className="font-medium text-ink-900">{item.itemName}</Text>
              <Text className="text-xs text-ink-500 mt-1">
                {t('stores.bestOffer', {
                  store: item.bestStore,
                  price: item.bestPriceEur.toFixed(2),
                })}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
      </ScrollView>
    </Screen>
  );
}

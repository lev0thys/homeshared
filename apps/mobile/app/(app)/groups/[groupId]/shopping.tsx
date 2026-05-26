import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { api } from '@/lib/api-client';

interface ShoppingItemRow {
  id: string;
  name: string;
  quantity: string;
  unit: string | null;
  notes: string | null;
  addedAt: string;
  purchasedAt: string | null;
  addedBy: { id: string; displayName: string; username: string };
  purchasedBy: { id: string; displayName: string } | null;
}

export default function ShoppingListScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');

  const { data: items, isLoading } = useQuery({
    queryKey: ['shopping', groupId],
    queryFn: () => api.get<ShoppingItemRow[]>(`/api/shopping/${groupId}`),
    enabled: !!groupId,
  });

  const addMutation = useMutation({
    mutationFn: () =>
      api.post('/api/shopping', {
        groupId,
        name: name.trim(),
        quantity: Number(quantity) || 1,
      }),
    onSuccess: () => {
      setName('');
      setQuantity('1');
      qc.invalidateQueries({ queryKey: ['shopping', groupId] });
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: (itemId: string) => api.post(`/api/shopping/${itemId}/purchase`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shopping', groupId] });
      qc.invalidateQueries({ queryKey: ['fridge', groupId] });
    },
  });

  const unpurchaseMutation = useMutation({
    mutationFn: (itemId: string) => api.post(`/api/shopping/${itemId}/unpurchase`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shopping', groupId] });
      qc.invalidateQueries({ queryKey: ['fridge', groupId] });
    },
  });

  return (
    <Screen>
      <View className="gap-3 mb-3">
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Input placeholder={t('shopping.itemName')} value={name} onChangeText={setName} />
          </View>
          <View className="w-20">
            <Input
              placeholder={t('shopping.quantity')}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
          </View>
        </View>
        <Button
          onPress={() => addMutation.mutate()}
          disabled={!name.trim()}
          loading={addMutation.isPending}
        >
          {t('shopping.addItem')}
        </Button>
      </View>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={items ?? []}
          keyExtractor={(i) => i.id}
          ItemSeparatorComponent={() => <View className="h-2" />}
          ListEmptyComponent={
            <Text className="text-center text-ink-500 mt-12">{t('shopping.empty')}</Text>
          }
          renderItem={({ item }) => {
            const isPurchased = !!item.purchasedAt;
            return (
              <Pressable
                onPress={() =>
                  isPurchased ? unpurchaseMutation.mutate(item.id) : purchaseMutation.mutate(item.id)
                }
                className={`bg-white rounded-2xl px-4 py-3 border ${
                  isPurchased ? 'border-emerald-200 bg-emerald-50' : 'border-ink-100'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 mr-2">
                    <Text
                      className={`text-base font-medium ${
                        isPurchased ? 'text-ink-400 line-through' : 'text-ink-900'
                      }`}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-xs text-ink-400 mt-1">
                      {t('shopping.addedBy', { name: item.addedBy.displayName })}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-semibold text-ink-700">
                      {Number(item.quantity)} {item.unit ?? ''}
                    </Text>
                    <Text className={`text-xs mt-1 ${isPurchased ? 'text-emerald-700' : 'text-primary-700'}`}>
                      {isPurchased ? t('shopping.uncheck') : t('shopping.markPurchased')}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
          contentContainerStyle={{ paddingBottom: 60 }}
        />
      )}
    </Screen>
  );
}

import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { api } from '@/lib/api-client';

interface FridgeItemRow {
  id: string;
  name: string;
  quantity: string;
  unit: string | null;
  expiresAt: string | null;
}

export default function FridgeScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { t } = useTranslation();

  const { data: items, isLoading } = useQuery({
    queryKey: ['fridge', groupId],
    queryFn: () => api.get<FridgeItemRow[]>(`/api/fridge/${groupId}`),
    enabled: !!groupId,
  });

  return (
    <Screen>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={items ?? []}
          keyExtractor={(i) => i.id}
          ItemSeparatorComponent={() => <View className="h-2" />}
          ListEmptyComponent={
            <Text className="text-center text-ink-500 mt-12">{t('fridge.empty')}</Text>
          }
          renderItem={({ item }) => (
            <View className="bg-white rounded-2xl px-4 py-3 border border-ink-100">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-medium text-ink-900 flex-1 capitalize">{item.name}</Text>
                <Text className="font-semibold text-ink-700">
                  {Number(item.quantity)} {item.unit ?? ''}
                </Text>
              </View>
              {item.expiresAt ? (
                <Text className="text-xs text-amber-600 mt-1">
                  {t('fridge.expiresOn', {
                    date: new Date(item.expiresAt).toLocaleDateString('fr-FR'),
                  })}
                </Text>
              ) : null}
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 60 }}
        />
      )}
    </Screen>
  );
}

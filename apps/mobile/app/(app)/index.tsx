import { FlatList, Pressable, Text, View } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { api } from '@/lib/api-client';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

interface GroupListItem {
  id: string;
  name: string;
  description: string | null;
  _count: { memberships: number };
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => api.get<GroupListItem[]>('/api/groups'),
  });

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  }

  return (
    <Screen>
      <Stack.Screen
        options={{
          title: t('groups.title'),
          headerRight: () => (
            <Pressable onPress={handleLogout} className="px-2">
              <Text className="text-white text-sm">{t('auth.logout')}</Text>
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={groups ?? []}
        keyExtractor={(g) => g.id}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListEmptyComponent={
          !isLoading ? (
            <Text className="text-center text-ink-500 px-6 mt-12">{t('groups.empty')}</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Link href={`/(app)/groups/${item.id}`} asChild>
            <Pressable className="bg-white border border-ink-100 rounded-2xl p-4 active:bg-ink-50">
              <Text className="text-lg font-semibold text-ink-900">{item.name}</Text>
              {item.description ? (
                <Text className="text-sm text-ink-500 mt-1" numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}
              <Text className="text-xs text-ink-400 mt-2">
                {item._count.memberships} {t('groups.members').toLowerCase()}
              </Text>
            </Pressable>
          </Link>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View className="absolute bottom-6 left-4 right-4">
        <Button onPress={() => router.push('/(app)/groups/new')}>{t('groups.newGroup')}</Button>
      </View>
    </Screen>
  );
}

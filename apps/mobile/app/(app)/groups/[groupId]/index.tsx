import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { api } from '@/lib/api-client';

interface GroupDetail {
  id: string;
  name: string;
  description: string | null;
  memberships: Array<{
    id: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    user: { id: string; username: string; displayName: string; avatarUrl: string | null };
  }>;
}

export default function GroupHomeScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { t } = useTranslation();
  const qc = useQueryClient();

  const { data: group, isLoading } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => api.get<GroupDetail>(`/api/groups/${groupId}`),
    enabled: !!groupId,
  });

  const inviteMutation = useMutation({
    mutationFn: () =>
      api.post<{ token: string; expiresAt: string }>('/api/groups/invites', { groupId }),
    onSuccess: (invite) => {
      qc.invalidateQueries({ queryKey: ['group', groupId] });
      console.log('Token d\'invitation :', invite.token);
    },
  });

  if (isLoading || !group) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="gap-4 mt-2">
        <View>
          <Text className="text-2xl font-bold text-ink-900">{group.name}</Text>
          {group.description ? (
            <Text className="text-sm text-ink-500 mt-1">{group.description}</Text>
          ) : null}
        </View>

        <View>
          <Text className="text-base font-semibold text-ink-900 mb-2">{t('groups.members')}</Text>
          <FlatList
            data={group.memberships}
            keyExtractor={(m) => m.id}
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderItem={({ item }) => (
              <View className="bg-white rounded-2xl px-4 py-3 flex-row items-center justify-between border border-ink-100">
                <View>
                  <Text className="font-medium text-ink-900">{item.user.displayName}</Text>
                  <Text className="text-xs text-ink-400">@{item.user.username}</Text>
                </View>
                <Text className="text-xs text-primary-700 font-semibold">{item.role}</Text>
              </View>
            )}
          />
        </View>

        <Button onPress={() => inviteMutation.mutate()} loading={inviteMutation.isPending}>
          {t('groups.invite')}
        </Button>
      </View>
    </Screen>
  );
}

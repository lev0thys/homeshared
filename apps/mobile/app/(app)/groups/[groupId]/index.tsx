import { Alert, Share, Switch, Text, View } from 'react-native';
import { VerticalSwipeScroll } from '@/components/VerticalSwipeScroll';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { DEFAULT_GROUP_FEATURES, buildInviteWebUrl } from '@homeshared/shared';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { LoadingCenter } from '@/components/LoadingCenter';
import { api } from '@/lib/api-client';
import { useMutationError } from '@/hooks/useMutationError';
import { useGroupId } from '@/hooks/useGroupId';
import { useUserCapabilities } from '@/hooks/useUserCapabilities';
import { GroupProfileHeader } from '@/components/GroupProfileHeader';
import { GroupQuickActions } from '@/components/GroupQuickActions';
import { GroupStatusStrip } from '@/components/GroupStatusStrip';
import { UserAvatar } from '@/components/UserAvatar';
import { useSessionStore } from '@/stores/session.store';
import { env } from '@/lib/env';

interface GroupDetail {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isPersonal: boolean;
  features: string[];
  memberships: Array<{
    id: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    isChild: boolean;
    user: { id: string; username: string; displayName: string; avatarUrl: string | null; isChild: boolean };
  }>;
}

export default function GroupHomeScreen() {
  const groupId = useGroupId();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { error, capture, clearError } = useMutationError();
  const sessionUserId = useSessionStore((s) => s.user?.id);
  const caps = useUserCapabilities(groupId, sessionUserId);

  const { data: group, isLoading } = useQuery<GroupDetail>({
    queryKey: ['group', groupId],
    queryFn: (): Promise<GroupDetail> => api.get<GroupDetail>(`/api/groups/${groupId}`),
    enabled: !!groupId,
  });

  const inviteMutation = useMutation({
    mutationFn: () => {
      if (!groupId) throw new Error('Groupe introuvable.');
      return api.post<{ token: string; expiresAt: string }>('/api/groups/invites', { groupId });
    },
    onSuccess: async (invite) => {
      clearError();
      const inviteUrl = buildInviteWebUrl(env.SITE_URL, invite.token);
      const message = `${t('invite.shareMessage')}\n${inviteUrl}`;
      await Share.share({
        message,
        url: inviteUrl,
        title: t('invite.shareTitle'),
      });
    },
    onError: (err) => capture(err),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/api/groups/${groupId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups'] });
      router.replace('/(app)');
    },
    onError: (err) => capture(err),
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ membershipId, isChild }: { membershipId: string; isChild: boolean }) =>
      api.patch(`/api/groups/${groupId}/members/${membershipId}`, { isChild }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['group', groupId] }),
    onError: (err) => capture(err),
  });

  const isOwner = group?.memberships.some(
    (m: GroupDetail['memberships'][number]) =>
      m.user.id === sessionUserId && m.role === 'OWNER',
  );

  function confirmDelete() {
    Alert.alert(t('groups.deleteTitle'), t('groups.deleteMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => deleteMutation.mutate(undefined),
      },
    ]);
  }

  if (!groupId) {
    return (
      <Screen safeBottom={false}>
        <Text className="text-ink-500">{t('groups.notFound')}</Text>
      </Screen>
    );
  }

  if (isLoading || !group) {
    return (
      <Screen safeBottom={false}>
        <LoadingCenter />
      </Screen>
    );
  }

  const features = group.features.length ? group.features : [...DEFAULT_GROUP_FEATURES];

  return (
    <Screen safeBottom={false}>
      <VerticalSwipeScroll contentContainerStyle={{ paddingBottom: 32 }} className="gap-4 mt-2">
        <GroupProfileHeader
          groupId={groupId}
          name={group.name}
          description={group.description}
          imageUrl={group.imageUrl}
          isPersonal={group.isPersonal}
          canEdit={caps.canManageGroupSettings}
        />

        <GroupStatusStrip groupId={groupId} features={features} />

        <GroupQuickActions groupId={groupId} features={features} />

        <View>
          <Text className="text-base font-semibold text-ink-900 mb-2">{t('groups.members')}</Text>
          {group.memberships.map((item: GroupDetail['memberships'][number]) => {
            const memberIsChild = item.isChild || item.user.isChild;
            return (
            <View
              key={item.id}
              className="bg-white rounded-2xl px-4 py-3 mb-2 border border-ink-100"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <UserAvatar displayName={item.user.displayName} avatarUrl={item.user.avatarUrl} />
                  <View className="flex-1">
                    <Text className="font-medium text-ink-900">{item.user.displayName}</Text>
                    <Text className="text-xs text-ink-400">@{item.user.username}</Text>
                    {memberIsChild ? (
                      <Text className="text-xs text-amber-700 font-medium mt-1">{t('childMode.badge')}</Text>
                    ) : null}
                  </View>
                </View>
                <Text className="text-xs text-primary-700 font-semibold">{item.role}</Text>
              </View>
              {isOwner && item.role !== 'OWNER' ? (
                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-ink-100">
                  <Text className="text-sm text-ink-700">{t('childMode.groupMember')}</Text>
                  <Switch
                    value={item.isChild}
                    onValueChange={(v) =>
                      updateMemberMutation.mutate({ membershipId: item.id, isChild: v })
                    }
                    disabled={updateMemberMutation.isPending}
                  />
                </View>
              ) : null}
            </View>
          );
          })}
        </View>

        {!group.isPersonal && caps.canInviteMembers ? (
          <Button onPress={() => inviteMutation.mutate(undefined)} loading={inviteMutation.isPending}>
            {t('groups.invite')}
          </Button>
        ) : null}

        {error ? <Text className="text-sm text-red-600">{error}</Text> : null}

        {isOwner && !group.isPersonal ? (
          <Button variant="secondary" onPress={confirmDelete} loading={deleteMutation.isPending}>
            {t('groups.deleteGroup')}
          </Button>
        ) : null}
      </VerticalSwipeScroll>
    </Screen>
  );
}

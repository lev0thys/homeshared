import { ScrollView } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { LoadingCenter } from '@/components/LoadingCenter';
import { GroupProfileEditor } from '@/components/GroupProfileEditor';
import { api } from '@/lib/api-client';
import { useGroupId } from '@/hooks/useGroupId';
import { useUserCapabilities } from '@/hooks/useUserCapabilities';
import { useSessionStore } from '@/stores/session.store';
interface GroupDetail {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isPersonal: boolean;
  features: string[];
  memberships: Array<{
    user: { id: string };
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
  }>;
}

export default function GroupProfileScreen() {
  const groupId = useGroupId();
  const { t } = useTranslation();
  const sessionUserId = useSessionStore((s) => s.user?.id);
  const caps = useUserCapabilities(groupId, sessionUserId);

  const { data: group, isLoading } = useQuery<GroupDetail>({
    queryKey: ['group', groupId],
    queryFn: (): Promise<GroupDetail> => api.get<GroupDetail>(`/api/groups/${groupId}`),
    enabled: !!groupId,
  });

  if (!groupId) return null;

  if (!caps.canManageGroupSettings) {
    return <Redirect href={`/(app)/groups/${groupId}` as never} />;
  }

  const isOwner = group?.memberships.some(
    (m: GroupDetail['memberships'][number]) =>
      m.user.id === sessionUserId && m.role === 'OWNER',
  );

  return (
    <Screen keyboard safeBottom={false}>
      <Stack.Screen options={{ title: t('groups.editProfile') }} />
      {isLoading || !group ? (
        <LoadingCenter />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          <GroupProfileEditor
            groupId={groupId}
            name={group.name}
            description={group.description}
            imageUrl={group.imageUrl}
            isPersonal={group.isPersonal}
            features={group.features}
            isOwner={!!isOwner}
          />
        </ScrollView>
      )}
    </Screen>
  );
}

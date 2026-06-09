import { useQuery } from '@tanstack/react-query';
import { buildUserCapabilities, resolveIsChildUser } from '@homeshared/shared';
import { api } from '@/lib/api-client';

interface UserProfile {
  id: string;
  isChild: boolean;
}

interface GroupDetail {
  memberships: Array<{
    id: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    isChild: boolean;
    user: { id: string; isChild: boolean };
  }>;
}

/** Capacités UX selon profil enfant + membership groupe courant. */
export function useUserCapabilities(groupId?: string | null, sessionUserId?: string | null) {
  const { data: profile } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: (): Promise<UserProfile> => api.get<UserProfile>('/api/users/me'),
  });

  const { data: group } = useQuery<GroupDetail>({
    queryKey: ['group', groupId],
    queryFn: (): Promise<GroupDetail> => api.get<GroupDetail>(`/api/groups/${groupId}`),
    enabled: !!groupId,
  });

  const membership = group?.memberships.find(
    (m: GroupDetail['memberships'][number]) => m.user.id === sessionUserId,
  );
  const isChild = resolveIsChildUser(profile, membership);
  const isGroupOwner = membership?.role === 'OWNER';

  return {
    profile,
    membership,
    ...buildUserCapabilities({ isChild, isGroupOwner: !!isGroupOwner }),
  };
}

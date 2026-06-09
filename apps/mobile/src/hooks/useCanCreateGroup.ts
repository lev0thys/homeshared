import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

interface ProfileIsChild {
  isChild: boolean;
}

/** Création de groupe : uniquement selon le profil (pas le membership du groupe ouvert). */
export function useCanCreateGroup() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: (): Promise<ProfileIsChild> => api.get<ProfileIsChild>('/api/users/me'),
  });

  const isChildAccount = profile?.isChild === true;

  return {
    canCreateGroup: !isChildAccount,
    isChildAccount,
    isLoading,
  };
}

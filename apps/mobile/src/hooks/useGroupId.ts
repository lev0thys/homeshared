import { useGlobalSearchParams } from 'expo-router';

/**
 * ID du groupe courant (segment parent [groupId]).
 * useLocalSearchParams ne remonte pas toujours le segment parent sur les onglets (web).
 */
export function useGroupId(): string | undefined {
  const { groupId } = useGlobalSearchParams<{ groupId?: string | string[] }>();
  if (!groupId) return undefined;
  return Array.isArray(groupId) ? groupId[0] : groupId;
}

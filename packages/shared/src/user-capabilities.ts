/**
 * Détermine si l'utilisateur doit voir l'UX enfant (compte ou membership groupe).
 */
export function resolveIsChildUser(
  profile: { isChild?: boolean } | null | undefined,
  membership: { isChild?: boolean } | null | undefined,
): boolean {
  return !!(profile?.isChild || membership?.isChild);
}

export interface UserCapabilities {
  isChild: boolean;
  canCreateGroup: boolean;
  canInviteMembers: boolean;
  canManageGroupSettings: boolean;
  canManageShopping: boolean;
  canManageTasks: boolean;
  canManageMealPermissions: boolean;
}

export function buildUserCapabilities(input: {
  isChild: boolean;
  isGroupOwner: boolean;
}): UserCapabilities {
  const { isChild, isGroupOwner } = input;
  return {
    isChild,
    canCreateGroup: !isChild,
    canInviteMembers: !isChild && isGroupOwner,
    canManageGroupSettings: !isChild && isGroupOwner,
    canManageShopping: !isChild,
    canManageTasks: !isChild,
    canManageMealPermissions: !isChild && isGroupOwner,
  };
}

import type { Group, PrismaClient, GroupRole } from '@prisma/client';
import { ApiError, DEFAULT_GROUP_FEATURES, hasGroupFeature, type GroupFeature } from '@homeshared/shared';

export const PERSONAL_GROUP_NAME = 'Mon espace';

export async function ensureMembership(
  prisma: PrismaClient,
  groupId: string,
  userId: string,
): Promise<{ role: GroupRole }> {
  const membership = await prisma.membership.findUnique({
    where: { groupId_userId: { groupId, userId } },
    select: { role: true },
  });
  if (!membership) {
    throw new ApiError('FORBIDDEN', 'Tu n\'es pas membre de ce groupe.');
  }
  return membership;
}

export async function ensureRole(
  prisma: PrismaClient,
  groupId: string,
  userId: string,
  allowed: GroupRole[],
): Promise<void> {
  const { role } = await ensureMembership(prisma, groupId, userId);
  if (!allowed.includes(role)) {
    throw new ApiError('FORBIDDEN', 'Permissions insuffisantes pour cette action.');
  }
}

export async function ensureGroupFeature(
  prisma: PrismaClient,
  groupId: string,
  feature: GroupFeature,
): Promise<void> {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: { features: true },
  });
  if (!group || !hasGroupFeature(group.features, feature)) {
    throw new ApiError('FORBIDDEN', `La fonctionnalité « ${feature} » n'est pas active pour ce groupe.`);
  }
}

/** Crée l'espace personnel si l'utilisateur n'en a pas encore. */
export async function ensurePersonalGroup(prisma: PrismaClient, userId: string): Promise<Group> {
  const existing = await prisma.group.findFirst({
    where: { ownerId: userId, isPersonal: true },
  });
  if (existing) return existing;

  return prisma.group.create({
    data: {
      name: PERSONAL_GROUP_NAME,
      ownerId: userId,
      isPersonal: true,
      features: [...DEFAULT_GROUP_FEATURES],
      memberships: { create: { userId, role: 'OWNER' } },
    },
  });
}

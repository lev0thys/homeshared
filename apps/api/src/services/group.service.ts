import type { PrismaClient, GroupRole } from '@prisma/client';
import { ApiError } from '@homeshared/shared';

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

import type { PrismaClient } from '@prisma/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ApiError } from '@homeshared/shared';

/**
 * Supprime définitivement le compte utilisateur (RGPD droit à l'oublie).
 * Bloque si l'utilisateur est titulaire d'un groupe partagé avec d'autres membres.
 */
export async function deleteUserAccount(
  prisma: PrismaClient,
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const ownedGroups = await prisma.group.findMany({
    where: { ownerId: userId },
    include: { _count: { select: { memberships: true } } },
  });

  const blockingGroup = ownedGroups.find(
    (g) => !g.isPersonal && g._count.memberships > 1,
  );
  if (blockingGroup) {
    throw new ApiError(
      'CONFLICT',
      'Tu es titulaire d\'au moins un groupe avec d\'autres membres. Transfère la propriété ou supprime le groupe avant de supprimer ton compte.',
      { groupId: blockingGroup.id, groupName: blockingGroup.name },
    );
  }

  await prisma.$transaction(async (tx) => {
    const memberships = await tx.membership.findMany({
      where: { userId },
      select: {
        groupId: true,
        group: { select: { ownerId: true } },
      },
    });

    for (const membership of memberships) {
      const fallbackOwnerId =
        membership.group.ownerId === userId ? null : membership.group.ownerId;

      if (fallbackOwnerId) {
        await tx.shoppingItem.updateMany({
          where: { groupId: membership.groupId, addedById: userId },
          data: { addedById: fallbackOwnerId },
        });
        await tx.householdTask.updateMany({
          where: { groupId: membership.groupId, createdById: userId },
          data: { createdById: fallbackOwnerId },
        });
        await tx.mealPlanEntry.updateMany({
          where: { groupId: membership.groupId, plannedById: userId },
          data: { plannedById: fallbackOwnerId },
        });
      }
    }

    for (const group of ownedGroups) {
      if (group.isPersonal || group._count.memberships <= 1) {
        await tx.group.delete({ where: { id: group.id } });
      }
    }

    await tx.user.delete({ where: { id: userId } });
  });

  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) {
    throw new ApiError(
      'INTERNAL_ERROR',
      'Données supprimées mais erreur lors de la suppression du compte d\'authentification.',
    );
  }
}

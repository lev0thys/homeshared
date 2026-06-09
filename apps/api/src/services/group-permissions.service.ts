import type { GroupRole, MealPlanPermission, MealSlot, PrismaClient } from '@prisma/client';
import { ApiError } from '@homeshared/shared';

export interface MealPermissionContext {
  role: GroupRole;
  grants: Array<{
    permission: MealPlanPermission;
    dayOfWeek: number | null;
    mealSlot: MealSlot | null;
  }>;
}

export async function getMealPermissionContext(
  prisma: PrismaClient,
  groupId: string,
  userId: string,
): Promise<MealPermissionContext & { membershipId: string }> {
  const membership = await prisma.membership.findUnique({
    where: { groupId_userId: { groupId, userId } },
    include: { mealGrants: true },
  });
  if (!membership) {
    throw new ApiError('FORBIDDEN', 'Tu n\'es pas membre de ce groupe.');
  }
  return {
    membershipId: membership.id,
    role: membership.role,
    grants: membership.mealGrants.map((g) => ({
      permission: g.permission,
      dayOfWeek: g.dayOfWeek,
      mealSlot: g.mealSlot,
    })),
  };
}

/** OWNER / ADMIN : toujours. Sinon grants EDIT_ALL ou EDIT_SLOT ciblés. */
export function canEditMealSlot(
  ctx: MealPermissionContext,
  dayOfWeek: number,
  mealSlot: MealSlot,
): boolean {
  if (ctx.role === 'OWNER' || ctx.role === 'ADMIN') return true;
  if (ctx.grants.some((g) => g.permission === 'EDIT_ALL')) return true;
  return ctx.grants.some((g) => {
    if (g.permission !== 'EDIT_SLOT') return false;
    const dayOk = g.dayOfWeek === null || g.dayOfWeek === dayOfWeek;
    const slotOk = g.mealSlot === null || g.mealSlot === mealSlot;
    return dayOk && slotOk;
  });
}

export function canManageMealPermissions(role: GroupRole): boolean {
  return role === 'OWNER';
}

export async function ensureMealSettings(prisma: PrismaClient, groupId: string) {
  return prisma.groupMealSettings.upsert({
    where: { groupId },
    create: { groupId },
    update: {},
  });
}

/** Résout le cuisinier assigné via règles auto du groupe. */
export async function resolveAssignedUserForSlot(
  prisma: PrismaClient,
  groupId: string,
  dayOfWeek: number,
  mealSlot: MealSlot,
): Promise<string | null> {
  const rule = await prisma.memberMealRule.findFirst({
    where: {
      groupId,
      dayOfWeek,
      OR: [{ mealSlot }, { mealSlot: null }],
    },
    include: { membership: { select: { userId: true } } },
    orderBy: { mealSlot: 'desc' },
  });
  return rule?.membership.userId ?? null;
}

export function mealReminderDate(
  weekStart: Date,
  dayOfWeek: number,
  mealSlot: MealSlot,
  settings: { breakfastTime: string; lunchTime: string; dinnerTime: string },
): Date {
  const time =
    mealSlot === 'BREAKFAST'
      ? settings.breakfastTime
      : mealSlot === 'LUNCH'
        ? settings.lunchTime
        : settings.dinnerTime;
  const [h, m] = time.split(':').map(Number);
  const d = new Date(weekStart);
  d.setUTCDate(d.getUTCDate() + dayOfWeek);
  d.setUTCHours(h ?? 12, m ?? 0, 0, 0);
  return d;
}

export async function getMealPermissionsConfig(
  prisma: PrismaClient,
  groupId: string,
  userId: string,
) {
  const ctx = await getMealPermissionContext(prisma, groupId, userId);
  const settings = await ensureMealSettings(prisma, groupId);

  const memberships = await prisma.membership.findMany({
    where: { groupId },
    include: {
      user: { select: { id: true, displayName: true, username: true } },
      mealGrants: true,
      mealRules: true,
    },
    orderBy: [{ role: 'asc' }, { joinedAt: 'asc' }],
  });

  return {
    settings,
    canManage: canManageMealPermissions(ctx.role),
    myGrants: ctx.grants,
    members: memberships.map((m) => ({
      membershipId: m.id,
      userId: m.userId,
      role: m.role,
      displayName: m.user.displayName,
      username: m.user.username,
      grants: m.mealGrants.map((g) => ({
        id: g.id,
        permission: g.permission,
        dayOfWeek: g.dayOfWeek,
        mealSlot: g.mealSlot,
      })),
      rules: m.mealRules.map((r) => ({
        id: r.id,
        dayOfWeek: r.dayOfWeek,
        mealSlot: r.mealSlot,
        createReminder: r.createReminder,
      })),
    })),
  };
}

export async function updateMealPermissionsConfig(
  prisma: PrismaClient,
  groupId: string,
  userId: string,
  input: {
    settings: {
      breakfastTime: string;
      lunchTime: string;
      dinnerTime: string;
      syncTasksToList: boolean;
      allowTaskProposals: boolean;
      showBreakfast: boolean;
      showLunch: boolean;
      showDinner: boolean;
      servingsFromMemberCount: boolean;
      adultEaters: number;
      childEaters: number;
    };
    grants: Array<{
      membershipId: string;
      permission: MealPlanPermission;
      dayOfWeek?: number | null;
      mealSlot?: MealSlot | null;
    }>;
    rules: Array<{
      membershipId: string;
      dayOfWeek: number;
      mealSlot?: MealSlot | null;
      createReminder?: boolean;
    }>;
  },
) {
  const ctx = await getMealPermissionContext(prisma, groupId, userId);
  if (!canManageMealPermissions(ctx.role)) {
    throw new ApiError('FORBIDDEN', 'Seul le titulaire du groupe peut modifier les droits repas.');
  }

  const membershipIds = new Set(
    (await prisma.membership.findMany({ where: { groupId }, select: { id: true } })).map((m) => m.id),
  );
  for (const g of input.grants) {
    if (!membershipIds.has(g.membershipId)) {
      throw new ApiError('VALIDATION_ERROR', 'Membre introuvable pour un droit repas.');
    }
  }
  for (const r of input.rules) {
    if (!membershipIds.has(r.membershipId)) {
      throw new ApiError('VALIDATION_ERROR', 'Membre introuvable pour une règle repas.');
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.groupMealSettings.upsert({
      where: { groupId },
      create: { groupId, ...input.settings },
      update: input.settings,
    });
    await tx.memberMealGrant.deleteMany({ where: { groupId } });
    await tx.memberMealRule.deleteMany({ where: { groupId } });
    if (input.grants.length > 0) {
      await tx.memberMealGrant.createMany({
        data: input.grants.map((g) => ({
          groupId,
          membershipId: g.membershipId,
          permission: g.permission,
          dayOfWeek: g.dayOfWeek ?? null,
          mealSlot: g.mealSlot ?? null,
        })),
      });
    }
    if (input.rules.length > 0) {
      await tx.memberMealRule.createMany({
        data: input.rules.map((r) => ({
          groupId,
          membershipId: r.membershipId,
          dayOfWeek: r.dayOfWeek,
          mealSlot: r.mealSlot ?? null,
          createReminder: r.createReminder ?? true,
        })),
      });
    }
  });

  return getMealPermissionsConfig(prisma, groupId, userId);
}

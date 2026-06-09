import type { MealSlot, PrismaClient, RecipeCuisine } from '@prisma/client';
import type { MealPlanSuggestionsInput, UpdateMealPlanWeekSettingsInput } from '@homeshared/shared';
import { ApiError, computeEffectiveServings } from '@homeshared/shared';
import { matchRecipesAgainstFridge } from './recipe-matching.service.js';
import { fridgeScoresForMealPlanEntries } from './meal-plan-fridge.service.js';
import {
  canEditMealSlot,
  ensureMealSettings,
  getMealPermissionContext,
  mealReminderDate,
  resolveAssignedUserForSlot,
} from './group-permissions.service.js';

export interface MealPlanEntryDto {
  id: string;
  dayOfWeek: number;
  mealSlot: MealSlot;
  recipeId: string;
  assignedToId: string | null;
  servings: number | null;
  cookedAt: string | null;
  fridgeScore: number;
  canEdit: boolean;
  recipe: { id: string; title: string; cuisine: RecipeCuisine; prepMinutes: number; cookMinutes: number };
}

export interface MealPlanWeekSettingsDto {
  showBreakfast: boolean;
  showLunch: boolean;
  showDinner: boolean;
  servingsFromMemberCount: boolean;
  adultEaters: number;
  childEaters: number;
  memberCount: number;
  effectiveServings: number;
}

export function visibleMealSlots(settings: {
  showBreakfast: boolean;
  showLunch: boolean;
  showDinner: boolean;
}): MealSlot[] {
  const slots: MealSlot[] = [];
  if (settings.showBreakfast) slots.push('BREAKFAST');
  if (settings.showLunch) slots.push('LUNCH');
  if (settings.showDinner) slots.push('DINNER');
  return slots.length > 0 ? slots : ['LUNCH', 'DINNER'];
}

export async function resolveGroupServings(
  prisma: PrismaClient,
  groupId: string,
): Promise<MealPlanWeekSettingsDto> {
  const settings = await ensureMealSettings(prisma, groupId);
  const memberCount = await prisma.membership.count({ where: { groupId } });
  const adults = settings.servingsFromMemberCount
    ? Math.max(1, memberCount)
    : Math.max(1, settings.adultEaters);
  const children = settings.childEaters;
  return {
    showBreakfast: settings.showBreakfast,
    showLunch: settings.showLunch,
    showDinner: settings.showDinner,
    servingsFromMemberCount: settings.servingsFromMemberCount,
    adultEaters: adults,
    childEaters: children,
    memberCount,
    effectiveServings: computeEffectiveServings(adults, children),
  };
}

export interface MealPlanSuggestionRecipe {
  id: string;
  title: string;
  cuisine: RecipeCuisine;
  prepMinutes: number;
  cookMinutes: number;
  score?: number;
  isFavorite?: boolean;
}

export interface MealPlanSuggestions {
  habits: MealPlanSuggestionRecipe[];
  favorites: MealPlanSuggestionRecipe[];
  proposals: MealPlanSuggestionRecipe[];
  seasonal: MealPlanSuggestionRecipe[];
  discovery: MealPlanSuggestionRecipe[];
}

export function parseWeekStartUtc(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

export function currentWeekStartUtc(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diff));
  return monday.toISOString().slice(0, 10);
}

const recipePick = {
  id: true,
  title: true,
  cuisine: true,
  prepMinutes: true,
  cookMinutes: true,
} as const;

export async function getMealPlanForWeek(
  prisma: PrismaClient,
  groupId: string,
  userId: string,
  weekStart: string,
): Promise<{
  entries: MealPlanEntryDto[];
  slots: Array<{ dayOfWeek: number; mealSlot: MealSlot; canEdit: boolean }>;
  settings: MealPlanWeekSettingsDto;
}> {
  const perm = await getMealPermissionContext(prisma, groupId, userId);
  const week = parseWeekStartUtc(weekStart);
  const weekSettings = await resolveGroupServings(prisma, groupId);
  const visibleSlots = visibleMealSlots(weekSettings);

  const rows = await prisma.mealPlanEntry.findMany({
    where: { groupId, weekStart: week },
    include: {
      recipe: { select: recipePick },
    },
    orderBy: [{ dayOfWeek: 'asc' }, { mealSlot: 'asc' }],
  });

  const scoreByEntryId = await fridgeScoresForMealPlanEntries(
    prisma,
    groupId,
    rows,
    weekSettings.effectiveServings,
  );

  const entries: MealPlanEntryDto[] = rows.map((r) => ({
    id: r.id,
    dayOfWeek: r.dayOfWeek,
    mealSlot: r.mealSlot,
    recipeId: r.recipeId,
    assignedToId: r.assignedToId,
    servings: r.servings,
    cookedAt: r.cookedAt?.toISOString() ?? null,
    fridgeScore: scoreByEntryId.get(r.id) ?? 0,
    canEdit: canEditMealSlot(perm, r.dayOfWeek, r.mealSlot),
    recipe: r.recipe,
  }));

  const slots: Array<{ dayOfWeek: number; mealSlot: MealSlot; canEdit: boolean }> = [];
  for (let day = 0; day < 7; day += 1) {
    for (const mealSlot of visibleSlots) {
      slots.push({ dayOfWeek: day, mealSlot, canEdit: canEditMealSlot(perm, day, mealSlot) });
    }
  }
  return { entries, slots, settings: weekSettings };
}

export async function updateMealPlanWeekSettings(
  prisma: PrismaClient,
  groupId: string,
  userId: string,
  input: UpdateMealPlanWeekSettingsInput,
): Promise<MealPlanWeekSettingsDto> {
  const perm = await getMealPermissionContext(prisma, groupId, userId);
  if (perm.role !== 'OWNER' && perm.role !== 'ADMIN') {
    throw new ApiError('FORBIDDEN', 'Seul le titulaire peut modifier les réglages du planning.');
  }
  const current = await ensureMealSettings(prisma, groupId);
  const next = {
    showBreakfast: input.showBreakfast ?? current.showBreakfast,
    showLunch: input.showLunch ?? current.showLunch,
    showDinner: input.showDinner ?? current.showDinner,
    servingsFromMemberCount: input.servingsFromMemberCount ?? current.servingsFromMemberCount,
    adultEaters: input.adultEaters ?? current.adultEaters,
    childEaters: input.childEaters ?? current.childEaters,
  };
  if (!next.showBreakfast && !next.showLunch && !next.showDinner) {
    throw new ApiError('VALIDATION_ERROR', 'Au moins un créneau repas doit rester visible.');
  }
  await prisma.groupMealSettings.update({
    where: { groupId },
    data: next,
  });
  return resolveGroupServings(prisma, groupId);
}

async function syncMealTasks(
  prisma: PrismaClient,
  entry: {
    id: string;
    groupId: string;
    dayOfWeek: number;
    mealSlot: MealSlot;
    weekStart: Date;
    assignedToId: string | null;
    plannedById: string;
    recipe: { title: string; prepMinutes: number };
  },
): Promise<void> {
  const settings = await ensureMealSettings(prisma, entry.groupId);
  if (!settings.syncTasksToList) return;

  await prisma.householdTask.deleteMany({ where: { mealPlanEntryId: entry.id } });

  const cookAt = mealReminderDate(entry.weekStart, entry.dayOfWeek, entry.mealSlot, settings);
  const prepAt = new Date(cookAt.getTime() - entry.recipe.prepMinutes * 60_000);
  const assignee = entry.assignedToId;

  if (entry.recipe.prepMinutes > 0) {
    await prisma.householdTask.create({
      data: {
        groupId: entry.groupId,
        title: `Préparer : ${entry.recipe.title}`,
        source: 'MEAL_PREP',
        mealPlanEntryId: entry.id,
        assignedToId: assignee,
        createdById: entry.plannedById,
        dueDate: prepAt,
        reminderAt: prepAt,
        status: assignee ? 'CLAIMED' : 'OPEN',
        claimedById: assignee,
        claimedAt: assignee ? new Date() : null,
      },
    });
  }

  await prisma.householdTask.create({
    data: {
      groupId: entry.groupId,
      title: `Cuisiner : ${entry.recipe.title}`,
      source: 'MEAL_COOK',
      mealPlanEntryId: entry.id,
      assignedToId: assignee,
      createdById: entry.plannedById,
      dueDate: cookAt,
      reminderAt: cookAt,
      status: assignee ? 'CLAIMED' : 'OPEN',
      claimedById: assignee,
      claimedAt: assignee ? new Date() : null,
    },
  });
}

export async function upsertMealPlanSlot(
  prisma: PrismaClient,
  userId: string,
  input: {
    groupId: string;
    weekStart: string;
    dayOfWeek: number;
    mealSlot: MealSlot;
    recipeId: string | null;
    servings?: number;
  },
): Promise<{ ok: true }> {
  const perm = await getMealPermissionContext(prisma, input.groupId, userId);
  if (!canEditMealSlot(perm, input.dayOfWeek, input.mealSlot)) {
    throw new ApiError('FORBIDDEN', 'Tu n\'as pas le droit de modifier ce créneau repas.');
  }

  const week = parseWeekStartUtc(input.weekStart);
  const slotWhere = {
    groupId_weekStart_dayOfWeek_mealSlot: {
      groupId: input.groupId,
      weekStart: week,
      dayOfWeek: input.dayOfWeek,
      mealSlot: input.mealSlot,
    },
  };

  if (!input.recipeId) {
    const existing = await prisma.mealPlanEntry.findUnique({ where: slotWhere });
    if (existing) {
      await prisma.householdTask.deleteMany({ where: { mealPlanEntryId: existing.id } });
      await prisma.mealPlanEntry.delete({ where: { id: existing.id } });
    }
    return { ok: true };
  }

  const recipe = await prisma.recipe.findUnique({ where: { id: input.recipeId } });
  if (!recipe) throw new ApiError('NOT_FOUND', 'Recette introuvable.');

  const assignedToId = await resolveAssignedUserForSlot(
    prisma,
    input.groupId,
    input.dayOfWeek,
    input.mealSlot,
  );

  const weekSettings = await resolveGroupServings(prisma, input.groupId);
  const servings = input.servings ?? weekSettings.effectiveServings;

  const entry = await prisma.mealPlanEntry.upsert({
    where: slotWhere,
    create: {
      groupId: input.groupId,
      plannedById: userId,
      assignedToId,
      weekStart: week,
      dayOfWeek: input.dayOfWeek,
      mealSlot: input.mealSlot,
      recipeId: input.recipeId,
      servings,
      cookedAt: null,
    },
    update: {
      recipeId: input.recipeId,
      plannedById: userId,
      assignedToId,
      servings,
      cookedAt: null,
    },
    include: { recipe: { select: { title: true, prepMinutes: true } } },
  });

  await syncMealTasks(prisma, { ...entry, weekStart: week });
  return { ok: true };
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export async function getMealPlanSuggestions(
  prisma: PrismaClient,
  userId: string,
  input: MealPlanSuggestionsInput,
): Promise<MealPlanSuggestions> {
  const weekStart = input.weekStart ?? currentWeekStartUtc();
  const week = parseWeekStartUtc(weekStart);
  const weekSettings = await resolveGroupServings(prisma, input.groupId);
  const targetServings = weekSettings.effectiveServings;

  const fridgeMatches = await matchRecipesAgainstFridge(prisma, {
    groupId: input.groupId,
    missingMaxCount: 12,
    includeOptionalMissing: false,
    targetServings,
  });
  const fridgeScoreByRecipe = new Map(fridgeMatches.map((m) => [m.recipeId, m.score]));

  const [history, favorites, dismissals, allRecipes, plannedThisWeek] = await Promise.all([
    prisma.mealPlanEntry.findMany({
      where: {
        groupId: input.groupId,
        dayOfWeek: input.dayOfWeek,
        mealSlot: input.mealSlot,
        weekStart: { lt: week },
      },
      select: { recipeId: true },
      take: 200,
    }),
    prisma.recipeFavorite.findMany({
      where: { userId },
      include: { recipe: { select: recipePick } },
    }),
    prisma.recipeProposalDismiss.findMany({
      where: { userId },
      select: { recipeId: true, viewCount: true },
    }),
    prisma.recipe.findMany({ select: recipePick }),
    prisma.mealPlanEntry.findMany({
      where: { groupId: input.groupId, weekStart: week },
      select: { recipeId: true },
    }),
  ]);

  const plannedIds = new Set(plannedThisWeek.map((p) => p.recipeId));
  const favoriteIds = new Set(favorites.map((f) => f.recipeId));
  const dismissWeight = new Map(dismissals.map((d) => [d.recipeId, d.viewCount]));

  const habitCounts = new Map<string, number>();
  for (const h of history) {
    habitCounts.set(h.recipeId, (habitCounts.get(h.recipeId) ?? 0) + 1);
  }
  const habitRecipeIds = [...habitCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id]) => id);

  const recipeById = new Map(allRecipes.map((r) => [r.id, r]));

  const habits = habitRecipeIds
    .map((id) => recipeById.get(id))
    .filter((r): r is (typeof allRecipes)[number] => !!r)
    .map((r) => ({ ...r, isFavorite: favoriteIds.has(r.id) }));

  const favoritesList = favorites
    .map((f) => ({ ...f.recipe, isFavorite: true }))
    .filter((r) => !plannedIds.has(r.id))
    .slice(0, 12);

  const usedCuisines = new Set(
    history.map((h) => recipeById.get(h.recipeId)?.cuisine).filter(Boolean) as RecipeCuisine[],
  );

  const candidates = allRecipes.filter((r) => !plannedIds.has(r.id));
  const weighted = candidates.map((r) => {
    const dismiss = dismissWeight.get(r.id) ?? 0;
    const weight = Math.max(0.05, 1 - dismiss * 0.25);
    return { r, weight };
  });

  const pickWeighted = (pool: typeof weighted, limit: number) => {
    const picked: typeof allRecipes = [];
    const remaining = [...pool];
    while (picked.length < limit && remaining.length > 0) {
      const total = remaining.reduce((s, x) => s + x.weight, 0);
      let roll = Math.random() * total;
      let idx = 0;
      for (let i = 0; i < remaining.length; i += 1) {
        roll -= remaining[i]!.weight;
        if (roll <= 0) {
          idx = i;
          break;
        }
      }
      const chosen = remaining.splice(idx, 1)[0]!;
      picked.push(chosen.r);
    }
    return picked;
  };

  const withFridgeScore = (r: (typeof allRecipes)[number]) => ({
    ...r,
    score: fridgeScoreByRecipe.get(r.id) ?? 0,
    isFavorite: favoriteIds.has(r.id),
  });

  const proposals = pickWeighted(
    weighted
      .filter((w) => !favoriteIds.has(w.r.id))
      .map((w) => ({ ...w, weight: w.weight * (0.5 + (fridgeScoreByRecipe.get(w.r.id) ?? 0) * 0.5) })),
    10,
  ).map((r) => withFridgeScore(r));

  const seasonal = shuffle(
    candidates.filter((r) => r.cuisine === 'MEDITERRANEAN' || r.cuisine === 'SALAD'),
  )
    .slice(0, 8)
    .map((r) => withFridgeScore(r))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const discovery = shuffle(
    candidates.filter((r) => !usedCuisines.has(r.cuisine) && !favoriteIds.has(r.id)),
  )
    .slice(0, 8)
    .map((r) => withFridgeScore(r))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const habitsScored = habits
    .map((r) => withFridgeScore(r))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const favoritesScored = favoritesList
    .map((r) => withFridgeScore(r))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return {
    habits: habitsScored,
    favorites: favoritesScored,
    proposals,
    seasonal,
    discovery,
  };
}

export async function recordProposalViews(
  prisma: PrismaClient,
  userId: string,
  recipeIds: string[],
): Promise<void> {
  for (const recipeId of recipeIds) {
    await prisma.recipeProposalDismiss.upsert({
      where: { userId_recipeId: { userId, recipeId } },
      create: { userId, recipeId, viewCount: 1 },
      update: { viewCount: { increment: 1 } },
    });
  }
}

import type { FastifyPluginAsync } from 'fastify';
import {
  getMealPlanSchema,
  upsertMealPlanSchema,
  mealPlanSuggestionsSchema,
  dismissProposalSchema,
  updateMealPlanWeekSettingsSchema,
  addMealPlanWeekToShoppingSchema,
} from '@homeshared/shared';
import { ensureGroupFeature, ensureMembership } from '../services/group.service.js';
import { ApiError } from '@homeshared/shared';
import {
  getMealPlanForWeek,
  getMealPlanSuggestions,
  recordProposalViews,
  resolveGroupServings,
  updateMealPlanWeekSettings,
  upsertMealPlanSlot,
} from '../services/meal-plan.service.js';
import { consumeMealPlanEntryFromFridge } from '../services/meal-plan-fridge.service.js';
import { addMealPlanWeekMissingToShopping } from '../services/meal-plan-shopping.service.js';

export const mealPlanRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', (req) => app.requireAuth(req));

  app.get('/', async (req) => {
    const query = getMealPlanSchema.parse(req.query);
    await ensureMembership(app.prisma, query.groupId, req.userId!);
    await ensureGroupFeature(app.prisma, query.groupId, 'RECIPES');
    return getMealPlanForWeek(app.prisma, query.groupId, req.userId!, query.weekStart);
  });

  app.put('/', async (req) => {
    const input = upsertMealPlanSchema.parse(req.body);
    await ensureMembership(app.prisma, input.groupId, req.userId!);
    await ensureGroupFeature(app.prisma, input.groupId, 'RECIPES');
    if (input.recipeId) {
      const recipe = await app.prisma.recipe.findUnique({ where: { id: input.recipeId } });
      if (!recipe) throw new ApiError('NOT_FOUND', 'Recette introuvable.');
    }
    return upsertMealPlanSlot(app.prisma, req.userId!, input);
  });

  app.get('/suggestions', async (req) => {
    const query = mealPlanSuggestionsSchema.parse(req.query);
    await ensureMembership(app.prisma, query.groupId, req.userId!);
    await ensureGroupFeature(app.prisma, query.groupId, 'RECIPES');
    return getMealPlanSuggestions(app.prisma, req.userId!, query);
  });

  app.post('/dismiss-proposals', async (req) => {
    const input = dismissProposalSchema.parse(req.body);
    await recordProposalViews(app.prisma, req.userId!, input.recipeIds);
    return { ok: true };
  });

  app.post('/shopping-missing', async (req) => {
    const input = addMealPlanWeekToShoppingSchema.parse(req.body);
    await ensureMembership(app.prisma, input.groupId, req.userId!);
    await ensureGroupFeature(app.prisma, input.groupId, 'RECIPES');
    await ensureGroupFeature(app.prisma, input.groupId, 'SHOPPING');
    return addMealPlanWeekMissingToShopping(
      app.prisma,
      req.userId!,
      input.groupId,
      input.weekStart,
    );
  });

  app.patch('/week-settings', async (req) => {
    const input = updateMealPlanWeekSettingsSchema.parse(req.body);
    await ensureMembership(app.prisma, input.groupId, req.userId!);
    await ensureGroupFeature(app.prisma, input.groupId, 'RECIPES');
    return updateMealPlanWeekSettings(app.prisma, input.groupId, req.userId!, input);
  });

  app.post('/:entryId/complete', async (req) => {
    const { entryId } = req.params as { entryId: string };
    const entry = await app.prisma.mealPlanEntry.findUnique({ where: { id: entryId } });
    if (!entry) throw new ApiError('NOT_FOUND', 'Repas introuvable.');
    await ensureMembership(app.prisma, entry.groupId, req.userId!);
    await ensureGroupFeature(app.prisma, entry.groupId, 'RECIPES');
    const weekSettings = await resolveGroupServings(app.prisma, entry.groupId);
    const portions = entry.servings ?? weekSettings.effectiveServings;
    return consumeMealPlanEntryFromFridge(app.prisma, entryId, req.userId!, portions);
  });
};

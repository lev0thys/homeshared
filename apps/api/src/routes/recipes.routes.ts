import type { FastifyPluginAsync } from 'fastify';
import {
  createRecipeSchema,
  matchRecipesSchema,
  addRecipeMissingToShoppingSchema,
  recipeCuisineSchema,
  ApiError,
} from '@homeshared/shared';
import { matchRecipesAgainstFridge, matchSingleRecipeAgainstFridge } from '../services/recipe-matching.service.js';
import { addRecipeMissingToShopping } from '../services/recipe-shopping.service.js';
import { ensureGroupFeature, ensureMembership } from '../services/group.service.js';
import { rateLimitRoutes } from '../constants/rate-limits.js';

const recipeInclude = {
  ingredients: {
    include: {
      ingredient: {
        select: {
          id: true,
          slug: true,
          nameFr: true,
          nameEn: true,
          category: true,
          defaultUnit: true,
        },
      },
    },
  },
} as const;

export const recipesRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', (req) => app.requireAuth(req));

  app.get('/favorites', async (req) => {
    const favorites = await app.prisma.recipeFavorite.findMany({
      where: { userId: req.userId! },
      include: { recipe: { include: recipeInclude } },
      orderBy: { createdAt: 'desc' },
    });
    return favorites.map((f) => ({ ...f.recipe, favoritedAt: f.createdAt }));
  });

  app.get('/', async (req) => {
    const query = req.query as { cuisine?: string };
    const cuisineParsed = query.cuisine ? recipeCuisineSchema.safeParse(query.cuisine) : null;
    if (query.cuisine && !cuisineParsed?.success) {
      throw new ApiError('VALIDATION_ERROR', 'Catégorie cuisine invalide.');
    }

    const favoriteIds = new Set(
      (
        await app.prisma.recipeFavorite.findMany({
          where: { userId: req.userId! },
          select: { recipeId: true },
        })
      ).map((f) => f.recipeId),
    );

    const recipes = await app.prisma.recipe.findMany({
      where: cuisineParsed?.success ? { cuisine: cuisineParsed.data } : undefined,
      orderBy: { title: 'asc' },
      include: recipeInclude,
    });

    return recipes.map((r) => ({ ...r, isFavorite: favoriteIds.has(r.id) }));
  });

  app.get('/categories', async () => {
    const rows = await app.prisma.recipe.groupBy({
      by: ['cuisine'],
      _count: { cuisine: true },
      orderBy: { cuisine: 'asc' },
    });
    return rows.map((r) => ({ cuisine: r.cuisine, count: r._count.cuisine }));
  });

  app.get('/:recipeId/fridge-match', async (req) => {
    const { recipeId } = req.params as { recipeId: string };
    const groupId = (req.query as { groupId?: string }).groupId;
    const targetServingsRaw = (req.query as { targetServings?: string }).targetServings;
    if (!groupId) throw new ApiError('VALIDATION_ERROR', 'groupId requis.');
    await ensureMembership(app.prisma, groupId, req.userId!);
    await ensureGroupFeature(app.prisma, groupId, 'RECIPES');
    const targetServings = targetServingsRaw ? Number.parseInt(targetServingsRaw, 10) : undefined;
    const match = await matchSingleRecipeAgainstFridge(
      app.prisma,
      recipeId,
      groupId,
      targetServings,
    );
    if (!match) throw new ApiError('NOT_FOUND', 'Recette introuvable.');
    return match;
  });

  app.get('/:recipeId', async (req) => {
    const { recipeId } = req.params as { recipeId: string };
    const recipe = await app.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: recipeInclude,
    });
    if (!recipe) throw new ApiError('NOT_FOUND', 'Recette introuvable.');

    const favorite = await app.prisma.recipeFavorite.findUnique({
      where: { userId_recipeId: { userId: req.userId!, recipeId } },
    });

    return { ...recipe, isFavorite: !!favorite };
  });

  app.post('/:recipeId/favorite', async (req) => {
    const { recipeId } = req.params as { recipeId: string };
    const recipe = await app.prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!recipe) throw new ApiError('NOT_FOUND', 'Recette introuvable.');

    await app.prisma.recipeFavorite.upsert({
      where: { userId_recipeId: { userId: req.userId!, recipeId } },
      create: { userId: req.userId!, recipeId },
      update: {},
    });

    return { ok: true };
  });

  app.delete('/:recipeId/favorite', async (req, reply) => {
    const { recipeId } = req.params as { recipeId: string };
    await app.prisma.recipeFavorite.deleteMany({
      where: { userId: req.userId!, recipeId },
    });
    return reply.status(204).send();
  });

  app.post('/:recipeId/shopping-missing', async (req) => {
    const { recipeId } = req.params as { recipeId: string };
    const input = addRecipeMissingToShoppingSchema.parse(req.body);
    await ensureMembership(app.prisma, input.groupId, req.userId!);
    await ensureGroupFeature(app.prisma, input.groupId, 'SHOPPING');
    return addRecipeMissingToShopping(app.prisma, recipeId, req.userId!, input);
  });

  app.post('/', { config: rateLimitRoutes.write }, async (req) => {
    const input = createRecipeSchema.parse(req.body);

    const slugs = [...new Set(input.ingredients.map((i) => i.ingredientSlug))];
    const catalog = await app.prisma.ingredient.findMany({
      where: { slug: { in: slugs } },
    });
    if (catalog.length !== slugs.length) {
      throw new ApiError('VALIDATION_ERROR', 'Un ou plusieurs ingrédients sont inconnus.');
    }
    const idBySlug = new Map(catalog.map((i) => [i.slug, i.id]));

    return app.prisma.recipe.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        instructions: input.instructions,
        prepMinutes: input.prepMinutes,
        cookMinutes: input.cookMinutes,
        servings: input.servings,
        imageUrl: input.imageUrl ?? null,
        ingredients: {
          create: input.ingredients.map((line) => ({
            ingredientId: idBySlug.get(line.ingredientSlug)!,
            quantity: line.quantity,
            unit: line.unit ?? null,
            optional: line.optional,
            notes: line.notes ?? null,
          })),
        },
      },
      include: recipeInclude,
    });
  });

  app.post('/match', { config: rateLimitRoutes.heavy }, async (req) => {
    const input = matchRecipesSchema.parse(req.body);
    await ensureMembership(app.prisma, input.groupId, req.userId!);
    await ensureGroupFeature(app.prisma, input.groupId, 'RECIPES');

    const favoriteIds = new Set(
      (
        await app.prisma.recipeFavorite.findMany({
          where: { userId: req.userId! },
          select: { recipeId: true },
        })
      ).map((f) => f.recipeId),
    );

    const matches = await matchRecipesAgainstFridge(app.prisma, input);

    let result = matches
      .map((m) => ({ ...m, isFavorite: favoriteIds.has(m.recipeId) }))
      .sort(
        (a, b) =>
          Number(b.isFavorite) - Number(a.isFavorite) ||
          b.score - a.score ||
          a.missingIngredients.length - b.missingIngredients.length,
      );

    if (input.cuisine) {
      result = result.filter((m) => m.cuisine === input.cuisine);
    }

    return result;
  });
};

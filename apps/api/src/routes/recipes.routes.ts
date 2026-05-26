import type { FastifyPluginAsync } from 'fastify';
import { createRecipeSchema, matchRecipesSchema, ApiError } from '@homeshared/shared';
import { matchRecipesAgainstFridge } from '../services/recipe-matching.service.js';
import { ensureMembership } from '../services/group.service.js';

export const recipesRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', (req) => app.requireAuth(req));

  // Catalogue global des recettes
  app.get('/', async () => {
    return app.prisma.recipe.findMany({
      orderBy: { title: 'asc' },
      include: { ingredients: true },
    });
  });

  // Détail d'une recette
  app.get('/:recipeId', async (req) => {
    const { recipeId } = req.params as { recipeId: string };
    const recipe = await app.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: { ingredients: true },
    });
    if (!recipe) throw new ApiError('NOT_FOUND', 'Recette introuvable.');
    return recipe;
  });

  // Création d'une recette (en v1 : ouvert à tous les users authentifiés.
  // Plus tard : restreindre à un rôle "contributor" ou modération).
  app.post('/', async (req) => {
    const input = createRecipeSchema.parse(req.body);
    return app.prisma.recipe.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        instructions: input.instructions,
        prepMinutes: input.prepMinutes,
        cookMinutes: input.cookMinutes,
        servings: input.servings,
        imageUrl: input.imageUrl ?? null,
        ingredients: { create: input.ingredients },
      },
      include: { ingredients: true },
    });
  });

  // Suggestions de recettes basées sur le frigo du groupe
  app.post('/match', async (req) => {
    const input = matchRecipesSchema.parse(req.body);
    await ensureMembership(app.prisma, input.groupId, req.userId!);
    return matchRecipesAgainstFridge(app.prisma, input);
  });
};

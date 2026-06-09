import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { ApiError } from '@homeshared/shared';
import type { IngredientCategory } from '@prisma/client';

const listQuerySchema = z.object({
  q: z.string().trim().max(80).optional(),
  category: z
    .enum([
      'VEGETABLE',
      'FRUIT',
      'DAIRY',
      'MEAT',
      'FISH',
      'SEAFOOD',
      'GRAIN',
      'LEGUME',
      'CONDIMENT',
      'SPICE',
      'OIL',
      'BAKERY',
      'OTHER',
    ])
    .optional(),
  limit: z.coerce.number().int().min(1).max(200).default(100),
});

export const ingredientsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', (req) => app.requireAuth(req));

  app.get('/', async (req) => {
    const query = listQuerySchema.parse(req.query);
    const where: {
      category?: IngredientCategory;
      OR?: Array<{ nameFr?: { contains: string; mode: 'insensitive' }; slug?: { contains: string } }>;
    } = {};

    if (query.category) where.category = query.category;
    if (query.q) {
      const q = query.q;
      where.OR = [
        { nameFr: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q.toLowerCase().replace(/\s+/g, '-') } },
      ];
    }

    const rows = await app.prisma.ingredient.findMany({
      where,
      orderBy: { nameFr: 'asc' },
      take: query.q ? query.limit * 3 : query.limit,
      select: {
        id: true,
        slug: true,
        nameFr: true,
        nameEn: true,
        category: true,
        defaultUnit: true,
        aliases: true,
      },
    });

    if (!query.q) return rows.slice(0, query.limit);

    const needle = query.q.toLowerCase();
    const filtered = rows.filter(
      (row) =>
        row.nameFr.toLowerCase().includes(needle) ||
        (row.nameEn?.toLowerCase().includes(needle) ?? false) ||
        row.slug.includes(needle.replace(/\s+/g, '-')) ||
        row.aliases.some((a) => a.toLowerCase().includes(needle)),
    );
    return filtered.slice(0, query.limit);
  });

  app.get('/:slug', async (req) => {
    const { slug } = req.params as { slug: string };
    const ingredient = await app.prisma.ingredient.findUnique({
      where: { slug },
      include: {
        recipeLines: {
          include: {
            recipe: { select: { id: true, slug: true, title: true, servings: true } },
          },
        },
      },
    });
    if (!ingredient) throw new ApiError('NOT_FOUND', 'Ingrédient introuvable.');
    return ingredient;
  });
};

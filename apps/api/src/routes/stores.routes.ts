import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import {
  compareShoppingList,
  findStoreProductsForName,
  STORE_CHAINS,
} from '../../prisma/data/store.catalog.js';
import { rateLimitRoutes } from '../constants/rate-limits.js';

const suggestQuerySchema = z.object({
  q: z.string().trim().min(1).max(80),
});

const compareBodySchema = z.object({
  items: z.array(z.string().trim().min(1).max(80)).min(1).max(50),
});

export const storesRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', (req) => app.requireAuth(req));

  app.get('/chains', async () => ({ chains: STORE_CHAINS }));

  app.get('/suggest', async (req) => {
    const { q } = suggestQuerySchema.parse(req.query);
    return findStoreProductsForName(q, 8);
  });

  app.post('/compare', { config: rateLimitRoutes.heavy }, async (req) => {
    const { items } = compareBodySchema.parse(req.body);
    return compareShoppingList(items);
  });
};

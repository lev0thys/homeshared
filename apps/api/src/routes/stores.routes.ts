import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import {
  compareShoppingList,
  findStoreProductsForName,
  STORE_CHAINS,
} from '../../prisma/data/store.catalog.js';
import { rateLimitRoutes } from '../constants/rate-limits.js';
import {
  getStoreContributions,
  getStoresGpsReadiness,
  submitContributionBatch,
} from '../services/store-contributions.service.js';

const suggestQuerySchema = z.object({
  q: z.string().trim().min(1).max(80),
});

const compareBodySchema = z.object({
  items: z.array(z.string().trim().min(1).max(80)).min(1).max(50),
});

const contributionsQuerySchema = z.object({
  storeOsmId: z.string().trim().min(1).max(24),
});

const readinessQuerySchema = z.object({
  storeOsmIds: z.string().trim().min(1).max(500),
});

const contributionEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('FOUND'),
    productFingerprint: z.string().trim().min(1).max(120),
    aisle: z.string().trim().min(1).max(40),
    schematicX: z.number().min(0).max(1),
    schematicY: z.number().min(0).max(1),
  }),
  z.object({
    type: z.literal('POSITION_FIX'),
    schematicX: z.number().min(0).max(1),
    schematicY: z.number().min(0).max(1),
    aisle: z.string().trim().min(1).max(40).optional(),
    note: z.string().trim().max(280).optional(),
  }),
  z.object({
    type: z.literal('OUT_OF_STOCK'),
    productFingerprint: z.string().trim().min(1).max(120),
    aisle: z.string().trim().min(1).max(40).optional(),
  }),
  z.object({
    type: z.literal('WRONG_PLACEMENT'),
    productFingerprint: z.string().trim().min(1).max(120),
    suggestedAisle: z.string().trim().min(1).max(40).optional(),
    schematicX: z.number().min(0).max(1).optional(),
    schematicY: z.number().min(0).max(1).optional(),
  }),
  z.object({
    type: z.literal('LAYOUT_FEEDBACK'),
    issue: z.enum(['WRONG_PROFILE', 'AISLE_ORDER', 'MISSING_AISLE', 'OTHER']),
    note: z.string().trim().max(280).optional(),
  }),
]);

const contributionBatchSchema = z.object({
  storeOsmId: z.string().trim().min(1).max(24),
  layoutProfile: z.string().trim().min(1).max(40).optional(),
  sessionStartedAt: z.string().datetime(),
  events: z.array(contributionEventSchema).min(1).max(50),
});

function mapBatchEvent(
  event: z.infer<typeof contributionEventSchema>,
): Parameters<typeof submitContributionBatch>[2]['events'][number] {
  switch (event.type) {
    case 'FOUND':
      return event;
    case 'POSITION_FIX':
      return event;
    case 'OUT_OF_STOCK':
      return event;
    case 'WRONG_PLACEMENT':
      return {
        type: 'WRONG_PLACEMENT',
        productFingerprint: event.productFingerprint,
        aisle: event.suggestedAisle,
        schematicX: event.schematicX,
        schematicY: event.schematicY,
        disputedFingerprint: event.productFingerprint,
      };
    case 'LAYOUT_FEEDBACK':
      return {
        type: 'LAYOUT_FEEDBACK',
        aisle: event.issue,
        note: event.note,
      };
  }
}

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

  app.get('/contributions', async (req, reply) => {
    const { storeOsmId } = contributionsQuerySchema.parse(req.query);
    reply.header('Cache-Control', 'private, max-age=600');
    return getStoreContributions(app.prisma, storeOsmId);
  });

  app.get('/contributions/readiness', async (req, reply) => {
    const { storeOsmIds } = readinessQuerySchema.parse(req.query);
    const ids = storeOsmIds.split(',').map((s) => s.trim()).filter(Boolean);
    reply.header('Cache-Control', 'private, max-age=300');
    return getStoresGpsReadiness(app.prisma, ids);
  });

  app.post(
    '/contributions/batch',
    { config: rateLimitRoutes.contributionBatch },
    async (req) => {
      const body = contributionBatchSchema.parse(req.body);
      return submitContributionBatch(app.prisma, req.userId!, {
        storeOsmId: body.storeOsmId,
        layoutProfile: body.layoutProfile,
        sessionStartedAt: body.sessionStartedAt,
        events: body.events.map(mapBatchEvent),
      });
    },
  );
};

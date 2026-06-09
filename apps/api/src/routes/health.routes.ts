import type { FastifyPluginAsync } from 'fastify';
import { withPrismaReconnect } from '../services/prisma-reconnect.service.js';

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async () => ({ status: 'ok', uptime: process.uptime() }));

  app.get('/db', async (req, reply) => {
    try {
      await withPrismaReconnect(app.prisma, () => app.prisma.$queryRaw`SELECT 1`);
      return { status: 'ok', db: 'reachable' };
    } catch (err) {
      req.log.error({ err }, 'Health DB failed');
      return reply.status(503).send({
        status: 'error',
        db: 'unreachable',
        hint: 'Vérifie DATABASE_URL (pooler Supabase 6543) — voir docs/SETUP-STEVE.md',
      });
    }
  });
};

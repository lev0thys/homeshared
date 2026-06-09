import type { FastifyPluginAsync } from 'fastify';
import { getGardenTasksForMonth } from '../../prisma/data/garden.calendar.js';
import { getSeasonalForMonth } from '../../prisma/data/season.produce.js';

export const toolsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', (req) => app.requireAuth(req));

  app.get('/season', async (req) => {
    const month = Number((req.query as { month?: string }).month) || new Date().getMonth() + 1;
    const m = Math.min(12, Math.max(1, month));
    return {
      month: m,
      produce: getSeasonalForMonth(m),
    };
  });

  app.get('/garden', async (req) => {
    const month = Number((req.query as { month?: string }).month) || new Date().getMonth() + 1;
    const m = Math.min(12, Math.max(1, month));
    return {
      month: m,
      tasks: getGardenTasksForMonth(m),
    };
  });
};

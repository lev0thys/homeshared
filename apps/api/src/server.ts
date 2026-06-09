import './load-env.js';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { config } from './config.js';
import { prismaPlugin } from './plugins/prisma.js';
import { authPlugin } from './plugins/auth.js';
import { errorHandler } from './plugins/error-handler.js';
import { healthRoutes } from './routes/health.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { usersRoutes } from './routes/users.routes.js';
import { groupsRoutes } from './routes/groups.routes.js';
import { shoppingRoutes } from './routes/shopping.routes.js';
import { fridgeRoutes } from './routes/fridge.routes.js';
import { recipesRoutes } from './routes/recipes.routes.js';
import { ingredientsRoutes } from './routes/ingredients.routes.js';
import { toolsRoutes } from './routes/tools.routes.js';
import { storesRoutes } from './routes/stores.routes.js';
import { chatRoutes } from './routes/chat.routes.js';
import { tasksRoutes } from './routes/tasks.routes.js';
import { mealPlanRoutes } from './routes/meal-plan.routes.js';

export async function buildServer() {
  const app = Fastify({
    logger: {
      level: config.NODE_ENV === 'production' ? 'info' : 'debug',
      transport:
        config.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss', ignore: 'pid,hostname' } }
          : undefined,
    },
  });

  // API consommée par Expo web (8081) → localhost:3001 : autoriser la lecture cross-origin.
  await app.register(helmet, {
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });
  await app.register(cors, { origin: true, credentials: true });
  await app.register(rateLimit, {
    max: config.RATE_LIMIT_MAX,
    timeWindow: config.RATE_LIMIT_WINDOW,
    allowList: (req) => req.url.startsWith('/health'),
    keyGenerator: (req) => req.ip,
    errorResponseBuilder: (_req, context) => ({
      code: 'RATE_LIMITED',
      message: 'Trop de requêtes. Réessayez dans un instant.',
      retryAfter: context.after,
    }),
  });

  app.setErrorHandler(errorHandler);

  await app.register(prismaPlugin);
  await app.register(authPlugin);

  await app.register(healthRoutes, { prefix: '/health' });
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(usersRoutes, { prefix: '/api/users' });
  await app.register(groupsRoutes, { prefix: '/api/groups' });
  await app.register(shoppingRoutes, { prefix: '/api/shopping' });
  await app.register(fridgeRoutes, { prefix: '/api/fridge' });
  await app.register(recipesRoutes, { prefix: '/api/recipes' });
  await app.register(ingredientsRoutes, { prefix: '/api/ingredients' });
  await app.register(toolsRoutes, { prefix: '/api/tools' });
  await app.register(storesRoutes, { prefix: '/api/stores' });
  await app.register(chatRoutes, { prefix: '/api/chat' });
  await app.register(tasksRoutes, { prefix: '/api/tasks' });
  await app.register(mealPlanRoutes, { prefix: '/api/meal-plan' });

  return app;
}

async function start() {
  const app = await buildServer();
  try {
    await app.listen({ port: config.PORT, host: '0.0.0.0' });
    app.log.info(`API homeshared démarrée sur le port ${config.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

if (!process.env.VITEST) {
  void start();
}

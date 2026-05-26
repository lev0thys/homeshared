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

  await app.register(helmet);
  await app.register(cors, { origin: true, credentials: true });
  await app.register(rateLimit, { max: 200, timeWindow: '1 minute' });

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

start();

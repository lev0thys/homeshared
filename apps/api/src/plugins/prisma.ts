import type { FastifyPluginAsync } from 'fastify';

import fp from 'fastify-plugin';

import { PrismaClient } from '@prisma/client';

import { withSupabasePoolLimits } from '../lib/database-url.js';



declare module 'fastify' {

  interface FastifyInstance {

    prisma: PrismaClient;

  }

}



/** Évite les fuites de connexions au hot-reload tsx (dev). */

const globalForPrisma = globalThis as unknown as { homesharedPrisma?: PrismaClient };



const plugin: FastifyPluginAsync = async (app) => {

  const logQueries = process.env.PRISMA_LOG_QUERIES === '1';

  const databaseUrl = withSupabasePoolLimits(process.env.DATABASE_URL ?? '');



  if (databaseUrl !== process.env.DATABASE_URL) {

    app.log.warn(

      'DATABASE_URL Supabase pooler : connection_limit=1 appliqué (évite max clients session mode).',

    );

  }



  const prisma =

    globalForPrisma.homesharedPrisma ??

    new PrismaClient({

      log: logQueries ? ['query', 'warn', 'error'] : ['warn', 'error'],

      datasources: { db: { url: databaseUrl } },

    });



  if (process.env.NODE_ENV !== 'production') {

    globalForPrisma.homesharedPrisma = prisma;

  }



  await prisma.$connect();

  app.decorate('prisma', prisma);



  app.addHook('onClose', async () => {

    if (process.env.NODE_ENV === 'production') {

      await prisma.$disconnect();

    }

  });

};



export const prismaPlugin = fp(plugin, { name: 'prisma' });



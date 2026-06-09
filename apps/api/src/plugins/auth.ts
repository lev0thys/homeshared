import type { FastifyPluginAsync, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { ApiError } from '@homeshared/shared';
import { config } from '../config.js';
import {
  getCachedAuthUserId,
  resolveDisplayName,
  resolveUsername,
  setCachedAuthUserId,
  suggestUsernameFromMetadata,
} from '../services/auth-cache.service.js';
import { withPrismaReconnect } from '../services/prisma-reconnect.service.js';

declare module 'fastify' {
  interface FastifyInstance {
    supabase: SupabaseClient;
    requireAuth: (req: FastifyRequest) => Promise<void>;
  }
  interface FastifyRequest {
    userId?: string;
  }
}

const plugin: FastifyPluginAsync = async (app) => {
  const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  app.decorate('supabase', supabase);

  app.decorate('requireAuth', async (req: FastifyRequest) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new ApiError('UNAUTHORIZED', 'Token manquant.');
    }
    const token = header.slice('Bearer '.length);

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      throw new ApiError('UNAUTHORIZED', 'Token invalide ou expiré.');
    }

    const supabaseUser = data.user;

    const cached = getCachedAuthUserId(supabaseUser.id);
    if (cached) {
      req.userId = cached;
      return;
    }

    const localUser = await withPrismaReconnect(app.prisma, async () => {
      const existing = await app.prisma.user.findUnique({
        where: { id: supabaseUser.id },
        select: { id: true },
      });
      if (existing) return existing;

      const metadata = supabaseUser.user_metadata as Record<string, unknown> | undefined;
      const metaUsername = suggestUsernameFromMetadata(metadata, supabaseUser.email ?? undefined);
      let usernameTaken = false;
      if (metaUsername) {
        const taken = await app.prisma.user.findFirst({
          where: { username: metaUsername, NOT: { id: supabaseUser.id } },
          select: { id: true },
        });
        usernameTaken = !!taken;
      }
      const username = resolveUsername(metaUsername, supabaseUser.id, usernameTaken);
      const displayName = resolveDisplayName(metadata, supabaseUser.email ?? undefined);

      return app.prisma.user.upsert({
        where: { id: supabaseUser.id },
        update: {},
        create: {
          id: supabaseUser.id,
          email: supabaseUser.email ?? `${supabaseUser.id}@unknown.local`,
          username,
          displayName,
          isChild: metadata?.is_child === true,
        },
        select: { id: true },
      });
    });

    setCachedAuthUserId(supabaseUser.id, localUser.id);
    req.userId = localUser.id;
  });
};

export const authPlugin = fp(plugin, { name: 'auth', dependencies: ['prisma'] });

import type { FastifyPluginAsync, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { ApiError } from '@homeshared/shared';
import { config } from '../config.js';

declare module 'fastify' {
  interface FastifyInstance {
    supabase: SupabaseClient;
    /**
     * Garde d'authentification : décode le Bearer token Supabase,
     * synchronise/crée l'utilisateur en base et l'attache à la request.
     */
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

    // Synchronisation lazy : la première requête authentifiée d'un user
    // Supabase crée son entrée locale (User) avec les métadonnées.
    const supabaseUser = data.user;
    const localUser = await app.prisma.user.upsert({
      where: { id: supabaseUser.id },
      update: {},
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email ?? `${supabaseUser.id}@unknown.local`,
        username: (supabaseUser.user_metadata?.username as string | undefined) ?? `user_${supabaseUser.id.slice(0, 8)}`,
        displayName: (supabaseUser.user_metadata?.display_name as string | undefined) ?? 'Nouveau membre',
      },
    });

    req.userId = localUser.id;
  });
};

export const authPlugin = fp(plugin, { name: 'auth', dependencies: ['prisma'] });

import type { FastifyPluginAsync } from 'fastify';
import { ApiError } from '@homeshared/shared';

/**
 * Les routes d'auth délèguent à Supabase Auth côté client (signup/login).
 * Le backend expose juste un endpoint /me qui décode le token et renvoie
 * le profil local synchronisé.
 */
export const authRoutes: FastifyPluginAsync = async (app) => {
  app.get('/me', async (req) => {
    await app.requireAuth(req);
    const user = await app.prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) throw new ApiError('NOT_FOUND', 'Profil introuvable.');
    return user;
  });
};

import type { FastifyPluginAsync } from 'fastify';
import { updateProfileSchema, ApiError } from '@homeshared/shared';
import { deleteUserAccount } from '../services/delete-user.service.js';

const profileSelect = {
  id: true,
  email: true,
  username: true,
  displayName: true,
  avatarUrl: true,
  bio: true,
  isChild: true,
  createdAt: true,
  _count: { select: { memberships: true, recipeFavorites: true } },
} as const;

export const usersRoutes: FastifyPluginAsync = async (app) => {
  app.get('/me', async (req) => {
    await app.requireAuth(req);
    const user = await app.prisma.user.findUnique({
      where: { id: req.userId! },
      select: profileSelect,
    });
    if (!user) throw new ApiError('NOT_FOUND', 'Utilisateur introuvable.');
    return user;
  });

  app.patch('/me', async (req) => {
    await app.requireAuth(req);
    const input = updateProfileSchema.parse(req.body);
    const updated = await app.prisma.user.update({
      where: { id: req.userId! },
      data: input,
      select: profileSelect,
    });
    return updated;
  });

  app.delete('/me', async (req, reply) => {
    await app.requireAuth(req);
    await deleteUserAccount(app.prisma, app.supabase, req.userId!);
    return reply.status(204).send();
  });

  app.get('/:userId', async (req) => {
    await app.requireAuth(req);
    const { userId } = req.params as { userId: string };
    const user = await app.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        _count: { select: { memberships: true } },
      },
    });
    if (!user) throw new ApiError('NOT_FOUND', 'Utilisateur introuvable.');
    return user;
  });
};

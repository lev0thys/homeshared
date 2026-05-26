import type { FastifyPluginAsync } from 'fastify';
import { updateProfileSchema, ApiError } from '@homeshared/shared';

export const usersRoutes: FastifyPluginAsync = async (app) => {
  app.patch('/me', async (req) => {
    await app.requireAuth(req);
    const input = updateProfileSchema.parse(req.body);
    const updated = await app.prisma.user.update({
      where: { id: req.userId! },
      data: input,
    });
    return updated;
  });

  app.get('/:userId', async (req) => {
    await app.requireAuth(req);
    const { userId } = req.params as { userId: string };
    const user = await app.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, displayName: true, avatarUrl: true, createdAt: true },
    });
    if (!user) throw new ApiError('NOT_FOUND', 'Utilisateur introuvable.');
    return user;
  });
};

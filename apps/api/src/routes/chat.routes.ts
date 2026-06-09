import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { ApiError } from '@homeshared/shared';
import { ensureMembership } from '../services/group.service.js';
import { rateLimitRoutes } from '../constants/rate-limits.js';

const postMessageSchema = z.object({
  groupId: z.string().uuid(),
  body: z.string().trim().min(1).max(2000),
});

export const chatRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', (req) => app.requireAuth(req));

  app.get('/:groupId', async (req) => {
    const { groupId } = req.params as { groupId: string };
    await ensureMembership(app.prisma, groupId, req.userId!);
    return app.prisma.groupMessage.findMany({
      where: { groupId },
      orderBy: { createdAt: 'asc' },
      take: 100,
      include: {
        author: { select: { id: true, displayName: true, username: true, avatarUrl: true } },
      },
    });
  });

  app.post('/', { config: rateLimitRoutes.chatMessage }, async (req) => {
    const input = postMessageSchema.parse(req.body);
    await ensureMembership(app.prisma, input.groupId, req.userId!);
    return app.prisma.groupMessage.create({
      data: {
        groupId: input.groupId,
        authorId: req.userId!,
        body: input.body,
      },
      include: {
        author: { select: { id: true, displayName: true, username: true, avatarUrl: true } },
      },
    });
  });

  app.delete('/:messageId', async (req, reply) => {
    const { messageId } = req.params as { messageId: string };
    const msg = await app.prisma.groupMessage.findUnique({ where: { id: messageId } });
    if (!msg) throw new ApiError('NOT_FOUND', 'Message introuvable.');
    await ensureMembership(app.prisma, msg.groupId, req.userId!);
    if (msg.authorId !== req.userId!) {
      throw new ApiError('FORBIDDEN', 'Seul l\'auteur peut supprimer ce message.');
    }
    await app.prisma.groupMessage.delete({ where: { id: messageId } });
    return reply.status(204).send();
  });
};

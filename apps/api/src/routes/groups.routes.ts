import type { FastifyPluginAsync } from 'fastify';
import { randomBytes } from 'node:crypto';
import {
  createGroupSchema,
  updateGroupSchema,
  acceptInviteSchema,
  createInviteSchema,
  ApiError,
} from '@homeshared/shared';
import { ensureMembership, ensureRole } from '../services/group.service.js';

export const groupsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', (req) => app.requireAuth(req));

  // Liste les groupes de l'utilisateur
  app.get('/', async (req) => {
    return app.prisma.group.findMany({
      where: { memberships: { some: { userId: req.userId! } } },
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { memberships: true } } },
    });
  });

  // Crée un groupe (créateur = OWNER automatiquement)
  app.post('/', async (req) => {
    const input = createGroupSchema.parse(req.body);
    return app.prisma.group.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        ownerId: req.userId!,
        memberships: {
          create: { userId: req.userId!, role: 'OWNER' },
        },
      },
    });
  });

  // Détail d'un groupe
  app.get('/:groupId', async (req) => {
    const { groupId } = req.params as { groupId: string };
    await ensureMembership(app.prisma, groupId, req.userId!);
    return app.prisma.group.findUniqueOrThrow({
      where: { id: groupId },
      include: {
        memberships: { include: { user: { select: { id: true, username: true, displayName: true, avatarUrl: true } } } },
      },
    });
  });

  // MAJ d'un groupe (admin+)
  app.patch('/:groupId', async (req) => {
    const { groupId } = req.params as { groupId: string };
    await ensureRole(app.prisma, groupId, req.userId!, ['OWNER', 'ADMIN']);
    const input = updateGroupSchema.parse(req.body);
    return app.prisma.group.update({ where: { id: groupId }, data: input });
  });

  // Création d'une invitation
  app.post('/invites', async (req) => {
    const input = createInviteSchema.parse(req.body);
    await ensureRole(app.prisma, input.groupId, req.userId!, ['OWNER', 'ADMIN']);
    const token = randomBytes(24).toString('base64url');
    const expiresAt = new Date(Date.now() + input.expiresInHours * 3600 * 1000);
    return app.prisma.invite.create({
      data: {
        groupId: input.groupId,
        createdBy: req.userId!,
        token,
        expiresAt,
      },
    });
  });

  // Acceptation d'une invitation (rejoint le groupe)
  app.post('/invites/accept', async (req) => {
    const { token } = acceptInviteSchema.parse(req.body);
    const invite = await app.prisma.invite.findUnique({ where: { token } });
    if (!invite) throw new ApiError('NOT_FOUND', 'Invitation introuvable.');
    if (invite.usedAt) throw new ApiError('INVITE_ALREADY_USED', 'Invitation déjà utilisée.');
    if (invite.expiresAt < new Date()) throw new ApiError('INVITE_EXPIRED', 'Invitation expirée.');

    return app.prisma.$transaction(async (tx) => {
      await tx.invite.update({
        where: { id: invite.id },
        data: { usedAt: new Date(), usedBy: req.userId! },
      });
      return tx.membership.upsert({
        where: { groupId_userId: { groupId: invite.groupId, userId: req.userId! } },
        update: {},
        create: { groupId: invite.groupId, userId: req.userId!, role: 'MEMBER' },
        include: { group: true },
      });
    });
  });
};

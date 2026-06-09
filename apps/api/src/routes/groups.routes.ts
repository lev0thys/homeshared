import type { FastifyPluginAsync } from 'fastify';
import { randomBytes } from 'node:crypto';
import {
  createGroupSchema,
  updateGroupSchema,
  acceptInviteSchema,
  createInviteSchema,
  updateMembershipSchema,
  ApiError,
} from '@homeshared/shared';
import {
  ensureMembership,
  ensurePersonalGroup,
  ensureRole,
  ensureGroupFeature,
} from '../services/group.service.js';
import { updateMealPermissionsSchema } from '@homeshared/shared';
import {
  getMealPermissionsConfig,
  updateMealPermissionsConfig,
} from '../services/group-permissions.service.js';
import { rateLimitRoutes } from '../constants/rate-limits.js';

export const groupsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', (req) => app.requireAuth(req));

  // Liste les groupes de l'utilisateur (espace personnel créé automatiquement si besoin)
  app.get('/', async (req) => {
    await ensurePersonalGroup(app.prisma, req.userId!);
    const rows = await app.prisma.group.findMany({
      where: { memberships: { some: { userId: req.userId! } } },
      orderBy: [{ isPersonal: 'desc' }, { updatedAt: 'desc' }],
      include: {
        _count: { select: { memberships: true } },
        memberships: {
          where: { userId: req.userId! },
          select: { role: true },
          take: 1,
        },
      },
    });
    return rows.map(({ memberships, ...g }) => ({
      ...g,
      myRole: memberships[0]?.role ?? 'MEMBER',
    }));
  });

  // Crée un groupe (créateur = OWNER automatiquement)
  app.post('/', { config: rateLimitRoutes.createGroup }, async (req) => {
    const owner = await app.prisma.user.findUnique({
      where: { id: req.userId! },
      select: { isChild: true },
    });
    if (owner?.isChild) {
      throw new ApiError(
        'FORBIDDEN',
        'Les comptes enfant ne peuvent pas créer de groupe. Utilisez un compte adulte.',
      );
    }

    const input = createGroupSchema.parse(req.body);
    return app.prisma.group.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        imageUrl: input.imageUrl ?? null,
        features: input.features,
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
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
                isChild: true,
              },
            },
          },
        },
      },
    });
  });

  // MAJ d'un groupe (admin+)
  app.patch('/:groupId', async (req) => {
    const { groupId } = req.params as { groupId: string };
    await ensureRole(app.prisma, groupId, req.userId!, ['OWNER', 'ADMIN']);
    const input = updateGroupSchema.parse(req.body);
    return app.prisma.group.update({
      where: { id: groupId },
      data: {
        name: input.name,
        description: input.description,
        imageUrl: input.imageUrl,
        features: input.features,
      },
    });
  });

  // Suppression d'un groupe (propriétaire uniquement, pas l'espace personnel)
  app.delete('/:groupId', async (req, reply) => {
    const { groupId } = req.params as { groupId: string };
    await ensureRole(app.prisma, groupId, req.userId!, ['OWNER']);
    const group = await app.prisma.group.findUniqueOrThrow({ where: { id: groupId } });
    if (group.isPersonal) {
      throw new ApiError('FORBIDDEN', 'L\'espace personnel ne peut pas être supprimé.');
    }
    await app.prisma.group.delete({ where: { id: groupId } });
    return reply.status(204).send();
  });

  // MAJ statut enfant d'un membre (titulaire uniquement)
  app.patch('/:groupId/members/:membershipId', async (req) => {
    const { groupId, membershipId } = req.params as { groupId: string; membershipId: string };
    await ensureRole(app.prisma, groupId, req.userId!, ['OWNER']);
    const input = updateMembershipSchema.parse(req.body);
    const membership = await app.prisma.membership.findFirst({
      where: { id: membershipId, groupId },
    });
    if (!membership) throw new ApiError('NOT_FOUND', 'Membre introuvable.');
    return app.prisma.membership.update({
      where: { id: membershipId },
      data: { isChild: input.isChild },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, isChild: true },
        },
      },
    });
  });

  // Création d'une invitation
  app.post('/invites', { config: rateLimitRoutes.invites }, async (req) => {
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

  // Droits repas + réglages sync tâches (lecture : tous les membres ; écriture : OWNER)
  app.get('/:groupId/meal-permissions', async (req) => {
    const { groupId } = req.params as { groupId: string };
    await ensureMembership(app.prisma, groupId, req.userId!);
    await ensureGroupFeature(app.prisma, groupId, 'RECIPES');
    return getMealPermissionsConfig(app.prisma, groupId, req.userId!);
  });

  app.put('/:groupId/meal-permissions', async (req) => {
    const { groupId } = req.params as { groupId: string };
    await ensureMembership(app.prisma, groupId, req.userId!);
    await ensureGroupFeature(app.prisma, groupId, 'RECIPES');
    const input = updateMealPermissionsSchema.parse(req.body);
    return updateMealPermissionsConfig(app.prisma, groupId, req.userId!, input);
  });

  // Acceptation d'une invitation (rejoint le groupe)
  app.post('/invites/accept', { config: rateLimitRoutes.invites }, async (req) => {
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

import type { FastifyPluginAsync } from 'fastify';
import { previewInviteQuerySchema, ApiError, type InvitePreviewStatus } from '@homeshared/shared';
import { rateLimitRoutes } from '../constants/rate-limits.js';

export interface InvitePreviewResponse {
  status: InvitePreviewStatus;
  token: string;
  expiresAt: string;
  group: {
    name: string;
    description: string | null;
    imageUrl: string | null;
    memberCount: number;
  };
  invitedBy: string;
}

/** Lecture publique d'une invitation (aperçu fiche groupe avant connexion). */
export const invitePublicRoutes: FastifyPluginAsync = async (app) => {
  app.get('/preview', { config: rateLimitRoutes.invites }, async (req) => {
    const { token } = previewInviteQuerySchema.parse(req.query);

    const invite = await app.prisma.invite.findUnique({
      where: { token },
      include: {
        group: {
          select: {
            name: true,
            description: true,
            imageUrl: true,
            isPersonal: true,
            _count: { select: { memberships: true } },
          },
        },
        creator: { select: { displayName: true } },
      },
    });

    if (!invite) {
      throw new ApiError('NOT_FOUND', 'Invitation introuvable ou lien invalide.');
    }
    if (invite.group.isPersonal) {
      throw new ApiError('FORBIDDEN', 'Cet espace ne peut pas être rejoint par invitation.');
    }

    const base: InvitePreviewResponse = {
      status: 'valid',
      token: invite.token,
      expiresAt: invite.expiresAt.toISOString(),
      group: {
        name: invite.group.name,
        description: invite.group.description,
        imageUrl: invite.group.imageUrl,
        memberCount: invite.group._count.memberships,
      },
      invitedBy: invite.creator.displayName,
    };

    if (invite.usedAt) {
      return { ...base, status: 'used' as const };
    }
    if (invite.expiresAt < new Date()) {
      return { ...base, status: 'expired' as const };
    }

    return base;
  });
};

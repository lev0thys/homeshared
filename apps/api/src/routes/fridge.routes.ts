import type { FastifyPluginAsync } from 'fastify';
import {
  createFridgeItemSchema,
  updateFridgeItemSchema,
  consumeFridgeItemSchema,
  ApiError,
} from '@homeshared/shared';
import { ensureMembership } from '../services/group.service.js';
import { addToFridge } from '../services/fridge.service.js';

export const fridgeRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', (req) => app.requireAuth(req));

  // Contenu du frigo d'un groupe (les bientôt-expirés en premier)
  app.get('/:groupId', async (req) => {
    const { groupId } = req.params as { groupId: string };
    await ensureMembership(app.prisma, groupId, req.userId!);
    return app.prisma.fridgeItem.findMany({
      where: { groupId },
      orderBy: [{ expiresAt: { sort: 'asc', nulls: 'last' } }, { name: 'asc' }],
    });
  });

  // Ajout manuel d'un item au frigo (sans passer par la liste de courses)
  app.post('/', async (req) => {
    const input = createFridgeItemSchema.parse(req.body);
    await ensureMembership(app.prisma, input.groupId, req.userId!);
    return app.prisma.$transaction(async (tx) => {
      await addToFridge(tx, {
        groupId: input.groupId,
        name: input.name,
        quantity: input.quantity,
        unit: input.unit ?? null,
      });
      return tx.fridgeItem.findFirst({
        where: { groupId: input.groupId, name: { equals: input.name.trim(), mode: 'insensitive' } },
        orderBy: { addedAt: 'desc' },
      });
    });
  });

  // MAJ (renommer, changer quantité, ajouter date d'expiration)
  app.patch('/:itemId', async (req) => {
    const { itemId } = req.params as { itemId: string };
    const input = updateFridgeItemSchema.parse(req.body);
    const item = await app.prisma.fridgeItem.findUnique({ where: { id: itemId } });
    if (!item) throw new ApiError('NOT_FOUND', 'Item frigo introuvable.');
    await ensureMembership(app.prisma, item.groupId, req.userId!);
    return app.prisma.fridgeItem.update({
      where: { id: itemId },
      data: {
        ...input,
        expiresAt: input.expiresAt === undefined ? undefined : input.expiresAt ? new Date(input.expiresAt) : null,
      },
    });
  });

  // Consommer X unités (décrémente, supprime l'entrée si quantité atteint 0)
  app.post('/:itemId/consume', async (req) => {
    const { itemId } = req.params as { itemId: string };
    const input = consumeFridgeItemSchema.parse(req.body);
    const item = await app.prisma.fridgeItem.findUnique({ where: { id: itemId } });
    if (!item) throw new ApiError('NOT_FOUND', 'Item frigo introuvable.');
    await ensureMembership(app.prisma, item.groupId, req.userId!);

    const remaining = Number(item.quantity) - input.quantity;
    if (remaining <= 0) {
      await app.prisma.fridgeItem.delete({ where: { id: itemId } });
      return { deleted: true };
    }
    return app.prisma.fridgeItem.update({
      where: { id: itemId },
      data: { quantity: remaining },
    });
  });

  // Suppression brutale
  app.delete('/:itemId', async (req, reply) => {
    const { itemId } = req.params as { itemId: string };
    const item = await app.prisma.fridgeItem.findUnique({ where: { id: itemId } });
    if (!item) throw new ApiError('NOT_FOUND', 'Item frigo introuvable.');
    await ensureMembership(app.prisma, item.groupId, req.userId!);
    await app.prisma.fridgeItem.delete({ where: { id: itemId } });
    return reply.status(204).send();
  });
};

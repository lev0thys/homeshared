import type { FastifyPluginAsync } from 'fastify';
import {
  createShoppingItemSchema,
  updateShoppingItemSchema,
  purchaseShoppingItemSchema,
  ApiError,
} from '@homeshared/shared';
import { ensureMembership } from '../services/group.service.js';
import { addToFridge } from '../services/fridge.service.js';

export const shoppingRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', (req) => app.requireAuth(req));

  // Liste des items d'un groupe (par défaut : non achetés en haut)
  app.get('/:groupId', async (req) => {
    const { groupId } = req.params as { groupId: string };
    await ensureMembership(app.prisma, groupId, req.userId!);
    return app.prisma.shoppingItem.findMany({
      where: { groupId },
      orderBy: [{ purchasedAt: { sort: 'asc', nulls: 'first' } }, { addedAt: 'desc' }],
      include: {
        addedBy: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        purchasedBy: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });
  });

  // Ajout d'un item à la liste de courses
  app.post('/', async (req) => {
    const input = createShoppingItemSchema.parse(req.body);
    await ensureMembership(app.prisma, input.groupId, req.userId!);
    return app.prisma.shoppingItem.create({
      data: {
        groupId: input.groupId,
        name: input.name,
        quantity: input.quantity,
        unit: input.unit ?? null,
        notes: input.notes ?? null,
        addedById: req.userId!,
      },
    });
  });

  // MAJ d'un item (renommer, changer quantité…)
  app.patch('/:itemId', async (req) => {
    const { itemId } = req.params as { itemId: string };
    const input = updateShoppingItemSchema.parse(req.body);
    const item = await app.prisma.shoppingItem.findUnique({ where: { id: itemId } });
    if (!item) throw new ApiError('NOT_FOUND', 'Item introuvable.');
    await ensureMembership(app.prisma, item.groupId, req.userId!);
    return app.prisma.shoppingItem.update({ where: { id: itemId }, data: input });
  });

  // Suppression d'un item
  app.delete('/:itemId', async (req, reply) => {
    const { itemId } = req.params as { itemId: string };
    const item = await app.prisma.shoppingItem.findUnique({ where: { id: itemId } });
    if (!item) throw new ApiError('NOT_FOUND', 'Item introuvable.');
    await ensureMembership(app.prisma, item.groupId, req.userId!);
    await app.prisma.shoppingItem.delete({ where: { id: itemId } });
    return reply.status(204).send();
  });

  // "Cocher" un item au caddie : marque comme acheté ET incrémente le frigo
  app.post('/:itemId/purchase', async (req) => {
    const { itemId } = req.params as { itemId: string };
    const input = purchaseShoppingItemSchema.parse(req.body ?? {});
    const item = await app.prisma.shoppingItem.findUnique({ where: { id: itemId } });
    if (!item) throw new ApiError('NOT_FOUND', 'Item introuvable.');
    if (item.purchasedAt) throw new ApiError('CONFLICT', 'Item déjà marqué comme acheté.');
    await ensureMembership(app.prisma, item.groupId, req.userId!);

    return app.prisma.$transaction(async (tx) => {
      const purchased = await tx.shoppingItem.update({
        where: { id: itemId },
        data: { purchasedAt: new Date(), purchasedById: req.userId! },
      });

      await addToFridge(tx, {
        groupId: item.groupId,
        name: item.name,
        quantity: Number(input.purchasedQuantity ?? item.quantity),
        unit: item.unit,
      });

      return purchased;
    });
  });

  // Dé-cocher un item (au cas où on s'est trompé)
  app.post('/:itemId/unpurchase', async (req) => {
    const { itemId } = req.params as { itemId: string };
    const item = await app.prisma.shoppingItem.findUnique({ where: { id: itemId } });
    if (!item) throw new ApiError('NOT_FOUND', 'Item introuvable.');
    if (!item.purchasedAt) throw new ApiError('CONFLICT', 'Item pas marqué comme acheté.');
    await ensureMembership(app.prisma, item.groupId, req.userId!);

    return app.prisma.shoppingItem.update({
      where: { id: itemId },
      data: { purchasedAt: null, purchasedById: null },
    });
  });
};

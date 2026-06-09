import type { FastifyPluginAsync } from 'fastify';
import {
  createShoppingItemSchema,
  updateShoppingItemSchema,
  purchaseShoppingItemSchema,
  finalizeShoppingSchema,
  ApiError,
} from '@homeshared/shared';
import { hasGroupFeature } from '@homeshared/shared';
import { ensureGroupFeature, ensureMembership } from '../services/group.service.js';
import { addToFridge } from '../services/fridge.service.js';
import { enrichShoppingItemsWithAisles } from '../services/shopping-aisle.service.js';
import { rateLimitRoutes } from '../constants/rate-limits.js';

export const shoppingRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', (req) => app.requireAuth(req));

  // Liste des items d'un groupe (par défaut : non achetés en haut)
  app.get('/:groupId', async (req) => {
    const { groupId } = req.params as { groupId: string };
    await ensureMembership(app.prisma, groupId, req.userId!);
    await ensureGroupFeature(app.prisma, groupId, 'SHOPPING');
    const rows = await app.prisma.shoppingItem.findMany({
      where: { groupId },
      orderBy: [{ purchasedAt: { sort: 'asc', nulls: 'first' } }, { addedAt: 'desc' }],
      include: {
        addedBy: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        purchasedBy: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });
    return enrichShoppingItemsWithAisles(app.prisma, rows);
  });

  // Ajout d'un item à la liste de courses
  app.post('/', { config: rateLimitRoutes.write }, async (req) => {
    const input = createShoppingItemSchema.parse(req.body);
    await ensureMembership(app.prisma, input.groupId, req.userId!);
    await ensureGroupFeature(app.prisma, input.groupId, 'SHOPPING');
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
    const rawBody = req.body;
    const input = purchaseShoppingItemSchema.parse(
      rawBody === null || rawBody === undefined || rawBody === '' ? {} : rawBody,
    );
    const item = await app.prisma.shoppingItem.findUnique({ where: { id: itemId } });
    if (!item) throw new ApiError('NOT_FOUND', 'Item introuvable.');
    if (item.purchasedAt) throw new ApiError('CONFLICT', 'Item déjà marqué comme acheté.');
    await ensureMembership(app.prisma, item.groupId, req.userId!);

    const group = await app.prisma.group.findUnique({
      where: { id: item.groupId },
      select: { features: true },
    });

    const qty = Number(input.purchasedQuantity ?? item.quantity);
    const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1;

    return app.prisma.$transaction(async (tx) => {
      const purchased = await tx.shoppingItem.update({
        where: { id: itemId },
        data: { purchasedAt: new Date(), purchasedById: req.userId! },
      });

      if (hasGroupFeature(group?.features, 'FRIDGE')) {
        await addToFridge(tx, {
          groupId: item.groupId,
          name: item.name,
          quantity: safeQty,
          unit: item.unit,
        });
      }

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

  /** Cocher tous les articles restants (caddie complet avant paiement). */
  app.post('/:groupId/purchase-all', async (req) => {
    const { groupId } = req.params as { groupId: string };
    await ensureMembership(app.prisma, groupId, req.userId!);
    await ensureGroupFeature(app.prisma, groupId, 'SHOPPING');

    const pending = await app.prisma.shoppingItem.findMany({
      where: { groupId, purchasedAt: null },
    });
    if (pending.length === 0) {
      return { purchased: 0 };
    }

    const group = await app.prisma.group.findUnique({
      where: { id: groupId },
      select: { features: true },
    });
    const hasFridge = hasGroupFeature(group?.features, 'FRIDGE');

    await app.prisma.$transaction(async (tx) => {
      for (const item of pending) {
        await tx.shoppingItem.update({
          where: { id: item.id },
          data: { purchasedAt: new Date(), purchasedById: req.userId! },
        });
        if (hasFridge) {
          await addToFridge(tx, {
            groupId,
            name: item.name,
            quantity: Number(item.quantity),
            unit: item.unit,
          });
        }
      }
    });

    return { purchased: pending.length };
  });

  /**
   * Finalise les courses après paiement : supprime les articles du caddie.
   * Les articles non cochés restent sauf si discardUnpurchased=true.
   */
  app.post('/:groupId/finalize', async (req) => {
    const { groupId } = req.params as { groupId: string };
    const input = finalizeShoppingSchema.parse(req.body ?? {});
    await ensureMembership(app.prisma, groupId, req.userId!);
    await ensureGroupFeature(app.prisma, groupId, 'SHOPPING');

    const purchased = await app.prisma.shoppingItem.count({
      where: { groupId, purchasedAt: { not: null } },
    });
    const unpurchased = await app.prisma.shoppingItem.count({
      where: { groupId, purchasedAt: null },
    });

    if (purchased === 0 && unpurchased === 0) {
      return { cleared: 0, remaining: 0 };
    }

    if (unpurchased > 0 && !input.discardUnpurchased) {
      throw new ApiError(
        'CONFLICT',
        `${unpurchased} article(s) pas encore dans le caddie. Coche-les ou active « ignorer le reste ».`,
      );
    }

    const result = await app.prisma.$transaction(async (tx) => {
      const deletedPurchased = await tx.shoppingItem.deleteMany({
        where: { groupId, purchasedAt: { not: null } },
      });
      let deletedUnpurchased = 0;
      if (input.discardUnpurchased) {
        const r = await tx.shoppingItem.deleteMany({
          where: { groupId, purchasedAt: null },
        });
        deletedUnpurchased = r.count;
      }
      return { cleared: deletedPurchased.count + deletedUnpurchased, remaining: unpurchased - deletedUnpurchased };
    });

    return result;
  });
};

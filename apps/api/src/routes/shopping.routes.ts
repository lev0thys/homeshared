import type { FastifyPluginAsync } from 'fastify';
import {
  createShoppingItemSchema,
  updateShoppingItemSchema,
  purchaseShoppingItemSchema,
  finalizeShoppingSchema,
  ApiError,
} from '@homeshared/shared';
import { ensureGroupFeature, ensureMembership } from '../services/group.service.js';
import { enrichShoppingItemsWithAisles } from '../services/shopping-aisle.service.js';
import {
  commitPurchasedCartForGroup,
  commitPurchasedCartToFridge,
} from '../services/shopping-commit.service.js';
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

  // Cocher = dans le caddie uniquement (frigo à la finalisation / commit).
  app.post('/:itemId/purchase', async (req) => {
    const { itemId } = req.params as { itemId: string };
    const rawBody = req.body;
    purchaseShoppingItemSchema.parse(
      rawBody === null || rawBody === undefined || rawBody === '' ? {} : rawBody,
    );
    const item = await app.prisma.shoppingItem.findUnique({ where: { id: itemId } });
    if (!item) throw new ApiError('NOT_FOUND', 'Item introuvable.');
    if (item.purchasedAt) throw new ApiError('CONFLICT', 'Item déjà marqué comme acheté.');
    await ensureMembership(app.prisma, item.groupId, req.userId!);

    return app.prisma.shoppingItem.update({
      where: { id: itemId },
      data: { purchasedAt: new Date(), purchasedById: req.userId! },
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

    await app.prisma.$transaction(async (tx) => {
      for (const item of pending) {
        await tx.shoppingItem.update({
          where: { id: item.id },
          data: { purchasedAt: new Date(), purchasedById: req.userId! },
        });
      }
    });

    return { purchased: pending.length };
  });

  /**
   * Transfère le caddie (articles cochés) vers le frigo et les retire de la liste.
   * Les articles non cochés restent sur la liste.
   */
  app.post('/:groupId/commit-cart', { config: rateLimitRoutes.write }, async (req) => {
    const { groupId } = req.params as { groupId: string };
    await ensureMembership(app.prisma, groupId, req.userId!);
    await ensureGroupFeature(app.prisma, groupId, 'SHOPPING');
    return commitPurchasedCartForGroup(app.prisma, groupId);
  });

  /**
   * Finalise les courses après paiement : frigo + suppression des articles cochés.
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
      const group = await tx.group.findUnique({
        where: { id: groupId },
        select: { features: true },
      });

      const commit = await commitPurchasedCartToFridge(tx, groupId, group?.features);

      let deletedUnpurchased = 0;
      if (input.discardUnpurchased) {
        const r = await tx.shoppingItem.deleteMany({
          where: { groupId, purchasedAt: null },
        });
        deletedUnpurchased = r.count;
      }

      return {
        cleared: commit.committed + deletedUnpurchased,
        remaining: input.discardUnpurchased ? 0 : commit.remaining,
        committedToFridge: commit.committed,
      };
    });

    return result;
  });
};

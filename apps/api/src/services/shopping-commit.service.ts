import type { PrismaClient, Prisma } from '@prisma/client';
import { hasGroupFeature } from '@homeshared/shared';
import { addToFridge } from './fridge.service.js';

export interface CommitPurchasedCartResult {
  committed: number;
  remaining: number;
}

function safeQuantity(raw: unknown): number {
  const qty = Number(raw);
  return Number.isFinite(qty) && qty > 0 ? qty : 1;
}

/**
 * Transfère les articles cochés (caddie) vers le frigo puis les retire de la liste.
 * Ne touche pas aux articles encore non cochés.
 */
export async function commitPurchasedCartToFridge(
  tx: Prisma.TransactionClient,
  groupId: string,
  features: string[] | null | undefined,
): Promise<CommitPurchasedCartResult> {
  const purchased = await tx.shoppingItem.findMany({
    where: { groupId, purchasedAt: { not: null } },
  });

  if (purchased.length === 0) {
    const remaining = await tx.shoppingItem.count({ where: { groupId, purchasedAt: null } });
    return { committed: 0, remaining };
  }

  if (hasGroupFeature(features ?? undefined, 'FRIDGE')) {
    for (const item of purchased) {
      await addToFridge(tx, {
        groupId,
        name: item.name,
        quantity: safeQuantity(item.quantity),
        unit: item.unit,
      });
    }
  }

  await tx.shoppingItem.deleteMany({
    where: { groupId, purchasedAt: { not: null } },
  });

  const remaining = await tx.shoppingItem.count({ where: { groupId, purchasedAt: null } });
  return { committed: purchased.length, remaining };
}

export async function commitPurchasedCartForGroup(
  prisma: PrismaClient,
  groupId: string,
): Promise<CommitPurchasedCartResult> {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: { features: true },
  });

  return prisma.$transaction((tx) => commitPurchasedCartToFridge(tx, groupId, group?.features));
}

import type { Prisma } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { commitPurchasedCartToFridge } from './shopping-commit.service.js';

type MockTx = Pick<Prisma.TransactionClient, 'shoppingItem' | 'fridgeItem'>;

function createMockTx(overrides: Partial<MockTx>): MockTx {
  return {
    shoppingItem: {
      findMany: vi.fn(),
      count: vi.fn(),
      deleteMany: vi.fn(),
    } as unknown as MockTx['shoppingItem'],
    fridgeItem: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    } as unknown as MockTx['fridgeItem'],
    ...overrides,
  };
}

describe('shopping-commit.service', () => {
  it('ne fait rien si aucun article coché', async () => {
    const tx = createMockTx({
      shoppingItem: {
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(2),
        deleteMany: vi.fn(),
      } as unknown as MockTx['shoppingItem'],
    });

    const result = await commitPurchasedCartToFridge(tx as Prisma.TransactionClient, 'g1', [
      'SHOPPING',
      'FRIDGE',
    ]);
    expect(result).toEqual({ committed: 0, remaining: 2 });
    expect(tx.shoppingItem.deleteMany).not.toHaveBeenCalled();
  });

  it('ajoute au frigo puis retire les articles cochés de la liste', async () => {
    const tx = createMockTx({
      shoppingItem: {
        findMany: vi.fn().mockResolvedValue([
          { id: '1', name: 'Lait', quantity: '2', unit: 'L', purchasedAt: new Date() },
        ]),
        deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
        count: vi.fn().mockResolvedValue(1),
      } as unknown as MockTx['shoppingItem'],
      fridgeItem: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
        update: vi.fn(),
      } as unknown as MockTx['fridgeItem'],
    });

    const result = await commitPurchasedCartToFridge(tx as Prisma.TransactionClient, 'g1', [
      'SHOPPING',
      'FRIDGE',
    ]);
    expect(result.committed).toBe(1);
    expect(result.remaining).toBe(1);
    expect(tx.fridgeItem.create).toHaveBeenCalledOnce();
    expect(tx.shoppingItem.deleteMany).toHaveBeenCalledOnce();
  });
});

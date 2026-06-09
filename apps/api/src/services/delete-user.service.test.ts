import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '@homeshared/shared';
import { deleteUserAccount } from './delete-user.service.js';

describe('deleteUserAccount', () => {
  it('bloque si titulaire d\'un groupe partagé avec d\'autres membres', async () => {
    const prisma = {
      group: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'g1',
            name: 'Coloc',
            isPersonal: false,
            _count: { memberships: 3 },
          },
        ]),
      },
    } as never;

    const supabase = { auth: { admin: { deleteUser: vi.fn() } } } as never;

    await expect(deleteUserAccount(prisma, supabase, 'u1')).rejects.toMatchObject({
      code: 'CONFLICT',
    });
  });

  it('supprime un compte sans groupe bloquant', async () => {
    const tx = {
      membership: {
        findMany: vi.fn().mockResolvedValue([]),
      },
      group: { delete: vi.fn().mockResolvedValue({}) },
      user: { delete: vi.fn().mockResolvedValue({}) },
    };

    const prisma = {
      group: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'personal',
            name: 'Mon espace',
            isPersonal: true,
            _count: { memberships: 1 },
          },
        ]),
      },
      $transaction: vi.fn(async (fn: (client: typeof tx) => Promise<void>) => fn(tx)),
    } as never;

    const deleteUser = vi.fn().mockResolvedValue({ error: null });
    const supabase = { auth: { admin: { deleteUser } } } as never;

    await deleteUserAccount(prisma, supabase, 'u1');

    expect(tx.group.delete).toHaveBeenCalledWith({ where: { id: 'personal' } });
    expect(tx.user.delete).toHaveBeenCalledWith({ where: { id: 'u1' } });
    expect(deleteUser).toHaveBeenCalledWith('u1');
  });

  it('réassigne les références Restrict avant suppression', async () => {
    const tx = {
      membership: {
        findMany: vi.fn().mockResolvedValue([
          {
            groupId: 'g2',
            group: { ownerId: 'owner1' },
          },
        ]),
      },
      shoppingItem: { updateMany: vi.fn().mockResolvedValue({ count: 1 }) },
      householdTask: { updateMany: vi.fn().mockResolvedValue({ count: 0 }) },
      mealPlanEntry: { updateMany: vi.fn().mockResolvedValue({ count: 0 }) },
      group: { delete: vi.fn() },
      user: { delete: vi.fn().mockResolvedValue({}) },
    };

    const prisma = {
      group: { findMany: vi.fn().mockResolvedValue([]) },
      $transaction: vi.fn(async (fn: (client: typeof tx) => Promise<void>) => fn(tx)),
    } as never;

    const supabase = {
      auth: { admin: { deleteUser: vi.fn().mockResolvedValue({ error: null }) } },
    } as never;

    await deleteUserAccount(prisma, supabase, 'u1');

    expect(tx.shoppingItem.updateMany).toHaveBeenCalledWith({
      where: { groupId: 'g2', addedById: 'u1' },
      data: { addedById: 'owner1' },
    });
  });

  it('lève INTERNAL_ERROR si Supabase Auth échoue', async () => {
    const tx = {
      membership: { findMany: vi.fn().mockResolvedValue([]) },
      group: { delete: vi.fn() },
      user: { delete: vi.fn().mockResolvedValue({}) },
    };

    const prisma = {
      group: { findMany: vi.fn().mockResolvedValue([]) },
      $transaction: vi.fn(async (fn: (client: typeof tx) => Promise<void>) => fn(tx)),
    } as never;

    const supabase = {
      auth: {
        admin: { deleteUser: vi.fn().mockResolvedValue({ error: { message: 'fail' } }) },
      },
    } as never;

    await expect(deleteUserAccount(prisma, supabase, 'u1')).rejects.toBeInstanceOf(ApiError);
  });
});

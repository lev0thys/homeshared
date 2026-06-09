import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '@homeshared/shared';
import { ensureMembership, ensureRole } from './group.service.js';

describe('group.service', () => {
  it('ensureMembership retourne le rôle si membre', async () => {
    const prisma = {
      membership: {
        findUnique: vi.fn().mockResolvedValue({ role: 'MEMBER' }),
      },
    } as never;

    const result = await ensureMembership(prisma, 'g1', 'u1');
    expect(result.role).toBe('MEMBER');
  });

  it('ensureMembership lève FORBIDDEN si non membre', async () => {
    const prisma = {
      membership: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    } as never;

    await expect(ensureMembership(prisma, 'g1', 'u1')).rejects.toBeInstanceOf(ApiError);
  });

  it('ensureRole lève si rôle insuffisant', async () => {
    const prisma = {
      membership: {
        findUnique: vi.fn().mockResolvedValue({ role: 'MEMBER' }),
      },
    } as never;

    await expect(ensureRole(prisma, 'g1', 'u1', ['OWNER', 'ADMIN'])).rejects.toBeInstanceOf(ApiError);
  });
});

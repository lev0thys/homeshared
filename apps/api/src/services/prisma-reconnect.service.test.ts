import { describe, expect, it } from 'vitest';
import { isPrismaConnectionError } from './prisma-reconnect.service.js';

describe('prisma-reconnect.service', () => {
  it('détecte ConnectionReset Windows', () => {
    expect(
      isPrismaConnectionError(new Error('ConnectionReset code 10054')),
    ).toBe(true);
  });

  it('détecte codes Prisma pool', () => {
    expect(isPrismaConnectionError({ code: 'P1017' })).toBe(true);
  });

  it('ignore erreurs métier', () => {
    expect(isPrismaConnectionError(new Error('Unique constraint'))).toBe(false);
  });
});

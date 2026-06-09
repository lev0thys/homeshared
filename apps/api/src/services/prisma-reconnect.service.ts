import type { PrismaClient } from '@prisma/client';

const CONNECTION_ERROR_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017', 'P2024']);

/** Détecte une erreur Prisma liée au pool / connexion fermée (ex. Supabase idle). */
export function isPrismaConnectionError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const code = (err as { code?: string }).code;
  if (code && CONNECTION_ERROR_CODES.has(code)) return true;
  const message = String((err as { message?: string }).message ?? err);
  return (
    message.includes('ConnectionReset') ||
    message.includes('connection closed') ||
    message.includes('ECONNRESET') ||
    message.includes('10054')
  );
}

/** Reconnecte Prisma et retente une fois. */
export async function withPrismaReconnect<T>(
  prisma: PrismaClient,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (!isPrismaConnectionError(err)) throw err;
    await prisma.$disconnect();
    await prisma.$connect();
    return fn();
  }
}

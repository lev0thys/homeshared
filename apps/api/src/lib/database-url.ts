/**
 * Limite les connexions Prisma vers Supabase pooler (évite EMAXCONNSESSION / pool_size: 15).
 * Ajoute connection_limit=1 si absent sur les URLs pooler Supabase.
 */
export function withSupabasePoolLimits(databaseUrl: string): string {
  if (!databaseUrl.includes('pooler.supabase.com')) {
    return databaseUrl;
  }

  try {
    const parsed = new URL(databaseUrl);
    if (!parsed.searchParams.has('connection_limit')) {
      parsed.searchParams.set('connection_limit', '1');
    }
    // Transaction pooler (6543) : mode pgbouncer requis pour Prisma.
    if (parsed.port === '6543' && !parsed.searchParams.has('pgbouncer')) {
      parsed.searchParams.set('pgbouncer', 'true');
    }
    return parsed.toString();
  } catch {
    return databaseUrl;
  }
}

/**
 * Cache session auth + sync user Supabase → Prisma optimisé.
 * Évite un upsert SQL à chaque requête (jardin/saison/courses…).
 */

const AUTH_CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  userId: string;
  expiresAt: number;
}

const authCache = new Map<string, CacheEntry>();

export function getCachedAuthUserId(supabaseUserId: string): string | null {
  const entry = authCache.get(supabaseUserId);
  if (!entry || entry.expiresAt < Date.now()) {
    authCache.delete(supabaseUserId);
    return null;
  }
  return entry.userId;
}

export function setCachedAuthUserId(supabaseUserId: string, userId: string): void {
  authCache.set(supabaseUserId, {
    userId,
    expiresAt: Date.now() + AUTH_CACHE_TTL_MS,
  });
}

/** Vide le cache (tests). */
export function clearAuthCache(): void {
  authCache.clear();
}

export function resolveUsername(
  metaUsername: string | undefined,
  supabaseUserId: string,
  usernameTaken: boolean,
): string {
  const trimmed = metaUsername?.trim();
  if (trimmed && !usernameTaken) return trimmed;
  return `user_${supabaseUserId.slice(0, 8)}`;
}

/** Nom affiché : métadonnées inscription, puis profil Google OAuth. */
export function resolveDisplayName(
  metadata: Record<string, unknown> | undefined,
  email: string | undefined,
): string {
  const fromMeta =
    (metadata?.display_name as string | undefined)?.trim() ||
    (metadata?.full_name as string | undefined)?.trim() ||
    (metadata?.name as string | undefined)?.trim();
  if (fromMeta) return fromMeta;
  const local = email?.split('@')[0]?.trim();
  if (local) return local;
  return 'Nouveau membre';
}

/** Pseudo suggéré pour OAuth (email local-part si pas de username custom). */
export function suggestUsernameFromMetadata(
  metadata: Record<string, unknown> | undefined,
  email: string | undefined,
): string | undefined {
  const explicit = (metadata?.username as string | undefined)?.trim();
  if (explicit) return explicit;
  const preferred = (metadata?.preferred_username as string | undefined)?.trim();
  if (preferred) return preferred;
  const local = email
    ?.split('@')[0]
    ?.replace(/[^a-zA-Z0-9_]/g, '_')
    .slice(0, 30);
  return local || undefined;
}

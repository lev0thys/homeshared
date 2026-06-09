export type ExpiryUrgency = 'none' | 'soon' | 'urgent';

export function expiryUrgency(expiresAt: string | null | undefined): ExpiryUrgency {
  if (!expiresAt) return 'none';
  const days = (new Date(expiresAt).getTime() - Date.now()) / 86_400_000;
  if (days < 0) return 'urgent';
  if (days <= 3) return 'soon';
  return 'none';
}

export function sortFridgeByExpiry<T extends { expiresAt: string | null }>(items: T[]): T[] {
  const rank = (u: ExpiryUrgency) => (u === 'urgent' ? 0 : u === 'soon' ? 1 : 2);
  return [...items].sort((a, b) => {
    const ra = rank(expiryUrgency(a.expiresAt));
    const rb = rank(expiryUrgency(b.expiresAt));
    if (ra !== rb) return ra - rb;
    if (a.expiresAt && b.expiresAt) {
      return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
    }
    return 0;
  });
}

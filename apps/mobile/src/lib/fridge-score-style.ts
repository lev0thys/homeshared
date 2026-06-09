/** Couleur texte selon couverture frigo 0–1. */
export function fridgeScoreTextClass(score: number): string {
  if (score >= 0.95) return 'text-emerald-700';
  if (score >= 0.5) return 'text-amber-700';
  return 'text-red-600';
}

/** Part minimale du caddie remplie pour auto-valider les courses à la reprise. */
export const SHOPPING_AUTO_COMMIT_MIN_RATIO = 0.6;

/** Délai d'inactivité (app en arrière-plan) avant auto-commit du caddie. */
export const SHOPPING_AUTO_COMMIT_IDLE_MS = 10 * 60 * 1000;

export function shouldAutoCommitShoppingTrip(
  purchasedCount: number,
  totalCount: number,
  idleMs: number,
): boolean {
  if (totalCount <= 0 || purchasedCount <= 0) return false;
  if (idleMs < SHOPPING_AUTO_COMMIT_IDLE_MS) return false;
  return purchasedCount / totalCount >= SHOPPING_AUTO_COMMIT_MIN_RATIO;
}

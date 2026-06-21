/** Limites par route (complètent le plafond global par IP). */
export const rateLimitRoutes = {
  /** Création de groupes — anti-spam. */
  createGroup: { rateLimit: { max: 5, timeWindow: '1 minute' as const } },
  /** Invitations / rejoindre un groupe. */
  invites: { rateLimit: { max: 10, timeWindow: '1 minute' as const } },
  /** Messages chat groupe. */
  chatMessage: { rateLimit: { max: 30, timeWindow: '1 minute' as const } },
  /** Écritures courantes (courses, frigo, tâches…). */
  write: { rateLimit: { max: 60, timeWindow: '1 minute' as const } },
  /** Appels coûteux (matching recettes, comparaison magasins). */
  heavy: { rateLimit: { max: 15, timeWindow: '1 minute' as const } },
  /** Lots contributions mode magasin — 10/jour/user (complété par max events/lot). */
  contributions: { rateLimit: { max: 10, timeWindow: '1 day' as const } },
  /** Rafale POST batch contributions. */
  contributionBatch: { rateLimit: { max: 3, timeWindow: '1 minute' as const } },
};

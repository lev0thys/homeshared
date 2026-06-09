/** Données catalogue statiques (saison, jardin, recettes globales) — cache long. */
export const STALE_STATIC_CATALOG_MS = 24 * 60 * 60 * 1000;

export const staticCatalogQueryOptions = {
  staleTime: STALE_STATIC_CATALOG_MS,
  gcTime: STALE_STATIC_CATALOG_MS * 2,
} as const;

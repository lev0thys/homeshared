/** Données catalogue statiques (saison, jardin, recettes globales) — cache long. */
export const STALE_STATIC_CATALOG_MS = 24 * 60 * 60 * 1000;

export const staticCatalogQueryOptions = {
  staleTime: STALE_STATIC_CATALOG_MS,
  gcTime: STALE_STATIC_CATALOG_MS * 2,
} as const;

/** Politique TanStack v2 — voir docs/V2-GPS-IMPLEMENTATION.md §5.4 */
export const STALE_SHOPPING_MS = 60_000;
export const STALE_STORE_CONTRIBUTIONS_MS = 15 * 60_000;
export const STALE_GROUPS_MS = 5 * 60_000;
export const STALE_RECIPES_MATCH_MS = 2 * 60_000;

export const LOCAL_CACHE_CONTRIBUTIONS_MS = STALE_STORE_CONTRIBUTIONS_MS;
export const LOCAL_CACHE_OVERPASS_MS = 24 * 60 * 60 * 1000;
export const LOCAL_CACHE_LAYOUT_MS = 7 * 24 * 60 * 60 * 1000;

/** Délai avant invalidation fridge / recipes-match hors mode magasin. */
export const DEFERRED_INVALIDATION_MS = 2_000;

export const shoppingQueryOptions = {
  staleTime: STALE_SHOPPING_MS,
  gcTime: STALE_SHOPPING_MS * 3,
} as const;

export const storeContributionsQueryOptions = {
  staleTime: STALE_STORE_CONTRIBUTIONS_MS,
  gcTime: STALE_STORE_CONTRIBUTIONS_MS * 2,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;

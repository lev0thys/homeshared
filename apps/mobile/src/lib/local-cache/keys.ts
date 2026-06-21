/** Préfixes clés AsyncStorage pour le cache local v2. */
export const localCacheKeys = {
  contributions: (storeOsmId: string) => `contributions:${storeOsmId}`,
  overpass: (lat: number, lon: number, radiusM: number) =>
    `overpass:${lat.toFixed(3)},${lon.toFixed(3)}:${radiusM}`,
  layoutProfile: (storeOsmId: string) => `layout-profile:${storeOsmId}`,
} as const;

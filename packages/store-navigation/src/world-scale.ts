import type { StoreLayoutProfileId } from './types.js';

/** Dimensions réelles schématiques du magasin (mètres). */
export interface StoreWorldSize {
  widthM: number;
  heightM: number;
}

export const STORE_WORLD_SIZES: Record<StoreLayoutProfileId, StoreWorldSize> = {
  /** Grand hyper périphérique (~10 000–14 000 m² vente). */
  HYPERMARKET_FR: { widthM: 140, heightM: 100 },
  /** Super classique (~1 500–2 500 m²). */
  SUPERMARKET_FR: { widthM: 55, heightM: 45 },
  /** City / proximité (~150–300 m²). */
  PROXI_FR: { widthM: 18, heightM: 14 },
};

/** Pixels SVG par mètre (permet zoom jusqu’au détail ~1 m). */
export const PX_PER_METER = 10;

export function getStoreWorldSize(profile: StoreLayoutProfileId): StoreWorldSize {
  return STORE_WORLD_SIZES[profile];
}

export function getCanvasPixelSize(profile: StoreLayoutProfileId): { width: number; height: number } {
  const world = getStoreWorldSize(profile);
  return {
    width: Math.round(world.widthM * PX_PER_METER),
    height: Math.round(world.heightM * PX_PER_METER),
  };
}

/** Coordonnée normalisée 0–1 → mètres dans le magasin. */
export function normToMeters(
  x: number,
  y: number,
  profile: StoreLayoutProfileId,
): { xM: number; yM: number } {
  const world = getStoreWorldSize(profile);
  return { xM: x * world.widthM, yM: y * world.heightM };
}

/** Mètres → normalisé 0–1. */
export function metersToNorm(
  xM: number,
  yM: number,
  profile: StoreLayoutProfileId,
): { x: number; y: number } {
  const world = getStoreWorldSize(profile);
  return {
    x: Math.min(1, Math.max(0, xM / world.widthM)),
    y: Math.min(1, Math.max(0, yM / world.heightM)),
  };
}

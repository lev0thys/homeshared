import type { FloorZoneKind } from './types.js';

export interface FloorZoneStyle {
  fill: string;
  stroke: string;
  text: string;
  /** Opacité du remplissage (1 = opaque). */
  fillOpacity: number;
}

/**
 * Palette cartographique douce :
 * - couloirs = « rues » (fond crème, lisibles en premier)
 * - échoppes = « bâtiments » (pastels discrets)
 * - allées = fond neutre ; le détail vient des gondoles
 */
export const FLOOR_ZONE_STYLES: Record<FloorZoneKind, FloorZoneStyle> = {
  corridor: {
    fill: '#f7f2ea',
    stroke: '#ddd4c6',
    text: '#8a7f72',
    fillOpacity: 1,
  },
  aisle: {
    fill: '#eeeae4',
    stroke: '#d8d2c8',
    text: '#6b6560',
    fillOpacity: 0.2,
  },
  shop: {
    fill: '#e3eaf2',
    stroke: '#c5d0de',
    text: '#4a5f78',
    fillOpacity: 0.92,
  },
  checkout: {
    fill: '#efe6ea',
    stroke: '#d9c8cf',
    text: '#7a5f68',
    fillOpacity: 0.95,
  },
};

/** Échoppes frais (périphérie) — teinte vert doux type « parc » sur une carte. */
export const FRESH_SHOP_STYLE: FloorZoneStyle = {
  fill: '#e0ebe0',
  stroke: '#b8ccb8',
  text: '#4a6b4a',
  fillOpacity: 0.92,
};

/** Gondoles vues du dessus = emprises « bâtiment » dans un îlot. */
export const GONDOLA_STYLE = {
  fill: '#c4bdb4',
  stroke: '#a69f96',
  endCapFill: '#b0a89f',
};

/** Itinéraire type appli GPS (contraste modéré). */
export const ROUTE_STYLE = {
  halo: '#6b8fbf',
  line: '#3d6ea5',
  haloOpacity: 0.22,
};

export const MAP_PAPER = {
  background: '#faf7f2',
  border: '#d4cdc3',
  grid: '#e5dfd6',
  gridOpacity: 0.35,
};

export function getFloorZoneStyle(kind: FloorZoneKind): FloorZoneStyle {
  return FLOOR_ZONE_STYLES[kind];
}

/** Frais, boucherie, F&L… implantés en périphérie. */
export function isFreshShopLabel(label: string): boolean {
  const key = label.toLowerCase();
  return (
    key.includes('f&l') ||
    key.includes('boucher') ||
    key.includes('crém') ||
    key.includes('poisson') ||
    key.includes('boulanger') ||
    key.includes('charcut') ||
    key.includes('traiteur') ||
    key.includes('volaille') ||
    key.includes('surgel') ||
    key.includes('ultra-frais') ||
    key.includes('cave')
  );
}

export function getShopZoneStyle(label: string): FloorZoneStyle {
  return isFreshShopLabel(label) ? FRESH_SHOP_STYLE : FLOOR_ZONE_STYLES.shop;
}

/** Couloir principal (accueil, central) légèrement plus clair qu’une rue secondaire. */
export function getCorridorStyle(label: string): FloorZoneStyle {
  const key = label.toLowerCase();
  const isMain =
    key.includes('accueil') || key.includes('central') || key.includes('couloir frais');
  if (isMain) {
    return {
      fill: '#faf6ef',
      stroke: '#e0d6c8',
      text: '#7a7168',
      fillOpacity: 1,
    };
  }
  return FLOOR_ZONE_STYLES.corridor;
}

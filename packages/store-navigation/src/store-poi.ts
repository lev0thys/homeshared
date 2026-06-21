import type { StoreLayoutProfileId } from './types.js';

export type OsmElementType = 'node' | 'way';

export type LayoutConfidence = 'high' | 'medium' | 'low';

export interface LayoutInference {
  profile: StoreLayoutProfileId;
  confidence: LayoutConfidence;
  /** Règle/heuristique ayant décidé (debug UX). */
  matchedRule: string;
}

/** Encode un POI OSM en identifiant stocké en BigInt (ways négatifs). */
export function encodeOsmStoreId(type: OsmElementType, id: number): string {
  if (type === 'way') return String(-Math.abs(id));
  return String(id);
}

export function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function normTags(tags: Record<string, string>) {
  const shop = (tags.shop ?? '').toLowerCase();
  const brand = (tags.brand ?? '').toLowerCase();
  const name = (tags.name ?? '').toLowerCase();
  const operator = (tags.operator ?? '').toLowerCase();
  const combined = `${brand} ${name} ${operator}`.trim();
  return { shop, brand, name, combined };
}

/** Heuristique enseignes FR + tags OSM → profil layout schématique. */
export function inferLayoutProfileDetailed(tags: Record<string, string>): LayoutInference {
  const { shop, combined } = normTags(tags);

  const proxiPatterns = [
    'express',
    'city',
    'proxi',
    'contact',
    'monop',
    'monoprix',
    'franprix',
    'vival',
    'spar',
    '8 à 8',
    '8 a 8',
    'petit casino',
    'leader price',
    'simply',
  ];
  if (shop === 'convenience' || shop === 'kiosk') {
    return { profile: 'PROXI_FR', confidence: 'high', matchedRule: 'shop=convenience' };
  }
  if (proxiPatterns.some((p) => combined.includes(p))) {
    return { profile: 'PROXI_FR', confidence: 'high', matchedRule: `proxi:${combined.slice(0, 24)}` };
  }

  const superPatterns = [
    'carrefour market',
    'market',
    'super u',
    'superu',
    'casino super',
    'intermarche contact',
    'intermarché contact',
    'u express',
    'lidl',
    'aldi',
    'netto',
  ];
  if (superPatterns.some((p) => combined.includes(p))) {
    const conf: LayoutConfidence = combined.includes('market') || combined.includes('super u') ? 'high' : 'medium';
    return { profile: 'SUPERMARKET_FR', confidence: conf, matchedRule: `super:${combined.slice(0, 24)}` };
  }

  const hyperPatterns = [
    'hyper',
    'e.leclerc',
    'leclerc',
    'auchan',
    'intermarche',
    'intermarché',
    'geant',
    'géant',
    'carrefour',
    'cora',
    'match',
    'grand frais',
  ];
  if (hyperPatterns.some((p) => combined.includes(p))) {
    if (combined.includes('market') || combined.includes('city') || combined.includes('express')) {
      return { profile: 'SUPERMARKET_FR', confidence: 'high', matchedRule: 'hyper-brand-but-compact' };
    }
    return { profile: 'HYPERMARKET_FR', confidence: 'high', matchedRule: `hyper:${combined.slice(0, 24)}` };
  }

  if (shop === 'supermarket') {
    return { profile: 'SUPERMARKET_FR', confidence: 'medium', matchedRule: 'shop=supermarket' };
  }
  if (shop === 'grocery' || shop === 'general') {
    return { profile: 'SUPERMARKET_FR', confidence: 'low', matchedRule: `shop=${shop}` };
  }

  return { profile: 'HYPERMARKET_FR', confidence: 'low', matchedRule: 'default-hyper' };
}

export function inferLayoutProfileFromOsmTags(tags: Record<string, string>): StoreLayoutProfileId {
  return inferLayoutProfileDetailed(tags).profile;
}

export const STORE_LAYOUT_PROFILE_LABELS: Record<StoreLayoutProfileId, string> = {
  HYPERMARKET_FR: 'Hyper',
  SUPERMARKET_FR: 'Super',
  PROXI_FR: 'Proxi',
};

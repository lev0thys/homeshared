import {
  encodeOsmStoreId,
  haversineMeters,
  inferLayoutProfileDetailed,
  type LayoutConfidence,
  type OsmElementType,
  type StoreLayoutProfileId,
} from '@homeshared/store-navigation';
import { getLocalCache, localCacheKeys, setLocalCache } from '@/lib/local-cache';
import { LOCAL_CACHE_OVERPASS_MS } from '@/lib/query-options';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const DEFAULT_RADIUS_M = 500;

export interface NearbyStorePoi {
  osmType: OsmElementType;
  osmId: string;
  name: string;
  brand?: string;
  shop?: string;
  lat: number;
  lon: number;
  distanceMeters: number;
  suggestedLayout: StoreLayoutProfileId;
  layoutConfidence: LayoutConfidence;
  layoutMatchedRule: string;
}

interface OverpassElement {
  type: OsmElementType;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements?: OverpassElement[];
}

function buildOverpassQuery(lat: number, lon: number, radiusM: number) {
  const shops = 'supermarket|convenience|grocery|general';
  return `[out:json][timeout:15];
(
  node["shop"~"${shops}"](around:${radiusM},${lat},${lon});
  way["shop"~"${shops}"](around:${radiusM},${lat},${lon});
);
out center tags;`;
}

function elementToPoi(
  el: OverpassElement,
  userLat: number,
  userLon: number,
): NearbyStorePoi | null {
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  if (lat == null || lon == null) return null;

  const tags = el.tags ?? {};
  const name = tags.name ?? tags.brand ?? tags.operator;
  if (!name) return null;

  const inference = inferLayoutProfileDetailed(tags);

  return {
    osmType: el.type,
    osmId: encodeOsmStoreId(el.type, el.id),
    name,
    brand: tags.brand,
    shop: tags.shop,
    lat,
    lon,
    distanceMeters: haversineMeters(userLat, userLon, lat, lon),
    suggestedLayout: inference.profile,
    layoutConfidence: inference.confidence,
    layoutMatchedRule: inference.matchedRule,
  };
}

export async function fetchNearbyStoresFromOverpass(
  lat: number,
  lon: number,
  radiusM = DEFAULT_RADIUS_M,
): Promise<NearbyStorePoi[]> {
  const cacheKey = localCacheKeys.overpass(lat, lon, radiusM);
  const cached = await getLocalCache<NearbyStorePoi[]>(cacheKey);
  if (cached) return cached.value;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18_000);

  let response: Response;
  try {
    response = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(buildOverpassQuery(lat, lon, radiusM))}`,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Overpass HTTP ${response.status}`);
  }

  const json = (await response.json()) as OverpassResponse;
  const seen = new Set<string>();
  const stores: NearbyStorePoi[] = [];

  for (const el of json.elements ?? []) {
    const poi = elementToPoi(el, lat, lon);
    if (!poi || seen.has(poi.osmId)) continue;
    seen.add(poi.osmId);
    stores.push(poi);
  }

  stores.sort((a, b) => a.distanceMeters - b.distanceMeters);
  await setLocalCache(cacheKey, stores, LOCAL_CACHE_OVERPASS_MS);
  return stores;
}

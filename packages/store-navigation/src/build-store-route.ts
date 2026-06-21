import {
  getStoreAisleSortOrder,
  type StoreAisleId,
} from '@homeshared/shared';
import { buildCorridorPolyline } from './build-corridor-path.js';
import { getStoreLayout } from './layout-profiles.js';
import type { BuildRouteInput, StoreRoute, StoreRouteStep } from './types.js';

function sortItemsByName<T extends { name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}

function orderAisles(aisleIds: StoreAisleId[]): StoreAisleId[] {
  return [...new Set(aisleIds)].sort(
    (a, b) => getStoreAisleSortOrder(a) - getStoreAisleSortOrder(b),
  );
}

export function buildStoreRoute(input: BuildRouteInput): StoreRoute {
  const profile = input.profile ?? 'HYPERMARKET_FR';
  const layout = getStoreLayout(profile);
  const pending = input.items.filter((i) => !i.purchased);

  const byAisle = new Map<StoreAisleId, typeof pending>();
  for (const item of pending) {
    const list = byAisle.get(item.aisle) ?? [];
    list.push(item);
    byAisle.set(item.aisle, list);
  }

  const activeAisles = orderAisles([...byAisle.keys()]);

  const steps: StoreRouteStep[] = activeAisles.map((aisle) => ({
    aisle,
    items: sortItemsByName(byAisle.get(aisle) ?? []).map((i) => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      unit: i.unit,
    })),
  }));

  const polyline = buildCorridorPolyline(layout, activeAisles);

  const allAislesInLayout = layout.nodes.map((n) => n.aisle);
  const skippedAisles = allAislesInLayout.filter((a) => !byAisle.has(a));

  return {
    profile,
    steps,
    skippedAisles,
    polyline,
    estimatedAisles: steps.length,
  };
}

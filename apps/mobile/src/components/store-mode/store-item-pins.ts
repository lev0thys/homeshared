import { getAisleVisitPoint, type RouteItem, type StoreLayout } from '@homeshared/store-navigation';
import type { StoreAisleId } from '@homeshared/shared';
import type { StoreMapItemPin } from '@/components/store-mode/StoreMap2D';

/** Répartit les articles du rayon actif sur l'allée / l'échoppe pour affichage zoomé. */
export function buildItemPinsForAisle(
  layout: StoreLayout,
  aisle: StoreAisleId,
  items: RouteItem[],
  highlightId?: string,
): StoreMapItemPin[] {
  if (items.length === 0) return [];

  const zone =
    layout.zones.find((z) => z.aisle === aisle && z.kind === 'aisle') ??
    layout.zones.find((z) => z.aisle === aisle);

  const node = layout.nodes.find((n) => n.aisle === aisle);

  if (!zone) {
    if (!node) return [];
    return items.map((item, i) => ({
      id: item.id,
      name: item.name,
      x: node.x + (i - (items.length - 1) / 2) * 0.015,
      y: node.y + i * 0.008,
      highlighted: item.id === highlightId,
    }));
  }

  const visit = getAisleVisitPoint(layout, aisle);
  return items.map((item, i) => {
    const spread = (i - (items.length - 1) / 2) * 0.012;
    return {
      id: item.id,
      name: item.name,
      x: visit.x + spread,
      y: visit.y + (zone.kind === 'aisle' ? (i + 1) * 0.008 : 0),
      highlighted: item.id === highlightId,
    };
  });
}

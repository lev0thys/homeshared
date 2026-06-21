import type { StoreAisleId } from '@homeshared/shared';
import type { StoreLayout } from './types.js';

export interface NavPoint {
  x: number;
  y: number;
}

interface CorridorNetwork {
  mainY: number;
  frontY: number;
  topY: number;
  leftX: number;
  rightX: number;
}

function corridorCenters(layout: StoreLayout) {
  return layout.zones
    .filter((z) => z.kind === 'corridor')
    .map((z) => ({
      cx: z.rect.x + z.rect.w / 2,
      cy: z.rect.y + z.rect.h / 2,
      w: z.rect.w,
      h: z.rect.h,
      label: z.label,
    }));
}

function extractCorridorNetwork(layout: StoreLayout): CorridorNetwork {
  const corridors = corridorCenters(layout);

  const horizontal = corridors.filter((c) => c.w > c.h);
  const vertical = corridors.filter((c) => c.h >= c.w);

  const main =
    horizontal.find((c) => c.label.toLowerCase().includes('central')) ??
    horizontal.sort((a, b) => Math.abs(a.cy - 0.45) - Math.abs(b.cy - 0.45))[0];
  const front =
    horizontal.find((c) => c.label.toLowerCase().includes('accueil')) ??
    horizontal.sort((a, b) => b.cy - a.cy)[0];
  const top =
    horizontal.find((c) => c.label.toLowerCase().includes('haut')) ??
    horizontal.sort((a, b) => a.cy - b.cy)[0];

  const left =
    vertical.find((c) => c.label.toLowerCase().includes('frais')) ??
    vertical.sort((a, b) => a.cx - b.cx)[0];
  const right =
    vertical.find((c) => c.label.toLowerCase().includes('droite')) ??
    vertical.sort((a, b) => b.cx - a.cx)[0];

  const topShops = layout.zones.filter((z) => z.kind === 'shop' && z.rect.y < 0.14);
  const topY =
    top?.cy ??
    (topShops.length > 0 ? Math.max(...topShops.map((z) => z.rect.y + z.rect.h)) + 0.012 : 0.14);

  const rightShops = layout.zones.filter((z) => z.kind === 'shop' && z.rect.x > 0.68);
  const rightX =
    right?.cx ?? (rightShops.length > 0 ? Math.min(...rightShops.map((z) => z.rect.x)) - 0.012 : 0.74);

  return {
    mainY: main?.cy ?? 0.47,
    frontY: front?.cy ?? 0.76,
    topY,
    leftX: left?.cx ?? 0.15,
    rightX,
  };
}

type ZoneSide = 'top' | 'right' | 'left' | 'bottom' | 'center';

function zoneSide(layout: StoreLayout, aisle: StoreAisleId): ZoneSide {
  const zone = layout.zones.find((z) => z.aisle === aisle);
  if (!zone) return 'center';
  if (zone.kind === 'aisle') {
    if (zone.rect.x > 0.72 && zone.rect.h < zone.rect.w * 1.2) return 'right';
    return 'center';
  }
  if (zone.rect.x < 0.16) return 'left';
  if (zone.rect.y > 0.68) return 'bottom';
  if (zone.rect.y < 0.14) return 'top';
  if (zone.rect.x > 0.68) return 'right';
  return 'center';
}

/** Point d'arrêt accessible depuis les couloirs. */
export function getAisleVisitPoint(layout: StoreLayout, aisle: StoreAisleId): NavPoint {
  const node = layout.nodes.find((n) => n.aisle === aisle);
  const zone = layout.zones.find((z) => z.aisle === aisle);
  const net = extractCorridorNetwork(layout);
  const side = zoneSide(layout, aisle);

  if (!node && !zone) return { ...layout.entry };
  if (!zone) return { x: node!.x, y: node!.y };

  if (side === 'left') {
    return { x: net.leftX, y: zone.rect.y + zone.rect.h / 2 };
  }
  if (side === 'bottom') {
    return { x: zone.rect.x + zone.rect.w / 2, y: net.frontY };
  }
  if (side === 'top') {
    return { x: zone.rect.x + zone.rect.w / 2, y: net.topY };
  }
  if (side === 'right') {
    return { x: net.rightX, y: zone.rect.y + zone.rect.h / 2 };
  }
  return { x: zone.rect.x + zone.rect.w / 2, y: net.mainY };
}

const EPS = 0.006;

function pushIfFar(points: NavPoint[], p: NavPoint) {
  const last = points[points.length - 1];
  if (!last || Math.hypot(p.x - last.x, p.y - last.y) > EPS) {
    points.push(p);
  }
}

function routeSegment(
  from: NavPoint,
  to: NavPoint,
  layout: StoreLayout,
  toAisle: StoreAisleId,
): NavPoint[] {
  const net = extractCorridorNetwork(layout);
  const side = zoneSide(layout, toAisle);
  const points: NavPoint[] = [{ ...from }];

  const last = () => points[points.length - 1]!;

  // 1. Depuis l’entrée / bas du magasin → couloir d’accueil
  if (last().y > net.frontY - 0.01) {
    pushIfFar(points, { x: last().x, y: net.frontY });
  }

  if (side === 'left') {
    pushIfFar(points, { x: net.leftX, y: last().y });
    pushIfFar(points, { x: net.leftX, y: to.y });
    pushIfFar(points, to);
  } else if (side === 'bottom') {
    pushIfFar(points, { x: to.x, y: last().y });
    pushIfFar(points, to);
  } else if (side === 'top') {
    pushIfFar(points, { x: to.x, y: net.frontY });
    pushIfFar(points, { x: to.x, y: net.topY });
    pushIfFar(points, to);
  } else if (side === 'right') {
    pushIfFar(points, { x: to.x, y: last().y });
    pushIfFar(points, { x: net.rightX, y: last().y });
    pushIfFar(points, { x: net.rightX, y: to.y });
    pushIfFar(points, to);
  } else {
    const lx = last().x;
    const ly = last().y;

    if (Math.abs(lx - net.leftX) < 0.04) {
      pushIfFar(points, { x: net.leftX, y: net.mainY });
      pushIfFar(points, { x: to.x, y: net.mainY });
    } else if (Math.abs(lx - net.rightX) < 0.04) {
      pushIfFar(points, { x: net.rightX, y: net.mainY });
      pushIfFar(points, { x: to.x, y: net.mainY });
    } else if (ly > net.frontY - 0.02) {
      pushIfFar(points, { x: to.x, y: net.frontY });
      pushIfFar(points, { x: to.x, y: net.mainY });
    } else {
      pushIfFar(points, { x: to.x, y: ly });
      pushIfFar(points, { x: to.x, y: net.mainY });
    }

    if (Math.abs(to.y - net.mainY) > EPS) {
      pushIfFar(points, to);
    }
  }

  return points;
}

/** Route entrée → rayons en angles droits le long des couloirs. */
export function buildCorridorPolyline(
  layout: StoreLayout,
  aislesInOrder: StoreAisleId[],
): NavPoint[] {
  if (aislesInOrder.length === 0) return [{ ...layout.entry }];

  const polyline: NavPoint[] = [{ ...layout.entry }];

  for (const aisle of aislesInOrder) {
    const visit = getAisleVisitPoint(layout, aisle);
    const from = polyline[polyline.length - 1]!;
    const segment = routeSegment(from, visit, layout, aisle);
    for (let i = 1; i < segment.length; i++) {
      pushIfFar(polyline, segment[i]!);
    }
  }

  return polyline;
}

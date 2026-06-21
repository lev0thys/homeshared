import type { FloorZone, StoreLayoutProfileId } from './types.js';
import { getStoreWorldSize } from './world-scale.js';

export interface GondolaStrip {
  x: number;
  y: number;
  w: number;
  h: number;
  endCap?: boolean;
}

/** Profondeur d’une travée de gondole (m). */
const GONDOLA_DEPTH_M = 0.9;
/** Couloir entre travées (m) — équivalent d’une « rue » étroite. */
const WALK_LANE_M = 1.55;

function laneUnitM(profile: StoreLayoutProfileId): number {
  if (profile === 'PROXI_FR') return GONDOLA_DEPTH_M + WALK_LANE_M * 1.1;
  if (profile === 'SUPERMARKET_FR') return GONDOLA_DEPTH_M + WALK_LANE_M;
  return GONDOLA_DEPTH_M + WALK_LANE_M * 0.95;
}

function capCount(valueM: number, unitM: number, profile: StoreLayoutProfileId): number {
  const raw = Math.floor(valueM / unitM);
  const max = profile === 'HYPERMARKET_FR' ? 14 : profile === 'SUPERMARKET_FR' ? 9 : 4;
  return Math.max(2, Math.min(max, raw));
}

/**
 * Gondoles dans une zone « îlot » (allée verticale ou horizontale).
 * Les couloirs marchables entre îlots sont des zones `corridor` séparées.
 */
export function buildGondolaStripsInZone(
  zone: FloorZone,
  profile: StoreLayoutProfileId,
): GondolaStrip[] {
  if (zone.kind !== 'aisle') return [];

  const world = getStoreWorldSize(profile);
  const zoneWidthM = zone.rect.w * world.widthM;
  const zoneHeightM = zone.rect.h * world.heightM;
  const isVertical = zone.rect.h > zone.rect.w * 1.15;
  const unitM = laneUnitM(profile);
  const gondolaH = GONDOLA_DEPTH_M / world.heightM;
  const gondolaW = GONDOLA_DEPTH_M / world.widthM;
  const strips: GondolaStrip[] = [];
  const pad = 0.04;

  if (isVertical) {
    const count = capCount(zoneHeightM, unitM, profile);
    const usableH = zone.rect.h * (1 - pad * 2);
    const step = usableH / count;
    const shelfH = Math.min(gondolaH * 1.05, step * 0.42);

    for (let i = 0; i < count; i++) {
      const y = zone.rect.y + zone.rect.h * pad + (i + 0.5) * step - shelfH / 2;
      strips.push({
        x: zone.rect.x + zone.rect.w * 0.07,
        y,
        w: zone.rect.w * 0.86,
        h: shelfH,
      });
    }

    if (zoneWidthM > 6) {
      const sideW = Math.min(gondolaW * 1.1, zone.rect.w * 0.22);
      const innerH = zone.rect.h * (1 - pad * 2.5);
      strips.push({
        x: zone.rect.x + zone.rect.w * 0.06,
        y: zone.rect.y + zone.rect.h * pad * 1.2,
        w: sideW,
        h: innerH,
      });
      strips.push({
        x: zone.rect.x + zone.rect.w * 0.94 - sideW,
        y: zone.rect.y + zone.rect.h * pad * 1.2,
        w: sideW,
        h: innerH,
      });
    }

    const capW = zone.rect.w * 0.92;
    const capH = Math.min(gondolaH * 1.2, zone.rect.h * 0.06);
    strips.push({
      x: zone.rect.x + zone.rect.w * 0.04,
      y: zone.rect.y + zone.rect.h * pad * 0.5,
      w: capW,
      h: capH,
      endCap: true,
    });
    strips.push({
      x: zone.rect.x + zone.rect.w * 0.04,
      y: zone.rect.y + zone.rect.h * (1 - pad * 0.5) - capH,
      w: capW,
      h: capH,
      endCap: true,
    });
  } else {
    const count = capCount(zoneWidthM, unitM, profile);
    const usableW = zone.rect.w * (1 - pad * 2);
    const step = usableW / count;
    const shelfW = Math.min(gondolaW * 1.05, step * 0.42);

    for (let i = 0; i < count; i++) {
      const x = zone.rect.x + zone.rect.w * pad + (i + 0.5) * step - shelfW / 2;
      strips.push({
        x,
        y: zone.rect.y + zone.rect.h * 0.08,
        w: shelfW,
        h: zone.rect.h * 0.84,
      });
    }
  }

  return strips;
}

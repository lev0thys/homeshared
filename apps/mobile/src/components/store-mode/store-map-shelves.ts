import {
  buildGondolaStripsInZone,
  type GondolaStrip,
  type FloorZone,
  type StoreLayoutProfileId,
} from '@homeshared/store-navigation';

export type ShelfStrip = GondolaStrip;

export function buildShelfStripsInZone(
  zone: FloorZone,
  profile: StoreLayoutProfileId,
): ShelfStrip[] {
  return buildGondolaStripsInZone(zone, profile);
}

import type { StoreLayout, StoreLayoutProfileId } from './types.js';
import { HYPERMARKET_FR_LAYOUT } from './layouts/hypermarket-fr.js';
import { SUPERMARKET_FR_LAYOUT } from './layouts/supermarket-fr.js';
import { PROXI_FR_LAYOUT } from './layouts/proxi-fr.js';

const LAYOUTS: Record<StoreLayoutProfileId, StoreLayout> = {
  HYPERMARKET_FR: HYPERMARKET_FR_LAYOUT,
  SUPERMARKET_FR: SUPERMARKET_FR_LAYOUT,
  PROXI_FR: PROXI_FR_LAYOUT,
};

export function getStoreLayout(profile: StoreLayoutProfileId = 'HYPERMARKET_FR'): StoreLayout {
  return LAYOUTS[profile] ?? LAYOUTS.HYPERMARKET_FR;
}

export const STORE_LAYOUT_PROFILES = Object.values(LAYOUTS);

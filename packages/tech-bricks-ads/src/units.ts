import { TestIds } from 'react-native-google-mobile-ads';
import { getAdsConfig } from './config-store';
import type { AdPlacement } from './types';

/** ID d’unité bannière (test Google en dev ou ID prod). */
export function resolveBannerUnitId(_placement: AdPlacement, testMode?: boolean): string {
  const cfg = getAdsConfig();
  if (testMode || cfg?.useTestIds) {
    return TestIds.BANNER;
  }
  return cfg?.bannerId ?? TestIds.BANNER;
}

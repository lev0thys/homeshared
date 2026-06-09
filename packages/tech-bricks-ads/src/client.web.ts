import { setAdsConfig } from './config-store';
import type { AdsConfig, AdPlacement, RewardedResult } from './types';

export async function initAds(config: AdsConfig): Promise<void> {
  setAdsConfig(config);
  if (__DEV__) {
    console.log('[ads] init (web stub)', { useTestIds: config.useTestIds });
  }
}

export async function showInterstitial(_placement: AdPlacement): Promise<boolean> {
  return false;
}

export async function showRewardedAd(_placement: AdPlacement): Promise<RewardedResult> {
  return { shown: false, rewarded: false };
}

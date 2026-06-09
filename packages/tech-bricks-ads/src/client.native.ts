import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import { getAdsConfig, setAdsConfig } from './config-store';
import type { AdsConfig, AdPlacement, RewardedResult } from './types';

let initialized = false;

export async function initAds(config: AdsConfig): Promise<void> {
  setAdsConfig(config);

  if (initialized) return;

  await mobileAds().setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.G,
    tagForChildDirectedTreatment: false,
  });
  await mobileAds().initialize();
  initialized = true;

  if (__DEV__) {
    console.log('[ads] AdMob initialisé', {
      useTestIds: config.useTestIds,
      consentGranted: config.consentGranted,
    });
  }
}

export async function showInterstitial(placement: AdPlacement): Promise<boolean> {
  const cfg = getAdsConfig();
  if (!cfg?.consentGranted) return false;
  if (__DEV__) console.log(`[ads] interstitial @ ${placement} (non branché)`);
  return false;
}

export async function showRewardedAd(placement: AdPlacement): Promise<RewardedResult> {
  const cfg = getAdsConfig();
  if (!cfg?.consentGranted) {
    return { shown: false, rewarded: false };
  }
  if (__DEV__) console.log(`[ads] rewarded @ ${placement} (non branché)`);
  return { shown: false, rewarded: false };
}

import { Platform } from 'react-native';
import { initAds, requestAdsConsent } from '@tech-bricks/ads';
import { env } from '@/lib/env';

/** IDs de test Google officiels (gratuits, aucun revenu en dev). */
const GOOGLE_TEST_ANDROID_APP_ID = 'ca-app-pub-3940256099942544~3347511713';

let adsInitialized = false;

/**
 * Initialise AdMob au démarrage.
 * En dev : IDs de test + consentement activé pour voir les bannières.
 * En prod Android : bandeau UMP avant chargement des pubs.
 */
export async function initAppAds(): Promise<void> {
  if (adsInitialized) return;

  const hasGoogleTestBannerId = env.ADMOB_BANNER_ID.includes('3940256099942544');
  const useTestIds =
    !env.ADS_USE_REAL_UNITS &&
    (__DEV__ || !env.ADMOB_BANNER_ID || hasGoogleTestBannerId);

  let consentGranted = __DEV__ || env.ADS_CONSENT_GRANTED;
  if (!__DEV__ && Platform.OS === 'android' && !env.ADS_CONSENT_GRANTED) {
    consentGranted = await requestAdsConsent();
  }

  await initAds({
    useTestIds,
    appId: env.ADMOB_ANDROID_APP_ID || GOOGLE_TEST_ANDROID_APP_ID,
    bannerId: env.ADMOB_BANNER_ID,
    interstitialId: env.ADMOB_INTERSTITIAL_ID,
    rewardedId: env.ADMOB_REWARDED_ID,
    consentGranted,
  });

  adsInitialized = true;
}

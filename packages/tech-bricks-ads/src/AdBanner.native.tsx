import { useState } from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import type { AdPlacement } from './types';
import { getAdsConfig } from './config-store';
import { resolveBannerUnitId } from './units';
import { AdPlaceholder } from './AdPlaceholder';

interface AdBannerProps {
  placement: AdPlacement;
  testMode?: boolean;
}

/** Bannière AdMob (Android / iOS) — nécessite un build natif (pas Expo Go vanilla). */
export function AdBanner({ placement, testMode }: AdBannerProps) {
  const cfg = getAdsConfig();
  const [failed, setFailed] = useState(false);

  if (!cfg?.consentGranted) {
    return null;
  }

  if (failed) {
    return (
      <AdPlaceholder placement={placement} hint="Pub indisponible (build natif requis ?)" />
    );
  }

  const unitId = resolveBannerUnitId(placement, testMode);

  return (
    <View style={{ alignItems: 'center', backgroundColor: '#f8fafc' }}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}

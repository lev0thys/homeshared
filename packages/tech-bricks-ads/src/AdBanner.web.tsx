import type { AdPlacement } from './types';
import { AdPlaceholder } from './AdPlaceholder';

interface AdBannerProps {
  placement: AdPlacement;
  testMode?: boolean;
}

/** Web : pas de SDK AdMob natif — emplacement réservé (AdSense possible en v2). */
export function AdBanner({ placement }: AdBannerProps) {
  return (
    <AdPlaceholder
      placement={placement}
      hint="Pub mobile (APK / Play Store) — zone web à venir"
    />
  );
}

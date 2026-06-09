export type AdPlacement = string;

export interface AdsConfig {
  /** Si true, force l'utilisation des IDs de test Google (dev & staging). */
  useTestIds: boolean;
  /** App ID AdMob (prod). */
  appId?: string;
  /** Unit IDs par défaut, override possible par placement. */
  bannerId?: string;
  interstitialId?: string;
  rewardedId?: string;
  /** Consentement RGPD obtenu (UMP). */
  consentGranted: boolean;
}

export interface RewardedResult {
  shown: boolean;
  rewarded: boolean;
  rewardType?: string;
  rewardAmount?: number;
}

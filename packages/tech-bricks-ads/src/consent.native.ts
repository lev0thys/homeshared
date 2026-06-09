import {
  AdsConsent,
  AdsConsentStatus,
} from 'react-native-google-mobile-ads';

/**
 * Affiche le formulaire UMP si requis (RGPD / EEE) et retourne si les pubs peuvent être chargées.
 * En cas d'erreur réseau, retourne false (pas de pub sans consentement explicite).
 */
export async function requestAdsConsent(): Promise<boolean> {
  try {
    let consentInfo = await AdsConsent.requestInfoUpdate();

    if (
      consentInfo.isConsentFormAvailable &&
      (consentInfo.status === AdsConsentStatus.UNKNOWN ||
        consentInfo.status === AdsConsentStatus.REQUIRED)
    ) {
      consentInfo = await AdsConsent.showForm();
    } else if (consentInfo.status === AdsConsentStatus.REQUIRED) {
      consentInfo = await AdsConsent.loadAndShowConsentFormIfRequired();
    }

    return (
      consentInfo.status === AdsConsentStatus.OBTAINED ||
      consentInfo.status === AdsConsentStatus.NOT_REQUIRED
    );
  } catch (error) {
    if (__DEV__) {
      console.warn('[ads] consent request failed', error);
    }
    return false;
  }
}

/** Rouvre le formulaire de préférences publicitaires (profil utilisateur). */
export async function showAdsPrivacyOptions(): Promise<boolean> {
  try {
    const result = await AdsConsent.showPrivacyOptionsForm();
    return (
      result.status === AdsConsentStatus.OBTAINED ||
      result.status === AdsConsentStatus.NOT_REQUIRED
    );
  } catch {
    return false;
  }
}

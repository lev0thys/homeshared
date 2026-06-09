/** Web / Expo Go : pas d'UMP ; consentement géré côté app (stub). */
export async function requestAdsConsent(): Promise<boolean> {
  return false;
}

export async function showAdsPrivacyOptions(): Promise<boolean> {
  return false;
}

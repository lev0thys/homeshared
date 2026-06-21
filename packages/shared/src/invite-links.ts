/** Paramètre d'URL pour le token d'invitation (web + deep link). */
export const INVITE_QUERY_PARAM = 'invite';

export type InvitePreviewStatus = 'valid' | 'expired' | 'used';

export const HOMESHARED_APP_SCHEME = 'homeshared';
export const HOMESHARED_ANDROID_PACKAGE = 'com.steve.homeshared';
export const HOMESHARED_IOS_BUNDLE_ID = 'com.steve.homeshared';

const DEFAULT_SITE_URL = 'https://homeshared.vercel.app';

export function normalizeSiteUrl(siteUrl?: string | null): string {
  const base = (siteUrl?.trim() || DEFAULT_SITE_URL).replace(/\/$/, '');
  return base;
}

/** Lien HTTPS partageable (ouvre l'app si installée via App / Universal Links). */
export function buildInviteWebUrl(siteUrl: string | undefined, token: string): string {
  const base = normalizeSiteUrl(siteUrl);
  return `${base}/join?${INVITE_QUERY_PARAM}=${encodeURIComponent(token)}`;
}

/** Deep link custom scheme (secours si Universal / App Links indisponibles). */
export function buildInviteAppDeepLink(token: string): string {
  return `${HOMESHARED_APP_SCHEME}://join?${INVITE_QUERY_PARAM}=${encodeURIComponent(token)}`;
}

export function buildPlayStoreUrl(playStoreUrl?: string | null): string {
  if (playStoreUrl?.trim()) return playStoreUrl.trim();
  return `https://play.google.com/store/apps/details?id=${HOMESHARED_ANDROID_PACKAGE}`;
}

/** `appStoreId` = identifiant numérique App Store Connect (ex. 1234567890). */
export function buildAppStoreUrl(appStoreId?: string | null): string {
  const id = appStoreId?.trim();
  if (id) return `https://apps.apple.com/app/id${id}`;
  return 'https://apps.apple.com/search?term=homeshared';
}

/**
 * Intent Android : ouvre l'app si installée, sinon redirige vers le Play Store.
 * @see https://developer.chrome.com/docs/android/intents
 */
export function buildAndroidInviteIntentUrl(
  token: string,
  playStoreUrl?: string | null,
): string {
  const deepPath = `join?${INVITE_QUERY_PARAM}=${encodeURIComponent(token)}`;
  const fallback = encodeURIComponent(buildPlayStoreUrl(playStoreUrl));
  return (
    `intent://${deepPath}#Intent;` +
    `scheme=${HOMESHARED_APP_SCHEME};` +
    `package=${HOMESHARED_ANDROID_PACKAGE};` +
    `S.browser_fallback_url=${fallback};end`
  );
}

/** Extrait le token depuis un lien complet ou renvoie la saisie brute. */
export function parseInviteTokenInput(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  try {
    const url = new URL(trimmed);
    const fromQuery = url.searchParams.get(INVITE_QUERY_PARAM);
    if (fromQuery?.trim()) return fromQuery.trim();
  } catch {
    // Pas une URL — traiter comme code brut
  }

  return trimmed;
}

import { Linking, Platform } from 'react-native';
import {
  buildAndroidInviteIntentUrl,
  buildAppStoreUrl,
  buildInviteAppDeepLink,
  buildPlayStoreUrl,
} from '@homeshared/shared';
import { env } from './env';
import { openExternalUrl } from './download-links';
import { detectWebPlatform } from '@/hooks/useWebPlatform';

/** PWA / app déjà installée en standalone — pas besoin de pousser vers les stores. */
export function isStandaloneWebApp(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  if (nav.standalone) return true;
  return window.matchMedia('(display-mode: standalone)').matches;
}

/** Tente d'ouvrir l'app native (Android intent ou scheme iOS). */
export function tryOpenNativeInviteApp(token: string): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    void Linking.openURL(buildInviteAppDeepLink(token));
    return;
  }

  const platform = detectWebPlatform();
  if (platform === 'android') {
    window.location.assign(buildAndroidInviteIntentUrl(token, env.PLAY_STORE_URL));
    return;
  }

  if (platform === 'ios') {
    window.location.assign(buildInviteAppDeepLink(token));
    return;
  }

  void Linking.openURL(buildInviteAppDeepLink(token));
}

export function openAppStoreForInvite(): void {
  const platform =
    Platform.OS === 'web' ? detectWebPlatform() : Platform.OS === 'ios' ? 'ios' : 'android';

  if (platform === 'ios') {
    openExternalUrl(buildAppStoreUrl(env.APP_STORE_ID));
    return;
  }

  openExternalUrl(buildPlayStoreUrl(env.PLAY_STORE_URL));
}

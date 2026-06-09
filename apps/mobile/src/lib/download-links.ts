import { Linking, Platform } from 'react-native';
import { env } from './env';

const DEFAULT_APK_PATH = '/download.apk';

/** URL de téléchargement APK : env explicite, sinon fichier statique sur le même site. */
export function getApkDownloadUrl(): string {
  if (env.APK_URL) return env.APK_URL;

  if (Platform.OS === 'web' && typeof globalThis.window !== 'undefined') {
    return new URL(DEFAULT_APK_PATH, globalThis.window.location.origin).href;
  }

  if (env.SITE_URL) {
    return `${env.SITE_URL.replace(/\/$/, '')}${DEFAULT_APK_PATH}`;
  }

  return DEFAULT_APK_PATH;
}

export function openExternalUrl(url: string): void {
  if (Platform.OS === 'web' && typeof globalThis.window !== 'undefined') {
    globalThis.window.location.assign(url);
    return;
  }
  void Linking.openURL(url);
}

/** Déclenche le téléchargement APK (attachement navigateur). */
export function triggerApkDownload(): void {
  openExternalUrl(getApkDownloadUrl());
}

import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export type WebPlatform = 'android' | 'ios' | 'desktop' | 'unknown';

export function detectWebPlatform(): WebPlatform {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return 'android';
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  return 'desktop';
}

/** Détecte Android / iOS / desktop sur le web (user-agent). */
export function useWebPlatform(): WebPlatform {
  const [platform, setPlatform] = useState<WebPlatform>(() => detectWebPlatform());

  useEffect(() => {
    setPlatform(detectWebPlatform());
  }, []);

  return platform;
}

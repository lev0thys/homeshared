import type { AdsConfig } from './types';

let config: AdsConfig | null = null;

export function setAdsConfig(next: AdsConfig): void {
  config = next;
}

export function getAdsConfig(): AdsConfig | null {
  return config;
}

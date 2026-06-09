import Constants from 'expo-constants';

function readEnv(key: string): string {
  const extra = Constants.expoConfig?.extra as Record<string, string> | undefined;
  const value = process.env[key] ?? extra?.[key];
  if (!value) {
    if (__DEV__) {
      console.warn(`⚠️  Variable d'env manquante : ${key}`);
    }
    return '';
  }
  return value;
}

export const env = {
  API_URL: readEnv('EXPO_PUBLIC_API_URL') || 'http://localhost:3001',
  SUPABASE_URL: readEnv('EXPO_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: readEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
  SITE_URL: readEnv('EXPO_PUBLIC_SITE_URL'),
  PLAY_STORE_URL: readEnv('EXPO_PUBLIC_PLAY_STORE_URL'),
  APK_URL: readEnv('EXPO_PUBLIC_APK_URL'),
  ADMOB_ANDROID_APP_ID: readEnv('EXPO_PUBLIC_ADMOB_ANDROID_APP_ID'),
  ADMOB_BANNER_ID: readEnv('EXPO_PUBLIC_ADMOB_BANNER_ID'),
  ADMOB_INTERSTITIAL_ID: readEnv('EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID'),
  ADMOB_REWARDED_ID: readEnv('EXPO_PUBLIC_ADMOB_REWARDED_ID'),
  /** Build EAS preview/prod : forcer les unités AdMob réelles (pas les TestIds Google). */
  ADS_USE_REAL_UNITS: readEnv('EXPO_PUBLIC_ADS_USE_REAL_UNITS') === 'true',
  /** true en dev par défaut ; en prod passer EXPO_PUBLIC_ADS_CONSENT=true après bandeau RGPD. */
  ADS_CONSENT_GRANTED:
    readEnv('EXPO_PUBLIC_ADS_CONSENT') === 'true' || __DEV__,
};

export function isSupabaseConfigured(): boolean {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
}

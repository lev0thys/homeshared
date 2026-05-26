import Constants from 'expo-constants';

function readEnv(key: string): string {
  const value = process.env[key] ?? (Constants.expoConfig?.extra as Record<string, string> | undefined)?.[key];
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
  ADMOB_BANNER_ID: readEnv('EXPO_PUBLIC_ADMOB_BANNER_ID'),
};

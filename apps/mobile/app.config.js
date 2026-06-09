const path = require('path');

/** IDs de test Google (gratuits, sans compte AdMob requis en dev). */
const TEST_ANDROID_APP_ID = 'ca-app-pub-3940256099942544~3347511713';
const TEST_IOS_APP_ID = 'ca-app-pub-3940256099942544~1458002511';

/** Injecte .env dans `extra` pour Constants.expoConfig (fiabilise Supabase sur le web). */
module.exports = ({ config }) => {
  require('dotenv').config({ path: path.join(__dirname, '.env') });

  const androidAppId =
    process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID || TEST_ANDROID_APP_ID;
  const iosAppId = process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID || TEST_IOS_APP_ID;

  const plugins = [...(config.plugins ?? [])];
  const hasAdsPlugin = plugins.some(
    (p) => (Array.isArray(p) ? p[0] : p) === 'react-native-google-mobile-ads',
  );
  if (!hasAdsPlugin) {
    plugins.push([
      'react-native-google-mobile-ads',
      {
        androidAppId,
        iosAppId,
      },
    ]);
  }

  const hasBuildProps = plugins.some(
    (p) => (Array.isArray(p) ? p[0] : p) === 'expo-build-properties',
  );
  if (!hasBuildProps) {
    plugins.push([
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 34,
          targetSdkVersion: 34,
          minSdkVersion: 23,
        },
      },
    ]);
  }

  // Retour = config expo (sans wrapper `expo:` — sinon la clé racine AdMob est ignorée).
  return {
    ...config,
    plugins,
    extra: {
      ...(config.extra ?? {}),
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      EXPO_PUBLIC_ADMOB_ANDROID_APP_ID: androidAppId,
      EXPO_PUBLIC_ADMOB_BANNER_ID: process.env.EXPO_PUBLIC_ADMOB_BANNER_ID,
      EXPO_PUBLIC_ADS_CONSENT: process.env.EXPO_PUBLIC_ADS_CONSENT,
      EXPO_PUBLIC_SITE_URL: process.env.EXPO_PUBLIC_SITE_URL,
      EXPO_PUBLIC_PLAY_STORE_URL: process.env.EXPO_PUBLIC_PLAY_STORE_URL,
      EXPO_PUBLIC_APK_URL: process.env.EXPO_PUBLIC_APK_URL,
    },
  };
};

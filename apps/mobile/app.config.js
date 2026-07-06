const path = require('path');

/** IDs de test Google (gratuits, sans compte AdMob requis en dev). */
const TEST_ANDROID_APP_ID = 'ca-app-pub-3940256099942544~3347511713';
const TEST_IOS_APP_ID = 'ca-app-pub-3940256099942544~1458002511';

/** Injecte .env dans `extra` pour Constants.expoConfig (fiabilise Supabase sur le web). */
module.exports = ({ config }) => {
  try {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
  } catch {
    // dotenv absent (ex. eas-cli global avant pnpm install) — variables EAS / env suffisent en CI
  }

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

  const pkg = require('./package.json');
  const sdkMajor = Number(String(pkg.dependencies?.expo ?? '51').match(/(\d+)/)?.[1] ?? 51);

  const hasBuildProps = plugins.some(
    (p) => (Array.isArray(p) ? p[0] : p) === 'expo-build-properties',
  );
  if (!hasBuildProps) {
    const androidBuildProps =
      sdkMajor >= 53
        ? { minSdkVersion: 24, kotlinVersion: '2.0.21' }
        : {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: '35.0.0',
            minSdkVersion: 24,
            kotlinVersion: '1.9.25',
          };
    plugins.push(['expo-build-properties', { android: androidBuildProps }]);
  }

  const hasAppleTargetsPlugin = plugins.some(
    (p) => (Array.isArray(p) ? p[0] : p) === '@bacons/apple-targets',
  );
  if (!hasAppleTargetsPlugin) {
    plugins.push('@bacons/apple-targets');
  }

  if (!plugins.some((p) => (Array.isArray(p) ? p[0] : p) === './plugins/withMonorepoAndroidGradle.js')) {
    plugins.push('./plugins/withMonorepoAndroidGradle.js');
  }

  const skipAndroidWidgets = process.env.EXPO_NO_ANDROID_WIDGETS === 'true';
  if (!skipAndroidWidgets) {
    const hasWidgetPlugin = plugins.some(
      (p) => (Array.isArray(p) ? p[0] : p) === 'react-native-android-widget',
    );
    if (!hasWidgetPlugin) {
      plugins.push([
        'react-native-android-widget',
        {
          widgets: [
            {
              name: 'HomesharedShopping',
              label: 'homeshared — Courses',
              description:
                'Liste de courses du foyer : voir les articles, cocher et ajouter rapidement.',
              minWidth: '300dp',
              minHeight: '140dp',
              targetCellWidth: 4,
              targetCellHeight: 2,
              previewImage: './assets/icon.png',
              updatePeriodMillis: 30 * 60 * 1000,
            },
            {
              name: 'HomesharedFridge',
              label: 'homeshared — Frigo',
              description: 'Alertes expiration et ajustement des quantités (+ / −).',
              minWidth: '300dp',
              minHeight: '140dp',
              targetCellWidth: 4,
              targetCellHeight: 2,
              previewImage: './assets/icon.png',
              updatePeriodMillis: 30 * 60 * 1000,
            },
          ],
        },
      ]);
    }
  }

  // Retour = config expo (sans wrapper `expo:` — sinon la clé racine AdMob est ignorée).
  const appleTeamId = process.env.EXPO_APPLE_TEAM_ID;

  return {
    ...config,
    ...(skipAndroidWidgets
      ? { autolinking: { exclude: ['react-native-android-widget'] } }
      : {}),
    ios: {
      ...(config.ios ?? {}),
      ...(appleTeamId ? { appleTeamId } : {}),
      infoPlist: {
        ...(config.ios?.infoPlist ?? {}),
        ITSAppUsesNonExemptEncryption: false,
      },
    },
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
      EXPO_PUBLIC_APP_STORE_ID: process.env.EXPO_PUBLIC_APP_STORE_ID,
      EXPO_PUBLIC_STORE_MODE_DEV: process.env.EXPO_PUBLIC_STORE_MODE_DEV,
      EXPO_PUBLIC_APK_URL: process.env.EXPO_PUBLIC_APK_URL,
    },
  };
};

import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { AppLogo } from '@/components/AppLogo';
import { env } from '@/lib/env';
import { getApkDownloadUrl, openExternalUrl, triggerApkDownload } from '@/lib/download-links';
import { useWebPlatform } from '@/hooks/useWebPlatform';

function StepRow({ n, text }: { n: number; text: string }) {
  return (
    <View className="flex-row gap-3 items-start">
      <View className="w-7 h-7 rounded-full bg-primary-100 items-center justify-center shrink-0">
        <Text className="text-sm font-bold text-primary-800">{n}</Text>
      </View>
      <Text className="text-sm text-ink-700 flex-1 leading-6">{text}</Text>
    </View>
  );
}

export default function DownloadScreen() {
  const { t } = useTranslation();
  const webPlatform = useWebPlatform();
  const playStoreUrl = env.PLAY_STORE_URL;
  const apkUrl = getApkDownloadUrl();
  const showAndroidFirst = webPlatform === 'android' || webPlatform === 'desktop' || webPlatform === 'unknown';
  const showIosFirst = webPlatform === 'ios';

  function openUrl(url: string) {
    openExternalUrl(url);
  }

  const androidBlock = (
    <View
      nativeID="android"
      className="bg-white rounded-2xl p-5 border border-ink-100 gap-4"
    >
      <View className="flex-row items-center gap-2">
        <Text className="text-2xl">🤖</Text>
        <Text className="text-lg font-semibold text-ink-900">{t('download.androidTitle')}</Text>
      </View>
      <Text className="text-sm text-ink-600">{t('download.androidHint')}</Text>

      <Button onPress={triggerApkDownload}>{t('download.apkDirect')}</Button>
      <Text className="text-xs text-ink-500 text-center">{apkUrl}</Text>

      <View className="gap-3 pt-1">
        <Text className="text-sm font-semibold text-ink-800">{t('download.androidStepsTitle')}</Text>
        <StepRow n={1} text={t('download.androidStep1')} />
        <StepRow n={2} text={t('download.androidStep2')} />
        <StepRow n={3} text={t('download.androidStep3')} />
      </View>

      {playStoreUrl ? (
        <Pressable
          onPress={() => openUrl(playStoreUrl)}
          className="min-h-[48px] justify-center items-center rounded-2xl border border-ink-200 bg-ink-50 active:bg-ink-100"
        >
          <Text className="font-semibold text-ink-800">{t('download.playStore')}</Text>
        </Pressable>
      ) : (
        <Text className="text-xs text-ink-500">{t('download.playStoreSoon')}</Text>
      )}
    </View>
  );

  const iosBlock = (
    <View nativeID="ios" className="bg-white rounded-2xl p-5 border border-ink-100 gap-4">
      <View className="flex-row items-center gap-2">
        <Text className="text-2xl">🍎</Text>
        <Text className="text-lg font-semibold text-ink-900">{t('download.iosTitle')}</Text>
      </View>
      <Text className="text-sm text-ink-600">{t('download.iosHint')}</Text>
      <Text className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
        {t('download.iosNoApk')}
      </Text>

      <Button onPress={() => router.replace('/(auth)/login' as never)}>{t('download.openWebApp')}</Button>

      <View className="gap-3 pt-1">
        <Text className="text-sm font-semibold text-ink-800">{t('download.iosStepsTitle')}</Text>
        <StepRow n={1} text={t('download.iosStep1')} />
        <StepRow n={2} text={t('download.iosStep2')} />
        <StepRow n={3} text={t('download.iosStep3')} />
      </View>
    </View>
  );

  const webBlock = (
    <View className="bg-white rounded-2xl p-5 border border-ink-100 gap-4">
      <Text className="text-lg font-semibold text-ink-900">{t('download.webTitle')}</Text>
      <Text className="text-sm text-ink-600">{t('download.webHint')}</Text>
      <Button onPress={() => router.replace('/(auth)/login' as never)}>{t('download.openWebApp')}</Button>
      {Platform.OS === 'web' ? (
        <Text className="text-xs text-ink-500 text-center">{t('download.pwaHint')}</Text>
      ) : null}
    </View>
  );

  return (
    <Screen>
      <Stack.Screen options={{ title: t('download.title') }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} className="gap-6 max-w-lg w-full self-center">
        <View className="items-center gap-3 pt-4">
          <AppLogo size={88} />
          <Text className="text-3xl font-bold text-ink-900 text-center">{t('download.headline')}</Text>
          <Text className="text-base text-ink-600 text-center leading-6">{t('download.subtitle')}</Text>
        </View>

        {showIosFirst ? (
          <>
            {iosBlock}
            {androidBlock}
          </>
        ) : showAndroidFirst ? (
          <>
            {androidBlock}
            {iosBlock}
          </>
        ) : null}

        {webBlock}

        <View className="gap-2 items-center">
          <Link href="/privacy" className="text-sm text-primary-700">
            {t('legal.privacyLink')}
          </Link>
          {env.SITE_URL ? <Text className="text-xs text-ink-400">{env.SITE_URL}</Text> : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

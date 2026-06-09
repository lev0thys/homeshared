import { Platform, Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useWebPlatform } from '@/hooks/useWebPlatform';

/** Bandeau login web : propose APK Android ou install iOS selon l’appareil. */
export function DownloadBanner() {
  const { t } = useTranslation();
  const platform = useWebPlatform();

  if (Platform.OS !== 'web') return null;
  if (platform !== 'android' && platform !== 'ios') return null;

  const href = platform === 'ios' ? '/download#ios' : '/download#android';
  const label =
    platform === 'android' ? t('download.bannerAndroid') : t('download.bannerIos');

  return (
    <Link href={href as never} asChild>
      <Pressable className="bg-primary-50 border border-primary-200 rounded-2xl px-4 py-3 min-h-[48px] justify-center active:bg-primary-100">
        <Text className="text-sm font-semibold text-primary-800 text-center">{label}</Text>
        <Text className="text-xs text-primary-700 text-center mt-0.5">
          {t('download.bannerHint')}
        </Text>
      </Pressable>
    </Link>
  );
}

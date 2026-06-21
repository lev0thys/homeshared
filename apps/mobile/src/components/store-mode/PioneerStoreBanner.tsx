import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { hasSeenPioneerBanner, markPioneerBannerSeen } from '@/hooks/store-mode/useStoreSession';

interface PioneerStoreBannerProps {
  storeOsmId: string;
  pioneer: boolean;
  communityEnriched?: boolean;
  onLayoutFeedback?: () => void;
}

export function PioneerStoreBanner({
  storeOsmId,
  pioneer,
  communityEnriched,
  onLayoutFeedback,
}: PioneerStoreBannerProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (pioneer) {
        const seen = await hasSeenPioneerBanner(storeOsmId);
        if (!cancelled && !seen) setVisible(true);
      } else {
        setVisible(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pioneer, storeOsmId]);

  async function dismiss() {
    await markPioneerBannerSeen(storeOsmId);
    setVisible(false);
  }

  if (communityEnriched && !pioneer) {
    return (
      <View className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
        <Text className="text-xs text-emerald-800">{t('storeMode.communityEnriched')}</Text>
      </View>
    );
  }

  if (!visible) return null;

  return (
    <View className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-3 gap-2">
      <Text className="text-sm font-semibold text-amber-900">{t('storeMode.pioneerTitle')}</Text>
      <Text className="text-xs text-amber-800 leading-5">{t('storeMode.pioneerBody')}</Text>
      <View className="flex-row gap-2 flex-wrap">
        {onLayoutFeedback ? (
          <Pressable
            onPress={onLayoutFeedback}
            className="px-3 py-2 rounded-lg bg-white border border-amber-200"
          >
            <Text className="text-xs font-medium text-amber-900">{t('storeMode.layoutMismatch')}</Text>
          </Pressable>
        ) : null}
        <Pressable onPress={() => void dismiss()} className="px-3 py-2 rounded-lg bg-amber-600">
          <Text className="text-xs font-medium text-white">{t('storeMode.pioneerDismiss')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

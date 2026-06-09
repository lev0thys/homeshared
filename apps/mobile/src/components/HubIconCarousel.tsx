import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { HorizontalSwipeRow } from '@/components/HorizontalSwipeRow';
import { HubSection } from '@/components/HubSection';
import { UserAvatar } from '@/components/UserAvatar';
import { parsePresetEmoji } from '@/lib/avatar-presets';

export interface HubCarouselItem {
  id: string;
  icon: string;
  route: string;
  beta?: boolean;
  accessibilityLabel: string;
  subtitle?: string;
  isPersonal?: boolean;
  imageUrl?: string | null;
}

interface HubIconCarouselProps {
  items: HubCarouselItem[];
  favoriteIds: Set<string>;
  onToggleFavorite: (id: string) => void;
}

const CARD_STEP = 84 + 14;

/** Espaces du hub — swipe horizontal au doigt. */
export function HubIconCarousel({ items, favoriteIds, onToggleFavorite }: HubIconCarouselProps) {
  const { t } = useTranslation();

  const sorted = useMemo(() => {
    const fav = items.filter((i) => favoriteIds.has(i.id));
    const rest = items.filter((i) => !favoriteIds.has(i.id));
    return [...fav, ...rest];
  }, [items, favoriteIds]);

  if (sorted.length === 0) return null;

  return (
    <HubSection title={t('hub.spacesTitle')}>
      <HorizontalSwipeRow
        decelerationRate="fast"
        snapToInterval={CARD_STEP}
        snapToAlignment="start"
        disableIntervalMomentum
        contentContainerStyle={{
          paddingHorizontal: 4,
          paddingVertical: 4,
          gap: 14,
        }}
      >
        {sorted.map((item) => {
          const isFav = favoriteIds.has(item.id);
          const isPersonal = item.isPersonal ?? false;
          const cardClass = isFav
            ? 'bg-amber-50 border-amber-200/80'
            : isPersonal
              ? 'bg-sky-50 border-sky-200/80'
              : 'bg-white border-ink-100';
          const label = item.subtitle ?? item.accessibilityLabel;
          const hasCustomImage =
            item.imageUrl &&
            (parsePresetEmoji(item.imageUrl) ||
              item.imageUrl.startsWith('https://') ||
              item.imageUrl.startsWith('http://') ||
              item.imageUrl.startsWith('data:image/'));

          return (
            <View key={item.id} className="items-center w-[84px]">
              <View className="relative">
                <Pressable
                  onPress={() => router.push(item.route as never)}
                  accessibilityRole="button"
                  accessibilityLabel={item.accessibilityLabel}
                  className={`w-[76px] h-[76px] rounded-3xl border items-center justify-center active:scale-[0.97] shadow-sm ${cardClass}`}
                  style={{
                    shadowColor: '#0f172a',
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 2,
                  }}
                >
                  {hasCustomImage ? (
                    <UserAvatar displayName={label} avatarUrl={item.imageUrl} size="md" />
                  ) : (
                    <Text style={{ fontSize: 30 }}>{item.icon}</Text>
                  )}
                  {item.beta ? (
                    <View className="absolute -bottom-0.5 right-1 bg-amber-100 rounded-md px-1.5 py-0.5 border border-amber-200">
                      <Text className="text-[9px] text-amber-900 font-semibold">{t('hub.beta')}</Text>
                    </View>
                  ) : null}
                </Pressable>
                <Pressable
                  onPress={() => onToggleFavorite(item.id)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={isFav ? t('hub.removeFavorite') : t('hub.addFavorite')}
                  className="absolute -top-0.5 -right-0.5 w-7 h-7 rounded-full bg-white border border-ink-200 items-center justify-center"
                  style={{
                    shadowColor: '#000',
                    shadowOpacity: 0.08,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 1 },
                    elevation: 2,
                  }}
                >
                  <Text className={`text-sm ${isFav ? 'text-amber-500' : 'text-ink-300'}`}>
                    {isFav ? '★' : '☆'}
                  </Text>
                </Pressable>
              </View>
              {item.subtitle ? (
                <Text
                  className="text-xs font-medium text-ink-800 text-center mt-2 leading-snug px-0.5"
                  numberOfLines={2}
                >
                  {item.subtitle}
                </Text>
              ) : null}
            </View>
          );
        })}
      </HorizontalSwipeRow>
    </HubSection>
  );
}

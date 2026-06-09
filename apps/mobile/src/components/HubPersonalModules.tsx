import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { PERSONAL_MODULES } from '@homeshared/shared';
import { HorizontalSwipeRow } from '@/components/HorizontalSwipeRow';
import { HubSection } from '@/components/HubSection';

const CARD_STEP = 84 + 14;

interface HubPersonalModulesProps {
  favoriteIds: Set<string>;
  onToggleFavorite: (id: string) => void;
}

/** Outils perso — swipe horizontal, favoris ★ en tête. */
export function HubPersonalModules({ favoriteIds, onToggleFavorite }: HubPersonalModulesProps) {
  const { t } = useTranslation();

  const sorted = useMemo(() => {
    const items = PERSONAL_MODULES.map((mod) => ({
      id: mod.id,
      mod,
    }));
    const fav = items.filter((i) => favoriteIds.has(i.id));
    const rest = items.filter((i) => !favoriteIds.has(i.id));
    return [...fav, ...rest];
  }, [favoriteIds]);

  return (
    <HubSection title={t('hub.toolsTitle')}>
      <HorizontalSwipeRow
        decelerationRate="fast"
        snapToInterval={CARD_STEP}
        snapToAlignment="start"
        disableIntervalMomentum
        contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 4, gap: 14 }}
      >
        {sorted.map(({ id, mod }) => {
          const isFav = favoriteIds.has(id);
          const cardClass = isFav
            ? 'bg-amber-50 border-amber-200/90'
            : 'bg-violet-50/90 border-violet-100';

          return (
            <View key={id} className="items-center w-[84px]">
              <View className="relative">
                <Pressable
                  onPress={() => router.push(mod.route as never)}
                  accessibilityRole="button"
                  accessibilityLabel={t(`modules.${mod.labelKey}`)}
                  className={`w-[76px] h-[76px] rounded-3xl border items-center justify-center active:scale-[0.97] shadow-sm ${cardClass}`}
                  style={{
                    shadowColor: '#0f172a',
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 2,
                  }}
                >
                  <Text style={{ fontSize: 30 }}>{mod.icon}</Text>
                  {mod.beta ? (
                    <View className="absolute -bottom-0.5 right-1 bg-amber-100 rounded-md px-1.5 py-0.5 border border-amber-200">
                      <Text className="text-[9px] text-amber-900 font-semibold">{t('hub.beta')}</Text>
                    </View>
                  ) : null}
                </Pressable>
                <Pressable
                  onPress={() => onToggleFavorite(id)}
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
              <Text className="text-xs font-medium text-ink-800 text-center mt-2 leading-snug" numberOfLines={2}>
                {t(`modules.${mod.labelKey}`)}
              </Text>
            </View>
          );
        })}
      </HorizontalSwipeRow>
    </HubSection>
  );
}

import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_GROUP_FEATURES,
  hasGroupFeature,
  PERSONAL_MODULES,
  type GroupFeature,
} from '@homeshared/shared';
import { HomesharedLogo } from '@/components/HomesharedLogo';
import { goBackOrHub } from '@/lib/navigation';

/** Chevron retour (style natif) — pour les tabs sans bouton back intégré. */
export function BackHeaderButton() {
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={goBackOrHub}
      accessibilityRole="button"
      accessibilityLabel={t('common.back')}
      className="min-w-[44px] min-h-[44px] items-center justify-center -ml-1 active:opacity-70"
      style={{ flexShrink: 0 }}
    >
      <Ionicons name="chevron-back" size={28} color="#fff" />
    </Pressable>
  );
}

/** Options Stack : chevron natif React Navigation (pas de flèche texte custom). */
export function backHeaderScreenOptions(overrides: Record<string, unknown> = {}): object {
  return {
    headerBackTitleVisible: false,
    ...overrides,
  };
}

function HeaderIconButton({
  icon,
  onPress,
  accessibilityLabel,
}: {
  icon: string;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="w-10 h-10 items-center justify-center rounded-lg active:bg-white/20"
      style={{ flexShrink: 0 }}
    >
      <Text style={{ fontSize: 20, lineHeight: 22 }}>{icon}</Text>
    </Pressable>
  );
}

/**
 * Barre de navigation du header : icônes alignées sur une seule ligne (hub ou groupe).
 * À placer via `headerTitle`, pas dans le contenu de l’écran.
 */
export function AppHeaderQuickNav({
  variant,
  groupId,
  features = DEFAULT_GROUP_FEATURES,
}: {
  variant: 'hub' | 'group';
  groupId?: string;
  features?: string[];
}) {
  const { t } = useTranslation();

  const groupShortcuts: Array<{ feature: GroupFeature; icon: string; segment: string }> = [
    { feature: 'SHOPPING', icon: '🛒', segment: 'shopping' },
    { feature: 'FRIDGE', icon: '🧊', segment: 'fridge' },
    { feature: 'RECIPES', icon: '🍳', segment: 'recipes' },
    { feature: 'TASKS', icon: '🧹', segment: 'tasks' },
  ];

  return (
    <View className="flex-row items-center gap-0.5 flex-1 pr-2">
      {variant === 'group' && groupId ? (
        <>
          <HeaderIconButton
            icon="🏡"
            accessibilityLabel={t('hub.backToHub')}
            onPress={() => router.replace('/(app)' as never)}
          />
          {groupShortcuts
            .filter((s) => hasGroupFeature(features, s.feature))
            .map((s) => (
              <HeaderIconButton
                key={s.feature}
                icon={s.icon}
                accessibilityLabel={t(`groups.feature.${s.feature}`)}
                onPress={() =>
                  router.push(`/(app)/groups/${groupId}/${s.segment}` as never)
                }
              />
            ))}
        </>
      ) : (
        PERSONAL_MODULES.map((mod) => (
          <HeaderIconButton
            key={mod.id}
            icon={mod.icon}
            accessibilityLabel={t(`modules.${mod.labelKey}`)}
            onPress={() => router.push(mod.route as never)}
          />
        ))
      )}
    </View>
  );
}

export function ProfileHeaderButton() {
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={() => router.push('/(app)/profile' as never)}
      accessibilityRole="button"
      accessibilityLabel={t('profile.title')}
      className="w-10 h-10 items-center justify-center"
      style={{ flexShrink: 0 }}
    >
      <Text className="text-white text-lg">👤</Text>
    </Pressable>
  );
}

/** Profil + logo maison (extrême droite). */
export function AppHeaderRight({
  showChat,
  onOpenChat,
}: {
  showChat?: boolean;
  onOpenChat?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center gap-0">
      {showChat && onOpenChat ? (
        <Pressable
          onPress={onOpenChat}
          accessibilityRole="button"
          accessibilityLabel={t('chat.open')}
          className="w-10 h-10 items-center justify-center"
        >
          <Text className="text-white text-lg">💬</Text>
        </Pressable>
      ) : null}
      <ProfileHeaderButton />
      <HomesharedLogo size="md" tone="onDark" />
    </View>
  );
}

/** @deprecated Alias — utiliser BackHeaderButton */
export const HubBackHeaderButton = BackHeaderButton;

/** Options header hub / outils : raccourcis modules en haut (pas de tab bar). */
export function hubHeaderOptions(nav: ReactElement, right?: ReactElement): object {
  return {
    headerTitle: () => nav,
    headerTitleAlign: 'left' as const,
    headerTitleContainerStyle: { flex: 1, maxWidth: '100%' },
    headerLeft: () => null,
    headerRight: () => right ?? <AppHeaderRight />,
  };
}

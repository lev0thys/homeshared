import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

interface HubGroupFabProps {
  canCreateGroup: boolean;
  /** Distance depuis le bas de l’écran (au-dessus de la bannière pub). */
  bottomOffset: number;
}

/**
 * FAB « + » (speed dial) : rejoindre / créer un groupe.
 */
export function HubGroupFab({ canCreateGroup, bottomOffset }: HubGroupFabProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const actions = [
    {
      key: 'join',
      label: t('groups.joinGroup'),
      icon: '🔗',
      onPress: () => router.push('/join' as never),
    },
    {
      key: 'new',
      label: t('groups.newGroup'),
      icon: '✨',
      onPress: () => {
        if (!canCreateGroup) {
          Alert.alert(t('groups.createBlockedTitle'), t('groups.createBlockedMessage'));
          return;
        }
        router.push('/(app)/create-group' as never);
      },
    },
  ];

  function runAction(action: (typeof actions)[number]) {
    setOpen(false);
    action.onPress();
  }

  return (
    <>
      {open ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('hub.closeGroupActions')}
          className="absolute inset-0 z-10 bg-black/25"
          onPress={() => setOpen(false)}
        />
      ) : null}

      <View
        className="absolute right-4 z-20 items-end"
        style={{ bottom: bottomOffset }}
        pointerEvents="box-none"
      >
        {open
          ? actions.map((action) => (
              <Pressable
                key={action.key}
                onPress={() => runAction(action)}
                accessibilityRole="button"
                accessibilityLabel={action.label}
                className="flex-row items-center gap-2 mb-3 bg-white rounded-full pl-4 pr-1.5 py-1.5 border border-ink-100 shadow-md active:bg-ink-50"
              >
                <Text className="text-sm font-medium text-ink-900 max-w-[200px]" numberOfLines={1}>
                  {action.label}
                </Text>
                <View className="w-11 h-11 rounded-full bg-primary-50 border border-primary-100 items-center justify-center">
                  <Text className="text-lg">{action.icon}</Text>
                </View>
              </Pressable>
            ))
          : null}

        <Pressable
          onPress={() => setOpen((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={open ? t('hub.closeGroupActions') : t('hub.openGroupActions')}
          className={`w-14 h-14 rounded-full items-center justify-center shadow-lg ${
            open ? 'bg-ink-700' : 'bg-primary-600'
          }`}
        >
          <Text className="text-white text-[32px] font-light leading-none" style={{ marginTop: -2 }}>
            {open ? '×' : '+'}
          </Text>
        </Pressable>
      </View>
    </>
  );
}

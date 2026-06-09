import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { hasGroupFeature, type GroupFeature } from '@homeshared/shared';

const SHORTCUTS: Array<{ feature: GroupFeature; icon: string; route: string; labelKey: string }> = [
  { feature: 'SHOPPING', icon: '🛒', route: 'shopping', labelKey: 'SHOPPING' },
  { feature: 'FRIDGE', icon: '🧊', route: 'fridge', labelKey: 'FRIDGE' },
  { feature: 'RECIPES', icon: '🍳', route: 'recipes', labelKey: 'RECIPES' },
  { feature: 'TASKS', icon: '🧹', route: 'tasks', labelKey: 'TASKS' },
];

interface GroupQuickActionsProps {
  groupId: string;
  features: string[];
}

export function GroupQuickActions({ groupId, features }: GroupQuickActionsProps) {
  const { t } = useTranslation();
  const active = SHORTCUTS.filter((s) => hasGroupFeature(features, s.feature));
  if (active.length === 0) return null;

  return (
    <View className="gap-2">
      <Text className="text-base font-semibold text-ink-900">{t('groups.quickActions')}</Text>
      <View className="flex-row flex-wrap gap-2">
        {active.map((s) => (
          <Pressable
            key={s.feature}
            onPress={() =>
              router.push(`/(app)/groups/${groupId}/${s.route}` as never)
            }
            className="flex-row items-center gap-2 bg-white border border-ink-100 rounded-2xl px-4 py-3 min-h-[48px] active:bg-ink-50"
          >
            <Text className="text-xl">{s.icon}</Text>
            <Text className="font-medium text-ink-800">{t(`groups.feature.${s.labelKey}`)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

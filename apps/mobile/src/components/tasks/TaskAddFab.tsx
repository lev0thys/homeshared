import { Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

interface TaskAddFabProps {
  onPress: () => void;
  bottomOffset: number;
}

/** FAB « + » pour ajouter une tâche (style hub accueil). */
export function TaskAddFab({ onPress, bottomOffset }: TaskAddFabProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t('tasks.addFab')}
      className="absolute right-4 z-20 w-14 h-14 rounded-full items-center justify-center shadow-lg bg-primary-600 active:bg-primary-700"
      style={{ bottom: bottomOffset }}
    >
      <Text className="text-white text-[32px] font-light leading-none" style={{ marginTop: -2 }}>
        +
      </Text>
    </Pressable>
  );
}

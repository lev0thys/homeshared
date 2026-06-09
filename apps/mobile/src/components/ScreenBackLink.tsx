import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { goBackOrHub } from '@/lib/navigation';

interface ScreenBackLinkProps {
  label?: string;
}

/** Retour dans le contenu (même chevron que le header). */
export function ScreenBackLink({ label }: ScreenBackLinkProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={goBackOrHub}
      accessibilityRole="button"
      accessibilityLabel={label ?? t('common.back')}
      className="flex-row items-center self-start py-2 pr-3 min-h-[44px] min-w-[44px] active:opacity-70"
    >
      <Ionicons name="chevron-back" size={24} color="#1d4ed8" />
      {label ? (
        <Text className="text-base font-medium text-primary-700 ml-0.5">{label}</Text>
      ) : null}
    </Pressable>
  );
}

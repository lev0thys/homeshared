import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { UserAvatar } from '@/components/UserAvatar';

interface GroupProfileHeaderProps {
  groupId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isPersonal: boolean;
  canEdit: boolean;
}

/** Accueil groupe : photo + nom (+ description en lecture seule). */
export function GroupProfileHeader({
  groupId,
  name,
  description,
  imageUrl,
  isPersonal,
  canEdit,
}: GroupProfileHeaderProps) {
  const { t } = useTranslation();

  return (
    <View className="items-center py-2 mb-1">
      <View className="relative">
        <UserAvatar displayName={name} avatarUrl={imageUrl} size="lg" />
        {canEdit ? (
          <Pressable
            onPress={() =>
              router.push(`/(app)/groups/${groupId}/profile` as never)
            }
            accessibilityRole="button"
            accessibilityLabel={t('groups.editProfileButton')}
            className="absolute -bottom-0.5 -right-0.5 w-9 h-9 rounded-full bg-primary-700 border-2 border-white items-center justify-center active:opacity-90"
          >
            <Text className="text-white text-base leading-none">✏️</Text>
          </Pressable>
        ) : null}
      </View>
      <Text className="text-xl font-bold text-ink-900 mt-3 text-center" accessibilityRole="header">
        {name}
      </Text>
      {isPersonal ? (
        <Text className="text-xs text-primary-700 font-medium mt-1">{t('groups.personalBadge')}</Text>
      ) : null}
      {description ? (
        <Text className="text-sm text-ink-500 text-center mt-2 px-4 leading-snug">{description}</Text>
      ) : null}
    </View>
  );
}

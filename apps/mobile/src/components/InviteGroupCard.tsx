import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { UserAvatar } from '@/components/UserAvatar';
import type { InvitePreview } from '@/hooks/useInvitePreview';

interface InviteGroupCardProps {
  preview: InvitePreview;
}

/** Fiche groupe affichée sur la page d'invitation (lien partagé). */
export function InviteGroupCard({ preview }: InviteGroupCardProps) {
  const { t } = useTranslation();
  const { group, invitedBy, status } = preview;

  const statusBanner =
    status === 'expired'
      ? t('invite.statusExpired')
      : status === 'used'
        ? t('invite.statusUsed')
        : null;

  return (
    <View className="bg-white rounded-2xl border border-ink-100 p-6 gap-4 items-center w-full max-w-md self-center">
      <UserAvatar displayName={group.name} avatarUrl={group.imageUrl} size="lg" />
      <View className="items-center gap-1">
        <Text className="text-2xl font-bold text-ink-900 text-center">{group.name}</Text>
        {group.description ? (
          <Text className="text-sm text-ink-600 text-center leading-5">{group.description}</Text>
        ) : null}
      </View>
      <Text className="text-sm text-ink-500 text-center">
        {t('invite.invitedBy', { name: invitedBy })}
      </Text>
      <Text className="text-xs text-ink-400">
        {t('invite.memberCount', { count: group.memberCount })}
      </Text>
      {statusBanner ? (
        <View className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 w-full">
          <Text className="text-sm text-amber-900 text-center">{statusBanner}</Text>
        </View>
      ) : null}
    </View>
  );
}

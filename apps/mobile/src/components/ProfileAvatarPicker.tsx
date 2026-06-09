import { Alert, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { UserAvatar } from '@/components/UserAvatar';
import { AVATAR_PRESETS, presetAvatarValue } from '@/lib/avatar-presets';
import { pickAvatarFromLibrary } from '@/lib/pick-avatar-image';

interface ProfileAvatarPickerProps {
  displayName: string;
  avatarUrl: string | null;
  onChange: (url: string | null) => void;
}

export function ProfileAvatarPicker({
  displayName,
  avatarUrl,
  onChange,
}: ProfileAvatarPickerProps) {
  const { t } = useTranslation();

  async function handlePickPhoto() {
    const result = await pickAvatarFromLibrary();
    if (result === '__TOO_LARGE__') {
      Alert.alert(t('profile.imageTooLargeTitle'), t('profile.imageTooLargeMessage'));
      return;
    }
    if (result === '__PERMISSION_DENIED__') {
      Alert.alert(t('profile.galleryPermissionTitle'), t('profile.galleryPermissionMessage'));
      return;
    }
    if (result) onChange(result);
  }

  return (
    <View className="items-center gap-4">
      <View className="relative">
        <UserAvatar displayName={displayName} avatarUrl={avatarUrl} size="lg" />
        <Pressable
          onPress={handlePickPhoto}
          accessibilityRole="button"
          accessibilityLabel={t('profile.pickFromGallery')}
          className="absolute -bottom-1 -right-1 bg-primary-700 rounded-full px-3 py-2 min-h-[36px] justify-center border-2 border-white active:opacity-90"
        >
          <Text className="text-white text-xs font-semibold">{t('profile.changePhoto')}</Text>
        </Pressable>
      </View>

      <Pressable onPress={handlePickPhoto} className="py-1 active:opacity-70">
        <Text className="text-sm text-primary-700 font-medium">{t('profile.pickFromGallery')}</Text>
      </Pressable>

      <Text className="text-sm font-medium text-ink-700">{t('profile.choosePreset')}</Text>
      <View className="flex-row flex-wrap justify-center gap-3 max-w-md">
        {AVATAR_PRESETS.map((p) => {
          const value = presetAvatarValue(p.emoji);
          const selected = avatarUrl === value;
          return (
            <Pressable
              key={p.id}
              onPress={() => onChange(value)}
              accessibilityRole="button"
              accessibilityLabel={p.emoji}
              className={`rounded-full items-center justify-center border-2 min-w-[52px] min-h-[52px] ${
                selected ? 'border-primary-600' : 'border-ink-200'
              }`}
              style={{ backgroundColor: p.bg, width: 52, height: 52 }}
            >
              <Text style={{ fontSize: 26 }}>{p.emoji}</Text>
            </Pressable>
          );
        })}
      </View>

      {avatarUrl ? (
        <Pressable onPress={() => onChange(null)} className="py-1">
          <Text className="text-xs text-ink-500">{t('profile.removePhoto')}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

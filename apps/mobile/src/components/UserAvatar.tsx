import { Image, Text, View } from 'react-native';
import { parsePresetEmoji } from '@/lib/avatar-presets';

interface UserAvatarProps {
  displayName: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
}

const SIZE = { sm: 36, md: 48, lg: 96 } as const;
const FONT = { sm: 'text-xs', md: 'text-sm', lg: 'text-2xl' } as const;

export function UserAvatar({ displayName, avatarUrl, size = 'sm' }: UserAvatarProps) {
  const dim = SIZE[size];
  const presetEmoji = parsePresetEmoji(avatarUrl);
  const isRemoteImage =
    avatarUrl &&
    !presetEmoji &&
    (avatarUrl.startsWith('https://') ||
      avatarUrl.startsWith('http://') ||
      avatarUrl.startsWith('data:image/'));

  const ringClass = 'rounded-full border-2 border-white shadow-sm overflow-hidden';

  if (presetEmoji) {
    return (
      <View
        className={`${ringClass} bg-primary-100 items-center justify-center`}
        style={{ width: dim, height: dim }}
      >
        <Text style={{ fontSize: dim * 0.45 }}>{presetEmoji}</Text>
      </View>
    );
  }

  if (isRemoteImage) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        className={ringClass}
        style={{ width: dim, height: dim }}
        accessibilityLabel={displayName}
      />
    );
  }

  return (
    <View
      className={`${ringClass} bg-primary-100 items-center justify-center border-primary-200`}
      style={{ width: dim, height: dim }}
    >
      <Text className={`font-bold text-primary-800 ${FONT[size]}`}>{initials(displayName)}</Text>
    </View>
  );
}

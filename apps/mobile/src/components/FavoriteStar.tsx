import { Pressable, Text } from 'react-native';

interface FavoriteStarProps {
  active: boolean;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const sizes = { sm: 'text-xl', md: 'text-2xl', lg: 'text-3xl' } as const;

export function FavoriteStar({ active, onPress, size = 'md', disabled }: FavoriteStarProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className="min-h-[44px] min-w-[44px] items-center justify-center"
    >
      <Text className={`${sizes[size]} ${active ? 'text-amber-500' : 'text-ink-300'}`}>
        {active ? '★' : '☆'}
      </Text>
    </Pressable>
  );
}

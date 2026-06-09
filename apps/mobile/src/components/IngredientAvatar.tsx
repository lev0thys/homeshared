import { Text, View } from 'react-native';

const CATEGORY_EMOJI: Record<string, string> = {
  VEGETABLE: '🥬',
  FRUIT: '🍎',
  DAIRY: '🥛',
  MEAT: '🥩',
  FISH: '🐟',
  SEAFOOD: '🦐',
  GRAIN: '🌾',
  LEGUME: '🫘',
  CONDIMENT: '🫙',
  SPICE: '🌿',
  OIL: '🫒',
  BAKERY: '🍞',
  OTHER: '🛒',
};

/** Icône catégorie pour un article (en attendant photos Open Food Facts). */
export function IngredientAvatar({
  name,
  category,
  size = 'md',
}: {
  name: string;
  category?: string | null;
  size?: 'sm' | 'md' | 'lg';
}) {
  const emoji = CATEGORY_EMOJI[category ?? 'OTHER'] ?? '🛒';
  const dim = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <View
      className={`${dim} rounded-xl bg-ink-50 border border-ink-100 items-center justify-center`}
      accessibilityLabel={name}
    >
      <Text className={textSize}>{emoji}</Text>
    </View>
  );
}

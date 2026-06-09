import { Text, View } from 'react-native';
import { IngredientAvatar } from '@/components/IngredientAvatar';
import { FavoriteStar } from '@/components/FavoriteStar';

export interface SeasonProduceItem {
  slug: string;
  nameFr: string;
  category: 'FRUIT' | 'VEGETABLE';
  tip?: string;
}

interface SeasonProduceRowProps {
  item: SeasonProduceItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function SeasonProduceRow({ item, isFavorite, onToggleFavorite }: SeasonProduceRowProps) {
  return (
    <View className="flex-row items-center gap-2 bg-white rounded-2xl p-3 mb-2 border border-ink-100 max-w-xl">
      <IngredientAvatar name={item.nameFr} category={item.category} />
      <View className="flex-1 min-w-0">
        <Text className="font-semibold text-ink-900">{item.nameFr}</Text>
        {item.tip ? <Text className="text-xs text-ink-500 mt-0.5">{item.tip}</Text> : null}
      </View>
      <FavoriteStar active={isFavorite} size="sm" onPress={onToggleFavorite} />
    </View>
  );
}

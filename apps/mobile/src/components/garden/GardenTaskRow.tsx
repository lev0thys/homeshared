import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FavoriteStar } from '@/components/FavoriteStar';

export type GardenAction = 'semis' | 'plantation' | 'bouture' | 'recolte';

export interface GardenTaskItem {
  slug: string;
  plantFr: string;
  action: GardenAction;
  description: string;
}

const ACTION_EMOJI: Record<GardenAction, string> = {
  semis: '🌱',
  plantation: '🪴',
  bouture: '✂️',
  recolte: '🧺',
};

interface GardenTaskRowProps {
  item: GardenTaskItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function GardenTaskRow({ item, isFavorite, onToggleFavorite }: GardenTaskRowProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-start gap-2 bg-white rounded-2xl p-3 mb-2 border border-emerald-100 max-w-xl">
      <Text className="text-xl mt-0.5">{ACTION_EMOJI[item.action]}</Text>
      <View className="flex-1 min-w-0">
        <View className="flex-row items-center gap-2 flex-wrap">
          <Text className="font-semibold text-ink-900">{item.plantFr}</Text>
          <Text className="text-xs font-semibold text-emerald-700 uppercase">
            {t(`garden.action.${item.action}`)}
          </Text>
        </View>
        <Text className="text-sm text-ink-600 mt-1 leading-5">{item.description}</Text>
      </View>
      <FavoriteStar active={isFavorite} size="sm" onPress={onToggleFavorite} />
    </View>
  );
}

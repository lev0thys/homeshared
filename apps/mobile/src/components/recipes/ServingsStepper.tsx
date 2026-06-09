import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface ServingsStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function ServingsStepper({ value, onChange, min = 1, max = 12 }: ServingsStepperProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center justify-between bg-white border border-ink-100 rounded-2xl px-4 py-3 mb-3">
      <Text className="text-sm font-medium text-ink-800">{t('recipes.targetServings')}</Text>
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-11 h-11 rounded-full bg-ink-100 items-center justify-center active:bg-ink-200 disabled:opacity-40"
        >
          <Text className="text-xl font-bold text-ink-800">−</Text>
        </Pressable>
        <Text className="text-lg font-bold text-ink-900 w-8 text-center">{value}</Text>
        <Pressable
          onPress={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-11 h-11 rounded-full bg-primary-700 items-center justify-center active:bg-primary-800 disabled:opacity-40"
        >
          <Text className="text-xl font-bold text-white">+</Text>
        </Pressable>
      </View>
    </View>
  );
}

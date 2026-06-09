import { Pressable, ScrollView, Text, View } from 'react-native';
import { COMMON_UNITS } from '@homeshared/shared';

interface Props {
  value: string;
  onChange: (unit: string) => void;
}

/** Sélecteur d'unité — chips 44pt min (mobile-first). */
export function UnitPicker({ value, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-1">
      <View className="flex-row gap-2 py-1">
        {COMMON_UNITS.map((unit) => {
          const selected = value === unit;
          return (
            <Pressable
              key={unit}
              onPress={() => onChange(unit)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              className={`px-4 min-h-[44px] justify-center rounded-full border ${
                selected ? 'bg-primary-600 border-primary-600' : 'bg-white border-ink-200'
              }`}
            >
              <Text className={`text-sm ${selected ? 'text-white font-semibold' : 'text-ink-700'}`}>
                {unit}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

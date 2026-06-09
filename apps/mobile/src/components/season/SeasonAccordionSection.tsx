import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface SeasonAccordionSectionProps {
  title: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

/** Section repliable pour l'écran produits de saison. */
export function SeasonAccordionSection({
  title,
  count,
  open,
  onToggle,
  children,
}: SeasonAccordionSectionProps) {
  return (
    <View className="mb-3">
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        className="flex-row items-center justify-between py-2 active:opacity-70"
      >
        <View className="flex-row items-center gap-2 flex-1">
          <Text className="text-ink-400 text-sm w-5">{open ? '▼' : '▶'}</Text>
          <Text className="text-base font-bold text-ink-900">{title}</Text>
          <Text className="text-sm text-ink-500">({count})</Text>
        </View>
      </Pressable>
      {open ? <View className="mt-1">{children}</View> : null}
    </View>
  );
}

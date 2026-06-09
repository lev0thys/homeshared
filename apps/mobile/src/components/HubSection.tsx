import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface HubSectionProps {
  title: string;
  children: ReactNode;
}

/** Bloc rubrique hub : fond gris léger, fondu et coins arrondis. */
export function HubSection({ title, children }: HubSectionProps) {
  return (
    <View className="mb-3 rounded-2xl bg-ink-100/45 px-3 py-4 overflow-hidden">
      <Text className="text-sm font-semibold text-ink-800 mb-3">{title}</Text>
      {children}
    </View>
  );
}

import { Text, View } from 'react-native';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  message: string;
  icon?: string;
  title?: string;
  action?: ReactNode;
}

export function EmptyState({ message, icon = '📋', title, action }: EmptyStateProps) {
  return (
    <View className="px-6 py-14 items-center">
      <Text className="text-4xl mb-3">{icon}</Text>
      {title ? (
        <Text className="text-center text-ink-900 font-semibold text-lg mb-2">{title}</Text>
      ) : null}
      <Text className="text-center text-ink-500 text-base leading-6 max-w-[280px]">{message}</Text>
      {action ? <View className="mt-4 w-full max-w-xs">{action}</View> : null}
    </View>
  );
}

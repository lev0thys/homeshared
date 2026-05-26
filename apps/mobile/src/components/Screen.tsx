import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';

interface ScreenProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper d'écran : safe area + fond cohérent + StatusBar.
 */
export function Screen({ children, className = '' }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-ink-50">
      <StatusBar style="dark" />
      <View className={`flex-1 px-4 py-3 ${className}`}>{children}</View>
    </SafeAreaView>
  );
}

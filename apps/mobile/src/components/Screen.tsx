import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';

interface ScreenProps {
  children: ReactNode;
  className?: string;
  /** Évite que le clavier masque les champs de saisie */
  keyboard?: boolean;
  /** Inclure le padding bas safe-area (désactivé sous tab bar) */
  safeBottom?: boolean;
}

/**
 * Wrapper d'écran : safe area + fond cohérent + StatusBar.
 */
export function Screen({ children, className = '', keyboard = false, safeBottom = true }: ScreenProps) {
  const edges = safeBottom ? (['top', 'bottom'] as const) : (['top'] as const);
  const body = (
    <View className={`flex-1 px-4 py-3 ${className}`}>{children}</View>
  );

  return (
    <SafeAreaView className="flex-1 bg-ink-50" edges={edges}>
      <StatusBar style="dark" />
      {keyboard ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        >
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

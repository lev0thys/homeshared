import { Pressable, Text, ActivityIndicator } from 'react-native';
import type { ReactNode } from 'react';

interface ButtonProps {
  onPress: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
}

const VARIANTS = {
  primary: 'bg-primary-600 active:bg-primary-700',
  secondary: 'bg-ink-100 active:bg-ink-100/80 border border-ink-100',
  ghost: 'bg-transparent active:bg-ink-100',
} as const;

const TEXT_VARIANTS = {
  primary: 'text-white',
  secondary: 'text-ink-900',
  ghost: 'text-primary-700',
} as const;

export function Button({
  onPress,
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`px-4 py-3 rounded-2xl items-center justify-center min-h-[48px] ${VARIANTS[variant]} ${
        isDisabled ? 'opacity-50' : ''
      }`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#0f172a'} />
      ) : (
        <Text className={`font-semibold text-base ${TEXT_VARIANTS[variant]}`}>{children}</Text>
      )}
    </Pressable>
  );
}

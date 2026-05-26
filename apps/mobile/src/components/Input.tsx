import { TextInput, View, Text } from 'react-native';
import type { TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...rest }: InputProps) {
  return (
    <View className="gap-1">
      {label ? <Text className="text-sm font-medium text-ink-700">{label}</Text> : null}
      <TextInput
        placeholderTextColor="#94a3b8"
        className={`px-4 py-3 rounded-2xl bg-white border text-base text-ink-900 min-h-[48px] ${
          error ? 'border-red-500' : 'border-ink-100'
        }`}
        {...rest}
      />
      {error ? <Text className="text-xs text-red-600">{error}</Text> : null}
    </View>
  );
}

import { Pressable, Text, View } from 'react-native';

interface ChecklistToggleProps {
  checked: boolean;
  onPress: () => void;
  /** Mode sélection multi-suppression */
  selection?: boolean;
  selected?: boolean;
  accessibilityLabel: string;
}

/** Cercle de coche 44pt — pattern AnyList / Bring. */
export function ChecklistToggle({
  checked,
  onPress,
  selection = false,
  selected = false,
  accessibilityLabel,
}: ChecklistToggleProps) {
  const filled = selection ? selected : checked;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: filled }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      className="w-11 h-11 items-center justify-center"
    >
      <View
        className={`w-7 h-7 rounded-full border-2 items-center justify-center ${
          filled
            ? selection
              ? 'bg-primary-600 border-primary-600'
              : 'bg-emerald-500 border-emerald-500'
            : 'bg-white border-ink-300'
        }`}
      >
        {filled ? <Text className="text-white text-sm font-bold">✓</Text> : null}
      </View>
    </Pressable>
  );
}

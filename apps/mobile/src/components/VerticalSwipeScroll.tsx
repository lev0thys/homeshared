import { Platform, ScrollView, type ScrollViewProps, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

function verticalSwipeWebStyle(): ViewStyle | undefined {
  if (Platform.OS !== 'web') return undefined;
  return {
    touchAction: 'pan-y',
  } as ViewStyle;
}

interface VerticalSwipeScrollProps extends ScrollViewProps {
  children: ReactNode;
}

/** Scroll vertical principal — compatible listes horizontales imbriquées (swipe). */
export function VerticalSwipeScroll({ children, style, ...rest }: VerticalSwipeScrollProps) {
  return (
    <ScrollView
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      style={[verticalSwipeWebStyle(), style]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

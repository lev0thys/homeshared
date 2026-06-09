import { Platform, ScrollView, type ScrollViewProps, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

/** Props scroll horizontal optimisés tactile (téléphone + PWA web). */
export const horizontalSwipeScrollProps = {
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  nestedScrollEnabled: true,
  scrollEnabled: true,
  directionalLockEnabled: true,
  decelerationRate: 'fast' as const,
  keyboardShouldPersistTaps: 'handled' as const,
  scrollEventThrottle: 16,
} as const;

/** Styles web pour le swipe au doigt (Safari / Chrome mobile). */
export function horizontalSwipeWebStyle(): StyleProp<ViewStyle> {
  if (Platform.OS !== 'web') return undefined;
  return {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    // Laisse le scroll horizontal sans bloquer le vertical du parent
    touchAction: 'pan-x',
  } as ViewStyle;
}

interface HorizontalSwipeRowProps extends ScrollViewProps {
  children: ReactNode;
}

/**
 * Rangée horizontale scrollable au doigt (espaces, modules, chips…).
 * À utiliser dans un ScrollView vertical : nestedScrollEnabled + directionalLock.
 */
export function HorizontalSwipeRow({
  children,
  style,
  contentContainerStyle,
  ...rest
}: HorizontalSwipeRowProps) {
  return (
    <ScrollView
      {...horizontalSwipeScrollProps}
      style={[{ flexGrow: 0, flexShrink: 0 }, horizontalSwipeWebStyle(), style]}
      contentContainerStyle={contentContainerStyle}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

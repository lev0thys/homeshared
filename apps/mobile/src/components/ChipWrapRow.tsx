import { View, type ViewProps } from 'react-native';
import type { ReactNode } from 'react';

/**
 * Peu de chips (≤6) : retour à la ligne. Ne doit pas grandir en hauteur dans un écran flex.
 */
export function ChipWrapRow({
  children,
  className = '',
  ...viewProps
}: ViewProps & { children: ReactNode; className?: string }) {
  return (
    <View
      {...viewProps}
      className={`w-full shrink-0 grow-0 flex-row flex-wrap gap-2 mb-3 items-start content-start ${className}`}
      style={{ flexGrow: 0, flexShrink: 0, alignContent: 'flex-start' }}
    >
      {children}
    </View>
  );
}

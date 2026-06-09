import { type ScrollViewProps } from 'react-native';
import type { ReactNode } from 'react';
import { HorizontalSwipeRow } from '@/components/HorizontalSwipeRow';

/**
 * Chips / filtres horizontaux — swipe au doigt (ne pas envelopper dans un Pressable parent).
 */
export function ChipScrollRow({
  children,
  className = '',
  ...scrollProps
}: ScrollViewProps & { children: ReactNode; className?: string }) {
  return (
    <HorizontalSwipeRow
      className={`mb-3 shrink-0 grow-0 ${className}`}
      style={{ flexGrow: 0, flexShrink: 0, maxHeight: 48 }}
      contentContainerStyle={{
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 0,
        paddingRight: 8,
        gap: 8,
      }}
      {...scrollProps}
    >
      {children}
    </HorizontalSwipeRow>
  );
}

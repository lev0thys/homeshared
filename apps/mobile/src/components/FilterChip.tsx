import { Pressable, Text, type PressableProps } from 'react-native';
import type { ReactNode } from 'react';

type FilterChipVariant = 'pill' | 'rounded';

interface FilterChipProps extends Omit<PressableProps, 'children'> {
  active?: boolean;
  variant?: FilterChipVariant;
  children: ReactNode;
  className?: string;
  textClassName?: string;
}

const ACTIVE = 'bg-ink-900 border-ink-900';
const INACTIVE = 'bg-white border-ink-200';

/**
 * Chip de filtre : hauteur fixe, ne s'étire pas dans un flex parent (fix web).
 */
export function FilterChip({
  active = false,
  variant = 'pill',
  children,
  className = '',
  textClassName = '',
  ...pressableProps
}: FilterChipProps) {
  const radius = variant === 'pill' ? 'rounded-full' : 'rounded-2xl';
  const isText = typeof children === 'string';

  return (
    <Pressable
      {...pressableProps}
      className={`px-3 py-2 border min-h-[44px] max-h-[44px] justify-center self-center shrink-0 ${radius} ${
        active ? ACTIVE : INACTIVE
      } ${className}`}
      style={{ flexGrow: 0, flexShrink: 0 }}
    >
      {isText ? (
        <Text
          className={`text-sm font-medium ${active ? 'text-white' : 'text-ink-700'} ${textClassName}`}
          numberOfLines={1}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

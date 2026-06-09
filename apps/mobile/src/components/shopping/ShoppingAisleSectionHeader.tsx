import { Platform, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface ShoppingAisleSectionHeaderProps {
  title: string;
  hint?: string;
  emoji?: string;
  itemCount: number;
  collapsed: boolean;
  compact?: boolean;
  onToggle: () => void;
}

const stickyHeaderStyle = Platform.select({
  ios: {
    zIndex: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  android: {
    zIndex: 20,
    elevation: 6,
  },
  default: { zIndex: 20 },
});

/** En-tête de rayon : fond opaque + bandeau haut pour masquer le scroll sticky. */
export function ShoppingAisleSectionHeader({
  title,
  hint,
  emoji,
  itemCount,
  collapsed,
  compact = false,
  onToggle,
}: ShoppingAisleSectionHeaderProps) {
  const { t } = useTranslation();
  const wrapClass = compact ? 'bg-ink-50 pt-1 pb-1' : 'bg-ink-50 pt-3 pb-1.5';

  return (
    <View className={wrapClass} style={compact ? undefined : stickyHeaderStyle}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: !collapsed }}
        accessibilityLabel={
          collapsed ? t('shopping.expandAisle', { title }) : t('shopping.collapseAisle', { title })
        }
        className="bg-white rounded-xl px-3 py-2.5 border border-ink-200 min-h-[48px] active:bg-ink-100"
      >
        <View className="flex-row items-center gap-2">
          {emoji ? <Text className="text-base">{emoji}</Text> : null}
          <View className="flex-1 min-w-0">
            <Text className="text-sm font-bold text-ink-900">{title}</Text>
            {collapsed ? (
              <Text className="text-[11px] text-ink-500 mt-0.5">
                {t('shopping.aisleItemCount', { count: itemCount })}
              </Text>
            ) : hint ? (
              <Text className="text-[11px] text-ink-500 mt-0.5 leading-4">{hint}</Text>
            ) : null}
          </View>
          {!collapsed && itemCount > 0 ? (
            <Text className="text-xs font-semibold text-ink-500">{itemCount}</Text>
          ) : null}
          <Ionicons
            name={collapsed ? 'chevron-down' : 'chevron-up'}
            size={18}
            color="#64748b"
          />
        </View>
      </Pressable>
    </View>
  );
}
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';

interface CollapsibleManagePanelProps {
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  /** Libellé bouton replié (défaut : courses). */
  expandLabel?: string;
  /** Libellé bouton déplié (défaut : courses). */
  collapseLabel?: string;
  /** Sous-titre replié — remplace le résumé courses si fourni. */
  collapsedSummary?: string;
  /** Progression courses (optionnel). */
  done?: number;
  total?: number;
  pendingCount?: number;
  showProgressBar?: boolean;
}

/** Panneau repliable pour formulaires d’ajout / actions secondaires. */
export function CollapsibleManagePanel({
  expanded,
  onToggle,
  children,
  expandLabel,
  collapseLabel,
  collapsedSummary,
  done = 0,
  total = 0,
  pendingCount = 0,
  showProgressBar = true,
}: CollapsibleManagePanelProps) {
  const { t } = useTranslation();
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const expandText = expandLabel ?? t('shopping.expandPanel');
  const collapseText = collapseLabel ?? t('shopping.collapsePanel');
  const summary =
    collapsedSummary ??
    (total > 0 || pendingCount > 0
      ? `${t('shopping.progress', { done, total })}${
          pendingCount > 0 ? ` · ${t('shopping.pendingCount', { count: pendingCount })}` : ''
        }`
      : undefined);

  return (
    <View className="mb-2">
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={expanded ? collapseText : expandText}
        className="bg-white rounded-2xl border border-ink-200 px-3 py-2.5 min-h-[48px] active:bg-ink-50"
      >
        <View className="flex-row items-center gap-2">
          <View className="flex-1 min-w-0">
            <Text className="text-sm font-semibold text-ink-900">
              {expanded ? collapseText : expandText}
            </Text>
            {!expanded && summary ? (
              <Text className="text-xs text-ink-500 mt-0.5" numberOfLines={2}>
                {summary}
              </Text>
            ) : null}
          </View>
          {!expanded && showProgressBar && total > 0 ? (
            <Text className="text-xs font-medium text-emerald-700">{pct}%</Text>
          ) : null}
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#64748b"
          />
        </View>
        {!expanded && showProgressBar && total > 0 ? (
          <View className="h-1.5 bg-ink-200 rounded-full overflow-hidden mt-2">
            <View
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${pct}%` }}
            />
          </View>
        ) : null}
      </Pressable>

      {expanded ? <View className="mt-3 gap-3">{children}</View> : null}
    </View>
  );
}

/** Alias courses — compatibilité. */
export const ShoppingManagePanel = CollapsibleManagePanel;

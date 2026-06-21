import type { ReactNode } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

interface StoreModeSplitLayoutProps {
  /** Mode navigation GPS : carte prioritaire, liste secondaire. */
  navigationLayout: boolean;
  map: ReactNode;
  list: ReactNode;
}

/**
 * Portrait navigation : carte plein écran au-dessus, liste en dessous.
 * Paysage navigation : liste à gauche, carte à droite.
 */
export function StoreModeSplitLayout({ navigationLayout, map, list }: StoreModeSplitLayoutProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  if (!navigationLayout) {
    return (
      <View className="flex-1">
        <View className="flex-1 min-h-0 -mx-4" style={{ minHeight: 300 }}>
          {map}
        </View>
        <ScrollView
          className="shrink-0"
          style={{ maxHeight: '34%' }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          {list}
        </ScrollView>
      </View>
    );
  }

  if (isLandscape) {
    return (
      <View className="flex-1 flex-row min-h-0 -mx-4">
        <ScrollView
          className="shrink-0 border-r border-ink-100 bg-ink-50/50"
          style={{ width: Math.min(380, Math.round(width * 0.42)) }}
          contentContainerStyle={{ padding: 12, gap: 12, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {list}
        </ScrollView>
        <View className="flex-1 min-w-0 min-h-0">{map}</View>
      </View>
    );
  }

  return (
    <View className="flex-1 min-h-0">
      <View className="flex-1 min-h-0 -mx-4">{map}</View>
      <ScrollView
        className="shrink-0 border-t border-ink-100 bg-white"
        style={{ maxHeight: Math.min(280, Math.round(height * 0.38)) }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, gap: 12 }}
        keyboardShouldPersistTaps="handled"
      >
        {list}
      </ScrollView>
    </View>
  );
}

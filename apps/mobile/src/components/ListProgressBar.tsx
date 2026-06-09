import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface ListProgressBarProps {
  done: number;
  total: number;
}

/** Barre de progression type AnyList / Bring (articles cochés). */
export function ListProgressBar({ done, total }: ListProgressBarProps) {
  const { t } = useTranslation();
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <View className="mb-3">
      <View className="flex-row justify-between items-center mb-1.5">
        <Text className="text-sm font-semibold text-ink-800">
          {t('shopping.progress', { done, total })}
        </Text>
        <Text className="text-xs font-medium text-ink-500">{pct}%</Text>
      </View>
      <View className="h-2 bg-ink-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-emerald-500 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </View>
    </View>
  );
}

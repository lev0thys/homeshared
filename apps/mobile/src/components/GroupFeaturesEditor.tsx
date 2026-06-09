import { Alert, Switch, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DEFAULT_GROUP_FEATURES,
  hasGroupFeature,
  type GroupFeature,
} from '@homeshared/shared';
import { api } from '@/lib/api-client';
import { useMutationError } from '@/hooks/useMutationError';

const TOGGLEABLE_FEATURES: GroupFeature[] = ['SHOPPING', 'FRIDGE', 'RECIPES', 'TASKS'];

interface GroupFeaturesEditorProps {
  groupId: string;
  features: string[];
  /** Seul le titulaire peut modifier les modules actifs. */
  isOwner: boolean;
}

export function GroupFeaturesEditor({ groupId, features, isOwner }: GroupFeaturesEditorProps) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { error, capture, clearError } = useMutationError();

  const activeFeatures = features.length ? features : [...DEFAULT_GROUP_FEATURES];

  const updateMutation = useMutation({
    mutationFn: (next: GroupFeature[]) => api.patch(`/api/groups/${groupId}`, { features: next }),
    onSuccess: () => {
      clearError();
      qc.invalidateQueries({ queryKey: ['group', groupId] });
      qc.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: (err) => capture(err),
  });

  function toggleFeature(feature: GroupFeature, enabled: boolean) {
    let next: GroupFeature[];
    if (enabled) {
      next = [...new Set([...activeFeatures, feature])] as GroupFeature[];
    } else {
      next = activeFeatures.filter((f: string) => f !== feature) as GroupFeature[];
      if (next.length === 0) {
        Alert.alert(t('groups.featuresTitle'), t('groups.featuresMinOne'));
        return;
      }
    }
    updateMutation.mutate(next);
  }

  if (!isOwner) return null;

  return (
    <View className="bg-white rounded-2xl p-4 border border-ink-100 gap-3">
      <Text className="text-base font-semibold text-ink-900">{t('groups.featuresTitle')}</Text>
      <Text className="text-xs text-ink-500">{t('groups.featuresHint')}</Text>
      {TOGGLEABLE_FEATURES.map((feature) => (
        <View key={feature} className="flex-row items-center justify-between min-h-[44px]">
          <Text className="text-ink-800 flex-1 pr-2">{t(`groups.feature.${feature}`)}</Text>
          <Switch
            value={hasGroupFeature(activeFeatures, feature)}
            onValueChange={(v) => toggleFeature(feature, v)}
            disabled={updateMutation.isPending}
          />
        </View>
      ))}
      {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
    </View>
  );
}

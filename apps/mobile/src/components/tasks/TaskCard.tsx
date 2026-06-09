import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';
import { UserAvatar } from '@/components/UserAvatar';
import { formatTaskDuration } from '@/lib/format-task-duration';
import type { HouseholdTaskRow } from './types';

interface TaskCardProps {
  item: HouseholdTaskRow;
  userId?: string;
  compact?: boolean;
  onClaim: () => void;
  onComplete: () => void;
  claiming?: boolean;
  completing?: boolean;
}

export function TaskCard({
  item,
  userId,
  compact = false,
  onClaim,
  onComplete,
  claiming,
  completing,
}: TaskCardProps) {
  const { t } = useTranslation();
  const isClaimedByMe = item.claimedBy?.id === userId;
  const isOpen = item.status === 'OPEN';
  const isClaimed = item.status === 'CLAIMED';
  const showActions = !compact;

  return (
    <View className="bg-white rounded-2xl p-3 border border-ink-100">
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1 min-w-0">
          <Text className={`font-bold text-ink-900 ${compact ? 'text-sm' : 'text-base'}`} numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="text-xs text-primary-700 mt-0.5">{t(`tasks.recurrence.${item.recurrence}`)}</Text>
          {item.estimatedDurationMinutes ? (
            <Text className="text-xs text-ink-500 mt-0.5">
              ⏱ {formatTaskDuration(item.estimatedDurationMinutes, t)}
            </Text>
          ) : null}
          {!compact && item.description ? (
            <Text className="text-sm text-ink-500 mt-1">{item.description}</Text>
          ) : null}
        </View>
        {item.claimedBy ? (
          <View className="items-center shrink-0">
            <UserAvatar displayName={item.claimedBy.displayName} size={compact ? 'sm' : 'md'} />
            {!compact ? (
              <Text className="text-xs text-ink-500 mt-1" numberOfLines={1}>
                {item.claimedBy.displayName}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>

      {showActions ? (
        <View className="flex-row gap-2 mt-3">
          {isOpen ? (
            <View className="flex-1">
              <Button variant="secondary" onPress={onClaim} loading={claiming}>
                {t('tasks.claim')}
              </Button>
            </View>
          ) : null}
          {(isClaimedByMe || isOpen) && (isClaimed || isOpen) ? (
            <View className="flex-1">
              <Button onPress={onComplete} loading={completing}>
                {t('tasks.complete')}
              </Button>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

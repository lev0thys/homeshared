import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';
import { FilterChip } from '@/components/FilterChip';
import { MealPlanWeekBar } from '@/components/meal-plan/MealPlanWeekBar';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TASK_DAY_KEYS, type HouseholdTaskRow } from '@/components/tasks/types';
import { dateKeyFromIsoInstant, dayIndexInWeek } from '@/lib/week-dates';

interface TaskScheduleModalProps {
  visible: boolean;
  task: HouseholdTaskRow | null;
  weekStart: string;
  onWeekStartChange: (iso: string) => void;
  userId?: string;
  onClose: () => void;
  onScheduleDay: (dayIndex: number | null) => void;
  onClaim: () => void;
  onComplete: () => void;
  scheduling?: boolean;
  claiming?: boolean;
  completing?: boolean;
}

export function TaskScheduleModal({
  visible,
  task,
  weekStart,
  onWeekStartChange,
  userId,
  onClose,
  onScheduleDay,
  onClaim,
  onComplete,
  scheduling,
  claiming,
  completing,
}: TaskScheduleModalProps) {
  const { t } = useTranslation();

  if (!task) return null;

  const currentDayIndex = task.dueDate
    ? dayIndexInWeek(dateKeyFromIsoInstant(task.dueDate), weekStart)
    : null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={onClose}>
        <Pressable
          className="bg-ink-50 rounded-t-3xl max-h-[90%]"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="w-10 h-1 bg-ink-300 rounded-full self-center mt-2 mb-3" />
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}>
            <Text className="text-lg font-bold text-ink-900 mb-1">{task.title}</Text>
            <Text className="text-sm text-ink-600 mb-3">{t('tasks.scheduleTitle')}</Text>

            <MealPlanWeekBar weekStart={weekStart} onWeekStartChange={onWeekStartChange} />

            <Text className="text-xs font-semibold text-ink-500 uppercase mb-2">
              {t('tasks.pickDay')}
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-3">
              {TASK_DAY_KEYS.map((dayKey, dayIndex) => (
                <FilterChip
                  key={dayKey}
                  active={currentDayIndex !== null && currentDayIndex === dayIndex}
                  onPress={() => onScheduleDay(dayIndex)}
                  disabled={scheduling}
                >
                  {t(`mealPlan.daysShort.${dayKey}`)}
                </FilterChip>
              ))}
              <FilterChip
                active={currentDayIndex === null && !task.dueDate}
                onPress={() => onScheduleDay(null)}
                disabled={scheduling}
              >
                {t('tasks.noDueDate')}
              </FilterChip>
            </View>

            {scheduling ? (
              <ActivityIndicator className="mb-3" color="#2563eb" />
            ) : null}

            <TaskCard
              item={task}
              userId={userId}
              onClaim={onClaim}
              onComplete={onComplete}
              claiming={claiming}
              completing={completing}
            />

            <View className="mt-3">
            <Button variant="secondary" onPress={onClose}>
              {t('common.cancel')}
            </Button>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

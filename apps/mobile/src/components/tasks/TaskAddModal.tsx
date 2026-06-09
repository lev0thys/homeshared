import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { FilterChip } from '@/components/FilterChip';
import { TASK_DAY_KEYS, type TaskRecurrence } from '@/components/tasks/types';

const RECURRENCE_OPTIONS: TaskRecurrence[] = ['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY'];
const DURATION_PRESETS = [15, 30, 45, 60, 90, 120] as const;

interface TaskAddModalProps {
  visible: boolean;
  title: string;
  recurrence: TaskRecurrence;
  addDayIndex: number | null;
  estimatedDuration: string;
  error?: string | null;
  loading?: boolean;
  onClose: () => void;
  onTitleChange: (value: string) => void;
  onRecurrenceChange: (value: TaskRecurrence) => void;
  onAddDayIndexChange: (value: number | null) => void;
  onEstimatedDurationChange: (value: string) => void;
  onSubmit: () => void;
}

/** Formulaire nouvelle tâche — ouvert via le FAB, pas affiché par défaut. */
export function TaskAddModal({
  visible,
  title,
  recurrence,
  addDayIndex,
  estimatedDuration,
  error,
  loading,
  onClose,
  onTitleChange,
  onRecurrenceChange,
  onAddDayIndexChange,
  onEstimatedDurationChange,
  onSubmit,
}: TaskAddModalProps) {
  const { t } = useTranslation();
  const selectedPreset = Number.parseInt(estimatedDuration.trim(), 10);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={onClose}>
        <Pressable className="bg-white rounded-t-3xl max-h-[90%]" onPress={(e) => e.stopPropagation()}>
          <View className="w-10 h-1 rounded-full bg-ink-200 self-center mt-3 mb-2" />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          >
            <Text className="text-lg font-bold text-ink-900 mb-3">{t('tasks.addTitle')}</Text>
            <Input placeholder={t('tasks.titlePlaceholder')} value={title} onChangeText={onTitleChange} />
            <Text className="text-xs text-ink-500 mt-3 mb-2">{t('tasks.recurrenceLabel')}</Text>
            <View className="flex-row flex-wrap gap-2 mb-3">
              {RECURRENCE_OPTIONS.map((r) => (
                <Pressable
                  key={r}
                  onPress={() => onRecurrenceChange(r)}
                  className={`px-3 py-2 rounded-full border min-h-[44px] justify-center ${
                    recurrence === r ? 'bg-primary-50 border-primary-400' : 'border-ink-200'
                  }`}
                >
                  <Text className={`text-xs font-medium ${recurrence === r ? 'text-primary-800' : 'text-ink-600'}`}>
                    {t(`tasks.recurrence.${r}`)}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text className="text-xs text-ink-500 mb-2">{t('tasks.addDayLabel')}</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              <FilterChip active={addDayIndex === null} onPress={() => onAddDayIndexChange(null)}>
                {t('tasks.noDueDate')}
              </FilterChip>
              {TASK_DAY_KEYS.map((dayKey, dayIndex) => (
                <FilterChip
                  key={dayKey}
                  active={addDayIndex === dayIndex}
                  onPress={() => onAddDayIndexChange(dayIndex)}
                >
                  {t(`mealPlan.daysShort.${dayKey}`)}
                </FilterChip>
              ))}
            </View>
            <Text className="text-xs text-ink-500 mb-2">{t('tasks.estimatedDurationLabel')}</Text>
            <View className="flex-row flex-wrap gap-2 mb-2">
              {DURATION_PRESETS.map((minutes) => (
                <FilterChip
                  key={minutes}
                  active={selectedPreset === minutes && estimatedDuration.trim() === String(minutes)}
                  onPress={() => onEstimatedDurationChange(String(minutes))}
                >
                  {t('tasks.durationMinutes', { count: minutes })}
                </FilterChip>
              ))}
            </View>
            <Input
              label={t('tasks.estimatedDurationHint')}
              placeholder={t('tasks.estimatedDurationPlaceholder')}
              value={estimatedDuration}
              onChangeText={onEstimatedDurationChange}
              keyboardType="number-pad"
            />
            {error ? <Text className="text-sm text-red-600 mb-2 mt-2">{error}</Text> : null}
            <View className="mt-3">
              <Button onPress={onSubmit} disabled={!title.trim()} loading={loading}>
                + {t('tasks.addButton')}
              </Button>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

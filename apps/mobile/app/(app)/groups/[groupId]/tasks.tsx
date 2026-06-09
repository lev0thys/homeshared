import { useMemo, useState } from 'react';

import { FlatList, Pressable, Text, View } from 'react-native';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useTranslation } from 'react-i18next';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/Screen';

import { LoadingCenter } from '@/components/LoadingCenter';

import { EmptyState } from '@/components/EmptyState';

import { MealPlanWeekBar } from '@/components/meal-plan/MealPlanWeekBar';

import { TaskAddFab } from '@/components/tasks/TaskAddFab';

import { TaskAddModal } from '@/components/tasks/TaskAddModal';

import { TaskCard } from '@/components/tasks/TaskCard';

import { TaskScheduleModal } from '@/components/tasks/TaskScheduleModal';

import { TasksCalendarView } from '@/components/tasks/TasksCalendarView';

import { type HouseholdTaskRow, type TaskRecurrence } from '@/components/tasks/types';

import { api } from '@/lib/api-client';

import { parseEstimatedDurationInput } from '@/lib/format-task-duration';
import { partitionTasksByWeek } from '@/lib/partition-tasks-by-week';

import {

  dateIsoForWeekDay,

  dueDateInstantForDay,

  mondayIsoUtc,

  todayDayIndexUtc,

} from '@/lib/week-dates';

import { useGroupId } from '@/hooks/useGroupId';

import { useMutationError } from '@/hooks/useMutationError';

import { useUserCapabilities } from '@/hooks/useUserCapabilities';

import { useSessionStore } from '@/stores/session.store';



export default function TasksScreen() {

  const groupId = useGroupId();

  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const qc = useQueryClient();

  const userId = useSessionStore((s) => s.user?.id);

  const { canManageTasks } = useUserCapabilities(groupId, userId);

  const { error, capture, clearError } = useMutationError();

  const [title, setTitle] = useState('');

  const [estimatedDuration, setEstimatedDuration] = useState('');

  const [recurrence, setRecurrence] = useState<TaskRecurrence>('ONCE');

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');

  const [weekStart, setWeekStart] = useState(() => mondayIsoUtc());

  const [addDayIndex, setAddDayIndex] = useState<number | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<HouseholdTaskRow | null>(null);



  const fabBottom = insets.bottom + 72;

  const contentBottomPad = canManageTasks ? fabBottom + 56 : 48;



  const highlightDayIndex = weekStart === mondayIsoUtc() ? todayDayIndexUtc() : null;



  const { data: tasks, isLoading } = useQuery({

    queryKey: ['tasks', groupId],

    queryFn: () => api.get<HouseholdTaskRow[]>(`/api/tasks/${groupId}`),

    enabled: !!groupId,

  });



  const taskList = tasks ?? [];



  const { byDay, unscheduled } = useMemo(

    () => partitionTasksByWeek<HouseholdTaskRow>(taskList, weekStart),

    [taskList, weekStart],

  );



  const invalidate = () => qc.invalidateQueries({ queryKey: ['tasks', groupId] });



  function openAddModal(dayIndex: number | null = null) {

    setAddDayIndex(dayIndex);

    setAddModalOpen(true);

  }



  function closeAddModal() {

    setAddModalOpen(false);

    setEstimatedDuration('');

    clearError();

  }



  const addMutation = useMutation({

    mutationFn: () => {

      const durationMinutes = parseEstimatedDurationInput(estimatedDuration);

      if (durationMinutes === undefined) {

        throw new Error(t('tasks.estimatedDurationInvalid'));

      }

      const dueDate =

        addDayIndex !== null ? dueDateInstantForDay(dateIsoForWeekDay(weekStart, addDayIndex)) : undefined;

      return api.post('/api/tasks', {

        groupId: groupId!,

        title: title.trim(),

        recurrence,

        dueDate,

        estimatedDurationMinutes: durationMinutes,

      });

    },

    onSuccess: () => {

      clearError();

      setTitle('');

      setEstimatedDuration('');

      setAddDayIndex(null);

      setAddModalOpen(false);

      invalidate();

    },

    onError: (err) => capture(err),

  });



  const scheduleMutation = useMutation({

    mutationFn: ({ taskId, dayIndex }: { taskId: string; dayIndex: number | null }) => {

      const dueDate =

        dayIndex === null ? null : dueDateInstantForDay(dateIsoForWeekDay(weekStart, dayIndex));

      return api.patch<HouseholdTaskRow>(`/api/tasks/${taskId}`, { dueDate });

    },

    onSuccess: (updated) => {

      clearError();

      setSelectedTask(updated);

      invalidate();

    },

    onError: (err) => capture(err),

  });



  const claimMutation = useMutation({

    mutationFn: (taskId: string) => api.post<HouseholdTaskRow>(`/api/tasks/${taskId}/claim`, {}),

    onSuccess: (updated) => {

      setSelectedTask((prev) => (prev?.id === updated.id ? updated : prev));

      invalidate();

    },

    onError: (err) => capture(err),

  });



  const completeMutation = useMutation({

    mutationFn: (taskId: string) => api.post<HouseholdTaskRow>(`/api/tasks/${taskId}/complete`, {}),

    onSuccess: () => {

      setSelectedTask(null);

      invalidate();

    },

    onError: (err) => capture(err),

  });



  if (!groupId) {

    return (

      <Screen>

        <EmptyState message={t('groups.notFound')} />

      </Screen>

    );

  }



  const openTask = (task: HouseholdTaskRow) => setSelectedTask(task);



  const viewToggle = (

    <View className="flex-row gap-2 mb-3">

      <Pressable

        onPress={() => setViewMode('calendar')}

        className={`flex-1 py-3 rounded-xl border items-center min-h-[44px] justify-center ${

          viewMode === 'calendar' ? 'bg-ink-900 border-ink-900' : 'bg-white border-ink-200'

        }`}

      >

        <Text className={`text-sm font-medium ${viewMode === 'calendar' ? 'text-white' : 'text-ink-700'}`}>

          {t('tasks.viewCalendar')}

        </Text>

      </Pressable>

      <Pressable

        onPress={() => setViewMode('list')}

        className={`flex-1 py-3 rounded-xl border items-center min-h-[44px] justify-center ${

          viewMode === 'list' ? 'bg-ink-900 border-ink-900' : 'bg-white border-ink-200'

        }`}

      >

        <Text className={`text-sm font-medium ${viewMode === 'list' ? 'text-white' : 'text-ink-700'}`}>

          {t('tasks.viewList')}

        </Text>

      </Pressable>

    </View>

  );



  return (

    <Screen keyboard safeBottom={false} className="flex-1">

      {viewToggle}



      {error && !addModalOpen ? <Text className="text-sm text-red-600 mb-2">{error}</Text> : null}



      {isLoading ? (

        <LoadingCenter />

      ) : viewMode === 'calendar' ? (

        <View className="flex-1" style={{ paddingBottom: contentBottomPad }}>

          <MealPlanWeekBar weekStart={weekStart} onWeekStartChange={setWeekStart} />

          {taskList.length === 0 ? (

            <EmptyState icon="🧹" message={t('tasks.empty')} />

          ) : (

            <TasksCalendarView

              byDay={byDay}

              unscheduled={unscheduled}

              highlightDayIndex={highlightDayIndex}

              onTaskPress={openTask}

              onDayPress={canManageTasks ? (dayIndex) => openAddModal(dayIndex) : undefined}
              onTaskMoveToDay={
                canManageTasks
                  ? (task, dayIndex) => scheduleMutation.mutate({ taskId: task.id, dayIndex })
                  : undefined
              }

            />

          )}

        </View>

      ) : (

        <FlatList

          data={taskList}

          keyExtractor={(item) => item.id}

          ListEmptyComponent={<EmptyState icon="🧹" message={t('tasks.empty')} />}

          ItemSeparatorComponent={() => <View className="h-2" />}

          renderItem={({ item }) => (

            <Pressable onPress={() => openTask(item)} className="active:opacity-90">

              <TaskCard

                item={item}

                userId={userId}

                onClaim={() => claimMutation.mutate(item.id)}

                onComplete={() => completeMutation.mutate(item.id)}

                claiming={claimMutation.isPending && claimMutation.variables === item.id}

                completing={completeMutation.isPending && completeMutation.variables === item.id}

              />

            </Pressable>

          )}

          contentContainerStyle={{ paddingBottom: contentBottomPad }}
          showsVerticalScrollIndicator={false}

        />

      )}



      {canManageTasks ? (

        <TaskAddFab onPress={() => openAddModal(null)} bottomOffset={fabBottom} />

      ) : null}



      <TaskAddModal

        visible={addModalOpen}

        title={title}

        recurrence={recurrence}

        addDayIndex={addDayIndex}

        estimatedDuration={estimatedDuration}

        error={error}

        loading={addMutation.isPending}

        onClose={closeAddModal}

        onTitleChange={setTitle}

        onRecurrenceChange={setRecurrence}

        onAddDayIndexChange={setAddDayIndex}

        onEstimatedDurationChange={setEstimatedDuration}

        onSubmit={() => addMutation.mutate()}

      />



      <TaskScheduleModal

        visible={selectedTask !== null}

        task={selectedTask}

        weekStart={weekStart}

        onWeekStartChange={setWeekStart}

        userId={userId}

        onClose={() => setSelectedTask(null)}

        onScheduleDay={(dayIndex) => {

          if (!selectedTask) return;

          scheduleMutation.mutate({ taskId: selectedTask.id, dayIndex });

        }}

        onClaim={() => selectedTask && claimMutation.mutate(selectedTask.id)}

        onComplete={() => selectedTask && completeMutation.mutate(selectedTask.id)}

        scheduling={scheduleMutation.isPending}

        claiming={claimMutation.isPending}

        completing={completeMutation.isPending}

      />

    </Screen>

  );

}



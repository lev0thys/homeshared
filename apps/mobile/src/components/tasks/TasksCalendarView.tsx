import { useCallback, useRef, useState } from 'react';

import { Pressable, ScrollView, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import { useTranslation } from 'react-i18next';

import { HorizontalSwipeRow } from '@/components/HorizontalSwipeRow';

import { TaskDraggableChip } from '@/components/tasks/TaskDraggableChip';

import { formatTaskDuration } from '@/lib/format-task-duration';

import { TASK_DAY_KEYS, type HouseholdTaskRow } from './types';



interface TasksCalendarViewProps {

  byDay: HouseholdTaskRow[][];

  unscheduled: HouseholdTaskRow[];

  highlightDayIndex: number | null;

  onTaskPress: (task: HouseholdTaskRow) => void;

  onDayPress?: (dayIndex: number) => void;

  onTaskMoveToDay?: (task: HouseholdTaskRow, dayIndex: number | null) => void;

}



type DropZone = {

  key: string;

  dayIndex: number | null;

  bounds: { x: number; y: number; width: number; height: number };

};



const COL_WIDTH = 108;

const GHOST_WIDTH = 100;

const DAY_HEADER_HEIGHT = 44;



export function TasksCalendarView({

  byDay,

  unscheduled,

  highlightDayIndex,

  onTaskPress,

  onDayPress,

  onTaskMoveToDay,

}: TasksCalendarViewProps) {

  const { t } = useTranslation();

  const canDrag = !!onTaskMoveToDay;



  const dropZonesRef = useRef<DropZone[]>([]);

  const zoneRefs = useRef<Record<string, View | null>>({});

  const [gridHeight, setGridHeight] = useState(0);

  const [dragGhost, setDragGhost] = useState<{

    task: HouseholdTaskRow;

    sourceDayIndex: number | null;

    x: number;

    y: number;

  } | null>(null);

  const [hoverDayIndex, setHoverDayIndex] = useState<number | null | undefined>(undefined);

  const dragGhostRef = useRef(dragGhost);

  dragGhostRef.current = dragGhost;

  const blockPressRef = useRef(false);



  const columnBodyHeight = Math.max(gridHeight - DAY_HEADER_HEIGHT, 160);



  const onGridLayout = useCallback((event: LayoutChangeEvent) => {

    const next = event.nativeEvent.layout.height;

    if (next > 0) setGridHeight(next);

  }, []);



  const tryDayPress = useCallback(

    (dayIndex: number) => {

      if (blockPressRef.current || dragGhostRef.current) return;

      onDayPress?.(dayIndex);

    },

    [onDayPress],

  );



  const setZoneRef = useCallback((key: string) => {

    return (node: View | null) => {

      zoneRefs.current[key] = node;

    };

  }, []);



  const measureZones = useCallback(() => {

    const entries = Object.entries(zoneRefs.current).filter((entry): entry is [string, View] => entry[1] != null);

    if (entries.length === 0) return;



    const next: DropZone[] = [];

    let completed = 0;



    entries.forEach(([key, node]) => {

      node.measureInWindow((x, y, width, height) => {

        const dayIndex = key === 'unscheduled' ? null : Number.parseInt(key.replace('day-', ''), 10);

        next.push({ key, dayIndex, bounds: { x, y, width, height } });

        completed += 1;

        if (completed === entries.length) {

          dropZonesRef.current = next;

        }

      });

    });

  }, []);



  const registerZoneLayout = useCallback(

    (_key: string) => (_event: LayoutChangeEvent) => {

      requestAnimationFrame(measureZones);

    },

    [measureZones],

  );



  const findDropZone = useCallback((x: number, y: number): DropZone | null => {

    for (const zone of dropZonesRef.current) {

      const b = zone.bounds;

      if (x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height) {

        return zone;

      }

    }

    return null;

  }, []);



  const handleDragStart = useCallback(

    (task: HouseholdTaskRow, sourceDayIndex: number | null, x: number, y: number) => {

      blockPressRef.current = true;

      measureZones();

      setDragGhost({ task, sourceDayIndex, x, y });

      setHoverDayIndex(sourceDayIndex);

    },

    [measureZones],

  );



  const handleDragMove = useCallback(

    (x: number, y: number) => {

      setDragGhost((prev) => (prev ? { ...prev, x, y } : null));

      const zone = findDropZone(x, y);

      setHoverDayIndex(zone?.dayIndex);

    },

    [findDropZone],

  );



  const handleDragEnd = useCallback(() => {

    const ghost = dragGhostRef.current;

    if (ghost && onTaskMoveToDay) {

      const zone = findDropZone(ghost.x, ghost.y);

      const targetDayIndex = zone?.dayIndex ?? undefined;

      if (targetDayIndex !== undefined && targetDayIndex !== ghost.sourceDayIndex) {

        onTaskMoveToDay(ghost.task, targetDayIndex);

      }

    }

    setDragGhost(null);

    setHoverDayIndex(undefined);

    setTimeout(() => {

      blockPressRef.current = false;

    }, 320);

  }, [findDropZone, onTaskMoveToDay]);



  const renderTaskCard = (

    task: HouseholdTaskRow,

    sourceDayIndex: number | null,

    compact = false,

  ) => {

    const card = (
      <View
        className={`bg-white rounded-lg border border-ink-100 ${
          compact ? 'p-2' : 'rounded-xl px-3 py-2 border-amber-100'
        }`}
      >

        <Text

          className={`font-semibold text-ink-900 ${compact ? 'text-[11px]' : 'text-sm'}`}

          numberOfLines={compact ? 3 : 2}

        >

          {task.title}

        </Text>

        {task.estimatedDurationMinutes ? (

          <Text className={`text-ink-500 mt-0.5 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>

            ⏱ {formatTaskDuration(task.estimatedDurationMinutes, t)}

          </Text>

        ) : null}

        {sourceDayIndex === null ? (

          <Text className="text-[10px] text-primary-700 mt-0.5">{t('tasks.tapToSchedule')}</Text>

        ) : task.claimedBy ? (

          <Text className="text-[9px] text-ink-500 mt-1" numberOfLines={1}>

            {task.claimedBy.displayName}

          </Text>

        ) : (

          <Text className="text-[9px] text-amber-700 mt-1">{t('tasks.open')}</Text>

        )}

      </View>

    );



    if (!canDrag) {

      return (

        <Pressable onPress={() => onTaskPress(task)} className="active:opacity-80">

          {card}

        </Pressable>

      );

    }



    return (

      <TaskDraggableChip

        task={task}

        sourceDayIndex={sourceDayIndex}

        onPress={() => onTaskPress(task)}

        onDragStart={handleDragStart}

        onDragMove={handleDragMove}

        onDragEnd={handleDragEnd}

      >

        {card}

      </TaskDraggableChip>

    );

  };



  const dropHighlight = (dayIndex: number | null) => {

    if (hoverDayIndex === undefined) return '';

    if (hoverDayIndex === dayIndex) return 'border-2 border-primary-500 bg-primary-100/50';

    return '';

  };



  return (

    <View className="flex-1">

      {(unscheduled.length > 0 || dragGhost) ? (
        <View
          ref={setZoneRef('unscheduled')}
          onLayout={registerZoneLayout('unscheduled')}
          className={`mb-3 rounded-2xl p-3 ${
            unscheduled.length > 0
              ? `bg-amber-50/80 border border-amber-100 ${dropHighlight(null)}`
              : `border border-dashed border-amber-200 bg-amber-50/40 min-h-[40px] justify-center ${dropHighlight(null)}`
          }`}
        >
          {unscheduled.length > 0 ? (
            <>
              <Text className="text-xs font-semibold text-amber-900 uppercase mb-2">
                {t('tasks.unscheduled')} ({unscheduled.length})
              </Text>
              <View className="gap-2">
                {unscheduled.map((task) => (
                  <View key={task.id}>{renderTaskCard(task, null)}</View>
                ))}
              </View>
            </>
          ) : (
            <Text className="text-xs font-semibold text-amber-900 uppercase text-center">
              {t('tasks.unscheduled')}
            </Text>
          )}
        </View>
      ) : null}



      <View className="flex-1 min-h-[200px]" onLayout={onGridLayout}>

        <HorizontalSwipeRow style={{ flex: 1 }} contentContainerStyle={{ minHeight: gridHeight || undefined }}>

          <View style={{ minHeight: gridHeight || columnBodyHeight + DAY_HEADER_HEIGHT }}>

            <View className="flex-row border-b border-ink-200 pb-2 mb-2" style={{ height: DAY_HEADER_HEIGHT }}>

              {TASK_DAY_KEYS.map((dayKey, dayIndex) => {

                const isToday = highlightDayIndex === dayIndex;

                return (

                  <Pressable

                    key={dayKey}

                    onPress={() => tryDayPress(dayIndex)}

                    disabled={!onDayPress || !!dragGhost}

                    style={{ width: COL_WIDTH }}

                    className="items-center px-1 active:opacity-70"

                    accessibilityRole={onDayPress ? 'button' : 'text'}

                    accessibilityLabel={t(`mealPlan.daysShort.${dayKey}`)}

                  >

                    <View className={`px-1.5 py-0.5 rounded-md ${isToday ? 'bg-primary-600' : ''}`}>

                      <Text className={`text-xs font-bold ${isToday ? 'text-white' : 'text-ink-800'}`}>

                        {t(`mealPlan.daysShort.${dayKey}`)}

                      </Text>

                    </View>

                    {isToday ? (

                      <Text className="text-[8px] text-primary-600 font-medium mt-0.5">

                        {t('mealPlan.today')}

                      </Text>

                    ) : null}

                    <Text className="text-[10px] text-ink-500 mt-0.5">

                      {(byDay[dayIndex] ?? []).length}

                    </Text>

                  </Pressable>

                );

              })}

            </View>



            <View className="flex-row items-stretch" style={{ minHeight: columnBodyHeight }}>

              {TASK_DAY_KEYS.map((dayKey, dayIndex) => {

                const isTodayCol = highlightDayIndex === dayIndex;

                const dayTasks = byDay[dayIndex] ?? [];



                return (

                  <View

                    key={dayKey}

                    ref={setZoneRef(`day-${dayIndex}`)}

                    onLayout={registerZoneLayout(`day-${dayIndex}`)}

                    style={{ width: COL_WIDTH, minHeight: columnBodyHeight }}

                    className={`mx-0.5 px-1 pb-2 rounded-xl ${dropHighlight(dayIndex)} ${

                      isTodayCol ? 'bg-primary-50/50 border border-primary-100' : 'bg-ink-50/50'

                    }`}

                  >

                    <ScrollView

                      nestedScrollEnabled

                      showsVerticalScrollIndicator={false}

                      contentContainerStyle={{ flexGrow: 1, minHeight: columnBodyHeight - 8 }}

                    >

                      {dayTasks.length === 0 ? (

                        <Pressable

                          onPress={() => tryDayPress(dayIndex)}

                          disabled={!onDayPress || !!dragGhost}

                          className="flex-1 min-h-[120px] items-center justify-center opacity-60"

                          style={{ minHeight: columnBodyHeight - 16 }}

                        >

                          <Text className="text-[10px] text-ink-400 text-center px-1">

                            {onDayPress ? t('tasks.addOnDay') : '—'}

                          </Text>

                        </Pressable>

                      ) : (

                        dayTasks.map((task) => (

                          <View key={task.id} className="mb-2">

                            {renderTaskCard(task, dayIndex, true)}

                          </View>

                        ))

                      )}

                    </ScrollView>

                  </View>

                );

              })}

            </View>

          </View>

        </HorizontalSwipeRow>

      </View>



      {dragGhost ? (

        <View pointerEvents="none" style={StyleSheet.absoluteFillObject} className="z-50">

          <View

            style={{

              position: 'absolute',

              left: dragGhost.x - GHOST_WIDTH / 2,

              top: dragGhost.y - 28,

              width: GHOST_WIDTH,

            }}

          >

            <View className="bg-white rounded-lg p-2 border-2 border-primary-400 shadow-lg">

              <Text className="text-[11px] font-semibold text-ink-900" numberOfLines={3}>

                {dragGhost.task.title}

              </Text>

            </View>

          </View>

        </View>

      ) : null}

    </View>

  );

}



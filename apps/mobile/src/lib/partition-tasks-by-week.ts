import { dateKeyFromIsoInstant, dayIndexInWeek } from '@/lib/week-dates';

export interface TaskWithDueDate {
  id: string;
  dueDate: string | null;
}

export interface TasksWeekPartition<T extends TaskWithDueDate> {
  byDay: T[][];
  unscheduled: T[];
}

/** Répartit les tâches par jour de la semaine (lundi = 0) ; sans date ou hors semaine → « à planifier ». */
export function partitionTasksByWeek<T extends TaskWithDueDate>(
  tasks: T[],
  mondayIso: string,
): TasksWeekPartition<T> {
  const byDay: T[][] = Array.from({ length: 7 }, () => [] as T[]);
  const unscheduled: T[] = [];

  for (const task of tasks) {
    if (!task.dueDate) {
      unscheduled.push(task);
      continue;
    }
    const dateKey = dateKeyFromIsoInstant(task.dueDate);
    const idx = dayIndexInWeek(dateKey, mondayIso);
    if (idx === null) {
      unscheduled.push(task);
    } else {
      byDay[idx]!.push(task);
    }
  }

  return { byDay, unscheduled };
}

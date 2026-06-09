export type TaskRecurrence = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type TaskStatus = 'OPEN' | 'CLAIMED' | 'DONE';

export interface HouseholdTaskRow {
  id: string;
  title: string;
  description: string | null;
  recurrence: TaskRecurrence;
  status: TaskStatus;
  dueDate: string | null;
  estimatedDurationMinutes: number | null;
  createdBy: { id: string; displayName: string };
  claimedBy: { id: string; displayName: string } | null;
}

export const TASK_DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

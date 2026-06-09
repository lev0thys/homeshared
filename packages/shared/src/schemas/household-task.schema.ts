import { z } from 'zod';

export const taskRecurrenceSchema = z.enum(['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY']);
export const taskStatusSchema = z.enum(['OPEN', 'CLAIMED', 'DONE']);

export const createHouseholdTaskSchema = z.object({
  groupId: z.string().uuid(),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().nullable(),
  recurrence: taskRecurrenceSchema.default('ONCE'),
  dueDate: z.string().datetime().optional().nullable(),
  estimatedDurationMinutes: z.number().int().min(1).max(480).optional().nullable(),
});

export const updateHouseholdTaskSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(500).optional().nullable(),
  recurrence: taskRecurrenceSchema.optional(),
  dueDate: z.string().datetime().optional().nullable(),
  estimatedDurationMinutes: z.number().int().min(1).max(480).optional().nullable(),
});

export type CreateHouseholdTaskInput = z.infer<typeof createHouseholdTaskSchema>;
export type UpdateHouseholdTaskInput = z.infer<typeof updateHouseholdTaskSchema>;

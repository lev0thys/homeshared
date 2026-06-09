import { z } from 'zod';
import { mealSlotSchema } from './meal-plan.schema.js';

export const mealPlanPermissionSchema = z.enum(['VIEW', 'EDIT_SLOT', 'EDIT_ALL']);

export const mealGrantSchema = z.object({
  membershipId: z.string().uuid(),
  permission: mealPlanPermissionSchema,
  dayOfWeek: z.coerce.number().int().min(0).max(6).nullable().optional(),
  mealSlot: mealSlotSchema.nullable().optional(),
});

export const mealRuleSchema = z.object({
  membershipId: z.string().uuid(),
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  mealSlot: mealSlotSchema.nullable().optional(),
  createReminder: z.boolean().optional(),
});

export const groupMealSettingsSchema = z.object({
  breakfastTime: z.string().regex(/^\d{2}:\d{2}$/),
  lunchTime: z.string().regex(/^\d{2}:\d{2}$/),
  dinnerTime: z.string().regex(/^\d{2}:\d{2}$/),
  syncTasksToList: z.boolean(),
  allowTaskProposals: z.boolean(),
  showBreakfast: z.boolean(),
  showLunch: z.boolean(),
  showDinner: z.boolean(),
  servingsFromMemberCount: z.boolean(),
  adultEaters: z.coerce.number().int().min(0).max(30),
  childEaters: z.coerce.number().int().min(0).max(20),
});

export const updateMealPlanWeekSettingsSchema = z.object({
  groupId: z.string().uuid(),
  showBreakfast: z.boolean().optional(),
  showLunch: z.boolean().optional(),
  showDinner: z.boolean().optional(),
  servingsFromMemberCount: z.boolean().optional(),
  adultEaters: z.coerce.number().int().min(0).max(30).optional(),
  childEaters: z.coerce.number().int().min(0).max(20).optional(),
});

export const updateMealPermissionsSchema = z.object({
  settings: groupMealSettingsSchema,
  grants: z.array(mealGrantSchema).max(100),
  rules: z.array(mealRuleSchema).max(100),
});

export type MealPlanPermission = z.infer<typeof mealPlanPermissionSchema>;
export type MealGrantInput = z.infer<typeof mealGrantSchema>;
export type MealRuleInput = z.infer<typeof mealRuleSchema>;
export type GroupMealSettingsInput = z.infer<typeof groupMealSettingsSchema>;
export type UpdateMealPermissionsInput = z.infer<typeof updateMealPermissionsSchema>;
export type UpdateMealPlanWeekSettingsInput = z.infer<typeof updateMealPlanWeekSettingsSchema>;

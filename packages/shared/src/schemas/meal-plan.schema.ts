import { z } from 'zod';

export const mealSlotSchema = z.enum(['BREAKFAST', 'LUNCH', 'DINNER']);

export const recipeCuisineSchema = z.enum([
  'FRENCH',
  'ITALIAN',
  'ASIAN',
  'INDIAN',
  'MEDITERRANEAN',
  'MEXICAN',
  'SEAFOOD',
  'MEAT',
  'VEGETARIAN',
  'SOUP',
  'SALAD',
  'DESSERT',
  'BREAKFAST',
  'OTHER',
]);

export const getMealPlanSchema = z.object({
  groupId: z.string().uuid(),
  weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const upsertMealPlanSchema = z.object({
  groupId: z.string().uuid(),
  weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  mealSlot: mealSlotSchema,
  recipeId: z.string().uuid().nullable(),
  servings: z.coerce.number().int().min(1).max(50).optional(),
});

export const mealPlanSuggestionsSchema = z.object({
  groupId: z.string().uuid(),
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  mealSlot: mealSlotSchema,
  weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const dismissProposalSchema = z.object({
  recipeIds: z.array(z.string().uuid()).min(1).max(20),
});

/** Ajoute les ingrédients manquants de la semaine (repas planifiés) à la liste de courses. */
export const addMealPlanWeekToShoppingSchema = z.object({
  groupId: z.string().uuid(),
  weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type AddMealPlanWeekToShoppingInput = z.infer<typeof addMealPlanWeekToShoppingSchema>;

export type MealSlot = z.infer<typeof mealSlotSchema>;
export type RecipeCuisine = z.infer<typeof recipeCuisineSchema>;
export type MealPlanSuggestionsInput = z.infer<typeof mealPlanSuggestionsSchema>;
export type UpsertMealPlanInput = z.infer<typeof upsertMealPlanSchema>;

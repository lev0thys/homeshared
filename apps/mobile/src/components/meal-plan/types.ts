export type MealSlot = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export interface PlanEntry {
  id: string;
  dayOfWeek: number;
  mealSlot: MealSlot;
  recipeId: string;
  canEdit: boolean;
  servings: number | null;
  cookedAt: string | null;
  fridgeScore: number;
  recipe: { id: string; title: string; cuisine: string };
}

export interface MealPlanWeekSettings {
  showBreakfast: boolean;
  showLunch: boolean;
  showDinner: boolean;
  servingsFromMemberCount: boolean;
  adultEaters: number;
  childEaters: number;
  memberCount: number;
  effectiveServings: number;
}

export interface MealPlanWeek {
  entries: PlanEntry[];
  slots: Array<{ dayOfWeek: number; mealSlot: MealSlot; canEdit: boolean }>;
  settings: MealPlanWeekSettings;
}

export interface SuggestionRecipe {
  id: string;
  title: string;
  cuisine: string;
  score?: number;
  isFavorite?: boolean;
}

export interface Suggestions {
  habits: SuggestionRecipe[];
  favorites: SuggestionRecipe[];
  proposals: SuggestionRecipe[];
  seasonal: SuggestionRecipe[];
  discovery: SuggestionRecipe[];
}

export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export function visibleSlotsFromSettings(s: MealPlanWeekSettings): MealSlot[] {
  const slots: MealSlot[] = [];
  if (s.showBreakfast) slots.push('BREAKFAST');
  if (s.showLunch) slots.push('LUNCH');
  if (s.showDinner) slots.push('DINNER');
  return slots.length > 0 ? slots : ['LUNCH', 'DINNER'];
}

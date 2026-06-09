import type { RecipeCuisine } from '@homeshared/shared';

/** Emoji par cuisine pour navigation tactile mobile. */
export const CUISINE_EMOJI: Record<string, string> = {
  FRENCH: '🇫🇷',
  ITALIAN: '🍝',
  ASIAN: '🥢',
  INDIAN: '🍛',
  MEDITERRANEAN: '🫒',
  MEXICAN: '🌮',
  SEAFOOD: '🐟',
  MEAT: '🥩',
  VEGETARIAN: '🥬',
  SOUP: '🍲',
  SALAD: '🥗',
  DESSERT: '🍰',
  BREAKFAST: '🥐',
  OTHER: '🍽️',
};

export type RecipeQuickFilter = 'ALL' | 'FAVORITES' | 'QUICK' | 'FRIDGE_READY';

export const RECIPE_QUICK_FILTERS: RecipeQuickFilter[] = ['ALL', 'FAVORITES', 'QUICK', 'FRIDGE_READY'];

/** Regroupe les cuisines pour une 1re ligne de filtres plus simple. */
export const RECIPE_SUPER_GROUPS: Array<{
  id: string;
  cuisines: RecipeCuisine[] | null;
}> = [
  { id: 'ALL', cuisines: null },
  { id: 'WORLD', cuisines: ['FRENCH', 'ITALIAN', 'ASIAN', 'INDIAN', 'MEDITERRANEAN', 'MEXICAN', 'MEAT'] },
  { id: 'LIGHT', cuisines: ['SALAD', 'SOUP', 'VEGETARIAN'] },
  { id: 'SWEET', cuisines: ['DESSERT', 'BREAKFAST'] },
  { id: 'SEA', cuisines: ['SEAFOOD'] },
];

export function cuisineMatchesSuperGroup(cuisine: string | undefined, superGroupId: string): boolean {
  if (superGroupId === 'ALL') return true;
  const group = RECIPE_SUPER_GROUPS.find((g) => g.id === superGroupId);
  if (!group?.cuisines) return true;
  return !!cuisine && group.cuisines.includes(cuisine as RecipeCuisine);
}

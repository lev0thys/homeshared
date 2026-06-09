export interface MatchedRecipe {
  recipeId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  maxFeasibleServings: number;
  matchedIngredients: number;
  missingIngredients: Array<{
    name: string;
    slug: string;
    quantity: number;
    availableQuantity: number;
    unit: string | null;
    optional: boolean;
    reason: 'missing' | 'insufficient';
  }>;
  score: number;
  cuisine?: string;
  isFavorite?: boolean;
}

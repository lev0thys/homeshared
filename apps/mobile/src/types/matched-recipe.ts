export interface MatchedRecipe {
  recipeId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  matchedIngredients: number;
  missingIngredients: Array<{ name: string; quantity: number; unit: string | null; optional: boolean }>;
  score: number;
}

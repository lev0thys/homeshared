import { z } from 'zod';

export const recipeIngredientInputSchema = z.object({
  ingredientSlug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug invalide'),
  quantity: z.number().positive(),
  unit: z.string().trim().max(20).optional().nullable(),
  optional: z.boolean().default(false),
  notes: z.string().trim().max(120).optional().nullable(),
});

export const createRecipeSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().nullable(),
  instructions: z.string().trim().min(1),
  prepMinutes: z.number().int().min(0).max(600).default(0),
  cookMinutes: z.number().int().min(0).max(600).default(0),
  servings: z.number().int().min(1).max(50).default(2),
  imageUrl: z.string().url().nullable().optional(),
  ingredients: z.array(recipeIngredientInputSchema).min(1),
});

/**
 * Critères de matching d'une recette par rapport au frigo d'un groupe.
 */
export const matchRecipesSchema = z.object({
  groupId: z.string().uuid(),
  missingMaxCount: z.number().int().min(0).max(20).default(2),
  includeOptionalMissing: z.boolean().default(false),
  /** Portions visées (scale les quantités requises vs `recipe.servings`). */
  targetServings: z.number().int().min(1).max(50).optional(),
  /** Filtre optionnel par cuisine. */
  cuisine: z
    .enum([
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
    ])
    .optional(),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type MatchRecipesInput = z.infer<typeof matchRecipesSchema>;
export type RecipeIngredientInput = z.infer<typeof recipeIngredientInputSchema>;

/** Ajoute les ingrédients manquants d'une recette à la liste de courses du groupe. */
export const addRecipeMissingToShoppingSchema = z.object({
  groupId: z.string().uuid(),
  targetServings: z.number().int().min(1).max(50).optional(),
});

export type AddRecipeMissingToShoppingInput = z.infer<typeof addRecipeMissingToShoppingSchema>;

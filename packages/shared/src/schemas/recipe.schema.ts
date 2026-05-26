import { z } from 'zod';

export const recipeIngredientInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  quantity: z.number().positive(),
  unit: z.string().trim().max(20).optional().nullable(),
  optional: z.boolean().default(false),
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
 * - missingMaxCount : nombre max d'ingrédients manquants tolérés
 * - includeOptionalMissing : si true, compte aussi les ingrédients optionnels manquants
 */
export const matchRecipesSchema = z.object({
  groupId: z.string().uuid(),
  missingMaxCount: z.number().int().min(0).max(20).default(2),
  includeOptionalMissing: z.boolean().default(false),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type MatchRecipesInput = z.infer<typeof matchRecipesSchema>;
export type RecipeIngredientInput = z.infer<typeof recipeIngredientInputSchema>;

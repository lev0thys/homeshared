import { z } from 'zod';

export const itemNameSchema = z
  .string()
  .trim()
  .min(1, 'Le nom est obligatoire.')
  .max(80, 'Le nom est trop long.');

export const quantitySchema = z
  .number()
  .positive('La quantité doit être positive.')
  .max(10000, 'Quantité trop élevée.');

export const unitSchema = z.string().trim().max(20).optional().nullable();

export const createShoppingItemSchema = z.object({
  groupId: z.string().uuid(),
  name: itemNameSchema,
  quantity: quantitySchema.default(1),
  unit: unitSchema,
  notes: z.string().trim().max(200).optional().nullable(),
});

export const updateShoppingItemSchema = z.object({
  name: itemNameSchema.optional(),
  quantity: quantitySchema.optional(),
  unit: unitSchema,
  notes: z.string().trim().max(200).optional().nullable(),
});

export const purchaseShoppingItemSchema = z.object({
  /**
   * Quantité réellement achetée (peut différer de la quantité demandée).
   * Si fournie, elle prévaut sur la quantité du shopping item lors de
   * l'incrément dans le frigo.
   */
  purchasedQuantity: quantitySchema.optional(),
});

export type CreateShoppingItemInput = z.infer<typeof createShoppingItemSchema>;
export type UpdateShoppingItemInput = z.infer<typeof updateShoppingItemSchema>;
export type PurchaseShoppingItemInput = z.infer<typeof purchaseShoppingItemSchema>;

import { z } from 'zod';
import { itemNameSchema, quantitySchema, unitSchema } from './shopping.schema.js';

export const createFridgeItemSchema = z.object({
  groupId: z.string().uuid(),
  name: itemNameSchema,
  quantity: quantitySchema.default(1),
  unit: unitSchema,
  expiresAt: z.string().datetime().nullable().optional(),
});

export const updateFridgeItemSchema = z.object({
  name: itemNameSchema.optional(),
  quantity: quantitySchema.optional(),
  unit: unitSchema,
  expiresAt: z.string().datetime().nullable().optional(),
});

export const consumeFridgeItemSchema = z.object({
  quantity: quantitySchema,
});

export type CreateFridgeItemInput = z.infer<typeof createFridgeItemSchema>;
export type UpdateFridgeItemInput = z.infer<typeof updateFridgeItemSchema>;
export type ConsumeFridgeItemInput = z.infer<typeof consumeFridgeItemSchema>;

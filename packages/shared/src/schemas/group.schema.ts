import { z } from 'zod';
import { avatarUrlSchema } from './avatar.schema.js';
import { DEFAULT_GROUP_FEATURES, groupFeaturesSchema } from '../group-features.js';

export const createGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Le nom du groupe ne peut pas être vide.')
    .max(60, 'Le nom du groupe ne doit pas dépasser 60 caractères.'),
  description: z.string().trim().max(280).optional().nullable(),
  imageUrl: avatarUrlSchema.nullable().optional(),
  features: groupFeaturesSchema.optional().default([...DEFAULT_GROUP_FEATURES]),
});

export const updateGroupSchema = createGroupSchema.partial();

export const createInviteSchema = z.object({
  groupId: z.string().uuid(),
  expiresInHours: z.number().int().min(1).max(24 * 30).default(24 * 7),
});

export const acceptInviteSchema = z.object({
  token: z.string().min(10),
});

export const updateMembershipSchema = z.object({
  isChild: z.boolean(),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;
export type CreateInviteInput = z.infer<typeof createInviteSchema>;
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;
export type UpdateMembershipInput = z.infer<typeof updateMembershipSchema>;

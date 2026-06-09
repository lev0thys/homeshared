import { z } from 'zod';
import { avatarUrlSchema } from './avatar.schema.js';

export const usernameSchema = z
  .string()
  .min(3, 'Le pseudo doit faire au moins 3 caractères.')
  .max(24, 'Le pseudo ne doit pas dépasser 24 caractères.')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Caractères autorisés : lettres, chiffres, _ et -');

export const displayNameSchema = z
  .string()
  .trim()
  .min(1, 'Le nom affiché ne peut pas être vide.')
  .max(40, 'Le nom affiché ne doit pas dépasser 40 caractères.');

export const signupSchema = z.object({
  email: z.string().email('Email invalide.'),
  password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères.'),
  username: usernameSchema,
  displayName: displayNameSchema,
  /** Compte enfant créé par un parent (UX simplifiée, actions limitées). */
  isChild: z.boolean().optional().default(false),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide.'),
  password: z.string().min(1, 'Mot de passe requis.'),
});

export const bioSchema = z
  .string()
  .trim()
  .max(280, 'La bio ne doit pas dépasser 280 caractères.');

export const updateProfileSchema = z.object({
  displayName: displayNameSchema.optional(),
  avatarUrl: avatarUrlSchema.nullable().optional(),
  bio: bioSchema.nullable().optional(),
  isChild: z.boolean().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

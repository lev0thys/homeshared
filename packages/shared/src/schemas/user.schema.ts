import { z } from 'zod';

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
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide.'),
  password: z.string().min(1, 'Mot de passe requis.'),
});

export const updateProfileSchema = z.object({
  displayName: displayNameSchema.optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

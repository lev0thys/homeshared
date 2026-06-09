import { z } from 'zod';

/** URL https, data-URI image (upload), ou preset emoji `emoji:🦊`. */
export const avatarUrlSchema = z
  .string()
  .max(200_000, 'Image trop volumineuse (max ~150 Ko).')
  .refine(
    (v) =>
      v.startsWith('https://') ||
      v.startsWith('http://') ||
      v.startsWith('data:image/') ||
      v.startsWith('emoji:'),
    { message: 'Format d\'avatar invalide.' },
  );

export type AvatarUrl = z.infer<typeof avatarUrlSchema>;

import { z } from 'zod';

/** Modules personnels (hors groupe) — hub accueil. */
export const PERSONAL_MODULE_VALUES = [
  'SEASON',
  'GARDEN',
  'STORES',
  'RECIPES_BROWSE',
] as const;

export type PersonalModule = (typeof PERSONAL_MODULE_VALUES)[number];

export const personalModuleSchema = z.enum(PERSONAL_MODULE_VALUES);

export interface PersonalModuleMeta {
  id: PersonalModule;
  route: string;
  icon: string;
  /** Clé i18n `modules.{id}` */
  labelKey: string;
  beta?: boolean;
}

export const PERSONAL_MODULES: PersonalModuleMeta[] = [
  { id: 'SEASON', route: '/(app)/tools/season', icon: '🍂', labelKey: 'SEASON' },
  { id: 'GARDEN', route: '/(app)/tools/garden', icon: '🌱', labelKey: 'GARDEN', beta: true },
  { id: 'STORES', route: '/(app)/tools/stores', icon: '🛒', labelKey: 'STORES', beta: true },
  { id: 'RECIPES_BROWSE', route: '/(app)/tools/recipes', icon: '📖', labelKey: 'RECIPES_BROWSE' },
];

/** Découpe les instructions recette en étapes (lignes numérotées ou paragraphes). */
export function parseRecipeSteps(instructions: string): string[] {
  return instructions
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^\d+[\.\)]\s*/, '').trim());
}

import { z } from 'zod';

/** Modules activables par groupe (onglets + API associées). */
export const GROUP_FEATURE_VALUES = ['SHOPPING', 'FRIDGE', 'RECIPES', 'TASKS', 'BARBECUE'] as const;

export type GroupFeature = (typeof GROUP_FEATURE_VALUES)[number];

export const groupFeatureSchema = z.enum(GROUP_FEATURE_VALUES);

export const groupFeaturesSchema = z
  .array(groupFeatureSchema)
  .min(1, 'Au moins une fonctionnalité doit rester active.');

/** Modules activés par défaut à la création d'un groupe. */
export const DEFAULT_GROUP_FEATURES: GroupFeature[] = ['SHOPPING', 'FRIDGE', 'RECIPES'];

export function resolveGroupFeatures(features: string[] | undefined): GroupFeature[] {
  if (!features || features.length === 0) return [...DEFAULT_GROUP_FEATURES];
  return features as GroupFeature[];
}

export function hasGroupFeature(features: string[] | undefined, feature: GroupFeature): boolean {
  return resolveGroupFeatures(features).includes(feature);
}

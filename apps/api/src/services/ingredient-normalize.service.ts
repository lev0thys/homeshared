import { convertQuantity } from '@homeshared/shared';

/**
 * Normalisation des noms d'ingrédients pour le matching frigo.
 * Retire accents, casse, espaces superflus.
 */
const LIGATURE_MAP: Record<string, string> = {
  œ: 'oe',
  Œ: 'oe',
  æ: 'ae',
  Æ: 'ae',
};

export function normalizeIngredientKey(value: string): string {
  let s = value.trim().toLowerCase();
  for (const [from, to] of Object.entries(LIGATURE_MAP)) {
    s = s.replaceAll(from, to);
  }
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ');
}

export interface IngredientMatchProfile {
  slug: string;
  nameFr: string;
  aliases: string[];
}

export function ingredientMatchKeys(profile: IngredientMatchProfile): string[] {
  const keys = new Set<string>([
    normalizeIngredientKey(profile.slug),
    normalizeIngredientKey(profile.nameFr),
    ...profile.aliases.map(normalizeIngredientKey),
  ]);
  return [...keys];
}

export interface FridgeStockEntry {
  quantity: number;
  unit: string | null;
}

export function fridgeItemMatchesProfile(itemName: string, profile: IngredientMatchProfile): boolean {
  const nameKey = normalizeIngredientKey(itemName);
  return ingredientMatchKeys(profile).includes(nameKey);
}

export function totalFridgeQuantityForIngredient(
  profile: IngredientMatchProfile,
  fridgeItems: Array<{ name: string; quantity: number; unit: string | null }>,
  targetUnit: string | null,
  defaultUnit: string | null,
): number {
  let total = 0;
  for (const item of fridgeItems) {
    if (!fridgeItemMatchesProfile(item.name, profile)) continue;
    const converted = convertQuantity(
      item.quantity,
      item.unit,
      targetUnit,
      defaultUnit,
      defaultUnit,
    );
    if (converted !== null) {
      total += converted;
      continue;
    }
    if (item.unit === null && targetUnit === null) {
      total += item.quantity;
    }
  }
  return Number(total.toFixed(2));
}

export function findFridgeStockForIngredient(
  profile: IngredientMatchProfile,
  fridgeIndex: Map<string, FridgeStockEntry>,
): FridgeStockEntry | undefined {
  for (const key of ingredientMatchKeys(profile)) {
    const entry = fridgeIndex.get(key);
    if (entry) return entry;
  }
  return undefined;
}

import type { IngredientCategory } from './types/index.js';

/**
 * Rayons type hypermarché français (parcours courant : frais → épicerie).
 * Ordre pensé pour enchaîner les articles sans revenir en arrière.
 */
export type StoreAisleId =
  | 'PRODUCE'
  | 'BAKERY'
  | 'MEAT'
  | 'FISH'
  | 'DAIRY'
  | 'DRY_GROCERY'
  | 'SAUCES_GROCERY'
  | 'SPICES'
  | 'OTHER';

export interface StoreAisleDefinition {
  id: StoreAisleId;
  /** Ordre de passage en magasin (1 = en premier). */
  sortOrder: number;
  emoji: string;
}

export const STORE_AISLES: StoreAisleDefinition[] = [
  { id: 'PRODUCE', sortOrder: 1, emoji: '🥬' },
  { id: 'BAKERY', sortOrder: 2, emoji: '🥖' },
  { id: 'MEAT', sortOrder: 3, emoji: '🥩' },
  { id: 'FISH', sortOrder: 4, emoji: '🐟' },
  { id: 'DAIRY', sortOrder: 5, emoji: '🥛' },
  { id: 'DRY_GROCERY', sortOrder: 6, emoji: '🌾' },
  { id: 'SAUCES_GROCERY', sortOrder: 7, emoji: '🫙' },
  { id: 'SPICES', sortOrder: 8, emoji: '🧂' },
  { id: 'OTHER', sortOrder: 9, emoji: '🛒' },
];

const AISLE_BY_ID = new Map(STORE_AISLES.map((a) => [a.id, a]));

/** Herbes fraîches souvent rangées avec les fruits & légumes, pas avec les épices sèches. */
const PRODUCE_HERB_SLUGS = new Set([
  'basilic',
  'persil',
  'coriandre-persil',
  'menthe',
  'gingembre',
  'ciboulette',
  'aneth',
  'romarin',
]);

const CATEGORY_TO_AISLE: Record<IngredientCategory, StoreAisleId> = {
  FRUIT: 'PRODUCE',
  VEGETABLE: 'PRODUCE',
  BAKERY: 'BAKERY',
  MEAT: 'MEAT',
  FISH: 'FISH',
  SEAFOOD: 'FISH',
  DAIRY: 'DAIRY',
  GRAIN: 'DRY_GROCERY',
  LEGUME: 'DRY_GROCERY',
  CONDIMENT: 'SAUCES_GROCERY',
  OIL: 'SAUCES_GROCERY',
  SPICE: 'SPICES',
  OTHER: 'OTHER',
};

/** Inférence légère sur le libellé quand l'article n'est pas dans le catalogue. */
const NAME_AISLE_RULES: Array<{ pattern: RegExp; aisle: StoreAisleId }> = [
  { pattern: /\b(pain|baguette|brioche|croissant|viennoiserie)\b/i, aisle: 'BAKERY' },
  {
    pattern:
      /\b(poulet|bœuf|boeuf|porc|agneau|veau|viande|jambon|lardon|saucisse|merguez|steak|escalope|hach[eé])\b/i,
    aisle: 'MEAT',
  },
  {
    pattern: /\b(saumon|thon|cabillaud|colin|poisson|crevette|moule|sardine|bar\b|daurade)\b/i,
    aisle: 'FISH',
  },
  {
    pattern: /\b(lait|beurre|cr[eè]me|yaourt|fromage|œuf|oeuf|emmental|mozzarella|parmesan|comt[eé])\b/i,
    aisle: 'DAIRY',
  },
  {
    pattern: /\b(p[aâ]te|riz|semoule|couscous|farine|lentille|pois chiche|haricot|flocon|quinoa)\b/i,
    aisle: 'DRY_GROCERY',
  },
  {
    pattern: /\b(huile|vinaigre|sauce|moutarde|ketchup|mayonnaise|conserve|bouillon|pesto|soja)\b/i,
    aisle: 'SAUCES_GROCERY',
  },
  {
    pattern: /\b(sel|poivre|curry|paprika|cumin|cannelle|[eé]pice|vanille)\b/i,
    aisle: 'SPICES',
  },
  {
    pattern:
      /\b(tomate|carotte|oignon|salade|pomme de terre|courgette|poivron|champignon|aubergine|citron|pomme\b|banane|orange|fraise)\b/i,
    aisle: 'PRODUCE',
  },
];

export function getStoreAisleDefinition(aisleId: StoreAisleId): StoreAisleDefinition {
  return AISLE_BY_ID.get(aisleId) ?? AISLE_BY_ID.get('OTHER')!;
}

export function getStoreAisleSortOrder(aisleId: StoreAisleId): number {
  return getStoreAisleDefinition(aisleId).sortOrder;
}

export function ingredientCategoryToAisle(
  category: IngredientCategory,
  slug?: string | null,
): StoreAisleId {
  if (slug && PRODUCE_HERB_SLUGS.has(slug)) {
    return 'PRODUCE';
  }
  return CATEGORY_TO_AISLE[category] ?? 'OTHER';
}

function normalizeNameKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/œ/g, 'oe')
    .replace(/\s+/g, ' ');
}

/** Détermine le rayon magasin pour un article de liste de courses. */
export function resolveShoppingAisle(input: {
  name: string;
  category?: IngredientCategory | null;
  slug?: string | null;
}): StoreAisleId {
  if (input.category) {
    return ingredientCategoryToAisle(input.category, input.slug);
  }

  const key = normalizeNameKey(input.name);
  for (const rule of NAME_AISLE_RULES) {
    if (rule.pattern.test(key)) {
      return rule.aisle;
    }
  }

  return 'OTHER';
}

export interface ShoppingAisleGroup<T> {
  aisleId: StoreAisleId;
  sortOrder: number;
  emoji: string;
  items: T[];
}

/** Regroupe et trie des articles par rayon (parcours magasin). */
export function groupItemsByStoreAisle<T extends { aisle: StoreAisleId }>(
  items: T[],
): ShoppingAisleGroup<T>[] {
  const byAisle = new Map<StoreAisleId, T[]>();

  for (const item of items) {
    const list = byAisle.get(item.aisle) ?? [];
    list.push(item);
    byAisle.set(item.aisle, list);
  }

  return [...byAisle.entries()]
    .map(([aisleId, aisleItems]) => {
      const def = getStoreAisleDefinition(aisleId);
      return {
        aisleId,
        sortOrder: def.sortOrder,
        emoji: def.emoji,
        items: aisleItems,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

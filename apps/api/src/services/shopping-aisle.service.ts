import type { IngredientCategory, PrismaClient } from '@prisma/client';
import { resolveShoppingAisle, type StoreAisleId } from '@homeshared/shared';
import { fridgeItemMatchesProfile } from './ingredient-normalize.service.js';

type CatalogRow = {
  slug: string;
  nameFr: string;
  aliases: string[];
  category: IngredientCategory;
};

function matchCatalogRow(name: string, catalog: CatalogRow[]): CatalogRow | null {
  for (const row of catalog) {
    const profile = { slug: row.slug, nameFr: row.nameFr, aliases: row.aliases };
    if (fridgeItemMatchesProfile(name, profile)) return row;
  }
  return null;
}

export interface EnrichedShoppingItem {
  aisle: StoreAisleId;
  ingredientCategory: IngredientCategory | null;
}

export async function enrichShoppingItemsWithAisles<
  T extends { name: string },
>(prisma: PrismaClient, items: T[]): Promise<Array<T & EnrichedShoppingItem>> {
  if (items.length === 0) return [];

  const catalog = await prisma.ingredient.findMany({
    select: { slug: true, nameFr: true, aliases: true, category: true },
  });

  return items.map((item) => {
    const match = matchCatalogRow(item.name, catalog);
    const aisle = resolveShoppingAisle({
      name: item.name,
      category: match?.category ?? null,
      slug: match?.slug ?? null,
    });
    return {
      ...item,
      aisle,
      ingredientCategory: match?.category ?? null,
    };
  });
}

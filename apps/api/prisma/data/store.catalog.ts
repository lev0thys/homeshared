/**
 * Catalogue magasins (prototype) — prix indicatifs pour comparaison.
 * Pas d'API officielle Leclerc/Auchan/Carrefour : données mock + recherche par slug ingrédient.
 * À remplacer par Open Food Facts / scrape légal / partenariat en v2.
 */
export const STORE_CHAINS = ['leclerc', 'auchan', 'carrefour'] as const;
export type StoreChain = (typeof STORE_CHAINS)[number];

export interface StoreProductEntry {
  store: StoreChain;
  ingredientSlug: string;
  label: string;
  priceEur: number;
  unit: string;
  /** Lien recherche site magasin (pas panier direct). */
  searchUrl: string;
}

export const STORE_PRODUCTS: StoreProductEntry[] = [
  { store: 'leclerc', ingredientSlug: 'pomme-de-terre', label: 'Pommes de terre consommation 2,5 kg', priceEur: 2.49, unit: 'kg', searchUrl: 'https://www.leclercdrive.fr/magasin-013901-Reims-Hypermache/recherche.aspx?Recherche=pomme+de+terre' },
  { store: 'auchan', ingredientSlug: 'pomme-de-terre', label: 'Pommes de terre Agata 2 kg', priceEur: 2.79, unit: 'kg', searchUrl: 'https://www.auchan.fr/recherche?text=pomme+de+terre' },
  { store: 'carrefour', ingredientSlug: 'pomme-de-terre', label: 'Pommes de terre 2 kg', priceEur: 2.59, unit: 'kg', searchUrl: 'https://www.carrefour.fr/s?q=pomme+de+terre' },
  { store: 'leclerc', ingredientSlug: 'poulet', label: 'Filet de poulet 2x125 g', priceEur: 4.89, unit: '250g', searchUrl: 'https://www.leclercdrive.fr/recherche.aspx?Recherche=filet+poulet' },
  { store: 'auchan', ingredientSlug: 'poulet', label: 'Escalope poulet 2x140 g', priceEur: 5.20, unit: '280g', searchUrl: 'https://www.auchan.fr/recherche?text=poulet' },
  { store: 'carrefour', ingredientSlug: 'poulet', label: 'Blanc poulet 2x130 g', priceEur: 4.95, unit: '260g', searchUrl: 'https://www.carrefour.fr/s?q=poulet' },
  { store: 'leclerc', ingredientSlug: 'pates', label: 'Pâtes penne 500 g', priceEur: 0.89, unit: '500g', searchUrl: 'https://www.leclercdrive.fr/recherche.aspx?Recherche=pates' },
  { store: 'auchan', ingredientSlug: 'pates', label: 'Pâtes spaghetti 500 g', priceEur: 0.95, unit: '500g', searchUrl: 'https://www.auchan.fr/recherche?text=pates' },
  { store: 'carrefour', ingredientSlug: 'pates', label: 'Pâtes fusilli 500 g', priceEur: 0.92, unit: '500g', searchUrl: 'https://www.carrefour.fr/s?q=pates' },
  { store: 'leclerc', ingredientSlug: 'oeuf', label: 'Œufs x12 plein air', priceEur: 3.29, unit: '12', searchUrl: 'https://www.leclercdrive.fr/recherche.aspx?Recherche=oeufs' },
  { store: 'auchan', ingredientSlug: 'oeuf', label: 'Œufs x12 label rouge', priceEur: 3.49, unit: '12', searchUrl: 'https://www.auchan.fr/recherche?text=oeufs' },
  { store: 'carrefour', ingredientSlug: 'oeuf', label: 'Œufs x12', priceEur: 3.35, unit: '12', searchUrl: 'https://www.carrefour.fr/s?q=oeufs' },
  { store: 'leclerc', ingredientSlug: 'lait', label: 'Lait UHT 1 L', priceEur: 1.05, unit: 'L', searchUrl: 'https://www.leclercdrive.fr/recherche.aspx?Recherche=lait' },
  { store: 'auchan', ingredientSlug: 'lait', label: 'Lait demi-écrémé 1 L', priceEur: 1.09, unit: 'L', searchUrl: 'https://www.auchan.fr/recherche?text=lait' },
  { store: 'carrefour', ingredientSlug: 'lait', label: 'Lait 1 L', priceEur: 1.07, unit: 'L', searchUrl: 'https://www.carrefour.fr/s?q=lait' },
  { store: 'leclerc', ingredientSlug: 'carotte', label: 'Carottes 1 kg', priceEur: 1.29, unit: 'kg', searchUrl: 'https://www.leclercdrive.fr/recherche.aspx?Recherche=carotte' },
  { store: 'auchan', ingredientSlug: 'carotte', label: 'Carottes 1 kg', priceEur: 1.35, unit: 'kg', searchUrl: 'https://www.auchan.fr/recherche?text=carotte' },
  { store: 'carrefour', ingredientSlug: 'carotte', label: 'Carottes 1 kg', priceEur: 1.32, unit: 'kg', searchUrl: 'https://www.carrefour.fr/s?q=carotte' },
  { store: 'leclerc', ingredientSlug: 'tomate', label: 'Tomates grappe 1 kg', priceEur: 2.99, unit: 'kg', searchUrl: 'https://www.leclercdrive.fr/recherche.aspx?Recherche=tomate' },
  { store: 'auchan', ingredientSlug: 'tomate', label: 'Tomates 1 kg', priceEur: 3.10, unit: 'kg', searchUrl: 'https://www.auchan.fr/recherche?text=tomate' },
  { store: 'carrefour', ingredientSlug: 'tomate', label: 'Tomates rondes 1 kg', priceEur: 3.05, unit: 'kg', searchUrl: 'https://www.carrefour.fr/s?q=tomate' },
  { store: 'leclerc', ingredientSlug: 'beurre', label: 'Beurre doux 250 g', priceEur: 2.15, unit: '250g', searchUrl: 'https://www.leclercdrive.fr/recherche.aspx?Recherche=beurre' },
  { store: 'auchan', ingredientSlug: 'beurre', label: 'Beurre 250 g', priceEur: 2.25, unit: '250g', searchUrl: 'https://www.auchan.fr/recherche?text=beurre' },
  { store: 'carrefour', ingredientSlug: 'beurre', label: 'Beurre demi-sel 250 g', priceEur: 2.19, unit: '250g', searchUrl: 'https://www.carrefour.fr/s?q=beurre' },
  { store: 'leclerc', ingredientSlug: 'riz', label: 'Riz long 1 kg', priceEur: 1.89, unit: 'kg', searchUrl: 'https://www.leclercdrive.fr/recherche.aspx?Recherche=riz' },
  { store: 'auchan', ingredientSlug: 'riz', label: 'Riz basmati 1 kg', priceEur: 2.05, unit: 'kg', searchUrl: 'https://www.auchan.fr/recherche?text=riz' },
  { store: 'carrefour', ingredientSlug: 'riz', label: 'Riz 1 kg', priceEur: 1.95, unit: 'kg', searchUrl: 'https://www.carrefour.fr/s?q=riz' },
];

/** Trouve des produits magasin pour un nom d'article (fuzzy via slug ingrédient). */
export function findStoreProductsForName(name: string, limit = 6): StoreProductEntry[] {
  const key = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, '-');
  const hits = STORE_PRODUCTS.filter(
    (p) => p.ingredientSlug.includes(key) || key.includes(p.ingredientSlug.replace(/-/g, '')),
  );
  if (hits.length > 0) return hits.slice(0, limit);
  return STORE_PRODUCTS.filter((p) => p.label.toLowerCase().includes(name.toLowerCase().slice(0, 4))).slice(0, limit);
}

export interface StoreCompareLine {
  itemName: string;
  bestStore: StoreChain;
  bestPriceEur: number;
  offers: StoreProductEntry[];
}

export function compareShoppingList(items: string[]): {
  lines: StoreCompareLine[];
  totals: Record<StoreChain, number>;
  cheapestStore: StoreChain;
} {
  const totals: Record<StoreChain, number> = { leclerc: 0, auchan: 0, carrefour: 0 };
  const lines: StoreCompareLine[] = [];

  for (const itemName of items) {
    const offers = findStoreProductsForName(itemName, 3);
    if (offers.length === 0) continue;
    const best = offers.reduce((a, b) => (a.priceEur <= b.priceEur ? a : b));
    lines.push({ itemName, bestStore: best.store, bestPriceEur: best.priceEur, offers });
    for (const chain of STORE_CHAINS) {
      const o = offers.find((x) => x.store === chain);
      totals[chain] += o?.priceEur ?? best.priceEur * 1.15;
    }
  }

  const cheapestStore = STORE_CHAINS.reduce((a, b) => (totals[a] <= totals[b] ? a : b));
  return { lines, totals, cheapestStore };
}

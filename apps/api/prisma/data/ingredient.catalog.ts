/**
 * Catalogue d'ingrédients canoniques (FR prioritaire).
 * `aliases` : variantes pour le matching frigo (sans accents, pluriels courants).
 */
import { INGREDIENT_CATALOG_EXTRA } from './ingredient.catalog.extra.js';

export type IngredientCategory =
  | 'VEGETABLE'
  | 'FRUIT'
  | 'DAIRY'
  | 'MEAT'
  | 'FISH'
  | 'SEAFOOD'
  | 'GRAIN'
  | 'LEGUME'
  | 'CONDIMENT'
  | 'SPICE'
  | 'OIL'
  | 'BAKERY'
  | 'OTHER';

export interface IngredientCatalogEntry {
  slug: string;
  nameFr: string;
  nameEn?: string;
  category: IngredientCategory;
  defaultUnit: string | null;
  aliases: string[];
}

export const INGREDIENT_CATALOG: IngredientCatalogEntry[] = [
  { slug: 'pates', nameFr: 'Pâtes', nameEn: 'Pasta', category: 'GRAIN', defaultUnit: 'g', aliases: ['pate', 'spaghetti', 'penne', 'nouilles'] },
  { slug: 'riz', nameFr: 'Riz', nameEn: 'Rice', category: 'GRAIN', defaultUnit: 'g', aliases: ['riz blanc', 'riz basmati'] },
  { slug: 'pain', nameFr: 'Pain', nameEn: 'Bread', category: 'BAKERY', defaultUnit: null, aliases: ['baguette', 'toast'] },
  { slug: 'pomme-de-terre', nameFr: 'Pomme de terre', nameEn: 'Potato', category: 'VEGETABLE', defaultUnit: null, aliases: ['pommes de terre', 'patate', 'patates'] },
  { slug: 'oignon', nameFr: 'Oignon', nameEn: 'Onion', category: 'VEGETABLE', defaultUnit: null, aliases: ['oignons'] },
  { slug: 'ail', nameFr: 'Ail', nameEn: 'Garlic', category: 'VEGETABLE', defaultUnit: 'gousse', aliases: ['gousse d\'ail', 'gousses d\'ail'] },
  { slug: 'carotte', nameFr: 'Carotte', nameEn: 'Carrot', category: 'VEGETABLE', defaultUnit: null, aliases: ['carottes'] },
  { slug: 'courgette', nameFr: 'Courgette', nameEn: 'Zucchini', category: 'VEGETABLE', defaultUnit: null, aliases: ['courgettes'] },
  { slug: 'tomate', nameFr: 'Tomate', nameEn: 'Tomato', category: 'VEGETABLE', defaultUnit: null, aliases: ['tomates', 'tomate cerise'] },
  { slug: 'poivron', nameFr: 'Poivron', nameEn: 'Bell pepper', category: 'VEGETABLE', defaultUnit: null, aliases: ['poivrons', 'poivron rouge'] },
  { slug: 'champignon', nameFr: 'Champignon', nameEn: 'Mushroom', category: 'VEGETABLE', defaultUnit: 'g', aliases: ['champignons', 'champignons de paris'] },
  { slug: 'salade', nameFr: 'Salade', nameEn: 'Lettuce', category: 'VEGETABLE', defaultUnit: null, aliases: ['laitue', 'mesclun', 'roquette'] },
  { slug: 'basilic', nameFr: 'Basilic', nameEn: 'Basil', category: 'SPICE', defaultUnit: 'feuilles', aliases: ['basilic frais'] },
  { slug: 'persil', nameFr: 'Persil', nameEn: 'Parsley', category: 'SPICE', defaultUnit: null, aliases: ['persil plat', 'persil frise'] },
  { slug: 'oeuf', nameFr: 'Œuf', nameEn: 'Egg', category: 'DAIRY', defaultUnit: null, aliases: ['oeufs', 'œufs', 'oeuf bio'] },
  { slug: 'lait', nameFr: 'Lait', nameEn: 'Milk', category: 'DAIRY', defaultUnit: 'L', aliases: ['lait entier', 'lait demi-ecreme'] },
  { slug: 'beurre', nameFr: 'Beurre', nameEn: 'Butter', category: 'DAIRY', defaultUnit: 'g', aliases: ['beurre doux', 'beurre sale'] },
  { slug: 'creme-fraiche', nameFr: 'Crème fraîche', nameEn: 'Heavy cream', category: 'DAIRY', defaultUnit: 'ml', aliases: ['creme', 'crème', 'creme liquide'] },
  { slug: 'parmesan', nameFr: 'Parmesan', nameEn: 'Parmesan', category: 'DAIRY', defaultUnit: 'g', aliases: ['parmigiano', 'fromage rape'] },
  { slug: 'mozzarella', nameFr: 'Mozzarella', nameEn: 'Mozzarella', category: 'DAIRY', defaultUnit: 'g', aliases: ['mozza', 'boule de mozzarella'] },
  { slug: 'emmental', nameFr: 'Emmental', nameEn: 'Emmental', category: 'DAIRY', defaultUnit: 'g', aliases: ['emmental rape', 'gruyere'] },
  { slug: 'yaourt', nameFr: 'Yaourt', nameEn: 'Yogurt', category: 'DAIRY', defaultUnit: null, aliases: ['yaourt nature', 'yaourts'] },
  { slug: 'poulet', nameFr: 'Poulet', nameEn: 'Chicken', category: 'MEAT', defaultUnit: 'g', aliases: ['blanc de poulet', 'escalope de poulet', 'filet de poulet'] },
  { slug: 'boeuf', nameFr: 'Bœuf', nameEn: 'Beef', category: 'MEAT', defaultUnit: 'g', aliases: ['boeuf', 'steak', 'viande hachee', 'viande hachée'] },
  { slug: 'lardons', nameFr: 'Lardons', nameEn: 'Bacon bits', category: 'MEAT', defaultUnit: 'g', aliases: ['lardon', 'bacon'] },
  { slug: 'jambon', nameFr: 'Jambon', nameEn: 'Ham', category: 'MEAT', defaultUnit: 'g', aliases: ['jambon blanc', 'jambon de paris'] },
  { slug: 'saumon', nameFr: 'Saumon', nameEn: 'Salmon', category: 'FISH', defaultUnit: 'g', aliases: ['filet de saumon', 'pave de saumon'] },
  { slug: 'thon', nameFr: 'Thon', nameEn: 'Tuna', category: 'FISH', defaultUnit: 'g', aliases: ['thon en boite', 'thon naturel'] },
  { slug: 'crevettes', nameFr: 'Crevettes', nameEn: 'Shrimp', category: 'SEAFOOD', defaultUnit: 'g', aliases: ['crevette', 'gambas'] },
  { slug: 'haricot-vert', nameFr: 'Haricot vert', nameEn: 'Green beans', category: 'LEGUME', defaultUnit: 'g', aliases: ['haricots verts'] },
  { slug: 'lentilles', nameFr: 'Lentilles', nameEn: 'Lentils', category: 'LEGUME', defaultUnit: 'g', aliases: ['lentille', 'lentilles vertes'] },
  { slug: 'pois-chiches', nameFr: 'Pois chiches', nameEn: 'Chickpeas', category: 'LEGUME', defaultUnit: 'g', aliases: ['pois chiche', 'chickpea'] },
  { slug: 'pesto', nameFr: 'Pesto', nameEn: 'Pesto', category: 'CONDIMENT', defaultUnit: 'càs', aliases: ['pesto vert', 'sauce pesto'] },
  { slug: 'sauce-tomate', nameFr: 'Sauce tomate', nameEn: 'Tomato sauce', category: 'CONDIMENT', defaultUnit: 'g', aliases: ['coulis de tomate', 'passata', 'concentre de tomate'] },
  { slug: 'huile-olive', nameFr: "Huile d'olive", nameEn: 'Olive oil', category: 'OIL', defaultUnit: 'càs', aliases: ['huile dolive', 'huile'] },
  { slug: 'huile-tournesol', nameFr: 'Huile de tournesol', nameEn: 'Sunflower oil', category: 'OIL', defaultUnit: 'càs', aliases: ['huile vegetale'] },
  { slug: 'vinaigre', nameFr: 'Vinaigre', nameEn: 'Vinegar', category: 'CONDIMENT', defaultUnit: 'càs', aliases: ['vinaigre balsamique', 'vinaigre de vin'] },
  { slug: 'moutarde', nameFr: 'Moutarde', nameEn: 'Mustard', category: 'CONDIMENT', defaultUnit: 'càs', aliases: ['moutarde de dijon'] },
  { slug: 'sel', nameFr: 'Sel', nameEn: 'Salt', category: 'SPICE', defaultUnit: 'pincée', aliases: ['fleur de sel', 'gros sel'] },
  { slug: 'poivre', nameFr: 'Poivre', nameEn: 'Pepper', category: 'SPICE', defaultUnit: 'pincée', aliases: ['poivre noir', 'poivre moulu'] },
  { slug: 'curry', nameFr: 'Curry', nameEn: 'Curry', category: 'SPICE', defaultUnit: 'càc', aliases: ['poudre de curry', 'curry en poudre'] },
  { slug: 'paprika', nameFr: 'Paprika', nameEn: 'Paprika', category: 'SPICE', defaultUnit: 'càc', aliases: ['paprika doux'] },
  { slug: 'cumin', nameFr: 'Cumin', nameEn: 'Cumin', category: 'SPICE', defaultUnit: 'càc', aliases: ['cumin moulu'] },
  { slug: 'citron', nameFr: 'Citron', nameEn: 'Lemon', category: 'FRUIT', defaultUnit: null, aliases: ['citrons', 'jus de citron'] },
  { slug: 'pomme', nameFr: 'Pomme', nameEn: 'Apple', category: 'FRUIT', defaultUnit: null, aliases: ['pommes'] },
  { slug: 'banane', nameFr: 'Banane', nameEn: 'Banana', category: 'FRUIT', defaultUnit: null, aliases: ['bananes'] },
  { slug: 'sucre', nameFr: 'Sucre', nameEn: 'Sugar', category: 'OTHER', defaultUnit: 'g', aliases: ['sucre en poudre', 'cassonade'] },
  { slug: 'farine', nameFr: 'Farine', nameEn: 'Flour', category: 'GRAIN', defaultUnit: 'g', aliases: ['farine de ble', 'farine t55'] },
  { slug: 'chocolat', nameFr: 'Chocolat', nameEn: 'Chocolate', category: 'OTHER', defaultUnit: 'g', aliases: ['chocolat noir', 'cacao'] },
];

/** Catalogue complet (base + extensions recettes). */
export const ALL_INGREDIENT_CATALOG: IngredientCatalogEntry[] = [
  ...INGREDIENT_CATALOG,
  ...INGREDIENT_CATALOG_EXTRA,
];

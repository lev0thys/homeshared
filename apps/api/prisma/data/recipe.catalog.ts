/**
 * Recettes de démarrage — lignes référencées par slug d'ingrédient canonique.
 */
import { RECIPE_CATALOG_BULK } from './recipe.catalog.bulk.js';

export interface RecipeCatalogLine {
  ingredientSlug: string;
  quantity: number;
  unit?: string | null;
  optional?: boolean;
  notes?: string;
}

export interface RecipeCatalogEntry {
  slug: string;
  title: string;
  description: string;
  instructions: string;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  lines: RecipeCatalogLine[];
}

export const RECIPE_CATALOG_CORE: RecipeCatalogEntry[] = [
  {
    slug: 'pates-pesto',
    title: 'Pâtes au pesto',
    description: 'Un grand classique rapide.',
    instructions:
      '1. Faire cuire les pâtes al dente.\n2. Mélanger avec le pesto et un filet d\'huile.\n3. Servir avec du parmesan râpé.',
    prepMinutes: 5,
    cookMinutes: 10,
    servings: 2,
    lines: [
      { ingredientSlug: 'pates', quantity: 200, unit: 'g' },
      { ingredientSlug: 'pesto', quantity: 4, unit: 'càs' },
      { ingredientSlug: 'parmesan', quantity: 30, unit: 'g', optional: true },
      { ingredientSlug: 'huile-olive', quantity: 1, unit: 'càs', optional: true },
    ],
  },
  {
    slug: 'omelette-nature',
    title: 'Omelette nature',
    description: 'Simple et efficace pour vider le frigo.',
    instructions:
      '1. Battre les œufs avec sel et poivre.\n2. Cuire dans une poêle beurrée à feu moyen.\n3. Plier et servir.',
    prepMinutes: 3,
    cookMinutes: 5,
    servings: 1,
    lines: [
      { ingredientSlug: 'oeuf', quantity: 3 },
      { ingredientSlug: 'beurre', quantity: 10, unit: 'g' },
      { ingredientSlug: 'sel', quantity: 1, unit: 'pincée', optional: true },
      { ingredientSlug: 'poivre', quantity: 1, unit: 'pincée', optional: true },
    ],
  },
  {
    slug: 'salade-tomate-mozza',
    title: 'Salade tomate-mozzarella',
    description: 'Fraîcheur estivale en 10 minutes.',
    instructions:
      '1. Trancher tomates et mozzarella.\n2. Disposer, arroser d\'huile et de vinaigre.\n3. Ajouter basilic et sel.',
    prepMinutes: 8,
    cookMinutes: 0,
    servings: 2,
    lines: [
      { ingredientSlug: 'tomate', quantity: 3 },
      { ingredientSlug: 'mozzarella', quantity: 125, unit: 'g' },
      { ingredientSlug: 'basilic', quantity: 8, unit: 'feuilles', optional: true },
      { ingredientSlug: 'huile-olive', quantity: 2, unit: 'càs' },
      { ingredientSlug: 'vinaigre', quantity: 1, unit: 'càs', optional: true },
    ],
  },
  {
    slug: 'riz-poulet-curry',
    title: 'Riz poulet curry',
    description: 'Plat réconfortant, parfait pour un soir de semaine.',
    instructions:
      '1. Faire revenir le poulet avec oignon et curry.\n2. Ajouter riz et eau (ratio 1:2), cuire 18 min.\n3. Vérifier 74 °C à cœur (cuisse) avant de servir.',
    prepMinutes: 10,
    cookMinutes: 25,
    servings: 4,
    lines: [
      { ingredientSlug: 'poulet', quantity: 400, unit: 'g' },
      { ingredientSlug: 'riz', quantity: 280, unit: 'g' },
      { ingredientSlug: 'oignon', quantity: 1 },
      { ingredientSlug: 'curry', quantity: 2, unit: 'càc' },
      { ingredientSlug: 'huile-tournesol', quantity: 1, unit: 'càs' },
      { ingredientSlug: 'sel', quantity: 1, unit: 'pincée', optional: true },
    ],
  },
  {
    slug: 'pates-carbonara',
    title: 'Pâtes carbonara',
    description: 'Crémeux sans crème (version classique).',
    instructions:
      '1. Cuire les pâtes.\n2. Mélanger œufs, parmesan, poivre.\n3. Incorporer pâtes hors du feu avec lardons.',
    prepMinutes: 10,
    cookMinutes: 12,
    servings: 3,
    lines: [
      { ingredientSlug: 'pates', quantity: 300, unit: 'g' },
      { ingredientSlug: 'lardons', quantity: 150, unit: 'g' },
      { ingredientSlug: 'oeuf', quantity: 3 },
      { ingredientSlug: 'parmesan', quantity: 50, unit: 'g' },
      { ingredientSlug: 'poivre', quantity: 1, unit: 'pincée' },
    ],
  },
  {
    slug: 'gratin-dauphinois',
    title: 'Gratin dauphinois',
    description: 'Pommes de terre fondantes au four.',
    instructions:
      '1. Trancher les pommes de terre.\n2. Disposer en couches avec crème, ail, sel.\n3. Enfourner 45 min à 180 °C.',
    prepMinutes: 15,
    cookMinutes: 45,
    servings: 4,
    lines: [
      { ingredientSlug: 'pomme-de-terre', quantity: 1, unit: 'kg' },
      { ingredientSlug: 'creme-fraiche', quantity: 250, unit: 'ml' },
      { ingredientSlug: 'ail', quantity: 2, unit: 'gousse' },
      { ingredientSlug: 'sel', quantity: 1, unit: 'pincée' },
      { ingredientSlug: 'poivre', quantity: 1, unit: 'pincée', optional: true },
    ],
  },
  {
    slug: 'soupe-lentilles',
    title: 'Soupe de lentilles',
    description: 'Économique et nourrissante.',
    instructions:
      '1. Faire revenir oignon et carotte.\n2. Ajouter lentilles et eau, mijoter 35 min.\n3. Mixer partiellement si souhaité.',
    prepMinutes: 10,
    cookMinutes: 35,
    servings: 4,
    lines: [
      { ingredientSlug: 'lentilles', quantity: 250, unit: 'g' },
      { ingredientSlug: 'carotte', quantity: 2 },
      { ingredientSlug: 'oignon', quantity: 1 },
      { ingredientSlug: 'huile-olive', quantity: 2, unit: 'càs' },
      { ingredientSlug: 'cumin', quantity: 1, unit: 'càc', optional: true },
    ],
  },
  {
    slug: 'salade-cesar-poulet',
    title: 'Salade César au poulet',
    description: 'Salade complète type bistro.',
    instructions:
      '1. Cuire le poulet à feu vif jusqu\'à 74 °C à cœur (chair blanche), laisser tiédir.\n2. Mélanger salade, croûtons (pain), sauce (yaourt + moutarde).\n3. Parmesan et poivre.',
    prepMinutes: 12,
    cookMinutes: 10,
    servings: 2,
    lines: [
      { ingredientSlug: 'poulet', quantity: 250, unit: 'g' },
      { ingredientSlug: 'salade', quantity: 1 },
      { ingredientSlug: 'pain', quantity: 2, unit: 'tranches', optional: true },
      { ingredientSlug: 'parmesan', quantity: 30, unit: 'g' },
      { ingredientSlug: 'yaourt', quantity: 2 },
      { ingredientSlug: 'moutarde', quantity: 1, unit: 'càc' },
    ],
  },
  {
    slug: 'poelee-legumes-riz',
    title: 'Poêlée de légumes au riz',
    description: 'Végétarien rapide.',
    instructions:
      '1. Cuire le riz.\n2. Poêler courgette, poivron, champignons.\n3. Mélanger et assaisonner.',
    prepMinutes: 10,
    cookMinutes: 20,
    servings: 3,
    lines: [
      { ingredientSlug: 'riz', quantity: 200, unit: 'g' },
      { ingredientSlug: 'courgette', quantity: 1 },
      { ingredientSlug: 'poivron', quantity: 1 },
      { ingredientSlug: 'champignon', quantity: 200, unit: 'g' },
      { ingredientSlug: 'huile-olive', quantity: 2, unit: 'càs' },
      { ingredientSlug: 'ail', quantity: 1, unit: 'gousse', optional: true },
    ],
  },
  {
    slug: 'saumon-citron',
    title: 'Pavé de saumon au citron',
    description: 'Léger et riche en oméga-3.',
    instructions:
      '1. Saler le saumon, ajouter citron.\n2. Cuire 8 min peau au four ou poêle.\n3. Servir avec légumes.',
    prepMinutes: 5,
    cookMinutes: 12,
    servings: 2,
    lines: [
      { ingredientSlug: 'saumon', quantity: 300, unit: 'g' },
      { ingredientSlug: 'citron', quantity: 1 },
      { ingredientSlug: 'huile-olive', quantity: 1, unit: 'càs' },
      { ingredientSlug: 'sel', quantity: 1, unit: 'pincée' },
      { ingredientSlug: 'poivre', quantity: 1, unit: 'pincée', optional: true },
    ],
  },
  {
    slug: 'wrap-thon',
    title: 'Wrap thon-crudités',
    description: 'Idéal déjeuner express.',
    instructions:
      '1. Mélanger thon, yaourt, moutarde.\n2. Garnir pain / galette avec salade et tomate.\n3. Rouler.',
    prepMinutes: 8,
    cookMinutes: 0,
    servings: 2,
    lines: [
      { ingredientSlug: 'thon', quantity: 160, unit: 'g' },
      { ingredientSlug: 'pain', quantity: 2, unit: 'tranches' },
      { ingredientSlug: 'tomate', quantity: 1 },
      { ingredientSlug: 'salade', quantity: 4, unit: 'feuilles' },
      { ingredientSlug: 'yaourt', quantity: 1 },
      { ingredientSlug: 'moutarde', quantity: 1, unit: 'càc', optional: true },
    ],
  },
  {
    slug: 'crepes-dessert',
    title: 'Crêpes sucrées',
    description: 'Dessert familial en 20 minutes.',
    instructions:
      '1. Battre œufs, farine, lait, sucre.\n2. Cuire fine couche par couche.\n3. Garnir banane ou chocolat.',
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      { ingredientSlug: 'farine', quantity: 250, unit: 'g' },
      { ingredientSlug: 'lait', quantity: 0.5, unit: 'L' },
      { ingredientSlug: 'oeuf', quantity: 3 },
      { ingredientSlug: 'sucre', quantity: 30, unit: 'g' },
      { ingredientSlug: 'beurre', quantity: 20, unit: 'g' },
      { ingredientSlug: 'banane', quantity: 2, optional: true },
      { ingredientSlug: 'chocolat', quantity: 80, unit: 'g', optional: true },
    ],
  },
  {
    slug: 'chili-pois-chiches',
    title: 'Chili végétarien aux pois chiches',
    description: 'Épicé et rassasiant sans viande.',
    instructions:
      '1. Faire revenir oignon et poivron.\n2. Ajouter pois chiches, tomates, épices.\n3. Mijoter 20 min.',
    prepMinutes: 10,
    cookMinutes: 25,
    servings: 4,
    lines: [
      { ingredientSlug: 'pois-chiches', quantity: 400, unit: 'g' },
      { ingredientSlug: 'tomate', quantity: 3 },
      { ingredientSlug: 'oignon', quantity: 1 },
      { ingredientSlug: 'poivron', quantity: 1 },
      { ingredientSlug: 'paprika', quantity: 1, unit: 'càc' },
      { ingredientSlug: 'cumin', quantity: 1, unit: 'càc' },
      { ingredientSlug: 'huile-olive', quantity: 1, unit: 'càs' },
    ],
  },
  {
    slug: 'puree-pomme-de-terre',
    title: 'Purée de pommes de terre',
    description: 'Accompagnement réconfortant.',
    instructions:
      '1. Éplucher et couper les pommes de terre.\n2. Cuire à l\'eau bouillante 20 min.\n3. Écraser avec beurre et lait, saler.',
    prepMinutes: 10,
    cookMinutes: 25,
    servings: 4,
    lines: [
      { ingredientSlug: 'pomme-de-terre', quantity: 800, unit: 'g' },
      { ingredientSlug: 'beurre', quantity: 40, unit: 'g' },
      { ingredientSlug: 'lait', quantity: 150, unit: 'ml' },
      { ingredientSlug: 'sel', quantity: 1, unit: 'pincée' },
    ],
  },
  {
    slug: 'salade-composee-thon',
    title: 'Salade composée au thon',
    description: 'Repas froid complet.',
    instructions:
      '1. Égoutter le thon.\n2. Disposer salade, tomate, œuf dur.\n3. Assaisonner huile et vinaigre.',
    prepMinutes: 12,
    cookMinutes: 8,
    servings: 2,
    lines: [
      { ingredientSlug: 'thon', quantity: 140, unit: 'g' },
      { ingredientSlug: 'salade', quantity: 1 },
      { ingredientSlug: 'tomate', quantity: 2 },
      { ingredientSlug: 'oeuf', quantity: 2 },
      { ingredientSlug: 'huile-olive', quantity: 2, unit: 'càs' },
      { ingredientSlug: 'vinaigre', quantity: 1, unit: 'càs', optional: true },
    ],
  },
  {
    slug: 'poulet-roti-legumes',
    title: 'Poulet rôti et légumes',
    description: 'Plat familial au four.',
    instructions:
      '1. Assaisonner le poulet.\n2. Disposer carottes et pommes de terre autour.\n3. Enfourner 50 min à 200 °C.\n4. Vérifier 74 °C à cœur (cuisse) avant de servir.',
    prepMinutes: 15,
    cookMinutes: 50,
    servings: 4,
    lines: [
      { ingredientSlug: 'poulet', quantity: 1, unit: 'kg' },
      { ingredientSlug: 'carotte', quantity: 4 },
      { ingredientSlug: 'pomme-de-terre', quantity: 600, unit: 'g' },
      { ingredientSlug: 'huile-olive', quantity: 2, unit: 'càs' },
      { ingredientSlug: 'sel', quantity: 1, unit: 'pincée' },
      { ingredientSlug: 'poivre', quantity: 1, unit: 'pincée' },
    ],
  },
  {
    slug: 'quiche-lorraine',
    title: 'Quiche lorraine express',
    description: 'Version simplifiée sans pâte feuilletée maison.',
    instructions:
      '1. Disposer lardons dans un moule.\n2. Battre œufs, crème, lait.\n3. Enfourner 35 min à 180 °C.',
    prepMinutes: 10,
    cookMinutes: 35,
    servings: 4,
    lines: [
      { ingredientSlug: 'lardons', quantity: 150, unit: 'g' },
      { ingredientSlug: 'oeuf', quantity: 3 },
      { ingredientSlug: 'creme-fraiche', quantity: 200, unit: 'ml' },
      { ingredientSlug: 'lait', quantity: 100, unit: 'ml' },
      { ingredientSlug: 'emmental', quantity: 80, unit: 'g', optional: true },
    ],
  },
  {
    slug: 'smoothie-banane',
    title: 'Smoothie banane',
    description: 'Collation rapide.',
    instructions:
      '1. Mixer banane et lait.\n2. Ajouter un peu de sucre si besoin.\n3. Servir frais.',
    prepMinutes: 5,
    cookMinutes: 0,
    servings: 2,
    lines: [
      { ingredientSlug: 'banane', quantity: 2 },
      { ingredientSlug: 'lait', quantity: 300, unit: 'ml' },
      { ingredientSlug: 'sucre', quantity: 1, unit: 'càc', optional: true },
    ],
  },
  {
    slug: 'haricots-verts-beurre',
    title: 'Haricots verts au beurre',
    description: 'Accompagnement classique.',
    instructions:
      '1. Cuire les haricots à l\'eau bouillante 8 min.\n2. Égoutter.\n3. Ajouter beurre fondu et sel.',
    prepMinutes: 5,
    cookMinutes: 10,
    servings: 3,
    lines: [
      { ingredientSlug: 'haricot-vert', quantity: 400, unit: 'g' },
      { ingredientSlug: 'beurre', quantity: 20, unit: 'g' },
      { ingredientSlug: 'sel', quantity: 1, unit: 'pincée' },
    ],
  },
  {
    slug: 'boeuf-hache-tomate',
    title: 'Bolognaise express',
    description: 'Sauce tomate-maison en 30 minutes, idéale pour vider le frigo.',
    instructions:
      'Préparation — 10 min\n1. Émincer l\'oignon et faire revenir dans l\'huile 3 min.\n2. Ajouter la viande hachée, cuire 8 min en émiettant jusqu\'à plus de rose (71 °C minimum pour bœuf haché).\n\nCuisson — 20 min\n3. Incorporer la sauce tomate, assaisonner.\n4. Mijoter à feu doux 15 min.\n5. Servir sur les pâtes al dente.',
    prepMinutes: 10,
    cookMinutes: 20,
    servings: 4,
    lines: [
      { ingredientSlug: 'boeuf', quantity: 400, unit: 'g' },
      { ingredientSlug: 'oignon', quantity: 1 },
      { ingredientSlug: 'sauce-tomate', quantity: 400, unit: 'g' },
      { ingredientSlug: 'pates', quantity: 320, unit: 'g' },
      { ingredientSlug: 'huile-olive', quantity: 1, unit: 'càs' },
      { ingredientSlug: 'sel', quantity: 1, unit: 'pincée' },
    ],
  },
  {
    slug: 'croque-monsieur',
    title: 'Croque-monsieur',
    description: 'Classique bistro, prêt en 15 minutes.',
    instructions:
      '1. Tartiner le pain de moutarde (facultatif).\n2. Garnir jambon et emmental entre deux tranches.\n3. Poêler 3 min de chaque côté à feu moyen.\n4. Servir chaud avec salade verte.',
    prepMinutes: 5,
    cookMinutes: 10,
    servings: 2,
    lines: [
      { ingredientSlug: 'pain', quantity: 4, unit: 'tranches' },
      { ingredientSlug: 'jambon', quantity: 120, unit: 'g' },
      { ingredientSlug: 'emmental', quantity: 80, unit: 'g' },
      { ingredientSlug: 'beurre', quantity: 15, unit: 'g' },
      { ingredientSlug: 'moutarde', quantity: 1, unit: 'càc', optional: true },
    ],
  },
  {
    slug: 'pates-sauce-tomate',
    title: 'Pâtes sauce tomate maison',
    description: 'Base italienne simple et économique.',
    instructions:
      'Préparation — 5 min\n1. Faire revenir l\'ail dans l\'huile 1 min (sans brûler).\n\nCuisson — 15 min\n2. Ajouter la sauce tomate, laisser mijoter 10 min.\n3. Cuire les pâtes al dente, égoutter.\n4. Mélanger pâtes et sauce, parsemer de basilic.',
    prepMinutes: 5,
    cookMinutes: 15,
    servings: 3,
    lines: [
      { ingredientSlug: 'pates', quantity: 300, unit: 'g' },
      { ingredientSlug: 'sauce-tomate', quantity: 400, unit: 'g' },
      { ingredientSlug: 'ail', quantity: 2, unit: 'gousse' },
      { ingredientSlug: 'huile-olive', quantity: 2, unit: 'càs' },
      { ingredientSlug: 'basilic', quantity: 6, unit: 'feuilles', optional: true },
    ],
  },
  {
    slug: 'soupe-carotte-cumin',
    title: 'Soupe carotte-cumin',
    description: 'Velouté réconfortant, parfait en automne.',
    instructions:
      '1. Éplucher et couper carottes et oignon.\n2. Faire revenir 5 min dans l\'huile avec le cumin.\n3. Couvrir d\'eau, cuire 25 min.\n4. Mixer, ajuster sel et poivre.\n5. Servir avec un filet d\'huile d\'olive.',
    prepMinutes: 10,
    cookMinutes: 30,
    servings: 4,
    lines: [
      { ingredientSlug: 'carotte', quantity: 600, unit: 'g' },
      { ingredientSlug: 'oignon', quantity: 1 },
      { ingredientSlug: 'cumin', quantity: 1, unit: 'càc' },
      { ingredientSlug: 'huile-olive', quantity: 2, unit: 'càs' },
      { ingredientSlug: 'sel', quantity: 1, unit: 'pincée' },
    ],
  },
  {
    slug: 'crevettes-ail-persil',
    title: 'Crevettes à l\'ail et persil',
    description: 'Entrée ou tapas en 12 minutes.',
    instructions:
      '1. Décongeler et sécher les crevettes.\n2. Faire chauffer l\'huile, ajouter ail émincé 30 s.\n3. Sauter les crevettes 3 min de chaque côté.\n4. Ajouter persil, citron, sel et poivre.\n5. Servir immédiatement.',
    prepMinutes: 8,
    cookMinutes: 6,
    servings: 2,
    lines: [
      { ingredientSlug: 'crevettes', quantity: 300, unit: 'g' },
      { ingredientSlug: 'ail', quantity: 2, unit: 'gousse' },
      { ingredientSlug: 'persil', quantity: 1, unit: 'botte', optional: true },
      { ingredientSlug: 'citron', quantity: 0.5 },
      { ingredientSlug: 'huile-olive', quantity: 2, unit: 'càs' },
    ],
  },
  {
    slug: 'pain-perdu',
    title: 'Pain perdu',
    description: 'Anti-gaspillage : utilise le pain rassis.',
    instructions:
      '1. Battre œufs, lait et sucre.\n2. Tremper les tranches de pain 30 s de chaque côté.\n3. Poêler dans le beurre 2 min par face.\n4. Saupoudrer de sucre ou servir avec banane.',
    prepMinutes: 5,
    cookMinutes: 10,
    servings: 2,
    lines: [
      { ingredientSlug: 'pain', quantity: 4, unit: 'tranches' },
      { ingredientSlug: 'oeuf', quantity: 2 },
      { ingredientSlug: 'lait', quantity: 150, unit: 'ml' },
      { ingredientSlug: 'sucre', quantity: 2, unit: 'càs' },
      { ingredientSlug: 'beurre', quantity: 20, unit: 'g' },
    ],
  },
  {
    slug: 'salade-fruits',
    title: 'Salade de fruits',
    description: 'Dessert léger avec ce qu\'il reste au frigo.',
    instructions:
      '1. Laver et couper pomme, banane et citron.\n2. Arroser de jus de citron pour éviter l\'oxydation.\n3. Mélanger délicatement.\n4. Servir frais (option : sucre selon goût).',
    prepMinutes: 10,
    cookMinutes: 0,
    servings: 4,
    lines: [
      { ingredientSlug: 'pomme', quantity: 2 },
      { ingredientSlug: 'banane', quantity: 2 },
      { ingredientSlug: 'citron', quantity: 1 },
      { ingredientSlug: 'sucre', quantity: 1, unit: 'càs', optional: true },
    ],
  },
  {
    slug: 'poulet-moutarde-creme',
    title: 'Poulet moutarde-crème',
    description: 'Plat crémeux type bistro français.',
    instructions:
      'Préparation — 8 min\n1. Couper le poulet en morceaux, saler et poivrer.\n\nCuisson — 18 min\n2. Dorer le poulet dans l\'huile 5 min.\n3. Baisser le feu, ajouter moutarde et crème.\n4. Mijoter 12 min à couvert jusqu\'à 74 °C à cœur (chair blanche).\n5. Servir avec riz ou pommes de terre.',
    prepMinutes: 8,
    cookMinutes: 18,
    servings: 3,
    lines: [
      { ingredientSlug: 'poulet', quantity: 500, unit: 'g' },
      { ingredientSlug: 'moutarde', quantity: 2, unit: 'càs' },
      { ingredientSlug: 'creme-fraiche', quantity: 150, unit: 'ml' },
      { ingredientSlug: 'huile-tournesol', quantity: 1, unit: 'càs' },
      { ingredientSlug: 'sel', quantity: 1, unit: 'pincée' },
      { ingredientSlug: 'poivre', quantity: 1, unit: 'pincée' },
    ],
  },
  {
    slug: 'yaourt-banane-glace',
    title: 'Yaourt glacé banane',
    description: 'Dessert sans sorbetière.',
    instructions:
      '1. Éplucher et trancher les bananes, congeler 2 h minimum.\n2. Mixer bananes congelées avec yaourt.\n3. Servir immédiatement (texture crème glacée).\n4. Option : ajouter chocolat râpé.',
    prepMinutes: 5,
    cookMinutes: 0,
    servings: 2,
    lines: [
      { ingredientSlug: 'banane', quantity: 3 },
      { ingredientSlug: 'yaourt', quantity: 2 },
      { ingredientSlug: 'chocolat', quantity: 30, unit: 'g', optional: true },
    ],
  },
  {
    slug: 'emmental-oeuf-poche',
    title: 'Oeufs pochés sur toast',
    description: 'Brunch rapide avec pain et fromage.',
    instructions:
      '1. Griller le pain.\n2. Porter de l\'eau vinaigrée à frémissement.\n3. Pocher les œufs 3 min.\n4. Disposer sur toast, ajouter emmental râpé.\n5. Poivrer et servir.',
    prepMinutes: 5,
    cookMinutes: 8,
    servings: 2,
    lines: [
      { ingredientSlug: 'oeuf', quantity: 4 },
      { ingredientSlug: 'pain', quantity: 2, unit: 'tranches' },
      { ingredientSlug: 'emmental', quantity: 40, unit: 'g' },
      { ingredientSlug: 'vinaigre', quantity: 1, unit: 'càs' },
      { ingredientSlug: 'poivre', quantity: 1, unit: 'pincée' },
    ],
  },
];

const coreSlugs = new Set(RECIPE_CATALOG_CORE.map((r) => r.slug));
const bulkFiltered = RECIPE_CATALOG_BULK.filter((r) => !coreSlugs.has(r.slug));

/** Catalogue complet (core + bulk généré, ~230 recettes). */
export const RECIPE_CATALOG: RecipeCatalogEntry[] = [...RECIPE_CATALOG_CORE, ...bulkFiltered];

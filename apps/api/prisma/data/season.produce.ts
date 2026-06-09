/** Fruits & légumes de saison (France métropolitaine, mois 1-12). */

export interface SeasonProduceEntry {

  slug: string;

  nameFr: string;

  category: 'FRUIT' | 'VEGETABLE';

  /** Mois où le produit est de saison (1 = janvier). */

  months: number[];

  tip?: string;

}



export const SEASON_PRODUCE: SeasonProduceEntry[] = [

  // Légumes racines & bulbes

  { slug: 'pomme-de-terre', nameFr: 'Pomme de terre', category: 'VEGETABLE', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },

  { slug: 'carotte', nameFr: 'Carotte', category: 'VEGETABLE', months: [1, 2, 3, 4, 5, 9, 10, 11, 12], tip: 'Conservation longue en cave.' },

  { slug: 'betterave', nameFr: 'Betterave', category: 'VEGETABLE', months: [1, 2, 3, 9, 10, 11, 12] },

  { slug: 'navet', nameFr: 'Navet', category: 'VEGETABLE', months: [1, 2, 10, 11, 12] },

  { slug: 'panais', nameFr: 'Panais', category: 'VEGETABLE', months: [1, 2, 10, 11, 12] },

  { slug: 'celeri-rave', nameFr: 'Céleri-rave', category: 'VEGETABLE', months: [1, 2, 10, 11, 12] },

  { slug: 'poireau', nameFr: 'Poireau', category: 'VEGETABLE', months: [1, 2, 3, 10, 11, 12], tip: 'Potée ou quiche.' },

  { slug: 'oignon', nameFr: 'Oignon', category: 'VEGETABLE', months: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12] },

  { slug: 'echalote', nameFr: 'Échalote', category: 'VEGETABLE', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },



  // Choux & feuilles

  { slug: 'chou-fleur', nameFr: 'Chou-fleur', category: 'VEGETABLE', months: [1, 2, 3, 9, 10, 11, 12] },

  { slug: 'chou-vert', nameFr: 'Chou vert', category: 'VEGETABLE', months: [1, 2, 3, 10, 11, 12] },

  { slug: 'chou-rouge', nameFr: 'Chou rouge', category: 'VEGETABLE', months: [1, 2, 9, 10, 11, 12] },

  { slug: 'chou-bruxelles', nameFr: 'Chou de Bruxelles', category: 'VEGETABLE', months: [1, 2, 10, 11, 12] },

  { slug: 'brocoli', nameFr: 'Brocoli', category: 'VEGETABLE', months: [9, 10, 11, 12, 1, 2, 3] },

  { slug: 'endive', nameFr: 'Endive', category: 'VEGETABLE', months: [1, 2, 3, 10, 11, 12] },

  { slug: 'mache', nameFr: 'Mâche', category: 'VEGETABLE', months: [1, 2, 3, 10, 11, 12] },

  { slug: 'epinard', nameFr: 'Épinard', category: 'VEGETABLE', months: [1, 2, 3, 4, 5, 9, 10, 11] },

  { slug: 'salade', nameFr: 'Salade', category: 'VEGETABLE', months: [3, 4, 5, 6, 7, 8, 9, 10] },



  // Légumes d'été

  { slug: 'courgette', nameFr: 'Courgette', category: 'VEGETABLE', months: [5, 6, 7, 8, 9], tip: 'Poêlée ou ratatouille.' },

  { slug: 'tomate', nameFr: 'Tomate', category: 'VEGETABLE', months: [6, 7, 8, 9], tip: 'Salade ou sauce maison.' },

  { slug: 'aubergine', nameFr: 'Aubergine', category: 'VEGETABLE', months: [7, 8, 9] },

  { slug: 'poivron', nameFr: 'Poivron', category: 'VEGETABLE', months: [7, 8, 9] },

  { slug: 'concombre', nameFr: 'Concombre', category: 'VEGETABLE', months: [5, 6, 7, 8, 9] },

  { slug: 'haricot-vert', nameFr: 'Haricot vert', category: 'VEGETABLE', months: [6, 7, 8, 9] },

  { slug: 'petit-pois', nameFr: 'Pois', category: 'VEGETABLE', months: [5, 6, 7] },

  { slug: 'radis', nameFr: 'Radis', category: 'VEGETABLE', months: [3, 4, 5, 6, 7, 8, 9] },

  { slug: 'fenouil', nameFr: 'Fenouil', category: 'VEGETABLE', months: [6, 7, 8, 9, 10] },

  { slug: 'artichaut', nameFr: 'Artichaut', category: 'VEGETABLE', months: [4, 5, 6, 9, 10] },
  { slug: 'asperge', nameFr: 'Asperge', category: 'VEGETABLE', months: [4, 5, 6], tip: 'Dernières récoltes en juin.' },
  { slug: 'rhubarbe', nameFr: 'Rhubarbe', category: 'VEGETABLE', months: [4, 5, 6] },



  // Automne

  { slug: 'potiron', nameFr: 'Potiron', category: 'VEGETABLE', months: [9, 10, 11, 12], tip: 'Soupe veloutée.' },

  { slug: 'potimarron', nameFr: 'Potimarron', category: 'VEGETABLE', months: [9, 10, 11, 12] },

  { slug: 'champignon', nameFr: 'Champignon', category: 'VEGETABLE', months: [9, 10, 11] },

  { slug: 'chataigne', nameFr: 'Châtaigne', category: 'VEGETABLE', months: [10, 11, 12] },



  // Fruits d'hiver & agrumes

  { slug: 'orange', nameFr: 'Orange', category: 'FRUIT', months: [1, 2, 3, 11, 12] },

  { slug: 'citron', nameFr: 'Citron', category: 'FRUIT', months: [1, 2, 3, 11, 12] },

  { slug: 'clementine', nameFr: 'Clémentine', category: 'FRUIT', months: [11, 12, 1, 2] },

  { slug: 'pomme', nameFr: 'Pomme', category: 'FRUIT', months: [1, 2, 3, 8, 9, 10, 11, 12] },

  { slug: 'poire', nameFr: 'Poire', category: 'FRUIT', months: [9, 10, 11, 12] },

  { slug: 'kiwi', nameFr: 'Kiwi', category: 'FRUIT', months: [1, 2, 11, 12] },



  // Fruits de printemps & été

  { slug: 'fraise', nameFr: 'Fraise', category: 'FRUIT', months: [5, 6, 7] },
  { slug: 'mure', nameFr: 'Mûre', category: 'FRUIT', months: [5, 6, 7, 8] },

  { slug: 'cerise', nameFr: 'Cerise', category: 'FRUIT', months: [6, 7] },

  { slug: 'groseille', nameFr: 'Groseille', category: 'FRUIT', months: [6, 7] },

  { slug: 'framboise', nameFr: 'Framboise', category: 'FRUIT', months: [6, 7, 8] },

  { slug: 'myrtille', nameFr: 'Myrtille', category: 'FRUIT', months: [7, 8] },

  { slug: 'peche', nameFr: 'Pêche', category: 'FRUIT', months: [7, 8] },

  { slug: 'nectarine', nameFr: 'Nectarine', category: 'FRUIT', months: [7, 8] },

  { slug: 'abricot', nameFr: 'Abricot', category: 'FRUIT', months: [6, 7] },

  { slug: 'prune', nameFr: 'Prune', category: 'FRUIT', months: [8, 9] },

  { slug: 'melon', nameFr: 'Melon', category: 'FRUIT', months: [7, 8, 9] },

  { slug: 'pasteque', nameFr: 'Pastèque', category: 'FRUIT', months: [7, 8] },

  { slug: 'figue', nameFr: 'Figue', category: 'FRUIT', months: [8, 9] },

  { slug: 'raisin', nameFr: 'Raisin', category: 'FRUIT', months: [8, 9, 10] },

];



export function getSeasonalForMonth(month: number): SeasonProduceEntry[] {

  return SEASON_PRODUCE.filter((p) => p.months.includes(month));

}



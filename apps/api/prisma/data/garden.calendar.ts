/** Calendrier jardin / balcon (semis, plantation, bouture, récolte — France métropolitaine). */

export interface GardenTaskEntry {

  slug: string;

  plantFr: string;

  action: 'semis' | 'plantation' | 'bouture' | 'recolte';

  months: number[];

  description: string;

}



export const GARDEN_CALENDAR: GardenTaskEntry[] = [

  // ——— Janvier ———

  { slug: 'ail-plant-hiver', plantFr: 'Ail', action: 'plantation', months: [1, 2, 11, 12], description: 'Gousses à 3 cm de profondeur, sol drainé.' },

  { slug: 'poireau-semis-hiver', plantFr: 'Poireau', action: 'semis', months: [1, 2], description: 'Semis sous châssis ou serre froide pour plants de printemps.' },

  { slug: 'laitue-semis-hiver', plantFr: 'Laitue', action: 'semis', months: [1, 2, 9, 10], description: 'Semis sous abri pour récoltes précoces.' },



  // ——— Février ———

  { slug: 'echalote-plant', plantFr: 'Échalote', action: 'plantation', months: [2, 3], description: 'Plantation des échalotes grises, pointe visible.' },

  { slug: 'petit-pois-semis', plantFr: 'Pois', action: 'semis', months: [2, 3, 4], description: 'Semis sous abri puis repiquage ; variétés précoces en février.' },

  { slug: 'radis-semis', plantFr: 'Radis', action: 'semis', months: [2, 3, 4, 5, 6, 7, 8, 9], description: 'Semis en place toutes les 3 semaines, croissance rapide.' },



  // ——— Mars ———

  { slug: 'tomate-semis', plantFr: 'Tomate', action: 'semis', months: [3, 4], description: 'Semis sous abri 20 °C, repiquage après les saints de glace.' },

  { slug: 'pomme-de-terre-plant', plantFr: 'Pomme de terre', action: 'plantation', months: [3, 4], description: 'Butter quand les plants atteignent 15 cm.' },

  { slug: 'carotte-semis', plantFr: 'Carotte', action: 'semis', months: [3, 4, 5, 6, 7], description: 'Semis en place, sol meuble sans cailloux.' },

  { slug: 'betterave-semis', plantFr: 'Betterave', action: 'semis', months: [3, 4, 5, 6], description: 'Semis en poquet, éclaircissage indispensable.' },

  { slug: 'epinard-semis', plantFr: 'Épinard', action: 'semis', months: [3, 4, 8, 9], description: 'Semis échelonnés, récolte feuilles jeunes.' },

  { slug: 'persil-semis', plantFr: 'Persil', action: 'semis', months: [3, 4, 5, 6, 7, 8], description: 'Germination lente (3 semaines), patience.' },

  { slug: 'fraisier-bouture', plantFr: 'Fraisier', action: 'bouture', months: [3, 4, 5], description: 'Stolons ou plants, paillage recommandé.' },

  { slug: 'artichaut-plant', plantFr: 'Artichaut', action: 'plantation', months: [3, 4], description: 'Plants rustes, sol riche et drainé.' },



  // ——— Avril ———

  { slug: 'basilic-semis', plantFr: 'Basilic', action: 'semis', months: [4, 5, 6], description: 'Semis en godet, chaleur et lumière.' },

  { slug: 'salade-semis', plantFr: 'Salade', action: 'semis', months: [3, 4, 5, 6, 7, 8, 9], description: 'Semis échelonnés toutes les 2 semaines.' },

  { slug: 'courgette-semis', plantFr: 'Courgette', action: 'semis', months: [4, 5], description: 'Semis en godet ou en place après gelées.' },

  { slug: 'concombre-semis', plantFr: 'Concombre', action: 'semis', months: [4, 5], description: 'Semis sous abri, culture chaude.' },

  { slug: 'aubergine-semis', plantFr: 'Aubergine', action: 'semis', months: [4], description: 'Semis en intérieur, repiquage en mai.' },

  { slug: 'poivron-semis', plantFr: 'Poivron', action: 'semis', months: [4], description: 'Semis sous abri chaud, croissance lente.' },

  { slug: 'chou-semis', plantFr: 'Chou', action: 'semis', months: [4, 5, 6], description: 'Brocoli, chou-fleur, chou de Bruxelles selon variété.' },

  { slug: 'haricot-semis-precoce', plantFr: 'Haricot vert', action: 'semis', months: [4, 5], description: 'Semis sous abri pour variétés précoces.' },

  { slug: 'fraise-recolte', plantFr: 'Fraisier', action: 'recolte', months: [5, 6, 7], description: 'Récolte matinale, arrosage au pied.' },



  // ——— Mai ———

  { slug: 'tomate-plant', plantFr: 'Tomate', action: 'plantation', months: [5, 6], description: 'Pleine terre après saints de glace (11-13 mai) ; nord/altitude plutôt fin mai–juin, sol ≥ 12-15 °C.' },

  { slug: 'haricot-semis', plantFr: 'Haricot vert', action: 'semis', months: [5, 6, 7], description: 'Semis en place après dernières gelées.' },

  { slug: 'poivron-plant', plantFr: 'Poivron', action: 'plantation', months: [5, 6], description: 'Chaleur et ensoleillement nécessaires.' },

  { slug: 'aubergine-plant', plantFr: 'Aubergine', action: 'plantation', months: [5, 6], description: 'Tuteurage et arrosage régulier.' },

  { slug: 'melon-semis', plantFr: 'Melon', action: 'semis', months: [5], description: 'Semis en place ou godet, sol chaud.' },

  { slug: 'potiron-semis', plantFr: 'Potiron', action: 'semis', months: [5, 6], description: 'Semis en poquet, beaucoup d\'espace.' },

  { slug: 'mais-semis', plantFr: 'Maïs', action: 'semis', months: [5, 6], description: 'Semis en bloc (pollinisation), sol riche.' },

  { slug: 'courgette-plant', plantFr: 'Courgette', action: 'plantation', months: [5], description: 'Plants en pleine terre, arrosage abondant.' },



  // ——— Juin ———

  { slug: 'tomate-recolte', plantFr: 'Tomate', action: 'recolte', months: [7, 8, 9, 10], description: 'Récolte régulière pour favoriser la floraison.' },

  { slug: 'haricot-semis-ete', plantFr: 'Haricot vert', action: 'semis', months: [6, 7], description: 'Derniers semis pour récoltes d\'automne.' },

  { slug: 'laitue-semis-ete', plantFr: 'Laitue', action: 'semis', months: [6, 7, 8], description: 'Variétés résistantes à la montée en graines.' },

  { slug: 'basilic-bouture', plantFr: 'Basilic', action: 'bouture', months: [6, 7, 8], description: 'Boutures dans l\'eau puis en pot.' },

  { slug: 'framboise-recolte', plantFr: 'Framboisier', action: 'recolte', months: [6, 7, 8], description: 'Récolte quotidienne, fruits fragiles.' },



  // ——— Juillet ———

  { slug: 'courgette-recolte', plantFr: 'Courgette', action: 'recolte', months: [6, 7, 8, 9], description: 'Cueillir jeunes pour stimuler la production.' },

  { slug: 'haricot-recolte', plantFr: 'Haricot vert', action: 'recolte', months: [7, 8, 9], description: 'Récolte régulière avant gonflement des graines.' },

  { slug: 'radis-semis-ete', plantFr: 'Radis', action: 'semis', months: [7, 8], description: 'Semis ombragés en plein été.' },



  // ——— Août ———

  { slug: 'poireau-plant', plantFr: 'Poireau', action: 'plantation', months: [8], description: 'Repiquage des plants pour récolte hivernale.' },

  { slug: 'mache-semis', plantFr: 'Mâche', action: 'semis', months: [8, 9], description: 'Semis en place, récolte automne-hiver.' },

  { slug: 'navet-semis', plantFr: 'Navet', action: 'semis', months: [8, 9], description: 'Semis échelonnés, croissance rapide.' },

  { slug: 'potiron-recolte', plantFr: 'Potiron', action: 'recolte', months: [9, 10, 11], description: 'Récolte avant les premières gelées fortes.' },



  // ——— Septembre ———

  { slug: 'laitue-semis-automne', plantFr: 'Laitue', action: 'semis', months: [9], description: 'Semis sous abri pour culture d\'hiver.' },

  { slug: 'epinard-semis-automne', plantFr: 'Épinard', action: 'semis', months: [9, 10], description: 'Semis en place, récolte feuilles d\'hiver.' },

  { slug: 'ail-plant-automne', plantFr: 'Ail', action: 'plantation', months: [10, 11], description: 'Plantation automnale pour récolte été suivant.' },

  { slug: 'chou-plant-automne', plantFr: 'Chou', action: 'plantation', months: [9], description: 'Plants de choux d\'hiver (kale, chou vert).' },



  // ——— Octobre ———

  { slug: 'fraise-plant', plantFr: 'Fraisier', action: 'plantation', months: [10], description: 'Plantation des stolons pour l\'année suivante.' },

  { slug: 'poireau-recolte', plantFr: 'Poireau', action: 'recolte', months: [10, 11, 12, 1, 2, 3], description: 'Buttage pour blanchir les tiges.' },



  // ——— Novembre ———

  { slug: 'echalote-plant-automne', plantFr: 'Échalote', action: 'plantation', months: [11], description: 'Dernière fenêtre de plantation échalotes.' },



  // ——— Décembre ———

  { slug: 'persil-recolte-hiver', plantFr: 'Persil', action: 'recolte', months: [12, 1, 2], description: 'Récolte feuilles sous protection si gel.' },

];



export function getGardenTasksForMonth(month: number): GardenTaskEntry[] {

  return GARDEN_CALENDAR.filter((t) => t.months.includes(month));

}



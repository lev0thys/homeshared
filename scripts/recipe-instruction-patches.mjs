/**
 * Patches instructions / unités — recettes originales homeshared (pas copiées).
 * Appliqués par scripts/apply-recipe-patches.mjs
 */
export const INSTRUCTION_PATCHES = {
  // ——— Sécurité viande / poisson ———
  'nem-poulet':
    "1. Faire revenir le poulet haché avec carotte et champignon 8 min (chair blanche).\n2. Garnir les feuilles de riz, plier en nem.\n3. Cuire au four 200 °C, 18 min, jusqu'à coloration — farce déjà cuite.",
  'brochettes-poulet-citronnelle':
    "1. Mariner le poulet au citron, gingembre et sauce soja 30 min.\n2. Enfiler sur brochettes.\n3. Griller 12 à 15 min en retournant jusqu'à 74 °C à cœur (chair blanche).",
  'salade-avocat-crevettes':
    "1. Cuire les crevettes 3 à 4 min à feu vif jusqu'à rose et opaque.\n2. Disposer avocat, salade et tomate.\n3. Assaisonner citron et huile, servir frais.",
  'pho-boeuf-express':
    "1. Porter le bouillon à frémissement avec gingembre.\n2. Cuire les nouilles de riz à part.\n3. Trancher le bœuf très fin : le plonger 1 à 2 min dans le bouillon frémissant jusqu'à plus de rose visible. Servir avec herbes.",
  // ——— Placeholders végétariens / plats ———
  ratatouille:
    "1. Couper courgette, aubergine, poivron et tomate.\n2. Faire revenir oignon et ail, ajouter les légumes en couches.\n3. Mijoter 30 min à feu doux avec huile d'olive.",
  'gratin-courgette':
    "1. Trancher les courgettes, blanchir 5 min.\n2. Disposer en couches avec fromage (emmental du catalogue).\n3. Gratiner au four 180 °C, 25 min.",
  'tarte-tomate':
    "1. Étaler la pâte (farine + beurre), piquer le fond.\n2. Disposer tomates en rondelles, ail, huile, herbes.\n3. Cuire 35 min à 180 °C.",
  'falafels-maison':
    "1. Mixer pois chiches, oignon, ail et épices.\n2. Former des boulettes.\n3. Frire ou cuire au four 200 °C, 20 min, jusqu'à doré.",
  'houmous-maison':
    "1. Mixer pois chiches, tahini (substitut : yaourt épais), citron et ail.\n2. Ajuster sel et huile d'olive.\n3. Servir frais avec pain.",
  'curry-lentilles':
    "1. Faire revenir oignon, ail, curry.\n2. Ajouter lentilles et bouillon, mijoter 25 min.\n3. Servir avec riz si disponible.",
  'chili-vegetarien':
    "1. Faire revenir oignon et poivron.\n2. Ajouter haricots (lentilles ou pois chiches du catalogue), tomate, épices, mijoter 30 min.\n3. Servir chaud.",
  'tacos-vegetariens':
    "1. Garnir tortillas (pain du catalogue) d'avocat, haricots, tomate.\n2. Ajouter oignon et coriandre si disponible.\n3. Servir immédiatement.",
  'quiche-legumes':
    "1. Préparer appareil œufs + crème (yaourt) + légumes coupés.\n2. Verser sur pâte ou fond beurré.\n3. Cuire 40 min à 180 °C jusqu'à prise.",
  'gratin-chou-fleur':
    "1. Cuire le chou-fleur à la vapeur 10 min.\n2. Napper de sauce (yaourt + fromage).\n3. Gratiner 20 min au four.",
  'aubergine-parmesan':
    "1. Trancher aubergines, les dorer à la poêle.\n2. Alterner couches tomate et parmesan.\n3. Cuire au four 180 °C, 30 min.",
  'poelee-legumes':
    "1. Couper légumes en morceaux réguliers.\n2. Sauter à feu vif avec huile 10 à 12 min.\n3. Assaisonner et servir croquant.",
  'soupe-legumes-vert':
    "1. Laver et couper les légumes verts.\n2. Cuire dans le bouillon 20 min.\n3. Mixer, assaisonner, servir chaud.",
  'salade-quinoa':
    "1. Cuire le quinoa (semoule) 15 min, refroidir.\n2. Mélanger tomate, concombre, huile, citron.\n3. Servir frais.",
  'burger-lentilles':
    "1. Mixer lentilles cuites, oignon, épices.\n2. Former galettes, cuire poêle 4 min par face.\n3. Servir dans pain avec salade.",
  'pizza-margherita-maison':
    "1. Étaler pâte (farine), napper tomate.\n2. Ajouter mozzarella (emmental) et basilic.\n3. Cuire four 220 °C, 12 à 15 min.",
  'risotto-champignons':
    "1. Faire revenir oignon et champignons.\n2. Ajouter riz, mouiller au bouillon louche par louche 18 min.\n3. Finir au beurre, servir crémeux.",
  'tian-legumes':
    "1. Trancher légumes finement.\n2. Disposer en rosace dans plat huilé.\n3. Cuire four 180 °C, 45 min couvert puis 15 min découvert.",
  'beignets-courgette':
    "1. Râper courgette, saler, essorer.\n2. Mélanger œuf, farine, ail.\n3. Frire petites portions 3 min par face.",
  taboule:
    "1. Tremper semoule dans eau chaude 10 min, égoutter.\n2. Mélanger tomate, concombre, menthe, persil, citron, huile.\n3. Servir frais.",
  'galettes-sarrasin':
    "1. Préparer pâte (farine + œuf + lait).\n2. Cuire fines crêpes à la poêle.\n3. Garnir jambon (substitut : dinde) et œuf si souhaité.",
  'croque-monsieur-vegetarien':
    "1. Garnir pain de fromage et béchamel (yaourt).\n2. Griller poêle ou four 10 min.\n3. Servir chaud.",
  'wrap-falafel':
    "1. Garnir tortilla de falafels, salade, tomate, sauce yaourt.\n2. Rouler serré.\n3. Servir frais.",
  'polenta-legumes':
    "1. Cuire polenta (semoule) dans bouillon 15 min.\n2. Sauter légumes à part.\n3. Servir polenta nappée de légumes.",
  'tofu-brouille':
    "1. Émietter tofu, faire revenir avec curcuma.\n2. Ajouter légumes coupés fins.\n3. Servir type brunch.",
  'mousse-chocolat':
    "1. Œufs pasteurisés recommandés pour préparations crues.\n2. Faire fondre chocolat et beurre.\n3. Monter les blancs en neige, incorporer délicatement. Réfrigérer 4 h minimum.",
  'tiramisu-express':
    "1. Œufs pasteurisés recommandés.\n2. Battre jaunes + sucre, mélanger mascarpone.\n3. Tremper biscuits (pain) dans café froid, alterner couches. Réfrigérer 6 h.",
  'creme-caramel':
    "1. Chauffer lait, sucre et vanille (ne pas faire bouillir).\n2. Caraméliser sucre dans moule, verser appareil œufs-lait (œufs pasteurisés si crème non cuite).\n3. Cuire au bain-marie 40 min à 160 °C, refroidir 4 h.",
  'clafoutis-cerises':
    "1. Beurrer plat, disposer fruits (cerises du catalogue ou fruits rouges).\n2. Battre œufs, farine, sucre et lait.\n3. Cuire four 180 °C, 35 min jusqu'à prise.",
  'crêpes-sucre':
    "1. Battre œufs, farine, lait et pincée de sel.\n2. Laisser reposer 30 min.\n3. Cuire fines crêpes à la poêle beurrée, sucrer au moment de servir.",
  gaufres:
    "1. Séparer œufs, monter blancs.\n2. Incorporer farine, lait, beurre fondu au jaune + sucre.\n3. Cuire au gaufrier ou poêle jusqu'à doré.",
  brownies:
    "1. Faire fondre chocolat et beurre.\n2. Mélanger œufs et sucre, incorporer farine et chocolat.\n3. Cuire four 180 °C, 22 min (cœur encore moelleux).",
  'cookies-chocolat':
    "1. Crémer beurre et sucre, ajouter œuf.\n2. Incorporer farine et pépites chocolat.\n3. Cuire 12 min à 180 °C — bords dorés, centre souple.",
  'crumble-pomme':
    "1. Éplucher pommes, couper en morceaux avec sucre et cannelle.\n2. Mélanger farine, beurre et sucre en crumble.\n3. Cuire four 180 °C, 30 min.",
  'tarte-citron':
    "1. Cuire fond (pâte farine) 15 min à vide.\n2. Chauffer jus citron, œufs, sucre jusqu'à nappe (œufs bien cuits).\n3. Verser sur fond, refroidir 3 h.",
  'profiteroles-express':
    "1. Préparer pâte à choux (farine, beurre, œufs), former choux.\n2. Cuire four 200 °C, 25 min sans ouvrir.\n3. Garnir crème (mascarpone + sucre) et napper chocolat fondu.",
  'riz-lait':
    "1. Porter lait, sucre et vanille à frémissement.\n2. Ajouter riz rond, mijoter 30 min en remuant.\n3. Servir tiède ou froid.",
  'compote-pomme':
    "1. Éplucher pommes, couper en morceaux.\n2. Cuire à feu doux avec un peu d'eau et sucre 20 min.\n3. Écraser ou laisser en morceaux, refroidir.",
  'salade-fruits-maison':
    "1. Laver et couper fruits (pomme, banane, citron en jus).\n2. Mélanger délicatement.\n3. Servir frais, consommer le jour même.",
  'banana-bread':
    "1. Écraser bananes mûres, mélanger œufs, farine, sucre, levure.\n2. Verser dans moule beurré.\n3. Cuire four 170 °C, 50 min (couteau sec).",
  'flan-patissier':
    "1. Chauffer lait et sucre.\n2. Battre œufs (pasteurisés), verser lait chaud en fouettant.\n3. Cuire bain-marie 45 min à 160 °C.",
  'moelleux-chocolat':
    "1. Faire fondre chocolat et beurre.\n2. Mélanger œufs et sucre, ajouter farine et chocolat.\n3. Cuire 12 min à 200 °C pour cœur coulant.",
  'charlotte-fraises':
    "1. Tapisser moule de biscuits (pain) imbibés de jus fruit.\n2. Monter crème mascarpone + sucre, mélanger fraises.\n3. Réfrigérer 4 h minimum.",
  'panna-cotta':
    "1. Chauffer crème et sucre (ne pas bouillir).\n2. Ajouter gélatine hydratée ou réduire très fort si sans.\n3. Verser en verrines, réfrigérer 3 h.",
  'fondant-citron':
    "1. Battre œufs, sucre, farine et jus citron.\n2. Verser dans moule beurré.\n3. Cuire 25 min à 180 °C.",
  'truffes-chocolat':
    "1. Chauffer crème, verser sur chocolat haché.\n2. Réfrigérer ganache 2 h, former boules.\n3. Rouler dans cacao ou noix concassées.",
  'tarte-tatin':
    "1. Caraméliser sucre et beurre dans moule.\n2. Disposer pommes en rosace, couvrir pâte.\n3. Cuire four 190 °C, 35 min, démouler tiède.",
};

export const UNIT_LINE_PATCHES = [
  {
    slug: 'tiramisu-express',
    ingredientSlug: 'oeuf',
    quantity: 3,
    unit: null,
  },
  {
    slug: 'tiramisu-express',
    ingredientSlug: 'pain',
    quantity: 24,
    unit: null,
  },
  {
    slug: 'mousse-chocolat',
    ingredientSlug: 'oeuf',
    quantity: 4,
    unit: null,
  },
];

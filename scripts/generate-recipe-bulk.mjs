/**
 * Génère apps/api/prisma/data/recipe.catalog.bulk.ts (180+ recettes).
 * Recettes originales inspirées de plats classiques — pas de copie de sites.
 * Usage: node scripts/generate-recipe-bulk.mjs
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = resolve(root, 'apps/api/prisma/data/recipe.catalog.bulk.ts');

/** @param {string} slug @param {string} title @param {string} desc @param {number} prep @param {number} cook @param {number} servings @param {string[]} stepTexts @param {Array<[string, number, string?, boolean?]>} lines */
function recipe(slug, title, desc, prep, cook, servings, stepTexts, lines) {
  const instructions = stepTexts.map((s, i) => `${i + 1}. ${s}`).join('\n');
  return {
    slug,
    title,
    description: desc,
    instructions,
    prepMinutes: prep,
    cookMinutes: cook,
    servings,
    lines: lines.map(([ingredientSlug, quantity, unit = null, optional = false]) => ({
      ingredientSlug,
      quantity,
      unit,
      optional,
    })),
  };
}

/** Étapes sécurité alimentaire (références ANSES / guides officiels). */
const STEPS_POULET = [
  'Assaisonner le poulet (sel, poivre).',
  'Cuire jusqu\'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l\'os).',
  'Laisser reposer 5 min — la chair ne doit jamais être rosée.',
];
const STEPS_POULET_BROCHETTE = [
  'Couper le poulet en cubes réguliers.',
  'Griller 12 à 15 min en retournant, jusqu\'à 74 °C à cœur.',
  'Servir dès que la chair est blanche partout.',
];
const STEPS_VIANDE = [
  'Assaisonner la viande.',
  'Bœuf haché : cuire jusqu\'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.',
  'Servir chaud.',
];
const STEPS_POISSON = [
  'Saler et poivrer le poisson.',
  'Cuire jusqu\'à chair opaque (≈63 °C à cœur pour poisson fin — réf. ANSES).',
  'Servir immédiatement.',
];
const STEPS_CEVICHE = [
  'Poisson ultra frais (qualité sashimi), consommé le jour même uniquement.',
  'Couper en dés, mariner 30 min minimum au jus de citron et oignon émincé.',
  'Ne pas recuire au feu : le citron « cuit » à froid. Femmes enceintes : éviter.',
];
const STEPS_MOULES = [
  'Laver les moules, retirer les « barbes ».',
  'Cuire à feu vif 5 à 7 min couvert, jusqu\'à ouverture des coquilles.',
  'Jeter toute coquille restée fermée après cuisson (règle sanitaire).',
];
const STEPS_OEUFS_CRUS = [
  'Utiliser des œufs frais et de préférence pasteurisés pour préparations crues.',
  'Conservation au frais ≤ 4 °C, consommer rapidement.',
];

function validateRecipes(recipes) {
  const issues = [];
  for (const r of recipes) {
    if (r.slug.includes('poulet') && r.cookMinutes > 0 && r.cookMinutes < 12 && !r.slug.includes('salade')) {
      issues.push(`${r.slug}: cuisson poulet ${r.cookMinutes} min trop courte`);
    }
    if (r.slug === 'ceviche-express' && r.instructions.includes('poêle')) {
      issues.push('ceviche-express: instructions incohérentes (cuisson au feu)');
    }
    if (r.slug.includes('sorbet') && r.lines.some((l) => l.ingredientSlug === 'bouillon')) {
      issues.push(`${r.slug}: bouillon interdit en dessert`);
    }
    for (const line of r.lines) {
      if (line.unit != null && typeof line.unit !== 'string') {
        issues.push(`${r.slug}: unité invalide pour ${line.ingredientSlug} (${typeof line.unit})`);
      }
    }
    if (r.title.toLowerCase().includes('canard') && r.lines.some((l) => l.ingredientSlug === 'porc')) {
      issues.push(`${r.slug}: titre canard mais ingrédient porc`);
    }
    if (r.lines.some((l) => l.quantity <= 0)) {
      issues.push(`${r.slug}: quantité nulle`);
    }
  }
  if (issues.length) throw new Error(`Validation échouée:\n- ${issues.join('\n- ')}`);
}

const S = (/** @type {string} */ t) => t;

const bulk = [];

// ——— Salades (22) ———
const salades = [
  recipe('salade-grecque', 'Salade grecque', 'Fraîcheur méditerranéenne.', 12, 0, 2, [
    'Couper concombre, tomate et poivron en dés.',
    'Ajouter olives et fromage feta (substitut : chèvre du catalogue).',
    'Assaisonner huile, citron, thym, sel.',
  ], [['concombre', 1], ['tomate', 2], ['poivron', 1], ['olive', 40, 'g'], ['chevre', 100, 'g'], ['oignon', 0.5], ['huile-olive', 2, 'càs'], ['citron', 0.5], ['thym', 1, null, true]]),
  recipe('salade-cesar-vegetarienne', 'Salade César végétarienne', 'Sans poulet, croûtons maison.', 10, 5, 2, [
    'Griller pain en croûtons.',
    'Mélanger salade, parmesan, sauce yaourt-moutarde.',
    'Poivrer et servir.',
  ], [['salade', 1], ['pain', 2, 'tranches'], ['parmesan', 40, 'g'], ['yaourt', 2], ['moutarde', 1, 'càc'], ['huile-olive', 1, 'càs']]),
  recipe('salade-lentilles', 'Salade de lentilles', 'Protéinée et économique.', 10, 25, 4, [
    'Cuire lentilles 25 min.',
    'Mélanger avec carotte, oignon, vinaigrette.',
    'Servir tiède ou froid.',
  ], [['lentilles', 250, 'g'], ['carotte', 2], ['oignon', 1], ['vinaigre', 2, 'càs'], ['huile-olive', 2, 'càs']]),
  recipe('salade-avocat-crevettes', 'Salade avocat-crevettes', 'Légère et iodée.', 15, 5, 2, [
    'Cuire crevettes 3 min.',
    'Disposer avocat, salade, tomate cerise (tomate).',
    'Assaisonner citron et huile.',
  ], [['crevettes', 200, 'g'], ['avocat', 1], ['salade', 1], ['tomate', 2], ['citron', 1], ['huile-olive', 2, 'càs']]),
  recipe('salade-pois-chiches', 'Salade de pois chiches', 'Express et rassasiante.', 8, 0, 3, [
    'Égoutter pois chiches.',
    'Mélanger tomate, concombre, persil, citron.',
    'Servir frais.',
  ], [['pois-chiches', 400, 'g'], ['tomate', 2], ['concombre', 1], ['persil', 1, 'botte'], ['citron', 1], ['huile-olive', 2, 'càs']]),
  recipe('salade-endive-roquefort', 'Salade endive et chèvre', 'Amère et crémeuse.', 8, 0, 2, [
    'Effeuiller salade et endive (salade).',
    'Émietter chèvre, ajouter noix.',
    'Vinaigrette moutarde.',
  ], [['salade', 2], ['chevre', 100, 'g'], ['noix', 40, 'g'], ['moutarde', 1, 'càc'], ['vinaigre', 1, 'càs']]),
  recipe('salade-pomme-celeri', 'Salade pomme-céleri', 'Croquante et légère.', 10, 0, 3, [
    'Râper pomme et céleri.',
    'Mélanger yaourt, citron, sel.',
    'Servir frais.',
  ], [['pomme', 2], ['celeri', 3, null], ['yaourt', 1], ['citron', 0.5]]),
  recipe('salade-riz-thon', 'Salade de riz au thon', 'Repas complet froid.', 15, 15, 4, [
    'Cuire riz, refroidir.',
    'Mélanger thon, maïs, tomate, poivron.',
    'Assaisonner huile et citron.',
  ], [['riz', 250, 'g'], ['thon', 160, 'g'], ['mais', 150, 'g'], ['tomate', 2], ['poivron', 1], ['huile-olive', 2, 'càs']]),
  recipe('salade-concombre-yaourt', 'Concombre au yaourt', 'Accompagnement turc simple.', 8, 0, 4, [
    'Trancher concombre finement.',
    'Mélanger yaourt, ail, sel.',
    'Réfrigérer 30 min avant service.',
  ], [['concombre', 2], ['yaourt', 2], ['ail', 1, 'gousse'], ['sel', 1, 'pincée']]),
  recipe('salade-feta-pasteque', 'Pastèque et feta', 'Sucré-salé estival.', 10, 0, 4, [
    'Couper pastèque (ananas option) et concombre.',
    'Émietter feta (chèvre).',
    'Menthe (basilic), huile, citron.',
  ], [['ananas', 0.5, null, true], ['concombre', 1], ['chevre', 120, 'g'], ['basilic', 6, 'feuilles'], ['huile-olive', 1, 'càs']]),
  recipe('salade-chou-rouge', 'Salade de chou rouge', 'Accompagnement croquant.', 10, 0, 4, [
    'Émincer chou finement (chou-fleur rouge → chou-fleur).',
    'Mélanger carotte râpée, vinaigrette.',
    'Laisser mariner 1 h.',
  ], [['chou-fleur', 0.5, null], ['carotte', 2], ['vinaigre', 2, 'càs'], ['huile-olive', 2, 'càs'], ['sucre', 1, 'càc', true]]),
  recipe('salade-betterave-chèvre', 'Betterave et chèvre', 'Couleurs et saveurs.', 10, 40, 3, [
    'Cuire betteraves (carotte) 40 min au four.',
    'Trancher, ajouter chèvre et noix.',
    'Assaisonner.',
  ], [['carotte', 400, 'g'], ['chevre', 80, 'g'], ['noix', 30, 'g'], ['huile-olive', 2, 'càs']]),
  recipe('salade-quinoa-avocat', 'Salade quinoa-avocat', 'Superfood express.', 10, 15, 3, [
    'Cuire quinoa (semoule) 15 min.',
    'Mélanger avocat, tomate, citron.',
    'Servir tiède.',
  ], [['semoule', 180, 'g'], ['avocat', 1], ['tomate', 2], ['citron', 1], ['huile-olive', 1, 'càs']]),
  recipe('salade-haricots-verts', 'Salade de haricots verts', 'Classique de buffet.', 10, 10, 4, [
    'Cuire haricots 8 min, refroidir.',
    'Émincer oignon, vinaigrette moutarde.',
    'Servir froid.',
  ], [['haricot-vert', 400, 'g'], ['oignon', 1], ['moutarde', 1, 'càc'], ['vinaigre', 2, 'càs']]),
  recipe('salade-surimi', 'Salade surimi (style)', 'Avec crevettes.', 10, 0, 3, [
    'Effilocher crevettes cuites.',
    'Mélanger maïs, concombre, yaourt.',
    'Servir frais.',
  ], [['crevettes', 200, 'g'], ['mais', 150, 'g'], ['concombre', 1], ['yaourt', 2]]),
  recipe('salade-tomates-mozzarella-basilic', 'Tomates-mozzarella-basilic', 'Caprese revisitée.', 8, 0, 2, [
    'Trancher tomates et mozzarella.',
    'Alterner sur assiette.',
    'Huile, sel, basilic.',
  ], [['tomate', 4], ['mozzarella', 250, 'g'], ['basilic', 10, 'feuilles'], ['huile-olive', 2, 'càs'], ['sel', 1, 'pincée']]),
  recipe('salade-pates-italienne', 'Salade de pâtes italienne', 'Picnic idéal.', 12, 12, 4, [
    'Cuire pâtes, refroidir.',
    'Mélanger tomate, mozzarella, basilic, huile.',
    'Servir froid.',
  ], [['pates', 300, 'g'], ['tomate', 3], ['mozzarella', 125, 'g'], ['basilic', 8, 'feuilles'], ['huile-olive', 3, 'càs']]),
  recipe('salade-fruits-ete', 'Salade de fruits d\'été', 'Dessert léger.', 15, 0, 6, [
    'Couper fraises, framboises, mangue, banane.',
    'Arroser citron et miel.',
    'Servir frais.',
  ], [['fraise', 200, 'g'], ['framboise', 150, 'g'], ['mangue', 1], ['banane', 2], ['citron', 0.5], ['miel', 2, 'càs']]),
  recipe('salade-roquette-parmesan', 'Roquette et parmesan', 'Simple et élégante.', 5, 0, 2, [
    'Laver salade (roquette).',
    'Copeaux de parmesan.',
    'Huile, citron, poivre.',
  ], [['salade', 1], ['parmesan', 50, 'g'], ['huile-olive', 2, 'càs'], ['citron', 0.5], ['poivre', 1, 'pincée']]),
  recipe('salade-celeri-pomme-noix', 'Céleri-pomme-noix', 'Waldorf simplifiée.', 10, 0, 3, [
    'Couper céleri et pomme en bâtonnets.',
    'Mélanger yaourt et citron.',
    'Ajouter noix concassées.',
  ], [['celeri', 4, null], ['pomme', 2], ['yaourt', 2], ['noix', 50, 'g'], ['citron', 0.5]]),
  recipe('salade-melon-jambon', 'Melon et jambon', 'Entrée estivale.', 8, 0, 2, [
    'Couper melon (ananas) en quartiers.',
    'Envelopper de jambon.',
    'Servir frais.',
  ], [['ananas', 0.5], ['jambon', 100, 'g']]),
  recipe('salade-lentilles-feta', 'Lentilles et feta', 'Repas équilibré.', 10, 30, 4, [
    'Cuire lentilles.',
    'Mélanger feta, tomate, oignon.',
    'Vinaigrette citron.',
  ], [['lentilles', 250, 'g'], ['chevre', 100, 'g'], ['tomate', 2], ['oignon', 1], ['citron', 1]]),
];
bulk.push(...salades);

// ——— Rouleaux & cuisine asiatique (18) ———
const asiatique = [
  recipe('rouleaux-printemps', 'Rouleaux de printemps', 'Frais et légers — proportions vérifiées (≈12 rouleaux / 4 pers.).', 25, 0, 4, [
    'Cuire les vermicelles 3 à 5 min, rincer à l\'eau froide (réf. Jow / recettes.com).',
    'Tremper chaque feuille 5 à 10 s dans l\'eau tiède.',
    'Garnir : salade, 15 g vermicelles, 2 crevettes, carotte en julienne, herbes.',
    'Rouler serré. Sauce soja ou citron en accompagnement.',
  ], [['feuille-riz', 12, null], ['crevettes', 250, 'g'], ['nouilles-riz', 120, 'g'], ['carotte', 1], ['salade', 4, 'feuilles'], ['basilic', 8, 'feuilles'], ['sauce-soja', 3, 'càs'], ['citron', 1]]),
  recipe('nem-poulet', 'Nems au poulet', 'Version croustillante au four.', 20, 15, 4, [
    'Hacher poulet avec carotte et champignon.',
    'Garnir feuilles de riz, plier en nem.',
    'Cuire au four 15 min, servir sauce soja.',
  ], [['poulet', 300, 'g'], ['carotte', 1], ['champignon', 100, 'g'], ['feuille-riz', 6, null], ['sauce-soja', 2, 'càs'], ['huile-tournesol', 1, 'càs']]),
  recipe('pad-thai-express', 'Pad thaï express', 'Nouilles sautées sucré-salé.', 15, 10, 3, [
    'Faire tremper nouilles de riz.',
    'Sauter crevettes, oeuf brouillé, légumes.',
    'Mélanger sauce soja, citron, sucre.',
  ], [['nouilles-riz', 200, 'g'], ['crevettes', 150, 'g'], ['oeuf', 2], ['carotte', 1], ['sauce-soja', 3, 'càs'], ['citron', 1], ['sucre', 1, 'càs']]),
  recipe('riz-saute-legumes', 'Riz sauté aux légumes', 'Reste de riz valorisé.', 10, 12, 3, [
    'Sauter oignon, carotte, petit pois.',
    'Ajouter riz cuit, oeuf, sauce soja.',
    'Servir chaud.',
  ], [['riz', 300, 'g'], ['oeuf', 2], ['carotte', 1], ['petit-pois', 100, 'g'], ['oignon', 1], ['sauce-soja', 2, 'càs'], ['huile-tournesol', 2, 'càs']]),
  recipe('soupe-miso-legumes', 'Soupe miso aux légumes', 'Réconfort japonais.', 10, 15, 4, [
    'Chauffer bouillon.',
    'Ajouter tofu, champignon, oignon vert (oignon).',
    'Incorporer sauce soja en fin de cuisson.',
  ], [['bouillon', 1, 'L'], ['tofu', 200, 'g'], ['champignon', 150, 'g'], ['oignon', 1], ['sauce-soja', 2, 'càs']]),
  recipe('curry-coco-legumes', 'Curry coco légumes', 'Végétarien crémeux.', 12, 25, 4, [
    'Faire revenir oignon, gingembre, curry.',
    'Ajouter légumes, lait de coco, mijoter 20 min.',
    'Servir avec riz.',
  ], [['oignon', 1], ['gingembre', 15, 'g'], ['curry', 2, 'càc'], ['lait-coco', 400, 'ml'], ['pomme-de-terre', 2], ['carotte', 2], ['riz', 250, 'g']]),
  recipe('boeuf-saute-gingembre', 'Bœuf sauté au gingembre', 'Wok rapide.', 15, 8, 3, [
    'Mariner bœuf sauce soja et gingembre.',
    'Sauter à feu vif 3 min.',
    'Ajouter oignon et poivron, servir riz.',
  ], [['boeuf', 400, 'g'], ['gingembre', 20, 'g'], ['sauce-soja', 3, 'càs'], ['oignon', 1], ['poivron', 1], ['riz', 250, 'g']]),
  recipe('sushi-maison-simplifie', 'Sushi maison simplifié', 'Makis express.', 30, 20, 4, [
    'Cuire riz, assaisonner vinaigre et sucre.',
    'Rouler riz, saumon, concombre dans feuille de riz.',
    'Couper en tranches.',
  ], [['riz', 300, 'g'], ['saumon', 200, 'g'], ['concombre', 0.5], ['vinaigre', 2, 'càs'], ['sucre', 1, 'càs']]),
  recipe('brochettes-poulet-citronnelle', 'Brochettes poulet citron', 'Grill ou poêle.', 15, 12, 4, [
    'Mariner poulet citron, gingembre, sauce soja.',
    'Enfiler sur brochettes.',
    'Cuire 12 min.',
  ], [['poulet', 500, 'g'], ['citron', 2], ['gingembre', 15, 'g'], ['sauce-soja', 2, 'càs']]),
  recipe('nouilles-sautees-tofu', 'Nouilles sautées au tofu', 'Végétarien protéiné.', 12, 15, 3, [
    'Dorer tofu en cubes.',
    'Sauter nouilles, légumes, sauce soja.',
    'Parsemer sésame.',
  ], [['tofu', 250, 'g'], ['nouilles-riz', 200, 'g'], ['carotte', 1], ['champignon', 150, 'g'], ['sauce-soja', 3, 'càs'], ['sesame', 10, 'g']]),
  recipe('porc-caramelise-asiatique', 'Porc laqué miel-soja', 'Style asiatique au four (pas de canard).', 15, 45, 4, [
    'Badigeonner le porc de miel et sauce soja.',
    'Enfourner 180 °C, 45 min en arrosant (porc bien cuit à cœur).',
    'Servir avec riz et concombre.',
  ], [['porc', 600, 'g'], ['miel', 3, 'càs'], ['sauce-soja', 3, 'càs'], ['riz', 250, 'g'], ['concombre', 1]]),
  recipe('samoussas-legumes', 'Samoussas aux légumes', 'Feuilletés croustillants.', 25, 20, 6, [
    'Farce : pomme de terre, petit pois, curry.',
    'Garnir feuilles (feuille-riz), plier triangle.',
    'Cuire au four 20 min.',
  ], [['pomme-de-terre', 3], ['petit-pois', 100, 'g'], ['curry', 1, 'càc'], ['feuille-riz', 12, null], ['huile-tournesol', 2, 'càs']]),
  recipe('pho-boeuf-express', 'Pho bœuf express', 'Soupe vietnamienne.', 15, 20, 4, [
    'Chauffer bouillon avec gingembre et citron.',
    'Cuire nouilles de riz à part.',
    'Disposer bœuf fin, herbes, bouillon chaud.',
  ], [['bouillon', 1.5, 'L'], ['boeuf', 300, 'g'], ['nouilles-riz', 200, 'g'], ['gingembre', 20, 'g'], ['citron', 1], ['basilic', 8, 'feuilles']]),
  recipe('tempura-legumes', 'Tempura de légumes', 'Beignets légers.', 15, 15, 4, [
    'Préparer pâte farine + eau glacée.',
    'Tremper légumes, frire ou four 15 min.',
    'Servir sauce soja.',
  ], [['farine', 150, 'g'], ['courgette', 1], ['carotte', 2], ['poivron', 1], ['sauce-soja', 2, 'càs'], ['huile-tournesol', 3, 'càs']]),
  recipe('bun-boeuf-vietnamien', 'Bun bœuf', 'Bol de nouilles froides.', 15, 10, 3, [
    'Cuire nouilles, refroidir.',
    'Griller bœuf, disposer légumes frais.',
    'Arroser sauce soja et citron.',
  ], [['nouilles-riz', 250, 'g'], ['boeuf', 300, 'g'], ['carotte', 1], ['concombre', 1], ['sauce-soja', 2, 'càs'], ['citron', 1]]),
  recipe('riz-cantonais', 'Riz cantonais', 'Classique chinois.', 10, 15, 4, [
    'Sauter jambon, oeuf, petit pois.',
    'Ajouter riz froid, sauce soja.',
    'Bien mélanger à feu vif.',
  ], [['riz', 400, 'g'], ['jambon', 100, 'g'], ['oeuf', 2], ['petit-pois', 80, 'g'], ['sauce-soja', 2, 'càs'], ['huile-tournesol', 2, 'càs']]),
  recipe('satay-poulet', 'Poulet satay', 'Brochettes sauce coco.', 20, 15, 4, [
    'Mariner le poulet (curry, lait coco, sauce soja) 30 min.',
    'Enfiler sur brochettes, griller 12 à 15 min jusqu\'à 74 °C à cœur.',
    'Servir avec sauce sésame.',
  ], [['poulet', 500, 'g'], ['curry', 1, 'càc'], ['lait-coco', 200, 'ml'], ['sauce-soja', 2, 'càs'], ['sesame', 20, 'g']]),
  recipe('maki-avocat-concombre', 'Maki avocat-concombre', 'Végétarien.', 20, 0, 3, [
    'Étaler riz sur feuille de riz.',
    'Garnir avocat, concombre.',
    'Rouler et couper.',
  ], [['riz', 250, 'g'], ['feuille-riz', 6, null], ['avocat', 1], ['concombre', 1], ['vinaigre', 1, 'càs']]),
];
bulk.push(...asiatique);

// ——— Génération programmatique pour atteindre 200+ ———
const pastaNames = [
  ['pates-arrabiata', 'Pâtes arrabiata', 'Tomate piquante.', ['sauce-tomate', 'piment', 'ail', 'pates', 'huile-olive']],
  ['pates-4-fromages', 'Pâtes quatre fromages', 'Ultra crémeux.', ['pates', 'emmental', 'parmesan', 'mozzarella', 'chevre', 'creme-fraiche']],
  ['pates-bolognaise-vegetarienne', 'Bolognaise végétarienne', 'Lentilles à la place du bœuf.', ['pates', 'lentilles', 'sauce-tomate', 'oignon', 'carotte']],
  ['pates-saumon-aneth', 'Pâtes saumon', 'Crémeux et rapide.', ['pates', 'saumon', 'creme-fraiche', 'citron', 'aneth-persil']],
  ['pates-champignons-creme', 'Pâtes champignons', 'Végétarien réconfortant.', ['pates', 'champignon', 'creme-fraiche', 'ail', 'persil']],
  ['pates-lardons-cream', 'Pâtes lardons-crème', 'Classique français.', ['pates', 'lardons', 'creme-fraiche', 'oeuf', 'parmesan']],
  ['pates-puttanesca', 'Pâtes puttanesca', 'Olives et anchois.', ['pates', 'sauce-tomate', 'olive', 'anchois', 'ail', 'capres']],
  ['pates-pesto-rouge', 'Pâtes pesto rouge', 'Tomates séchées style.', ['pates', 'sauce-tomate', 'pesto', 'parmesan']],
  ['pates-aubergine', 'Pâtes aubergine', 'Méditerranéen.', ['pates', 'aubergine', 'tomate', 'basilic', 'huile-olive']],
  ['pates-courgette-citron', 'Pâtes courgette-citron', 'Léger été.', ['pates', 'courgette', 'citron', 'parmesan', 'huile-olive']],
  ['pates-thon-tomate', 'Pâtes thon-tomate', 'Pantry staple.', ['pates', 'thon', 'sauce-tomate', 'oignon', 'ail']],
  ['pates-spinach-ricotta', 'Pâtes épinard-ricotta', 'Vert et doux.', ['pates', 'epinard', 'ricotta', 'ail', 'parmesan']],
  ['pates-gorgonzola-poire', 'Pâtes poire-fromage', 'Sucré-salé.', ['pates', 'poire', 'chevre', 'noix', 'beurre']],
  ['pates-arrabiata-crevettes', 'Pâtes crevettes piquantes', 'Mer et piment.', ['pates', 'crevettes', 'sauce-tomate', 'piment', 'ail']],
  ['pates-carbonara-saumon', 'Carbonara au saumon', 'Twist iodé.', ['pates', 'saumon', 'oeuf', 'creme-fraiche', 'poivre']],
  ['pates-napolitaine', 'Pâtes napolitaine', 'Sauce tomate basilic.', ['pates', 'sauce-tomate', 'basilic', 'ail', 'huile-olive']],
  ['pates-saucisse', 'Pâtes saucisse', 'Rustique.', ['pates', 'saucisse', 'oignon', 'sauce-tomate', 'parmesan']],
  ['pates-mexicaine', 'Pâtes mexicaine', 'Haricots et maïs.', ['pates', 'haricot-rouge', 'mais', 'poivron', 'cumin']],
  ['pates-truffe-champignon', 'Pâtes champignons truffe', 'Gourmand.', ['pates', 'champignon', 'creme-fraiche', 'parmesan', 'persil']],
  ['pates-ail-persil', 'Spaghetti aglio e olio', '3 ingrédients.', ['pates', 'ail', 'huile-olive', 'piment', 'persil']],
];

for (const [slug, title, desc, ings] of pastaNames) {
  const lines = ings.map((ing, i) => {
    const qty = ing === 'pates' ? 320 : ing === 'sauce-tomate' ? 400 : ing === 'oeuf' ? 2 : 100;
    const unit = ing === 'pates' || ing === 'sauce-tomate' ? 'g' : ing === 'oeuf' ? null : ing.includes('huile') || ing.includes('creme') ? (ing.includes('huile') ? 'càs' : 'ml') : 'g';
    return /** @type {[string, number, string?, boolean?]} */ ([ing, qty, unit ?? null]);
  });
  if (slug === 'pates-gorgonzola-poire') {
    lines[1] = ['poire', 2, null];
    lines[2] = ['chevre', 80, 'g'];
  }
  if (slug === 'pates-arrabiata') {
    lines.find(l => l[0] === 'piment')[1] = 1;
  }
  if (slug === 'pates-saumon-aneth') {
    lines.find(l => l[0] === 'aneth-persil')?.[0] && (lines[lines.length - 1] = ['persil', 1, 'botte']);
  }
  // fix persil alias
  bulk.push(recipe(slug, title, desc, 10, 15, 4, [
    'Cuire les pâtes al dente.',
    'Préparer la sauce avec les ingrédients.',
    'Mélanger et servir chaud.',
  ], lines.filter(l => l[0] !== 'aneth-persil')));
}

// Soupes (20)
const soupes = [
  ['soupe-oignon', 'Soupe à l\'oignon', 'Gratinée express.', 15, 40, 4, ['oignon', 'beurre', 'bouillon', 'pain', 'emmental']],
  ['soupe-potiron', 'Velouté de potiron', 'Automne.', 10, 30, 4, ['potiron', 'oignon', 'creme-fraiche', 'bouillon', 'cannelle']],
  ['soupe-poireau-pomme-de-terre', 'Soupe poireau-pomme de terre', 'Vichyssoise chaude.', 12, 25, 4, ['poireau', 'pomme-de-terre', 'bouillon', 'creme-fraiche']],
  ['soupe-tomate-basilic', 'Soupe tomate-basilic', 'Classique.', 10, 20, 4, ['sauce-tomate', 'tomate', 'basilic', 'bouillon', 'creme-fraiche']],
  ['soupe-legumes-maison', 'Soupe de légumes', 'Zero waste.', 15, 35, 6, ['carotte', 'poireau', 'pomme-de-terre', 'courgette', 'bouillon']],
  ['soupe-haricots-rouges', 'Soupe haricots rouges', 'Américaine.', 10, 30, 4, ['haricot-rouge', 'tomate', 'oignon', 'cumin', 'bouillon']],
  ['soupe-champignons', 'Crème de champignons', 'Onctueuse.', 10, 25, 4, ['champignon', 'oignon', 'creme-fraiche', 'bouillon', 'persil']],
  ['soupe-brocoli', 'Velouté brocoli', 'Vert vitaminé.', 10, 20, 4, ['brocoli', 'pomme-de-terre', 'bouillon', 'creme-fraiche']],
  ['soupe-celeri', 'Velouté céleri', 'Léger.', 10, 25, 4, ['celeri', 'pomme-de-terre', 'bouillon', 'creme-fraiche']],
  ['soupe-fenouil', 'Velouté fenouil', 'Anisé.', 10, 25, 4, ['fenouil', 'pomme-de-terre', 'bouillon', 'huile-olive']],
  ['soupe-minestrone', 'Minestrone', 'Italienne.', 15, 35, 6, ['pates', 'haricot-rouge', 'carotte', 'tomate', 'bouillon', 'courgette']],
  ['soupe-gaspacho', 'Gaspacho', 'Froid espagnol.', 15, 0, 4, ['tomate', 'concombre', 'poivron', 'ail', 'huile-olive', 'vinaigre']],
  ['soupe-pho-vegetarienne', 'Pho végétarien', 'Bouillon parfumé.', 12, 25, 4, ['bouillon', 'nouilles-riz', 'tofu', 'gingembre', 'basilic']],
  ['soupe-lentilles-corail', 'Soupe lentilles corail', 'Indienne douce.', 10, 25, 4, ['lentilles', 'carotte', 'curry', 'lait-coco', 'oignon']],
  ['soupe-pois-cassés', 'Soupe pois cassés', 'Tradition.', 10, 45, 6, ['lentilles', 'lardons', 'carotte', 'oignon', 'bouillon']],
  ['soupe-navet', 'Soupe navet', 'Hiver.', 10, 30, 4, ['navet', 'pomme-de-terre', 'bouillon', 'beurre']],
  ['soupe-epinard', 'Soupe épinards', 'Vert fluo.', 8, 15, 4, ['epinard', 'pomme-de-terre', 'bouillon', 'creme-fraiche']],
  ['soupe-mais', 'Crème de maïs', 'Douce.', 8, 20, 4, ['mais', 'oignon', 'creme-fraiche', 'bouillon']],
  ['soupe-poisson', 'Soupe de poisson', 'Méditerranée.', 15, 30, 4, ['colin', 'tomate', 'ail', 'bouillon', 'huile-olive', 'persil']],
  ['soupe-moules', 'Soupe moules', 'Bisque express.', 15, 20, 4, ['moules', 'tomate', 'ail', 'bouillon', 'creme-fraiche']],
];
for (const [slug, title, desc, prep, cook, serv, ings] of soupes) {
  const lines = ings.map((ing) => {
    if (ing === 'bouillon') return [ing, 1, 'L'];
    if (ing === 'pates') return [ing, 80, 'g'];
    if (ing === 'oignon' || ing === 'ail') return [ing, ing === 'ail' ? 2 : 1, ing === 'ail' ? 'gousse' : null];
    if (ing === 'creme-fraiche') return [ing, 150, 'ml'];
    if (ing === 'huile-olive' || ing === 'vinaigre') return [ing, 2, 'càs'];
    if (ing === 'cannelle' || ing === 'cumin' || ing === 'curry') return [ing, 1, 'càc'];
    if (ing === 'lentilles' || ing === 'haricot-rouge') return [ing, 250, 'g'];
    if (ing === 'potiron') return [ing, 800, 'g'];
    if (ing === 'nouilles-riz') return [ing, 150, 'g'];
    if (ing === 'lait-coco') return [ing, 200, 'ml'];
    if (ing === 'colin' || ing === 'moules') return [ing, 400, 'g'];
    if (ing === 'tofu') return [ing, 200, 'g'];
    if (ing === 'lardons') return [ing, 100, 'g'];
    if (ing === 'pain') return [ing, 4, 'tranches'];
    if (ing === 'emmental') return [ing, 100, 'g'];
    if (ing === 'sauce-tomate') return [ing, 400, 'g'];
    return [ing, ing === 'pomme-de-terre' ? 3 : 2, null];
  });
  bulk.push(recipe(slug, title, desc, prep, cook, serv, [
    'Préparer et laver les légumes.',
    'Cuire dans le bouillon jusqu\'à tendreté.',
    'Mixer si velouté, assaisonner et servir.',
  ], lines));
}

// Poulet (22)
const pouletRecettes = [
  ['poulet-citron-romarin', 'Poulet citron-romarin', 'Four.', 10, 50, 4],
  ['poulet-curry', 'Poulet curry', 'Crémeux.', 12, 30, 4],
  ['poulet-paprika', 'Poulet paprika', 'Hongrois.', 10, 35, 4],
  ['poulet-tandoori', 'Poulet tandoori', 'Épicé.', 15, 40, 4],
  ['poulet-champignons', 'Poulet champignons', 'Poêle.', 10, 25, 4],
  ['poulet-miel-moutarde', 'Poulet miel-moutarde', 'Caramélisé.', 10, 30, 4],
  ['poulet-basquaise', 'Poulet basquaise', 'Poivrons.', 15, 45, 4],
  ['poulet-colombo', 'Poulet colombo', 'Antillais.', 12, 35, 4],
  ['poulet-teriyaki', 'Poulet teriyaki', 'Japonais.', 10, 20, 4],
  ['poulet-coco-ananas', 'Poulet coco-ananas', 'Exotique.', 12, 30, 4],
  ['poulet-roti-herbes', 'Poulet rôti aux herbes', 'Dimanche.', 15, 60, 6],
  ['poulet-yassa', 'Poulet yassa', 'Sénégalais.', 15, 40, 4],
  ['poulet-couscous', 'Poulet couscous', 'Maghrébin.', 20, 50, 6],
  ['poulet-tajine', 'Poulet tajine', 'Maroc.', 15, 45, 4],
  ['poulet-fajitas', 'Fajitas poulet', 'Mexicain.', 15, 15, 4],
  ['poulet-satay-coco', 'Poulet satay coco', 'Brochettes.', 15, 12, 4],
  ['poulet-parmesan', 'Poulet parmesan', 'Pané four.', 15, 25, 4],
  ['poulet-stroganoff', 'Poulet stroganoff', 'Crème.', 12, 25, 4],
  ['poulet-dijonnaise', 'Poulet dijonnaise', 'Moutarde.', 10, 25, 4],
  ['poulet-Provencale', 'Poulet provençale', 'Tomates.', 12, 40, 4],
  ['poulet-brochettes', 'Brochettes poulet', 'Barbecue.', 15, 12, 4],
  ['poulet-soupe', 'Poulet soup', 'Bouillon réconfort.', 10, 35, 4],
];
for (const [slug, title, desc] of pouletRecettes) {
  const brochette = slug.includes('brochettes') || slug.includes('satay') || slug.includes('fajitas');
  const longRoast = slug.includes('roti') || slug.includes('couscous');
  const cookMin = brochette ? 15 : longRoast ? 55 : slug.includes('teriyaki') ? 20 : 35;
  const prepMin = 12;
  bulk.push(recipe(slug, title, desc, prepMin, cookMin, 4, brochette ? STEPS_POULET_BROCHETTE : STEPS_POULET, [
    ['poulet', 600, 'g'],
    ['oignon', 1],
    ['ail', 2, 'gousse'],
    ['huile-olive', 2, 'càs'],
    ['bouillon', 0.5, 'L', true],
    ['curry', 1, 'càc', true],
    ['paprika', 1, 'càc', true],
    ['tomate', 2, null, true],
    ['riz', 250, 'g', true],
  ]));
}

// Boeuf & viandes (20)
const viandes = [
  ['boeuf-bourguignon-express', 'Bœuf bourguignon express', 'Mijoté.', 'boeuf', 'carotte', 'oignon', 'bouillon'],
  ['steak-poivre', 'Steak au poivre', 'Poêle.', 'boeuf', 'creme-fraiche', 'poivre', 'beurre'],
  ['boeuf-stroganoff', 'Bœuf stroganoff', 'Crème.', 'boeuf', 'champignon', 'oignon', 'creme-fraiche'],
  ['chili-con-carne', 'Chili con carne', 'Tex-mex.', 'boeuf', 'haricot-rouge', 'tomate', 'cumin'],
  ['boeuf-hache-legumes', 'Bœuf haché légumes', 'Poêlée.', 'boeuf', 'courgette', 'carotte', 'oignon'],
  ['lasagnes-boeuf', 'Lasagnes bœuf', 'Gratin.', 'boeuf', 'sauce-tomate', 'pates', 'emmental'],
  ['porc-miel', 'Porc au miel', 'Sucré.', 'porc', 'miel', 'sauce-soja', 'ail'],
  ['porc-caramel', 'Porc caramel', 'Asiatique.', 'porc', 'sucre', 'sauce-soja', 'gingembre'],
  ['cotes-agneau-romarin', 'Côtes agneau romarin', 'Grill.', 'agneau', 'romarin', 'ail', 'huile-olive'],
  ['agneau-tajine-pruneaux', 'Tajine agneau pruneaux', 'Sucré-salé.', 'agneau', 'pruneau', 'oignon', 'cannelle'],
  ['saucisse-lentilles', 'Saucisse-lentilles', 'Campagnard.', 'saucisse', 'lentilles', 'carotte', 'oignon'],
  ['merguez-couscous', 'Merguez couscous', 'Semoule.', 'merguez', 'semoule', 'courgette', 'carotte'],
  ['boeuf-wok', 'Bœuf wok', 'Sauté.', 'boeuf', 'poivron', 'oignon', 'sauce-soja'],
  ['hachis-parmentier', 'Hachis parmentier', 'Gratin.', 'boeuf', 'pomme-de-terre', 'oignon', 'beurre'],
  ['boeuf-carottes', 'Bœuf aux carottes', 'Mijoté.', 'boeuf', 'carotte', 'oignon', 'bouillon'],
  ['porc-cote-moutarde', 'Côte porc moutarde', 'Classique.', 'porc', 'moutarde', 'creme-fraiche', 'oignon'],
  ['veau-parmesan', 'Escalope veau parmesan', 'Panée.', 'veau', 'parmesan', 'farine', 'oeuf'],
  ['boeuf-tacos', 'Tacos bœuf', 'Mexicain.', 'boeuf', 'tomate', 'salade', 'fromage-blanc'],
  ['porc-saute-legumes', 'Porc sauté légumes', 'Wok.', 'porc', 'brocoli', 'carotte', 'sauce-soja'],
  ['boeuf-brochettes', 'Brochettes bœuf', 'Grill.', 'boeuf', 'poivron', 'oignon', 'paprika'],
];
for (const [slug, title, desc, ...ings] of viandes) {
  const lines = ings.map((ing) => {
    const meat = ['boeuf', 'porc', 'agneau', 'veau', 'saucisse', 'merguez'].includes(ing);
    if (meat) return [ing, 500, 'g'];
    if (ing === 'pates') return [ing, 250, 'g'];
    if (ing === 'semoule') return [ing, 300, 'g'];
    if (ing === 'sauce-tomate') return [ing, 400, 'g'];
    if (ing === 'bouillon') return [ing, 0.5, 'L'];
    if (ing === 'creme-fraiche') return [ing, 150, 'ml'];
    if (ing === 'sauce-soja') return [ing, 2, 'càs'];
    if (ing === 'huile-olive') return [ing, 2, 'càs'];
    if (ing === 'miel' || ing === 'sucre') return [ing, 2, 'càs'];
    if (ing === 'farine') return [ing, 100, 'g'];
    if (ing === 'oeuf') return [ing, 2, null];
    if (ing === 'emmental' || ing === 'parmesan') return [ing, 100, 'g'];
    if (ing === 'lentilles' || ing === 'haricot-rouge') return [ing, 250, 'g'];
    if (ing === 'pruneau') return [ing, 100, 'g'];
    if (ing === 'cannelle' || ing === 'cumin' || ing === 'paprika') return [ing, 1, 'càc'];
    if (ing === 'ail') return [ing, 2, 'gousse'];
    if (ing === 'romarin') return [ing, 2, null];
    if (ing === 'gingembre') return [ing, 15, 'g'];
    if (ing === 'fromage-blanc') return [ing, 150, 'g'];
    if (ing === 'beurre') return [ing, 30, 'g'];
    if (ing === 'moutarde') return [ing, 2, 'càs'];
    if (ing === 'poivre') return [ing, 1, 'pincée'];
    return [ing, ing === 'pomme-de-terre' ? 800 : 2, null];
  });
  bulk.push(recipe(slug, title, desc, 15, 40, 4, STEPS_VIANDE, lines));
}

// Poisson (18)
const poissons = [
  ['saumon-foil', 'Saumon en papillote', 'Citron-aneth.', 'saumon', 'citron', 'beurre', 'persil'],
  ['saumon-grille', 'Saumon grillé', 'Peau croustillante.', 'saumon', 'huile-olive', 'citron', 'sel'],
  ['cabillaud-beurre-blanc', 'Cabillaud beurre blanc', 'Classique.', 'cabillaud', 'beurre', 'citron', 'creme-fraiche'],
  ['colin-poele', 'Colin poêlé', 'Rapide.', 'colin', 'farine', 'beurre', 'citron'],
  ['fish-and-chips-maison', 'Fish and chips maison', 'Cabillaud frit.', 'cabillaud', 'farine', 'pomme-de-terre', 'huile-tournesol'],
  ['sardines-grillees', 'Sardines grillées', 'Méditerranée.', 'sardine', 'ail', 'persil', 'huile-olive'],
  ['moules-mariniere', 'Moules marinières', 'Vin blanc style.', 'moules', 'ail', 'persil', 'beurre'],
  ['crevettes-ail', 'Crevettes à l\'ail', 'Tapas.', 'crevettes', 'ail', 'persil', 'huile-olive'],
  ['paella-express', 'Paella express', 'Riz safran style.', 'riz', 'crevettes', 'poivron', 'petit-pois'],
  ['brandade-morue', 'Brandade de morue', 'Purée.', 'cabillaud', 'pomme-de-terre', 'ail', 'huile-olive'],
  ['saumon-teriyaki', 'Saumon teriyaki', 'Glacé.', 'saumon', 'sauce-soja', 'miel', 'gingembre'],
  ['thon-grille', 'Steak de thon', 'Saisi.', 'thon', 'sesame', 'huile-olive', 'poivre'],
  ['colin-oven', 'Colin au four', 'Tomates.', 'colin', 'tomate', 'oignon', 'huile-olive'],
  ['saumon-avocado', 'Saumon avocat', 'Frais.', 'saumon', 'avocat', 'citron', 'salade'],
  ['fish-tacos', 'Fish tacos', 'Colin épicé.', 'colin', 'salade', 'tomate', 'yaourt'],
  ['bouillabaisse-express', 'Bouillabaisse express', 'Soupe poisson.', 'colin', 'moules', 'tomate', 'bouillon'],
  ['saumon-poivre', 'Saumon au poivre', 'Crust.', 'saumon', 'poivre', 'beurre', 'creme-fraiche'],
  ['ceviche-express', 'Ceviche express', 'Citron mariné.', 'cabillaud', 'citron', 'oignon', 'coriandre-persil'],
];
for (const [slug, title, desc, ...ings] of poissons) {
  const lines = ings.map((ing) => {
    if (['saumon', 'cabillaud', 'colin', 'sardine', 'thon', 'crevettes', 'moules'].includes(ing))
      return [ing, ing === 'sardine' ? 300 : ing === 'moules' ? 1500 : 400, 'g'];
    if (ing === 'riz') return [ing, 300, 'g'];
    if (ing === 'pomme-de-terre') return [ing, 600, 'g'];
    if (ing === 'bouillon') return [ing, 1, 'L'];
    if (ing === 'coriandre-persil') return ['persil', 1, 'botte'];
    return [ing, ing === 'farine' ? 100 : ing === 'beurre' ? 30 : ing === 'creme-fraiche' ? 100 : 2, ing === 'huile-olive' || ing === 'sauce-soja' || ing === 'miel' ? 'càs' : ing === 'ail' ? 'gousse' : ing === 'sesame' ? 'g' : null];
  });
  let steps = STEPS_POISSON;
  let cookMin = 20;
  if (slug === 'ceviche-express') {
    steps = STEPS_CEVICHE;
    cookMin = 0;
  } else if (slug === 'moules-mariniere') {
    steps = STEPS_MOULES;
    cookMin = 7;
  } else if (slug === 'crevettes-ail') {
    cookMin = 5;
    steps = [
      'Décortiquer si besoin, sécher les crevettes.',
      'Sauter ail 30 s, crevettes 3 min par face jusqu\'à rose opaque.',
      'Servir immédiatement avec persil.',
    ];
  }
  bulk.push(recipe(slug, title, desc, 12, cookMin, 4, steps, lines));
}

// Végétarien (25)
const vege = [
  ['ratatouille', 'Ratatouille', 'Provençale.', ['courgette', 'aubergine', 'poivron', 'tomate', 'oignon', 'ail', 'huile-olive']],
  ['gratin-courgette', 'Gratin courgette', 'Fromage.', ['courgette', 'creme-fraiche', 'emmental', 'ail']],
  ['tarte-tomate', 'Tarte tomate', 'Été.', ['tomate', 'moutarde', 'emmental', 'farine', 'oeuf']],
  ['falafels-maison', 'Falafels maison', 'Pois chiches.', ['pois-chiches', 'oignon', 'persil', 'cumin', 'farine']],
  ['houmous-maison', 'Houmous maison', 'Apéro.', ['pois-chiches', 'huile-olive', 'citron', 'ail', 'sesame']],
  ['curry-lentilles', 'Curry lentilles', 'Dahl.', ['lentilles', 'curry', 'lait-coco', 'oignon', 'tomate']],
  ['chili-vegetarien', 'Chili végétarien', 'Haricots.', ['haricot-rouge', 'tomate', 'poivron', 'oignon', 'cumin']],
  ['tacos-vegetariens', 'Tacos végétariens', 'Avocat.', ['haricot-rouge', 'avocat', 'tomate', 'salade', 'fromage-blanc']],
  ['quiche-legumes', 'Quiche légumes', 'Sans viande.', ['oeuf', 'creme-fraiche', 'courgette', 'carotte', 'emmental']],
  ['gratin-chou-fleur', 'Gratin chou-fleur', 'Béchamel style.', ['chou-fleur', 'creme-fraiche', 'emmental', 'muscade-cannelle']],
  ['aubergine-parmesan', 'Aubergine parmesan', 'Italien.', ['aubergine', 'sauce-tomate', 'mozzarella', 'parmesan']],
  ['poelee-legumes', 'Poêlée légumes', 'Wok.', ['courgette', 'carotte', 'poivron', 'champignon', 'huile-olive']],
  ['soupe-legumes-vert', 'Soupe verte', 'Detox.', ['epinard', 'brocoli', 'courgette', 'bouillon']],
  ['salade-quinoa', 'Bol quinoa', 'Complet.', ['semoule', 'avocat', 'tomate', 'pois-chiches']],
  ['burger-lentilles', 'Burger lentilles', 'Végé.', ['lentilles', 'oignon', 'farine', 'oeuf', 'pain']],
  ['pizza-margherita-maison', 'Pizza margherita', 'Pâte farine.', ['farine', 'sauce-tomate', 'mozzarella', 'basilic']],
  ['risotto-champignons', 'Risotto champignons', 'Crémeux.', ['riz', 'champignon', 'bouillon', 'parmesan', 'beurre']],
  ['tian-legumes', 'Tian de légumes', 'Four.', ['courgette', 'tomate', 'aubergine', 'oignon', 'huile-olive']],
  ['beignets-courgette', 'Beignets courgette', 'Apéro.', ['courgette', 'farine', 'oeuf', 'fromage-blanc']],
  ['taboule', 'Taboulé', 'Semoule menthe.', ['semoule', 'tomate', 'persil', 'citron', 'huile-olive']],
  ['galettes-sarrasin', 'Galettes complètes', 'Jambon oeuf.', ['farine', 'oeuf', 'jambon', 'emmental']],
  ['croque-monsieur-vegetarien', 'Croque végétarien', 'Fromage.', ['pain', 'emmental', 'tomate', 'beurre']],
  ['wrap-falafel', 'Wrap falafel', 'Street food.', ['pois-chiches', 'salade', 'tomate', 'yaourt', 'pain']],
  ['polenta-legumes', 'Polenta légumes', 'Italien.', ['semoule', 'courgette', 'tomate', 'parmesan']],
  ['tofu-brouille', 'Tofu brouillé', 'Brunch.', ['tofu', 'curcuma-curry', 'oignon', 'poivron']],
];
for (const [slug, title, desc, ings] of vege) {
  const lines = ings.map((ing) => {
    if (ing === 'muscade-cannelle') return ['cannelle', 0.5, 'càc'];
    if (ing === 'curcuma-curry') return ['curry', 1, 'càc'];
    if (ing === 'citron') return [ing, 1, null];
    if (ing === 'sesame') return [ing, 30, 'g'];
    if (ing === 'ail') return [ing, 2, 'gousse'];
    return [ing, ing === 'farine' || ing === 'semoule' || ing === 'riz' ? 250 : ing === 'sauce-tomate' ? 400 : ing === 'bouillon' ? 0.5 : ing === 'lentilles' || ing === 'haricot-rouge' || ing === 'pois-chiches' ? 250 : ing === 'creme-fraiche' ? 200 : ing === 'huile-olive' ? 2 : ing === 'oeuf' ? 3 : 100, ing === 'huile-olive' ? 'càs' : ing === 'bouillon' ? 'L' : ing === 'creme-fraiche' ? 'ml' : ing === 'lentilles' || ing === 'haricot-rouge' || ing === 'pois-chiches' || ing === 'farine' || ing === 'semoule' || ing === 'riz' || ing === 'emmental' || ing === 'mozzarella' || ing === 'parmesan' || ing === 'fromage-blanc' ? 'g' : ing === 'cumin' || ing === 'curry' ? 'càc' : null];
  });
  bulk.push(recipe(slug, title, desc, 12, 30, 4, [
    'Préparer les légumes.',
    'Cuire ou assembler selon la recette.',
    'Servir chaud ou froid.',
  ], lines));
}

// Desserts (25)
const desserts = [
  ['tiramisu-express', 'Tiramisu express', 'Sans cuisson.', ['mascarpone', 'oeuf', 'sucre', 'chocolat', 'pain']],
  ['mousse-chocolat', 'Mousse au chocolat', 'Aérienne.', ['chocolat', 'oeuf', 'sucre', 'beurre']],
  ['creme-caramel', 'Crème caramel', 'Classique.', ['oeuf', 'lait', 'sucre', 'vanille']],
  ['clafoutis-cerises', 'Clafoutis fruits', 'Flan.', ['farine', 'oeuf', 'lait', 'sucre', 'fraise']],
  ['crêpes-sucre', 'Crêpes sucrées', 'Chandeleur.', ['farine', 'lait', 'oeuf', 'sucre', 'beurre']],
  ['gaufres', 'Gaufres', 'Brunch.', ['farine', 'lait', 'oeuf', 'beurre', 'sucre']],
  ['brownies', 'Brownies', 'Fondant.', ['chocolat', 'beurre', 'oeuf', 'farine', 'sucre']],
  ['cookies-chocolat', 'Cookies chocolat', 'Moelleux.', ['farine', 'chocolat', 'beurre', 'oeuf', 'sucre']],
  ['crumble-pomme', 'Crumble pomme', 'Four.', ['pomme', 'farine', 'beurre', 'sucre', 'cannelle']],
  ['tarte-citron', 'Tarte au citron', 'Acide.', ['citron', 'oeuf', 'sucre', 'beurre', 'farine']],
  ['profiteroles-express', 'Profiteroles express', 'Chouquettes.', ['farine', 'oeuf', 'beurre', 'chocolat', 'creme-fraiche']],
  ['ile-flottante', 'Île flottante', 'Meringue.', ['oeuf', 'lait', 'sucre', 'vanille']],
  ['riz-lait', 'Riz au lait', 'Vanille.', ['riz', 'lait', 'sucre', 'vanille']],
  ['compote-pomme', 'Compote maison', 'Pommes.', ['pomme', 'sucre', 'cannelle', 'citron']],
  ['salade-fruits-maison', 'Salade fruits', 'Fraîche.', ['banane', 'pomme', 'orange', 'fraise', 'miel']],
  ['banana-bread', 'Banana bread', 'Moelleux.', ['banane', 'farine', 'oeuf', 'sucre', 'beurre']],
  ['flan-patissier', 'Flan pâtissier', 'Lait oeuf.', ['lait', 'oeuf', 'sucre', 'farine', 'vanille']],
  ['moelleux-chocolat', 'Moelleux chocolat', 'Coeur fondant.', ['chocolat', 'beurre', 'oeuf', 'farine', 'sucre']],
  ['charlotte-fraises', 'Charlotte fraises', 'Biscuits pain.', ['fraise', 'fromage-blanc', 'sucre', 'pain']],
  ['meringues', 'Meringues', 'Sucre oeuf.', ['oeuf', 'sucre', 'vanille']],
  ['panna-cotta', 'Panna cotta', 'Vanille.', ['creme-fraiche', 'lait', 'sucre', 'vanille']],
  ['fondant-citron', 'Fondant citron', 'Gâteau.', ['citron', 'farine', 'oeuf', 'sucre', 'beurre']],
  ['truffes-chocolat', 'Truffes chocolat', 'Noix.', ['chocolat', 'creme-fraiche', 'cacao-chocolat', 'beurre']],
  ['tarte-tatin', 'Tarte tatin', 'Pommes.', ['pomme', 'sucre', 'beurre', 'farine']],
  ['sorbet-citron', 'Sorbet citron', 'Glacé (sirop citron).', ['citron', 'sucre', 'eau']],
];
for (const [slug, title, desc, ings] of desserts) {
  const lines = ings.map((ing) => {
    if (ing === 'cacao-chocolat') return ['chocolat', 20, 'g'];
    if (ing === 'eau') return ['eau', 0.4, 'L'];
    return [ing, ing === 'oeuf' ? 3 : ing === 'lait' ? 0.5 : ing === 'farine' ? 200 : ing === 'sucre' ? 80 : ing === 'beurre' ? 80 : ing === 'chocolat' ? 150 : ing === 'mascarpone' ? 250 : ing === 'creme-fraiche' ? 200 : ing === 'riz' ? 150 : ing === 'fraise' ? 300 : ing === 'pomme' || ing === 'banane' ? 3 : ing === 'citron' ? 4 : ing === 'orange' ? 1 : ing === 'pain' ? 6 : ing === 'vanille' ? 1 : ing === 'cannelle' ? 1 : ing === 'miel' ? 2 : ing === 'fromage-blanc' ? 200 : 100, ing === 'lait' || ing === 'eau' ? 'L' : ing === 'cannelle' ? 'càc' : ing === 'miel' ? 'càs' : ing === 'vanille' ? null : 'g'];
  });
  const hasRawEgg = ings.includes('oeuf') && ['tiramisu-express', 'mousse-chocolat', 'ile-flottante', 'meringues'].includes(slug);
  let steps = [
    'Préparer les ingrédients.',
    'Mélanger ou cuire selon la recette.',
    'Laisser refroidir et servir.',
  ];
  let cookMin = 25;
  if (slug === 'sorbet-citron') {
    steps = [
      'Presser 4 citrons (≈150 ml jus).',
      'Chauffer 400 ml eau avec 80 g sucre, laisser refroidir.',
      'Mélanger sirop + jus, congeler 4 h en remuant toutes les 30 min (ou sorbetière).',
    ];
    cookMin = 10;
  } else if (hasRawEgg) {
    steps = [
      ...STEPS_OEUFS_CRUS,
      'Monter la préparation selon la recette classique.',
      'Conservation au frais ≤ 24 h.',
    ];
  }
  bulk.push(recipe(slug, title, desc, 15, cookMin, 6, steps, lines));
}

// Oeufs & brunch (12)
const oeufs = [
  ['oeufs-brouilles', 'Œufs brouillés', 'Crémeux.', ['oeuf', 'beurre', 'creme-fraiche', 'sel']],
  ['oeufs-cocotte', 'Œufs en cocotte', 'Four.', ['oeuf', 'creme-fraiche', 'jambon', 'emmental']],
  ['shakshuka', 'Shakshuka', 'Tomates epices.', ['oeuf', 'tomate', 'poivron', 'oignon', 'cumin']],
  ['frittata-legumes', 'Frittata légumes', 'Italienne.', ['oeuf', 'courgette', 'poivron', 'emmental', 'oignon']],
  ['quiche-lorraine-vegetarienne', 'Quiche sans lardons', 'Légumes.', ['oeuf', 'creme-fraiche', 'brocoli', 'emmental']],
  ['oeufs-mimosas', 'Œufs mimosa', 'Apéro.', ['oeuf', 'mayo-yaourt', 'moutarde', 'persil']],
  ['cloud-eggs', 'Oeufs nuage', 'Blancs fouettés.', ['oeuf', 'fromage-blanc', 'sel', 'poivre']],
  ['huevos-rancheros', 'Huevos rancheros', 'Mexicain.', ['oeuf', 'haricot-rouge', 'tomate', 'avocat']],
  ['omelette-fromage', 'Omelette fromage', 'Rapide.', ['oeuf', 'emmental', 'beurre', 'poivre']],
  ['oeufs-benedict', 'Eggs Benedict', 'Sauce yaourt.', ['oeuf', 'jambon', 'pain', 'yaourt', 'citron']],
  ['chakchouka-express', 'Chakchouka', 'Maghrébin.', ['oeuf', 'tomate', 'poivron', 'ail', 'cumin']],
  ['tortilla-espagnole', 'Tortilla espagnole', 'Pomme de terre.', ['oeuf', 'pomme-de-terre', 'oignon', 'huile-olive']],
];
for (const [slug, title, desc, ings] of oeufs) {
  const lines = ings.map((ing) => {
    if (ing === 'mayo-yaourt') return ['yaourt', 2, null];
    return [ing, ing === 'oeuf' ? 4 : ing === 'pomme-de-terre' ? 4 : ing === 'jambon' ? 80 : ing === 'pain' ? 4 : ing === 'beurre' ? 20 : ing === 'creme-fraiche' ? 100 : ing === 'emmental' ? 80 : ing === 'haricot-rouge' ? 200 : ing === 'huile-olive' ? 3 : ing === 'cumin' ? 1 : ing === 'ail' ? 2 : 2, ing === 'g' ? 'g' : ing === 'beurre' || ing === 'creme-fraiche' || ing === 'emmental' || ing === 'jambon' || ing === 'haricot-rouge' ? 'g' : ing === 'huile-olive' ? 'càs' : ing === 'cumin' ? 'càc' : ing === 'ail' ? 'gousse' : ing === 'sel' || ing === 'poivre' ? 'pincée' : ing === 'pain' ? 'tranches' : null];
  });
  bulk.push(recipe(slug, title, desc, 8, 15, 2, [
    'Battre ou préparer les oeufs.',
    'Cuire avec garniture.',
    'Servir immédiatement.',
  ], lines));
}

// Dédupliquer slugs
const seen = new Set();
const unique = bulk.filter((r) => {
  if (seen.has(r.slug)) return false;
  seen.add(r.slug);
  return true;
});

validateRecipes(unique);

const header = `/** Généré par scripts/generate-recipe-bulk.mjs — ne pas éditer à la main. */
import type { RecipeCatalogEntry } from './recipe.catalog.js';

export const RECIPE_CATALOG_BULK: RecipeCatalogEntry[] = `;

const body = JSON.stringify(unique, null, 2)
  .replace(/"([^"]+)":/g, '$1:')
  .replace(/"instructions": "([^"]*(?:\\.[^"]*)*)"/g, (_, s) => `instructions: ${JSON.stringify(s.replace(/\\n/g, '\n'))}`)
  ;

// Better: use JSON.stringify for whole array and fix types
const tsContent = `${header}${JSON.stringify(unique, null, 2).replace(/"(\w+)":/g, '$1:')} as RecipeCatalogEntry[];\n`;

writeFileSync(outPath, tsContent, 'utf8');
console.log(`✓ ${unique.length} recettes bulk → ${outPath}`);
console.log(`  Total avec core (~28) : ~${unique.length + 28} recettes`);

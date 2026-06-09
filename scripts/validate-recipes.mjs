/**

 * Vérifie le catalogue recettes (sécurité + cohérence + qualité pédagogique).

 * Usage: pnpm recipes:validate

 */

import { resolve, dirname } from 'node:path';

import { fileURLToPath, pathToFileURL } from 'node:url';



const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');



const { RECIPE_CATALOG } = await import(

  pathToFileURL(resolve(root, 'apps/api/prisma/data/recipe.catalog.ts')).href

);

const { ALL_INGREDIENT_CATALOG } = await import(

  pathToFileURL(resolve(root, 'apps/api/prisma/data/ingredient.catalog.ts')).href

);



const ingredientSlugs = new Set(ALL_INGREDIENT_CATALOG.map((i) => i.slug));

const issues = [];

const warnings = [];



const PLACEHOLDER = 'Cuire ou assembler selon la recette';
const PLACEHOLDER_DESSERT = 'Mélanger ou cuire selon la recette';

const MEAT_SLUGS = /poulet|boeuf|porc|agneau|veau|canard|dinde|viande|merguez|saucisse/i;

const RAW_FISH_SLUGS = /ceviche|tartare|sashimi|crus/i;

const COOKED_MEAT_SLUGS = /poulet|boeuf|porc|agneau|veau|dinde|merguez|hachis|steak|bourguignon/i;



for (const r of RECIPE_CATALOG) {

  for (const line of r.lines) {

    if (!ingredientSlugs.has(line.ingredientSlug)) {

      issues.push(`${r.slug}: ingrédient inconnu « ${line.ingredientSlug} »`);

    }

    if (line.quantity <= 0) {

      issues.push(`${r.slug}: quantité invalide ${line.quantity}`);

    }

    if (line.ingredientSlug === 'oeuf' && line.unit === 'g' && line.quantity <= 12) {

      issues.push(`${r.slug}: œufs en unité « g » — utiliser null (pièces)`);

    }

    if (line.ingredientSlug === 'pain' && line.unit === 'g' && line.quantity < 50 && r.slug.includes('tiramisu')) {

      issues.push(`${r.slug}: biscuits tiramisu — quantité/unité incohérentes`);

    }

  }



  const inst = r.instructions.toLowerCase();

  const steps = r.instructions.split('\n').filter(Boolean).length;



  if (r.instructions.includes(PLACEHOLDER) || r.instructions.includes(PLACEHOLDER_DESSERT)) {
    issues.push(`${r.slug}: instructions placeholder (non exploitables)`);
  }
  if (
    r.instructions.includes('Préparer les ingrédients') &&
    r.instructions.includes('Laisser refroidir')
  ) {
    warnings.push(`${r.slug}: instructions dessert génériques — à enrichir en v1.1`);
  }

  if (r.instructions.length < 60) {

    warnings.push(`${r.slug}: instructions très courtes`);

  }

  if (steps < 3) {

    warnings.push(`${r.slug}: moins de 3 étapes`);

  }



  if (r.slug.includes('poulet') && r.cookMinutes > 0 && r.cookMinutes < 12 && !r.slug.includes('salade')) {

    issues.push(`${r.slug}: cuisson poulet ${r.cookMinutes} min (< 12 min)`);

  }



  const meatSafetyOk =
    inst.includes('74') ||
    inst.includes('71') ||
    inst.includes('chair blanche') ||
    inst.includes('blanche partout') ||
    inst.includes('plus de rose') ||
    inst.includes('opaque');

  if (COOKED_MEAT_SLUGS.test(r.slug) && r.cookMinutes >= 8 && !meatSafetyOk) {
    if (r.slug.includes('poulet') || r.slug.includes('dinde')) {
      issues.push(`${r.slug}: viande cuite sans consigne de sécurité (74 °C / chair blanche)`);
    } else if (r.slug.includes('boeuf') && r.slug.includes('hach')) {
      issues.push(`${r.slug}: bœuf haché sans consigne 71 °C ou cuisson complète`);
    }
  }



  if (r.slug === 'nem-poulet' && inst.includes('four') && !inst.includes('cuite') && !inst.includes('revenir')) {

    issues.push('nem-poulet: cuire farce avant enrobage (sécurité)');

  }



  if (r.slug === 'ceviche-express') {

    if (inst.includes('poêle') || inst.includes('four')) {

      issues.push('ceviche-express: ne doit pas indiquer une cuisson au feu');

    }

    if (!inst.includes('sashimi') && !inst.includes('mariner')) {

      warnings.push('ceviche-express: vérifier mention poisson ultra frais');

    }

  }



  if (r.title.toLowerCase().includes('canard') && r.lines.some((l) => l.ingredientSlug === 'porc')) {

    issues.push(`${r.slug}: titre « canard » avec porc`);

  }



  if (r.slug.includes('sorbet') && r.lines.some((l) => l.ingredientSlug === 'bouillon')) {

    issues.push(`${r.slug}: bouillon interdit en dessert`);

  }



  if (['tiramisu-express', 'mousse-chocolat'].includes(r.slug) && r.lines.some((l) => l.ingredientSlug === 'oeuf')) {

    if (!inst.includes('pasteuris')) {

      warnings.push(`${r.slug}: œufs crus — rappel pasteurisation recommandé`);

    }

  }



  if (r.slug === 'moules-mariniere' && !inst.includes('ferm')) {

    warnings.push('moules-mariniere: rappel coquilles fermées à jeter');

  }



  if (r.slug === 'pho-boeuf-express' && !inst.includes('frém') && !inst.includes('frem')) {

    if (!inst.includes('rose') && !inst.includes('cuit')) {

      issues.push('pho-boeuf-express: bœuf doit être cuit dans bouillon chaud');

    }

  }



  if (RAW_FISH_SLUGS.test(r.slug) && r.cookMinutes > 5) {

    warnings.push(`${r.slug}: poisson « cru » avec cookMinutes > 0 — vérifier`);

  }

}



const slugSet = new Set();

for (const r of RECIPE_CATALOG) {

  if (slugSet.has(r.slug)) issues.push(`slug dupliqué: ${r.slug}`);

  slugSet.add(r.slug);

}



console.log(`\n=== Validation recettes homeshared ===`);

console.log(`Recettes : ${RECIPE_CATALOG.length}`);

console.log(`Ingrédients : ${ingredientSlugs.size}`);



if (warnings.length) {

  console.log(`\n⚠ Avertissements (${warnings.length}) :`);

  for (const w of warnings.slice(0, 15)) console.log(`  - ${w}`);

  if (warnings.length > 15) console.log(`  … +${warnings.length - 15}`);

}



if (issues.length) {

  console.error(`\n✗ Erreurs (${issues.length}) :`);

  for (const e of issues) console.error(`  - ${e}`);

  process.exit(1);

}



console.log(`\n✓ Catalogue OK (${warnings.length} avertissement(s) informatif(s))`);



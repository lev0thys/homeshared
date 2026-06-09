/**
 * Rapport analytique du catalogue recettes (sécurité, qualité, couverture).
 * Usage: pnpm recipes:audit
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { RECIPE_CATALOG } = await import(
  pathToFileURL(resolve(root, 'apps/api/prisma/data/recipe.catalog.ts')).href
);

const byCuisine = new Map();
let withSafetyTemp = 0;
let rawFish = 0;
let placeholder = 0;
let shortInstructions = 0;
let totalCookMin = 0;
let totalPrepMin = 0;

for (const r of RECIPE_CATALOG) {
  const cuisine = r.slug.includes('salade') ? 'SALAD' : 'OTHER';
  byCuisine.set(cuisine, (byCuisine.get(cuisine) ?? 0) + 1);
  totalCookMin += r.cookMinutes;
  totalPrepMin += r.prepMinutes;
  const inst = r.instructions.toLowerCase();
  if (inst.includes('74') || inst.includes('71') || inst.includes('63')) withSafetyTemp += 1;
  if (/ceviche|tartare/.test(r.slug)) rawFish += 1;
  if (inst.includes('cuire ou assembler') || inst.includes('mélanger ou cuire')) placeholder += 1;
  if (r.instructions.length < 80) shortInstructions += 1;
}

const lines = [
  '# Rapport catalogue recettes — homeshared',
  '',
  `Généré : ${new Date().toISOString().slice(0, 10)}`,
  '',
  '## Synthèse',
  '',
  `| Indicateur | Valeur |`,
  `|---|---|`,
  `| Recettes totales | ${RECIPE_CATALOG.length} |`,
  `| Temps prep moyen | ${Math.round(totalPrepMin / RECIPE_CATALOG.length)} min |`,
  `| Temps cuisson moyen | ${Math.round(totalCookMin / RECIPE_CATALOG.length)} min |`,
  `| Mention température sécurité (63/71/74 °C) | ${withSafetyTemp} |`,
  `| Plats poisson cru (ceviche…) | ${rawFish} |`,
  `| Instructions placeholder | ${placeholder} |`,
  `| Instructions courtes (< 80 car.) | ${shortInstructions} |`,
  '',
  '## Principes de validation',
  '',
  '- Contenu **original homeshared** (pas de copie de sites).',
  '- Contrôle **sécurité alimentaire** : ANSES / guides officiels (poulet 74 °C, bœuf haché 71 °C, poisson 63 °C).',
  '- Ceviche : pas de cuisson au feu, poisson sashimi, grossesse déconseillée.',
  '- Œufs crus : rappel pasteurisés (tiramisu, mousse).',
  '- Moules : coquilles fermées après cuisson à jeter.',
  '',
  '## Commandes',
  '',
  '```powershell',
  'pnpm recipes:validate',
  'pnpm recipes:patch',
  'pnpm prisma:seed',
  '```',
  '',
];

const out = resolve(root, 'docs/audit-recettes-catalogue.md');
writeFileSync(out, lines.join('\n'), 'utf8');
console.log(`Rapport écrit : ${out}`);
console.log(`Recettes: ${RECIPE_CATALOG.length}, placeholders: ${placeholder}`);

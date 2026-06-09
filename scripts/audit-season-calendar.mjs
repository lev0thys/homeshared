#!/usr/bin/env node
/**
 * Compare season.produce.ts aux listes Manger Bouger (échantillon par mois).
 * Usage: node scripts/audit-season-calendar.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

/** Référence manuelle — noms normalisés (sans accents, minuscules). Source: mangerbouger.fr 2026. */
const MB_REFERENCE = {
  1: [
    'betterave', 'carotte', 'chou', 'chou de bruxelles', 'chou-fleur', 'citron', 'clementine',
    'endive', 'epinard', 'kiwi', 'mache', 'mandarine', 'navet', 'oignon', 'orange', 'panais',
    'poireau', 'pomme', 'potiron',
  ],
  5: [
    'artichaut', 'asperge', 'carotte', 'chou rouge', 'concombre', 'courgette', 'epinard',
    'fenouil', 'fraise', 'mure', 'navet', 'petit pois', 'radis', 'rhubarbe', 'salade',
  ],
  6: [
    'abricot', 'artichaut', 'asperge', 'aubergine', 'carotte', 'cerise', 'concombre',
    'courgette', 'fraise', 'framboise', 'groseille', 'haricot vert', 'melon', 'pastèque',
    'peche', 'poivron', 'radis', 'salade', 'tomate',
  ],
  8: [
    'abricot', 'aubergine', 'carotte', 'concombre', 'courgette', 'figue', 'fraise',
    'framboise', 'groseille', 'haricot vert', 'melon', 'mure', 'myrtille', 'nectarine',
    'pastèque', 'peche', 'poire', 'poivron', 'pomme', 'prune', 'salade', 'tomate',
  ],
};

function normalize(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/œ/g, 'oe')
    .trim();
}

const ALIASES = new Map([
  ['petit pois', 'pois'],
  ['chou de bruxelles', 'chou-bruxelles'],
  ['chou-fleur', 'chou-fleur'],
  ['chou rouge', 'chou-rouge'],
  ['haricot vert', 'haricot-vert'],
  ['pomme de terre', 'pomme-de-terre'],
  ['pasteque', 'pasteque'],
]);

function slugFromName(nameFr) {
  const n = normalize(nameFr);
  return ALIASES.get(n) ?? n.replace(/\s+/g, '-');
}

const src = readFileSync(join(root, 'apps/api/prisma/data/season.produce.ts'), 'utf8');
const entries = [...src.matchAll(/slug:\s*'([^']+)',\s*nameFr:\s*'([^']+)'[^}]*months:\s*\[([^\]]+)\]/g)].map(
  (m) => ({
    slug: m[1],
    nameFr: m[2],
    months: m[3].split(',').map((x) => Number.parseInt(x.trim(), 10)),
  }),
);

function oursForMonth(month) {
  return new Set(entries.filter((e) => e.months.includes(month)).map((e) => e.slug));
}

let exitCode = 0;

for (const [month, mbList] of Object.entries(MB_REFERENCE)) {
  const m = Number(month);
  const ours = oursForMonth(m);
  const missing = [];
  const extraRisk = [];

  for (const mbName of mbList) {
    const slug = slugFromName(mbName);
    if (!ours.has(slug)) {
      missing.push(`${mbName} → slug attendu « ${slug} »`);
    }
  }

  console.log(`\n=== Mois ${m} (réf. Manger Bouger, échantillon) ===`);
  if (missing.length) {
    exitCode = 1;
    console.log('Manquants chez nous (faux négatifs potentiels):');
    missing.forEach((x) => console.log(`  - ${x}`));
  } else {
    console.log('Aucun manquant sur l’échantillon MB.');
  }
}

console.log('\nProduits affichés en été mais absents de MB juin (brocoli, etc.) — vérifier manuellement.');
const juneMb = new Set(MB_REFERENCE[6].map((n) => slugFromName(n)));
for (const e of entries) {
  if (e.months.includes(6) && !juneMb.has(e.slug) && e.slug === 'brocoli') {
    console.log(`  ⚠ ${e.nameFr} (${e.slug}) listé en juin, absent de MB juin`);
    exitCode = 1;
  }
}

process.exit(exitCode);

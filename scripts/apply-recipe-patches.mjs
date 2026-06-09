/**
 * Applique les patches instructions/unités sur recipe.catalog.bulk.ts
 * Usage: node scripts/apply-recipe-patches.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { INSTRUCTION_PATCHES, UNIT_LINE_PATCHES } from './recipe-instruction-patches.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const bulkPath = resolve(root, 'apps/api/prisma/data/recipe.catalog.bulk.ts');

function escapeInstructions(text) {
  return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function patchInstructions(content, slug, instructions) {
  const esc = escapeInstructions(instructions);
  const re = new RegExp(
    `(slug: "${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?instructions: ")([^"]*(?:\\\\.[^"]*)*)(")`,
  );
  if (!re.test(content)) {
    console.warn(`⚠ slug introuvable ou sans instructions: ${slug}`);
    return content;
  }
  return content.replace(re, `$1${esc}$3`);
}

function patchUnitLine(content, { slug, ingredientSlug, quantity, unit, notes }) {
  const slugEsc = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const ingEsc = ingredientSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(
    `(slug: "${slugEsc}"[\\s\\S]*?ingredientSlug: "${ingEsc}"[\\s\\S]*?quantity: )([\\d.]+)([\\s\\S]*?unit: )([^\\n]+)`,
  );
  const unitStr = unit === null ? 'null,' : `"${unit}",`;
  let next = content.replace(re, `$1${quantity}$3${unitStr}`);
  if (notes) {
    const notesRe = new RegExp(
      `(slug: "${slugEsc}"[\\s\\S]*?ingredientSlug: "${ingEsc}"[\\s\\S]*?unit: ${unitStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\n)(\\s*optional:)`,
    );
    if (notesRe.test(next) && !next.includes(`notes: "${notes}"`)) {
      next = next.replace(notesRe, `$1        notes: "${notes}",\n$2`);
    }
  }
  return next;
}

let content = readFileSync(bulkPath, 'utf8');
let count = 0;

for (const [slug, instructions] of Object.entries(INSTRUCTION_PATCHES)) {
  const before = content;
  content = patchInstructions(content, slug, instructions);
  if (content !== before) count += 1;
}

for (const patch of UNIT_LINE_PATCHES) {
  content = patchUnitLine(content, patch);
}

writeFileSync(bulkPath, content, 'utf8');
console.log(`✓ ${count} instructions patchées dans recipe.catalog.bulk.ts`);

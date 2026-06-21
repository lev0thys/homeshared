/**
 * Applique tous les scripts supabase/rls/*.sql dans l'ordre lexicographique.
 * Usage: pnpm rls:apply
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env');
if (existsSync(envPath)) loadEnv({ path: envPath });

const rlsDir = resolve(root, 'supabase/rls');
const dbUrl = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ DIRECT_DATABASE_URL ou DATABASE_URL manquant dans .env');
  process.exit(1);
}

const sqlFiles = readdirSync(rlsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

if (sqlFiles.length === 0) {
  console.error('❌ Aucun fichier .sql dans supabase/rls/');
  process.exit(1);
}

const prismaCli = resolve(root, 'node_modules/prisma/build/index.js');
const schema = resolve(root, 'apps/api/prisma/schema.prisma');

for (const file of sqlFiles) {
  const sqlFile = resolve(rlsDir, file);
  console.log(`\n▶ Application ${file}…`);
  const result = spawnSync(
    process.execPath,
    [prismaCli, 'db', 'execute', '--file', sqlFile, '--schema', schema],
    {
      env: { ...process.env, DIRECT_DATABASE_URL: dbUrl, DATABASE_URL: dbUrl },
      stdio: 'inherit',
      cwd: resolve(root, 'apps/api'),
    },
  );

  if (result.status !== 0) {
    console.error(`❌ Échec sur ${file} — exécuter manuellement dans Supabase SQL Editor.`);
    process.exit(result.status ?? 1);
  }
  console.log(`✓ ${file}`);
}

console.log('\n✅ RLS appliqué — rafraîchir Security dans le dashboard Supabase.');

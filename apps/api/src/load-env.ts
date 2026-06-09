/**
 * Charge le fichier `.env` avant tout import de `config.ts`.
 * Ordre : racine du monorepo `homeshared/.env`, puis `apps/api/.env` si présent.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiRoot = path.resolve(__dirname, '..');
/** Racine du monorepo `homeshared/` (parent de `apps/`). */
const repoRoot = path.resolve(__dirname, '../..', '..');

for (const envPath of [path.join(repoRoot, '.env'), path.join(apiRoot, '.env')]) {
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

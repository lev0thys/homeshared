#!/usr/bin/env node
/**
 * Télécharge l'APK EAS dans apps/mobile/public/download.apk avant `expo export`.
 * Utilisé par Vercel (buildCommand) — le fichier est gitignoré (~85 Mo).
 *
 * Env : EXPO_APK_ARTIFACT_URL (sinon fallback build preview connu).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dest = path.join(root, 'apps/mobile/public/download.apk');

const artifactUrl =
  process.env.EXPO_APK_ARTIFACT_URL?.trim() ||
  'https://expo.dev/artifacts/eas/7udEVm79nmJ2hjmFdcj16z.apk';

async function main() {
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  if (process.env.SKIP_APK_FETCH === '1' && fs.existsSync(dest)) {
    console.log('[fetch-apk] SKIP_APK_FETCH=1 — APK local conservé');
    return;
  }

  console.log('[fetch-apk] Téléchargement depuis', artifactUrl);
  const res = await fetch(artifactUrl, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`[fetch-apk] HTTP ${res.status} — ${artifactUrl}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1_000_000) {
    throw new Error(`[fetch-apk] Fichier suspect (${buf.length} octets)`);
  }

  fs.writeFileSync(dest, buf);
  console.log(`[fetch-apk] OK — ${(buf.length / 1024 / 1024).toFixed(1)} Mo → ${dest}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

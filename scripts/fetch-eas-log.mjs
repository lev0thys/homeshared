#!/usr/bin/env node
/**
 * Extrait les erreurs d'un log EAS (JSON lines ou binaire compressé).
 * Usage: node scripts/fetch-eas-log.mjs <buildId>
 */
import { execSync } from 'node:child_process';
import https from 'node:https';

const buildId = process.argv[2];
if (!buildId) {
  console.error('Usage: node scripts/fetch-eas-log.mjs <buildId>');
  process.exit(2);
}

const MOBILE_DIR = new URL('../apps/mobile', import.meta.url);

const json = execSync(`eas build:view ${buildId} --json`, {
  cwd: MOBILE_DIR,
  encoding: 'utf8',
});
const build = JSON.parse(json);
console.log(`Build ${build.id} — ${build.status} — ${build.platform} — ${build.buildProfile ?? '?'}`);
if (build.error?.message) console.error('Error:', build.error.message);

const url = build.logFiles?.[0];
if (!url) {
  console.error('No log URL');
  process.exit(1);
}

const buf = await new Promise((resolve, reject) => {
  https
    .get(url, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    })
    .on('error', reject);
});

const hits = new Set();

// 1) JSON lines (format historique)
for (const line of buf.toString('utf8').split(/\r?\n/)) {
  if (!line.trim()) continue;
  try {
    const o = JSON.parse(line);
    const msg = o.msg ?? '';
    const phase = o.phase ?? '';
    if (
      phase === 'RUN_GRADLEW' ||
      /error|fail|FAILURE|What went wrong|BUILD FAILED|Execution failed|Gradle|compileSdk|targetSdk/i.test(
        msg,
      )
    ) {
      hits.add(`${phase}: ${msg}`.trim());
    }
  } catch {
    /* pas JSON */
  }
}

// 2) Chaînes ASCII dans logs binaires
let cur = '';
for (let i = 0; i < buf.length; i++) {
  const b = buf[i];
  if (b >= 32 && b < 127) cur += String.fromCharCode(b);
  else {
    if (cur.length >= 12) {
      if (/FAILURE|What went wrong|BUILD FAILED|Execution failed|compileSdk|targetSdk|Task :|Gradle|error:/i.test(cur)) {
        hits.add(cur);
      }
    }
    cur = '';
  }
}

if (hits.size === 0) {
  console.log('\nAucune erreur extraite (log probablement chiffré).');
  console.log(`Page build: https://expo.dev/accounts/lev0thy/projects/homeshared/builds/${buildId}`);
} else {
  console.log('\n--- Erreurs / indices ---');
  for (const h of [...hits].slice(-40)) console.log(h);
}

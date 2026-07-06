#!/usr/bin/env node
/**
 * Surveillance EAS Build (style DBA) — poll jusqu'à FINISHED / ERRORED / CANCELED.
 *
 * Usage:
 *   node scripts/monitor-eas-build.mjs <buildId>
 *   node scripts/monitor-eas-build.mjs --watch   # dernier build Android
 *   node scripts/monitor-eas-build.mjs --watch --platform ios
 *
 * Exit 0 = FINISHED, 1 = ERRORED/CANCELED/timeout, 2 = usage error
 */
import { execSync } from 'node:child_process';
import https from 'node:https';

const MOBILE_DIR = new URL('../apps/mobile', import.meta.url);
const POLL_MS = Number(process.env.EAS_POLL_MS ?? 30_000);
const TIMEOUT_MS = Number(process.env.EAS_POLL_TIMEOUT_MS ?? 45 * 60_000);

function runEas(args) {
  return execSync(`eas ${args}`, {
    cwd: MOBILE_DIR,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

function parseArgs(argv) {
  const watch = argv.includes('--watch');
  const platformIdx = argv.indexOf('--platform');
  const platform =
    platformIdx >= 0 && argv[platformIdx + 1] ? argv[platformIdx + 1] : 'android';
  const id = argv.find((a) => !a.startsWith('-') && a !== platform);
  return { watch, platform, id };
}

function getBuild(id) {
  const json = runEas(`build:view ${id} --json`);
  return JSON.parse(json);
}

function getLatestBuild(platform) {
  const json = runEas(
    `build:list --platform ${platform} --limit 1 --json --non-interactive`,
  );
  const list = JSON.parse(json);
  if (!list?.[0]?.id) throw new Error(`Aucun build ${platform} trouvé`);
  return list[0];
}

function extractLogHints(buffer) {
  const out = [];
  let cur = '';
  for (let i = 0; i < buffer.length; i++) {
    const b = buffer[i];
    if (b >= 32 && b < 127) cur += String.fromCharCode(b);
    else {
      if (cur.length >= 10) out.push(cur);
      cur = '';
    }
  }
  if (cur.length >= 10) out.push(cur);

  // JSON lines (anciens logs EAS)
  const text = buffer.toString('utf8');
  for (const line of text.split(/\r?\n/)) {
    try {
      const o = JSON.parse(line);
      const msg = o.msg ?? '';
      if (/FAILURE|What went wrong|BUILD FAILED|Execution failed|error/i.test(msg)) {
        out.push(msg);
      }
    } catch {
      /* binaire ou ligne non-JSON */
    }
  }

  return [
    ...new Set(
      out.filter((s) =>
        /FAILURE|What went wrong|BUILD FAILED|Execution failed|compileSdk|targetSdk|Gradle|Task :|error:/i.test(
          s,
        ),
      ),
    ),
  ].slice(-20);
}

async function fetchLogHints(url) {
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
  return extractLogHints(buf);
}

function formatBuild(b) {
  const art = b.artifacts?.applicationArchiveUrl ?? b.artifacts?.buildUrl ?? '';
  return [
    `id=${b.id}`,
    `status=${b.status}`,
    `profile=${b.buildProfile ?? '?'}`,
    `platform=${b.platform}`,
    b.error?.message ? `error=${b.error.message}` : null,
    art ? `artifact=${art}` : null,
    `logs=https://expo.dev/accounts/lev0thy/projects/homeshared/builds/${b.id}`,
  ]
    .filter(Boolean)
    .join(' | ');
}

async function main() {
  const { watch, platform, id: argId } = parseArgs(process.argv.slice(2));
  let buildId = argId;

  if (!buildId && watch) {
    buildId = getLatestBuild(platform).id;
    console.log(`[monitor] Dernier build ${platform}: ${buildId}`);
  }

  if (!buildId) {
    console.error('Usage: node scripts/monitor-eas-build.mjs <buildId|--watch>');
    process.exit(2);
  }

  const started = Date.now();
  let lastStatus = '';

  while (true) {
    const b = getBuild(buildId);
    if (b.status !== lastStatus) {
      console.log(`[${new Date().toISOString()}] ${formatBuild(b)}`);
      lastStatus = b.status;
    }

    if (b.status === 'FINISHED') {
      console.log('\n✅ Build FINISHED');
      if (b.artifacts?.applicationArchiveUrl) {
        console.log(`AAB/APK: ${b.artifacts.applicationArchiveUrl}`);
      }
      process.exit(0);
    }

    if (b.status === 'ERRORED' || b.status === 'CANCELED') {
      console.error(`\n❌ Build ${b.status}`);
      if (b.error?.message) console.error(b.error.message);
      const logUrl = b.logFiles?.[0];
      if (logUrl) {
        try {
          const hints = await fetchLogHints(logUrl);
          if (hints.length) {
            console.error('\nIndices logs Gradle:');
            hints.forEach((h) => console.error(`  • ${h.slice(0, 300)}`));
          } else {
            console.error('\nLogs binaires — ouvrir la page Expo pour le détail Gradle.');
          }
        } catch (e) {
          console.error('Impossible de lire les logs:', e.message);
        }
      }
      process.exit(1);
    }

    if (Date.now() - started > TIMEOUT_MS) {
      console.error(`\n⏱ Timeout après ${TIMEOUT_MS / 60000} min — build toujours ${b.status}`);
      process.exit(1);
    }

    await new Promise((r) => setTimeout(r, POLL_MS));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

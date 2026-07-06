#!/usr/bin/env node
/**
 * Boucle EAS automatisée : build → surveille → diagnostique → corrige → réitère.
 *
 * Usage:
 *   node scripts/eas-build-loop.mjs
 *   node scripts/eas-build-loop.mjs --profile production --platform android --max-attempts 6
 *   node scripts/eas-build-loop.mjs --dry-run   # diagnostic seulement, pas de build
 *
 * État persisté : scripts/.eas-loop-state.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { diagnoseBuild } from './eas-build-diagnose.mjs';
import {
  applyFix,
  getExpoSdkMajor,
  loadAppliedFixes,
  pickNextFix,
  saveAppliedFixes,
} from './eas-build-fixes.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MOBILE = path.join(ROOT, 'apps', 'mobile');
const STATE_PATH = path.join(ROOT, 'scripts', '.eas-loop-state.json');
const LOG_DIR = path.join(ROOT, 'scripts', '.eas-loop-logs');

const POLL_MS = Number(process.env.EAS_POLL_MS ?? 30_000);
const TIMEOUT_MS = Number(process.env.EAS_POLL_TIMEOUT_MS ?? 50 * 60_000);

function parseArgs() {
  const argv = process.argv.slice(2);
  const profileIdx = argv.indexOf('--profile');
  const platformIdx = argv.indexOf('--platform');
  const maxIdx = argv.indexOf('--max-attempts');
  return {
    profile: profileIdx >= 0 ? argv[profileIdx + 1] : 'production',
    platform: platformIdx >= 0 ? argv[platformIdx + 1] : 'android',
    maxAttempts: maxIdx >= 0 ? Number(argv[maxIdx + 1]) : 6,
    dryRun: argv.includes('--dry-run'),
  };
}

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(path.join(LOG_DIR, 'loop.log'), line + '\n', 'utf8');
}

function runEas(args, { capture = false } = {}) {
  try {
    return execSync(`eas ${args}`, {
      cwd: MOBILE,
      encoding: 'utf8',
      stdio: capture ? ['pipe', 'pipe', 'pipe'] : 'inherit',
    });
  } catch (e) {
    if (capture) {
      return (e.stdout ?? '') + (e.stderr ?? '');
    }
    throw e;
  }
}

function getBuild(id) {
  const out = runEas(`build:view ${id} --json`, { capture: true });
  const jsonStart = out.indexOf('{');
  if (jsonStart < 0) throw new Error('Réponse EAS invalide');
  return JSON.parse(out.slice(jsonStart));
}

function launchBuild(profile, platform) {
  log(`🚀 Lancement eas build --profile ${profile} --platform ${platform}`);
  const out = runEas(
    `build --profile ${profile} --platform ${platform} --non-interactive --no-wait`,
    { capture: true },
  );
  const m = out.match(
    /builds\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i,
  );
  if (/used its Android builds from the Free plan|billing/i.test(out)) {
    throw new Error(
      'QUOTA_EAS: quota builds Android gratuit épuisé ce mois-ci — reset ~1er août ou upgrade sur expo.dev/settings/billing',
    );
  }
  if (!m) {
    throw new Error(`Impossible d'extraire buildId depuis la sortie EAS`);
  }
  return m[1];
}

async function waitForBuild(buildId) {
  const started = Date.now();
  let lastStatus = '';

  while (true) {
    let build;
    try {
      build = getBuild(buildId);
    } catch (e) {
      log(`⚠️ Poll EAS échoué (${e.message}) — retry dans ${POLL_MS / 1000}s`);
      await sleep(POLL_MS);
      continue;
    }

    if (build.status !== lastStatus) {
      log(`📡 ${buildId} → ${build.status}`);
      lastStatus = build.status;
    }

    if (build.status === 'FINISHED') return build;
    if (build.status === 'ERRORED' || build.status === 'CANCELED') return build;

    if (Date.now() - started > TIMEOUT_MS) {
      throw new Error(`Timeout ${TIMEOUT_MS / 60000} min sur build ${buildId}`);
    }
    await sleep(POLL_MS);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const { profile, platform, maxAttempts, dryRun } = parseArgs();

  fs.mkdirSync(LOG_DIR, { recursive: true });

  let appliedFixes = loadAppliedFixes(STATE_PATH);
  const attempts = [];

  log(`=== EAS Build Loop — ${profile}/${platform} — max ${maxAttempts} — SDK Expo ${getExpoSdkMajor()} ===`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    log(`\n--- Tentative ${attempt}/${maxAttempts} ---`);

    if (dryRun) {
      log('dry-run : arrêt avant build');
      break;
    }

    let buildId;
    try {
      buildId = launchBuild(profile, platform);
    } catch (e) {
      log(`❌ Échec lancement build: ${e.message}`);
      if (String(e.message).includes('QUOTA_EAS')) {
        saveAppliedFixes(STATE_PATH, appliedFixes, { quotaBlocked: true });
        process.exit(1);
      }
      const fixId = 'remove-local-android';
      if (!appliedFixes.includes(fixId)) {
        const r = applyFix(fixId, { profile });
        if (r.applied) {
          appliedFixes.push(fixId);
          saveAppliedFixes(STATE_PATH, appliedFixes, { lastError: e.message });
          log(`🔧 Fix appliqué: ${r.message}`);
          continue;
        }
      }
      process.exit(1);
    }

    log(`Build ID: ${buildId}`);
    log(`URL: https://expo.dev/accounts/lev0thy/projects/homeshared/builds/${buildId}`);

    const build = await waitForBuild(buildId);
    const record = {
      attempt,
      buildId,
      status: build.status,
      sdk: getExpoSdkMajor(),
      artifact: build.artifacts?.applicationArchiveUrl ?? null,
      error: build.error?.message ?? null,
      at: new Date().toISOString(),
    };
    attempts.push(record);
    saveAppliedFixes(STATE_PATH, appliedFixes, { attempts, lastBuildId: buildId });

    if (build.status === 'FINISHED') {
      log('\n✅ SUCCÈS — Build terminé');
      log(`AAB/APK: ${build.artifacts?.applicationArchiveUrl ?? build.artifacts?.buildUrl}`);
      saveAppliedFixes(STATE_PATH, appliedFixes, {
        attempts,
        success: true,
        artifact: build.artifacts?.applicationArchiveUrl,
      });
      process.exit(0);
    }

    log(`\n❌ Build ${build.status}`);
    const diagnosis = await diagnoseBuild(build);
    log(`Diagnostic: category=${diagnosis.category} fixHint=${diagnosis.fixHint}`);
    log(`Signaux: ${diagnosis.signals.join(', ') || 'aucun'}`);
    if (diagnosis.logLines?.length) {
      const snippet = diagnosis.logLines.slice(-5).join(' | ');
      log(`Logs (extrait): ${snippet.slice(0, 400)}`);
    }

    const fixId = pickNextFix(diagnosis, appliedFixes);
    if (!fixId) {
      log('⛔ Plus de correctif automatique disponible — intervention manuelle requise');
      saveAppliedFixes(STATE_PATH, appliedFixes, {
        attempts,
        success: false,
        lastDiagnosis: diagnosis,
      });
      process.exit(1);
    }

    log(`🔧 Application fix: ${fixId}`);
    try {
      const result = applyFix(fixId, { profile });
      log(`   → ${result.message}`);
      if (result.applied || !result.applied) {
        appliedFixes.push(fixId);
        saveAppliedFixes(STATE_PATH, appliedFixes, { attempts, lastDiagnosis: diagnosis });
      }
    } catch (e) {
      log(`❌ Fix ${fixId} a échoué: ${e.message}`);
      if (/EPERM|EBUSY|ENOENT/i.test(e.message)) {
        log('🔁 Erreur fichier Windows — retry fix au prochain tour après pause');
        await sleep(15_000);
        continue;
      }
      saveAppliedFixes(STATE_PATH, appliedFixes, {
        attempts,
        lastFixError: e.message,
      });
      process.exit(1);
    }

    log('⏳ Pause 10s avant prochaine tentative…');
    await sleep(10_000);
  }

  log(`\n⛔ ${maxAttempts} tentatives épuisées sans succès`);
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

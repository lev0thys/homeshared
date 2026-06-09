#!/usr/bin/env node
/**
 * Vérifications locales AVANT `eas build` — évite les builds cloud inutiles.
 * Usage : node scripts/eas-preflight.mjs
 */
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mobile = path.join(root, 'apps', 'mobile');
// eas build:inspect résout --output depuis apps/mobile (projectRoot)
const inspectDir = path.join(mobile, '.eas-preflight-check');
const require = createRequire(import.meta.url);

function ok(msg) {
  console.log(`✅ ${msg}`);
}
function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exitCode = 1;
}

console.log('--- EAS preflight homeshared ---\n');

// 1. Config Expo + AdMob
try {
  const { getConfig } = require('@expo/config');
  const c = getConfig(mobile);
  const admob = c.rootConfig?.['react-native-google-mobile-ads'];
  if (!admob?.android_app_id) {
    throw new Error('rootConfig react-native-google-mobile-ads.android_app_id manquant');
  }
  const plugins = c.exp?.plugins ?? [];
  const hasAds = plugins.some((p) => (Array.isArray(p) ? p[0] : p) === 'react-native-google-mobile-ads');
  const hasBuildProps = plugins.some((p) => (Array.isArray(p) ? p[0] : p) === 'expo-build-properties');
  if (!hasAds) throw new Error('plugin react-native-google-mobile-ads absent');
  if (!hasBuildProps) throw new Error('plugin expo-build-properties absent');
  if (!c.exp?.android?.package) throw new Error('android.package manquant');
  ok(`Config Expo : AdMob ${admob.android_app_id.slice(0, 20)}… + plugins`);
} catch (e) {
  fail(`Config Expo : ${e.message}`);
}

// 2. Archive EAS (inspect)
try {
  if (fs.existsSync(inspectDir)) fs.rmSync(inspectDir, { recursive: true, force: true });
  execSync(
    'eas build:inspect --platform android --profile preview --stage archive --output .eas-preflight-check --force',
    { cwd: mobile, stdio: 'pipe' },
  );
  const mustExist = [
    ['apps/api/package.json', 'Workspace apps/api (pnpm)'],
    ['pnpm-lock.yaml', 'pnpm-lock.yaml'],
    ['apps/mobile/app.json', 'app.json mobile'],
  ];
  const mustNotExist = [['apps/mobile/android', 'Dossier android/ local exclu']];
  for (const [rel, label] of mustExist) {
    if (!fs.existsSync(path.join(inspectDir, rel))) fail(`Archive : ${label} absent`);
    else ok(`Archive : ${label}`);
  }
  for (const [rel, label] of mustNotExist) {
    if (fs.existsSync(path.join(inspectDir, rel))) fail(`Archive : ${label} — corriger .easignore`);
    else ok(`Archive : ${label}`);
  }
  const appJson = fs.readFileSync(path.join(inspectDir, 'apps/mobile/app.json'), 'utf8');
  if (!appJson.includes('android_app_id')) fail('Archive : android_app_id absent de app.json');
  else ok('Archive : android_app_id dans app.json');
} catch (e) {
  fail(`Archive inspect : ${e.stderr?.toString() || e.message}`);
}

// 3. Prebuild sur snapshot (sans Gradle)
const snapMobile = path.join(inspectDir, 'apps/mobile');
try {
  execSync('npx expo prebuild --platform android --no-install', {
    cwd: snapMobile,
    stdio: 'pipe',
    env: { ...process.env, CI: '1' },
  });
  const manifest = path.join(snapMobile, 'android/app/src/main/AndroidManifest.xml');
  const xml = fs.readFileSync(manifest, 'utf8');
  if (!xml.includes('com.google.android.gms.ads.APPLICATION_ID')) {
    fail('Prebuild : meta-data AdMob absente du AndroidManifest');
  } else ok('Prebuild : AdMob dans AndroidManifest');
} catch (e) {
  fail(`Prebuild snapshot : ${e.stderr?.toString() || e.message}`);
}

console.log('\n--- Fin preflight ---');
if (process.exitCode) {
  console.log('Corriger les ❌ avant eas build.');
  process.exit(1);
}
console.log('Prêt pour : eas build --profile preview --platform android');

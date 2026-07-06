/**
 * Correctifs automatiques appliqués entre deux tentatives EAS.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MOBILE = path.join(ROOT, 'apps', 'mobile');
const EAS_JSON = path.join(MOBILE, 'eas.json');
const APP_CONFIG = path.join(MOBILE, 'app.config.js');
const PKG_JSON = path.join(MOBILE, 'package.json');
const EASIGNORE_ROOT = path.join(ROOT, '.easignore');
const EASIGNORE_MOBILE = path.join(MOBILE, '.easignore');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, data) {
  fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function runCmd(cmd, cwd = ROOT) {
  execSync(cmd, { cwd, stdio: 'inherit', env: { ...process.env, CI: '1' } });
}

export function getExpoSdkMajor() {
  const pkg = readJson(PKG_JSON);
  const m = String(pkg.dependencies?.expo ?? '').match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

export function loadAppliedFixes(statePath) {
  if (!fs.existsSync(statePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(statePath, 'utf8')).appliedFixes ?? [];
  } catch {
    return [];
  }
}

export function saveAppliedFixes(statePath, appliedFixes, extra = {}) {
  const prev = fs.existsSync(statePath)
    ? JSON.parse(fs.readFileSync(statePath, 'utf8'))
    : {};
  fs.writeFileSync(
    statePath,
    JSON.stringify(
      { ...prev, ...extra, appliedFixes, updatedAt: new Date().toISOString() },
      null,
      2,
    ),
    'utf8',
  );
}

function upgradeExpo(targetVersion, label) {
  const major = getExpoSdkMajor();
  const targetMajor = Number(targetVersion.match(/(\d+)/)?.[1] ?? 0);
  if (major >= targetMajor) {
    return { applied: false, message: `Expo SDK déjà ${major}` };
  }

  runCmd(`pnpm add expo@${targetVersion} --filter @homeshared/mobile`, ROOT);

  try {
    runCmd('npx expo install --fix', MOBILE);
  } catch (e) {
    console.warn(`[fix] expo install --fix: ${e.message}`);
  }

  const adsNm = path.join(ROOT, 'packages', 'tech-bricks-ads', 'node_modules');
  if (fs.existsSync(adsNm)) {
    try {
      fs.rmSync(adsNm, { recursive: true, force: true });
    } catch {
      /* verrou IDE */
    }
  }

  for (let i = 0; i < 3; i++) {
    try {
      runCmd('pnpm install', ROOT);
      break;
    } catch (e) {
      if (i === 2) throw e;
      console.warn(`[fix] pnpm install retry ${i + 1}/3…`);
    }
  }

  return { applied: true, message: label };
}

/**
 * @param {string} fixId
 * @param {{ profile: string }} ctx
 */
export function applyFix(fixId, ctx = { profile: 'production' }) {
  switch (fixId) {
    case 'eas-image-latest': {
      const eas = readJson(EAS_JSON);
      eas.build[ctx.profile] ??= {};
      eas.build[ctx.profile].android ??= {};
      eas.build[ctx.profile].android.image = 'latest';
      writeJson(EAS_JSON, eas);
      return { applied: true, message: 'eas.json → android.image = latest' };
    }

    case 'disable-widgets': {
      const eas = readJson(EAS_JSON);
      eas.build[ctx.profile] ??= {};
      eas.build[ctx.profile].env ??= {};
      eas.build[ctx.profile].env.EXPO_NO_ANDROID_WIDGETS = 'true';
      writeJson(EAS_JSON, eas);
      return { applied: true, message: 'EXPO_NO_ANDROID_WIDGETS=true' };
    }

    case 'easignore-android': {
      for (const f of [EASIGNORE_ROOT, EASIGNORE_MOBILE]) {
        let content = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
        if (!content.includes('apps/mobile/android')) {
          content += '\napps/mobile/android\napps/mobile/ios\n';
          fs.writeFileSync(f, content.trim() + '\n', 'utf8');
        }
      }
      return { applied: true, message: '.easignore → exclure android/ios' };
    }

    case 'api35-kotlin': {
      const sdk = getExpoSdkMajor();
      const kotlin = sdk >= 53 ? '2.0.21' : '1.9.25';
      let src = fs.readFileSync(APP_CONFIG, 'utf8');
      if (!src.includes(`kotlinVersion: '${kotlin}'`)) {
        src = src.replace(/kotlinVersion: '[^']+'/g, `kotlinVersion: '${kotlin}'`);
        if (!src.includes('kotlinVersion')) {
          src = src.replace(
            /minSdkVersion: 23,\s*\n\s*\},/,
            `minSdkVersion: 23,\n          kotlinVersion: '${kotlin}',\n        },`,
          );
        }
        fs.writeFileSync(APP_CONFIG, src, 'utf8');
      }
      return { applied: true, message: `kotlinVersion ${kotlin}` };
    }

    case 'upgrade-expo-52':
      return upgradeExpo('~52.0.0', 'Upgrade Expo SDK 52');

    case 'upgrade-expo-53':
      return upgradeExpo('~53.0.0', 'Upgrade Expo SDK 53 (targetSdk 35)');

    case 'api35-native-sdk53':
      return { applied: true, message: 'API 35 via expo-build-properties (SDK 53)' };

    case 'remove-local-android': {
      const androidDir = path.join(MOBILE, 'android');
      if (fs.existsSync(androidDir)) {
        fs.rmSync(androidDir, { recursive: true, force: true });
        return { applied: true, message: 'android/ local supprimé' };
      }
      return { applied: false, message: 'Pas de android/ local' };
    }

    case 'verify-local-bundle': {
      try {
        runCmd('npx expo export --platform android', MOBILE);
        return { applied: true, message: 'Bundle JS local OK' };
      } catch (e) {
        return { applied: false, message: `Bundle JS: ${String(e.message).slice(0, 200)}` };
      }
    }

    case 'sdk53-native-defaults':
      return { applied: true, message: 'SDK 53 → defaults natifs API 35 + Kotlin 2.0.21' };

    case 'admob-pin-14': {
      const rootPkg = path.join(ROOT, 'package.json');
      const root = readJson(rootPkg);
      root.pnpm ??= {};
      root.pnpm.overrides ??= {};
      root.pnpm.overrides['react-native-google-mobile-ads'] = '14.2.3';
      writeJson(rootPkg, root);
      runCmd('pnpm install', ROOT);
      return { applied: true, message: 'AdMob pin 14.2.3 (override pnpm)' };
    }

    case 'kotlin-2-admob': {
      let src = fs.readFileSync(APP_CONFIG, 'utf8');
      if (src.includes("kotlinVersion: '1.9.25'")) {
        src = src.replace(/kotlinVersion: '1\.9\.25'/g, "kotlinVersion: '2.0.21'");
        fs.writeFileSync(APP_CONFIG, src, 'utf8');
        return { applied: true, message: 'kotlinVersion 2.0.21 (AdMob + SDK 53)' };
      }
      return { applied: false, message: 'kotlin déjà ≥ 2.0' };
    }

    case 'pnpm-install': {
      runCmd('pnpm install', ROOT);
      return { applied: true, message: 'pnpm install racine' };
    }

    default:
      return { applied: false, message: `Fix inconnu: ${fixId}` };
  }
}

export function pickNextFix(diagnosis, appliedFixes) {
  const sdk = getExpoSdkMajor();

  if (diagnosis.category === 'js-bundle' || diagnosis.fixHint === 'verify-local-bundle') {
    if (!appliedFixes.includes('verify-local-bundle')) return 'verify-local-bundle';
  }

  const isGradle =
    diagnosis.category === 'gradle-api35' ||
    diagnosis.category === 'gradle-unknown' ||
    diagnosis.signals.includes('gradle-android-sdk') ||
    diagnosis.signals.includes('gradle-fallback');

  if (isGradle) {
    if (sdk >= 53 && !appliedFixes.includes('kotlin-2-admob')) return 'kotlin-2-admob';
    if (sdk >= 53 && !appliedFixes.includes('sdk53-native-defaults')) return 'sdk53-native-defaults';
    if (sdk >= 53 && !appliedFixes.includes('admob-pin-14')) return 'admob-pin-14';
    if (sdk < 52 && !appliedFixes.includes('upgrade-expo-52')) return 'upgrade-expo-52';
    if (sdk < 53 && !appliedFixes.includes('upgrade-expo-53')) return 'upgrade-expo-53';
  }

  if (diagnosis.fixHint === 'disable-widgets' && !appliedFixes.includes('disable-widgets')) {
    return 'disable-widgets';
  }

  const pipeline = [
    'remove-local-android',
    'easignore-android',
    'eas-image-latest',
    'disable-widgets',
    ...(sdk >= 53 ? ['kotlin-2-admob'] : ['api35-kotlin']),
    'upgrade-expo-52',
    'upgrade-expo-53',
    'api35-native-sdk53',
    'pnpm-install',
  ];

  for (const fix of pipeline) {
    if (!appliedFixes.includes(fix)) return fix;
  }

  return null;
}

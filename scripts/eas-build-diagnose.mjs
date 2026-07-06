/**
 * Diagnostique un build EAS échoué — heuristiques + extraction logs.
 */
import https from 'node:https';

export async function fetchLogBuffer(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      })
      .on('error', reject);
  });
}

export function extractLogText(buffer) {
  const hints = new Set();

  for (const line of buffer.toString('utf8').split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const o = JSON.parse(line);
      const msg = o.msg ?? '';
      if (msg) hints.add(msg);
    } catch {
      /* non-JSON */
    }
  }

  let cur = '';
  for (let i = 0; i < buffer.length; i++) {
    const b = buffer[i];
    if (b >= 32 && b < 127) cur += String.fromCharCode(b);
    else {
      if (cur.length >= 15) hints.add(cur);
      cur = '';
    }
  }
  if (cur.length >= 15) hints.add(cur);

  return [...hints];
}

/**
 * @param {object} build - objet eas build:view
 * @param {string[]} logLines
 * @returns {{ category: string, signals: string[], fixHint: string }}
 */
export function diagnose(build, logLines = []) {
  const blob = [
    build.error?.errorCode ?? '',
    build.error?.message ?? '',
    ...logLines,
  ]
    .join('\n')
    .toLowerCase();

  const signals = [];

  if (/bundle javascript|syntaxerror|metro bundling failed/i.test(blob)) {
    signals.push('js-bundle');
  }

  if (/gradle|gradlew|eunknown_gradle|compile_sdk|compilesdk|targetsdk|api level|android-35|sdk 35/i.test(blob)) {
    signals.push('gradle-android-sdk');
  }
  if (/react-native-android-widget|android-widget/i.test(blob)) {
    signals.push('android-widget');
  }
  if (/kotlin|ksp/i.test(blob)) {
    signals.push('kotlin');
  }
  if (/google-mobile-ads|admob/i.test(blob)) {
    signals.push('admob');
  }
  if (/dotenv|cannot find module/i.test(blob)) {
    signals.push('dotenv');
  }
  if (/android directory detected|prebuild/i.test(blob)) {
    signals.push('local-android-folder');
  }
  if (/pnpm|workspace|ENOENT|install/i.test(blob)) {
    signals.push('install');
  }

  let category = 'unknown';
  let fixHint = 'inspect-manual';

  if (signals.includes('dotenv')) {
    category = 'config-dotenv';
    fixHint = 'dotenv-optional';
  } else if (signals.includes('local-android-folder')) {
    category = 'archive-android-folder';
    fixHint = 'easignore-android';
  } else if (signals.includes('android-widget')) {
    category = 'widget-incompatible';
    fixHint = 'disable-widgets';
  } else if (signals.includes('js-bundle') || /bundle javascript/i.test(blob)) {
    category = 'js-bundle';
    fixHint = 'verify-local-bundle';
  } else if (signals.includes('gradle-android-sdk')) {
    category = 'gradle-api35';
    fixHint = 'upgrade-expo-sdk';
  } else if (build.error?.errorCode === 'EAS_BUILD_UNKNOWN_GRADLE_ERROR') {
    category = 'gradle-unknown';
    fixHint = 'upgrade-expo-sdk';
    signals.push('gradle-fallback');
  }

  return { category, signals: [...new Set(signals)], fixHint };
}

export async function diagnoseBuild(build) {
  let logLines = [];
  const logUrl = build.logFiles?.[0];
  if (logUrl) {
    try {
      const buf = await fetchLogBuffer(logUrl);
      logLines = extractLogText(buf);
    } catch {
      /* réseau / log expiré */
    }
  }
  return { ...diagnose(build, logLines), logLines: logLines.slice(-30) };
}

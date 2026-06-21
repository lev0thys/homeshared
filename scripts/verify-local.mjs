#!/usr/bin/env node
/**
 * Suite de vérification locale — utilise node_modules racine (symlinks Windows pnpm).
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tsc = path.join(root, 'node_modules/typescript/bin/tsc');
const vitest = path.join(root, 'node_modules/vitest/vitest.mjs');

function run(label, cmd, args, cwd = root) {
  console.log(`\n▶ ${label}`);
  const r = spawnSync(process.execPath, [cmd, ...args], {
    cwd,
    stdio: 'inherit',
    env: process.env,
  });
  if (r.status !== 0) {
    console.error(`\n✗ ${label} (code ${r.status})`);
    process.exit(r.status ?? 1);
  }
  console.log(`✓ ${label}`);
}

run('typecheck shared', tsc, ['--noEmit', '-p', 'packages/shared/tsconfig.json']);
run('typecheck store-navigation', tsc, ['--noEmit', '-p', 'packages/store-navigation/tsconfig.json']);
run('typecheck api', tsc, ['--noEmit', '-p', 'apps/api/tsconfig.json']);
run('typecheck mobile', tsc, ['--noEmit', '-p', 'apps/mobile/tsconfig.json']);

run('test store-navigation', vitest, ['run'], path.join(root, 'packages/store-navigation'));
run('test api', vitest, ['run'], path.join(root, 'apps/api'));

console.log('\n✅ verify-local OK\n');

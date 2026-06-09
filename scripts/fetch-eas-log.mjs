import { execSync } from 'node:child_process';
import https from 'node:https';

const buildId = process.argv[2] ?? '93d7e0cc-49ee-475e-aadc-cd857b7e8061';
const json = execSync(`eas build:view ${buildId} --json`, {
  cwd: new URL('../apps/mobile', import.meta.url),
  encoding: 'utf8',
});
const build = JSON.parse(json);
const url = build.logFiles?.[0];
if (!url) {
  console.error('No log URL');
  process.exit(1);
}

const text = await new Promise((resolve, reject) => {
  https
    .get(url, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    })
    .on('error', reject);
});

const lines = text.split(/\r?\n/);
for (const line of lines) {
  if (/error|fail|ERR_|frozen|pnpm|yarn|workspace|ENOENT|UsageError/i.test(line)) {
    console.log(line);
  }
}

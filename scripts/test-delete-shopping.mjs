import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(resolve(root, 'apps/mobile/package.json'));
const { createClient } = require('@supabase/supabase-js');

const envText = readFileSync(resolve(root, '.env'), 'utf8');
const env = Object.fromEntries(
  envText
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
    }),
);

const sb = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
const email = `del-test-${Date.now()}@example.com`;
const { data: auth, error } = await sb.auth.signUp({
  email,
  password: 'AgentTest123!',
  options: { data: { username: `d${Date.now()}`, display_name: 'Del' } },
});
if (error) {
  console.error(error);
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${auth.session.access_token}`,
  'Content-Type': 'application/json',
};

const groups = await fetch('http://localhost:3001/api/groups', { headers }).then((r) => r.json());
const groupId = groups[0]?.id;

const ids = [];
for (const name of ['pomme a', 'pomme b']) {
  const item = await fetch('http://localhost:3001/api/shopping', {
    method: 'POST',
    headers,
    body: JSON.stringify({ groupId, name, quantity: 1 }),
  }).then((r) => r.json());
  await fetch(`http://localhost:3001/api/shopping/${item.id}/purchase`, {
    method: 'POST',
    headers,
    body: '{}',
  });
  ids.push({ id: item.id, purchased: true });
}

// also unpurchased
const raw = await fetch('http://localhost:3001/api/shopping', {
  method: 'POST',
  headers,
  body: JSON.stringify({ groupId, name: 'unpurchased', quantity: 1 }),
}).then((r) => r.json());
ids.push({ id: raw.id, purchased: false });

const results = await Promise.all(
  ids.map(async ({ id, purchased }) => {
    const res = await fetch(`http://localhost:3001/api/shopping/${id}`, {
      method: 'DELETE',
      headers: { Authorization: headers.Authorization },
    });
    const text = await res.text();
    return { id, purchased, status: res.status, text };
  }),
);
console.log(JSON.stringify(results, null, 2));

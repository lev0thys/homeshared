/**
 * Test POST /api/shopping/:id/purchase
 */
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

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
const email = `purchase-test-${Date.now()}@example.com`;
const password = 'AgentTest123!';

const { data: auth, error: signErr } = await supabase.auth.signUp({
  email,
  password,
  options: { data: { username: `pu_${Date.now()}`, display_name: 'Purchase Test' } },
});
if (signErr) {
  console.error('auth', signErr);
  process.exit(1);
}
const token = auth.session?.access_token;
if (!token) {
  console.error('no session');
  process.exit(1);
}

const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

const groupsRes = await fetch('http://localhost:3001/api/groups', { headers });
const groups = await groupsRes.json();
console.log('groups', groupsRes.status, groups.length ?? groups);
const groupId = groups[0]?.id;
if (!groupId) {
  console.error('no group');
  process.exit(1);
}

const createRes = await fetch('http://localhost:3001/api/shopping', {
  method: 'POST',
  headers,
  body: JSON.stringify({ groupId, name: 'pomme de terre', quantity: 1 }),
});
const item = await createRes.json();
console.log('create', createRes.status, item);

// Sans body (comme le client mobile actuel)
const purchaseRes = await fetch(`http://localhost:3001/api/shopping/${item.id}/purchase`, {
  method: 'POST',
  headers: { Authorization: headers.Authorization },
});
const purchaseBody = await purchaseRes.text();
console.log('purchase', purchaseRes.status, purchaseBody);

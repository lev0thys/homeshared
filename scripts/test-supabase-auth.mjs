/**
 * Smoke test auth Supabase (clés depuis homeshared/.env).
 * Usage: node scripts/test-supabase-auth.mjs
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
      const k = l.slice(0, i).trim();
      const v = l.slice(i + 1).trim().replace(/^["']|["']$/g, '');
      return [k, v];
    }),
);

const url = env.SUPABASE_URL;
const key = env.SUPABASE_ANON_KEY;
const email = `agent-test-${Date.now()}@example.com`;
const password = 'AgentTest123!';
const username = `agent_${Date.now()}`;

console.log('URL:', url);
console.log('Key prefix:', key?.slice(0, 12) + '...');

const supabase = createClient(url, key);

const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: { username, display_name: 'Agent Test' } },
});

if (error) {
  console.error('SIGNUP FAIL:', error.message, error.status);
  process.exit(1);
}

console.log('SIGNUP OK:', data.user?.id, 'session:', !!data.session);
if (data.session?.access_token) {
  const apiRes = await fetch('http://localhost:3001/api/groups', {
    headers: { Authorization: `Bearer ${data.session.access_token}` },
  });
  const body = await apiRes.text();
  console.log('API /api/groups:', apiRes.status, body.slice(0, 120));
  if (apiRes.status !== 200) {
    console.error('API groups FAIL');
    process.exit(1);
  }
}
process.exit(0);

/**
 * Test E2E des nouvelles routes API (tools, stores, chat, recettes).
 * Usage: node scripts/test-features-api.mjs
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(resolve(root, 'apps/mobile/package.json'));
const { createClient } = require('@supabase/supabase-js');

function loadEnv() {
  const envText = readFileSync(resolve(root, '.env'), 'utf8');
  return Object.fromEntries(
    envText
      .split('\n')
      .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
      .map((l) => {
        const i = l.indexOf('=');
        return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
      }),
  );
}

const env = loadEnv();
const API = 'http://localhost:3001';
let passed = 0;
let failed = 0;

function ok(label) {
  passed += 1;
  console.log(`  ✓ ${label}`);
}

function fail(label, detail) {
  failed += 1;
  console.error(`  ✗ ${label}: ${detail}`);
}

async function apiFetch(path, token, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
      ...opts.headers,
    },
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  return { status: res.status, json, text };
}

async function main() {
  console.log('=== Features API smoke test ===\n');

  const health = await fetch(`${API}/health/`);
  if (!health.ok) {
    console.error('API down on :3001 — lance pnpm dev:api');
    process.exit(1);
  }
  ok('Health OK');

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  const email = `feat-test-${Date.now()}@example.com`;
  const { data: auth, error: authErr } = await supabase.auth.signUp({
    email,
    password: 'AgentTest123!',
    options: { data: { username: `feat_${Date.now()}`, display_name: 'Feat Test' } },
  });
  if (authErr || !auth.session?.access_token) {
    fail('Auth signup', authErr?.message ?? 'no session');
    process.exit(1);
  }
  ok('Auth signup');
  const token = auth.session.access_token;

  const groupsRes = await apiFetch('/api/groups', token);
  if (groupsRes.status !== 200 || !Array.isArray(groupsRes.json)) {
    fail('GET /api/groups', groupsRes.status);
  } else {
    ok(`GET /api/groups (${groupsRes.json.length} groupes)`);
  }

  const personal = groupsRes.json?.find((g) => g.isPersonal);
  const multiGroup = groupsRes.json?.find((g) => !g.isPersonal);
  let testGroupId = personal?.id;

  if (!multiGroup) {
    const createRes = await apiFetch('/api/groups', token, {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Chat', description: 'Groupe test agent' }),
    });
    if (createRes.status === 200 || createRes.status === 201) {
      testGroupId = createRes.json.id;
      ok('POST /api/groups (test chat)');
    } else {
      testGroupId = personal?.id;
    }
  } else {
    testGroupId = multiGroup.id;
  }

  const seasonRes = await apiFetch('/api/tools/season?month=6', token);
  if (seasonRes.status === 200 && seasonRes.json?.produce?.length > 0) {
    ok(`GET /api/tools/season (${seasonRes.json.produce.length} produits)`);
  } else {
    fail('GET /api/tools/season', seasonRes.status);
  }

  const gardenRes = await apiFetch('/api/tools/garden?month=4', token);
  if (gardenRes.status === 200 && Array.isArray(gardenRes.json?.tasks)) {
    ok(`GET /api/tools/garden (${gardenRes.json.tasks.length} tâches)`);
  } else {
    fail('GET /api/tools/garden', gardenRes.status);
  }

  const suggestRes = await apiFetch('/api/stores/suggest?q=lait', token);
  if (suggestRes.status === 200 && Array.isArray(suggestRes.json) && suggestRes.json.length >= 1) {
    ok(`GET /api/stores/suggest (${suggestRes.json.length} offres)`);
  } else {
    fail('GET /api/stores/suggest', suggestRes.status);
  }

  const compareRes = await apiFetch('/api/stores/compare', token, {
    method: 'POST',
    body: JSON.stringify({ items: ['lait', 'poulet', 'pates'] }),
  });
  if (compareRes.status === 200 && compareRes.json?.cheapestStore) {
    ok(`POST /api/stores/compare → ${compareRes.json.cheapestStore}`);
  } else {
    fail('POST /api/stores/compare', compareRes.status);
  }

  const recipesRes = await apiFetch('/api/recipes', token);
  if (recipesRes.status === 200 && recipesRes.json?.length >= 13) {
    ok(`GET /api/recipes (${recipesRes.json.length} recettes)`);
  } else {
    fail('GET /api/recipes', `${recipesRes.status} count=${recipesRes.json?.length}`);
  }

  function weekStartUtc() {
    const now = new Date();
    const day = now.getUTCDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diff),
    );
    return monday.toISOString().slice(0, 10);
  }

  if (testGroupId) {
    const fridgeGet = await apiFetch(`/api/fridge/${testGroupId}`, token);
    if (
      fridgeGet.status === 200 &&
      Array.isArray(fridgeGet.json?.items) &&
      Array.isArray(fridgeGet.json?.reservations)
    ) {
      ok(`GET /api/fridge/:groupId (${fridgeGet.json.items.length} items, réservations OK)`);
    } else {
      fail('GET /api/fridge/:groupId (format items+reservations)', fridgeGet.status);
    }

    await apiFetch('/api/fridge', token, {
      method: 'POST',
      body: JSON.stringify({
        groupId: testGroupId,
        name: 'Tomate',
        quantity: 2,
        unit: 'kg',
      }),
    });

    const recipeId = recipesRes.json?.[0]?.id;
    const week = weekStartUtc();

    if (recipeId) {
      const planPut = await apiFetch('/api/meal-plan', token, {
        method: 'PUT',
        body: JSON.stringify({
          groupId: testGroupId,
          weekStart: week,
          dayOfWeek: 2,
          mealSlot: 'DINNER',
          recipeId,
        }),
      });
      const planGet = await apiFetch(
        `/api/meal-plan?groupId=${testGroupId}&weekStart=${week}`,
        token,
      );

      if (planPut.status === 200 && planPut.json?.ok) {
        ok('PUT /api/meal-plan (planifier repas)');
      } else {
        fail('PUT /api/meal-plan', `${planPut.status} ${planPut.text?.slice(0, 120)}`);
      }

      if (planGet.status === 200 && Array.isArray(planGet.json?.entries)) {
        ok(`GET /api/meal-plan (${planGet.json.entries.length} entrées)`);

        const entry = planGet.json.entries.find(
          (e) => e.dayOfWeek === 2 && e.mealSlot === 'DINNER',
        );

        const fridgeAfterPlan = await apiFetch(`/api/fridge/${testGroupId}`, token);
        if (fridgeAfterPlan.status === 200) {
          ok(
            `Frigo après planning (${fridgeAfterPlan.json.reservations?.length ?? 0} réservation(s))`,
          );
        } else {
          fail('Frigo après planning', fridgeAfterPlan.status);
        }

        const matchRes = await apiFetch('/api/recipes/match', token, {
          method: 'POST',
          body: JSON.stringify({
            groupId: testGroupId,
            missingMaxCount: 8,
            targetServings: 2,
          }),
        });
        if (matchRes.status === 200 && Array.isArray(matchRes.json)) {
          ok(`POST /api/recipes/match (${matchRes.json.length} recettes)`);
        } else {
          fail('POST /api/recipes/match', matchRes.status);
        }

        if (entry?.id) {
          const completeRes = await apiFetch(`/api/meal-plan/${entry.id}/complete`, token, {
            method: 'POST',
            body: JSON.stringify({}),
          });
          if (completeRes.status === 200 && completeRes.json?.consumed !== undefined) {
            ok('POST /api/meal-plan/:id/complete (déduction frigo)');
          } else {
            fail(
              'POST /api/meal-plan/:id/complete',
              `${completeRes.status} ${completeRes.text?.slice(0, 120)}`,
            );
          }
        } else {
          fail('Entrée repas planifiée', 'introuvable après PUT');
        }
      } else {
        fail('GET /api/meal-plan', planGet.status);
      }
    } else {
      fail('Meal plan tests', 'aucune recette');
    }

    const chatGet = await apiFetch(`/api/chat/${testGroupId}`, token);
    if (chatGet.status === 200 && Array.isArray(chatGet.json)) {
      ok('GET /api/chat/:groupId');
    } else {
      fail('GET /api/chat/:groupId', chatGet.status);
    }

    const chatPost = await apiFetch('/api/chat', token, {
      method: 'POST',
      body: JSON.stringify({ groupId: testGroupId, body: 'Test message agent 🤖' }),
    });
    if (chatPost.status === 200 && chatPost.json?.body) {
      ok('POST /api/chat');
    } else {
      fail('POST /api/chat', `${chatPost.status} ${chatPost.text?.slice(0, 80)}`);
    }

    const shopPost = await apiFetch('/api/shopping', token, {
      method: 'POST',
      body: JSON.stringify({ groupId: testGroupId, name: 'Lait', quantity: 1, unit: 'L' }),
    });
    if (shopPost.status === 200) {
      ok('POST /api/shopping');
    } else {
      fail('POST /api/shopping', shopPost.status);
    }
  }

  console.log(`\n=== Résultat: ${passed} OK, ${failed} FAIL ===`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Rapport métriques hebdomadaire — utilisateurs, activité, taille BDD, coûts estimés.
 *
 * Usage local :
 *   pnpm metrics:weekly
 *
 * Variables : DIRECT_DATABASE_URL ou DATABASE_URL (Prisma)
 * Optionnel : METRICS_API_URL (défaut https://homeshared-api.fly.dev)
 * Optionnel : METRICS_OUTPUT_DIR (défaut reports/metrics à la racine du monorepo)
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';
import { PrismaClient } from '@prisma/client';

const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(apiRoot, '../..');

const envPath = resolve(repoRoot, '.env');
if (existsSync(envPath)) {
  loadEnv({ path: envPath });
}

const DAY_MS = 24 * 60 * 60 * 1000;
const now = new Date();
const sevenDaysAgo = new Date(now.getTime() - 7 * DAY_MS);
const thirtyDaysAgo = new Date(now.getTime() - 30 * DAY_MS);

function resolveDbUrl(): string {
  const url = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DIRECT_DATABASE_URL ou DATABASE_URL requis (fichier .env à la racine ou secret CI).',
    );
  }
  return url;
}

interface CostEstimate {
  flyEur: number;
  supabaseEur: number;
  vercelEur: number;
  totalEur: number;
  tier: 'free' | 'low' | 'medium' | 'high';
  note: string;
}

/** Estimation indicative — pas une facture réelle. */
function estimateMonthlyCosts(active30d: number, dbMb: number): CostEstimate {
  const mau = Math.max(active30d, 1);

  let flyEur = 5;
  if (mau > 500) flyEur = 8 + mau * 0.003;
  if (mau > 5_000) flyEur = 25 + mau * 0.008;
  if (mau > 50_000) flyEur = 80 + mau * 0.015;

  let supabaseEur = 0;
  if (dbMb > 400 || mau > 10_000) supabaseEur = 25;
  if (mau > 50_000 || dbMb > 2_000) supabaseEur = 80 + mau * 0.002;

  let vercelEur = 0;
  if (mau > 3_000) vercelEur = 20;
  if (mau > 30_000) vercelEur = 50;

  const totalEur = Math.round((flyEur + supabaseEur + vercelEur) * 100) / 100;

  let tier: CostEstimate['tier'] = 'free';
  if (totalEur > 15) tier = 'low';
  if (totalEur > 80) tier = 'medium';
  if (totalEur > 300) tier = 'high';

  const note =
    tier === 'free'
      ? 'Zone free / très faible coût — pubs opt-in probablement suffisantes.'
      : tier === 'low'
        ? 'Surveiller Fly + Supabase ; envisager homeshared+ si tendance à la hausse.'
        : tier === 'medium'
          ? 'Arbitrage abonnement ~1 € ou interstitiel sortie magasin recommandé.'
          : 'Scale sérieux — revoir archi, cache, abonnement, support.';

  return { flyEur: round(flyEur), supabaseEur: round(supabaseEur), vercelEur: round(vercelEur), totalEur, tier, note };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function estimateAdRevenue(active30d: number, sessionsMagasin7d: number): { low: number; mid: number; high: number } {
  const dau = active30d / 30;
  const bannerImpressionsMonth = dau * 0.6 * 30;
  const rewardedMonth = sessionsMagasin7d * 4.3 * 0.12;

  const bannerLow = (bannerImpressionsMonth / 1000) * 0.3;
  const bannerMid = (bannerImpressionsMonth / 1000) * 0.8;
  const bannerHigh = (bannerImpressionsMonth / 1000) * 1.5;

  const rewLow = (rewardedMonth / 1000) * 4;
  const rewMid = (rewardedMonth / 1000) * 8;
  const rewHigh = (rewardedMonth / 1000) * 12;

  return {
    low: round(bannerLow + rewLow),
    mid: round(bannerMid + rewMid),
    high: round(bannerHigh + rewHigh),
  };
}

async function checkApiHealth(baseUrl: string): Promise<{ ok: boolean; db?: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/health/db`, {
      signal: AbortSignal.timeout(15_000),
    });
    const latencyMs = Date.now() - start;
    if (!res.ok) {
      return { ok: false, latencyMs, error: `HTTP ${res.status}` };
    }
    const body = (await res.json()) as { ok?: boolean; db?: boolean };
    return { ok: body.ok === true, db: body.db, latencyMs };
  } catch (err) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function collectMetrics(prisma: PrismaClient) {
  const [
    totalUsers,
    newUsers7d,
    totalGroups,
    newGroups7d,
    totalShoppingItems,
    shoppingAdded7d,
    purchases7d,
    totalFridgeItems,
    totalMessages7d,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.group.count(),
    prisma.group.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.shoppingItem.count(),
    prisma.shoppingItem.count({ where: { addedAt: { gte: sevenDaysAgo } } }),
    prisma.shoppingItem.count({
      where: { purchasedAt: { gte: sevenDaysAgo, not: null } },
    }),
    prisma.fridgeItem.count(),
    prisma.groupMessage.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
  ]);

  const activeUsers7dRows = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(DISTINCT uid)::bigint AS count FROM (
      SELECT "addedById" AS uid FROM "ShoppingItem" WHERE "addedAt" >= ${sevenDaysAgo}
      UNION
      SELECT "purchasedById" AS uid FROM "ShoppingItem"
        WHERE "purchasedAt" >= ${sevenDaysAgo} AND "purchasedById" IS NOT NULL
      UNION
      SELECT "authorId" AS uid FROM "GroupMessage" WHERE "createdAt" >= ${sevenDaysAgo}
    ) AS active
  `;

  const activeUsers30dRows = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(DISTINCT uid)::bigint AS count FROM (
      SELECT "addedById" AS uid FROM "ShoppingItem" WHERE "addedAt" >= ${thirtyDaysAgo}
      UNION
      SELECT "purchasedById" AS uid FROM "ShoppingItem"
        WHERE "purchasedAt" >= ${thirtyDaysAgo} AND "purchasedById" IS NOT NULL
      UNION
      SELECT "authorId" AS uid FROM "GroupMessage" WHERE "createdAt" >= ${thirtyDaysAgo}
    ) AS active
  `;

  const dbSizeRows = await prisma.$queryRaw<[{ size_mb: number }]>`
    SELECT ROUND(pg_database_size(current_database()) / 1024.0 / 1024.0, 2)::float AS size_mb
  `;

  const activeUsers7d = Number(activeUsers7dRows[0]?.count ?? 0);
  const activeUsers30d = Number(activeUsers30dRows[0]?.count ?? 0);
  const dbMb = Number(dbSizeRows[0]?.size_mb ?? 0);

  return {
    totalUsers,
    newUsers7d,
    totalGroups,
    newGroups7d,
    totalShoppingItems,
    shoppingAdded7d,
    purchases7d,
    totalFridgeItems,
    totalMessages7d,
    activeUsers7d,
    activeUsers30d,
    dbMb,
    /** Proxy sessions magasin v2 (achats 7j) — affiné quand mode magasin live. */
    storeSessionsProxy7d: purchases7d,
  };
}

function buildMarkdown(
  metrics: Awaited<ReturnType<typeof collectMetrics>>,
  health: Awaited<ReturnType<typeof checkApiHealth>>,
  apiUrl: string,
): string {
  const dateStr = now.toISOString().slice(0, 10);
  const costs = estimateMonthlyCosts(metrics.activeUsers30d, metrics.dbMb);
  const ads = estimateAdRevenue(metrics.activeUsers30d, metrics.storeSessionsProxy7d);
  const netMid = round(ads.mid - costs.totalEur);

  const healthLine = health.ok
    ? `✅ API OK — DB ${health.db ? 'OK' : '?'} (${health.latencyMs} ms)`
    : `❌ API indisponible — ${health.error ?? 'erreur'} (${health.latencyMs} ms)`;

  const alertLines: string[] = [];
  if (costs.tier === 'medium' || costs.tier === 'high') {
    alertLines.push(`- ⚠️ Coûts estimés **${costs.tier}** — ${costs.note}`);
  }
  if (netMid < 0 && metrics.activeUsers30d > 50) {
    alertLines.push(
      `- ⚠️ Revenus pubs estimés (médian **${ads.mid} €/mois**) < coûts estimés (**${costs.totalEur} €/mois**)`,
    );
  }
  if (metrics.newUsers7d === 0 && metrics.totalUsers > 0) {
    alertLines.push('- ℹ️ Aucun nouvel utilisateur cette semaine.');
  }

  return [
    `# Rapport métriques hebdomadaire — homeshared`,
    '',
    `**Généré le** : ${now.toISOString()}`,
    `**Période activité** : 7 jours glissants jusqu’au ${dateStr}`,
    '',
    '## Santé prod',
    '',
    `- URL : ${apiUrl}`,
    `- ${healthLine}`,
    '',
    '## Utilisateurs & activité',
    '',
    '| Indicateur | Valeur |',
    '|---|---|',
    `| Utilisateurs (total) | ${metrics.totalUsers} |`,
    `| Nouveaux utilisateurs (7 j) | ${metrics.newUsers7d} |`,
    `| Utilisateurs actifs (7 j) * | ${metrics.activeUsers7d} |`,
    `| Utilisateurs actifs (30 j) * | ${metrics.activeUsers30d} |`,
    `| Groupes (total) | ${metrics.totalGroups} |`,
    `| Nouveaux groupes (7 j) | ${metrics.newGroups7d} |`,
    `| Articles courses ajoutés (7 j) | ${metrics.shoppingAdded7d} |`,
    `| Achats cochés (7 j) | ${metrics.purchases7d} |`,
    `| Messages groupe (7 j) | ${metrics.totalMessages7d} |`,
    `| Articles frigo (total) | ${metrics.totalFridgeItems} |`,
    `| Articles courses (total) | ${metrics.totalShoppingItems} |`,
    '',
    '_Actif_ = a ajouté/acheté un article courses ou envoyé un message sur la période.',
    '',
    '## Base de données',
    '',
    `| Indicateur | Valeur |`,
    '|---|---|',
    `| Taille PostgreSQL | **${metrics.dbMb} Mo** |`,
    '',
    '## Coûts infra estimés (€ / mois, indicatif)',
    '',
    '| Poste | Estimation |',
    '|---|---|',
    `| Fly.io (API) | ~${costs.flyEur} € |`,
    `| Supabase (DB + auth) | ~${costs.supabaseEur} € |`,
    `| Vercel (web) | ~${costs.vercelEur} € |`,
    `| **Total estimé** | **~${costs.totalEur} €** |`,
    '',
    `**Palier** : \`${costs.tier}\` — ${costs.note}`,
    '',
    '## Revenus pubs estimés (€ / mois, indicatif)',
    '',
    '| Scénario | Estimation |',
    '|---|---|',
    `| Prudent | ~${ads.low} € |`,
    `| Médian | ~${ads.mid} € |`,
    `| Optimiste | ~${ads.high} € |`,
    '',
    `**Solde médian (pubs − coûts)** : **${netMid >= 0 ? '+' : ''}${netMid} € / mois**`,
    '',
    '## Alertes',
    '',
    alertLines.length > 0 ? alertLines.join('\n') : '- ✅ Rien à signaler cette semaine.',
    '',
    '## Actions suggérées',
    '',
    '| Situation | Action |',
    '|---|---|',
    '| Solde médian négatif 3 semaines | Arbitrer homeshared+ (~1 €) — voir BACKLOG |',
    '| DB > 400 Mo | Vérifier purge / archivage contributions v2 |',
    '| Actifs 7 j en baisse | Normal en pré-v2 ; suivre après lancement GPS |',
    '',
    '---',
    '',
    'Rapport généré par `pnpm metrics:weekly` · workflow GitHub `weekly-metrics.yml` (lundis 07:00 UTC).',
    'Les montants sont des **ordres de grandeur**, pas les factures Fly/Supabase/Vercel/AdMob.',
    '',
  ].join('\n');
}

async function main(): Promise<void> {
  const prisma = new PrismaClient({ datasources: { db: { url: resolveDbUrl() } } });
  const apiUrl = process.env.METRICS_API_URL ?? 'https://homeshared-api.fly.dev';
  const outputDir = process.env.METRICS_OUTPUT_DIR ?? resolve(repoRoot, 'reports/metrics');
  const dateStr = now.toISOString().slice(0, 10);
  const outputPath = resolve(outputDir, `${dateStr}.md`);

  try {
    const [metrics, health] = await Promise.all([
      collectMetrics(prisma),
      checkApiHealth(apiUrl),
    ]);

    const markdown = buildMarkdown(metrics, health, apiUrl);

    mkdirSync(outputDir, { recursive: true });
    writeFileSync(outputPath, markdown, 'utf8');

    console.log(markdown);
    console.log(`\n→ Rapport écrit : ${outputPath}`);

    if (process.env.GITHUB_STEP_SUMMARY) {
      const summary = [
        '## homeshared — métriques hebdomadaires',
        '',
        `- Utilisateurs actifs (7 j) : **${metrics.activeUsers7d}**`,
        `- Utilisateurs actifs (30 j) : **${metrics.activeUsers30d}**`,
        `- Nouveaux users (7 j) : **${metrics.newUsers7d}**`,
        `- Taille BDD : **${metrics.dbMb} Mo**`,
        `- Coût estimé : **~${estimateMonthlyCosts(metrics.activeUsers30d, metrics.dbMb).totalEur} €/mois**`,
        `- API : ${health.ok ? '✅' : '❌'}`,
        '',
        `[Rapport complet](${outputPath})`,
      ].join('\n');
      writeFileSync(process.env.GITHUB_STEP_SUMMARY, summary, 'utf8');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

import type { PrismaClient, StoreContributionType } from '@prisma/client';
import { ApiError, isStoreMappingPhase, toStoreGpsReadinessEntry, type StoreGpsReadinessEntry } from '@homeshared/shared';

/** Seuil batches validés en dessous duquel le magasin est « pionnier » / phase cartographie. */
export const PIONEER_BATCH_THRESHOLD = 20;

/** Tolérance XY schématique pour alignement avec la médiane communautaire. */
const XY_TOLERANCE = 0.08;

const MAX_EVENTS_PER_BATCH = 50;

export interface ContributionBatchEventInput {
  type: StoreContributionType;
  productFingerprint?: string;
  aisle?: string;
  schematicX?: number;
  schematicY?: number;
  disputedFingerprint?: string;
  /** Pour LAYOUT_FEEDBACK : note libre optionnelle. */
  note?: string;
}

export interface SubmitContributionBatchInput {
  storeOsmId: string;
  layoutProfile?: string;
  sessionStartedAt: string;
  events: ContributionBatchEventInput[];
}

export interface StoreContributionsResponse {
  stats: {
    batchCount: number;
    pioneer: boolean;
  };
  placements: Array<{
    productFingerprint: string;
    aisle: string;
    schematicX: number;
    schematicY: number;
    voteWeight: number;
  }>;
  outOfStock: Array<{
    productFingerprint: string;
    aisle: string | null;
    reportWeight: number;
  }>;
}

type CacheEntry = { expiresAt: number; data: StoreContributionsResponse };

const contributionsCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000;

function parseStoreOsmId(raw: string): bigint {
  try {
    const id = BigInt(raw);
    if (id < 0n) throw new Error('negative');
    return id;
  } catch {
    throw new ApiError('VALIDATION_ERROR', 'storeOsmId invalide.');
  }
}

function clampTrust(score: number): number {
  return Math.min(100, Math.max(0, score));
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
}

function invalidateContributionsCache(storeOsmId: bigint) {
  contributionsCache.delete(storeOsmId.toString());
}

export async function submitContributionBatch(
  prisma: PrismaClient,
  userId: string,
  input: SubmitContributionBatchInput,
) {
  const storeOsmId = parseStoreOsmId(input.storeOsmId);

  if (input.events.length === 0) {
    throw new ApiError('VALIDATION_ERROR', 'Le lot doit contenir au moins un événement.');
  }
  if (input.events.length > MAX_EVENTS_PER_BATCH) {
    throw new ApiError('VALIDATION_ERROR', `Maximum ${MAX_EVENTS_PER_BATCH} événements par lot.`);
  }

  const sessionStartedAt = new Date(input.sessionStartedAt);
  if (Number.isNaN(sessionStartedAt.getTime())) {
    throw new ApiError('VALIDATION_ERROR', 'sessionStartedAt invalide.');
  }

  const existingAggregates = await loadFoundAggregates(prisma, storeOsmId);
  let alignedDelta = 0;
  let outlierDelta = 0;

  for (const event of input.events) {
    if (event.type !== 'FOUND' || !event.productFingerprint) continue;
    const prior = existingAggregates.get(event.productFingerprint);
    if (!prior) continue;
    const xOk = event.schematicX != null && Math.abs(event.schematicX - prior.medianX) <= XY_TOLERANCE;
    const yOk = event.schematicY != null && Math.abs(event.schematicY - prior.medianY) <= XY_TOLERANCE;
    const aisleOk = !event.aisle || event.aisle === prior.medianAisle;
    if (xOk && yOk && aisleOk) alignedDelta += 1;
    else outlierDelta += 1;
  }

  const batch = await prisma.$transaction(async (tx) => {
    const created = await tx.storeContributionBatch.create({
      data: {
        storeOsmId,
        userId,
        layoutProfile: input.layoutProfile ?? null,
        sessionStartedAt,
        events: {
          create: input.events.map((event) => ({
            type: event.type,
            productFingerprint: event.productFingerprint ?? null,
            aisle: event.aisle ?? null,
            schematicX: event.schematicX ?? null,
            schematicY: event.schematicY ?? null,
            disputedFingerprint: event.disputedFingerprint ?? null,
            // note LAYOUT_FEEDBACK encodée dans productFingerprint si présente
            ...(event.type === 'LAYOUT_FEEDBACK' && event.note
              ? { productFingerprint: event.note.slice(0, 280) }
              : {}),
          })),
        },
      },
      include: { events: true },
    });

    const trustDelta = alignedDelta * 0.5 - outlierDelta * 0.3 + 0.2;

    const existingTrust = await tx.contributorTrust.findUnique({ where: { userId } });
    const nextScore = clampTrust((existingTrust?.trustScore ?? 50) + trustDelta);

    await tx.contributorTrust.upsert({
      where: { userId },
      create: {
        userId,
        trustScore: nextScore,
        contributionCount: 1,
        alignedCount: alignedDelta,
        outlierCount: outlierDelta,
      },
      update: {
        trustScore: nextScore,
        contributionCount: { increment: 1 },
        alignedCount: { increment: alignedDelta },
        outlierCount: { increment: outlierDelta },
      },
    });

    return created;
  });

  invalidateContributionsCache(storeOsmId);

  return {
    batchId: batch.id,
    eventCount: batch.events.length,
    submittedAt: batch.submittedAt.toISOString(),
  };
}

async function loadFoundAggregates(prisma: PrismaClient, storeOsmId: bigint) {
  const events = await prisma.storeContributionEvent.findMany({
    where: {
      type: 'FOUND',
      productFingerprint: { not: null },
      batch: { storeOsmId },
    },
    select: {
      productFingerprint: true,
      aisle: true,
      schematicX: true,
      schematicY: true,
      batch: { select: { userId: true } },
    },
  });

  const byProduct = new Map<
    string,
    { xs: number[]; ys: number[]; aisles: string[] }
  >();

  for (const event of events) {
    if (!event.productFingerprint) continue;
    const bucket = byProduct.get(event.productFingerprint) ?? { xs: [], ys: [], aisles: [] };
    if (event.schematicX != null) bucket.xs.push(event.schematicX);
    if (event.schematicY != null) bucket.ys.push(event.schematicY);
    if (event.aisle) bucket.aisles.push(event.aisle);
    byProduct.set(event.productFingerprint, bucket);
  }

  const result = new Map<
    string,
    { medianX: number; medianY: number; medianAisle: string | null }
  >();

  for (const [fp, bucket] of byProduct) {
    const aisleCounts = new Map<string, number>();
    for (const a of bucket.aisles) {
      aisleCounts.set(a, (aisleCounts.get(a) ?? 0) + 1);
    }
    let medianAisle: string | null = null;
    let maxCount = 0;
    for (const [aisle, count] of aisleCounts) {
      if (count > maxCount) {
        maxCount = count;
        medianAisle = aisle;
      }
    }
    result.set(fp, {
      medianX: median(bucket.xs),
      medianY: median(bucket.ys),
      medianAisle,
    });
  }

  return result;
}

export async function getStoreContributions(
  prisma: PrismaClient,
  storeOsmIdRaw: string,
): Promise<StoreContributionsResponse> {
  const storeOsmId = parseStoreOsmId(storeOsmIdRaw);
  const cacheKey = storeOsmId.toString();
  const cached = contributionsCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const batchCount = await prisma.storeContributionBatch.count({
    where: { storeOsmId },
  });

  const foundEvents = await prisma.storeContributionEvent.findMany({
    where: {
      type: 'FOUND',
      productFingerprint: { not: null },
      batch: { storeOsmId },
    },
    select: {
      productFingerprint: true,
      aisle: true,
      schematicX: true,
      schematicY: true,
      batch: {
        select: {
          user: { select: { contributorTrust: { select: { trustScore: true } } } },
        },
      },
    },
  });

  const placementMap = new Map<
    string,
    {
      aisle: string;
      xs: number[];
      ys: number[];
      weight: number;
    }
  >();

  for (const event of foundEvents) {
    if (!event.productFingerprint || !event.aisle) continue;
    if (event.schematicX == null || event.schematicY == null) continue;
    const weight = event.batch.user.contributorTrust?.trustScore ?? 50;
    const bucket = placementMap.get(event.productFingerprint) ?? {
      aisle: event.aisle,
      xs: [],
      ys: [],
      weight: 0,
    };
    bucket.xs.push(event.schematicX);
    bucket.ys.push(event.schematicY);
    bucket.weight += weight;
    placementMap.set(event.productFingerprint, bucket);
  }

  const placements = [...placementMap.entries()].map(([productFingerprint, bucket]) => ({
    productFingerprint,
    aisle: bucket.aisle,
    schematicX: median(bucket.xs),
    schematicY: median(bucket.ys),
    voteWeight: bucket.weight,
  }));

  const oosEvents = await prisma.storeContributionEvent.findMany({
    where: {
      type: 'OUT_OF_STOCK',
      productFingerprint: { not: null },
      batch: { storeOsmId },
    },
    select: {
      productFingerprint: true,
      aisle: true,
      batch: {
        select: {
          user: { select: { contributorTrust: { select: { trustScore: true } } } },
        },
      },
    },
  });

  const oosMap = new Map<string, { aisle: string | null; weight: number }>();
  for (const event of oosEvents) {
    if (!event.productFingerprint) continue;
    const weight = event.batch.user.contributorTrust?.trustScore ?? 50;
    const prev = oosMap.get(event.productFingerprint) ?? { aisle: event.aisle, weight: 0 };
    prev.weight += weight;
    oosMap.set(event.productFingerprint, prev);
  }

  const data: StoreContributionsResponse = {
    stats: {
      batchCount,
      pioneer: isStoreMappingPhase(batchCount),
    },
    placements,
    outOfStock: [...oosMap.entries()].map(([productFingerprint, v]) => ({
      productFingerprint,
      aisle: v.aisle,
      reportWeight: v.weight,
    })),
  };

  contributionsCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, data });
  return data;
}

/** Lecture légère : suffisant pour filtrer les magasins proposables en mode GPS. */
export async function getStoresGpsReadiness(
  prisma: PrismaClient,
  storeOsmIdsRaw: string[],
): Promise<Record<string, StoreGpsReadinessEntry>> {
  const unique = [...new Set(storeOsmIdsRaw.map((id) => id.trim()).filter(Boolean))].slice(0, 20);
  const result: Record<string, StoreGpsReadinessEntry> = {};

  await Promise.all(
    unique.map(async (raw) => {
      const storeOsmId = parseStoreOsmId(raw);
      const cacheKey = storeOsmId.toString();
      const cached = contributionsCache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        result[cacheKey] = toStoreGpsReadinessEntry(cached.data.stats.batchCount);
        return;
      }

      const batchCount = await prisma.storeContributionBatch.count({
        where: { storeOsmId },
      });
      result[cacheKey] = toStoreGpsReadinessEntry(batchCount);
    }),
  );

  return result;
}

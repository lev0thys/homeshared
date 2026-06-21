import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '@homeshared/shared';
import {
  getStoreContributions,
  PIONEER_BATCH_THRESHOLD,
  submitContributionBatch,
} from './store-contributions.service.js';

describe('store-contributions.service', () => {
  it('getStoreContributions marque pioneer si batchCount sous le seuil', async () => {
    const prisma = {
      storeContributionBatch: {
        count: vi.fn().mockResolvedValue(PIONEER_BATCH_THRESHOLD - 1),
      },
      storeContributionEvent: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    } as never;

    const result = await getStoreContributions(prisma, '12345');
    expect(result.stats.pioneer).toBe(true);
    expect(result.stats.batchCount).toBe(PIONEER_BATCH_THRESHOLD - 1);
  });

  it('getStoreContributions n’est plus pioneer au seuil', async () => {
    const prisma = {
      storeContributionBatch: {
        count: vi.fn().mockResolvedValue(PIONEER_BATCH_THRESHOLD),
      },
      storeContributionEvent: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    } as never;

    const result = await getStoreContributions(prisma, '99');
    expect(result.stats.pioneer).toBe(false);
  });

  it('getStoreContributions agrège les emplacements FOUND', async () => {
    const prisma = {
      storeContributionBatch: {
        count: vi.fn().mockResolvedValue(5),
      },
      storeContributionEvent: {
        findMany: vi
          .fn()
          .mockResolvedValueOnce([
            {
              productFingerprint: 'lait',
              aisle: 'DAIRY',
              schematicX: 0.4,
              schematicY: 0.5,
              batch: { user: { contributorTrust: { trustScore: 60 } } },
            },
            {
              productFingerprint: 'lait',
              aisle: 'DAIRY',
              schematicX: 0.6,
              schematicY: 0.5,
              batch: { user: { contributorTrust: { trustScore: 40 } } },
            },
          ])
          .mockResolvedValueOnce([]),
      },
    } as never;

    const result = await getStoreContributions(prisma, '42');
    expect(result.placements).toHaveLength(1);
    expect(result.placements[0]?.productFingerprint).toBe('lait');
    expect(result.placements[0]?.schematicX).toBeCloseTo(0.5, 5);
    expect(result.placements[0]?.voteWeight).toBe(100);
  });

  it('submitContributionBatch refuse un lot vide', async () => {
    const prisma = {} as never;
    await expect(
      submitContributionBatch(prisma, 'user-1', {
        storeOsmId: '1',
        sessionStartedAt: new Date().toISOString(),
        events: [],
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('submitContributionBatch refuse storeOsmId invalide', async () => {
    const prisma = {} as never;
    await expect(
      submitContributionBatch(prisma, 'user-1', {
        storeOsmId: 'not-a-number',
        sessionStartedAt: new Date().toISOString(),
        events: [{ type: 'POSITION_FIX', schematicX: 0.5, schematicY: 0.5 }],
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('submitContributionBatch crée un lot et met à jour la confiance', async () => {
    const createdBatch = {
      id: 'batch-1',
      submittedAt: new Date('2026-05-28T10:00:00Z'),
      events: [{ id: 'e1' }],
    };

    const tx = {
      storeContributionBatch: {
        create: vi.fn().mockResolvedValue(createdBatch),
      },
      contributorTrust: {
        findUnique: vi.fn().mockResolvedValue(null),
        upsert: vi.fn().mockResolvedValue({}),
      },
    };

    const prisma = {
      storeContributionEvent: {
        findMany: vi.fn().mockResolvedValue([]),
      },
      $transaction: vi.fn(async (fn: (client: typeof tx) => Promise<unknown>) => fn(tx)),
    } as never;

    const result = await submitContributionBatch(prisma, 'user-1', {
      storeOsmId: '123',
      layoutProfile: 'HYPERMARKET_FR',
      sessionStartedAt: new Date().toISOString(),
      events: [
        {
          type: 'FOUND',
          productFingerprint: 'pain',
          aisle: 'BAKERY',
          schematicX: 0.2,
          schematicY: 0.3,
        },
      ],
    });

    expect(result.batchId).toBe('batch-1');
    expect(result.eventCount).toBe(1);
    expect(tx.contributorTrust.upsert).toHaveBeenCalledOnce();
  });
});

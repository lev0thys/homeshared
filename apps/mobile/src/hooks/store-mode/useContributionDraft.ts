import { useCallback, useMemo, useState } from 'react';
import type { StoreAisleId } from '@homeshared/shared';
import type { StoreLayoutProfileId } from '@homeshared/store-navigation';
import { api } from '@/lib/api-client';

export type ContributionDraftEvent =
  | {
      type: 'FOUND';
      productFingerprint: string;
      aisle: StoreAisleId;
      schematicX: number;
      schematicY: number;
    }
  | {
      type: 'POSITION_FIX';
      schematicX: number;
      schematicY: number;
      aisle?: StoreAisleId;
      note?: string;
    }
  | {
      type: 'OUT_OF_STOCK';
      productFingerprint: string;
      aisle?: StoreAisleId;
    }
  | {
      type: 'WRONG_PLACEMENT';
      productFingerprint: string;
      suggestedAisle?: StoreAisleId;
      schematicX?: number;
      schematicY?: number;
    }
  | {
      type: 'LAYOUT_FEEDBACK';
      issue: 'WRONG_PROFILE' | 'AISLE_ORDER' | 'MISSING_AISLE' | 'OTHER';
      note?: string;
    };

interface SubmitBatchParams {
  storeOsmId: string;
  layoutProfile: StoreLayoutProfileId;
  sessionStartedAt: string;
}

type LayoutFeedbackIssue = Extract<ContributionDraftEvent, { type: 'LAYOUT_FEEDBACK' }>['issue'];

export function useContributionDraft() {
  const [events, setEvents] = useState<ContributionDraftEvent[]>([]);

  const append = useCallback((event: ContributionDraftEvent) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  const recordFound = useCallback(
    (input: {
      productFingerprint: string;
      aisle: StoreAisleId;
      schematicX: number;
      schematicY: number;
    }) => {
      append({ type: 'FOUND', ...input });
    },
    [append],
  );

  const recordPositionFix = useCallback(
    (input: { schematicX: number; schematicY: number; aisle?: StoreAisleId }) => {
      append({ type: 'POSITION_FIX', ...input });
    },
    [append],
  );

  const recordOutOfStock = useCallback(
    (input: { productFingerprint: string; aisle?: StoreAisleId }) => {
      append({ type: 'OUT_OF_STOCK', ...input });
    },
    [append],
  );

  const recordLayoutFeedback = useCallback(
    (issue: LayoutFeedbackIssue, note?: string) => {
      append({ type: 'LAYOUT_FEEDBACK', issue, note });
    },
    [append],
  );

  const clear = useCallback(() => setEvents([]), []);

  const submitBatch = useCallback(
    async (params: SubmitBatchParams) => {
      if (events.length === 0) return null;
      const result = await api.post<{ batchId: string; eventCount: number }>(
        '/api/stores/contributions/batch',
        {
          storeOsmId: params.storeOsmId,
          layoutProfile: params.layoutProfile,
          sessionStartedAt: params.sessionStartedAt,
          events,
        },
      );
      clear();
      return result;
    },
    [clear, events],
  );

  return useMemo(
    () => ({
      events,
      eventCount: events.length,
      recordFound,
      recordPositionFix,
      recordOutOfStock,
      recordLayoutFeedback,
      submitBatch,
      clear,
    }),
    [
      clear,
      events,
      recordFound,
      recordLayoutFeedback,
      recordOutOfStock,
      recordPositionFix,
      submitBatch,
    ],
  );
}

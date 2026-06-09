import { useState, useCallback } from 'react';
import { ApiClientError } from '@/lib/api-client';

export function useMutationError() {
  const [error, setError] = useState<string | null>(null);
  const clearError = useCallback(() => setError(null), []);

  const capture = useCallback((err: unknown, fallback = 'Une erreur est survenue.') => {
    if (err instanceof ApiClientError) {
      const details = err.body.details as { fieldErrors?: Record<string, string[]> } | undefined;
      const fieldMsg = details?.fieldErrors
        ? Object.values(details.fieldErrors).flat()[0]
        : undefined;
      setError(fieldMsg ?? err.message);
      return;
    }
    if (err instanceof Error) {
      setError(err.message);
      return;
    }
    setError(fallback);
  }, []);

  return { error, setError, clearError, capture };
}

import { supabase } from './supabase';
import { env } from './env';
import type { ApiErrorBody } from '@homeshared/shared';

class ApiClientError extends Error {
  constructor(
    public readonly body: ApiErrorBody,
    public readonly status: number,
  ) {
    super(body.message);
  }
}

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Helper HTTP minimal qui :
 * - injecte le Bearer token Supabase
 * - n'envoie Content-Type JSON que si un body est présent (évite FST_ERR_CTP_EMPTY_JSON_BODY sur DELETE)
 * - parse la réponse JSON
 */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(await authHeader()),
    ...(init.headers as Record<string, string> | undefined),
  };

  const hasBody = init.body !== undefined && init.body !== null && init.body !== '';
  if (hasBody && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${env.API_URL}${path}`, { ...init, headers }).catch((cause) => {
    throw new ApiClientError(
      {
        code: 'INTERNAL_ERROR',
        message:
          'Serveur injoignable. Vérifie que l’API tourne sur le port 3001 (pnpm dev:api).',
      },
      0,
    );
  });

  if (!res.ok) {
    let body: ApiErrorBody;
    try {
      body = (await res.json()) as ApiErrorBody;
    } catch {
      body = { code: 'INTERNAL_ERROR', message: `HTTP ${res.status}` };
    }
    throw new ApiClientError(body, res.status);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export { ApiClientError };

import { supabase } from './supabase';
import { env } from './env';
import type { ApiErrorBody } from '@homeshared/shared';

class ApiClientError extends Error {
  constructor(public readonly body: ApiErrorBody, public readonly status: number) {
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
 * - parse la réponse JSON
 * - throw une ApiClientError typée sur les non-2xx
 */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(await authHeader()),
    ...(init.headers as Record<string, string> | undefined),
  };
  const res = await fetch(`${env.API_URL}${path}`, { ...init, headers });

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
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export { ApiClientError };

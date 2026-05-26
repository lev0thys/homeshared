/**
 * Erreurs métier typées partagées entre l'API et le client mobile.
 * Permet d'identifier précisément le type d'erreur côté UI pour afficher
 * un message utilisateur traduit (FR/EN).
 */
export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'GROUP_FULL'
  | 'INVITE_EXPIRED'
  | 'INVITE_ALREADY_USED'
  | 'INTERNAL_ERROR';

export interface ApiErrorBody {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toJSON(): ApiErrorBody {
    return { code: this.code, message: this.message, details: this.details };
  }
}

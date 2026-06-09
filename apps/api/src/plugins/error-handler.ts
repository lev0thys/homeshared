import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { ApiError } from '@homeshared/shared';

export function errorHandler(
  err: FastifyError | ApiError | ZodError,
  req: FastifyRequest,
  reply: FastifyReply,
) {
  req.log.error({ err }, 'Erreur API');

  if (err instanceof ApiError) {
    const status = statusFromCode(err.code);
    return reply.status(status).send(err.toJSON());
  }

  const fastifyErr = err as FastifyError & { code?: string; statusCode?: number };
  if (fastifyErr.statusCode === 429 || fastifyErr.code === 'FST_ERR_RATE_LIMIT') {
    return reply.status(429).send({
      code: 'RATE_LIMITED',
      message: 'Trop de requêtes. Réessayez dans un instant.',
    });
  }
  if (fastifyErr.code === 'FST_ERR_CTP_EMPTY_JSON_BODY') {
    return reply.status(400).send({
      code: 'VALIDATION_ERROR',
      message: 'Corps JSON vide alors que Content-Type est application/json.',
    });
  }

  if (err instanceof ZodError) {
    const flat = err.flatten();
    const firstField =
      Object.values(flat.fieldErrors).flat()[0] ?? flat.formErrors[0];
    return reply.status(400).send({
      code: 'VALIDATION_ERROR',
      message: firstField ?? 'Données invalides.',
      details: flat,
    });
  }

  return reply.status(500).send({
    code: 'INTERNAL_ERROR',
    message: 'Erreur serveur inattendue.',
  });
}

function statusFromCode(code: ApiError['code']): number {
  switch (code) {
    case 'UNAUTHORIZED':
      return 401;
    case 'FORBIDDEN':
      return 403;
    case 'NOT_FOUND':
      return 404;
    case 'CONFLICT':
    case 'GROUP_FULL':
    case 'INVITE_ALREADY_USED':
      return 409;
    case 'INVITE_EXPIRED':
      return 410;
    case 'VALIDATION_ERROR':
      return 400;
    default:
      return 500;
  }
}

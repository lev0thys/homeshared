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

  if (err instanceof ZodError) {
    return reply.status(400).send({
      code: 'VALIDATION_ERROR',
      message: 'Données invalides.',
      details: err.flatten(),
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

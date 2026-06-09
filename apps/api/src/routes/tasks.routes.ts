import type { FastifyPluginAsync } from 'fastify';
import {
  createHouseholdTaskSchema,
  updateHouseholdTaskSchema,
  ApiError,
} from '@homeshared/shared';
import { ensureGroupFeature, ensureMembership } from '../services/group.service.js';
import { rateLimitRoutes } from '../constants/rate-limits.js';

const userSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} as const;

export const tasksRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', (req) => app.requireAuth(req));

  app.get('/:groupId', async (req) => {
    const { groupId } = req.params as { groupId: string };
    await ensureMembership(app.prisma, groupId, req.userId!);
    await ensureGroupFeature(app.prisma, groupId, 'TASKS');

    return app.prisma.householdTask.findMany({
      where: { groupId, status: { not: 'DONE' } },
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
      include: {
        createdBy: { select: userSelect },
        claimedBy: { select: userSelect },
      },
    });
  });

  app.post('/', { config: rateLimitRoutes.write }, async (req) => {
    const input = createHouseholdTaskSchema.parse(req.body);
    await ensureMembership(app.prisma, input.groupId, req.userId!);
    await ensureGroupFeature(app.prisma, input.groupId, 'TASKS');

    return app.prisma.householdTask.create({
      data: {
        groupId: input.groupId,
        title: input.title,
        description: input.description ?? null,
        recurrence: input.recurrence,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        estimatedDurationMinutes: input.estimatedDurationMinutes ?? null,
        createdById: req.userId!,
      },
      include: {
        createdBy: { select: userSelect },
        claimedBy: { select: userSelect },
      },
    });
  });

  app.patch('/:taskId', async (req) => {
    const { taskId } = req.params as { taskId: string };
    const input = updateHouseholdTaskSchema.parse(req.body);
    const task = await app.prisma.householdTask.findUnique({ where: { id: taskId } });
    if (!task) throw new ApiError('NOT_FOUND', 'Tâche introuvable.');
    await ensureMembership(app.prisma, task.groupId, req.userId!);

    return app.prisma.householdTask.update({
      where: { id: taskId },
      data: {
        title: input.title,
        description: input.description,
        recurrence: input.recurrence,
        dueDate: input.dueDate === undefined ? undefined : input.dueDate ? new Date(input.dueDate) : null,
        estimatedDurationMinutes: input.estimatedDurationMinutes,
      },
      include: {
        createdBy: { select: userSelect },
        claimedBy: { select: userSelect },
      },
    });
  });

  app.post('/:taskId/claim', async (req) => {
    const { taskId } = req.params as { taskId: string };
    const task = await app.prisma.householdTask.findUnique({ where: { id: taskId } });
    if (!task) throw new ApiError('NOT_FOUND', 'Tâche introuvable.');
    if (task.status === 'DONE') throw new ApiError('CONFLICT', 'Tâche déjà terminée.');
    await ensureMembership(app.prisma, task.groupId, req.userId!);

    return app.prisma.householdTask.update({
      where: { id: taskId },
      data: {
        status: 'CLAIMED',
        claimedById: req.userId!,
        claimedAt: new Date(),
      },
      include: {
        createdBy: { select: userSelect },
        claimedBy: { select: userSelect },
      },
    });
  });

  app.post('/:taskId/unclaim', async (req) => {
    const { taskId } = req.params as { taskId: string };
    const task = await app.prisma.householdTask.findUnique({ where: { id: taskId } });
    if (!task) throw new ApiError('NOT_FOUND', 'Tâche introuvable.');
    if (task.claimedById !== req.userId!) {
      throw new ApiError('FORBIDDEN', 'Seule la personne assignée peut se désassigner.');
    }
    await ensureMembership(app.prisma, task.groupId, req.userId!);

    return app.prisma.householdTask.update({
      where: { id: taskId },
      data: { status: 'OPEN', claimedById: null, claimedAt: null },
      include: {
        createdBy: { select: userSelect },
        claimedBy: { select: userSelect },
      },
    });
  });

  app.post('/:taskId/complete', async (req) => {
    const { taskId } = req.params as { taskId: string };
    const task = await app.prisma.householdTask.findUnique({ where: { id: taskId } });
    if (!task) throw new ApiError('NOT_FOUND', 'Tâche introuvable.');
    await ensureMembership(app.prisma, task.groupId, req.userId!);

    const canComplete =
      task.claimedById === req.userId! ||
      task.createdById === req.userId! ||
      task.status === 'OPEN';
    if (!canComplete) {
      throw new ApiError('FORBIDDEN', 'Tâche assignée à quelqu\'un d\'autre.');
    }

    const now = new Date();

    if (task.recurrence === 'ONCE') {
      return app.prisma.householdTask.update({
        where: { id: taskId },
        data: { status: 'DONE', completedAt: now },
        include: {
          createdBy: { select: userSelect },
          claimedBy: { select: userSelect },
        },
      });
    }

    // Tâches récurrentes : réouverture automatique pour la prochaine occurrence.
    return app.prisma.householdTask.update({
      where: { id: taskId },
      data: {
        status: 'OPEN',
        claimedById: null,
        claimedAt: null,
        completedAt: now,
      },
      include: {
        createdBy: { select: userSelect },
        claimedBy: { select: userSelect },
      },
    });
  });

  app.delete('/:taskId', async (req, reply) => {
    const { taskId } = req.params as { taskId: string };
    const task = await app.prisma.householdTask.findUnique({ where: { id: taskId } });
    if (!task) throw new ApiError('NOT_FOUND', 'Tâche introuvable.');
    if (task.createdById !== req.userId!) {
      throw new ApiError('FORBIDDEN', 'Seul le créateur peut supprimer la tâche.');
    }
    await ensureMembership(app.prisma, task.groupId, req.userId!);
    await app.prisma.householdTask.delete({ where: { id: taskId } });
    return reply.status(204).send();
  });
};

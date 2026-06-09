import { describe, expect, it } from 'vitest';
import type { GroupRole, MealSlot } from '@prisma/client';
import {
  canEditMealSlot,
  canManageMealPermissions,
  mealReminderDate,
} from './group-permissions.service.js';

describe('canManageMealPermissions', () => {
  it('autorise uniquement OWNER', () => {
    expect(canManageMealPermissions('OWNER')).toBe(true);
    expect(canManageMealPermissions('ADMIN')).toBe(false);
    expect(canManageMealPermissions('MEMBER')).toBe(false);
  });
});

describe('canEditMealSlot', () => {
  const slot: MealSlot = 'LUNCH';

  it('OWNER et ADMIN éditent tout', () => {
    expect(canEditMealSlot({ role: 'OWNER' as GroupRole, grants: [] }, 1, slot)).toBe(true);
    expect(canEditMealSlot({ role: 'ADMIN' as GroupRole, grants: [] }, 1, slot)).toBe(true);
  });

  it('EDIT_ALL sans rôle admin', () => {
    expect(
      canEditMealSlot(
        { role: 'MEMBER' as GroupRole, grants: [{ permission: 'EDIT_ALL', dayOfWeek: null, mealSlot: null }] },
        3,
        slot,
      ),
    ).toBe(true);
  });

  it('EDIT_SLOT ciblé jour + créneau', () => {
    const ctx = {
      role: 'MEMBER' as GroupRole,
      grants: [{ permission: 'EDIT_SLOT' as const, dayOfWeek: 1, mealSlot: 'LUNCH' as MealSlot }],
    };
    expect(canEditMealSlot(ctx, 1, 'LUNCH')).toBe(true);
    expect(canEditMealSlot(ctx, 1, 'DINNER')).toBe(false);
    expect(canEditMealSlot(ctx, 2, 'LUNCH')).toBe(false);
  });

  it('VIEW seul ne permet pas d\'éditer', () => {
    expect(
      canEditMealSlot(
        { role: 'MEMBER' as GroupRole, grants: [{ permission: 'VIEW', dayOfWeek: null, mealSlot: null }] },
        0,
        slot,
      ),
    ).toBe(false);
  });
});

describe('mealReminderDate', () => {
  it('calcule l\'heure du repas en UTC', () => {
    const weekStart = new Date('2026-05-25T00:00:00.000Z');
    const at = mealReminderDate(weekStart, 1, 'LUNCH', {
      breakfastTime: '08:00',
      lunchTime: '12:30',
      dinnerTime: '19:30',
    });
    expect(at.toISOString()).toBe('2026-05-26T12:30:00.000Z');
  });
});

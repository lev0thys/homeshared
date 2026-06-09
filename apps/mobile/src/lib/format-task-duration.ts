import type { TFunction } from 'i18next';

/** Affiche une durée en minutes (ex. 30 min, 1 h, 1 h 30). */
export function formatTaskDuration(minutes: number, t: TFunction): string {
  if (minutes < 60) {
    return t('tasks.durationMinutes', { count: minutes });
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) {
    return t('tasks.durationHours', { count: hours });
  }
  return t('tasks.durationHoursMinutes', { hours, minutes: rest });
}

/** Parse saisie utilisateur (minutes) — null si vide, undefined si invalide. */
export function parseEstimatedDurationInput(raw: string): number | null | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const value = Number.parseInt(trimmed, 10);
  if (Number.isNaN(value) || value < 1 || value > 480) return undefined;
  return value;
}

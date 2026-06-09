/** Lundi de la semaine (ISO date UTC YYYY-MM-DD). */
export function mondayIsoUtc(ref: Date = new Date()): string {
  const d = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate()));
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}

export function addWeeksToMonday(mondayIso: string, deltaWeeks: number): string {
  const d = new Date(`${mondayIso}T12:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + deltaWeeks * 7);
  return mondayIsoUtc(d);
}

/** 0 = lundi … 6 = dimanche (repère planning). */
export function todayDayIndexUtc(ref: Date = new Date()): number {
  const day = ref.getUTCDay();
  return day === 0 ? 6 : day - 1;
}

/** Dates ISO (YYYY-MM-DD) des 7 jours d'une semaine à partir du lundi. */
export function weekDateKeys(mondayIso: string): string[] {
  return Array.from({ length: 7 }, (_, dayIndex) => dateIsoForWeekDay(mondayIso, dayIndex));
}

/** Date ISO d'un jour de la semaine (0 = lundi … 6 = dimanche). */
export function dateIsoForWeekDay(mondayIso: string, dayIndex: number): string {
  const d = new Date(`${mondayIso}T12:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + dayIndex);
  return d.toISOString().slice(0, 10);
}

/** Extrait la date UTC depuis un instant ISO API. */
export function dateKeyFromIsoInstant(iso: string): string {
  return iso.slice(0, 10);
}

/** Index 0–6 dans la semaine du lundi, ou null si hors semaine / sans date. */
export function dayIndexInWeek(dateIso: string, mondayIso: string): number | null {
  const keys = weekDateKeys(mondayIso);
  const idx = keys.indexOf(dateIso);
  return idx >= 0 ? idx : null;
}

export function dueDateInstantForDay(dateIso: string): string {
  return `${dateIso}T12:00:00.000Z`;
}

/** Libellé court « 26 mai – 1 juin » (locale navigateur). */
export function formatWeekRangeLabel(mondayIso: string, locale = 'fr-FR'): string {
  const start = new Date(`${mondayIso}T12:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  const fmt: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const a = start.toLocaleDateString(locale, fmt);
  const b = end.toLocaleDateString(locale, fmt);
  return `${a} – ${b}`;
}

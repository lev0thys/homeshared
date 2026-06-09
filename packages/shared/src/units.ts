/** Unités courantes pour courses / frigo / recettes (FR). */
export const COMMON_UNITS = ['pièce', 'g', 'kg', 'ml', 'L', 'càs', 'càc'] as const;

export type CommonUnit = (typeof COMMON_UNITS)[number];

type UnitFamily = 'mass' | 'volume' | 'count' | 'spoon';

interface UnitDef {
  family: UnitFamily;
  /** Facteur vers l'unité de base de la famille (g, ml, pièce). */
  toBase: number;
}

const UNIT_MAP: Record<string, UnitDef> = {
  g: { family: 'mass', toBase: 1 },
  gr: { family: 'mass', toBase: 1 },
  gramme: { family: 'mass', toBase: 1 },
  grammes: { family: 'mass', toBase: 1 },
  kg: { family: 'mass', toBase: 1000 },
  kilo: { family: 'mass', toBase: 1000 },
  kilogramme: { family: 'mass', toBase: 1000 },
  mg: { family: 'mass', toBase: 0.001 },
  ml: { family: 'volume', toBase: 1 },
  cl: { family: 'volume', toBase: 10 },
  l: { family: 'volume', toBase: 1000 },
  litre: { family: 'volume', toBase: 1000 },
  litres: { family: 'volume', toBase: 1000 },
  piece: { family: 'count', toBase: 1 },
  pieces: { family: 'count', toBase: 1 },
  pce: { family: 'count', toBase: 1 },
  pcs: { family: 'count', toBase: 1 },
  unite: { family: 'count', toBase: 1 },
  unites: { family: 'count', toBase: 1 },
  u: { family: 'count', toBase: 1 },
  cas: { family: 'spoon', toBase: 1 },
  'càs': { family: 'spoon', toBase: 1 },
  cs: { family: 'spoon', toBase: 1 },
  cac: { family: 'spoon', toBase: 0.33 },
  'càc': { family: 'spoon', toBase: 0.33 },
  cc: { family: 'spoon', toBase: 0.33 },
  pincee: { family: 'spoon', toBase: 0.1 },
  pincée: { family: 'spoon', toBase: 0.1 },
  gousse: { family: 'count', toBase: 1 },
  gousses: { family: 'count', toBase: 1 },
  botte: { family: 'count', toBase: 1 },
  bottes: { family: 'count', toBase: 1 },
  tranche: { family: 'count', toBase: 1 },
  tranches: { family: 'count', toBase: 1 },
  feuille: { family: 'count', toBase: 1 },
  feuilles: { family: 'count', toBase: 1 },
};

/** Normalise une unité saisie (casse, accents, alias). */
export function normalizeUnit(unit: string | null | undefined): string | null {
  if (!unit || !unit.trim()) return null;
  const key = unit
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, '');
  if (key === 'piece' || key === 'pieces' || key === 'pièce' || key === 'pièces') return 'pièce';
  if (UNIT_MAP[key]) return unit.trim();
  return unit.trim();
}

function resolveUnitDef(
  unit: string | null | undefined,
  fallback: string | null | undefined,
): UnitDef | null {
  const raw = (unit ?? fallback ?? 'pièce')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, '');
  const key =
    raw === 'piece' || raw === 'pieces' || raw === 'pièce' || raw === 'pièces' ? 'piece' : raw;
  return UNIT_MAP[key] ?? (unit === null && fallback === null ? UNIT_MAP.piece! : null);
}

/**
 * Convertit une quantité vers une autre unité compatible.
 * Retourne null si les familles d'unités diffèrent (ex. g vs pièce).
 */
export function convertQuantity(
  quantity: number,
  fromUnit: string | null,
  toUnit: string | null,
  fallbackFrom?: string | null,
  fallbackTo?: string | null,
): number | null {
  const from = resolveUnitDef(fromUnit, fallbackFrom);
  const to = resolveUnitDef(toUnit, fallbackTo);
  if (!from || !to) return null;
  if (from.family !== to.family) return null;
  const base = quantity * from.toBase;
  return base / to.toBase;
}

export interface QuantityCheck {
  required: number;
  available: number;
  unit: string | null;
  sufficient: boolean;
  shortfall: number;
}

/** Compare stock frigo vs besoin recette (unités converties si possible). */
export function compareQuantities(
  availableQty: number,
  availableUnit: string | null,
  requiredQty: number,
  requiredUnit: string | null,
  ingredientDefaultUnit?: string | null,
): QuantityCheck {
  const unit = requiredUnit ?? ingredientDefaultUnit ?? availableUnit ?? 'pièce';
  const converted = convertQuantity(
    availableQty,
    availableUnit,
    unit,
    ingredientDefaultUnit,
    ingredientDefaultUnit,
  );

  if (converted === null && availableUnit === null && requiredUnit === null) {
    return {
      required: requiredQty,
      available: availableQty,
      unit: null,
      sufficient: availableQty >= requiredQty,
      shortfall: Math.max(0, requiredQty - availableQty),
    };
  }

  const available = converted ?? 0;
  return {
    required: requiredQty,
    available: Number(available.toFixed(2)),
    unit,
    sufficient: available >= requiredQty,
    shortfall: Number(Math.max(0, requiredQty - available).toFixed(2)),
  };
}

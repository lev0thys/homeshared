/**
 * Portions « équivalent adulte » pour adapter les quantités recettes.
 * Références : ANSES (apports de référence par âge) — un enfant 6–12 ans ≈ 65–75 % d’un adulte
 * pour un repas familial type ; nous utilisons 0,65 comme valeur médiane prudente.
 */
export const PORTION_ADULT_EQUIVALENT = 1;
export const PORTION_CHILD_EQUIVALENT = 0.65;

/** Calcule le nombre de portions recette (équivalent adulte, min 1). */
export function computeEffectiveServings(adultEaters: number, childEaters: number): number {
  const adults = Math.max(0, adultEaters);
  const children = Math.max(0, childEaters);
  const raw = adults * PORTION_ADULT_EQUIVALENT + children * PORTION_CHILD_EQUIVALENT;
  return Math.max(1, Math.round(raw * 10) / 10);
}

export function formatServingsLabel(
  effective: number,
  adultEaters: number,
  childEaters: number,
): string {
  if (childEaters > 0) {
    return `${effective} (${adultEaters} adulte${adultEaters > 1 ? 's' : ''}, ${childEaters} enfant${childEaters > 1 ? 's' : ''})`;
  }
  return String(effective);
}

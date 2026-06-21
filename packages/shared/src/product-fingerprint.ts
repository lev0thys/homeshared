/** Empreinte stable d'un produit pour agrégation communautaire (pas de hash crypto). */
export function productFingerprint(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ');
}

import type { StoreLayoutProfileId } from './types.js';

export interface LayoutProfileMeta {
  id: StoreLayoutProfileId;
  labelFr: string;
  descriptionFr: string;
  /** Emoji résumé pour la fiche magasin. */
  emoji: string;
  /** Ordre typique des rayons (résumé UX). */
  aisleFlowHint: string;
}

export const LAYOUT_PROFILE_META: Record<StoreLayoutProfileId, LayoutProfileMeta> = {
  HYPERMARKET_FR: {
    id: 'HYPERMARKET_FR',
    labelFr: 'Hypermarché',
    descriptionFr:
      'Plan type Leclerc/Auchan (>3000 m²) : double entrée, frais en L (gauche + haut), grille d’allées verticales au centre, aile droite en rayons horizontaux (droguerie, bazar, électro), caisses en bas.',
    emoji: '🏬',
    aisleFlowHint: 'Entrée → couloir frais (gauche) → épicerie (centre) → caisses',
  },
  SUPERMARKET_FR: {
    id: 'SUPERMARKET_FR',
    labelFr: 'Supermarché',
    descriptionFr:
      'Plan type Carrefour Market / Super U (800–2500 m²) : une entrée, frais sur le côté gauche et le fond, 3 allées verticales, pas d’aile non-alimentaire.',
    emoji: '🏪',
    aisleFlowHint: 'Frais gauche → 3 allées → caisses',
  },
  PROXI_FR: {
    id: 'PROXI_FR',
    labelFr: 'Proximité',
    descriptionFr:
      'Plan type Franprix / Carrefour City (<400 m²) : linéaire compact, une allée centrale, frais sur les côtés, caisse unique.',
    emoji: '🛍️',
    aisleFlowHint: 'Entrée → allée → caisse',
  },
};

export function getLayoutProfileMeta(profile: StoreLayoutProfileId): LayoutProfileMeta {
  return LAYOUT_PROFILE_META[profile] ?? LAYOUT_PROFILE_META.HYPERMARKET_FR;
}

import type { StoreLayout } from '../types.js';

/**
 * Hyper français type Leclerc / Auchan / Carrefour (plan CAD réel) :
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Vins │ Charcuterie │ Poisson │     (bandeau frais / cave)    │
 * ├──┬──┬──────────────────────────────────────┬──┬──────────────┤
 * │F │█│ Allée1 │ Allée2 │ Allée3 │ Promo │ P │█│ Droguerie    │
 * │& │█│        │        │        │       │ a │█│ Bazar        │
 * │L │█│  épicerie verticale (grille)       │ r │█│ Électro      │
 * │  │█│                                    │ f │█│ Textile      │
 * │B │█│                                    │   │█│              │
 * │o │█│                                    │   │█│              │
 * │u │█│                                    │   │█│              │
 * │c │█│                                    │   │█│              │
 * │h │█│                                    │   │█│              │
 * │  │█│                                    │   │█│              │
 * │Cr│█│ Surgelés │ Boulangerie             │   │█│ Culture      │
 * ├──┴──┴──────────────────────────────────────┴──┴──────────────┤
 * │              CAISSES (accueil à droite)                      │
 * └─────────────────────────────────────────────────────────────┘
 *   ↑ entrée « marché frais »              entrée principale ↑
 *
 * - Couloirs blancs = marchables ; rectangles colorés = étagères / échoppes
 * - Aile droite : rayons horizontaux (non-alimentaire), typique des hypers > 3000 m²
 */
export const HYPERMARKET_FR_LAYOUT: StoreLayout = {
  id: 'HYPERMARKET_FR',
  label: 'Hypermarché',
  entry: { x: 0.84, y: 0.93 },
  secondaryEntry: { x: 0.1, y: 0.93, label: 'Marché frais' },
  zones: [
    // —— Bas : caisses & accueil ——
    { kind: 'checkout', label: 'Caisses', rect: { x: 0.16, y: 0.9, w: 0.62, h: 0.06 } },
    { kind: 'shop', label: 'Caisses auto', rect: { x: 0.28, y: 0.91, w: 0.18, h: 0.04 } },
    { kind: 'shop', label: 'Accueil', rect: { x: 0.8, y: 0.88, w: 0.16, h: 0.08 } },
    { kind: 'shop', label: 'Culture', aisle: 'OTHER', rect: { x: 0.8, y: 0.72, w: 0.16, h: 0.12 } },

    // —— Périphérie frais (gauche) ——
    { kind: 'shop', label: 'F&L', aisle: 'PRODUCE', rect: { x: 0.03, y: 0.06, w: 0.09, h: 0.18 } },
    { kind: 'shop', label: 'Boucherie', aisle: 'MEAT', rect: { x: 0.03, y: 0.26, w: 0.09, h: 0.12 } },
    { kind: 'shop', label: 'Volailles', rect: { x: 0.03, y: 0.4, w: 0.09, h: 0.1 } },
    { kind: 'shop', label: 'Crémerie', aisle: 'DAIRY', rect: { x: 0.03, y: 0.52, w: 0.09, h: 0.14 } },
    { kind: 'shop', label: 'Ultra-frais', rect: { x: 0.03, y: 0.68, w: 0.09, h: 0.1 } },
    { kind: 'shop', label: 'Surgelés', rect: { x: 0.03, y: 0.8, w: 0.09, h: 0.08 } },

    // —— Bas gauche — boulangerie ——
    { kind: 'shop', label: 'Boulangerie', aisle: 'BAKERY', rect: { x: 0.14, y: 0.8, w: 0.14, h: 0.08 } },

    // —— Bandeau haut (traiteur, cave, poisson) ——
    { kind: 'shop', label: 'La cave', rect: { x: 0.16, y: 0.04, w: 0.16, h: 0.07 } },
    { kind: 'shop', label: 'Charcuterie', rect: { x: 0.34, y: 0.04, w: 0.14, h: 0.07 } },
    { kind: 'shop', label: 'Traiteur', rect: { x: 0.5, y: 0.04, w: 0.12, h: 0.07 } },
    { kind: 'shop', label: 'Poisson', aisle: 'FISH', rect: { x: 0.64, y: 0.04, w: 0.12, h: 0.07 } },

    // —— Grille centrale (allées verticales épicerie) ——
    { kind: 'aisle', label: 'Épicerie', aisle: 'DRY_GROCERY', rect: { x: 0.16, y: 0.14, w: 0.1, h: 0.62 } },
    { kind: 'aisle', label: 'Bio', aisle: 'SAUCES_GROCERY', rect: { x: 0.28, y: 0.14, w: 0.1, h: 0.62 } },
    { kind: 'aisle', label: 'Épicerie 3', aisle: 'SPICES', rect: { x: 0.4, y: 0.14, w: 0.1, h: 0.62 } },
    { kind: 'aisle', label: 'Promo', aisle: 'OTHER', rect: { x: 0.52, y: 0.14, w: 0.1, h: 0.62 } },

    // —— Entre centre et aile droite ——
    { kind: 'shop', label: 'Parfumerie', rect: { x: 0.64, y: 0.18, w: 0.07, h: 0.24 } },
    { kind: 'shop', label: 'Bébé', rect: { x: 0.64, y: 0.46, w: 0.07, h: 0.18 } },

    // —— Aile droite (rayons horizontaux non-al) ——
    { kind: 'aisle', label: 'Droguerie', rect: { x: 0.74, y: 0.14, w: 0.22, h: 0.09 } },
    { kind: 'aisle', label: 'Bazar', rect: { x: 0.74, y: 0.27, w: 0.22, h: 0.09 } },
    { kind: 'aisle', label: 'Papeterie', rect: { x: 0.74, y: 0.4, w: 0.22, h: 0.09 } },
    { kind: 'aisle', label: 'Électro', rect: { x: 0.74, y: 0.53, w: 0.22, h: 0.09 } },
    { kind: 'shop', label: 'Textile', rect: { x: 0.74, y: 0.66, w: 0.22, h: 0.12 } },

    // —— Couloirs marchables (blanc sur le plan) ——
    { kind: 'corridor', label: 'Couloir frais', rect: { x: 0.12, y: 0.1, w: 0.03, h: 0.76 } },
    { kind: 'corridor', label: 'Couloir central', rect: { x: 0.14, y: 0.45, w: 0.56, h: 0.06 } },
    { kind: 'corridor', label: 'Couloir accueil', rect: { x: 0.12, y: 0.74, w: 0.72, h: 0.05 } },
    { kind: 'corridor', label: 'Couloir haut', rect: { x: 0.14, y: 0.12, w: 0.56, h: 0.04 } },
    { kind: 'corridor', label: 'Couloir droite', rect: { x: 0.71, y: 0.14, w: 0.03, h: 0.64 } },
  ],
  nodes: [
    { aisle: 'PRODUCE', x: 0.075, y: 0.15 },
    { aisle: 'MEAT', x: 0.075, y: 0.32 },
    { aisle: 'DAIRY', x: 0.075, y: 0.59 },
    { aisle: 'BAKERY', x: 0.21, y: 0.84 },
    { aisle: 'FISH', x: 0.7, y: 0.075 },
    { aisle: 'DRY_GROCERY', x: 0.21, y: 0.48 },
    { aisle: 'SAUCES_GROCERY', x: 0.33, y: 0.48 },
    { aisle: 'SPICES', x: 0.45, y: 0.48 },
    { aisle: 'OTHER', x: 0.57, y: 0.48 },
  ],
};

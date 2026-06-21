import type { StoreLayout } from '../types.js';

/**
 * Supermarché type Carrefour Market / Super U :
 * - Caisses en bas, entrée unique
 * - Frais sur le côté gauche et le fond
 * - 3–4 allées verticales, pas d’aile droite non-al
 */
export const SUPERMARKET_FR_LAYOUT: StoreLayout = {
  id: 'SUPERMARKET_FR',
  label: 'Supermarché',
  entry: { x: 0.5, y: 0.92 },
  zones: [
    { kind: 'checkout', label: 'Caisses', rect: { x: 0.22, y: 0.9, w: 0.56, h: 0.06 } },
    { kind: 'shop', label: 'F&L', aisle: 'PRODUCE', rect: { x: 0.06, y: 0.08, w: 0.12, h: 0.22 } },
    { kind: 'shop', label: 'Boucherie', aisle: 'MEAT', rect: { x: 0.06, y: 0.32, w: 0.12, h: 0.14 } },
    { kind: 'shop', label: 'Crémerie', aisle: 'DAIRY', rect: { x: 0.06, y: 0.48, w: 0.12, h: 0.14 } },
    { kind: 'shop', label: 'Boulangerie', aisle: 'BAKERY', rect: { x: 0.2, y: 0.78, w: 0.14, h: 0.1 } },
    { kind: 'shop', label: 'Poisson', aisle: 'FISH', rect: { x: 0.38, y: 0.06, w: 0.18, h: 0.09 } },
    { kind: 'aisle', label: 'Allée 1', aisle: 'DRY_GROCERY', rect: { x: 0.22, y: 0.18, w: 0.12, h: 0.56 } },
    { kind: 'aisle', label: 'Allée 2', aisle: 'SAUCES_GROCERY', rect: { x: 0.38, y: 0.18, w: 0.12, h: 0.56 } },
    { kind: 'aisle', label: 'Allée 3', aisle: 'SPICES', rect: { x: 0.54, y: 0.18, w: 0.12, h: 0.56 } },
    { kind: 'shop', label: 'Hygiène', aisle: 'OTHER', rect: { x: 0.72, y: 0.18, w: 0.14, h: 0.3 } },
    { kind: 'corridor', label: 'Couloir frais', rect: { x: 0.18, y: 0.1, w: 0.03, h: 0.64 } },
    { kind: 'corridor', label: 'Couloir central', rect: { x: 0.2, y: 0.44, w: 0.52, h: 0.06 } },
    { kind: 'corridor', label: 'Couloir accueil', rect: { x: 0.18, y: 0.74, w: 0.6, h: 0.05 } },
    { kind: 'corridor', label: 'Couloir haut', rect: { x: 0.2, y: 0.13, w: 0.5, h: 0.04 } },
  ],
  nodes: [
    { aisle: 'PRODUCE', x: 0.12, y: 0.15 },
    { aisle: 'MEAT', x: 0.12, y: 0.39 },
    { aisle: 'DAIRY', x: 0.12, y: 0.55 },
    { aisle: 'BAKERY', x: 0.27, y: 0.77 },
    { aisle: 'FISH', x: 0.47, y: 0.13 },
    { aisle: 'DRY_GROCERY', x: 0.28, y: 0.47 },
    { aisle: 'SAUCES_GROCERY', x: 0.44, y: 0.47 },
    { aisle: 'SPICES', x: 0.6, y: 0.47 },
    { aisle: 'OTHER', x: 0.79, y: 0.33 },
  ],
};

import type { StoreLayout } from '../types.js';

/**
 * Proximité type Franprix / Carrefour City :
 * - Une entrée, caisse compacte
 * - Frais sur un côté, une allée centrale courte
 */
export const PROXI_FR_LAYOUT: StoreLayout = {
  id: 'PROXI_FR',
  label: 'Proximité',
  entry: { x: 0.5, y: 0.92 },
  zones: [
    { kind: 'checkout', label: 'Caisse', rect: { x: 0.35, y: 0.9, w: 0.3, h: 0.06 } },
    { kind: 'shop', label: 'F&L', aisle: 'PRODUCE', rect: { x: 0.08, y: 0.12, w: 0.18, h: 0.28 } },
    { kind: 'shop', label: 'Crémerie', aisle: 'DAIRY', rect: { x: 0.08, y: 0.44, w: 0.18, h: 0.18 } },
    { kind: 'shop', label: 'Boulangerie', aisle: 'BAKERY', rect: { x: 0.74, y: 0.12, w: 0.18, h: 0.2 } },
    { kind: 'aisle', label: 'Allée', aisle: 'DRY_GROCERY', rect: { x: 0.38, y: 0.18, w: 0.22, h: 0.58 } },
    { kind: 'shop', label: 'Conserves', aisle: 'SAUCES_GROCERY', rect: { x: 0.74, y: 0.36, w: 0.18, h: 0.16 } },
    { kind: 'shop', label: 'Divers', aisle: 'OTHER', rect: { x: 0.74, y: 0.56, w: 0.18, h: 0.16 } },
    { kind: 'corridor', label: 'Couloir', rect: { x: 0.28, y: 0.46, w: 0.44, h: 0.06 } },
    { kind: 'corridor', label: 'Accueil', rect: { x: 0.26, y: 0.76, w: 0.48, h: 0.05 } },
  ],
  nodes: [
    { aisle: 'PRODUCE', x: 0.17, y: 0.26 },
    { aisle: 'DAIRY', x: 0.17, y: 0.53 },
    { aisle: 'BAKERY', x: 0.83, y: 0.22 },
    { aisle: 'DRY_GROCERY', x: 0.49, y: 0.49 },
    { aisle: 'SAUCES_GROCERY', x: 0.83, y: 0.44 },
    { aisle: 'OTHER', x: 0.83, y: 0.64 },
    { aisle: 'MEAT', x: 0.17, y: 0.4 },
    { aisle: 'FISH', x: 0.83, y: 0.5 },
    { aisle: 'SPICES', x: 0.49, y: 0.35 },
  ],
};

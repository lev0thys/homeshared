import { describe, expect, it } from 'vitest';
import { buildGondolaStripsInZone } from '../src/gondola-layout.js';
import { HYPERMARKET_FR_LAYOUT } from '../src/layouts/hypermarket-fr.js';
import { PROXI_FR_LAYOUT } from '../src/layouts/proxi-fr.js';

describe('buildGondolaStripsInZone', () => {
  it('génère plus de travées en hyper qu’en proxi', () => {
    const hyperAisle = HYPERMARKET_FR_LAYOUT.zones.find((z) => z.aisle === 'DRY_GROCERY')!;
    const proxiAisle = PROXI_FR_LAYOUT.zones.find((z) => z.aisle === 'DRY_GROCERY')!;

    const hyper = buildGondolaStripsInZone(hyperAisle, 'HYPERMARKET_FR');
    const proxi = buildGondolaStripsInZone(proxiAisle, 'PROXI_FR');

    expect(hyper.length).toBeGreaterThan(proxi.length);
  });

  it('ne produit pas de gondoles pour les échoppes', () => {
    const shop = HYPERMARKET_FR_LAYOUT.zones.find((z) => z.aisle === 'PRODUCE')!;
    expect(buildGondolaStripsInZone(shop, 'HYPERMARKET_FR')).toHaveLength(0);
  });

  it('place les bandes à l’intérieur de la zone allée', () => {
    const aisle = HYPERMARKET_FR_LAYOUT.zones.find((z) => z.aisle === 'DRY_GROCERY')!;
    const strips = buildGondolaStripsInZone(aisle, 'HYPERMARKET_FR');

    for (const s of strips) {
      expect(s.x).toBeGreaterThanOrEqual(aisle.rect.x);
      expect(s.y).toBeGreaterThanOrEqual(aisle.rect.y);
      expect(s.x + s.w).toBeLessThanOrEqual(aisle.rect.x + aisle.rect.w + 0.001);
      expect(s.y + s.h).toBeLessThanOrEqual(aisle.rect.y + aisle.rect.h + 0.001);
    }
  });
});

import { describe, expect, it } from 'vitest';
import { buildCorridorPolyline } from '../src/build-corridor-path.js';
import { HYPERMARKET_FR_LAYOUT } from '../src/layouts/hypermarket-fr.js';

describe('buildCorridorPolyline', () => {
  it('ne trace pas de segment diagonal à travers le magasin', () => {
    const path = buildCorridorPolyline(HYPERMARKET_FR_LAYOUT, ['PRODUCE', 'DRY_GROCERY']);

    expect(path.length).toBeGreaterThan(3);

    for (let i = 1; i < path.length; i++) {
      const a = path[i - 1]!;
      const b = path[i]!;
      const dx = Math.abs(a.x - b.x);
      const dy = Math.abs(a.y - b.y);
      const axisAligned = dx < 0.008 || dy < 0.008;
      expect(axisAligned).toBe(true);
    }
  });

  it('passe par le couloir frais (gauche) pour les échoppes périphérie', () => {
    const path = buildCorridorPolyline(HYPERMARKET_FR_LAYOUT, ['PRODUCE', 'MEAT']);
    const leftCorridor = HYPERMARKET_FR_LAYOUT.zones.find((z) => z.label === 'Couloir frais');
    const leftX = leftCorridor!.rect.x + leftCorridor!.rect.w / 2;
    const onLeft = path.some((p) => Math.abs(p.x - leftX) < 0.02);
    expect(onLeft).toBe(true);
  });

  it('commence à l’entrée', () => {
    const path = buildCorridorPolyline(HYPERMARKET_FR_LAYOUT, ['DAIRY']);
    expect(path[0]?.x).toBeCloseTo(HYPERMARKET_FR_LAYOUT.entry.x, 2);
    expect(path[0]?.y).toBeCloseTo(HYPERMARKET_FR_LAYOUT.entry.y, 2);
  });
});

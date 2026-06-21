import { describe, expect, it } from 'vitest';
import { advanceAlongPolyline } from '../src/pdr/advance-along-polyline.js';

describe('advanceAlongPolyline', () => {
  const line = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ];

  it('reste sur place si delta nul', () => {
    expect(advanceAlongPolyline(line, { x: 0.2, y: 0 }, 0)).toEqual({ x: 0.2, y: 0 });
  });

  it('avance le long du segment', () => {
    const next = advanceAlongPolyline(line, { x: 0, y: 0 }, 0.25);
    expect(next.x).toBeCloseTo(0.25, 5);
    expect(next.y).toBeCloseTo(0, 5);
  });

  it('s’arrête à la fin de la polyligne', () => {
    const end = advanceAlongPolyline(line, { x: 0.5, y: 0 }, 10);
    expect(end).toEqual({ x: 1, y: 0 });
  });
});

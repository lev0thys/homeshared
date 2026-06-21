import { describe, expect, it } from 'vitest';
import {
  centerViewBoxOnNormPoint,
  fitViewBoxToViewport,
  zoomPercent,
} from './store-map-viewport';

describe('store-map-viewport', () => {
  const worldW = 1400;
  const worldH = 1000;

  it('fitViewBoxToViewport remplit le ratio écran sans bandes', () => {
    const vb = fitViewBoxToViewport(400, 300, worldW, worldH);
    expect(vb.w / vb.h).toBeCloseTo(400 / 300, 4);
    expect(vb.x).toBeLessThanOrEqual(0);
    expect(vb.y).toBeLessThanOrEqual(0);
    expect(vb.x + vb.w).toBeGreaterThanOrEqual(worldW);
    expect(vb.y + vb.h).toBeGreaterThanOrEqual(worldH);
  });

  it('centerViewBoxOnNormPoint place le point au centre', () => {
    const vb = centerViewBoxOnNormPoint(0.5, 0.5, worldW, worldH, 400, 300);
    const cx = vb.x + vb.w / 2;
    const cy = vb.y + vb.h / 2;
    expect(cx).toBeCloseTo(worldW * 0.5, 0);
    expect(cy).toBeCloseTo(worldH * 0.5, 0);
  });

  it('zoomPercent reflète le niveau de zoom', () => {
    expect(zoomPercent({ x: 0, y: 0, w: worldW / 4, h: worldH / 4 }, worldW)).toBe(400);
  });
});

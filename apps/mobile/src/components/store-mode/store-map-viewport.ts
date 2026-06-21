export const MIN_ZOOM_RATIO = 1;
export const MAX_ZOOM_RATIO = 14;

export interface MapViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function fitViewBox(worldW: number, worldH: number): MapViewBox {
  return { x: 0, y: 0, w: worldW, h: worldH };
}

/**
 * Cadre tout le magasin en remplissant le viewport (pas de bandes vides type « meet »).
 */
export function fitViewBoxToViewport(
  viewportW: number,
  viewportH: number,
  worldW: number,
  worldH: number,
): MapViewBox {
  if (viewportW <= 0 || viewportH <= 0) {
    return fitViewBox(worldW, worldH);
  }

  const vpAspect = viewportW / viewportH;
  const worldAspect = worldW / worldH;

  if (worldAspect > vpAspect) {
    const h = worldW / vpAspect;
    return { x: 0, y: (worldH - h) / 2, w: worldW, h };
  }

  const w = worldH * vpAspect;
  return { x: (worldW - w) / 2, y: 0, w, h: worldH };
}

export function clampViewBox(vb: MapViewBox, worldW: number, worldH: number): MapViewBox {
  const w = Math.min(worldW, Math.max(worldW / MAX_ZOOM_RATIO, vb.w));
  const h = Math.min(worldH, Math.max(worldH / MAX_ZOOM_RATIO, vb.h));
  const x = Math.min(worldW - w, Math.max(0, vb.x));
  const y = Math.min(worldH - h, Math.max(0, vb.y));
  return { x, y, w, h };
}

/** Zoom centré (factor > 1 = zoom avant). */
export function zoomViewBox(
  vb: MapViewBox,
  factor: number,
  worldW: number,
  worldH: number,
  centerRatioX = 0.5,
  centerRatioY = 0.5,
): MapViewBox {
  const newW = vb.w / factor;
  const newH = vb.h / factor;
  const cx = vb.x + vb.w * centerRatioX;
  const cy = vb.y + vb.h * centerRatioY;
  return clampViewBox(
    {
      x: cx - newW * centerRatioX,
      y: cy - newH * centerRatioY,
      w: newW,
      h: newH,
    },
    worldW,
    worldH,
  );
}

export function panViewBox(
  vb: MapViewBox,
  screenDx: number,
  screenDy: number,
  viewportW: number,
  viewportH: number,
  worldW: number,
  worldH: number,
): MapViewBox {
  const worldDx = (screenDx / viewportW) * vb.w;
  const worldDy = (screenDy / viewportH) * vb.h;
  return clampViewBox(
    { x: vb.x - worldDx, y: vb.y - worldDy, w: vb.w, h: vb.h },
    worldW,
    worldH,
  );
}

/** Pixel écran → coords normalisées 0–1 sur le plan monde. */
export function screenToNorm(
  localX: number,
  localY: number,
  vb: MapViewBox,
  viewportW: number,
  viewportH: number,
  worldW: number,
  worldH: number,
): { x: number; y: number } {
  const worldX = vb.x + (localX / viewportW) * vb.w;
  const worldY = vb.y + (localY / viewportH) * vb.h;
  return {
    x: Math.min(1, Math.max(0, worldX / worldW)),
    y: Math.min(1, Math.max(0, worldY / worldH)),
  };
}

export function zoomPercent(vb: MapViewBox, worldW: number): number {
  return Math.round((worldW / vb.w) * 100);
}

/** Zoom par défaut quand on centre sur la position (vue quartier ~25 % du magasin). */
export const DEFAULT_CENTER_ZOOM_RATIO = 4;

/**
 * Centre le viewBox sur un point normalisé (0–1), en respectant le ratio viewport.
 */
export function centerViewBoxOnNormPoint(
  normX: number,
  normY: number,
  worldW: number,
  worldH: number,
  viewportW: number,
  viewportH: number,
  zoomRatio = DEFAULT_CENTER_ZOOM_RATIO,
): MapViewBox {
  if (viewportW <= 0 || viewportH <= 0) {
    return fitViewBox(worldW, worldH);
  }

  let vbW = worldW / zoomRatio;
  let vbH = worldH / zoomRatio;
  const vpAspect = viewportW / viewportH;
  const vbAspect = vbW / vbH;

  if (vbAspect > vpAspect) {
    vbH = vbW / vpAspect;
  } else {
    vbW = vbH * vpAspect;
  }

  const worldX = normX * worldW;
  const worldY = normY * worldH;

  return clampViewBox(
    {
      x: worldX - vbW / 2,
      y: worldY - vbH / 2,
      w: vbW,
      h: vbH,
    },
    worldW,
    worldH,
  );
}

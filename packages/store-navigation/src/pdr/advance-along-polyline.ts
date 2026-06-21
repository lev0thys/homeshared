function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.hypot(dx, dy);
}

/** Avance un point le long d'une polyligne schématique (coords 0–1). */
export function advanceAlongPolyline(
  polyline: Array<{ x: number; y: number }>,
  from: { x: number; y: number },
  delta: number,
): { x: number; y: number } {
  if (polyline.length < 2 || delta <= 0) return from;

  let remaining = delta;
  let cursor = from;

  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < polyline.length; i += 1) {
    const d = distance(from, polyline[i]!);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }

  const segmentStart = bestIdx;
  cursor = polyline[segmentStart] ?? from;

  for (let i = segmentStart; i < polyline.length - 1 && remaining > 0; i += 1) {
    const a = i === segmentStart ? cursor : polyline[i]!;
    const b = polyline[i + 1]!;
    const segLen = distance(a, b);
    if (segLen <= 0) continue;
    if (remaining <= segLen) {
      const t = remaining / segLen;
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
    remaining -= segLen;
    cursor = b;
  }

  return polyline[polyline.length - 1] ?? from;
}

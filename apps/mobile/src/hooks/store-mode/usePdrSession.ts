import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { advanceAlongPolyline } from '@homeshared/store-navigation';

const STEP_LENGTH_NORMALIZED = 0.012;
const STEP_COOLDOWN_MS = 350;
const ACCEL_THRESHOLD = 1.35;

interface UsePdrSessionOptions {
  polyline: Array<{ x: number; y: number }>;
  initialPosition: { x: number; y: number };
  enabled?: boolean;
}

export function usePdrSession({ polyline, initialPosition, enabled = true }: UsePdrSessionOptions) {
  const [position, setPosition] = useState(initialPosition);
  const [stepCount, setStepCount] = useState(0);
  const lastStepAt = useRef(0);
  const lastMag = useRef(1);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition.x, initialPosition.y]);

  const recalibrate = useCallback((x: number, y: number) => {
    setPosition({ x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) });
  }, []);

  useEffect(() => {
    if (!enabled || Platform.OS === 'web') return;

    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const mag = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();
      const peaked = lastMag.current < 1.05 && mag > ACCEL_THRESHOLD;
      lastMag.current = mag;

      if (!peaked || now - lastStepAt.current < STEP_COOLDOWN_MS) return;
      lastStepAt.current = now;
      setStepCount((c) => c + 1);
      setPosition((prev) => advanceAlongPolyline(polyline, prev, STEP_LENGTH_NORMALIZED));
    });

    return () => sub.remove();
  }, [enabled, polyline]);

  const estimatedMeters = stepCount * 0.72;

  return useMemo(
    () => ({ position, recalibrate, stepCount, estimatedMeters }),
    [estimatedMeters, position, recalibrate, stepCount],
  );
}

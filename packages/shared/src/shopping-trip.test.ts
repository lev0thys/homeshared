import { describe, expect, it } from 'vitest';
import {
  shouldAutoCommitShoppingTrip,
  SHOPPING_AUTO_COMMIT_IDLE_MS,
  SHOPPING_AUTO_COMMIT_MIN_RATIO,
} from './shopping-trip.js';

describe('shopping-trip', () => {
  it('auto-commit si ratio et délai suffisants', () => {
    expect(shouldAutoCommitShoppingTrip(6, 10, SHOPPING_AUTO_COMMIT_IDLE_MS)).toBe(true);
    expect(shouldAutoCommitShoppingTrip(5, 10, SHOPPING_AUTO_COMMIT_IDLE_MS)).toBe(false);
    expect(shouldAutoCommitShoppingTrip(6, 10, SHOPPING_AUTO_COMMIT_IDLE_MS - 1)).toBe(false);
  });

  it('constants cohérentes', () => {
    expect(SHOPPING_AUTO_COMMIT_MIN_RATIO).toBe(0.6);
  });
});

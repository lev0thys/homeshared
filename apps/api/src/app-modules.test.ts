import { describe, expect, it } from 'vitest';
import { parseRecipeSteps } from '@homeshared/shared';

describe('parseRecipeSteps', () => {
  it('découpe les lignes numérotées', () => {
    const steps = parseRecipeSteps('1. Couper.\n2. Cuire.\n3. Servir.');
    expect(steps).toEqual(['Couper.', 'Cuire.', 'Servir.']);
  });
});

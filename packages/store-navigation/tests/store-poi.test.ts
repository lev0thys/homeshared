import { describe, expect, it } from 'vitest';
import {
  encodeOsmStoreId,
  haversineMeters,
  inferLayoutProfileDetailed,
  inferLayoutProfileFromOsmTags,
} from '../src/store-poi.js';

describe('store-poi', () => {
  it('encodeOsmStoreId négatif pour les ways', () => {
    expect(encodeOsmStoreId('node', 42)).toBe('42');
    expect(encodeOsmStoreId('way', 99)).toBe('-99');
  });

  it('inferLayoutProfileFromOsmTags détecte proxi', () => {
    expect(inferLayoutProfileFromOsmTags({ shop: 'convenience', name: 'Carrefour City' })).toBe(
      'PROXI_FR',
    );
    expect(inferLayoutProfileFromOsmTags({ shop: 'supermarket', name: 'Leclerc Express' })).toBe(
      'PROXI_FR',
    );
    expect(inferLayoutProfileFromOsmTags({ shop: 'supermarket', name: 'Monoprix République' })).toBe(
      'PROXI_FR',
    );
  });

  it('inferLayoutProfileFromOsmTags détecte hyper', () => {
    expect(
      inferLayoutProfileFromOsmTags({ shop: 'supermarket', brand: 'E.Leclerc', name: 'Leclerc' }),
    ).toBe('HYPERMARKET_FR');
    expect(inferLayoutProfileFromOsmTags({ shop: 'supermarket', name: 'Auchan Hyper' })).toBe(
      'HYPERMARKET_FR',
    );
  });

  it('inferLayoutProfileFromOsmTags détecte super', () => {
    expect(
      inferLayoutProfileFromOsmTags({ shop: 'supermarket', name: 'Carrefour Market Toulouse' }),
    ).toBe('SUPERMARKET_FR');
    expect(inferLayoutProfileFromOsmTags({ shop: 'supermarket', brand: 'Lidl', name: 'Lidl' })).toBe(
      'SUPERMARKET_FR',
    );
    expect(inferLayoutProfileFromOsmTags({ shop: 'supermarket', name: 'Super U' })).toBe(
      'SUPERMARKET_FR',
    );
  });

  it('inferLayoutProfileDetailed expose confiance', () => {
    const proxi = inferLayoutProfileDetailed({ shop: 'convenience', name: 'Franprix' });
    expect(proxi.profile).toBe('PROXI_FR');
    expect(proxi.confidence).toBe('high');

    const generic = inferLayoutProfileDetailed({ shop: 'yes', name: 'Inconnu' });
    expect(generic.profile).toBe('HYPERMARKET_FR');
    expect(generic.confidence).toBe('low');
  });

  it('haversineMeters ~0 pour même point', () => {
    expect(haversineMeters(48.85, 2.35, 48.85, 2.35)).toBeCloseTo(0, 1);
  });
});

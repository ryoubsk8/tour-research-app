import { describe, it, expect, beforeEach } from 'vitest';
import {
  getFavorites,
  isFavorite,
  toggleFavorite,
  removeFavorite,
} from './favoritesStore';
import type { Spot } from '../types/place';

function makeSpot(overrides: Partial<Spot> = {}): Spot {
  return {
    placeId: 'place-1',
    name: 'テストスポット',
    location: { lat: 35.0, lng: 139.0 },
    distanceMeters: 1234,
    directionsUrl: 'https://example.com',
    ...overrides,
  };
}

describe('favoritesStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('初期状態は空', () => {
    expect(getFavorites()).toEqual([]);
  });

  it('toggleで追加・再toggleで削除できる', () => {
    const spot = makeSpot();
    toggleFavorite(spot);
    expect(isFavorite('place-1')).toBe(true);
    expect(getFavorites()).toHaveLength(1);

    toggleFavorite(spot);
    expect(isFavorite('place-1')).toBe(false);
    expect(getFavorites()).toHaveLength(0);
  });

  it('保存時に距離(distanceMeters)は含めない', () => {
    toggleFavorite(makeSpot({ distanceMeters: 999 }));
    const saved = getFavorites()[0] as Record<string, unknown>;
    expect(saved.distanceMeters).toBeUndefined();
    expect(saved.placeId).toBe('place-1');
  });

  it('removeFavoriteで指定IDを削除できる', () => {
    toggleFavorite(makeSpot({ placeId: 'a', name: 'A' }));
    toggleFavorite(makeSpot({ placeId: 'b', name: 'B' }));
    const next = removeFavorite('a');
    expect(next).toHaveLength(1);
    expect(next[0].placeId).toBe('b');
  });

  it('壊れたデータが入っていても空配列で復帰する', () => {
    localStorage.setItem('tabispo:favorites:v1', '{壊れたJSON');
    expect(getFavorites()).toEqual([]);
  });
});

import { describe, it, expect } from 'vitest';
import { CATEGORIES, DEFAULT_CATEGORY_ID, getCategory } from './categories';

describe('categories config', () => {
  it('観光・グルメの2大分類がある', () => {
    expect(CATEGORIES.map((c) => c.id).sort()).toEqual(['gourmet', 'sightseeing']);
  });

  it('各大分類にデフォルトの場所タイプと細分類がある', () => {
    for (const c of CATEGORIES) {
      expect(c.defaultPlaceType).toBeTruthy();
      expect(c.subcategories.length).toBeGreaterThan(0);
      // 細分類は placeType か keyword の少なくとも一方を持つ
      for (const s of c.subcategories) {
        expect(Boolean(s.placeType || s.keyword)).toBe(true);
      }
    }
  });

  it('細分類IDは大分類内で一意', () => {
    for (const c of CATEGORIES) {
      const ids = c.subcategories.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('getCategoryでデフォルトカテゴリを取得できる', () => {
    expect(getCategory(DEFAULT_CATEGORY_ID).id).toBe(DEFAULT_CATEGORY_ID);
  });
});

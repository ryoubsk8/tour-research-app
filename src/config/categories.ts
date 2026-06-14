// 大分類（観光 / グルメ）と、その細分類（絞り込み）の定義。
// 細分類は将来追加しやすいよう、ここのデータを足すだけで増やせる構成にしている。
import type { Category, CategoryId } from '../types/place';

export const CATEGORIES: Category[] = [
  {
    id: 'sightseeing',
    label: '観光',
    defaultPlaceType: 'tourist_attraction',
    subcategories: [
      { id: 'temple_shrine', label: '寺社', placeType: 'place_of_worship', keyword: '神社 寺' },
      { id: 'nature_park', label: '公園・自然', placeType: 'park' },
      { id: 'museum', label: '美術館・博物館', placeType: 'museum' },
      { id: 'landmark', label: '名所', placeType: 'tourist_attraction' },
    ],
  },
  {
    id: 'gourmet',
    label: 'グルメ',
    defaultPlaceType: 'restaurant',
    subcategories: [
      { id: 'cafe', label: 'カフェ', placeType: 'cafe' },
      { id: 'ramen', label: 'ラーメン', placeType: 'restaurant', keyword: 'ラーメン' },
      { id: 'restaurant', label: 'レストラン', placeType: 'restaurant' },
      { id: 'izakaya', label: '居酒屋', placeType: 'restaurant', keyword: '居酒屋' },
    ],
  },
];

/** デフォルト（起動時）に表示する大分類 */
export const DEFAULT_CATEGORY_ID: CategoryId = 'sightseeing';

/** 指定IDのカテゴリを取得 */
export function getCategory(id: CategoryId): Category {
  const found = CATEGORIES.find((c) => c.id === id);
  if (!found) {
    throw new Error(`未知のカテゴリID: ${id}`);
  }
  return found;
}

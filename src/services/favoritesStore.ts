// お気に入りスポットを端末内（localStorage）に保存・取得・削除する。
// ログイン不要・端末内保存（要件 FR-11 / D-6）。
import type { Spot } from '../types/place';

/** 保存用のお気に入り型。距離は検索時点の相対値なので保存しない。 */
export type FavoriteSpot = Omit<Spot, 'distanceMeters'>;

const STORAGE_KEY = 'tabispo:favorites:v1';

function safeParse(raw: string | null): FavoriteSpot[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      return data.filter((d) => d && typeof d.placeId === 'string');
    }
    return [];
  } catch {
    // 壊れたデータは無視して空扱い
    return [];
  }
}

/** 保存済みのお気に入り一覧を取得 */
export function getFavorites(): FavoriteSpot[] {
  if (typeof localStorage === 'undefined') return [];
  return safeParse(localStorage.getItem(STORAGE_KEY));
}

function write(list: FavoriteSpot[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/** 指定スポットがお気に入りに登録済みか */
export function isFavorite(placeId: string): boolean {
  return getFavorites().some((f) => f.placeId === placeId);
}

/** お気に入りから削除し、更新後の一覧を返す */
export function removeFavorite(placeId: string): FavoriteSpot[] {
  const next = getFavorites().filter((f) => f.placeId !== placeId);
  write(next);
  return next;
}

/**
 * お気に入りの登録/解除を切り替え、更新後の一覧を返す。
 */
export function toggleFavorite(spot: Spot): FavoriteSpot[] {
  const current = getFavorites();
  if (current.some((f) => f.placeId === spot.placeId)) {
    const next = current.filter((f) => f.placeId !== spot.placeId);
    write(next);
    return next;
  }
  // distanceMeters（検索時点の相対値）を除いて保存
  const favorite: FavoriteSpot = { ...spot };
  delete (favorite as { distanceMeters?: number }).distanceMeters;
  const next = [...current, favorite];
  write(next);
  return next;
}

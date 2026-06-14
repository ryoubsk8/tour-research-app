// 周辺スポット検索の状態を、観光・グルメのカテゴリ別に管理するフック。
import { useCallback, useState } from 'react';
import type {
  CategoryId,
  CategoryResultState,
  Coordinates,
} from '../types/place';
import { getCategory } from '../config/categories';
import {
  searchNearby,
  PlacesConfigError,
} from '../services/placesService';

export interface SearchOptions {
  subcategoryId: string | null;
  radiusMeters: number;
  openNowOnly: boolean;
}

const INITIAL: CategoryResultState = { status: 'idle', spots: [] };

export interface UseNearbySearchResult {
  results: Record<CategoryId, CategoryResultState>;
  /** 1カテゴリを検索して結果を更新する */
  search: (
    center: Coordinates,
    categoryId: CategoryId,
    options: SearchOptions,
  ) => Promise<void>;
}

export function useNearbySearch(): UseNearbySearchResult {
  const [results, setResults] = useState<Record<CategoryId, CategoryResultState>>({
    sightseeing: INITIAL,
    gourmet: INITIAL,
  });

  const search = useCallback(
    async (center: Coordinates, categoryId: CategoryId, options: SearchOptions) => {
      setResults((prev) => ({
        ...prev,
        [categoryId]: { status: 'loading', spots: [] },
      }));
      try {
        const spots = await searchNearby({
          center,
          radiusMeters: options.radiusMeters,
          category: getCategory(categoryId),
          subcategoryId: options.subcategoryId,
          openNowOnly: options.openNowOnly,
        });
        setResults((prev) => ({
          ...prev,
          [categoryId]: {
            status: spots.length === 0 ? 'empty' : 'success',
            spots,
          },
        }));
      } catch (e) {
        const message =
          e instanceof PlacesConfigError
            ? e.message
            : '通信に失敗しました。電波の良い場所で再試行してください。';
        setResults((prev) => ({
          ...prev,
          [categoryId]: { status: 'error', spots: [], errorMessage: message },
        }));
      }
    },
    [],
  );

  return { results, search };
}

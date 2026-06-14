// お気に入り（端末内保存）の状態を管理するフック。
import { useCallback, useEffect, useState } from 'react';
import type { Spot } from '../types/place';
import {
  getFavorites,
  toggleFavorite as toggleInStore,
  removeFavorite as removeInStore,
  type FavoriteSpot,
} from '../services/favoritesStore';

export interface UseFavoritesResult {
  favorites: FavoriteSpot[];
  isFavorite: (placeId: string) => boolean;
  toggle: (spot: Spot) => void;
  remove: (placeId: string) => void;
}

export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<FavoriteSpot[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const isFavorite = useCallback(
    (placeId: string) => favorites.some((f) => f.placeId === placeId),
    [favorites],
  );

  const toggle = useCallback((spot: Spot) => {
    setFavorites(toggleInStore(spot));
  }, []);

  const remove = useCallback((placeId: string) => {
    setFavorites(removeInStore(placeId));
  }, []);

  return { favorites, isFavorite, toggle, remove };
}

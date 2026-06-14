// お気に入り専用の一覧（FR-11 / D-17）。端末内に保存したスポットを表示する。
import { SpotCard } from './SpotCard';
import { EmptyState } from './states/EmptyState';
import type { FavoriteSpot } from '../services/favoritesStore';
import listStyles from './SpotList.module.css';

interface Props {
  favorites: FavoriteSpot[];
  onRemove: (placeId: string) => void;
}

export function FavoritesView({ favorites, onRemove }: Props) {
  if (favorites.length === 0) {
    return (
      <EmptyState
        message="お気に入りはまだありません。"
        hint="気になるスポットの ☆ を押すと、ここに保存されます。"
      />
    );
  }

  return (
    <div className={listStyles.list} data-testid="favorites-list">
      {favorites.map((spot) => (
        <SpotCard
          key={spot.placeId}
          spot={spot}
          isFavorite={true}
          onToggleFavorite={() => onRemove(spot.placeId)}
        />
      ))}
    </div>
  );
}

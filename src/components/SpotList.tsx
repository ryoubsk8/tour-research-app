// スポットカードの一覧表示（FR-6: 距離が近い順で約10件）。
import type { Spot } from '../types/place';
import { SpotCard } from './SpotCard';
import styles from './SpotList.module.css';

interface Props {
  spots: Spot[];
  isFavorite: (placeId: string) => boolean;
  onToggleFavorite: (spot: Spot) => void;
}

export function SpotList({ spots, isFavorite, onToggleFavorite }: Props) {
  return (
    <div className={styles.list} data-testid="spot-list">
      {spots.map((spot) => (
        <SpotCard
          key={spot.placeId}
          spot={spot}
          isFavorite={isFavorite(spot.placeId)}
          onToggleFavorite={() => onToggleFavorite(spot)}
        />
      ))}
    </div>
  );
}

// 1スポットを表示するカード。写真・評価・距離・営業状況・お気に入り・ナビ・営業時間詳細（FR-7,8,10,11）。
import { useState } from 'react';
import type { Spot, SpotDetails } from '../types/place';
import { formatDistance } from '../services/distance';
import { getSpotDetails } from '../services/placesService';
import styles from './SpotCard.module.css';

/** カードに渡すスポット型（お気に入りは距離を持たないため optional） */
export type CardSpot = Omit<Spot, 'distanceMeters'> & { distanceMeters?: number };

interface Props {
  spot: CardSpot;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function SpotCard({ spot, isFavorite, onToggleFavorite }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState<SpotDetails | null>(null);
  const [detailsState, setDetailsState] = useState<'idle' | 'loading' | 'error'>('idle');

  async function toggleDetails() {
    const next = !expanded;
    setExpanded(next);
    if (next && details === null && detailsState !== 'loading') {
      setDetailsState('loading');
      try {
        setDetails(await getSpotDetails(spot.placeId));
        setDetailsState('idle');
      } catch {
        setDetailsState('error');
      }
    }
  }

  return (
    <article className={styles.card} data-testid="spot-card">
      <div className={styles.thumb}>
        {spot.photoUrl ? (
          <img src={spot.photoUrl} alt={spot.name} loading="lazy" className={styles.img} />
        ) : (
          <div className={styles.noImg} aria-hidden="true">
            🏞️
          </div>
        )}
        <button
          type="button"
          className={`${styles.fav} ${isFavorite ? styles.favOn : ''}`}
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
          data-testid="favorite-button"
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{spot.name}</h3>

        <div className={styles.meta}>
          {typeof spot.rating === 'number' && (
            <span className={styles.rating} data-testid="rating">
              <span className={styles.star}>★</span>
              {spot.rating.toFixed(1)}
              {typeof spot.userRatingsTotal === 'number' && (
                <span className={styles.count}>（{spot.userRatingsTotal}件）</span>
              )}
            </span>
          )}
          {typeof spot.distanceMeters === 'number' && (
            <span className={styles.distance}>📍 {formatDistance(spot.distanceMeters)}</span>
          )}
          {typeof spot.openNow === 'boolean' && (
            <span className={spot.openNow ? styles.open : styles.closed}>
              {spot.openNow ? '営業中' : '営業時間外'}
            </span>
          )}
        </div>

        {spot.vicinity && <p className={styles.vicinity}>{spot.vicinity}</p>}

        <div className={styles.actions}>
          <a
            className={styles.navBtn}
            href={spot.directionsUrl}
            target="_blank"
            rel="noreferrer"
            data-testid="directions-link"
          >
            🧭 Googleマップでナビ
          </a>
          <button
            type="button"
            className={styles.detailsBtn}
            onClick={toggleDetails}
            aria-expanded={expanded}
            data-testid="details-toggle"
          >
            {expanded ? '営業時間を閉じる' : '営業時間を見る'}
          </button>
        </div>

        {expanded && (
          <div className={styles.details} data-testid="spot-details">
            {detailsState === 'loading' && <p className={styles.detailsMuted}>読み込み中…</p>}
            {detailsState === 'error' && (
              <p className={styles.detailsMuted}>営業時間を取得できませんでした。</p>
            )}
            {detailsState === 'idle' && details && (
              <>
                {details.weekdayText && details.weekdayText.length > 0 ? (
                  <ul className={styles.hours}>
                    {details.weekdayText.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.detailsMuted}>営業時間の情報がありません。</p>
                )}
                {details.phone && (
                  <p className={styles.contact}>
                    ☎ <a href={`tel:${details.phone}`}>{details.phone}</a>
                  </p>
                )}
                {details.website && (
                  <p className={styles.contact}>
                    🔗{' '}
                    <a href={details.website} target="_blank" rel="noreferrer">
                      公式サイト
                    </a>
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

// 位置情報が使えない場合に、地名・住所を手入力して検索の基点を指定する（FR-2）。
import { useState, type FormEvent } from 'react';
import type { Coordinates } from '../types/place';
import { geocodeAddress, PlacesConfigError } from '../services/placesService';
import styles from './LocationInput.module.css';

interface Props {
  /** 案内メッセージ（位置情報が拒否された理由など） */
  notice?: string;
  onResolved: (coords: Coordinates, label: string) => void;
}

export function LocationInput({ notice, onResolved }: Props) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const query = text.trim();
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const coords = await geocodeAddress(query);
      onResolved(coords, query);
    } catch (err) {
      if (err instanceof PlacesConfigError) {
        setError(err.message);
      } else {
        setError('その地名・住所が見つかりませんでした。別の言葉でお試しください。');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrap} data-testid="location-input">
      {notice && <p className={styles.notice}>{notice}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          placeholder="地名・住所を入力（例: 京都駅）"
          value={text}
          onChange={(e) => setText(e.target.value)}
          data-testid="location-input-field"
          aria-label="地名・住所"
        />
        <button
          type="submit"
          className={styles.button}
          disabled={loading || text.trim() === ''}
          data-testid="location-input-submit"
        >
          {loading ? '検索中…' : 'この場所で探す'}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

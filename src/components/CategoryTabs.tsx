// 大分類タブ（観光 / グルメ）＋ お気に入りタブの切り替え（FR-4 / FR-11 / D-16）。
import type { CategoryId } from '../types/place';
import { CATEGORIES } from '../config/categories';
import styles from './CategoryTabs.module.css';

export type ActiveView = CategoryId | 'favorites';

interface Props {
  active: ActiveView;
  favoritesCount: number;
  onChange: (view: ActiveView) => void;
}

export function CategoryTabs({ active, favoritesCount, onChange }: Props) {
  return (
    <nav className={styles.tabs} role="tablist" aria-label="カテゴリ">
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          type="button"
          role="tab"
          aria-selected={active === c.id}
          className={`${styles.tab} ${active === c.id ? styles.activeTab : ''}`}
          onClick={() => onChange(c.id)}
          data-testid={`tab-${c.id}`}
        >
          {c.label}
        </button>
      ))}
      <button
        type="button"
        role="tab"
        aria-selected={active === 'favorites'}
        className={`${styles.tab} ${active === 'favorites' ? styles.activeTab : ''}`}
        onClick={() => onChange('favorites')}
        data-testid="tab-favorites"
      >
        ★ お気に入り
        {favoritesCount > 0 && <span className={styles.badge}>{favoritesCount}</span>}
      </button>
    </nav>
  );
}

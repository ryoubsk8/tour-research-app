// 細分類の絞り込みボタン（FR-5）。「すべて」＋各細分類を切り替えられる。
import type { Category } from '../types/place';
import styles from './SubcategoryFilter.module.css';

interface Props {
  category: Category;
  selectedId: string | null;
  onSelect: (subcategoryId: string | null) => void;
}

export function SubcategoryFilter({ category, selectedId, onSelect }: Props) {
  return (
    <div className={styles.row} role="group" aria-label={`${category.label}の絞り込み`}>
      <button
        type="button"
        className={`${styles.chip} ${selectedId === null ? styles.active : ''}`}
        aria-pressed={selectedId === null}
        onClick={() => onSelect(null)}
        data-testid="subcategory-all"
      >
        すべて
      </button>
      {category.subcategories.map((s) => (
        <button
          key={s.id}
          type="button"
          className={`${styles.chip} ${selectedId === s.id ? styles.active : ''}`}
          aria-pressed={selectedId === s.id}
          onClick={() => onSelect(s.id)}
          data-testid={`subcategory-${s.id}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

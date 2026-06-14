// 検索範囲（半径）の切り替え（FR-9）。
import { RADIUS_OPTIONS } from '../config/searchOptions';
import styles from './Controls.module.css';

interface Props {
  value: number;
  onChange: (meters: number) => void;
}

export function RadiusSelector({ value, onChange }: Props) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>範囲</span>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        data-testid="radius-select"
      >
        {RADIUS_OPTIONS.map((o) => (
          <option key={o.meters} value={o.meters}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

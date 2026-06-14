// 「営業中のみ」絞り込みトグル（FR-8）。
import styles from './Controls.module.css';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function OpenNowToggle({ checked, onChange }: Props) {
  return (
    <label className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        data-testid="opennow-toggle"
      />
      <span className={styles.toggleText}>営業中のみ</span>
    </label>
  );
}

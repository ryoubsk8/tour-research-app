import styles from './states.module.css';

export function Loading({ label = '探しています…' }: { label?: string }) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite" data-testid="loading">
      <div className={styles.spinner} aria-hidden="true" />
      <p className={styles.text}>{label}</p>
    </div>
  );
}

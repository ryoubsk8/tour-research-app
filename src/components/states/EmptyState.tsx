import styles from './states.module.css';

export function EmptyState({
  message = '近くに見つかりませんでした。',
  hint,
}: {
  message?: string;
  hint?: string;
}) {
  return (
    <div className={styles.wrap} data-testid="empty-state">
      <div className={styles.emoji} aria-hidden="true">
        🧭
      </div>
      <p className={styles.text}>{message}</p>
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}

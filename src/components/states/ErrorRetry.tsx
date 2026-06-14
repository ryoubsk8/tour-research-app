import styles from './states.module.css';

export function ErrorRetry({
  message = '通信に失敗しました。',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className={styles.wrap} role="alert" data-testid="error-retry">
      <div className={styles.emoji} aria-hidden="true">
        ⚠️
      </div>
      <p className={styles.text}>{message}</p>
      {onRetry && (
        <button
          type="button"
          className={styles.retryButton}
          onClick={onRetry}
          data-testid="retry-button"
        >
          再試行する
        </button>
      )}
    </div>
  );
}

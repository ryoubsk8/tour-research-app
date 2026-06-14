import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorRetry } from './ErrorRetry';

describe('ErrorRetry', () => {
  it('メッセージと再試行ボタンを表示し、クリックで onRetry を呼ぶ', () => {
    const onRetry = vi.fn();
    render(<ErrorRetry message="通信に失敗しました。" onRetry={onRetry} />);
    expect(screen.getByText('通信に失敗しました。')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('retry-button'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('onRetry が無ければ再試行ボタンを表示しない', () => {
    render(<ErrorRetry message="エラー" />);
    expect(screen.queryByTestId('retry-button')).not.toBeInTheDocument();
  });
});

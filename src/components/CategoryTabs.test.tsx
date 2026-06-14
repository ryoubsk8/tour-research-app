import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryTabs } from './CategoryTabs';

describe('CategoryTabs', () => {
  it('観光・グルメ・お気に入りのタブを表示する', () => {
    render(<CategoryTabs active="sightseeing" favoritesCount={0} onChange={() => {}} />);
    expect(screen.getByTestId('tab-sightseeing')).toBeInTheDocument();
    expect(screen.getByTestId('tab-gourmet')).toBeInTheDocument();
    expect(screen.getByTestId('tab-favorites')).toBeInTheDocument();
  });

  it('タブをクリックすると onChange が呼ばれる', () => {
    const onChange = vi.fn();
    render(<CategoryTabs active="sightseeing" favoritesCount={2} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('tab-gourmet'));
    expect(onChange).toHaveBeenCalledWith('gourmet');
  });

  it('お気に入り件数をバッジ表示する', () => {
    render(<CategoryTabs active="sightseeing" favoritesCount={3} onChange={() => {}} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

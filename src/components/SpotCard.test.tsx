import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpotCard, type CardSpot } from './SpotCard';

const spot: CardSpot = {
  placeId: 'p1',
  name: '清水寺',
  rating: 4.5,
  userRatingsTotal: 1200,
  openNow: true,
  location: { lat: 34.9948, lng: 135.785 },
  distanceMeters: 850,
  vicinity: '京都市東山区',
  directionsUrl: 'https://maps.example/dir',
};

describe('SpotCard', () => {
  it('名前・評価・距離・営業状況を表示する', () => {
    render(<SpotCard spot={spot} isFavorite={false} onToggleFavorite={() => {}} />);
    expect(screen.getByText('清水寺')).toBeInTheDocument();
    expect(screen.getByTestId('rating')).toHaveTextContent('4.5');
    expect(screen.getByText(/850m/)).toBeInTheDocument();
    expect(screen.getByText('営業中')).toBeInTheDocument();
  });

  it('ナビのリンクが directionsUrl を指す', () => {
    render(<SpotCard spot={spot} isFavorite={false} onToggleFavorite={() => {}} />);
    expect(screen.getByTestId('directions-link')).toHaveAttribute(
      'href',
      'https://maps.example/dir',
    );
  });

  it('お気に入りボタンのクリックで onToggleFavorite を呼ぶ', () => {
    const onToggle = vi.fn();
    render(<SpotCard spot={spot} isFavorite={false} onToggleFavorite={onToggle} />);
    fireEvent.click(screen.getByTestId('favorite-button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});

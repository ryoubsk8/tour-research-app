import { describe, it, expect } from 'vitest';
import { distanceInMeters, formatDistance } from './distance';

describe('distanceInMeters', () => {
  it('同じ地点なら距離は0', () => {
    const p = { lat: 35.681236, lng: 139.767125 }; // 東京駅
    expect(distanceInMeters(p, p)).toBe(0);
  });

  it('東京駅〜皇居の距離はおおよそ1.5km前後', () => {
    const tokyoStation = { lat: 35.681236, lng: 139.767125 };
    const imperialPalace = { lat: 35.685175, lng: 139.7528 };
    const d = distanceInMeters(tokyoStation, imperialPalace);
    expect(d).toBeGreaterThan(1000);
    expect(d).toBeLessThan(2000);
  });
});

describe('formatDistance', () => {
  it('1km未満はメートル表記（整数）', () => {
    expect(formatDistance(350.4)).toBe('350m');
  });

  it('1km以上10km未満は小数第1位までのkm表記', () => {
    expect(formatDistance(1240)).toBe('1.2km');
  });

  it('10km以上は整数のkm表記', () => {
    expect(formatDistance(12300)).toBe('12km');
  });

  it('不正な値は空文字', () => {
    expect(formatDistance(-5)).toBe('');
    expect(formatDistance(NaN)).toBe('');
  });
});

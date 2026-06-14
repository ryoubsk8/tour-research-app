// 2地点間の距離計算と表示用の整形。
import type { Coordinates } from '../types/place';

const EARTH_RADIUS_M = 6371000; // 地球の半径（メートル）

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Haversine 公式で2点間の距離（メートル）を求める。
 */
export function distanceInMeters(a: Coordinates, b: Coordinates): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * 距離（メートル）を「350m」「1.2km」のような表示用文字列にする。
 */
export function formatDistance(meters: number): string {
  if (!Number.isFinite(meters) || meters < 0) return '';
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  const km = meters / 1000;
  // 10km未満は小数第1位まで、それ以上は整数で
  return km < 10 ? `${km.toFixed(1)}km` : `${Math.round(km)}km`;
}

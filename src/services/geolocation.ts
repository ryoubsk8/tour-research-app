// ブラウザの位置情報（Geolocation API）から現在地を取得する。
import type { Coordinates } from '../types/place';

export type GeolocationErrorKind = 'unsupported' | 'denied' | 'unavailable' | 'timeout';

export class GeolocationError extends Error {
  kind: GeolocationErrorKind;
  constructor(kind: GeolocationErrorKind, message: string) {
    super(message);
    this.name = 'GeolocationError';
    this.kind = kind;
  }
}

/**
 * 現在地の座標を取得する。拒否・失敗時は GeolocationError を投げる。
 */
export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new GeolocationError('unsupported', 'このブラウザは位置情報に対応していません。'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            reject(new GeolocationError('denied', '位置情報の利用が許可されていません。'));
            break;
          case err.POSITION_UNAVAILABLE:
            reject(new GeolocationError('unavailable', '現在地を取得できませんでした。'));
            break;
          case err.TIMEOUT:
            reject(new GeolocationError('timeout', '現在地の取得がタイムアウトしました。'));
            break;
          default:
            reject(new GeolocationError('unavailable', '現在地を取得できませんでした。'));
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  });
}

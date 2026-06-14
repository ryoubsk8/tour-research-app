// 現在地の取得状態を管理するフック。拒否・失敗時は手入力(地名)へのフォールバックを促す。
import { useCallback, useState } from 'react';
import type { Coordinates } from '../types/place';
import {
  getCurrentPosition,
  GeolocationError,
  type GeolocationErrorKind,
} from '../services/geolocation';

export type GeoStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseGeolocationResult {
  status: GeoStatus;
  coords: Coordinates | null;
  errorKind: GeolocationErrorKind | null;
  errorMessage: string | null;
  /** 現在地を取得する */
  requestLocation: () => Promise<void>;
  /** 地名入力などで手動に座標を設定する */
  setManualCoords: (coords: Coordinates) => void;
}

export function useGeolocation(): UseGeolocationResult {
  const [status, setStatus] = useState<GeoStatus>('idle');
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [errorKind, setErrorKind] = useState<GeolocationErrorKind | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    setStatus('loading');
    setErrorKind(null);
    setErrorMessage(null);
    try {
      const pos = await getCurrentPosition();
      setCoords(pos);
      setStatus('success');
    } catch (e) {
      const err = e as GeolocationError;
      setErrorKind(err.kind ?? 'unavailable');
      setErrorMessage(err.message ?? '現在地を取得できませんでした。');
      setStatus('error');
    }
  }, []);

  const setManualCoords = useCallback((c: Coordinates) => {
    setCoords(c);
    setErrorKind(null);
    setErrorMessage(null);
    setStatus('success');
  }, []);

  return { status, coords, errorKind, errorMessage, requestLocation, setManualCoords };
}

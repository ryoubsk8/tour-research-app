// Google Maps JavaScript API（Places ライブラリ）を使って、周辺スポットの検索・詳細取得・
// 住所のジオコーディングを行う。フロントエンド中心構成のため、APIキーは .env から読み込む。
import { Loader } from '@googlemaps/js-api-loader';
import type {
  Coordinates,
  SearchParams,
  Spot,
  SpotDetails,
} from '../types/place';
import { distanceInMeters } from './distance';
import { RESULT_LIMIT } from '../config/searchOptions';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/** APIキー未設定などの設定エラー */
export class PlacesConfigError extends Error {}
/** 検索・通信の失敗 */
export class PlacesRequestError extends Error {}

let loader: Loader | null = null;
let placesServicePromise: Promise<google.maps.places.PlacesService> | null = null;
let geocoderPromise: Promise<google.maps.Geocoder> | null = null;

function getLoader(): Loader {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    throw new PlacesConfigError(
      'Google Maps の APIキーが設定されていません。.env に VITE_GOOGLE_MAPS_API_KEY を設定してください。',
    );
  }
  if (!loader) {
    loader = new Loader({ apiKey: API_KEY, version: 'weekly' });
  }
  return loader;
}

async function getPlacesService(): Promise<google.maps.places.PlacesService> {
  if (!placesServicePromise) {
    placesServicePromise = (async () => {
      const { PlacesService } = await getLoader().importLibrary('places');
      // PlacesService は地図かHTML要素が必要。表示しないダミーのdivを使う。
      return new PlacesService(document.createElement('div'));
    })();
  }
  return placesServicePromise;
}

async function getGeocoder(): Promise<google.maps.Geocoder> {
  if (!geocoderPromise) {
    geocoderPromise = (async () => {
      const { Geocoder } = await getLoader().importLibrary('geocoding');
      return new Geocoder();
    })();
  }
  return geocoderPromise;
}

/** Googleマップでナビ（経路案内）を開くためのURLを生成 */
function buildDirectionsUrl(placeId: string, loc: Coordinates): string {
  const params = new URLSearchParams({
    api: '1',
    destination: `${loc.lat},${loc.lng}`,
    destination_place_id: placeId,
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function toSpot(
  result: google.maps.places.PlaceResult,
  center: Coordinates,
): Spot | null {
  const loc = result.geometry?.location;
  const placeId = result.place_id;
  if (!loc || !placeId || !result.name) return null;

  const location: Coordinates = { lat: loc.lat(), lng: loc.lng() };
  const photoUrl = result.photos?.[0]?.getUrl({ maxWidth: 480, maxHeight: 320 });
  // open_now は非推奨だが、Nearby Search の結果では簡易な営業状況として利用できる
  const openNow = result.opening_hours?.open_now;

  return {
    placeId,
    name: result.name,
    photoUrl,
    rating: result.rating,
    userRatingsTotal: result.user_ratings_total,
    openNow,
    location,
    distanceMeters: distanceInMeters(center, location),
    vicinity: result.vicinity,
    directionsUrl: buildDirectionsUrl(placeId, location),
  };
}

/**
 * 周辺スポットを検索する。距離が近い順に並べ、最大 RESULT_LIMIT 件を返す。
 */
export async function searchNearby(params: SearchParams): Promise<Spot[]> {
  const service = await getPlacesService();
  const sub = params.subcategoryId
    ? params.category.subcategories.find((s) => s.id === params.subcategoryId)
    : undefined;

  const request: google.maps.places.PlaceSearchRequest = {
    location: params.center,
    radius: params.radiusMeters,
    type: sub?.placeType ?? params.category.defaultPlaceType,
  };
  if (sub?.keyword) request.keyword = sub.keyword;
  if (params.openNowOnly) request.openNow = true;

  return new Promise<Spot[]>((resolve, reject) => {
    service.nearbySearch(request, (results, status) => {
      const S = google.maps.places.PlacesServiceStatus;
      if (status === S.ZERO_RESULTS || !results) {
        resolve([]);
        return;
      }
      if (status !== S.OK) {
        reject(new PlacesRequestError(`検索に失敗しました (${status})`));
        return;
      }
      const spots = results
        .map((r) => toSpot(r, params.center))
        .filter((s): s is Spot => s !== null)
        .sort((a, b) => a.distanceMeters - b.distanceMeters)
        .slice(0, RESULT_LIMIT);
      resolve(spots);
    });
  });
}

/**
 * スポットの詳細（営業時間・電話・サイト）を必要時に取得する。
 */
export async function getSpotDetails(placeId: string): Promise<SpotDetails> {
  const service = await getPlacesService();
  return new Promise<SpotDetails>((resolve, reject) => {
    service.getDetails(
      {
        placeId,
        fields: ['opening_hours', 'formatted_phone_number', 'website'],
      },
      (place, status) => {
        const S = google.maps.places.PlacesServiceStatus;
        if (status !== S.OK || !place) {
          reject(new PlacesRequestError('詳細情報を取得できませんでした。'));
          return;
        }
        resolve({
          weekdayText: place.opening_hours?.weekday_text,
          openNow: place.opening_hours?.open_now,
          phone: place.formatted_phone_number,
          website: place.website,
        });
      },
    );
  });
}

/**
 * 地名・住所から座標を求める（位置情報が使えない場合のフォールバック / FR-2）。
 */
export async function geocodeAddress(address: string): Promise<Coordinates> {
  const geocoder = await getGeocoder();
  const res = await geocoder.geocode({ address });
  const first = res.results[0];
  if (!first) {
    throw new PlacesRequestError('その地名・住所が見つかりませんでした。');
  }
  const loc = first.geometry.location;
  return { lat: loc.lat(), lng: loc.lng() };
}

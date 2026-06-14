// 旅スポ アプリ全体で使うデータ型の定義。

/** 大分類のID（観光 / グルメ） */
export type CategoryId = 'sightseeing' | 'gourmet';

/** 細分類（絞り込みボタン） */
export interface Subcategory {
  /** 内部ID */
  id: string;
  /** 画面表示名（日本語） */
  label: string;
  /** Google Places の場所タイプ（任意） */
  placeType?: string;
  /** 追加のキーワード検索語（任意） */
  keyword?: string;
}

/** 大分類（タブ） */
export interface Category {
  id: CategoryId;
  /** 画面表示名（日本語） */
  label: string;
  /** 絞り込み未指定時に使う Places の場所タイプ */
  defaultPlaceType: string;
  /** 細分類の一覧 */
  subcategories: Subcategory[];
}

/** 緯度経度 */
export interface Coordinates {
  lat: number;
  lng: number;
}

/** 画面に表示する1スポットの情報 */
export interface Spot {
  placeId: string;
  name: string;
  /** サムネイル写真URL（無い場合あり） */
  photoUrl?: string;
  /** 評価（星 0〜5） */
  rating?: number;
  /** 口コミ件数 */
  userRatingsTotal?: number;
  /** 現在営業中か（取得できた場合） */
  openNow?: boolean;
  /** 所在地の座標 */
  location: Coordinates;
  /** 現在地からの距離（メートル） */
  distanceMeters: number;
  /** おおよその住所（vicinity） */
  vicinity?: string;
  /** Googleマップでナビを開くためのURL */
  directionsUrl: string;
}

/** スポットの詳細情報（必要時に追加取得） */
export interface SpotDetails {
  /** 曜日ごとの営業時間テキスト */
  weekdayText?: string[];
  /** 電話番号 */
  phone?: string;
  /** 公式サイト */
  website?: string;
  /** 現在営業中か */
  openNow?: boolean;
}

/** 検索パラメータ */
export interface SearchParams {
  center: Coordinates;
  /** 検索半径（メートル） */
  radiusMeters: number;
  category: Category;
  /** 選択中の細分類ID（未選択は null） */
  subcategoryId: string | null;
  /** 営業中のみに絞り込むか */
  openNowOnly: boolean;
}

/** 1カテゴリ分の検索結果の状態 */
export interface CategoryResultState {
  status: 'idle' | 'loading' | 'success' | 'empty' | 'error';
  spots: Spot[];
  errorMessage?: string;
}

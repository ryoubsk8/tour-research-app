# Code Generation Summary — 旅スポ / unit: tabispo-web

Code Generation で生成したアプリコードの概要と、要件（FR）との対応。

## 生成物の配置（すべてワークスペースルート配下）
| 種別 | パス |
|---|---|
| 設定 | `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `.gitignore`, `.env.example` |
| エントリ | `src/main.tsx`, `src/App.tsx`, `src/App.module.css` |
| 型 | `src/types/place.ts` |
| 設定データ | `src/config/categories.ts`, `src/config/searchOptions.ts` |
| サービス | `src/services/geolocation.ts`, `distance.ts`, `placesService.ts`, `favoritesStore.ts` |
| フック | `src/hooks/useGeolocation.ts`, `useNearbySearch.ts`, `useFavorites.ts` |
| コンポーネント | `src/components/CategoryTabs.tsx`, `SubcategoryFilter.tsx`, `RadiusSelector.tsx`, `OpenNowToggle.tsx`, `LocationInput.tsx`, `SpotCard.tsx`, `SpotList.tsx`, `FavoritesView.tsx`, `states/{Loading,EmptyState,ErrorRetry}.tsx`（各 `.module.css` 付き） |
| スタイル | `src/styles/theme.css` |
| テスト | `src/services/distance.test.ts`, `favoritesStore.test.ts`, `src/config/categories.test.ts`, `src/components/CategoryTabs.test.tsx`, `SpotCard.test.tsx`, `states/ErrorRetry.test.tsx`, `src/test/setup.ts` |
| ドキュメント | `README.md`（更新）, 本ファイル |

## 要件トレーサビリティ
| 要件 | 実装箇所 |
|---|---|
| FR-1 現在地取得 | `services/geolocation.ts`, `hooks/useGeolocation.ts`, `App.tsx`（起動時取得） |
| FR-2 位置拒否時の地名入力 | `components/LocationInput.tsx`, `services/placesService.ts`(geocodeAddress) |
| FR-3 起動時に両カテゴリ自動検索・初期=観光 | `App.tsx`（検索エフェクト）, `config/categories.ts`(DEFAULT_CATEGORY_ID) |
| FR-4 大分類タブ | `components/CategoryTabs.tsx` |
| FR-5 細分類絞り込み | `components/SubcategoryFilter.tsx`, `config/categories.ts` |
| FR-6 約10件・距離が近い順 | `services/placesService.ts`(sort/slice), `config/searchOptions.ts`(RESULT_LIMIT) |
| FR-7 写真・評価・口コミ・営業時間 | `components/SpotCard.tsx`, `services/placesService.ts`(searchNearby/getSpotDetails) |
| FR-8 営業中フィルタ | `components/OpenNowToggle.tsx`, `placesService.ts`(openNow) |
| FR-9 検索範囲切替 | `components/RadiusSelector.tsx`, `config/searchOptions.ts` |
| FR-10 Googleマップでナビ | `services/placesService.ts`(buildDirectionsUrl), `components/SpotCard.tsx` |
| FR-11 お気に入り（localStorage・専用タブ） | `services/favoritesStore.ts`, `hooks/useFavorites.ts`, `components/FavoritesView.tsx`, `CategoryTabs.tsx` |
| FR-12 0件・エラー時メッセージ＋再試行 | `components/states/{EmptyState,ErrorRetry}.tsx`, `App.tsx` |
| FR-13 日本語UI | 全コンポーネント（日本語表記） |

## 設計メモ
- フロントエンド中心構成。APIキーは `.env`（`VITE_`）から読み込み、未設定時は `PlacesConfigError` で分かりやすいメッセージを表示。
- 全体フィルタ（半径・営業中）変更時は観光・グルメ両方を再検索。細分類変更時は対象カテゴリのみ再検索。
- お気に入りは距離（検索時点の相対値）を除いて保存。お気に入り表示時は距離を出さない。
- 営業時間の詳細（曜日別）はカードの「営業時間を見る」展開時に `getSpotDetails` で取得（API呼び出しの節約）。
- 自動テスト対象要素には `data-testid` を付与。

## 補足
- テストの「実行」は次の Build and Test ステージで行う。
- Google Maps API の最新仕様により、利用可否や挙動が変わる可能性がある（実行時に確認）。

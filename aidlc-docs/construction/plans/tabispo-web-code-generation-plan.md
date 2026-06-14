# Code Generation Plan — 旅スポ / unit: tabispo-web

このファイルは Code Generation の**唯一の正（Single Source of Truth）**です。各ステップを順番に実行し、完了したら `[x]` に更新します。

## ユニット コンテキスト
- **プロジェクト種別**: Greenfield / 単一ユニット（フロントエンドWebアプリ）
- **ワークスペースルート（アプリコード設置先）**: `C:\Users\ryoub\Desktop\projects\tour-research-app`（= リポジトリ直下。`aidlc-docs/` 配下には置かない）
- **技術スタック**: React + Vite + TypeScript / プレーンCSS（CSS Modules＋自作の温かみあるテーマ）/ localStorage / Google Maps JavaScript API（Placesライブラリ）/ `.env`（`VITE_`接頭辞）
- **依存ユニット**: なし（単一ユニット）
- **外部依存**: Google Maps Platform（Places）, ブラウザ Geolocation API

## トレーサビリティ（実装対象の機能要件）
FR-1 現在地取得 / FR-2 位置拒否時の地名入力 / FR-3 起動時に観光・グルメ両方を自動検索（初期=観光） / FR-4 大分類タブ / FR-5 細分類絞り込み / FR-6 約10件・距離が近い順 / FR-7 スポット情報（写真・評価・口コミ・営業時間） / FR-8 営業中フィルタ / FR-9 検索範囲切替 / FR-10 Googleマップでナビ / FR-11 お気に入り（localStorage・専用タブ） / FR-12 0件・エラー時メッセージ＋再試行 / FR-13 日本語UI

---

## 想定プロジェクト構成（ワークスペースルート配下）
```
tour-research-app/
├── index.html
├── package.json
├── tsconfig.json / tsconfig.node.json
├── vite.config.ts
├── .env.example
├── .gitignore
├── README.md                      (更新)
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── types/place.ts             (データモデル)
    ├── config/categories.ts       (大分類/細分類 → Places種別マッピング)
    ├── services/
    │   ├── geolocation.ts         (現在地取得・拒否ハンドリング)
    │   ├── distance.ts            (距離計算・整形)
    │   ├── placesService.ts       (Places検索・詳細・写真URL・マップURL)
    │   └── favoritesStore.ts      (localStorage 保存/取得/削除)
    ├── hooks/
    │   ├── useGeolocation.ts
    │   ├── useNearbySearch.ts
    │   └── useFavorites.ts
    ├── components/
    │   ├── CategoryTabs.tsx
    │   ├── SubcategoryFilter.tsx
    │   ├── RadiusSelector.tsx
    │   ├── OpenNowToggle.tsx
    │   ├── LocationInput.tsx       (位置拒否時の地名入力)
    │   ├── SpotCard.tsx
    │   ├── SpotList.tsx
    │   ├── FavoritesView.tsx
    │   └── states/ (Loading.tsx, EmptyState.tsx, ErrorRetry.tsx)
    └── styles/
        ├── theme.css              (配色・余白などのデザイントークン)
        └── *.module.css           (各コンポーネントのCSS Modules)
```
※テストはソースに隣接（`*.test.ts(x)`）または `src/__tests__/` に配置。

---

## 実行ステップ

### Step 1: プロジェクト雛形・設定ファイルの作成（Greenfield） — NFR/技術スタック
- [ ] `package.json`（React/ReactDOM/Vite/TypeScript/@googlemaps/js-api-loader/Vitest/@testing-library など、scripts: dev/build/preview/test）
- [ ] `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`
- [ ] `index.html`（日本語・モバイル向け viewport・タイトル「旅スポ」）
- [ ] `.gitignore`（`node_modules`, `.env`, `dist` 等）と `.env.example`（`VITE_GOOGLE_MAPS_API_KEY=`）
- [ ] `src/styles/theme.css`（暖色系トラベルテーマのデザイントークン）

### Step 2: データモデルとカテゴリ設定 — FR-4, FR-5
- [ ] `src/types/place.ts`（Spot/Category/Subcategory/検索パラメータ等の型）
- [ ] `src/config/categories.ts`（観光/グルメの大分類、細分類の代表セット〔グルメ=カフェ/ラーメン/レストラン/居酒屋、観光=寺社/公園・自然/美術館・博物館/名所〕→ Places種別へのマッピング。将来追加しやすいデータ駆動構成）

### Step 3: コアサービス（ビジネスロジック）生成 — FR-1,2,6,7,8,9,10,11
- [ ] `src/services/geolocation.ts`（現在地取得、拒否/失敗の判別）
- [ ] `src/services/distance.ts`（Haversineで距離算出、距離表示の整形 m/km）
- [ ] `src/services/placesService.ts`（Maps JS APIロード、Nearby Search、Place Details、写真URL、営業中判定、GoogleマップURL生成）
- [ ] `src/services/favoritesStore.ts`（localStorageでお気に入りの保存/取得/削除）

### Step 4: サービスのユニットテスト
- [ ] `distance.test.ts`（距離計算・整形）
- [ ] `favoritesStore.test.ts`（保存/取得/削除、localStorageモック）
- [ ] `categories.test.ts`（マッピングの整合）
- [ ] （placesService/geolocation は外部依存をモックし、整形ロジック中心に軽くテスト）

### Step 5: Reactフック生成
- [ ] `src/hooks/useGeolocation.ts`（現在地取得状態の管理＋拒否時フォールバック誘導）
- [ ] `src/hooks/useNearbySearch.ts`（観光・グルメの検索、ローディング/エラー/再試行、結果保持・タブ再利用、半径・営業中・細分類の反映）
- [ ] `src/hooks/useFavorites.ts`（お気に入りの状態管理）

### Step 6: UIコンポーネント生成 — FR-3〜FR-13（`data-testid` を付与）
- [ ] `CategoryTabs.tsx`（観光/グルメ、初期=観光）, `SubcategoryFilter.tsx`（細分類絞り込み）
- [ ] `RadiusSelector.tsx`（検索範囲切替）, `OpenNowToggle.tsx`（営業中のみ）
- [ ] `LocationInput.tsx`（位置拒否時の地名入力）
- [ ] `SpotCard.tsx`（写真・名前・距離・評価・口コミ・営業時間・Googleマップへのナビ・★お気に入り）, `SpotList.tsx`
- [ ] `FavoritesView.tsx`（お気に入り専用一覧）
- [ ] `states/Loading.tsx`, `states/EmptyState.tsx`, `states/ErrorRetry.tsx`（0件/エラー＋再試行）

### Step 7: アプリ統合・起動時挙動 — FR-3, D-16
- [ ] `src/App.tsx`（全体の状態と画面構成。起動時に現在地取得→観光・グルメ両方を自動検索→初期は観光タブ。お気に入りタブへの切替。各種フィルタ連携）
- [ ] `src/main.tsx`（エントリポイント）

### Step 8: スタイリング（手作り感のある温かみテーマ） — NFR-5
- [ ] 各コンポーネントの `*.module.css`（暖色・余白・柔らかい影・カード型UI。モバイル中心のレスポンシブ）
- [ ] 全体の見た目調整（ヘッダー、タブ、カード、ボタン、空/エラー状態）

### Step 9: コンポーネントの軽量テスト
- [ ] 主要コンポーネント（SpotCard, CategoryTabs, ErrorRetry など）のレンダリング/操作を軽くテスト

### Step 10: ドキュメント生成
- [ ] `README.md` 更新（概要・必要なもの・APIキー設定手順・起動方法 `npm install`→`npm run dev`）
- [ ] `aidlc-docs/construction/tabispo-web/code/code-summary.md`（生成物の概要・構成・FR対応表）

### Step 11: デプロイ/実行アーティファクト（ローカル）
- [ ] npm scripts（dev/build/preview/test）で起動・ビルド・確認できることを整備（公開ホスティングは範囲外）
- [ ] `.env.example` と README にAPIキー設定手順を明記（`.env` 実体は作成しない／コミットしない）

---

## 補足・前提
- セキュリティ拡張ルール=無効、PBT=無効（要件どおり）。ただしAPIキーは `.env`＋Git除外＋Google側制限の方針を順守。
- テストの「実行」は次の Build and Test ステージで行う（本ステージでは生成まで）。
- Google Maps Platform のAPI仕様は実装時に最新を確認し、利用可能な方式（新Places API/従来方式）に合わせて実装する。

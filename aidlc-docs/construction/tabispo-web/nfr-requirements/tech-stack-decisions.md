# 技術スタック決定 (Tech Stack Decisions) — 旅スポ / unit: tabispo-web

ユーザー回答（NFR Q1=A, Q2=B, Q3=Dおまかせ＋「人の手でデザインした感じのUI」, Q4=A, Q5=A, Q6=A）に基づく確定事項。

## コア技術

| 項目 | 決定 | 根拠 |
|---|---|---|
| 言語 | **TypeScript** | NFR Q2=B。型による安全性を確保 |
| UIライブラリ | **React** | NFR Q1=A。情報が豊富で拡張しやすい定番 |
| ビルド/開発ツール | **Vite** | 高速な開発サーバ・本番ビルド。React+TSの標準的な構成 |
| 実行環境 | ブラウザ（クライアントサイド） | 要件D-1: Webアプリ／D-14: フロントエンド中心 |
| 必要ツール | **Node.js（LTS）+ npm** | Vite/Reactの開発に必要 |

## スタイリング（Q3=おまかせ＋デザイン意図を反映）

| 項目 | 決定 | 根拠 |
|---|---|---|
| 手法 | **プレーンCSS（CSS Modules）＋自作の温かみあるトラベル系テーマ** | 「機械的でなく人の手でデザインした感じ」を実現するため、既製の機械的な見た目になりがちなUIライブラリ（例: MUI）やユーティリティ主体のTailwindではなく、CSSを手書きして細部まで作り込む方針 |
| デザイン方針 | 旅・暖色系のあたたかな配色、適度な余白、角丸、柔らかい影、手触り感のあるカード型UI | ハンドクラフト感のあるUI |
| アイコン | 軽量アイコン（必要に応じSVG/絵文字、または lucide-react 等の軽量セット） | 装飾過多を避けつつ視認性を確保 |

> 補足: CSS Modules＝コンポーネントごとにCSSのクラス名が衝突しない仕組み。Reactで手書きCSSを安全に書ける標準的な方法。

## 状態管理・データ

| 項目 | 決定 | 根拠 |
|---|---|---|
| 状態管理 | **Reactの標準機能（useState / useContext）** | MVPの規模ではReduxなどの追加ライブラリは不要 |
| お気に入り保存 | **localStorage**（端末内） | 要件D-6/FR-11。ログイン不要 |
| 現在地取得 | **ブラウザ Geolocation API**（navigator.geolocation） | 要件FR-1 |

## 外部API連携（Google Places）

| 項目 | 決定 | 根拠 |
|---|---|---|
| 利用API | **Google Maps JavaScript API（Places ライブラリ）** をクライアントから利用 | フロントエンド中心構成（D-14）に適合。ブラウザからの呼び出し向け |
| ローダ | **@googlemaps/js-api-loader** でMaps JS APIを読み込み | スクリプト読み込みを安全・簡潔に扱う標準的な方法 |
| 周辺検索 | Places の Nearby Search（カテゴリ＝種別／半径指定） | FR-3/FR-5/FR-9 |
| 詳細情報 | Place Details（写真・評価・口コミ件数・営業時間 等） | FR-7 |
| 距離計算 | 現在地と各スポットの座標から距離算出（geometry もしくは Haversine 計算）→ 近い順ソート | FR-6 |
| 営業中判定 | Places の営業時間/営業状況（opening_hours / business_status） | FR-8 |
| ナビ連携 | スポットのGoogleマップURL（place_id等）を新規タブで開く | FR-10（アプリ内地図は持たない） |

> 注: Google Maps Platform のAPI仕様（新Places API/レガシー等）はコード生成時に最新を確認し、利用可能な方式に合わせて実装する。

## APIキー管理（Q6=A）

| 項目 | 決定 |
|---|---|
| 保存場所 | `.env` に `VITE_` 接頭辞付きで保存（例: `VITE_GOOGLE_MAPS_API_KEY`） |
| バージョン管理 | `.env` は **`.gitignore` に追加してコミットしない**。代わりに `.env.example` を用意 |
| 露出への対策 | Viteの仕様上 `VITE_` 変数はビルド成果物（ブラウザ）に含まれる。フロントエンド中心構成（D-14/Q21=B）の前提どおり、**Google Cloud Console側でキーを制限**（HTTPリファラー制限・利用API種別の限定・利用上限/予算アラート）して不正利用に備える |

## テスト

| 項目 | 決定 | 根拠 |
|---|---|---|
| テストフレームワーク | **Vitest + React Testing Library**（軽量に） | Vite環境と相性が良い標準的選択。詳細粒度はBuild & Testで決定 |
| プロパティベーステスト | **無し** | NFR Q12=C |
| モック | Geolocation・Google Places呼び出しをモックして検証 | 外部依存を切り離す |

## スクリプト（想定）
- `npm install` … 依存関係のインストール
- `npm run dev` … 開発サーバ起動（ブラウザで動作確認）
- `npm run build` … 本番用ビルド
- `npm run preview` … ビルド結果のローカル確認
- `npm test` … テスト実行

## デプロイ
- MVPは**ローカル動作のみ**（要件D-15/Q22=A）。公開ホスティングは範囲外。

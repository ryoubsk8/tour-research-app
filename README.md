# 旅スポ (TABISPO)

旅先で、現在地のまわりの**観光地・グルメ**をすぐに探せるWebアプリです。
起動すると現在地を取得し、周辺のスポットを「観光／グルメ」のジャンル別に、距離が近い順で一覧表示します。

- 現在地の自動取得（拒否時は地名・住所の手入力でもOK）
- 観光／グルメのタブ＋細分類の絞り込み（カフェ・ラーメン・寺社 など）
- 写真・評価・口コミ件数・営業時間、現在営業中フィルタ、検索範囲の切替
- 各スポットからGoogleマップでナビ
- お気に入りを端末内に保存（ログイン不要）

技術: React + Vite + TypeScript / プレーンCSS / Google Maps JavaScript API (Places)

---

## 必要なもの
- **Node.js**（LTS版、18以上を推奨）と npm
- **Google Maps Platform のAPIキー**（無料枠あり＋従量課金）

## 1. Google Maps APIキーの準備
1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成
2. 以下のAPIを有効化:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**（地名・住所からの検索に使用）
3. 「認証情報」からAPIキーを発行
4. キーの**制限**を設定（重要・不正利用と高額請求の防止）:
   - アプリケーションの制限: **HTTPリファラー**（例: `http://localhost:5173/*`）
   - APIの制限: 上記3つのAPIに限定
   - 予算アラート/上限の設定を推奨

> ⚠️ このアプリはフロントエンドのみの構成のため、APIキーはビルド後のブラウザ側に含まれます。
> 必ず上記の「キーの制限」を設定してください（試作・ローカル利用の前提です）。

## 2. APIキーの設定
プロジェクト直下の `.env.example` をコピーして `.env` を作成し、キーを記入します。

```bash
# Windows (PowerShell)
Copy-Item .env.example .env
```

`.env` を編集:
```
VITE_GOOGLE_MAPS_API_KEY=発行したAPIキー
```
`.env` は Git にコミットされません（`.gitignore` 済み）。

## 3. インストールと起動
```bash
npm install      # 初回のみ
npm run dev      # 開発サーバ起動（表示されたURL、通常 http://localhost:5173 を開く）
```
ブラウザで位置情報の利用を許可すると、周辺のスポットが表示されます。

## 利用できるコマンド
| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバを起動 |
| `npm run build` | 本番用にビルド（`dist/` に出力） |
| `npm run preview` | ビルド結果をローカル確認 |
| `npm test` | テストを実行（Vitest） |

---

## プロジェクト構成（概要）
```
src/
├── App.tsx                 画面全体の構成・状態管理（起動時の自動検索など）
├── main.tsx                エントリポイント
├── config/                 カテゴリ定義・検索オプション
├── types/                  データ型
├── services/               位置情報・距離計算・Places連携・お気に入り保存
├── hooks/                  React フック（位置情報・検索・お気に入り）
├── components/             UI コンポーネント（タブ・絞り込み・カード・状態表示 など）
└── styles/theme.css        デザインテーマ（暖色系トラベルテーマ）
```

## メモ
- お気に入りはブラウザの localStorage に保存されます（端末内のみ・別端末と共有はしません）。
- 公開ホスティングは現在のスコープ外です（ローカル動作のMVP）。
- 設計・要件などのドキュメントは `aidlc-docs/` にあります。

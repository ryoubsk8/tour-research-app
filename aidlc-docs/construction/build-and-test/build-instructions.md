# Build Instructions — 旅スポ (TABISPO)

## Prerequisites
- **Build Tool**: Vite 5 / TypeScript 5（npm scripts 経由）
- **ランタイム**: Node.js 18以上（検証環境: v24.15.0, npm 11.12.1）
- **Dependencies**: `package.json` 記載（React, ReactDOM, @googlemaps/js-api-loader, Vite, TypeScript, Vitest, Testing Library など）
- **Environment Variables**:
  - `VITE_GOOGLE_MAPS_API_KEY` … Google Maps Platform のAPIキー（アプリ実行時に必要。ビルド/テストのみなら未設定でも可）
- **System Requirements**: 一般的なPC（OS非依存）。本検証は Windows 10 で実施。

## Build Steps

### 1. 依存関係のインストール
```bash
cd tour-research-app
npm install
```

### 2. 環境設定（アプリ実行時のみ必要）
```bash
# .env.example をコピーして .env を作成し、APIキーを記入
#   VITE_GOOGLE_MAPS_API_KEY=発行したキー
```
※ `.env` は `.gitignore` 済みでコミットされません。

### 3. 本番ビルド
```bash
npm run build
```
内部で `tsc --noEmit`（型チェック）→ `vite build`（バンドル）を実行します。

### 4. ビルド成功の確認
- **Expected Output**: `✓ built in ...`、`dist/` に成果物が出力される
- **Build Artifacts**: `dist/index.html`, `dist/assets/index-*.js`, `dist/assets/index-*.css`
- **検証結果（2026-06-14）**: 成功。60 modules transformed。JS 約160KB（gzip 約53KB）。

### 開発サーバ / プレビュー
```bash
npm run dev       # 開発サーバ（通常 http://localhost:5173）
npm run preview   # ビルド結果のローカル確認
```

## Troubleshooting
### 依存エラーで失敗する
- **原因**: Node のバージョンが古い／キャッシュ不整合
- **対処**: Node 18以上を使用。`node_modules` と `package-lock.json` を削除して `npm install` を再実行。

### ビルドが型エラーで失敗する
- **原因**: 型の不整合
- **対処**: エラーメッセージのファイル/行を確認し修正。`npm run build` を再実行。

### 実行時に「APIキーが設定されていません」と表示される
- **原因**: `.env` の `VITE_GOOGLE_MAPS_API_KEY` が未設定
- **対処**: `.env` を作成しキーを設定。`npm run dev` を再起動（環境変数は起動時に読み込まれる）。

# Unit Test Execution — 旅スポ (TABISPO)

テストランナー: **Vitest**（jsdom 環境）／コンポーネントは **React Testing Library**。

## Run Unit Tests

### 1. 全テストの実行
```bash
cd tour-research-app
npm test
```
（監視モード: `npm run test:watch`）

### 2. テスト結果の確認
- **Expected**: 全テスト pass、0 failures
- **検証結果（2026-06-14）**: **23 / 23 passed**（6 ファイル）

| テストファイル | 件数 | 内容 |
|---|---|---|
| `src/services/distance.test.ts` | 6 | 距離計算（Haversine）と表示整形 |
| `src/services/favoritesStore.test.ts` | 5 | お気に入りの保存/取得/削除・距離除外・壊れたデータ復帰 |
| `src/config/categories.test.ts` | 4 | カテゴリ/細分類マッピングの整合 |
| `src/components/CategoryTabs.test.tsx` | 3 | タブ表示・切替・バッジ |
| `src/components/SpotCard.test.tsx` | 3 | 名前/評価/距離/営業状況・ナビURL・お気に入り操作 |
| `src/components/states/ErrorRetry.test.tsx` | 2 | エラーメッセージ・再試行ボタン |

### 3. 失敗時の対応
1. 出力の失敗箇所（ファイル/行）を確認
2. コードまたはテストを修正
3. `npm test` を再実行して全件パスを確認

## 補足
- 外部依存（Google Places / Geolocation）に直接アクセスするロジックは単体テスト対象外とし、整形・計算・保存などの純粋ロジックとUI操作を中心に検証している。
- プロパティベーステスト(PBT)は要件により対象外。

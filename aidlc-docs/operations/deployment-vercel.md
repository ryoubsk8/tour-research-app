# デプロイ手順 — Vercel（旅スポ / TABISPO）

スマホからも使えるよう、Webに公開する手順です。Vercel は Vite を自動検出するため、**アプリのコード変更は不要**です。
公開後は自動でHTTPSになるため、スマホでも位置情報が使えるようになります。

## 前提
- GitHub アカウント（リポジトリは作成済み: `https://github.com/ryoubsk8/tour-research-app`）
- Vercel アカウント（GitHubでサインイン可能・無料枠でOK）
- Google Maps の APIキー（取得済み）

> 🔒 重要: `.env` は `.gitignore` 済みでGitHubに上がりません。APIキーは **Vercelの環境変数**に設定します（リポジトリには載せない）。

---

## ステップ1: コードを GitHub に push する
ローカルに未プッシュのコミットがあります。ターミナルで次を実行してください（Claude Code のプロンプトに `! ` を付けて実行してもOK）:

```bash
cd tour-research-app
git push
```
- 認証を求められたら GitHub のユーザー名／トークンでログイン（初回のみ）。
- 完了後、GitHub のリポジトリページに最新コードが反映されていることを確認。

## ステップ2: Vercel で取り込む（Import）
1. https://vercel.com にGitHubでサインイン
2. **Add New… → Project**
3. `tour-research-app` リポジトリを **Import**
4. 設定の自動検出を確認（通常そのままでOK）:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables** に次を追加（Production と Preview 両方）:
   - Name: `VITE_GOOGLE_MAPS_API_KEY`
   - Value: あなたのAPIキー
6. **Deploy** を押す → 数十秒で `https://<プロジェクト名>.vercel.app` が発行される

> 以降、GitHubに push するたびに自動で再デプロイされます。

## ステップ3: APIキーを公開用に制限する（必須）
公開するとキーがブラウザ側に含まれます。**必ず** Google Cloud Console で制限を設定してください:
1. 「APIとサービス → 認証情報 → 対象のAPIキー」
2. **アプリケーションの制限 → HTTPリファラー** に以下を追加:
   - `https://<プロジェクト名>.vercel.app/*`
   - （独自ドメインを使う場合はそのドメインも）
   - （Vercelのプレビュー環境も使うなら `https://*.vercel.app/*` を追加。広めの許可になる点に注意）
3. **APIの制限**: Maps JavaScript API / Places API / Geocoding API の3つに限定
4. **予算アラート / 割り当て上限** を設定（想定外の課金を防止）
5. 保存後、反映に数分かかることがあります。

## ステップ4: スマホで開く
1. 発行された `https://<プロジェクト名>.vercel.app` をスマホのブラウザで開く
2. 位置情報の利用を「許可」
3. 周辺の観光・グルメが表示されれば成功

---

## トラブルシューティング
| 症状 | 原因 / 対処 |
|---|---|
| 地図/検索が動かず `RefererNotAllowedMapError` 等 | ステップ3のHTTPリファラーに公開ドメインが未登録。ドメインを追加して数分待つ |
| 「APIキーが設定されていません」 | Vercelの環境変数 `VITE_GOOGLE_MAPS_API_KEY` 未設定、または設定後に再デプロイしていない。設定後 **Redeploy** |
| スマホで位置情報が拒否される | OSのブラウザに位置情報を許可。HTTPSのURL（`https://...vercel.app`）で開いているか確認 |
| ビルドがVercelで失敗 | ローカルで `npm run build` が通るか確認。Nodeのバージョン差異が原因なら Vercel の Project Settings → Node.js Version を調整 |

## メモ
- 公開はMVPの当初スコープ外でしたが、スマホ利用のため追加対応として実施。
- 独自ドメインを使いたい場合は Vercel の Domains から設定可能（その場合はステップ3のリファラーにも追加）。

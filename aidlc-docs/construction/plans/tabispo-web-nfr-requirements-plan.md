# NFR Requirements Plan — 旅スポ（unit: tabispo-web）

このステージでは「**どんな技術で・どんな品質目標で作るか**（非機能要件）」を決めます。
中でも最重要は**言語/フレームワークの選定**です。初心者の方向けに、各選択肢の意味と「(推奨)」を添えています。
`[Answer]:` に記号を記入し、終わったら「完了」と教えてください。「全部おすすめで」もOKです。

## NFR評価チェックリスト（こちらで進める作業）
- [x] 技術スタック（言語/フレームワーク/スタイリング）の確定
- [x] パフォーマンス目標の設定
- [x] 対応ブラウザ・デバイス方針の確定
- [x] APIキーの保護・管理方針の確定
- [x] 信頼性（エラー処理・再試行）の方針確認
- [x] tech-stack-decisions.md / nfr-requirements.md の作成

---

## Question 1: 言語・フレームワークの選択【最重要】
Webアプリの「作りの土台」です。用語の意味は下の補足を参照してください。

A) **React + Vite（JavaScript）** — 世界で最も使われるUIライブラリ。情報・サンプルが非常に多く、後から機能追加しやすい (推奨：定番で困ったとき調べやすい)
B) **Vue + Vite（JavaScript）** — Reactより学習がやさしいと言われるUIフレームワーク
C) **素のHTML/CSS/JavaScript（フレームワーク無し）** — ビルド不要で最もシンプル。仕組みが見えやすく学習向きだが、規模が育つと管理が大変
D) おまかせ（あなたのおすすめ構成で）
X) Other (please describe after [Answer]: tag below)

> 補足：
> - **フレームワーク/ライブラリ**＝画面づくりを楽にする「ひな形・道具セット」。
> - **React / Vue**＝代表的なUIの道具。画面を「部品（コンポーネント）」に分けて作れる。
> - **Vite（ヴィート）**＝開発用の高速ツール。保存すると画面が即反映され、本番用ファイルもまとめてくれる。

[Answer]: A

---

## Question 2: TypeScript を使いますか？
TypeScriptは「JavaScriptに“型（データの種類）チェック”を足した言語」です。ミスを早期に見つけられますが、覚えることは少し増えます。

A) **JavaScript（型なし）** — まずは手軽に。試作・学習に向く (推奨：初めての試作なら)
B) **TypeScript（型あり）** — 安全性は高いが学習要素が増える
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 3: 見た目（スタイリング）の作り方は？
画面の装飾（色・余白・レイアウト）をどう書くかです。

A) **普通のCSS** — 追加学習が少なくシンプル (推奨：試作)
B) **Tailwind CSS** — クラス名を付けてサッと装飾できる人気ツール（独自の書き方を覚える必要あり）
C) **UIコンポーネントライブラリ（例: MUI）** — 既製の綺麗な部品で見た目が整う（その分やや重い）
D) おまかせ
X) Other (please describe after [Answer]: tag below)

[Answer]: D(機械的なデザインよりは、人の手でデザインした感じのUIが良い)

---

## Question 4: パフォーマンス目標は？
「起動 → 一覧表示」の速さの目標です。

A) 体感で素早ければよい（厳密な数値目標は設けない）(推奨：試作)
B) 数値目標を決めたい（例: 主要な一覧表示は通信良好時3秒以内 等。Xに希望を記入）
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5: 対応ブラウザ・デバイスの方針は？

A) **最新の主要ブラウザ（Chrome / Safari / Edge）でモバイル中心** に最適化 (推奨：旅先＝スマホ利用)
B) PCブラウザも同等に重視する（スマホ・PC両対応のレイアウト）
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6: Google Places APIキーのローカル管理方法は？
キーは「使った分だけ課金され得る秘密情報」です。ローカル開発での扱いを決めます。

A) **環境変数ファイル（.env）に保存し、Gitにはコミットしない**。あわせてGoogle Cloud側でキーの利用制限（HTTPリファラー/API種別/上限）を設定 (推奨：秘密情報の基本)
B) おまかせ（あなたのおすすめの管理方法で）
X) Other (please describe after [Answer]: tag below)

> 補足：**.env（ドットエンブ）**＝秘密の設定値を入れておくファイル。Git（バージョン管理）に含めないことで、誤って公開するのを防ぎます。

[Answer]: A

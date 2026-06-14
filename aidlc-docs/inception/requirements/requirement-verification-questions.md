# 要件確認のための質問 (Requirement Verification Questions)

このファイルは「壁打ち」用のワークシートです。各質問の `[Answer]:` の後ろに**選んだ記号（A, B, C... または X）**を記入してください。
Xを選んだ場合は、その後ろに自由に内容を書いてください。迷ったら「(推奨)」と書いてある選択肢を選んでおけば、最初のバージョンとして無難です。

すべて埋め終わったら「完了」と教えてください。回答内容に矛盾やあいまいな点があれば、追加で質問します。

---

## Question 1: どの形態のアプリにしますか？
「現在地を自動取得する」という要件を実現しやすいのはスマホアプリですが、Webアプリでも位置情報は取得できます。

A) スマートフォンアプリ（ネイティブアプリ。アプリストアからインストールする形）
B) Webアプリ（ブラウザで開く形。スマホ・PC両対応にしやすい）(推奨：最初に試作するなら開発が手軽)
C) スマホアプリとWebアプリの両方
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2: （スマホアプリの場合）対象OSは？
※Question 1でB（Webアプリのみ）を選んだ場合は「該当なし」としてXに書いてOKです。

A) iPhone (iOS) のみ
B) Android のみ
C) iOSとAndroidの両方（1つのコードで両対応する「クロスプラットフォーム」開発）
X) Other (please describe after [Answer]: tag below)

[Answer]: X
OK

---

## Question 3: 対象とする地域の範囲は？
観光地・グルメ情報を取得する範囲です。

A) 日本国内のみ
B) 世界中（海外旅行でも使える）(推奨：位置情報サービスは世界対応が多く、実装の手間は変わらない)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 4: 観光地・グルメ情報はどこから取得しますか？
アプリ自身がデータを持つのは現実的でないため、外部サービス（API）から取得します。APIとは「他社サービスのデータを呼び出す窓口」です。多くは無料枠があり、使いすぎると課金されます。

A) Google Maps / Google Places API（情報量が豊富。世界対応。無料枠あり＋従量課金）(推奨：定番で情報が充実)
B) 日本特化のサービス（例：ぐるなび・ホットペッパー等のグルメAPI、観光系オープンデータ）
C) OpenStreetMap系（無料中心だがレビュー情報などは弱め）
D) まだ決められない／おすすめに任せたい
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5: 「ジャンル別リスト表示」のジャンルは何を想定していますか？（複数選んでOK、記号を並べて記入）
表示するカテゴリの方向性を教えてください。

A) 大分類のみ（例：観光スポット / 飲食店）
B) グルメを細かく分類（例：和食・洋食・カフェ・ラーメン・居酒屋 など）
C) 観光を細かく分類（例：寺社・自然・絶景・博物館・体験 など）
D) BとC両方を細かく分類
X) Other (please describe after [Answer]: tag below)

[Answer]: X
Aのような大分類が基本で、細かいジャンルを指定したい人はBやCのようなジャンルも選べるようにしたい

---

## Question 6: 各スポットでどんな情報を見せたいですか？（複数選んでOK、記号を並べて記入）

A) 名前・写真・現在地からの距離
B) 評価（星）・口コミ件数
C) 営業時間・定休日
D) 地図上のピン表示／経路案内（ナビ）
E) 上記すべて (推奨)
X) Other (please describe after [Answer]: tag below)

[Answer]: E

---

## Question 7: 地図画面は必要ですか？
リスト表示に加えて、地図上に表示する機能の有無です。

A) リスト表示だけでよい（まずはシンプルに）(推奨：最初のバージョンとして)
B) 地図表示も必須にしたい
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 8: ユーザー登録（ログイン）機能は必要ですか？
お気に入り保存や履歴などを「個人ごと」に管理するにはログインが必要になります。

A) 不要（誰でもインストールしてすぐ使える）(推奨：最初のバージョンとして)
B) 必要（お気に入り保存・行った場所の記録などをしたい）
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 9: お気に入り／後で見る などの保存機能は必要ですか？
ログイン無しでも、端末内に保存する形なら実現できます。

A) 不要（毎回その場で調べるだけでよい）
B) 必要だが端末内保存でよい（ログイン不要）(推奨)
C) 必要で、別端末でも共有したい（ログイン＝Question 8でBが前提）
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 10: 最初のバージョン（MVP）で最優先したいことは？
MVPとは「Minimum Viable Product＝必要最小限の動くアプリ」のこと。まず何を完成させたいかを教えてください。

A) とにかく「現在地→ジャンル別の一覧表示」が動くこと最優先（推奨）
B) 見た目・使いやすさ（デザイン）を重視
C) 情報の正確さ・豊富さを重視
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 11: セキュリティ拡張ルールについて
このプロジェクトでセキュリティ関連のルール（入力検証・APIキーの安全な扱いなど）を「必ず守るべき制約」として有効化しますか？

A) はい — セキュリティルールをすべて必須制約として適用する（本番運用を見据えるなら推奨）
B) いいえ — セキュリティルールは適用しない（試作・学習・実験段階向け）
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 12: プロパティベーステスト(PBT)拡張ルールについて
PBTとは「たくさんのランダムな入力を自動生成して、プログラムが常に満たすべき性質を検証する」高度なテスト手法です。

A) はい — PBTルールをすべて必須制約として適用する（複雑な業務ロジックがある場合に推奨）
B) 一部のみ — 純粋な関数やデータ変換部分だけPBTを適用する
C) いいえ — PBTルールは適用しない（シンプルなアプリやUI中心のアプリ向け）(推奨：今回の規模なら)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

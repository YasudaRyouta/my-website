# プロジェクトのルール

## このプロジェクトについて
- このプロジェクトはチャットボット付きのホームページを作るプロジェクトです
- 題材は博多らーめん「紅一（BENIICHI）」の公式サイト（静的HTML / CSS / JavaScript）
  - ページ: `index.html` `about.html` `menu.html` `shops.html` `news.html` `recruit.html` `store.html` `journal.html`（記事は `journal-*.html`）
  - スタイルは `css/style.css`、スクリプトは `js/main.js`
  - チャットボットは `js/chatbot.js`（画面とデータ）と `api/chat.js`（Vercel 上で Claude API を呼ぶ窓口）
    - 選択肢ボタンは FAQ 式で即答、自由入力は `/api/chat` 経由で AI が答える。AI が使えない時は FAQ 式に自動で切り替わる
    - 店舗・メニューのデータは `js/chatbot.js` だけに置き、shops.html / menu.html と同じ内容にそろえる（api/chat.js はここを読み込んで AI に渡す）
    - API キーは Vercel の環境変数 `ANTHROPIC_API_KEY` に置く。コードや GitHub には絶対に書かない

## 守るルール
- 返答は日本語で行う
- デザインはモダンで洗練されたものにする
- レスポンシブ対応（スマホでも見やすい）を必ず行う
- コードのコメントは日本語で書く

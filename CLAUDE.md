# プロジェクトのルール

## このプロジェクトについて
- このプロジェクトはチャットボット付きのホームページを作るプロジェクトです
- 題材は博多らーめん「紅一（BENIICHI）」の公式サイト（静的HTML / CSS / JavaScript）
  - ページ: `index.html` `about.html` `menu.html` `shops.html` `news.html` `recruit.html` `store.html` `journal.html`（記事は `journal-*.html`）
  - スタイルは `css/style.css`、スクリプトは `js/main.js`
  - チャットボットは `js/chatbot.js`（FAQ式。店舗・メニューのデータは shops.html / menu.html と同じ内容にそろえる。AIへ切り替える時は `getAnswer()` だけを差し替える）

## 守るルール
- 返答は日本語で行う
- デザインはモダンで洗練されたものにする
- レスポンシブ対応（スマホでも見やすい）を必ず行う
- コードのコメントは日本語で書く

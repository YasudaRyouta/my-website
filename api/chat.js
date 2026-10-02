/* ===== チャットボットのAI窓口（Vercel のサーバー側で動く） =====
 * ブラウザから質問を受け取り、Claude API に聞いて返事を返す。
 * APIキーは Vercel の環境変数 ANTHROPIC_API_KEY に入れる（コードやGitHubには書かない）。
 * 店舗・メニューのデータは js/chatbot.js と同じものを使う。
 */
const { SHOPS, MENU, FAQ } = require("../js/chatbot.js");

const MODEL = "claude-haiku-4-5-20251001"; // 速くて安いモデル
const MAX_INPUT = 200; // 1回の質問の最大文字数（入力欄と同じ）

// HTMLタグを外して、AIに渡す文字にする
const stripTags = s => s.replace(/<[^>]+>/g, "");

// AIへの指示（お店の情報とルール）
const SYSTEM = `あなたは博多らーめん「紅一（BENIICHI）」公式サイトのご案内係です。
お客様の質問に、日本語で、丁寧かつ簡潔（3〜5文程度）に答えてください。

# ルール
- 答えは下の「お店の情報」にあることだけを使う。載っていないこと（住所の詳細、混雑状況、予約可否、最新のキャンペーンなど）は推測せず、「[店舗一覧](shops.html)からお近くの店舗へお問い合わせください」と案内する
- アレルギーの質問には、使っているメニューと使っていないメニューを答え、「同じ厨房で調理しているため少量が混ざる可能性があります。ご心配な方は店舗スタッフにお声がけください」と必ず添える
- 紅一と関係のない質問（雑談、他店、一般知識など）には、紅一についてのご質問をお願いする旨を短く伝える
- サイト内のページを案内する時は [ページ名](ファイル名.html) の形で書く。使えるページ：index.html（トップ）、about.html（紅一について）、menu.html（お品書き）、shops.html（店舗一覧）、news.html（お知らせ）、recruit.html（採用情報）、store.html（オンラインストア）、journal.html（読みもの）、journal-kaedama.html（替玉の読みもの）
- 見出しや表、太字などの装飾は使わず、普通の文章と「・」の箇条書きで書く

# お店の情報
## 店舗と営業時間
${SHOPS.map(s => `・${s.name}：${s.hours}（定休：${s.closed}）`).join("\n")}

## メニュー・価格・アレルゲン
${MENU.map(m => `・${m.name} ${m.price}（アレルゲン：${m.allergens.join("、")}）`).join("\n")}

## よくある質問
${FAQ.map(f => `### ${f.label}\n${stripTags(f.answer())}`).join("\n\n")}`;

// 会話の履歴を、安全な形（user と assistant が交互、文字数制限つき）に整える
function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  const out = [];
  for (const h of history.slice(-6)) {
    if (!h || typeof h.content !== "string") continue;
    const role = h.role === "assistant" ? "assistant" : "user";
    if (out.length === 0 && role !== "user") continue;
    if (out.length && out[out.length - 1].role === role) continue;
    out.push({ role, content: h.content.slice(0, 1000) });
  }
  // 最後は assistant で終わらせる（このあと新しい質問を user で足すため）
  if (out.length && out[out.length - 1].role === "user") out.pop();
  return out;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY が設定されていません" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const message = typeof body.message === "string" ? body.message.trim().slice(0, MAX_INPUT) : "";
  if (!message) return res.status(400).json({ error: "message が空です" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        system: SYSTEM,
        messages: [...cleanHistory(body.history), { role: "user", content: message }],
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      // 残高不足・キー間違いなどはここ。ログは Vercel の「Logs」で確認できる
      console.error("Claude API エラー:", r.status, data?.error?.message);
      return res.status(502).json({ error: "AIの呼び出しに失敗しました" });
    }
    const reply = (data.content || []).filter(c => c.type === "text").map(c => c.text).join("").trim();
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("通信エラー:", err);
    return res.status(502).json({ error: "AIの呼び出しに失敗しました" });
  }
};

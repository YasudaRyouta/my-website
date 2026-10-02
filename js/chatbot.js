/* ===== 博多らーめん 紅一 チャットボット（AI＋FAQ） =====
 * 選択肢ボタンの質問は、下のデータからすぐに答える（無料）。
 * 自由に入力された質問は /api/chat（Vercel 上の api/chat.js）経由で Claude API に聞く。
 * AI が使えない時（APIキー未設定・残高不足・通信エラー）は、FAQ式の答えに切り替える。
 * 店舗・メニューのデータは api/chat.js も読み込んで AI に渡すので、ここだけを直せばよい。
 */

// 店舗データ（shops.html と同じ内容にそろえる）
const SHOPS = [
  { name: "中洲本店",           keys: ["中洲", "本店"],           hours: "11:00〜翌2:00", closed: "なし" },
  { name: "天神西通り店",       keys: ["天神", "大名"],           hours: "11:00〜23:00",  closed: "なし（改装のため一時休業中）" },
  { name: "新宿東口店",         keys: ["新宿"],                   hours: "11:00〜翌3:00", closed: "なし" },
  { name: "恵比寿店",           keys: ["恵比寿"],                 hours: "11:00〜24:00",  closed: "なし" },
  { name: "横浜みなとみらい店", keys: ["横浜", "みなとみらい"],   hours: "11:00〜22:00",  closed: "施設に準ずる" },
  { name: "梅田茶屋町店",       keys: ["梅田", "茶屋町", "大阪"], hours: "11:00〜23:30",  closed: "なし" },
  { name: "京都四条烏丸店",     keys: ["京都", "四条", "烏丸"],   hours: "11:00〜22:00",  closed: "なし" },
  { name: "札幌すすきの店",     keys: ["札幌", "すすきの"],       hours: "17:00〜翌4:00", closed: "日曜" },
];

// メニューとアレルゲン（menu.html と同じ内容にそろえる）
const MENU = [
  { name: "白丸 元味",         price: "¥890",   allergens: ["小麦", "卵", "乳", "ごま", "大豆", "豚肉"] },
  { name: "赤丸 新味",         price: "¥990",   allergens: ["小麦", "卵", "乳", "ごま", "大豆", "豚肉"] },
  { name: "紅蓮つけ麺",        price: "¥1,180", allergens: ["小麦", "卵", "乳", "えび", "さば", "ごま", "大豆", "豚肉"] },
  { name: "紅一 特製全部のせ", price: "¥1,390", allergens: ["小麦", "卵", "乳", "ごま", "大豆", "豚肉"] },
  { name: "海老塩らーめん",    price: "¥1,080", allergens: ["小麦", "卵", "えび", "かに", "ごま", "大豆", "鶏肉"] },
  { name: "紅一まぜそば",      price: "¥950",   allergens: ["小麦", "卵", "ごま", "大豆", "豚肉"] },
];
// 入力の言い方の揺れ → アレルゲン名
const ALLERGEN_WORDS = {
  "小麦": ["小麦", "こむぎ", "グルテン"], "卵": ["卵", "たまご", "玉子"], "乳": ["乳", "牛乳", "乳製品"],
  "えび": ["えび", "エビ", "海老"], "かに": ["かに", "カニ", "蟹"], "さば": ["さば", "サバ", "鯖"],
  "ごま": ["ごま", "ゴマ", "胡麻"], "大豆": ["大豆", "だいず"], "豚肉": ["豚", "ぶた"], "鶏肉": ["鶏", "とり"],
};

const CONTACT = '<a href="shops.html">店舗一覧</a>からお近くの店舗へお問い合わせください';

// よくある質問。keys のどれかが入力に含まれていれば、その答えを返す（上から順に探す）
const FAQ = [
  { id: "shop",    label: "店舗・営業時間", keys: ["店舗", "お店", "営業", "何時", "時間", "定休", "休み", "場所", "近く"],
    answer: () => "国内の主な店舗の営業時間です。\n" +
      SHOPS.map(s => `・${s.name}：${s.hours}（定休：${s.closed}）`).join("\n") +
      '\n\n住所は<a href="shops.html">店舗一覧</a>でご確認いただけます。店舗名を入れていただくと、その店舗だけご案内します。' },
  { id: "menu",    label: "メニュー・アレルギー", keys: ["メニュー", "おすすめ", "オススメ", "値段", "いくら", "料金", "アレルギー", "アレルゲン"],
    answer: () => "らーめんのメニューです。\n" +
      MENU.map(m => `・${m.name}　${m.price}`).join("\n") +
      "\n\nはじめての方には、創業以来の味「白丸 元味」がおすすめです。\n" +
      "アレルギーについては「えび アレルギー」のように原材料名を入れていただくと、お答えします。" +
      '詳しくは<a href="menu.html">お品書き</a>をご覧ください。' },
  { id: "kaedama", label: "替玉・麺の硬さ", keys: ["替玉", "かえだま", "硬さ", "かたさ", "バリカタ", "ハリガネ", "麺"],
    answer: () => "替玉は1玉150円（税込）です。麺の硬さは「粉おとし・ハリガネ・バリカタ・カタ・やわ」からお選びいただけます。\n" +
      'いちばん人気は「バリカタ」です。替玉のコツは<a href="journal-kaedama.html">読みもの</a>でもご紹介しています。' },
  { id: "store",   label: "通販・お取り寄せ", keys: ["通販", "お取り寄せ", "取り寄せ", "オンライン", "ストア", "送料", "配送", "ギフト", "お土産", "おみやげ"],
    answer: () => "お店の味をご自宅で楽しめる、お取り寄せセットをご用意しています。\n" +
      "・白丸 3食セット　¥2,160\n・赤丸 3食セット　¥2,380\n・食べ比べギフト 6食　¥4,500\n" +
      '税込5,000円以上のご注文で送料無料です。商品は<a href="store.html">オンラインストア</a>からどうぞ。' },
  { id: "recruit", label: "採用について", keys: ["採用", "求人", "バイト", "アルバイト", "パート", "正社員", "働き", "応募", "時給", "給料"],
    answer: () => "現在、次の職種を募集しています。\n" +
      "・店舗スタッフ（正社員）月給25万円〜\n・店長候補（正社員）月給32万円〜\n・アルバイト・パート　時給1,200円〜（深夜25%増）\n" +
      '未経験の方も歓迎です。詳しい内容と応募は<a href="recruit.html">採用情報</a>をご覧ください。' },
];

const GREETING = "いらっしゃいませ。紅一のご案内係です。\nお知りになりたいことを選ぶか、下の欄に入力してください。";
const FALLBACK = `申し訳ありません、その内容はこちらでお答えできません。\nお手数ですが、${CONTACT}。`;

// FAQ式：入力に合う答えをデータから探して返す（AIが使えない時の予備にもなる）
function getFaqAnswer(text) {
  const q = text.trim();

  // 1. アレルギーの質問（原材料名が入っている時）
  const hit = Object.keys(ALLERGEN_WORDS).find(a => ALLERGEN_WORDS[a].some(w => q.includes(w)));
  if (hit && /アレルギ|アレルゲン|入って|使って|含/.test(q)) {
    const yes = MENU.filter(m => m.allergens.includes(hit)).map(m => m.name);
    const no = MENU.filter(m => !m.allergens.includes(hit)).map(m => m.name);
    return { html: `「${hit}」を使っているメニュー：${yes.length ? yes.join("、") : "ありません"}\n` +
      `使っていないメニュー：${no.length ? no.join("、") : "ありません"}\n\n` +
      `同じ厨房で調理しているため、少量が混ざる可能性があります。ご心配な方は店舗スタッフにお声がけください。` };
  }

  // 2. 店舗名が入っている時は、その店舗だけ案内する
  const shop = SHOPS.find(s => s.keys.some(k => q.includes(k)));
  if (shop) {
    const closed = shop.closed === "なし" ? "定休日はありません" : `定休日は${shop.closed}です`;
    return { html: `${shop.name}の営業時間は${shop.hours}で、${closed}。\n` +
      '住所は<a href="shops.html">店舗一覧</a>でご確認いただけます。' };
  }

  // 3. よくある質問から探す
  const faq = FAQ.find(f => f.label === q || f.keys.some(k => q.includes(k)));
  if (faq) return { html: faq.answer() };

  // 4. 見つからない時は推測せず、問い合わせへ案内する
  return { html: FALLBACK };
}

// AIとの会話の履歴（自由入力のやり取りだけ。直近のものを送る）
const history = [];

// AIの答え（ただの文字）を安全に表示できる形にする。
// [店舗一覧](shops.html) のようなサイト内リンクだけをリンクに変える
function formatAiReply(text) {
  return escapeHTML(text)
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\(([a-z0-9-]+\.html)\)/g, '<a href="$2">$1</a>');
}

// 入力に合う答えを返す。選択肢ボタンはFAQ、自由入力はAIに聞く
async function getAnswer(text, { useAi = true } = {}) {
  if (!useAi) return getFaqAnswer(text);
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history: history.slice(-6) }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { reply } = await res.json();
    if (!reply) throw new Error("空の返事");
    history.push({ role: "user", content: text }, { role: "assistant", content: reply });
    return { html: formatAiReply(reply) };
  } catch (err) {
    console.warn("AIに聞けなかったため、FAQ式で答えます:", err);
    return getFaqAnswer(text);
  }
}

// ===== ここから画面（ボタンとパネル） =====
function escapeHTML(s) {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function initChatbot() {
  const fab = document.createElement("button");
  fab.className = "chat-fab";
  fab.setAttribute("aria-label", "チャットで質問する");
  fab.setAttribute("aria-expanded", "false");
  fab.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>';

  const panel = document.createElement("section");
  panel.className = "chat-panel";
  panel.setAttribute("aria-label", "紅一 ご案内チャット");
  panel.innerHTML = `
    <div class="chat-head">
      <span class="logo-mark">紅</span>
      <div><strong>紅一 ご案内</strong><small>AIがご質問にお答えします</small></div>
      <button type="button" aria-label="閉じる">×</button>
    </div>
    <div class="chat-log" aria-live="polite"></div>
    <form class="chat-form">
      <input type="text" placeholder="例：中洲本店は何時まで？" aria-label="質問を入力" maxlength="200">
      <button type="submit">送信</button>
    </form>`;

  document.body.append(fab, panel);
  const log = panel.querySelector(".chat-log");
  const form = panel.querySelector(".chat-form");
  const input = form.querySelector("input");
  let started = false;
  let busy = false; // 返事を待っている間は次の送信を受け付けない

  function add(html, who) {
    const div = document.createElement("div");
    div.className = `chat-msg ${who}`;
    div.innerHTML = html;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  // 選択肢ボタン（最初と、答えのあとに出す）
  function addChoices() {
    log.querySelectorAll(".chat-choices").forEach(c => c.remove());
    const wrap = document.createElement("div");
    wrap.className = "chat-choices";
    FAQ.forEach(f => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = f.label;
      b.addEventListener("click", () => ask(f.label, { useAi: false }));
      wrap.appendChild(b);
    });
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
  }

  async function ask(text, opts) {
    if (!text.trim() || busy) return;
    busy = true;
    add(escapeHTML(text), "user");
    log.querySelectorAll(".chat-choices").forEach(c => c.remove());
    const typing = add("入力中…", "bot typing");
    const res = await getAnswer(text, opts);
    typing.remove();
    add(res.html, "bot");
    addChoices();
    busy = false;
  }

  function toggle(open) {
    panel.classList.toggle("open", open);
    fab.setAttribute("aria-expanded", String(open));
    if (open && !started) {
      started = true;
      add(GREETING, "bot");
      addChoices();
    }
    if (open) input.focus();
  }

  fab.addEventListener("click", () => toggle(!panel.classList.contains("open")));
  panel.querySelector(".chat-head button").addEventListener("click", () => toggle(false));
  document.addEventListener("keydown", e => { if (e.key === "Escape") toggle(false); });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = input.value;
    input.value = "";
    ask(text);
  });
}

// ブラウザでは画面を作る。サーバー（api/chat.js）からはデータだけを読み込む
if (typeof document !== "undefined") initChatbot();
if (typeof module !== "undefined") module.exports = { SHOPS, MENU, FAQ };

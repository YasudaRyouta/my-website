/* ===== 博多らーめん 紅一 共通スクリプト ===== */

// 写真（Unsplash）
const IMG = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

// 全7ページ（英語表記 → ホバーで日本語）
const PAGES = [
  { href: "index.html",   en: "TOP",          ja: "トップ" },
  { href: "news.html",    en: "NEWS",         ja: "お知らせ" },
  { href: "menu.html",    en: "MENU",         ja: "お品書き" },
  { href: "shops.html",   en: "SHOPS",        ja: "店舗一覧" },
  { href: "about.html",   en: "ABOUT",        ja: "紅一について" },
  { href: "recruit.html", en: "RECRUIT",      ja: "採用情報" },
  { href: "store.html",   en: "ONLINE STORE", ja: "オンラインストア" },
];

const SNS = [
  { name: "Facebook", url: "https://www.facebook.com/",
    svg: '<path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4z"/>' },
  { name: "Instagram", url: "https://www.instagram.com/",
    svg: '<path d="M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4.9-8.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM21.9 7.9c-.1-1.6-.4-3-1.6-4.2S17.7 2.2 16.1 2.1C14.5 2 9.5 2 7.9 2.1 6.3 2.2 4.9 2.5 3.7 3.7S2.2 6.3 2.1 7.9C2 9.5 2 14.5 2.1 16.1c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.6.1 6.6.1 8.2 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.6.1-6.6 0-8.2zm-2.1 9.9a3.3 3.3 0 0 1-1.9 1.9c-1.3.5-4.4.4-5.9.4s-4.6.1-5.9-.4a3.3 3.3 0 0 1-1.9-1.9c-.5-1.3-.4-4.4-.4-5.8s-.1-4.6.4-5.9a3.3 3.3 0 0 1 1.9-1.9c1.3-.5 4.4-.4 5.9-.4s4.6-.1 5.9.4a3.3 3.3 0 0 1 1.9 1.9c.5 1.3.4 4.4.4 5.9s.1 4.5-.4 5.8z"/>' },
  { name: "X", url: "https://x.com/",
    svg: '<path d="M17.8 3h3.1l-6.8 7.8 8 10.6h-6.3l-4.9-6.4L5.3 21.4H2.2l7.3-8.3L1.8 3h6.4l4.4 5.9L17.8 3zm-1.1 16.5h1.7L7.4 4.8H5.6l11.1 14.7z"/>' },
  { name: "LINE", url: "https://line.me/",
    svg: '<path d="M12 2.5C6.5 2.5 2 6.1 2 10.6c0 4 3.6 7.4 8.4 8 .3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.6 1.1-.5 5.9-3.5 8.1-6 1.5-1.6 2.2-3.3 2.2-5C22.5 6.1 17.5 2.5 12 2.5zM8.3 13.2H6.3a.5.5 0 0 1-.5-.5V8.8a.5.5 0 0 1 1 0v3.4h1.5a.5.5 0 0 1 0 1zm2.1-.5a.5.5 0 0 1-1 0V8.8a.5.5 0 0 1 1 0v3.9zm4.8 0a.5.5 0 0 1-.9.3l-2-2.7v2.4a.5.5 0 0 1-1 0V8.8a.5.5 0 0 1 .9-.3l2 2.7V8.8a.5.5 0 0 1 1 0v3.9zm3.2-2.5a.5.5 0 0 1 0 1h-1.5v.9h1.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5V8.8c0-.3.2-.5.5-.5h2a.5.5 0 0 1 0 1h-1.5v.9h1.5z"/>' },
];

const LOGO = `
  <span class="logo-mark">紅</span>
  <span class="logo-text"><span class="ja">博多らーめん 紅一</span><br><span class="en">BENIICHI</span></span>`;

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const here = location.pathname.split("/").pop() || "index.html";
  el.className = "site-header";
  el.innerHTML = `
    <div class="header-top">
      <div class="inner">
        <a class="logo" href="index.html" aria-label="博多らーめん 紅一 トップへ">${LOGO}</a>
        <div class="sns">
          ${SNS.map(s => `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}"><svg viewBox="0 0 24 24">${s.svg}</svg></a>`).join("")}
        </div>
      </div>
    </div>
    <nav class="header-nav" aria-label="グローバルナビゲーション">
      <ul>
        ${PAGES.map(p => `
          <li><a href="${p.href}" class="${p.href === here ? "current" : ""}" aria-label="${p.ja}">
            <span class="en">${p.en}</span><span class="ja">${p.ja}</span>
          </a></li>`).join("")}
      </ul>
    </nav>`;
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.className = "site-footer";
  el.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="logo" href="index.html" style="color:#fff">${LOGO}</a>
          <p>一杯の丼に、まっすぐな赤を。<br>博多・中洲で生まれた豚骨らーめんの店です。</p>
        </div>
        <div class="footer-col">
          <h4>SITE MAP</h4>
          <ul>${PAGES.slice(0, 4).map(p => `<li><a href="${p.href}">${p.ja}</a></li>`).join("")}</ul>
        </div>
        <div class="footer-col">
          <h4>&nbsp;</h4>
          <ul>${PAGES.slice(4).map(p => `<li><a href="${p.href}">${p.ja}</a></li>`).join("")}</ul>
        </div>
        <div class="footer-col">
          <h4>FOLLOW US</h4>
          <ul>${SNS.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.name}</a></li>`).join("")}</ul>
        </div>
      </div>
      <p class="copyright">© ${new Date().getFullYear()} BENIICHI Co., Ltd. All Rights Reserved.</p>
    </div>`;
}

// 自動横スクロールのスライダー
function initSlider() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const track = hero.querySelector(".hero-track");
  const slides = track.children;
  const dots = hero.querySelector(".hero-dots");
  const total = slides.length;
  let index = 0;
  let timer;

  for (let i = 0; i < total; i++) {
    const b = document.createElement("button");
    b.setAttribute("aria-label", `${i + 1}枚目へ`);
    b.addEventListener("click", () => { go(i); restart(); });
    dots.appendChild(b);
  }

  function go(i) {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    [...dots.children].forEach((d, n) => d.classList.toggle("active", n === index));
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(index + 1), 4500);
  }

  hero.querySelector(".prev").addEventListener("click", () => { go(index - 1); restart(); });
  hero.querySelector(".next").addEventListener("click", () => { go(index + 1); restart(); });

  // スワイプ対応
  let startX = null;
  hero.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
    startX = null;
  });

  go(0);
  restart();
}

// 背景写真（data-bg に Unsplash の ID）
function applyBackgrounds() {
  document.querySelectorAll("[data-bg]").forEach(el => {
    el.style.backgroundImage = `url(${IMG(el.dataset.bg)})`;
  });
  document.querySelectorAll("img[data-img]").forEach(img => {
    img.src = IMG(img.dataset.img, Number(img.dataset.w) || 800);
  });
}

// 絞り込みボタン（お知らせ・店舗一覧）
function initFilters() {
  document.querySelectorAll("[data-filter-group]").forEach(group => {
    const target = document.getElementById(group.dataset.filterGroup);
    group.addEventListener("click", e => {
      const btn = e.target.closest("button");
      if (!btn) return;
      group.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === btn));
      const key = btn.dataset.key;
      target.querySelectorAll("[data-cat]").forEach(item => {
        item.style.display = key === "all" || item.dataset.cat === key ? "" : "none";
      });
    });
  });
}

// オンラインストアのカート（見本用）
function initCart() {
  const badge = document.querySelector(".cart-badge");
  if (!badge) return;
  let count = 0;
  document.querySelectorAll(".product button").forEach(b => {
    b.addEventListener("click", () => {
      count++;
      badge.textContent = `カート ${count}点`;
      b.textContent = "追加しました";
      setTimeout(() => { b.textContent = "カートに入れる"; }, 1200);
    });
  });
}

renderHeader();
renderFooter();
applyBackgrounds();
initSlider();
initFilters();
initCart();

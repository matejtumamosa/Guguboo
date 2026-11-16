/*
 * GUGUBOO V2 – Albumy spomienok (Samuel 17. 10. 2026, bod 4 plánu „spomienky“).
 * Albumy sa skladajú samy z časovej osi (v2-moments.js): Naše čakanie, 100 dní spolu, Moje prvé, Prvý rok.
 * Mama si album pozrie, vyradí čo nechce a uloží ho ako obrázok (zdieľanie) alebo vytlačí / uloží do PDF.
 * Nič sa neposiela samo; fotky ostávajú v zariadení.
 */
(function initGugubooAlbums() {
  "use strict";

  if (typeof state === "undefined" || !window.GugubooV5) return;

  const V5 = window.GugubooV5;
  const esc = V5.escapeHtml;
  const DAY = 86400000;
  const dayDate = key => new Date(String(key).slice(0, 10) + "T12:00:00");
  const time = value => new Date(String(value).length <= 10 ? value + "T12:00:00" : value).getTime();
  const todayKey = () => { const n = new Date(); return new Date(n.getTime() - n.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
  const FIRST_KEYS = /^(first-|sono$|moves$|tooth$|bath$|check$|vaccine$|letter$)/;

  const ALBUMS = [
    { id: "cakanie", title: "Naše čakanie", emoji: "🤍", subtitle: "Cesta od prvých chvíľ po narodenie", pick: item => item.phase === "pre" },
    { id: "sto", title: "100 dní spolu", emoji: "💯", subtitle: "Prvých sto dní, deň za dňom", unlockDays: 100, pick: (item, birth) => item.phase === "post" && time(item.date) < time(birth) + 100 * DAY },
    { id: "prve", title: "Moje prvé", emoji: "✨", subtitle: "Všetko, čo bolo prvýkrát", pick: item => FIRST_KEYS.test(item.key) },
    { id: "rok", title: "Prvý rok", emoji: "🎂", subtitle: "Náš prvý spoločný rok", unlockDays: 365, pick: (item, birth) => item.phase === "post" && time(item.date) < time(birth) + 366 * DAY }
  ];

  const hidden = id => { state.v5 ||= {}; const all = state.v5.albumHidden ||= {}; return all[id] ||= {}; };
  const birth = () => (state.profile?.status !== "expecting" && state.profile?.birth) || "";
  const daysTogether = () => birth() ? Math.floor((dayDate(todayKey()) - dayDate(birth())) / DAY) + 1 : 0;

  function moments(album, includeHidden = false) {
    const all = window.GugubooMoments?.collect?.() || [];
    const h = hidden(album.id);
    return all.filter(item => album.pick(item, birth()) && (includeHidden || !h[item.key]));
  }

  function locked(album) {
    if (!album.unlockDays) return false;
    return !birth() || daysTogether() < album.unlockDays;
  }

  function dateText(value) {
    const hasTime = String(value).length > 10 && !/T12:00/.test(value);
    const d = new Date(String(value).length <= 10 ? value + "T12:00:00" : value);
    return d.toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" }) + (hasTime ? " o " + d.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" }) : "");
  }

  function listHtml() {
    const rows = ALBUMS.map(album => {
      const isLocked = locked(album);
      const count = moments(album).length;
      const left = album.unlockDays && birth() ? album.unlockDays - daysTogether() : null;
      const sub = isLocked
        ? (birth() ? "Otvorí sa o " + left + (left === 1 ? " deň" : left < 5 ? " dni" : " dní") : "Otvorí sa po narodení")
        : count ? count + (count === 1 ? " spomienka" : count < 5 ? " spomienky" : " spomienok") : "Zatiaľ prázdny – spomienky pribudnú samy";
      return "<button type='button' class='v2-album-row" + (isLocked ? " is-locked" : "") + "' " + (isLocked ? "disabled" : "data-v5-moments-section='album-" + album.id + "'") + "><span class='v2-album-cover' aria-hidden='true'>" + album.emoji + "</span><span><strong>" + esc(album.title) + "</strong><small>" + esc(sub) + "</small></span><b aria-hidden='true'>" + (isLocked ? "🔒" : "›") + "</b></button>";
    }).join("");
    return [
      "<header class='v5-flow-head'><span class='v5-eyebrow'>Naše momenty</span><h1>Albumy</h1><p>Skladajú sa samy z vašich spomienok. Pred uložením si všetko pozrieš a vyradíš, čo nechceš.</p></header>",
      "<div class='v2-album-list'>", rows, "</div>",
      "<button class='v5-secondary' type='button' data-v5-moments-home>Späť</button>"
    ].join("");
  }

  function albumHtml(id) {
    const album = ALBUMS.find(item => item.id === id);
    if (!album || locked(album)) return listHtml();
    const all = moments(album, true);
    const h = hidden(album.id);
    const name = state.profile?.name && !/^(bábätko|pipík)$/i.test(state.profile.name) ? state.profile.name : "";
    return [
      "<section class='v2-album-head'><span aria-hidden='true'>", album.emoji, "</span><h1>", esc(album.title), "</h1><p>", esc(name ? album.subtitle + " · " + name : album.subtitle), "</p></section>",
      all.length ? "<ol class='v2-tl v2-album-tl'>" + all.map(item => [
        "<li class='v2-tl-item", h[item.key] ? " is-hidden" : "", "'><span class='v2-tl-dot' aria-hidden='true'>", item.emoji, "</span><div class='v2-tl-card'>",
        "<label class='v2-album-keep'><input type='checkbox' data-v2-album-keep='", esc(album.id), "' data-key='", esc(item.key), "'", h[item.key] ? "" : " checked", "> V albume</label>",
        "<strong>", esc(item.title), "</strong><small>", esc(dateText(item.date)), "</small>",
        item.text ? "<p>" + esc(item.text) + "</p>" : "",
        item.photo ? "<img src='" + esc(item.photo) + "' alt='' loading='lazy'>" : "",
        "</div></li>"
      ].join("")).join("") + "</ol>" : "<div class='v5-empty'>Album je zatiaľ prázdny. Spomienky sa sem dostanú samy – napríklad keď si v Tehotenskej knižke zapíšeš sono alebo ťukneš na prvý raz.</div>",
      all.length ? "<div class='v2-ann-share'><button type='button' class='v5-primary' data-v2-album-share='" + esc(album.id) + "'>Zdieľať obrázok</button><button type='button' class='v5-secondary' data-v2-album-print='" + esc(album.id) + "'>Vytlačiť / PDF</button></div>" : "",
      all.length ? "<p class='v5-book-note'>Odškrtni, čo do albumu nechceš. Obrázok sa vytvorí len z vybraných spomienok a nikam sa neposiela sám.</p>" : "",
      "<button class='v5-secondary' type='button' data-v5-moments-section='albums'>Všetky albumy</button>"
    ].join("");
  }

  // ——— Obrázok albumu (canvas) ———
  const loadImage = src => new Promise(resolve => { if (!src) return resolve(null); const img = new Image(); img.onload = () => resolve(img); img.onerror = () => resolve(null); img.src = src; });

  function wrap(ctx, text, maxWidth) {
    const words = String(text).split(/\s+/); const lines = []; let line = "";
    words.forEach(word => { const test = line ? line + " " + word : word; if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; } else line = test; });
    if (line) lines.push(line);
    return lines;
  }

  async function albumCanvas(album) {
    const items = moments(album);
    const photos = await Promise.all(items.map(item => loadImage(item.photo)));
    const W = 1080;
    const font = (weight, size) => weight + " " + size + "px Montserrat, 'Segoe UI', Arial, sans-serif";
    const measure = document.createElement("canvas").getContext("2d");
    const rows = items.map((item, index) => {
      measure.font = font(700, 40);
      const titleLines = wrap(measure, item.title, 780);
      measure.font = font(500, 30);
      const textLines = item.text ? wrap(measure, item.text, 780) : [];
      const photo = photos[index];
      const photoH = photo ? Math.round(Math.min(560, 780 * photo.height / photo.width)) : 0;
      return { item, titleLines, textLines, photo, photoH, h: 60 + titleLines.length * 50 + 44 + textLines.length * 40 + (photoH ? photoH + 24 : 0) + 30 };
    });
    const head = 420;
    const H = head + rows.reduce((sum, row) => sum + row.h, 0) + 160;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#f3edff"); grad.addColorStop(1, "#ffefe9");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center";
    ctx.font = "120px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";
    ctx.fillText(album.emoji, W / 2, 170);
    ctx.fillStyle = "#2b2240"; ctx.font = font(800, 84); ctx.fillText(album.title, W / 2, 290);
    const name = state.profile?.name && !/^(bábätko|pipík)$/i.test(state.profile.name) ? state.profile.name : "";
    ctx.fillStyle = "#6a4fc4"; ctx.font = font(600, 34); ctx.fillText(name ? album.subtitle + " · " + name : album.subtitle, W / 2, 350);
    // časová os
    let y = head;
    ctx.strokeStyle = "rgba(117, 96, 181, .25)"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(110, head + 20); ctx.lineTo(110, H - 180); ctx.stroke();
    rows.forEach(row => {
      ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(110, y + 40, 40, 0, Math.PI * 2); ctx.fill();
      ctx.textAlign = "center"; ctx.font = "40px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif"; ctx.fillStyle = "#000"; ctx.fillText(row.item.emoji, 110, y + 54);
      ctx.textAlign = "left";
      let ty = y + 46;
      ctx.fillStyle = "#2b2240"; ctx.font = font(700, 40);
      row.titleLines.forEach(line => { ctx.fillText(line, 190, ty); ty += 50; });
      ctx.fillStyle = "#777184"; ctx.font = font(500, 28); ctx.fillText(dateText(row.item.date), 190, ty - 6); ty += 40;
      ctx.fillStyle = "#3b3350"; ctx.font = font(500, 30);
      row.textLines.forEach(line => { ctx.fillText(line, 190, ty); ty += 40; });
      if (row.photo) {
        ctx.save();
        const x = 190, w = 780, h = row.photoH, r = 24;
        ctx.beginPath(); ctx.moveTo(x + r, ty); ctx.arcTo(x + w, ty, x + w, ty + h, r); ctx.arcTo(x + w, ty + h, x, ty + h, r); ctx.arcTo(x, ty + h, x, ty, r); ctx.arcTo(x, ty, x + w, ty, r); ctx.closePath(); ctx.clip();
        ctx.drawImage(row.photo, x, ty, w, h);
        ctx.restore();
      }
      y += row.h;
    });
    ctx.textAlign = "center"; ctx.fillStyle = "#6a4fc4"; ctx.globalAlpha = .85; ctx.font = font(700, 26);
    ctx.fillText("NAŠE SPOMIENKY  ✦", W / 2, H - 70);
    return canvas;
  }

  async function share(album) {
    const canvas = await albumCanvas(album);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png", 1));
    if (!blob) return V5.announce("Obrázok sa nepodarilo vytvoriť.");
    const file = new File([blob], "guguboo-" + album.id + ".png", { type: "image/png" });
    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) { await navigator.share({ files: [file], title: album.title }); return; }
    } catch (error) { if (error?.name === "AbortError") return; }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = file.name; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    V5.announce("Album sa ukladá ako obrázok.");
  }

  // Tlač / PDF: vytlačí sa len obrázok albumu (systémová tlač ponúkne aj „Uložiť ako PDF“).
  async function print(album) {
    const canvas = await albumCanvas(album);
    let box = document.getElementById("v2AlbumPrint");
    if (!box) { document.body.insertAdjacentHTML("beforeend", "<div id='v2AlbumPrint' aria-hidden='true'></div>"); box = document.getElementById("v2AlbumPrint"); }
    box.innerHTML = "<img alt='' src='" + canvas.toDataURL("image/jpeg", 0.92) + "'>";
    document.body.classList.add("v2-printing-album");
    const done = () => { document.body.classList.remove("v2-printing-album"); window.removeEventListener("afterprint", done); };
    window.addEventListener("afterprint", done);
    setTimeout(() => window.print(), 120);
  }

  document.addEventListener("change", event => {
    const keep = event.target.closest("[data-v2-album-keep]");
    if (!keep) return;
    const h = hidden(keep.dataset.v2AlbumKeep);
    if (keep.checked) delete h[keep.dataset.key]; else h[keep.dataset.key] = true;
    V5.persist();
    keep.closest(".v2-tl-item")?.classList.toggle("is-hidden", !keep.checked);
  });
  document.addEventListener("click", event => {
    const shareBtn = event.target.closest("[data-v2-album-share]");
    if (shareBtn) return void share(ALBUMS.find(item => item.id === shareBtn.dataset.v2AlbumShare));
    const printBtn = event.target.closest("[data-v2-album-print]");
    if (printBtn) return void print(ALBUMS.find(item => item.id === printBtn.dataset.v2AlbumPrint));
    const open = event.target.closest("[data-v2-album-open]");
    if (open) {
      V5.openFeature("memories");
      state.v5.momentsSection = "album-" + open.dataset.v2AlbumOpen;
      V5.persist();
      V5.rerenderMoments?.();
    }
  });

  function sectionHtml(section) {
    if (section === "albums") return listHtml();
    if (String(section).startsWith("album-")) return albumHtml(String(section).slice(6));
    return "";
  }

  window.GugubooAlbums = { sectionHtml, canvas: id => albumCanvas(ALBUMS.find(item => item.id === id)), count: id => { const album = ALBUMS.find(item => item.id === id); return album ? moments(album).length : 0; }, locked: id => locked(ALBUMS.find(item => item.id === id)) };
})();

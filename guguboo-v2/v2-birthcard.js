/*
 * GUGUBOO V2 – nová kartička narodenia (Samuel 4. 11. 2026). Dvojička kartičky „Oznámiť tehotenstvo“:
 * náhľad hore, pod ním len ťukacie voľby – vzor, farba, fotka/nôžky, nadpis, čo ukázať, formát.
 * Údaje sa berú z narodenia (state.profile), nič sa nepíše dvakrát. Znamenie je len voliteľný fakt
 * odvodený z dátumu (žiadne texty o povahe), predvolene vypnuté. Fotka sa neukladá, je len v pamäti.
 */
(function initGugubooBirthCard() {
  "use strict";

  if (typeof state === "undefined" || !window.GugubooV5) return;

  const V5 = window.GugubooV5;
  const esc = V5.escapeHtml;
  const byId = id => document.getElementById(id);

  const PATTERNS = { soft: "Jemný", frame: "Rámik", dots: "Bodky", stars: "Hviezdy" };
  const COLORS = {
    lavender: { label: "Levanduľa", bg: ["#f3edff", "#ffe9e2"], accent: "#6a4fc4", ink: "#2b2240" },
    rose: { label: "Ružová", bg: ["#fff0f3", "#ffe6ea"], accent: "#d5617f", ink: "#3a2430" },
    peach: { label: "Broskyňa", bg: ["#fff6ee", "#ffe9d9"], accent: "#c07a45", ink: "#3a2c22" },
    mint: { label: "Mäta", bg: ["#eefaf5", "#e2f3ef"], accent: "#3f9a83", ink: "#1f3a33" },
    sky: { label: "Nebo", bg: ["#eef5ff", "#e6eefc"], accent: "#4f78c4", ink: "#1f2b45" }
  };
  const SIGNS = [
    ["♑", "Kozorožec", 119], ["♒", "Vodnár", 218], ["♓", "Ryby", 320], ["♈", "Baran", 419], ["♉", "Býk", 520], ["♊", "Blíženci", 620],
    ["♋", "Rak", 722], ["♌", "Lev", 822], ["♍", "Panna", 922], ["♎", "Váhy", 1022], ["♏", "Škorpión", 1121], ["♐", "Strelec", 1221], ["♑", "Kozorožec", 1231]
  ];

  let photo = null;
  let photoUrl = "";
  let busy = false;

  const profile = () => state.profile || {};
  function settings() {
    state.v5 ||= {};
    const s = state.v5.birthCardV2 ||= {};
    s.pattern ||= "soft";
    s.color ||= "lavender";
    s.mode ||= profile().photo ? "photo" : "feet";
    if (s.headline === undefined) s.headline = "Vitaj na svete";
    s.format ||= "square";
    s.show ||= { time: true, weight: true, height: true, place: false, sign: false };
    if (s.show.parents === undefined) s.show.parents = true;
    if (s.show.message === undefined) s.show.message = true;
    // Mená rodičov sa predvyplnia z profilu mamy (dajú sa prepísať).
    if (s.parents === undefined) s.parents = (state.v5?.motherProfile?.preferredName || state.v5?.motherProfile?.name || state.user?.name || "").trim();
    return s;
  }
  const headlines = () => {
    const sex = profile().sex;
    return ["Vitaj na svete", "Je tu!", sex === "girl" ? "Narodila sa nám" : sex === "boy" ? "Narodil sa nám" : "Narodilo sa nám bábätko", "Sme traja"];
  };
  function sign(dateKey) {
    if (!dateKey) return null;
    const d = new Date(dateKey + "T12:00:00");
    const md = (d.getMonth() + 1) * 100 + d.getDate();
    return SIGNS.find(item => md <= item[2]) || SIGNS[0];
  }
  const babyName = () => { const n = profile().name || ""; return /^(bábätko|babatko|pipík)$/i.test(n) ? "" : n; };

  function wrap(ctx, text, maxWidth) {
    const words = String(text).split(/\s+/); const lines = []; let line = "";
    words.forEach(word => { const test = line ? line + " " + word : word; if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; } else line = test; });
    if (line) lines.push(line);
    return lines;
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function star(ctx, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 8; i += 1) { const a = i * Math.PI / 4; const rr = i % 2 ? r * 0.38 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    ctx.closePath(); ctx.fill();
  }
  function drawFeet(ctx, cx, cy, r, color) {
    const foot = (x, y, angle, mirror) => {
      const s = r / 170;
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(mirror ? -s : s, s); ctx.fillStyle = color;
      ctx.beginPath(); ctx.moveTo(0, -52); ctx.bezierCurveTo(30, -54, 40, -20, 34, 10); ctx.bezierCurveTo(30, 34, 26, 58, 6, 66); ctx.bezierCurveTo(-14, 72, -26, 56, -24, 34); ctx.bezierCurveTo(-22, 14, -36, -6, -32, -28); ctx.bezierCurveTo(-28, -46, -16, -52, 0, -52); ctx.fill();
      [[-20, -72, 13], [2, -80, 10.5], [20, -76, 9], [33, -66, 7.5], [41, -52, 6.5]].forEach(([tx, ty, tr]) => { ctx.beginPath(); ctx.arc(tx, ty, tr, 0, Math.PI * 2); ctx.fill(); });
      ctx.restore();
    };
    ctx.save(); ctx.globalAlpha = 0.82;
    foot(cx - r * 0.24, cy + r * 0.1, -0.18, true);
    foot(cx + r * 0.24, cy - r * 0.08, 0.18, false);
    ctx.restore();
  }

  function facts() {
    const s = settings();
    const p = profile();
    const list = [];
    if (p.birth) {
      const date = new Date(p.birth + "T12:00:00").toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" });
      list.push(date + (s.show.time && p.birthTime ? " · " + p.birthTime : ""));
    }
    // Váha a dĺžka môžu byť uložené ako „3450“ (úvod) alebo „3450 g“ (formulár narodenia) – zjednotiť.
    const unit = (value, suffix) => {
      const raw = String(value || "").trim().replace(/s*(g|cm)$/i, "");
      if (!raw) return "";
      if (/^[\d\s.,]+$/.test(raw)) { const n = Number(raw.replace(/\s/g, "").replace(",", ".")); return (suffix === "g" ? n.toLocaleString("sk-SK") : String(n).replace(".", ",")) + " " + suffix; }
      return raw;
    };
    const measures = [s.show.weight ? unit(p.weight, "g") : "", s.show.height ? unit(p.height, "cm") : ""].filter(Boolean).join(" · ");
    if (measures) list.push(measures);
    if (s.show.place && p.birthPlace) list.push(p.birthPlace);
    if (s.show.parents && s.parents) list.push(s.parents);
    const z = s.show.sign ? sign(p.birth) : null;
    // ︎ = textová (nie emoji) podoba symbolu, aby mal farbu kartičky.
    if (z) list.push(z[0] + "︎ " + z[1]);
    return list;
  }

  function draw(canvas) {
    const s = settings();
    const c = COLORS[s.color] || COLORS.lavender;
    const story = s.format === "story";
    const W = 1080;
    const H = story ? 1920 : 1080;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    const font = (weight, size) => weight + " " + size + "px Montserrat, 'Segoe UI', Arial, sans-serif";
    const k = story ? 1.25 : 1;

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, c.bg[0]); grad.addColorStop(1, c.bg[1]);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    // Vzory
    ctx.save();
    ctx.fillStyle = c.accent;
    if (s.pattern === "soft") {
      ctx.globalAlpha = 0.16;
      [[W * 0.9, H * 0.1, 230], [W * 0.08, H * 0.88, 270]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); });
    } else if (s.pattern === "frame") {
      ctx.strokeStyle = c.accent; ctx.globalAlpha = 0.45; ctx.lineWidth = 3;
      roundRect(ctx, 44, 44, W - 88, H - 88, 38); ctx.stroke();
      ctx.globalAlpha = 0.6; [[84, 84], [W - 84, 84], [84, H - 84], [W - 84, H - 84]].forEach(([x, y]) => star(ctx, x, y, 14));
    } else if (s.pattern === "dots") {
      ctx.globalAlpha = 0.18;
      for (let i = 0; i < 70; i += 1) { const x = (i * 197) % W; const y = (i * 131 + (i % 7) * 61) % H; ctx.beginPath(); ctx.arc(x, y, 6 + (i % 4) * 4, 0, Math.PI * 2); ctx.fill(); }
    } else if (s.pattern === "stars") {
      ctx.globalAlpha = 0.28;
      for (let i = 0; i < 34; i += 1) { const x = (i * 233 + 40) % W; const y = (i * 157 + (i % 5) * 83) % H; star(ctx, x, y, 8 + (i % 3) * 6); }
    }
    ctx.restore();

    const hasPhoto = s.mode === "photo" && photo;
    const headSize = Math.round(84 * k);
    ctx.font = font(800, headSize);
    const head = wrap(ctx, s.headline || "Vitaj na svete", W - 160);
    const name = babyName();
    const list = facts();
    // Krátky odkaz (napr. „Ďakujeme za lásku“) kurzívou pod údajmi.
    ctx.font = "italic 500 " + Math.round(34 * k) + "px Montserrat, 'Segoe UI', Arial, sans-serif";
    const msg = s.show.message && s.message ? wrap(ctx, s.message, W - 220).slice(0, 3) : [];
    const msgH = msg.length ? msg.length * Math.round(48 * k) + Math.round(30 * k) : 0;
    let art = hasPhoto ? { w: story ? 760 : 520, h: story ? 760 : 420 } : { w: (story ? 280 : 150) * 2, h: (story ? 280 : 150) * 2 };
    const blocks = art.h + 60 + head.length * headSize * 1.12 + (name ? Math.round(110 * k) : 0) + list.length * Math.round(58 * k) + msgH + 20;
    const room = H - (story ? 420 : 160);
    if (blocks > room) { const shrink = Math.min(art.h - 200, blocks - room); art = { w: hasPhoto ? art.w : art.h - shrink, h: art.h - shrink }; }
    const total = art.h + 60 + head.length * headSize * 1.12 + (name ? Math.round(110 * k) : 0) + list.length * Math.round(58 * k) + msgH;
    let y = Math.max(story ? 150 : 60, (H - (story ? 150 : 90) - total) / 2);

    const boxX = (W - art.w) / 2;
    if (hasPhoto) {
      const scale = Math.max(art.w / photo.width, art.h / photo.height);
      const dw = art.w / scale, dh = art.h / scale;
      ctx.save(); ctx.shadowColor = "rgba(60, 40, 120, .18)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14; ctx.fillStyle = "#fff";
      roundRect(ctx, boxX - 14, y - 14, art.w + 28, art.h + 28, 42); ctx.fill(); ctx.restore();
      ctx.save(); roundRect(ctx, boxX, y, art.w, art.h, 30); ctx.clip();
      ctx.drawImage(photo, (photo.width - dw) / 2, (photo.height - dh) / 2, dw, dh, boxX, y, art.w, art.h); ctx.restore();
    } else {
      const r = art.h / 2;
      ctx.save(); ctx.shadowColor = "rgba(60, 40, 120, .16)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 12; ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(W / 2, y + r, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      drawFeet(ctx, W / 2, y + r, r, c.accent);
    }
    y += art.h + 60;

    ctx.textAlign = "center";
    ctx.fillStyle = c.ink; ctx.font = font(800, headSize);
    head.forEach(line => { y += headSize * 0.92; ctx.fillText(line, W / 2, y); y += headSize * 0.2; });
    if (name) { y += Math.round(92 * k); ctx.fillStyle = c.accent; ctx.font = font(800, Math.round(76 * k)); ctx.fillText(name, W / 2, y); }
    ctx.fillStyle = c.ink; ctx.globalAlpha = 0.82; ctx.font = font(600, Math.round(38 * k));
    list.forEach((line, index) => { y += Math.round((index ? 54 : 70) * k); ctx.fillText(line, W / 2, y); });
    if (msg.length) { y += Math.round(30 * k); ctx.globalAlpha = 0.9; ctx.fillStyle = c.accent; ctx.font = "italic 500 " + Math.round(34 * k) + "px Montserrat, 'Segoe UI', Arial, sans-serif"; msg.forEach(line => { y += Math.round(48 * k); ctx.fillText(line, W / 2, y); }); }
    ctx.globalAlpha = 0.85; ctx.fillStyle = c.accent; ctx.font = font(700, Math.round(24 * k));
    ctx.fillText("MALÝ ZÁZRAK  ✦  VEĽKÁ LÁSKA", W / 2, H - (story ? 100 : 54));
    ctx.globalAlpha = 1;
  }

  function render() {
    const target = byId("v5CardsContent");
    if (!target) return;
    const s = settings();
    const p = profile();
    const chip = (attr, value, label, active) => "<button type='button' class='v2-ann-chip" + (active ? " is-active" : "") + "' " + attr + "='" + esc(value) + "' aria-pressed='" + active + "'>" + esc(label) + "</button>";
    const swatch = (key, item) => "<button type='button' class='v2-bc-swatch" + (s.color === key ? " is-active" : "") + "' data-v2-bc-color='" + key + "' aria-label='" + esc(item.label) + "' aria-pressed='" + (s.color === key) + "' style='--sw1:" + item.bg[0] + ";--sw2:" + item.accent + "'></button>";
    const toggle = (key, label) => chip("data-v2-bc-show", key, (s.show[key] ? "✓ " : "") + label, Boolean(s.show[key]));
    // Údaje na pamiatku – predvyplnené z narodenia; meno, dátum, čas, váha, dĺžka a miesto sa ukladajú aj do profilu dieťaťa.
    const field = (key, label, value, attrs = "") => "<label>" + esc(label) + "<input data-v2-bc-field='" + key + "' value='" + esc(value || "") + "' " + attrs + "></label>";
    const custom = !headlines().includes(s.headline);
    target.innerHTML = [
      "<div class='v2-ann-preview'><canvas id='v2BcCanvas' aria-label='Náhľad kartičky narodenia'></canvas></div>",
      "<div class='v2-ann-share v2-bc-share'><button type='button' class='v5-primary' data-v2-bc-share>Zdieľať</button><button type='button' class='v5-secondary' data-v2-bc-download>Obrázok</button><button type='button' class='v5-secondary' data-v2-bc-pdf>PDF</button></div>",
      "<section class='v5-form-card v2-ann-form v2-bc-form'>",
      "<h3>Vzor</h3><div class='v2-ann-chips'>", Object.entries(PATTERNS).map(([key, label]) => chip("data-v2-bc-pattern", key, label, s.pattern === key)).join(""), "</div>",
      "<h3>Farba</h3><div class='v2-bc-swatches'>", Object.entries(COLORS).map(([key, item]) => swatch(key, item)).join(""), "</div>",
      "<h3>Obrázok</h3><div class='v2-ann-chips'>", chip("data-v2-bc-mode", "photo", "Fotka", s.mode === "photo"), chip("data-v2-bc-mode", "feet", "Nôžky", s.mode === "feet"), "</div>",
      s.mode === "photo" ? "<label class='v2-photo-pick'><input type='file' accept='image/*' data-v2-bc-photo><span>" + (photo ? "Iná fotka" : "Vybrať fotku") + "</span></label>" : "",
      "<h3>Nadpis</h3><div class='v2-ann-chips'>", headlines().map(text => chip("data-v2-bc-headline", text, text, s.headline === text)).join(""), chip("data-v2-bc-headline", "__custom", "Vlastný", custom), "</div>",
      custom ? field("headline", "Vlastný nadpis", s.headline, "maxlength='40' placeholder='napr. Naše malé šťastie'") : "",
      "<h3>Údaje</h3><div class='v2-bc-fields'>",
      field("name", "Meno", babyName(), "maxlength='30'"),
      field("birth", "Dátum", p.birth, "type='date'"),
      field("birthTime", "Čas", p.birthTime, "type='time'"),
      field("weight", "Váha (g)", String(p.weight || "").replace(/[^\d]/g, ""), "inputmode='numeric' maxlength='5' placeholder='3450'"),
      field("height", "Dĺžka (cm)", String(p.height || "").replace(/[^\d,.]/g, ""), "inputmode='decimal' maxlength='4' placeholder='51'"),
      field("birthPlace", "Miesto", p.birthPlace, "maxlength='40' placeholder='napr. Bratislava'"),
      field("parents", "Rodičia", s.parents, "maxlength='50' placeholder='napr. Petra a Martin'"),
      field("message", "Odkaz", s.message, "maxlength='80' placeholder='napr. Ďakujeme za všetku lásku'"),
      "</div>",
      "<h3>Ukázať</h3><div class='v2-ann-chips'>",
      toggle("time", "Čas"), toggle("weight", "Váha"), toggle("height", "Dĺžka"), toggle("place", "Miesto"), toggle("parents", "Rodičia"), toggle("message", "Odkaz"), toggle("sign", "Znamenie"),
      "</div>",
      "<h3>Formát</h3><div class='v2-ann-chips'>", chip("data-v2-bc-format", "square", "Štvorec", s.format === "square"), chip("data-v2-bc-format", "story", "Na výšku", s.format === "story"), "</div>",
      "</section>"
    ].join("");
    redraw();
  }
  function redraw() { const canvas = byId("v2BcCanvas"); if (canvas) draw(canvas); }
  function blob() { const canvas = document.createElement("canvas"); draw(canvas); return new Promise(resolve => canvas.toBlob(resolve, "image/png", 1)); }

  // Hotová kartička: odfajkne sa úloha v kruhu a do časovej osi sa uloží spomienka s malým náhľadom.
  function markDone() {
    state.birthCard ||= {};
    state.birthCard.complete = true;
    const m = (state.v5.momentMarks ||= {});
    if (!m.birthCard) {
      m.birthCard = new Date().toISOString();
      try {
        const big = document.createElement("canvas"); draw(big);
        const small = document.createElement("canvas"); small.width = 360; small.height = Math.round(360 * big.height / big.width);
        small.getContext("2d").drawImage(big, 0, 0, small.width, small.height);
        m.birthCardImg = small.toDataURL("image/jpeg", 0.8);
      } catch (_) {}
    }
    V5.persist();
  }

  async function share() {
    if (busy) return;
    busy = true;
    try {
      const data = await blob();
      const file = data ? new File([data], "guguboo-kartička-narodenia.png", { type: "image/png" }) : null;
      if (file && navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({ files: [file], title: settings().headline });
        markDone();
        return V5.announce("Kartička je pripravená na zdieľanie.");
      }
      await download();
    } catch (error) {
      if (!error || error.name !== "AbortError") V5.announce("Zdieľanie sa nepodarilo – ulož obrázok a pošli ho.");
    } finally { busy = false; }
  }
  async function download() {
    const data = await blob();
    if (!data) return V5.announce("Obrázok sa nepodarilo vytvoriť.");
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url; link.download = "guguboo-karticka-narodenia.png"; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    markDone();
    V5.announce("Kartička sa ukladá.");
  }

  document.addEventListener("click", event => {
    const s = settings();
    const set = (selector, key) => {
      const el = event.target.closest(selector);
      if (!el) return false;
      const value = el.getAttribute(selector.slice(1, -1));
      // „Vlastný“ nadpis: ponechá doterajší vlastný text, inak začne prázdnym poľom.
      s[key] = key === "headline" && value === "__custom" ? (headlines().includes(s.headline) ? "" : s.headline) : value;
      V5.persist();
      render();
      return true;
    };
    if (set("[data-v2-bc-pattern]", "pattern") || set("[data-v2-bc-color]", "color") || set("[data-v2-bc-mode]", "mode") || set("[data-v2-bc-headline]", "headline") || set("[data-v2-bc-format]", "format")) return;
    if (event.target.closest("[data-v2-bc-pdf]")) return void pdf();
    const show = event.target.closest("[data-v2-bc-show]");
    if (show) { s.show[show.dataset.v2BcShow] = !s.show[show.dataset.v2BcShow]; V5.persist(); return render(); }
    if (event.target.closest("[data-v2-bc-share]")) return void share();
    if (event.target.closest("[data-v2-bc-download]")) return void download();
  });
  document.addEventListener("change", event => {
    const input = event.target.closest("[data-v2-bc-photo]");
    if (!input?.files?.[0]) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    photoUrl = URL.createObjectURL(input.files[0]);
    const img = new Image();
    img.onload = () => { photo = img; render(); };
    img.src = photoUrl;
  });

  // Úpravy údajov: náhľad sa prekreslí hneď (bez straty kurzora). Údaje dieťaťa sa ukladajú do profilu,
  // aby boli všade rovnaké; nadpis, rodičia a odkaz patria len kartičke.
  document.addEventListener("input", event => {
    const input = event.target.closest("[data-v2-bc-field]");
    if (!input) return;
    const key = input.dataset.v2BcField;
    const value = input.value.trim();
    const s = settings();
    const p = (state.profile ||= {});
    if (key === "headline" || key === "parents" || key === "message") s[key] = input.value;
    else if (key === "weight") p.weight = value ? value.replace(/[^\d]/g, "") + " g" : "";
    else if (key === "height") p.height = value ? value.replace(/[^\d,.]/g, "") + " cm" : "";
    else if (key === "name") p.name = value || p.name;
    else p[key] = value;
    V5.persist();
    redraw();
  });

  // PDF: systémová tlač s obrázkom kartičky („Uložiť ako PDF“ ponúkne telefón aj počítač).
  function pdf() {
    const canvas = document.createElement("canvas");
    draw(canvas);
    let box = document.getElementById("v2AlbumPrint");
    if (!box) { document.body.insertAdjacentHTML("beforeend", "<div id='v2AlbumPrint' aria-hidden='true'></div>"); box = document.getElementById("v2AlbumPrint"); }
    box.innerHTML = "<img alt='' src='" + canvas.toDataURL("image/jpeg", 0.95) + "'>";
    document.body.classList.add("v2-printing-album");
    const done = () => { document.body.classList.remove("v2-printing-album"); window.removeEventListener("afterprint", done); };
    window.addEventListener("afterprint", done);
    markDone();
    setTimeout(() => window.print(), 120);
  }

  // Fotka z profilu dieťaťa sa použije sama (ak je).
  function prepare() {
    if (!photo && profile().photo) {
      const img = new Image();
      img.onload = () => { photo = img; redraw(); };
      img.src = profile().photo;
    }
    render();
  }

  window.GugubooBirthCard = { render: prepare };
})();

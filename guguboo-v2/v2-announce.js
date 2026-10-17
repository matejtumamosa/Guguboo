/*
 * GUGUBOO V2 – Kartička „Oznámiť tehotenstvo“ (Samuel 16. 10. 2026). Dvojička kartičky narodenia:
 * obe sú jednorazové úlohy v kruhu (Príprava → Vybaviť, Organizácia → Rodina) a po vytvorení sa samy odfajknú.
 * Fotka: ultrazvuk (s orezaním údajov o pacientke), bruško/pár, alebo bez fotky (kresba bábätkovských nôžok).
 * Termín len ako mesiac a rok (súkromie). Fotka sa NEUKLADÁ – je len v pamäti, kým je okno otvorené.
 * Zdieľanie cez systémové menu telefónu; appka nič neposiela sama.
 */
(function initGugubooAnnounce() {
  "use strict";

  if (typeof state === "undefined" || !window.GugubooV5) return;

  const V5 = window.GugubooV5;
  const esc = V5.escapeHtml;
  const byId = id => document.getElementById(id);

  const HEADLINES = [
    "Čakáme bábätko",
    "Bude nás o jedného viac",
    "Budete starí rodičia",
    "Budem starší brat",
    "Budem staršia sestra"
  ];
  const TEMPLATES = {
    soft: { label: "Jemná", bg: ["#f3edff", "#ffe9e2"], ink: "#2b2240", accent: "#6a4fc4", frame: "#ffffff" },
    cream: { label: "Klasická", bg: ["#fffaf3", "#fdf3e7"], ink: "#3a2f28", accent: "#b7835a", frame: "#ffffff" },
    play: { label: "Hravá", bg: ["#e9f6ff", "#fff1f6"], ink: "#23304a", accent: "#e0708f", frame: "#ffffff" }
  };

  let photo = null; // Image – len v pamäti
  let photoUrl = "";
  let busy = false;

  function settings() {
    state.v5 ||= {};
    const s = state.v5.announce ||= {};
    s.template ||= "soft";
    if (s.headline === undefined) s.headline = HEADLINES[0];
    s.mode ||= "none";
    s.format ||= "square";
    if (s.cropTop === undefined) s.cropTop = 15;
    if (s.cropBottom === undefined) s.cropBottom = 8;
    if (s.showWeek === undefined) s.showWeek = false;
    return s;
  }

  function currentWeek() {
    return Number(window.GugubooPregnancyAvatar?.current?.().week || 0);
  }

  function dueMonth() {
    if (!state.profile?.due) return "";
    const text = new Date(state.profile.due + "T12:00:00").toLocaleDateString("sk-SK", { month: "long", year: "numeric" });
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function wrap(ctx, text, maxWidth) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let line = "";
    words.forEach(word => {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; } else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Dve malé nôžky v kruhu: chodidlo (zaoblený tvar) + 5 prštekov, ľavá trochu nižšie.
  function drawFeet(ctx, cx, cy, r, color) {
    const foot = (x, y, angle, mirror) => {
      const s = r / 170;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(mirror ? -s : s, s);
      ctx.fillStyle = color;
      // chodidlo: širšie vpredu, užšia päta
      ctx.beginPath();
      ctx.moveTo(0, -52);
      ctx.bezierCurveTo(30, -54, 40, -20, 34, 10);
      ctx.bezierCurveTo(30, 34, 26, 58, 6, 66);
      ctx.bezierCurveTo(-14, 72, -26, 56, -24, 34);
      ctx.bezierCurveTo(-22, 14, -36, -6, -32, -28);
      ctx.bezierCurveTo(-28, -46, -16, -52, 0, -52);
      ctx.fill();
      // prštek od palca po malíček
      [[-20, -72, 13], [2, -80, 10.5], [20, -76, 9], [33, -66, 7.5], [41, -52, 6.5]].forEach(([tx, ty, tr]) => {
        ctx.beginPath(); ctx.arc(tx, ty, tr, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
    };
    ctx.save();
    ctx.globalAlpha = 0.82;
    foot(cx - r * 0.24, cy + r * 0.1, -0.18, true);
    foot(cx + r * 0.24, cy - r * 0.08, 0.18, false);
    ctx.restore();
  }

  // Nakreslí kartičku. Rovnaká funkcia pre náhľad aj zdieľaný obrázok.
  function draw(canvas) {
    const s = settings();
    const t = TEMPLATES[s.template] || TEMPLATES.soft;
    const W = 1080;
    const H = s.format === "story" ? 1920 : 1080;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    const font = (weight, size) => weight + " " + size + "px Montserrat, 'Segoe UI', Arial, sans-serif";

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, t.bg[0]);
    grad.addColorStop(1, t.bg[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    // Jemné kruhy v pozadí (ako na domove)
    ctx.globalAlpha = s.template === "play" ? 0.35 : 0.22;
    [[W * 0.88, H * 0.12, 220, t.accent], [W * 0.1, H * 0.86, 260, t.accent]].forEach(([x, y, r, c]) => {
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (s.template === "cream") {
      ctx.strokeStyle = t.accent; ctx.globalAlpha = 0.5; ctx.lineWidth = 3;
      roundRect(ctx, 40, 40, W - 80, H - 80, 36); ctx.stroke(); ctx.globalAlpha = 1;
    }

    const story = s.format === "story";
    const hasPhoto = s.mode !== "none" && photo;
    const k = story ? 1.25 : 1; // väčšie písmo pri formáte na výšku

    // 1) Pripraviť texty a zmerať výšku celého obsahu, aby bol vycentrovaný.
    ctx.font = font(800, Math.round(104 * k));
    const headLines = wrap(ctx, s.headline || HEADLINES[0], W - 150);
    const extras = [];
    const month = dueMonth();
    if (s.showWeek && currentWeek()) extras.push(currentWeek() + ". týždeň");
    if (s.sex) extras.push(s.sex);
    if (s.babyName) extras.push(s.babyName);
    let art = hasPhoto
      ? { w: story ? 820 : 600, h: story ? 820 : 440 }
      : { w: (story ? 300 : 170) * 2, h: (story ? 300 : 170) * 2 };
    const gapArt = Math.round(70 * k);
    const headLH = Math.round(116 * k);
    const blocks = [
      art.h, gapArt,
      headLines.length * headLH,
      month ? Math.round(130 * k) : 0,
      extras.length * Math.round(66 * k),
      s.parents ? Math.round(80 * k) : 0
    ];
    let total = blocks.reduce((sum, value) => sum + value, 0);
    const footer = story ? 150 : 90;
    // Veľa obsahu (fotka + dlhý nadpis + mená): zmenši obrázok, aby nič neprekrývalo spodný riadok.
    const room = H - footer - (story ? 240 : 140);
    if (total > room) {
      const shrink = Math.min(art.h - 220, total - room);
      art.h -= shrink;
      if (!hasPhoto) art.w = art.h;
      else art.w = Math.min(art.w, Math.round(art.h * 1.36));
      total -= shrink;
    }
    let y = Math.max(story ? 140 : 60, (H - footer - total) / 2);

    // 2) Obrázok alebo ilustrácia
    const boxX = (W - art.w) / 2;
    if (hasPhoto) {
      // Ultrazvuk: orež hornú a dolnú časť (meno, nemocnica, dátum, číslo pacientky).
      const top = s.mode === "ultrasound" ? photo.height * (s.cropTop / 100) : 0;
      const bottom = s.mode === "ultrasound" ? photo.height * (s.cropBottom / 100) : 0;
      const sw = photo.width;
      const sh = Math.max(1, photo.height - top - bottom);
      const scale = Math.max(art.w / sw, art.h / sh);
      const dw = art.w / scale;
      const dh = art.h / scale;
      ctx.save();
      ctx.shadowColor = "rgba(60, 40, 120, .18)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14;
      ctx.fillStyle = t.frame;
      roundRect(ctx, boxX - 14, y - 14, art.w + 28, art.h + 28, 42); ctx.fill();
      ctx.restore();
      ctx.save();
      roundRect(ctx, boxX, y, art.w, art.h, 30); ctx.clip();
      ctx.drawImage(photo, (sw - dw) / 2, top + (sh - dh) / 2, dw, dh, boxX, y, art.w, art.h);
      ctx.restore();
    } else {
      const r = art.w / 2;
      const cx = W / 2;
      const cy = y + r;
      ctx.save();
      ctx.shadowColor = "rgba(60, 40, 120, .16)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 12;
      ctx.fillStyle = t.frame; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      // Bábätkovské nôžky (Samuel 17. 10.: namiesto ovocia pekný symbol bábätka) – kresba, nie emoji,
      // aby vyzerala rovnako na každom telefóne. Ladí s „Krok za krokom – nôžka za nôžkou“.
      drawFeet(ctx, cx, cy, r, t.accent);
    }
    y += art.h + gapArt;

    // 3) Texty
    ctx.textAlign = "center";
    ctx.fillStyle = t.ink;
    ctx.font = font(800, Math.round(104 * k));
    headLines.forEach(line => { y += headLH * 0.82; ctx.fillText(line, W / 2, y); y += headLH * 0.18; });
    if (month) {
      y += Math.round(72 * k);
      ctx.fillStyle = t.accent; ctx.font = font(800, Math.round(28 * k));
      ctx.fillText("P R Í C H O D", W / 2, y);
      y += Math.round(58 * k);
      ctx.font = font(700, Math.round(54 * k));
      ctx.fillText(month, W / 2, y);
    }
    extras.forEach(value => {
      y += Math.round(66 * k);
      ctx.fillStyle = t.accent; ctx.font = font(600, Math.round(44 * k));
      ctx.fillText(value, W / 2, y);
    });
    if (s.parents) {
      y += Math.round(80 * k);
      ctx.fillStyle = t.ink; ctx.globalAlpha = 0.75; ctx.font = font(500, Math.round(40 * k));
      ctx.fillText(s.parents, W / 2, y); ctx.globalAlpha = 1;
    }
    ctx.fillStyle = t.accent; ctx.globalAlpha = 0.85; ctx.font = font(700, Math.round(26 * k));
    ctx.fillText("MALÝ ZÁZRAK NA CESTE  ✦", W / 2, H - (story ? 100 : 54));
    ctx.globalAlpha = 1;
  }

  function render() {
    const target = byId("v5AnnounceContent");
    if (!target) return;
    const s = settings();
    const chip = (attr, value, label, active) => "<button type='button' class='v2-ann-chip" + (active ? " is-active" : "") + "' " + attr + "='" + esc(value) + "' aria-pressed='" + active + "'>" + esc(label) + "</button>";
    const customHeadline = !HEADLINES.includes(s.headline);
    target.innerHTML = [
      "<p class='v2-ann-intro'>Vytvor kartičku pre blízkych a pošli ju, komu chceš.</p>",
      "<div class='v2-ann-preview'><canvas id='v2AnnCanvas' aria-label='Náhľad kartičky'></canvas></div>",
      "<div class='v2-ann-share'><button type='button' class='v5-primary' data-v2-ann-share>Zdieľať</button><button type='button' class='v5-secondary' data-v2-ann-download>Uložiť obrázok</button></div>",
      "<section class='v5-form-card v2-ann-form'>",
      "<h3>Fotka</h3><div class='v2-ann-chips'>",
      chip("data-v2-ann-mode", "ultrasound", "Ultrazvuk", s.mode === "ultrasound"),
      chip("data-v2-ann-mode", "photo", "Fotka brucha / páru", s.mode === "photo"),
      chip("data-v2-ann-mode", "none", "Bez fotky", s.mode === "none"),
      "</div>",
      s.mode !== "none" ? "<label class='v2-photo-pick'><input type='file' accept='image/*' data-v2-ann-photo><span>" + (photo ? "Vybrať inú fotku" : (s.mode === "ultrasound" ? "Odfotiť alebo vybrať snímku" : "Odfotiť alebo vybrať fotku")) + "</span></label>" : "",
      s.mode === "ultrasound" ? [
        "<div class='v2-calm-box v2-ann-privacy'><strong>Skontroluj údaje na snímke</strong><p>Na ultrazvuku býva meno, nemocnica, dátum alebo číslo pacientky. Hornú a dolnú časť snímky preto orežeme – posuň, kým v náhľade nič také nevidíš.</p>",
        photo ? "<canvas id='v2AnnCrop' class='v2-ann-crop' aria-label='Orezaná snímka'></canvas>" : "",
        "<label>Orezať hore <b>", s.cropTop, " %</b><input type='range' min='0' max='40' value='", s.cropTop, "' data-v2-ann-crop='cropTop'></label>",
        "<label>Orezať dole <b>", s.cropBottom, " %</b><input type='range' min='0' max='40' value='", s.cropBottom, "' data-v2-ann-crop='cropBottom'></label></div>"
      ].join("") : "",
      s.mode !== "none" ? "<p class='v2-visit-hint'>Fotku neukladáme – ostáva len v tomto okne, kým kartičku nezdieľaš.</p>" : "",
      "<h3>Text</h3><div class='v2-ann-chips'>",
      HEADLINES.map(text => chip("data-v2-ann-headline", text, text, s.headline === text)).join(""),
      chip("data-v2-ann-headline", "__custom", "Vlastný text", customHeadline),
      "</div>",
      customHeadline ? "<label>Vlastný text<input maxlength='48' value='" + esc(s.headline) + "' data-v2-ann-field='headline'></label>" : "",
      "<label>Mená — nepovinné<input maxlength='40' placeholder='napr. Petra a Martin' value='" + esc(s.parents || "") + "' data-v2-ann-field='parents'></label>",
      "<label>Pohlavie — nepovinné<input maxlength='30' placeholder='napr. Bude to dievčatko' value='" + esc(s.sex || "") + "' data-v2-ann-field='sex'></label>",
      "<label>Meno bábätka — nepovinné<input maxlength='30' placeholder='ak ho už chcete prezradiť' value='" + esc(s.babyName || "") + "' data-v2-ann-field='babyName'></label>",
      currentWeek() ? "<label class='v2-ann-check'><input type='checkbox' data-v2-ann-week" + (s.showWeek ? " checked" : "") + "> Ukázať týždeň tehotenstva (" + currentWeek() + ".)</label>" : "",
      "<p class='v2-visit-hint'>Termín ukážeme len ako mesiac a rok" + (dueMonth() ? " (" + esc(dueMonth()) + ")" : "") + " – presný dátum si nechaj pre seba.</p>",
      "<h3>Vzhľad</h3><div class='v2-ann-chips'>",
      Object.entries(TEMPLATES).map(([key, item]) => chip("data-v2-ann-template", key, item.label, s.template === key)).join(""),
      "</div><div class='v2-ann-chips'>",
      chip("data-v2-ann-format", "square", "Štvorec – do správ", s.format === "square"),
      chip("data-v2-ann-format", "story", "Na výšku – stories", s.format === "story"),
      "</div></section>"
    ].join("");
    redraw();
  }

  function redraw() {
    const canvas = byId("v2AnnCanvas");
    if (canvas) draw(canvas);
    // Malý náhľad orezanej snímky priamo pri posuvníkoch.
    const crop = byId("v2AnnCrop");
    if (crop && photo) {
      const s = settings();
      const top = photo.height * (s.cropTop / 100);
      const sh = Math.max(1, photo.height - top - photo.height * (s.cropBottom / 100));
      crop.width = 600;
      crop.height = Math.round(600 * sh / photo.width);
      crop.getContext("2d").drawImage(photo, 0, top, photo.width, sh, 0, 0, crop.width, crop.height);
    }
  }

  function blob() {
    const canvas = document.createElement("canvas");
    draw(canvas);
    return new Promise(resolve => canvas.toBlob(resolve, "image/png", 1));
  }

  async function share() {
    if (busy) return;
    busy = true;
    try {
      const file = await blob().then(data => data ? new File([data], "guguboo-oznamenie.png", { type: "image/png" }) : null);
      if (file && navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({ files: [file], title: settings().headline });
        state.v5.announceDone = true; V5.persist();
        V5.announce("Kartička je pripravená na zdieľanie.");
        return;
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
    link.href = url;
    link.download = "guguboo-oznamenie.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    state.v5.announceDone = true; V5.persist();
    V5.announce("Kartička sa ukladá.");
  }

  document.addEventListener("click", event => {
    const s = () => settings();
    const pick = (selector, key, after) => {
      const el = event.target.closest(selector);
      if (!el) return false;
      const value = el.getAttribute(selector.slice(1, -1));
      if (key === "headline" && value === "__custom") s().headline = HEADLINES.includes(s().headline) ? "" : s().headline;
      else s()[key] = value;
      after?.();
      V5.persist();
      render();
      return true;
    };
    if (pick("[data-v2-ann-mode]", "mode")) return;
    if (pick("[data-v2-ann-headline]", "headline")) return;
    if (pick("[data-v2-ann-template]", "template")) return;
    if (pick("[data-v2-ann-format]", "format")) return;
    if (event.target.closest("[data-v2-ann-share]")) return void share();
    if (event.target.closest("[data-v2-ann-download]")) return void download();
    if (event.target.closest("[data-v2-ann-dismiss]")) { state.v5.announceDismissed = true; V5.persist(); V5.renderHome(); }
  });

  document.addEventListener("input", event => {
    const field = event.target.closest("[data-v2-ann-field]");
    if (field) { settings()[field.dataset.v2AnnField] = field.value; V5.persist(); redraw(); return; }
    const crop = event.target.closest("[data-v2-ann-crop]");
    if (crop) {
      settings()[crop.dataset.v2AnnCrop] = Number(crop.value);
      crop.parentElement.querySelector("b").textContent = crop.value + " %";
      V5.persist(); redraw();
    }
  });

  document.addEventListener("change", event => {
    if (event.target.closest("[data-v2-ann-week]")) { settings().showWeek = event.target.checked; V5.persist(); redraw(); return; }
    const input = event.target.closest("[data-v2-ann-photo]");
    if (!input || !input.files?.[0]) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    photoUrl = URL.createObjectURL(input.files[0]);
    const img = new Image();
    img.onload = () => { photo = img; render(); };
    img.src = photoUrl;
  });

  // Jemné pripomenutie na domove po 12. týždni (dá sa zavrieť, nič povinné).
  function homeCardHtml() {
    if (state.profile?.status !== "expecting" || currentWeek() < 12 || state.v5?.announceDismissed || state.v5?.announceDone) return "";
    return "<div class='v2-ann-home'><button type='button' class='v2-ann-home-open' data-v5-feature='announce'><span aria-hidden='true'>💌</span><span><strong>Chcete to oznámiť blízkym?</strong><small>Kartička s ultrazvukom alebo bez fotky</small></span></button><button type='button' class='v2-ann-home-close' data-v2-ann-dismiss aria-label='Skryť'>×</button></div>";
  }

  window.GugubooAnnounce = { render, homeCardHtml };
  // Domov sa vykreslil skôr, ako sa tento modul načítal – doplň kartu.
  if (document.getElementById("home")?.classList.contains("active")) V5.renderHome();
})();

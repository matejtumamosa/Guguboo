/*
 * GUGUBOO MASTER 1.9 – nový úvod (schválený prototyp prototyp-uvod.html, docs/master/UVOD_NAVRH.md, rozhodnutia Sama 14. 11.).
 * 5 obrazoviek, 3 otázky: háčik → obdobie → termín / narodenie (vlastný otočný výber dátumu, živý náhľad, výpočet z menštruácie
 * alebo počatia) → oslovenie → aha moment. Všetko na stred, tlačidlá pevne dole, bez prihlásenia (beta nič neukladá).
 * Nahrádza obsah #welcome (staré kroky 1–7 ostávajú v DOM skryté, aby sa nič v app.html nerozbilo).
 * Na konci nastaví ten istý stav ako pôvodný completeWelcome: profile.status/due/birth/name, user.name, onboarded, krajina (SK).
 * Hlavná veta aha momentu: výber poľa a indexu z docs/master/HLAVNA_VETA.md, text vždy priamo z content/*.js.
 */
(function initG2Intro() {
  "use strict";
  const V5 = window.GugubooV5;
  const welcome = document.getElementById("welcome");
  const Fig = window.GugubooBabyFigure;
  if (!V5 || !V5.MASTER || !welcome || !Fig) return;
  const MARKUP = `
  <div class="top">
    <img src="guguboo-logo-3d-pastel-v2.png" alt="Guguboo">
    <div class="progress off" id="g2i-progress" role="progressbar" aria-label="Priebeh úvodu" aria-valuemin="1" aria-valuemax="3" aria-valuenow="1">
      <span></span><span></span><span></span>
    </div>
  </div>

  <div class="stage" id="g2i-stage">
    <!-- 1 Háčik -->
    <section class="screen hook" data-screen="hook" aria-labelledby="g2i-h-hook">
      <div class="hero" aria-hidden="true">
        <div class="hero-ring"></div>
        <div class="hero-art" id="g2i-heroArt"></div>
        <span class="chip c1 float"><i>☾</i>Pokoj</span>
        <span class="chip c2 float"><i>✓</i>Plán</span>
        <span class="chip c3 float"><i>♡</i>Spomienky</span>
      </div>
      <div class="head">
        <h1 id="g2i-h-hook">Každý týždeň jeden pokojný krok.</h1>
        <p class="sub">Vývoj bábätka, praktické veci, úrady aj spomienky – na jednom mieste.</p>
      </div>
    </section>

    <!-- 2 Obdobie -->
    <section class="screen" data-screen="stage" aria-labelledby="g2i-h-stage">
      <div class="head">
        <h1 id="g2i-h-stage">Kde sa práve nachádzaš?</h1>
        <p class="sub">Podľa toho ti ukážeme, čo je dôležité teraz.</p>
      </div>
      <div class="choices" role="radiogroup" aria-labelledby="g2i-h-stage">
        <button class="choice a" role="radio" aria-checked="false" data-choice="pregnant">
          <span class="ico" aria-hidden="true">☾</span>
          <span class="txt">Čakám bábätko</span>
          <span class="tick" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>
        <button class="choice b" role="radio" aria-checked="false" data-choice="born">
          <span class="ico" aria-hidden="true">♡</span>
          <span class="txt">Bábätko už je s nami</span>
          <span class="tick" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>
      </div>
    </section>

    <!-- 3 Termín / narodenie -->
    <section class="screen" data-screen="date" aria-labelledby="g2i-h-date">
      <div class="head">
        <h1 id="g2i-h-date">Kedy máš termín pôrodu?</h1>
        <p class="sub" id="g2i-dateSub">Stačí približne. Podľa neho ti ukážeme tvoj týždeň.</p>
      </div>
      <div class="picker-wrap">
        <p class="picker-label" id="g2i-pickerLabel" hidden></p>
        <div id="g2i-pickers"></div>
      </div>
      <div class="cycle" id="g2i-cycleRow" hidden></div>
      <div class="preview" id="g2i-preview" aria-hidden="true">
        <div class="pic" id="g2i-previewPic"></div>
        <div><b id="g2i-previewTitle"></b><span id="g2i-previewText"></span></div>
      </div>
      <p class="tiny" id="g2i-previewNote" hidden>Presný termín ti povie lekár.</p>
      <div class="alt-links" id="g2i-altLinks"></div>
      <p class="sr" id="g2i-live" aria-live="polite"></p>
    </section>

    <!-- 4 Oslovenie -->
    <section class="screen" data-screen="names" aria-labelledby="g2i-h-names">
      <div class="head">
        <h1 id="g2i-h-names">Ako vás môžeme oslovovať?</h1>
        <p class="sub">Nepovinné. Doplniť alebo zmeniť to môžeš kedykoľvek.</p>
      </div>
      <div class="fields">
        <div class="field">
          <label for="g2i-momName">Tvoje meno</label>
          <div class="input"><input id="g2i-momName" autocomplete="given-name" maxlength="30" placeholder="Napr. Sára" enterkeyhint="next"></div>
        </div>
        <div class="field">
          <label for="g2i-babyName">Meno bábätka</label>
          <div class="input"><span class="avatar" id="g2i-babyAvatar" aria-hidden="true" hidden></span><input id="g2i-babyName" maxlength="30" placeholder="Napr. Ema" enterkeyhint="done"></div>
          <button class="check" id="g2i-noName" role="checkbox" aria-checked="false">
            <span class="box" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Ešte nemáme vybrané
          </button>
        </div>
      </div>
      <div class="country">Úrady a príspevky pre: <strong id="g2i-countryName">Slovensko</strong><button class="link" id="g2i-countryBtn" aria-haspopup="dialog">Zmeniť</button></div>
    </section>

    <!-- 5 Aha -->
    <section class="screen aha" data-screen="aha" aria-labelledby="g2i-h-aha">
      <div class="big" id="g2i-big"></div>
      <p class="kicker" id="g2i-kicker" hidden></p>
      <h1 id="g2i-h-aha"></h1>
      <p class="sub size" id="g2i-ahaSize"></p>
      <p class="fact" id="g2i-fact"></p>
      <div class="today" id="g2i-today"></div>
    </section>
  </div>

  <div class="bottom">
    <button class="btn" id="g2i-next">Začať</button>
    <div class="slot" id="g2i-slot"></div>
  </div>

  <div class="sheet-bg" id="g2i-sheetBg"></div>
  <div class="sheet" id="g2i-sheet" role="dialog" aria-modal="true" aria-labelledby="g2i-sheetTitle" hidden></div>
`;
  welcome.insertAdjacentHTML("beforeend", "<div id='g2Intro' class='g2-intro'>" + MARKUP + "</div>");
  const root = document.getElementById("g2Intro");
  const $ = id => document.getElementById("g2i-" + id);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ——— Dátumy (lokálne, bez času) ———
  const DAY = 86400000;
  const today = (() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); })();
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const diffDays = (a, b) => Math.round((Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()) - Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())) / DAY);
  const daysIn = (y, m) => new Date(y, m + 1, 0).getDate();
  const fmt = d => d.getDate() + ". " + (d.getMonth() + 1) + ". " + d.getFullYear();
  const iso = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const fromIso = s => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || "")); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
  const MONTHS = ["január", "február", "marec", "apríl", "máj", "jún", "júl", "august", "september", "október", "november", "december"];
  const plural = (n, one, few, many) => n === 1 ? one : n >= 2 && n <= 4 ? few : many;
  const cap = s => { s = String(s || "").trim().replace(/\s+/g, " "); return s ? s.charAt(0).toLocaleUpperCase("sk") + s.slice(1) : ""; };
  const content = () => window.GugubooContent || {};

  // ——— Týždeň tehotenstva: rovnaké pravidlo ako Tvoj týždeň (guguchat.js → babySize, len okrúhle ovocie) ———
  function weekInfo(week) {
    if (week < 4) return { week, early: true };
    const size = window.GugubooV2?.babySize?.(week);
    if (!size) return { week, comparison: "", length: "", approximate: false };
    return { week: size.week, comparison: size.comparison || "", length: size.length || "", approximate: Boolean(size.approximate) };
  }
  const sizeText = info => info.early ? "úplný začiatok tehotenstva"
    : info.comparison ? (info.approximate ? "orientačne veľké ako " : "veľké asi ako ") + info.comparison
    : info.length ? "meria " + info.length : "";
  // Kresba do náhľadu: okrúhle ovocie; keď okrúhle prirovnanie nie je (4.–5. týž.), jemné „semienko“.
  const SEED = "<svg viewBox='0 0 48 48' aria-hidden='true'><circle cx='24' cy='24' r='15' fill='#f7eefc' stroke='#e4d8f6' stroke-width='1.5'/><circle cx='24' cy='24' r='4.2' fill='#f3bfb2' stroke='#dc9d90' stroke-width='1.2'/><circle cx='17' cy='17' r='1.6' fill='#fff'/></svg>";
  const artFor = info => info.comparison ? Fig.fruitSvg(info.comparison) : SEED;
  const artKey = info => info.comparison ? Fig.fruitKey(info.comparison) : "seed";
  const weekFromDue = due => Math.min(42, Math.max(1, 40 - Math.floor(diffDays(due, today) / 7)));   // ako journey-engine.js

  // ——— Hlavná veta aha momentu (docs/master/HLAVNA_VETA.md): len pole a index, text vždy z obsahu so zdrojom ———
  const WEEK_LINE = {
    4: ["baby", 1], 5: ["baby", 1], 6: ["baby", 0], 7: ["baby", 2], 8: ["baby", 0], 9: ["baby", 0], 10: ["baby", 0], 11: ["baby", 1],
    12: ["baby", 0], 13: ["baby", 1], 14: ["baby", 0], 15: ["baby", 2], 16: ["baby", 0], 17: ["baby", 1], 18: ["baby", 1], 19: ["baby", 0],
    20: ["milestone", null], 21: ["baby", 1], 22: ["baby", 0], 23: ["you", 2], 24: null, 25: ["baby", 0], 26: ["baby", 0], 27: ["baby", 0],
    28: ["milestone", null], 29: ["baby", 2], 30: ["baby", 1], 31: ["baby", 0], 32: ["baby", 1], 33: ["baby", 0], 34: ["baby", 0], 35: ["baby", 0],
    36: ["baby", 0], 37: ["baby", 0], 38: ["milestone", null], 39: ["you", 1], 40: ["you", 0], 41: ["you", 0], 42: ["you", 1]
  };
  const MONTH_LINE = {
    "0-1": ["play", null], "1-2": ["development", 1], "2-3": ["development", 1], "3-4": ["development", 3], "4-6": ["development", 1],
    "6-9": ["development", 1], "9-12": ["development", 0], "12-15": ["development", 3], "15-18": ["development", 2], "18-24": ["development", 2],
    "24-30": ["everyday", 1], "30-36": ["everyday", 1]
  };
  function pick(entry, selection) {
    if (!entry || !selection) return null;
    const value = entry[selection[0]];
    const item = selection[1] === null ? (Array.isArray(value) ? null : value) : (Array.isArray(value) ? value[selection[1]] : null);
    return item && item.sk ? item : null;
  }
  function weekLine(week) {
    const PW = content().pregnancyWeeks;
    if (!PW || PW.meta?.verification_status !== "evidence-verified") return "";
    return pick(PW.weeks?.[week], WEEK_LINE[week])?.sk || "";   // 24. týždeň: null → len veľkosť
  }

  // ——— Vek bábätka (content/baby-months.js) ———
  function monthsOld(birth) {
    let m = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
    if (today.getDate() < birth.getDate()) m--;
    return Math.max(0, m);
  }
  function ageParts(birth) {
    const d = diffDays(today, birth), m = monthsOld(birth);
    if (d < 60) return { n: d, unit: plural(d, "deň", "dni", "dní"), text: d + " " + plural(d, "deň", "dni", "dní") };
    if (m < 24) return { n: m, unit: plural(m, "mesiac", "mesiace", "mesiacov"), text: m + " " + plural(m, "mesiac", "mesiace", "mesiacov") };
    const y = Math.floor(m / 12), r = m % 12;
    return { n: y, unit: plural(y, "rok", "roky", "rokov"), text: y + " " + plural(y, "rok", "roky", "rokov") + (r ? " a " + r + " " + plural(r, "mesiac", "mesiace", "mesiacov") : "") };
  }
  function babyPeriod(birth) {
    const BM = content().babyMonths;
    if (!BM || !Array.isArray(BM.periods)) return null;
    const m = monthsOld(birth);
    const p = BM.periods.find(item => { const [a, b] = String(item.id).split("-").map(Number); return item.verified && m >= a && m < b; });
    if (!p) return null;
    const line = pick(p, MONTH_LINE[p.id]);
    const src = line ? (BM.meta?.sources || []).find(s => s.id === line.source) : null;
    const short = src ? (String(src.name).startsWith("CDC") ? "CDC" : "Pregnancy, Birth and Baby") : "";
    return { title: p.title, line: line?.sk || "", source: short };
  }

  // ——— „Dnes pre teba“: prvý krok z Journey Engine (to isté, čo uvidí na domove) ———
  function firstStep() {
    const J = window.GugubooJourney;
    if (!J || typeof state === "undefined") return null;
    try {
      const preview = JSON.parse(JSON.stringify(state));
      preview.profile = { ...preview.profile, ...profilePatch() };
      const plan = J.compute(preview);
      const item = (plan.what_is_relevant_now || []).find(entry => !/na svete/i.test(entry.title || "")) || plan.next_best_action;
      return item ? { t: item.title, y: item.note || item.why || "" } : null;
    } catch (error) { return null; }
  }

  // ——— Otočný výber (scroll-snap) – jeden stĺpec ———
  class Wheel {
    constructor(label, onInput, onSettle) {
      this.onInput = onInput; this.onSettle = onSettle;
      this.items = []; this.index = 0; this.lock = false; this.key = "";
      this.col = document.createElement("div"); this.col.className = "col";
      this.el = document.createElement("div"); this.el.className = "wheel";
      this.el.tabIndex = 0;
      this.el.setAttribute("role", "spinbutton");
      this.el.setAttribute("aria-label", label);
      const ring = document.createElement("div"); ring.className = "ring";
      this.col.append(this.el, ring);
      this.el.addEventListener("scroll", () => this.scrolled(), { passive: true });
      // Master 1.9: kým dobieha programové (plynulé) otočenie, priebežná poloha sa neberie ako výber.
      // Dotyk, myš alebo koliesko to hneď zruší – vtedy rozhoduje prst.
      ["touchstart", "pointerdown", "wheel"].forEach(type => this.el.addEventListener(type, () => { this.targetTop = null; }, { passive: true }));
      this.el.addEventListener("keydown", e => this.key_(e));
      // myš / touchpad na PC: jedno cvaknutie kolieska = jedna položka
      this.acc = 0;
      this.el.addEventListener("wheel", e => {
        e.preventDefault();
        this.acc += e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
        if (Math.abs(this.acc) >= 40) { this.go(this.index + Math.sign(this.acc), true); this.acc = 0; }
      }, { passive: false });
      this.el.addEventListener("click", e => {
        const opt = e.target.closest(".opt"); if (!opt) return;
        this.go(Number(opt.dataset.i), true);
      });
    }
    get h() { return this.el.firstElementChild ? this.el.firstElementChild.offsetHeight || 44 : 44; }
    setItems(items, value) {
      const key = items.map(i => i.text).join("|");
      if (key !== this.key) {
        this.key = key; this.items = items;
        this.el.innerHTML = items.map((it, i) => "<div class='opt' data-i='" + i + "' aria-hidden='true'>" + it.text + "</div>").join("");
        this.el.setAttribute("aria-valuemin", items[0].value);
        this.el.setAttribute("aria-valuemax", items[items.length - 1].value);
      }
      let i = items.findIndex(it => it.value === value);
      if (i < 0) i = Math.max(0, Math.min(items.length - 1, this.index));
      this.set(i, false);
    }
    mark(i) {
      const prev = this.el.querySelector(".opt.sel"); if (prev) prev.classList.remove("sel");
      const cur = this.el.children[i]; if (cur) cur.classList.add("sel");
      this.el.setAttribute("aria-valuenow", this.items[i].value);
      this.el.setAttribute("aria-valuetext", this.items[i].text);
    }
    set(i, smooth) {                     // programové nastavenie (bez spätného volania)
      this.index = i; this.mark(i);
      this.lock = true; clearTimeout(this.lockT);
      this.targetTop = i * this.h; this.targetUntil = performance.now() + 1500;
      this.el.scrollTo({ top: i * this.h, behavior: smooth && !reduce.matches ? "smooth" : "auto" });
      this.lockT = setTimeout(() => { this.lock = false; }, smooth && !reduce.matches ? 450 : 60);
    }
    go(i, smooth) {                      // zmena používateľom (klik, klávesnica)
      i = Math.max(0, Math.min(this.items.length - 1, i));
      if (i === this.index) return;
      this.set(i, smooth);
      this.onInput(this.items[i].value);
      this.onSettle();
    }
    scrolled() {
      if (this.lock || !this.items.length) return;
      if (this.targetTop != null) {
        if (performance.now() < this.targetUntil && Math.abs(this.el.scrollTop - this.targetTop) > 2) return;
        this.targetTop = null;
      }
      const i = Math.max(0, Math.min(this.items.length - 1, Math.round(this.el.scrollTop / this.h)));
      if (i !== this.index) { this.index = i; this.mark(i); this.onInput(this.items[i].value); }
      clearTimeout(this.settleT);
      this.settleT = setTimeout(() => this.onSettle(), 140);
    }
    key_(e) {
      const step = { ArrowUp: -1, ArrowDown: 1, PageUp: -5, PageDown: 5 }[e.key];
      if (step) { e.preventDefault(); this.go(this.index + step, true); }
      else if (e.key === "Home") { e.preventDefault(); this.go(0, true); }
      else if (e.key === "End") { e.preventDefault(); this.go(this.items.length - 1, true); }
    }
    sync() { this.el.scrollTop = this.index * this.h; }
    markOut(fn) { [...this.el.children].forEach((c, i) => c.classList.toggle("out", !fn(this.items[i].value))); }
  }

  // ——— Výber dátumu: deň · mesiac · rok ———
  class DatePicker {
    constructor(name, min, max, value, onChange) {
      this.min = min; this.max = max; this.onChange = onChange;
      this.d = value.getDate(); this.m = value.getMonth(); this.y = value.getFullYear();
      this.el = document.createElement("div");
      this.el.className = "picker";
      this.el.setAttribute("role", "group");
      this.el.setAttribute("aria-label", name);
      this.el.hidden = true;
      const settle = () => this.settle();
      this.day = new Wheel("Deň", v => { this.d = v; this.input(); }, settle);
      this.month = new Wheel("Mesiac", v => { this.m = v; this.input(); }, settle);
      this.year = new Wheel("Rok", v => { this.y = v; this.input(); }, settle);
      this.el.append(this.day.col, this.month.col, this.year.col);
      const years = []; for (let y = min.getFullYear(); y <= max.getFullYear(); y++) years.push({ value: y, text: String(y) });
      this.year.setItems(years, this.y);
      this.month.setItems(MONTHS.map((t, i) => ({ value: i, text: t })), this.m);
      this.days();
    }
    days() {
      const n = daysIn(this.y, this.m); if (this.d > n) this.d = n;
      const list = []; for (let d = 1; d <= n; d++) list.push({ value: d, text: String(d) });
      this.day.setItems(list, this.d);
    }
    clamped() {
      const v = new Date(this.y, this.m, Math.min(this.d, daysIn(this.y, this.m)));
      return v < this.min ? this.min : v > this.max ? this.max : v;
    }
    get value() { return this.clamped(); }
    input() {                               // živo počas otáčania
      if (this.d > daysIn(this.y, this.m)) this.days();
      else if (this.day.items.length !== daysIn(this.y, this.m)) this.days();
      this.onChange(this.clamped(), false);
    }
    settle() {                              // po dotočení: vráť do povoleného rozsahu
      const v = this.clamped();
      if (v.getFullYear() !== this.y || v.getMonth() !== this.m || v.getDate() !== this.d) this.setValue(v, true);
      this.marks();
      this.onChange(v, true);
    }
    setValue(v, smooth) {
      this.d = v.getDate(); this.m = v.getMonth(); this.y = v.getFullYear();
      this.year.set(this.year.items.findIndex(i => i.value === this.y), smooth);
      this.month.set(this.m, smooth);
      this.days();
      this.day.set(this.d - 1, smooth);
      this.marks();
    }
    marks() {
      const inRange = d => d >= this.min && d <= this.max;
      this.month.markOut(m => inRange(new Date(this.y, m, 1)) || inRange(new Date(this.y, m, daysIn(this.y, m))) || (new Date(this.y, m, 1) < this.min && new Date(this.y, m, daysIn(this.y, m)) > this.max));
      this.day.markOut(d => inRange(new Date(this.y, this.m, d)));
    }
    show(on) { this.el.hidden = !on; if (on) { [this.day, this.month, this.year].forEach(w => w.sync()); this.marks(); } }
  }

  // ——— Stav (len v pamäti stránky) ———
  const S = {
    screen: 0, stage: null, mode: "due",
    due: addDays(today, 112),             // ≈ 24. týždeň
    lmp: addDays(today, -56), cycle: 28, cycleEdit: false,
    conception: addDays(today, -42),
    birth: addDays(today, -10),
    mom: "", baby: "", noName: false, country: "Slovensko"
  };
  const ORDER = ["hook", "stage", "date", "names", "aha"];

  // pickery
  const onPick = key => (v, settled) => { S[key] = v; if (key === "birth") S.birth = v; updatePreview(settled); };
  const P = {
    // termín: do 2 týždňov po termíne (42. týž.) až o 40 týždňov (1. týž.)
    due: new DatePicker("Termín pôrodu", addDays(today, -14), addDays(today, 280), S.due, onPick("due")),
    lmp: new DatePicker("Prvý deň poslednej menštruácie", addDays(today, -294), today, S.lmp, onPick("lmp")),
    conception: new DatePicker("Dátum počatia", addDays(today, -280), today, S.conception, onPick("conception")),
    birth: new DatePicker("Dátum narodenia", new Date(today.getFullYear() - 3, today.getMonth(), today.getDate()), today, S.birth, onPick("birth"))
  };
  Object.values(P).forEach(p => $("pickers").append(p.el));

  const dueDate = () => S.mode === "lmp" ? addDays(S.lmp, 280 + (S.cycle - 28)) : S.mode === "conception" ? addDays(S.conception, 266) : S.due;

  // ——— Háčik: ovocie sa jemne mení (hrášok → pomaranč → melón → bábätko) ———
  const HERO = [Fig.fruitSvg("hrášok"), Fig.fruitSvg("pomaranč"), Fig.fruitSvg("vodový melón"), Fig.babySvg(30)];
  $("heroArt").innerHTML = HERO.map((s, i) => "<div class='" + (i === 3 ? "baby" : "") + "'>" + s + "</div>").join("");
  let heroI = 0, heroT = null;
  function hero(run) {
    const layers = $("heroArt").children;
    clearInterval(heroT);
    if (reduce.matches) { [...layers].forEach((l, i) => l.classList.toggle("on", i === 3)); return; }
    [...layers].forEach((l, i) => l.classList.toggle("on", i === heroI));
    if (run) heroT = setInterval(() => { heroI = (heroI + 1) % layers.length; [...layers].forEach((l, i) => l.classList.toggle("on", i === heroI)); }, 2200);
  }

  // ——— Náhľad pri výbere dátumu ———
  let lastArt = "";
  function updatePreview(settled) {
    const pic = $("previewPic");
    let title, text, key, art, live;
    if (S.stage === "born") {
      const a = ageParts(S.birth), p = babyPeriod(S.birth);
      title = a.n === 0 && a.unit === "dní" ? "Narodilo sa dnes" : a.text;
      text = "narodené " + fmt(S.birth) + (p ? " · " + p.title.toLowerCase() : "");
      key = "age"; art = Fig.babySvg(40);
      live = "Vek bábätka: " + a.text;
    } else {
      const due = dueDate(), info = weekInfo(weekFromDue(due));
      title = info.week + ". týždeň";
      text = sizeText(info);
      if (S.mode !== "due") text = "<span class='due'>Približný termín: " + fmt(due) + "</span>" + text;
      key = artKey(info); art = artFor(info);
      live = info.week + ". týždeň, " + sizeText(info) + (S.mode !== "due" ? ". Približný termín " + fmt(due) : "");
    }
    $("previewTitle").textContent = title;
    $("previewText").innerHTML = text;
    if (key !== lastArt) {
      pic.innerHTML = art; lastArt = key;
      pic.classList.remove("pop"); void pic.offsetWidth; pic.classList.add("pop");
    }
    if (settled) $("live").textContent = live;
  }

  // ——— Obrazovka 3 – prepínanie spôsobu ———
  function renderDate() {
    const born = S.stage === "born";
    $("h-date").textContent = born ? "Kedy sa bábätko narodilo?" : S.mode === "due" ? "Kedy máš termín pôrodu?" : "Vypočítame ti termín";
    $("dateSub").textContent = born ? "Podľa veku ti ponúkneme, čo je práve aktuálne."
      : S.mode === "due" ? "Stačí približne. Podľa neho ti ukážeme tvoj týždeň."
      : S.mode === "lmp" ? "Z prvého dňa poslednej menštruácie a dĺžky cyklu." : "Z dátumu počatia (+ 266 dní).";
    const which = born ? "birth" : S.mode;
    root.querySelector("[data-screen='date']").classList.toggle("calc", !born && S.mode !== "due");
    Object.entries(P).forEach(([k, p]) => p.show(k === which));
    const lbl = $("pickerLabel");
    lbl.hidden = !(born || S.mode !== "due");
    lbl.textContent = born ? "Dátum narodenia" : S.mode === "lmp" ? "Prvý deň poslednej menštruácie" : "Dátum počatia";
    $("previewNote").hidden = born || S.mode === "due";
    // cyklus
    const cyc = $("cycleRow");
    cyc.hidden = born || S.mode !== "lmp";
    if (!cyc.hidden) {
      cyc.innerHTML = S.cycleEdit
        ? "<button class='step' id='g2i-cycMinus' aria-label='Kratší cyklus'" + (S.cycle <= 21 ? " disabled" : "") + ">−</button>" +
          "<span>Dĺžka cyklu: <strong id='g2i-cycVal'>" + S.cycle + " dní</strong></span>" +
          "<button class='step' id='g2i-cycPlus' aria-label='Dlhší cyklus'" + (S.cycle >= 45 ? " disabled" : "") + ">+</button>"
        : "<span>Dĺžka cyklu: <strong>" + S.cycle + " dní</strong></span><button class='link' id='g2i-cycEdit' style='font-size:15px;padding:0 8px'>zmeniť</button>";
    }
    // odkazy
    const links = $("altLinks");
    links.innerHTML = born ? ""
      : S.mode === "due" ? "<button class='link' data-mode='lmp'>Nepoznám termín – vypočítam ho</button>"
      : S.mode === "lmp" ? "<button class='link muted' data-mode='conception'>Viem dátum počatia</button><button class='link muted' data-mode='due'>Zadám termín</button>"
      : "<button class='link muted' data-mode='lmp'>Podľa menštruácie</button><button class='link muted' data-mode='due'>Zadám termín</button>";
    lastArt = "";
    updatePreview(true);
  }
  $("altLinks").addEventListener("click", e => {
    const b = e.target.closest("[data-mode]"); if (!b) return;
    const mode = b.dataset.mode, due = dueDate();
    // nový spôsob začne z toho istého termínu, nech náhľad neskáče
    if (mode === "lmp") { S.lmp = clampTo(addDays(due, -280 - (S.cycle - 28)), P.lmp); P.lmp.setValue(S.lmp, false); }
    if (mode === "conception") { S.conception = clampTo(addDays(due, -266), P.conception); P.conception.setValue(S.conception, false); }
    if (mode === "due") { S.due = clampTo(due, P.due); P.due.setValue(S.due, false); }
    S.mode = mode; renderDate();
    const w = P[mode].day.el; w.focus({ preventScroll: true });
  });
  const clampTo = (v, p) => v < p.min ? p.min : v > p.max ? p.max : v;
  $("cycleRow").addEventListener("click", e => {
    if (e.target.closest("#g2i-cycEdit")) { S.cycleEdit = true; renderDate(); $("cycPlus").focus(); return; }
    const plus = e.target.closest("#g2i-cycPlus"), minus = e.target.closest("#g2i-cycMinus");
    if (!plus && !minus) return;
    S.cycle = Math.max(21, Math.min(45, S.cycle + (plus ? 1 : -1)));
    $("cycVal").textContent = S.cycle + " dní";
    $("cycMinus").disabled = S.cycle <= 21; $("cycPlus").disabled = S.cycle >= 45;
    updatePreview(true);
  });

  // ——— Obrazovka 2 ———
  root.querySelectorAll(".choice").forEach(c => c.addEventListener("click", () => {
    S.stage = c.dataset.choice;
    root.querySelectorAll(".choice").forEach(x => x.setAttribute("aria-checked", String(x === c)));
    renderFooter();
  }));
  root.querySelector(".choices").addEventListener("keydown", e => {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    const list = [...root.querySelectorAll(".choice")], i = list.indexOf(document.activeElement);
    const n = list[(i + (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : list.length - 1)) % list.length];
    n.focus(); n.click();
  });

  // ——— Obrazovka 4 ———
  $("momName").addEventListener("input", e => { S.mom = e.target.value; });
  $("babyName").addEventListener("input", e => { S.baby = e.target.value; });
  $("momName").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); $("babyName").disabled ? next() : $("babyName").focus(); } });
  $("babyName").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); next(); } });
  $("noName").addEventListener("click", () => {
    S.noName = !S.noName;
    $("noName").setAttribute("aria-checked", String(S.noName));
    const inp = $("babyName");
    inp.disabled = S.noName;
    inp.value = S.noName ? "Bábätko" : S.baby;
  });
  function renderNames() {
    const av = $("babyAvatar");
    if (S.stage === "pregnant") {
      const info = weekInfo(weekFromDue(dueDate()));
      av.innerHTML = artFor(info); av.hidden = false;
    } else av.hidden = true;
  }

  // ——— Vlastné okno: krajina / koniec prototypu ———
  function openSheet(html, focusSel) {
    const sh = $("sheet");
    sh.innerHTML = "<div class='grab'></div>" + html;
    sh.hidden = false;
    requestAnimationFrame(() => root.classList.add("sheet-open"));
    sh._return = document.activeElement;
    setTimeout(() => { const f = sh.querySelector(focusSel || "button"); if (f) f.focus(); }, 30);
  }
  function closeSheet() {
    const sh = $("sheet");
    root.classList.remove("sheet-open");
    setTimeout(() => { sh.hidden = true; }, reduce.matches ? 0 : 280);
    if (sh._return) sh._return.focus();
  }
  $("sheetBg").addEventListener("click", closeSheet);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && root.classList.contains("sheet-open")) closeSheet(); });
  $("countryBtn").addEventListener("click", () => {
    const opt = (n, s) => "<button role='radio' data-c='" + n + "' aria-checked='" + (S.country === n) + "'>" + n + "<span>" + s + "</span></button>";
    openSheet("<h2 id='g2i-sheetTitle'>Úrady a príspevky pre</h2><p>Podľa krajiny ti ukážeme správne úrady a príspevky.</p>" +
      "<div class='opts' role='radiogroup' aria-labelledby='g2i-sheetTitle'>" + opt("Slovensko", "predvolené") + opt("Česko", "") + "</div>" +
      "<button class='link muted' data-close>Zavrieť</button>", "[aria-checked='true']");
  });
  $("sheet").addEventListener("click", e => {
    const c = e.target.closest("[data-c]");
    if (c) { S.country = c.dataset.c; $("countryName").textContent = S.country; closeSheet(); return; }
    if (e.target.closest("[data-close]")) closeSheet();
    if (e.target.closest("[data-restart]")) { closeSheet(); restart(); }
  });

  // ——— Obrazovka 5: aha ———
  function renderAha() {
    const big = $("big"), mom = cap(S.mom), baby = S.noName ? "" : cap(S.baby);
    let title, fact, step, sizeLine = "";
    $("kicker").hidden = true;
    if (S.stage === "born") {
      const a = ageParts(S.birth), p = babyPeriod(S.birth), who = baby || "Bábätko";
      big.className = "big breathe";
      big.innerHTML = "<div class='age'><b>" + a.n + "</b><span>" + (a.n === 0 && a.unit === "dní" ? "prvý deň" : a.unit) + "</span></div>";
      title = a.n === 0 && a.unit === "dní" ? who + " je dnes prvý deň na svete." : who + " má dnes " + a.text + ".";
      if (mom) { $("kicker").textContent = "Ahoj, " + mom + "."; $("kicker").hidden = false; }
      fact = p && p.line ? esc(p.line) + (p.source ? "<span class='src'>Zdroj: " + esc(p.source) + "</span>" : "") : "";
      step = firstStep();
    } else {
      const info = weekInfo(weekFromDue(dueDate()));
      big.className = "big breathe";
      big.innerHTML = "<div class='art'>" + (info.comparison ? Fig.fruitSvg(info.comparison) : info.early ? SEED : Fig.babySvg(info.week)) + "</div><span class='wk'>" + info.week + ". týždeň</span>";
      title = (mom ? mom + ", si" : "Si") + " v " + info.week + ". týždni.";
      const who = baby || "Bábätko";
      sizeLine = info.early ? "" : info.comparison
        ? who + " je " + (info.approximate ? "orientačne veľké ako " : "veľké asi ako ") + info.comparison + (info.length ? ", " + info.length : "") + "."
        : info.length ? who + " meria " + info.length + "." : "";
      const line = weekLine(info.week);
      fact = line ? esc(line) + "<span class='src'>Zdroj: NHS</span>" : "";
      step = firstStep();
    }
    $("h-aha").textContent = title;
    $("ahaSize").textContent = sizeLine;
    $("ahaSize").hidden = !sizeLine;
    $("fact").innerHTML = fact;
    $("fact").hidden = !fact;
    $("today").hidden = !step;
    $("today").innerHTML = step ? "<span class='dot' aria-hidden='true'>" + V5.icon("checklist") + "</span><div class='t'><span class='lbl'>Dnes pre teba</span><strong>" + esc(step.t) + "</strong>" + (step.y ? "<p>" + esc(step.y) + "</p>" : "") + "</div>" : "";
  }
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // ——— Navigácia ———
  function renderFooter() {
    const name = ORDER[S.screen], btn = $("next"), slot = $("slot");
    btn.textContent = { hook: "Začať", stage: "Pokračovať", date: "Pokračovať", names: "Pokračovať", aha: "Otvoriť môj Guguboo" }[name];
    const blocked = name === "stage" && !S.stage;
    btn.setAttribute("aria-disabled", String(blocked));
    slot.innerHTML = name === "hook"
      ? "<p class='note'>Bez reklám. V bete sa údaje po zatvorení vymažú.</p>"
      : "<button class='link muted' id='g2i-back'>Späť</button>";
    const bar = $("progress"), step = { stage: 1, date: 2, names: 3 }[name];
    bar.classList.toggle("off", !step);
    bar.setAttribute("aria-hidden", String(!step));
    [...bar.children].forEach((s, i) => s.classList.toggle("on", step && i < step));
    if (step) bar.setAttribute("aria-valuenow", step);
  }
  function show(i, dir) {
    const screens = root.querySelectorAll(".screen");
    const name = ORDER[i];
    if (name === "date") renderDate();
    if (name === "names") renderNames();
    if (name === "aha") renderAha();
    screens.forEach(s => {
      const on = s.dataset.screen === name;
      s.classList.toggle("left", !on && dir > 0 && s.dataset.screen === ORDER[S.screen]);
      s.classList.toggle("on", on);
      s.setAttribute("aria-hidden", String(!on));
      s.inert = !on;
    });
    S.screen = i;
    renderFooter();
    hero(name === "hook");
    if (name === "date") Object.values(P).forEach(p => { if (!p.el.hidden) p.show(true); });
    const aha = root.querySelector("[data-screen='aha']");
    aha.classList.remove("grow");
    if (name === "aha") { void aha.offsetWidth; aha.classList.add("grow"); }
    // fokus na nadpis kvôli čítačke
    const h = root.querySelector("[data-screen='" + name + "'] h1");
    if (h && dir) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  }
  function next() {
    const name = ORDER[S.screen];
    if (name === "stage" && !S.stage) {
      const c = root.querySelector(".choice"); c.focus();
      return;
    }
    if (name === "aha") return finish();
    show(S.screen + 1, 1);
  }
  function back() { if (S.screen > 0) show(S.screen - 1, -1); }
  // Úvod vždy od začiatku; ak už údaje existujú (návrat do úvodu), predvyplnia sa.
  function restart() {
    const has = typeof state !== "undefined" && state.onboarded;
    const profile = has ? state.profile || {} : {};
    const clampDate = (v, p) => v < p.min ? p.min : v > p.max ? p.max : v;
    const due = fromIso(profile.due), birth = fromIso(profile.birth);
    Object.assign(S, { stage: has ? (profile.status === "born" ? "born" : profile.status === "expecting" ? "pregnant" : null) : null, mode: "due",
      mom: has ? state.user?.name || "" : "", baby: has && profile.name && profile.name !== "Bábätko" ? profile.name : "", noName: has && profile.name === "Bábätko", cycleEdit: false, cycle: 28,
      due: due ? clampDate(due, P.due) : addDays(today, 112), lmp: addDays(today, -56), conception: addDays(today, -42), birth: birth ? clampDate(birth, P.birth) : addDays(today, -10) });
    S.country = (profile.country || "SK") === "CZ" ? "Česko" : "Slovensko";
    ["due", "lmp", "conception", "birth"].forEach(k => P[k].setValue(S[k], false));
    root.querySelectorAll(".choice").forEach(x => x.setAttribute("aria-checked", String((x.dataset.choice === "born" ? "born" : "pregnant") === S.stage)));
    $("momName").value = S.mom; $("babyName").value = S.noName ? "Bábätko" : S.baby; $("babyName").disabled = S.noName; $("noName").setAttribute("aria-checked", String(S.noName));
    $("countryName").textContent = S.country;
    show(0, 0);
  }

  // ——— Koniec úvodu: rovnaký stav ako pôvodný completeWelcome (app.html) ———
  function profilePatch() {
    const status = S.stage === "born" ? "born" : "expecting";
    return {
      country: S.country === "Česko" ? "CZ" : "SK",
      status,
      name: S.noName ? "Bábätko" : cap(S.baby) || "Bábätko",
      due: status === "expecting" ? iso(dueDate()) : "",
      birth: status === "born" ? iso(S.birth) : "",
      avatarType: status === "expecting" ? "fruit" : ""
    };
  }
  function finish() {
    if (typeof state === "undefined") return;
    const patch = profilePatch();
    state.welcomeStatus = patch.status;
    state.user = { ...state.user, name: cap(S.mom) };
    state.profile = { ...state.profile, ...patch, due: patch.status === "expecting" ? patch.due : (state.profile.due || ""), avatarType: patch.status === "expecting" ? "fruit" : (state.profile.photo ? "photo" : "") };
    try { if (typeof scheduleBirthCardReminders === "function") scheduleBirthCardReminders(); } catch (error) { /* pripomienky kartičky nie sú nutné pre štart */ }
    state.onboarded = true;
    state.welcomeStep = 1;
    delete state.welcomeDraft;
    try { if (typeof updateCountryUI === "function") updateCountryUI(state.profile.country || "SK"); } catch (error) { /* krajina ostáva v profile */ }
    if (typeof save === "function") save();
    clearInterval(heroT);
    if (typeof switchView === "function") switchView("home");
    try { V5.renderHome?.(); V5.renderBottomBar?.(); V5.renderDrawer?.(); } catch (error) { /* domov sa vykreslí pri prepnutí */ }
  }
  $("next").addEventListener("click", next);
  $("slot").addEventListener("click", e => { if (e.target.closest("#g2i-back")) back(); });
  reduce.addEventListener && reduce.addEventListener("change", () => hero(ORDER[S.screen] === "hook"));

  // Úvod sa ukáže vždy, keď je aktívna obrazovka #welcome (staré kroky sú skryté v CSS).
  let wasActive = false;
  function sync() {
    const active = welcome.classList.contains("active");
    document.body.classList.toggle("g2-intro-on", active);
    if (active && !wasActive) restart();
    if (!active) clearInterval(heroT);
    wasActive = active;
  }
  new MutationObserver(sync).observe(welcome, { attributes: true, attributeFilter: ["class"] });
  sync();
  window.G2Intro = { restart, state: () => ({ ...S }), pickers: P, dueDate };
})();

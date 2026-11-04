/*
 * GUGUBOO V2 – Časová os spomienok (Samuel 17. 10. 2026, bod 1 plánu „spomienky“).
 * Spomienky vznikajú SAMY z toho, čo rodina v appke aj tak robí (sono v Knižke, prvé pohyby, kartička,
 * narodenie, prehliadky, zúbok…), plus ručné „Prvé razy“ a momenty. Nič sa nevymýšľa: každá automatická
 * spomienka má dátum zo skutočného zápisu. Bez sérií a výčitiek – chýbajúci zápis nevadí.
 * Ukladajú sa len značky s dátumom (state.v5.momentMarks); obsah denníka a listov ostáva súkromný.
 */
(function initGugubooMoments() {
  "use strict";

  if (typeof state === "undefined" || !window.GugubooV5) return;

  const V5 = window.GugubooV5;
  const esc = V5.escapeHtml;
  const DAY = 86400000;

  const marks = () => { state.v5 ||= {}; return state.v5.momentMarks ||= {}; };
  const nowIso = () => new Date().toISOString();
  const dayDate = key => new Date(String(key).slice(0, 10) + "T12:00:00");
  const plusDays = (key, days) => { const d = dayDate(key); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); };
  const plusMonths = (key, months) => { const d = dayDate(key); d.setMonth(d.getMonth() + months); return d.toISOString().slice(0, 10); };
  const todayKey = () => { const n = new Date(); return new Date(n.getTime() - n.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
  const time = value => new Date(String(value).length <= 10 ? value + "T12:00:00" : value).getTime();

  // Značky pre veci, pri ktorých appka nemá vlastný dátum – uloží sa deň, keď to prvýkrát zbadala.
  function watch() {
    const m = marks();
    let changed = false;
    const set = (key, condition) => { if (condition && !m[key]) { m[key] = nowIso(); changed = true; } };
    set("start", true);
    const name = state.profile?.name;
    set("name", name && !/^(bábätko|babatko|pipík)$/i.test(name));
    set("sex", Boolean(state.profile?.sex));
    set("bag", ["v5-bag-mother", "v5-bag-baby", "v5-bag-hygiene", "v5-bag-home"].every(id => state.checks?.[id]));
    set("birthPlan", Object.values(state.v5?.birthPlan || {}).some(Boolean));
    if (changed) V5.persist();
  }

  // Všetky spomienky: { key, phase: "pre"|"post", emoji, title, date, text?, photo?, source }
  function collect() {
    watch();
    const m = marks();
    const p = state.profile || {};
    const list = [];
    const add = item => { if (item.date && time(item.date) <= Date.now()) list.push(item); };
    const birthKey = p.birth || "";
    const preUntil = birthKey ? time(birthKey) : Infinity;
    const pre = date => time(date) < preUntil ? "pre" : "post";

    add({ key: "start", phase: pre(m.start), emoji: "🌱", title: "Začali sme spolu s Guguboo", date: m.start, source: "auto" });

    // Míľniky tehotenstva z termínu pôrodu (začiatok týždňa = termín − 280 dní + týždne).
    if (p.due) {
      const lmp = plusDays(p.due, -280);
      [[12, "🌿", "Koniec 1. trimestra"], [19, "✨", "Polovica tehotenstva"], [27, "🌸", "Začal sa 3. trimester"]].forEach(([weeks, emoji, title]) => {
        const date = plusDays(lmp, weeks * 7);
        if (time(date) < preUntil) add({ key: "week-" + weeks, phase: "pre", emoji, title, date, source: "auto" });
      });
      const hundred = plusDays(p.due, -100);
      if (time(hundred) < preUntil) add({ key: "due-100", phase: "pre", emoji: "💫", title: "100 dní do termínu", date: hundred, source: "auto" });
    }

    const firstBy = (items, field) => (items || []).filter(item => item[field]).slice().sort((a, b) => time(a[field]) - time(b[field]))[0];
    const sono = firstBy((state.v5?.prenatalResults || []).filter(item => item.type === "Ultrazvuk"), "date");
    if (sono) add({ key: "sono", phase: pre(sono.date), emoji: "💗", title: "Prvé sono", date: sono.date, photo: sono.photo || "", source: "Tehotenská knižka" });
    const moves = firstBy(state.v5?.babyMoves, "time");
    if (moves) add({ key: "moves", phase: "pre", emoji: "🦋", title: "Prvé pohyby bábätka", date: moves.time, text: moves.note || "", source: "Tehotenská knižka" });
    if (m.announced) add({ key: "announced", phase: pre(m.announced), emoji: "💌", title: "Oznámili sme to blízkym", date: m.announced, photo: m.announcedImg || "", source: "Kartička" });
    // Meno a pohlavie sú spomienkou len z čakania (po narodení ich nesie „… je na svete“).
    if (m.sex && pre(m.sex) === "pre") add({ key: "sex", phase: pre(m.sex), emoji: "🎀", title: p.sex === "girl" ? "Bude to dievčatko" : p.sex === "boy" ? "Bude to chlapček" : "Vieme, kto to bude", date: m.sex, source: "auto" });
    if (m.name && pre(m.name) === "pre") add({ key: "name", phase: pre(m.name), emoji: "💜", title: "Meno: " + p.name, date: m.name, source: "auto" });
    if (m.firstLetter) add({ key: "letter", phase: pre(m.firstLetter), emoji: "✉️", title: "Prvý list bábätku", text: "Obsah ostáva v tvojom súkromnom denníku.", date: m.firstLetter, source: "Denník" });
    if (m.bag) add({ key: "bag", phase: pre(m.bag), emoji: "👜", title: "Taška do pôrodnice je zbalená", date: m.bag, source: "auto" });
    if (m.birthPlan) add({ key: "plan", phase: pre(m.birthPlan), emoji: "📝", title: "Plán pôrodu je napísaný", date: m.birthPlan, source: "auto" });

    // Po narodení
    if (birthKey) {
      const birthDate = p.birthTime ? birthKey + "T" + p.birthTime : birthKey;
      const facts = [p.weight, p.height].filter(Boolean).join(" · ");
      add({ key: "birth", phase: "post", emoji: "👶", title: (p.name || "Bábätko") + " je na svete", date: birthDate, text: facts, photo: p.photo || "", source: "auto" });
      [[7, "Prvý týždeň spolu"], [100, "100 dní spolu"], [365, "Prvý rok spolu"]].forEach(([days, title]) =>
        add({ key: "days-" + days, phase: "post", emoji: days === 100 ? "💯" : days === 365 ? "🎂" : "💛", title, date: plusDays(birthKey, days - 1), source: "auto" }));
      for (let month = 1; month <= 11; month += 1) add({ key: "month-" + month, phase: "post", emoji: "🌙", title: month + (month === 1 ? " mesiac" : month < 5 ? " mesiace" : " mesiacov") + " spolu", date: plusMonths(birthKey, month), source: "auto" });
      const check = firstBy(state.v5?.childChecks, "date");
      if (check) add({ key: "check", phase: "post", emoji: "🩺", title: "Prvá prehliadka u pediatra", date: check.date, source: "Zdravotná knižka" });
      const vaccine = firstBy(state.v5?.childVaccines, "date");
      if (vaccine) add({ key: "vaccine", phase: "post", emoji: "💪", title: "Prvé očkovanie", date: vaccine.date, source: "Zdravotná knižka" });
      if (state.teeth?.firstToothDate) add({ key: "tooth", phase: "post", emoji: "🦷", title: "Prvý zúbok", date: state.teeth.firstToothDate, source: "Zúbky" });
      const bath = (state.events || []).filter(event => /kúpan|kupan/i.test(event.type || "")).map(event => event.created || event.date).filter(Boolean).sort((a, b) => time(a) - time(b))[0];
      if (bath) add({ key: "bath", phase: "post", emoji: "🛁", title: "Prvé kúpanie", date: bath, source: "Rýchly záznam" });
    }

    // Ručné „Prvé razy“ a malé momenty (už existujúce zápisy z Naše momenty)
    (state.v5?.firstMoments || []).forEach(item => add({ key: "first-" + item.key, phase: pre(item.date), emoji: (CATALOG.find(entry => entry.key === item.key) || {}).emoji || "✨", title: item.label, date: item.date, photo: item.photo || "", source: "manual" }));
    (state.diary || []).filter(item => item.first100 || item.text || item.photo).forEach(item =>
      add({ key: "diary-" + (item.id || item.date), phase: pre(item.date || item.created), emoji: "📷", title: item.text ? String(item.text).slice(0, 70) : "Malý moment", date: item.date || item.created, photo: item.photo || "", source: "manual" }));

    // Ak sa ten istý kľúč objaví dvakrát (napr. prvý úsmev aj ručne), nechá sa prvý.
    const seen = new Set();
    return list.filter(item => !seen.has(item.key) && seen.add(item.key)).sort((a, b) => time(a.date) - time(b.date));
  }

  function dateText(value) {
    const hasTime = String(value).length > 10 && !/T12:00/.test(value);
    const d = new Date(String(value).length <= 10 ? value + "T12:00:00" : value);
    return d.toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" }) + (hasTime ? " o " + d.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" }) : "");
  }

  function timelineHtml() {
    const items = collect();
    const group = (phase, title, empty) => {
      const rows = items.filter(item => item.phase === phase);
      if (!rows.length && !empty) return "";
      return "<section class='v2-tl-group'><h3>" + esc(title) + "</h3>" + (rows.length ? "<ol class='v2-tl'>" + rows.map(item => [
        "<li class='v2-tl-item'><span class='v2-tl-dot' aria-hidden='true'>", item.emoji, "</span><div class='v2-tl-card'>",
        "<strong>", esc(item.title), "</strong><small>", esc(dateText(item.date)), item.source !== "manual" ? " · zapísané samo" : "", "</small>",
        item.text ? "<p>" + esc(item.text) + "</p>" : "",
        item.photo ? "<img src='" + esc(item.photo) + "' alt='' loading='lazy'>" : "",
        "</div></li>"
      ].join("")).join("") + "</ol>" : "<p class='v2-tl-empty'>" + esc(empty) + "</p>") + "</section>";
    };
    const expecting = state.profile?.status === "expecting";
    return [
      "<header class='v5-flow-head'><span class='v5-eyebrow'>Naše momenty</span><h1>Naša časová os</h1><p>Spomienky sa sem zapisujú samy – zo sona, pohybov, kartičky, narodenia či prvých razov. Nič nemusíš písať.</p></header>",
      group("post", "Spolu", expecting ? "" : "Prvé spoločné chvíle sa objavia tu."),
      group("pre", "Čakanie na teba", "Prvé spomienky pribudnú, keď si napríklad zapíšeš sono alebo prvé pohyby v Tehotenskej knižke."),
      "<button class='v5-secondary' type='button' data-v5-moments-home>Späť</button>"
    ].join("");
  }

  // ——— Prvé razy a „Stalo sa už?“ (bod 2) ———
  // Kedy sa appka opýta: CDC „Learn the Signs. Act Early“ (vek, do ktorého to zvládne väčšina detí, 75 %+;
  // overené 4. 11. 2026, stránky z 16. 5. 2026), lezenie WHO Motor Development Study 2006 (okno 5,2–13,5 mes.;
  // pýtame sa v jeho strede, 9. mes.), príkrm NHS „around 6 months“ (19. 2. 2026). Čas slúži LEN na to, kedy sa
  // opýtať – nikdy na hodnotenie. „Ešte nie“ = opýta sa o 4 týždne, najviac 3-krát, potom už nie.
  const CDC = "CDC – Learn the Signs. Act Early";
  const CATALOG = [
    { key: "heartbeat", phase: "pre", emoji: "💓", label: "Prvýkrát sme počuli srdiečko", askWeek: 12 },
    { key: "bump", phase: "pre", emoji: "🤰", label: "Prvá fotka bruška", askWeek: 16 },
    { key: "firstbuy", phase: "pre", emoji: "🧸", label: "Prvá vec pre bábätko", askWeek: 20 },
    { key: "partnerkick", phase: "pre", emoji: "🤲", label: "Pohyby cítil aj partner", askWeek: 24 },
    { key: "home", phase: "post", emoji: "🏡", label: "Prvý deň doma", askDays: 2 },
    { key: "grandparents", phase: "post", emoji: "👵", label: "Prvýkrát so starými rodičmi", askDays: 7 },
    { key: "walk", phase: "post", emoji: "🌳", label: "Prvá prechádzka", askDays: 10 },
    { key: "stroller", phase: "post", emoji: "🌙", label: "Prvé zaspatie v kočíku" },
    { key: "smile", phase: "post", emoji: "😊", label: "Prvý úsmev", askMonths: 2, source: CDC },
    { key: "laugh", phase: "post", emoji: "😄", label: "Prvý smiech", askMonths: 4, source: CDC },
    { key: "roll", phase: "post", emoji: "🔄", label: "Prvé pretočenie z bruška na chrbát", askMonths: 6, source: CDC },
    { key: "solids", phase: "post", emoji: "🥄", label: "Prvý príkrm", askMonths: 6, source: "NHS" },
    { key: "sit", phase: "post", emoji: "🪑", label: "Prvé sedenie bez opory", askMonths: 9, source: CDC },
    { key: "crawl", phase: "post", emoji: "🐾", label: "Prvé lezenie po štyroch", askMonths: 9, source: "WHO", note: "Niektoré deti štvornožkovanie preskočia – aj to je v poriadku." },
    { key: "mama", phase: "post", emoji: "🗣️", label: "Prvé „mama“ alebo „tata“", askMonths: 12, source: CDC },
    { key: "wave", phase: "post", emoji: "👋", label: "Prvé pápá", askMonths: 12, source: CDC },
    { key: "stand", phase: "post", emoji: "🧍", label: "Prvé postavenie sa", askMonths: 12, source: CDC },
    { key: "steps", phase: "post", emoji: "👣", label: "Prvé samostatné kroky", askMonths: 15, source: CDC },
    { key: "word", phase: "post", emoji: "💬", label: "Prvé slovo", askMonths: 15, source: CDC }
  ];
  const saved = key => (state.v5?.firstMoments || []).find(item => item.key === key);
  const prompts = () => { state.v5 ||= {}; return state.v5.firstPrompts ||= {}; };

  function duePrompt() {
    // Najviac jedna otázka za deň – po odpovedi ďalšia až zajtra (nie dotazník).
    if (state.v5?.lastPromptDay === todayKey()) return null;
    const expecting = state.profile?.status === "expecting";
    const p = prompts();
    const now = Date.now();
    const week = Number(window.GugubooPregnancyAvatar?.current?.().week || 0);
    const birth = state.profile?.birth;
    const days = birth ? Math.floor((dayDate(todayKey()) - dayDate(birth)) / DAY) : -1;
    return CATALOG.find(item => {
      if (saved(item.key)) return false;
      const status = p[item.key] || {};
      if (status.never || (status.asks || 0) >= 3 || (status.again && status.again > now)) return false;
      if (expecting) return item.phase === "pre" && item.askWeek && week >= item.askWeek;
      if (item.phase !== "post" || days < 0) return false;
      if (item.askDays !== undefined) return days >= item.askDays && days <= item.askDays + 30;
      return item.askMonths !== undefined && days >= item.askMonths * 30.4375;
    }) || null;
  }

  function promptCardHtml(item) {
    return [
      "<section class='v2-ask-card' aria-label='Stalo sa už?'>",
      "<button type='button' class='v2-ask-never' data-v2-first-never='", item.key, "' aria-label='Túto otázku už neukazovať'>×</button>",
      "<small>Stalo sa už?</small><div class='v2-ask-title'><span aria-hidden='true'>", item.emoji, "</span><strong>", esc(item.label), "</strong></div>",
      item.note ? "<p>" + esc(item.note) + "</p>" : "<p>Každé bábätko má vlastné tempo. Odpovedz, len ak chceš.</p>",
      "<div class='v2-ask-actions'><button type='button' class='v5-primary' data-v2-first-yes='", item.key, "'>Áno, dnes</button>",
      "<button type='button' class='v5-secondary' data-v2-first-earlier='", item.key, "'>Už skôr</button>",
      "<button type='button' class='v5-text-action' data-v2-first-later='", item.key, "'>Ešte nie</button></div>",
      "<div class='v2-ask-date' hidden><label>Kedy to bolo?<input type='date' max='", todayKey(), "' data-v2-first-date='", item.key, "'></label><button type='button' class='v5-primary' data-v2-first-date-save='", item.key, "'>Uložiť</button></div>",
      "</section>"
    ].join("");
  }

  // Zoznam „Prvé razy“ v Naše momenty – všetko na jedno ťuknutie, uložené s dátumom a časom.
  function firstsHtml() {
    const expecting = state.profile?.status === "expecting";
    const tile = item => {
      const entry = saved(item.key);
      return "<button type='button' class='" + (entry ? "is-saved" : "") + "' data-v5-first-moment='" + item.key + "' data-v5-first-label='" + esc(item.label) + "'><span class='v2-first-emoji' aria-hidden='true'>" + item.emoji + "</span><strong>" + esc(item.label) + "</strong><small>" + (entry ? esc(dateText(entry.date)) : "Ťukni, keď sa to stane") + "</small></button>";
    };
    const block = (phase, title) => "<h3 class='v2-book-group'>" + title + "</h3><div class='v5-first-moments-grid v2-first-grid'>" + CATALOG.filter(item => item.phase === phase).map(tile).join("") + "</div>";
    return [
      "<header class='v5-flow-head'><span class='v5-eyebrow'>Naše momenty</span><h1>Prvé razy</h1><p>Ťukni na okamih, keď sa stane – dátum a čas sa uložia samy a objavia sa v časovej osi. Opätovným ťuknutím ho zrušíš.</p></header>",
      expecting ? block("pre", "Čakanie na teba") + block("post", "Po narodení") : block("post", "Spolu") + block("pre", "Z čakania"),
      "<p class='v5-book-note'>Kedy sa appka sama opýta „Stalo sa už?“, vychádza z CDC (míľniky, ktoré do daného veku zvládne väčšina detí), WHO (lezenie) a NHS (príkrm). Slúži len na načasovanie otázky – nikdy na hodnotenie. Každé dieťa má vlastné tempo.</p>",
      "<button class='v5-secondary' type='button' data-v5-moments-home>Späť</button>"
    ].join("");
  }

  function saveFirst(key, date) {
    const item = CATALOG.find(entry => entry.key === key);
    if (!item || saved(key)) return;
    (state.v5.firstMoments ||= []).push({ key, label: item.label, date });
    state.v5.lastPromptDay = todayKey();
    V5.persist();
    V5.renderHome();
    V5.announce("Uložené do vašich spomienok.");
  }

  document.addEventListener("click", event => {
    const yes = event.target.closest("[data-v2-first-yes]");
    if (yes) return saveFirst(yes.dataset.v2FirstYes, nowIso());
    const earlier = event.target.closest("[data-v2-first-earlier]");
    if (earlier) { const box = earlier.closest(".v2-ask-card")?.querySelector(".v2-ask-date"); if (box) { box.hidden = false; box.querySelector("input")?.focus(); } return; }
    const dateSave = event.target.closest("[data-v2-first-date-save]");
    if (dateSave) {
      const input = dateSave.parentElement.querySelector("input");
      if (!input?.value) return V5.announce("Vyber dátum.");
      return saveFirst(dateSave.dataset.v2FirstDateSave, input.value);
    }
    const later = event.target.closest("[data-v2-first-later]");
    if (later) {
      const status = prompts()[later.dataset.v2FirstLater] ||= {};
      status.asks = (status.asks || 0) + 1;
      status.again = Date.now() + 28 * DAY;
      state.v5.lastPromptDay = todayKey();
      V5.persist();
      V5.renderHome();
      return V5.announce("Dobre, opýtame sa neskôr.");
    }
    const never = event.target.closest("[data-v2-first-never]");
    if (never) {
      (prompts()[never.dataset.v2FirstNever] ||= {}).never = true;
      state.v5.lastPromptDay = todayKey();
      V5.persist();
      V5.renderHome();
    }
  });

  // Domov: jedna citová karta – buď otázka „Stalo sa už?“, alebo (po pôrode) najbližší míľnik dní spolu.
  function homeCardHtml() {
    const ask = duePrompt();
    if (ask) return promptCardHtml(ask);
    return daysCardHtml();
  }

  // Domov po pôrode: „23. deň spolu“ + najbližší míľnik. Jemne, bez tlaku.
  function daysCardHtml() {
    const birth = state.profile?.status !== "expecting" && state.profile?.birth;
    if (!birth) return "";
    const day = Math.floor((dayDate(todayKey()) - dayDate(birth)) / DAY) + 1;
    if (day < 1) return "";
    // „X. deň spolu“ je už v pozdrave hore – karta ukazuje najbližší míľnik a vedie do spomienok.
    const left = n => n + (n === 1 ? " deň" : n < 5 ? " dni" : " dní");
    const title = day < 100 ? "Do 100 dní spolu: " + left(100 - day) : day < 365 ? "Do prvého roka: " + left(365 - day) : "Váš prvý rok je za vami";
    const count = collect().length;
    const sub = count ? "Pozri si vaše spomienky (" + count + ")" : "Spomienky sa budú zapisovať samy";
    return "<button type='button' class='v2-days-card' data-v2-moments-open='timeline'><span aria-hidden='true'>💛</span><span><strong>" + esc(title) + "</strong><small>" + esc(sub) + "</small></span><b aria-hidden='true'>›</b></button>";
  }

  function openMoments(section) {
    V5.openFeature("memories");
    state.v5.momentsSection = section || "timeline";
    V5.persist();
    V5.rerenderMoments?.();
  }
  document.addEventListener("click", event => {
    const open = event.target.closest("[data-v2-moments-open]");
    if (open) openMoments(open.dataset.v2MomentsOpen);
  });
  // Prehliadka: „Pozrieť spomienky“
  document.addEventListener("v2-open-timeline", () => openMoments("timeline"));

  window.GugubooMoments = { collect, timelineHtml, homeCardHtml, firstsHtml, catalog: CATALOG, mark: (key, value) => { const m = marks(); if (!m[key]) { m[key] = value || nowIso(); V5.persist(); } } };
  if (document.getElementById("home")?.classList.contains("active")) V5.renderHome();
})();

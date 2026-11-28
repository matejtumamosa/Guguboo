/*
 * GUGUBOO V2 – GuguChat a plán TERAZ / ČOSKORO na Domove.
 *
 * GuguChat nie je generický chatbot a zatiaľ nepoužíva AI model (rozhodnutie 28. 9. 2026):
 *   - rozumie typickým otázkam (zámery), odpovedá z obsahu Guguboo a z Journey Engine,
 *   - ku každej odpovedi ponúkne akciu (Začať, Už mám vybavené, Pripomeň mi, …),
 *   - pri varovných signáloch vždy eskaluje (155 / 112, pôrodnica, lekár) – nikdy nediagnostikuje,
 *   - čo nevie, povie úprimne a otázku si zapíše ako medzeru v znalostiach (produktové dáta).
 * Master 2.6: stav sa ukladá len v telefóne (localStorage, spolu s ostatným stavom).
 */
(function initGuguChat() {
  "use strict";

  if (typeof state === "undefined" || !window.GugubooJourney || !window.GugubooV5) return;

  const J = window.GugubooJourney;
  const V5 = window.GugubooV5;
  const byId = id => document.getElementById(id);
  const esc = V5.escapeHtml;
  const icon = V5.icon;
  const norm = value => String(value || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  state.v2 ||= {};
  state.v2.chat ||= [];
  state.v2.gaps ||= [];
  state.v2.log ||= [];

  const OFFICIAL = {
    slovensko: ["slovensko.sk", "https://www.slovensko.sk"],
    socpoist: ["Sociálna poisťovňa", "https://www.socpoist.sk"],
    mpsvr: ["Ministerstvo práce, sociálnych vecí a rodiny SR", "https://www.employment.gov.sk"]
  };

  // Jednoduché lokálne meranie hodnoty (GUGUBOO moment): odporúčanie → otvorené → hotové.
  function track(type, data = {}) {
    state.v2.log.push({ type, at: new Date().toISOString(), ...data });
    if (state.v2.log.length > 300) state.v2.log.splice(0, state.v2.log.length - 300);
  }

  function save() {
    V5.persist();
  }

  // ——— Otvorenie položky cesty ———
  function openItem(item) {
    if (!item) return;
    track("journey_open", { id: item.id });
    if (item.prep && V5.MASTER && V5.openPrep) return V5.openPrep(item.prep);
    if (item.prep && typeof window.openPrepSection === "function") return window.openPrepSection(item.prep);
    if (item.action === "quickRecord") return V5.openQuickRecord();
    if (item.action === "birth") return window.GugubooBirth?.open();
    if (item.action === "admin") return window.GugubooAdmin?.open(item.adminId);
    if (item.feature) return V5.openFeature(item.feature);
  }

  function remind(item, days = 7) {
    J.snooze(state, item.id, days);
    const date = new Date(Date.now() + days * 86400000);
    date.setHours(9, 0, 0, 0);
    state.reminders ||= [];
    state.reminders.push({ id: "v2-" + item.id + "-" + Date.now(), title: item.title, date: date.toISOString(), type: "Pripomienka", source: "guguchat" });
    track("journey_remind", { id: item.id, days });
    save();
    return date;
  }

  // ——— Obsah (týždne tehotenstva, Life Admin) – dáta so zdrojom a dátumom kontroly ———
  const CONTENT_FILES = ["content/pregnancy-weeks.js", "content/life-admin-sk.js", "content/mama-tehotenstvo.js", "content/mama-po-porode.js", "content/dieta-sk.js", "content/vybava.js", "content/baby-months.js"];
  const loadScript = src => new Promise(resolve => {
    const script = document.createElement("script");
    script.src = src + "?v=" + (window.GUGUBOO_V2_VERSION || "2.35.0");
    script.onload = resolve;
    script.onerror = resolve; // chýbajúci modul appku nezastaví – GuguChat povie, že obsah pripravujeme
    document.head.appendChild(script);
  });
  function loadContent() {
    return Promise.all(CONTENT_FILES.map(loadScript))
      .then(() => loadScript("v2-admin.js"))
      .then(() => window.GugubooAdmin?.registerJourney?.());
  }
  const content = () => window.GugubooContent || {};
  const formatChecked = iso => iso ? new Date(iso + "T12:00:00").toLocaleDateString("sk-SK", { day: "numeric", month: "numeric", year: "numeric" }) : "";

  // Pravidlo (Samuel 28. 9.): nič si nevymýšľať. Obsah sa zobrazí len ak je každé tvrdenie doložené
  // doslovným citátom zo zdroja a citát prešiel automatickou kontrolou (verification_status "evidence-verified").
  const evidenceVerified = module => module?.meta?.verification_status === "evidence-verified";

  // Porovnanie veľkosti ukazujeme iba s okrúhlym ovocím a zeleninou (rozhodol Samuel 11. 10.).
  // Podlhovasté porovnania zo zdroja (banán, uhorka…) sa vynechajú a ostane len overená dĺžka –
  // nič sa nenahrádza vymysleným ovocím.
  const NOT_ROUND = ["banán", "mrkv", "batat", "mango", "kukuričn", "cuket", "uhork", "baklažán", "butternut", "zeler", "rímsk", "pór", "rebarbor", "avokád", "ananás", "makov", "sezam"]; // makové zrnko a sezam nie sú ovocie ani zelenina
  function roundOnlySize(text) {
    return String(text || "").replace(/\s*\(([^)]*)\)/, (match, inside) =>
      NOT_ROUND.some(word => inside.toLowerCase().includes(word)) ? "" : match).trim();
  }

  // Miniaplikácia „Aké veľké je bábätko“: dĺžka zo zdroja NHS + hravé okrúhle prirovnanie.
  // Kde NHS uvádza okrúhly plod, použije sa ten. Pri podlhovastých (banán, uhorka…) je tu
  // približné okrúhle prirovnanie podľa hmotnosti – v UI vždy označené ako orientačné
  // (Samuel 11. 10.: „môže to byť približne, nie presné“).
  const APPROX_ROUND = {
    16: "pomaranč", 20: "grapefruit", 21: "veľký grapefruit", 22: "pomelo", 23: "veľké pomelo",
    24: "hlávka ľadového šalátu", 25: "hlávka ľadového šalátu", 26: "malý karfiol", 28: "veľký karfiol",
    29: "tekvica hokkaido", 32: "tekvica hokkaido", 33: "malý melón", 36: "veľký medový melón",
    37: "malý vodový melón", 38: "malý vodový melón", 42: "vodový melón"
  };
  const FRUIT_EMOJI = [
    ["mak", "•"], ["sezam", "•"], ["hrášok", "🫛"], ["hrozn", "🍇"], ["malin", "🫐"], ["jahod", "🍓"],
    ["marhuľ", "🍑"], ["fig", "🟣"], ["slivk", "🟣"], ["broskyň", "🍑"], ["kiwi", "🥝"], ["granát", "🍎"],
    ["jablk", "🍎"], ["pomaranč", "🍊"], ["grapefruit", "🍊"], ["pomel", "🍈"], ["paprik", "🫑"],
    ["paradajk", "🍅"], ["šalát", "🥬"], ["karfiol", "🥦"], ["kapust", "🥬"], ["kokos", "🥥"],
    ["hokkaido", "🟠"], ["vodový melón", "🍉"], ["melón", "🍈"], ["tekvic", "🟠"]
  ];
  function babySize(weekNumber) {
    const entry = pregnancyWeek(weekNumber);
    if (!entry) return null;
    const raw = content().pregnancyWeeks.weeks[entry.week];
    const rawSize = (Array.isArray(raw.size) ? raw.size[0]?.sk : raw.size?.sk) || "";
    const inside = (rawSize.match(/\(([^)]*)\)/) || [])[1] || "";
    const nhsRound = inside && !NOT_ROUND.some(word => inside.toLowerCase().includes(word));
    const comparison = nhsRound ? inside.replace(/^(veľkosťou aj váhou\s+)?ako\s+/, "") : APPROX_ROUND[entry.week] || "";
    // 42. týždeň nemá v NHS dĺžku (len „Tehotenstvo zvyčajne trvá…“) – vtedy bez dĺžky.
    const length = /\d\s*(mm|cm|kg)/.test(rawSize) ? rawSize.replace(/\s*\([^)]*\)/, "").replace(/,\s*odteraz.*$/, "").trim() : "";
    const emoji = (FRUIT_EMOJI.find(([key]) => comparison.toLowerCase().includes(key)) || [, "🌱"])[1];
    return { week: entry.week, length, comparison, emoji, approximate: !nhsRound && Boolean(comparison), baby: entry.baby, you: entry.you, tip: entry.tip, milestone: entry.milestone, source: entry.source_urls[0] || "" };
  }

  // Týždeň z overeného obsahu (každá veta má citát v `evidence`) → jednoduchý tvar pre UI.
  function pregnancyWeek(weekNumber) {
    const module = content().pregnancyWeeks;
    if (!evidenceVerified(module) || !weekNumber) return null;
    const week = Math.min(42, Math.max(4, weekNumber));
    const raw = module.weeks?.[week];
    if (!raw) return null;
    const text = value => Array.isArray(value) ? value.map(item => item?.sk).filter(Boolean).join(" ") : value?.sk || "";
    const entry = { week, size: roundOnlySize(text(raw.size)), baby: text(raw.baby), you: text(raw.you), tip: text(raw.tip), milestone: text(raw.milestone), source_urls: raw.source_url ? [raw.source_url] : [] };
    return entry.baby || entry.you ? entry : null;
  }

  function weekEntry(ctx) {
    if (ctx.pregnancy_week === null) return null;
    return pregnancyWeek(ctx.pregnancy_week);
  }

  function sourceLine(entry, meta) {
    const url = entry.source_urls?.[0];
    const name = Object.values(content().pregnancyWeeks?.sources || {})[0]?.name || "NHS";
    if (!url) return "";
    return "<a class='v2-source' href='" + esc(url) + "' target='_blank' rel='noopener noreferrer'>Zdroj: " + esc(name.split(" – ")[0]) + " · overené " + esc(formatChecked(meta?.last_checked)) + " ↗</a>"; // Master 4.0 (Audit T36)
  }

  function weekHtml(ctx) {
    const entry = weekEntry(ctx);
    if (!entry) return "";
    const meta = content().pregnancyWeeks.meta;
    return [
      "<section class='v2-week' aria-label='Tento týždeň'>",
      "<header><small>Tento týždeň</small><h2>", entry.week, ". týždeň</h2>", entry.size ? "<span class='v2-week-size'>" + esc(entry.size) + "</span>" : "", "</header>",
      entry.milestone ? "<p class='v2-week-milestone'>✦ " + esc(entry.milestone) + "</p>" : "",
      entry.baby ? "<div class='v2-week-block'><strong>Bábätko</strong><p>" + esc(entry.baby) + "</p></div>" : "",
      entry.you || entry.tip ? "<details class='v2-week-more'><summary>Ty a tip na tento týždeň</summary>" : "",
      entry.you ? "<div class='v2-week-block'><strong>Ty</strong><p>" + esc(entry.you) + "</p></div>" : "",
      entry.tip ? "<div class='v2-week-block v2-week-tip'><strong>Tip</strong><p>" + esc(entry.tip) + "</p></div>" : "",
      "</details>",
      sourceLine(entry, meta),
      "</section>"
    ].join("");
  }

  // ——— Domov: TERAZ / ČOSKORO ———
  const typeIcon = { task: "checklist", moment: "memory", tool: "sparkle", transition: "baby" };

  function journeyCard(item) {
    return [
      "<article class='v2-journey-card v2-journey-", item.type, "'>",
      "<button class='v2-journey-main' type='button' data-v2-journey-open='", esc(item.id), "'>",
      "<span class='v5-icon'>", icon(typeIcon[item.type] || "sparkle"), "</span>",
      "<span class='v2-journey-text'><strong>", esc(item.title), "</strong><small>", esc(item.note || item.why || ""), "</small></span>",
      "<span class='v5-row-arrow' aria-hidden='true'>" + window.GugubooV5.glyph("chevronRight") + "</span></button>",
      item.type === "task" ? [
        "<div class='v2-journey-actions'>",
        "<button type='button' data-v2-journey-done='", esc(item.id), "'>" + window.GugubooV5.glyph("check") + " Vybavené</button>", // Master 3.9 (QA D2): fajka ako ikona
        "<button type='button' data-v2-journey-snooze='", esc(item.id), "'>Pripomeň o týždeň</button>",
        "</div>"
      ].join("") : "",
      "</article>"
    ].join("");
  }

  function homeJourneyHtml() {
    const plan = J.compute(state);
    const ctx = plan.context;
    if (ctx.life_stage === "setup") {
      return "<section class='v2-journey'><header><small>Tvoja cesta</small><h2>Najprv jeden údaj</h2></header>" +
        "<button class='v5-today-card' type='button' data-v5-feature='profiles'><span class='v5-icon'>" + icon("calendar") + "</span><div><small>Teraz</small><strong>Doplň termín alebo dátum narodenia</strong><span class='v5-today-hint'>Ukážeme ti, čo je teraz dôležité.</span></div><span class='v5-row-arrow'>" + window.GugubooV5.glyph("chevronRight") + "</span></button></section>";
    }
    const now = plan.what_is_relevant_now;
    const soon = plan.what_is_coming;
    const later = plan.counts.later;
    return [
      weekHtml(ctx),
      "<section class='v2-journey' aria-label='Tvoj plán'>",
      "<header><small>", esc(J.stageLabel(ctx)), "</small><h2>Teraz</h2></header>",
      now.length ? now.map(journeyCard).join("") : "<p class='v2-journey-empty'>Na dnes je hotovo. Užívaj si deň.</p>",
      soon.length ? [
        "<div class='v2-journey-soon'><h3>Čoskoro</h3>",
        soon.map(item => "<button type='button' data-v2-journey-open='" + esc(item.id) + "'><span>" + esc(item.title) + "</span><em>o " + item.startsInDays + " " + (item.startsInDays === 1 ? "deň" : item.startsInDays < 5 ? "dni" : "dní") + "</em></button>").join(""),
        "</div>"
      ].join("") : "",
      plan.transition ? "<button class='v2-journey-transition' type='button' data-v2-birth-open><span aria-hidden='true'>♡</span><span><strong>Bábätko je na svete?</strong><small>Prepnúť na prvé dni</small></span><span class='v5-row-arrow' aria-hidden='true'>" + window.GugubooV5.glyph("chevronRight") + "</span></button>" : "",
      "<footer class='v2-journey-later'><span>", later ? "Ďalších " + later + " vecí počká. Keď príde čas, ozvem sa." : "Zvyšok počká. Keď príde čas, ozvem sa.", "</span>",
      // Bez tlačidla „Opýtať sa GuguChatu“ – GuguChat je v strede spodnej lišty (Samuel 4. 11.).
      "</footer>",
      "</section>"
    ].join("");
  }

  // ——— Master (K-4): na domove len JEDNA vec („Dnes stačí jedno“), celý zoznam v okne Plán ———
  // Domov bez posúvania (Samo 13. 11.): „Dnes stačí jedno“ je jeden riadok – ťuk otvorí úlohu (tam je Pozrieť, Neskôr a celý plán).
  function homeTodayHtml() {
    const plan = J.compute(state);
    const ctx = plan.context;
    if (ctx.life_stage === "setup") return homeJourneyHtml();
    const hour = new Date().getHours();
    if ((hour >= 22 || hour < 6) && ctx.life_stage !== "pregnancy") return ""; // v noci po pôrode žiadne úlohy
    const row = (label, title, attrs, later) => "<section class='g2-today g2-today-row' aria-label='" + esc(label) + "'><button class='g2-today-main' type='button' " + attrs + "><small>" + esc(label) + "</small><strong>" + esc(title) + "</strong></button>" +
      (later ? "<button class='g2-today-later' type='button' data-v2-journey-snooze='" + esc(later) + "'>Neskôr</button>" : "<span class='g2-today-arrow' aria-hidden='true'>" + window.GugubooV5.glyph("chevronRight") + "</span>") + "</section>";
    // Samo 13. 11.: v riadku „Dnes“ je vždy vec, ktorú treba vybaviť, kúpiť alebo pripraviť.
    // „Bábätko je na svete?“ len keď na dnes nič netreba (inak je v Pláne).
    const item = plan.what_is_relevant_now.find(entry => !/na svete/i.test(entry.title || ""));
    if (item) return row("Dnes stačí jedno", item.title, "data-v2-journey-open='" + esc(item.id) + "'", item.type === "task" ? item.id : "");
    if (plan.transition && (ctx.pregnancy_week || 0) >= 37) return row("Keď príde čas", "Bábätko je na svete?", "data-v2-birth-open", "");
    return row("Dnes stačí jedno", "Hotovo · celý plán", "data-g2-plan", "");
  }
  function planHtml() {
    const plan = J.compute(state);
    const ctx = plan.context;
    if (ctx.life_stage === "setup") return homeJourneyHtml();
    const now = plan.what_is_relevant_now;
    const soon = plan.what_is_coming;
    return [
      "<p class='g2-lead'>Keď príde čas, ozvem sa.</p>",
      "<section class='v2-journey g2-plan-list' aria-label='Plán'><header><small>", esc(J.stageLabel(ctx)), "</small><h2>Teraz</h2></header>",
      now.length ? now.map(journeyCard).join("") : "<p class='v2-journey-empty'>Na teraz je hotovo.</p>",
      soon.length ? "<div class='v2-journey-soon'><h3>Čoskoro</h3>" + soon.map(item => "<button type='button' data-v2-journey-open='" + esc(item.id) + "'><span>" + esc(item.title) + "</span><em>" + (item.startsInDays <= 7 ? "budúci týždeň" : "o pár týždňov") + "</em></button>").join("") + "</div>" : "",
      plan.transition ? "<button class='v2-journey-transition' type='button' data-v2-birth-open><span aria-hidden='true'>♡</span><span><strong>Bábätko je na svete?</strong><small>Prepnúť na prvé dni</small></span><span class='v5-row-arrow' aria-hidden='true'>" + window.GugubooV5.glyph("chevronRight") + "</span></button>" : "",
      "</section>",
      "<button class='v5-row-card g2-plan-areas' type='button' data-g2-org><span class='v5-icon'>", icon("checklist"), "</span><div><strong>Príprava podľa oblastí</strong><span>Domov, taška, doklady</span></div><span class='v5-row-arrow'>" + window.GugubooV5.glyph("chevronRight") + "</span></button>"
    ].join("");
  }
  // Pre hero domova: prvá veta o bábätku z overeného obsahu týždňa (NHS).
  function heroWeek(weekNumber) {
    const s = babySize(weekNumber);
    if (!s) return null;
    const first = (s.baby || "").split(/(?<=\.)\s/)[0] || "";
    return { week: s.week, line: first, length: s.length, comparison: s.comparison };
  }

  function betaFooterHtml() {
    return "<aside class='v2-beta-note'><span><strong>Beta verzia " + (window.GUGUBOO_V2_VERSION || "") + "</strong> · údaje sú uložené len v tomto telefóne</span><span class='v2-beta-actions'><button type='button' data-v2-feedback>Dať spätnú väzbu</button>" + (V5.MASTER ? "" : "<button type='button' data-v2-tour-restart>Ukázať prehliadku</button><button type='button' data-v2-reset>Začať odznova</button>") + "</span></aside>";
  }

  // ——— Spätná väzba z bety (brief body 38–40) ———
  // Bez servera: testerka odpovie na 3 otázky a stiahne si súbor, ktorý pošle tímu.
  // Súbor obsahuje len anonymné súčty udalostí a otázky bez odpovede – žiadne profilové údaje.
  function metrics() {
    const log = state.v2.log || [];
    const count = type => log.filter(entry => entry.type === type).length;
    const proactive = log.filter(entry => entry.type === "chat_proactive" && entry.item).map(entry => entry.item);
    const doneIds = new Set(log.filter(entry => entry.type === "journey_done").map(entry => entry.id));
    return {
      stage: J.context(state).life_stage,
      journey_opened: count("journey_open"),
      journey_done: count("journey_done"),
      journey_reminded: count("journey_remind"),
      chat_questions: count("chat_ask"),
      chat_unanswered: count("chat_gap"),
      // „GUGUBOO moment“: odporúčanie, ktoré Guguboo prinieslo samo, a používateľka ho dokončila.
      guguboo_moments: proactive.filter(id => doneIds.has(id)).length,
      birth_recorded: count("birth_recorded") > 0
    };
  }

  function feedbackHtml() {
    const option = (name, value, label) => "<label class='v2-feedback-option'><input type='radio' name='" + name + "' value='" + value + "'><span>" + label + "</span></label>";
    return [
      "<header class='v2-birth-head'><span class='v2-birth-heart' aria-hidden='true'>✦</span><h2 id='v2FeedbackTitle'>Ako sa ti páči Guguboo?</h2><p>Tri krátke otázky nám pomôžu spraviť ho lepším.</p></header>",
      "<form class='v5-form-card v2-birth-form' id='v2FeedbackForm'>",
      "<fieldset><legend>Pomohlo ti dnes Guguboo?</legend><div class='v2-feedback-options'>", option("helped", "yes", "Áno"), option("helped", "bit", "Trochu"), option("helped", "no", "Nie"), "</div></fieldset>",
      "<fieldset><legend>Potrebuješ popri Guguboo ešte inú appku?</legend><div class='v2-feedback-options'>", option("second_app", "no", "Nie"), option("second_app", "maybe", "Možno"), option("second_app", "yes", "Áno"), "</div></fieldset>",
      "<label>Čo ti chýbalo alebo ťa potešilo? – nepovinné<textarea id='v2FeedbackText' rows='3' placeholder='Napíš pár slov…'></textarea></label>",
      "<button class='v5-primary' type='submit'>Stiahnuť spätnú väzbu</button>",
      "</form>",
      "<p class='v2-birth-note'>Stiahne sa malý súbor – pošli ho, prosím, tímu Guguboo. Neobsahuje tvoje meno ani dátumy.</p>"
    ].join("");
  }

  function openFeedback() {
    let overlay = byId("v2FeedbackOverlay");
    if (!overlay) {
      document.body.insertAdjacentHTML("beforeend", "<div id='v2FeedbackOverlay' class='v2-birth-overlay' aria-hidden='true'><section class='v2-birth-sheet' role='dialog' aria-modal='true' aria-labelledby='v2FeedbackTitle'><button class='v5-icon-button v2-birth-close' type='button' data-v2-feedback-close aria-label='Zavrieť'>" + window.GugubooV5.glyph("close") + "</button><div id='v2FeedbackBody'></div></section></div>");
      overlay = byId("v2FeedbackOverlay");
    }
    byId("v2FeedbackBody").innerHTML = feedbackHtml();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeFeedback() {
    const overlay = byId("v2FeedbackOverlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function downloadFeedback(form) {
    const data = new FormData(form);
    const payload = {
      app: "guguboo-m-beta", created: new Date().toISOString().slice(0, 10),
      answers: { helped: data.get("helped") || null, second_pregnancy_app: data.get("second_app") || null, note: byId("v2FeedbackText").value.trim() || null },
      metrics: metrics(),
      // Master: doslovné otázky sa neposielajú (môžu obsahovať citlivé údaje) – len ich počet.
      unanswered_questions_count: (state.v2.gaps || []).length
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "guguboo-beta-spatna-vazba-" + payload.created + ".json";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => { URL.revokeObjectURL(link.href); link.remove(); }, 500);
    track("feedback_sent");
    byId("v2FeedbackBody").innerHTML = "<header class='v2-birth-head'><span class='v2-birth-heart' aria-hidden='true'>❤️</span><h2 id='v2FeedbackTitle'>Ďakujeme!</h2><p>Súbor sa stiahol. Pošli ho, prosím, tímu Guguboo.</p></header><div class='v2-birth-actions'><button class='v5-secondary' type='button' data-v2-feedback-close>Zavrieť</button></div>";
  }

  // ——— GuguChat: zámery ———
  const has = (text, words) => words.some(word => text.includes(word));

  function planAnswer(ctx, plan, focus) {
    const items = [...plan.what_is_relevant_now, ...plan.what_is_coming];
    if (!items.length) return { text: "Teraz nemáš nič naliehavé. Keď sa niečo priblíži, ozvem sa.", actions: [] };
    const tasks = focus === "tasks" ? items.filter(item => item.type === "task") : items;
    const first = tasks[0] || items[0];
    const lines = tasks.slice(0, 4).map(item => "• " + item.title + (item.horizon === "soon" ? " (o " + item.startsInDays + " dní)" : ""));
    const intro = focus === "tasks"
      ? (tasks.length === 1 ? "Z dôležitých vecí ti zostáva jedna." : "Z dôležitých vecí ti zostávajú " + tasks.length + ".")
      : "Teraz je dôležité:";
    return {
      text: intro + "\n" + lines.join("\n"),
      item: first.id,
      actions: itemActions(first)
    };
  }

  function itemActions(item) {
    const list = [{ label: "Začať", kind: "open", value: item.id }, { label: "Vysvetli mi to", kind: "explain", value: item.id }];
    if (item.type === "task") {
      list.push({ label: "Pripomeň o týždeň", kind: "remind", value: item.id });
      list.push({ label: "✓ Vybavené", kind: "done", value: item.id });
    }
    return list;
  }

  function itemAnswer(id, fallbackText) {
    const item = J.item(id);
    const plan = J.compute(state);
    const placed = [...plan.what_is_relevant_now, ...plan.what_is_coming, ...plan.later, ...plan.done].find(entry => entry.id === id);
    if (!item) return { text: fallbackText, actions: [] };
    if (placed?.done) return { text: "„" + item.title + "“ už máš hotové.", actions: [{ label: "Otvoriť", kind: "open", value: id }, { label: "Vrátiť ako nehotové", kind: "undo", value: id }] };
    const when = !placed ? "" : placed.horizon === "now" ? "Teraz je na to vhodný čas." : placed.horizon === "soon" ? "Bude to aktuálne o " + placed.startsInDays + " dní." : "Na toto je ešte čas – ozvem sa.";
    return { text: item.title + ".\n" + (item.why || "") + (when ? "\n\n" + when : ""), item: id, actions: itemActions(item) };
  }

  // ——— Sprievodca appkou (Samuel 4. 11.): „kde sú fotky?“, „kde mám uspávanky?“ → krátka odpoveď + tlačidlo,
  // ktoré to rovno otvorí. Spustí sa len pri otázke typu kde/ako/otvor/chcem…, aby nekradol iné odpovede.
  // go = "funkcia|selektor": otvorí funkciu a v nej ťukne na danú časť (napr. sekciu Knižky).
  const NAV_INTENT = ["kde ", "kde?", "ako ", "otvor", "najdem", "najst", "chcem", "ukaz", "zapis", "zapisat", "pridat", "pridam", "nahra", "mozem", "potrebujem", "zobraz", "pozriet", "pozriem", "vytvor", "spravit", "urobit"];
  const NAV = [
    // Spomienky
    { words: ["album"], text: "Albumy (Naše čakanie, 100 dní spolu, Moje prvé, Prvý rok) sú v Našich momentoch.", label: "Albumy", go: "moments:albums" },
    { words: ["fotk", "fotograf", "spomien", "moment", "casova os", "casovu os"], text: "Fotky a spomienky sú v Našich momentoch – v časovej osi sa zapisujú samy.", label: "Časová os", go: "moments:timeline" },
    { words: ["prve razy", "prvy raz", "prvy usmev", "prve kroky", "prve slovo"], text: "Prvé razy zapíšeš jedným ťuknutím v Našich momentoch.", label: "Prvé razy", go: "moments:firsts" },
    { words: ["uspavank", "nahravk", "nahrat hlas", "moj hlas", "nahrany hlas", "nahrane"], text: "Nahrávky tvojím hlasom sú v Môj hlas pre bábätko. Po narodení ich nájdeš aj v Spánku a zvukoch.", label: "Môj hlas pre bábätko", feature: "voice" },
    { words: ["dennik", "nalad", "list babatku", "listy babatku"], text: "Môj súkromný denník je v časti Mama – chránený PIN-om.", label: "Môj súkromný denník", feature: "privateSpace" },
    { words: ["oznamit tehotenstvo", "oznamenie tehotenstva", "oznamit blizkym", "kartick oznam"], stage: "pre", text: "Kartičku na oznámenie tehotenstva vytvoríš v Našich momentoch alebo priamo tu.", label: "Vytvoriť kartičku", feature: "announce" },
    { words: ["kartick"], stage: "post", text: "Kartičku narodenia vytvoríš, upravíš alebo znova pošleš tu.", label: "Kartička narodenia", feature: "cards" },
    // Tehotenská knižka
    { words: ["sono", "ultrazvuk", "vysledk"], stage: "pre", text: "Výsledky vyšetrení (aj s fotkou sona) sú v Tehotenskej knižke.", label: "Výsledky vyšetrení", go: "pregnancy|[data-v5-book-section='results']" },
    { words: ["zapis z kontrol", "zapisy z kontrol", "zapisat kontrol", "z kontroly"], stage: "pre", text: "Zápisy z kontrol sú v Tehotenskej knižke.", label: "Zápisy z kontrol", go: "pregnancy|[data-v5-book-section='visits']" },
    { words: ["hmotnost", "tlak"], stage: "pre", text: "Hmotnosť a tlak sa ukazujú v Tehotenskej knižke zo zápisov z kontrol.", label: "Hmotnosť a tlak", go: "pregnancy|[data-v5-book-section='weight']" },
    { words: ["pohyb", "kopan"], stage: "pre", text: "Pohyby zapíšeš v kruhu na domove – diel Pohyby. Zápisy nájdeš aj v Tehotenskej knižke.", label: "Pohyby bábätka", go: "pregnancy|[data-v5-book-section='moves']" },
    { words: ["plan porodu"], stage: "pre", text: "Plán pôrodu je v Tehotenskej knižke.", label: "Plán pôrodu", go: "pregnancy|[data-v5-book-section='birthplan']" },
    { words: ["otazky pre lekar", "otazku pre lekar", "otazky na kontrol"], stage: "pre", text: "Otázky pre lekára si pripravíš v Tehotenskej knižke.", label: "Otázky pre lekára", go: "pregnancy|[data-v5-book-section='questions']" },
    { words: ["knizk"], stage: "pre", text: "Tehotenská knižka je v časti Bábätko.", label: "Tehotenská knižka", feature: "pregnancy" },
    { words: ["task", "do porodnice", "priprav"], stage: "pre", text: "Taška do pôrodnice a príprava domova sú v Príprave na pôrod.", label: "Príprava na pôrod", feature: "beforeBirth" },
    { words: ["ake velke", "velkost babatka", "ovoci"], stage: "pre", text: "Ťukni na týždeň na domove – otvorí sa Tvoj týždeň.", label: "Tvoj týždeň", feature: "babySize" },
    { words: ["menstruacny kalendar", "kalendar menstru", "zapisat menstru", "zapisem menstru", "zapis menstru", "sledovat menstru", "dlzka cyklu", "kalendar cyklu"], stage: "post", text: "Menštruačný kalendár je v časti Mama.", label: "Menštruačný kalendár", feature: "period" },
    { words: ["telo", "tazkost", "pitny rezim", "pitie", "okienko mama"], text: "Tvoje telo, čo je bežné, jedlo a pitný režim sú v časti Mama.", label: "Mama", feature: "mama" },
    // Po pôrode
    { words: ["ockovan"], stage: "post", text: "Očkovania zapíšeš v Zdravotnej knižke dieťaťa.", label: "Očkovanie", go: "childBook|[data-v2-child-section='vaccines']" },
    { words: ["prehliadk", "pediatr"], stage: "post", text: "Prehliadky u pediatra (aj nárok podľa zákona) sú v Zdravotnej knižke dieťaťa.", label: "Prehliadky", go: "childBook|[data-v2-child-section='checks']" },
    { words: ["rast", "vaha", "vyska", "dlzka", "meran"], stage: "post", text: "Rast (hmotnosť a dĺžka v grafe) je v Zdravotnej knižke dieťaťa.", label: "Rast", go: "childBook|[data-v2-child-section='growth']" },
    { words: ["zdravotn"], stage: "post", text: "Zdravotná knižka dieťaťa je v časti Bábätko.", label: "Zdravotná knižka", feature: "childBook" },
    { words: ["zubk", "zub"], stage: "post", text: "Zúbky nájdeš v časti Bábätko alebo keď potiahneš spodnú lištu nahor.", label: "Zúbky", feature: "teeth" },
    { words: ["aktivit", "hrat sa", "hry "], stage: "post", text: "Aktivity podľa veku sú v časti Bábätko.", label: "Aktivity", feature: "activities" },
    // Praktické
    { words: ["kalendar", "termin", "pripomien"], text: "Všetky termíny a pripomienky sú v Kalendári.", label: "Kalendár", feature: "calendar" },
    { words: ["kontakt", "telefon"], text: "Kontakty na lekára, pôrodnicu a blízkych sú v Dôležitých kontaktoch (časť Rodina).", label: "Dôležité kontakty", feature: "contacts" },
    { words: ["nakup", "nakupn"], text: "Spoločný nákupný zoznam je v Nákupe.", label: "Nákup", feature: "shopping" },
    { words: ["profil", "nastaven", "zmenit meno", "zmenit udaje", "upravit udaje"], text: "Profil (tvoj aj bábätka) a nastavenia nájdeš vo Všetko – Nastavenia a profil.", label: "Nastavenia a profil", feature: "profiles" },
    { words: ["nocny rezim", "tmavy rezim"], text: "Nočný režim zapneš tlačidlom s mesiacom vpravo hore na domove." },
    { words: ["zasuvk", "vsetky aplikacie", "dalsie aplikacie", "menu"], text: "Všetko nájdeš, keď potiahneš spodnú lištu nahor – zoradené ako Bábätko, Mama a Rodina.", label: "Všetko", kind: "drawer" }
  ];

  function navAnswer(t, ctx) {
    const pre = ctx.life_stage === "pregnancy";
    // Všeobecná otázka o appke → prehľad najdôležitejších miest + prehliadka.
    if (["kde co najdem", "kde co je", "co vsetko vie", "co vsetko je v aplik", "ako funguje aplik", "ako funguje guguboo", "co vie aplik", "co vie guguboo", "ako pouzivat", "napoveda"].some(word => t.includes(word))) {
      return {
        level: "nav",
        text: "Najdôležitejšie miesta:\n• " + (pre ? "Tehotenská knižka – kontroly, výsledky, sono, plán pôrodu" : "Zdravotná knižka – prehliadky, rast, očkovanie") +
          "\n• Mama – tvoje telo, čo je bežné, Pitný režim a nálada\n• Plán (Rodina) – čo ťa čaká a čo vybaviť\n• Čas pre teba – navrchu v Mame, len pre tvoju pohodu\n• Rýchle záznamy (kruh na domove) – kŕmenie, spánok, pohyby…\n• Kalendár – všetky termíny\n• Naše momenty – fotky, prvé razy a albumy (zapisujú sa samy)\n• Všetko – potiahni spodnú lištu nahor\n\nStačí sa ma opýtať napríklad „Kde sú fotky?“ a otvorím ti to.",
        actions: [
          { label: pre ? "Tehotenská knižka" : "Zdravotná knižka", kind: "feature", value: pre ? "pregnancy" : "childBook" },
          { label: "Naše momenty", kind: "go", value: "moments:timeline" },
          { label: "Všetko", kind: "drawer", value: "" },
          { label: "Ukázať prehliadku", kind: "tour", value: "" }
        ]
      };
    }
    if (!NAV_INTENT.some(word => t.includes(word))) return null;
    const entry = NAV.find(item => (!item.stage || (item.stage === "pre") === pre) && item.words.some(word => t.includes(word)));
    if (!entry) return null;
    const action = entry.feature ? { label: entry.label, kind: "feature", value: entry.feature }
      : entry.go ? { label: entry.label, kind: "go", value: entry.go }
      : entry.kind ? { label: entry.label, kind: entry.kind, value: "" } : null;
    return { level: "nav", text: entry.text, actions: action ? [action] : [] };
  }

  // ——— Odpovede z overeného obsahu appky (bod 2): Mama v tehotenstve a po pôrode, prehliadky, príkrmy.
  // Len to, čo appka má so zdrojom – každá odpoveď so zdrojom a dátumom; nič z pamäte.
  const TROUBLE_WORDS = {
    nausea: ["nevoln", "vracan", "vraciam", "grcam", "zle od zaludka", "zle mi od zaludka", "zle na vracanie", "nevolno"],
    heartburn: ["palenie zahy", "palenie v hrudi", "palenie v zaludku", "zgaga"],
    cramp: ["krc"],
    swelling: ["opuch", "opuchnut"],
    tiredness: ["unav", "nemozem spat", "nespavost", "zle spim"],
    constipation: ["zapch", "nemozem na stolicu", "tazka stolica"],
    bleeding: ["krvac", "ocistk", "vytok po porode"],
    stitches: ["steh", "hradz", "nastrihnut"],
    csection: ["cisar", "jazva", "rana po"],
    toilet: ["hemoroid", "mocen", "stolic", "na wc"],
    breasts: ["prsia", "prsnik", "prsiach", "prsi ", "mastit", "nalievan", "bradavk"],
    pelvic: ["panvov", "brusne svaly", "brucho po porode", "unik moc"],
    serious: ["na co si dat pozor", "kedy volat", "kedy ist k lekarovi", "nebezpecne priznaky"]
  };
  function sourceAction(url) { return url ? [{ label: "Zdroj", kind: "link", value: url }] : []; }
  // Master 2.7 – „informujeme, neradíme“ (INFORMUJEME_TEXTY.md §2): jeden tvar zdravotnej odpovede –
  // čo je bežné (zo zdroja) · kam ťa zavediem · jedna veta „kedy sa ozvať“ · ponuka zapísať otázku · zdrojový riadok.
  // Vety „kedy sa ozvať“ a výnimky E1–E7 sú na jednom mieste v g2-safety.js (window.G2Safety).
  const SAFE = () => window.G2Safety || { line: {}, E: {}, CHECKED: "15. 11. 2026" };
  const safeSourceLine = () => "Zdroj: NHS · overené " + SAFE().CHECKED; // Master 4.0 (Audit T36)
  const askAction = (who, value) => ({ label: who === "baby" ? "Zapísať ako otázku pre pediatra" : "Zapísať ako otázku pre lekára", kind: who === "baby" ? "pedq" : "docq", value: value || "" });
  function troubleAnswer(item, checked, section) {
    const S = SAFE();
    const every = section === "post" ? "Každé telo sa zotavuje inak." : "Každé tehotenstvo je iné.";
    const info = item.info?.length ? "\n\nČo uvádza NHS:\n" + item.info.map(line => "• " + line).join("\n") : "";
    const when = item.askText || S.line[item.ask] || S.line.gyn || "";
    const safety = item.safety && S.E[item.safety] ? "\n\n" + S.E[item.safety].text : "";
    return {
      level: "content",
      text: item.title + "\n\n" + (item.common || []).join(" ") + " " + every + info + "\n\nViac nájdeš v časti " + (section === "post" ? "Telo po pôrode" : "Čo je bežné") + ".\n\n" + when + safety + "\n\nChceš si to zapísať ako otázku?\n\n" + safeSourceLine(),
      actions: [askAction("me", item.askPrompt || item.title), { label: section === "post" ? "Telo po pôrode" : "Čo je bežné", kind: "go", value: "mama|[data-v2-mama-section='troubles']" }, ...sourceAction(item.source)]
    };
  }
  // „Pripravená postieľka“ (audit časť 3, #45) – kontrolný zoznam zo zdroja v Domove pre bábätko.
  // Master 4.0 (Audit Z41, Z8): GugubooV5.cribList() neexistovala – odpoveď sa nikdy nezobrazila. Teraz bez postupu:
  // odkaz na stránku NHS o bezpečnom spánku (g2-safety.js, zdroj a dátum), zoznam vecí v Domove pre bábätko a otázka.
  function cribAnswer() {
    const sleep = SAFE().safeSleep;
    if (!sleep) return null;
    return {
      level: "content",
      text: "Bezpečný spánok\n\n" + (sleep.text || "") + " Viac uvádza stránka NHS (odkaz nižšie). Zoznam vecí na spánok nájdeš v Domove pre bábätko (Spánok).\n\n" + SAFE().line.ped + "\n\n(Zdroj: NHS · overené " + sleep.checked + ".)",
      actions: [{ label: "Domov pre bábätko", kind: "checklist", value: "home" }, askAction("baby", "Mám otázku k bezpečnému spánku."), ...sourceAction(sleep.url)]
    };
  }
  function contentAnswer(t, ctx, pregnant, withBaby) {
    const C = window.GugubooContent || {};
    const pre = C.mamaPregnancy;
    const post = C.mamaPostpartum;
    const kid = C.childHealthSK;
    // Výbava: čo, koľko a kedy (NHS) – s tlačidlom „Pridať do Nákupu“.
    const vyb = C.vybava;
    if (vyb) {
      const topic = vyb.topics.find(item => t.includes(norm(item.title)) || item.words.some(word => t.includes(word)));
      if (topic) {
        return {
          level: "content",
          text: topic.title + "\n\nČo stačí:\n" + topic.items.map(x => "• " + x).join("\n") + "\n\nKedy: " + topic.when + "\n\n" + vyb.general + "\n\n(Zdroj: NHS · overené " + vyb.checked + ")",
          actions: [{ label: "Pridať do Nákupu", kind: "shop", value: topic.id }, { label: "Domov pre bábätko", kind: "checklist", value: topic.checklist }, ...sourceAction(vyb.buySource)]
        };
      }
      if (has(t, ["vybava", "vybavu", "vybavy", "vybavick", "co kupit", "co mam kupit", "co treba kupit", "co potrebujem pre babatko", "co vsetko kupit", "nakupit pre babatko", "kedy kupit", "kedy mam kupit", "kedy nakupit"])) {
        return {
          level: "content",
          text: "Výbava pre bábätko\n\n" + vyb.general + "\n\n" + vyb.bagWhen + "\n\nZáklad podľa NHS: spánok, prebaľovanie, oblečenie, autosedačka a kočík, kŕmenie. Na čo sa chceš pozrieť?\n\n(Zdroj: NHS · overené " + vyb.checked + ")",
          actions: [...vyb.topics.slice(0, 5).map(item => ({ label: item.title, kind: "ask", value: item.title })), { label: "Domov pre bábätko", kind: "checklist", value: "home" }]
        };
      }
    }
    // Ťažkosti mamy – podľa fázy
    const pack = pregnant ? pre : withBaby ? post : null;
    if (pack) {
      const found = pack.troubles.find(item => (TROUBLE_WORDS[item.id] || []).some(word => t.includes(word)));
      if (found) return troubleAnswer(found, pack.checked, pregnant ? "pre" : "post");
    }
    // Bezpečný spánok / postieľka (pred pôrodom aj po ňom).
    if (has(t, ["postielk", "bezpecny spanok", "bezpecne spanie", "kde bude spat", "kde ma spat babatko", "matrac"])) {
      const crib = cribAnswer();
      if (crib) return crib;
    }
    if (pregnant && pre) {
      if (has(t, ["co nesmiem jest", "co mozem jest", "co nejest", "jedl", "syr", "ryb", "tuniak", "pecen", "kav", "kofein", "alkohol", "vino", "pivo"])) {
        const f = pre.food;
        return { level: "content", text: "Jedlo v tehotenstve\n\nČo NHS v tehotenstve uvádza vynechať:\n" + f.avoid.slice(0, 6).map(x => "• " + x).join("\n") + (f.limit ? "\n\n" + (f.limitTitle || "Čo NHS uvádza o množstve") + ":\n" + f.limit.map(x => "• " + x).join("\n") : "") /* Master 4.0 (Audit Z1): množstvá ako „NHS uvádza…“ */ + "\n\n" + f.alcohol + "\n\nViac nájdeš v časti Jedlo a pohyb.\n\n(Zdroj: NHS · overené " + pre.checked + ")", actions: [askAction("me", f.askPrompt || "Mám otázku k jedlu v tehotenstve."), { label: "Jedlo a pohyb", kind: "go", value: "mama|[data-v2-mama-section='food']" }, ...sourceAction(f.source)] };
      }
      if (has(t, ["vitamin", "kyselin", "folic", "doplnk", "jod"])) {
        const v = pre.vitamins;
        return { level: "content", text: "Vitamíny v tehotenstve\n\n" + v.text + " Chceš si to zapísať ako otázku?", actions: [askAction("me", v.askPrompt), ...sourceAction(v.source)] };
      }
      if (has(t, ["cvic", "sport", "behat", "plavat", "joga", "fitko", "posilnov"])) {
        const e = pre.exercise;
        return { level: "content", text: "Pohyb v tehotenstve\n\n" + e.moveExamples /* Master 4.0 (Audit Z2): bez cieľa 150 min */ + "\n\nČo uvádza NHS:\n" + e.tips.map(x => "• " + x).join("\n") + "\n\nČo NHS neodporúča:\n" + e.avoid.map(x => "• " + x).join("\n") + "\n\n" + e.note + "\n\n(Zdroj: NHS · overené " + pre.checked + ")", actions: [askAction("me", e.askPrompt), { label: "Jedlo a pohyb", kind: "go", value: "mama|[data-v2-mama-section='food']" }, ...sourceAction(e.source)] };
      }
    }
    if (withBaby && post) {
      if (has(t, ["kontrola po porode", "kontrolu po porode", "prehliadka po porode", "gynekolog po porode", "sestonedel"])) {
        // Audit #21: len termín a otázky – bez zoznamu toho, čo robí lekár.
        return { level: "content", text: (kid ? kid.mother.text : "Kontrolu po pôrode si dohodneš so svojím gynekológom.") + "\n\nTermín nájdeš v Kalendári. Otázky na kontrolu si môžeš zapísať – na kontrole ich budeš mať po ruke." + (kid ? "\n\n(Zdroj: " + kid.sourceName + ", overené " + kid.checked + ".)" : ""), actions: [{ label: "Zapísať otázku na kontrolu", kind: "docq", value: "" }, { label: "Kontrola po pôrode", kind: "go", value: "mama|[data-v2-mama-section='check']" }, ...sourceAction(kid?.source)] };
      }
      if (post.period && has(t, ["menstru", "periodu", "perioda", "tampon", "kalisok", "antikoncep", "otehotn"])) {
        const p = post.period;
        const tampon = has(t, ["tampon", "kalisok"]);
        const pregnancy = has(t, ["antikoncep", "otehotn"]);
        const items = tampon ? p.padsItems : pregnancy ? p.pregnancyItems : p.returnItems.concat(p.pregnancyItems.slice(0, 1));
        const prompt = tampon ? p.padsAsk : pregnancy ? p.pregnancyAsk : p.askPrompt;
        return { level: "content", text: (tampon ? p.padsTitle : pregnancy ? p.pregnancyTitle : "Menštruácia po pôrode") + "\n\n" + items.map(x => "• " + x).join("\n") + "\n\n" + p.doctorLine + "\n\n(Zdroj: NHS · overené " + p.checked + ")", actions: [askAction("me", prompt), { label: "Menštruačný kalendár", kind: "feature", value: "period" }, ...sourceAction(p.source)] };
      }
      if (has(t, ["baby blues", "popor", "depres", "smutn", "placem", "uzkost", "nezvladam"])) {
        // PL 15. 11.: baby blues + jedna veta „kedy sa ozvať“ + kontakty na pomoc + otázka (bez zoznamu prejavov).
        const m = post.mood;
        return { level: "support", text: m.blues + "\n\n" + m.help + "\n\nLinka dôvery Nezábudka je nonstop a bezplatne: 0800 800 566.\n\n(Zdroj: NHS · overené " + post.checked + ")", actions: [askAction("me", m.askPrompt), { label: "Nálada a spánok", kind: "go", value: "mama|[data-v2-mama-section='mood']" }, { label: "Kontakty na pomoc", kind: "urgentinfo", value: "mama" }] };
      }
    }
    if (withBaby && kid && has(t, ["kolko prehliadok", "preventivn", "prehliadky u pediatr", "kedy k pediatr", "kedy ist k pediatr", "prehliadk"])) {
      return { level: "content", text: "Preventívne prehliadky u pediatra (hradí ich zdravotná poisťovňa):\n" + kid.checks.map(c => "• " + c.title + ": " + c.text).join("\n") + "\n\n" + kid.dentist.text + "\nPresné termíny ti určí pediater.\n\n(Zdroj: " + kid.sourceName + ", overené " + kid.checked + ".)", actions: [{ label: "Prehliadky", kind: "go", value: "childBook|[data-v2-child-section='checks']" }, ...sourceAction(kid.source)] };
    }
    if (withBaby && kid && has(t, ["ockovan", "vakcin"])) {
      return { level: "content", text: kid.vaccines.note + "\n\nOčkovania si môžeš zapisovať v Zdravotnej knižke.", actions: [{ label: "Zápis očkovaní", kind: "go", value: "childBook|[data-v2-child-section='vaccines']" }, ...sourceAction(kid.vaccines.source)] };
    }
    if (withBaby && has(t, ["prikrm", "tuhu stravu", "tuha strava", "kasick", "prve jedlo", "zacat jest", "dokrm"])) {
      // Audit #23: vek neuvádzame – appka nediktuje, kedy začať.
      return { level: "content", text: "Kedy a ako začať s príkrmami, je u každého bábätka iné – môžeš to prebrať s pediatrom.\n\nPrvý príkrm si môžeš zapísať v Kŕmení.", actions: [askAction("baby", "Kedy a ako začať s príkrmami?"), { label: "Zapísať príkrm", kind: "feature", value: "feeding" }, { label: "Zdroj", kind: "link", value: "https://www.nhs.uk/baby/weaning-and-feeding/babys-first-solid-foods/" }] };
    }
    return null;
  }

  // options.dryRun: len zistiť odpoveď (napr. hľadanie pri písaní) – nič nezapisovať do medzier ani štatistík.
  function answer(question, options = {}) {
    const t = norm(question);
    const plan = J.compute(state);
    const ctx = plan.context;
    const pregnant = ctx.life_stage === "pregnancy";
    const withBaby = ["postpartum", "baby", "parenthood"].includes(ctx.life_stage);

    // 0. Kríza má absolútnu prednosť (oprava Master: predtým bola až za krvácaním – „krvácam a chcem umrieť“
    //    dostalo len pôrodnícku odpoveď). Žiadna improvizácia, len pokojná pomoc a overené kontakty.
    // Krízové vety v rôznych tvaroch a poradí slov (nezávislé QA-02): „chcem sa zabiť“, „chcem si ublížiť“, „chcem zmiznúť navždy“.
    const harmWord = /(zabit|zabijem|ublizit|ublizim|umriet|umrela|umrel|zomriet|zomrela|zmiznut navzdy|zmiznem navzdy|skoncit to|skoncit so zivotom)/.test(t);
    // Master 4.0.1 (Kontrola APP N2): aj „mám myšlienky, že si ublížim“, „napadá mi…“, „bojím sa, že…“, „mám nutkanie…“.
    const intentWord = /(chcem|chcela by som|chcel by som|idem|mam chut|uvazujem|myslim na|radsej by som|najradsej by som|kiezby som|myslienk|napada mi|rozmyslam|bojim sa,? ze|mam strach,? ze|nutkanie)/.test(t);
    // „nechcem (už / ďalej / viac) žiť“, „nemá zmysel žiť“, „nemám pre čo žiť“ (QA-28) – aj s vloženými slovami; 4.0.1 aj „nechce sa mi žiť“.
    const noLife = /(nechcem|nemam chut|nema zmysel|nemam preco|nemam pre co|nechce sa mi)( (uz|dalej|viac|vobec|ani))* (zit|zijem)/.test(t);
    const crisis = noLife || (harmWord && intentWord && !/nechcem (sa |si )?(zabit|umriet|zomriet|ublizit)/.test(t));
    if (crisis || has(t, ["ublizit si", "ublizim si", "si ublizim", "si nieco urobim", "si nieco spravim", "sebaposkod", "rezem sa", "porezem sa", "predavkuj", "predavkovat", "nechcem zit", "nechcem byt nazive", "nechcem tu byt", "zabit sa", "zabijem sa", "zabila by som sa", "zabil by som sa", "samovrazd", "chcem umriet", "chcem zomriet", "skoncit so zivotom", "ublizit babatku", "ublizit dietatu", "ublizim babatku", "ublizim dietatu"])) {
      return { level: "urgent", text: "Ďakujem, že to píšeš. Nie si v tom bez opory a zaslúžiš si pomoc hneď teraz.\n\n" /* Master 4.0 (Audit T21): bez rodu – píše aj partner */ + (SAFE().E.E6?.text || "") /* Master 4.0 (Audit Z21): 112 len cez E6 z g2-safety.js */ + "\n\nPovedz to aj niekomu blízkemu, kto môže byť pri tebe.", actions: [{ label: "Volať 112", kind: "tel", value: "112" }, { label: "Linka Nezábudka", kind: "tel", value: "0800800566" }] };
    }
    // Strata tehotenstva alebo bábätka: len pokojná ľudská odpoveď, bez rád a bez ďalšieho obsahu (texty schváli psychológ).
    if (has(t, ["potratil", "potrat", "prisla som o babatko", "prisla som o dieta", "stratila som dieta", "stratila som babatko", "stratila som tehotenstvo", "mrtve narod", "babatko zomrelo", "zomrelo nam"])) {
      return { level: "support", text: "Je mi to veľmi ľúto. Nemusíš teraz nič riešiť ani nikomu nič vysvetľovať.\n\nAk chceš, povedz to niekomu blízkemu. O tom, čo ďalej, sa môžeš porozprávať so svojím lekárom alebo pôrodnou asistentkou. Ak sa potrebuješ s niekým porozprávať hneď, Linka dôvery Nezábudka je nonstop a bezplatne: 0800 800 566.", actions: [{ label: "Linka Nezábudka", kind: "tel", value: "0800800566" }] };
    }
    // 1. Bezpečnosť má vždy prednosť.
    // Master 4.0.1 (Kontrola APP N1, OBSAH N1): akútne ohrozenie života (bábätko, mama, ktokoľvek) = E0 ako PRVÁ veta, vo všetkých
    // obdobiach. Rozpoznáva bežné formulácie s aj bez diakritiky (norm() diakritiku odstráni): „ťažko / zle (sa mu) dýcha“, „nemôže
    // dýchať“, „lapá po dychu“, „modré pery“, „je celé modré“, „zmodrel“, „bezvedomie“, „nedá sa zobudiť“, „dusí sa“, „kŕče“, „záchvat“,
    // „vážny úraz“, opuch jazyka / pier. „Kŕč“ v nohe (mama) a v bruchu (tehotenstvo) sem nepatrí – majú pokojnú odpoveď nižšie.
    const legCramp = has(t, ["krc"]) && has(t, ["noh", "lytk", "chodid", "stehn"]);
    const bellyCramp = has(t, ["krc"]) && has(t, ["bruch", "podbrus", "maternic", "menstru"]);
    const breathing = /(nedycha|nedychal|prestal dychat|prestala dychat|prestalo dychat|(tazko|zle|tazsie|horsie|ledva|slabo|divne|tazkosti s|problem s|problemy s|nemoze|nevie|neda sa|nejde)( sa)?( (mu|jej|mi))? (dycha|dychat|dychanim|dychanie|nadychnut)|(dycha|dychat|dychanie) (tazko|zle|ledva|prerusovane)|lapa po dych|lape po dych|lapam po dych|dusi sa|dusim sa|dusenie|dusil sa|dusila sa|zadusi|zaskocil|zabehlo (mu|jej|mi))/.test(t);
    const blue = /(modrie|zmodr|modre pery|modra pery|modru pery|cele modre|cely modry|cela modra|je modre|je modra|je modry|modra pokozk|modru pokozk|siv[aeu] pokozk|sive pery|sinav)/.test(t);
    const unconscious = /(bezvedom|nereaguje|nereagoval|stratil vedomie|stratila vedomie|stratilo vedomie|odpadol|odpadla|odpadlo|omdlel|neda sa (pre|zo)budit|nejde (ho |ju )?(pre|zo)budit|nemozem (ho |ju )?(pre|zo)budit)/.test(t);
    const seizure = (has(t, ["krc"]) && !legCramp && !bellyCramp) || has(t, ["zachvat", "epilept", "trasie sa cele", "zmieta sa"]);
    const injury = has(t, ["vazny uraz", "vazne sa zranil", "vazne zranen", "vazne sa porani", "opuch jazyka", "opuch pier", "opuchol jazyk", "opuchli pery", "opuchnuty jazyk"]);
    if (breathing || blue || unconscious || seizure || injury) {
      return { level: "urgent", text: SAFE().E.E0?.text || "" /* Master 4.0.1 (Kontrola N1): E0 z g2-safety.js, 155/112 len tam */, actions: [{ label: "Zavolať 155", kind: "tel", value: "155" }, { label: "Zavolať 112", kind: "tel", value: "112" }] };
    }
    // Po pôrode je krvácanie niekoľko týždňov bežné – poplach len pri silnom/náhlom krvácaní (NHS).
    // Od 37. týždňa: „mám kontrakcie / začalo to“ bez varovných príznakov → pokojne, podľa pokynov pôrodnice (QA-21).
    if (pregnant && (ctx.pregnancy_week || 0) >= 37 && has(t, ["kontrakci", "zacalo to", "zacina porod", "porod zacal", "stahy"]) && !has(t, ["krvac", "plodova", "voda", "nehybe", "menej hybe", "malo sa hybe", "silna bolest", "mzitk", "rozmazane", "horuck"])) {
      // Master 4.0.1 (Kontrola OBSAH N23): bez predpokladu „ti povedali“ a bez rozkazu.
      return { level: "support", text: "Ak ti pôrodnica dala pokyny, kedy prísť, platia tie.\n\n" + (SAFE().E.E7?.text || "") /* Master 4.0 (Audit Z21): bezpečnostná veta len z g2-safety.js (E7) */, actions: [{ label: "Dôležité kontakty", kind: "feature", value: "contacts" }, { label: "Taška do pôrodnice", kind: "checklist", value: "hospital" }] };
    }
    const normalBleeding = withBaby && has(t, ["krvac"]) && !has(t, ["siln", "velmi", "vela krv", "nahle", "zrazenin", "odpadn", "omdl", "zavrat", "toci", "slabo mi", "busi"]);
    const preeclampsia = ["rozmazane", "mzitk", "zablesk", "hviezdicky pred ocami", "silna bolest hlavy", "silno ma boli hlava", "velmi ma boli hlava", "opuch tvare", "opuchla tvar", "nahly opuch", "bolest pod rebrami"];
    if (!normalBleeding && has(t, ["krvac", "plodova voda", "odtiekla voda", "odtieka voda", "odtiekla mi voda", "odteka mi voda", "praskla mi voda", "plodovy vak", "voda mi odtiekla", "nehybe", "menej hybe", "malo sa hybe", "malo hybe", "slabo sa hybe", "necitim pohyb", "prestal sa hybat", "prestala sa hybat", "silna bolest", "kontrakci", ...preeclampsia])) {
      // Master 4.0 (Audit Z5, Z21): pohyby bábätka = E3 – doslovne z g2-safety.js.
      // Master 4.0.1 (Kontrola OBSAH N2): E7 len na pôrodné príznaky v tehotenstve (plodová voda, krvácanie, kontrakcie);
      // príznaky preeklampsie v tehotenstve = E2; po pôrode (silné krvácanie, bolesť, videnie) = E1; iná silná bolesť v tehotenstve = E1.
      const fewerMoves = pregnant && has(t, ["nehybe", "menej hybe", "malo sa hybe", "malo hybe", "slabo sa hybe", "necitim pohyb", "prestal sa hybat", "prestala sa hybat"]);
      const labour = has(t, ["krvac", "plodov", "odtiekla voda", "odtieka voda", "odteka mi voda", "praskla mi voda", "voda mi odtiekla", "kontrakci"]);
      const id = fewerMoves ? "E3" : !pregnant ? "E1" : has(t, preeclampsia) ? "E2" : labour ? "E7" : "E1";
      return { level: "urgent", text: "Pri tomto je najlepšie ozvať sa hneď odborníkovi – to nemusíš posudzovať.\n\n" + (SAFE().E[id]?.text || ""), actions: [{ label: "Dôležité kontakty", kind: "feature", value: "contacts" }, { label: "Zavolať 155", kind: "tel", value: "155" }] };
    }
    // Po pôrode dá náladu konkrétnejšie (baby blues, NHS) obsahová odpoveď nižšie.
    if (!(withBaby && has(t, ["baby blues", "popor", "depres", "smutn", "placem", "uzkost", "nezvladam"])) && has(t, ["smutn", "nezvladam", "depres", "uzkost", "panik", "som unaven", "vycerpan", "placem", "do placu", "chce sa mi plakat", "je mi tazko", "potrebujem pomoc", "som na dne", "nema to zmysel", "nevladzem", "uz nevladzem"])) {
      return { level: "support", text: "To, čo cítiš, je dôležité a môžeš sa o to s niekým podeliť.\n\nSkús dnes jednu malú vec len pre seba a povedz niekomu blízkemu, ako sa máš. Ak to trvá dlhšie alebo sa to zhoršuje, porozprávaj sa so svojím lekárom alebo pôrodnou asistentkou – je to bežná a správna vec.", actions: [{ label: "Môj súkromný denník", kind: "feature", value: "privateSpace" }, { label: "Čas pre teba", kind: "me" }, { label: "Linka Nezábudka 0800 800 566", kind: "tel", value: "0800800566" }] };
    }

    // 1b. Sprievodca appkou („kde sú fotky?“) – po bezpečnosti, pred ostatným.
    const nav = navAnswer(t, ctx);
    if (nav) return nav;
    // 1c. Overený obsah appky (ťažkosti, jedlo, telo po pôrode, prehliadky, príkrmy…).
    const verified = contentAnswer(t, ctx, pregnant, withBaby);
    if (verified) return verified;
    // 1d. Príznaky: nikdy neposudzovať a neradiť. Pokojne ponúknuť zápis otázky pre lekára (INFORMUJEME_TEXTY §2);
    // výnimky (E4 horúčka do 3 mesiacov, E5 dýchanie) sú doslovne z g2-safety.js.
    // E4 (audit #8): bez tlačidla 155 a bez „Netreba čakať“ – NHS tu uvádza neodkladnú linku, nie záchranku.
    if (withBaby && ctx.baby_age_days !== null && ctx.baby_age_days < 91 && has(t, ["horuck", "teplot", "horuca", "horuci", "horuce", "38", "39", "40"])) {
      return { level: "urgent", text: (SAFE().E.E4?.text || "") + "\n\n" + safeSourceLine(), actions: [{ label: "Dôležité kontakty", kind: "feature", value: "contacts" }, askAction("baby", question), { label: "Kontakty na pomoc", kind: "urgentinfo", value: "" }] };
    }
    if (has(t, ["krc" /* Master 4.0.1: kŕč v bruchu (nie núdza E0) */, "vyrazk", "vyrazil", "flak", "horuck", "teplot", "kasl", "kasel", "nadch", "hnack", "zvraca", "vraca ", "alergi", "zihlav", "kolik", "neje", "nechce jest", "zltacz", "zlte", "pupok", "zapal", "bolest", "boli ho", "boli ju", "boli ma", "svrbi", "nespi", "stale place", "vela place"])) {
      return {
        level: "support",
        text: "Toto ti posúdiť neviem – to patrí lekárovi. Môžem ti to zapísať ako otázku pre " + (withBaby ? "pediatra" : "lekára") + ", aby to bolo na kontrole po ruke.\n\n" +
          (withBaby ? SAFE().line.ped + "\n\n" + (SAFE().E.E5?.text || "") : (pregnant ? SAFE().line.gyn + "\n\n" + (SAFE().E.E1?.text || "") : SAFE().line.post) /* Master 4.0 (Audit Z21): 155 len cez E1 */),
        actions: [
          askAction(withBaby ? "baby" : "me", question),
          { label: "Dôležité kontakty", kind: "feature", value: "contacts" },
          { label: "Kontakty na pomoc", kind: "urgentinfo", value: "" }
        ]
      };
    }

    // 2. Plán a úlohy.
    if (has(t, ["co ma caka", "co ma teraz", "co mam urobit", "co mam robit", "plan", "dalsi krok", "co teraz"])) return planAnswer(ctx, plan, "all");
    if (has(t, ["vybavit", "co musim", "co este", "uloh", "pripravit pred porodom"])) return planAnswer(ctx, plan, "tasks");
    if (has(t, ["task", "zbal"])) return itemAnswer("preg.bag", "Taška do pôrodnice je v Príprave na pôrod.");
    if (has(t, ["porodnic"])) return itemAnswer("preg.hospital", "Pôrodnicu si ulož v Príprave na pôrod.");
    if (has(t, ["pediatr", "detsky lekar"])) return withBaby ? itemAnswer("baby.pediatrician-visit", "") : itemAnswer("preg.pediatrician", "");
    if (has(t, ["vybav", "postielk", "spanie babatka", "kde bude spat"])) return itemAnswer("preg.sleep-place", "");
    if (has(t, ["kontakt", "gynekolog"])) return itemAnswer("preg.contacts", "");

    // 3. Kde som.
    if (has(t, ["tyzden", "ako rastie", "velke", "velky", "velkost", "brusk", "co sa deje", "ako sa mam", "co sa mnou"]) && pregnant) {
      const entry = weekEntry(ctx);
      const head = "Si v " + ctx.pregnancy_week + ". týždni tehotenstva" + (ctx.due_days > 0 ? " – do termínu " + (ctx.due_days === 1 ? "zostáva 1 deň." : ctx.due_days < 5 ? "zostávajú " + ctx.due_days + " dni." : "zostáva " + ctx.due_days + " dní.") : "."); // Master 4.0 (Audit T17)
      if (!entry) return { text: head, actions: [{ label: "Tehotenská knižka", kind: "feature", value: "pregnancy" }] };
      const url = entry.source_urls?.[0];
      return {
        text: head + (entry.size ? "\nBábätko meria " + entry.size + "." : "") + (entry.baby ? "\n\nBábätko: " + entry.baby : "") + (entry.you ? "\n\nTy: " + entry.you : "") + "\n\n(Zdroj: NHS · overené " + formatChecked(content().pregnancyWeeks.meta.last_checked) + ")",
        actions: url ? [{ label: "Zdroj", kind: "link", value: url }] : []
      };
    }
    if (has(t, ["100 dni", "sto dni", "100dni"])) {
      if (ctx.baby_age_days === null) return { text: "100 dní spolu začneme počítať od narodenia bábätka. V ten deň sa ti ozvem ❤️", actions: [] };
      const left = 100 - ctx.baby_age_days;
      const dni = n => n + " " + (n === 1 ? "deň" : n >= 2 && n <= 4 ? "dni" : "dní"); // Master 4.0.1 (Kontrola N17): skloňovanie
      return { text: left > 0 ? "Ste spolu " + dni(ctx.baby_age_days) + ". 100 dní spolu budete mať o " + dni(left) + " – v ten deň ti pripravím kartičku." : left === 0 ? "Dnes ste spolu 100 dní ❤️" : "100 dní spolu ste oslávili pred " + (-left) + (left === -1 ? " dňom" : " dňami") + " ❤️", actions: [{ label: "Naše momenty", kind: "feature", value: "memories" }] };
    }
    if (has(t, ["narodil", "narodila", "porodila", "je na svete", "uz je tu"])) {
      if (withBaby) return { text: "Bábätko už v Guguboo máš ❤️ Ak chceš opraviť dátum alebo miery, nájdeš ich v profile.", actions: [{ label: "Otvoriť profil", kind: "feature", value: "profiles" }] };
      return { text: "Gratulujem! ❤️ Stačí zadať dátum narodenia a Guguboo sa samo prepne na prvé dni s bábätkom. Tvoj plán, kontakty aj spomienky ostanú.", actions: [{ label: "Bábätko je na svete", kind: "birth" }] };
    }

    // 4. Po pôrode – rýchle záznamy.
    if (withBaby && has(t, ["kojen", "dojc", "kŕm", "krm", "flas", "mliek"])) return { text: "Kŕmenie zapíšeš dvoma ťuknutiami – čas beží, aj keď zatvoríš obrazovku.", actions: [{ label: "Zapísať kŕmenie", kind: "app", value: "data-g2q-open='feed'" }] }; // Master 4.0 (Audit T45): okno kruhu, nie starý formulár
    if (withBaby && has(t, ["plienk", "prebal"])) return { text: "Plienku zapíšeš jedným ťuknutím.", actions: [{ label: "Zapísať plienku", kind: "app", value: "data-g2q-open='diaper'" }] }; // Master 4.0 (Audit T31, T45)
    if (withBaby && has(t, ["spank", "spi", "zaspav", "spat"])) return { text: "Spánok môžeš spustiť časovačom. Šum a uspávanky sú v Spánku a zvukoch.", actions: [{ label: "Spánok", kind: "app", value: "data-g2q-open='sleep'" }, { label: "Spánok a zvuky", kind: "feature", value: "sounds" }] };

    // 5. Emocionálne veci.
    if (has(t, ["uspavank", "nahrat", "hlas"])) return itemAnswer("preg.voice", "Uspávanku svojím hlasom nahráš v časti Môj hlas pre bábätko.");
    if (has(t, ["kartick"])) return withBaby ? itemAnswer("baby.birth-card", "") : { text: "Kartičku narodenia ti pripravím hneď, keď sa bábätko narodí.", actions: [] };

    // 6. Úrady – úprimne: overený obsah sa pripravuje, nič z pamäte.
    if (has(t, ["urad", "prispev", "matersk", "rodicovsk", "davk", "socialn", "rodny list", "matrik", "poistovn", "prihlas", "tehotensk", "bonus", "pridavok"]) && !t.includes("knizk")) {
      const adminItems = window.GugubooAdmin?.relevant?.(ctx.life_stage) || [];
      if (adminItems.length) {
        // Najprv to, čo sa pýtajúcej priamo týka (zhoda v názve), potom ostatné pre jej fázu.
        // Skóre = koľko slov z názvu položky je v otázke; ponechajú sa len najlepšie zhody
        // („rodičovský príspevok“ → Rodičovský príspevok, nie Dohoda rodičov o mene).
        // Konkrétnu vec (napr. rodičovský príspevok) hľadáme vo všetkých overených položkách, nie len vo fáze,
        // v ktorej mama práve je – pýtať sa môže aj dopredu.
        const score = item => norm(item.title).split(/\s+/).filter(word => word.length > 4 && t.includes(word.slice(0, 6))).length;
        const pool = window.GugubooAdmin.items?.() || adminItems;
        const best = Math.max(0, ...pool.map(score));
        const matched = best ? pool.filter(item => score(item) === best) : [];
        const list = (matched.length ? matched : adminItems).slice(0, 5);
        const checked = window.GugubooAdmin.latestChecked?.() || window.GugubooAdmin.module()?.meta?.last_checked; // Master 4.0.1 (Kontrola Z38): najnovší dátum
        return {
          level: "admin",
          text: (matched.length ? "Tu je, čo k tomu viem z oficiálnych zdrojov:" : "Pre tvoju situáciu (" + J.stageLabel(ctx) + ") sa ťa môžu týkať tieto veci:") +
            "\n" + list.map(item => "• " + item.title + (window.GugubooAdmin.isAutomatic(item) ? " – vybaví sa samo" : item.verification_status === "verified" ? "" : " (časť údajov ešte overujeme)")).join("\n") +
            "\n\nKaždú informáciu mám z oficiálnej stránky úradu" + (checked ? " (overené " + formatChecked(checked) + ")" : "") /* Master 4.0 (Audit T36) */ + ". O nároku vždy rozhoduje úrad.",
          actions: list.map(item => ({ label: item.title, kind: "admin", value: item.id }))
        };
      }
      return {
        level: "admin",
        text: "Tento prehľad ešte pripravujeme – len z oficiálnych zdrojov. Zatiaľ nájdeš pravidlá tu:",
        actions: [
          { label: OFFICIAL.slovensko[0], kind: "link", value: OFFICIAL.slovensko[1] },
          { label: OFFICIAL.socpoist[0], kind: "link", value: OFFICIAL.socpoist[1] },
          { label: "Ministerstvo práce (MPSVR)", kind: "link", value: OFFICIAL.mpsvr[1] }
        ]
      };
    }

    // 7. Zdvorilosti.
    if (has(t, ["ahoj", "dobry den", "cau", "zdravim"])) return { text: "Ahoj, som GuguChat. S čím ti môžem pomôcť?", actions: [{ label: "Čo ma teraz čaká?", kind: "ask", value: "Čo ma teraz čaká?" }] };
    if (has(t, ["dakujem", "vdaka", "super"])) return { text: "Rado sa stalo. Som tu, keď budeš chcieť.", actions: [] };

    // 8. Neviem – úprimne a zapíšem ako medzeru v znalostiach.
    if (!options.dryRun) state.v2.gaps.push({ q: question, stage: ctx.life_stage, at: new Date().toISOString() });
    if (!options.dryRun) track("chat_gap");
    return {
      level: "unknown",
      // Master 4.0 (Audit T5, F41): bez vety, že si appka otázku zapísala (ženský rod) – otázka sa len lokálne eviduje, nikto na ňu neodpovie.
      text: "Na toto zatiaľ nemám overenú odpoveď.\n\nAk ide o zdravie, najlepšie ti poradí tvoj lekár.",
      actions: [{ label: "Čo ma teraz čaká?", kind: "ask", value: "Čo ma teraz čaká?" }]
    };
  }

  // ——— GuguChat: UI ———
  function chips(ctx) {
    if (ctx.life_stage === "pregnancy") return ["Čo ma teraz čaká?", "Kde čo nájdem?", "Čo vybaviť pred pôrodom?", "Ako rastie bábätko?", "Úrady a doklady"];
    if (ctx.life_stage === "setup") return ["Ako začať?", "Úrady a doklady"]; // Master 4.0.1 (Kontrola T60): jeden názov
    return ["Čo ma teraz čaká?", "Kde čo nájdem?", "Zapísať kŕmenie", "Kedy k pediatrovi?", "Úrady a doklady"];
  }

  function proactiveOpening(plan) {
    const ctx = plan.context;
    const name = state.user?.name ? ", " + state.user.name : "";
    if (ctx.life_stage === "setup") return { role: "bot", text: "Ahoj" + name + ", som GuguChat. Keď doplníš termín alebo dátum narodenia, ukážem ti, čo je teraz dôležité.", actions: [{ label: "Doplniť údaje", kind: "feature", value: "profiles" }] };
    const next = plan.next_best_action;
    let text = "Ahoj" + name + ". S čím ti môžem pomôcť?";
    if (next) text += "\n\nNa dnes: " + next.title + ".";
    return { role: "bot", text, actions: next ? itemActions(next).slice(0, 2) : [] };
  }

  // Master 1.7 (S27): krátky prvý riadok (bez bodky) je nadpis odpovede, riadky „• “ sú zoznam. Text sa nemení.
  function messageTextHtml(text) {
    const lines = String(text || "").split("\n");
    let html = "";
    let list = [];
    const flush = () => { if (list.length) html += "<ul class='g2-dots'>" + list.map(item => "<li>" + esc(item) + "</li>").join("") + "</ul>"; list = []; };
    lines.forEach((line, index) => {
      if (/^•\s*/.test(line)) { list.push(line.replace(/^•\s*/, "")); return; }
      flush();
      if (!line.trim()) return;
      const heading = index === 0 && lines.length > 1 && line.length <= 40 && !/[.?!:)]$/.test(line.trim());
      html += heading ? "<p class='g2-msg-title'><strong>" + esc(line) + "</strong></p>" : "<p>" + esc(line) + "</p>";
    });
    flush();
    return html;
  }

  function messageHtml(message) {
    if (message.role === "user") return "<div class='v2-msg v2-msg-user'>" + esc(message.text) + "</div>";
    const actions = (message.actions || []).map(action => {
      if (action.kind === "tel") return "<a class='v2-chat-action v2-chat-action-urgent' href='tel:" + esc(action.value) + "'>" + esc(action.label) + "</a>";
      if (action.kind === "link") return "<a class='v2-chat-action' href='" + esc(action.value) + "' target='_blank' rel='noopener noreferrer'>" + esc(action.label) + " ↗</a>";
      // Master 3.0: miesto v appke – rovnaké atribúty ako dlaždica v zásuvke (data-v5-feature, data-v2-admin-open…), len povolené data-* atribúty.
      if (action.kind === "app") return /^(\s*data-[a-z0-9-]+(='[^'<>]*')?)+\s*$/.test(action.value || "") ? "<button class='v2-chat-action v2-chat-app' type='button' data-g2-go " + action.value + ">" + esc(action.label) + " " + window.GugubooV5.glyph("chevronRight") + "</button>" : "";
      return "<button class='v2-chat-action' type='button' data-v2-chat-kind='" + esc(action.kind) + "' data-v2-chat-value='" + esc(action.value || "") + "'>" + esc(action.label) + "</button>";
    }).join("");
    return "<div class='v2-msg v2-msg-bot" + (message.level ? " v2-level-" + esc(message.level) : "") + "'>" + messageTextHtml(message.text) + (actions ? "<div class='v2-chat-actions'>" + actions + "</div>" : "") + "</div>";
  }

  function render() {
    const target = byId("guguChatContent");
    if (!target) return;
    const plan = J.compute(state);
    if (!state.v2.chat.length) {
      state.v2.chat.push(proactiveOpening(plan));
      track("chat_proactive", { item: plan.next_best_action?.id || "" });
      save();
    }
    target.innerHTML = [
      "<div class='v2-chat'>",
      "<header class='v2-chat-head'><img src='guguboo-logo-3d-pastel-v2.png' alt=''><div><small>", esc(J.stageLabel(plan.context)), " · z overeného obsahu</small></div></header>",
      "<div class='v2-chat-log' id='v2ChatLog' aria-live='polite'>", state.v2.chat.map(messageHtml).join(""), "</div>",
      // Samuel 28. 9.: žiadny trvalý „núdzový“ pás – pôsobí strašidelne. Pomoc je vždy nenápadne po ruke
      // a naliehavé kontakty sa ukážu len vtedy, keď ich otázka naozaj vyžaduje.
      "<p class='v2-chat-disclaimer'>GuguChat ti pomôže zorientovať sa. So zdravotnými otázkami sa obráť aj na lekára.<button type='button' class='v2-chat-help-link' data-v2-chat-kind='helpinfo'>Kontakty na pomoc</button></p>",
      // Master 1.7 (V13): rýchle otázky a pole na písanie sú prilepené dole – po odpovedi netreba posúvať.
      "<div class='g2-chat-dock'>",
      "<div class='v2-chat-chips'>", chips(plan.context).map(chip => "<button type='button' data-v2-chat-ask='" + esc(chip) + "'>" + esc(chip) + "</button>").join(""), "</div>",
      "<form class='v2-chat-form' id='v2ChatForm'><label class='v5-sr-only' for='v2ChatInput'>Napíš otázku</label><input id='v2ChatInput' autocomplete='off' placeholder='Napíš otázku…'><button class='v5-primary' type='submit'>Poslať</button></form>",
      "</div>",
      "</div>"
    ].join("");
    const log = byId("v2ChatLog");
    if (log) log.scrollTop = log.scrollHeight;
    // Posledná správa nad poľom (okno sa posúva celé, nie len zoznam).
    const scroller = target.closest(".view");
    if (scroller && state.v2.chat.length > 1) requestAnimationFrame(() => { scroller.scrollTop = scroller.scrollHeight; });
  }

  function ask(text) {
    const clean = String(text || "").trim();
    if (!clean) return;
    state.v2.chat.push({ role: "user", text: clean });
    const reply = answer(clean);
    // Master 3.0 (Samo 16. 11.): hľadanie je len v GuguChate – k odpovedi pridáme miesta v appke (hovorové slová, preklepy;
    // GugubooV5.searchApps = predtým hľadanie v zásuvke). Pri vážnych a citlivých odpovediach nič navyše.
    if (!["urgent", "support"].includes(reply.level)) {
      const have = new Set((reply.actions || []).map(a => a.kind === "feature" ? "data-v5-feature='" + a.value + "'" : ""));
      const apps = (V5.searchApps?.(clean) || []).filter(hit => !have.has(hit.attrs) && !(reply.actions || []).some(a => a.label === hit.label));
      if (apps.length) reply.actions = [...(reply.actions || []), ...apps.map(hit => ({ label: hit.label, kind: "app", value: hit.attrs }))];
    }
    state.v2.chat.push({ role: "bot", ...reply });
    track("chat_ask", { level: reply.level || "info", item: reply.item || "" });
    save();
    render();
  }

  function openChat(question) {
    V5.openFeature("guguChat");
    // Master 4.0 (Audit F14): rovnaká otázka, na ktorú je odpoveď posledná v chate (napr. opakované otvorenie Nálady a podpory),
    // sa nepridá znova – GuguChat sa len otvorí na tej odpovedi.
    const chat = state.v2.chat || [], q = String(question || "").trim(), n = chat.length;
    if (q && n >= 2 && chat[n - 2].role === "user" && chat[n - 2].text === q && chat[n - 1].role === "bot") return;
    if (question) setTimeout(() => ask(question), 0);
  }

  function refreshHome() {
    V5.renderHome();
  }

  document.addEventListener("click", event => {
    const open = event.target.closest("[data-v2-journey-open]");
    if (open) return openItem(J.item(open.dataset.v2JourneyOpen));
    const done = event.target.closest("[data-v2-journey-done]");
    if (done) {
      const item = J.item(done.dataset.v2JourneyDone);
      J.markDone(state, item.id);
      track("journey_done", { id: item.id, source: "home" });
      save();
      refreshHome();
      return V5.announce("Hotovo: " + item.title);
    }
    const snooze = event.target.closest("[data-v2-journey-snooze]");
    if (snooze) {
      const item = J.item(snooze.dataset.v2JourneySnooze);
      remind(item, 7);
      refreshHome();
      return V5.announce("Pripomeniem ti to o týždeň.");
    }
    const chatAsk = event.target.closest("[data-v2-chat-ask]");
    if (chatAsk) {
      if (byId("guguChat")?.classList.contains("active")) return ask(chatAsk.dataset.v2ChatAsk);
      return openChat(chatAsk.dataset.v2ChatAsk);
    }
    const chatAction = event.target.closest("[data-v2-chat-kind]");
    if (chatAction) {
      const kind = chatAction.dataset.v2ChatKind;
      const value = chatAction.dataset.v2ChatValue;
      const item = J.item(value);
      if (kind === "open") return openItem(item);
      if (kind === "feature") return V5.openFeature(value);
      if (kind === "urgentinfo") return V5.openUrgentModal?.(value); // Master 4.0.1 (Kontrola N5): "mama" = okno o mame
      if (kind === "checklist") return V5.openChecklistCategory?.(value || "home");
      if (kind === "shop") {
        // Pridá položky témy výbavy do spoločného Nákupu (bez duplicít).
        const topic = window.GugubooContent?.vybava?.topics.find(item => item.id === value);
        if (!topic) return;
        state.shopping ||= [];
        const have = new Set(state.shopping.map(entry => norm(entry.item)));
        const added = topic.items.filter(item => !have.has(norm(item)));
        added.forEach(item => state.shopping.push({ item, category: "Výbava – " + topic.title, note: "Podľa NHS", created: new Date().toISOString() }));
        V5.persist();
        state.v2.chat.push({ role: "bot", text: added.length ? "Pridané do Nákupu: " + added.length + (added.length === 1 ? " položka" : added.length < 5 ? " položky" : " položiek") + " (" + topic.title + ")." : "Všetko z tejto časti už v Nákupe máš.", actions: [{ label: "Otvoriť Nákup", kind: "feature", value: "shopping" }] });
        save();
        return render();
      }
      if (kind === "pedq" || kind === "docq") {
        // Master 2.7: jeden zoznam Otázky pre lekára (Pre bábätko = pediater, Pre mňa = lekár). Bez textu → okno na napísanie.
        const who = kind === "pedq" ? "baby" : "me";
        if (!value) return V5.openAskQuestion?.(who, "");
        V5.addDoctorQuestion?.(value, who);
        state.v2.chat.push({ role: "bot", text: "Zapísané: „" + value + "“. Nájdeš to v Otázkach pre lekára (" + (who === "baby" ? "Pre bábätko" : "Pre mňa") + ").", actions: [{ label: "Otvoriť otázky", kind: "questions", value: "" }] });
        save();
        return render();
      }
      if (kind === "questions") return V5.openDoctorQuestions?.();
      if (kind === "tour") { V5.openHome(); return setTimeout(() => window.GugubooTour?.start?.(), 250); }
      if (kind === "drawer") { V5.openHome(); return setTimeout(() => V5.openDrawer?.(), 200); }
      if (kind === "go") {
        // „moments:sekcia“ = Naše momenty; „funkcia|selektor“ = otvoriť funkciu a ťuknúť na jej časť.
        if (value.startsWith("moments:")) {
          V5.openFeature("memories");
          state.v5.momentsSection = value.slice(8);
          V5.persist();
          return V5.rerenderMoments?.();
        }
        const [feature, selector] = value.split("|");
        V5.openFeature(feature);
        return setTimeout(() => document.querySelector(".view.active " + selector)?.click(), 80);
      }
      if (kind === "home") return V5.openHome();
      if (kind === "me") return window.G2Ring?.overview ? window.G2Ring.overview() : V5.openHome(); // Master 2.1: Čas pre teba je v Mame
      if (kind === "birth") return window.GugubooBirth?.open();
      if (kind === "admin") return window.GugubooAdmin?.open(value);
      if (kind === "helpinfo") {
        state.v2.chat.push({ role: "bot", text: "Keď bude treba rýchlu pomoc, stačí zavolať. Kontakt na pôrodnicu a lekára si môžeš uložiť v Dôležitých kontaktoch, aby boli po ruke.", actions: [{ label: "Záchranka 155", kind: "tel", value: "155" }, { label: "Tiesňová linka 112", kind: "tel", value: "112" }, { label: "Dôležité kontakty", kind: "feature", value: "contacts" }] });
        save();
        return render();
      }
      if (kind === "ask") return ask(value);
      if (kind === "explain" && item) {
        state.v2.chat.push({ role: "bot", text: item.why + "\n\nMôžeme to spraviť hneď, alebo ti to pripomeniem.", actions: itemActions(item).filter(action => action.kind !== "explain") });
        save();
        return render();
      }
      if (kind === "remind" && item) {
        const date = remind(item, 7);
        state.v2.chat.push({ role: "bot", text: "Dobre, pripomeniem ti to " + date.toLocaleDateString("sk-SK", { day: "numeric", month: "long" }) + ". Dovtedy si to pamätám ja.", actions: [] });
        save();
        return render();
      }
      if (kind === "done" && item) {
        J.markDone(state, item.id);
        track("journey_done", { id: item.id, source: "chat" });
        const next = J.compute(state).next_best_action;
        state.v2.chat.push({ role: "bot", text: "Hotovo: " + item.title + "." + (next ? "\n\nĎalší krok: " + next.title + "." : "\n\nĎalšie veci počkajú."), actions: next ? itemActions(next) : [] });
        save();
        return render();
      }
      if (kind === "undo" && item) {
        J.undo(state, item.id);
        save();
        return ask(item.title);
      }
    }
    if (event.target.closest("[data-v2-feedback]")) return openFeedback();
    if (event.target.closest("[data-v2-feedback-close]") || event.target.id === "v2FeedbackOverlay") return closeFeedback();
    if (event.target.closest("[data-v2-reset]")) {
      if (!window.confirm("Začať odznova? Všetky údaje v tomto telefóne sa vymažú.")) /* Master 4.0.1 (Kontrola N14): Master ukladá natrvalo, nie beta */ return;
      try { sessionStorage.clear(); } catch (_) { /* nič */ }
      window.location.reload();
    }
  });

  document.addEventListener("submit", event => {
    if (event.target.id === "v2FeedbackForm") { event.preventDefault(); return downloadFeedback(event.target); }
    if (event.target.id !== "v2ChatForm") return;
    event.preventDefault();
    const input = byId("v2ChatInput");
    ask(input?.value);
  });

  window.GugubooChat = { render, ask, answer, open: openChat, closeFeedback /* Master 4.0 (Audit F4): systém okien */ };
  window.GugubooV2 = { homeJourneyHtml, homeTodayHtml, planHtml, heroWeek, betaFooterHtml, openItem, track, pregnancyWeek, babySize, ask, openChat, answer };
  refreshHome();
  loadContent().then(() => {
    refreshHome();
    if (byId("guguChat")?.classList.contains("active")) render();
  });
})();

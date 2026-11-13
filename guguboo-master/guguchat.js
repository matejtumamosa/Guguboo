/*
 * GUGUBOO V2 – GuguChat a plán TERAZ / ČOSKORO na Domove.
 *
 * GuguChat nie je generický chatbot a zatiaľ nepoužíva AI model (rozhodnutie 28. 9. 2026):
 *   - rozumie typickým otázkam (zámery), odpovedá z obsahu Guguboo a z Journey Engine,
 *   - ku každej odpovedi ponúkne akciu (Začať, Už mám vybavené, Pripomeň mi, …),
 *   - pri varovných signáloch vždy eskaluje (155 / 112, pôrodnica, lekár) – nikdy nediagnostikuje,
 *   - čo nevie, povie úprimne a otázku si zapíše ako medzeru v znalostiach (produktové dáta).
 * Beta: všetko žije len v sessionStorage (spolu s ostatným stavom).
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
  const CONTENT_FILES = ["content/pregnancy-weeks.js", "content/life-admin-sk.js", "content/mama-tehotenstvo.js", "content/mama-po-porode.js", "content/dieta-sk.js", "content/vybava.js"];
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
    4: "hrášok", 5: "hrášok", 16: "pomaranč", 20: "grapefruit", 21: "veľký grapefruit", 22: "pomelo", 23: "veľké pomelo",
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
    return "<a class='v2-source' href='" + esc(url) + "' target='_blank' rel='noopener noreferrer'>Zdroj: " + esc(name.split(" – ")[0]) + " · každá veta overená citátom · kontrola " + esc(formatChecked(meta?.last_checked)) + " ↗</a>";
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
      "<span class='v2-journey-text'><strong>", esc(item.title), "</strong><small>", esc(item.why || ""), "</small></span>",
      "<span class='v5-row-arrow' aria-hidden='true'>›</span></button>",
      item.type === "task" ? [
        "<div class='v2-journey-actions'>",
        "<button type='button' data-v2-journey-done='", esc(item.id), "'>✓ Už mám</button>",
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
        "<button class='v5-today-card' type='button' data-v5-feature='profiles'><span class='v5-icon'>" + icon("calendar") + "</span><div><small>Teraz</small><strong>Doplň termín pôrodu alebo dátum narodenia</strong><span class='v5-today-hint'>Podľa neho Guguboo vie, čo je pre teba práve dôležité.</span></div><span class='v5-row-arrow'>›</span></button></section>";
    }
    const now = plan.what_is_relevant_now;
    const soon = plan.what_is_coming;
    const later = plan.counts.later;
    return [
      weekHtml(ctx),
      "<section class='v2-journey' aria-label='Tvoj plán'>",
      "<header><small>", esc(J.stageLabel(ctx)), "</small><h2>Teraz</h2></header>",
      now.length ? now.map(journeyCard).join("") : "<p class='v2-journey-empty'>Na dnes je všetko podstatné hotové. Užívaj si to ❤️</p>",
      soon.length ? [
        "<div class='v2-journey-soon'><h3>Čoskoro</h3>",
        soon.map(item => "<button type='button' data-v2-journey-open='" + esc(item.id) + "'><span>" + esc(item.title) + "</span><em>o " + item.startsInDays + " " + (item.startsInDays === 1 ? "deň" : item.startsInDays < 5 ? "dni" : "dní") + "</em></button>").join(""),
        "</div>"
      ].join("") : "",
      plan.transition ? "<button class='v2-journey-transition' type='button' data-v2-birth-open><span aria-hidden='true'>♡</span><span><strong>Bábätko je na svete?</strong><small>Daj vedieť a Guguboo sa prepne na prvé dni spolu</small></span><span class='v5-row-arrow' aria-hidden='true'>›</span></button>" : "",
      "<footer class='v2-journey-later'><span>", later ? "Ďalších " + later + " vecí zatiaľ nemusíš riešiť. Keď príde čas, ozvem sa." : "Zvyšok počká. Keď príde čas, ozvem sa.", "</span>",
      // Bez tlačidla „Opýtať sa GuguChatu“ – GuguChat je v strede spodnej lišty (Samuel 4. 11.).
      "</footer>",
      "</section>"
    ].join("");
  }

  // ——— Master (K-4): na domove len JEDNA vec („Dnes stačí jedno“), celý zoznam v okne Plán ———
  function homeTodayHtml() {
    const plan = J.compute(state);
    const ctx = plan.context;
    if (ctx.life_stage === "setup") return homeJourneyHtml();
    const hour = new Date().getHours();
    if ((hour >= 22 || hour < 6) && ctx.life_stage !== "pregnancy") return ""; // v noci po pôrode žiadne úlohy
    // Od 37. týždňa je „vecou na dnes“ pokojný prechod „Bábätko je na svete?“ (jediný prechod na po pôrode).
    if (plan.transition && (ctx.pregnancy_week || 0) >= 37) {
      return "<section class='g2-today'><small>Keď príde čas</small><h3>Bábätko je na svete?</h3><p>Daj vedieť a Guguboo sa prepne na prvé dni spolu. Dovtedy nič netreba.</p><div class='g2-today-actions'><button class='g2-btn g2-btn-primary' type='button' data-v2-birth-open>Áno, je tu</button></div><div class='g2-today-foot'><span>Ostatné počká.</span><button class='g2-link' type='button' data-g2-plan>Celý plán ›</button></div></section>";
    }
    const item = plan.what_is_relevant_now[0];
    if (!item) return "<section class='g2-today'><small>Dnes stačí jedno</small><h3>Na dnes nič netreba.</h3><p>Ostatné počká. Keď príde čas, ozvem sa.</p><div class='g2-today-foot'><span></span><button class='g2-link' type='button' data-g2-plan>Celý plán ›</button></div></section>";
    return [
      "<section class='g2-today' aria-label='Dnes stačí jedno'><small>Dnes stačí jedno</small>",
      "<h3>", esc(item.title), "</h3>", item.why ? "<p>" + esc(item.why) + "</p>" : "",
      "<div class='g2-today-actions'><button class='g2-btn g2-btn-primary' type='button' data-v2-journey-open='", esc(item.id), "'>Pozrieť</button>",
      item.type === "task" ? "<button class='g2-btn' type='button' data-v2-journey-snooze='" + esc(item.id) + "'>Neskôr</button>" : "",
      "</div><div class='g2-today-foot'><span>Ostatné počká. Keď príde čas, ozvem sa.</span><button class='g2-link' type='button' data-g2-plan>Celý plán ›</button></div></section>"
    ].join("");
  }
  function planHtml() {
    const plan = J.compute(state);
    const ctx = plan.context;
    if (ctx.life_stage === "setup") return homeJourneyHtml();
    const now = plan.what_is_relevant_now;
    const soon = plan.what_is_coming;
    return [
      "<p class='g2-lead'>Nemusíš to mať všetko v hlave. Keď príde čas, ozvem sa.</p>",
      "<section class='v2-journey g2-plan-list' aria-label='Plán'><header><small>", esc(J.stageLabel(ctx)), "</small><h2>Teraz</h2></header>",
      now.length ? now.map(journeyCard).join("") : "<p class='v2-journey-empty'>Na teraz nič netreba.</p>",
      soon.length ? "<div class='v2-journey-soon'><h3>Čoskoro</h3>" + soon.map(item => "<button type='button' data-v2-journey-open='" + esc(item.id) + "'><span>" + esc(item.title) + "</span><em>" + (item.startsInDays <= 7 ? "budúci týždeň" : "o pár týždňov") + "</em></button>").join("") + "</div>" : "",
      plan.transition ? "<button class='v2-journey-transition' type='button' data-v2-birth-open><span aria-hidden='true'>♡</span><span><strong>Bábätko je na svete?</strong><small>Daj vedieť a Guguboo sa prepne na prvé dni spolu</small></span><span class='v5-row-arrow' aria-hidden='true'>›</span></button>" : "",
      "<footer class='v2-journey-later'><span>", plan.counts.later ? "Ďalšie veci zatiaľ nemusíš riešiť. Keď príde čas, ozvem sa." : "Zvyšok počká.", "</span></footer></section>",
      "<button class='v5-row-card g2-plan-areas' type='button' data-g2-org><span class='v5-icon'>", icon("checklist"), "</span><div><strong>Príprava podľa oblastí</strong><span>Vybaviť, domov, doklady a blízki – všetky kroky</span></div><span class='v5-row-arrow'>›</span></button>"
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
    return "<aside class='v2-beta-note'><span><strong>Beta verzia " + (window.GUGUBOO_V2_VERSION || "") + "</strong> · údaje sa po zatvorení okna vymažú</span><span class='v2-beta-actions'><button type='button' data-v2-feedback>Dať spätnú väzbu</button>" + (V5.MASTER ? "" : "<button type='button' data-v2-tour-restart>Ukázať prehliadku</button><button type='button' data-v2-reset>Začať odznova</button>") + "</span></aside>";
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
      "<fieldset><legend>Potrebovala by si popri Guguboo ešte inú tehotenskú appku?</legend><div class='v2-feedback-options'>", option("second_app", "no", "Nie"), option("second_app", "maybe", "Možno"), option("second_app", "yes", "Áno"), "</div></fieldset>",
      "<label>Čo ti chýbalo alebo ťa potešilo? — nepovinné<textarea id='v2FeedbackText' rows='3' placeholder='Napíš pár slov…'></textarea></label>",
      "<button class='v5-primary' type='submit'>Stiahnuť spätnú väzbu</button>",
      "</form>",
      "<p class='v2-birth-note'>Stiahne sa malý súbor – pošli ho, prosím, tímu Guguboo. Neobsahuje tvoje meno ani dátumy.</p>"
    ].join("");
  }

  function openFeedback() {
    let overlay = byId("v2FeedbackOverlay");
    if (!overlay) {
      document.body.insertAdjacentHTML("beforeend", "<div id='v2FeedbackOverlay' class='v2-birth-overlay' aria-hidden='true'><section class='v2-birth-sheet' role='dialog' aria-modal='true' aria-labelledby='v2FeedbackTitle'><button class='v5-icon-button v2-birth-close' type='button' data-v2-feedback-close aria-label='Zavrieť'>×</button><div id='v2FeedbackBody'></div></section></div>");
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
    if (!items.length) return { text: "Teraz nemáš nič naliehavé. Keď sa niečo priblíži, ozvem sa sama.", actions: [] };
    const tasks = focus === "tasks" ? items.filter(item => item.type === "task") : items;
    const first = tasks[0] || items[0];
    const lines = tasks.slice(0, 4).map(item => "• " + item.title + (item.horizon === "soon" ? " (o " + item.startsInDays + " dní)" : ""));
    const intro = focus === "tasks"
      ? (tasks.length === 1 ? "Z dôležitých vecí ti zostáva jedna." : "Z dôležitých vecí ti zostávajú " + tasks.length + ".")
      : "Podľa toho, kde na svojej ceste si (" + J.stageLabel(ctx) + "), je teraz dôležité:";
    return {
      text: intro + "\n" + lines.join("\n") + "\n\nNajbližšie bude vhodné vyriešiť: " + first.title + ".",
      item: first.id,
      actions: itemActions(first)
    };
  }

  function itemActions(item) {
    const list = [{ label: "Začať", kind: "open", value: item.id }, { label: "Vysvetli mi to", kind: "explain", value: item.id }];
    if (item.type === "task") {
      list.push({ label: "Pripomeň mi", kind: "remind", value: item.id });
      list.push({ label: "Už mám vybavené", kind: "done", value: item.id });
    }
    return list;
  }

  function itemAnswer(id, fallbackText) {
    const item = J.item(id);
    const plan = J.compute(state);
    const placed = [...plan.what_is_relevant_now, ...plan.what_is_coming, ...plan.later, ...plan.done].find(entry => entry.id === id);
    if (!item) return { text: fallbackText, actions: [] };
    if (placed?.done) return { text: "„" + item.title + "“ už máš označené ako hotové. 👏", actions: [{ label: "Otvoriť", kind: "open", value: id }, { label: "Vrátiť ako nehotové", kind: "undo", value: id }] };
    const when = !placed ? "" : placed.horizon === "now" ? "Teraz je na to vhodný čas." : placed.horizon === "soon" ? "Bude to aktuálne o " + placed.startsInDays + " dní." : "Zatiaľ to nemusíš riešiť – ozvem sa, keď príde správny čas.";
    return { text: item.title + ".\n" + (item.why || "") + (when ? "\n\n" + when : ""), item: id, actions: itemActions(item) };
  }

  // ——— Sprievodca appkou (Samuel 4. 11.): „kde sú fotky?“, „kde mám uspávanky?“ → krátka odpoveď + tlačidlo,
  // ktoré to rovno otvorí. Spustí sa len pri otázke typu kde/ako/otvor/chcem…, aby nekradol iné odpovede.
  // go = "funkcia|selektor": otvorí funkciu a v nej ťukne na danú časť (napr. sekciu Knižky).
  const NAV_INTENT = ["kde ", "kde?", "ako ", "otvor", "najdem", "najst", "chcem", "ukaz", "zapis", "zapisat", "pridat", "pridam", "nahra", "mozem", "potrebujem", "zobraz", "pozriet", "pozriem", "vytvor", "spravit", "urobit"];
  const NAV = [
    // Spomienky
    { words: ["album"], text: "Albumy (Naše čakanie, 100 dní spolu, Moje prvé, Prvý rok) sú v Naše momenty.", label: "Otvoriť albumy", go: "moments:albums" },
    { words: ["fotk", "fotograf", "spomien", "moment", "casova os", "casovu os"], text: "Fotky a spomienky sú v Naše momenty – v časovej osi sa zapisujú samy.", label: "Otvoriť časovú os", go: "moments:timeline" },
    { words: ["prve razy", "prvy raz", "prvy usmev", "prve kroky", "prve slovo"], text: "Prvé razy zapíšeš jedným ťuknutím v Naše momenty → Prvé razy.", label: "Otvoriť Prvé razy", go: "moments:firsts" },
    { words: ["uspavank", "nahravk", "nahrat hlas", "moj hlas", "nahrany hlas", "nahrane"], text: "Nahrávky tvojím hlasom sú v Môj hlas pre bábätko. Po narodení ich nájdeš aj pri Spánku → Zvuky.", label: "Otvoriť Môj hlas", feature: "voice" },
    { words: ["dennik", "nalad", "list babatku", "listy babatku"], text: "Môj súkromný denník je v časti Mama (spodná lišta) – chránený PIN-om.", label: "Otvoriť denník", feature: "privateSpace" },
    { words: ["oznamit tehotenstvo", "oznamenie tehotenstva", "oznamit blizkym", "kartick oznam"], stage: "pre", text: "Kartičku na oznámenie tehotenstva vytvoríš v kruhu Príprava → Vybaviť alebo priamo tu.", label: "Vytvoriť kartičku", feature: "announce" },
    { words: ["kartick"], stage: "post", text: "Kartičku narodenia vytvoríš, upravíš alebo znova pošleš tu.", label: "Otvoriť kartičku", feature: "cards" },
    // Tehotenská knižka
    { words: ["sono", "ultrazvuk", "vysledk"], stage: "pre", text: "Výsledky vyšetrení (aj s fotkou sona) sú v Tehotenskej knižke → Výsledky vyšetrení.", label: "Otvoriť výsledky", go: "pregnancy|[data-v5-book-section='results']" },
    { words: ["zapis z kontrol", "zapisy z kontrol", "zapisat kontrol", "z kontroly"], stage: "pre", text: "Zápisy z kontrol sú v Tehotenskej knižke.", label: "Otvoriť zápisy z kontrol", go: "pregnancy|[data-v5-book-section='visits']" },
    { words: ["hmotnost", "tlak"], stage: "pre", text: "Hmotnosť a tlak sa ukazujú v Tehotenskej knižke zo zápisov z kontrol.", label: "Otvoriť hmotnosť a tlak", go: "pregnancy|[data-v5-book-section='weight']" },
    { words: ["pohyb", "kopan"], stage: "pre", text: "Pohyby bábätka zapíšeš v Tehotenskej knižke → Pohyby bábätka.", label: "Otvoriť pohyby", go: "pregnancy|[data-v5-book-section='moves']" },
    { words: ["plan porodu"], stage: "pre", text: "Plán pôrodu je v Tehotenskej knižke.", label: "Otvoriť plán pôrodu", go: "pregnancy|[data-v5-book-section='birthplan']" },
    { words: ["otazky pre lekar", "otazku pre lekar", "otazky na kontrol"], stage: "pre", text: "Otázky pre lekára si pripravíš v Tehotenskej knižke.", label: "Otvoriť otázky", go: "pregnancy|[data-v5-book-section='questions']" },
    { words: ["knizk"], stage: "pre", text: "Tehotenská knižka je prvé okienko na domove.", label: "Otvoriť Tehotenskú knižku", feature: "pregnancy" },
    { words: ["task", "do porodnice", "priprav"], stage: "pre", text: "Taška do pôrodnice a príprava domova sú v Mojej príprave.", label: "Otvoriť Moju prípravu", feature: "beforeBirth" },
    { words: ["ake velke", "velkost babatka", "ovoci"], stage: "pre", text: "Aké veľké je bábätko ukazuje okienko Dieťa alebo krúžok s týždňom na domove.", label: "Otvoriť Aké veľké je bábätko", feature: "babySize" },
    { words: ["menstruacny kalendar", "kalendar menstru", "zapisat menstru", "zapisem menstru", "zapis menstru", "sledovat menstru", "dlzka cyklu", "kalendar cyklu"], stage: "post", text: "Menštruačný kalendár nájdeš v časti Mama (spodná lišta) – zápis jedným ťuknutím, odhad ďalšej menštruácie a prehľad pre gynekológa.", label: "Otvoriť menštruačný kalendár", feature: "period" },
    { words: ["telo", "tazkost", "pitny rezim", "pitie", "okienko mama"], text: "Tvoje telo, bežné ťažkosti, jedlo a pitný režim sú v okienku Mama.", label: "Otvoriť Mamu", feature: "mama" },
    // Po pôrode
    { words: ["ockovan"], stage: "post", text: "Očkovania zapíšeš v Zdravotnej knižke dieťaťa.", label: "Otvoriť očkovanie", go: "childBook|[data-v2-child-section='vaccines']" },
    { words: ["prehliadk", "pediatr"], stage: "post", text: "Prehliadky u pediatra (aj nárok podľa zákona) sú v Zdravotnej knižke dieťaťa.", label: "Otvoriť prehliadky", go: "childBook|[data-v2-child-section='checks']" },
    { words: ["rast", "vaha", "vyska", "dlzka", "meran"], stage: "post", text: "Rast (hmotnosť a dĺžka v grafe) je v Zdravotnej knižke dieťaťa.", label: "Otvoriť rast", go: "childBook|[data-v2-child-section='growth']" },
    { words: ["zdravotn"], stage: "post", text: "Zdravotná knižka dieťaťa je na domove v okienku s vekom bábätka.", label: "Otvoriť Zdravotnú knižku", feature: "childBook" },
    { words: ["zubk", "zub"], stage: "post", text: "Zúbky sú v Zdravotnej knižke.", label: "Otvoriť Zúbky", feature: "teeth" },
    { words: ["aktivit", "hrat sa", "hry "], stage: "post", text: "Aktivity podľa veku sú v časti Bábätko (spodná lišta).", label: "Otvoriť Aktivity", feature: "activities" },
    // Praktické
    { words: ["kalendar", "termin", "pripomien"], text: "Všetky termíny a pripomienky sú v Kalendári.", label: "Otvoriť Kalendár", feature: "calendar" },
    { words: ["kontakt", "telefon"], text: "Kontakty na lekára, pôrodnicu a blízkych sú v Kontaktoch.", label: "Otvoriť Kontakty", feature: "contacts" },
    { words: ["nakup", "nakupn"], text: "Spoločný nákupný zoznam je v Nákupe.", label: "Otvoriť Nákup", feature: "shopping" },
    { words: ["profil", "nastaven", "zmenit meno", "zmenit udaje", "upravit udaje"], text: "Profil (tvoj aj bábätka) a nastavenia otvoríš cez ☰ vpravo hore.", label: "Otvoriť profil", feature: "profiles" },
    { words: ["nocny rezim", "tmavy rezim"], text: "Nočný režim zapneš tlačidlom 🌙 vpravo hore na domove." },
    { words: ["zasuvk", "vsetky aplikacie", "dalsie aplikacie", "menu"], text: "Všetky aplikácie uvidíš, keď potiahneš spodnú lištu nahor – sú zoradené ako spodná lišta: Bábätko, Mama a Rodina.", label: "Otvoriť zásuvku", kind: "drawer" }
  ];

  function navAnswer(t, ctx) {
    const pre = ctx.life_stage === "pregnancy";
    // Všeobecná otázka o appke → prehľad najdôležitejších miest + prehliadka.
    if (["kde co najdem", "kde co je", "co vsetko vie", "co vsetko je v aplik", "ako funguje aplik", "ako funguje guguboo", "co vie aplik", "co vie guguboo", "ako pouzivat", "napoveda"].some(word => t.includes(word))) {
      return {
        level: "nav",
        text: "Najdôležitejšie miesta:\n• " + (pre ? "Tehotenská knižka – kontroly, výsledky, sono, plán pôrodu" : "Zdravotná knižka – prehliadky, rast, očkovanie") +
          "\n• Mama – tvoje telo, ťažkosti, pitie a nálada\n• Kruh na domove – kroky " + (pre ? "prípravy" : "organizácie") + " a pohoda\n• Kalendár – všetky termíny\n• Naše momenty – fotky, prvé razy a albumy (zapisujú sa samy)\n• Zásuvka (potiahni lištu nahor) – Praktické a Spomienky\n\nStačí sa ma opýtať napríklad „Kde sú fotky?“ a otvorím ti to.",
        actions: [
          { label: pre ? "Tehotenská knižka" : "Zdravotná knižka", kind: "feature", value: pre ? "pregnancy" : "childBook" },
          { label: "Naše momenty", kind: "go", value: "moments:timeline" },
          { label: "Zásuvka", kind: "drawer", value: "" },
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
  function troubleAnswer(item, checked, section) {
    const tips = item.tips.slice(0, 4).map(tip => "• " + tip).join("\n");
    const doctor = item.doctor?.length ? "\n\n" + item.doctorIntro + "\n" + item.doctor.map(line => "• " + line).join("\n") + (item.doctorNote ? "\n" + item.doctorNote : "") + (item.emergency ? "\n" + item.emergency : "") : "";
    return {
      level: "content",
      text: item.title + "\n\nČo môže pomôcť:\n" + tips + doctor + "\n\n(Zdroj: NHS, stránka z " + item.reviewed + ", overené " + checked + ".)",
      actions: [{ label: section === "post" ? "Telo po pôrode" : "Bežné ťažkosti", kind: "go", value: "mama|[data-v2-mama-section='troubles']" }, ...sourceAction(item.source)]
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
          text: topic.title + "\n\nČo stačí:\n" + topic.items.map(x => "• " + x).join("\n") + "\n\nKedy: " + topic.when + "\n\n" + vyb.general + "\n\n(Zdroj: NHS, overené " + vyb.checked + ".)",
          actions: [{ label: "Pridať do Nákupu", kind: "shop", value: topic.id }, { label: "Domov pre bábätko", kind: "checklist", value: topic.checklist }, ...sourceAction(vyb.buySource)]
        };
      }
      if (has(t, ["vybava", "vybavu", "vybavy", "vybavick", "co kupit", "co mam kupit", "co treba kupit", "co potrebujem pre babatko", "co vsetko kupit", "nakupit pre babatko", "kedy kupit", "kedy mam kupit", "kedy nakupit"])) {
        return {
          level: "content",
          text: "Výbava pre bábätko\n\n" + vyb.general + "\n\n" + vyb.bagWhen + "\n\nZáklad podľa NHS: spánok, prebaľovanie, oblečenie, autosedačka a kočík, kŕmenie. Na čo sa chceš pozrieť?\n\n(Zdroj: NHS, overené " + vyb.checked + ".)",
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
    if (pregnant && pre) {
      if (has(t, ["co nesmiem jest", "co mozem jest", "co nejest", "jedl", "syr", "ryb", "tuniak", "pecen", "kav", "kofein", "alkohol", "vino", "pivo"])) {
        const f = pre.food;
        return { level: "content", text: "Jedlo v tehotenstve\n\nRadšej vynechaj:\n" + f.avoid.slice(0, 6).map(x => "• " + x).join("\n") + "\n\nObmedz:\n" + f.limit.map(x => "• " + x).join("\n") + "\n\n" + f.alcohol + "\n\n(Zdroj: NHS, stránka z " + f.reviewed + ", overené " + pre.checked + ".)", actions: [{ label: "Jedlo a pohyb", kind: "go", value: "mama|[data-v2-mama-section='food']" }, ...sourceAction(f.source)] };
      }
      if (has(t, ["vitamin", "kyselin", "folic", "doplnk", "jod"])) {
        const v = pre.vitamins;
        return { level: "content", text: "Vitamíny v tehotenstve\n\n" + v.items.map(([name, text]) => "• " + name + " – " + text).join("\n") + "\n\nDoplnky prebrať aj s lekárom.\n\n(Zdroj: NHS, stránka z " + v.reviewed + ", overené " + pre.checked + ".)", actions: [{ label: "Jedlo a pohyb", kind: "go", value: "mama|[data-v2-mama-section='food']" }, ...sourceAction(v.source)] };
      }
      if (has(t, ["cvic", "sport", "behat", "plavat", "joga", "fitko", "posilnov"])) {
        const e = pre.exercise;
        return { level: "content", text: "Pohyb v tehotenstve\n\n" + e.goal + "\n\n" + e.tips.map(x => "• " + x).join("\n") + "\n\nVyhni sa:\n" + e.avoid.map(x => "• " + x).join("\n") + "\n\n" + e.note + "\n\n(Zdroj: NHS, stránka z " + e.reviewed + ", overené " + pre.checked + ".)", actions: [{ label: "Jedlo a pohyb", kind: "go", value: "mama|[data-v2-mama-section='food']" }, ...sourceAction(e.source)] };
      }
    }
    if (withBaby && post) {
      if (has(t, ["kontrola po porode", "kontrolu po porode", "prehliadka po porode", "gynekolog po porode", "sestonedel"])) {
        const k = post.check;
        return { level: "content", text: (kid ? kid.mother.text : k.when) + "\n\nČo sa zvyčajne preberá:\n" + k.items.map(x => "• " + x).join("\n") + "\n\n(Zdroje: " + (kid ? kid.sourceName + ", overené " + kid.checked + "; " : "") + "NHS, stránka z " + k.reviewed + ".)", actions: [{ label: "Kontrola po pôrode", kind: "go", value: "mama|[data-v2-mama-section='check']" }, ...sourceAction(kid?.source || k.source)] };
      }
      if (post.period && has(t, ["menstru", "periodu", "perioda", "tampon", "kalisok", "antikoncep", "otehotn"])) {
        const p = post.period;
        const tampon = has(t, ["tampon", "kalisok"]);
        const pregnancy = has(t, ["antikoncep", "otehotn"]);
        const items = tampon ? p.padsItems : pregnancy ? p.pregnancyItems : p.returnItems.concat(p.pregnancyItems.slice(0, 1));
        return { level: "content", text: (tampon ? p.padsTitle : pregnancy ? p.pregnancyTitle : "Menštruácia po pôrode") + "\n\n" + items.map(x => "• " + x).join("\n") + "\n\n(Zdroj: NHS, stránka z " + p.reviewed + ", overené " + p.checked + ".)", actions: [{ label: "Menštruačný kalendár", kind: "feature", value: "period" }, ...sourceAction(p.source)] };
      }
      if (has(t, ["baby blues", "popor", "depres", "smutn", "placem", "uzkost", "nezvladam"])) {
        const m = post.mood;
        return { level: "support", text: m.blues + "\n\n" + m.signsIntro + "\n" + m.signs.map(x => "• " + x).join("\n") + "\n\n" + m.help + "\n\n(Zdroj: NHS, stránka z " + m.reviewed + ", overené " + post.checked + ".)", actions: [{ label: "Nálada a spánok", kind: "go", value: "mama|[data-v2-mama-section='mood']" }, { label: "Kontakty na pomoc", kind: "urgentinfo", value: "" }] };
      }
    }
    if (withBaby && kid && has(t, ["kolko prehliadok", "preventivn", "prehliadky u pediatr", "kedy k pediatr", "kedy ist k pediatr", "prehliadk"])) {
      return { level: "content", text: "Preventívne prehliadky u pediatra (hradí ich zdravotná poisťovňa):\n" + kid.checks.map(c => "• " + c.title + ": " + c.text).join("\n") + "\n\n" + kid.dentist.text + "\nPresné termíny ti určí pediater.\n\n(Zdroj: " + kid.sourceName + ", overené " + kid.checked + ".)", actions: [{ label: "Prehliadky", kind: "go", value: "childBook|[data-v2-child-section='checks']" }, ...sourceAction(kid.source)] };
    }
    if (withBaby && kid && has(t, ["ockovan", "vakcin"])) {
      return { level: "content", text: kid.vaccines.note + "\n\nOčkovania si môžeš zapisovať v Zdravotnej knižke.", actions: [{ label: "Zápis očkovaní", kind: "go", value: "childBook|[data-v2-child-section='vaccines']" }, ...sourceAction(kid.vaccines.source)] };
    }
    if (withBaby && has(t, ["prikrm", "tuhu stravu", "tuha strava", "kasick", "prve jedlo", "zacat jest", "dokrm"])) {
      return { level: "content", text: "S tuhou stravou (príkrmami) sa podľa NHS začína, keď má bábätko približne 6 mesiacov.\n\nKedy a ako začať u vás, prebraj s pediatrom.\n\n(Zdroj: NHS – Baby's first solid foods, stránka z 19. 2. 2026, overené 4. 11. 2026.)", actions: [{ label: "Zdroj", kind: "link", value: "https://www.nhs.uk/baby/weaning-and-feeding/babys-first-solid-foods/" }] };
    }
    return null;
  }

  function answer(question) {
    const t = norm(question);
    const plan = J.compute(state);
    const ctx = plan.context;
    const pregnant = ctx.life_stage === "pregnancy";
    const withBaby = ["postpartum", "baby", "parenthood"].includes(ctx.life_stage);

    // 0. Kríza má absolútnu prednosť (oprava Master: predtým bola až za krvácaním – „krvácam a chcem umrieť“
    //    dostalo len pôrodnícku odpoveď). Žiadna improvizácia, len pokojná pomoc a overené kontakty.
    if (has(t, ["ublizit si", "ublizim si", "nechcem zit", "nechcem tu byt", "zabit sa", "zabijem sa", "samovrazd", "chcem umriet", "chcem zomriet", "skoncit so zivotom", "ublizit babatku", "ublizit dietatu", "ublizim babatku", "ublizim dietatu"])) {
      return { level: "urgent", text: "Ďakujem, že si to napísala. Nie si v tom sama a zaslúžiš si pomoc hneď teraz.\n\nAk ti alebo bábätku hrozí nebezpečenstvo, volaj 112. Ak sa potrebuješ s niekým porozprávať, Linka dôvery Nezábudka je k dispozícii nonstop a bezplatne: 0800 800 566.\n\nPovedz to aj niekomu blízkemu, kto môže byť pri tebe.", actions: [{ label: "Volať 112", kind: "tel", value: "112" }, { label: "Linka Nezábudka", kind: "tel", value: "0800800566" }] };
    }
    // 1. Bezpečnosť má vždy prednosť.
    // „Kŕč“ je núdza pri bábätku (záchvat), nie kŕč v nohe mamy – ten má pokojnú odpoveď z NHS nižšie.
    const legCramp = has(t, ["krc"]) && has(t, ["noh", "lytk", "chodid", "lytk"]);
    if (has(t, ["nedycha", "bezvedom", "nereaguje", "modrie", "modra ", "dusi sa", "opuch jazyka", "opuch pier", "vazny uraz"]) || (has(t, ["krc"]) && !legCramp)) {
      return { level: "urgent", text: "Pri tomto je najlepšie hneď sa spojiť s odborníkom.\n\nZavolaj 155 – operátor ťa pokojne prevedie tým, čo robiť. Priprav si adresu, kde si.", actions: [{ label: "Zavolať 155", kind: "tel", value: "155" }, { label: "Zavolať 112", kind: "tel", value: "112" }] };
    }
    // Po pôrode je krvácanie niekoľko týždňov bežné – poplach len pri silnom/náhlom krvácaní (NHS).
    const normalBleeding = withBaby && has(t, ["krvac"]) && !has(t, ["siln", "velmi", "vela krv", "nahle", "zrazenin", "odpadn", "omdl", "zavrat", "toci", "slabo mi", "busi"]);
    if (!normalBleeding && has(t, ["krvac", "plodova voda", "odtiekla voda", "odtieka voda", "nehybe", "menej hybe", "malo sa hybe", "malo hybe", "slabo sa hybe", "necitim pohyb", "prestal sa hybat", "prestala sa hybat", "silna bolest", "rozmazane", "kontrakci"])) {
      return { level: "urgent", text: "Pri tomto je najlepšie ozvať sa hneď odborníkovi – nemusíš to posudzovať sama.\n\nZavolaj do svojej pôrodnice alebo svojmu lekárovi, poradia ti, čo ďalej. Ak sa cítiš naozaj zle, zavolaj 155.", actions: [{ label: "Moje kontakty", kind: "feature", value: "contacts" }, { label: "Zavolať 155", kind: "tel", value: "155" }] };
    }
    if (has(t, ["ublizit si", "nechcem zit", "zabit sa", "samovrazd"])) {
      return { level: "urgent", text: "Ďakujem, že si to napísala. Nie si v tom sama a zaslúžiš si pomoc hneď teraz.\n\nAk ti hrozí nebezpečenstvo, volaj 112. Povedz to aj niekomu blízkemu, kto môže byť pri tebe.", actions: [{ label: "Volať 112", kind: "tel", value: "112" }] };
    }
    // Po pôrode dá náladu konkrétnejšie (baby blues, NHS) obsahová odpoveď nižšie.
    if (!(withBaby && has(t, ["baby blues", "popor", "depres", "smutn", "placem", "uzkost", "nezvladam"])) && has(t, ["smutn", "nezvladam", "depres", "uzkost", "panik", "som unaven", "vycerpan", "placem"])) {
      return { level: "support", text: "To, čo cítiš, je dôležité a nemusíš to niesť sama.\n\nSkús dnes jednu malú vec len pre seba a povedz niekomu blízkemu, ako sa máš. Ak to trvá dlhšie alebo sa to zhoršuje, porozprávaj sa so svojím lekárom alebo pôrodnou asistentkou – je to bežná a správna vec.", actions: [{ label: "Môj súkromný denník", kind: "feature", value: "privateSpace" }, { label: "Kruh pohody", kind: "home" }] };
    }

    // 1b. Sprievodca appkou („kde sú fotky?“) – po bezpečnosti, pred ostatným.
    const nav = navAnswer(t, ctx);
    if (nav) return nav;
    // 1c. Overený obsah appky (ťažkosti, jedlo, telo po pôrode, prehliadky, príkrmy…).
    const verified = contentAnswer(t, ctx, pregnant, withBaby);
    if (verified) return verified;
    // 1d. Príznaky (bod 3): nikdy nediagnostikovať. Pokojne odporučiť lekára, povedať, kedy volať 155,
    // a ponúknuť zapísanie otázky na najbližšiu prehliadku (s dátumom), aby na nič nezabudla.
    // Horúčka u bábätka do 3 mesiacov: bez diagnózy, len bezpečná všeobecná hranica (NHS: pod 3 mesiace a 38 °C a viac → hneď lekár).
    if (withBaby && ctx.baby_age_days !== null && ctx.baby_age_days < 91 && has(t, ["horuck", "teplot", "38", "39", "40"])) {
      return { level: "urgent", text: "Pri bábätku mladšom ako 3 mesiace je pri teplote 38 °C a viac správne ozvať sa hneď lekárovi – aj v noci (pohotovosť alebo 155). Netreba čakať, ako sa to vyvinie.\n\nDiagnózu ti na diaľku nedám, nechcem hádať.\n\n(Všeobecná informácia podľa NHS, nie lekárska rada.)", actions: [{ label: "Zavolať 155", kind: "tel", value: "155" }, { label: "Kontakty", kind: "feature", value: "contacts" }] };
    }
    if (has(t, ["vyrazk", "vyrazil", "flak", "horuck", "teplot", "kasl", "kasel", "nadch", "hnack", "zvraca", "vraca ", "alergi", "zihlav", "kolik", "neje", "nechce jest", "zltacz", "zlte", "pupok", "zapal", "bolest", "boli ho", "boli ju", "boli ma", "svrbi", "nespi", "stale place", "vela place"])) {
      const who = withBaby ? "pediatrovi" : "svojmu lekárovi alebo pôrodnej asistentke";
      return {
        level: "support",
        text: "Pri tom, čo opisuješ, sa oplatí ozvať " + who + " – poradí ti, či treba prísť a čo robiť. Diagnózu ti na diaľku nedám, nechcem hádať.\n\n" +
          (withBaby ? "Ak sa pridá ťažké dýchanie, opuch pier či jazyka alebo je bábätko nezvyčajne malátne, volaj 155." : "Ak sa cítiš naozaj zle, volaj 155.") +
          "\n\nMôžem ti to zapísať do otázok na najbližšiu prehliadku, aby si na nič nezabudla.",
        actions: [
          { label: withBaby ? "Zapísať pre pediatra" : "Zapísať pre lekára", kind: withBaby ? "pedq" : "docq", value: question },
          { label: "Kontakty", kind: "feature", value: "contacts" },
          { label: "Kontakty na pomoc", kind: "urgentinfo", value: "" }
        ]
      };
    }

    // 2. Plán a úlohy.
    if (has(t, ["co ma caka", "co ma teraz", "co mam urobit", "co mam robit", "plan", "dalsi krok", "co teraz"])) return planAnswer(ctx, plan, "all");
    if (has(t, ["vybavit", "co musim", "co este", "uloh", "pripravit pred porodom"])) return planAnswer(ctx, plan, "tasks");
    if (has(t, ["task", "zbal"])) return itemAnswer("preg.bag", "Taška do pôrodnice je v Mojej príprave.");
    if (has(t, ["porodnic"])) return itemAnswer("preg.hospital", "Pôrodnicu si ulož v Mojej príprave.");
    if (has(t, ["pediatr", "detsky lekar"])) return withBaby ? itemAnswer("baby.pediatrician-visit", "") : itemAnswer("preg.pediatrician", "");
    if (has(t, ["vybav", "postielk", "spanie babatka", "kde bude spat"])) return itemAnswer("preg.sleep-place", "");
    if (has(t, ["kontakt", "gynekolog"])) return itemAnswer("preg.contacts", "");

    // 3. Kde som.
    if (has(t, ["tyzden", "ako rastie", "velke", "velky", "velkost", "brusk", "co sa deje", "ako sa mam", "co sa mnou"]) && pregnant) {
      const entry = weekEntry(ctx);
      const head = "Si v " + ctx.pregnancy_week + ". týždni tehotenstva" + (ctx.due_days > 0 ? " – do termínu zostáva " + ctx.due_days + " dní." : ".");
      if (!entry) return { text: head, actions: [{ label: "Tehotenská knižka", kind: "feature", value: "pregnancy" }] };
      const url = entry.source_urls?.[0];
      return {
        text: head + (entry.size ? "\nBábätko meria " + entry.size + "." : "") + (entry.baby ? "\n\nBábätko: " + entry.baby : "") + (entry.you ? "\n\nTy: " + entry.you : "") + "\n\n(Zo zdroja NHS, každá veta overená citátom, kontrola " + formatChecked(content().pregnancyWeeks.meta.last_checked) + ".)",
        actions: url ? [{ label: "Zdroj", kind: "link", value: url }] : []
      };
    }
    if (has(t, ["100 dni", "sto dni", "100dni"])) {
      if (ctx.baby_age_days === null) return { text: "100 dní spolu začneme počítať od narodenia bábätka. V ten deň sa ti ozvem ❤️", actions: [] };
      const left = 100 - ctx.baby_age_days;
      return { text: left > 0 ? "Ste spolu " + ctx.baby_age_days + " dní. 100 dní spolu budete mať o " + left + " dní – v ten deň ti pripravím kartičku." : left === 0 ? "Dnes ste spolu 100 dní ❤️" : "100 dní spolu ste oslávili pred " + (-left) + " dňami ❤️", actions: [{ label: "Naše chvíle", kind: "feature", value: "memories" }] };
    }
    if (has(t, ["narodil", "narodila", "porodila", "je na svete", "uz je tu"])) {
      if (withBaby) return { text: "Bábätko už v Guguboo máš ❤️ Ak chceš opraviť dátum alebo miery, nájdeš ich v profile.", actions: [{ label: "Otvoriť profil", kind: "feature", value: "profiles" }] };
      return { text: "Gratulujem! ❤️ Stačí zadať dátum narodenia a Guguboo sa samo prepne na prvé dni s bábätkom. Tvoj plán, kontakty aj spomienky ostanú.", actions: [{ label: "Bábätko je na svete", kind: "birth" }] };
    }

    // 4. Po pôrode – rýchle záznamy.
    if (withBaby && has(t, ["kojen", "dojc", "kŕm", "krm", "flas", "mliek"])) return { text: "Kŕmenie zapíšeš dvoma ťuknutiami – časovač beží aj keď zatvoríš obrazovku.", actions: [{ label: "Zapísať kŕmenie", kind: "feature", value: "feeding" }] };
    if (withBaby && has(t, ["plienk", "prebal"])) return { text: "Prebalenie zapíšeš jedným ťuknutím.", actions: [{ label: "Zapísať prebalenie", kind: "feature", value: "diaper" }] };
    if (withBaby && has(t, ["spank", "spi", "zaspav", "spat"])) return { text: "Spánok môžeš spustiť časovačom. V Spánku nájdeš aj pokojné zvuky na zaspávanie.", actions: [{ label: "Spánok", kind: "feature", value: "sleep" }, { label: "Zvuky", kind: "feature", value: "sounds" }] };

    // 5. Emocionálne veci.
    if (has(t, ["uspavank", "nahrat", "hlas"])) return itemAnswer("preg.voice", "Uspávanku s vlastným hlasom nahráš v časti Zvuky.");
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
        const checked = window.GugubooAdmin.module()?.meta?.last_checked;
        return {
          level: "admin",
          text: (matched.length ? "Tu je, čo k tomu viem z oficiálnych zdrojov:" : "Pre tvoju situáciu (" + J.stageLabel(ctx) + ") sa ťa môžu týkať tieto veci:") +
            "\n" + list.map(item => "• " + item.title + (window.GugubooAdmin.isAutomatic(item) ? " – vybaví sa samo" : item.verification_status === "verified" ? "" : " (časť údajov ešte overujeme)")).join("\n") +
            "\n\nKaždú informáciu mám z oficiálnej stránky úradu" + (checked ? " (kontrola " + formatChecked(checked) + ")" : "") + ". O nároku vždy rozhoduje úrad.",
          actions: list.map(item => ({ label: item.title, kind: "admin", value: item.id }))
        };
      }
      return {
        level: "admin",
        text: "Úrady a príspevky chcem robiť poriadne: každú informáciu len z oficiálneho zdroja a s dátumom overenia. Tento prehľad pre tvoju situáciu práve pripravujeme.\n\nDovtedy nájdeš presné a aktuálne pravidlá priamo na oficiálnych stránkach:",
        actions: [
          { label: OFFICIAL.slovensko[0], kind: "link", value: OFFICIAL.slovensko[1] },
          { label: OFFICIAL.socpoist[0], kind: "link", value: OFFICIAL.socpoist[1] },
          { label: "Ministerstvo práce (MPSVR)", kind: "link", value: OFFICIAL.mpsvr[1] }
        ]
      };
    }

    // 7. Zdvorilosti.
    if (has(t, ["ahoj", "dobry den", "cau", "zdravim"])) return { text: "Ahoj! Som GuguChat. Poradím ti, čo je teraz dôležité, a pomôžem ti to rovno vybaviť. Na čo sa chceš opýtať?", actions: [{ label: "Čo ma teraz čaká?", kind: "ask", value: "Čo ma teraz čaká?" }] };
    if (has(t, ["dakujem", "vdaka", "super"])) return { text: "Rado sa stalo ❤️ Keď budeš niečo potrebovať, som tu.", actions: [] };

    // 8. Neviem – úprimne a zapíšem ako medzeru v znalostiach.
    state.v2.gaps.push({ q: question, stage: ctx.life_stage, at: new Date().toISOString() });
    track("chat_gap");
    return {
      level: "unknown",
      text: "Na toto ti zatiaľ neviem odpovedať s istotou a nechcem hádať. Otázku som si zapísala, aby sme Guguboo naučili aj toto.\n\nAk ide o zdravie, najlepšie ti poradí tvoj lekár.",
      actions: [{ label: "Čo ma teraz čaká?", kind: "ask", value: "Čo ma teraz čaká?" }]
    };
  }

  // ——— GuguChat: UI ———
  function chips(ctx) {
    if (ctx.life_stage === "pregnancy") return ["Čo ma teraz čaká?", "Kde čo nájdem?", "Čo ešte musím vybaviť pred pôrodom?", "Ako rastie bábätko?", "Úrady a príspevky"];
    if (ctx.life_stage === "setup") return ["Ako začať?", "Úrady a príspevky"];
    return ["Čo ma teraz čaká?", "Kde čo nájdem?", "Zapísať kŕmenie", "Kedy k pediatrovi?", "Úrady po pôrode"];
  }

  function proactiveOpening(plan) {
    const ctx = plan.context;
    const name = state.user?.name ? ", " + state.user.name : "";
    if (ctx.life_stage === "setup") return { role: "bot", text: "Ahoj" + name + ". Som GuguChat. Keď doplníš termín pôrodu alebo dátum narodenia, budem vedieť, čo je pre teba práve dôležité.", actions: [{ label: "Doplniť údaje", kind: "feature", value: "profiles" }] };
    const next = plan.next_best_action;
    const soon = plan.what_is_coming[0];
    let text = "Ahoj" + name + ". Viem, kde na svojej ceste si: " + J.stageLabel(ctx) + ".";
    if (next) text += "\n\nTeraz by som začala týmto: " + next.title + ".";
    if (soon) text += "\nO " + soon.startsInDays + " dní ťa čaká: " + soon.title + " – nemusíš to riešiť dnes, ozvem sa.";
    return { role: "bot", text, actions: next ? itemActions(next) : [] };
  }

  function messageHtml(message) {
    if (message.role === "user") return "<div class='v2-msg v2-msg-user'>" + esc(message.text) + "</div>";
    const actions = (message.actions || []).map(action => {
      if (action.kind === "tel") return "<a class='v2-chat-action v2-chat-action-urgent' href='tel:" + esc(action.value) + "'>" + esc(action.label) + "</a>";
      if (action.kind === "link") return "<a class='v2-chat-action' href='" + esc(action.value) + "' target='_blank' rel='noopener noreferrer'>" + esc(action.label) + " ↗</a>";
      return "<button class='v2-chat-action' type='button' data-v2-chat-kind='" + esc(action.kind) + "' data-v2-chat-value='" + esc(action.value || "") + "'>" + esc(action.label) + "</button>";
    }).join("");
    return "<div class='v2-msg v2-msg-bot" + (message.level ? " v2-level-" + esc(message.level) : "") + "'><p>" + esc(message.text).replace(/\n/g, "<br>") + "</p>" + (actions ? "<div class='v2-chat-actions'>" + actions + "</div>" : "") + "</div>";
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
      "<header class='v2-chat-head'><img src='guguboo-logo-3d-pastel-v2.png' alt=''><div><strong>GuguChat</strong><small>", esc(J.stageLabel(plan.context)), " · odpovedám z overeného obsahu Guguboo</small></div></header>",
      "<div class='v2-chat-log' id='v2ChatLog' aria-live='polite'>", state.v2.chat.map(messageHtml).join(""), "</div>",
      "<div class='v2-chat-chips'>", chips(plan.context).map(chip => "<button type='button' data-v2-chat-ask='" + esc(chip) + "'>" + esc(chip) + "</button>").join(""), "</div>",
      "<form class='v2-chat-form' id='v2ChatForm'><label class='v5-sr-only' for='v2ChatInput'>Napíš otázku</label><input id='v2ChatInput' autocomplete='off' placeholder='Napíš, čo riešiš…'><button class='v5-primary' type='submit'>Poslať</button></form>",
      // Samuel 28. 9.: žiadny trvalý „núdzový“ pás – pôsobí strašidelne. Pomoc je vždy nenápadne po ruke
      // a naliehavé kontakty sa ukážu len vtedy, keď ich otázka naozaj vyžaduje.
      "<p class='v2-chat-disclaimer'>GuguChat ti pomáha zorientovať sa. So zdravotnými otázkami sa kedykoľvek obráť aj na svojho lekára. <button type='button' class='v2-chat-help-link' data-v2-chat-kind='helpinfo'>Kontakty na pomoc</button></p>",
      "</div>"
    ].join("");
    const log = byId("v2ChatLog");
    if (log) log.scrollTop = log.scrollHeight;
  }

  function ask(text) {
    const clean = String(text || "").trim();
    if (!clean) return;
    state.v2.chat.push({ role: "user", text: clean });
    const reply = answer(clean);
    state.v2.chat.push({ role: "bot", ...reply });
    track("chat_ask", { level: reply.level || "info", item: reply.item || "" });
    save();
    render();
  }

  function openChat(question) {
    V5.openFeature("guguChat");
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
      if (kind === "urgentinfo") return V5.openUrgentModal?.();
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
        // Zapíše otázku s dátumom do Zdravotnej knižky (pediater) alebo Tehotenskej knižky (lekár).
        state.v5 ||= {};
        const listKey = kind === "pedq" ? "pediatricianQuestions" : "pregnancyQuestions";
        const day = new Date().toLocaleDateString("sk-SK", { day: "numeric", month: "numeric" });
        (state.v5[listKey] ||= []).push(day + ": " + value);
        V5.persist();
        state.v2.chat.push({ role: "bot", text: "Zapísané: „" + value + "“. Nájdeš to v " + (kind === "pedq" ? "Zdravotnej knižke → Otázky pre pediatra" : "Tehotenskej knižke → Otázky pre lekára") + ".", actions: [{ label: "Otvoriť otázky", kind: "go", value: kind === "pedq" ? "childBook|[data-v2-child-section='questions']" : "pregnancy|[data-v5-book-section='questions']" }] });
        save();
        return render();
      }
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
      if (kind === "birth") return window.GugubooBirth?.open();
      if (kind === "admin") return window.GugubooAdmin?.open(value);
      if (kind === "helpinfo") {
        state.v2.chat.push({ role: "bot", text: "Ak by si niekedy potrebovala rýchlu pomoc, stačí zavolať. Kontakt na svoju pôrodnicu a lekára si môžeš uložiť v Kontaktoch, aby si ich mala po ruke.", actions: [{ label: "Záchranka 155", kind: "tel", value: "155" }, { label: "Tiesňová linka 112", kind: "tel", value: "112" }, { label: "Moje kontakty", kind: "feature", value: "contacts" }] });
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
        state.v2.chat.push({ role: "bot", text: "Dobre, pripomeniem ti to " + date.toLocaleDateString("sk-SK", { day: "numeric", month: "long" }) + ". Dovtedy to nemusíš mať v hlave.", actions: [] });
        save();
        return render();
      }
      if (kind === "done" && item) {
        J.markDone(state, item.id);
        track("journey_done", { id: item.id, source: "chat" });
        const next = J.compute(state).next_best_action;
        state.v2.chat.push({ role: "bot", text: "Super, „" + item.title + "“ je hotové. 👏" + (next ? "\n\nĎalší krok: " + next.title + "." : "\n\nMomentálne nemáš nič ďalšie naliehavé."), actions: next ? itemActions(next) : [] });
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
      if (!window.confirm("Začať odznova? Všetky údaje v tejto beta verzii sa vymažú.")) return;
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

  window.GugubooChat = { render, ask, answer, open: openChat };
  window.GugubooV2 = { homeJourneyHtml, homeTodayHtml, planHtml, heroWeek, betaFooterHtml, openItem, track, pregnancyWeek, babySize, ask, openChat, answer };
  refreshHome();
  loadContent().then(() => {
    refreshHome();
    if (byId("guguChat")?.classList.contains("active")) render();
  });
})();

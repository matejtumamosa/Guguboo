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
  const CONTENT_FILES = ["content/pregnancy-weeks.js", "content/life-admin-sk.js"];
  const loadScript = src => new Promise(resolve => {
    const script = document.createElement("script");
    script.src = src + "?v=2.1.0";
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

  function weekEntry(ctx) {
    const weeks = content().pregnancyWeeks?.weeks;
    if (!weeks || ctx.pregnancy_week === null) return null;
    const week = Math.min(42, Math.max(4, ctx.pregnancy_week));
    return weeks[week] ? { week, ...weeks[week] } : null;
  }

  function sourceLine(entry, meta) {
    const url = entry.source_urls?.[0];
    const name = content().pregnancyWeeks?.sources?.[entry.sources?.[0]]?.name || "Zdroj";
    if (!url) return "";
    return "<a class='v2-source' href='" + esc(url) + "' target='_blank' rel='noopener noreferrer'>Zdroj: " + esc(name.split(" – ")[0]) + " · kontrola " + esc(formatChecked(meta?.last_checked)) + " ↗</a>";
  }

  function weekHtml(ctx) {
    const entry = weekEntry(ctx);
    if (!entry) return "";
    const meta = content().pregnancyWeeks.meta;
    return [
      "<section class='v2-week' aria-label='Tento týždeň'>",
      "<header><small>Tento týždeň</small><h2>", entry.week, ". týždeň</h2>", entry.size ? "<span class='v2-week-size'>" + esc(entry.size) + "</span>" : "", "</header>",
      entry.milestone ? "<p class='v2-week-milestone'>✦ " + esc(entry.milestone) + "</p>" : "",
      "<div class='v2-week-block'><strong>Bábätko</strong><p>", esc(entry.baby), "</p></div>",
      "<details class='v2-week-more'><summary>Ty a tip na tento týždeň</summary>",
      "<div class='v2-week-block'><strong>Ty</strong><p>", esc(entry.you), "</p></div>",
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
      now.length ? now.map(journeyCard).join("") : "<p class='v2-journey-empty'>Na dnes je všetko podstatné hotové. Užívajte si to ❤️</p>",
      soon.length ? [
        "<div class='v2-journey-soon'><h3>Čoskoro</h3>",
        soon.map(item => "<button type='button' data-v2-journey-open='" + esc(item.id) + "'><span>" + esc(item.title) + "</span><em>o " + item.startsInDays + " " + (item.startsInDays === 1 ? "deň" : item.startsInDays < 5 ? "dni" : "dní") + "</em></button>").join(""),
        "</div>"
      ].join("") : "",
      plan.transition ? "<button class='v2-journey-transition' type='button' data-v2-birth-open><span aria-hidden='true'>♡</span><span><strong>Bábätko je na svete?</strong><small>Daj vedieť a Guguboo sa prepne na prvé dni spolu</small></span><span class='v5-row-arrow' aria-hidden='true'>›</span></button>" : "",
      "<footer class='v2-journey-later'><span>", later ? "Ďalších " + later + " vecí zatiaľ nemusíš riešiť. Keď príde čas, ozvem sa." : "Zvyšok počká. Keď príde čas, ozvem sa.", "</span>",
      "<button type='button' data-v2-chat-ask='Čo ma teraz čaká?'>Opýtať sa GuguChatu</button></footer>",
      "</section>"
    ].join("");
  }

  function betaFooterHtml() {
    return "<aside class='v2-beta-note'><span><strong>Beta verzia</strong> · údaje sa po zatvorení okna vymažú</span><span class='v2-beta-actions'><button type='button' data-v2-feedback>Dať spätnú väzbu</button><button type='button' data-v2-reset>Začať odznova</button></span></aside>";
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
      app: "guguboo-v2-beta", created: new Date().toISOString().slice(0, 10),
      answers: { helped: data.get("helped") || null, second_pregnancy_app: data.get("second_app") || null, note: byId("v2FeedbackText").value.trim() || null },
      metrics: metrics(),
      unanswered_questions: (state.v2.gaps || []).map(gap => ({ q: gap.q, stage: gap.stage }))
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

  function answer(question) {
    const t = norm(question);
    const plan = J.compute(state);
    const ctx = plan.context;
    const pregnant = ctx.life_stage === "pregnancy";
    const withBaby = ["postpartum", "baby", "parenthood"].includes(ctx.life_stage);

    // 1. Bezpečnosť má vždy prednosť.
    if (has(t, ["nedycha", "bezvedom", "nereaguje", "modrie", "modra ", "krc", "dusi sa", "opuch jazyka", "opuch pier", "vazny uraz"])) {
      return { level: "urgent", text: "Pri tomto je najlepšie hneď sa spojiť s odborníkom.\n\nZavolaj 155 – operátor ťa pokojne prevedie tým, čo robiť. Priprav si adresu, kde ste.", actions: [{ label: "Zavolať 155", kind: "tel", value: "155" }, { label: "Zavolať 112", kind: "tel", value: "112" }] };
    }
    if (has(t, ["krvac", "plodova voda", "odtiekla voda", "odtieka voda", "nehybe", "menej hybe", "prestal sa hybat", "prestala sa hybat", "silna bolest", "rozmazane", "kontrakci"])) {
      return { level: "urgent", text: "Pri tomto je najlepšie ozvať sa hneď odborníkovi – nemusíš to posudzovať sama.\n\nZavolaj do svojej pôrodnice alebo svojmu lekárovi, poradia ti, čo ďalej. Ak sa cítiš naozaj zle, zavolaj 155.", actions: [{ label: "Moje kontakty", kind: "feature", value: "contacts" }, { label: "Zavolať 155", kind: "tel", value: "155" }] };
    }
    if (has(t, ["ublizit si", "nechcem zit", "zabit sa", "samovrazd"])) {
      return { level: "urgent", text: "Ďakujem, že si to napísala. Nie si v tom sama a zaslúžiš si pomoc hneď teraz.\n\nAk ti hrozí nebezpečenstvo, volaj 112. Povedz to aj niekomu blízkemu, kto môže byť pri tebe.", actions: [{ label: "Volať 112", kind: "tel", value: "112" }] };
    }
    if (has(t, ["smutn", "nezvladam", "depres", "uzkost", "panik", "som unaven", "vycerpan", "placem"])) {
      return { level: "support", text: "To, čo cítiš, je dôležité a nemusíš to niesť sama.\n\nSkús dnes jednu malú vec len pre seba a povedz niekomu blízkemu, ako sa máš. Ak to trvá dlhšie alebo sa to zhoršuje, porozprávaj sa so svojím lekárom alebo pôrodnou asistentkou – je to bežná a správna vec.", actions: [{ label: "Môj priestor", kind: "feature", value: "privateSpace" }, { label: "Kruh pohody", kind: "home" }] };
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
        text: head + (entry.size ? "\nBábätko meria " + entry.size + "." : "") + "\n\nBábätko: " + entry.baby + "\n\nTy: " + entry.you + "\n\n(Zhrnuté zo zdroja NHS, kontrola " + formatChecked(content().pregnancyWeeks.meta.last_checked) + ".)",
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
        const matched = adminItems.filter(item => norm(item.title).split(/\s+/).some(word => word.length > 4 && t.includes(word.slice(0, 6))));
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
    if (ctx.life_stage === "pregnancy") return ["Čo ma teraz čaká?", "Čo ešte musím vybaviť pred pôrodom?", "Kedy zbaliť tašku?", "Ako rastie bábätko?", "Úrady a príspevky"];
    if (ctx.life_stage === "setup") return ["Ako začať?", "Úrady a príspevky"];
    return ["Čo ma teraz čaká?", "Zapísať kŕmenie", "Kedy k pediatrovi?", "Kedy je 100 dní?", "Úrady po pôrode"];
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
  window.GugubooV2 = { homeJourneyHtml, betaFooterHtml, openItem, track };
  refreshHome();
  loadContent().then(() => {
    refreshHome();
    if (byId("guguChat")?.classList.contains("active")) render();
  });
})();

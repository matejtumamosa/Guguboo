/*
 * GUGUBOO V2 – prehliadka domova pri prvom otvorení. Vysvetlí všetky tlačidlá domova; pri dôležitých krokoch
 * je „Vyskúšať“ (funkcia sa otvorí, prehliadka sa pozastaví a na domove sa dá pokračovať). Ukáže sa raz
 * (state.v5.tourDone); z pätičky domova sa dá spustiť znova.
 */
(function initGugubooTour() {
  "use strict";

  if (typeof state === "undefined") return;

  const byId = id => document.getElementById(id);
  // offsetParent je pri pevne umiestnených prvkoch (spodná lišta) null – preto podľa rozmerov a štýlu.
  const visible = element => Boolean(element) && element.getClientRects().length > 0 && element.getBoundingClientRect().width > 0 && getComputedStyle(element).visibility !== "hidden";
  const homeEl = () => byId("v5Home");
  let running = false;
  let stepIndex = 0;
  let flow = [];

  let setupShown = false;

  function setupSteps() {
    if (setupShown || state.v5?.setupDone) return [];
    const list = [];
    if ("Notification" in window && Notification.permission === "default") {
      list.push({
        setup: true,
        target: () => null,
        kicker: "Upozornenia",
        title: "Pripomenieme ti dôležité veci",
        icon: "bell",
        text: "Kontroly, termíny a úrady – len to, čo sa ťa týka.",
        note: "V beta verzii prídu upozornenia, len keď máš appku otvorenú.",
        nextLabel: "Povoliť upozornenia",
        skipLabel: "Neskôr",
        onNext: async () => {
          try { state.v5.notifyPermission = await Notification.requestPermission(); } catch (_) { state.v5.notifyPermission = "error"; }
        }
      });
    }
    // „Pridaj na plochu“ odstránené – Guguboo bude natívna mobilná appka z obchodu (Samuel 16. 10.).
    return list;
  }

  // Prehliadka domova (Samuel 17. 10.: 4 kroky nestačia – vysvetliť všetky tlačidlá a pri dôležitých dať „Vyskúšať“).
  // try: { label, run, stay } – stay = akcia sa ukáže hneď a prehliadka pokračuje; inak sa prehliadka pozastaví
  // a na domove ostane malé tlačidlo „Pokračovať v prehliadke“.
  function steps() {
    const expecting = state.profile?.status === "expecting";
    const home = homeEl();
    const V5 = () => window.GugubooV5;
    // Master (Samo 14. 11.): prehliadka opisuje SÚČASNÝ domov – hľadanie, týždeň/bábätko, skratky, Čas pre teba, Dnes, lišta.
    return [
      ...setupSteps(),
      {
        intro: true,
        target: () => null,
        title: "Zoznám sa s Guguboo",
        icon: "spark",
        text: "Ukážem ti domov – všetko si môžeš hneď vyskúšať."
      },
      {
        top: true,
        target: () => document.querySelector("#v5Header [data-v5-night]")?.parentElement,
        title: "Menu a nočný režim",
        items: [
          { icon: "menu", name: "Menu", text: "profil a nastavenia." },
          { icon: "moon", name: "Nočný režim", text: "stlmí farby, keď si hore v noci." }
        ]
      },
      {
        target: () => home?.querySelector(".g2-askwrap"),
        title: "Hľadaj alebo sa opýtaj",
        items: [
          { icon: "search", name: "Hľadaj", text: "napíš otázku. GuguChat odpovie a ukáže, kde to nájdeš." }
        ],
        try: { label: "Vyskúšať GuguChat", run: () => home?.querySelector("[data-g2-ask]")?.click() }
      },
      expecting ? {
        target: () => home?.querySelector(".g2-hero"),
        title: "Tvoj týždeň",
        items: [
          { icon: "baby", name: "Týždeň a veľkosť", text: "ovocie ukazuje veľkosť bábätka." }
        ],
        try: { label: "Otvoriť Tvoj týždeň", run: () => V5()?.openFeature("babySize") }
      } : {
        target: () => home?.querySelector(".g2-hero"),
        title: "Tvoje bábätko",
        items: [
          { icon: "baby", name: "Vek a Tvoj mesiac", text: "čo bábätko práve objavuje." }
        ],
        try: { label: "Otvoriť Tvoj mesiac", run: () => home?.querySelector("[data-g2-month-open]")?.click() }
      },
      {
        target: () => home?.querySelector(".g2-shorts"),
        title: "Tri skratky",
        text: expecting
          ? "Čo teraz potrebuješ najčastejšie. Menia sa podľa týždňa."
          : "Čo teraz potrebuješ najčastejšie. Menia sa, ako bábätko rastie."
      },
      {
        target: () => home?.querySelector(".g2-ring-card"),
        title: "Rýchle záznamy",
        text: expecting ? "Ťukni na diel a zapíš. V strede je Dnes." : "Ťukni na diel – kŕmenie, spánok, plienky. V strede je Dnes alebo bežiaci čas."
      },
      {
        target: () => home?.querySelector(".g2-today-row"),
        title: "Dnes stačí jedno",
        text: "Jedna vec na dnes. Ostatné počká v Pláne."
      },
      {
        target: () => byId("v5BottomBar"),
        title: "Spodná lišta",
        lead: "4 časti appky:",
        chips: () => [...document.querySelectorAll("#v5BottomBar .v5-bottom-action")].map(button => ({
          iconHtml: button.querySelector(".v5-nav-icon")?.innerHTML || "",
          label: button.querySelector(".v5-nav-icon + span")?.textContent || ""
        })),
        after: "Potiahni lištu nahor – uvidíš všetko.",
        try: { label: "Ukázať všetko", run: () => document.querySelector("#v5BottomBar .g2-bar-handle")?.click() }
      }
    ];
  }

  function canStart() {
    if (running || !state.onboarded || state.v5?.tourDone || state.v5?.tourPaused) return false;
    if (!byId("home")?.classList.contains("active")) return false;
    if (document.body.classList.contains("welcome-mode") || document.body.classList.contains("v5-app-window-open")) return false;
    if (document.querySelector("#v5OOverlay.open, #v5DrawerOverlay.open, #v5QuickRecordOverlay.open, .v2-birth-overlay.open")) return false;
    return visible(homeEl()?.querySelector(".v5-o-card"));
  }

  function layer() {
    let root = byId("v2Tour");
    if (!root) {
      document.body.insertAdjacentHTML("beforeend", [
        "<div id='v2Tour' class='v2-tour' role='dialog' aria-modal='true' aria-labelledby='v2TourTitle'>",
        "<div class='v2-tour-spot' aria-hidden='true'></div>",
        "<section class='v2-tour-card'><button type='button' class='v2-tour-close' data-v2-tour-skip aria-label='Zavrieť prehliadku'>" + window.GugubooV5.glyph("close") + "</button><span class='v2-tour-icon' id='v2TourIcon' aria-hidden='true'></span><small id='v2TourCount'></small><h2 id='v2TourTitle' tabindex='-1'></h2><p id='v2TourText'></p><small class='v2-tour-note' id='v2TourNote'></small>",
        "<button type='button' class='v2-tour-try' data-v2-tour-try hidden></button>",
        "<div class='v2-tour-actions'><button type='button' class='v2-tour-skip' data-v2-tour-skip>Preskočiť</button>",
        "<button type='button' class='v5-primary' data-v2-tour-next>Ďalej</button></div></section></div>"
      ].join(""));
      root = byId("v2Tour");
    }
    return root;
  }

  // Telo kroku: úvodná veta (lead), riadky s piktogramom a názvom z appky (items), ikony z lišty (chips),
  // záverečná veta (after); staré kroky len s text.
  function stepBodyHtml(step) {
    const V5 = window.GugubooV5;
    const esc = V5?.escapeHtml || (value => String(value).replace(/[&<>"']/g, ch => "&#" + ch.charCodeAt(0) + ";"));
    const items = typeof step.items === "function" ? step.items() : step.items || [];
    const chips = typeof step.chips === "function" ? step.chips() : step.chips || [];
    if (!items.length && !chips.length) return esc(step.text || "");
    // Zmenšený odznak týždňa z domova – vlastné spany, aby nezdedil štýly b/small z karty sprievodcu.
    const mark = item => item.week
      ? "<span class='v2-tour-week' aria-hidden='true'><span class='v2-tour-week-num'>" + esc(item.week) + "</span><span class='v2-tour-week-label'>týždeň</span></span>"
      : item.icon && V5?.icon ? "<span class='v5-icon' aria-hidden='true'>" + V5.icon(item.icon) + "</span>" : "";
    return [
      step.lead ? "<span class='v2-tour-lead'>" + esc(step.lead) + "</span>" : "",
      items.length ? "<span class='v2-tour-items'>" + items.map(item =>
        "<span class='v2-tour-item" + (mark(item) ? "" : " no-icon") + "'>" + mark(item) + "<span><b>" + esc(item.name) + "</b> – " + esc(item.text) + "</span></span>").join("") + "</span>" : "",
      chips.length ? "<span class='v2-tour-chips'>" + chips.map(chip =>
        "<span class='v2-tour-chip'><span class='v5-icon' aria-hidden='true'>" + chip.iconHtml + "</span><b>" + esc(chip.label) + "</b></span>").join("") + "</span>" : "",
      step.after ? "<span class='v2-tour-after'>" + esc(step.after) + "</span>" : ""
    ].join("");
  }

  function place() {
    const root = byId("v2Tour");
    if (!root || !running) return;
    const list = flow;
    const step = list[stepIndex];
    const target = step.target();
    const spot = root.querySelector(".v2-tour-spot");
    const card = root.querySelector(".v2-tour-card");
    const isSpot = item => !item.intro && !item.setup;
    const realSteps = list.filter(isSpot).length;
    const position = list.slice(0, stepIndex + 1).filter(isSpot).length;
    byId("v2TourCount").textContent = step.setup ? step.kicker : step.intro ? "Vitaj v Guguboo" : position + " / " + realSteps;
    byId("v2TourTitle").textContent = step.title;
    byId("v2TourText").innerHTML = stepBodyHtml(step);
    root.querySelector("[data-v2-tour-next]").textContent = step.nextLabel || (step.intro ? "Ukázať" : stepIndex === list.length - 1 ? "Rozumiem" : "Ďalej");
    root.querySelector(".v2-tour-skip").textContent = step.skipLabel || (step.intro ? "Teraz nie" : "Preskočiť");
    root.classList.toggle("is-intro", Boolean(step.intro || step.setup));
    const icons = { bell: "<svg viewBox='0 0 24 24'><path d='M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z'/><path d='M10 20a2 2 0 0 0 4 0'/></svg>", spark: "<svg viewBox='0 0 24 24'><path d='M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z'/><path d='M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z'/></svg>" };
    byId("v2TourIcon").innerHTML = icons[step.icon] || "";
    byId("v2TourNote").textContent = step.note || "";
    const tryButton = root.querySelector("[data-v2-tour-try]");
    tryButton.hidden = !step.try;
    // Master 4.0 (Audit V13, T113): znak ▶ → linková ikona prehrať (text tlačidla bez znaku)
    tryButton.textContent = step.try ? step.try.label : "";
    if (step.try && window.GugubooV5?.glyph) tryButton.insertAdjacentHTML("afterbegin", window.GugubooV5.glyph("play") + " ");
    if (!visible(target)) { spot.style.display = "none"; card.style.top = "32%"; return; }
    const rect = target.getBoundingClientRect();
    const pad = 8;
    spot.style.display = "block";
    spot.style.top = rect.top - pad + "px";
    spot.style.left = rect.left - pad + "px";
    spot.style.width = rect.width + pad * 2 + "px";
    spot.style.height = rect.height + pad * 2 + "px";
    // Karta pod cieľom, ak je miesto; inak nad ním.
    const cardHeight = card.offsetHeight || 170;
    const below = rect.bottom + pad + 14;
    card.style.top = (below + cardHeight < window.innerHeight - 8 ? below : Math.max(12, rect.top - pad - 14 - cardHeight)) + "px";
  }

  function show() {
    const step = flow[stepIndex];
    const target = step.target();
    // Cieľ v strede obrazovky (spodná lišta je pevná, netreba posúvať).
    if (step.top) window.scrollTo({ top: 0, behavior: "instant" });
    if (target && step.scroll) target.scrollIntoView({ block: "center", behavior: "instant" });
    place();
    window.requestAnimationFrame(place);
  }

  function start(force = false) {
    if (force) { state.v5 ||= {}; state.v5.tourDone = false; state.v5.tourPaused = ""; resumePill(false); }
    if (!force && !canStart()) return;
    running = true;
    stepIndex = 0;
    // Pri opätovnom spustení z pätičky bez okienok nastavenia; zoznam sa počas prechodu nemení.
    if (force) setupShown = true;
    flow = steps();
    setupShown = true;
    const root = layer();
    root.classList.add("open");
    document.body.classList.add("v2-tour-open");
    show();
    // Master 3.9.1 (Samo): fokus na nadpis (ako okná kruhu v 3.9 N3), nie na tlačidlo „Ukázať“ – inak mal hneď po otvorení
    // hrubý fokusový rámik. Klávesnicou sa ide Tabom ďalej na tlačidlá (tie majú rámik len pri :focus-visible).
    window.setTimeout(() => byId("v2TourTitle")?.focus({ preventScroll: true }), 60);
  }

  // „Vyskúšať“: prehliadka sa pozastaví, otvorí sa funkcia a na domove ostane „Pokračovať v prehliadke“.
  function pause() {
    running = false;
    state.v5.tourPaused = flow[stepIndex + 1]?.title || "";
    if (!state.v5.tourPaused) state.v5.tourDone = true;
    window.GugubooV5?.persist?.();
    byId("v2Tour")?.classList.remove("open");
    document.body.classList.remove("v2-tour-open");
  }

  function resume() {
    const title = state.v5.tourPaused;
    state.v5.tourPaused = "";
    window.GugubooV5?.persist?.();
    resumePill(false);
    window.GugubooV5?.openHome?.();
    window.setTimeout(() => {
      setupShown = true;
      flow = steps();
      const index = flow.findIndex(item => item.title === title);
      if (index < 0) return finish();
      running = true;
      stepIndex = index;
      const root = layer();
      root.classList.add("open");
      document.body.classList.add("v2-tour-open");
      show();
    }, 250);
  }

  function resumePill(showIt) {
    let pill = byId("v2TourResume");
    if (!pill && showIt) {
      document.body.insertAdjacentHTML("beforeend", "<div id='v2TourResume' class='v2-tour-resume'><button type='button' data-v2-tour-resume>" + (window.GugubooV5?.glyph?.("play") || "") + " Pokračovať v prehliadke</button><button type='button' class='v2-tour-resume-close' data-v2-tour-resume-close aria-label='Ukončiť prehliadku'>" + window.GugubooV5.glyph("close") + "</button></div>");
      pill = byId("v2TourResume");
    }
    if (pill) pill.classList.toggle("open", Boolean(showIt));
  }

  // Tlačidlo „Pokračovať“ je vidieť len na domove, keď nie je otvorené žiadne okno.
  window.setInterval(() => {
    const onHome = byId("home")?.classList.contains("active") && !document.body.classList.contains("v5-app-window-open")
      && !document.querySelector("#v5OOverlay.open, #v5DrawerOverlay.open, #v5QuickRecordOverlay.open");
    resumePill(Boolean(state.v5?.tourPaused) && !running && onHome);
  }, 600);

  function finish() {
    running = false;
    state.v5 ||= {};
    state.v5.tourDone = true;
    state.v5.tourPaused = "";
    resumePill(false);
    window.GugubooV5?.persist?.();
    byId("v2Tour")?.classList.remove("open");
    document.body.classList.remove("v2-tour-open");
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function advance() {
    if (flow[stepIndex]?.setup && !flow[stepIndex + 1]?.setup) { state.v5.setupDone = true; window.GugubooV5?.persist?.(); }
    if (stepIndex >= flow.length - 1) return finish();
    stepIndex += 1;
    show();
  }

  document.addEventListener("click", async event => {
    // × zavrie všetko; „Neskôr“ pri nastavení len preskočí toto okienko.
    if (event.target.closest(".v2-tour-close")) { state.v5.setupDone = true; return finish(); }
    if (event.target.closest("[data-v2-tour-skip]")) return flow[stepIndex]?.setup ? advance() : finish();
    if (event.target.closest("[data-v2-tour-try]")) {
      const step = flow[stepIndex];
      if (!step?.try) return;
      if (step.try.stay) { step.try.run(); window.setTimeout(show, 250); return; }
      pause();
      step.try.run();
      return;
    }
    if (event.target.closest("[data-v2-tour-resume]")) return resume();
    if (event.target.closest("[data-v2-tour-resume-close]")) return finish();
    const next = event.target.closest("[data-v2-tour-next]");
    if (next) {
      const step = flow[stepIndex];
      if (step?.onNext) { next.disabled = true; await step.onNext(); next.disabled = false; window.GugubooV5?.persist?.(); }
      return advance();
    }
    // Voľba účtu na úvodnej obrazovke – v bete len zapamätá voľbu (skutočné prihlásenie príde so serverom).
    const account = event.target.closest("[data-v2-account]");
    if (account) {
      state.v2Account = account.dataset.v2Account;
      // Master 2.8 (Plán F1-2): v Master bez hlášky „Prihlásenie spustíme čoskoro“ – účty nie sú (údaje len v telefóne); zmaže sa po teste.
      const masterBuild = /^Master/.test(String(window.GUGUBOO_V2_VERSION || ""));
      if (!masterBuild && account.dataset.v2Account !== "guest" && typeof showToast === "function") showToast("Prihlásenie spustíme čoskoro – teraz pokračuješ v beta verzii.");
    }
    if (event.target.closest("[data-v2-tour-restart]")) {
      event.preventDefault();
      window.GugubooV5?.openHome?.();
      window.setTimeout(() => start(true), 250);
    }
  });
  document.addEventListener("keydown", event => {
    if (running && event.key === "Escape") finish();
  });
  window.addEventListener("resize", place);
  window.addEventListener("scroll", place, { passive: true });

  // Spustí sa sama, keď je po úvode prvýkrát zobrazený domov (napr. aj po návrate z kartičky narodenia).
  window.setInterval(() => { if (canStart()) start(); }, 1200);

  // Beta: upozornenie z Kalendára v čase udalosti, kým je appka otvorená (skutočné push príde so serverom).
  function notifyDueReminders() {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    state.v5 ||= {};
    const sent = state.v5.notifiedReminders ||= {};
    const now = Date.now();
    (state.reminders || []).forEach(item => {
      const id = String(item.id || item.title + item.date);
      const when = new Date(item.date).getTime();
      if (!Number.isFinite(when) || item.completedAt || sent[id] || when > now || now - when > 10 * 60000) return;
      sent[id] = true;
      try { new Notification("Guguboo – " + (item.title || "Pripomienka"), { body: "Je čas: " + new Date(when).toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" }), icon: "guguboo-logo-3d-pastel-v2.png" }); } catch (_) {}
    });
    window.GugubooV5?.persist?.();
  }
  window.setInterval(notifyDueReminders, 30000);

  window.GugubooTour = { start: () => start(true) };
})();

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
        text: "Kontroly, termíny a úrady – len to, čo sa ťa týka. Žiadne reklamy.",
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
    return [
      ...setupSteps(),
      {
        intro: true,
        target: () => null,
        title: "Zoznám sa s aplikáciou",
        icon: "spark",
        text: "Ukážem ti, čo je kde na domove. Pri dôležitých veciach si to môžeš hneď vyskúšať a potom pokračovať."
      },
      {
        top: true,
        target: () => document.querySelector("#v5Header [data-v5-night]")?.parentElement,
        title: "Menu a nočný režim",
        text: "☰ Menu – tvoj profil, profil bábätka, rodina a nastavenia.\n🌙 Nočný režim stlmí farby, keď si hore v noci."
      },
      expecting ? {
        scroll: true,
        target: () => home?.querySelector(".v2-week-badge"),
        title: "Krúžok s týždňom",
        text: "Ukazuje, v ktorom týždni si. Ťukni naň a uvidíš, aké veľké je bábätko a čo sa práve vyvíja.",
        try: { label: "Vyskúšať", run: () => V5()?.openFeature("babySize") }
      } : {
        scroll: true,
        target: () => home?.querySelector(".v5-home-hero .v5-baby-avatar"),
        title: "Fotka bábätka",
        text: "Ťukni na krúžok a pridaj fotku bábätka. Uvidíš ju vždy na domove."
      },
      expecting ? {
        scroll: true,
        target: () => home?.querySelector(".v5-glance-strip"),
        title: "Tehotenská knižka, Mama a Dieťa",
        text: "📖 Tehotenská knižka – zápisy z kontrol, výsledky, termíny a prehľad pre lekára.\n🤰 Mama – tvoje telo, bežné ťažkosti, pitie a nálada.\n👶 Dieťa – aké veľké je bábätko.",
        try: { label: "Otvoriť Tehotenskú knižku", run: () => V5()?.openFeature("pregnancy") }
      } : {
        scroll: true,
        target: () => home?.querySelector(".v5-glance-strip"),
        title: "Rýchle záznamy",
        text: "Spánok, kŕmenie a prebalenie zapíšeš jedným ťuknutím. Výška a váha sa ukladajú do rastu a Zdravotná knižka má prehliadky, očkovanie a prehľad pre pediatra.",
        try: { label: "Otvoriť Zdravotnú knižku", run: () => V5()?.openFeature("childBook") }
      },
      {
        scroll: true,
        target: () => home?.querySelector(".v5-circle-mode") || home?.querySelector("[data-v5-circle-mode]")?.parentElement,
        title: expecting ? "Príprava a Pohoda" : "Organizácia a Pohoda",
        text: expecting
          ? "Prepínač nad kruhom. Príprava sú kroky pred pôrodom, Pohoda sú malé veci len pre teba – oddych, telo, opora."
          : "Prepínač nad kruhom. Organizácia sú praktické veci po pôrode, Pohoda sú malé veci len pre teba.",
        try: {
          label: "Prepnúť",
          stay: true,
          run: () => {
            const other = (state.v5.circleMode === "wellbeing") ? "organize" : "wellbeing";
            home?.querySelector("[data-v5-circle-mode='" + other + "']")?.click();
          }
        }
      },
      {
        scroll: true,
        target: () => home?.querySelector(".v5-o-ring-wrap") || home?.querySelector(".v5-o-card"),
        title: "Kruh",
        text: expecting
          ? "Ťukni na farebnú časť kruhu a uvidíš jej kroky – aj jednorazové veci ako oznámiť tehotenstvo blízkym. Kruh sa vypĺňa s každým hotovým krokom a tlačidlo v strede ukáže, čo ďalej."
          : "Ťukni na farebnú časť kruhu a uvidíš jej kroky – aj jednorazové veci ako kartičku narodenia. Kruh sa vypĺňa s každým hotovým krokom a tlačidlo v strede ukáže, čo ďalej."
      },
      {
        scroll: true,
        target: () => home?.querySelector("[data-v5-feature='calendar'].v5-row-card"),
        title: "Kalendár",
        text: "Najbližší termín. Všetky kontroly, prehliadky a pripomienky sú na jednom mieste v Kalendári.",
        try: { label: "Otvoriť Kalendár", run: () => V5()?.openFeature("calendar") }
      },
      {
        target: () => document.querySelector("#v5BottomBar .v2-chat-shutter"),
        title: "GuguChat",
        text: "Keď nevieš, čo ďalej, opýtaj sa. Odpovedá z overených zdrojov a ukáže ďalší krok.",
        try: { label: "Opýtať sa", run: () => document.querySelector("#v5BottomBar .v2-chat-shutter")?.click() }
      },
      {
        target: () => byId("v5BottomBar"),
        title: "Všetky aplikácie",
        text: expecting
          ? "Dole sú tvoje 4 obľúbené. Potiahni lištu nahor a uvidíš všetko ostatné – Kalendár, Denník, Nákup, Kontakty… Obľúbené si vymeníš v zásuvke."
          : "Dole sú tvoje 4 obľúbené. Potiahni lištu nahor a uvidíš všetko ostatné – Mama, Zdravotná knižka, Denník, Nákup… Obľúbené si vymeníš v zásuvke.",
        try: { label: "Otvoriť zásuvku", run: () => V5()?.openDrawer?.() }
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
        "<section class='v2-tour-card'><button type='button' class='v2-tour-close' data-v2-tour-skip aria-label='Zavrieť prehliadku'>×</button><span class='v2-tour-icon' id='v2TourIcon' aria-hidden='true'></span><small id='v2TourCount'></small><h2 id='v2TourTitle'></h2><p id='v2TourText'></p><small class='v2-tour-note' id='v2TourNote'></small>",
        "<button type='button' class='v2-tour-try' data-v2-tour-try hidden></button>",
        "<div class='v2-tour-actions'><button type='button' class='v2-tour-skip' data-v2-tour-skip>Preskočiť</button>",
        "<button type='button' class='v5-primary' data-v2-tour-next>Ďalej</button></div></section></div>"
      ].join(""));
      root = byId("v2Tour");
    }
    return root;
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
    byId("v2TourText").textContent = step.text;
    root.querySelector("[data-v2-tour-next]").textContent = step.nextLabel || (step.intro ? "Ukázať" : stepIndex === list.length - 1 ? "Rozumiem" : "Ďalej");
    root.querySelector(".v2-tour-skip").textContent = step.skipLabel || (step.intro ? "Teraz nie" : "Preskočiť");
    root.classList.toggle("is-intro", Boolean(step.intro || step.setup));
    const icons = { bell: "<svg viewBox='0 0 24 24'><path d='M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z'/><path d='M10 20a2 2 0 0 0 4 0'/></svg>", spark: "<svg viewBox='0 0 24 24'><path d='M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z'/><path d='M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z'/></svg>" };
    byId("v2TourIcon").innerHTML = icons[step.icon] || "";
    byId("v2TourNote").textContent = step.note || "";
    const tryButton = root.querySelector("[data-v2-tour-try]");
    tryButton.hidden = !step.try;
    tryButton.textContent = step.try ? "▶  " + step.try.label : "";
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
    window.setTimeout(() => root.querySelector("[data-v2-tour-next]")?.focus(), 60);
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
      document.body.insertAdjacentHTML("beforeend", "<div id='v2TourResume' class='v2-tour-resume'><button type='button' data-v2-tour-resume>▶ Pokračovať v prehliadke</button><button type='button' class='v2-tour-resume-close' data-v2-tour-resume-close aria-label='Ukončiť prehliadku'>×</button></div>");
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
      if (account.dataset.v2Account !== "guest" && typeof showToast === "function") showToast("Prihlásenie spustíme čoskoro – teraz pokračuješ v beta verzii.");
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

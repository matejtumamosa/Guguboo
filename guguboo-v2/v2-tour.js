/*
 * GUGUBOO V2 – krátka prehliadka domova pri prvom otvorení (Samuel 16. 10. 2026).
 * 4 kroky: krúžok pri mene, kruh, GuguChat, spodná lišta. Dá sa preskočiť, ukáže sa raz
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

  function steps() {
    const expecting = state.profile?.status === "expecting";
    const home = homeEl();
    return [
      {
        target: () => home?.querySelector(".v5-home-hero .v5-baby-avatar"),
        title: expecting ? "Aké veľké je bábätko" : "Profil bábätka",
        text: expecting
          ? "Ťukni na krúžok s týždňom a uvidíš, aké veľké je bábätko a čo sa práve vyvíja."
          : "Ťukni na krúžok a pridaj fotku bábätka. Vek a merania nájdeš v jeho profile."
      },
      {
        target: () => home?.querySelector(".v5-o-ring-wrap") || home?.querySelector(".v5-o-card"),
        title: expecting ? "Príprava a Pohoda" : "Organizácia a Pohoda",
        text: expecting
          ? "Príprava sú kroky pred pôrodom – kruh sa vypĺňa s každým hotovým. Pohoda sú malé veci len pre teba."
          : "Organizácia sú praktické veci po pôrode – doklady, domov, rodina. Pohoda sú malé veci len pre teba."
      },
      {
        target: () => document.querySelector("#v5BottomBar .v2-chat-shutter"),
        title: "GuguChat",
        text: "Keď nevieš, čo ďalej, opýtaj sa. Odpovedá z overených zdrojov a ukáže ďalší krok."
      },
      {
        target: () => byId("v5BottomBar"),
        title: "Všetky aplikácie",
        text: "Potiahni lištu nahor a uvidíš všetko: Kalendár, Denník, Momenty, Nákup… Obľúbené si dáš sem dole."
      }
    ];
  }

  function canStart() {
    if (running || !state.onboarded || state.v5?.tourDone) return false;
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
        "<section class='v2-tour-card'><small id='v2TourCount'></small><h2 id='v2TourTitle'></h2><p id='v2TourText'></p>",
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
    const list = steps();
    const step = list[stepIndex];
    const target = step.target();
    const spot = root.querySelector(".v2-tour-spot");
    const card = root.querySelector(".v2-tour-card");
    byId("v2TourCount").textContent = (stepIndex + 1) + " / " + list.length;
    byId("v2TourTitle").textContent = step.title;
    byId("v2TourText").textContent = step.text;
    root.querySelector("[data-v2-tour-next]").textContent = stepIndex === list.length - 1 ? "Rozumiem" : "Ďalej";
    if (!visible(target)) { spot.style.display = "none"; card.style.top = "30%"; return; }
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
    const target = steps()[stepIndex].target();
    // Cieľ v strede obrazovky (spodná lišta je pevná, netreba posúvať).
    if (target && stepIndex < 2) target.scrollIntoView({ block: "center", behavior: "instant" });
    place();
    window.requestAnimationFrame(place);
  }

  function start(force = false) {
    if (force) { state.v5 ||= {}; state.v5.tourDone = false; }
    if (!force && !canStart()) return;
    running = true;
    stepIndex = 0;
    const root = layer();
    root.classList.add("open");
    document.body.classList.add("v2-tour-open");
    show();
    window.setTimeout(() => root.querySelector("[data-v2-tour-next]")?.focus(), 60);
  }

  function finish() {
    running = false;
    state.v5 ||= {};
    state.v5.tourDone = true;
    window.GugubooV5?.persist?.();
    byId("v2Tour")?.classList.remove("open");
    document.body.classList.remove("v2-tour-open");
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  document.addEventListener("click", event => {
    if (event.target.closest("[data-v2-tour-skip]")) return finish();
    if (event.target.closest("[data-v2-tour-next]")) {
      if (stepIndex >= steps().length - 1) return finish();
      stepIndex += 1;
      return show();
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

  window.GugubooTour = { start: () => start(true) };
})();

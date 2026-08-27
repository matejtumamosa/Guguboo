(function initGugubooV5() {
  "use strict";

  if (typeof state === "undefined" || typeof switchView !== "function") return;

  const byId = id => document.getElementById(id);
  const currentView = () => document.querySelector(".view.active")?.id || "home";
  const todayKey = value => {
    const date = value ? new Date(value) : new Date();
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;"
  })[character]);
  const createId = () => "v5-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  const normalized = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const formatClock = value => {
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" }) : "—";
  };
  const formatDuration = milliseconds => {
    const minutes = Math.max(0, Math.round(milliseconds / 60000));
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return hours ? hours + " h " + rest + " min" : rest + " min";
  };
  const persist = () => {
    try {
      appStorage.setItem(storeKey, JSON.stringify(state));
    } catch (error) {
      console.warn("Guguboo V5: lokálne uloženie zlyhalo", error);
    }
  };
  const announce = text => {
    if (typeof showToast === "function") showToast(text);
    const live = byId("v5Live");
    if (live) live.textContent = text;
  };

  const iconPaths = {
    home: "<path d='M3 11.5 12 4l9 7.5'/><path d='M5.5 10.5V20h13v-9.5'/><path d='M9 20v-6h6v6'/>",
    back: "<path d='m15 18-6-6 6-6'/>",
    user: "<circle cx='12' cy='8' r='4'/><path d='M4.5 21a7.5 7.5 0 0 1 15 0'/>",
    moon: "<path d='M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z'/>",
    feeding: "<path d='M9 3h6'/><path d='M10 3v4l-3 4v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-8l-3-4V3'/><path d='M8 13h8'/>",
    diaper: "<path d='M5 7c2 1 4 1.5 7 1.5S17 8 19 7v9c-2 3-4.3 4.5-7 4.5S7 19 5 16Z'/><path d='M5 11h4l3 3 3-3h4'/>",
    temperature: "<path d='M14 14.8V5a3 3 0 0 0-6 0v9.8a5 5 0 1 0 6 0Z'/><path d='M11 8v9'/>",
    weather: "<path d='M8 17h9a4 4 0 1 0-1.2-7.8A6 6 0 0 0 4 11a3 3 0 0 0 4 6Z'/><path d='M8 3V1M3.5 5.5 2 4M18 4l-1.5 1.5'/>",
    calendar: "<rect x='3' y='5' width='18' height='16' rx='2'/><path d='M16 3v4M8 3v4M3 10h18'/>",
    shopping: "<path d='M3 4h2l2.4 10.5a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 2-1.6L21 8H7'/><circle cx='10' cy='20' r='1'/><circle cx='18' cy='20' r='1'/>",
    contacts: "<rect x='4' y='3' width='16' height='18' rx='2'/><circle cx='12' cy='9' r='2.5'/><path d='M8 17a4 4 0 0 1 8 0M2 7h4M2 12h4M2 17h4'/>",
    travel: "<rect x='4' y='7' width='16' height='13' rx='2'/><path d='M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M4 12h16M9 12v2M15 12v2'/>",
    sound: "<path d='M9 18V5l11-2v13'/><circle cx='6' cy='18' r='3'/><circle cx='17' cy='16' r='3'/>",
    health: "<path d='M12 21S4 16.5 4 9.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 3.5C20 16.5 12 21 12 21Z'/><path d='M8 12h2l1-3 2 6 1-3h2'/>",
    growth: "<path d='M4 20V5M4 20h16'/><path d='m7 15 4-4 3 2 5-6'/><path d='M15 7h4v4'/>",
    memory: "<path d='M12 21S4 16.5 4 9.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 3.5C20 16.5 12 21 12 21Z'/>",
    checklist: "<rect x='4' y='3' width='16' height='18' rx='2'/><path d='m8 9 1.5 1.5L12 8M14 9h3M8 15l1.5 1.5L12 14M14 15h3'/>",
    family: "<circle cx='9' cy='8' r='3'/><circle cx='17' cy='9' r='2.5'/><path d='M3 20a6 6 0 0 1 12 0M14 15a5 5 0 0 1 7 4.5'/>",
    sparkle: "<path d='m12 3 1.4 4.2L18 9l-4.6 1.8L12 15l-1.4-4.2L6 9l4.6-1.8Z'/><path d='m19 15 .7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9Z'/>",
    baby: "<circle cx='12' cy='12' r='8'/><path d='M9 11h.01M15 11h.01M9.5 15a4 4 0 0 0 5 0M12 4c0-2 2-2 3-1'/>",
    book: "<path d='M4 5a4 4 0 0 1 4-2h4v17H8a4 4 0 0 0-4 2ZM20 5a4 4 0 0 0-4-2h-4v17h4a4 4 0 0 1 4 2Z'/>",
    alert: "<path d='M12 3 2.5 20h19Z'/><path d='M12 9v4M12 17h.01'/>",
    products: "<path d='M8 3h8M9 3v4l-3 5v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7l-3-5V3'/><path d='M7 14h10'/>",
    profile: "<circle cx='12' cy='7.5' r='3.5'/><path d='M5 21v-2a7 7 0 0 1 14 0v2'/>",
    cards: "<rect x='5' y='3' width='14' height='18' rx='2'/><path d='M9 8h6M9 12h6M9 16h3'/>"
  };
  const icon = name => "<svg viewBox='0 0 24 24' aria-hidden='true'>" + (iconPaths[name] || iconPaths.sparkle) + "</svg>";

  const features = {
    sleep: { label: "Spánok", description: "Spustiť alebo doplniť spánok", icon: "moon", tier: "premium", flow: "sleep" },
    feeding: { label: "Kŕmenie", description: "Dojčenie, fľaša alebo iné", icon: "feeding", tier: "free", flow: "feeding" },
    diaper: { label: "Plienky", description: "Rýchly záznam prebalenia", icon: "diaper", tier: "free", flow: "diaper" },
    temperature: { label: "Teplota", description: "Uložiť meranie bez ďalších polí", icon: "temperature", tier: "free", flow: "temperature" },
    weather: { label: "Počasie", description: "Oblečenie podľa situácie", icon: "weather", tier: "free", flow: "weather" },
    calendar: { label: "Kalendár", description: "Termíny a rodinné udalosti", icon: "calendar", tier: "premium", view: "calendar" },
    shopping: { label: "Nákup", description: "Spoločný nákupný zoznam", icon: "shopping", tier: "premium", view: "shopping" },
    contacts: { label: "Kontakty", description: "Pediater, rodina a pomoc", icon: "contacts", tier: "free", view: "contacts" },
    travel: { label: "Cestovanie", description: "Príprava a pomoc v okolí", icon: "travel", tier: "free", view: "v5Travel" },
    sounds: { label: "Zvuky", description: "Šumy, uspávanky a nahrávky", icon: "sound", tier: "premium", view: "v5Sounds" },
    night: { label: "Nočná pomoc", description: "Pokojná orientácia v noci", icon: "moon", tier: "premium", view: "night" },
    guide: { label: "Sprievodca", description: "Krátka pomoc krok po kroku", icon: "sparkle", tier: "premium", view: "guide" },
    health: { label: "Zdravie", description: "Záznamy, alergie a report", icon: "health", tier: "premium", view: "health" },
    growth: { label: "Rast", description: "Hmotnosť, výška a obvod hlavy", icon: "growth", tier: "premium", view: "growth" },
    urgent: { label: "Urgentná pomoc", description: "Varovné signály a kontakty", icon: "alert", tier: "free", view: "urgent" },
    checklists: { label: "Checklisty", description: "Zoznamy podľa situácie", icon: "checklist", tier: "free", view: "v5Checklists" },
    memories: { label: "Spomienky", description: "Jeden okamih a fotografia", icon: "memory", tier: "premium", view: "diary" },
    first100: { label: "Prvých 100 dní", description: "Jemná každodenná cesta", icon: "baby", tier: "premium", view: "v5First100" },
    diary: { label: "Rodinný denník", description: "Chronologický príbeh rodiny", icon: "book", tier: "premium", view: "diary" },
    chronicle: { label: "Albumy a kronika", description: "Výstupy z uložených chvíľ", icon: "memory", tier: "addon", view: "memoryOutput" },
    cards: { label: "Kartičky", description: "Narodenie, míľniky a znamenia", icon: "cards", tier: "premium", view: "v5Cards" },
    pregnancy: { label: "Veľkosť bábätka", description: "Obdobie tehotenstva", icon: "baby", tier: "free", view: "pregnancyGrowth" },
    beforeBirth: { label: "Moja príprava", description: "Taška, pôrodnica a prvé dni", icon: "checklist", tier: "free", view: "v5Prenatal" },
    administration: { label: "Úrady", description: "Lokálne kroky a podpora", icon: "book", tier: "free", view: "stateSupport" },
    products: { label: "Výbava a produkty", description: "Používané veci a doplnenie", icon: "products", tier: "premium", view: "products" },
    family: { label: "Rodina", description: "Spoločné úlohy a zastúpenie", icon: "family", tier: "premium", view: "family" },
    profiles: { label: "Profily rodiny", description: "Mama, dieťa a blízke osoby", icon: "profile", tier: "free", view: "v5Profiles" },
    ai: { label: "AI pomoc", description: "Otázka vlastnými slovami", icon: "sparkle", tier: "premium", view: "assistant" }
  };

  const featureGroups = [
    ["Každý deň", ["sleep", "feeding", "diaper", "temperature", "weather", "calendar", "shopping", "contacts", "travel"]],
    ["Pokoj a zaspávanie", ["sounds", "night", "guide"]],
    ["Zdravie a vývoj", ["growth", "health", "urgent", "checklists", "ai"]],
    ["Spomienky", ["memories", "first100", "diary", "chronicle", "cards"]],
    ["Pred narodením", ["pregnancy", "beforeBirth", "administration", "products"]],
    ["Rodina", ["family", "profiles"]]
  ];

  const favoriteOptions = ["sleep", "feeding", "diaper", "temperature", "weather", "sounds", "memories", "calendar", "shopping", "contacts", "travel", "growth", "health", "checklists", "beforeBirth"];
  const defaultFavorites = phase => phase === "expecting"
    ? ["beforeBirth", "checklists", "contacts", "travel"]
    : ["sleep", "feeding", "sounds", "memories"];

  state.v5 ||= {};
  state.v5.version = 5;
  state.v5.phase ||= state.profile.status || "expecting";
  state.v5.favorites ||= defaultFavorites(state.v5.phase);
  state.v5.favoritesCustomized ||= false;
  state.v5.drawerHintDismissed ||= false;
  state.v5.flow ||= { type: "", step: 0, data: {} };
  state.v5.feedingTimer ||= { active: false, start: "", method: "", side: "" };
  state.v5.motherProfile ||= {
    name: state.user?.name || "",
    preferredName: state.user?.name || "",
    birthDate: state.user?.birthDate || "",
    phone: state.user?.phone || "",
    email: state.user?.email || "",
    country: state.profile.country || "SK",
    hospital: state.prenatal?.hospital || "",
    insurance: "",
    notes: "",
    emergencyContact: ""
  };
  state.v5.familyMembers ||= [];
  state.v5.medicines ||= [];
  state.v5.travelSection ||= "home";
  state.v5.profileTab ||= "mother";
  state.v5.selectedZodiac ||= "";
  state.v5.cardPalette ||= "lavender";
  state.v5.weatherLast ||= null;
  state.v5.night ||= false;
  state.v5.checklistCategory ||= "";
  state.v5.checklistCustom ||= [];
  state.v5.prenatalSection ||= "home";
  state.v5.audio ||= { active: false, type: "", title: "", volume: 18, stopAt: "" };
  state.v5.soundSection ||= "home";
  persist();

  const main = document.querySelector(".main");
  const home = byId("home");
  if (!main || !home) return;

  main.insertAdjacentHTML("afterbegin", [
    "<header id='v5Header' data-home='true'>",
    "<button class='v5-icon-button v5-back' type='button' data-v5-back aria-label='Späť'>" + icon("back") + "</button>",
    "<div class='v5-header-brand'><img class='v5-header-logo' src='guguboo-logo-3d-pastel-v2.png' alt='Guguboo'><div class='v5-header-title'><strong id='v5HeaderTitle'>Domov</strong><span id='v5HeaderSubtitle'>Dnešný rodinný prehľad</span></div></div>",
    "<div class='v5-header-actions'>",
    "<button class='v5-icon-button' type='button' data-v5-home aria-label='Domov'>" + icon("home") + "</button>",
    "<button class='v5-icon-button' type='button' data-v5-night aria-label='Nočný režim' aria-pressed='false'>" + icon("moon") + "</button>",
    "<button class='v5-icon-button' type='button' data-v5-feature='profiles' aria-label='Profily rodiny'>" + icon("user") + "</button>",
    "</div>",
    "</header>"
  ].join(""));

  home.insertAdjacentHTML("beforeend", "<div id='v5Home' aria-live='polite'></div>");
  main.insertAdjacentHTML("beforeend", [
    "<section class='view' id='v5Flow'><div class='v5-flow' id='v5FlowContent'></div></section>",
    "<section class='view' id='v5Profiles'><div class='v5-flow' id='v5ProfilesContent'></div></section>",
    "<section class='view' id='v5Travel'><div class='v5-flow' id='v5TravelContent'></div></section>",
    "<section class='view' id='v5First100'><div class='v5-flow' id='v5First100Content'></div></section>",
    "<section class='view' id='v5Cards'><div class='v5-flow' id='v5CardsContent'></div></section>",
    "<section class='view' id='v5Checklists'><div class='v5-flow' id='v5ChecklistsContent'></div></section>",
    "<section class='view' id='v5Prenatal'><div class='v5-flow' id='v5PrenatalContent'></div></section>",
    "<section class='view' id='v5Sounds'><div class='v5-flow' id='v5SoundsContent'></div></section>"
  ].join(""));

  document.body.insertAdjacentHTML("beforeend", [
    "<div id='v5PersistentTimers' aria-live='polite'></div>",
    "<div id='v5AudioDock' aria-live='polite'></div>",
    "<nav id='v5BottomBar' aria-label='Štyri obľúbené funkcie'></nav>",
    "<div id='v5DrawerOverlay' aria-hidden='true'>",
    "<aside id='v5Drawer' role='dialog' aria-modal='true' aria-labelledby='v5DrawerTitle'>",
    "<button class='v5-drawer-handle' type='button' data-v5-close-drawer aria-label='Zatvoriť všetky funkcie'></button>",
    "<div class='v5-drawer-head'><div><h2 id='v5DrawerTitle'>Všetky funkcie</h2><p>Vyberte si podľa toho, čo práve potrebujete.</p></div>",
    "<button class='v5-icon-button' type='button' data-v5-close-drawer aria-label='Zatvoriť'>×</button></div>",
    "<div class='v5-drawer-scroll' id='v5DrawerScroll'></div>",
    "</aside></div>",
    "<div class='v5-drawer-tip' id='v5DrawerTip'>Potiahnite spodné menu nahor a nájdete všetky funkcie.<button type='button' data-v5-dismiss-tip>Rozumiem</button></div>",
    "<div class='sr-only' id='v5Live' aria-live='polite'></div>"
  ].join(""));

  document.body.classList.add("v5-active");
  document.body.classList.toggle("night", !!state.v5.night);

  function syncViewAccessibility() {
    document.querySelectorAll(".view").forEach(view => {
      const active = view.classList.contains("active");
      view.setAttribute("aria-hidden", String(!active));
      if (active) view.removeAttribute("inert");
      else view.setAttribute("inert", "");
    });
    Array.from(home.children).forEach(child => {
      if (child.id === "v5Home") return;
      child.setAttribute("aria-hidden", "true");
      child.setAttribute("inert", "");
    });
    [document.querySelector(".sidebar"), byId("v4BottomNav"), byId("v4AiFab"), byId("v4QuickSheet"), byId("v4ToolsSheet")].filter(Boolean).forEach(element => {
      element.setAttribute("aria-hidden", "true");
      element.setAttribute("inert", "");
    });
  }

  const viewTitles = {
    home: ["Domov", "Dnešný rodinný prehľad"],
    v5Flow: ["Rýchly záznam", "Jedna úloha po krokoch"],
    v5Profiles: ["Profily rodiny", "Údaje stačí zadať raz"],
    v5Travel: ["Cestovanie", "Príprava a pomoc podľa miesta"],
    v5First100: ["Prvých 100 dní", "Jeden malý okamih denne"],
    v5Cards: ["Kartičky", "Narodenie, míľniky a znamenia"],
    v5Checklists: ["Checklisty", "Kategórie podľa situácie"],
    v5Prenatal: ["Pred narodením", "Príprava po krátkych krokoch"],
    v5Sounds: ["Zvuky a uspávanky", "Pokojný prehrávač zostáva poruke"],
    sounds: ["Zvuky a uspávanky", "Pokoj a zaspávanie"],
    sleep: ["Spánok", "Časovač a dnešný prehľad"],
    tracker: ["Denné záznamy", "Starostlivosť na jednom mieste"],
    guide: ["Sprievodca", "Krátka cesta krok po kroku"],
    assistant: ["AI pomoc", "Otázka vlastnými slovami"],
    urgent: ["Urgentná pomoc", "Varovné signály a kontakty"],
    calendar: ["Kalendár", "Spoločné rodinné termíny"],
    shopping: ["Nákup", "Spoločný zoznam rodiny"],
    contacts: ["Kontakty", "Dôležití ľudia a služby"],
    growth: ["Rast", "Merania dieťaťa"],
    health: ["Zdravie", "Záznamy, alergie a report"],
    travel: ["Cestovanie", "Pôvodná funkcia V4"],
    checklists: ["Checklisty", "Zoznamy podľa situácie"],
    beforeBirth: ["Pred narodením", "Príprava krok po kroku"],
    pregnancyGrowth: ["Veľkosť bábätka", "Aktuálne obdobie tehotenstva"],
    stateSupport: ["Úrady", "Lokálne kroky a podpora"],
    products: ["Výbava a produkty", "Používané veci"],
    family: ["Rodina", "Úlohy a spoločné informácie"],
    diary: ["Spomienky", "Fotografie a rodinný príbeh"],
    memoryOutput: ["Kronika", "Výstupy z uložených chvíľ"],
    birthCard: ["Kartička narodenia", "Údaje dieťaťa na jednom mieste"],
    firstYear: ["Obsah podľa veku", "Aktuálne obdobie dieťaťa"],
    premium: ["Premium", "Rozšírené rodinné funkcie"]
  };

  let history = [];
  let observedView = currentView();
  let skipHistory = false;
  let drawerPointerStart = null;
  let drawerPanelStart = null;
  let draggedFavorite = null;

  function ensureFavoritePhase() {
    const phase = state.profile.status || "expecting";
    if (state.v5.phase !== phase && !state.v5.favoritesCustomized) {
      state.v5.phase = phase;
      state.v5.favorites = defaultFavorites(phase);
      persist();
    }
  }

  function routeTo(view) {
    const current = currentView();
    if (current !== view && !["welcome", "birthIntro", "pregnancyIntro"].includes(current)) history.push(current);
    skipHistory = true;
    switchView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    const destination = history.pop() || "home";
    skipHistory = true;
    switchView(destination);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openHome() {
    history = [];
    skipHistory = true;
    switchView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function latestEvent(type) {
    const needle = normalized(type);
    return state.events.slice().reverse().find(event => normalized(event.type).includes(needle));
  }

  function ageData() {
    const birth = state.profile.birth ? new Date(state.profile.birth + "T12:00:00") : null;
    if (!birth || !Number.isFinite(birth.getTime())) return null;
    const days = Math.max(0, Math.floor((Date.now() - birth.getTime()) / 86400000));
    return {
      days,
      label: days < 56 ? Math.max(1, Math.ceil((days + 1) / 7)) + ". týždeň" : days < 730 ? Math.max(2, Math.floor(days / 30.4375)) + ". mesiac" : Math.floor(days / 365.25) + ". rok"
    };
  }

  function dueText() {
    if (!state.profile.due) return "Doplňte termín";
    const due = new Date(state.profile.due + "T12:00:00");
    const days = Math.ceil((due.getTime() - Date.now()) / 86400000);
    if (!Number.isFinite(days)) return "Doplňte termín";
    if (days > 1) return days + " dní do termínu";
    if (days === 1) return "Zajtra je termín";
    if (days === 0) return "Dnes je termín";
    return "Termín už prešiel";
  }

  function activeFeatureId() {
    const view = currentView();
    if (view === "v5Flow") {
      const flowMap = { sleep: "sleep", feeding: "feeding", diaper: "diaper", temperature: "temperature", weather: "weather" };
      return flowMap[state.v5.flow.type] || "";
    }
    return Object.keys(features).find(key => features[key].view === view) || "";
  }

  function renderBottomBar() {
    ensureFavoritePhase();
    const active = activeFeatureId();
    byId("v5BottomBar").innerHTML = "<button class='v5-bottom-handle' type='button' data-v5-open-drawer aria-label='Otvoriť všetky funkcie'><span aria-hidden='true'>⌃</span> Všetky funkcie</button>" + state.v5.favorites.slice(0, 4).map(key => {
      const feature = features[key] || features.sleep;
      return [
        "<button class='v5-bottom-action", active === key ? " active" : "", "' type='button' data-v5-feature='", key,
        "' aria-label='", escapeHtml(feature.label), "'>",
        "<span class='v5-nav-icon'>", icon(feature.icon), "</span><span>", escapeHtml(feature.label), "</span></button>"
      ].join("");
    }).join("");
  }

  function featureButton(key) {
    const feature = features[key];
    return [
      "<button class='v5-action' type='button' data-v5-feature='", key, "'>",
      "<span class='v5-icon'>", icon(feature.icon), "</span><span><strong>", escapeHtml(feature.label),
      "</strong><small>", escapeHtml(feature.description), "</small></span></button>"
    ].join("");
  }

  function quickFeatureButton(key) {
    const feature = features[key] || features.sleep;
    return [
      "<button class='v5-quick-tile' type='button' data-v5-feature='", key, "'>",
      "<span class='v5-icon'>", icon(feature.icon), "</span><strong>", escapeHtml(feature.label), "</strong></button>"
    ].join("");
  }

  function renderHome() {
    const target = byId("v5Home");
    if (!target) return;
    ensureFavoritePhase();
    const expecting = state.profile.status === "expecting";
    const age = ageData();
    const name = state.profile.name || "bábätko";
    const sleep = latestEvent("spán");
    const feeding = latestEvent("kŕm");
    const diaper = latestEvent("plien");
    const nextReminder = state.reminders
      .filter(item => new Date(item.date).getTime() >= Date.now())
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    const today = todayKey();
    const todayMemory = state.diary.find(item => (item.date || String(item.created || "").slice(0, 10)) === today);
    const phaseLine = expecting ? dueText() : escapeHtml(age?.label || "Spoločný deň");
    const pregnancyAvatar = window.GugubooPregnancyAvatar?.current?.() || { week: null, label: "mango", position: "0% 100%" };
    const babyAvatar = expecting
      ? [
          "<button class='v5-baby-avatar v5-fruit-avatar' type='button' data-v5-pregnancy-avatar aria-expanded='false' aria-controls='v5AvatarPopover' aria-label='Pozrieť veľkosť bábätka' style='background-position:", pregnancyAvatar.position, "'><span class='v5-sr-only'>Ovocný avatar</span></button>"
        ].join("")
      : state.profile.photo
        ? "<button class='v5-baby-avatar v5-photo-avatar' type='button' data-v5-child-avatar aria-label='Otvoriť fotografiu a profil dieťaťa'><img src='" + escapeHtml(state.profile.photo) + "' alt='Fotografia dieťaťa'></button>"
        : "<button class='v5-baby-avatar v5-empty-avatar' type='button' data-v5-child-avatar aria-label='Nahrať fotografiu dieťaťa'>☺<span class='v5-sr-only'>Nahrať fotografiu</span></button>";
    const avatarPopover = expecting ? [
      "<div class='v5-avatar-popover' id='v5AvatarPopover' hidden>",
      "<span class='v5-avatar-popover-photo v5-fruit-avatar' role='img' aria-label='", escapeHtml(pregnancyAvatar.label), "' style='background-position:", pregnancyAvatar.position, "'></span>",
      "<div><small>", pregnancyAvatar.week ? escapeHtml(pregnancyAvatar.week + ". týždeň") : "Ovocný avatar", "</small><strong>", escapeHtml(name), " je veľký približne ako ", escapeHtml(pregnancyAvatar.label), ".</strong>",
      "<button type='button' data-v5-feature='pregnancy'>Pozrieť rast bábätka <span aria-hidden='true'>→</span></button></div></div>"
    ].join("") : "";
    const statusCards = expecting ? [
      ["Termín", dueText()],
      ["Pôrodnica", state.prenatal?.hospital || "Zatiaľ nevybraná"],
      ["Príprava", Object.values(state.checks || {}).filter(Boolean).length + " krokov hotových"],
      ["Najbližšie", nextReminder ? nextReminder.title + " · " + formatClock(nextReminder.date) : "Bez pripomienky"]
    ] : [
      ["Spánok", state.sleepTimer?.active ? "Beží od " + formatClock(state.sleepTimer.start) : sleep ? formatClock(sleep.created) + " · " + (sleep.value || "uložené") : "Bez záznamu"],
      ["Kŕmenie", state.v5.feedingTimer.active ? "Prebieha" : feeding ? formatClock(feeding.created) + " · " + (feeding.value || "uložené") : "Bez záznamu"],
      ["Prebalenie", diaper ? formatClock(diaper.created) + " · " + (diaper.value || "uložené") : "Bez záznamu"],
      ["Najbližšie", nextReminder ? nextReminder.title + " · " + formatClock(nextReminder.date) : "Bez pripomienky"]
    ];
    const recommendation = expecting
      ? "Pripravte dnes jednu vec do pôrodnice."
      : state.sleepTimer?.active
        ? "Spánok práve prebieha."
        : "Jeden malý záznam stačí.";
    const recommendationAction = expecting ? "hospital" : state.sleepTimer?.active ? "sleep" : "tracker";
    const recommendationLabel = expecting ? "Otvoriť checklist Taška do pôrodnice" : state.sleepTimer?.active ? "Otvoriť prebiehajúci spánok" : "Otvoriť denné záznamy";
    target.innerHTML = [
      "<section class='v5-home-hero'><div class='v5-home-person'>", babyAvatar, "<div><h1>", escapeHtml(name), "</h1><p>", phaseLine, "</p></div><button class='v5-mini-profile' type='button' data-v5-feature='profiles' aria-label='Otvoriť profil'>",
      icon("user"), "</button></div>", avatarPopover, "<div class='v5-glance-strip'>",
      statusCards.slice(0, 3).map(item => "<div class='v5-glance'><span>" + escapeHtml(item[0]) + "</span><strong>" + escapeHtml(item[1]) + "</strong></div>").join(""),
      "</div></section>",
      "<section class='v5-quick-panel'><div class='v5-compact-head'><div><h2>Rýchlo zaznamenať</h2><p>Jedným dotykom.</p></div><button type='button' data-v5-open-drawer>Upraviť</button></div><div class='v5-quick-grid'>",
      state.v5.favorites.map(quickFeatureButton).join(""), "</div></section>",
      "<button class='v5-row-card' type='button' data-v5-feature='calendar'><span class='v5-icon'>", icon("calendar"),
      "</span><div><strong>", nextReminder ? escapeHtml(nextReminder.title) : "Najbližšia udalosť",
      "</strong><span>", nextReminder ? escapeHtml(new Date(nextReminder.date).toLocaleString("sk-SK", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })) : "Pridať do kalendára",
      "</span></div><span class='v5-row-arrow'>›</span></button>",
      "<button class='v5-today-card' type='button' data-v5-today-action='", recommendationAction, "' aria-label='", escapeHtml(recommendation + " " + recommendationLabel), "'><span class='v5-icon'>", icon(expecting ? "checklist" : "sparkle"), "</span><div><small>Dnes</small><strong>", escapeHtml(recommendation), "</strong><span class='v5-today-hint'>", escapeHtml(recommendationLabel), "</span></div><span class='v5-row-arrow' aria-hidden='true'>›</span></button>",
      expecting ? "" : [
        "<button class='v5-row-card' type='button' data-v5-feature='first100'><span class='v5-icon'>", icon("memory"),
        "</span><div><strong>", todayMemory ? "Dnešný okamih je uložený" : "Uložiť dnešný okamih",
        "</strong><span>", todayMemory ? "Doplniť fotografiu alebo text" : "Fotografia alebo krátka veta",
        "</span></div><span class='v5-row-arrow'>›</span></button>"
      ].join("")
    ].join("");
  }

  function tierText(tier) {
    return tier === "free" ? "Free" : tier === "addon" ? "Doplnok" : "Premium";
  }

  function renderFavoriteEditor() {
    return [
      "<section class='v5-drawer-group' id='v5FavoriteEditor'><h3>Moje spodné menu · presuňte potiahnutím</h3>",
      "<div class='v5-favorite-list'>",
      state.v5.favorites.map((key, index) => {
        const options = favoriteOptions.map(option => "<option value='" + option + "'" + (option === key ? " selected" : "") + ">" + escapeHtml(features[option].label) + "</option>").join("");
        return [
          "<div class='v5-favorite-item' draggable='true' data-v5-favorite-index='", index, "'>",
          "<span class='v5-drag-handle' aria-hidden='true'>↕</span><strong>", escapeHtml(features[key].label),
          "</strong><select aria-label='Funkcia ", index + 1, "' data-v5-favorite-select='", index, "'>", options, "</select></div>"
        ].join("");
      }).join(""),
      "</div></section>"
    ].join("");
  }

  function renderDrawer() {
    const scroll = byId("v5DrawerScroll");
    if (!scroll) return;
    scroll.innerHTML = [
      featureGroups.map(group => [
        "<section class='v5-drawer-group'><h3>", escapeHtml(group[0]), "</h3><div class='v5-drawer-grid'>",
        group[1].map(key => {
          const feature = features[key];
          return [
            "<button class='v5-drawer-app' type='button' data-v5-feature='", key, "'>",
            "<span class='v5-icon'>", icon(feature.icon), "</span><strong>", escapeHtml(feature.label),
            "</strong><span class='v5-tier ", feature.tier, "'>", tierText(feature.tier), "</span></button>"
          ].join("");
        }).join(""), "</div></section>"
      ].join("")).join(""),
      renderFavoriteEditor()
    ].join("");
  }

  function openDrawer() {
    renderDrawer();
    const overlay = byId("v5DrawerOverlay");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    byId("v5DrawerScroll").scrollTop = 0;
    setTimeout(() => byId("v5Drawer").querySelector("[aria-label='Zatvoriť']")?.focus(), 40);
  }

  function closeDrawer() {
    const overlay = byId("v5DrawerOverlay");
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function openFeature(key) {
    const feature = features[key];
    if (!feature) return;
    closeDrawer();
    if (feature.flow) {
      state.v5.flow = { type: feature.flow, step: 0, data: {} };
      persist();
      routeTo("v5Flow");
      renderFlow();
      return;
    }
    if (key === "profiles") {
      routeTo("v5Profiles");
      renderProfiles();
      return;
    }
    if (feature.view === "v5Travel") {
      state.v5.travelSection = "home";
      persist();
      routeTo("v5Travel");
      renderTravel();
      return;
    }
    if (feature.view === "v5First100") {
      routeTo("v5First100");
      renderFirst100();
      return;
    }
    if (feature.view === "v5Cards") {
      routeTo("v5Cards");
      renderCards();
      return;
    }
    if (feature.view === "v5Checklists") {
      state.v5.checklistCategory = "";
      persist();
      routeTo("v5Checklists");
      renderChecklists();
      return;
    }
    if (feature.view === "v5Prenatal") {
      state.v5.prenatalSection = "home";
      persist();
      routeTo("v5Prenatal");
      renderPrenatal();
      return;
    }
    if (feature.view === "v5Sounds") {
      state.v5.soundSection = "home";
      persist();
      routeTo("v5Sounds");
      renderSounds();
      return;
    }
    routeTo(feature.view);
  }

  function openChecklistCategory(category) {
    state.v5.checklistCategory = category;
    persist();
    routeTo("v5Checklists");
    renderChecklists();
  }

  function progress(step, steps) {
    return "<div class='v5-flow-progress' style='--steps:" + steps + "' aria-label='Krok " + (step + 1) + " z " + steps + "'>" +
      Array.from({ length: steps }, (_, index) => "<span class='" + (index <= step ? "active" : "") + "'></span>").join("") + "</div>";
  }

  function flowHead(eyebrow, title, copy, step, steps) {
    return [
      progress(step, steps),
      "<header class='v5-flow-head'><span class='v5-eyebrow'>", escapeHtml(eyebrow), "</span><h1>", escapeHtml(title),
      "</h1><p>", escapeHtml(copy), "</p></header>"
    ].join("");
  }

  function choice(key, label, description, iconName) {
    return [
      "<button class='v5-choice' type='button' data-v5-flow-choice='", key, "'>",
      "<span class='v5-icon'>", icon(iconName), "</span><span><strong>", escapeHtml(label), "</strong><small>",
      escapeHtml(description), "</small></span></button>"
    ].join("");
  }

  function renderFlow() {
    const target = byId("v5FlowContent");
    if (!target) return;
    const flow = state.v5.flow;
    const data = flow.data || {};
    let html = "";

    if (flow.type === "sleep") {
      if (flow.step === 0) {
        html = flowHead("Spánok", "Čo chcete urobiť?", "Vyberte jednu možnosť. Ďalšie údaje sú nepovinné.", 0, 2) +
          "<div class='v5-choice-grid'>" +
          choice("sleep-start", state.sleepTimer?.active ? "Spánok práve beží" : "Spustiť spánok", state.sleepTimer?.active ? "Ukončíte ho z časovača dole." : "Časovač zostane dostupný v celej aplikácii.", "moon") +
          choice("sleep-past", "Pridať spätne", "Doplňte začiatok a koniec.", "calendar") +
          choice("sleep-overview", "Dnešný prehľad", "Pozrite si dnešné uložené spánky.", "growth") +
          "</div>";
      } else if (data.mode === "start") {
        html = flowHead("Spánok", "Aký spánok začína?", "Stačí vybrať typ a spustiť meranie.", 1, 2) +
          "<div class='v5-form-card'><label>Typ spánku<select id='v5SleepType'><option value='day'>Denný spánok</option><option value='night'>Nočný spánok</option></select></label></div>" +
          "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='start-sleep'>Spustiť spánok</button><button class='v5-text-action' type='button' data-v5-flow-back>Späť</button></div>";
      } else if (data.mode === "past") {
        const now = new Date();
        const end = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        const start = new Date(now.getTime() - 60 * 60000 - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        html = flowHead("Spánok", "Kedy dieťa spalo?", "Čas môžete neskôr opraviť.", 1, 2) +
          "<div class='v5-form-card'><label>Začiatok<input id='v5SleepPastStart' type='datetime-local' value='" + escapeHtml(data.start || start) + "'></label>" +
          "<label>Koniec<input id='v5SleepPastEnd' type='datetime-local' value='" + escapeHtml(data.end || end) + "'></label>" +
          "<label>Poznámka — nepovinné<textarea id='v5SleepPastNote' placeholder='Čo pomohlo zaspať?'>" + escapeHtml(data.note || "") + "</textarea></label></div>" +
          "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='save-sleep-past'>Uložiť spánok</button><button class='v5-text-action' type='button' data-v5-flow-back>Späť</button></div>";
      } else {
        const sleeps = state.events.filter(event => normalized(event.type).includes("span") && todayKey(event.created) === todayKey()).slice().reverse();
        html = flowHead("Spánok", "Dnešný prehľad", "Záznam môžete neskôr opraviť v histórii.", 1, 2) +
          "<div class='v5-list'>" + (sleeps.length ? sleeps.map(event =>
            "<div class='v5-row-card'><span class='v5-icon'>" + icon("moon") + "</span><div><strong>" + escapeHtml(event.value || "Spánok") + "</strong><span>" + formatClock(event.created) + "</span></div></div>"
          ).join("") : "<div class='v5-empty'>Zatiaľ tu nie je žiadny dnešný spánok.</div>") + "</div>" +
          "<div class='v5-actions'><button class='v5-secondary' type='button' data-v5-flow-back>Pridať spánok</button></div>";
      }
    }

    if (flow.type === "feeding") {
      if (flow.step === 0) {
        html = flowHead("Kŕmenie", "Ako dieťa kŕmite?", "Vyberte situáciu. Guguboo zobrazí iba potrebné údaje.", 0, 3) +
          "<div class='v5-choice-grid'>" +
          choice("feed-breast", "Dojčenie", "S výberom ľavého alebo pravého prsníka.", "feeding") +
          choice("feed-bottle", "Fľaša", "Mlieko, množstvo a čas.", "feeding") +
          choice("feed-other", "Iné", "Príkrm alebo krátka vlastná poznámka.", "products") +
          choice("feed-past", "Pridať spätne", "Záznam bez spustenia časovača.", "calendar") +
          "</div>";
      } else if (flow.step === 1 && data.method === "breast") {
        html = flowHead("Dojčenie", "Ktorý prsník?", "Stranu môžete počas dojčenia zmeniť.", 1, 3) +
          "<div class='v5-choice-grid'>" +
          choice("side-left", "Ľavý", "Začať na ľavej strane.", "feeding") +
          choice("side-right", "Pravý", "Začať na pravej strane.", "feeding") +
          choice("side-both", "Oba", "Bez poradia strán.", "feeding") +
          choice("side-none", "Bez uvedenia", "Stranu nechcete zapisovať.", "feeding") +
          "</div><div class='v5-actions'><button class='v5-text-action' type='button' data-v5-flow-back>Späť</button></div>";
      } else if (flow.step === 2 && data.method === "breast") {
        html = flowHead("Dojčenie", "Môžete začať.", "Časovač zostane dostupný aj po odchode z tejto obrazovky.", 2, 3) +
          "<div class='v5-form-card'><div class='v5-info-box'>Začiatočná strana: <strong>" + escapeHtml(data.sideLabel || "bez uvedenia") + "</strong></div>" +
          "<label>Poznámka — nepovinné<textarea id='v5FeedNote' placeholder='Napríklad poloha alebo reakcia dieťaťa'></textarea></label></div>" +
          "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='start-feeding'>Spustiť dojčenie</button><button class='v5-secondary' type='button' data-v5-action='save-feeding-quick'>Uložiť bez časovača</button><button class='v5-text-action' type='button' data-v5-flow-back>Späť</button></div>";
      } else {
        const isBottle = data.method === "bottle";
        html = flowHead("Kŕmenie", isBottle ? "Doplňte iba to podstatné." : "Krátky záznam", "Žiadne pole okrem typu nie je povinné.", 1, 2) +
          "<div class='v5-form-card'>" +
          (isBottle ? "<label>Typ mlieka<select id='v5FeedMilk'><option>Materské mlieko</option><option>Umelé mlieko</option><option>Kombinované</option></select></label><label>Množstvo v ml — nepovinné<input id='v5FeedAmount' type='number' min='0' max='1000' inputmode='numeric' placeholder='napr. 120'></label>" : "<label>Čo dieťa jedlo?<input id='v5FeedOther' placeholder='napr. príkrm alebo desiata'></label>") +
          "<label>Čas<input id='v5FeedTime' type='datetime-local' value='" + escapeHtml(data.time || new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)) + "'></label>" +
          "<label>Poznámka — nepovinné<textarea id='v5FeedNote' placeholder='Voliteľná poznámka'></textarea></label></div>" +
          "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='save-feeding'>Uložiť kŕmenie</button><button class='v5-text-action' type='button' data-v5-flow-back>Späť</button></div>";
      }
    }

    if (flow.type === "diaper") {
      if (flow.step === 0) {
        html = flowHead("Plienky", "Čo ste zaznamenali?", "Najprv stačí typ. Podrobnosti sú nepovinné.", 0, 2) +
          "<div class='v5-choice-grid'>" +
          choice("diaper-wet", "Mokrá", "Rýchly záznam moču.", "diaper") +
          choice("diaper-dirty", "Stolica", "Voliteľne doplníte farbu a konzistenciu.", "diaper") +
          choice("diaper-both", "Oboje", "Mokrá plienka aj stolica.", "diaper") +
          choice("diaper-dry", "Suchá", "Kontrolná výmena bez obsahu.", "diaper") +
          "</div>";
      } else {
        html = flowHead("Plienky", "Chcete doplniť detail?", "Ak nie, záznam môžete hneď uložiť.", 1, 2) +
          "<div class='v5-form-card'><div class='v5-info-box'>Typ: <strong>" + escapeHtml(data.diaperLabel || "") + "</strong></div>" +
          (data.diaper === "dirty" || data.diaper === "both" ? "<label>Farba — nepovinné<select id='v5DiaperColor'><option value=''>Neuvádzať</option><option>Žltá</option><option>Hnedá</option><option>Zelená</option><option>Čierna</option><option>Červená / krv</option></select></label><label>Konzistencia — nepovinné<select id='v5DiaperConsistency'><option value=''>Neuvádzať</option><option>Bežná</option><option>Riedka</option><option>Tuhá</option><option>Hlienovitá</option></select></label>" : "") +
          "<label>Poznámka — nepovinné<textarea id='v5DiaperNote' placeholder='Čokoľvek, čo si chcete zapamätať'></textarea></label></div>" +
          "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='save-diaper'>Uložiť prebalenie</button><button class='v5-text-action' type='button' data-v5-flow-back>Späť</button></div>";
      }
    }

    if (flow.type === "temperature") {
      html = flowHead("Teplota", "Akú teplotu ste namerali?", "Uložte meranie. Aplikácia neurčuje diagnózu.", 0, 1) +
        "<div class='v5-form-card'><label>Teplota v °C<input id='v5TemperatureValue' type='number' min='30' max='45' step='.1' inputmode='decimal' placeholder='napr. 37,1'></label>" +
        "<label>Čas merania<input id='v5TemperatureTime' type='datetime-local' value='" + new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) + "'></label>" +
        "<label>Poznámka — nepovinné<textarea id='v5TemperatureNote' placeholder='Miesto merania alebo ďalšie pozorovanie'></textarea></label>" +
        "<div class='v5-warning-box'>Ak máte pochybnosti alebo sa dieťa správa nezvyčajne, obráťte sa na pediatra. Pri urgentnom stave volajte miestne tiesňové číslo.</div></div>" +
        "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='save-temperature'>Uložiť meranie</button></div>";
    }

    if (flow.type === "weather") {
      if (flow.step === 0) {
        html = flowHead("Počasie", "Kam sa chystáte?", "Odporúčanie sa prispôsobí situácii a veku dieťaťa.", 0, 3) +
          "<div class='v5-choice-grid'>" +
          choice("weather-out", "Ideme von", "Prechádzka alebo pobyt vonku.", "weather") +
          choice("weather-stroller", "Kočík", "Zohľadníme prúdenie vzduchu.", "baby") +
          choice("weather-carrier", "Nosič", "Zohľadníme teplo tela rodiča.", "family") +
          choice("weather-car", "Auto", "Zohľadníme presun a autosedačku.", "travel") +
          choice("weather-home", "Zostávame doma", "Vnútorná teplota a komfort.", "home") +
          "</div>";
      } else if (flow.step === 1) {
        html = flowHead("Počasie", "Aké sú podmienky?", "V ostrej verzii sa počasie načíta podľa povolenej polohy. V bete ho môžete zadať.", 1, 3) +
          "<div class='v5-form-card'><label>Vonkajšia teplota °C<input id='v5WeatherOutdoor' type='number' step='1' inputmode='numeric' value='" + escapeHtml(data.outdoor ?? 20) + "'></label>" +
          "<label>Pocitová teplota °C<input id='v5WeatherFeels' type='number' step='1' inputmode='numeric' value='" + escapeHtml(data.feels ?? data.outdoor ?? 20) + "'></label>" +
          "<label>Vietor<select id='v5WeatherWind'><option value='low'>Slabý</option><option value='medium'>Mierny</option><option value='strong'>Silný</option></select></label>" +
          "<label>Zrážky<select id='v5WeatherRain'><option value='none'>Bez zrážok</option><option value='light'>Slabé</option><option value='heavy'>Silné</option></select></label>" +
          "<label>UV<select id='v5WeatherUv'><option value='low'>Nízke</option><option value='medium'>Stredné</option><option value='high'>Vysoké</option></select></label>" +
          "<label>Vnútorná teplota °C — nepovinné<input id='v5WeatherIndoor' type='number' step='1' inputmode='numeric' placeholder='napr. 22'></label></div>" +
          "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='evaluate-weather'>Zobraziť odporúčanie</button><button class='v5-text-action' type='button' data-v5-flow-back>Späť</button></div>";
      } else {
        const result = data.result || {};
        html = flowHead("Počasie", "Krátke odporúčanie", "Každé dieťa je iné. Priebežne kontrolujte jeho komfort.", 2, 3) +
          "<div class='v5-form-card'><div class='v5-info-box'><strong>Oblečenie</strong><br>" + escapeHtml(result.clothing || "") + "</div>" +
          "<div class='v5-info-box'><strong>Skontrolujte</strong><br>" + escapeHtml(result.check || "") + "</div>" +
          "<div class='v5-warning-box'><strong>Na čo si dať pozor</strong><br>" + escapeHtml(result.warning || "") + "</div></div>" +
          "<div class='v5-actions'><button class='v5-secondary' type='button' data-v5-flow-back>Upraviť podmienky</button><button class='v5-primary' type='button' data-v5-action='weather-done'>Hotovo</button></div>";
      }
    }

    target.innerHTML = html || "<div class='v5-empty'>Táto krátka cesta sa pripravuje.</div>";
  }

  function completeFlow(message, detail) {
    byId("v5FlowContent").innerHTML = [
      "<div class='v5-confirm'><div><span class='v5-confirm-mark'>✓</span><h2>", escapeHtml(message), "</h2><p>",
      escapeHtml(detail), "</p><div class='v5-actions' style='justify-content:center'><button class='v5-primary' type='button' data-v5-home>Späť domov</button>",
      "<button class='v5-secondary' type='button' data-v5-open-drawer>Ďalšia funkcia</button></div></div></div>"
    ].join("");
    renderHome();
    renderBottomBar();
    renderTimers();
  }

  function startSleep() {
    state.sleepTimer = { active: true, start: new Date().toISOString(), type: byId("v5SleepType")?.value || "day" };
    persist();
    renderTimers();
    renderHome();
    announce("Spánok sa meria. Časovač zostáva dostupný.");
    openHome();
  }

  function stopSleep() {
    if (!state.sleepTimer?.active || !state.sleepTimer.start) return;
    const start = new Date(state.sleepTimer.start);
    const end = new Date();
    const type = state.sleepTimer.type === "night" ? "nočný" : "denný";
    state.events.push({
      id: createId(),
      type: "Spánok",
      value: formatDuration(end - start) + " · " + type,
      note: "Časovač od " + formatClock(start) + " do " + formatClock(end),
      author: "rodina",
      created: end.toISOString(),
      start: start.toISOString(),
      end: end.toISOString(),
      sleepType: type
    });
    state.sleepTimer = { active: false, start: "", type: state.sleepTimer.type || "day" };
    if (typeof save === "function") save(); else persist();
    renderAll();
    announce("Spánok bol ukončený a uložený.");
  }

  function startFeeding() {
    const flow = state.v5.flow;
    state.v5.feedingTimer = {
      active: true,
      start: new Date().toISOString(),
      method: "Dojčenie",
      side: flow.data.sideLabel || "Bez uvedenia"
    };
    persist();
    renderTimers();
    renderHome();
    announce("Dojčenie sa meria. Časovač zostáva dostupný.");
    openHome();
  }

  function stopFeeding() {
    const timer = state.v5.feedingTimer;
    if (!timer.active || !timer.start) return;
    const start = new Date(timer.start);
    const end = new Date();
    state.events.push({
      id: createId(),
      type: "Kŕmenie",
      value: timer.method + " · " + timer.side + " · " + formatDuration(end - start),
      note: "Časovač od " + formatClock(start) + " do " + formatClock(end),
      author: "rodina",
      created: end.toISOString(),
      method: timer.method,
      side: timer.side,
      start: start.toISOString(),
      end: end.toISOString()
    });
    state.v5.feedingTimer = { active: false, start: "", method: "", side: "" };
    if (typeof save === "function") save(); else persist();
    renderAll();
    announce("Dojčenie bolo ukončené a uložené.");
  }

  function renderTimers() {
    const target = byId("v5PersistentTimers");
    if (!target) return;
    const timers = [];
    if (state.sleepTimer?.active && state.sleepTimer.start) {
      timers.push({
        id: "sleep",
        icon: "moon",
        title: "Spánok",
        detail: "Beží " + formatDuration(Date.now() - new Date(state.sleepTimer.start).getTime())
      });
    }
    if (state.v5.feedingTimer.active && state.v5.feedingTimer.start) {
      timers.push({
        id: "feeding",
        icon: "feeding",
        title: "Dojčenie · " + state.v5.feedingTimer.side,
        detail: "Beží " + formatDuration(Date.now() - new Date(state.v5.feedingTimer.start).getTime())
      });
    }
    target.classList.toggle("active", timers.length > 0);
    target.innerHTML = timers.map(timer => [
      "<div class='v5-timer-pill'><span class='v5-timer-icon'>", icon(timer.icon), "</span><div><strong>",
      escapeHtml(timer.title), "</strong><span>", escapeHtml(timer.detail), "</span></div><button type='button' data-v5-stop-timer='",
      timer.id, "'>Ukončiť</button></div>"
    ].join("")).join("");
  }

  function renderProfiles() {
    const target = byId("v5ProfilesContent");
    if (!target) return;
    const tab = state.v5.profileTab || "mother";
    const mother = state.v5.motherProfile;
    const countries = typeof euCountries !== "undefined"
      ? Object.entries(euCountries).map(item => "<option value='" + item[0] + "'" + (item[0] === mother.country ? " selected" : "") + ">" + escapeHtml(item[1]) + "</option>").join("")
      : "<option value='SK'>Slovensko</option>";
    const tabs = [
      ["mother", "Mama"],
      ["child", "Dieťa"],
      ["family", "Rodina"]
    ].map(item => "<button type='button' class='" + (tab === item[0] ? "active" : "") + "' data-v5-profile-tab='" + item[0] + "'>" + item[1] + "</button>").join("");
    let content = "";
    if (tab === "mother") {
      content = [
        "<div class='v5-form-card'><label>Meno<input id='v5MotherName' value='", escapeHtml(mother.name), "'></label>",
        "<label>Preferované oslovenie<input id='v5MotherPreferred' value='", escapeHtml(mother.preferredName), "'></label>",
        "<label>Dátum narodenia<input id='v5MotherBirth' type='date' value='", escapeHtml(mother.birthDate), "'></label>",
        "<label>Telefón<input id='v5MotherPhone' type='tel' value='", escapeHtml(mother.phone), "'></label>",
        "<label>E-mail<input id='v5MotherEmail' type='email' value='", escapeHtml(mother.email), "'></label>",
        "<label>Krajina<select id='v5MotherCountry'>", countries, "</select></label>",
        "<label>Pôrodnica — nepovinné<input id='v5MotherHospital' value='", escapeHtml(mother.hospital), "'></label>",
        "<label>Poisťovňa — nepovinné<input id='v5MotherInsurance' value='", escapeHtml(mother.insurance), "'></label>",
        "<label>Kontaktná osoba — nepovinné<input id='v5MotherEmergency' value='", escapeHtml(mother.emergencyContact), "'></label>",
        "<label>Dôležité poznámky — nepovinné<textarea id='v5MotherNotes'>", escapeHtml(mother.notes), "</textarea></label></div>",
        "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='save-mother-profile'>Uložiť profil mamy</button></div>"
      ].join("");
    } else if (tab === "child") {
      content = [
        "<div class='v5-form-card'>",
        state.profile.status === "expecting" ? "" : [
          "<div class='v5-child-photo-card'>",
          state.profile.photo ? "<img src='" + escapeHtml(state.profile.photo) + "' alt='Fotografia dieťaťa'>" : "<span aria-hidden='true'>☺</span>",
          "<div><strong>Fotografia dieťaťa</strong><small>Môže nahradiť ovocný avatar, keď je bábätko na svete.</small><label class='v5-photo-picker'>", state.profile.photo ? "Zmeniť fotografiu" : "Nahrať fotografiu", "<input id='v5ChildPhoto' type='file' accept='image/*'></label></div></div>"
        ].join("") ,
        "<label>Meno<input id='v5ChildName' value='", escapeHtml(state.profile.name || ""), "'></label>",
        "<label>Obdobie<select id='v5ChildStatus'><option value='expecting'", state.profile.status === "expecting" ? " selected" : "", ">Čakáme bábätko</option><option value='born'", state.profile.status !== "expecting" ? " selected" : "", ">Bábätko je na svete</option></select></label>",
        "<label>Pohlavie<select id='v5ChildSex'><option value=''>Nechcem uviesť / zatiaľ nevieme</option><option value='girl'", state.profile.sex === "girl" ? " selected" : "", ">Dievčatko</option><option value='boy'", state.profile.sex === "boy" ? " selected" : "", ">Chlapček</option></select></label>",
        "<label>Termín pôrodu<input id='v5ChildDue' type='date' value='", escapeHtml(state.profile.due || ""), "'></label>",
        "<label>Dátum narodenia<input id='v5ChildBirth' type='date' value='", escapeHtml(state.profile.birth || ""), "'></label>",
        "<label>Čas narodenia<input id='v5ChildBirthTime' type='time' value='", escapeHtml(state.profile.birthTime || ""), "'></label>",
        "<label>Miesto narodenia<input id='v5ChildBirthPlace' value='", escapeHtml(state.profile.birthPlace || ""), "'></label>",
        "<label>Gestačný týždeň<input id='v5ChildGestWeek' type='number' min='20' max='42' inputmode='numeric' value='", escapeHtml(state.profile.gestationalWeek || ""), "'></label>",
        "<label>Gestačný deň<input id='v5ChildGestDay' type='number' min='0' max='6' inputmode='numeric' value='", escapeHtml(state.profile.gestationalDay ?? ""), "'></label>",
        "<label>Pôrodná hmotnosť<input id='v5ChildBirthWeight' placeholder='napr. 3 450 g' value='", escapeHtml(state.profile.weight || ""), "'></label>",
        "<label>Pôrodná dĺžka<input id='v5ChildBirthHeight' placeholder='napr. 51 cm' value='", escapeHtml(state.profile.height || ""), "'></label>",
        "<label>Aktuálna hmotnosť<input id='v5ChildCurrentWeight' placeholder='napr. 6,4 kg' value='", escapeHtml(state.profile.currentWeight || ""), "'></label>",
        "<label>Aktuálna výška<input id='v5ChildCurrentHeight' placeholder='napr. 64 cm' value='", escapeHtml(state.profile.currentHeight || ""), "'></label>",
        "<label>Obvod hlavy<input id='v5ChildHead' placeholder='napr. 41 cm' value='", escapeHtml(state.profile.headCircumference || ""), "'></label>",
        "<label>Poisťovňa<input id='v5ChildInsurance' value='", escapeHtml(state.profile.insurance || ""), "'></label>",
        "<label>Pediater<input id='v5ChildPediatrician' value='", escapeHtml(state.profile.pediatrician || ""), "'></label>",
        "<label>Alergie a dôležité poznámky<textarea id='v5ChildNotes'>", escapeHtml(state.profile.notes || ""), "</textarea></label>",
        "</div><div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='save-child-profile'>Uložiť profil dieťaťa</button>",
        "<button class='v5-secondary' type='button' data-v5-action='open-original-child-profile'>Rozšírené pôrodné údaje</button></div>"
      ].join("");
    } else {
      content = [
        "<div class='v5-list'>",
        state.v5.familyMembers.length ? state.v5.familyMembers.map((member, index) =>
          "<div class='v5-row-card'><span class='v5-icon'>" + icon("family") + "</span><div><strong>" + escapeHtml(member.name) + " · " + escapeHtml(member.relationship) + "</strong><span>" + escapeHtml(member.accessLabel || "Zobrazenie") + (member.notifications ? " · upozornenia zapnuté" : "") + "</span></div><button class='v5-link-button' type='button' data-v5-remove-member='" + index + "'>Odobrať</button></div>"
        ).join("") : "<div class='v5-empty'>Zatiaľ nie je pridaná žiadna blízka osoba. Rodina používa spoločný pohľad, rozdiel je iba v oprávneniach.</div>",
        "</div><div class='v5-form-card' style='margin-top:14px'><label>Meno<input id='v5MemberName' placeholder='napr. Martin'></label>",
        "<label>Vzťah k dieťaťu<select id='v5MemberRelationship'><option>Otec</option><option>Partner alebo partnerka</option><option>Stará mama</option><option>Starý otec</option><option>Opatrovateľ</option><option>Iná blízka osoba</option></select></label>",
        "<label>Telefón — nepovinné<input id='v5MemberPhone' type='tel'></label><label>E-mail — nepovinné<input id='v5MemberEmail' type='email'></label>",
        "<label>Oprávnenie<select id='v5MemberAccess'><option value='view'>Iba zobrazenie</option><option value='add'>Zobrazenie a pridávanie</option><option value='edit'>Pridávanie a úpravy</option><option value='manage'>Správa rodiny</option></select></label>",
        "<label>Upozornenia<select id='v5MemberNotifications'><option value='important'>Iba dôležité</option><option value='all'>Všetky požadované</option><option value='none'>Bez upozornení</option></select></label></div>",
        "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='add-family-member'>Pridať osobu</button></div>"
      ].join("");
    }
    target.innerHTML = flowHead("Profily rodiny", "Údaje stačí zadať raz.", "Guguboo ich použije iba tam, kde sú potrebné. Rodina má jeden spoločný pohľad.", 0, 1) +
      "<nav class='v5-profile-tabs' aria-label='Profily'>" + tabs + "</nav>" + content;
  }

  function renderTravel() {
    const target = byId("v5TravelContent");
    if (!target) return;
    const section = state.v5.travelSection || "home";
    const city = state.travel.city || "";
    let content = "";
    if (section === "home") {
      content = "<div class='v5-choice-grid'>" +
        choice("travel-prepare", "Pripraviť cestu", "Cieľ, termín, doprava a pobyt.", "travel") +
        choice("travel-nearby", "Pomoc v okolí", "Lekárne, pediatria a urgent podľa mesta.", "health") +
        choice("travel-medicines", "Lieky a zdravie", "Účinná látka, koncentrácia a balenie.", "products") +
        choice("travel-country", "Podmienky v krajine", "Doklady, poistenie a oficiálne zdroje.", "book") +
        choice("travel-offline", "Offline karta", "Údaje dieťaťa, kontakty a ubytovanie.", "cards") +
        choice("travel-checklist", "Cestovný checklist", "Kategórie podľa dieťaťa a cesty.", "checklist") +
        "</div>";
    } else if (section === "prepare") {
      const countries = typeof euCountries !== "undefined"
        ? Object.entries(euCountries).map(item => "<option value='" + item[0] + "'" + (item[0] === state.travelCountry ? " selected" : "") + ">" + escapeHtml(item[1]) + "</option>").join("")
        : "<option value='SK'>Slovensko</option>";
      content = "<div class='v5-form-card'><label>Krajina<select id='v5TravelCountry'>" + countries + "</select></label>" +
        "<label>Mesto<input id='v5TravelCity' value='" + escapeHtml(city) + "' placeholder='napr. Barcelona'></label>" +
        "<label>Od<input id='v5TravelStart' type='date' value='" + escapeHtml(state.travel.start || "") + "'></label>" +
        "<label>Do<input id='v5TravelEnd' type='date' value='" + escapeHtml(state.travel.end || "") + "'></label>" +
        "<label>Doprava<select id='v5TravelTransport'><option value='car'>Auto</option><option value='plane'>Lietadlo</option><option value='train'>Vlak</option><option value='bus'>Autobus</option></select></label>" +
        "<label>Pobyt<select id='v5TravelStay'><option value='hotel'>Hotel alebo apartmán</option><option value='family'>U rodiny</option><option value='nature'>Príroda alebo kemp</option><option value='other'>Iný pobyt</option></select></label></div>" +
        "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='save-travel'>Uložiť cestu</button><button class='v5-text-action' type='button' data-v5-travel-home>Späť</button></div>";
    } else if (section === "nearby") {
      const queryCity = city || "zadajte mesto";
      const maps = term => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(term + " " + queryCity);
      content = "<div class='v5-form-card'><label>Mesto alebo oblasť<input id='v5NearbyCity' value='" + escapeHtml(city) + "' placeholder='napr. Barcelona'></label>" +
        "<div class='v5-info-box'>V ostrej aplikácii môže používateľ dobrovoľne povoliť GPS. Jazyk aplikácie sa pritom nezmení.</div></div>" +
        "<div class='v5-list' style='margin-top:14px'>" +
        [["Lekárne", "Lekáreň", "contacts"], ["Otvorené lekárne", "Otvorená lekáreň", "contacts"], ["Detská pohotovosť", "Detská pohotovosť", "health"], ["Nemocnice s pediatriou", "Pediatrická nemocnica", "health"], ["Urgentný príjem", "Urgentný príjem", "alert"]].map(item =>
          "<a class='v5-row-card' target='_blank' rel='noopener' href='" + maps(item[1]) + "'><span class='v5-icon'>" + icon(item[2]) + "</span><div><strong>" + item[0] + "</strong><span>Vyhľadať v okolí mesta " + escapeHtml(queryCity) + "</span></div><span class='v5-row-arrow'>›</span></a>"
        ).join("") + "</div><div class='v5-warning-box' style='margin-top:14px'>Výsledok overte podľa názvu služby, otváracích hodín a oficiálneho zdroja. Lekáreň, ambulancia, pohotovosť a urgent nie sú to isté.</div>" +
        "<div class='v5-actions'><button class='v5-text-action' type='button' data-v5-travel-home>Späť</button></div>";
    } else if (section === "medicines") {
      content = "<div class='v5-list'>" + (state.v5.medicines.length ? state.v5.medicines.map((medicine, index) =>
        "<div class='v5-row-card'><span class='v5-icon'>" + icon("products") + "</span><div><strong>" + escapeHtml(medicine.name) + "</strong><span>" + escapeHtml([medicine.substance, medicine.concentration, medicine.form].filter(Boolean).join(" · ")) + "</span></div><button class='v5-link-button' type='button' data-v5-remove-medicine='" + index + "'>Odobrať</button></div>"
      ).join("") : "<div class='v5-empty'>Zatiaľ nie je uložený žiadny liek.</div>") + "</div>" +
        "<div class='v5-form-card' style='margin-top:14px'><label>Názov<input id='v5MedicineName'></label><label>Účinná látka<input id='v5MedicineSubstance'></label><label>Koncentrácia<input id='v5MedicineConcentration' placeholder='napr. 100 mg / 5 ml'></label><label>Forma<input id='v5MedicineForm' placeholder='sirup, tableta, kvapky'></label><label>Predpisujúci lekár — nepovinné<input id='v5MedicineDoctor'></label><label>Poznámka<textarea id='v5MedicineNote'></textarea></label></div>" +
        "<div class='v5-warning-box' style='margin-top:14px'>Guguboo neurčuje dávku, neodporúča zmenu lieku a nepotvrdzuje bezpečnú zameniteľnosť. V zahraničí porovnávajte účinnú látku, formu a koncentráciu s lekárnikom alebo lekárom.</div>" +
        "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='add-medicine'>Uložiť liek</button><button class='v5-text-action' type='button' data-v5-travel-home>Späť</button></div>";
    } else if (section === "country") {
      content = "<div class='v5-list'>" +
        [["Tiesňové čísla", "Jednotné európske tiesňové číslo 112", "https://digital-strategy.ec.europa.eu/en/policies/112"], ["Zdravotná starostlivosť", "Európsky preukaz zdravotného poistenia", "https://europa.eu/youreurope/citizens/health/unplanned-healthcare/temporary-stays/index_sk.htm"], ["Doklady dieťaťa", "Oficiálne informácie EÚ pre cestovanie", "https://europa.eu/youreurope/citizens/travel/entry-exit/travel-documents-minors/index_sk.htm"], ["Práva cestujúcich", "Your Europe – cestovanie", "https://europa.eu/youreurope/citizens/travel/index_sk.htm"]].map(item =>
          "<a class='v5-row-card' target='_blank' rel='noopener' href='" + item[2] + "'><span class='v5-icon'>" + icon("book") + "</span><div><strong>" + item[0] + "</strong><span>" + item[1] + "</span></div><span class='v5-row-arrow'>›</span></a>"
        ).join("") + "</div><div class='v5-source-box' style='margin-top:14px'>Zdroj: oficiálne portály Európskej únie. Dátum poslednej kontroly prototypu: 24. 8. 2026. Pred cestou vždy overte aj národné pravidlá cieľovej krajiny.</div>" +
        "<div class='v5-actions'><button class='v5-text-action' type='button' data-v5-travel-home>Späť</button></div>";
    } else if (section === "offline") {
      const offlineLines = [
        ["Dieťa", state.profile.name || "nezadané"],
        ["Dátum narodenia", state.profile.birth || "nezadaný"],
        ["Alergie", state.profile.notes || "nezadané"],
        ["Pediater", state.profile.pediatrician || "nezadaný"],
        ["Poisťovňa", state.profile.insurance || "nezadaná"],
        ["Rodič", state.v5.motherProfile.name || "nezadaný"],
        ["Telefón", state.v5.motherProfile.phone || "nezadaný"],
        ["Cieľ", [city, state.travelCountry].filter(Boolean).join(", ") || "nezadaný"]
      ];
      content = "<div class='v5-card'><span class='v5-eyebrow'>Citlivé údaje</span><div class='v5-list' style='margin-top:12px'>" +
        offlineLines.map(item => "<div class='v5-status'><span>" + escapeHtml(item[0]) + "</span><strong>" + escapeHtml(item[1]) + "</strong></div>").join("") +
        "</div></div><div class='v5-warning-box' style='margin-top:14px'>Offline karta sa v tejto bete ukladá iba v prehliadači. Citlivé údaje sa automaticky nezdieľajú.</div>" +
        "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='save-offline-card'>Uložiť offline kartu</button><button class='v5-text-action' type='button' data-v5-travel-home>Späť</button></div>";
    } else {
      const categories = [
        ["Doklady", ["Cestovný doklad dieťaťa", "Preukaz poistenca", "Cestovné poistenie"]],
        ["Oblečenie", ["Náhradné vrstvy", "Ochrana podľa počasia"]],
        ["Prebaľovanie", ["Plienky", "Podložka", "Obrúsky"]],
        ["Kŕmenie", ["Jedlo alebo mlieko podľa rutiny", "Fľaša alebo potreby na dojčenie"]],
        ["Spánok", ["Známa pomôcka na spánok", "Zvuk alebo uspávanka offline"]],
        ["Lieky", ["Pravidelné lieky", "Recepty a zoznam účinných látok"]],
        ["Doprava", ["Autosedačka alebo nosič", "Kočík"]],
        ["Veci pre mamu", ["Doklady", "Lieky a osobné potreby"]]
      ];
      content = "<div class='v5-list'>" + categories.map((category, index) => {
        const done = category[1].filter((item, itemIndex) => state.travel.checks["v5-" + index + "-" + itemIndex]).length;
        return "<button class='v5-check-category' type='button' data-v5-travel-category='" + index + "'><span class='v5-icon'>" + icon("checklist") + "</span><div><strong>" + category[0] + "</strong><small>" + done + " z " + category[1].length + " hotové</small></div><span class='v5-row-arrow'>›</span></button>";
      }).join("") + "</div><div class='v5-info-box' style='margin-top:14px'>Zoznam sa v ďalšej etape automaticky prispôsobí veku, počasiu, doprave, pobytu a spôsobu kŕmenia. Vlastnú položku možno vždy pridať.</div>" +
        "<div class='v5-actions'><button class='v5-text-action' type='button' data-v5-travel-home>Späť</button></div>";
    }
    target.innerHTML = flowHead("Cestovanie", section === "home" ? "Ako vám dnes pomôžeme?" : ({
      prepare: "Pripraviť cestu", nearby: "Pomoc v okolí", medicines: "Lieky a zdravie", country: "Podmienky v krajine", offline: "Offline karta", checklist: "Cestovný checklist"
    })[section], "Jazyk aplikácie zostáva rovnaký. Mení sa iba miesto a lokálny obsah.", 0, 1) + content;
  }

  function renderTravelCategory(index) {
    const categories = [
      ["Doklady", ["Cestovný doklad dieťaťa", "Preukaz poistenca", "Cestovné poistenie"]],
      ["Oblečenie", ["Náhradné vrstvy", "Ochrana podľa počasia"]],
      ["Prebaľovanie", ["Plienky", "Podložka", "Obrúsky"]],
      ["Kŕmenie", ["Jedlo alebo mlieko podľa rutiny", "Fľaša alebo potreby na dojčenie"]],
      ["Spánok", ["Známa pomôcka na spánok", "Zvuk alebo uspávanka offline"]],
      ["Lieky", ["Pravidelné lieky", "Recepty a zoznam účinných látok"]],
      ["Doprava", ["Autosedačka alebo nosič", "Kočík"]],
      ["Veci pre mamu", ["Doklady", "Lieky a osobné potreby"]]
    ];
    const category = categories[index];
    if (!category) return;
    byId("v5TravelContent").innerHTML = flowHead("Cestovný checklist", category[0], "Položky sa zobrazujú až po otvorení kategórie.", 0, 1) +
      "<div class='v5-form-card'>" + category[1].map((item, itemIndex) => {
        const key = "v5-" + index + "-" + itemIndex;
        return "<label style='grid-template-columns:auto 1fr;align-items:center'><input style='width:24px;min-height:24px' type='checkbox' data-v5-travel-check='" + key + "'" + (state.travel.checks[key] ? " checked" : "") + "><span>" + escapeHtml(item) + "</span></label>";
      }).join("") + "<label>Vlastná položka<input id='v5TravelCustomItem' placeholder='Pridať vlastnú vec'></label></div>" +
      "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='add-travel-custom' data-category='" + index + "'>Pridať položku</button><button class='v5-secondary' type='button' data-v5-action='back-travel-checklist'>Späť na kategórie</button></div>";
  }

  function dayOfLife(dateValue) {
    if (!state.profile.birth || !dateValue) return null;
    const birth = new Date(state.profile.birth + "T12:00:00");
    const date = new Date(dateValue + "T12:00:00");
    return Math.floor((date - birth) / 86400000) + 1;
  }

  function renderFirst100() {
    const target = byId("v5First100Content");
    if (!target) return;
    const date = todayKey();
    const day = dayOfLife(date);
    const existing = state.diary.find(item => item.first100 && item.date === date);
    target.innerHTML = flowHead("Prvých 100 dní", day && day > 0 && day <= 100 ? day + ". deň spolu" : "Jeden malý okamih", "Čo sa dnes stalo? Uložte si jednu fotografiu alebo krátku vetu. Pripomenutie je voliteľné.", 0, 1) +
      "<div class='v5-form-card'><label>Dátum<input id='v5First100Date' type='date' value='" + escapeHtml(existing?.date || date) + "'></label>" +
      "<label>Krátka spomienka<textarea id='v5First100Text' placeholder='Moment, ktorý si chcete zapamätať'>" + escapeHtml(existing?.text || "") + "</textarea></label>" +
      "<label>Nálada alebo míľnik — nepovinné<input id='v5First100Mood' value='" + escapeHtml(existing?.mood || "") + "' placeholder='napr. prvý pokojný večer'></label>" +
      "<label>Fotografia — nepovinné<input id='v5First100Photo' type='file' accept='image/*'></label>" +
      (existing?.photo ? "<img src='" + escapeHtml(existing.photo) + "' alt='Dnešná spomienka' style='width:100%;max-height:300px;object-fit:cover;border-radius:20px'>" : "") +
      "<div class='v5-info-box'>Vynechaný deň môžete kedykoľvek doplniť. Guguboo nevytvára stresujúcu sériu a fotografiu bez súhlasu nezverejní.</div></div>" +
      "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='save-first100'>Uložiť dnešný okamih</button><button class='v5-secondary' type='button' data-v5-feature='diary'>Otvoriť denník</button></div>";
  }

  const zodiac = [
    ["baran", "Baran", "♈", "✦ · · ✦", "Odvážny začiatok plný nežnosti."],
    ["byk", "Býk", "♉", "· ✦ · ✦", "Pokojné chvíle, ktoré rastú s láskou."],
    ["blizenci", "Blíženci", "♊", "✦ · ✦ ·", "Dve iskričky zvedavosti v jednom príbehu."],
    ["rak", "Rak", "♋", "· · ✦ ✦", "Domov je tam, kde ste spolu."],
    ["lev", "Lev", "♌", "✦ ✦ · ·", "Malé svetlo, ktoré rozžiarilo rodinu."],
    ["panna", "Panna", "♍", "✦ · · · ✦", "Každý detail vášho príbehu je jedinečný."],
    ["vahy", "Váhy", "♎", "· ✦ ✦ ·", "Jemná rovnováha spoločných dní."],
    ["skorpion", "Škorpión", "♏", "✦ · ✦ ✦", "Hlboké puto od prvého objatia."],
    ["strelec", "Strelec", "♐", "· ✦ · · ✦", "Pred vami je celý svet spoločných ciest."],
    ["kozorozec", "Kozorožec", "♑", "✦ ✦ · ✦", "Malé kroky tvoria veľký rodinný príbeh."],
    ["vodnar", "Vodnár", "♒", "· · ✦ · ✦", "Váš vlastný jedinečný rytmus."],
    ["ryby", "Ryby", "♓", "✦ · · ✦ ·", "Nežné sny a pokojné objatia."]
  ];

  function zodiacFromBirth() {
    if (!state.profile.birth) return "ryby";
    const date = new Date(state.profile.birth + "T12:00:00");
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const signs = [
      [1, 20, "vodnar"], [2, 19, "ryby"], [3, 21, "baran"], [4, 20, "byk"], [5, 21, "blizenci"], [6, 21, "rak"],
      [7, 23, "lev"], [8, 23, "panna"], [9, 23, "vahy"], [10, 23, "skorpion"], [11, 22, "strelec"], [12, 22, "kozorozec"]
    ];
    let result = "kozorozec";
    for (const sign of signs) if (month > sign[0] || (month === sign[0] && day >= sign[1])) result = sign[2];
    return result;
  }

  function renderCards() {
    const target = byId("v5CardsContent");
    if (!target) return;
    state.v5.selectedZodiac ||= zodiacFromBirth();
    const selected = zodiac.find(item => item[0] === state.v5.selectedZodiac) || zodiac[0];
    const palettes = [
      ["lavender", "Levanduľová a marhuľová"],
      ["sage", "Šalviová a krémová"],
      ["sky", "Nebeská modrá a jemná fialová"],
      ["powder", "Púdrová ružová a teplá béžová"]
    ];
    target.innerHTML = flowHead("Kartičky", "Dvanásť znamení, váš vlastný štýl.", "Znamenie určuje iba vizuálnu tému. Neurčuje povahu dieťaťa.", 0, 1) +
      "<section class='v5-zodiac-preview palette-" + escapeHtml(state.v5.cardPalette) + " sign-" + escapeHtml(selected[0]) + "'><span class='v5-zodiac-constellation'>" + escapeHtml(selected[3]) + "</span><span class='v5-zodiac-symbol'>" + selected[2] + "</span><small>" + escapeHtml(selected[1]) + "</small><h2>" + escapeHtml(state.profile.name || "Naše bábätko") + "</h2><p>" + escapeHtml(selected[4]) + "</p><div class='v5-zodiac-facts'><span>" + escapeHtml(state.profile.birth || "dátum") + "</span><span>" + escapeHtml(state.profile.birthTime || "čas") + "</span><span>" + escapeHtml(state.profile.weight || "hmotnosť") + "</span></div></section>" +
      "<div class='v5-form-card' style='margin-top:14px'><label>Farebná paleta<select id='v5CardPalette'>" +
      palettes.map(item => "<option value='" + item[0] + "'" + (item[0] === state.v5.cardPalette ? " selected" : "") + ">" + item[1] + "</option>").join("") +
      "</select></label></div><div class='v5-zodiac-grid'>" +
      zodiac.map(item => "<button type='button' class='" + (item[0] === selected[0] ? "active" : "") + "' data-v5-zodiac='" + item[0] + "'><span>" + item[2] + "</span><strong>" + item[1] + "</strong><small>" + item[3] + "</small></button>").join("") +
      "</div><div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='open-birth-card'>Upraviť kartičku narodenia</button><button class='v5-secondary' type='button' data-v5-feature='first100'>Výstupy prvých 100 dní</button></div>";
  }

  const checklistCategories = [
    ["documents", "Doklady", "Oficiálne veci a potvrdenia", [
      ["v5-doc-id", "Doklad totožnosti rodiča"],
      ["v5-doc-insurance", "Preukaz poistenca"],
      ["v5-doc-hospital", "Dokumenty podľa pôrodnice"],
      ["v5-doc-baby", "Doklady dieťaťa podľa aktuálnej fázy"]
    ]],
    ["hospital", "Taška do pôrodnice", "Veci rozdelené podľa osoby", [
      ["v5-bag-mother", "Veci pre mamu"],
      ["v5-bag-baby", "Veci pre bábätko"],
      ["v5-bag-hygiene", "Hygiena a praktické potreby"],
      ["v5-bag-home", "Odchod domov"]
    ]],
    ["home", "Domov pre bábätko", "Pripraviť iba to, čo využijete", [
      ["v5-home-sleep", "Bezpečné miesto na spánok"],
      ["v5-home-changing", "Miesto na prebaľovanie"],
      ["v5-home-clothes", "Niekoľko základných vrstiev"],
      ["v5-home-contact", "Dôležité kontakty poruke"]
    ]],
    ["health", "Zdravie a kontakty", "Pediater, poisťovňa a lekáreň", [
      ["v5-health-pediatrician", "Vybraný pediater"],
      ["v5-health-pharmacy", "Najbližšia lekáreň"],
      ["v5-health-emergency", "Pohotovosť a tiesňové čísla"],
      ["v5-health-notes", "Alergie a dôležité poznámky"]
    ]],
    ["travel", "Cestovanie", "Doklady, balenie a zdravie", [
      ["v5-travel-docs", "Doklady a poistenie"],
      ["v5-travel-clothes", "Oblečenie podľa počasia"],
      ["v5-travel-feed", "Kŕmenie podľa vašej rutiny"],
      ["v5-travel-meds", "Lieky a účinné látky"]
    ]]
  ];

  function renderChecklists() {
    const target = byId("v5ChecklistsContent");
    if (!target) return;
    const selected = checklistCategories.find(category => category[0] === state.v5.checklistCategory);
    if (!selected) {
      target.innerHTML = flowHead("Checklisty", "Čo práve pripravujete?", "Najprv vidíte iba kategórie a progres. Položky sa zobrazia až po otvorení.", 0, 1) +
        "<div class='v5-list'>" + checklistCategories.map(category => {
          const custom = state.v5.checklistCustom.filter(item => item.category === category[0]);
          const all = category[3].concat(custom.map(item => [item.id, item.label]));
          const done = all.filter(item => state.checks[item[0]]).length;
          const status = done === all.length && all.length ? "hotovo" : done ? done + " z " + all.length + " hotové" : "nezačaté";
          return "<button class='v5-check-category' type='button' data-v5-check-category='" + category[0] + "'><span class='v5-icon'>" + icon("checklist") + "</span><div><strong>" + escapeHtml(category[1]) + "</strong><small>" + escapeHtml(category[2]) + " · " + status + "</small></div><span class='v5-row-arrow'>›</span></button>";
        }).join("") + "</div>";
      return;
    }
    const custom = state.v5.checklistCustom.filter(item => item.category === selected[0]);
    const items = selected[3].concat(custom.map(item => [item.id, item.label]));
    const done = items.filter(item => state.checks[item[0]]).length;
    target.innerHTML = flowHead("Checklisty", selected[1], done + " z " + items.length + " hotové. Každú položku môžete neskôr zmeniť.", 0, 1) +
      "<div class='v5-form-card'>" + items.map(item =>
        "<label style='grid-template-columns:auto 1fr;align-items:center'><input style='width:24px;min-height:24px' type='checkbox' data-v5-check-item='" + item[0] + "'" + (state.checks[item[0]] ? " checked" : "") + "><span>" + escapeHtml(item[1]) + "</span></label>"
      ).join("") + "<label>Vlastná položka<input id='v5ChecklistCustom' placeholder='Pridať vlastnú vec'></label></div>" +
      "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='add-checklist-custom'>Pridať položku</button><button class='v5-secondary' type='button' data-v5-check-home>Späť na kategórie</button></div>";
  }

  function renderPrenatal() {
    const target = byId("v5PrenatalContent");
    if (!target) return;
    state.prenatal ||= {};
    const section = state.v5.prenatalSection || "home";
    let content = "";
    if (section === "home") {
      content = "<div class='v5-choice-grid'>" +
        choice("prenatal-bag", "Taška", "Veci pre mamu, bábätko a odchod domov.", "checklist") +
        choice("prenatal-hospital", "Pôrodnica", "Vchod, kontakt a vlastné pokyny.", "health") +
        choice("prenatal-documents", "Doklady", "Prehľad potvrdení podľa vašej situácie.", "book") +
        choice("prenatal-home", "Domov pre bábätko", "Krátka kontrola pripraveného domova.", "home") +
        choice("prenatal-mother", "Veci pre mamu", "Vlastná poznámka a praktická podpora.", "memory") +
        choice("prenatal-admin", "Úrady", "Lokálne kroky a čo si overiť.", "calendar") +
        "</div><div class='v5-info-box'>Každá časť sa ukladá samostatne. Môžete sa k nej vrátiť bez straty údajov.</div>";
    } else if (section === "hospital") {
      content = "<div class='v5-form-card'><label>Názov pôrodnice<input id='v5PrenatalHospital' value='" + escapeHtml(state.prenatal.hospital || "") + "' placeholder='napr. Pôrodnica Ružinov'></label>" +
        "<label>Kontakt alebo vchod — nepovinné<input id='v5PrenatalHospitalContact' value='" + escapeHtml(state.prenatal.hospitalContact || "") + "' placeholder='telefón, nočný vchod'></label>" +
        "<label>Vlastné pokyny pôrodnice<textarea id='v5PrenatalHospitalDetails' placeholder='Čo priniesť, návštevy, partner pri pôrode…'>" + escapeHtml(state.prenatal.hospitalDetails || "") + "</textarea></label></div>" +
        "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='save-prenatal-hospital'>Uložiť pôrodnicu</button><button class='v5-secondary' type='button' data-v5-action='open-prenatal-original'>Podrobná príprava</button><button class='v5-text-action' type='button' data-v5-prenatal-home>Späť</button></div>";
    } else if (section === "mother") {
      content = "<div class='v5-form-card'><label>Čo chcem mať pripravené pre seba<textarea id='v5PrenatalMotherNote' placeholder='Oblečenie, hygiena, pohodlie, podpora…'>" + escapeHtml(state.prenatal.motherNote || "") + "</textarea></label>" +
        "<label>Kto mi môže pomôcť — nepovinné<input id='v5PrenatalHelper' value='" + escapeHtml(state.prenatal.helper || "") + "' placeholder='meno alebo kontakt'></label></div>" +
        "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='save-prenatal-mother'>Uložiť poznámku</button><button class='v5-text-action' type='button' data-v5-prenatal-home>Späť</button></div>";
    }
    target.innerHTML = flowHead("Pred narodením", section === "home" ? "Čo chcete pripraviť?" : section === "hospital" ? "Moja pôrodnica" : "Veci pre mamu", section === "home" ? "Otvorte iba jednu krátku časť. Celý zoznam naraz neuvidíte." : "Údaj sa uloží do spoločnej prípravy rodiny.", 0, 1) + content;
  }

  function renderAudioDock() {
    const target = byId("v5AudioDock");
    if (!target) return;
    const audio = state.v5.audio || {};
    if (!audio.active) {
      target.classList.remove("active");
      document.body.classList.remove("v5-audio-active");
      target.innerHTML = "";
      return;
    }
    target.classList.add("active");
    document.body.classList.add("v5-audio-active");
    const remaining = audio.stopAt ? Math.max(0, Math.ceil((new Date(audio.stopAt).getTime() - Date.now()) / 60000)) : 0;
    target.innerHTML = "<div class='v5-audio-dock-inner'><span class='v5-timer-icon'>" + icon("sound") + "</span><div><strong>" + escapeHtml(audio.title || "Zvuk") + "</strong><span>" + (remaining ? "Vypne sa približne o " + remaining + " min" : "Prehráva sa na pozadí") + "</span></div><button type='button' data-v5-feature='sounds'>Otvoriť</button><button type='button' data-v5-action='stop-audio'>Vypnúť</button></div><div class='v5-audio-controls'><label>Hlasitosť <input id='v5AudioVolume' type='range' min='4' max='45' value='" + escapeHtml(audio.volume || 18) + "'></label><label>Časovač <select id='v5AudioTimer'><option value=''>Bez časovača</option><option value='15'>15 min</option><option value='30'>30 min</option><option value='60'>60 min</option></select></label></div>";
  }

  function renderSounds() {
    const target = byId("v5SoundsContent");
    if (!target) return;
    target.innerHTML = flowHead("Zvuky", "Čo dnes pomôže pri zaspávaní?", "Vyberte šum, uspávanku alebo nahrajte vlastný rodinný zvuk.", 0, 1) +
      "<div class='v5-choice-grid'>" +
      "<button class='v5-choice' type='button' data-v5-audio-type='white' data-v5-audio-title='Biely šum'><span class='v5-icon'>" + icon("sound") + "</span><span><strong>Biely šum</strong><small>Jemné stále pozadie.</small></span></button>" +
      "<button class='v5-choice' type='button' data-v5-audio-type='lullaby-soft' data-v5-audio-title='Jemná uspávanka'><span class='v5-icon'>" + icon("sound") + "</span><span><strong>Uspávanka</strong><small>Pokojná predvolená melódia.</small></span></button>" +
      "<button class='v5-choice' type='button' data-v5-action='open-original-sounds'><span class='v5-icon'>" + icon("family") + "</span><span><strong>Vlastná nahrávka</strong><small>Nahrať hlas mamy, otca alebo blízkej osoby.</small></span></button>" +
      "</div><div class='v5-info-box'>Zvuk má byť iba jemným pozadím. Telefón ani reproduktor nedávajte k hlave dieťaťa.</div>";
  }

  function updateHeader() {
    const view = currentView();
    const title = viewTitles[view] || ["Guguboo", "Rodinný pomocník"];
    byId("v5Header").dataset.home = String(view === "home");
    byId("v5HeaderTitle").textContent = title[0];
    byId("v5HeaderSubtitle").textContent = title[1];
    byId("v5Header").querySelector("[data-v5-night]")?.setAttribute("aria-pressed", String(document.body.classList.contains("night")));
    renderBottomBar();
  }

  function renderAll() {
    renderHome();
    renderBottomBar();
    renderTimers();
    renderAudioDock();
    if (currentView() === "v5Flow") renderFlow();
    if (currentView() === "v5Profiles") renderProfiles();
    if (currentView() === "v5Travel") renderTravel();
    if (currentView() === "v5First100") renderFirst100();
    if (currentView() === "v5Cards") renderCards();
    if (currentView() === "v5Checklists") renderChecklists();
    if (currentView() === "v5Prenatal") renderPrenatal();
    if (currentView() === "v5Sounds") renderSounds();
    byId("v5DrawerTip").hidden = state.v5.drawerHintDismissed || ["welcome", "birthIntro", "pregnancyIntro"].includes(currentView());
  }

  function handleFlowChoice(choiceKey) {
    const flow = state.v5.flow;
    if (choiceKey.startsWith("prenatal-")) {
      const section = choiceKey.replace("prenatal-", "");
      if (["bag", "documents", "home"].includes(section)) {
        return openChecklistCategory(section === "bag" ? "hospital" : section);
      }
      if (section === "admin") {
        routeTo("stateSupport");
        return;
      }
      state.v5.prenatalSection = section;
      persist();
      renderPrenatal();
      return;
    }
    if (choiceKey.startsWith("travel-")) {
      state.v5.travelSection = choiceKey.replace("travel-", "");
      persist();
      renderTravel();
      return;
    }
    if (flow.type === "sleep") {
      flow.step = 1;
      flow.data = { mode: choiceKey.replace("sleep-", "") };
    } else if (flow.type === "feeding") {
      if (choiceKey.startsWith("feed-")) {
        flow.data.method = choiceKey.replace("feed-", "");
        flow.step = 1;
      } else if (choiceKey.startsWith("side-")) {
        const sides = { left: "Ľavý prsník", right: "Pravý prsník", both: "Oba prsníky", none: "Bez uvedenia" };
        flow.data.side = choiceKey.replace("side-", "");
        flow.data.sideLabel = sides[flow.data.side];
        flow.step = 2;
      }
    } else if (flow.type === "diaper") {
      const labels = { wet: "Mokrá", dirty: "Stolica", both: "Oboje", dry: "Suchá" };
      flow.data.diaper = choiceKey.replace("diaper-", "");
      flow.data.diaperLabel = labels[flow.data.diaper];
      flow.step = 1;
    } else if (flow.type === "weather") {
      flow.data.situation = choiceKey.replace("weather-", "");
      flow.step = 1;
    }
    persist();
    renderFlow();
  }

  function saveMotherProfile() {
    const mother = state.v5.motherProfile;
    mother.name = byId("v5MotherName").value.trim();
    mother.preferredName = byId("v5MotherPreferred").value.trim();
    mother.birthDate = byId("v5MotherBirth").value;
    mother.phone = byId("v5MotherPhone").value.trim();
    mother.email = byId("v5MotherEmail").value.trim();
    mother.country = byId("v5MotherCountry").value;
    mother.hospital = byId("v5MotherHospital").value.trim();
    mother.insurance = byId("v5MotherInsurance").value.trim();
    mother.emergencyContact = byId("v5MotherEmergency").value.trim();
    mother.notes = byId("v5MotherNotes").value.trim();
    state.user ||= {};
    state.user.name = mother.name;
    state.user.birthDate = mother.birthDate;
    state.user.phone = mother.phone;
    state.user.email = mother.email;
    state.profile.country = mother.country;
    state.prenatal ||= {};
    state.prenatal.hospital = mother.hospital;
    if (typeof save === "function") save(); else persist();
    renderAll();
    announce("Profil mamy je uložený.");
  }

  function saveChildProfile() {
    state.profile.name = byId("v5ChildName").value.trim();
    state.profile.status = byId("v5ChildStatus").value;
    state.profile.sex = byId("v5ChildSex").value;
    state.profile.due = byId("v5ChildDue").value;
    state.profile.birth = byId("v5ChildBirth").value;
    state.profile.birthTime = byId("v5ChildBirthTime").value;
    state.profile.birthPlace = byId("v5ChildBirthPlace").value.trim();
    state.profile.gestationalWeek = byId("v5ChildGestWeek").value ? Number(byId("v5ChildGestWeek").value) : "";
    state.profile.gestationalDay = byId("v5ChildGestDay").value !== "" ? Number(byId("v5ChildGestDay").value) : "";
    state.profile.weight = byId("v5ChildBirthWeight").value.trim();
    state.profile.height = byId("v5ChildBirthHeight").value.trim();
    state.profile.currentWeight = byId("v5ChildCurrentWeight").value.trim();
    state.profile.currentHeight = byId("v5ChildCurrentHeight").value.trim();
    state.profile.headCircumference = byId("v5ChildHead").value.trim();
    state.profile.insurance = byId("v5ChildInsurance").value.trim();
    state.profile.pediatrician = byId("v5ChildPediatrician").value.trim();
    state.profile.notes = byId("v5ChildNotes").value.trim();
    state.welcomeStatus = state.profile.status;
    if (typeof save === "function") save(); else persist();
    renderAll();
    announce("Profil dieťaťa je uložený a údaje sa použijú v súvisiacich funkciách.");
  }

  document.addEventListener("click", event => {
    const pregnancyAvatarButton = event.target.closest("[data-v5-pregnancy-avatar]");
    if (pregnancyAvatarButton) {
      const popover = byId("v5AvatarPopover");
      if (!popover) return;
      const willOpen = popover.hidden;
      popover.hidden = !willOpen;
      pregnancyAvatarButton.setAttribute("aria-expanded", String(willOpen));
      if (willOpen) announce("Zobrazená približná veľkosť bábätka.");
      return;
    }
    if (event.target.closest("[data-v5-child-avatar]")) {
      state.v5.profileTab = "child";
      persist();
      openFeature("profiles");
      return;
    }
    const todayAction = event.target.closest("[data-v5-today-action]");
    if (todayAction) {
      const action = todayAction.dataset.v5TodayAction;
      if (action === "hospital") {
        openChecklistCategory("hospital");
        return announce("Otváram checklist Taška do pôrodnice.");
      }
      openFeature(action);
      return;
    }
    const featureButtonElement = event.target.closest("[data-v5-feature]");
    if (featureButtonElement) {
      openFeature(featureButtonElement.dataset.v5Feature);
      return;
    }
    if (event.target.closest("[data-v5-back]")) return goBack();
    if (event.target.closest("[data-v5-home]")) return openHome();
    if (event.target.closest("[data-v5-night]")) {
      state.v5.night = !document.body.classList.contains("night");
      document.body.classList.toggle("night", state.v5.night);
      event.target.closest("[data-v5-night]").setAttribute("aria-pressed", String(state.v5.night));
      persist();
      return announce(state.v5.night ? "Nočný režim je zapnutý." : "Nočný režim je vypnutý.");
    }
    if (event.target.closest("[data-v5-open-drawer]")) return openDrawer();
    if (event.target.closest("[data-v5-close-drawer]")) return closeDrawer();
    if (event.target.closest("[data-v5-dismiss-tip]")) {
      state.v5.drawerHintDismissed = true;
      persist();
      byId("v5DrawerTip").hidden = true;
      return;
    }
    const flowChoice = event.target.closest("[data-v5-flow-choice]");
    if (flowChoice) return handleFlowChoice(flowChoice.dataset.v5FlowChoice);
    if (event.target.closest("[data-v5-flow-back]")) {
      state.v5.flow.step = Math.max(0, state.v5.flow.step - 1);
      if (state.v5.flow.step === 0) state.v5.flow.data = {};
      persist();
      return renderFlow();
    }
    const stopTimer = event.target.closest("[data-v5-stop-timer]");
    if (stopTimer) return stopTimer.dataset.v5StopTimer === "sleep" ? stopSleep() : stopFeeding();
    const profileTab = event.target.closest("[data-v5-profile-tab]");
    if (profileTab) {
      state.v5.profileTab = profileTab.dataset.v5ProfileTab;
      persist();
      return renderProfiles();
    }
    const travelHome = event.target.closest("[data-v5-travel-home]");
    if (travelHome) {
      state.v5.travelSection = "home";
      persist();
      return renderTravel();
    }
    if (event.target.closest("[data-v5-prenatal-home]")) {
      state.v5.prenatalSection = "home";
      persist();
      return renderPrenatal();
    }
    const travelCategory = event.target.closest("[data-v5-travel-category]");
    if (travelCategory) return renderTravelCategory(Number(travelCategory.dataset.v5TravelCategory));
    const zodiacButton = event.target.closest("[data-v5-zodiac]");
    if (zodiacButton) {
      state.v5.selectedZodiac = zodiacButton.dataset.v5Zodiac;
      persist();
      return renderCards();
    }
    const checkCategory = event.target.closest("[data-v5-check-category]");
    if (checkCategory) {
      state.v5.checklistCategory = checkCategory.dataset.v5CheckCategory;
      persist();
      return renderChecklists();
    }
    if (event.target.closest("[data-v5-check-home]")) {
      state.v5.checklistCategory = "";
      persist();
      return renderChecklists();
    }
    const removeMember = event.target.closest("[data-v5-remove-member]");
    if (removeMember) {
      state.v5.familyMembers.splice(Number(removeMember.dataset.v5RemoveMember), 1);
      persist();
      renderProfiles();
      return announce("Osoba bola z rodinného profilu odobratá.");
    }
    const removeMedicine = event.target.closest("[data-v5-remove-medicine]");
    if (removeMedicine) {
      state.v5.medicines.splice(Number(removeMedicine.dataset.v5RemoveMedicine), 1);
      persist();
      renderTravel();
      return announce("Liek bol zo zoznamu odobratý.");
    }
    const v5AudioButton = event.target.closest("[data-v5-audio-type]");
    if (v5AudioButton) {
      window.GugubooAudioControl?.start?.(v5AudioButton.dataset.v5AudioType);
      state.v5.audio = { ...state.v5.audio, active: true, type: v5AudioButton.dataset.v5AudioType, title: v5AudioButton.dataset.v5AudioTitle || "Zvuk", stopAt: "" };
      persist();
      renderAudioDock();
      return announce((v5AudioButton.dataset.v5AudioTitle || "Zvuk") + " sa prehráva.");
    }
    const noiseButton = event.target.closest("[data-noise]");
    if (noiseButton) {
      const noiseNames = { white: "Biely šum", pink: "Ružový šum", brown: "Hnedý šum", rain: "Dážď", ocean: "More", fan: "Ventilátor", vacuum: "Vysávač", womb: "Zvuk maternice", heart: "Tlkot srdca", musicbox: "Hudobná skrinka", hum: "Tiché hmkanie", "lullaby-soft": "Jemná uspávanka" };
      state.v5.audio = { ...state.v5.audio, active: true, type: noiseButton.dataset.noise, title: noiseNames[noiseButton.dataset.noise] || "Zvuk", stopAt: "" };
      persist();
      window.setTimeout(renderAudioDock, 0);
      return;
    }
    if (event.target.closest("#stopNoise")) {
      state.v5.audio = { ...state.v5.audio, active: false, type: "", title: "", stopAt: "" };
      persist();
      renderAudioDock();
      return;
    }
    const action = event.target.closest("[data-v5-action]")?.dataset.v5Action;
    if (!action) return;

    if (action === "start-sleep") return startSleep();
    if (action === "save-sleep-past") {
      const start = new Date(byId("v5SleepPastStart").value);
      const end = new Date(byId("v5SleepPastEnd").value);
      if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) return announce("Skontrolujte začiatok a koniec spánku.");
      state.events.push({ id: createId(), type: "Spánok", value: formatDuration(end - start) + " · spätne", note: byId("v5SleepPastNote").value.trim(), author: "rodina", created: end.toISOString(), start: start.toISOString(), end: end.toISOString() });
      if (typeof save === "function") save(); else persist();
      completeFlow("Spánok je uložený.", "Záznam sa zobrazí v dnešnom prehľade a môžete ho neskôr opraviť.");
      return announce("Spánok bol uložený.");
    }
    if (action === "start-feeding") return startFeeding();
    if (action === "save-feeding-quick") {
      state.events.push({ id: createId(), type: "Kŕmenie", value: "Dojčenie · " + (state.v5.flow.data.sideLabel || "bez uvedenia"), note: byId("v5FeedNote")?.value.trim() || "", author: "rodina", created: new Date().toISOString(), method: "Dojčenie", side: state.v5.flow.data.sideLabel || "" });
      if (typeof save === "function") save(); else persist();
      completeFlow("Dojčenie je uložené.", "Záznam sa použije v dnešnom rodinnom prehľade.");
      return announce("Dojčenie bolo uložené.");
    }
    if (action === "save-feeding") {
      const isBottle = state.v5.flow.data.method === "bottle";
      const time = byId("v5FeedTime")?.value ? new Date(byId("v5FeedTime").value) : new Date();
      const value = isBottle
        ? [byId("v5FeedMilk").value, byId("v5FeedAmount").value ? byId("v5FeedAmount").value + " ml" : ""].filter(Boolean).join(" · ")
        : byId("v5FeedOther")?.value.trim() || "Iné kŕmenie";
      state.events.push({ id: createId(), type: "Kŕmenie", value, note: byId("v5FeedNote")?.value.trim() || "", author: "rodina", created: time.toISOString(), method: isBottle ? "Fľaša" : "Iné" });
      if (typeof save === "function") save(); else persist();
      completeFlow("Kŕmenie je uložené.", "Záznam je dostupný rodine v dnešnom prehľade.");
      return announce("Kŕmenie bolo uložené.");
    }
    if (action === "save-diaper") {
      const color = byId("v5DiaperColor")?.value || "";
      const consistency = byId("v5DiaperConsistency")?.value || "";
      const value = [state.v5.flow.data.diaperLabel, color, consistency].filter(Boolean).join(" · ");
      state.events.push({ id: createId(), type: "Plienka", value, note: byId("v5DiaperNote")?.value.trim() || "", author: "rodina", created: new Date().toISOString(), diaper: { type: state.v5.flow.data.diaper, color, consistency } });
      if (typeof save === "function") save(); else persist();
      completeFlow("Prebalenie je uložené.", "Záznam sa zobrazí v dnešnom prehľade.");
      return announce(color.includes("Červená") ? "Záznam je uložený. Pri krvi kontaktujte pediatra." : "Prebalenie bolo uložené.");
    }
    if (action === "save-temperature") {
      const raw = byId("v5TemperatureValue").value.replace(",", ".");
      const value = Number(raw);
      if (!Number.isFinite(value) || value < 30 || value > 45) return announce("Zadajte nameranú teplotu v rozsahu 30 až 45 °C.");
      const time = byId("v5TemperatureTime").value ? new Date(byId("v5TemperatureTime").value) : new Date();
      state.events.push({ id: createId(), type: "Teplota", value: value.toFixed(1).replace(".", ",") + " °C", note: byId("v5TemperatureNote").value.trim(), author: "rodina", created: time.toISOString() });
      if (typeof save === "function") save(); else persist();
      completeFlow("Meranie teploty je uložené.", "Ak máte pochybnosti, obráťte sa na pediatra.");
      return announce("Teplota bola uložená.");
    }
    if (action === "evaluate-weather") {
      const outdoor = Number(byId("v5WeatherOutdoor").value);
      const feels = Number(byId("v5WeatherFeels").value);
      const wind = byId("v5WeatherWind").value;
      const rain = byId("v5WeatherRain").value;
      const uv = byId("v5WeatherUv").value;
      const situation = state.v5.flow.data.situation;
      let clothing = feels <= 5 ? "Zvážte teplejšie vrstvy, čiapku a ochranu pred vetrom." : feels <= 15 ? "Môžu pomôcť ľahšie vrstvy, ktoré sa dajú priebežne pridať alebo odobrať." : feels >= 27 ? "Zvážte ľahké priedušné oblečenie a tieň." : "Ľahké vrstvy podľa bežného komfortu dieťaťa.";
      let check = "Skontrolujte zátylok, hrudník a celkový komfort dieťaťa.";
      let warning = wind === "strong" || rain === "heavy" ? "Pobyt môže pomôcť skrátiť a zvoliť chránené miesto." : "Podmienky priebežne sledujte.";
      if (uv === "high") warning += " Vyhnite sa najteplejšej časti dňa a použite vhodný tieň.";
      if (situation === "stroller" && feels >= 24) warning += " Kočík nezakrývajte plienkou ani nepriedušnou látkou.";
      if (situation === "carrier") check += " V nosiči zohľadnite aj teplo tela rodiča.";
      if (situation === "car") check += " Počas jazdy kontrolujte teplotu v aute a bezpečné pripútanie bez hrubých vrstiev.";
      state.v5.flow.data = { ...state.v5.flow.data, outdoor, feels, wind, rain, uv, result: { clothing, check, warning } };
      state.v5.weatherLast = { ...state.v5.flow.data, created: new Date().toISOString() };
      state.v5.flow.step = 2;
      persist();
      return renderFlow();
    }
    if (action === "weather-done") return openHome();
    if (action === "save-mother-profile") return saveMotherProfile();
    if (action === "save-child-profile") return saveChildProfile();
    if (action === "open-original-child-profile") return byId("profileBtn")?.click();
    if (action === "save-prenatal-hospital") {
      state.prenatal.hospital = byId("v5PrenatalHospital").value.trim();
      state.prenatal.hospitalContact = byId("v5PrenatalHospitalContact").value.trim();
      state.prenatal.hospitalDetails = byId("v5PrenatalHospitalDetails").value.trim();
      state.v5.motherProfile.hospital = state.prenatal.hospital;
      persist();
      return announce("Poznámka k pôrodnici je uložená. Ďalej môžete skontrolovať tašku alebo doklady.");
    }
    if (action === "save-prenatal-mother") {
      state.prenatal.motherNote = byId("v5PrenatalMotherNote").value.trim();
      state.prenatal.helper = byId("v5PrenatalHelper").value.trim();
      persist();
      return announce("Poznámka pre mamu je uložená v spoločnej príprave.");
    }
    if (action === "open-prenatal-original") return routeTo("beforeBirth");
    if (action === "open-original-sounds") return routeTo("sounds");
    if (action === "stop-audio") {
      window.GugubooAudioControl?.stop?.();
      const customAudio = byId("customSoundAudio");
      if (customAudio) customAudio.pause();
      state.v5.audio = { active: false, type: "", title: "", volume: state.v5.audio.volume || 18, stopAt: "" };
      persist();
      renderAudioDock();
      return announce("Zvuk bol vypnutý.");
    }
    if (action === "add-family-member") {
      const name = byId("v5MemberName").value.trim();
      if (!name) return announce("Doplňte meno blízkej osoby.");
      const accessMap = { view: "Iba zobrazenie", add: "Zobrazenie a pridávanie", edit: "Pridávanie a úpravy", manage: "Správa rodiny" };
      state.v5.familyMembers.push({
        id: createId(), name, relationship: byId("v5MemberRelationship").value, phone: byId("v5MemberPhone").value.trim(),
        email: byId("v5MemberEmail").value.trim(), access: byId("v5MemberAccess").value, accessLabel: accessMap[byId("v5MemberAccess").value],
        notifications: byId("v5MemberNotifications").value !== "none", notificationLevel: byId("v5MemberNotifications").value
      });
      persist();
      renderProfiles();
      return announce("Blízka osoba bola pridaná do rodinného profilu.");
    }
    if (action === "save-travel") {
      state.travelCountry = byId("v5TravelCountry").value;
      state.travel.city = byId("v5TravelCity").value.trim();
      state.travel.start = byId("v5TravelStart").value;
      state.travel.end = byId("v5TravelEnd").value;
      state.travel.transport = byId("v5TravelTransport").value;
      state.travel.stay = byId("v5TravelStay").value;
      persist();
      state.v5.travelSection = "home";
      renderTravel();
      return announce("Cesta je uložená. Checklist sa pripraví podľa zadaných údajov.");
    }
    if (action === "add-medicine") {
      const name = byId("v5MedicineName").value.trim();
      if (!name) return announce("Doplňte názov lieku.");
      state.v5.medicines.push({ id: createId(), name, substance: byId("v5MedicineSubstance").value.trim(), concentration: byId("v5MedicineConcentration").value.trim(), form: byId("v5MedicineForm").value.trim(), doctor: byId("v5MedicineDoctor").value.trim(), note: byId("v5MedicineNote").value.trim() });
      persist();
      renderTravel();
      return announce("Liek je uložený. V zahraničí porovnajte účinnú látku, formu a koncentráciu.");
    }
    if (action === "save-offline-card") {
      state.v5.offlineCardSavedAt = new Date().toISOString();
      persist();
      return announce("Offline karta je uložená v tomto prehliadači.");
    }
    if (action === "back-travel-checklist") {
      state.v5.travelSection = "checklist";
      persist();
      return renderTravel();
    }
    if (action === "add-travel-custom") {
      const value = byId("v5TravelCustomItem").value.trim();
      if (!value) return announce("Napíšte vlastnú položku.");
      state.v5.travelCustomItems ||= [];
      state.v5.travelCustomItems.push({ id: createId(), category: Number(event.target.closest("[data-category]").dataset.category), label: value, done: false });
      persist();
      byId("v5TravelCustomItem").value = "";
      return announce("Vlastná položka bola pridaná.");
    }
    if (action === "save-first100") {
      const date = byId("v5First100Date").value;
      if (!date) return announce("Vyberte dátum.");
      let item = state.diary.find(memory => memory.first100 && memory.date === date);
      if (!item) {
        item = { id: createId(), first100: true, date, created: new Date().toISOString() };
        state.diary.push(item);
      }
      item.text = byId("v5First100Text").value.trim();
      item.mood = byId("v5First100Mood").value.trim();
      item.day = dayOfLife(date);
      item.photo ||= state.v5.pendingFirst100Photo || "";
      state.v5.pendingFirst100Photo = "";
      if (typeof save === "function") save(); else persist();
      renderFirst100();
      return announce("Fotografia a spomienka boli uložené k " + (item.day || "") + ". dňu.");
    }
    if (action === "add-checklist-custom") {
      const label = byId("v5ChecklistCustom").value.trim();
      if (!label) return announce("Napíšte vlastnú položku.");
      state.v5.checklistCustom.push({ id: createId(), category: state.v5.checklistCategory, label });
      persist();
      renderChecklists();
      return announce("Vlastná položka bola pridaná.");
    }
    if (action === "open-birth-card") return routeTo("birthCard");
  });

  document.addEventListener("change", event => {
    const favoriteSelect = event.target.closest("[data-v5-favorite-select]");
    if (favoriteSelect) {
      const index = Number(favoriteSelect.dataset.v5FavoriteSelect);
      const next = favoriteSelect.value;
      const duplicate = state.v5.favorites.indexOf(next);
      if (duplicate >= 0 && duplicate !== index) {
        const current = state.v5.favorites[index];
        state.v5.favorites[duplicate] = current;
      }
      state.v5.favorites[index] = next;
      state.v5.favoritesCustomized = true;
      persist();
      renderDrawer();
      renderBottomBar();
      renderHome();
      return announce("Spodné menu bolo upravené.");
    }
    if (event.target.matches("[data-v5-travel-check]")) {
      state.travel.checks[event.target.dataset.v5TravelCheck] = event.target.checked;
      persist();
      return announce(event.target.checked ? "Položka je hotová." : "Položka bola označená ako nesplnená.");
    }
    if (event.target.matches("[data-v5-check-item]")) {
      state.checks[event.target.dataset.v5CheckItem] = event.target.checked;
      persist();
      renderChecklists();
      return announce(event.target.checked ? "Položka je hotová." : "Položka bola označená ako nesplnená.");
    }
    if (event.target.id === "v5CardPalette") {
      state.v5.cardPalette = event.target.value;
      persist();
      return renderCards();
    }
    if (event.target.id === "v5AudioVolume") {
      state.v5.audio.volume = Number(event.target.value);
      window.GugubooAudioControl?.setVolume?.(state.v5.audio.volume);
      const customAudio = byId("customSoundAudio");
      if (customAudio) customAudio.volume = Math.min(1, state.v5.audio.volume / 100);
      persist();
      return;
    }
    if (event.target.id === "v5AudioTimer") {
      state.v5.audio.stopAt = event.target.value ? new Date(Date.now() + Number(event.target.value) * 60000).toISOString() : "";
      persist();
      renderAudioDock();
      return announce(event.target.value ? "Zvuk sa vypne o " + event.target.value + " minút." : "Časovač zvuku je vypnutý.");
    }
    if (event.target.id === "v5ChildPhoto" && event.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        state.profile.photo = reader.result;
        persist();
        renderProfiles();
        announce("Fotografia dieťaťa je pripravená v profile.");
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    if (event.target.id === "v5First100Photo" && event.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        state.v5.pendingFirst100Photo = reader.result;
        persist();
        announce("Fotografia je pripravená. Uložte dnešný okamih.");
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  });

  byId("v5DrawerOverlay").addEventListener("click", event => {
    if (event.target === byId("v5DrawerOverlay")) closeDrawer();
  });

  const customSoundAudio = byId("customSoundAudio");
  if (customSoundAudio) {
    customSoundAudio.addEventListener("play", () => {
      state.v5.audio = { ...state.v5.audio, active: true, type: "custom", title: byId("customSoundName")?.textContent || "Rodinná uspávanka", stopAt: "" };
      persist();
      renderAudioDock();
    });
    customSoundAudio.addEventListener("ended", () => {
      state.v5.audio.active = false;
      state.v5.audio.stopAt = "";
      persist();
      renderAudioDock();
    });
  }

  byId("v5BottomBar").addEventListener("pointerdown", event => {
    drawerPointerStart = { y: event.clientY, x: event.clientX };
  });
  byId("v5BottomBar").addEventListener("pointerup", event => {
    if (drawerPointerStart && drawerPointerStart.y - event.clientY > 38 && Math.abs(drawerPointerStart.x - event.clientX) < 90) openDrawer();
    drawerPointerStart = null;
  });

  byId("v5Drawer").addEventListener("pointerdown", event => {
    drawerPanelStart = { y: event.clientY, scrollTop: byId("v5DrawerScroll").scrollTop };
  });
  byId("v5Drawer").addEventListener("pointerup", event => {
    if (drawerPanelStart && drawerPanelStart.scrollTop <= 0 && event.clientY - drawerPanelStart.y > 60) closeDrawer();
    drawerPanelStart = null;
  });

  byId("v5DrawerScroll").addEventListener("dragstart", event => {
    const item = event.target.closest("[data-v5-favorite-index]");
    if (!item) return;
    draggedFavorite = Number(item.dataset.v5FavoriteIndex);
    event.dataTransfer.effectAllowed = "move";
  });
  byId("v5DrawerScroll").addEventListener("dragover", event => {
    if (draggedFavorite !== null && event.target.closest("[data-v5-favorite-index]")) event.preventDefault();
  });
  byId("v5DrawerScroll").addEventListener("drop", event => {
    const item = event.target.closest("[data-v5-favorite-index]");
    if (!item || draggedFavorite === null) return;
    event.preventDefault();
    const destination = Number(item.dataset.v5FavoriteIndex);
    const moved = state.v5.favorites.splice(draggedFavorite, 1)[0];
    state.v5.favorites.splice(destination, 0, moved);
    state.v5.favoritesCustomized = true;
    draggedFavorite = null;
    persist();
    renderDrawer();
    renderBottomBar();
    renderHome();
    announce("Poradie spodného menu bolo zmenené.");
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (byId("v5DrawerOverlay").classList.contains("open")) closeDrawer();
      else if (!["home", "welcome", "birthIntro", "pregnancyIntro"].includes(currentView())) goBack();
    }
  });

  const observer = new MutationObserver(() => {
    const next = currentView();
    if (next !== observedView) {
      if (!skipHistory && observedView && !["welcome", "birthIntro", "pregnancyIntro"].includes(observedView)) history.push(observedView);
      observedView = next;
      skipHistory = false;
      syncViewAccessibility();
      updateHeader();
      if (next === "home") renderHome();
      if (next === "v5Profiles") renderProfiles();
      if (next === "v5Travel") renderTravel();
      if (next === "v5First100") renderFirst100();
      if (next === "v5Cards") renderCards();
      if (next === "v5Checklists") renderChecklists();
      if (next === "v5Prenatal") renderPrenatal();
      if (next === "v5Sounds") renderSounds();
      byId("v5DrawerTip").hidden = state.v5.drawerHintDismissed || ["welcome", "birthIntro", "pregnancyIntro"].includes(next);
    }
  });
  document.querySelectorAll(".view").forEach(view => observer.observe(view, { attributes: true, attributeFilter: ["class"] }));

  setInterval(() => {
    renderTimers();
    if (state.v5.audio?.active && state.v5.audio.stopAt && Date.now() >= new Date(state.v5.audio.stopAt).getTime()) {
      window.GugubooAudioControl?.stop?.();
      state.v5.audio.active = false;
      state.v5.audio.stopAt = "";
      persist();
      renderAudioDock();
      announce("Časovač zvuku prehrávanie ukončil.");
    }
  }, 1000);
  renderDrawer();
  renderAll();
  syncViewAccessibility();
  updateHeader();
})();

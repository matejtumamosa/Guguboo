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
    sun: "<circle cx='12' cy='12' r='4'/><path d='M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.41M17.66 6.34l1.41-1.41'/>",
    feeding: "<path d='M9 3h6'/><path d='M10 3v4l-3 4v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-8l-3-4V3'/><path d='M8 13h8'/>",
    diaper: "<path d='M5 7c2 1 4 1.5 7 1.5S17 8 19 7v9c-2 3-4.3 4.5-7 4.5S7 19 5 16Z'/><path d='M5 11h4l3 3 3-3h4'/>",
    bath: "<path d='M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z'/><path d='M7 12V7a3 3 0 0 1 6 0'/><path d='M13 7h3M7 20v1M17 20v1'/>",
    temperature: "<path d='M14 14.8V5a3 3 0 0 0-6 0v9.8a5 5 0 1 0 6 0Z'/><path d='M11 8v9'/>",
    weather: "<path d='M8 17h9a4 4 0 1 0-1.2-7.8A6 6 0 0 0 4 11a3 3 0 0 0 4 6Z'/><path d='M8 3V1M3.5 5.5 2 4M18 4l-1.5 1.5'/>",
    water: "<path d='M12 2S6 9.1 6 14a6 6 0 0 0 12 0c0-4.9-6-12-6-12Z'/><path d='M9 15.5a3.5 3.5 0 0 0 3 1.8'/>",
    meal: "<path d='M4 14h16'/><path d='M6 14a6 6 0 0 1 12 0'/><path d='M12 8V5'/><path d='M5 18h14'/>",
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
    cards: "<rect x='5' y='3' width='14' height='18' rx='2'/><path d='M9 8h6M9 12h6M9 16h3'/>",
    lock: "<rect x='5' y='10' width='14' height='11' rx='2'/><path d='M8 10V7a4 4 0 0 1 8 0v3M12 14v3'/>",
    tooth: "<path d='M7 3c-3 1-4 5-2 9l2 7c.4 1.4 2.3 1.3 2.6-.1L11 13h2l1.4 5.9c.3 1.4 2.2 1.5 2.6.1l2-7c2-4 1-8-2-9-2-.7-3 .5-5 .5S9 2.3 7 3Z'/>",
    activity: "<circle cx='8' cy='8' r='3'/><circle cx='16' cy='8' r='3'/><path d='M5 20v-2a4 4 0 0 1 6-3.5M19 20v-2a4 4 0 0 0-6-3.5M12 4v7'/>",
    plus: "<path d='M12 5v14M5 12h14'/>",
    chat: "<path d='M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-5 4v-4.3A2.5 2.5 0 0 1 4 13.5Z'/><path d='M8.5 9.5h.01M12 9.5h.01M15.5 9.5h.01'/>",
    pin: "<path d='m14.5 3.5 6 6-3.2 1.1-3.7 3.7-.2 4.1-1.7 1.7-3.3-5.5-5.5-3.3 1.7-1.7 4.1-.2 3.7-3.7Z'/><path d='m8.4 15.6-5 5'/>",
    more: "<circle cx='5' cy='5' r='1.5'/><circle cx='12' cy='5' r='1.5'/><circle cx='19' cy='5' r='1.5'/><circle cx='5' cy='12' r='1.5'/><circle cx='12' cy='12' r='1.5'/><circle cx='19' cy='12' r='1.5'/><circle cx='5' cy='19' r='1.5'/><circle cx='12' cy='19' r='1.5'/><circle cx='19' cy='19' r='1.5'/>"
  };
  const icon = name => "<svg viewBox='0 0 24 24' aria-hidden='true'>" + (iconPaths[name] || iconPaths.sparkle) + "</svg>";

  const features = {
    sleep: { label: "Spánok", description: "Spustiť alebo doplniť spánok", icon: "moon", tier: "premium", flow: "sleep" },
    feeding: { label: "Kŕmenie", description: "Dojčenie, fľaša alebo príkrm", icon: "feeding", tier: "free", flow: "feeding" },
    diaper: { label: "Prebaľovanie", description: "Kedy dieťa cikalo alebo kakalo", icon: "diaper", tier: "free", flow: "diaper" },
    bath: { label: "Kúpanie", description: "Celý kúpeľ, vlásky alebo telíčko", icon: "bath", tier: "free", flow: "bath" },
    tracker: { label: "Denné záznamy", description: "Starostlivosť na jednom mieste", icon: "sparkle", tier: "free", view: "tracker" },
    temperature: { label: "Teplota", description: "Uložiť meranie bez ďalších polí", icon: "temperature", tier: "free", flow: "temperature" },
    weather: { label: "Počasie", description: "Oblečenie podľa situácie", icon: "weather", tier: "free", flow: "weather" },
    calendar: { label: "Kalendár", description: "Termíny a rodinné udalosti", icon: "calendar", tier: "premium", view: "calendar" },
    shopping: { label: "Nákup", description: "Spoločný nákupný zoznam", icon: "shopping", tier: "premium", view: "v5Utility" },
    contacts: { label: "Kontakty", description: "Pediater, rodina a pomoc", icon: "contacts", tier: "free", view: "v5Utility" },
    travel: { label: "Cestovanie", description: "Príprava a pomoc v okolí", icon: "travel", tier: "free", view: "v5Travel" },
    sounds: { label: "Zvuky", description: "Šumy, uspávanky a nahrávky", icon: "sound", tier: "premium", view: "v5Sounds" },
    night: { label: "Nočná pomoc", description: "Pokojná orientácia v noci", icon: "moon", tier: "premium", view: "night" },
    guide: { label: "Sprievodca", description: "Krátka pomoc krok po kroku", icon: "sparkle", tier: "premium", view: "guide" },
    health: { label: "Zdravie", description: "Záznamy, alergie a report", icon: "health", tier: "premium", view: "health" },
    teeth: { label: "Zúbky", description: "Mapa, starostlivosť a zubár", icon: "tooth", tier: "free", view: "teeth" },
    growth: { label: "Rast a váha", description: "Hmotnosť, výška a obvod hlavy", icon: "growth", tier: "premium", view: "growth" },
    urgent: { label: "Urgentná pomoc", description: "Varovné signály a kontakty", icon: "alert", tier: "free", view: "urgent" },
    checklists: { label: "Praktické zoznamy", description: "Lekár, choroba a cestovanie", icon: "checklist", tier: "free", view: "v5Checklists" },
    memories: { label: "Naše chvíle", description: "Moment, prvé razy a spoločný príbeh", icon: "memory", tier: "premium", view: "v5First100" },
    first100: { label: "Náš príbeh", description: "Výstup 100 dní a prvého roka", icon: "baby", tier: "premium", view: "v5First100" },
    activities: { label: "Aktivity", description: "Krátke spoločné chvíle podľa veku", icon: "activity", tier: "free", view: "activities" },
    diary: { label: "Rodinný denník", description: "Chronologický príbeh rodiny", icon: "book", tier: "premium", view: "diary" },
    privateSpace: { label: "Môj priestor", description: "Súkromné zápisy chránené PIN-om", icon: "lock", tier: "free", view: "privateSpace" },
    chronicle: { label: "Náš príbeh", description: "Výstupy z uložených chvíľ", icon: "memory", tier: "addon", view: "memoryOutput" },
    cards: { label: "Kartička narodenia", description: "Jednorazový výstup z profilu dieťaťa", icon: "cards", tier: "premium", view: "v5Cards" },
    pregnancy: { label: "Tehotenská knižka", description: "Bábätko, mama a aktuálny týždeň", icon: "book", tier: "free", view: "v5PregnancyBook" },
    beforeBirth: { label: "Moja príprava", description: "Taška, pôrodnica a prvé dni", icon: "checklist", tier: "free", view: "v5Prenatal" },
    administration: { label: "Úrady", description: "Lokálne kroky a podpora", icon: "book", tier: "free", view: "v5Utility" },
    products: { label: "Výbava a produkty", description: "Používané veci a doplnenie", icon: "products", tier: "premium", view: "v5Utility" },
    family: { label: "Rodina", description: "Spoločné úlohy a zastúpenie", icon: "family", tier: "premium", view: "v5Utility" },
    profiles: { label: "Profily rodiny", description: "Mama, dieťa a blízke osoby", icon: "profile", tier: "free", view: "v5Profiles" },
    // V2: falošná „AI“ (kľúčové slová) nahradená GuguChatom – odpovede z overeného obsahu + akcie.
    guguChat: { label: "GuguChat", description: "Opýtaj sa alebo vyrieš ďalší krok", icon: "chat", tier: "free", view: "guguChat" },
    care: { label: "Pomoc a starostlivosť", description: "Rady, choroba, noc a zdravotné záznamy", icon: "health", tier: "free", view: "v5Care" }
  };

  const adaptiveOSections = [
    {
      id: "care",
      label: "Oddych",
      shortLabel: "Oddych",
      description: "Odpočinok bez výčitiek.",
      period: "Dnes",
      start: -90,
      icon: "moon"
    },
    {
      id: "movement",
      label: "Telo",
      shortLabel: "Telo",
      description: "Jedlo, pitie a jemná regenerácia.",
      period: "Dnes",
      start: 30,
      icon: "health"
    },
    {
      id: "health",
      label: "Opora",
      shortLabel: "Opora",
      description: "Pomoc, kontakt a chvíľa pre seba.",
      period: "Dnes",
      start: 150,
      icon: "family"
    }
  ];

  const adaptiveOGoals = {
    care: [
      { id: "rest", title: "10 minút oddychu", icon: "moon", cadence: "day" },
      { id: "nap", title: "Zdriemla som si", icon: "moon", cadence: "day" },
      { id: "handover", title: "Niekto ma vystriedal", icon: "family", cadence: "day" },
      { id: "quiet", title: "Chvíľa bez povinností", icon: "sparkle", cadence: "day" }
    ],
    movement: [
      { id: "water", title: "Napila som sa", icon: "water", cadence: "day" },
      { id: "meal", title: "Najedla som sa", icon: "meal", cadence: "day" },
      { id: "fresh-air", title: "Bola som na vzduchu", icon: "weather", cadence: "day" },
      { id: "stretch", title: "Jemné pretiahnutie", icon: "activity", cadence: "day" }
    ],
    health: [
      { id: "check-in", title: "Ako sa dnes cítim", icon: "health", cadence: "day" },
      { id: "talk", title: "Ozvala som sa blízkemu", icon: "family", cadence: "day" },
      { id: "ask-help", title: "Požiadať o pomoc", icon: "family", cadence: "day" },
      { id: "me-time", title: "10 minút pre seba", icon: "sparkle", cadence: "day" }
    ]
  };

  const adaptiveODefaults = {
    mother: {
      care: ["rest", "nap", "handover", "quiet"],
      movement: ["water", "meal", "fresh-air", "stretch"],
      health: ["check-in", "talk", "ask-help", "me-time"]
    },
    partner: {
      care: ["rest", "nap", "handover", "quiet"],
      movement: ["water", "meal", "fresh-air", "stretch"],
      health: ["check-in", "talk", "ask-help", "me-time"]
    }
  };

  const prenatalOrganizationSections = [
    { id: "home", label: "Domov", shortLabel: "Domov", description: "Základ pripravený bez zbytočných nákupov.", icon: "home", start: -90, tasks: [
      ["v5-home-sleep", "Bezpečné miesto na spánok", "baby"],
      ["v5-home-changing", "Miesto na prebaľovanie", "diaper"],
      ["v5-home-clothes", "Základné oblečenie", "products"],
      ["v5-prenatal-car-seat", "Autosedačka na cestu domov", "travel"]
    ] },
    { id: "hospital", label: "Pôrodnica", shortLabel: "Taška", description: "Taška po malých častiach.", icon: "checklist", start: 30, tasks: [
      ["v5-bag-mother", "Veci pre mamu", "profile"],
      ["v5-bag-baby", "Veci pre bábätko", "baby"],
      ["v5-bag-hygiene", "Hygiena a praktické potreby", "bath"],
      ["v5-bag-home", "Oblečenie na odchod domov", "home"]
    ] },
    { id: "admin", label: "Vybaviť", shortLabel: "Vybaviť", description: "Kontakty a doklady, ktoré chcete mať poruke.", icon: "book", start: 150, tasks: [
      ["v5-health-pediatrician", "Vybrať pediatra", "health"],
      ["v5-doc-id", "Skontrolovať doklady rodiča", "book"],
      ["v5-prenatal-insurance", "Overiť zdravotnú poisťovňu", "contacts"],
      ["v5-prenatal-help", "Dohodnúť pomoc po návrate domov", "family"]
    ] }
  ];

  const postpartumOrganizationSections = [
    { id: "return", label: "Doma", shortLabel: "Doma", description: "Pokojný návrat a praktický základ.", icon: "home", start: -90, tasks: [
      ["v5-post-safe-sleep", "Skontrolovať bezpečné miesto na spánok", "moon"],
      ["v5-post-diapers-stock", "Doplniť plienky a hygienu", "diaper"],
      ["v5-post-pharmacy", "Uložiť kontakt na lekáreň", "contacts"],
      ["v5-post-help-plan", "Dohodnúť, kto dnes pomôže", "family"]
    ] },
    { id: "documents", label: "Doklady", shortLabel: "Doklady", description: "Povinnosti po narodení na jednom mieste.", icon: "book", start: 30, tasks: [
      ["v5-admin-birth", "Rodný list", "book"],
      ["v5-admin-insurance", "Zdravotná poisťovňa dieťaťa", "health"],
      ["v5-admin-pediatrician", "Pediater", "contacts"],
      ["v5-admin-benefits", "Príspevky a rodičovské dávky", "shopping"]
    ] },
    { id: "family", label: "Rodina", shortLabel: "Rodina", description: "Rozdelenie úloh bez chaosu.", icon: "family", start: 150, tasks: [
      ["v5-post-night-plan", "Dohodnúť nočné striedanie", "moon"],
      ["v5-post-shopping", "Vytvoriť spoločný nákup", "shopping"],
      ["v5-post-contacts", "Uložiť dôležité kontakty", "contacts"],
      ["v5-post-checkup", "Zapísať najbližšiu kontrolu", "calendar"]
    ] }
  ];

  const featureGroups = [
    ["Pomoc a podpora", ["care"]],
    ["Zdravie a vývoj", ["teeth", "checklists", "activities"]],
    ["Rodina a plánovanie", ["family", "profiles", "calendar", "shopping", "contacts", "travel", "products", "weather"]],
    ["Chvíle a súkromie", ["memories", "privateSpace"]]
  ];

  const postpartumDrawerFeatures = [
    "privateSpace", "care", "activities", "teeth", "family", "shopping",
    "contacts", "checklists", "administration", "travel", "products", "weather"
  ];

  const prenatalDrawerFeatures = [
    "privateSpace", "beforeBirth", "pregnancy", "contacts", "shopping",
    "products", "family", "travel", "weather", "profiles"
  ];

  const favoriteOptions = phase => phase === "expecting"
    ? [...prenatalDrawerFeatures]
    : ["privateSpace", "memories", "activities", "shopping", "care", "family", "contacts", "checklists", "administration", "travel", "products", "weather", "teeth"];
  const defaultFavorites = phase => phase === "expecting"
    ? ["beforeBirth", "contacts", "shopping", "travel"]
    : ["privateSpace", "memories", "activities", "shopping"];
  const legacyCareFeatures = new Set(["health", "urgent", "guide", "night"]);
  const normalizeFavorites = (favorites, phase) => {
    const allowed = favoriteOptions(phase);
    const allowedSet = new Set(allowed);
    const normalized = [...new Set((favorites || []).map(key => {
      if (legacyCareFeatures.has(key) || key === "temperature") return "care";
      if (key === "sounds") return "sleep";
      return key;
    }))].filter(key => allowedSet.has(key));
    for (const key of [...defaultFavorites(phase), ...allowed]) {
      if (normalized.length >= 4) break;
      if (!normalized.includes(key)) normalized.push(key);
    }
    return normalized.slice(0, 4);
  };

  state.v5 ||= {};
  state.v5.version = 5;
  state.v5.favoritesCustomized ||= false;
  const savedFavoritePhase = state.v5.phase;
  const activeFavoritePhase = state.profile.status || savedFavoritePhase || "expecting";
  if (savedFavoritePhase && savedFavoritePhase !== activeFavoritePhase && !state.v5.favoritesCustomized) {
    state.v5.favorites = defaultFavorites(activeFavoritePhase);
  }
  state.v5.phase = activeFavoritePhase;
  state.v5.favorites ||= defaultFavorites(activeFavoritePhase);
  state.v5.favorites = normalizeFavorites(state.v5.favorites, activeFavoritePhase);
  if (activeFavoritePhase !== "expecting" && Number(state.v5.bottomMenuVersion || 0) < 2) {
    if (state.v5.favorites.join("|") === "privateSpace|care|activities|family") {
      state.v5.favorites = defaultFavorites(activeFavoritePhase);
    }
    state.v5.bottomMenuVersion = 2;
    persist();
  }
  if (activeFavoritePhase !== "expecting" && Number(state.v5.bottomMenuVersion || 0) < 3) {
    if (!state.v5.favoritesCustomized && state.v5.favorites.join("|") === "privateSpace|shopping|activities|family") {
      state.v5.favorites = defaultFavorites(activeFavoritePhase);
    }
    state.v5.bottomMenuVersion = 3;
    persist();
  }
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
  state.v5.doctorVisits ||= [];
  state.v5.travelSection ||= "home";
  state.v5.profileTab ||= "mother";
  state.v5.selectedZodiac ||= "";
  state.v5.cardPalette ||= "lavender";
  state.v5.weatherLast ||= null;
  state.v5.night ||= false;
  state.v5.checklistCategory ||= "";
  state.v5.checklistCustom ||= [];
  state.v5.prenatalSection ||= "home";
  state.v5.pregnancyBookSection ||= "home";
  state.v5.pregnancyQuestions ||= [];
  state.v5.audio ||= { active: false, type: "", title: "", volume: 18, stopAt: "" };
  state.v5.soundSection ||= "home";
  state.v5.memoryRhythm ||= "daily100";
  state.v5.momentsSection ||= "home";
  state.v5.utilitySection ||= "shopping";
  const activeCirclePhase = state.profile.status || "expecting";
  if (state.v5.circlePhase && state.v5.circlePhase !== activeCirclePhase) {
    state.v5.circleMode = activeCirclePhase === "expecting" ? "organize" : "wellbeing";
  }
  state.v5.circlePhase = activeCirclePhase;
  state.v5.circleMode = ["wellbeing", "organize"].includes(state.v5.circleMode)
    ? state.v5.circleMode
    : state.profile.status === "expecting" ? "organize" : "wellbeing";
  state.v5.firstMoments ||= [];
  state.v5.lastDiaperSize ||= "";
  state.v5.adaptiveO = state.v5.adaptiveO && typeof state.v5.adaptiveO === "object" ? state.v5.adaptiveO : {};
  state.v5.adaptiveO.role = ["mother", "partner"].includes(state.v5.adaptiveO.role)
    ? state.v5.adaptiveO.role
    : state.parentRole === "partner" ? "partner" : "mother";
  state.v5.adaptiveO.section = adaptiveOSections.some(section => section.id === state.v5.adaptiveO.section)
    ? state.v5.adaptiveO.section
    : "care";
  state.v5.adaptiveO.selected ||= {};
  state.v5.adaptiveO.completed ||= {};
  ["mother", "partner"].forEach(role => {
    state.v5.adaptiveO.selected[role] ||= {};
    adaptiveOSections.forEach(section => {
      if (!Array.isArray(state.v5.adaptiveO.selected[role][section.id])) {
        state.v5.adaptiveO.selected[role][section.id] = [...adaptiveODefaults[role][section.id]];
      }
    });
  });
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
    "<section class='view' id='v5PregnancyBook'><div class='v5-flow' id='v5PregnancyBookContent'></div></section>",
    "<section class='view' id='v5Sounds'><div class='v5-flow' id='v5SoundsContent'></div></section>",
    "<section class='view' id='v5Care'><div class='v5-flow' id='v5CareContent'></div></section>",
    "<section class='view' id='v5Utility'><div class='v5-flow' id='v5UtilityContent'></div></section>",
    "<section class='view' id='v5AdaptiveO'><div class='v5-flow' id='v5AdaptiveOContent'></div></section>",
    "<section class='view' id='guguChat'><div class='v5-flow' id='guguChatContent'></div></section>"
  ].join(""));

  document.body.insertAdjacentHTML("beforeend", [
    "<div id='v5PersistentTimers' aria-live='polite'></div>",
    "<div id='v5AudioDock' aria-live='polite'></div>",
    "<nav id='v5BottomBar' aria-label='Štyri obľúbené funkcie'></nav>",
    "<div id='v5QuickRecordOverlay' aria-hidden='true'>",
    "<aside id='v5QuickRecord' role='dialog' aria-modal='true' aria-labelledby='v5QuickRecordTitle'>",
    "<div class='v5-drawer-head'><div><h2 id='v5QuickRecordTitle'>Čo chcete zaznamenať?</h2><p>Vyberte jednu vec.</p></div>",
    "<button class='v5-icon-button' type='button' data-v5-close-record aria-label='Zatvoriť'>×</button></div>",
    "<div class='v5-quick-record-grid'>",
    quickFeatureButton("sleep", "Spánok") + quickFeatureButton("feeding", "Kŕmenie") +
    quickFeatureButton("diaper", "Prebaľovanie") + quickFeatureButton("bath", "Kúpanie") +
    quickFeatureButton("temperature", "Teplota") + quickActionButton("note", "book", "Poznámka"),
    "</div></aside></div>",
    "<div id='v5OOverlay' aria-hidden='true'>",
    "<aside id='v5OMenu' role='dialog' aria-modal='true' aria-labelledby='v5OMenuTitle'>",
    "<div class='v5-drawer-head v5-o-modal-head'><button class='v5-icon-button v5-o-modal-back' id='v5OMenuBack' type='button' data-v5-o-back aria-label='Späť' hidden>" + icon("back") + "</button><div><h2 id='v5OMenuTitle'>Malé kroky</h2><p id='v5OMenuSubtitle'>Vyberte jednu možnosť.</p></div>",
    "<button class='v5-icon-button' type='button' data-v5-close-o aria-label='Zrušiť'>×</button></div>",
    "<div id='v5OMenuBody'><div class='v5-quick-record-grid v5-o-menu-grid' id='v5OMenuGrid'></div></div></aside></div>",
    "<div id='v5DrawerOverlay' aria-hidden='true'>",
    "<aside id='v5Drawer' role='dialog' aria-modal='true' aria-labelledby='v5DrawerTitle'>",
    "<button class='v5-drawer-handle' type='button' data-v5-close-drawer aria-label='Zatvoriť ďalšie aplikácie'></button>",
    "<div class='v5-drawer-head'><div><h2 id='v5DrawerTitle'>Ďalšie aplikácie</h2><p>Vyberte jednu aplikáciu.</p></div>",
    "<button class='v5-icon-button' type='button' data-v5-close-drawer aria-label='Zatvoriť'>×</button></div>",
    "<div class='v5-drawer-scroll' id='v5DrawerScroll'></div>",
    "</aside></div>",
    "<div class='v5-drawer-tip' id='v5DrawerTip'>Potiahni spodnú lištu nahor – nájdeš tam všetky aplikácie.<button type='button' data-v5-dismiss-tip>Rozumiem</button></div>",
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
    v5First100: ["Naše chvíle", "Moment, prvé razy a spoločný príbeh"],
    v5Cards: ["Kartička narodenia", "Jednorazový výstup z profilu dieťaťa"],
    v5Checklists: ["Praktické zoznamy", "Kategórie podľa situácie"],
    v5Prenatal: ["Moja príprava", "Pôrodnica, taška a domov"],
    v5PregnancyBook: ["Tehotenská knižka", "Bábätko, mama a aktuálny týždeň"],
    v5Sounds: ["Spánok", "Zvuky na zaspávanie"],
    v5Care: ["Pomoc a starostlivosť", "Jedno miesto pre otázky a ťažkosti"],
    v5Utility: ["Rodinné nástroje", "Jednoducho a bez duplicitných obrazoviek"],
    v5AdaptiveO: ["Moje O", ""],
    sounds: ["Zvuky a uspávanky", "Pokoj a zaspávanie"],
    sleep: ["Spánok", "Časovač a dnešný prehľad"],
    tracker: ["Denné záznamy", "Starostlivosť na jednom mieste"],
    guide: ["Sprievodca", "Krátka cesta krok po kroku"],
    guguChat: ["GuguChat", "Opýtaj sa – poradím a pomôžem to vybaviť"],
    urgent: ["Urgentná pomoc", "Varovné signály a kontakty"],
    calendar: ["Kalendár", "Spoločné rodinné termíny"],
    shopping: ["Nákup", "Spoločný zoznam rodiny"],
    contacts: ["Kontakty", "Dôležití ľudia a služby"],
    growth: ["Rast a váha", "Hmotnosť, výška a obvod hlavy"],
    health: ["Zdravie", "Záznamy, alergie a report"],
    teeth: ["Zúbky", "Mapa mliečnych zubov a starostlivosť"],
    travel: ["Cestovanie", "Pôvodná funkcia V4"],
    checklists: ["Checklisty", "Zoznamy podľa situácie"],
    beforeBirth: ["Pred narodením", "Príprava krok po kroku"],
    pregnancyGrowth: ["Tehotenská knižka", "Bábätko, mama a aktuálny týždeň"],
    stateSupport: ["Úrady", "Lokálne kroky a podpora"],
    products: ["Výbava a produkty", "Používané veci"],
    family: ["Rodina", "Úlohy a spoločné informácie"],
    diary: ["Momenty", "Jedna fotka alebo krátka veta"],
    privateSpace: ["Môj priestor", "Súkromné zápisy na tomto zariadení"],
    memoryOutput: ["Kronika", "Výstupy z uložených chvíľ"],
    birthCard: ["Kartička narodenia", "Údaje dieťaťa na jednom mieste"],
    firstYear: ["Obsah podľa veku", "Aktuálne obdobie dieťaťa"],
    activities: ["Aktivity", "Spoločné chvíle podľa veku"],
    premium: ["Premium", "Rozšírené rodinné funkcie"]
  };

  const universalWindowExcluded = new Set(["home", "welcome", "birthIntro", "pregnancyIntro"]);

  function universalWindowTitle(view) {
    if (view === "v5Utility") return features[state.v5.utilitySection]?.label || "Rodinné nástroje";
    if (view === "v5Flow") return features[state.v5.flow?.type]?.label || (state.v5.flow?.type === "note" ? "Poznámka" : "Záznam");
    if (view === "v5First100") return "Naše chvíle";
    if (view === "v5Checklists" && state.profile.status === "expecting") return "Moja príprava";
    return viewTitles[view]?.[0] || "Guguboo";
  }

  function syncUniversalWindow() {
    const viewId = currentView();
    const open = !universalWindowExcluded.has(viewId);
    document.body.classList.toggle("v5-app-window-open", open);
    document.documentElement.classList.toggle("v5-app-window-open", open);
    byId("v5BottomBar")?.classList.toggle("v5-hidden-for-window", open);
    document.querySelectorAll(".view").forEach(view => {
      if (!view.classList.contains("active") || !open) {
        view.removeAttribute("role");
        view.removeAttribute("aria-modal");
        return;
      }
      let head = view.querySelector(":scope > .v5-universal-window-head");
      if (!head) {
        view.insertAdjacentHTML("afterbegin", [
          "<div class='v5-universal-window-head'>",
          "<button type='button' class='v5-universal-back' data-v5-window-back aria-label='Krok späť'>", icon("back"), "<span>Späť</span></button>",
          "<div><small>Aplikácia</small><strong data-v5-window-title></strong></div>",
          "<button type='button' class='v5-universal-cancel' data-v5-window-cancel aria-label='Zrušiť a vrátiť sa domov'>×</button>",
          "</div>"
        ].join(""));
        head = view.querySelector(":scope > .v5-universal-window-head");
      }
      head.querySelector("[data-v5-window-title]").textContent = universalWindowTitle(viewId);
      view.setAttribute("role", "dialog");
      view.setAttribute("aria-modal", "true");
      view.setAttribute("aria-label", universalWindowTitle(viewId));
    });
  }

  let history = [];
  let observedView = currentView();
  let skipHistory = false;
  let drawerPointerStart = null;
  let drawerPanelStart = null;
  let draggedFavorite = null;

  function ensureFavoritePhase() {
    const phase = state.profile.status || "expecting";
    if (state.v5.phase !== phase && !state.v5.favoritesCustomized) {
      state.v5.favorites = defaultFavorites(phase);
    }
    const normalizedFavorites = normalizeFavorites(state.v5.favorites, phase);
    let changed = state.v5.phase !== phase || normalizedFavorites.join("|") !== state.v5.favorites.join("|");
    if (state.v5.circlePhase !== phase) {
      state.v5.circlePhase = phase;
      state.v5.circleMode = phase === "expecting" ? "organize" : "wellbeing";
      changed = true;
    }
    state.v5.phase = phase;
    state.v5.favorites = normalizedFavorites;
    if (changed) persist();
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

  function universalWindowBack() {
    const view = currentView();
    if (view === "v5Flow" && Number(state.v5.flow?.step || 0) > 0) {
      state.v5.flow.step = Math.max(0, state.v5.flow.step - 1);
      persist();
      renderFlow();
      return;
    }
    if (view === "v5Travel" && state.v5.travelSection !== "home") {
      state.v5.travelSection = "home";
      persist();
      renderTravel();
      return;
    }
    if (view === "v5First100" && state.v5.momentsSection !== "home") {
      state.v5.momentsSection = "home";
      persist();
      renderFirst100();
      return;
    }
    if (view === "v5Checklists" && state.v5.checklistCategory) {
      state.v5.checklistCategory = "";
      if (state.profile.status === "expecting") {
        state.v5.prenatalSection = "home";
        persist();
        skipHistory = true;
        switchView("v5Prenatal");
        renderPrenatal();
        return;
      }
      persist();
      renderChecklists();
      return;
    }
    if (view === "v5Prenatal" && state.v5.prenatalSection !== "home") {
      state.v5.prenatalSection = "home";
      persist();
      renderPrenatal();
      return;
    }
    if (view === "v5PregnancyBook" && state.v5.pregnancyBookSection !== "home") {
      state.v5.pregnancyBookSection = "home";
      persist();
      renderPregnancyBook();
      return;
    }
    goBack();
  }

  function openHome() {
    if (byId("v5OOverlay")?.classList.contains("open")) closeAdaptiveOMenu();
    if (byId("v5QuickRecordOverlay")?.classList.contains("open")) closeQuickRecord();
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
    const days = Math.floor((Date.now() - birth.getTime()) / 86400000);
    if (days < 0 || days > 2192) return { days: null, label: "Skontrolovať dátum", invalid: true };
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
      const flowMap = { sleep: "sleep", feeding: "feeding", diaper: "diaper", temperature: "temperature", bath: "bath", weather: "weather" };
      return flowMap[state.v5.flow.type] || "";
    }
    return Object.keys(features).find(key => features[key].view === view) || "";
  }

  function renderBottomBar() {
    ensureFavoritePhase();
    const active = activeFeatureId();
    const visibleFavorites = state.v5.favorites.filter(key => state.profile.status !== "expecting" || !["teeth", "activities"].includes(key));
    // V2: krátke popisy, aby sa v lište nič neorezávalo („Moja prí…“). Celý názov ostáva v aria-label.
    const shortLabels = {
      beforeBirth: "Príprava", pregnancy: "Knižka", privateSpace: "Priestor", memories: "Chvíle",
      travel: "Cesty", administration: "Úrady", products: "Výbava", checklists: "Zoznamy",
      care: "Pomoc", profiles: "Profily", calendar: "Kalendár"
    };
    const favoriteButton = key => {
      const feature = features[key] || features.sleep;
      return [
        "<button class='v5-bottom-action", active === key ? " active" : "", "' type='button' data-v5-feature='", key,
        "' aria-label='", escapeHtml(feature.label), "'>",
        "<span class='v5-nav-icon'>", icon(feature.icon), "</span><span>", escapeHtml(shortLabels[key] || feature.label), "</span></button>"
      ].join("");
    };
    // V2: GuguChat ako okrúhla „spúšť“ v strede lišty (rozhodnutie 28. 9.) – 2 obľúbené vľavo, 2 vpravo.
    const chatButton = [
      "<button class='v2-chat-shutter", active === "guguChat" ? " active" : "", "' type='button' data-v5-feature='guguChat' aria-label='Otvoriť GuguChat'>",
      "<span class='v2-chat-shutter-ring' aria-hidden='true'><span class='v2-chat-shutter-core'>", icon("chat"), "</span></span>",
      "<span class='v2-chat-shutter-label'>GuguChat</span></button>"
    ].join("");
    const favorites = visibleFavorites.slice(0, 4).map(favoriteButton);
    byId("v5BottomBar").classList.add("v2-bottom-bar");
    // V2 (Samuel 28. 9.): bez rušivého tlačidla „Ďalšie aplikácie“ – zásuvka sa otvára potiahnutím lišty nahor.
    // Pre čítačky obrazovky ostáva neviditeľné tlačidlo.
    byId("v5BottomBar").innerHTML = "<button class='v5-sr-only' type='button' data-v5-open-drawer>Ďalšie aplikácie</button>" +
      favorites.slice(0, 2).join("") + chatButton + favorites.slice(2).join("");
  }

  function featureButton(key) {
    const feature = features[key];
    return [
      "<button class='v5-action' type='button' data-v5-feature='", key, "'>",
      "<span class='v5-icon'>", icon(feature.icon), "</span><span><strong>", escapeHtml(feature.label),
      "</strong><small>", escapeHtml(feature.description), "</small></span></button>"
    ].join("");
  }

  function quickFeatureButton(key, label) {
    const feature = features[key] || features.sleep;
    return [
      "<button class='v5-quick-tile' type='button' data-v5-quick-feature='", key, "'>",
      "<span class='v5-icon'>", icon(feature.icon), "</span><strong>", escapeHtml(label || feature.label), "</strong></button>"
    ].join("");
  }

  function quickActionButton(action, iconName, label) {
    return [
      "<button class='v5-quick-tile' type='button' data-v5-quick-action='", action, "'>",
      "<span class='v5-icon'>", icon(iconName), "</span><strong>", escapeHtml(label), "</strong></button>"
    ].join("");
  }

  function quickAudioButton(type, label) {
    return [
      "<button class='v5-quick-tile' type='button' data-v5-audio-type='", type, "' data-v5-audio-title='", escapeHtml(label), "'>",
      "<span class='v5-icon'>", icon("sound"), "</span><strong>", escapeHtml(label), "</strong></button>"
    ].join("");
  }

  function adaptiveOLocalDate(value = new Date()) {
    const date = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(date.getTime())) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  function adaptiveOPeriodKey(cadence) {
    const today = adaptiveOLocalDate();
    return cadence === "month" ? today.slice(0, 7) : today;
  }

  function adaptiveOIsToday(value) {
    return adaptiveOLocalDate(value) === adaptiveOLocalDate();
  }

  function adaptiveOIsThisMonth(value) {
    return adaptiveOLocalDate(value).slice(0, 7) === adaptiveOLocalDate().slice(0, 7);
  }

  function adaptiveOHasTodayEvent(needle) {
    return state.events.some(event => normalized(event.type).includes(needle) && adaptiveOIsToday(event.created || event.date));
  }

  function adaptiveOAutoDone(goal) {
    if (goal.auto === "feeding") return Boolean(state.v5.feedingTimer?.active) || adaptiveOHasTodayEvent("krm");
    if (goal.auto === "diaper") return adaptiveOHasTodayEvent("plien");
    if (goal.auto === "pee") return state.events.some(event => adaptiveOIsToday(event.created || event.date) && normalized(event.type).includes("plien") && ["wet", "both"].includes(event.diaper?.type));
    if (goal.auto === "poop") return state.events.some(event => adaptiveOIsToday(event.created || event.date) && normalized(event.type).includes("plien") && ["dirty", "both"].includes(event.diaper?.type));
    if (goal.auto === "sleep") return Boolean(state.sleepTimer?.active) || adaptiveOHasTodayEvent("span");
    if (goal.auto === "wake") return adaptiveOHasTodayEvent("prebud") || state.events.some(event => adaptiveOIsToday(event.end) && normalized(event.type).includes("span"));
    if (goal.auto === "bath") return adaptiveOHasTodayEvent("kupan");
    if (goal.auto === "activity") return adaptiveOHasTodayEvent("aktivit") || Boolean(state.activities?.tried?.some(item => adaptiveOIsToday(item.date)));
    if (goal.auto === "outside") return adaptiveOHasTodayEvent("vonku");
    if (goal.auto === "moment") return state.diary.some(item => adaptiveOIsToday(item.date || item.created));
    if (goal.auto === "growth") return state.growth.some(item => adaptiveOIsThisMonth(item.date || item.created));
    return false;
  }

  function adaptiveOCompletionKey(role, sectionId, goal) {
    return [role, sectionId, goal.id, adaptiveOPeriodKey(goal.cadence)].join(":");
  }

  function adaptiveOGoalDone(role, sectionId, goal) {
    if (goal.auto) return adaptiveOAutoDone(goal);
    return Boolean(state.v5.adaptiveO.completed[adaptiveOCompletionKey(role, sectionId, goal)]);
  }

  function adaptiveOSelectedGoalIds(role, sectionId) {
    return (adaptiveOGoals[sectionId] || []).map(goal => goal.id);
  }

  function adaptiveOProgress(sectionId, role = state.v5.adaptiveO.role) {
    const selectedIds = adaptiveOSelectedGoalIds(role, sectionId);
    const goals = (adaptiveOGoals[sectionId] || []).filter(goal => selectedIds.includes(goal.id));
    const done = goals.filter(goal => adaptiveOGoalDone(role, sectionId, goal)).length;
    return {
      done,
      total: goals.length,
      percentage: goals.length ? Math.round(done / goals.length * 100) : 0
    };
  }

  function adaptiveOPoint(angle, radius = 156) {
    const radians = angle * Math.PI / 180;
    return { x: 210 + radius * Math.cos(radians), y: 210 + radius * Math.sin(radians) };
  }

  function adaptiveOCut(angle) {
    const outer = adaptiveOPoint(angle, 156);
    const inner = adaptiveOPoint(angle, 68);
    const radians = angle * Math.PI / 180;
    const tangent = { x: -Math.sin(radians), y: Math.cos(radians) };
    const bend = 45;
    return {
      outer,
      inner,
      c1: { x: outer.x + tangent.x * bend, y: outer.y + tangent.y * bend },
      c2: { x: inner.x + tangent.x * bend, y: inner.y + tangent.y * bend }
    };
  }

  function adaptiveOSegmentPath(start, percentage = 100) {
    const span = Math.max(0, Math.min(120, 120 * percentage / 100));
    if (span <= 0) return "";
    const from = adaptiveOCut(start);
    const to = adaptiveOCut(start + span);
    const n = value => Number(value.toFixed(2));
    return [
      "M", n(from.outer.x), n(from.outer.y),
      "A 156 156 0 0 1", n(to.outer.x), n(to.outer.y),
      "C", n(to.c1.x), n(to.c1.y), n(to.c2.x), n(to.c2.y), n(to.inner.x), n(to.inner.y),
      "A 68 68 0 0 0", n(from.inner.x), n(from.inner.y),
      "C", n(from.c2.x), n(from.c2.y), n(from.c1.x), n(from.c1.y), n(from.outer.x), n(from.outer.y), "Z"
    ].join(" ");
  }

  function adaptiveOGlossPath(start, percentage = 100) {
    const span = Math.max(0, Math.min(120, 120 * percentage / 100));
    if (span <= 18) return "";
    const visible = Math.min(span - 18, 72);
    const from = adaptiveOPoint(start + 9, 116);
    const to = adaptiveOPoint(start + 9 + visible, 116);
    return "M " + from.x.toFixed(2) + " " + from.y.toFixed(2) + " A 116 116 0 0 1 " + to.x.toFixed(2) + " " + to.y.toFixed(2);
  }

  function organizationSections() {
    return state.profile.status === "expecting" ? prenatalOrganizationSections : postpartumOrganizationSections;
  }

  function organizationProgress(section) {
    const done = section.tasks.filter(task => state.checks[task[0]]).length;
    return { done, total: section.tasks.length, percentage: section.tasks.length ? Math.round(done / section.tasks.length * 100) : 0 };
  }

  function renderAdaptiveOHome() {
    const wellbeing = state.v5.circleMode !== "organize";
    const role = "mother";
    const sections = wellbeing ? adaptiveOSections : organizationSections();
    const progress = Object.fromEntries(sections.map(section => [section.id, wellbeing ? adaptiveOProgress(section.id, role) : organizationProgress(section)]));
    const completedSteps = sections.reduce((sum, section) => sum + progress[section.id].done, 0);
    const firstOpenSection = sections.find(section => progress[section.id].done < progress[section.id].total) || sections[0];
    const expecting = state.profile.status === "expecting";
    const centerButton = wellbeing
      ? expecting
        ? "<button class='v5-o-record' type='button' data-v5-o-section='care' aria-label='Otvoriť dnešný krok pohody'><span aria-hidden='true'>＋</span><strong>Môj krok</strong></button>"
        : "<button class='v5-o-record' type='button' data-v5-open-record aria-label='Otvoriť rýchly záznam'><span aria-hidden='true'>＋</span><strong>Zaznamenať</strong></button>"
      : "<button class='v5-o-record v5-o-next-task' type='button' data-v5-org-section='" + firstOpenSection.id + "' aria-label='Otvoriť ďalšiu organizačnú úlohu'><span aria-hidden='true'>→</span><strong>Ďalšia úloha</strong></button>";
    return [
      "<section class='v5-o-card' aria-label='Denné ciele'>",
      "<div class='v5-circle-switch' role='group' aria-label='Režim kruhu'><button type='button' data-v5-circle-mode='wellbeing' aria-label='Pohoda' title='Pohoda' aria-pressed='", String(wellbeing), "' class='", wellbeing ? "active" : "", "'><span aria-hidden='true'>♡</span></button><button type='button' data-v5-circle-mode='organize' aria-label='Organizácia' title='Organizácia' aria-pressed='", String(!wellbeing), "' class='", !wellbeing ? "active" : "", "'><span aria-hidden='true'>✓</span></button></div>",
      "<div class='v5-o-layout'><div class='v5-o-ring-wrap'>",
      "<svg class='v5-o-ring' viewBox='0 0 420 420' role='group' aria-label='Tri oblasti denných cieľov'>",
      "<defs>",
      "<linearGradient id='v5OPink' x1='210' y1='54' x2='345' y2='288' gradientUnits='userSpaceOnUse'><stop offset='0' stop-color='#f9d5df'/><stop offset='.30' stop-color='#f3bdcd'/><stop offset='.72' stop-color='#eca5ba'/><stop offset='1' stop-color='#df91aa'/></linearGradient>",
      "<linearGradient id='v5OLilac' x1='345' y1='288' x2='75' y2='288' gradientUnits='userSpaceOnUse'><stop offset='0' stop-color='#efd8eb'/><stop offset='.32' stop-color='#dfc2df'/><stop offset='.72' stop-color='#cfabd4'/><stop offset='1' stop-color='#bd96c6'/></linearGradient>",
      "<linearGradient id='v5OPurple' x1='75' y1='288' x2='210' y2='54' gradientUnits='userSpaceOnUse'><stop offset='0' stop-color='#ddd3f4'/><stop offset='.30' stop-color='#c7b7eb'/><stop offset='.72' stop-color='#ad99df'/><stop offset='1' stop-color='#967ed0'/></linearGradient>",
      "<radialGradient id='v5ONeutral' cx='210' cy='190' r='190' gradientUnits='userSpaceOnUse'><stop offset='.42' stop-color='#e4dfe8'/><stop offset='.55' stop-color='#fff'/><stop offset='.78' stop-color='#f4f0f6'/><stop offset='1' stop-color='#d9d3dd'/></radialGradient>",
      "<filter id='v5ODepth' x='-40%' y='-40%' width='180%' height='180%'><feGaussianBlur in='SourceAlpha' stdDeviation='6' result='alpha'/><feOffset in='alpha' dx='1' dy='9' result='offset'/><feFlood flood-color='#684a78' flood-opacity='.10' result='shadowColour'/><feComposite in='shadowColour' in2='offset' operator='in' result='shadow'/><feSpecularLighting in='alpha' surfaceScale='4' specularConstant='.10' specularExponent='22' lighting-color='#fff9fc' result='light'><fePointLight x='125' y='25' z='175'/></feSpecularLighting><feComposite in='light' in2='SourceAlpha' operator='in' result='clippedLight'/><feMerge><feMergeNode in='shadow'/><feMergeNode in='SourceGraphic'/><feMergeNode in='clippedLight'/></feMerge></filter>",
      "</defs>",
      "<circle class='v5-o-empty-ring' cx='210' cy='210' r='112'/><circle class='v5-o-outline' cx='210' cy='210' r='156'/><circle class='v5-o-outline v5-o-outline-inner' cx='210' cy='210' r='68'/>",
      sections.map((section, index) => {
        const value = progress[section.id];
        const visualPercentage = value.percentage;
        return [
          "<path class='v5-o-sector-base v5-o-sector-base-", index + 1, " v5-o-clickable' d='", adaptiveOSegmentPath(section.start), "' role='button' tabindex='0' ", wellbeing ? "data-v5-o-section" : "data-v5-org-section", "='", section.id,
          "' aria-label='", escapeHtml(section.label + ": " + value.percentage + " percent. Otvoriť."), "'/>",
          value.percentage > 0 ? "<path class='v5-o-value-shape v5-o-value-" + (index + 1) + "' d='" + adaptiveOSegmentPath(section.start, visualPercentage) + "' aria-hidden='true'/>" : "",
          value.percentage > 0 ? "<path class='v5-o-gloss' d='" + adaptiveOGlossPath(section.start, visualPercentage) + "' aria-hidden='true'/>" : ""
        ].join("");
      }).join(""),
      "</svg>",
      centerButton,
      completedSteps ? "<span class='v5-o-celebration' aria-hidden='true'>✦</span>" : "",
      "</div><div class='v5-o-legend'>",
      sections.map(section => {
        const value = progress[section.id];
        return [
          "<button class='v5-o-legend-item v5-o-", section.id, "' type='button' ", wellbeing ? "data-v5-o-section" : "data-v5-org-section", "='", section.id, "'>",
          "<span class='v5-o-dot' aria-hidden='true'></span><span><strong>", escapeHtml(section.shortLabel), "</strong><small>", wellbeing ? escapeHtml(section.period) + " · " : "", value.done, " z ", value.total, "</small></span><b aria-label='", value.done, " z ", value.total, "'>", value.done ? value.done + "/" + value.total : "›", "</b></button>"
        ].join("");
      }).join(""),
      "</div></div></section>"
    ].join("");
  }

  function renderAdaptiveO() {
    const target = byId("v5AdaptiveOContent");
    if (!target) return;
    const role = state.v5.adaptiveO.role;
    const section = adaptiveOSections.find(item => item.id === state.v5.adaptiveO.section) || adaptiveOSections[0];
    const progress = adaptiveOProgress(section.id, role);
    const selectedIds = adaptiveOSelectedGoalIds(role, section.id);
    const goals = [...adaptiveOGoals[section.id]];
    const editing = Boolean(state.v5.adaptiveO.editing);
    const visibleGoals = editing ? goals : goals.filter(goal => selectedIds.includes(goal.id));
    target.innerHTML = [
      "<section class='v5-o-simple-head v5-o-", section.id, "'><span class='v5-o-simple-icon'>", icon(section.icon), "</span><div><small>", escapeHtml(section.period), "</small><h1>", escapeHtml(section.label), "</h1></div><strong>", progress.done, "/", progress.total, "</strong></section>",
      "<div class='v5-o-role-switch' role='group' aria-label='Ciele pre používateľa'>",
      ["mother", "partner"].map(value => "<button type='button' data-v5-o-role='" + value + "' aria-pressed='" + String(role === value) + "' class='" + (role === value ? "active" : "") + "'>" + (value === "mother" ? "Mama" : "Partner") + "</button>").join(""),
      "</div>",
      "<div class='v5-o-simple-toolbar'><h2>", editing ? "Vyberte aplikácie" : "Moje aplikácie", "</h2><button type='button' data-v5-o-edit>", editing ? "Hotovo" : "Upraviť", "</button></div>",
      "<div class='v5-o-app-grid", editing ? " is-editing" : "", "'>",
      visibleGoals.map(goal => {
        const tracked = selectedIds.includes(goal.id);
        const done = tracked && adaptiveOGoalDone(role, section.id, goal);
        const feature = features[goal.feature];
        if (editing) return [
          "<button class='v5-o-app v5-o-app-select", tracked ? " is-selected" : "", "' type='button' data-v5-o-track='", goal.id,
          "' aria-pressed='", String(tracked), "'><span class='v5-o-app-check' aria-hidden='true'>", tracked ? "✓" : "+", "</span><span class='v5-icon'>", icon(goal.icon), "</span><strong>", escapeHtml(goal.title), "</strong></button>"
        ].join("");
        return [
          "<div class='v5-o-app-wrap", done ? " is-done" : "", "'>",
          "<button class='v5-o-app' type='button' data-v5-o-open='", goal.id, "' aria-label='Otvoriť ", escapeHtml(feature?.label || goal.title), "'><span class='v5-icon'>", icon(goal.icon), "</span><strong>", escapeHtml(goal.title), "</strong></button>",
          goal.auto
            ? "<span class='v5-o-app-status" + (done ? " is-done" : "") + "' aria-label='" + (done ? "Hotovo" : "Zatiaľ nezaznamenané") + "'>" + (done ? "✓" : "") + "</span>"
            : "<button class='v5-o-app-status v5-o-app-complete" + (done ? " is-done" : "") + "' type='button' data-v5-o-complete='" + goal.id + "' aria-pressed='" + String(done) + "' aria-label='" + (done ? "Označiť ako nesplnené" : "Označiť ako hotové") + "'>" + (done ? "✓" : "") + "</button>",
          "</div>"
        ].join("");
      }).join(""),
      visibleGoals.length ? "" : "<button class='v5-o-empty-apps' type='button' data-v5-o-edit>Vybrať aplikácie</button>",
      "</div>"
    ].join("");
  }

  function openAdaptiveO(sectionId) {
    openAdaptiveOMenu(sectionId);
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
    const latestGrowth = (state.growth || []).slice().sort((a, b) => new Date(b.date || b.created || 0) - new Date(a.date || a.created || 0))[0] || {};
    const metricLabel = (value, unit) => {
      const text = String(value || "").trim();
      if (!text) return "—";
      if (/[a-zA-Z]/.test(text)) return text;
      if (unit === "kg" && Number(text.replace(",", ".")) > 50) return text + " g";
      return text + " " + unit;
    };
    const currentHeight = metricLabel(latestGrowth.height || state.profile.currentHeight, "cm");
    const currentWeight = metricLabel(latestGrowth.weight || state.profile.currentWeight, "kg");
    const nextReminder = state.reminders
      .filter(item => new Date(item.date).getTime() >= Date.now())
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    const today = todayKey();
    const todayMemory = state.diary.find(item => (item.date || String(item.created || "").slice(0, 10)) === today);
    const momentCard = {
      text: todayMemory ? "Dnešný moment je uložený. Môžete si ho pozrieť alebo pridať ďalší." : "Pridajte jednu fotku alebo krátku vetu."
    };
    const phaseLine = "";
    const pregnancyAvatar = window.GugubooPregnancyAvatar?.current?.() || { week: null, label: "mango", position: "0% 100%" };
    const babyAvatar = expecting
      ? [
          "<button class='v5-baby-avatar v5-fruit-avatar' type='button' data-v5-pregnancy-avatar aria-expanded='false' aria-controls='v5AvatarPopover' aria-label='Pozrieť veľkosť bábätka' style='background-position:", pregnancyAvatar.position, "'><span class='v5-sr-only'>Ovocný avatar</span></button>"
        ].join("")
      : state.profile.photo
        ? "<button class='v5-baby-avatar v5-photo-avatar' type='button' data-v5-child-avatar aria-label='Otvoriť fotografiu a profil dieťaťa'><img src='" + escapeHtml(state.profile.photo) + "' alt='Fotografia dieťaťa'></button>"
        : "<button class='v5-baby-avatar v5-empty-avatar' type='button' data-v5-child-avatar aria-label='Nahrať fotografiu dieťaťa'>" + icon("baby") + "<span class='v5-sr-only'>Nahrať fotografiu</span></button>";
    const avatarPopover = expecting ? [
      "<div class='v5-avatar-popover' id='v5AvatarPopover' hidden>",
      "<span class='v5-avatar-popover-photo v5-fruit-avatar' role='img' aria-label='", escapeHtml(pregnancyAvatar.label), "' style='background-position:", pregnancyAvatar.position, "'></span>",
      "<div><small>", pregnancyAvatar.week ? escapeHtml(pregnancyAvatar.week + ". týždeň") : "Ovocný avatar", "</small><strong>", escapeHtml(name), " je veľký približne ako ", escapeHtml(pregnancyAvatar.label), ".</strong>",
      "<button type='button' data-v5-feature='pregnancy'>Pozrieť rast bábätka <span aria-hidden='true'>→</span></button></div></div>"
    ].join("") : "";
    const pregnancyWeek = Number(pregnancyAvatar.week || 0);
    const dueDateLabel = state.profile.due
      ? new Date(state.profile.due + "T12:00:00").toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" })
      : "Doplniť termín";
    const statusCards = expecting ? [
      ["Týždeň", pregnancyWeek ? pregnancyWeek + ". týždeň" : "Doplniť termín", "pregnancy"],
      ["Termín pôrodu", dueDateLabel, "pregnancy"],
      ["Tehotenská knižka", "Otvoriť", "pregnancy"]
    ] : [
      ["Spánok", state.sleepTimer?.active ? "Beží od " + formatClock(state.sleepTimer.start) : sleep ? formatClock(sleep.created) + " · " + (sleep.value || "uložené") : "Bez záznamu"],
      ["Kŕmenie", state.v5.feedingTimer.active ? "Prebieha" : feeding ? formatClock(feeding.created) + " · " + (feeding.value || "uložené") : "Bez záznamu"],
      ["Prebalenie", diaper ? formatClock(diaper.created) + " · " + (diaper.value || "uložené") : "Bez záznamu"],
      ["Výška", currentHeight],
      ["Váha", currentWeight],
      ["Vek", age?.label || "—"]
    ];
    const recommendation = expecting
      ? "Pripravte dnes jednu vec do pôrodnice."
      : state.sleepTimer?.active
        ? "Spánok práve prebieha."
        : "Dnešný malý moment";
    const recommendationAction = expecting ? "hospital" : state.sleepTimer?.active ? "sleep" : "memories";
    const recommendationLabel = expecting ? "Otvoriť checklist Taška do pôrodnice" : state.sleepTimer?.active ? "Otvoriť prebiehajúci spánok" : momentCard.text;
    const calendarCard = [
      "<button class='v5-row-card' type='button' data-v5-feature='calendar'><span class='v5-icon'>", icon("calendar"),
      "</span><div><strong>", nextReminder ? escapeHtml(nextReminder.title) : "Najbližšia udalosť",
      "</strong><span>", nextReminder ? escapeHtml(new Date(nextReminder.date).toLocaleString("sk-SK", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })) : "Pridať do kalendára",
      "</span></div><span class='v5-row-arrow'>›</span></button>"
    ].join("");
    // V2: namiesto jednej pevnej karty „Dnes“ ukáže Journey Engine TERAZ / ČOSKORO (max 3 + 2).
    const journeyHtml = window.GugubooV2?.homeJourneyHtml?.() || "";
    const homeTail = [
      journeyHtml || "<button class='v5-today-card' type='button' data-v5-today-action='" + recommendationAction + "' aria-label='" + escapeHtml(recommendation + " " + recommendationLabel) + "'><span class='v5-icon'>" + icon(expecting ? "checklist" : state.sleepTimer?.active ? "moon" : "memory") + "</span><div><small>Dnes</small><strong>" + escapeHtml(recommendation) + "</strong><span class='v5-today-hint'>" + escapeHtml(recommendationLabel) + "</span></div><span class='v5-row-arrow' aria-hidden='true'>›</span></button>",
      calendarCard,
      window.GugubooV2?.betaFooterHtml?.() || ""
    ].join("");
    target.innerHTML = [
      "<section class='v5-home-hero'><div class='v5-home-person'>", babyAvatar, "<div><h1>", escapeHtml(name), "</h1>", phaseLine ? "<p>" + phaseLine + "</p>" : "", "</div><button class='v5-mini-profile' type='button' data-v5-feature='profiles' aria-label='Otvoriť profil'>",
      icon("user"), "</button></div>", avatarPopover, "<div class='v5-glance-strip'>",
      statusCards.slice(0, 6).map((item, index) => expecting
        ? "<button class='v5-glance v5-glance-action v5-prenatal-glance' type='button' data-v5-prenatal-glance='" + escapeHtml(item[2]) + "' aria-label='Otvoriť " + escapeHtml(item[0]) + "'><span>" + escapeHtml(item[0]) + "</span><strong>" + escapeHtml(item[1]) + "</strong></button>"
        : index < 3
          ? "<button class='v5-glance v5-glance-action' type='button' data-v5-quick-feature='" + ["sleep", "feeding", "diaper"][index] + "' aria-label='Otvoriť " + escapeHtml(item[0]) + "'><span>" + escapeHtml(item[0]) + "</span><strong>" + escapeHtml(item[1]) + "</strong></button>"
          : index < 5
            ? "<button class='v5-glance v5-glance-action v5-glance-growth' type='button' data-v5-growth-open='" + ["height", "weight"][index - 3] + "' aria-label='Zapísať " + escapeHtml(item[0].toLowerCase()) + "'><span>" + escapeHtml(item[0]) + "</span><strong>" + escapeHtml(item[1]) + "</strong></button>"
            : "<button class='v5-glance v5-glance-action v5-glance-age' type='button' data-v5-feature='profiles' aria-label='Otvoriť profil dieťaťa'><span>" + escapeHtml(item[0]) + "</span><strong>" + escapeHtml(item[1]) + "</strong></button>").join(""),
      "</div>",
      "</section>",
      renderAdaptiveOHome(),
      homeTail
    ].join("");
  }

  function tierText(tier) {
    return tier === "free" ? "Free" : tier === "addon" ? "Doplnok" : "Premium";
  }

  function renderFavoriteEditor() {
    return [
      "<details class='v5-drawer-group v2-favorite-editor' id='v5FavoriteEditor'><summary><span class='v5-icon'>" + icon("pin") + "</span><span><strong>Upraviť spodné menu</strong><small>Vyber, ktoré 4 aplikácie chceš mať vždy po ruke</small></span></summary>",
      "<p class='v2-favorite-hint'>Pozície 1–2 sú vľavo od GuguChatu, 3–4 vpravo. Poradie zmeníš aj potiahnutím.</p>",
      "<div class='v5-favorite-list'>",
      state.v5.favorites.map((key, index) => {
        const options = favoriteOptions(state.profile.status || "expecting").map(option => "<option value='" + option + "'" + (option === key ? " selected" : "") + ">" + escapeHtml(features[option].label) + "</option>").join("");
        return [
          "<div class='v5-favorite-item' draggable='true' data-v5-favorite-index='", index, "'>",
          "<span class='v5-drag-handle' aria-hidden='true'>↕</span><strong>", index + 1, ". ", escapeHtml(features[key].label),
          "</strong><select aria-label='Pozícia ", index + 1, " v spodnom menu' data-v5-favorite-select='", index, "'>", options, "</select></div>"
        ].join("");
      }).join(""),
      "</div></details>"
    ].join("");
  }

  function drawerApp(key, priority) {
    const feature = features[key];
    const pinned = state.v5.favorites.includes(key);
    return [
      "<div class='v5-drawer-app-wrap", priority ? " is-priority" : "", "'>",
      "<button class='v5-drawer-app' type='button' data-v5-feature='", key, "'>",
      "<span class='v5-icon'>", icon(feature.icon), "</span><strong>", escapeHtml(feature.label), "</strong></button>",
      "<button class='v5-drawer-pin", pinned ? " active" : "", "' type='button' data-v5-pin-feature='", key,
      "' aria-pressed='", String(pinned), "' aria-label='", pinned ? "Pripnuté v spodnom menu: " : "Pripnúť do spodného menu: ", escapeHtml(feature.label), "'>",
      icon("pin"), "</button></div>"
    ].join("");
  }

  function renderDrawer() {
    const scroll = byId("v5DrawerScroll");
    if (!scroll) return;
    ensureFavoritePhase();
    if (state.profile.status !== "expecting") {
      scroll.innerHTML = [
        "<button class='v5-drawer-emotional-card' type='button' data-v5-feature='memories'><span class='v5-icon'>", icon("memory"), "</span><span><small>Spoločný príbeh</small><strong>Naše chvíle</strong><em>Dnešný moment · prvé razy · 100 dní a prvý rok</em></span><span class='v5-row-arrow' aria-hidden='true'>›</span></button>",
        "<div class='v5-drawer-grid v5-drawer-flat'>",
        postpartumDrawerFeatures.map((key, index) => drawerApp(key, index === 0)).join(""),
        "</div>",
        renderFavoriteEditor()
      ].join("");
      return;
    }
    scroll.innerHTML = [
      "<div class='v5-drawer-grid v5-drawer-flat v5-prenatal-drawer-grid'>",
      prenatalDrawerFeatures.map((key, index) => drawerApp(key, index === 0)).join(""),
      "</div>",
      renderFavoriteEditor()
    ].join("");
  }

  function openQuickRecord() {
    const overlay = byId("v5QuickRecordOverlay");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    byId("v5BottomBar")?.classList.add("v5-hidden-for-modal");
    document.body.style.overflow = "hidden";
    setTimeout(() => overlay.querySelector("[data-v5-close-record]")?.focus(), 40);
  }

  function closeQuickRecord() {
    const overlay = byId("v5QuickRecordOverlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    byId("v5BottomBar")?.classList.remove("v5-hidden-for-modal");
    if (!byId("v5DrawerOverlay")?.classList.contains("open")) document.body.style.overflow = "";
  }

  function renderAdaptiveOMenu() {
    const section = adaptiveOSections.find(item => item.id === state.v5.adaptiveO.section) || adaptiveOSections[0];
    const body = byId("v5OMenuBody");
    const title = byId("v5OMenuTitle");
    const subtitle = byId("v5OMenuSubtitle");
    const back = byId("v5OMenuBack");
    if (!body || !title || !subtitle || !back) return;
    title.textContent = section.label;
    const progress = adaptiveOProgress(section.id, "mother");
    const goals = adaptiveOGoals[section.id] || [];
    subtitle.textContent = progress.done ? "Dnes " + progress.done + " z " + progress.total : "Vyberte jeden malý krok";
    back.hidden = true;
    body.innerHTML = "<p class='v5-o-summary-copy'>" + escapeHtml(section.description) + "</p><div class='v5-quick-record-grid v5-o-status-grid" + (goals.length === 2 ? " is-two" : "") + "' id='v5OMenuGrid'>" + goals.map(goal => {
      const done = adaptiveOGoalDone("mother", section.id, goal);
      return [
        "<button class='v5-quick-tile v5-o-day-row", done ? " is-done" : "", "' type='button' data-v5-o-complete='", goal.id, "' aria-pressed='", String(done), "'>",
        "<span class='v5-icon'>", icon(goal.icon), "</span><strong>", escapeHtml(goal.title), "</strong><small>", done ? "Dnes hotovo" : goal.id === "ask-help" ? "Vybrať pomoc" : "Jedným kliknutím", "</small><b aria-hidden='true'>", done ? "✓" : "＋", "</b></button>"
      ].join("");
    }).join("") + "</div>";
  }

  function renderOrganizationMenu(sectionId) {
    const section = organizationSections().find(item => item.id === sectionId) || organizationSections()[0];
    const progress = organizationProgress(section);
    const nextTask = section.tasks.find(task => !state.checks[task[0]]);
    const completed = section.tasks.filter(task => state.checks[task[0]]);
    state.v5.organizationSection = section.id;
    state.v5.adaptiveO.modalSource = "organization";
    persist();
    byId("v5OMenuTitle").textContent = section.label;
    byId("v5OMenuSubtitle").textContent = progress.done + " z " + progress.total + " hotové";
    byId("v5OMenuBack").hidden = false;
    byId("v5OMenuBody").innerHTML = nextTask ? [
      "<div class='v5-org-progress'><span style='--progress:", progress.percentage, "%'></span></div>",
      "<div class='v5-org-next-card'><small>Ďalšia úloha</small><span class='v5-icon'>", icon(nextTask[2]), "</span><h3>", escapeHtml(nextTask[1]), "</h3>",
      "<button class='v5-primary' type='button' data-v5-org-complete='", nextTask[0], "'>Označiť ako hotové</button></div>",
      completed.length ? "<details class='v5-org-completed'><summary>Hotové · " + completed.length + "</summary>" + completed.map(task => "<div><span>✓</span>" + escapeHtml(task[1]) + "</div>").join("") + "</details>" : ""
    ].join("") : "<div class='v5-o-modal-confirm'><span>✓</span><h3>Táto časť je hotová</h3><p>Môžete pokračovať v ďalšom segmente kruhu.</p><button class='v5-primary' type='button' data-v5-o-back>Späť ku kruhu</button></div>";
  }

  function openOrganizationMenu(sectionId) {
    closeDrawer();
    closeQuickRecord();
    renderOrganizationMenu(sectionId);
    const overlay = byId("v5OOverlay");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    byId("v5BottomBar")?.classList.add("v5-hidden-for-modal");
    document.body.style.overflow = "hidden";
    setTimeout(() => overlay.querySelector("[data-v5-org-complete], [data-v5-o-back]")?.focus(), 40);
  }

  function renderPartnerRequestMenu() {
    byId("v5OMenuTitle").textContent = "Požiadať o pomoc";
    byId("v5OMenuSubtitle").textContent = "Čo teraz najviac pomôže?";
    byId("v5OMenuBack").hidden = false;
    byId("v5OMenuBody").innerHTML = "<div class='v5-o-feature-choices v5-o-request-grid'>" + [
      ["Prevezmi dieťa na 20 minút", "baby"],
      ["Prosím, prines mi vodu", "water"],
      ["Prosím, zabezpeč jedlo", "meal"],
      ["Choď, prosím, s kočíkom", "family"]
    ].map(item => "<button class='v5-quick-tile' type='button' data-v5-partner-request='" + escapeHtml(item[0]) + "'><span class='v5-icon'>" + icon(item[1]) + "</span><strong>" + escapeHtml(item[0]) + "</strong></button>").join("") + "</div>";
  }

  function savePartnerRequest(request) {
    if (!request) return;
    state.v5.partnerRequests ||= [];
    state.familyTasks ||= [];
    const created = new Date().toISOString();
    state.v5.partnerRequests.push({ id: createId(), request, status: "new", created });
    state.familyTasks.push({ task: request, assignee: "partner", when: "čo najskôr", details: "Prosba mamy z denného kruhu.", created });
    const goal = adaptiveOGoals.health.find(item => item.id === "ask-help");
    state.v5.adaptiveO.completed[adaptiveOCompletionKey("mother", "health", goal)] = true;
    persist();
    completeAdaptiveOModal("Prosba je uložená.", "Partner ju nájde medzi rodinnými úlohami.");
    announce("Prosba o pomoc bola uložená pre partnera.");
  }

  function adaptiveOQuickChoices(goal) {
    const choices = {
      "age-activity": [["Bruško", "baby"], ["Dosahovanie", "activity"], ["Zrkadlo", "sparkle"], ["Hlas", "family"]],
      "fresh-air": [["10 minút", "weather"], ["20 minút", "weather"], ["30 minút", "weather"], ["Prechádzka", "baby"]]
    };
    return choices[goal.id] || [];
  }

  function renderAdaptiveOFeature(goalId) {
    const section = adaptiveOSections.find(item => item.id === state.v5.adaptiveO.section) || adaptiveOSections[0];
    const goal = (adaptiveOGoals[section.id] || []).find(item => item.id === goalId);
    const body = byId("v5OMenuBody");
    const title = byId("v5OMenuTitle");
    const subtitle = byId("v5OMenuSubtitle");
    const back = byId("v5OMenuBack");
    if (!goal || !body || !title || !subtitle || !back) return;
    state.v5.adaptiveO.modalGoal = goal.id;
    title.textContent = goal.title;
    subtitle.textContent = "Jeden malý krok.";
    back.hidden = false;

    if (["pee", "poop"].includes(goal.id)) {
      const isPee = goal.id === "pee";
      state.v5.flow = {
        type: "diaper",
        step: 1,
        data: { diaper: isPee ? "wet" : "dirty", diaperLabel: isPee ? "Cikalo" : "Kakalo" },
        context: "adaptive-o"
      };
      persist();
      body.innerHTML = "<div class='v5-flow v5-o-feature-flow' id='v5OFeatureContent'></div>";
      renderFlow();
      return;
    }

    if (goal.id === "wake") {
      const sleeping = Boolean(state.sleepTimer?.active);
      body.innerHTML = "<div class='v5-o-single-action'><span class='v5-icon'>" + icon("sparkle") + "</span><h3>" + (sleeping ? "Dieťa sa zobudilo?" : "Zaznamenať zobudenie") + "</h3><button class='v5-primary' type='button' data-v5-o-save='wake'>" + (sleeping ? "Ukončiť spánok" : "Uložiť zobudenie") + "</button></div>";
      return;
    }

    if (goal.id === "moment") {
      body.innerHTML = "<div class='v5-o-compact-form'><label>Dnešný moment<textarea id='v5OMomentText' placeholder='Jedna krátka veta'></textarea></label><button class='v5-primary' type='button' data-v5-o-save='moment'>Uložiť moment</button></div>";
      return;
    }

    const feature = features[goal.feature];
    if (feature?.flow) {
      state.v5.flow = { type: feature.flow, step: 0, data: {}, context: "adaptive-o" };
      persist();
      body.innerHTML = "<div class='v5-flow v5-o-feature-flow' id='v5OFeatureContent'></div>";
      renderFlow();
      return;
    }

    const quickChoices = adaptiveOQuickChoices(goal);
    if (quickChoices.length) {
      body.innerHTML = "<div class='v5-o-feature-choices'>" + quickChoices.map(item =>
        "<button class='v5-quick-tile' type='button' data-v5-o-quick='" + escapeHtml(item[0]) + "'><span class='v5-icon'>" + icon(item[1]) + "</span><strong>" + escapeHtml(item[0]) + "</strong></button>"
      ).join("") + "</div>";
      return;
    }

    body.innerHTML = "<div class='v5-empty'>Táto funkcia sa pripravuje.</div>";
  }

  function completeAdaptiveOModal(title, copy = "Uložené v dnešnom prehľade.") {
    const body = byId("v5OMenuBody");
    const subtitle = byId("v5OMenuSubtitle");
    if (!body) return;
    if (subtitle) subtitle.textContent = "Hotovo";
    body.innerHTML = "<div class='v5-o-modal-confirm'><span>✓</span><h3>" + escapeHtml(title) + "</h3><p>" + escapeHtml(copy) + "</p><div><button class='v5-secondary' type='button' data-v5-o-back>Ďalší krok</button><button class='v5-primary' type='button' data-v5-close-o>Hotovo</button></div></div>";
    renderHome();
  }

  function saveAdaptiveOFeature(action) {
    if (action === "wake") {
      if (state.sleepTimer?.active) stopSleep();
      state.events.push({ id: createId(), type: "Prebudenie", value: "Zobudenie", note: "", author: "rodina", created: new Date().toISOString() });
      persist();
      return completeAdaptiveOModal("Zobudenie je uložené.");
    }
    if (action === "moment") {
      const text = byId("v5OMomentText")?.value.trim() || "";
      if (!text) return announce("Napíšte jednu krátku vetu.");
      state.diary.push({ id: createId(), date: todayKey(), text, created: new Date().toISOString() });
      persist();
      return completeAdaptiveOModal("Dnešný moment je uložený.");
    }
  }

  function openAdaptiveOMenu(sectionId) {
    if (adaptiveOSections.some(section => section.id === sectionId)) state.v5.adaptiveO.section = sectionId;
    state.v5.adaptiveO.role = "mother";
    state.v5.adaptiveO.modalSource = "circle";
    state.v5.adaptiveO.modalParent = "";
    state.v5.adaptiveO.editing = false;
    persist();
    renderAdaptiveOMenu();
    const overlay = byId("v5OOverlay");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    byId("v5BottomBar")?.classList.add("v5-hidden-for-modal");
    document.body.style.overflow = "hidden";
    setTimeout(() => overlay.querySelector("[data-v5-close-o]")?.focus(), 40);
  }

  function openQuickFeatureModal(key) {
    const feature = features[key];
    if (!feature?.flow) return openFeature(key);
    closeQuickRecord();
    state.v5.adaptiveO.modalSource = "quick";
    state.v5.adaptiveO.modalParent = "";
    state.v5.flow = { type: feature.flow, step: 0, data: {}, context: "adaptive-o" };
    persist();
    byId("v5OMenuTitle").textContent = feature.label;
    byId("v5OMenuSubtitle").textContent = "Rýchly záznam";
    byId("v5OMenuBack").hidden = false;
    byId("v5OMenuBody").innerHTML = "<div class='v5-flow v5-o-feature-flow' id='v5OFeatureContent'></div>";
    const overlay = byId("v5OOverlay");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    byId("v5BottomBar")?.classList.add("v5-hidden-for-modal");
    document.body.style.overflow = "hidden";
    renderFlow();
  }

  function calendarInputValue(value = new Date(Date.now() + 60 * 60 * 1000)) {
    const date = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(date.getTime())) return "";
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }

  function openCalendarModal() {
    closeDrawer();
    closeQuickRecord();
    closeAdaptiveOMenu();
    state.v5.adaptiveO.modalSource = "calendar";
    state.v5.adaptiveO.modalParent = "";
    persist();
    const upcoming = state.reminders
      .filter(item => !item.completedAt && new Date(item.date).getTime() >= Date.now())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
    byId("v5OMenuTitle").textContent = "Kalendár";
    byId("v5OMenuSubtitle").textContent = upcoming.length ? "Najbližšie udalosti" : "Nová udalosť a pripomienka";
    byId("v5OMenuBack").hidden = true;
    byId("v5OMenuBody").innerHTML = [
      upcoming.length ? "<div class='v5-calendar-upcoming'>" + upcoming.map(item =>
        "<div><span class='v5-icon'>" + icon("calendar") + "</span><span><strong>" + escapeHtml(item.title) + "</strong><small>" + escapeHtml(new Date(item.date).toLocaleString("sk-SK", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })) + (item.sharedWithPartner ? " · Partner" : "") + "</small></span><span class='v5-calendar-item-actions'><button type='button' data-v5-calendar-done='" + escapeHtml(item.id) + "' aria-label='Označiť ako vybavené'>✓</button><button type='button' data-v5-calendar-delete='" + escapeHtml(item.id) + "' aria-label='Vymazať udalosť'>×</button></span></div>"
      ).join("") + "</div>" : "",
      "<div class='v5-o-compact-form v5-calendar-form'>",
      "<label>Názov<input id='v5CalendarTitle' type='text' maxlength='80' placeholder='Napr. pediater'></label>",
      "<label>Dátum a čas<input id='v5CalendarDate' type='datetime-local' value='", calendarInputValue(), "'></label>",
      "<label>Pripomenúť<select id='v5CalendarAlert'><option value='at-time'>V čase udalosti</option><option value='30-min'>30 minút vopred</option><option value='1-day'>Deň vopred</option></select></label>",
      "<label class='v5-calendar-share'><input id='v5CalendarSharePartner' type='checkbox'><span>", icon("family"), "</span><span><strong>Zdieľať s partnerom</strong><small>Udalosť uvidí aj v spoločnom kalendári.</small></span></label>",
      "<button class='v5-primary' type='button' data-v5-calendar-save>Uložiť udalosť</button></div>"
    ].join("");
    const overlay = byId("v5OOverlay");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    byId("v5BottomBar")?.classList.add("v5-hidden-for-modal");
    document.body.style.overflow = "hidden";
    setTimeout(() => byId("v5CalendarTitle")?.focus(), 40);
  }

  function saveCalendarEvent() {
    const title = byId("v5CalendarTitle")?.value.trim() || "";
    const date = byId("v5CalendarDate")?.value || "";
    if (!title || !date || !Number.isFinite(new Date(date).getTime())) return announce("Doplňte názov a dátum udalosti.");
    const sharedWithPartner = Boolean(byId("v5CalendarSharePartner")?.checked);
    state.reminders.push({
      id: createId(),
      title,
      date,
      type: "Rodina",
      alert: byId("v5CalendarAlert")?.value || "at-time",
      sharedWithPartner,
      created: new Date().toISOString()
    });
    persist();
    completeAdaptiveOModal("Udalosť je uložená.", sharedWithPartner ? "Zobrazí sa aj partnerovi v spoločnom kalendári." : "Pripomenieme ju v zvolenom čase.");
    announce("Udalosť bola uložená.");
  }

  function updateCalendarEvent(id, remove = false) {
    const item = state.reminders.find(reminder => String(reminder.id) === String(id));
    if (!item) return;
    if (remove) state.reminders = state.reminders.filter(reminder => String(reminder.id) !== String(id));
    else item.completedAt = new Date().toISOString();
    persist();
    renderHome();
    openCalendarModal();
    announce(remove ? "Udalosť bola vymazaná." : "Udalosť je označená ako vybavená.");
  }

  function openGrowthModal(metric = "weight") {
    closeDrawer();
    closeQuickRecord();
    closeAdaptiveOMenu();
    const latestGrowth = (state.growth || []).slice().sort((a, b) => new Date(b.date || b.created || 0) - new Date(a.date || a.created || 0))[0] || {};
    const values = {
      weight: latestGrowth.weight || state.profile.currentWeight || "",
      height: latestGrowth.height || state.profile.currentHeight || "",
      head: latestGrowth.head || state.profile.headCircumference || ""
    };
    const historyRows = (state.growth || []).slice().sort((a, b) => new Date(b.date || b.created || 0) - new Date(a.date || a.created || 0)).slice(0, 3);
    state.v5.adaptiveO.modalSource = "growth";
    state.v5.adaptiveO.modalParent = "";
    persist();
    byId("v5OMenuTitle").textContent = "Rast a váha";
    byId("v5OMenuSubtitle").textContent = "Nové meranie";
    byId("v5OMenuBack").hidden = true;
    byId("v5OMenuBody").innerHTML = [
      "<div class='v5-growth-modal-grid'>",
      "<label class='v5-growth-field'><span class='v5-icon'>", icon("growth"), "</span><span><strong>Váha</strong><small>kg</small></span><input id='v5GrowthWeight' inputmode='decimal' autocomplete='off' aria-label='Váha v kilogramoch' placeholder='napr. 6,4' value='", escapeHtml(values.weight), "'></label>",
      "<label class='v5-growth-field'><span class='v5-icon'>", icon("growth"), "</span><span><strong>Výška</strong><small>cm</small></span><input id='v5GrowthHeight' inputmode='decimal' autocomplete='off' aria-label='Výška v centimetroch' placeholder='napr. 64' value='", escapeHtml(values.height), "'></label>",
      "<label class='v5-growth-field'><span class='v5-icon'>", icon("baby"), "</span><span><strong>Obvod hlavy</strong><small>cm</small></span><input id='v5GrowthHead' inputmode='decimal' autocomplete='off' aria-label='Obvod hlavy v centimetroch' placeholder='napr. 41' value='", escapeHtml(values.head), "'></label>",
      "</div>",
      "<details class='v5-growth-details'><summary>Dátum a poznámka</summary><div class='v5-o-compact-form'><label>Dátum<input id='v5GrowthDate' type='date' value='", todayKey(), "'></label><label>Poznámka<input id='v5GrowthNote' maxlength='120' placeholder='Voliteľné'></label></div></details>",
      "<button class='v5-primary' type='button' data-v5-growth-save>Uložiť meranie</button>",
      historyRows.length ? "<div class='v5-growth-history'><h3>Posledné merania</h3>" + historyRows.map(item => {
        const weight = item.weight ? String(item.weight) + (/[a-z]/i.test(String(item.weight)) ? "" : " kg") : "";
        const height = item.height ? String(item.height) + (/[a-z]/i.test(String(item.height)) ? "" : " cm") : "";
        const value = [weight, height].filter(Boolean).join(" · ") || "Meranie";
        return "<div><strong>" + escapeHtml(value) + "</strong><span>" + escapeHtml(new Date((item.date || todayKey()) + "T12:00:00").toLocaleDateString("sk-SK")) + "</span></div>";
      }).join("") + "</div>" : ""
    ].join("");
    const overlay = byId("v5OOverlay");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    byId("v5BottomBar")?.classList.add("v5-hidden-for-modal");
    document.body.style.overflow = "hidden";
    const inputId = metric === "height" ? "v5GrowthHeight" : metric === "head" ? "v5GrowthHead" : "v5GrowthWeight";
    setTimeout(() => byId(inputId)?.focus(), 40);
  }

  function saveGrowthMeasurement() {
    const weight = byId("v5GrowthWeight")?.value.trim() || "";
    const height = byId("v5GrowthHeight")?.value.trim() || "";
    const head = byId("v5GrowthHead")?.value.trim() || "";
    if (!weight && !height && !head) return announce("Doplňte aspoň jednu hodnotu.");
    state.growth = state.growth || [];
    state.growth.push({
      date: byId("v5GrowthDate")?.value || todayKey(),
      weight,
      height,
      head,
      note: byId("v5GrowthNote")?.value.trim() || "",
      created: new Date().toISOString()
    });
    if (weight) state.profile.currentWeight = weight;
    if (height) state.profile.currentHeight = height;
    if (head) state.profile.headCircumference = head;
    persist();
    renderHome();
    completeAdaptiveOModal("Meranie je uložené.", "Aktuálne údaje v profile dieťaťa sú aktualizované.");
    announce("Meranie bolo uložené.");
  }

  function closeAdaptiveOMenu() {
    const overlay = byId("v5OOverlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    byId("v5BottomBar")?.classList.remove("v5-hidden-for-modal");
    if (!byId("v5DrawerOverlay")?.classList.contains("open") && !byId("v5QuickRecordOverlay")?.classList.contains("open")) document.body.style.overflow = "";
  }

  function cancelAdaptiveOMenu() {
    closeAdaptiveOMenu();
    openHome();
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
    if (["teeth", "activities"].includes(key) && state.profile.status === "expecting") return;
    if (["beforeBirth", "pregnancy"].includes(key) && state.profile.status !== "expecting") return;
    closeDrawer();
    closeQuickRecord();
    closeAdaptiveOMenu();
    if (feature.flow) {
      state.v5.flow = { type: feature.flow, step: 0, data: {} };
      persist();
      routeTo("v5Flow");
      renderFlow();
      return;
    }
    if (key === "teeth" && state.profile.status !== "expecting") {
      state.v5.flow = { type: "teeth-intro", step: 0, data: {} };
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
      state.v5.momentsSection = "home";
      persist();
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
    if (feature.view === "v5PregnancyBook") {
      state.v5.pregnancyBookSection = "home";
      persist();
      routeTo("v5PregnancyBook");
      renderPregnancyBook();
      return;
    }
    if (feature.view === "v5Sounds") {
      state.v5.soundSection = "home";
      persist();
      routeTo("v5Sounds");
      renderSounds();
      return;
    }
    if (feature.view === "v5Care") {
      routeTo("v5Care");
      renderCare();
      return;
    }
    if (feature.view === "v5Utility") {
      state.v5.utilitySection = key;
      persist();
      routeTo("v5Utility");
      renderUtility();
      return;
    }
    routeTo(feature.view);
  }

  function renderCare() {
    const target = byId("v5CareContent");
    if (!target) return;
    target.innerHTML = [
      "<header class='v5-flow-head'><span class='v5-eyebrow'>Jedno miesto</span><h1>Pomoc a starostlivosť</h1><p>Vyberte, čo práve riešite.</p></header>",
      "<section class='v5-care-emergency'><div><small>Bezprostredné ohrozenie</small><strong>Dieťa nedýcha, modrie, nereaguje alebo má kŕče</strong></div><div><a href='tel:155'>155</a><a href='tel:112'>112</a></div></section>",
      "<div class='v5-care-grid'>",
      "<button class='v5-action v5-care-option v5-doctor-visit-entry' type='button' data-v5-doctor-visit><span class='v5-icon'>" + icon("health") + "</span><span><strong>Návšteva lekára</strong><small>Pokyny domov, nákup a ďalšia kontrola</small></span><span class='v5-row-arrow' aria-hidden='true'>›</span></button>",
      "<button class='v5-action v5-care-option' type='button' data-v5-care-question><span class='v5-icon'>" + icon("sparkle") + "</span><span><strong>Dieťa niečo trápi</strong><small>Krátka orientácia bez diagnózy</small></span><span class='v5-row-arrow' aria-hidden='true'>›</span></button>",
      "<button class='v5-action v5-care-option' type='button' data-v5-health-overview><span class='v5-icon'>" + icon("health") + "</span><span><strong>Zdravotné záznamy</strong><small>Teplota, merania a návštevy lekára</small></span><span class='v5-row-arrow' aria-hidden='true'>›</span></button>",
      "<button class='v5-action v5-care-option' type='button' data-v5-care-sleep><span class='v5-icon'>" + icon("moon") + "</span><span><strong>Spánok a náročná noc</strong><small>Spánok, zobudenie, šum a uspávanky</small></span><span class='v5-row-arrow' aria-hidden='true'>›</span></button>",
      "<button class='v5-action v5-care-option' type='button' data-v5-urgent><span class='v5-icon'>" + icon("alert") + "</span><span><strong>Urgentná pomoc</strong><small>Varovné signály a tiesňové kontakty</small></span><span class='v5-row-arrow' aria-hidden='true'>›</span></button>",
      "</div><p class='v5-care-disclaimer'>Odporúčania sú orientačné a nenahrádzajú pediatra ani tiesňovú pomoc.</p>"
    ].join("");
  }

  function showCareModal(title, subtitle, body) {
    closeDrawer();
    closeQuickRecord();
    closeAdaptiveOMenu();
    state.v5.adaptiveO.modalSource = "care";
    state.v5.adaptiveO.modalParent = "";
    persist();
    byId("v5OMenuTitle").textContent = title;
    byId("v5OMenuSubtitle").textContent = subtitle;
    byId("v5OMenuBack").hidden = true;
    byId("v5OMenuBody").innerHTML = body;
    const overlay = byId("v5OOverlay");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    byId("v5BottomBar")?.classList.add("v5-hidden-for-modal");
    document.body.style.overflow = "hidden";
  }

  function openCareQuestionModal() {
    showCareModal("Dieťa niečo trápi", "Vyberte, čo pozorujete", [
      "<div class='v5-quick-record-grid v5-care-topic-grid'>",
      quickActionButton("care-fever", "temperature", "Teplota") +
      quickActionButton("care-cry", "baby", "Plač a nepokoj") +
      quickActionButton("care-belly", "feeding", "Bruško a papanie") +
      quickActionButton("care-skin", "health", "Koža a vyrážka") +
      quickActionButton("care-breath", "alert", "Dýchanie") +
      quickActionButton("care-other", "sparkle", "Niečo iné"),
      "</div><p class='v5-care-disclaimer'>Guguboo pomáha usporiadať pozorovania. Neurčuje diagnózu.</p>"
    ].join(""));
  }

  function openCareTopic(topic) {
    const topics = {
      "care-fever": ["Teplota", "Zmerajte teplotu a sledujte celkový stav.", "temperature", "Zapísať teplotu"],
      "care-cry": ["Plač a nepokoj", "Skontrolujte hlad, plienku, teplotu a potrebu blízkosti.", "diaper", "Skontrolovať prebaľovanie"],
      "care-belly": ["Bruško a papanie", "Poznačte posledné kŕmenie, plienku a čo je oproti bežnému stavu iné.", "feeding", "Otvoriť kŕmenie"],
      "care-skin": ["Koža a vyrážka", "Poznačte, kedy sa zmena objavila a či sa šíri. Pri zhoršení kontaktujte pediatra.", "doctor", "Zapísať pre lekára"],
      "care-breath": ["Dýchanie", "Ak dieťa ťažko dýcha, modrie, nereaguje alebo má pauzy v dýchaní, volajte pomoc.", "urgent", "Zobraziť urgentnú pomoc"],
      "care-other": ["Iné pozorovanie", "Zapíšte si, čo sa zmenilo, odkedy to trvá a čo ste už skúsili.", "doctor", "Pripraviť poznámku pre lekára"]
    };
    const item = topics[topic] || topics["care-other"];
    byId("v5OMenuTitle").textContent = item[0];
    byId("v5OMenuSubtitle").textContent = "Krátky ďalší krok";
    byId("v5OMenuBack").hidden = false;
    byId("v5OMenuBody").innerHTML = "<div class='v5-care-topic-detail'><span class='v5-icon'>" + icon(item[2] === "urgent" ? "alert" : item[2] === "doctor" ? "health" : features[item[2]]?.icon || "sparkle") + "</span><h3>" + escapeHtml(item[0]) + "</h3><p>" + escapeHtml(item[1]) + "</p><button class='v5-primary' type='button' data-v5-care-next='" + item[2] + "'>" + escapeHtml(item[3]) + "</button></div>";
  }

  function openHealthOverviewModal() {
    const healthEvents = state.events.filter(event => ["teplota", "úraz", "reakcia"].some(type => normalized(event.type).includes(type))).slice().reverse().slice(0, 4);
    const visits = state.v5.doctorVisits.slice().reverse().slice(0, 2);
    showCareModal("Zdravotné záznamy", "Merania a návštevy na jednom mieste", [
      "<div class='v5-health-shortcuts'><button type='button' data-v5-care-next='temperature'><span class='v5-icon'>" + icon("temperature") + "</span><strong>Teplota</strong></button><button type='button' data-v5-growth-open='weight'><span class='v5-icon'>" + icon("growth") + "</span><strong>Rast</strong></button><button type='button' data-v5-doctor-visit><span class='v5-icon'>" + icon("health") + "</span><strong>Lekár</strong></button></div>",
      healthEvents.length || visits.length ? "<div class='v5-list'>" + healthEvents.map(event => "<div class='v5-row-card'><span class='v5-icon'>" + icon("temperature") + "</span><div><strong>" + escapeHtml(event.value || event.type) + "</strong><span>" + escapeHtml(formatClock(event.created)) + "</span></div></div>").join("") + visits.map(visit => "<div class='v5-row-card'><span class='v5-icon'>" + icon("health") + "</span><div><strong>" + escapeHtml(visit.doctor || "Návšteva lekára") + "</strong><span>" + escapeHtml(new Date(visit.created).toLocaleDateString("sk-SK")) + "</span></div></div>").join("") + "</div>" : "<div class='v5-empty'>Zatiaľ tu nie je zdravotný záznam.</div>"
    ].join(""));
  }

  function openUrgentModal() {
    showCareModal("Urgentná pomoc", "Pri bezprostrednom ohrození nečakajte", "<section class='v5-care-emergency v5-care-emergency-modal'><div><small>Volajte ihneď</small><strong>Dieťa nedýcha, modrie, nereaguje, má kŕče alebo sa jeho stav rýchlo zhoršuje.</strong></div><div><a href='tel:155'>155</a><a href='tel:112'>112</a></div></section><div class='v5-info-box'>Pri neistote kontaktujte pediatra alebo pohotovosť. Táto obrazovka nenahrádza zdravotnícku pomoc.</div>");
  }

  function openDoctorVisitModal() {
    closeDrawer();
    closeQuickRecord();
    closeAdaptiveOMenu();
    state.v5.adaptiveO.modalSource = "doctor-visit";
    state.v5.adaptiveO.modalParent = "";
    persist();
    const recent = state.v5.doctorVisits.slice().reverse().slice(0, 2);
    byId("v5OMenuTitle").textContent = "Návšteva lekára";
    byId("v5OMenuSubtitle").textContent = "Všetko dôležité na jednom mieste";
    byId("v5OMenuBack").hidden = true;
    byId("v5OMenuBody").innerHTML = [
      recent.length ? "<div class='v5-calendar-upcoming'>" + recent.map(item => "<div><span class='v5-icon'>" + icon("health") + "</span><span><strong>" + escapeHtml(item.doctor || "Návšteva lekára") + "</strong><small>" + escapeHtml(new Date(item.created).toLocaleDateString("sk-SK")) + (item.nextVisit ? " · kontrola " + new Date(item.nextVisit).toLocaleDateString("sk-SK") : "") + "</small></span></div>").join("") + "</div>" : "",
      "<div class='v5-o-compact-form v5-doctor-visit-form'>",
      "<label>Lekár alebo ambulancia<input id='v5DoctorName' maxlength='80' placeholder='Napr. pediatrička'></label>",
      "<label>Čo povedal lekár<textarea id='v5DoctorSummary' maxlength='600' placeholder='Krátke zhrnutie'></textarea></label>",
      "<label>Čo robiť doma<textarea id='v5DoctorHome' maxlength='600' placeholder='Jedna úloha na riadok'></textarea></label>",
      "<label>Čo treba kúpiť<textarea id='v5DoctorShopping' maxlength='300' placeholder='Každá položka na nový riadok'></textarea></label>",
      "<label>Ďalšia kontrola — nepovinné<input id='v5DoctorNext' type='datetime-local'></label>",
      "<label class='v5-calendar-share'><input id='v5DoctorSharePartner' type='checkbox'><span>" + icon("family") + "</span><span><strong>Zdieľať s partnerom</strong><small>Pokyny, nákup aj kontrolu uvidí spoločne s vami.</small></span></label>",
      "<button class='v5-primary' type='button' data-v5-doctor-save>Uložiť návštevu</button></div>"
    ].join("");
    const overlay = byId("v5OOverlay");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    byId("v5BottomBar")?.classList.add("v5-hidden-for-modal");
    document.body.style.overflow = "hidden";
    setTimeout(() => byId("v5DoctorName")?.focus(), 40);
  }

  function saveDoctorVisit() {
    const doctor = byId("v5DoctorName")?.value.trim() || "";
    const summary = byId("v5DoctorSummary")?.value.trim() || "";
    const home = byId("v5DoctorHome")?.value.trim() || "";
    const shoppingText = byId("v5DoctorShopping")?.value.trim() || "";
    const nextVisit = byId("v5DoctorNext")?.value || "";
    if (!doctor && !summary && !home && !shoppingText && !nextVisit) return announce("Doplňte aspoň jednu informáciu z návštevy.");
    const sharedWithPartner = Boolean(byId("v5DoctorSharePartner")?.checked);
    const shoppingItems = shoppingText.split(/[\n,;]+/).map(item => item.trim()).filter(Boolean);
    const visit = { id: createId(), doctor, summary, home, shoppingItems, nextVisit, sharedWithPartner, created: new Date().toISOString() };
    state.v5.doctorVisits.push(visit);
    shoppingItems.forEach(item => state.shopping.push({ item, category: "Od lekára", note: doctor ? "Odporučil/a " + doctor : "Z návštevy lekára" }));
    if (nextVisit && Number.isFinite(new Date(nextVisit).getTime())) {
      state.reminders.push({ id: createId(), title: doctor ? "Kontrola · " + doctor : "Kontrola u lekára", date: nextVisit, type: "Zdravie", alert: "1-day", sharedWithPartner, created: new Date().toISOString() });
    }
    persist();
    renderHome();
    completeAdaptiveOModal("Návšteva je uložená.", [shoppingItems.length ? shoppingItems.length + " položiek je v Nákupe" : "", nextVisit ? "kontrola je v Kalendári" : "", sharedWithPartner ? "partner ju uvidí" : ""].filter(Boolean).join(" · ") || "Pokyny zostali uložené v starostlivosti.");
    announce("Návšteva lekára bola uložená.");
  }

  function openChecklistCategory(category) {
    state.v5.checklistCategory = category;
    persist();
    routeTo("v5Checklists");
    renderChecklists();
  }

  function utilityRemoveButton(section, index, label = "Odobrať") {
    return "<button class='v5-link-button' type='button' data-v5-utility-remove='" + section + "' data-v5-utility-index='" + index + "'>" + label + "</button>";
  }

  function renderUtility() {
    const target = byId("v5UtilityContent");
    if (!target) return;
    const section = state.v5.utilitySection || "shopping";
    const feature = features[section] || features.shopping;
    byId("v5HeaderTitle").textContent = feature.label;
    byId("v5HeaderSubtitle").textContent = feature.description;
    let content = "";
    if (section === "shopping") {
      const rows = (state.shopping || []).map((item, index) => ({ item, index })).reverse();
      content = (rows.length ? "<div class='v5-list'>" + rows.map(row =>
        "<div class='v5-row-card'><span class='v5-icon'>" + icon("shopping") + "</span><div><strong>" + escapeHtml(row.item.item || "Položka") + "</strong><span>" + escapeHtml([row.item.category, row.item.note].filter(Boolean).join(" · ") || "Spoločný nákup") + "</span></div>" + utilityRemoveButton(section, row.index, "Kúpené") + "</div>"
      ).join("") + "</div>" : "<div class='v5-empty'>Zoznam je prázdny. Pridajte iba to, čo treba kúpiť.</div>") +
        "<div class='v5-form-card'><label>Čo treba kúpiť<input id='v5UtilityItem' maxlength='80' placeholder='napr. plienky'></label><label>Poznámka — nepovinné<input id='v5UtilityNote' maxlength='100' placeholder='značka, veľkosť alebo množstvo'></label></div>" +
        "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-utility-add='shopping'>Pridať do nákupu</button></div>";
    } else if (section === "contacts") {
      const rows = (state.contacts || []).map((item, index) => ({ item, index })).reverse();
      content = (rows.length ? "<div class='v5-list'>" + rows.map(row =>
        "<div class='v5-row-card'><span class='v5-icon'>" + icon("contacts") + "</span><div><strong>" + escapeHtml(row.item.name || row.item.type || "Kontakt") + "</strong><span>" + escapeHtml([row.item.type, row.item.phone].filter(Boolean).join(" · ")) + "</span></div>" + utilityRemoveButton(section, row.index) + "</div>"
      ).join("") + "</div>" : "<div class='v5-empty'>Pridajte pediatra, lekáreň alebo človeka, ktorému môžete zavolať.</div>") +
        "<div class='v5-form-card'><label>Meno alebo názov<input id='v5UtilityName' maxlength='80' placeholder='napr. MUDr. Nováková'></label><label>Typ<select id='v5UtilityType'><option>Pediater</option><option>Lekáreň</option><option>Pohotovosť</option><option>Rodina</option><option>Iné</option></select></label><label>Telefón<input id='v5UtilityPhone' type='tel' maxlength='30' placeholder='+421…'></label></div>" +
        "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-utility-add='contacts'>Uložiť kontakt</button></div>";
    } else if (section === "products") {
      const rows = (state.productFavorites || []).map((item, index) => ({ item, index })).reverse();
      content = (rows.length ? "<div class='v5-list'>" + rows.map(row =>
        "<div class='v5-row-card'><span class='v5-icon'>" + icon("products") + "</span><div><strong>" + escapeHtml(row.item.item || "Produkt") + "</strong><span>" + escapeHtml([row.item.brand, row.item.size].filter(Boolean).join(" · ") || "Uložená výbava") + "</span></div><button class='v5-link-button' type='button' data-v5-product-to-shopping='" + row.index + "'>Kúpiť</button>" + utilityRemoveButton(section, row.index) + "</div>"
      ).join("") + "</div>" : "<div class='v5-empty'>Uložte si iba veci, ktoré používate opakovane.</div>") +
        "<div class='v5-form-card'><label>Produkt<input id='v5UtilityProduct' maxlength='80' placeholder='napr. plienky'></label><label>Značka — nepovinné<input id='v5UtilityBrand' maxlength='60'></label><label>Veľkosť — nepovinné<input id='v5UtilitySize' maxlength='30' value='" + escapeHtml(state.profile.diaperSize || "") + "'></label></div>" +
        "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-utility-add='products'>Uložiť produkt</button></div>";
    } else if (section === "family") {
      const rows = (state.familyTasks || []).map((item, index) => ({ item, index })).reverse();
      content = (rows.length ? "<div class='v5-list'>" + rows.map(row =>
        "<div class='v5-row-card'><span class='v5-icon'>" + icon("family") + "</span><div><strong>" + escapeHtml(row.item.task || "Rodinná úloha") + "</strong><span>" + escapeHtml([row.item.assignee || "rodina", row.item.when].filter(Boolean).join(" · ")) + "</span></div>" + utilityRemoveButton(section, row.index, "Hotovo") + "</div>"
      ).join("") + "</div>" : "<div class='v5-empty'>Rozdeľte si jednu konkrétnu úlohu bez dlhého plánovania.</div>") +
        "<div class='v5-form-card'><label>Čo treba urobiť<input id='v5UtilityTask' maxlength='100' placeholder='napr. kúpiť plienky'></label><label>Kto<select id='v5UtilityAssignee'><option value='partner'>Partner</option><option value='mama'>Mama</option><option value='rodina'>Ktokoľvek z rodiny</option></select></label></div>" +
        "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-utility-add='family'>Pridať úlohu</button><button class='v5-secondary' type='button' data-v5-feature='profiles'>Spravovať rodinu</button></div>";
    } else {
      const adminItems = [
        ["v5-admin-birth", "Rodný list"],
        ["v5-admin-insurance", "Zdravotná poisťovňa dieťaťa"],
        ["v5-admin-pediatrician", "Pediater"],
        ["v5-admin-benefits", "Príspevky a rodičovské dávky"]
      ];
      content = "<div class='v5-form-card'>" + adminItems.map(item =>
        "<label style='grid-template-columns:auto 1fr;align-items:center'><input style='width:24px;min-height:24px' type='checkbox' data-v5-utility-check='" + item[0] + "'" + (state.checks[item[0]] ? " checked" : "") + "><span>" + escapeHtml(item[1]) + "</span></label>"
      ).join("") + "</div><div class='v5-info-box'>Postup a termíny sa líšia podľa krajiny a situácie. Guguboo slúži ako prehľad, nie ako právna rada.</div>";
    }
    target.innerHTML = flowHead(feature.label, feature.description, section === "administration" ? "Jednoduchý lokálny prehľad po narodení." : "Jedna úloha, minimum vypĺňania.", 0, 1) + content;
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

  function sleepAudioTools() {
    const lullabyCount = Array.isArray(state.lullabies) ? state.lullabies.length : 0;
    const recentLullabies = (state.lullabies || []).slice().reverse().slice(0, 3);
    return [
      "<section class='v5-sleep-audio'><div class='v5-compact-head'><div><h3>Zvuky na zaspávanie</h3><p>Šum alebo vaša rodinná uspávanka.</p></div></div>",
      "<div class='v5-choice-grid v5-sleep-audio-grid'>",
      "<button class='v5-choice' type='button' data-v5-audio-type='white' data-v5-audio-title='Biely šum'><span class='v5-icon'>", icon("sound"), "</span><span><strong>Biely šum</strong><small>Jemné zvukové pozadie.</small></span></button>",
      "<button class='v5-choice' type='button' data-v5-action='open-sleep-sounds'><span class='v5-icon'>", icon("family"), "</span><span><strong>Rodinné uspávanky</strong><small>", lullabyCount ? lullabyCount + " spoločných nahrávok" : "Nahrať hlas mamy alebo otca", "</small></span></button>",
      "</div>",
      recentLullabies.length ? "<div class='v5-lullaby-quick-list'>" + recentLullabies.map(item => "<button type='button' data-v5-play-lullaby='" + escapeHtml(item.id) + "'><span class='v5-icon'>" + icon("sound") + "</span><span><strong>" + escapeHtml(item.title || "Rodinná uspávanka") + "</strong><small>" + escapeHtml(item.author === "otec" ? "Nahral otec" : item.author === "mama" ? "Nahrala mama" : "Rodinná nahrávka") + "</small></span><b>Prehrať</b></button>").join("") + "</div>" : "",
      "</section>"
    ].join("");
  }

  function renderFlow() {
    const target = state.v5.flow?.context === "adaptive-o" && byId("v5OOverlay")?.classList.contains("open")
      ? byId("v5OFeatureContent")
      : byId("v5FlowContent");
    if (!target) return;
    const flow = state.v5.flow;
    const data = flow.data || {};
    let html = "";

    if (flow.type === "sleep") {
      if (flow.step === 0) {
        html = state.sleepTimer?.active
          ? flowHead("Spánok", "Dieťa spí", "Spánok začal o " + formatClock(state.sleepTimer.start) + ".", 0, 1) +
            "<div class='v5-o-single-action v5-sleep-running'><span class='v5-icon'>" + icon(state.sleepTimer.type === "night" ? "moon" : "sun") + "</span><h3>Od " + escapeHtml(formatClock(state.sleepTimer.start)) + "</h3><button class='v5-primary' type='button' data-v5-action='stop-sleep-flow'>Zobudilo sa · ukončiť</button></div>" +
            "<div class='v5-choice-grid v5-sleep-tools v5-sleep-tools-one'>" +
            choice("sleep-overview", "Dnešný prehľad", "Uložené spánky.", "growth") + "</div>" + sleepAudioTools()
          : flowHead("Spánok", "Začať spánok", "Vyberte denný alebo nočný spánok.", 0, 1) +
            "<div class='v5-sleep-type-grid' role='radiogroup' aria-label='Typ spánku'>" +
            "<label class='v5-sleep-type'><input type='radio' name='v5SleepType' value='day' checked><span class='v5-icon'>" + icon("sun") + "</span><strong>Denný</strong></label>" +
            "<label class='v5-sleep-type'><input type='radio' name='v5SleepType' value='night'><span class='v5-icon'>" + icon("moon") + "</span><strong>Nočný</strong></label></div>" +
            "<button class='v5-primary v5-sleep-start-button' type='button' data-v5-action='start-sleep'>Začať spánok</button>" +
            "<div class='v5-choice-grid v5-sleep-tools v5-sleep-tools-two'>" +
            choice("sleep-past", "Pridať spätne", "Začiatok a koniec.", "calendar") +
            choice("sleep-overview", "Dnešný prehľad", "Uložené spánky.", "growth") + "</div>" + sleepAudioTools();
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
        html = flowHead("Kŕmenie", "Čo práve papalo?", "Vyberte jednu možnosť.", 0, 3) +
          "<div class='v5-choice-grid'>" +
          choice("feed-breast", "Dojčenie", "Ľavý, pravý alebo oba.", "feeding") +
          choice("feed-bottle", "Fľaša", "Mlieko a množstvo.", "feeding") +
          choice("feed-solids", "Príkrmy", "Jedlo a približná porcia.", "products") +
          choice("feed-other", "Iné", "Krátky vlastný záznam.", "sparkle") +
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
        const isSolids = data.method === "solids";
        html = flowHead("Kŕmenie", isBottle ? "Fľaša" : isSolids ? "Príkrm" : "Iné kŕmenie", "Doplňte iba to podstatné.", 1, 2) +
          "<div class='v5-form-card'>" +
          (isBottle
            ? "<label>Typ mlieka<select id='v5FeedMilk'><option>Materské mlieko</option><option>Umelé mlieko</option><option>Kombinované</option></select></label><label>Množstvo v ml — nepovinné<input id='v5FeedAmount' type='number' min='0' max='1000' inputmode='numeric' placeholder='napr. 120'></label>"
            : isSolids
              ? "<label>Čo papalo?<input id='v5FeedOther' placeholder='napr. mrkva a zemiak'></label><label>Koľko približne?<select id='v5FeedPortion'><option value=''>Neuvádzať</option><option>Pár lyžičiek</option><option>Časť porcie</option><option>Celá porcia</option></select></label>"
              : "<label>Čo dieťa jedlo?<input id='v5FeedOther' placeholder='Krátky názov'></label>") +
          "<label>Poznámka — nepovinné<textarea id='v5FeedNote' placeholder='Voliteľná poznámka'></textarea></label></div>" +
          "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='save-feeding'>Uložiť kŕmenie</button><button class='v5-text-action' type='button' data-v5-flow-back>Späť</button></div>";
      }
    }

    if (flow.type === "diaper") {
      if (flow.step === 0) {
        html = flowHead("Prebaľovanie", "Čo bolo v plienke?", "Vyberte dôvod prebalenia.", 0, 2) +
          "<div class='v5-choice-grid'>" +
          choice("diaper-wet", "Cikalo", "Mokrá plienka.", "diaper") +
          choice("diaper-dirty", "Kakalo", "Voliteľne doplníte detail stolice.", "diaper") +
          choice("diaper-both", "Cikalo aj kakalo", "Mokrá plienka aj stolica.", "diaper") +
          choice("diaper-dry", "Iba kontrola", "Suchá plienka alebo bežná výmena.", "diaper") +
          "</div>";
      } else {
        html = flowHead("Prebaľovanie", data.diaperLabel || "Prebalenie", "Uloží sa aktuálny čas.", 1, 2) +
          "<div class='v5-form-card v5-compact-record-card'><div class='v5-selected-record'><span class='v5-icon'>" + icon("diaper") + "</span><strong>" + escapeHtml(data.diaperLabel || "") + "</strong></div>" +
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

    if (flow.type === "bath") {
      if (flow.step === 0) {
        html = flowHead("Kúpanie", "Čo ste umývali?", "Vyberte jednu možnosť.", 0, 2) +
          "<div class='v5-choice-grid v5-bath-choice-grid'>" +
          choice("bath-full", "Celý kúpeľ", "Telíčko aj vlásky.", "bath") +
          choice("bath-hair", "Vlásky", "Umývanie hlavičky.", "sparkle") +
          choice("bath-body", "Telíčko", "Bez umývania vláskov.", "baby") +
          "</div>";
      } else {
        html = flowHead("Kúpanie", data.bathLabel || "Kúpanie", "Uloží sa aktuálny čas.", 1, 2) +
          "<div class='v5-form-card v5-compact-record-card'><div class='v5-selected-record'><span class='v5-icon'>" + icon(data.bathIcon || "bath") + "</span><strong>" + escapeHtml(data.bathLabel || "Kúpanie") + "</strong></div>" +
          "<label>Poznámka — nepovinné<textarea id='v5BathNote' placeholder='Napríklad pokožka alebo nálada'></textarea></label></div>" +
          "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='save-bath'>Uložiť kúpanie</button><button class='v5-text-action' type='button' data-v5-flow-back>Späť</button></div>";
      }
    }

    if (flow.type === "note") {
      const noteTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      html = flowHead("Poznámka", "Čo si chcete zapamätať?", "Stačí krátka veta.", 0, 1) +
        "<div class='v5-form-card'><label>Poznámka<textarea id='v5QuickNoteText' placeholder='Napíšte krátku poznámku' autofocus></textarea></label>" +
        "<label>Čas<input id='v5QuickNoteTime' type='datetime-local' value='" + noteTime + "'></label></div>" +
        "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='save-quick-note'>Uložiť poznámku</button></div>";
    }

    if (flow.type === "teeth-intro") {
      const age = ageData();
      const stage = !age
        ? { eyebrow: "Podľa veku dieťaťa", title: "Kedy budú Zúbky aktuálne?", copy: "Doplňte dátum narodenia a nabudúce vám ukážeme odporúčanie podľa veku." }
        : age.days < 120
          ? { eyebrow: age.label, title: "Na prvé zúbky je ešte pravdepodobne čas.", copy: "Každé dieťa je iné. Aplikáciu si môžete pokojne pozrieť už teraz a pripraviť sa." }
          : age.days < 210
            ? { eyebrow: age.label, title: "Obdobie prvých zúbkov sa môže približovať.", copy: "Pozrite si jemnú starostlivosť, prejavy a miesto na prvé záznamy." }
            : { eyebrow: age.label, title: "Zúbky už môžu byť aktuálne.", copy: "Otvorte mapu zúbkov, starostlivosť a vlastné záznamy." };
      html = flowHead(stage.eyebrow, stage.title, stage.copy, 0, 1) +
        "<div class='v5-form-card v5-teeth-age-card'><span class='v5-icon'>" + icon("tooth") + "</span><div><strong>Zúbky</strong><p>Všetky funkcie zostávajú dostupné bez ohľadu na vek.</p></div></div>" +
        "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='enter-teeth'>Vstúpiť do Zúbkov</button><button class='v5-secondary' type='button' data-v5-home>Teraz nie</button></div>";
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
    const adaptiveContext = state.v5.flow?.context === "adaptive-o" && byId("v5OOverlay")?.classList.contains("open");
    const target = adaptiveContext ? byId("v5OFeatureContent") : byId("v5FlowContent");
    if (!target) return;
    target.innerHTML = adaptiveContext ? [
      "<div class='v5-confirm v5-o-flow-confirm'><div><span class='v5-confirm-mark'>✓</span><h2>", escapeHtml(message), "</h2><p>",
      escapeHtml(detail), "</p><div class='v5-actions' style='justify-content:center'><button class='v5-secondary' type='button' data-v5-o-back>Ďalší krok</button>",
      "<button class='v5-primary' type='button' data-v5-close-o>Hotovo</button></div></div></div>"
    ].join("") : [
      "<div class='v5-confirm'><div><span class='v5-confirm-mark'>✓</span><h2>", escapeHtml(message), "</h2><p>",
      escapeHtml(detail), "</p><div class='v5-actions' style='justify-content:center'><button class='v5-primary' type='button' data-v5-home>Späť domov</button>",
      "<button class='v5-secondary' type='button' data-v5-open-drawer>Ďalšia funkcia</button></div></div></div>"
    ].join("");
    renderHome();
    renderBottomBar();
    renderTimers();
  }

  function startSleep() {
    const selectedType = document.querySelector("input[name='v5SleepType']:checked")?.value || byId("v5SleepType")?.value || "day";
    state.sleepTimer = { active: true, start: new Date().toISOString(), type: selectedType };
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
        icon: state.sleepTimer.type === "night" ? "moon" : "sun",
        title: "Dieťa spí",
        detail: "Od " + formatClock(state.sleepTimer.start) + " · " + formatDuration(Date.now() - new Date(state.sleepTimer.start).getTime()),
        stopLabel: "Zobudilo sa"
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
      timer.id, "'>", escapeHtml(timer.stopLabel || "Ukončiť"), "</button></div>"
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
      ["family", "Rodina"],
      ["settings", "Nastavenia"]
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
          state.profile.photo ? "<img src='" + escapeHtml(state.profile.photo) + "' alt='Fotografia dieťaťa'>" : "<span aria-hidden='true'>" + icon("baby") + "</span>",
          "<div><strong>Fotografia dieťaťa</strong><small>Môže nahradiť ovocný avatar, keď je bábätko na svete.</small><label class='v5-photo-picker'>", state.profile.photo ? "Zmeniť fotografiu" : "Nahrať fotografiu", "<input id='v5ChildPhoto' type='file' accept='image/*'></label></div></div>"
        ].join("") ,
        "<label>Meno<input id='v5ChildName' value='", escapeHtml(state.profile.name || ""), "'></label>",
        "<label>Obdobie<select id='v5ChildStatus'><option value='expecting'", state.profile.status === "expecting" ? " selected" : "", ">Čakáme bábätko</option><option value='born'", state.profile.status !== "expecting" ? " selected" : "", ">Bábätko je na svete</option></select></label>",
        "<label>Pohlavie<select id='v5ChildSex'><option value=''>Nechcem uviesť / zatiaľ nevieme</option><option value='girl'", state.profile.sex === "girl" ? " selected" : "", ">Dievčatko</option><option value='boy'", state.profile.sex === "boy" ? " selected" : "", ">Chlapček</option></select></label>",
        "<details class='v5-profile-section'><summary>Narodenie a pôrodné údaje</summary><div>",
        "<label>Termín pôrodu<input id='v5ChildDue' type='date' value='", escapeHtml(state.profile.due || ""), "'></label>",
        "<label>Dátum narodenia<input id='v5ChildBirth' type='date' value='", escapeHtml(state.profile.birth || ""), "'></label>",
        "<label>Čas narodenia<input id='v5ChildBirthTime' type='time' value='", escapeHtml(state.profile.birthTime || ""), "'></label>",
        "<label>Miesto narodenia<input id='v5ChildBirthPlace' value='", escapeHtml(state.profile.birthPlace || ""), "'></label>",
        "<label>Gestačný týždeň<input id='v5ChildGestWeek' type='number' min='20' max='42' inputmode='numeric' value='", escapeHtml(state.profile.gestationalWeek || ""), "'></label>",
        "<label>Gestačný deň<input id='v5ChildGestDay' type='number' min='0' max='6' inputmode='numeric' value='", escapeHtml(state.profile.gestationalDay ?? ""), "'></label>",
        "<label>Pôrodná hmotnosť<input id='v5ChildBirthWeight' placeholder='napr. 3 450 g' value='", escapeHtml(state.profile.weight || ""), "'></label>",
        "<label>Pôrodná dĺžka<input id='v5ChildBirthHeight' placeholder='napr. 51 cm' value='", escapeHtml(state.profile.height || ""), "'></label>",
        "</div></details><details class='v5-profile-section' open><summary>Aktuálne merania a potreby</summary><div>",
        "<label>Aktuálna hmotnosť<input id='v5ChildCurrentWeight' placeholder='napr. 6,4 kg' value='", escapeHtml(state.profile.currentWeight || ""), "'></label>",
        "<label>Aktuálna výška<input id='v5ChildCurrentHeight' placeholder='napr. 64 cm' value='", escapeHtml(state.profile.currentHeight || ""), "'></label>",
        "<label>Obvod hlavy<input id='v5ChildHead' placeholder='napr. 41 cm' value='", escapeHtml(state.profile.headCircumference || ""), "'></label>",
        "<label>Veľkosť plienky<select id='v5ChildDiaperSize'><option value=''>Neuvádzať</option>",
        ["0", "1", "2", "3", "4", "5", "6", "7"].map(size => "<option value='" + size + "'" + (String(state.profile.diaperSize || "") === size ? " selected" : "") + ">" + size + "</option>").join(""),
        "</select></label>",
        "</div></details><details class='v5-profile-section'><summary>Zdravie a starostlivosť</summary><div>",
        "<label>Poisťovňa<input id='v5ChildInsurance' value='", escapeHtml(state.profile.insurance || ""), "'></label>",
        "<label>Pediater<input id='v5ChildPediatrician' value='", escapeHtml(state.profile.pediatrician || ""), "'></label>",
        "<label>Alergie a dôležité poznámky<textarea id='v5ChildNotes'>", escapeHtml(state.profile.notes || ""), "</textarea></label>",
        "</div></details>",
        "</div><div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='save-child-profile'>Uložiť profil dieťaťa</button>",
        state.profile.status === "expecting" ? "" : "<button class='v5-secondary' type='button' data-v5-action='open-birth-card'>Kartička narodenia</button>",
        "<button class='v5-secondary' type='button' data-v5-action='open-original-child-profile'>Rozšírené pôrodné údaje</button></div>"
      ].join("");
    } else if (tab === "family") {
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
    } else {
      const summary = [
        ["Záznamy", (state.events || []).length],
        ["Momenty", (state.v5.firstMoments || []).length],
        ["Merania", (state.growth || []).length],
        ["Udalosti", (state.reminders || []).length]
      ];
      content = "<div class='v5-list'>" + summary.map(item => "<div class='v5-row-card'><span class='v5-icon'>" + icon("checklist") + "</span><div><strong>" + item[0] + "</strong><span>" + item[1] + " uložených položiek</span></div></div>").join("") + "</div>" +
        "<div class='v5-info-box'><strong>Súkromie</strong><br>Údaje tejto prototypovej verzie zostávajú v tomto prehliadači. Môj priestor je navyše chránený vlastným PIN-om.</div>" +
        "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='export-family-data'>Stiahnuť zálohu údajov</button><button class='v5-secondary' type='button' data-v5-feature='privateSpace'>Otvoriť Môj priestor</button></div>";
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
    const section = state.v5.momentsSection || "home";
    const date = todayKey();
    const day = dayOfLife(date);
    const existing = state.diary.find(item => item.first100 && item.date === date);
    const allMoments = (state.diary || []).filter(item => item.first100 || item.text || item.photo);
    const firstOptions = [
      ["smile", "Prvý úsmev", "sparkle"],
      ["stroller", "Prvé zaspatie v kočíku", "moon"],
      ["grandparents", "Prvýkrát so starými rodičmi", "family"],
      ["bath", "Prvé kúpanie", "bath"],
      ["laugh", "Prvý smiech", "memory"],
      ["tooth", "Prvý zúbok", "tooth"]
    ];
    if (section === "home") {
      target.innerHTML = flowHead("Naše chvíle", "Malé okamihy, jeden príbeh", "Bez albumov a triedenia. Guguboo z uložených chvíľ pripraví spoločný výstup.", 0, 1) +
        "<div class='v5-moments-hub'>" +
        "<button type='button' data-v5-moments-section='today'><span class='v5-icon'>" + icon("memory") + "</span><span><strong>Dnešný malý moment</strong><small>Jedna fotografia alebo krátka veta</small></span><b>›</b></button>" +
        "<button type='button' data-v5-moments-section='firsts'><span class='v5-icon'>" + icon("sparkle") + "</span><span><strong>Prvé razy</strong><small>" + state.v5.firstMoments.length + " zachytených míľnikov</small></span><b>›</b></button>" +
        "<button type='button' data-v5-moments-section='story'><span class='v5-icon'>" + icon("baby") + "</span><span><strong>Náš príbeh</strong><small>100 dní spolu a prvý rok</small></span><b>›</b></button></div>";
      return;
    }
    if (section === "today") {
      target.innerHTML = flowHead("Naše chvíle", day && day > 0 && day <= 100 ? day + ". deň spolu" : "Dnešný malý moment", "Stačí fotografia alebo jedna veta.", 0, 1) +
        "<div class='v5-form-card'><label>Dátum<input id='v5First100Date' type='date' value='" + escapeHtml(existing?.date || date) + "'></label>" +
        "<label>Krátka veta<textarea id='v5First100Text' placeholder='Moment, ktorý si chcete zapamätať'>" + escapeHtml(existing?.text || "") + "</textarea></label>" +
        "<label>Fotografia — nepovinné<input id='v5First100Photo' type='file' accept='image/*'></label>" +
        (existing?.photo ? "<img src='" + escapeHtml(existing.photo) + "' alt='Dnešný moment' class='v5-moment-photo'>" : "") + "</div>" +
        "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='save-first100'>Uložiť moment</button><button class='v5-secondary' type='button' data-v5-moments-home>Späť</button></div>";
      return;
    }
    if (section === "firsts") {
      target.innerHTML = flowHead("Naše chvíle", "Prvé razy", "Klepnite iba na okamih, ktorý sa dnes stal.", 0, 1) +
        "<div class='v5-first-moments-grid'>" + firstOptions.map(item => {
          const saved = state.v5.firstMoments.find(entry => entry.key === item[0]);
          return "<button type='button' class='" + (saved ? "is-saved" : "") + "' data-v5-first-moment='" + item[0] + "' data-v5-first-label='" + escapeHtml(item[1]) + "'><span class='v5-icon'>" + icon(item[2]) + "</span><strong>" + escapeHtml(item[1]) + "</strong><small>" + (saved ? new Date(saved.date).toLocaleDateString("sk-SK") : "Zachytiť dnes") + "</small></button>";
        }).join("") + "</div><button class='v5-secondary' type='button' data-v5-moments-home>Späť</button>";
      return;
    }
    const days = new Set(allMoments.map(item => item.date || todayKey(item.created))).size;
    const photos = allMoments.filter(item => item.photo).length;
    target.innerHTML = flowHead("Naše chvíle", "Náš príbeh", "Guguboo pripraví výstup automaticky. Nemusíte vytvárať ani triediť albumy.", 0, 1) +
      "<div class='v5-story-output-grid'><section><span>100</span><div><strong>Prvých 100 dní spolu</strong><small>" + days + " dní · " + photos + " fotografií · " + state.v5.firstMoments.length + " prvých razov</small></div></section>" +
      "<section><span>1</span><div><strong>Prvý rok spolu</strong><small>Príbeh bude priebežne rásť z rovnakých momentov.</small></div></section></div>" +
      "<div class='v5-info-box'>Výstup si pred uložením alebo tlačou skontrolujete. Chýbajúci deň nevadí.</div>" +
      "<button class='v5-secondary' type='button' data-v5-moments-home>Späť</button>";
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
      "</div><div class='v5-actions'><button class='v5-primary' type='button' data-v5-action='open-birth-card'>Upraviť kartičku narodenia</button><button class='v5-secondary' type='button' data-v5-feature='memories'>Otvoriť Momenty</button></div>";
  }

  const checklistCategories = [
    ["documents", "Doklady", "Oficiálne veci a potvrdenia", [
      ["v5-health-pediatrician", "Vybrať pediatra"],
      ["v5-doc-id", "Skontrolovať doklady rodiča"],
      ["v5-prenatal-insurance", "Overiť zdravotnú poisťovňu"],
      ["v5-prenatal-help", "Dohodnúť pomoc po návrate domov"]
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
      ["v5-home-clothes", "Základné oblečenie"],
      ["v5-prenatal-car-seat", "Autosedačka na cestu domov"]
    ]],
    ["health", "Zdravie a kontakty", "Pediater, poisťovňa a lekáreň", [
      ["v5-health-pediatrician", "Vybraný pediater"],
      ["v5-health-pharmacy", "Najbližšia lekáreň"],
      ["v5-health-emergency", "Pohotovosť a tiesňové čísla"],
      ["v5-health-notes", "Alergie a dôležité poznámky"]
    ]],
    ["doctor", "Návšteva lekára", "Otázky, správy a ďalší postup", [
      ["v5-doctor-card", "Preukaz poistenca"],
      ["v5-doctor-questions", "Otázky, ktoré sa chcem opýtať"],
      ["v5-doctor-measurements", "Posledné merania dieťaťa"],
      ["v5-doctor-reports", "Správy a výsledky"]
    ]],
    ["illness", "Keď dieťa niečo trápi", "Údaje, ktoré pomôžu pri konzultácii", [
      ["v5-illness-temperature", "Zaznamenaná teplota"],
      ["v5-illness-feeding", "Kŕmenie a tekutiny"],
      ["v5-illness-diapers", "Mokré a špinavé plienky"],
      ["v5-illness-medicines", "Lieky a odporúčania lekára"]
    ]],
    ["travel", "Cestovanie", "Doklady, balenie a zdravie", [
      ["v5-travel-docs", "Doklady a poistenie"],
      ["v5-travel-clothes", "Oblečenie podľa počasia"],
      ["v5-travel-feed", "Kŕmenie podľa vašej rutiny"],
      ["v5-travel-meds", "Lieky a účinné látky"]
    ]]
  ];

  const checklistVisuals = {
    documents: ["book", "Doklady"],
    hospital: ["checklist", "Pôrodnica"],
    home: ["home", "Domov"],
    health: ["health", "Zdravie"],
    doctor: ["contacts", "Lekár"],
    illness: ["alert", "Starostlivosť"],
    travel: ["travel", "Cesta"]
  };

  function renderChecklists() {
    const target = byId("v5ChecklistsContent");
    if (!target) return;
    const expecting = state.profile.status === "expecting";
    const allowedKeys = expecting
      ? ["hospital", "home", "documents"]
      : ["health", "doctor", "illness", "travel"];
    const visibleCategories = checklistCategories.filter(category => allowedKeys.includes(category[0]));
    const selected = visibleCategories.find(category => category[0] === state.v5.checklistCategory);
    if (state.v5.checklistCategory && !selected) state.v5.checklistCategory = "";
    if (!selected) {
      target.innerHTML = "<section class='v5-checklist-shell'><header class='v5-checklist-intro'><span>" + (expecting ? "Moja príprava" : "Praktické zoznamy") + "</span><h1>Vyberte oblasť</h1></header>" +
        "<div class='v5-checklist-grid'>" + visibleCategories.map(category => {
          const custom = state.v5.checklistCustom.filter(item => item.category === category[0]);
          const all = category[3].concat(custom.map(item => [item.id, item.label]));
          const done = all.filter(item => state.checks[item[0]]).length;
          const percentage = all.length ? Math.round(done / all.length * 100) : 0;
          const visual = checklistVisuals[category[0]] || ["checklist", "Zoznam"];
          return "<button class='v5-check-category-card is-" + category[0] + (done === all.length && all.length ? " is-done" : "") + "' type='button' data-v5-check-category='" + category[0] + "'><span class='v5-icon'>" + icon(visual[0]) + "</span><span class='v5-check-card-copy'><small>" + escapeHtml(visual[1]) + "</small><strong>" + escapeHtml(category[1]) + "</strong></span><span class='v5-check-count'>" + done + "/" + all.length + "</span><span class='v5-check-progress' aria-hidden='true'><i style='--progress:" + percentage + "%'></i></span></button>";
        }).join("") + "</div></section>";
      return;
    }
    const custom = state.v5.checklistCustom.filter(item => item.category === selected[0]);
    const items = selected[3].concat(custom.map(item => [item.id, item.label]));
    const done = items.filter(item => state.checks[item[0]]).length;
    const percentage = items.length ? Math.round(done / items.length * 100) : 0;
    const visual = checklistVisuals[selected[0]] || ["checklist", "Zoznam"];
    target.innerHTML = [
      "<section class='v5-checklist-shell v5-checklist-detail'>",
      "<header class='v5-checklist-detail-head is-", selected[0], "'><span class='v5-icon'>", icon(visual[0]), "</span><div><small>", escapeHtml(visual[1]), "</small><h1>", escapeHtml(selected[1]), "</h1></div><strong>", done, "/", items.length, "</strong><span class='v5-check-progress'><i style='--progress:", percentage, "%'></i></span></header>",
      "<div class='v5-check-items'>",
      items.map(item => {
        const checked = Boolean(state.checks[item[0]]);
        return "<label class='v5-check-item-card" + (checked ? " is-done" : "") + "'><input type='checkbox' data-v5-check-item='" + item[0] + "'" + (checked ? " checked" : "") + "><span class='v5-check-toggle' aria-hidden='true'>" + (checked ? "✓" : "") + "</span><strong>" + escapeHtml(item[1]) + "</strong></label>";
      }).join(""),
      "</div>",
      "<div class='v5-check-add'><input id='v5ChecklistCustom' maxlength='80' placeholder='Vlastná položka'><button type='button' data-v5-action='add-checklist-custom' aria-label='Pridať vlastnú položku'>＋</button></div>",
      "<button class='v5-check-categories-button' type='button' data-v5-check-home>", icon("back"), expecting ? " Moja príprava" : " Všetky zoznamy", "</button>",
      "</section>"
    ].join("");
  }

  function renderPrenatal() {
    const target = byId("v5PrenatalContent");
    if (!target) return;
    state.prenatal ||= {};
    const section = state.v5.prenatalSection || "home";
    let content = "";
    if (section === "home") {
      content = "<div class='v5-choice-grid'>" +
        choice("prenatal-hospital", "Pôrodnica", "Kontakt a vlastné pokyny.", "health") +
        choice("prenatal-bag", "Taška", "Mama · bábätko · odchod.", "checklist") +
        choice("prenatal-home", "Domov", "Spánok · prebaľovanie · cesta.", "home") +
        choice("prenatal-documents", "Doklady a vybaviť", "Pediater · poisťovňa · pomoc.", "book") +
        choice("prenatal-mother", "Podpora pre mamu", "Pomoc po návrate domov.", "family") +
        "</div>";
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
    target.innerHTML = flowHead("Moja príprava", section === "home" ? "Čo chcete pripraviť?" : section === "hospital" ? "Moja pôrodnica" : "Podpora pre mamu", section === "home" ? "Vyberte jednu oblasť." : "Údaj sa uloží do spoločnej prípravy rodiny.", 0, 1) + content;
  }

  function pregnancyBookData(week) {
    const phase = !week || week < 14 ? 1 : week < 28 ? 2 : 3;
    if (phase === 1) return {
      baby: ["Bábätko sa v tomto období rýchlo vyvíja.", "Týždeň je orientačný podľa termínu pôrodu.", "Skutočný vývoj hodnotí zdravotník."],
      mother: ["Únava alebo nevoľnosť môžu byť v tomto období bežné.", "Doprajte si tekutiny, jedlo a oddych podľa potreby.", "Otázky si uložte na najbližšiu kontrolu."],
      week: ["Skontrolovať najbližší termín.", "Zapísať jednu otázku pre lekára.", "Odborné rozhodnutia riešiť na kontrole."]
    };
    if (phase === 2) return {
      baby: ["Bábätko ďalej rastie a jeho pohyby môžu byť zreteľnejšie.", "Hravé prirovnanie veľkosti je iba orientačné.", "Rast hodnotí lekár podľa vyšetrení."],
      mother: ["Telo sa postupne prispôsobuje rastúcemu brušku.", "Na kontrole sa sleduje zdravie mamy aj bábätka.", "Zaznamenajte si iba to, čo chcete prebrať s lekárom."],
      week: ["Pozrieť najbližšiu kontrolu.", "Pridať otázku, ktorú nechcete zabudnúť.", "Prečítať iba obsah pre aktuálny týždeň."]
    };
    return {
      baby: ["Bábätko ďalej rastie a dozrieva.", "Všímajte si jeho obvyklý vzorec pohybov.", "Pri zmene pohybov kontaktujte zdravotníka."],
      mother: ["Viac oddychu a pohodlná poloha môžu byť dôležitejšie.", "Na kontrole sa preberá zdravie aj príprava na pôrod.", "Pocity alebo obavy si zapíšte bez hodnotenia."],
      week: ["Skontrolovať termín najbližšej poradne.", "Pripraviť si otázky pre zdravotníka.", "Dôležité zdravotné zmeny neodkladať na ďalší deň."]
    };
  }

  function renderPregnancyBook() {
    const target = byId("v5PregnancyBookContent");
    if (!target) return;
    const avatar = window.GugubooPregnancyAvatar?.current?.() || { week: null, label: "bábätko", position: "0% 100%" };
    const week = Number(avatar.week || 0);
    const section = state.v5.pregnancyBookSection || "home";
    const data = pregnancyBookData(week);
    const due = state.profile.due
      ? new Date(state.profile.due + "T12:00:00").toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" })
      : "Termín zatiaľ nie je nastavený";
    if (section === "home") {
      const next = state.reminders
        .filter(item => new Date(item.date).getTime() >= Date.now())
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
      target.innerHTML = [
        "<section class='v5-book-hero'><div><small>Tehotenská knižka</small><h1>", week ? week + ". týždeň" : "Doplňte termín", "</h1><p>Termín pôrodu · ", escapeHtml(due), "</p></div>",
        "<span class='v5-book-fruit v5-fruit-avatar' role='img' aria-label='Orientačná veľkosť: ", escapeHtml(avatar.label), "' style='background-position:", escapeHtml(avatar.position), "'></span></section>",
        "<div class='v5-book-main-grid'>",
        "<button type='button' data-v5-book-section='baby'><span class='v5-icon'>", icon("baby"), "</span><strong>Bábätko</strong><small>Vývoj v tomto období</small></button>",
        "<button type='button' data-v5-book-section='mother'><span class='v5-icon'>", icon("health"), "</span><strong>Mama</strong><small>Zmeny a pohoda</small></button>",
        "<button type='button' data-v5-book-section='week'><span class='v5-icon'>", icon("calendar"), "</span><strong>Tento týždeň</strong><small>Čo má zmysel teraz</small></button>",
        "</div>",
        "<div class='v5-book-tools'>",
        "<button type='button' data-v5-feature='calendar'><span class='v5-icon'>", icon("calendar"), "</span><span><strong>Kontroly</strong><small>", next ? escapeHtml(next.title + " · " + formatClock(next.date)) : "Pridať termín", "</small></span></button>",
        "<button type='button' data-v5-book-section='questions'><span class='v5-icon'>", icon("book"), "</span><span><strong>Otázky pre lekára</strong><small>", state.v5.pregnancyQuestions.length ? state.v5.pregnancyQuestions.length + " uložených" : "Nič nezabudnúť", "</small></span></button>",
        "</div><p class='v5-book-note'>Orientačný sprievodca. Nenahrádza tehotenskú dokumentáciu ani zdravotníka.</p>"
      ].join("");
      return;
    }
    if (section === "questions") {
      target.innerHTML = [
        flowHead("Tehotenská knižka", "Otázky pre lekára", "Krátky zoznam na najbližšiu kontrolu.", 0, 1),
        "<div class='v5-book-question-add'><input id='v5PregnancyQuestion' maxlength='120' placeholder='Čo sa chcem opýtať?'><button type='button' data-v5-book-add-question aria-label='Pridať otázku'>＋</button></div>",
        state.v5.pregnancyQuestions.length ? "<div class='v5-book-question-list'>" + state.v5.pregnancyQuestions.map((question, index) => "<div><span>" + escapeHtml(question) + "</span><button type='button' data-v5-book-remove-question='" + index + "' aria-label='Odstrániť otázku'>×</button></div>").join("") + "</div>" : "<div class='v5-empty'>Zatiaľ nemáte uloženú otázku.</div>",
        "<button class='v5-check-categories-button' type='button' data-v5-book-home>", icon("back"), " Tehotenská knižka</button>"
      ].join("");
      return;
    }
    const labels = { baby: ["Bábätko", "baby"], mother: ["Mama", "health"], week: ["Tento týždeň", "calendar"] };
    const selected = labels[section] || labels.week;
    target.innerHTML = [
      flowHead("Tehotenská knižka", selected[0], week ? week + ". týždeň" : "Aktuálne obdobie", 0, 1),
      "<div class='v5-book-detail-list'>", data[section].map(item => "<div><span class='v5-icon'>" + icon(selected[1]) + "</span><strong>" + escapeHtml(item) + "</strong></div>").join(""), "</div>",
      section === "week" ? "<div class='v5-actions'><button class='v5-primary' type='button' data-v5-feature='calendar'>Otvoriť kontroly</button><button class='v5-secondary' type='button' data-v5-book-section='questions'>Pridať otázku</button></div>" : "",
      "<button class='v5-check-categories-button' type='button' data-v5-book-home>", icon("back"), " Tehotenská knižka</button>"
    ].join("");
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
    target.innerHTML = "<div class='v5-audio-dock-inner'><span class='v5-timer-icon'>" + icon("sound") + "</span><div><strong>" + escapeHtml(audio.title || "Zvuk") + "</strong><span>" + (remaining ? "Vypne sa približne o " + remaining + " min" : "Prehráva sa na pozadí") + "</span></div><button type='button' data-v5-feature='sleep'>Spánok</button><button type='button' data-v5-action='stop-audio'>Vypnúť</button></div><div class='v5-audio-controls'><label>Hlasitosť <input id='v5AudioVolume' type='range' min='4' max='45' value='" + escapeHtml(audio.volume || 18) + "'></label><label>Časovač <select id='v5AudioTimer'><option value=''>Bez časovača</option><option value='15'>15 min</option><option value='30'>30 min</option><option value='60'>60 min</option></select></label></div>";
  }

  function renderSounds() {
    const target = byId("v5SoundsContent");
    if (!target) return;
    const lullabies = (state.lullabies || []).slice().reverse();
    target.innerHTML = flowHead("Spánok", "Zvuky a rodinné uspávanky", "Každý rodič ich pustí jedným klepnutím.", 0, 1) +
      "<div class='v5-choice-grid'>" +
      "<button class='v5-choice' type='button' data-v5-audio-type='white' data-v5-audio-title='Biely šum'><span class='v5-icon'>" + icon("sound") + "</span><span><strong>Biely šum</strong><small>Jemné stále pozadie.</small></span></button>" +
      "<button class='v5-choice' type='button' data-v5-audio-type='lullaby-soft' data-v5-audio-title='Jemná uspávanka'><span class='v5-icon'>" + icon("sound") + "</span><span><strong>Jemná melódia</strong><small>Predvolená pokojná hudba.</small></span></button>" +
      "<button class='v5-choice' type='button' data-v5-action='open-original-sounds'><span class='v5-icon'>" + icon("family") + "</span><span><strong>Nahrať uspávanku</strong><small>Hlas mamy, otca alebo blízkej osoby.</small></span></button></div>" +
      (lullabies.length ? "<section class='v5-shared-lullabies'><div class='v5-compact-head'><div><h3>Naše nahrávky</h3><p>Spoločná knižnica rodičov.</p></div></div><div class='v5-lullaby-quick-list'>" + lullabies.map(item => "<button type='button' data-v5-play-lullaby='" + escapeHtml(item.id) + "'><span class='v5-icon'>" + icon("sound") + "</span><span><strong>" + escapeHtml(item.title || "Rodinná uspávanka") + "</strong><small>" + escapeHtml(item.author === "otec" ? "Nahral otec" : item.author === "mama" ? "Nahrala mama" : "Rodinná nahrávka") + "</small></span><b>Prehrať</b></button>").join("") + "</div></section>" : "") +
      "<div class='v5-info-box'>Zvuk má byť iba jemným pozadím. Telefón ani reproduktor nedávajte k hlave dieťaťa.</div>";
  }

  function updateHeader() {
    const view = currentView();
    const title = view === "v5Flow" && state.v5.flow?.type === "teeth-intro"
      ? ["Zúbky", "Odporúčanie podľa veku"]
      : view === "v5Checklists" && state.profile.status === "expecting"
        ? ["Moja príprava", "Taška, domov a vybavenie"]
      : viewTitles[view] || ["Guguboo", "Rodinný pomocník"];
    byId("v5Header").dataset.home = String(view === "home");
    byId("v5HeaderTitle").textContent = title[0];
    byId("v5HeaderSubtitle").textContent = title[1];
    byId("v5Header").querySelector("[data-v5-night]")?.setAttribute("aria-pressed", String(document.body.classList.contains("night")));
    renderBottomBar();
    syncUniversalWindow();
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
    if (currentView() === "v5PregnancyBook") renderPregnancyBook();
    if (currentView() === "v5Sounds") renderSounds();
    if (currentView() === "v5Care") renderCare();
    if (currentView() === "v5Utility") renderUtility();
    if (currentView() === "v5AdaptiveO") renderAdaptiveO();
    byId("v5DrawerTip").hidden = true;
  }

  function handleFlowChoice(choiceKey) {
    const flow = state.v5.flow;
    if (choiceKey === "sleep-sounds") {
      if (flow?.context === "adaptive-o" && byId("v5OOverlay")?.classList.contains("open")) {
        state.v5.adaptiveO.modalParent = "sleep";
        persist();
        byId("v5OMenuTitle").textContent = "Zvuky na zaspávanie";
        byId("v5OMenuSubtitle").textContent = "Vyberte jeden zvuk";
        byId("v5OMenuBack").hidden = false;
        byId("v5OMenuBody").innerHTML = "<div class='v5-o-feature-choices'>" +
          quickAudioButton("white", "Biely šum") +
          quickAudioButton("rain", "Dážď") +
          quickAudioButton("heart", "Tlkot srdca") +
          quickAudioButton("lullaby-soft", "Uspávanka") + "</div>";
        return;
      }
      state.v5.soundSection = "home";
      persist();
      routeTo("v5Sounds");
      renderSounds();
      return;
    }
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
      const labels = { wet: "Cikalo", dirty: "Kakalo", both: "Cikalo aj kakalo", dry: "Iba kontrola" };
      flow.data.diaper = choiceKey.replace("diaper-", "");
      flow.data.diaperLabel = labels[flow.data.diaper];
      flow.step = 1;
    } else if (flow.type === "bath") {
      const bathTypes = {
        full: { label: "Celý kúpeľ", icon: "bath" },
        hair: { label: "Umývanie vláskov", icon: "sparkle" },
        body: { label: "Umývanie telíčka", icon: "baby" }
      };
      flow.data.bath = choiceKey.replace("bath-", "");
      flow.data.bathLabel = bathTypes[flow.data.bath]?.label || "Kúpanie";
      flow.data.bathIcon = bathTypes[flow.data.bath]?.icon || "bath";
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
    const nextStatus = byId("v5ChildStatus").value;
    const nextBirth = byId("v5ChildBirth").value;
    if (nextStatus !== "expecting" && nextBirth) {
      const parsedBirth = new Date(nextBirth + "T12:00:00");
      const ageDays = Math.floor((Date.now() - parsedBirth.getTime()) / 86400000);
      if (!Number.isFinite(parsedBirth.getTime()) || ageDays < 0 || ageDays > 2192) {
        byId("v5ChildBirth")?.focus();
        return announce("Skontrolujte dátum narodenia dieťaťa.");
      }
    }
    state.profile.name = byId("v5ChildName").value.trim();
    state.profile.status = nextStatus;
    state.profile.sex = byId("v5ChildSex").value;
    state.profile.due = byId("v5ChildDue").value;
    state.profile.birth = nextBirth;
    state.profile.birthTime = byId("v5ChildBirthTime").value;
    state.profile.birthPlace = byId("v5ChildBirthPlace").value.trim();
    state.profile.gestationalWeek = byId("v5ChildGestWeek").value ? Number(byId("v5ChildGestWeek").value) : "";
    state.profile.gestationalDay = byId("v5ChildGestDay").value !== "" ? Number(byId("v5ChildGestDay").value) : "";
    state.profile.weight = byId("v5ChildBirthWeight").value.trim();
    state.profile.height = byId("v5ChildBirthHeight").value.trim();
    state.profile.currentWeight = byId("v5ChildCurrentWeight").value.trim();
    state.profile.currentHeight = byId("v5ChildCurrentHeight").value.trim();
    state.profile.headCircumference = byId("v5ChildHead").value.trim();
    state.profile.diaperSize = byId("v5ChildDiaperSize")?.value || "";
    state.profile.insurance = byId("v5ChildInsurance").value.trim();
    state.profile.pediatrician = byId("v5ChildPediatrician").value.trim();
    state.profile.notes = byId("v5ChildNotes").value.trim();
    state.welcomeStatus = state.profile.status;
    if (typeof save === "function") save(); else persist();
    renderAll();
    announce("Profil dieťaťa je uložený a údaje sa použijú v súvisiacich funkciách.");
  }

  document.addEventListener("click", event => {
    if (event.target.closest("[data-v5-window-cancel]")) return openHome();
    if (event.target.closest("[data-v5-window-back]")) return universalWindowBack();
    const prenatalGlance = event.target.closest("[data-v5-prenatal-glance]");
    if (prenatalGlance) {
      const action = prenatalGlance.dataset.v5PrenatalGlance;
      if (action === "organization") {
        state.v5.circleMode = "organize";
        persist();
        renderHome();
        return announce("Zobrazená príprava pred pôrodom.");
      }
      if (action === "hospital") return openOrganizationMenu("hospital");
      return openFeature(action);
    }
    const circleMode = event.target.closest("[data-v5-circle-mode]");
    if (circleMode) {
      state.v5.circleMode = circleMode.dataset.v5CircleMode;
      persist();
      renderHome();
      return announce(state.v5.circleMode === "organize" ? "Zobrazená organizácia." : "Zobrazený kruh pohody.");
    }
    const organizationSection = event.target.closest("[data-v5-org-section]");
    if (organizationSection) {
      openOrganizationMenu(organizationSection.dataset.v5OrgSection);
      return;
    }
    const organizationComplete = event.target.closest("[data-v5-org-complete]");
    if (organizationComplete) {
      state.checks[organizationComplete.dataset.v5OrgComplete] = true;
      persist();
      renderHome();
      renderOrganizationMenu(state.v5.organizationSection);
      return announce("Hotovo. Zobrazuje sa ďalšia úloha.");
    }
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
    const adaptiveSection = event.target.closest("[data-v5-o-section]");
    if (adaptiveSection) {
      openAdaptiveO(adaptiveSection.dataset.v5OSection);
      return;
    }
    const partnerRequest = event.target.closest("[data-v5-partner-request]");
    if (partnerRequest) return savePartnerRequest(partnerRequest.dataset.v5PartnerRequest);
    const adaptiveRole = event.target.closest("[data-v5-o-role]");
    if (adaptiveRole) {
      state.v5.adaptiveO.role = adaptiveRole.dataset.v5ORole;
      state.v5.adaptiveO.editing = false;
      persist();
      renderAdaptiveO();
      renderHome();
      return announce(state.v5.adaptiveO.role === "partner" ? "Zobrazené ciele pre partnera." : "Zobrazené ciele pre mamu.");
    }
    if (event.target.closest("[data-v5-o-edit]")) {
      state.v5.adaptiveO.editing = !state.v5.adaptiveO.editing;
      persist();
      renderAdaptiveO();
      return;
    }
    const adaptiveTrack = event.target.closest("[data-v5-o-track]");
    if (adaptiveTrack) {
      const sectionId = state.v5.adaptiveO.section;
      const role = state.v5.adaptiveO.role;
      const goalId = adaptiveTrack.dataset.v5OTrack;
      const selected = adaptiveOSelectedGoalIds(role, sectionId);
      state.v5.adaptiveO.selected[role][sectionId] = selected.includes(goalId)
        ? selected.filter(id => id !== goalId)
        : [...selected, goalId];
      persist();
      renderAdaptiveO();
      renderHome();
      return announce(selected.includes(goalId) ? "Cieľ už nesledujete." : "Cieľ je pridaný do vášho O.");
    }
    const adaptiveComplete = event.target.closest("[data-v5-o-complete]");
    if (adaptiveComplete) {
      const sectionId = state.v5.adaptiveO.section;
      const role = "mother";
      const goal = (adaptiveOGoals[sectionId] || []).find(item => item.id === adaptiveComplete.dataset.v5OComplete);
      if (!goal || goal.auto) return;
      if (goal.id === "ask-help" && !adaptiveOGoalDone(role, sectionId, goal)) {
        renderPartnerRequestMenu();
        return;
      }
      const key = adaptiveOCompletionKey(role, sectionId, goal);
      state.v5.adaptiveO.completed[key] = !state.v5.adaptiveO.completed[key];
      persist();
      renderHome();
      renderAdaptiveOMenu();
      return announce(state.v5.adaptiveO.completed[key] ? "Malý cieľ je hotový." : "Cieľ je opäť otvorený.");
    }
    const adaptiveOpen = event.target.closest("[data-v5-o-open]");
    if (adaptiveOpen) {
      const goal = (adaptiveOGoals[state.v5.adaptiveO.section] || []).find(item => item.id === adaptiveOpen.dataset.v5OOpen);
      if (goal) renderAdaptiveOFeature(goal.id);
      return;
    }
    const adaptiveQuick = event.target.closest("[data-v5-o-quick]");
    if (adaptiveQuick) {
      const goalId = state.v5.adaptiveO.modalGoal;
      const label = adaptiveQuick.dataset.v5OQuick;
      const type = goalId === "fresh-air" ? "Vonku" : "Aktivita";
      state.events.push({ id: createId(), type, value: label, note: "", created: new Date().toISOString() });
      if (goalId) state.v5.adaptiveO.completed[adaptiveOCompletionKey(state.v5.adaptiveO.role, state.v5.adaptiveO.section, { id: goalId, cadence: "day" })] = true;
      persist();
      return completeAdaptiveOModal(label + " je uložené.");
    }
    const adaptiveSave = event.target.closest("[data-v5-o-save]");
    if (adaptiveSave) return saveAdaptiveOFeature(adaptiveSave.dataset.v5OSave);
    if (event.target.closest("[data-v5-o-back]")) {
      state.v5.flow = { type: "", step: 0, data: {} };
      if (state.v5.adaptiveO.modalParent === "sleep") {
        state.v5.adaptiveO.modalParent = "";
        state.v5.flow = { type: "sleep", step: 0, data: {}, context: "adaptive-o" };
        persist();
        byId("v5OMenuTitle").textContent = "Spánok";
        byId("v5OMenuSubtitle").textContent = "Časomiera, zobudenie a prehľad";
        byId("v5OMenuBody").innerHTML = "<div class='v5-flow v5-o-feature-flow' id='v5OFeatureContent'></div>";
        renderFlow();
        return;
      }
      persist();
      if (state.v5.adaptiveO.modalSource === "quick") {
        closeAdaptiveOMenu();
        state.v5.adaptiveO.modalSource = "";
        persist();
        openQuickRecord();
        return;
      }
      if (state.v5.adaptiveO.modalSource === "calendar") {
        openCalendarModal();
        return;
      }
      if (state.v5.adaptiveO.modalSource === "care") {
        openCareQuestionModal();
        return;
      }
      if (state.v5.adaptiveO.modalSource === "organization") {
        closeAdaptiveOMenu();
        renderHome();
        return;
      }
      renderAdaptiveOMenu();
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
    const pinButton = event.target.closest("[data-v5-pin-feature]");
    if (pinButton) {
      const key = pinButton.dataset.v5PinFeature;
      if (!features[key] || !favoriteOptions(state.profile.status || "expecting").includes(key)) return;
      if (state.v5.favorites.includes(key)) return announce(features[key].label + " už je pripnutá v spodnom menu.");
      const removed = state.v5.favorites.length >= 4 ? state.v5.favorites.pop() : "";
      state.v5.favorites.push(key);
      state.v5.favoritesCustomized = true;
      persist();
      renderDrawer();
      renderBottomBar();
      return announce(removed ? features[key].label + " je pripnutá namiesto " + features[removed].label + "." : features[key].label + " je pripnutá v spodnom menu.");
    }
    if (event.target.closest("[data-v5-calendar-save]")) return saveCalendarEvent();
    const calendarDone = event.target.closest("[data-v5-calendar-done]");
    if (calendarDone) return updateCalendarEvent(calendarDone.dataset.v5CalendarDone);
    const calendarDelete = event.target.closest("[data-v5-calendar-delete]");
    if (calendarDelete && window.confirm("Naozaj chcete túto udalosť vymazať?")) return updateCalendarEvent(calendarDelete.dataset.v5CalendarDelete, true);
    const utilityAdd = event.target.closest("[data-v5-utility-add]");
    if (utilityAdd) {
      const section = utilityAdd.dataset.v5UtilityAdd;
      if (section === "shopping") {
        const item = byId("v5UtilityItem")?.value.trim() || "";
        if (!item) return announce("Napíšte, čo treba kúpiť.");
        state.shopping.push({ item, category: "Rodina", note: byId("v5UtilityNote")?.value.trim() || "", created: new Date().toISOString() });
      } else if (section === "contacts") {
        const name = byId("v5UtilityName")?.value.trim() || "";
        if (!name) return announce("Doplňte meno alebo názov kontaktu.");
        state.contacts.push({ name, type: byId("v5UtilityType")?.value || "Iné", phone: byId("v5UtilityPhone")?.value.trim() || "", email: "", hours: "" });
      } else if (section === "products") {
        const item = byId("v5UtilityProduct")?.value.trim() || "";
        if (!item) return announce("Doplňte názov produktu.");
        state.productFavorites.push({ item, brand: byId("v5UtilityBrand")?.value.trim() || "", size: byId("v5UtilitySize")?.value.trim() || "", note: "" });
      } else if (section === "family") {
        const task = byId("v5UtilityTask")?.value.trim() || "";
        if (!task) return announce("Doplňte rodinnú úlohu.");
        state.familyTasks.push({ task, assignee: byId("v5UtilityAssignee")?.value || "rodina", when: "čo najskôr", details: "", created: new Date().toISOString() });
      }
      persist();
      renderHome();
      renderUtility();
      return announce("Uložené.");
    }
    const utilityRemove = event.target.closest("[data-v5-utility-remove]");
    if (utilityRemove) {
      const collections = { shopping: state.shopping, contacts: state.contacts, products: state.productFavorites, family: state.familyTasks };
      const collection = collections[utilityRemove.dataset.v5UtilityRemove];
      const index = Number(utilityRemove.dataset.v5UtilityIndex);
      if (Array.isArray(collection) && Number.isInteger(index) && index >= 0 && index < collection.length) collection.splice(index, 1);
      persist();
      renderHome();
      renderUtility();
      return announce("Hotovo.");
    }
    const productToShopping = event.target.closest("[data-v5-product-to-shopping]");
    if (productToShopping) {
      const product = state.productFavorites[Number(productToShopping.dataset.v5ProductToShopping)];
      if (!product) return;
      state.shopping.push({ item: product.item, category: "Obľúbené", note: [product.brand, product.size].filter(Boolean).join(" · "), created: new Date().toISOString() });
      persist();
      return announce(product.item + " je pridané do nákupu.");
    }
    const utilityCheck = event.target.closest("[data-v5-utility-check]");
    if (utilityCheck) {
      state.checks[utilityCheck.dataset.v5UtilityCheck] = Boolean(utilityCheck.checked);
      persist();
      return announce(utilityCheck.checked ? "Krok je hotový." : "Krok je opäť otvorený.");
    }
    if (event.target.closest("[data-v5-growth-save]")) return saveGrowthMeasurement();
    const growthOpen = event.target.closest("[data-v5-growth-open]");
    if (growthOpen) return openGrowthModal(growthOpen.dataset.v5GrowthOpen);
    const quickFeature = event.target.closest("[data-v5-quick-feature]");
    if (quickFeature) {
      openQuickFeatureModal(quickFeature.dataset.v5QuickFeature);
      return;
    }
    const playLullaby = event.target.closest("[data-v5-play-lullaby]");
    if (playLullaby) {
      const item = (state.lullabies || []).find(lullaby => String(lullaby.id) === playLullaby.dataset.v5PlayLullaby);
      if (!item?.src) return announce("Uspávanka nemá uložený zvuk.");
      if (typeof window.setCustomSound === "function") window.setCustomSound(item.src, item.title, "Rodinná uspávanka");
      const audioElement = byId("customSoundAudio");
      if (audioElement) {
        audioElement.src = item.src;
        audioElement.play().catch(() => announce("Prehrávanie spustíte tlačidlom Play."));
      }
      state.v5.audio = { ...state.v5.audio, active: true, type: "custom", title: item.title || "Rodinná uspávanka", stopAt: "" };
      persist();
      renderAudioDock();
      return announce((item.title || "Uspávanka") + " sa prehráva.");
    }
    const momentsSection = event.target.closest("[data-v5-moments-section]");
    if (momentsSection) {
      state.v5.momentsSection = momentsSection.dataset.v5MomentsSection;
      persist();
      return renderFirst100();
    }
    if (event.target.closest("[data-v5-moments-home]")) {
      state.v5.momentsSection = "home";
      persist();
      return renderFirst100();
    }
    const firstMoment = event.target.closest("[data-v5-first-moment]");
    if (firstMoment) {
      const key = firstMoment.dataset.v5FirstMoment;
      const existingFirst = state.v5.firstMoments.find(item => item.key === key);
      if (existingFirst) {
        state.v5.firstMoments = state.v5.firstMoments.filter(item => item.key !== key);
        persist();
        renderFirst100();
        return announce("Prvý raz bol odznačený.");
      }
      state.v5.firstMoments.push({ key, label: firstMoment.dataset.v5FirstLabel || "Prvý raz", date: new Date().toISOString() });
      persist();
      renderFirst100();
      return announce("Prvý raz je uložený.");
    }
    if (event.target.closest("[data-v5-doctor-visit]")) return openDoctorVisitModal();
    if (event.target.closest("[data-v5-doctor-save]")) return saveDoctorVisit();
    if (event.target.closest("[data-v5-care-question]")) return openCareQuestionModal();
    if (event.target.closest("[data-v5-health-overview]")) return openHealthOverviewModal();
    if (event.target.closest("[data-v5-urgent]")) return openUrgentModal();
    if (event.target.closest("[data-v5-care-sleep]")) {
      openQuickFeatureModal("sleep");
      state.v5.adaptiveO.modalSource = "care";
      persist();
      return;
    }
    const careTopic = event.target.closest("[data-v5-quick-action]");
    if (careTopic?.dataset.v5QuickAction?.startsWith("care-")) return openCareTopic(careTopic.dataset.v5QuickAction);
    const careNext = event.target.closest("[data-v5-care-next]");
    if (careNext) {
      const destination = careNext.dataset.v5CareNext;
      if (destination === "doctor") return openDoctorVisitModal();
      if (destination === "urgent") return openUrgentModal();
      openQuickFeatureModal(destination);
      state.v5.adaptiveO.modalSource = "care";
      persist();
      return;
    }
    const featureButtonElement = event.target.closest("[data-v5-feature]");
    if (featureButtonElement) {
      if (featureButtonElement.dataset.v5Feature === "calendar") return openCalendarModal();
      openFeature(featureButtonElement.dataset.v5Feature);
      return;
    }
    const quickAction = event.target.closest("[data-v5-quick-action]");
    if (quickAction) {
      const action = quickAction.dataset.v5QuickAction;
      if (action === "moment") return openFeature("memories");
      closeQuickRecord();
      if (action === "wake") {
        if (state.sleepTimer?.active) stopSleep();
        state.events.push({ id: createId(), type: "Prebudenie", value: "Zobudenie", note: "", author: "rodina", created: new Date().toISOString() });
        persist();
        renderHome();
        return announce("Zobudenie je uložené.");
      }
      if (action === "note") {
        state.v5.flow = { type: "note", step: 0, data: {} };
      } else {
        const isPee = action === "pee";
        state.v5.flow = {
          type: "diaper",
          step: 1,
          data: { diaper: isPee ? "wet" : "dirty", diaperLabel: isPee ? "Cikalo" : "Kakalo" }
        };
      }
      persist();
      routeTo("v5Flow");
      renderFlow();
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
    if (event.target.closest("[data-v5-open-record]")) return openQuickRecord();
    if (event.target.closest("[data-v5-close-record]")) return closeQuickRecord();
    if (event.target.closest("[data-v5-close-o]")) return cancelAdaptiveOMenu();
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
    const pregnancyBookSection = event.target.closest("[data-v5-book-section]");
    if (pregnancyBookSection) {
      state.v5.pregnancyBookSection = pregnancyBookSection.dataset.v5BookSection;
      persist();
      return renderPregnancyBook();
    }
    if (event.target.closest("[data-v5-book-home]")) {
      state.v5.pregnancyBookSection = "home";
      persist();
      return renderPregnancyBook();
    }
    if (event.target.closest("[data-v5-book-add-question]")) {
      const value = byId("v5PregnancyQuestion")?.value.trim() || "";
      if (!value) return announce("Napíšte otázku.");
      state.v5.pregnancyQuestions.push(value);
      persist();
      renderPregnancyBook();
      return announce("Otázka je uložená.");
    }
    const removePregnancyQuestion = event.target.closest("[data-v5-book-remove-question]");
    if (removePregnancyQuestion) {
      state.v5.pregnancyQuestions.splice(Number(removePregnancyQuestion.dataset.v5BookRemoveQuestion), 1);
      persist();
      return renderPregnancyBook();
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
      if (state.profile.status === "expecting") {
        state.v5.prenatalSection = "home";
        persist();
        skipHistory = true;
        switchView("v5Prenatal");
        return renderPrenatal();
      }
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
      if (v5AudioButton.closest("#v5QuickRecord")) closeQuickRecord();
      renderAudioDock();
      if (v5AudioButton.closest("#v5OMenu") && state.v5.flow?.type !== "sleep") {
        completeAdaptiveOModal((v5AudioButton.dataset.v5AudioTitle || "Zvuk") + " sa prehráva.", "Zvuk môžete kedykoľvek vypnúť v spodnom prehrávači.");
      }
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
    if (action === "stop-sleep-flow") {
      stopSleep();
      closeAdaptiveOMenu();
      openHome();
      return;
    }
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
      const isSolids = state.v5.flow.data.method === "solids";
      const value = isBottle
        ? [byId("v5FeedMilk").value, byId("v5FeedAmount").value ? byId("v5FeedAmount").value + " ml" : ""].filter(Boolean).join(" · ")
        : [byId("v5FeedOther")?.value.trim() || (isSolids ? "Príkrm" : "Iné kŕmenie"), isSolids ? byId("v5FeedPortion")?.value : ""].filter(Boolean).join(" · ");
      state.events.push({ id: createId(), type: "Kŕmenie", value, note: byId("v5FeedNote")?.value.trim() || "", author: "rodina", created: new Date().toISOString(), method: isBottle ? "Fľaša" : isSolids ? "Príkrm" : "Iné" });
      if (typeof save === "function") save(); else persist();
      completeFlow("Kŕmenie je uložené.", "Záznam je dostupný rodine v dnešnom prehľade.");
      return announce("Kŕmenie bolo uložené.");
    }
    if (action === "save-diaper") {
      const value = state.v5.flow.data.diaperLabel || "Prebalenie";
      state.events.push({ id: createId(), type: "Plienka", value, note: byId("v5DiaperNote")?.value.trim() || "", author: "rodina", created: new Date().toISOString(), diaper: { type: state.v5.flow.data.diaper, reason: value } });
      if (typeof save === "function") save(); else persist();
      completeFlow("Prebalenie je uložené.", "Záznam sa zobrazí v dnešnom prehľade.");
      return announce("Prebalenie bolo uložené.");
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
    if (action === "save-bath") {
      const bathLabel = state.v5.flow.data.bathLabel || "Kúpanie";
      state.events.push({ id: createId(), type: "Kúpanie", value: bathLabel, note: byId("v5BathNote")?.value.trim() || "", author: "rodina", created: new Date().toISOString(), bathType: state.v5.flow.data.bath || "full" });
      if (typeof save === "function") save(); else persist();
      completeFlow("Kúpanie je uložené.", "Záznam sa zobrazí v dnešnom rodinnom prehľade.");
      return announce("Kúpanie bolo uložené.");
    }
    if (action === "save-quick-note") {
      const text = byId("v5QuickNoteText")?.value.trim() || "";
      if (!text) return announce("Napíšte krátku poznámku.");
      const time = byId("v5QuickNoteTime")?.value ? new Date(byId("v5QuickNoteTime").value) : new Date();
      if (!Number.isFinite(time.getTime())) return announce("Skontrolujte čas poznámky.");
      state.events.push({ id: createId(), type: "Poznámka", value: text, note: "", author: "rodina", created: time.toISOString() });
      if (typeof save === "function") save(); else persist();
      completeFlow("Poznámka je uložená.", "Nájdete ju medzi dnešnými záznamami.");
      return announce("Poznámka bola uložená.");
    }
    if (action === "enter-teeth") {
      skipHistory = true;
      switchView("teeth");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return announce("Zúbky sú otvorené.");
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
    if (action === "export-family-data") {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "guguboo-zaloha-" + todayKey() + ".json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      return announce("Záloha údajov sa sťahuje.");
    }
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
    if (action === "open-original-sounds") {
      closeAdaptiveOMenu();
      return routeTo("sounds");
    }
    if (action === "open-sleep-sounds") {
      closeAdaptiveOMenu();
      state.v5.soundSection = "home";
      persist();
      routeTo("v5Sounds");
      renderSounds();
      return;
    }
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
      item.mood = byId("v5First100Mood")?.value.trim() || item.mood || "";
      item.day = dayOfLife(date);
      item.photo ||= state.v5.pendingFirst100Photo || "";
      state.v5.pendingFirst100Photo = "";
      state.v5.momentsSection = "home";
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
    if (action === "open-birth-card") {
      state.birthCard ||= {};
      state.birthCard.zodiac = state.v5.selectedZodiac || state.birthCard.zodiac || "";
      state.birthCard.zodiacManual = Boolean(state.v5.selectedZodiac);
      if (typeof populateBirthCardForm === "function") populateBirthCardForm();
      return routeTo("birthCard");
    }
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
      byId("v5FavoriteEditor")?.setAttribute("open", "");
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

  byId("v5QuickRecordOverlay").addEventListener("click", event => {
    if (event.target === byId("v5QuickRecordOverlay")) closeQuickRecord();
  });

  byId("v5OOverlay").addEventListener("click", event => {
    if (event.target === byId("v5OOverlay")) cancelAdaptiveOMenu();
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
    byId("v5FavoriteEditor")?.setAttribute("open", "");
    renderBottomBar();
    renderHome();
    announce("Poradie spodného menu bolo zmenené.");
  });

  document.addEventListener("keydown", event => {
    const adaptiveSection = event.target.closest?.("[data-v5-o-section]");
    if (adaptiveSection && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openAdaptiveO(adaptiveSection.dataset.v5OSection);
      return;
    }
    const organizationSection = event.target.closest?.("[data-v5-org-section]");
    if (organizationSection && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openOrganizationMenu(organizationSection.dataset.v5OrgSection);
      return;
    }
    if (event.key === "Escape") {
      if (byId("v5OOverlay").classList.contains("open")) cancelAdaptiveOMenu();
      else if (byId("v5QuickRecordOverlay").classList.contains("open")) closeQuickRecord();
      else if (byId("v5DrawerOverlay").classList.contains("open")) closeDrawer();
      else if (!["home", "welcome", "birthIntro", "pregnancyIntro"].includes(currentView())) universalWindowBack();
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
      if (next === "v5AdaptiveO") renderAdaptiveO();
      if (next === "guguChat") window.GugubooChat?.render?.();
      byId("v5DrawerTip").hidden = true;
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
  // V2: verejné rozhranie pre Journey Engine a GuguChat (guguchat.js), aby nemuseli poznať vnútro v5.
  window.GugubooV5 = {
    openFeature, routeTo, openHome, openQuickRecord, openChecklistCategory, openUrgentModal,
    renderHome, renderBottomBar, renderDrawer, persist, announce, icon, escapeHtml, features
  };
  renderDrawer();
  renderAll();
  syncViewAccessibility();
  updateHeader();
})();

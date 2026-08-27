(function initGugubooV4() {
  if (window.__gugubooV4Loaded) return;
  window.__gugubooV4Loaded = true;

  document.body.classList.add("v4-upgrade");
  state.parentRole = "rodina";
  state.sleepTimer ||= { active: false, start: "", type: "day" };
  state.v4QuickActions = ["sleep", "feed", "diaper", "temperature"];
  state.v4ReportRange ||= 7;

  const v4ViewNames = {
    home: ["Domov", "Dnešný rodinný prehľad"],
    apps: ["Aplikácie", "Všetky funkcie Guguboo na jeden klik"],
    reports: ["Prehľady", "Starostlivosť, zdravie a vývoj na jednom mieste"],
    tracker: ["Dnes", "Rýchle denné záznamy"],
    sleep: ["Spánok", "Časovač, história a súvislosti"],
    sounds: ["Zvuky", "Uspávanky a pokojné šumy"],
    night: ["Nočná pomoc", "Pokojný postup krok po kroku"],
    guide: ["Sprievodca", "Bezpečná orientačná pomoc"],
    growth: ["Rast", "Merania a prehľad vývoja"],
    health: ["Zdravie", "Zdravotné poznámky a report"],
    contacts: ["Kontakty", "Dôležití ľudia a služby"],
    travel: ["Cestovanie", "Príprava podľa cieľa cesty"],
    shopping: ["Nákup", "Spoločný rodinný zoznam"],
    family: ["Rodina", "Jedno spoločné prostredie"],
    diary: ["Spomienky", "Fotky, texty a rodinná časová os"],
    birthCard: ["Kartička narodenia", "Automaticky z údajov dieťaťa"],
    calendar: ["Kalendár", "Pripomienky celej rodiny"],
    beforeBirth: ["Pred narodením", "Príprava krok po kroku"],
    checklists: ["Checklisty", "Užitočné zoznamy podľa situácie"],
    firstYear: ["Prvé dva roky", "Obsah podľa aktuálneho obdobia"],
    products: ["Produkty", "Čo rodina používa"],
    stateSupport: ["Úrady", "Lokálne kroky a kontakty"],
    memoryOutput: ["Rodinná kronika", "Výstupy z uložených okamihov"],
    premium: ["Premium", "Rozšírené rodinné prostredie"],
    gift: ["Darček", "Guguboo pre blízku rodinu"],
    children: ["Deti", "Rodinné profily"],
    urgent: ["Čo sa deje?", "Najbližší bezpečný krok"],
    pregnancyGrowth: ["Tehotenstvo", "Ako rastie bábätko"],
    assistant: ["Pomocník", "Zhrnutie a ďalší krok"]
  };

  const v4ActionCatalog = {
    sleep: { icon: "😴", label: "Spánok", tab: "sleep" },
    feed: { icon: "🍼", label: "Kŕmenie", tab: "feed" },
    diaper: { icon: "🧷", label: "Prebalenie", tab: "diaper" },
    memory: { icon: "💛", label: "Spomienka", tab: "memory" },
    temperature: { icon: "🌡️", label: "Teplota", view: "tracker", eventType: "Teplota" },
    growth: { icon: "📏", label: "Rast", view: "growth" }
  };

  const v4AppGroups = [
    {
      tier: "free",
      title: "Free",
      copy: "Bezplatný vstup, príprava a základné utility. Tieto funkcie zostávajú bezplatné aj po narodení.",
      apps: [
        ["➕", "Základné denné záznamy", "Kŕmenie, prebalenie, teplota a krátka poznámka.", "tracker"],
        ["🤰", "Pred narodením", "Pôrodnica, taška, pediater a prvé dni doma.", "beforeBirth"],
        ["🫶", "Tehotenstvo", "Obdobie tehotenstva a rast bábätka.", "pregnancyGrowth"],
        ["✅", "Checklisty", "Zoznamy podľa obdobia a konkrétnej situácie.", "checklists"],
        ["📇", "Dôležité kontakty", "Pediater, pohotovosť, poisťovňa a blízke osoby.", "contacts"],
        ["🧳", "Cestovanie", "Balenie, lekárnička, mesto a pomoc v okolí.", "travel"],
        ["🏛️", "Úrady a podpora", "Lokálne kroky, dávky a dôležité kontakty.", "stateSupport"],
        ["🚨", "Urgentná orientácia", "Varovné signály a bezpečný ďalší krok.", "urgent"],
        ["👨‍👩‍👧", "Profil dieťaťa", "Základné údaje dieťaťa a pozvanie druhého rodiča.", "children"]
      ]
    },
    {
      tier: "premium",
      title: "Premium po narodení · od 4,99 € mesačne",
      copy: "Každodenná spolupráca rodiny, inteligentné súvislosti a osobné výstupy z uložených údajov.",
      apps: [
        ["😴", "Spánok", "Časovač, história a súvislosti spánku.", "sleep"],
        ["🔊", "Zvuky a uspávanky", "Biely šum, uspávanky a vlastné nahrávky.", "sounds"],
        ["▥", "Pokročilé prehľady", "Starostlivosť, zdravie a rast za deň, 7 alebo 30 dní.", "reports"],
        ["✦", "Rýchla AI pomoc", "Otázka vlastnými slovami a odpoveď podľa rodinného kontextu.", "assistant"],
        ["🧭", "Sprievodca", "Otázky krok po kroku a bezpečná orientácia.", "guide"],
        ["🩺", "Zdravotná karta", "Alergie, reakcie, zdravotné udalosti a report.", "health"],
        ["📏", "Rast", "Hmotnosť, výška, obvod hlavy a vývoj meraní.", "growth"],
        ["🌙", "Nočná pomoc", "Rýchly pokojný postup počas náročnej noci.", "night"],
        ["📅", "Rodinný kalendár", "Poradne, termíny a spoločné pripomienky.", "calendar"],
        ["🛒", "Spoločný nákup", "Produkty, značka, veľkosť a alternatíva pre druhého rodiča.", "shopping"],
        ["🤝", "Rodinný prehľad", "Úlohy, rutiny a informácie pri zastúpení druhého rodiča.", "family"],
        ["💛", "Fotky a spomienky", "Rodinný denník, fotografie a časová os.", "diary"],
        ["👶", "Kartička narodenia", "Zdieľaná kartička pripravená z údajov dieťaťa.", "birthCard"],
        ["🌱", "Obsah podľa veku", "Odporúčania podľa aktuálneho obdobia dieťaťa.", "firstYear"],
        ["🧴", "Používané produkty", "Čo dieťa používa a čo treba doplniť.", "products"]
      ]
    },
    {
      tier: "addon",
      title: "Voliteľné doplnky",
      copy: "Jednorazové výstupy a darčeky mimo mesačného predplatného.",
      apps: [
        ["🎞️", "Rodinná kronika", "Plagát, fotokniha alebo video z uložených spomienok.", "memoryOutput"],
        ["🎁", "Darček", "Guguboo alebo pamätný výstup pre blízku rodinu.", "gift"]
      ]
    }
  ];

  let v4ViewHistory = [];
  let v4PreviousView = "home";
  let v4NavigatingBack = false;
  let v4TimerInterval = null;

  function v4CurrentView() {
    return document.querySelector(".view.active")?.id || "home";
  }

  function v4Escape(value) {
    return String(value ?? "").replace(/[&<>'"]/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[character]);
  }

  function v4TodayKey(dateValue = new Date()) {
    const date = new Date(dateValue);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function v4DurationParts(milliseconds) {
    const totalMinutes = Math.max(0, Math.floor(milliseconds / 60000));
    return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60, totalMinutes };
  }

  function v4DurationText(milliseconds) {
    const parts = v4DurationParts(milliseconds);
    return `${parts.hours ? `${parts.hours} h ` : ""}${parts.minutes} min`;
  }

  function v4ClockText(value) {
    if (!value) return "–";
    return new Date(value).toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" });
  }

  function v4LatestEvent(type) {
    return state.events
      .filter(event => event.type === type)
      .slice()
      .sort((a, b) => String(b.created).localeCompare(String(a.created)))[0];
  }

  function v4AgeSummary() {
    if (state.profile.status !== "born" || !state.profile.birth) return "Obsah podľa fázy rodiny";
    const birth = new Date(`${state.profile.birth}T12:00:00`);
    const days = Math.max(0, Math.floor((Date.now() - birth.getTime()) / 86400000));
    if (days < 14) return `${days}. deň života`;
    if (days < 70) {
      const weeks = Math.floor(days / 7);
      return `${weeks} ${weeks === 1 ? "týždeň" : weeks < 5 ? "týždne" : "týždňov"}`;
    }
    if (days < 730) {
      const months = Math.floor(days / 30.4375);
      return `${months} ${months === 1 ? "mesiac" : months < 5 ? "mesiace" : "mesiacov"}`;
    }
    const years = Math.floor(days / 365.25);
    return `${years} ${years === 1 ? "rok" : years < 5 ? "roky" : "rokov"}`;
  }

  function v4GestationalData() {
    let week = Number(state.profile.gestationalWeek);
    let day = Number(state.profile.gestationalDay || 0);
    if ((!week || week < 20 || week > 42) && state.profile.birth && state.profile.due) {
      const birth = new Date(`${state.profile.birth}T12:00:00`);
      const due = new Date(`${state.profile.due}T12:00:00`);
      const earlyDays = Math.round((due - birth) / 86400000);
      const gestationDays = 280 - earlyDays;
      week = Math.floor(gestationDays / 7);
      day = Math.max(0, gestationDays % 7);
    }
    if (!week || week < 20 || week > 42) return null;
    return { week, day: Math.min(6, Math.max(0, day)) };
  }

  function v4CorrectedAgeText() {
    if (state.profile.status !== "born" || !state.profile.birth) return "";
    const gestation = v4GestationalData();
    if (!gestation || gestation.week >= 40) return "";
    const birth = new Date(`${state.profile.birth}T12:00:00`);
    const chronologicalDays = Math.max(0, Math.floor((Date.now() - birth.getTime()) / 86400000));
    if (chronologicalDays > 730) return "";
    const correction = Math.max(0, 280 - (gestation.week * 7 + gestation.day));
    const corrected = Math.max(0, chronologicalDays - correction);
    const format = days => days < 70 ? `${days} dní` : `${Math.floor(days / 30.4375)} mes.`;
    return `Narodené v ${gestation.week}+${gestation.day}. Chronologický vek ${format(chronologicalDays)}, orientačný korigovaný vek ${format(corrected)}.`;
  }

  function v4AddVersionBadge() {
    const brandCopy = document.querySelector(".brand-copy");
    if (!brandCopy || brandCopy.querySelector(".v4-version-badge")) return;
    brandCopy.insertAdjacentHTML("beforeend", '<span class="v4-version-badge">nová beta V4</span>');
  }

  function v4AddContextBar() {
    const main = document.querySelector(".main");
    if (!main || document.getElementById("v4ContextBar")) return;
    main.insertAdjacentHTML("afterbegin", `
      <div id="v4ContextBar" data-home="true">
        <button class="v4-back" id="v4BackBtn" type="button" aria-label="Späť">←</button>
        <div class="v4-context-copy"><strong id="v4ContextTitle">Domov</strong><span id="v4ContextSubtitle">Dnešný rodinný prehľad</span></div>
        <button class="v4-context-action" id="v4ContextTools" type="button" aria-label="Všetky aplikácie">▦</button>
      </div>`);
  }

  function v4AddDesktopNav() {
    const sidebar = document.querySelector(".sidebar");
    const actions = sidebar?.querySelector(".side-actions");
    if (!sidebar || !actions || document.getElementById("v4DesktopNav")) return;
    actions.insertAdjacentHTML("beforebegin", '<nav id="v4DesktopNav" aria-label="Hlavné časti novej aplikácie"></nav>');
    v4RenderDesktopNav();
  }

  function v4RenderDesktopNav() {
    const nav = document.getElementById("v4DesktopNav");
    if (!nav) return;
    const expecting = state.profile.status === "expecting";
    document.getElementById("v4AiFab")?.classList.toggle("v4-phase-hidden", expecting);
    nav.innerHTML = expecting ? `
      <div class="v4-nav-label">Prehľad</div>
      <button type="button" data-v4-view="home">🏠 Domov</button>
      <button type="button" data-v4-view="apps">▦ Všetky aplikácie</button>
      <div class="v4-nav-label">Free</div>
      <button type="button" data-v4-view="beforeBirth">🤰 Pred narodením</button>
      <button type="button" data-v4-view="checklists">✅ Checklisty</button>
      <button type="button" data-v4-view="travel">🧳 Cestovanie</button>
      <button type="button" data-v4-view="contacts">📇 Kontakty</button>
      <button type="button" data-v4-view="tracker">➕ Základné záznamy</button>
      <div class="v4-nav-label">Po narodení</div>
      <button class="v4-premium-nav" type="button" data-v4-view="premium">💎 Čo odomkne Premium</button>` : `
      <div class="v4-nav-label">Dnes</div>
      <button type="button" data-v4-view="home">🏠 Domov</button>
      <button type="button" data-v4-view="tracker">➕ Denné záznamy</button>
      <button type="button" data-v4-quick="sleep">😴 Spánok</button>
      <button type="button" data-v4-view="sounds">🔊 Zvuky a uspávanky</button>
      <div class="v4-nav-label">Premium</div>
      <button type="button" data-v4-view="reports">▥ Prehľady</button>
      <button class="v4-ai-nav" type="button" data-v4-view="assistant">✦ Rýchla AI pomoc</button>
      <button type="button" data-v4-view="family">🤝 Rodina</button>
      <button type="button" data-v4-view="diary">💛 Spomienky</button>
      <div class="v4-nav-label">Všetko</div>
      <button type="button" data-v4-view="apps">▦ Všetky aplikácie</button>`;
    v4BindDynamicButtons(nav);
  }

  function v4AddBottomNav() {
    if (document.getElementById("v4BottomNav")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <nav id="v4BottomNav" aria-label="Spodná navigácia">
        <button type="button" data-v4-view="home"><span>🏠</span><span>Domov</span></button>
        <button type="button" data-v4-view="tracker"><span>◷</span><span>Dnes</span></button>
        <button class="v4-add-main" type="button" data-v4-open-quick aria-label="Pridať záznam">＋</button>
        <button type="button" data-v4-view="reports"><span>▥</span><span>Prehľady</span></button>
        <button type="button" data-v4-view="apps"><span>▦</span><span>Aplikácie</span></button>
      </nav>`);
  }

  function v4AddAiFab() {
    if (document.getElementById("v4AiFab")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <button id="v4AiFab" type="button" data-v4-view="assistant" aria-label="Otvoriť Rýchlu AI pomoc">
        <span>✦</span><strong>AI pomoc</strong>
      </button>`);
  }

  function v4QuickSheetHtml() {
    return `
      <div id="v4QuickSheet" aria-hidden="true">
        <div class="v4-sheet-card" role="dialog" aria-modal="true" aria-labelledby="v4QuickTitle">
          <div class="v4-sheet-head">
            <div><h2 id="v4QuickTitle">Rýchly záznam</h2><p>Jedna hlavná vec, minimum krokov.</p></div>
            <button class="v4-sheet-close" type="button" data-v4-close aria-label="Zavrieť">×</button>
          </div>
          <div class="v4-quick-tabs" role="tablist">
            <button class="active" type="button" data-v4-tab="sleep">😴 Spánok</button>
            <button type="button" data-v4-tab="feed">🍼 Kŕmenie</button>
            <button type="button" data-v4-tab="diaper">🧷 Prebalenie</button>
            <button type="button" data-v4-tab="memory">💛 Spomienka</button>
          </div>
          <section class="v4-quick-panel active" data-v4-panel="sleep">
            <div class="v4-live-timer"><div><strong id="v4SleepTimer">00:00</strong><span id="v4SleepStatus">Časovač nie je spustený</span></div></div>
            <label>Typ spánku
              <select id="v4SleepType"><option value="day">Denný spánok</option><option value="night">Nočný spánok</option></select>
            </label>
            <div class="v4-sheet-actions">
              <button class="primary" id="v4SleepToggle" type="button">Spustiť spánok</button>
              <button id="v4SleepOpenHistory" type="button">Otvoriť históriu</button>
            </div>
          </section>
          <section class="v4-quick-panel" data-v4-panel="feed">
            <div class="v4-form-grid">
              <label>Spôsob
                <select id="v4FeedMethod"><option>Dojčenie</option><option>Fľaša</option><option>Umelé mlieko</option><option>Odsávanie</option><option>Príkrm</option></select>
              </label>
              <label>Strana pri dojčení
                <select id="v4FeedSide"><option value="">Nevzťahuje sa</option><option>Ľavý prsník</option><option>Pravý prsník</option><option>Oba prsníky</option></select>
              </label>
              <label>Trvanie v minútach<input id="v4FeedDuration" type="number" min="0" max="240" inputmode="numeric" placeholder="napr. 18"></label>
              <label>Množstvo<input id="v4FeedAmount" placeholder="napr. 90 ml"></label>
            </div>
            <label>Poznámka<textarea id="v4FeedNote" placeholder="Voliteľne: reakcia, odgrgnutie alebo čo chcete zachovať"></textarea></label>
            <div class="v4-sheet-actions"><button class="primary" id="v4SaveFeed" type="button">Uložiť kŕmenie</button></div>
          </section>
          <section class="v4-quick-panel" data-v4-panel="diaper">
            <div class="v4-form-grid">
              <label>Obsah<select id="v4DiaperType"><option>Moč</option><option>Stolica</option><option>Moč aj stolica</option><option>Suchá plienka</option></select></label>
              <label>Farba<select id="v4StoolColor"><option value="">Nezadávať</option><option>Žltá</option><option>Hnedá</option><option>Zelená</option><option>Čierna</option><option>Červená</option><option>Biela / sivá</option></select></label>
              <label>Konzistencia<select id="v4StoolConsistency"><option value="">Nezadávať</option><option>Riedka</option><option>Kašovitá</option><option>Tvarovaná</option><option>Tvrdá</option></select></label>
              <label>Množstvo<select id="v4StoolAmount"><option>Malé</option><option selected>Bežné</option><option>Veľké</option></select></label>
            </div>
            <div class="v4-form-grid">
              <label><span><input id="v4StoolMucus" type="checkbox"> Hlien</span></label>
              <label><span><input id="v4StoolBlood" type="checkbox"> Krv</span></label>
              <label><span><input id="v4StoolDiscomfort" type="checkbox"> Nepohoda</span></label>
            </div>
            <label>Poznámka<textarea id="v4DiaperNote" placeholder="Voliteľný kontext: zmena mlieka, jedla, liekov alebo ďalšie príznaky"></textarea></label>
            <div class="v4-warning-note">Záznam pomáha sledovať zmeny, neurčuje diagnózu. Krv, biela/sivá stolica, výrazná apatia, horúčka alebo známky dehydratácie patria pediatrovi alebo urgentnej pomoci podľa stavu dieťaťa.</div>
            <div class="v4-sheet-actions"><button class="primary" id="v4SaveDiaper" type="button">Uložiť prebalenie</button><button id="v4AskAboutStool" type="button">Otvoriť Sprievodcu</button></div>
          </section>
          <section class="v4-quick-panel" data-v4-panel="memory">
            <div class="v4-emotion-card">
              <div><h3>Dnešok sa môže uložiť bez dvojitého vypĺňania</h3><p>Guguboo pripraví návrh z dnešných záznamov. Vy doplníte iba vetu alebo fotografiu.</p></div>
              <button id="v4CreateMemoryDraft" type="button">Pripraviť návrh</button>
            </div>
            <div class="v4-sheet-actions"><button id="v4OpenBirthCard" type="button">Kartička narodenia</button><button id="v4OpenDiary" type="button">Otvoriť spomienky</button></div>
          </section>
        </div>
      </div>`;
  }

  function v4AddSheets() {
    if (!document.getElementById("v4QuickSheet")) document.body.insertAdjacentHTML("beforeend", v4QuickSheetHtml());
    document.getElementById("v4ToolsSheet")?.remove();
  }

  function v4AddDashboard() {
    const home = document.getElementById("home");
    const anchor = home?.querySelector(".home-overview");
    if (!home || !anchor || document.getElementById("v4Dashboard")) return;
    anchor.insertAdjacentHTML("afterend", '<div id="v4Dashboard"></div>');
  }

  function v4AddAppsView() {
    const main = document.querySelector(".main");
    if (!main || document.getElementById("apps")) return;
    main.insertAdjacentHTML("beforeend", `
      <section class="view" id="apps">
        <div id="v4Apps"></div>
      </section>`);
  }

  function v4RenderApps() {
    const target = document.getElementById("v4Apps");
    if (!target) return;
    const tierNames = { free: "FREE", premium: "PREMIUM", addon: "DOPLNOK" };
    const appGroups = state.profile.status === "born"
      ? [v4AppGroups.find(group => group.tier === "premium"), v4AppGroups.find(group => group.tier === "free"), v4AppGroups.find(group => group.tier === "addon")]
      : v4AppGroups;
    const categoryNav = appGroups.map((group, index) => `<button class="tier-${group.tier}" type="button" data-v4-app-group="v4AppGroup${index}">${v4Escape(group.title)}</button>`).join("");
    const groups = appGroups.map((group, index) => `
      <section class="v4-app-group tier-${group.tier}" id="v4AppGroup${index}">
        <header><div><span class="v4-tier-badge">${tierNames[group.tier]}</span><h2>${v4Escape(group.title)}</h2></div><p>${v4Escape(group.copy)}</p></header>
        <div class="v4-app-grid">
          ${group.apps.map(([icon, title, copy, view]) => `
            <button class="v4-app-card" type="button" data-v4-view="${view}">
              <span class="v4-app-icon">${icon}</span>
              <span class="v4-app-copy"><strong>${v4Escape(title)}</strong><small>${v4Escape(copy)}</small></span>
              <span class="v4-app-open"><i>${tierNames[group.tier]}</i> Otvoriť <b>›</b></span>
            </button>`).join("")}
        </div>
      </section>`).join("");
    target.innerHTML = `
      <header class="v4-apps-head">
        <div><span class="v4-eyebrow">Všetko na jednom mieste</span><h1>Aplikácie Guguboo</h1><p>Free, Premium a jednorazové doplnky sú oddelené. Každú funkciu otvoríte priamo bez zaškrtávania a skrytých menu.</p></div>
        <button type="button" data-v4-view="assistant">✦ Opýtať sa AI pomocníka</button>
      </header>
      <nav class="v4-app-category-nav" aria-label="Kategórie aplikácií">${categoryNav}</nav>
      <div class="v4-app-groups">${groups}</div>`;
    target.querySelectorAll("[data-v4-app-group]").forEach(button => button.addEventListener("click", () => {
      document.getElementById(button.dataset.v4AppGroup)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
    v4BindDynamicButtons(target);
  }

  function v4AddReportsView() {
    const main = document.querySelector(".main");
    if (!main || document.getElementById("reports")) return;
    main.insertAdjacentHTML("beforeend", `
      <section class="view" id="reports">
        <div id="v4Reports" aria-live="polite"></div>
      </section>`);
  }

  function v4RecordTime(record) {
    const value = record?.date || record?.created || record?.start || "";
    if (!value) return 0;
    const parsed = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function v4RangeStart(days) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - Math.max(0, days - 1));
    return start.getTime();
  }

  function v4InReportRange(record, days) {
    return v4RecordTime(record) >= v4RangeStart(days);
  }

  function v4SleepMinutes(event) {
    const start = new Date(event?.start || "").getTime();
    const end = new Date(event?.end || "").getTime();
    if (Number.isFinite(start) && Number.isFinite(end) && end > start) return Math.round((end - start) / 60000);
    const value = String(event?.value || "").replace(",", ".");
    const hours = Number(value.match(/(\d+(?:\.\d+)?)\s*(?:h|hod)/i)?.[1] || 0);
    const minutes = Number(value.match(/(\d+)\s*min/i)?.[1] || 0);
    return Math.round(hours * 60 + minutes);
  }

  function v4ReportDuration(totalMinutes) {
    const minutes = Math.max(0, Math.round(totalMinutes || 0));
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return hours ? `${hours} h ${rest ? `${rest} min` : ""}`.trim() : `${rest} min`;
  }

  function v4ReportDate(value, withTime = true) {
    const timestamp = v4RecordTime(typeof value === "object" ? value : { date: value });
    if (!timestamp) return "Bez dátumu";
    return new Date(timestamp).toLocaleString("sk-SK", withTime
      ? { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }
      : { day: "numeric", month: "short" });
  }

  function v4RenderReports() {
    const target = document.getElementById("v4Reports");
    if (!target) return;
    const allowedRanges = [1, 7, 30];
    const days = allowedRanges.includes(Number(state.v4ReportRange)) ? Number(state.v4ReportRange) : 7;
    state.v4ReportRange = days;
    const events = state.events.filter(item => v4InReportRange(item, days));
    const sleepEvents = events.filter(item => item.type === "Spánok");
    const feedEvents = events.filter(item => item.type === "Kŕmenie");
    const diaperEvents = events.filter(item => item.type === "Plienka");
    const temperatureEvents = events.filter(item => String(item.type || "").toLowerCase().includes("teplota"));
    const latestTemperature = temperatureEvents.slice().sort((a, b) => v4RecordTime(b) - v4RecordTime(a))[0];
    const sleepMinutes = sleepEvents.reduce((sum, item) => sum + v4SleepMinutes(item), 0);
    const growthInRange = state.growth.filter(item => v4InReportRange(item, days));
    const latestGrowth = state.growth.slice().sort((a, b) => v4RecordTime(b) - v4RecordTime(a))[0];
    const reactions = state.reactions.filter(item => v4InReportRange(item, days));
    const incidents = state.incidents.filter(item => v4InReportRange(item, days));
    const memories = state.diary.filter(item => v4InReportRange(item, days));
    const nextReminder = state.reminders
      .filter(item => v4RecordTime(item) >= Date.now())
      .sort((a, b) => v4RecordTime(a) - v4RecordTime(b))[0];
    const growthValue = latestGrowth
      ? [latestGrowth.weight && `${latestGrowth.weight}`, latestGrowth.height && `${latestGrowth.height}`, latestGrowth.head && `hlava ${latestGrowth.head}`].filter(Boolean).join(" · ")
      : [state.profile.weight, state.profile.height].filter(Boolean).join(" · ");

    const timeline = [
      ...events.map(item => ({
        icon: item.type === "Spánok" ? "😴" : item.type === "Kŕmenie" ? "🍼" : item.type === "Plienka" ? "🧷" : item.type === "Teplota" ? "🌡️" : "📝",
        title: item.type || "Záznam", detail: item.value || item.note || "Uložené", time: v4RecordTime(item)
      })),
      ...growthInRange.map(item => ({ icon: "📏", title: "Meranie rastu", detail: [item.weight, item.height, item.head].filter(Boolean).join(" · ") || item.note || "Uložené", time: v4RecordTime(item) })),
      ...incidents.map(item => ({ icon: "🩺", title: item.type || "Zdravotný záznam", detail: item.text || "Uložené", time: v4RecordTime(item) })),
      ...memories.map(item => ({ icon: "💛", title: item.title || "Spomienka", detail: item.text || item.moment || "Uložené", time: v4RecordTime(item) }))
    ].sort((a, b) => b.time - a.time);

    const chartDays = Math.min(days, 7);
    const chartItems = Array.from({ length: chartDays }, (_, index) => {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - (chartDays - 1 - index));
      const key = v4TodayKey(date);
      const count = timeline.filter(item => v4TodayKey(item.time) === key).length;
      return { date, count };
    });
    const maxActivity = Math.max(1, ...chartItems.map(item => item.count));
    const periodLabel = days === 1 ? "dnes" : `za ${days} dní`;
    const rangeButtons = [[1, "Dnes"], [7, "7 dní"], [30, "30 dní"]].map(([range, label]) =>
      `<button type="button" data-v4-report-range="${range}" class="${days === range ? "active" : ""}">${label}</button>`).join("");
    const recentRows = timeline.slice(0, 8).map(item => `
      <li>
        <span class="v4-report-list-icon">${item.icon}</span>
        <span><strong>${v4Escape(item.title)}</strong><small>${v4Escape(item.detail)}</small></span>
        <time>${v4Escape(v4ReportDate(item.time))}</time>
      </li>`).join("");
    const reportCards = [
      ["😴", "Spánok", sleepMinutes ? v4ReportDuration(sleepMinutes) : `${sleepEvents.length}×`, `${sleepEvents.length} záznamov ${periodLabel}`, "sleep"],
      ["🍼", "Kŕmenie", `${feedEvents.length}×`, `uložené ${periodLabel}`, "tracker"],
      ["🧷", "Prebalenie", `${diaperEvents.length}×`, `uložené ${periodLabel}`, "tracker"],
      ["🌡️", "Teplota", latestTemperature?.value || "–", latestTemperature ? `naposledy ${v4ReportDate(latestTemperature.created)}` : "bez merania v období", "tracker"],
      ["📏", "Rast", growthValue || "–", latestGrowth ? `posledné meranie ${v4ReportDate(latestGrowth, false)}` : "zatiaľ bez merania", "growth"],
      ["🩺", "Zdravie", `${incidents.length + reactions.length}×`, `${incidents.length} záznamov · ${reactions.length} reakcií`, "health"],
      ["💛", "Spomienky", `${memories.length}×`, `uložené ${periodLabel}`, "diary"],
      ["📅", "Najbližšie", nextReminder?.title || "Bez pripomienky", nextReminder ? v4ReportDate(nextReminder.date) : "kalendár je voľný", "calendar"]
    ].map(([icon, label, value, note, view]) => `
      <button class="v4-report-card" type="button" data-v4-view="${view}">
        <span class="v4-report-card-icon">${icon}</span>
        <span class="v4-report-card-copy"><small>${label}</small><strong>${v4Escape(value)}</strong><em>${v4Escape(note)}</em></span>
        <span class="v4-report-arrow">›</span>
      </button>`).join("");

    target.innerHTML = `
      <header class="v4-reports-head">
        <div><span class="v4-eyebrow">Súhrn rodiny</span><h2>Prehľady starostlivosti</h2><p>Spánok, kŕmenie, prebalenie, zdravie, rast aj spomienky sú spolu. Každú kartu môžete otvoriť do detailu.</p></div>
        <div class="v4-report-range" aria-label="Obdobie prehľadu">${rangeButtons}</div>
      </header>
      <div class="v4-report-grid">${reportCards}</div>
      <div class="v4-report-layout">
        <article class="v4-report-panel">
          <div class="v4-report-panel-head"><div><span>Aktivita</span><h3>${days === 30 ? "Posledných 7 dní z vybraného obdobia" : days === 1 ? "Dnes" : "Posledných 7 dní"}</h3></div><strong>${timeline.length} záznamov</strong></div>
          <div class="v4-report-bars" role="img" aria-label="Počet uložených záznamov podľa dní">
            ${chartItems.map(item => `<div class="v4-report-bar"><span style="height:${Math.max(item.count ? 18 : 5, Math.round(item.count / maxActivity * 100))}%"><b>${item.count || ""}</b></span><small>${item.date.toLocaleDateString("sk-SK", { weekday: "short" }).replace(".", "")}</small></div>`).join("")}
          </div>
        </article>
        <article class="v4-report-panel">
          <div class="v4-report-panel-head"><div><span>Posledné udalosti</span><h3>Čo bolo uložené</h3></div></div>
          ${recentRows ? `<ul class="v4-report-list">${recentRows}</ul>` : `
            <div class="v4-report-empty"><span>＋</span><strong>Zatiaľ tu nie sú záznamy</strong><p>Pridajte prvý spánok, kŕmenie, prebalenie alebo zdravotnú poznámku.</p><button type="button" data-v4-open-quick>Pridať záznam</button></div>`}
        </article>
      </div>
      <article class="v4-report-shortcuts">
        <div><span>Podrobné prehľady</span><h3>Otvorte konkrétnu oblasť</h3></div>
        <div>
          <button type="button" data-v4-view="sleep">Spánok</button>
          <button type="button" data-v4-view="tracker">Denné záznamy</button>
          <button type="button" data-v4-view="growth">Rast</button>
          <button type="button" data-v4-view="health">Zdravie</button>
          <button type="button" data-v4-view="calendar">Kalendár</button>
          <button type="button" data-v4-view="diary">Spomienky</button>
        </div>
      </article>`;

    target.querySelectorAll("[data-v4-report-range]").forEach(button => button.addEventListener("click", () => {
      state.v4ReportRange = Number(button.dataset.v4ReportRange);
      appStorage.setItem(storeKey, JSON.stringify(state));
      v4RenderReports();
    }));
    target.querySelectorAll("[data-v4-open-quick]").forEach(button => button.addEventListener("click", () => v4OpenQuick("sleep")));
    v4BindDynamicButtons(target);
  }

  function v4ProfileNote() {
    const modalForm = document.querySelector("#profileModal .form-grid");
    if (!modalForm || document.getElementById("v4ProfileAgeNote")) return;
    modalForm.insertAdjacentHTML("afterend", '<div class="v4-age-note" id="v4ProfileAgeNote"></div>');
  }

  function v4FixProfileModal() {
    const modal = document.getElementById("profileModal");
    const card = modal?.querySelector(".modal-card");
    const saveButton = document.getElementById("saveProfile");
    const cancelButton = document.getElementById("closeProfile");
    const actions = cancelButton?.closest(".actions");
    if (!modal || !card || !saveButton || !cancelButton || !actions) return;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "v4ProfileTitle");
    card.querySelector("h2")?.setAttribute("id", "v4ProfileTitle");
    saveButton.textContent = "Uložiť";
    cancelButton.textContent = "Zrušiť";
    actions.classList.add("v4-profile-actions");
    card.insertBefore(actions, card.children[1] || null);
    document.getElementById("profileBtn")?.addEventListener("click", () => setTimeout(() => { card.scrollTop = 0; }, 0));
  }

  function v4RenderDashboard() {
    const target = document.getElementById("v4Dashboard");
    if (!target) return;
    const name = state.profile.name || "vaše bábätko";
    const expecting = state.profile.status === "expecting";
    const feed = v4LatestEvent("Kŕmenie");
    const diaper = v4LatestEvent("Plienka");
    const sleep = v4LatestEvent("Spánok");
    const nextReminder = state.reminders
      .filter(item => new Date(item.date).getTime() >= Date.now())
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    const todayEvents = state.events.filter(event => String(event.created || "").slice(0, 10) === new Date().toISOString().slice(0, 10));
    const memoryToday = state.diary.some(memory => (memory.date || String(memory.created || "").slice(0, 10)) === v4TodayKey());
    const quickActions = expecting ? `
      <button type="button" data-v4-view="beforeBirth"><span class="v4-action-icon">🤰</span><span>Moja príprava</span></button>
      <button type="button" data-v4-view="checklists"><span class="v4-action-icon">✅</span><span>Checklisty</span></button>
      <button type="button" data-v4-view="travel"><span class="v4-action-icon">🧳</span><span>Cestovanie</span></button>
      <button type="button" data-v4-view="contacts"><span class="v4-action-icon">📇</span><span>Kontakty</span></button>` : state.v4QuickActions.slice(0, 4).map(key => {
      const action = v4ActionCatalog[key];
      if (!action) return "";
      const attr = action.tab ? `data-v4-quick="${action.tab}"` : `data-v4-view="${action.view}"${action.eventType ? ` data-v4-event-type="${action.eventType}"` : ""}`;
      const label = key === "sleep" && state.sleepTimer.active ? "Ukončiť spánok" : action.label;
      return `<button type="button" ${attr}><span class="v4-action-icon">${action.icon}</span><span>${label}</span></button>`;
    }).join("");
    const sleepStatus = state.sleepTimer.active
      ? `Beží od ${v4ClockText(state.sleepTimer.start)}`
      : sleep ? `${v4ClockText(sleep.created)} · ${sleep.value || "uložené"}` : "Zatiaľ bez záznamu";
    const headline = expecting
      ? `Pokojná príprava pre ${v4Escape(name)}.`
      : `Čo je dnes dôležité pre ${v4Escape(name)}?`;
    const copy = expecting
      ? "Guguboo ukáže najbližší praktický krok a pripraví údaje, ktoré po narodení využijete bez nového vypĺňania."
      : "Najdôležitejšie informácie sú na jednom mieste. Záznam pridáte jednou rukou a podrobnosti doplníte iba vtedy, keď ich potrebujete.";
    const dueDate = state.profile.due ? new Date(`${state.profile.due}T12:00:00`) : null;
    const dueDays = dueDate && Number.isFinite(dueDate.getTime()) ? Math.ceil((dueDate.getTime() - Date.now()) / 86400000) : null;
    const statusGrid = expecting ? `
      <div class="v4-status-item"><span>Termín pôrodu</span><strong>${dueDays === null ? "Doplňte v profile" : dueDays >= 0 ? `${dueDays} dní` : "Termín už prešiel"}</strong></div>
      <div class="v4-status-item"><span>Pôrodnica</span><strong>${v4Escape(state.prenatal?.hospital || "Zatiaľ nevybraná")}</strong></div>
      <div class="v4-status-item"><span>Pripravené kroky</span><strong>${Object.values(state.checks || {}).filter(Boolean).length} hotových</strong></div>
      <div class="v4-status-item"><span>Cestovanie</span><strong>${v4Escape(state.travel?.city || "Free pomoc podľa mesta")}</strong></div>` : `
      <div class="v4-status-item"><span>Spánok</span><strong>${v4Escape(sleepStatus)}</strong></div>
      <div class="v4-status-item"><span>Posledné kŕmenie</span><strong>${feed ? `${v4ClockText(feed.created)} · ${v4Escape(feed.value || "uložené")}` : "Zatiaľ bez záznamu"}</strong></div>
      <div class="v4-status-item"><span>Prebalenie</span><strong>${diaper ? `${v4ClockText(diaper.created)} · ${v4Escape(diaper.value || "uložené")}` : "Zatiaľ bez záznamu"}</strong></div>
      <div class="v4-status-item"><span>Najbližšie</span><strong>${nextReminder ? `${v4Escape(nextReminder.title)} · ${v4ClockText(nextReminder.date)}` : "Bez pripomienky"}</strong></div>`;
    const homeApps = expecting ? `
      <button type="button" data-v4-view="pregnancyGrowth"><span>🫶</span><strong>Tehotenstvo</strong><small>FREE · obdobie a rast bábätka</small></button>
      <button type="button" data-v4-view="beforeBirth"><span>🤰</span><strong>Pred narodením</strong><small>FREE · pôrodnica a prvé dni</small></button>
      <button type="button" data-v4-view="checklists"><span>✅</span><strong>Checklisty</strong><small>FREE · príprava podľa situácie</small></button>
      <button type="button" data-v4-view="contacts"><span>📇</span><strong>Kontakty</strong><small>FREE · pediater a dôležité čísla</small></button>
      <button type="button" data-v4-view="travel"><span>🧳</span><strong>Cestovanie</strong><small>FREE · pomoc podľa mesta</small></button>
      <button type="button" data-v4-view="tracker"><span>➕</span><strong>Základné záznamy</strong><small>FREE · jednoduché uloženie</small></button>` : `
      <button type="button" data-v4-view="sounds"><span>🔊</span><strong>Zvuky a uspávanky</strong><small>PREMIUM · šumy a vlastné nahrávky</small></button>
      <button type="button" data-v4-view="reports"><span>▥</span><strong>Prehľady</strong><small>PREMIUM · súvislosti za 7 a 30 dní</small></button>
      <button type="button" data-v4-view="assistant"><span>✦</span><strong>Rýchla AI pomoc</strong><small>PREMIUM · otázka podľa kontextu</small></button>
      <button type="button" data-v4-view="calendar"><span>📅</span><strong>Kalendár</strong><small>PREMIUM · rodinné pripomienky</small></button>
      <button type="button" data-v4-view="shopping"><span>🛒</span><strong>Nákup</strong><small>PREMIUM · spoločný zoznam</small></button>
      <button type="button" data-v4-view="travel"><span>🧳</span><strong>Cestovanie</strong><small>FREE · balenie a pomoc podľa mesta</small></button>`;
    const supportCard = expecting ? `
      <article class="v4-ai-home-card v4-premium-teaser">
        <span class="v4-ai-mark">Premium po narodení</span>
        <div><h3>Dnes sa pripravujete zdarma</h3><p>Po narodení môžete odomknúť spánok, rodinné prehľady, AI pomoc, zdravie, rast a spomienky od 4,99 € mesačne.</p></div>
        <button type="button" data-v4-view="premium">Čo obsahuje Premium</button>
      </article>` : `
      <article class="v4-ai-home-card">
        <span class="v4-ai-mark">✦ AI pomoc</span>
        <div><h3>Napíšte otázku vlastnými slovami</h3><p>Guguboo ju interne zaradí, upozorní na varovné výrazy a odporučí najbližší krok.</p></div>
        <button type="button" data-v4-view="assistant">Opýtať sa</button>
      </article>`;
    const memoryCard = expecting ? "" : `
      <article class="v4-emotion-card">
        <div><h3>${memoryToday ? "Dnešný okamih je uložený" : "Z dnešných záznamov môže vzniknúť spomienka"}</h3><p>${memoryToday ? "Fotku alebo text môžete kedykoľvek doplniť v rodinnej časovej osi." : `${todayEvents.length ? `Guguboo dnes zachytilo ${todayEvents.length} ${todayEvents.length === 1 ? "záznam" : todayEvents.length < 5 ? "záznamy" : "záznamov"}.` : "Stačí jedna veta alebo fotografia."} Praktické údaje sa nepíšu druhýkrát.`}</p></div>
        <button type="button" data-v4-quick="memory">${memoryToday ? "Otvoriť časovú os" : "Pripraviť spomienku"}</button>
      </article>`;
    target.innerHTML = `
      <article class="v4-dashboard-card">
        <span class="v4-eyebrow">${expecting ? "Pred narodením" : v4Escape(v4AgeSummary())}</span>
        <h2>${headline}</h2>
        <p>${copy}</p>
        <div class="v4-status-grid">
          ${statusGrid}
        </div>
        <div class="v4-primary-actions">${quickActions}</div>
      </article>
      <article class="v4-home-apps">
        <div class="v4-home-apps-head"><div><span class="v4-eyebrow">${expecting ? "Free" : "Rýchly prístup"}</span><h3>${expecting ? "Bezplatné funkcie pre vás" : "Najpoužívanejšie aplikácie"}</h3></div><button type="button" data-v4-view="apps">Všetky aplikácie →</button></div>
        <div class="v4-home-app-grid">
          ${homeApps}
        </div>
      </article>
      ${supportCard}
      ${memoryCard}`;
    v4BindDynamicButtons(target);
    v4RenderCorrectedAge();
  }

  function v4RenderCorrectedAge() {
    const text = v4CorrectedAgeText();
    const note = document.getElementById("v4ProfileAgeNote");
    if (note) {
      note.textContent = text ? `${text} Korigovaný vek je orientačný údaj; vývoj hodnotí pediater.` : "Korigovaný vek sa zobrazí iba pri predčasnom narodení, ak doplníte gestačný týždeň.";
      note.classList.toggle("show", !!text || state.profile.status === "born");
    }
  }

  function v4BindDynamicButtons(scope = document) {
    scope.querySelectorAll("[data-v4-view]").forEach(button => {
      if (button.dataset.v4Bound) return;
      button.dataset.v4Bound = "1";
      button.addEventListener("click", () => {
        v4CloseSheets();
        v4Navigate(button.dataset.v4View);
        if (button.dataset.v4EventType && document.getElementById("eventType")) {
          document.getElementById("eventType").value = button.dataset.v4EventType;
          updateEventForm();
        }
      });
    });
    scope.querySelectorAll("[data-v4-quick]").forEach(button => {
      if (button.dataset.v4Bound) return;
      button.dataset.v4Bound = "1";
      button.addEventListener("click", () => v4OpenQuick(button.dataset.v4Quick));
    });
    scope.querySelectorAll("[data-v4-tools]").forEach(button => {
      if (button.dataset.v4Bound) return;
      button.dataset.v4Bound = "1";
      button.addEventListener("click", v4OpenTools);
    });
  }

  function v4Navigate(view) {
    if (!document.getElementById(view)) return;
    switchView(view);
  }

  function v4OpenQuick(tab = "sleep") {
    const sheet = document.getElementById("v4QuickSheet");
    if (!sheet) return;
    sheet.classList.add("open");
    sheet.setAttribute("aria-hidden", "false");
    v4SetQuickTab(tab);
    v4UpdateSleepTimer();
  }

  function v4OpenTools() {
    v4CloseSheets();
    v4Navigate("apps");
  }

  function v4CloseSheets() {
    ["v4QuickSheet", "v4ToolsSheet"].forEach(id => {
      const sheet = document.getElementById(id);
      if (!sheet) return;
      sheet.classList.remove("open");
      sheet.setAttribute("aria-hidden", "true");
    });
  }

  function v4SetQuickTab(tab) {
    document.querySelectorAll("[data-v4-tab]").forEach(button => button.classList.toggle("active", button.dataset.v4Tab === tab));
    document.querySelectorAll("[data-v4-panel]").forEach(panel => panel.classList.toggle("active", panel.dataset.v4Panel === tab));
  }

  function v4StartSleep() {
    state.sleepTimer = { active: true, start: new Date().toISOString(), type: document.getElementById("v4SleepType").value || "day" };
    save();
    v4UpdateSleepTimer();
    v4RenderDashboard();
    showToast("Spánok sa meria");
  }

  function v4StopSleep() {
    if (!state.sleepTimer.active || !state.sleepTimer.start) return;
    const start = new Date(state.sleepTimer.start);
    const end = new Date();
    const duration = v4DurationText(end - start);
    const type = state.sleepTimer.type === "night" ? "nočný" : "denný";
    state.sleepTimer = { active: false, start: "", type: state.sleepTimer.type || "day" };
    state.events.push({
      id: uid(), type: "Spánok", value: `${duration} · ${type}`,
      note: `Časovač od ${v4ClockText(start)} do ${v4ClockText(end)}`,
      author: "rodina", created: end.toISOString(), start: start.toISOString(), end: end.toISOString(), sleepType: type
    });
    save();
    v4UpdateSleepTimer();
    v4RenderDashboard();
    showToast("Spánok ukončený a uložený");
  }

  function v4UpdateSleepTimer() {
    const output = document.getElementById("v4SleepTimer");
    const status = document.getElementById("v4SleepStatus");
    const toggle = document.getElementById("v4SleepToggle");
    if (!output || !status || !toggle) return;
    if (state.sleepTimer.active && state.sleepTimer.start) {
      const elapsed = Math.max(0, Date.now() - new Date(state.sleepTimer.start).getTime());
      const parts = v4DurationParts(elapsed);
      output.textContent = `${String(parts.hours).padStart(2, "0")}:${String(parts.minutes).padStart(2, "0")}`;
      status.textContent = `Beží od ${v4ClockText(state.sleepTimer.start)} · ${state.sleepTimer.type === "night" ? "nočný" : "denný"} spánok`;
      toggle.textContent = "Ukončiť spánok";
    } else {
      output.textContent = "00:00";
      status.textContent = "Časovač nie je spustený";
      toggle.textContent = "Spustiť spánok";
    }
  }

  function v4SaveFeed() {
    const method = document.getElementById("v4FeedMethod").value;
    const side = document.getElementById("v4FeedSide").value;
    const duration = document.getElementById("v4FeedDuration").value;
    const amount = document.getElementById("v4FeedAmount").value.trim();
    const note = document.getElementById("v4FeedNote").value.trim();
    const value = [method, side, duration ? `${duration} min` : "", amount].filter(Boolean).join(" · ");
    state.events.push({ id: uid(), type: "Kŕmenie", value, note, author: "rodina", created: new Date().toISOString(), method, side, duration, amount });
    save();
    document.getElementById("v4FeedDuration").value = "";
    document.getElementById("v4FeedAmount").value = "";
    document.getElementById("v4FeedNote").value = "";
    v4RenderDashboard();
    showToast("Kŕmenie uložené");
  }

  function v4SaveDiaper() {
    const type = document.getElementById("v4DiaperType").value;
    const color = document.getElementById("v4StoolColor").value;
    const consistency = document.getElementById("v4StoolConsistency").value;
    const amount = document.getElementById("v4StoolAmount").value;
    const mucus = document.getElementById("v4StoolMucus").checked;
    const blood = document.getElementById("v4StoolBlood").checked;
    const discomfort = document.getElementById("v4StoolDiscomfort").checked;
    const note = document.getElementById("v4DiaperNote").value.trim();
    const value = [type, color && `farba: ${color}`, consistency && `konzistencia: ${consistency}`, `množstvo: ${amount}`, mucus && "hlien", blood && "krv", discomfort && "nepohoda"].filter(Boolean).join(" · ");
    state.events.push({ id: uid(), type: "Plienka", value, note, author: "rodina", created: new Date().toISOString(), diaper: { type, color, consistency, amount, mucus, blood, discomfort } });
    save();
    v4RenderDashboard();
    showToast(blood ? "Záznam uložený – pri krvi kontaktujte pediatra" : "Prebalenie uložené");
  }

  function v4CreateMemoryDraft() {
    const today = v4TodayKey();
    const todayEvents = state.events.filter(event => String(event.created || "").slice(0, 10) === new Date().toISOString().slice(0, 10));
    const summary = todayEvents.slice(-5).map(event => `${event.type.toLowerCase()}: ${event.value || "uložené"}`).join(", ");
    v4CloseSheets();
    prefillMemory("Moment, ktorý nechcem zabudnúť", summary
      ? `Guguboo dnes zachytilo ${summary}. Čo z dneška si chceme zapamätať?`
      : "Čo sa dnes stalo, čo si chceme zapamätať?");
    document.getElementById("diaryDate").value = today;
  }

  function v4UpdateNavigation(view = v4CurrentView()) {
    const [title, subtitle] = v4ViewNames[view] || ["Guguboo", "Spoločné rodinné prostredie"];
    const bar = document.getElementById("v4ContextBar");
    if (bar) bar.dataset.home = String(view === "home");
    const titleElement = document.getElementById("v4ContextTitle");
    const subtitleElement = document.getElementById("v4ContextSubtitle");
    if (titleElement) titleElement.textContent = title;
    if (subtitleElement) subtitleElement.textContent = subtitle;
    document.querySelectorAll("#v4BottomNav [data-v4-view], #v4DesktopNav [data-v4-view]").forEach(button => button.classList.toggle("active", button.dataset.v4View === view));
    document.getElementById("v4AiFab")?.classList.toggle("active", view === "assistant");
  }

  function v4ObserveViews() {
    const views = Array.from(document.querySelectorAll(".view"));
    const observer = new MutationObserver(() => {
      const current = v4CurrentView();
      if (current !== v4PreviousView) {
        if (!v4NavigatingBack && v4PreviousView && !["welcome", "birthIntro", "pregnancyIntro"].includes(v4PreviousView)) v4ViewHistory.push(v4PreviousView);
        v4PreviousView = current;
        v4NavigatingBack = false;
      }
      v4UpdateNavigation(current);
      if (current === "home") v4RenderDashboard();
      if (current === "apps") v4RenderApps();
      if (current === "reports") v4RenderReports();
    });
    views.forEach(view => observer.observe(view, { attributes: true, attributeFilter: ["class"] }));
  }

  function v4Back() {
    const fallback = "home";
    const destination = v4ViewHistory.pop() || fallback;
    v4NavigatingBack = true;
    switchView(destination);
  }

  function v4RelaxDateConstraints() {
    const status = state.welcomeStatus || state.profile.status || document.getElementById("babyStatus")?.value;
    ["welcomeDue", "babyDue"].forEach(id => {
      const field = document.getElementById(id);
      if (!field) return;
      if (status === "born") field.removeAttribute("min");
    });
  }

  function v4SaveGestationFromWelcome() {
    const week = document.getElementById("welcomeGestationalWeek")?.value;
    const day = document.getElementById("welcomeGestationalDay")?.value;
    if (week) state.profile.gestationalWeek = Number(week);
    if (day !== "") state.profile.gestationalDay = Number(day);
    appStorage.setItem(storeKey, JSON.stringify(state));
  }

  function v4BindStaticEvents() {
    v4BindDynamicButtons(document);
    document.querySelectorAll("[data-v4-open-quick]").forEach(button => button.addEventListener("click", () => v4OpenQuick("sleep")));
    document.querySelectorAll("[data-v4-close]").forEach(button => button.addEventListener("click", v4CloseSheets));
    document.querySelectorAll("[data-v4-tab]").forEach(button => button.addEventListener("click", () => v4SetQuickTab(button.dataset.v4Tab)));
    ["v4QuickSheet", "v4ToolsSheet"].forEach(id => document.getElementById(id)?.addEventListener("click", event => {
      if (event.target.id === id) v4CloseSheets();
    }));
    document.addEventListener("keydown", event => { if (event.key === "Escape") v4CloseSheets(); });
    document.getElementById("v4BackBtn")?.addEventListener("click", v4Back);
    document.getElementById("v4ContextTools")?.addEventListener("click", v4OpenTools);
    document.getElementById("v4SleepToggle")?.addEventListener("click", () => state.sleepTimer.active ? v4StopSleep() : v4StartSleep());
    document.getElementById("v4SleepOpenHistory")?.addEventListener("click", () => { v4CloseSheets(); v4Navigate("sleep"); });
    document.getElementById("v4SaveFeed")?.addEventListener("click", v4SaveFeed);
    document.getElementById("v4SaveDiaper")?.addEventListener("click", v4SaveDiaper);
    document.getElementById("v4AskAboutStool")?.addEventListener("click", () => { v4CloseSheets(); v4Navigate("guide"); });
    document.getElementById("v4CreateMemoryDraft")?.addEventListener("click", v4CreateMemoryDraft);
    document.getElementById("v4OpenBirthCard")?.addEventListener("click", () => { v4CloseSheets(); v4Navigate("birthCard"); });
    document.getElementById("v4OpenDiary")?.addEventListener("click", () => { v4CloseSheets(); v4Navigate("diary"); });
    document.getElementById("saveWelcome")?.addEventListener("click", () => setTimeout(v4SaveGestationFromWelcome, 0));
    document.getElementById("babyStatus")?.addEventListener("change", () => setTimeout(v4RelaxDateConstraints, 0));
    document.getElementById("welcomeBirth")?.addEventListener("change", v4RelaxDateConstraints);
    document.getElementById("profileBtn")?.addEventListener("click", () => setTimeout(() => {
      document.getElementById("babyGestationalWeek").value = state.profile.gestationalWeek || "";
      document.getElementById("babyGestationalDay").value = state.profile.gestationalDay ?? "";
      v4RenderCorrectedAge();
    }, 0));
    document.addEventListener("click", () => setTimeout(() => {
      v4RenderDesktopNav();
      v4UpdateNavigation();
      if (v4CurrentView() === "home") v4RenderDashboard();
      if (v4CurrentView() === "apps") v4RenderApps();
      if (v4CurrentView() === "reports") v4RenderReports();
    }, 60));
  }

  function v4SimplifyOnboardingCopy() {
    // Copy is owned by the V6 onboarding story in app.html.
  }

  function v4Init() {
    v4AddVersionBadge();
    v4AddContextBar();
    v4AddDesktopNav();
    v4AddBottomNav();
    v4AddAiFab();
    v4AddSheets();
    v4AddDashboard();
    v4AddAppsView();
    v4AddReportsView();
    v4ProfileNote();
    v4FixProfileModal();
    v4SimplifyOnboardingCopy();
    v4BindStaticEvents();
    v4ObserveViews();
    v4RelaxDateConstraints();
    v4RenderDashboard();
    v4RenderApps();
    v4RenderReports();
    v4UpdateNavigation();
    v4UpdateSleepTimer();
    v4TimerInterval = window.setInterval(v4UpdateSleepTimer, 15000);
    appStorage.setItem(storeKey, JSON.stringify(state));
  }

  v4Init();
})();

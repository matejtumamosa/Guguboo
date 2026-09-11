(function initGugubooActivities() {
  "use strict";

  const data = window.GugubooActivitiesData;
  const root = document.getElementById("activitiesApp");
  const view = document.getElementById("activities");
  if (!data || !root || !view || typeof state === "undefined") return;

  const FILTERS = [
    ["two-minutes", "Máme dve minúty"], ["calm", "Pokojná"], ["movement", "Pohybová"],
    ["no-tools", "Bez pomôcok"], ["outside", "Vonku"], ["bedtime", "Pred spaním"]
  ];
  const DOMAIN_LABELS = { motorika: "Pohyb a motorika", komunikácia: "Komunikácia", poznávanie: "Poznávanie a objavovanie", vzťah: "Vzťah a sociálno-emocionálne prejavy" };
  const DEVELOPMENT_COPY = {
    "0-2": ["krátko dvíhať hlavu v bdelosti", "vnímať známy hlas", "sledovať tvár zblízka", "upokojovať sa pri blízkej osobe"],
    "2-4": ["stabilnejšie držať hlavu", "odpovedať zvukmi", "sledovať ruky a predmety", "usmievať sa v kontakte"],
    "4-6": ["siahať a pretáčať sa", "striedať zvuky", "skúmať predmety rukami a ústami", "rozoznávať známych ľudí"],
    "6-9": ["hľadať vlastný spôsob presunu", "opakovať slabiky", "skúšať príčinu a následok", "reagovať na blízkosť a vzdialenie"],
    "9-12": ["dostávať sa do stoja s oporou", "používať gestá a zvuky", "vkladať a hľadať predmety", "hrať jednoduché spoločné hry"],
    "12-15": ["skúšať samostatné kroky", "používať gestá a prvé slová", "napodobňovať použitie predmetov", "zdieľať pozornosť ukazovaním"],
    "15-18": ["chodiť a prenášať predmety", "skúšať viac slov", "napodobňovať činnosti", "overovať si blízkosť rodiča"],
    "18-24": ["behať a skúšať koordinované pohyby", "spájať jednoduché slová", "kombinovať predmety v hre", "sledovať reakciu blízkej osoby"]
  };

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#039;" })[character]);
  const today = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const isPostpartum = () => state.profile?.status === "born";
  const persist = () => appStorage.setItem(storeKey, JSON.stringify(state));
  const announce = text => { if (typeof showToast === "function") showToast(text); const live = root.querySelector("[data-activities-live]"); if (live) live.textContent = text; };

  function chronologicalAgeDays(birthDate, now = new Date()) {
    if (!birthDate) return null;
    const birth = new Date(`${birthDate}T12:00:00`);
    if (!Number.isFinite(birth.getTime())) return null;
    return Math.max(0, Math.floor((now.getTime() - birth.getTime()) / 86400000));
  }

  function correctedAgeDays({ birthDate, gestationalWeek, gestationalDay, now = new Date() }) {
    const chronologicalDays = chronologicalAgeDays(birthDate, now);
    const week = Number(gestationalWeek);
    const day = Number(gestationalDay);
    const complete = gestationalWeek !== "" && gestationalWeek != null && gestationalDay !== "" && gestationalDay != null;
    if (chronologicalDays === null || !complete || !Number.isInteger(week) || !Number.isInteger(day) || week < 20 || week >= 37 || day < 0 || day > 6 || chronologicalDays > 730) {
      return { days: chronologicalDays, corrected: false, correctionDays: 0 };
    }
    const correctionDays = 280 - (week * 7 + day);
    return { days: Math.max(0, chronologicalDays - correctionDays), corrected: true, correctionDays };
  }

  function selectAgePeriod(days) {
    if (!Number.isFinite(days)) return null;
    return data.periods.find(period => days >= period.minDays && days <= period.maxDays) || null;
  }

  function migrateActivitiesState(value) {
    const current = value && typeof value === "object" ? value : {};
    return {
      version: 1,
      tried: Array.isArray(current.tried) ? current.tried.filter(item => item?.id && item?.date) : [],
      favorites: Array.isArray(current.favorites) ? [...new Set(current.favorites.filter(Boolean))] : [],
      recentIds: Array.isArray(current.recentIds) ? current.recentIds.filter(Boolean).slice(-6) : [],
      observations: current.observations && typeof current.observations === "object" ? current.observations : {},
      filter: "",
      currentActivityId: typeof current.currentActivityId === "string" ? current.currentActivityId : ""
    };
  }

  state.activities = migrateActivitiesState(state.activities);

  function eligibleActivities(period, filter = "") {
    return data.activities.filter(activity => activity.period === period?.id && (!filter || activity.tags.includes(filter)));
  }

  function selectActivity(period, forceDifferent = false) {
    const candidates = eligibleActivities(period);
    if (!candidates.length) return null;
    const current = candidates.find(item => item.id === state.activities.currentActivityId);
    if (current && !forceDifferent) return current;
    const recent = new Set(state.activities.recentIds);
    let pool = candidates.filter(item => !recent.has(item.id) && (!forceDifferent || item.id !== current?.id));
    if (!pool.length) pool = candidates.filter(item => !forceDifferent || item.id !== current?.id);
    if (!pool.length) pool = candidates;
    const seed = Number(today().replaceAll("-", "")) + state.activities.recentIds.length;
    const selected = pool[seed % pool.length];
    if (state.activities.currentActivityId && state.activities.currentActivityId !== selected.id) {
      state.activities.recentIds = [...state.activities.recentIds, state.activities.currentActivityId].slice(-6);
    }
    state.activities.currentActivityId = selected.id;
    persist();
    return selected;
  }

  function activityScene(activity) {
    const title = activity.title.toLocaleLowerCase("sk");
    if (/brušk|cesta|kroky|čiare|hračka kúsok/.test(title)) return "movement";
    if (/zrkadl|tvár|hlas|zvuk|bľabot|slov|pomenuj|zamáv|tliesk|kuk|pesnič/.test(title)) return "together";
    if (/veža|nádob|dnu|krabič|rovnak|patrí/.test(title)) return "blocks";
    if (/vonku|prechádz/.test(title)) return "outside";
    return activity.domain === "motorika" ? "movement" : activity.domain === "vzťah" || activity.domain === "komunikácia" ? "together" : "discover";
  }

  function activityVisual(activity, compact = false) {
    const scene = activityScene(activity);
    const scenes = {
      movement: `<svg viewBox="0 0 360 220" role="img" aria-label="Ukážka polohy dieťaťa pri aktivite"><path class="act-mat" d="M49 169c45-29 212-31 262 0 16 10 6 28-12 30H65c-22-2-31-19-16-30Z"/><circle class="act-skin" cx="145" cy="91" r="28"/><path class="act-body" d="M118 119c24-19 72-13 96 8 18 16 35 22 58 25l-8 25c-31-2-57-12-79-28-20 13-47 14-76 6Z"/><path class="act-line" d="M102 145c-17 3-29 12-37 25m142-31 36-19"/><circle class="act-dot" cx="153" cy="88" r="4"/><path class="act-line" d="M159 101c7 4 13 4 19 0"/></svg>`,
      together: `<svg viewBox="0 0 360 220" role="img" aria-label="Ukážka spoločnej hry tvárou v tvár"><circle class="act-halo" cx="180" cy="105" r="88"/><circle class="act-skin" cx="115" cy="102" r="42"/><circle class="act-skin act-skin-two" cx="247" cy="119" r="31"/><path class="act-body" d="M50 196c8-49 35-69 65-69s58 20 66 69Z"/><path class="act-body act-body-two" d="M197 196c8-36 27-52 50-52s43 16 51 52Z"/><circle class="act-dot" cx="104" cy="96" r="4"/><circle class="act-dot" cx="126" cy="96" r="4"/><circle class="act-dot" cx="239" cy="115" r="3"/><circle class="act-dot" cx="255" cy="115" r="3"/><path class="act-line" d="M103 111c8 8 17 8 25 0m135-53c16 5 27 15 33 29m-47-38c8 1 14 4 20 8"/></svg>`,
      blocks: `<svg viewBox="0 0 360 220" role="img" aria-label="Ukážka hry s predmetmi"><path class="act-mat" d="M44 180c55-25 223-25 272 0 12 7 3 21-15 22H60c-18-1-27-15-16-22Z"/><rect class="act-block-one" x="116" y="117" width="62" height="62" rx="13"/><rect class="act-block-two" x="181" y="82" width="62" height="97" rx="13"/><circle class="act-skin" cx="74" cy="99" r="27"/><path class="act-body" d="M37 179c5-42 20-58 39-58 24 0 38 19 43 58Z"/><path class="act-line" d="m95 130 30 19m-22-41 30 23"/></svg>`,
      outside: `<svg viewBox="0 0 360 220" role="img" aria-label="Ukážka pozorovania vonku"><circle class="act-sun" cx="283" cy="47" r="24"/><path class="act-tree" d="M67 170V91m0 19-31-24m31 8 28-31"/><circle class="act-leaf" cx="35" cy="78" r="27"/><circle class="act-leaf" cx="92" cy="62" r="34"/><path class="act-mat" d="M18 182c86-33 231-25 325 0v27H18Z"/><circle class="act-skin" cx="192" cy="103" r="30"/><path class="act-body" d="M139 192c6-49 25-67 53-67 29 0 52 21 61 67Z"/><path class="act-line" d="m215 128 34-32m-8 2 17-16"/></svg>`,
      discover: `<svg viewBox="0 0 360 220" role="img" aria-label="Ukážka objavovania predmetu"><circle class="act-halo" cx="180" cy="109" r="91"/><circle class="act-skin" cx="111" cy="103" r="33"/><path class="act-body" d="M58 196c7-47 25-68 53-68 27 0 48 22 55 68Z"/><path class="act-line" d="m139 137 47 13m-42-35 45 23"/><rect class="act-block-two" x="191" y="108" width="78" height="71" rx="17"/><circle class="act-dot" cx="102" cy="98" r="4"/><path class="act-spark" d="m270 69 7 13 14 4-12 8 1 15-11-10-14 6 6-14-9-11 15 2Z"/></svg>`
    };
    return `<div class="activities-visual ${compact ? "is-compact" : ""} activities-visual-${scene}">${scenes[scene]}${compact ? "" : `<span>${escapeHtml(activity.minutes)} min</span>`}</div>`;
  }

  function activityCard(activity) {
    const tried = state.activities.tried.some(item => item.id === activity.id);
    const favorite = state.activities.favorites.includes(activity.id);
    return `<article class="activities-today">
      ${activityVisual(activity)}
      <div class="activities-focus-content">
        <div class="activities-title-row"><div><span class="activities-eyebrow">Skúsme teraz</span><h2>${escapeHtml(activity.title)}</h2></div><button class="activities-favorite-button" type="button" data-activity-favorite aria-pressed="${favorite}" aria-label="${favorite ? "Odobrať z obľúbených" : "Pridať medzi obľúbené"}"><span aria-hidden="true">${favorite ? "♥" : "♡"}</span></button></div>
        <div class="activities-essentials"><span>${escapeHtml(activity.minutes)} min</span><span>${escapeHtml(activity.supplies)}</span></div>
        <ol class="activities-steps">${activity.steps.slice(0, 3).map((step, index) => `<li><span>${index + 1}</span><p>${escapeHtml(step)}</p></li>`).join("")}</ol>
        <details class="activities-safety-details"><summary>Bezpečne</summary><p>${escapeHtml(activity.safety)}</p></details>
        <div class="activities-actions"><button class="activities-done" type="button" data-activity-tried aria-pressed="${tried}">${tried ? "✓ Hotovo" : "Vyskúšali sme"}</button><button class="activities-next" type="button" data-activity-other aria-label="Ukáž inú aktivitu">Iný nápad <span aria-hidden="true">→</span></button></div>
      </div>
    </article>`;
  }

  function activityMiniCard(activity) {
    return `<button class="activities-mini-card" type="button" data-activity-pick="${activity.id}">${activityVisual(activity, true)}<span class="activities-mini-copy"><strong>${escapeHtml(activity.title)}</strong><small>${escapeHtml(activity.minutes)} min</small></span></button>`;
  }

  function render() {
    if (!isPostpartum()) {
      if (view.classList.contains("active") && typeof switchView === "function") switchView("home");
      return;
    }
    const age = correctedAgeDays({
      birthDate: state.profile.birth,
      gestationalWeek: state.profile.gestationalWeek,
      gestationalDay: state.profile.gestationalDay
    });
    if (age.days === null) {
      root.innerHTML = `<div class="activities-shell activities-empty"><span aria-hidden="true">🧸</span><h1>Aktivity s dieťaťom</h1><p>Doplň dátum narodenia a Guguboo vyberie pokojné nápady pre aktuálne obdobie. Vek nebudeme odhadovať.</p><button type="button" data-activities-profile>Otvoriť Profil dieťaťa</button></div>`;
      return;
    }
    const period = selectAgePeriod(age.days);
    if (!period) {
      root.innerHTML = `<div class="activities-shell activities-empty"><span aria-hidden="true">🧸</span><h1>Aktivity s dieťaťom</h1><p>Katalóg je v tejto verzii pripravený od narodenia do 24 mesiacov. Nechceme ponúkať vekovo neoverený obsah.</p></div>`;
      return;
    }
    const activity = selectActivity(period);
    const observations = data.observations[period.id] || [];
    const favorites = data.activities.filter(item => state.activities.favorites.includes(item.id));
    const alternatives = eligibleActivities(period, "").filter(item => item.id !== activity?.id).slice(0, 3);
    root.innerHTML = `<div class="activities-shell">
      <header class="activities-hero"><span class="activities-eyebrow">${escapeHtml(period.label)}</span><h1>Čo sa dnes zahráme?</h1></header>
      ${age.corrected ? `<details class="activities-corrected"><summary>Obsah je zobrazený podľa korigovaného veku</summary><p>Vek aktivít je upravený o ${age.correctionDays} dní. Chronologický vek v profile sa nemení.</p></details>` : ""}
      <div data-activity-current>${activityCard(activity)}</div>
      <section class="activities-picker"><div class="activities-section-head"><h2>Ďalšie nápady</h2><button type="button" data-activity-other aria-label="Premiešať aktivity">Premiešať</button></div><div class="activities-more">${alternatives.map(activityMiniCard).join("")}</div></section>
      ${favorites.length ? `<section class="activities-picker"><div class="activities-section-head"><h2>Obľúbené</h2></div><div class="activities-favorites">${favorites.slice(0, 3).map(activityMiniCard).join("")}</div></section>` : ""}
      <details class="activities-parent-details"><summary>Pre rodiča</summary><div class="activities-parent-content"><h2>Vývoj podľa veku</h2><p>Voliteľné poznámky pre rozhovor s pediatrom. Nie je to test.</p><div class="activities-observations">${observations.map(item => `<label><span>${escapeHtml(item.text)}</span><select data-observation-id="${item.id}" aria-label="Stav: ${escapeHtml(item.text)}"><option value="" ${!state.activities.observations[item.id] ? "selected" : ""}>—</option><option value="noticed" ${state.activities.observations[item.id] === "noticed" ? "selected" : ""}>Všimol/a som si</option><option value="unknown" ${state.activities.observations[item.id] === "unknown" ? "selected" : ""}>Zatiaľ neviem</option><option value="ask" ${state.activities.observations[item.id] === "ask" ? "selected" : ""}>Opýtať sa</option></select></label>`).join("")}</div><button type="button" data-activities-urgent>Urgentná pomoc</button></div></details>
      <div class="sr-only" data-activities-live aria-live="polite"></div>
    </div>`;
  }

  root.addEventListener("click", event => {
    if (event.target.closest("[data-activities-profile]")) {
      if (document.getElementById("v5Profiles")) switchView("v5Profiles"); else document.getElementById("profileBtn")?.click();
      return;
    }
    if (event.target.closest("[data-activities-urgent]")) return switchView("urgent");
    if (event.target.closest("[data-activity-clear-filter]")) { state.activities.filter = ""; state.activities.currentActivityId = ""; persist(); return render(); }
    const filter = event.target.closest("[data-activity-filter]");
    if (filter) { state.activities.filter = filter.dataset.activityFilter; state.activities.currentActivityId = ""; persist(); return render(); }
    const pick = event.target.closest("[data-activity-pick]");
    if (pick) { state.activities.currentActivityId = pick.dataset.activityPick; persist(); render(); root.querySelector(".activities-today")?.scrollIntoView({ behavior:"smooth", block:"start" }); return; }
    if (event.target.closest("[data-activity-other]")) {
      const age = correctedAgeDays({ birthDate:state.profile.birth, gestationalWeek:state.profile.gestationalWeek, gestationalDay:state.profile.gestationalDay });
      selectActivity(selectAgePeriod(age.days), true); render(); return announce("Vybrali sme inú aktivitu.");
    }
    const currentId = state.activities.currentActivityId;
    if (event.target.closest("[data-activity-tried]") && currentId) {
      if (!state.activities.tried.some(item => item.id === currentId)) state.activities.tried.push({ id:currentId, date:new Date().toISOString() });
      persist(); render(); return announce("Aktivita je označená ako vyskúšaná.");
    }
    if (event.target.closest("[data-activity-favorite]") && currentId) {
      state.activities.favorites = state.activities.favorites.includes(currentId) ? state.activities.favorites.filter(id => id !== currentId) : [...state.activities.favorites, currentId];
      persist(); render(); return announce(state.activities.favorites.includes(currentId) ? "Aktivita je medzi obľúbenými." : "Aktivita už nie je medzi obľúbenými.");
    }
  });

  root.addEventListener("change", event => {
    const select = event.target.closest("[data-observation-id]");
    if (!select) return;
    state.activities.observations[select.dataset.observationId] = select.value;
    if (select.value === "ask") {
      const observation = Object.values(data.observations).flat().find(item => item.id === select.dataset.observationId);
      const exists = state.incidents.some(item => item.sourceObservationId === observation?.id);
      if (observation && !exists) state.incidents.push({ date:today(), type:"Iné", text:`Otázka pre pediatra: ${observation.text}`, created:new Date().toISOString(), sourceObservationId:observation.id });
      if (typeof save === "function") save(); else persist();
      render();
      announce("Otázka je pripravená v Zdravotnej karte.");
    } else {
      persist();
      announce("Pozorovanie je uložené.");
    }
  });

  document.addEventListener("click", event => {
    if (event.target.closest("[data-open-activities]")) switchView("activities");
  });
  let wasActive = view.classList.contains("active");
  new MutationObserver(() => { const active = view.classList.contains("active"); if (active && !wasActive) render(); wasActive = active; }).observe(view,{attributes:true,attributeFilter:["class"]});
  window.GugubooActivitiesCore = Object.freeze({ chronologicalAgeDays, correctedAgeDays, selectAgePeriod, selectActivity, migrateActivitiesState, render });
  if (wasActive) render();
})();

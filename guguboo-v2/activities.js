(function initGugubooActivities() {
  "use strict";

  const data = window.GugubooActivitiesData;
  const root = document.getElementById("activitiesApp");
  const view = document.getElementById("activities");
  if (!data || !root || !view || typeof state === "undefined") return;

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#039;" })[character]);
  const today = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const isPostpartum = () => state.profile?.status === "born";
  const persist = () => appStorage.setItem(storeKey, JSON.stringify(state));
  const announce = text => { if (typeof showToast === "function") showToast(text); const live = root.querySelector("[data-activities-live]"); if (live) live.textContent = text; };

  function chronologicalAgeDays(birthDate, now = new Date()) {
    if (!birthDate) return null;
    const birth = new Date(`${birthDate}T12:00:00`);
    if (!Number.isFinite(birth.getTime())) return null;
    const days = Math.floor((now.getTime() - birth.getTime()) / 86400000);
    return days < 0 || days > 2192 ? null : days;
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
      filter: data.domains?.[current.filter] ? current.filter : "",
      currentActivityId: typeof current.currentActivityId === "string" ? current.currentActivityId : ""
    };
  }

  state.activities = migrateActivitiesState(state.activities);

  function eligibleActivities(period, filter = "") {
    return data.activities.filter(activity => activity.period === period?.id && (!filter || activity.domain === filter));
  }

  function selectActivity(period, forceDifferent = false) {
    const candidates = eligibleActivities(period, state.activities.filter);
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

  // ——— Vzhľad (prepracované 10. 11. 2026): bez kreslených obrázkov – ikona a farba podľa oblasti, jasné kroky ———
  const V5 = () => window.GugubooV5;
  const icon = name => V5()?.icon?.(name) || "";
  const domainOf = activity => data.domains[activity.domain] || { label: "", icon: "sparkle" };
  const dateLabel = iso => { const [y, m, d] = String(iso).split("-").map(Number); return d && m && y ? d + ". " + m + ". " + y : ""; };
  const isTried = id => state.activities.tried.some(item => item.id === id);

  function todayCard(activity) {
    if (!activity) return "";
    const domain = domainOf(activity);
    const tried = isTried(activity.id);
    const favorite = state.activities.favorites.includes(activity.id);
    return `<article class="act2-today act2-${escapeHtml(activity.domain)}">
      <div class="act2-today-head"><span class="act2-icon">${icon(domain.icon)}</span><span class="act2-domain">${escapeHtml(domain.label)}</span>
        <button class="act2-fav" type="button" data-activity-favorite aria-pressed="${favorite}" aria-label="${favorite ? "Odobrať z obľúbených" : "Pridať medzi obľúbené"}">${favorite ? "♥" : "♡"}</button></div>
      <span class="act2-eyebrow">Skúsme dnes</span>
      <h2>${escapeHtml(activity.title)}</h2>
      <ol class="act2-steps">${activity.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
      ${activity.safety ? `<p class="act2-safety"><strong>Bezpečne:</strong> ${escapeHtml(activity.safety)}</p>` : ""}
      <div class="act2-actions"><button class="v5-primary" type="button" data-activity-tried aria-pressed="${tried}">${tried ? "✓ Vyskúšali sme" : "Vyskúšali sme"}</button><button class="v5-secondary" type="button" data-activity-other>Iný nápad</button></div>
    </article>`;
  }

  function activityRow(activity, currentId) {
    const domain = domainOf(activity);
    const favorite = state.activities.favorites.includes(activity.id);
    return `<button class="act2-row act2-${escapeHtml(activity.domain)}${activity.id === currentId ? " is-current" : ""}" type="button" data-activity-pick="${activity.id}">
      <span class="act2-icon">${icon(domain.icon)}</span><span class="act2-row-copy"><strong>${escapeHtml(activity.title)}</strong><small>${escapeHtml(domain.label)}${favorite ? " · ♥" : ""}</small></span>
      <b aria-hidden="true">${isTried(activity.id) ? "✓" : "›"}</b></button>`;
  }

  // „Čoskoro“: v posledných 2 týždňoch obdobia ukážka 3 nápadov z ďalšieho obdobia (len na prezretie).
  function soonHtml(period, days) {
    const index = data.periods.findIndex(item => item.id === period.id);
    const next = data.periods[index + 1];
    const left = period.maxDays - days;
    if (!next || left > 14) return "";
    const items = data.activities.filter(item => item.period === next.id).slice(0, 3);
    if (!items.length) return "";
    return `<section class="act2-soon"><h3>Čoskoro · ${escapeHtml(next.label)}</h3><p>O ${left + 1} ${left + 1 === 1 ? "deň" : left + 1 < 5 ? "dni" : "dní"} pribudnú nové nápady. Ukážka:</p>
      ${items.map(item => `<details class="act2-soon-item act2-${escapeHtml(item.domain)}"><summary><span class="act2-icon">${icon(domainOf(item).icon)}</span><strong>${escapeHtml(item.title)}</strong><b aria-hidden="true">›</b></summary><ol class="act2-steps">${item.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol>${item.safety ? `<p class="act2-safety"><strong>Bezpečne:</strong> ${escapeHtml(item.safety)}</p>` : ""}</details>`).join("")}
    </section>`;
  }

  function render() {
    if (!isPostpartum()) {
      if (view.classList.contains("active") && typeof switchView === "function") switchView("home");
      return;
    }
    const age = correctedAgeDays({ birthDate: state.profile.birth, gestationalWeek: state.profile.gestationalWeek, gestationalDay: state.profile.gestationalDay });
    if (age.days === null) {
      root.innerHTML = `<div class="activities-shell act2"><header class="act2-hero"><h1>Aktivity s dieťaťom</h1><p>Doplň dátum narodenia a ukážeme nápady pre aktuálny vek.</p></header><button class="v5-primary" type="button" data-activities-profile>Doplniť dátum narodenia</button></div>`;
      return;
    }
    const period = selectAgePeriod(age.days);
    if (!period) {
      root.innerHTML = `<div class="activities-shell act2"><header class="act2-hero"><h1>Aktivity s dieťaťom</h1><p>Nápady máme zatiaľ pripravené od narodenia do 2 rokov. Ďalšie pribudnú.</p></header></div>`;
      return;
    }
    const all = eligibleActivities(period, "");
    const filter = state.activities.filter;
    const shown = eligibleActivities(period, filter);
    const activity = selectActivity(period);
    const triedCount = all.filter(item => isTried(item.id)).length;
    const observations = data.observations[period.id] || [];
    const chips = [["", "Všetko", all.length], ...Object.entries(data.domains).map(([id, domain]) => [id, domain.label, all.filter(item => item.domain === id).length])]
      .filter(([, , count]) => count)
      .map(([id, label, count]) => `<button type="button" class="${filter === id ? "active" : ""}" data-activity-filter="${id}" aria-pressed="${filter === id}">${escapeHtml(label)} <span>${count}</span></button>`).join("");
    const sourceUrl = all.find(item => item.sourceUrl.includes("cdc.gov"))?.sourceUrl || "https://www.cdc.gov/act-early/milestones/index.html";
    const usesNhs = all.some(item => item.sourceUrl.includes("nhs.uk"));
    const option = (item, value, label) => `<option value="${value}" ${(state.activities.observations[item.id] || "") === value ? "selected" : ""}>${label}</option>`;
    root.innerHTML = `<div class="activities-shell act2">
      <header class="act2-hero"><span class="act2-eyebrow">${escapeHtml(period.label)}</span><h1>Čo sa dnes zahráme?</h1><p>${all.length} nápadov na tento vek${triedCount ? ` · vyskúšané ${triedCount}` : ""}</p></header>
      ${age.corrected ? `<details class="activities-corrected"><summary>Podľa korigovaného veku</summary><p>Vek je upravený o ${age.correctionDays} dní, lebo sa bábätko narodilo skôr. Vek v profile sa nemení.</p></details>` : ""}
      <div data-activity-current>${todayCard(activity)}</div>
      <div class="act2-chips" role="group" aria-label="Oblasť">${chips}</div>
      <div class="act2-list">${shown.map(item => activityRow(item, activity?.id)).join("")}</div>
      ${soonHtml(period, age.days)}
      <details class="act2-parent"><summary>Pre rodiča – čo si môžeš všimnúť</summary>
        <p>Voliteľné poznámky na rozhovor s pediatrom. Nie je to test – každé dieťa má svoje tempo.</p>
        ${observations.map(item => `<label class="act2-obs"><span>${escapeHtml(item.text)}</span><select data-observation-id="${item.id}" aria-label="Stav: ${escapeHtml(item.text)}">${option(item, "", "—")}${option(item, "noticed", "Všimla som si")}${option(item, "unknown", "Zatiaľ neviem")}${option(item, "ask", "Opýtať sa pediatra")}</select></label>`).join("")}
      </details>
      <a class="v2-source" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">Zdroj: ${escapeHtml(data.source)} (aktualizované ${dateLabel(data.reviewedAt)})${usesNhs ? " a NHS" : ""}, overené ${dateLabel(data.checkedAt)} · zhrnuté vlastnými slovami ↗</a>
      <div class="sr-only" data-activities-live aria-live="polite"></div>
    </div>`;
  }

  root.addEventListener("click", event => {
    if (event.target.closest("[data-activities-profile]")) { V5()?.openFeature?.("profiles"); return; }
    const filter = event.target.closest("[data-activity-filter]");
    if (filter) { state.activities.filter = filter.dataset.activityFilter; state.activities.currentActivityId = ""; persist(); return render(); }
    const pick = event.target.closest("[data-activity-pick]");
    if (pick) { state.activities.currentActivityId = pick.dataset.activityPick; persist(); render(); root.querySelector(".act2-today")?.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    if (event.target.closest("[data-activity-other]")) {
      const age = correctedAgeDays({ birthDate: state.profile.birth, gestationalWeek: state.profile.gestationalWeek, gestationalDay: state.profile.gestationalDay });
      selectActivity(selectAgePeriod(age.days), true); render(); return announce("Tu je iný nápad.");
    }
    const currentId = state.activities.currentActivityId;
    if (event.target.closest("[data-activity-tried]") && currentId) {
      if (!isTried(currentId)) state.activities.tried.push({ id: currentId, date: new Date().toISOString() });
      persist(); render(); return announce("Zapísané – vyskúšali ste to.");
    }
    if (event.target.closest("[data-activity-favorite]") && currentId) {
      state.activities.favorites = state.activities.favorites.includes(currentId) ? state.activities.favorites.filter(id => id !== currentId) : [...state.activities.favorites, currentId];
      persist(); render(); return announce(state.activities.favorites.includes(currentId) ? "Pridané medzi obľúbené." : "Odobrané z obľúbených.");
    }
  });
  root.addEventListener("change", event => {
    const select = event.target.closest("[data-observation-id]");
    if (!select) return;
    state.activities.observations[select.dataset.observationId] = select.value;
    if (select.value === "ask") {
      // Otázka ide do Zdravotnej knižky → Otázky pre pediatra (rovnako ako z GuguChatu).
      const observation = Object.values(data.observations).flat().find(item => item.id === select.dataset.observationId);
      const questions = (state.v5 ||= {}).pediatricianQuestions ||= [];
      const text = observation ? "Vývoj: " + observation.text : "";
      if (text && !questions.some(question => question.endsWith(text))) questions.push(new Date().toLocaleDateString("sk-SK", { day: "numeric", month: "numeric" }) + ": " + text);
      persist(); render();
      return announce("Otázka je v Zdravotnej knižke → Otázky pre pediatra.");
    }
    persist();
    announce("Uložené.");
  });
  document.addEventListener("click", event => {
    if (event.target.closest("[data-open-activities]")) switchView("activities");
  });
  let wasActive = view.classList.contains("active");
  new MutationObserver(() => { const active = view.classList.contains("active"); if (active && !wasActive) render(); wasActive = active; }).observe(view, { attributes: true, attributeFilter: ["class"] });
  window.GugubooActivitiesCore = Object.freeze({ chronologicalAgeDays, correctedAgeDays, selectAgePeriod, selectActivity, migrateActivitiesState, render });
  if (wasActive) render();
})();

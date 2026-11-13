/*
 * GUGUBOO V2 – Menštruačný kalendár v okienku Mama po pôrode (Samuel 7. 11. 2026).
 * Zápis dňa (sila krvácania + príznaky), mesačný kalendár, odhad ďalšej menštruácie z vlastných cyklov,
 * štatistiky, história, pripomienka 2 dni vopred (v Kalendári) a prehľad pre gynekológa na zdieľanie.
 * Zámerne BEZ plodných dní – appka nesmie pôsobiť ako antikoncepcia (NHS: otehotnieť sa dá už 3 týždne po pôrode).
 * Texty k zdraviu sú len z content/mama-po-porode.js (NHS, so zdrojom a dátumom overenia).
 * Dáta: state.v2.period = { days: { "YYYY-MM-DD": { flow, sym: [] } }, remind, month, sel, endedOn }.
 */
(function initGugubooPeriod() {
  "use strict";

  if (typeof state === "undefined" || !window.GugubooV5) return;

  const V5 = window.GugubooV5;
  const esc = V5.escapeHtml;
  const FLOWS = [
    ["", "Nič"], ["spot", "Špinenie"], ["light", "Slabá"], ["medium", "Stredná"], ["heavy", "Silná"]
  ];
  const FLOW_LABEL = Object.fromEntries(FLOWS);
  const SYMPTOMS = [
    ["cramps", "Kŕče"], ["head", "Bolesť hlavy"], ["breasts", "Citlivé prsia"],
    ["tired", "Únava"], ["mood", "Výkyvy nálady"], ["bloat", "Nadúvanie"]
  ];
  const SYM_LABEL = Object.fromEntries(SYMPTOMS);

  const pad = n => String(n).padStart(2, "0");
  const keyOf = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const parse = key => new Date(key + "T12:00:00");
  const today = () => keyOf(new Date());
  const addDays = (key, n) => { const d = parse(key); d.setDate(d.getDate() + n); return keyOf(d); };
  const diff = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);
  const short = key => { const d = parse(key); return d.getDate() + ". " + (d.getMonth() + 1) + "."; };
  const long = key => parse(key).toLocaleDateString("sk-SK", { weekday: "long", day: "numeric", month: "long" });
  const dni = n => n + (n === 1 ? " deň" : n < 5 ? " dni" : " dní");
  const content = () => window.GugubooContent?.mamaPostpartum?.period;

  function data() {
    state.v2 ||= {};
    const p = state.v2.period ||= {};
    p.days ||= {};
    return p;
  }

  // Menštruácie = súvislé dni so slabým až silným krvácaním (1 vynechaný deň ich nerozdelí). Špinenie sa nepočíta.
  function periods() {
    const days = data().days;
    const keys = Object.keys(days).filter(k => days[k]?.flow && days[k].flow !== "spot").sort();
    const runs = [];
    keys.forEach(k => {
      const last = runs[runs.length - 1];
      if (last && diff(last.end, k) <= 2) last.end = k;
      else runs.push({ start: k, end: k });
    });
    runs.forEach(r => { r.len = diff(r.start, r.end) + 1; });
    return runs;
  }

  function stats() {
    const runs = periods();
    const cycles = [];
    for (let i = 1; i < runs.length; i++) cycles.push(diff(runs[i - 1].start, runs[i].start));
    const recent = cycles.slice(-6);
    const lens = runs.slice(-6).map(r => r.len);
    const mean = list => list.length ? Math.round(list.reduce((a, b) => a + b, 0) / list.length) : 0;
    const avgCycle = mean(recent);
    const avgLen = mean(lens) || 5;
    const last = runs[runs.length - 1] || null;
    const t = today();
    const ended = data().endedOn;
    const ongoing = last && diff(last.end, t) <= 1 && !(ended && ended >= last.end) ? last : null;
    let next = null;
    let late = 0;
    if (last && avgCycle) {
      next = addDays(last.start, avgCycle);
      if (!ongoing && next < t) late = diff(next, t);
    }
    return {
      runs, cycles, avgCycle, avgLen, last, ongoing, next, late,
      min: recent.length ? Math.min(...recent) : 0,
      max: recent.length ? Math.max(...recent) : 0
    };
  }

  // Odhadované dni na 3 cykly dopredu (len budúce dni).
  function predictedDays(s) {
    const set = new Set();
    if (!s.next || s.ongoing) return set;
    const t = today();
    for (let c = 0; c < 3; c++) {
      const start = addDays(s.next, c * s.avgCycle);
      for (let i = 0; i < s.avgLen; i++) {
        const k = addDays(start, i);
        if (k > t) set.add(k);
      }
    }
    return set;
  }

  // Špinenie mimo menštruácie (nie v šestonedelí) – NHS: krvácanie medzi menštruáciami povedať lekárovi.
  function betweenBleeding(runs) {
    const days = data().days;
    const birth = state.profile?.birth;
    return Object.keys(days).filter(k => days[k]?.flow === "spot").sort().filter(k => {
      if (birth && diff(birth, k) < 42) return false;
      return !runs.some(r => diff(r.end, k) <= 2 && diff(k, r.start) <= 2);
    });
  }

  function syncReminder(s) {
    state.reminders ||= [];
    const before = state.reminders.filter(r => r.source === "period-predict").map(r => r.date).join("|");
    state.reminders = state.reminders.filter(r => r.source !== "period-predict");
    if (data().remind && s.next && !s.ongoing) {
      const when = addDays(s.next, -2);
      if (when >= today()) {
        state.reminders.push({ id: "v2-period-" + when, title: "Menštruácia môže prísť o 2 dni (odhad)", date: parse(when).toISOString().slice(0, 10) + "T08:00:00.000Z", type: "Pripomienka", source: "period-predict" });
      }
    }
    const after = state.reminders.filter(r => r.source === "period-predict").map(r => r.date).join("|");
    return before !== after;
  }

  function calendarHtml(s) {
    const p = data();
    const t = today();
    const month = p.month || t.slice(0, 7);
    const sel = p.sel || t;
    const [year, mi] = month.split("-").map(Number);
    const first = new Date(year, mi - 1, 1);
    const count = new Date(year, mi, 0).getDate();
    const offset = (first.getDay() + 6) % 7;
    const shift = delta => { const d = new Date(year, mi - 1 + delta, 1); return d.getFullYear() + "-" + pad(d.getMonth() + 1); };
    const predicted = predictedDays(s);
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push("<span></span>");
    for (let day = 1; day <= count; day++) {
      const k = month + "-" + pad(day);
      const entry = p.days[k];
      const cls = [
        k === t ? "is-today" : "",
        k === sel ? "is-selected" : "",
        entry?.flow && entry.flow !== "spot" ? "is-period is-" + entry.flow : "",
        entry?.flow === "spot" ? "is-spot" : "",
        !entry?.flow && predicted.has(k) ? "is-predicted" : ""
      ].filter(Boolean).join(" ");
      const label = long(k) + (entry?.flow ? ", " + FLOW_LABEL[entry.flow] : predicted.has(k) ? ", odhad menštruácie" : "");
      cells.push("<button type='button' data-v2-period-day='" + k + "' class='" + cls + "'" + (k > t ? " disabled" : "") + " aria-label='" + esc(label) + "'>" + day + (entry?.sym?.length ? "<i aria-hidden='true'></i>" : "") + "</button>");
    }
    return [
      "<section class='v2-mama-card v2-per-cal'>",
      "<div class='v2-cal-month-head'><button type='button' data-v2-period-month='", shift(-1), "' aria-label='Predchádzajúci mesiac'>‹</button><strong>",
      esc(first.toLocaleDateString("sk-SK", { month: "long", year: "numeric" })),
      "</strong><button type='button' data-v2-period-month='", shift(1), "' aria-label='Nasledujúci mesiac'>›</button></div>",
      "<div class='v2-cal-grid v2-per-grid'>", ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"].map(d => "<b>" + d + "</b>").join(""), cells.join(""), "</div>",
      "<div class='v2-per-legend'><span><i class='is-period'></i>Menštruácia</span><span><i class='is-spot'></i>Špinenie</span><span><i class='is-predicted'></i>Odhad</span></div>",
      "</section>"
    ].join("");
  }

  function dayEditorHtml() {
    const p = data();
    const sel = p.sel || today();
    const entry = p.days[sel] || {};
    return [
      "<section class='v2-mama-card v2-per-day'><h3>", esc(sel === today() ? "Dnes" : long(sel)), "</h3>",
      "<h4>Krvácanie</h4><div class='v2-per-chips' role='group' aria-label='Krvácanie'>",
      FLOWS.map(([id, label]) => "<button type='button' data-v2-period-flow='" + id + "' aria-pressed='" + String((entry.flow || "") === id) + "' class='" + ((entry.flow || "") === id ? "active" : "") + (id ? " flow-" + id : "") + "'>" + esc(label) + "</button>").join(""),
      "</div><h4>Ako sa cítiš</h4><div class='v2-per-chips' role='group' aria-label='Príznaky'>",
      SYMPTOMS.map(([id, label]) => { const on = (entry.sym || []).includes(id); return "<button type='button' data-v2-period-sym='" + id + "' aria-pressed='" + String(on) + "' class='" + (on ? "active" : "") + "'>" + esc(label) + "</button>"; }).join(""),
      "</div></section>"
    ].join("");
  }

  function statusHtml(s) {
    const p = data();
    const t = today();
    const birth = state.profile?.birth;
    const birthDays = birth ? diff(birth, t) : null;
    let title;
    let sub;
    let actions;
    if (s.ongoing) {
      const day = diff(s.ongoing.start, t) + 1;
      title = day + ". deň menštruácie";
      sub = p.days[t]?.flow ? "Dnes zapísané · " + FLOW_LABEL[p.days[t].flow].toLowerCase() : "Je to tak aj dnes?";
      actions = p.days[t]?.flow
        ? "<button type='button' class='v5-secondary' data-v2-period-end>Menštruácia skončila</button>"
        : "<button type='button' class='v5-primary' data-v2-period-today='" + esc(p.days[s.ongoing.end]?.flow || "medium") + "'>Áno, aj dnes</button><button type='button' class='v5-secondary' data-v2-period-end>Už skončila</button>";
    } else {
      if (s.late > 0) { title = dni(s.late) + " po odhade"; sub = "Odhad z tvojich cyklov je len orientačný."; }
      else if (s.next) { const left = diff(t, s.next); title = left === 0 ? "Môže prísť dnes" : "O " + dni(left); sub = "Ďalšia menštruácia asi " + short(s.next) + " · odhad"; }
      else if (s.last) { title = "Prvá zapísaná " + short(s.last.start); sub = "Odhad ďalšej ukážeme po druhej zapísanej menštruácii."; }
      else { title = "Zatiaľ nič zapísané"; sub = birthDays !== null && birthDays < 42 ? "Krvácanie v prvých týždňoch po pôrode nie je menštruácia – zapíš až tú." : "Keď začne menštruácia, stačí ťuknúť nižšie."; }
      actions = "<button type='button' class='v5-primary' data-v2-period-today='medium'>Začala mi menštruácia</button>";
    }
    return [
      "<section class='v2-per-status", s.ongoing ? " is-on" : "", "'><span class='v2-per-drop' aria-hidden='true'></span><div><strong>", esc(title), "</strong><small>", esc(sub), "</small></div></section>",
      "<div class='v5-actions v2-per-actions'>", actions, "</div>"
    ].join("");
  }

  function statsHtml(s) {
    if (!s.runs.length) return "";
    const tiles = [
      ["Priemerný cyklus", s.avgCycle ? dni(s.avgCycle) : "–", s.cycles.length > 1 ? (s.min === s.max ? "zatiaľ rovnaký" : s.min + "–" + s.max + " dní") : s.avgCycle ? "z 1 cyklu" : "po 2. menštruácii"],
      ["Menštruácia trvá", dni(s.avgLen), s.runs.length > 1 ? "priemer" : "posledná"],
      ["Posledná začala", short(s.last.start), s.runs.length + (s.runs.length === 1 ? " zápis" : s.runs.length < 5 ? " zápisy" : " zápisov")]
    ];
    const history = s.runs.slice(-6).reverse().map((r, i, arr) => {
      const prev = arr[i + 1];
      return "<li><span>" + esc(short(r.start)) + (r.end !== r.start ? " – " + esc(short(r.end)) : "") + "</span><b>" + esc(dni(r.len)) + "</b>" + (prev ? "<small>cyklus " + esc(dni(diff(prev.start, r.start))) + "</small>" : "<small></small>") + "</li>";
    }).join("");
    return [
      "<div class='v2-per-tiles'>", tiles.map(([label, value, note]) => "<div><small>" + esc(label) + "</small><strong>" + esc(value) + "</strong><em>" + esc(note) + "</em></div>").join(""), "</div>",
      "<details class='v2-mama-trouble v2-per-history'><summary><span aria-hidden='true'>🗓️</span><strong>História menštruácií</strong><b aria-hidden='true'>›</b></summary><ul>", history, "</ul></details>"
    ].join("");
  }

  function noticesHtml(s) {
    const c = content();
    const out = [];
    const long7 = s.runs.slice(-3).filter(r => r.len > 7);
    const between = betweenBleeding(s.runs).slice(-3);
    if (c && (long7.length || between.length)) {
      out.push("<div class='v2-calm-box'><strong>Na toto sa oplatí myslieť pri najbližšej návšteve gynekológa</strong><ul class='v2-mama-list'>" +
        long7.map(r => "<li>menštruácia od " + esc(short(r.start)) + " trvala " + esc(dni(r.len)) + "</li>").join("") +
        between.map(k => "<li>špinenie mimo menštruácie " + esc(short(k)) + "</li>").join("") +
        "</ul><p>" + esc(c.doctorIntro + " " + c.doctor.join(" alebo ") + ".") + "</p></div>");
    }
    const birth = state.profile?.birth;
    const firstAfter = birth ? s.runs.find(r => r.start > birth) : null;
    if (firstAfter) {
      const weeks = Math.floor(diff(birth, firstAfter.start) / 7) + 1;
      out.push("<p class='v2-per-first'>Prvá menštruácia po pôrode: <b>" + esc(short(firstAfter.start)) + "</b> · " + esc(weeks + ". týždeň po pôrode") + "</p>");
    }
    return out.join("");
  }

  function infoHtml() {
    const c = content();
    if (!c) return "";
    const bullets = items => "<ul class='v2-mama-list'>" + items.map(item => "<li>" + esc(item) + "</li>").join("") + "</ul>";
    const src = (url, reviewed) => "<a class='v2-source' href='" + esc(url) + "' target='_blank' rel='noopener noreferrer'>Zdroj: NHS · stránka z " + esc(reviewed) + ", overené " + esc(c.checked) + " ↗</a>";
    const box = (emoji, title, body) => "<details class='v2-mama-trouble'><summary><span aria-hidden='true'>" + emoji + "</span><strong>" + esc(title) + "</strong><b aria-hidden='true'>›</b></summary>" + body + "</details>";
    return [
      "<h3 class='v2-per-info-title'>Dobré vedieť</h3><div class='v2-mama-troubles'>",
      box("🌙", c.returnTitle, bullets(c.returnItems) + src(c.source, c.reviewed)),
      box("💞", c.pregnancyTitle, bullets(c.pregnancyItems) + "<p class='v2-mama-muted'>Kalendár neukazuje plodné dni a nie je antikoncepcia.</p>" + src(c.source, c.reviewed)),
      box("🩹", c.padsTitle, bullets(c.padsItems) + src(c.source, c.reviewed)),
      box("🩺", "Kedy sa ozvať lekárovi", "<p>" + esc(c.cycleNote) + "</p><div class='v2-calm-box'><strong>" + esc(c.doctorIntro) + "</strong>" + bullets(c.doctor) + "</div>" + src(c.doctorSource, c.doctorReviewed)),
      "</div>"
    ].join("");
  }

  // Obsah sekcie (hlavičku a tlačidlo späť dopĺňa renderMama).
  function html() {
    const s = stats();
    if (syncReminder(s)) V5.persist();
    const p = data();
    return [
      statusHtml(s),
      calendarHtml(s),
      dayEditorHtml(),
      statsHtml(s),
      noticesHtml(s),
      "<section class='v2-mama-card v2-per-tools'>",
      "<label class='v2-per-toggle'><input type='checkbox' data-v2-period-remind", p.remind ? " checked" : "", "><span><strong>Pripomenúť 2 dni vopred</strong><small>", s.next ? "Pripomienka sa objaví v Kalendári podľa odhadu." : "Funguje od druhej zapísanej menštruácie.", "</small></span></label>",
      s.runs.length ? "<button type='button' class='v5-secondary' data-v2-period-share>Prehľad pre gynekológa</button>" : "",
      "</section>",
      infoHtml(),
      "<p class='v5-book-note'>Zápisy vidíš len ty. V tejto beta verzii sa po zatvorení appky vymažú.</p>"
    ].join("");
  }

  function summaryText() {
    const s = stats();
    const days = data().days;
    const lines = ["Menštruácia – prehľad z Guguboo"];
    if (state.profile?.birth) lines.push("Pôrod: " + parse(state.profile.birth).toLocaleDateString("sk-SK"));
    lines.push("");
    s.runs.slice(-6).forEach(r => {
      const sym = new Set();
      for (let k = r.start; k <= r.end; k = addDays(k, 1)) (days[k]?.sym || []).forEach(x => sym.add(SYM_LABEL[x]));
      const heavy = Object.keys(days).some(k => k >= r.start && k <= r.end && days[k]?.flow === "heavy");
      lines.push(short(r.start) + (r.end !== r.start ? "–" + short(r.end) : "") + " (" + dni(r.len) + ")" + (heavy ? ", silná" : "") + (sym.size ? " · " + [...sym].join(", ") : ""));
    });
    if (s.avgCycle) lines.push("", "Priemerný cyklus: " + dni(s.avgCycle) + (s.cycles.length > 1 && s.min !== s.max ? " (" + s.min + "–" + s.max + ")" : ""));
    const between = betweenBleeding(s.runs);
    if (between.length) lines.push("Špinenie mimo menštruácie: " + between.map(short).join(", "));
    return lines.join("\n");
  }

  async function share() {
    const text = summaryText();
    try {
      if (navigator.share) { await navigator.share({ title: "Menštruácia – prehľad", text }); return; }
    } catch (error) { if (error?.name === "AbortError") return; }
    try { await navigator.clipboard.writeText(text); V5.announce("Prehľad je skopírovaný – môžeš ho vložiť do správy."); }
    catch { V5.announce("Zdieľanie sa nepodarilo."); }
  }

  function rerender() {
    V5.persist();
    window.GugubooV5.rerenderPeriod?.();
  }

  document.addEventListener("click", event => {
    const p = data();
    const day = event.target.closest("[data-v2-period-day]");
    if (day) { p.sel = day.dataset.v2PeriodDay; return rerender(); }
    const month = event.target.closest("[data-v2-period-month]");
    if (month) { p.month = month.dataset.v2PeriodMonth; return rerender(); }
    const flow = event.target.closest("[data-v2-period-flow]");
    if (flow) {
      const sel = p.sel || today();
      const entry = p.days[sel] || {};
      entry.flow = flow.dataset.v2PeriodFlow;
      if (!entry.flow && !(entry.sym || []).length) delete p.days[sel];
      else p.days[sel] = entry;
      if (entry.flow && entry.flow !== "spot" && p.endedOn && p.endedOn <= sel) delete p.endedOn;
      return rerender();
    }
    const sym = event.target.closest("[data-v2-period-sym]");
    if (sym) {
      const sel = p.sel || today();
      const entry = p.days[sel] || {};
      const set = new Set(entry.sym || []);
      const id = sym.dataset.v2PeriodSym;
      set.has(id) ? set.delete(id) : set.add(id);
      entry.sym = [...set];
      if (!entry.flow && !entry.sym.length) delete p.days[sel];
      else p.days[sel] = entry;
      return rerender();
    }
    const start = event.target.closest("[data-v2-period-today]");
    if (start) {
      const t = today();
      p.days[t] = { ...(p.days[t] || {}), flow: start.dataset.v2PeriodToday || "medium" };
      p.sel = t;
      p.month = t.slice(0, 7);
      delete p.endedOn;
      V5.announce("Zapísané na dnes.");
      return rerender();
    }
    if (event.target.closest("[data-v2-period-end]")) {
      p.endedOn = today();
      V5.announce("Zapísané, menštruácia skončila.");
      return rerender();
    }
    if (event.target.closest("[data-v2-period-share]")) share();
  });

  document.addEventListener("change", event => {
    const remind = event.target.closest?.("[data-v2-period-remind]");
    if (!remind) return;
    data().remind = remind.checked;
    syncReminder(stats());
    V5.announce(remind.checked ? "Pripomienka zapnutá." : "Pripomienka vypnutá.");
    rerender();
  });

  window.GugubooPeriod = { html, stats, summaryText };
})();

/*
 * GUGUBOO MASTER 1.8 – jeden spoločný systém okien (V14, schválil Samo 14. 11.).
 *
 * Nad obrazovkou (Domov, Bábätko, Mama, Rodina a okná sekcií) je JEDNA vrstva okien so zásobníkom:
 *   - celostránkové okná (Plán, Tvoj mesiac, Úrady a doklady) – lišta ostáva viditeľná nad nimi,
 *   - krátke akcie (Všetko/hľadanie, Denné záznamy, Oddych/Telo/Opora, Nová udalosť, starostlivosť) – prekryjú lištu.
 * Spoločné pravidlá: späť = o krok, × = zavrie celý zásobník (obrazovka pod ním ostáva), Esc = zavrie vrchné okno,
 * poradie vrstiev podľa zásobníka, pozadie sa neposúva, fokus ide do okna a po zatvorení sa vráti na prvok,
 * ktorý okno otvoril, systémové „späť“ (popstate) robí to isté ako šípka späť.
 * Rozpísané údaje sa bez upozornenia nestratia (späť, ×, Esc, systémové späť, lišta, výber v zásuvke).
 *
 * Modul sa na existujúce okná napája zvonku (sleduje triedu „open“), takže otváranie ostáva tam, kde bolo.
 */
(function initG2Windows() {
  "use strict";

  const V5 = window.GugubooV5;
  if (!V5 || !V5.MASTER) return;
  const byId = id => document.getElementById(id);
  const NO_WINDOW_VIEWS = new Set(["home", "welcome", "birthIntro", "pregnancyIntro"]);

  // ——— Typy vrstiev ———
  const oBack = () => {
    const back = byId("v5OMenuBack");
    if (back && !back.hidden && back.offsetParent) back.click();
    else V5.closeAdaptiveOMenu();
  };
  // Master 4.0 (Audit F9): reopen = ako okno znova otvoriť, keď sa späť vracia do neho z okna/obrazovky, ktorú otvorilo
  // (Všetko → položka → späť = Všetko; Plán → Oznámenie → späť = Plán; Dnes → Spánok a zvuky → späť = Dnes).
  const LAYERS = [
    { id: "v5DrawerOverlay", kind: "sheet", back: () => V5.closeDrawer(), close: () => V5.closeDrawer(), reopen: () => V5.openDrawer() },
    { id: "v5QuickRecordOverlay", kind: "sheet", back: () => V5.closeQuickRecord(), close: () => V5.closeQuickRecord(), reopen: () => V5.openQuickRecord() },
    // Master 4.0.1 (Kontrola F9): Esc ide o krok (Starostlivosť → Plač, teplota a iné → Teplota → Esc = späť), × zavrie;
    // oblasť Plánu (Vybaviť…) sa dá znova otvoriť, keď sa späť vracia z obrazovky, ktorú otvorila (Oznámenie).
    { id: "v5OOverlay", kind: "sheet", escBack: true, back: oBack, close: () => V5.closeAdaptiveOMenu(), reopen: () => V5.reopenOrganizationMenu?.(), canReopen: rc => rc.org },
    { id: "g2PlanOverlay", kind: "full", back: () => V5.closePlan(), close: () => V5.closePlan(), reopen: () => V5.openPlan() },
    { id: "g2MonthOverlay", kind: "full", back: () => V5.closeMonth(), close: () => V5.closeMonth(), reopen: () => V5.openMonth() },
    { id: "v2AdminOverlay", kind: "full", back: () => window.GugubooAdmin?.stepBack?.(), close: () => window.GugubooAdmin?.close?.() },
    // Master 2.0: Čas pre teba (g2-ring.js) – krátka akcia, späť o krok v rámci okna, × / Esc zavrie
    { id: "g2RingOverlay", kind: "sheet", back: () => window.G2Ring?.back?.(), close: () => window.G2Ring?.close?.() },
    // Master 2.1: krátke voľby kruhu na domove (kŕmenie, plienky, jedlo, kontrakcie)
    // Master 4.0 (Audit F9): späť aj Esc idú o krok v rámci okna (Dnes → Upraviť → späť = Dnes), × zavrie.
    { id: "g2QuickOverlay", kind: "sheet", escBack: true, back: () => window.G2Quick?.back?.(), close: () => window.G2Quick?.close?.(), reopen: () => window.G2Quick?.reopen?.() },
    { id: "g2WeatherOverlay", kind: "sheet", back: () => window.G2Weather?.close?.(), close: () => window.G2Weather?.close?.() },
    { id: "g2BackupOverlay", kind: "sheet", back: () => window.G2Backup?.close?.(), close: () => window.G2Backup?.close?.() },
    // Master 4.0 (Audit F4): okno „Zapísať ako otázku…“ a spätná väzba sú v spoločnom systéme okien – Esc a systémové späť zavrú len ich.
    { id: "g2AskQ", kind: "sheet", back: () => V5.closeAskQuestion?.(), close: () => V5.closeAskQuestion?.() },
    { id: "v2FeedbackOverlay", kind: "sheet", back: () => window.GugubooChat?.closeFeedback?.(), close: () => window.GugubooChat?.closeFeedback?.() }
  ];
  const layerById = Object.fromEntries(LAYERS.map(layer => [layer.id, layer]));

  const opened = new Map(); // id → { order, opener }
  let order = 0;
  let lastActivator = null;
  const isOpen = el => Boolean(el && el.classList.contains("open"));
  function stack() {
    return LAYERS.filter(layer => opened.has(layer.id) && isOpen(byId(layer.id))).sort((a, b) => opened.get(a.id).order - opened.get(b.id).order);
  }
  const topLayer = () => stack().pop() || null;
  const activeView = () => document.querySelector(".view.active");

  // Kto okno otvoril (ťuk alebo Enter/medzerník) – sem sa po zatvorení vráti fokus.
  document.addEventListener("pointerdown", event => { lastActivator = event.target.closest("button, a, input, select, textarea, [tabindex], [role='button']") || event.target; }, true);
  document.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") lastActivator = document.activeElement; }, true);

  // ——— Poradie vrstiev a zámok pozadia ———
  function layout() {
    const layers = stack();
    let sheetBelow = false;
    layers.forEach((layer, index) => {
      const el = byId(layer.id);
      const z = layer.kind === "sheet" || sheetBelow ? 190 + index : Math.min(179, 176 + index);
      if (layer.kind === "sheet") sheetBelow = true;
      el.style.setProperty("z-index", String(z), "important");
      el.dataset.g2Layer = String(index + 1);
    });
    LAYERS.forEach(layer => {
      const el = byId(layer.id);
      if (el && !layers.includes(layer)) { el.style.removeProperty("z-index"); delete el.dataset.g2Layer; }
    });
    document.documentElement.classList.toggle("g2-layer-open", layers.length > 0);
  }

  // ——— Fokus ———
  // Master 1.9.2 (QA S8): fokus sa nesmie stratiť na <body> – po „Zahodiť a odísť“ ani po uložení formulára (obsah sa prekreslí).
  function focusLost() {
    const active = document.activeElement;
    return !active || active === document.body || active === document.documentElement || !visible(active);
  }
  function recoverFocus() {
    if (!focusLost() || confirmOpen()) return;
    const top = topLayer();
    if (top) return focusInto(byId(top.id));
    const view = activeView();
    const head = view?.querySelector(":scope > .v5-universal-window-head strong");
    if (head && visible(head)) { head.setAttribute("tabindex", "-1"); return head.focus({ preventScroll: true }); }
    // len tlačidlo alebo odkaz – pole by na telefóne otvorilo klávesnicu
    const first = Array.from((view || document).querySelectorAll("button, [href]")).find(visible);
    first?.focus?.({ preventScroll: true });
  }
  const visible = el => Boolean(el && el.isConnected && (el.offsetParent || el.getClientRects().length) && !el.closest("[aria-hidden='true'], [inert]"));
  function signature(el) {
    if (!el || !el.attributes) return "";
    // Master 4.0 (Audit F52): aj druhý data-atribút (napr. diel kruhu [data-g2q='seg'][data-seg='move']) – fokus sa vráti na ten istý diel.
    const attrs = Array.from(el.attributes).filter(item => item.name.startsWith("data-") && item.name !== "data-g2-go").slice(0, 2);
    return attrs.length ? attrs.map(attr => "[" + attr.name + (attr.value ? "='" + CSS.escape(attr.value) + "'" : "") + "]").join("") : el.id ? "#" + CSS.escape(el.id) : "";
  }
  function focusInto(el) {
    if (!el || el.contains(document.activeElement)) return;
    const target = el.querySelector("[data-g2-autofocus], h2[tabindex='-1'], .v5-universal-window-head strong[tabindex='-1']") ||
      Array.from(el.querySelectorAll("button, [href], input, select, textarea")).find(visible);
    target?.focus?.({ preventScroll: true });
  }
  function restoreFocus(entry, scope) {
    const opener = entry?.opener;
    if (visible(opener)) return opener.focus({ preventScroll: true });
    const sig = entry?.sig;
    const again = sig ? Array.from((scope || document).querySelectorAll(sig)).find(visible) : null;
    if (again) return again.focus({ preventScroll: true });
    const head = activeView()?.querySelector(":scope > .v5-universal-window-head strong");
    if (head) { head.setAttribute("tabindex", "-1"); head.focus({ preventScroll: true }); }
  }

  // ——— Master 4.0 (Audit F9): späť o krok aj medzi oknami ———
  // Keď sa okno zavrie a hneď (v tom istom ťuku) sa otvorí iné okno alebo obrazovka, zapamätáme si, odkiaľ prišlo.
  // Späť (šípka späť, Esc, systémové späť) potom to pôvodné okno znova otvorí; × a lišta nie.
  let recentlyClosed = null; // { id, at }
  let backAt = -1e9;
  const now = () => performance.now();
  const markBack = () => { backAt = now(); };
  const backRecently = () => now() - backAt < 700;
  function takeReturn(exceptId) {
    const rc = recentlyClosed;
    recentlyClosed = null;
    if (!rc || rc.id === exceptId || now() - rc.at > 400 || backRecently()) return "";
    const layer = layerById[rc.id];
    return layer?.reopen && (!layer.canReopen || layer.canReopen(rc)) ? rc.id : ""; // Master 4.0.1 (Kontrola F9)
  }
  function reopenLayer(id) {
    if (!id || isOpen(byId(id))) return;
    setTimeout(() => { if (!stack().length && !confirmOpen()) layerById[id]?.reopen?.(); }, 0);
  }

  // Master 4.0.1 (Kontrola F9): okno, ktoré sa otvorí ešte PRED zatvorením predošlého (Všetko → Záloha a appka), si ho tiež
  // zapamätá ako návrat – systémové späť potom vráti Všetko, nie Domov.
  let lastOpened = null; // { id, at }
  function onOpen(layer, el) {
    const opener = lastActivator && !el.contains(lastActivator) ? lastActivator : document.activeElement;
    opened.set(layer.id, { order: ++order, opener, sig: signature(opener), returnTo: takeReturn(layer.id) });
    lastOpened = { id: layer.id, at: now() };
    layout();
    // Fokus do okna (s opakovaním, kým okno nedobehne animáciou a nie je viditeľné).
    let tries = 0;
    const moveFocus = () => {
      if (!isOpen(el)) return;
      focusInto(el.querySelector("[role='dialog']") || el);
      if (!el.contains(document.activeElement) && ++tries < 5) setTimeout(moveFocus, 120);
    };
    setTimeout(moveFocus, 80);
    setTimeout(ensureSentinel, 0);
  }
  function onClose(layer, el) {
    const entry = opened.get(layer.id);
    opened.delete(layer.id);
    layout();
    recentlyClosed = { id: layer.id, at: now(), org: layer.id === "v5OOverlay" && Boolean(byId("v5OMenuBody")?.querySelector(".v5-org-next-card, [data-v5-org-done]")) };
    const later = lastOpened && lastOpened.id !== layer.id && now() - lastOpened.at < 400 ? opened.get(lastOpened.id) : null;
    if (later && !later.returnTo && !backRecently() && isOpen(byId(lastOpened.id))) {
      const closedLayer = layerById[layer.id];
      if (closedLayer?.reopen && (!closedLayer.canReopen || closedLayer.canReopen(recentlyClosed))) { later.returnTo = layer.id; recentlyClosed = null; }
    }
    if (entry?.returnTo && backRecently()) { recentlyClosed = null; reopenLayer(entry.returnTo); return; }
    const lost = focusLost() || el.contains(document.activeElement);
    if (lost) setTimeout(() => {
      const top = topLayer();
      // QA N3: okno nad oknom – fokus späť na prvok v spodnom okne, ktorý ho otvoril (nie na jeho nadpis).
      if (top) return visible(entry?.opener) && byId(top.id).contains(entry.opener) ? entry.opener.focus({ preventScroll: true }) : focusInto(byId(top.id));
      restoreFocus(entry, activeView() || document);
    }, 30);
  }

  // Okná vznikajú postupne (Plán, Tvoj mesiac a Úrady až pri prvom použití) – sledujeme ich triedu „open“.
  const watched = new WeakSet();
  function attach() {
    LAYERS.forEach(layer => {
      const el = byId(layer.id);
      if (!el || watched.has(el)) return;
      watched.add(el);
      if (isOpen(el)) onOpen(layer, el);
      new MutationObserver(() => {
        const now = isOpen(el);
        const was = opened.has(layer.id);
        if (now && !was) onOpen(layer, el);
        else if (!now && was) onClose(layer, el);
      }).observe(el, { attributes: true, attributeFilter: ["class"] });
    });
  }
  new MutationObserver(attach).observe(document.body, { childList: true });
  attach();

  function closeLayers() {
    stack().reverse().forEach(layer => { if (isOpen(byId(layer.id))) layer.close(); });
  }

  // ——— Rozpísané údaje ———
  // Len textové polia a výbery vo formulároch. Polia, ktoré sa ukladajú hneď pri písaní, sa nekontrolujú.
  const AUTOSAVE = "#g2Q, #v2ChatInput, #chatInput, .private-pin, [data-v2-ann-field], [data-v2-ann-crop], [data-v2-bc-field], [data-v5-water-glass], [data-v2-summary-time], [data-v2-voice-name], [data-g2-no-guard]";
  function dirtyFields(roots) {
    return roots.filter(Boolean).flatMap(root => Array.from(root.querySelectorAll("input, textarea, select"))).filter(field => {
      if (field.disabled || field.matches(AUTOSAVE) || field.closest("[data-g2-no-guard]")) return false;
      if (field.tagName === "SELECT") {
        if (!field.closest("form, .v5-form-card, .v5-o-compact-form")) return false;
        const initial = Array.from(field.options).findIndex(option => option.defaultSelected);
        return field.selectedIndex !== (initial < 0 ? 0 : initial);
      }
      const type = (field.type || "text").toLowerCase();
      if (["hidden", "search", "range", "button", "submit", "file", "checkbox", "radio", "color"].includes(type)) return false;
      return field.value !== field.defaultValue;
    });
  }
  function resetFields(fields) {
    fields.forEach(field => {
      if (field.tagName === "SELECT") Array.from(field.options).forEach((option, index) => { option.selected = option.defaultSelected || (index === 0 && !Array.from(field.options).some(item => item.defaultSelected)); });
      else field.value = field.defaultValue;
    });
  }

  let pending = null;
  let stayFocus = null;
  function confirmDiscard(fields, onDiscard) {
    let box = byId("g2Confirm");
    if (!box) {
      document.body.insertAdjacentHTML("beforeend", "<div id='g2Confirm' class='g2-confirm' role='alertdialog' aria-modal='true' aria-labelledby='g2ConfirmTitle' aria-describedby='g2ConfirmText'><div class='g2-confirm-card'>" +
        "<h2 id='g2ConfirmTitle'>Máš rozpísané údaje</h2><p id='g2ConfirmText'>Ak odídeš, rozpísaný text sa neuloží.</p>" +
        "<div class='g2-confirm-actions'><button type='button' class='v5-primary' data-g2-confirm-stay>Pokračovať v písaní</button><button type='button' class='v5-secondary' data-g2-confirm-discard>Zahodiť a odísť</button></div></div></div>");
      box = byId("g2Confirm");
    }
    pending = () => { resetFields(fields); onDiscard(); };
    stayFocus = fields[0];
    box.classList.add("open");
    setTimeout(() => box.querySelector("[data-g2-confirm-stay]")?.focus(), 30);
  }
  function closeConfirm(discard) {
    const box = byId("g2Confirm");
    if (!box?.classList.contains("open")) return false;
    box.classList.remove("open");
    const action = pending;
    pending = null;
    if (discard && action) { action(); setTimeout(recoverFocus, 80); }
    else if (visible(stayFocus)) stayFocus.focus();
    setTimeout(ensureSentinel, 0);
    return true;
  }
  const confirmOpen = () => Boolean(byId("g2Confirm")?.classList.contains("open"));

  // Rozsah kontroly: v okne → len to okno; odchod z obrazovky (lišta, výber v zásuvke) → obrazovka aj všetky okná.
  function scopeFor(el) {
    const leaving = el.closest("#v5BottomBar") || el.closest("#v5Drawer") || el.matches("[data-v5-window-cancel]");
    if (leaving) return [activeView(), ...stack().filter(layer => layer.id !== "v5DrawerOverlay").map(layer => byId(layer.id))];
    const layerEl = stack().map(layer => byId(layer.id)).reverse().find(item => item.contains(el));
    return [layerEl || activeView()];
  }
  function guarded(roots, action) {
    const fields = dirtyFields(roots);
    if (!fields.length) { action(); return true; }
    confirmDiscard(fields, action);
    return false;
  }

  const LEAVE = [
    "[data-v5-window-back]", "[data-v5-window-cancel]", "#v5BottomBar button:not(.g2-bar-handle)",
    "[data-g2-plan-close]", "[data-g2-month-close]", "[data-g2-win-close]", "[data-v2-admin-close]", "[data-v2-admin-step-back]", "[data-v2-admin-back]",
    "[data-v5-o-back]", "[data-v5-close-o]", "[data-v5-close-record]", "[data-v5-close-drawer]",
    "#v5Drawer [data-g2-go]", "#v5Drawer [data-v5-feature]", "#v5Drawer [data-g2-chat]",
    // QA N4: prechod na inú časť knižky alebo Mamy (napr. „Zrušiť“ v novom zápise) – rozpísané sa nestratí bez otázky
    ".view.active [data-v5-book-section]", ".view.active [data-v2-child-section]", ".view.active [data-v2-mama-section]"
  ].join(", ");
  const BACKDROPS = new Set(["v5OOverlay", "v5QuickRecordOverlay", "v5DrawerOverlay", "v2AdminOverlay", "g2RingOverlay"]);
  document.addEventListener("click", event => {
    if (event.target.closest("[data-g2-confirm-stay]")) return closeConfirm(false);
    if (event.target.closest("[data-g2-confirm-discard]")) return closeConfirm(true);
    if (event.target.id === "g2Confirm") return closeConfirm(false);
    const trigger = event.target.closest(LEAVE) || (BACKDROPS.has(event.target.id) ? event.target : null);
    if (!trigger) return;
    const fields = dirtyFields(scopeFor(trigger));
    if (!fields.length) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    confirmDiscard(fields, () => trigger.click());
  }, true);

  // Master 4.0 (Audit F9): šípka späť v hlavičke obrazovky alebo okna = krok späť (aj do okna, z ktorého prišla).
  const BACK_ARROWS = "[data-v5-window-back], [data-g2-plan-close], [data-g2-month-close], [data-v5-o-back], [data-v2-admin-back], [data-v2-admin-step-back], [data-g2-ring-back]"; // 4.0.1 (Kontrola F9): aj šípka Času pre teba
  // Lišta prepína oblasti – nie je to krok späť a nič sa znova neotvára.
  let barAt = -1e9;
  document.addEventListener("click", event => {
    if (event.target.closest(BACK_ARROWS)) markBack();
    if (event.target.closest("#v5BottomBar")) barAt = now();
  }, true);

  // × v okne (Plán, Tvoj mesiac): zavrie celý zásobník okien, obrazovka pod nimi ostáva.
  document.addEventListener("click", event => {
    if (event.target.closest("[data-g2-win-close]")) closeLayers();
    // Lišta prepína hlavné obrazovky – okná nad obrazovkou sa zavrú (inak by nová obrazovka ostala pod nimi).
    if (event.target.closest("#v5BottomBar button:not(.g2-bar-handle)")) stack().filter(layer => layer.kind === "full").reverse().forEach(layer => layer.close());
    afterInteraction();
  });

  // ——— Klávesnica: Esc zavrie vrchné okno, Tab ostáva v okne s krátkou akciou ———
  // Master 4.0 (Audit F4): spätná väzba (#v2FeedbackOverlay) už je okno v systéme (LAYERS), nie cudzie okno.
  const foreignModalOpen = () => Boolean(document.querySelector(".v2-birth-overlay.open:not(#v2AdminOverlay):not(#v2FeedbackOverlay), .v2-picker:not([hidden]), .v2-tour.open, .v2-tour[style*='block']"));
  window.addEventListener("keydown", event => {
    if (event.key === "Tab") return trapTab(event);
    if (event.key !== "Escape") return;
    if (confirmOpen()) { event.preventDefault(); event.stopImmediatePropagation(); closeConfirm(false); return; }
    if (foreignModalOpen()) return;
    const top = topLayer();
    if (top) {
      event.preventDefault();
      event.stopImmediatePropagation();
      guarded([byId(top.id)], () => { markBack(); return top.escBack ? top.back() : top.close(); });
      return afterInteraction();
    }
    if (!NO_WINDOW_VIEWS.has(V5.currentView())) {
      event.preventDefault();
      event.stopImmediatePropagation();
      guarded([activeView()], () => { markBack(); V5.universalWindowBack(); });
      afterInteraction();
    }
  }, true);
  function trapTab(event) {
    const box = confirmOpen() ? byId("g2Confirm") : (() => { const top = topLayer(); return top && top.kind === "sheet" ? byId(top.id) : null; })();
    if (!box) return;
    const items = Array.from(box.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")).filter(visible);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (!box.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
    else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  // ——— Systémové späť (Android, gesto, tlačidlo prehliadača) ———
  // Kým je otvorené okno alebo okno sekcie, v histórii prehliadača je jedna „poistka“. Späť ju spotrebuje
  // a urobí jeden krok späť v appke; ak ešte niečo ostáva otvorené, poistka sa vráti.
  const somethingOpen = () => stack().length > 0 || !NO_WINDOW_VIEWS.has(V5.currentView());
  function ensureSentinel() {
    try {
      if (somethingOpen() && !(window.history.state && window.history.state.g2win)) window.history.pushState({ g2win: 1 }, "");
    } catch (error) { /* napr. sandbox – systémové späť potom len opustí stránku */ }
  }
  window.addEventListener("popstate", () => {
    if (confirmOpen()) { closeConfirm(false); return setTimeout(ensureSentinel, 30); }
    if (foreignModalOpen() || !somethingOpen()) return;
    const top = topLayer();
    if (top) guarded([byId(top.id)], () => { markBack(); top.back(); });
    else guarded([activeView()], () => { markBack(); V5.universalWindowBack(); });
    afterInteraction();
    setTimeout(ensureSentinel, 60);
  });

  // ——— Okná sekcií (obrazovky): fokus do okna a späť na prvok, ktorý ho otvoril ———
  let lastView = V5.currentView();
  const viewEntries = {};
  function checkView() {
    const view = V5.currentView();
    if (view !== lastView) {
      const from = lastView;
      lastView = view;
      onViewChange(from, view);
    }
  }
  function afterInteraction() {
    setTimeout(() => { checkView(); ensureSentinel(); }, 0);
    // Len keď ťuknutý prvok zmizol (uloženie prekreslilo obsah, okno sa zavrelo) – inak fokus nechávame tak.
    const clicked = lastActivator;
    setTimeout(() => { if (clicked && !visible(clicked)) recoverFocus(); }, 120);
  }
  // Zmenu obrazovky sledujeme priamo (aj keď ju spustí kód, nie ťuk).
  let viewCheckQueued = false;
  const viewObserver = new MutationObserver(() => {
    if (viewCheckQueued) return;
    viewCheckQueued = true;
    queueMicrotask(() => { viewCheckQueued = false; checkView(); });
  });
  const observeViews = () => document.querySelectorAll(".view").forEach(view => {
    if (view.dataset.g2Watched) return;
    view.dataset.g2Watched = "1";
    viewObserver.observe(view, { attributes: true, attributeFilter: ["class"] });
  });
  observeViews();
  setTimeout(observeViews, 1500);
  function onViewChange(from, to) {
    // Nová obrazovka je vždy navrchu – celostránkové okná (Plán, Tvoj mesiac, Úrady) nad starou obrazovkou sa zavrú.
    const fullOpen = stack().filter(layer => layer.kind === "full");
    fullOpen.slice().reverse().forEach(layer => layer.close());
    const returning = viewEntries[from] && viewEntries[from].from === to;
    if (returning) {
      const entry = viewEntries[from];
      delete viewEntries[from];
      recentlyClosed = null;
      // Master 4.0 (Audit F9): späť z obrazovky otvorenej z okna (Všetko, Plán, Dnes…) vráti to okno.
      if (entry.returnLayer && backRecently()) return reopenLayer(entry.returnLayer);
      if (!byId(to)?.contains(document.activeElement)) restoreFocus(entry, byId(to));
      return;
    }
    if (!NO_WINDOW_VIEWS.has(to)) {
      const opener = lastActivator;
      const fromBar = now() - barAt < 700;
      const topFull = fullOpen.length && layerById[fullOpen[fullOpen.length - 1].id].reopen ? fullOpen[fullOpen.length - 1].id : "";
      // Master 4.0.1 (Kontrola F9): najprv okno zatvorené tesne pred otvorením obrazovky (Plán → Vybaviť → Oznámenie = Vybaviť), potom celostránkové.
      const justClosed = fromBar ? (recentlyClosed = null, "") : takeReturn("");
      const returnLayer = fromBar ? "" : justClosed || topFull;
      viewEntries[to] = { from, opener, sig: signature(opener), returnLayer };
      const viewEl = byId(to);
      if (viewEl && !viewEl.contains(document.activeElement)) {
        const head = viewEl.querySelector(":scope > .v5-universal-window-head strong");
        if (head) { head.setAttribute("tabindex", "-1"); head.focus({ preventScroll: true }); }
      }
    }
  }
  document.addEventListener("keyup", event => { if (event.key === "Enter" || event.key === " ") afterInteraction(); });

  window.G2Win = {
    stack: () => stack().map(layer => layer.id),
    closeLayers,
    isDirty: root => dirtyFields([root || activeView()]).length > 0,
    guarded: (action, root) => guarded([root || activeView()], action),
    layers: layerById
  };
})();

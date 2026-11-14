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
  const LAYERS = [
    { id: "v5DrawerOverlay", kind: "sheet", back: () => V5.closeDrawer(), close: () => V5.closeDrawer() },
    { id: "v5QuickRecordOverlay", kind: "sheet", back: () => V5.closeQuickRecord(), close: () => V5.closeQuickRecord() },
    { id: "v5OOverlay", kind: "sheet", back: oBack, close: () => V5.closeAdaptiveOMenu() },
    { id: "g2PlanOverlay", kind: "full", back: () => V5.closePlan(), close: () => V5.closePlan() },
    { id: "g2MonthOverlay", kind: "full", back: () => V5.closeMonth(), close: () => V5.closeMonth() },
    { id: "v2AdminOverlay", kind: "full", back: () => window.GugubooAdmin?.stepBack?.(), close: () => window.GugubooAdmin?.close?.() }
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
  const visible = el => Boolean(el && el.isConnected && (el.offsetParent || el.getClientRects().length) && !el.closest("[aria-hidden='true'], [inert]"));
  function signature(el) {
    if (!el || !el.attributes) return "";
    const attr = Array.from(el.attributes).find(item => item.name.startsWith("data-") && item.name !== "data-g2-go");
    return attr ? "[" + attr.name + (attr.value ? "='" + CSS.escape(attr.value) + "'" : "") + "]" : el.id ? "#" + CSS.escape(el.id) : "";
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

  function onOpen(layer, el) {
    const opener = lastActivator && !el.contains(lastActivator) ? lastActivator : document.activeElement;
    opened.set(layer.id, { order: ++order, opener, sig: signature(opener) });
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
    const lost = !document.activeElement || document.activeElement === document.body || el.contains(document.activeElement);
    if (lost) setTimeout(() => {
      const top = topLayer();
      if (top) return focusInto(byId(top.id));
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
  const AUTOSAVE = "#g2Q, #v2ChatInput, #chatInput, .private-pin, [data-v2-ann-field], [data-v2-ann-crop], [data-v2-bc-field], [data-v5-water-goal], [data-v5-water-glass], [data-v2-summary-time], [data-v2-voice-name], [data-g2-no-guard]";
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
        "<h2 id='g2ConfirmTitle'>Máš rozpísané údaje</h2><p id='g2ConfirmText'>Ak odídeš, to, čo si napísala, sa neuloží.</p>" +
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
    if (discard && action) action();
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
    "#v5Drawer [data-g2-go]", "#v5Drawer [data-v5-feature]", "#v5Drawer [data-g2-chat]"
  ].join(", ");
  const BACKDROPS = new Set(["v5OOverlay", "v5QuickRecordOverlay", "v5DrawerOverlay", "v2AdminOverlay"]);
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

  // × v okne (Plán, Tvoj mesiac): zavrie celý zásobník okien, obrazovka pod nimi ostáva.
  document.addEventListener("click", event => {
    if (event.target.closest("[data-g2-win-close]")) closeLayers();
    // Lišta prepína hlavné obrazovky – okná nad obrazovkou sa zavrú (inak by nová obrazovka ostala pod nimi).
    if (event.target.closest("#v5BottomBar button:not(.g2-bar-handle)")) stack().filter(layer => layer.kind === "full").reverse().forEach(layer => layer.close());
    afterInteraction();
  });

  // ——— Klávesnica: Esc zavrie vrchné okno, Tab ostáva v okne s krátkou akciou ———
  const foreignModalOpen = () => Boolean(document.querySelector(".v2-birth-overlay.open:not(#v2AdminOverlay), .v2-picker:not([hidden]), .v2-tour.open, .v2-tour[style*='block']"));
  window.addEventListener("keydown", event => {
    if (event.key === "Tab") return trapTab(event);
    if (event.key !== "Escape") return;
    if (confirmOpen()) { event.preventDefault(); event.stopImmediatePropagation(); closeConfirm(false); return; }
    if (foreignModalOpen()) return;
    const top = topLayer();
    if (top) {
      event.preventDefault();
      event.stopImmediatePropagation();
      guarded([byId(top.id)], () => top.close());
      return afterInteraction();
    }
    if (!NO_WINDOW_VIEWS.has(V5.currentView())) {
      event.preventDefault();
      event.stopImmediatePropagation();
      guarded([activeView()], () => V5.universalWindowBack());
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
    if (top) guarded([byId(top.id)], () => top.back());
    else guarded([activeView()], () => V5.universalWindowBack());
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
    stack().filter(layer => layer.kind === "full").reverse().forEach(layer => layer.close());
    const returning = viewEntries[from] && viewEntries[from].from === to;
    if (returning) {
      const entry = viewEntries[from];
      delete viewEntries[from];
      if (!byId(to)?.contains(document.activeElement)) restoreFocus(entry, byId(to));
      return;
    }
    if (!NO_WINDOW_VIEWS.has(to)) {
      const opener = lastActivator;
      viewEntries[to] = { from, opener, sig: signature(opener) };
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

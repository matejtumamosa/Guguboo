/*
 * GUGUBOO MASTER 2.9 – fotky a nahrávky v IndexedDB (Plán F1, schválené Samom 16. 11. 2026).
 *
 * Prečo: localStorage má ~5 MB a fotka bruška alebo nahrávka ho rýchlo zaplní (uloženie potom potichu zlyhá).
 * Fotky a nahrávky preto idú do databázy prehliadača IndexedDB `guguboo-m-media` (len v tomto telefóne,
 * nič sa neposiela na server). V stave (`guguboo-m-state`) ostane len krátky odkaz `media:<id>`.
 *
 * Ako to funguje (jedna cesta pre staré aj nové údaje):
 *  - Moduly ukladajú fotku/nahrávku ako doteraz (dataURL v stave). appStorage.setItem v app.html potom zavolá
 *    G2Media.schedule() a „presun“ (sweep) ju o chvíľu prenesie do IndexedDB: najprv zápis, potom kontrola
 *    (načíta späť a porovná bajty) a AŽ POTOM sa v stave dataURL nahradí odkazom a stav sa uloží.
 *    Rovnaký presun pri spustení appky jednorazovo prevedie staré dataURL (fotka bruška, Fotka dňa, profilová
 *    fotka, výsledky vyšetrení, kartičky, nahrávky…). Pri chybe dataURL ostane v stave – nič sa nestratí.
 *  - Zobrazenie: G2Media.srcAttr(v) / src(v) / setSrc(el, v) / url(v) premenia odkaz na objectURL
 *    (kým sa načíta, je tam priehľadný obrázok a po načítaní sa doplní do prvkov s data-g2m).
 *    Obyčajný dataURL alebo adresa sa vráti bez zmeny (staré údaje a prehliadač bez IndexedDB fungujú ďalej).
 *  - Bez IndexedDB (súkromné okno, starý prehliadač): appka ostane pri dataURL v stave ako do 2.8.
 *  - Stav má číslo schémy `state.schema` (2 = fotky a nahrávky môžu byť v IndexedDB).
 *  - Upratovanie: pri spustení sa zmažú záznamy, na ktoré už nič neodkazuje a sú staršie ako 1 hodina
 *    (aby „Vrátiť“ a druhá otvorená karta nič nestratili).
 * Testy: test.html (vlastná testovacia databáza cez window.__g2t.mediaDb – skutočné fotky sa nedotknú).
 */
(function initG2Media() {
  "use strict";
  const DB_NAME = (window.__g2t && window.__g2t.mediaDb) || "guguboo-m-media";
  const STORE = "media";
  const REF = "media:";
  const SCHEMA = 2;
  const ORPHAN_AGE = 60 * 60 * 1000;
  const MEDIA_RE = /^data:((?:image|audio|video)\/[^,]*?);base64,/i;
  const REF_RE = /media:([A-Za-z0-9_-]{4,80})/g;
  const PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  const urls = new Map();     // id → objectURL (uvoľní sa pri zmazaní / vymazaní všetkého)
  const loading = new Map();  // id → Promise<string>
  let dbPromise = null;
  let enabled = null;         // null = ešte nevieme, true/false po otvorení databázy
  let sweeping = false, again = false, timer = 0;

  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" })[c]);
  const isRef = value => typeof value === "string" && /^media:[A-Za-z0-9_-]{4,80}$/.test(value);
  const idOf = value => (isRef(value) ? value.slice(REF.length) : "");
  const isInline = value => typeof value === "string" && value.length > 64 && MEDIA_RE.test(value.slice(0, 120));
  const newId = () => "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  const appState = () => (typeof state !== "undefined" && state && typeof state === "object" ? state : null);

  // ——— Databáza ———
  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(resolve => {
      let done = false;
      const finish = db => { if (done) return; done = true; enabled = !!db; resolve(db); };
      try {
        if (!window.indexedDB) return finish(null);
        const request = window.indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: "id" }); };
        request.onsuccess = () => {
          const db = request.result;
          db.onversionchange = () => { db.close(); dbPromise = null; }; // vymazanie databázy (aj z inej karty) nesmie čakať
          finish(db);
        };
        request.onerror = () => finish(null);
        request.onblocked = () => finish(null);
        setTimeout(() => finish(null), 5000); // napr. Firefox v súkromnom okne niekedy neodpovie
      } catch (_) { finish(null); }
    });
    return dbPromise;
  }
  function tx(mode, work) {
    return open().then(db => {
      if (!db) throw new Error("IndexedDB nie je dostupná");
      return new Promise((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const store = t.objectStore(STORE);
        let result;
        Promise.resolve(work(store, value => { result = value; })).catch(reject);
        t.oncomplete = () => resolve(result);
        t.onerror = () => reject(t.error || new Error("IndexedDB chyba"));
        t.onabort = () => reject(t.error || new Error("IndexedDB zápis prerušený (plná pamäť?)"));
      });
    });
  }
  const reqValue = (request, set) => { request.onsuccess = () => set(request.result); };

  function blobToBuffer(blob) {
    if (blob.arrayBuffer) return blob.arrayBuffer();
    return new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = () => reject(r.error); r.readAsArrayBuffer(blob); });
  }
  function dataUrlToBlob(dataUrl) {
    const match = MEDIA_RE.exec(dataUrl.slice(0, 120));
    if (!match) throw new Error("nie je dataURL fotky/zvuku");
    const binary = atob(dataUrl.slice(dataUrl.indexOf(",") + 1));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: match[1] });
  }
  function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let out = "";
    for (let i = 0; i < bytes.length; i += 0x8000) out += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(out);
  }
  function sameBytes(a, b) {
    if (!a || !b || a.byteLength !== b.byteLength) return false;
    const x = new Uint8Array(a), y = new Uint8Array(b);
    for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
    return true;
  }

  // Zápis s kontrolou: uloží ArrayBuffer (spoľahlivejšie ako Blob v starších Safari), načíta späť a porovná bajty.
  async function put(blob, id) {
    const data = await blobToBuffer(blob);
    const record = { id: id || newId(), type: blob.type || "application/octet-stream", size: data.byteLength, created: new Date().toISOString(), data };
    await tx("readwrite", store => { store.put(record); });
    const back = await tx("readonly", (store, set) => reqValue(store.get(record.id), set));
    if (!back || !sameBytes(back.data, data)) throw new Error("kontrola zápisu do IndexedDB zlyhala");
    return record.id;
  }
  async function getRecord(id) {
    if (!id) return null;
    return (await tx("readonly", (store, set) => reqValue(store.get(id), set))) || null;
  }
  async function get(id) {
    const record = await getRecord(id);
    return record ? new Blob([record.data], { type: record.type }) : null;
  }
  async function del(id) {
    await tx("readwrite", store => { store.delete(id); });
    forget(id);
  }
  function forget(id) { const url = urls.get(id); if (url) { URL.revokeObjectURL(url); urls.delete(id); } loading.delete(id); }

  // ——— Zobrazenie ———
  function patch(id) {
    const url = urls.get(id);
    if (!url) return;
    document.querySelectorAll("[data-g2m='" + id + "']").forEach(el => { if (el.getAttribute("src") !== url) el.setAttribute("src", url); });
  }
  function load(id) {
    if (urls.has(id)) return Promise.resolve(urls.get(id));
    if (loading.has(id)) return loading.get(id);
    const promise = get(id).then(blob => {
      if (!blob) return "";
      const url = URL.createObjectURL(blob);
      urls.set(id, url);
      patch(id);
      return url;
    }).catch(() => "").finally(() => loading.delete(id));
    loading.set(id, promise);
    return promise;
  }
  // Synchrónne (pre HTML reťazce): objectURL, ak je načítaný; inak priehľadný obrázok a načítanie na pozadí.
  function src(value) {
    if (!isRef(value)) return value || "";
    const id = idOf(value);
    if (urls.has(id)) return urls.get(id);
    load(id);
    return PLACEHOLDER;
  }
  const cached = value => (isRef(value) ? urls.get(idOf(value)) || "" : value || "");
  const srcAttr = value => "src='" + esc(src(value)) + "'" + (isRef(value) ? " data-g2m='" + esc(idOf(value)) + "'" : "");
  async function url(value) { return isRef(value) ? load(idOf(value)) : (value || ""); }
  function setSrc(el, value) {
    if (!el) return;
    if (isRef(value)) el.setAttribute("data-g2m", idOf(value)); else el.removeAttribute("data-g2m");
    el.src = src(value);
  }
  const owns = value => typeof value === "string" && [...urls.values()].includes(value);

  // ——— Presun dataURL → IndexedDB (nové aj staré údaje) ———
  function walk(node, visit, depth = 0) {
    if (!node || typeof node !== "object" || depth > 14) return;
    Object.keys(node).forEach(key => {
      const value = node[key];
      if (typeof value === "string") { if (isInline(value)) visit(node, key, value); }
      else if (value && typeof value === "object") walk(value, visit, depth + 1);
    });
  }
  function persistState() {
    if (window.GugubooV5?.persist) return window.GugubooV5.persist();
    try { if (typeof appStorage !== "undefined" && typeof storeKey !== "undefined") appStorage.setItem(storeKey, JSON.stringify(appState())); } catch (_) { /* nič */ }
  }
  async function sweep() {
    const st = appState();
    if (!st) return { moved: 0, failed: 0 };
    if (sweeping) { again = true; return { moved: 0, failed: 0, busy: true }; }
    sweeping = true;
    let moved = 0, failed = 0;
    try {
      const db = await open();
      if (!db) return { moved: 0, failed: 0, disabled: true }; // bez IndexedDB ostáva dataURL v stave (správanie do 2.8)
      const spots = [];
      walk(st, (obj, key, value) => spots.push([obj, key, value]));
      for (const [obj, key, value] of spots) {
        if (obj[key] !== value) continue;
        try {
          const blob = dataUrlToBlob(value);
          const id = await put(blob); // zápis + kontrola
          if (obj[key] !== value) continue; // medzitým sa zmenilo – záznam bez odkazu neskôr uprace gc()
          if (!urls.has(id)) urls.set(id, URL.createObjectURL(blob));
          obj[key] = REF + id;
          moved++;
        } catch (error) { failed++; console.warn("Guguboo: fotku/nahrávku sa nepodarilo presunúť do IndexedDB (ostáva v stave)", error); }
      }
      const schemaChanged = st.schema !== SCHEMA;
      st.schema = SCHEMA;
      if (moved || schemaChanged) persistState();
    } finally {
      sweeping = false;
      if (again) { again = false; schedule(); }
    }
    return { moved, failed };
  }
  function schedule(delay = 150) {
    if (enabled === false) return;
    clearTimeout(timer);
    timer = setTimeout(() => { sweep(); }, delay);
  }
  // Rýchla kontrola reťazca pred uložením (JSON stavu): obsahuje fotku/zvuk ako dataURL?
  const hasInline = text => typeof text === "string" && /"data:(?:image|audio|video)\//i.test(text);

  // ——— Odkazy, upratovanie, záloha ———
  function refsIn(texts) {
    const ids = new Set();
    texts.forEach(text => { if (typeof text === "string") for (const m of text.matchAll(REF_RE)) ids.add(m[1]); });
    return ids;
  }
  function storedTexts() {
    const out = [];
    [window.localStorage, window.sessionStorage].forEach(store => {
      try { Object.keys(store).forEach(key => { if (key.startsWith("guguboo-m-")) out.push(store.getItem(key)); }); } catch (_) { /* nič */ }
    });
    const st = appState();
    if (st) { try { out.push(JSON.stringify(st)); } catch (_) { /* nič */ } }
    return out;
  }
  async function listRecords() {
    return tx("readonly", (store, set) => {
      const out = [];
      const request = store.openCursor();
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) return set(out);
        out.push({ id: cursor.value.id, created: cursor.value.created, size: cursor.value.size || 0 });
        cursor.continue();
      };
    });
  }
  async function gc(now = Date.now()) {
    const st = appState();
    // Poistka: pri poškodenom alebo prázdnom stave nič nemazať.
    if (!st || !st.profile || !(st.onboarded || st.profile.status)) return 0;
    if (!(await open())) return 0;
    const used = refsIn(storedTexts());
    const old = (await listRecords()).filter(r => !used.has(r.id) && now - new Date(r.created || 0).getTime() > ORPHAN_AGE);
    for (const r of old) await del(r.id);
    return old.length;
  }
  // Veľkosť fotiek a nahrávok, na ktoré odkazujú údaje (pre okno Záloha).
  async function usedBytes() {
    if (!(await open())) return 0;
    const used = refsIn(storedTexts());
    return (await listRecords()).filter(r => used.has(r.id)).reduce((sum, r) => sum + r.size, 0);
  }
  // Záloha: médiá, na ktoré odkazujú texty (hodnoty guguboo-m-*), ako base64.
  async function exportFor(texts) {
    const media = {}, missing = [];
    const ids = refsIn(texts);
    if (!ids.size) return { media, missing };
    if (!(await open())) return { media, missing: [...ids] };
    for (const id of ids) {
      const record = await getRecord(id).catch(() => null);
      if (record) media[id] = { type: record.type, data: bufferToBase64(record.data) };
      else missing.push(id);
    }
    return { media, missing };
  }
  async function importMedia(media) {
    for (const [id, item] of Object.entries(media || {})) {
      if (!/^[A-Za-z0-9_-]{4,80}$/.test(id)) continue;
      const blob = dataUrlToBlob("data:" + item.type + ";base64," + item.data);
      forget(id);
      await put(blob, id);
    }
  }
  // Bez IndexedDB: odkazy v texte nahradiť dataURL zo zálohy (ako do 2.8).
  const inline = (text, media) => String(text).replace(REF_RE, (all, id) => (media?.[id] ? "data:" + media[id].type + ";base64," + media[id].data : all));
  // Vymazanie všetkého: zatvoriť spojenie a zmazať celú databázu.
  async function clearAll() {
    urls.forEach(u => URL.revokeObjectURL(u)); urls.clear(); loading.clear();
    const db = await (dbPromise || Promise.resolve(null));
    try { db?.close(); } catch (_) { /* nič */ }
    dbPromise = null;
    if (!window.indexedDB) return true;
    return new Promise(resolve => {
      try {
        const request = window.indexedDB.deleteDatabase(DB_NAME);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
        request.onblocked = () => setTimeout(() => resolve(false), 1500);
      } catch (_) { resolve(false); }
    });
  }
  function close() { dbPromise?.then(db => { try { db?.close(); } catch (_) { /* nič */ } }); dbPromise = null; urls.forEach(u => URL.revokeObjectURL(u)); urls.clear(); }

  // ——— Spustenie: načítať odkazy z uloženého stavu, presunúť staré dataURL, upratať ———
  const ready = open().then(async db => {
    if (!db) return false;
    const st = appState();
    if (st) {
      let ids = [];
      try { ids = [...refsIn([JSON.stringify(st)])]; } catch (_) { /* nič */ }
      await Promise.all(ids.map(id => load(id)));
      await sweep();
      setTimeout(() => { gc().catch(() => {}); }, 5000);
    }
    return true;
  }).catch(() => false);

  window.G2Media = {
    DB_NAME, REF, SCHEMA, PLACEHOLDER,
    ready, available: () => open().then(db => !!db), enabled: () => enabled !== false,
    isRef, isInline, hasInline, put, get, del, src, srcAttr, setSrc, url, cached, owns,
    sweep, schedule, gc, refsIn, usedBytes, exportFor, importMedia, inline, clearAll, close, dataUrlToBlob, listRecords
  };
})();

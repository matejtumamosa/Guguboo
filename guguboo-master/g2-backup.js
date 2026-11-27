/*
 * GUGUBOO MASTER 2.6 – Údaje v telefóne, záloha a pridanie na plochu (Samo 15. 11. 2026).
 * Údaje sú len v tomto telefóne (localStorage, kľúče guguboo-m-*). Záloha = súbor JSON, ktorý si mama uloží sama.
 * Nič sa neposiela na server. Vymazanie maže len kľúče Guguboo V2 (V1 na tej istej doméne ostáva nedotknutá).
 *
 * Master 2.9 (Plán F1): záloha schéma 2 = údaje (data) + fotky a nahrávky z IndexedDB (media: { id: { type, data base64 } }).
 * Obnova zvládne schému 1 (bez médií, fotky ako dataURL v stave) aj 2. Poradie obnovy: najprv médiá (zápis + kontrola),
 * potom údaje; ak sa údaje nezmestia, vrátia sa pôvodné. Bez IndexedDB sa médiá vložia späť do stavu ako dataURL.
 * Na iPhone/Androide sa záloha uloží cez zdieľanie (Uložiť do Súborov / Disk), inde sa stiahne.
 * „Vymazať všetky údaje“ zmaže aj databázu fotiek a nahrávok (guguboo-m-media).
 */
(function initG2Backup() {
  "use strict";
  const V5 = window.GugubooV5;
  if (!V5 || !V5.MASTER) return;
  const esc = V5.escapeHtml, icon = V5.icon;
  const byId = id => document.getElementById(id);
  const PREFIX = "guguboo-m-";
  const AUTH = PREFIX + "private-space-auth"; // odomknutie denníka sa nezálohuje
  const SCHEMA = 2;
  const M = () => window.G2Media;
  let installPrompt = null;
  window.addEventListener("beforeinstallprompt", event => { event.preventDefault(); installPrompt = event; });

  const keys = () => Object.keys(localStorage).filter(key => key.startsWith(PREFIX) && key !== AUTH);
  const textBytes = () => keys().reduce((sum, key) => sum + (localStorage.getItem(key) || "").length, 0);
  const standalone = () => window.matchMedia?.("(display-mode: standalone)").matches || navigator.standalone === true;
  const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
  const isMobile = () => isIos() || /android/i.test(navigator.userAgent) || navigator.userAgentData?.mobile === true;
  // Veľkosť: base64 je o tretinu väčší ako súbor.
  const sizeLabel = bytes => bytes < 1024 * 1024 ? Math.max(1, Math.round(bytes / 1024)) + " kB" : (bytes / 1024 / 1024).toFixed(1).replace(".", ",") + " MB";
  async function backupBytes() {
    let media = 0;
    try { media = M() ? await M().usedBytes() : 0; } catch (_) { media = 0; }
    return textBytes() + Math.ceil(media * 4 / 3);
  }

  function overlay() {
    let el = byId("g2BackupOverlay");
    if (el) return el;
    el = document.createElement("div");
    el.id = "g2BackupOverlay";
    el.className = "g2-ring-overlay";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = "<div class='g2-ring-sheet' role='dialog' aria-modal='true' aria-labelledby='g2bTitle'><div class='g2-ring-sheet-head'><span></span><h2 id='g2bTitle' tabindex='-1'>Údaje a appka v telefóne</h2><button class='v5-icon-button' type='button' data-g2b='close' aria-label='Zavrieť'>" + window.GugubooV5.glyph("close") + "</button></div><div class='g2b-body'></div></div>";
    el.addEventListener("click", event => { if (event.target === el) close(); });
    document.body.appendChild(el);
    return el;
  }
  const act = (a, ic, title, sub) => "<button class='g2r-act' type='button' data-g2b='" + a + "'><i>" + icon(ic) + "</i><span>" + esc(title) + (sub ? "<small" + (a === "save" ? " id='g2bSize'" : "") + ">" + esc(sub) + "</small>" : "") + "</span></button>";
  function render() {
    overlay().querySelector(".g2b-body").innerHTML = [
      "<p class='g2r-lead'>Všetko, čo zapíšeš, je uložené len v tomto telefóne – nikam sa neposiela a nepotrebuješ účet.</p>",
      "<section class='g2r-info'><h3>Pridať na plochu</h3>",
      standalone() ? "<p>Appku už máš na ploche. 💜</p>"
        : installPrompt ? act("install", "sparkle", "Pridať Guguboo na plochu", "otvorí sa ako bežná aplikácia")
        : isIos() ? "<p>V Safari ťukni na <strong>Zdieľať</strong> (štvorček so šípkou) a vyber <strong>Pridať na plochu</strong>.</p>"
        : "<p>V prehliadači otvor ponuku <strong>⋮</strong> a vyber <strong>Inštalovať aplikáciu</strong> alebo <strong>Pridať na plochu</strong>.</p>",
      "</section>",
      "<section class='g2r-info'><h3>Záloha</h3><p class='g2r-small'>Ak vymažeš údaje prehliadača alebo meníš telefón, údaje sa stratia. Záloha je súbor, ktorý si uložíš – sú v ňom aj fotky a nahrávky. Sú v ňom aj osobné údaje – nikomu ho neposielaj.</p>",
      act("save", "download", "Uložiť zálohu", "zisťujem veľkosť…"), // Master 4.0 (Audit V9): zámok len pri Súkromnom denníku
      "<label class='g2r-act g2q-file'><i>" + icon("upload") + "</i><span>Obnoviť zo zálohy<small>prepíše údaje v tomto telefóne</small></span><input id='g2bRestore' type='file' accept='application/json,.json'></label>",
      "</section>",
      "<button class='g2r-link' type='button' data-g2b='wipe'>Vymazať všetky údaje z tohto telefónu</button>"
    ].join("");
    backupBytes().then(bytes => { const el = byId("g2bSize"); if (el) el.textContent = "súbor bude mať približne " + sizeLabel(bytes); });
  }
  function open() { const el = overlay(); el.classList.add("open"); el.setAttribute("aria-hidden", "false"); render(); setTimeout(() => byId("g2bTitle")?.focus({ preventScroll: true }), 60); } // Master 3.9.1: fokus na nadpis (bez rámika na prvom tlačidle)
  function close() { const el = byId("g2BackupOverlay"); if (!el) return; el.classList.remove("open"); el.setAttribute("aria-hidden", "true"); }

  // Master 2.8 (Plán F1-0): formát zálohy v čistých funkciách, aby ho test.html overil tam a späť.
  // Master 2.9: async – pridá fotky a nahrávky z IndexedDB (schéma 2). Vráti JSON text; chýbajúce médiá v .missing.
  let lastMissing = [];
  async function exportPayload() {
    const data = {}; keys().forEach(key => { data[key] = localStorage.getItem(key); });
    let media = {}, missing = [];
    if (M()) ({ media, missing } = await M().exportFor(Object.values(data)));
    lastMissing = missing;
    return JSON.stringify({ app: "guguboo", kind: "zaloha", schema: SCHEMA, created: new Date().toISOString(), data, media });
  }
  function parseBackup(text) {
    const backup = JSON.parse(text);
    if (backup?.app !== "guguboo" || !backup.data || typeof backup.data !== "object") throw new Error("format");
    backup.schema = Number(backup.schema || 1);
    if (!(backup.schema >= 1)) throw new Error("format");
    if (backup.schema > SCHEMA) throw new Error("novsia");
    const media = backup.media && typeof backup.media === "object" ? backup.media : {};
    backup.media = {};
    Object.entries(media).forEach(([id, item]) => {
      if (item && typeof item.type === "string" && typeof item.data === "string" && /^(image|audio|video)\//i.test(item.type)) backup.media[id] = item;
    });
    return backup;
  }
  // Najprv médiá (zápis + kontrola), potom údaje. Pri chybe ostanú pôvodné údaje v telefóne (výnimka ide ďalej).
  async function applyBackup(backup) {
    const data = {};
    Object.entries(backup.data).forEach(([key, value]) => { if (key.startsWith(PREFIX) && key !== AUTH && typeof value === "string") data[key] = value; });
    const media = backup.media || {};
    if (Object.keys(media).length) {
      const idb = M() ? await M().available() : false;
      if (idb) await M().importMedia(media);
      else Object.keys(data).forEach(key => { data[key] = M() ? M().inline(data[key], media) : data[key]; });
    }
    const before = {}; keys().forEach(key => { before[key] = localStorage.getItem(key); });
    try {
      Object.keys(before).forEach(key => localStorage.removeItem(key));
      Object.entries(data).forEach(([key, value]) => localStorage.setItem(key, value));
    } catch (error) {
      keys().forEach(key => localStorage.removeItem(key));
      Object.entries(before).forEach(([key, value]) => { try { localStorage.setItem(key, value); } catch (_) { /* nič */ } });
      const full = new Error("full"); full.cause = error; throw full;
    }
  }
  async function save() {
    V5.persist();
    try { await M()?.sweep?.(); } catch (_) { /* ostane dataURL – záloha ho obsahuje v data */ }
    const payload = await exportPayload();
    const name = "guguboo-zaloha-" + new Date().toISOString().slice(0, 10) + ".json";
    const file = new File([payload], name, { type: "application/json" });
    const done = lastMissing.length ? " Niektoré fotky (" + lastMissing.length + ") sa nepodarilo pridať." : "";
    try {
      if (isMobile() && navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: "Záloha Guguboo" }); return V5.announce("Záloha je pripravená (" + sizeLabel(file.size) + ")." + done); }
    } catch (error) { if (error?.name === "AbortError") return; }
    const url = URL.createObjectURL(file);
    const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    V5.announce("Záloha sa stiahla do telefónu (" + sizeLabel(file.size) + ")." + done);
  }
  function restore(file) {
    const reader = new FileReader();
    reader.onload = async () => {
      let backup;
      try { backup = parseBackup(reader.result); }
      catch (error) { return V5.announce(error?.message === "novsia" ? "Táto záloha je z novšej verzie Guguboo. Najprv si appku aktualizuj." : "Tento súbor nie je záloha Guguboo."); }
      if (!window.confirm("Obnoviť zálohu z " + new Date(backup.created).toLocaleDateString("sk-SK") + "? Prepíše údaje v tomto telefóne.")) return;
      try {
        await applyBackup(backup);
        try { sessionStorage.clear(); } catch (_) { /* nič */ }
        window.location.reload();
      } catch (error) {
        V5.announce(error?.message === "full" ? "Záloha sa do pamäte telefónu nezmestila. Tvoje doterajšie údaje ostali." : "Zálohu sa nepodarilo obnoviť. Tvoje doterajšie údaje ostali.");
      }
    };
    reader.readAsText(file);
  }
  async function wipe() {
    if (!window.confirm("Vymazať všetky údaje Guguboo z tohto telefónu? Aj fotky a nahrávky. Nedá sa to vrátiť – ak ich chceš mať, najprv si ulož zálohu.")) return;
    // Najprv databáza fotiek (async), potom kľúče a hneď obnovenie stránky – aby appka medzitým nič neuložila späť.
    try { await M()?.clearAll(); } catch (_) { /* nič */ }
    keys().concat([AUTH]).forEach(key => localStorage.removeItem(key));
    try { Object.keys(sessionStorage).filter(key => key.startsWith(PREFIX)).forEach(key => sessionStorage.removeItem(key)); } catch (_) { /* nič */ }
    window.location.reload();
  }

  document.addEventListener("click", event => {
    if (event.target.closest("[data-g2b-open]")) { event.preventDefault(); V5.closeDrawer?.(); return open(); }
    const el = event.target.closest("[data-g2b]");
    if (!el) return;
    event.preventDefault();
    const a = el.dataset.g2b;
    if (a === "close") return close();
    if (a === "save") return save();
    if (a === "wipe") return wipe();
    if (a === "install" && installPrompt) { installPrompt.prompt(); installPrompt.userChoice.finally(() => { installPrompt = null; render(); }); }
  });
  document.addEventListener("change", event => { if (event.target.id === "g2bRestore" && event.target.files?.[0]) restore(event.target.files[0]); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && byId("g2BackupOverlay")?.classList.contains("open")) close(); });
  window.G2Backup = { open, close, exportPayload, parseBackup, applyBackup, backupBytes, PREFIX, AUTH, SCHEMA };
})();

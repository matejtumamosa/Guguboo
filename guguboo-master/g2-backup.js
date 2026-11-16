/*
 * GUGUBOO MASTER 2.6 – Údaje v telefóne, záloha a pridanie na plochu (Samo 15. 11. 2026).
 * Údaje sú len v tomto telefóne (localStorage, kľúče guguboo-m-*). Záloha = súbor JSON, ktorý si mama uloží sama.
 * Nič sa neposiela na server. Vymazanie maže len kľúče Guguboo V2 (V1 na tej istej doméne ostáva nedotknutá).
 */
(function initG2Backup() {
  "use strict";
  const V5 = window.GugubooV5;
  if (!V5 || !V5.MASTER) return;
  const esc = V5.escapeHtml, icon = V5.icon;
  const byId = id => document.getElementById(id);
  const PREFIX = "guguboo-m-";
  const AUTH = PREFIX + "private-space-auth"; // odomknutie denníka sa nezálohuje
  let installPrompt = null;
  window.addEventListener("beforeinstallprompt", event => { event.preventDefault(); installPrompt = event; });

  const keys = () => Object.keys(localStorage).filter(key => key.startsWith(PREFIX) && key !== AUTH);
  const sizeKb = () => Math.round(keys().reduce((sum, key) => sum + (localStorage.getItem(key) || "").length, 0) / 1024);
  const standalone = () => window.matchMedia?.("(display-mode: standalone)").matches || navigator.standalone === true;
  const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

  function overlay() {
    let el = byId("g2BackupOverlay");
    if (el) return el;
    el = document.createElement("div");
    el.id = "g2BackupOverlay";
    el.className = "g2-ring-overlay";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = "<div class='g2-ring-sheet' role='dialog' aria-modal='true' aria-labelledby='g2bTitle'><div class='g2-ring-sheet-head'><span></span><h2 id='g2bTitle' tabindex='-1'>Údaje a appka v telefóne</h2><button class='v5-icon-button' type='button' data-g2b='close' aria-label='Zavrieť'>×</button></div><div class='g2b-body'></div></div>";
    el.addEventListener("click", event => { if (event.target === el) close(); });
    document.body.appendChild(el);
    return el;
  }
  const act = (a, ic, title, sub) => "<button class='g2r-act' type='button' data-g2b='" + a + "'><i>" + icon(ic) + "</i><span>" + esc(title) + (sub ? "<small>" + esc(sub) + "</small>" : "") + "</span></button>";
  function render() {
    const kb = sizeKb();
    overlay().querySelector(".g2b-body").innerHTML = [
      "<p class='g2r-lead'>Všetko, čo zapíšeš, je uložené len v tomto telefóne – nikam sa neposiela a nepotrebuješ účet.</p>",
      "<section class='g2r-info'><h3>Pridať na plochu</h3>",
      standalone() ? "<p>Appku už máš na ploche. 💜</p>"
        : installPrompt ? act("install", "sparkle", "Pridať Guguboo na plochu", "otvorí sa ako bežná aplikácia")
        : isIos() ? "<p>V Safari ťukni na <strong>Zdieľať</strong> (štvorček so šípkou) a vyber <strong>Pridať na plochu</strong>.</p>"
        : "<p>V prehliadači otvor ponuku <strong>⋮</strong> a vyber <strong>Inštalovať aplikáciu</strong> alebo <strong>Pridať na plochu</strong>.</p>",
      "</section>",
      "<section class='g2r-info'><h3>Záloha</h3><p class='g2r-small'>Ak vymažeš údaje prehliadača alebo meníš telefón, údaje sa stratia. Záloha je súbor, ktorý si uložíš. Sú v ňom aj osobné údaje – nikomu ho neposielaj.</p>",
      act("save", "lock", "Uložiť zálohu", "uložené približne " + kb + " kB"),
      "<label class='g2r-act g2q-file'><i>" + icon("lock") + "</i><span>Obnoviť zo zálohy<small>prepíše údaje v tomto telefóne</small></span><input id='g2bRestore' type='file' accept='application/json,.json'></label>",
      "</section>",
      "<button class='g2r-link' type='button' data-g2b='wipe'>Vymazať všetky údaje z tohto telefónu</button>"
    ].join("");
  }
  function open() { const el = overlay(); el.classList.add("open"); el.setAttribute("aria-hidden", "false"); render(); setTimeout(() => el.querySelector(".g2b-body button")?.focus({ preventScroll: true }), 60); }
  function close() { const el = byId("g2BackupOverlay"); if (!el) return; el.classList.remove("open"); el.setAttribute("aria-hidden", "true"); }

  // Master 2.8 (Plán F1-0): formát zálohy v čistých funkciách, aby ho test.html overil tam a späť (správanie sa nemení).
  function exportPayload() {
    const data = {}; keys().forEach(key => { data[key] = localStorage.getItem(key); });
    return JSON.stringify({ app: "guguboo", kind: "zaloha", schema: 1, created: new Date().toISOString(), data });
  }
  function parseBackup(text) {
    const backup = JSON.parse(text);
    if (backup?.app !== "guguboo" || !backup.data || typeof backup.data !== "object") throw new Error("format");
    return backup;
  }
  function applyBackup(backup) {
    keys().forEach(key => localStorage.removeItem(key));
    Object.entries(backup.data).forEach(([key, value]) => { if (key.startsWith(PREFIX) && typeof value === "string") localStorage.setItem(key, value); });
  }
  async function save() {
    V5.persist();
    const payload = exportPayload();
    const name = "guguboo-zaloha-" + new Date().toISOString().slice(0, 10) + ".json";
    const file = new File([payload], name, { type: "application/json" });
    try {
      if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: "Záloha Guguboo" }); return V5.announce("Záloha je pripravená."); }
    } catch (error) { if (error?.name === "AbortError") return; }
    const url = URL.createObjectURL(file);
    const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    V5.announce("Záloha sa stiahla do telefónu.");
  }
  function restore(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const backup = parseBackup(reader.result);
        if (!window.confirm("Obnoviť zálohu z " + new Date(backup.created).toLocaleDateString("sk-SK") + "? Prepíše údaje v tomto telefóne.")) return;
        applyBackup(backup);
        try { sessionStorage.clear(); } catch (_) { /* nič */ }
        window.location.reload();
      } catch (_) { V5.announce("Tento súbor nie je záloha Guguboo."); }
    };
    reader.readAsText(file);
  }
  function wipe() {
    if (!window.confirm("Vymazať všetky údaje Guguboo z tohto telefónu? Nedá sa to vrátiť – ak ich chceš mať, najprv si ulož zálohu.")) return;
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
  window.G2Backup = { open, close, exportPayload, parseBackup, applyBackup, PREFIX, AUTH };
})();

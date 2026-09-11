(function initPrivateSpace() {
  "use strict";

  const STORAGE_KEY = "guguboo-private-space-v1";
  const AUTH_STORAGE_KEY = "guguboo-private-space-auth-v1";
  const SCHEMA_VERSION = 1;
  const PBKDF2_ITERATIONS = 310000;
  const INACTIVITY_MS = 2 * 60 * 1000;
  const AAD = new TextEncoder().encode("guguboo-private-space-v1");
  const root = document.getElementById("privateSpaceApp");
  const view = document.getElementById("privateSpace");

  if (!root || !view || !window.crypto?.subtle) return;

  const privateStore = {
    read() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      try {
        const record = JSON.parse(raw);
        return record?.version === SCHEMA_VERSION ? record : null;
      } catch (_) {
        return null;
      }
    },
    write(record) { localStorage.setItem(STORAGE_KEY, JSON.stringify(record)); },
    clear() { localStorage.removeItem(STORAGE_KEY); }
  };

  let privateData = null;
  let encryptionKey = null;
  let selectedMood = "";
  let selectedType = "";
  let editingId = "";
  let openedId = "";
  let inactivityTimer = 0;
  let operationGeneration = 0;

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;"
  })[character]);
  const bytesToBase64 = bytes => {
    let binary = "";
    for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]);
    return btoa(binary);
  };
  const base64ToBytes = value => Uint8Array.from(atob(value), character => character.charCodeAt(0));
  const randomBytes = length => crypto.getRandomValues(new Uint8Array(length));
  const createId = () => crypto.randomUUID ? crypto.randomUUID() : bytesToBase64(randomBytes(18)).replace(/[+/=]/g, "");
  const isActive = () => view.classList.contains("active");
  const isPostpartum = () => typeof state !== "undefined" && state.profile?.status === "born";
  const formatDate = value => new Intl.DateTimeFormat("sk-SK", {
    dateStyle: "medium", timeStyle: "short"
  }).format(new Date(value));

  function readAuthState() {
    try {
      const value = JSON.parse(sessionStorage.getItem(AUTH_STORAGE_KEY) || "{}");
      return { failures: Number(value.failures) || 0, blockedUntil: Number(value.blockedUntil) || 0 };
    } catch (_) {
      return { failures: 0, blockedUntil: 0 };
    }
  }

  function writeAuthState(value) {
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
  }

  function clearAuthState() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }

  async function deriveKey(pin, salt, iterations) {
    const material = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", hash: "SHA-256", salt, iterations },
      material,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encryptPayload(payload, key, salt, iterations = PBKDF2_ITERATIONS) {
    const iv = randomBytes(12);
    const clear = new TextEncoder().encode(JSON.stringify(payload));
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: AAD }, key, clear);
    return {
      version: SCHEMA_VERSION,
      kdf: { name: "PBKDF2", hash: "SHA-256", iterations, salt: bytesToBase64(salt) },
      cipher: { name: "AES-GCM", iv: bytesToBase64(iv), data: bytesToBase64(new Uint8Array(encrypted)) }
    };
  }

  async function decryptRecord(record, pin) {
    if (record?.kdf?.name !== "PBKDF2" || record?.kdf?.hash !== "SHA-256" ||
        record?.cipher?.name !== "AES-GCM" || !Number.isInteger(record.kdf.iterations)) throw new Error("invalid-record");
    const salt = base64ToBytes(record.kdf.salt);
    const key = await deriveKey(pin, salt, record.kdf.iterations);
    const clear = await crypto.subtle.decrypt({
      name: "AES-GCM", iv: base64ToBytes(record.cipher.iv), additionalData: AAD
    }, key, base64ToBytes(record.cipher.data));
    const payload = JSON.parse(new TextDecoder().decode(clear));
    if (payload?.version !== SCHEMA_VERSION || !Array.isArray(payload.entries)) throw new Error("invalid-payload");
    return { key, payload };
  }

  async function persistPrivateData() {
    if (!privateData || !encryptionKey) throw new Error("locked");
    const current = privateStore.read();
    if (!current) throw new Error("missing-record");
    const salt = base64ToBytes(current.kdf.salt);
    const record = await encryptPayload(privateData, encryptionKey, salt, current.kdf.iterations);
    privateStore.write(record);
  }

  function setMessage(text, kind = "") {
    const message = root.querySelector("[data-private-message]");
    if (!message) return;
    message.textContent = text;
    message.dataset.kind = kind;
  }

  function focusSoon(selector) {
    window.setTimeout(() => {
      if (isActive()) root.querySelector(selector)?.focus();
    }, 30);
  }

  function pinInput(id, label, autocomplete) {
    return `<label class="private-pin-label" for="${id}">${label}</label>
      <input class="private-pin" id="${id}" name="${id}" type="password" inputmode="numeric"
        pattern="[0-9]{4}" minlength="4" maxlength="4" autocomplete="${autocomplete}"
        aria-describedby="privateMessage" required>`;
  }

  function renderSetup() {
    root.innerHTML = `<div class="private-shell private-auth-shell">
      <header class="private-heading"><span class="private-lock" aria-hidden="true">🔒</span><div><h1>Môj priestor</h1><p>Nastav si prístupový kód</p></div></header>
      <form class="private-auth-card" data-private-setup novalidate>
        ${pinInput("privatePinNew", "Zadaj presne štyri číslice", "new-password")}
        ${pinInput("privatePinConfirm", "Zopakuj prístupový kód", "new-password")}
        <p class="private-security-note">Zápisy budú na tomto zariadení šifrované a chránené tvojím PIN-om. Štvorciferný PIN však nenahrádza silné heslo, používateľský účet ani ochranu zariadenia.</p>
        <p class="private-message" id="privateMessage" data-private-message role="status" aria-live="polite"></p>
        <button class="private-primary" type="submit">Nastaviť a pokračovať</button>
      </form>
    </div>`;
    focusSoon("#privatePinNew");
  }

  function renderLocked() {
    root.innerHTML = `<div class="private-shell private-auth-shell">
      <header class="private-heading"><span class="private-lock" aria-hidden="true">🔒</span><div><h1>Môj priestor</h1><p>Zadaj svoj prístupový kód</p></div></header>
      <form class="private-auth-card" data-private-unlock novalidate>
        ${pinInput("privatePinUnlock", "Prístupový kód", "current-password")}
        <p class="private-message" id="privateMessage" data-private-message role="status" aria-live="polite"></p>
        <button class="private-primary" type="submit">Odomknúť</button>
        <button class="private-link" type="button" data-private-forgot>Zabudol/a som kód</button>
      </form>
    </div>`;
    updateUnlockDelay();
    focusSoon("#privatePinUnlock");
  }

  const moods = [
    ["very-low", "😞", "Veľmi ťažko"], ["low", "🙁", "Skôr ťažko"],
    ["neutral", "😐", "Neutrálne"], ["good", "🙂", "Celkom dobre"], ["very-good", "😊", "Veľmi dobre"]
  ];
  const types = ["Myšlienka", "Otázka", "Potrebujem"];

  function renderEntries() {
    const list = root.querySelector("[data-private-list]");
    if (!list || !privateData) return;
    const entries = privateData.entries.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (!entries.length) {
      list.innerHTML = `<div class="private-empty"><span aria-hidden="true">✦</span><strong>Zatiaľ tu nie je žiadny zápis</strong><p>Keď budeš chcieť, môžeš si sem uložiť prvú súkromnú myšlienku.</p></div>`;
      return;
    }
    list.innerHTML = entries.map(entry => {
      const mood = moods.find(item => item[0] === entry.mood);
      const isOpen = openedId === entry.id;
      const meta = [entry.type, mood?.[1]].filter(Boolean).join(" · ");
      return `<article class="private-entry">
        <button class="private-entry-head" type="button" data-private-open="${escapeHtml(entry.id)}" aria-expanded="${isOpen}">
          <span><strong>${escapeHtml(meta || "Súkromný zápis")}</strong><small>${escapeHtml(formatDate(entry.createdAt))}</small></span><span aria-hidden="true">${isOpen ? "⌃" : "⌄"}</span>
        </button>
        ${isOpen ? `<div class="private-entry-body"><p>${escapeHtml(entry.text).replace(/\n/g, "<br>")}</p>
          ${entry.updatedAt !== entry.createdAt ? `<small>Upravené ${escapeHtml(formatDate(entry.updatedAt))}</small>` : ""}
          <div class="private-entry-actions"><button type="button" data-private-edit="${escapeHtml(entry.id)}">Upraviť</button><button class="private-danger" type="button" data-private-delete="${escapeHtml(entry.id)}">Vymazať</button></div></div>` : ""}
      </article>`;
    }).join("");
  }

  function renderUnlocked() {
    root.innerHTML = `<div class="private-shell private-unlocked">
      <header class="private-heading private-unlocked-head"><span class="private-lock" aria-hidden="true">🔓</span><div><h1>Môj priestor</h1><p>Súkromné zápisy na tomto zariadení</p></div><button class="private-lock-button" type="button" data-private-lock>Uzamknúť</button></header>
      <main class="private-content">
        <section class="private-card" aria-labelledby="privateMoodTitle"><h2 id="privateMoodTitle">Ako mi dnes je?</h2><p>Výber je nepovinný.</p>
          <div class="private-moods" role="group" aria-label="Nálada">${moods.map(([value, emoji, label]) => `<button type="button" data-private-mood="${value}" aria-label="${label}" aria-pressed="${selectedMood === value}"><span aria-hidden="true">${emoji}</span><small>${label}</small></button>`).join("")}</div>
        </section>
        <section class="private-card" aria-labelledby="privateEditorTitle"><h2 id="privateEditorTitle">${editingId ? "Upraviť súkromný zápis" : "Nový súkromný zápis"}</h2>
          <form data-private-entry-form><fieldset><legend>Typ zápisu — nepovinné</legend><div class="private-types">${types.map(type => `<button type="button" data-private-type="${type}" aria-pressed="${selectedType === type}">${type}</button>`).join("")}</div></fieldset>
            <label for="privateEntryText">Text zápisu</label><textarea id="privateEntryText" rows="6" required placeholder="Napíš, čo si chceš nechať pre seba."></textarea>
            <p class="private-message" data-private-message role="status" aria-live="polite"></p>
            <div class="private-form-actions"><button class="private-primary" type="submit">${editingId ? "Uložiť úpravy" : "Uložiť zápis"}</button>${editingId ? `<button type="button" data-private-cancel-edit>Zrušiť úpravu</button>` : ""}</div>
          </form>
        </section>
        <section class="private-card private-list-card" aria-labelledby="privateListTitle"><h2 id="privateListTitle">Moje súkromné zápisy</h2><div class="private-list" data-private-list></div></section>
        <p class="private-limit-note">PIN chráni šifrované dáta uložené v tomto prehliadači. Bez používateľského účtu ich ochrana závisí aj od zabezpečenia zariadenia a prehliadača.</p>
      </main>
    </div>`;
    renderEntries();
    resetInactivityTimer();
    focusSoon(editingId ? "#privateEntryText" : "[data-private-mood]");
  }

  function clearEditor() {
    selectedMood = "";
    selectedType = "";
    editingId = "";
    openedId = "";
  }

  function lock() {
    operationGeneration += 1;
    window.clearTimeout(inactivityTimer);
    inactivityTimer = 0;
    privateData = null;
    encryptionKey = null;
    clearEditor();
    if (privateStore.read()) renderLocked(); else renderSetup();
  }

  function resetInactivityTimer() {
    if (!privateData) return;
    window.clearTimeout(inactivityTimer);
    inactivityTimer = window.setTimeout(() => {
      lock();
      setMessage("Priestor bol uzamknutý po neaktivite.");
    }, INACTIVITY_MS);
  }

  function onEnter() {
    if (!isPostpartum()) {
      lock();
      if (typeof switchView === "function") switchView("home");
      return;
    }
    if (privateData) {
      renderUnlocked();
    } else if (privateStore.read()) {
      renderLocked();
    } else {
      renderSetup();
    }
  }

  function updateUnlockDelay() {
    const button = root.querySelector("[data-private-unlock] button[type='submit']");
    const input = root.querySelector("#privatePinUnlock");
    if (!button || !input) return;
    const auth = readAuthState();
    const remaining = Math.ceil((auth.blockedUntil - Date.now()) / 1000);
    const blocked = remaining > 0;
    button.disabled = blocked;
    input.disabled = blocked;
    if (blocked) {
      setMessage(`Skús to znova o ${remaining} s.`, "error");
      window.setTimeout(updateUnlockDelay, 250);
    }
  }

  function recordFailedAttempt() {
    const auth = readAuthState();
    const failures = auth.failures + 1;
    const delays = [0, 1000, 2000, 5000, 10000, 30000];
    const delay = delays[Math.min(failures, delays.length - 1)];
    writeAuthState({ failures, blockedUntil: Date.now() + delay });
  }

  async function handleSetup(form) {
    const pin = form.elements.privatePinNew.value;
    const confirmation = form.elements.privatePinConfirm.value;
    if (!/^\d{4}$/.test(pin)) return setMessage("Prístupový kód musí mať presne štyri číslice.", "error");
    if (pin !== confirmation) return setMessage("Prístupové kódy sa nezhodujú. Skús ich zadať znova.", "error");
    const generation = ++operationGeneration;
    const submit = form.querySelector("button[type='submit']");
    submit.disabled = true;
    setMessage("Pripravujem šifrovaný priestor…");
    try {
      const salt = randomBytes(16);
      const key = await deriveKey(pin, salt, PBKDF2_ITERATIONS);
      const payload = { version: SCHEMA_VERSION, entries: [] };
      const record = await encryptPayload(payload, key, salt);
      if (generation !== operationGeneration || !isActive()) return;
      privateStore.write(record);
      encryptionKey = key;
      privateData = payload;
      clearAuthState();
      renderUnlocked();
    } catch (_) {
      submit.disabled = false;
      setMessage("Priestor sa nepodarilo vytvoriť. Skús to znova.", "error");
    }
  }

  async function handleUnlock(form) {
    const pin = form.elements.privatePinUnlock.value;
    if (!/^\d{4}$/.test(pin)) return setMessage("Zadaj presne štyri číslice.", "error");
    const auth = readAuthState();
    if (auth.blockedUntil > Date.now()) return updateUnlockDelay();
    const generation = ++operationGeneration;
    const submit = form.querySelector("button[type='submit']");
    submit.disabled = true;
    setMessage("Overujem kód…");
    try {
      const result = await decryptRecord(privateStore.read(), pin);
      if (generation !== operationGeneration || !isActive()) return;
      encryptionKey = result.key;
      privateData = result.payload;
      clearAuthState();
      renderUnlocked();
    } catch (_) {
      if (generation !== operationGeneration || !isActive()) return;
      recordFailedAttempt();
      form.elements.privatePinUnlock.value = "";
      submit.disabled = false;
      setMessage("Prístupový kód nie je správny.", "error");
      updateUnlockDelay();
    }
  }

  async function handleEntrySave(form) {
    const text = form.querySelector("#privateEntryText").value.trim();
    if (!text) return setMessage("Napíš text zápisu.", "error");
    const now = new Date().toISOString();
    if (editingId) {
      const entry = privateData.entries.find(item => item.id === editingId);
      if (!entry) return;
      entry.text = text;
      entry.mood = selectedMood || null;
      entry.type = selectedType || null;
      entry.updatedAt = now;
    } else {
      privateData.entries.push({
        id: createId(), createdAt: now, updatedAt: now,
        mood: selectedMood || null, type: selectedType || null, text
      });
    }
    try {
      await persistPrivateData();
      clearEditor();
      renderUnlocked();
      setMessage("Súkromný zápis je uložený.");
    } catch (_) {
      setMessage("Zápis sa nepodarilo bezpečne uložiť. Skús to znova.", "error");
    }
  }

  root.addEventListener("input", event => {
    if (event.target.matches(".private-pin")) event.target.value = event.target.value.replace(/\D/g, "").slice(0, 4);
    if (privateData) resetInactivityTimer();
  });

  root.addEventListener("submit", event => {
    event.preventDefault();
    if (event.target.matches("[data-private-setup]")) handleSetup(event.target);
    if (event.target.matches("[data-private-unlock]")) handleUnlock(event.target);
    if (event.target.matches("[data-private-entry-form]")) handleEntrySave(event.target);
  });

  root.addEventListener("click", async event => {
    if (privateData) resetInactivityTimer();
    const mood = event.target.closest("[data-private-mood]");
    if (mood) {
      selectedMood = selectedMood === mood.dataset.privateMood ? "" : mood.dataset.privateMood;
      root.querySelectorAll("[data-private-mood]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.privateMood === selectedMood)));
      return;
    }
    const type = event.target.closest("[data-private-type]");
    if (type) {
      selectedType = selectedType === type.dataset.privateType ? "" : type.dataset.privateType;
      root.querySelectorAll("[data-private-type]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.privateType === selectedType)));
      return;
    }
    const open = event.target.closest("[data-private-open]");
    if (open) {
      openedId = openedId === open.dataset.privateOpen ? "" : open.dataset.privateOpen;
      renderEntries();
      return;
    }
    const edit = event.target.closest("[data-private-edit]");
    if (edit && privateData) {
      const entry = privateData.entries.find(item => item.id === edit.dataset.privateEdit);
      if (!entry) return;
      editingId = entry.id;
      selectedMood = entry.mood || "";
      selectedType = entry.type || "";
      renderUnlocked();
      root.querySelector("#privateEntryText").value = entry.text;
      root.querySelector("#privateEntryText").focus();
      return;
    }
    if (event.target.closest("[data-private-cancel-edit]")) {
      clearEditor();
      renderUnlocked();
      return;
    }
    const remove = event.target.closest("[data-private-delete]");
    if (remove && privateData) {
      const confirmed = window.confirm("Naozaj chceš tento súkromný zápis natrvalo vymazať?");
      if (!confirmed) return;
      privateData.entries = privateData.entries.filter(item => item.id !== remove.dataset.privateDelete);
      try {
        await persistPrivateData();
        openedId = "";
        renderUnlocked();
        setMessage("Súkromný zápis bol vymazaný.");
      } catch (_) {
        setMessage("Zápis sa nepodarilo vymazať. Skús to znova.", "error");
      }
      return;
    }
    if (event.target.closest("[data-private-lock]")) {
      lock();
      return;
    }
    if (event.target.closest("[data-private-forgot]")) {
      const confirmed = window.confirm("Reset kódu natrvalo vymaže iba všetky dáta Môjho priestoru. Ostatné údaje aplikácie zostanú zachované. Pokračovať?");
      if (!confirmed) return;
      privateStore.clear();
      clearAuthState();
      lock();
      setMessage("Môj priestor bol vymazaný. Môžeš nastaviť nový kód.");
    }
  });

  ["pointerdown", "keydown", "touchstart"].forEach(type => document.addEventListener(type, () => {
    if (privateData) resetInactivityTimer();
  }, { passive: true }));

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && privateData) lock();
  });
  window.addEventListener("pagehide", () => {
    if (privateData) lock();
  });
  document.getElementById("saveProfile")?.addEventListener("click", () => window.setTimeout(() => {
    if (!isPostpartum() && (isActive() || privateData)) {
      lock();
      if (typeof switchView === "function") switchView("home");
    }
  }, 0));

  let wasActive = isActive();
  new MutationObserver(() => {
    const active = isActive();
    if (active && !wasActive) onEnter();
    if (!active && wasActive && privateData) lock();
    wasActive = active;
  }).observe(view, { attributes: true, attributeFilter: ["class"] });

  if (wasActive) onEnter();

  window.GugubooPrivateSpaceTest = Object.freeze({
    storageKey: STORAGE_KEY,
    inactivityMs: INACTIVITY_MS,
    lock,
    isUnlocked: () => Boolean(privateData && encryptionKey)
  });
})();

/*
 * GUGUBOO MASTER 2.0 – kruh „Čas pre teba“ (finálny prototyp prototyp-kruh.html, varianta Kruh; DECISIONS 14. 11. – uzavreté).
 *
 * Stred = okamžitá pomoc bez otázok a bez hodnotenia nálady. Oddych · Telo · Opora = priamo použiteľné nástroje.
 * Bez odmien, rozjasňovania, počtov a otázky na náladu. Nič sa neukladá (prosby, odškrtnutia, časovače žijú len v okne).
 * Texty Tela sú len z overeného obsahu (content/mama-tehotenstvo.js, mama-po-porode.js, baby-months.js, pregnancy-weeks.js) so zdrojom.
 * Okno je krátka akcia v spoločnom systéme okien (g2-windows.js): zásobník, späť o krok, ×, Esc, fokus, systémové späť.
 * Starý v5OMenu ostáva pre iné časti appky (Denné záznamy, Kalendár, starostlivosť, Plán), kruh ho už nepoužíva.
 */
(function initG2Ring() {
  "use strict";

  const V5 = window.GugubooV5;
  if (!V5 || !V5.MASTER) return;
  const byId = id => document.getElementById(id);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const text = v => Array.isArray(v) ? v.map(x => x?.sk || x).filter(Boolean).join(" ") : (v?.sk || (typeof v === "string" ? v : ""));
  const C = () => window.GugubooContent || {};
  const st = () => (typeof state !== "undefined" ? state : {});

  // ——— Kontext: obdobie, noc, týždeň (jeden výpočet – GugubooJourney) ———
  const phase = () => st().profile?.status === "born" ? "born" : "preg";
  // Noc = nočný režim appky alebo čas 22:00–6:00. (forceNight je len pre testy.)
  const isNight = () => { if (typeof window.G2Ring?.forceNight === "boolean") return window.G2Ring.forceNight; const h = new Date().getHours(); return document.body.classList.contains("night") || h >= 22 || h < 6; };
  const week = () => phase() === "preg" ? (window.GugubooJourney?.context?.(st())?.pregnancy_week || 0) : 0;
  const contentReady = () => Boolean(C().mamaPregnancy && C().mamaPostpartum && C().babyMonths && C().pregnancyWeeks);

  // ——— Okno (krátka akcia) ———
  document.body.insertAdjacentHTML("beforeend", [
    "<div id='g2RingOverlay' class='g2-ring-overlay' aria-hidden='true'>",
    "<section id='g2Ring' class='g2-ring-sheet' role='dialog' aria-modal='true' aria-labelledby='g2RingTitle'>",
    "<div class='g2-ring-sheet-head'><button type='button' class='v5-icon-button' data-g2-ring-back aria-label='Späť'>", V5.icon("back"), "</button>",
    "<h2 id='g2RingTitle' tabindex='-1'></h2>",
    "<button type='button' class='v5-icon-button' data-g2-ring-close aria-label='Zavrieť'>" + window.GugubooV5.glyph("close") + "</button></div>",
    "<div id='g2RingBody'></div></section></div>",
    "<div id='g2RingDim' class='g2-ring-dim' role='button' tabindex='-1' aria-hidden='true' aria-label='Ťukni a šum sa zastaví'><div>Šum hrá<br><span id='g2RingDimT'></span><br><br>Ťukni kamkoľvek a šum sa zastaví</div></div>",
    "<div id='g2RingToast' class='g2-ring-toast' role='status' aria-live='polite' hidden></div>"
  ].join(""));
  const overlay = byId("g2RingOverlay");
  const sheet = byId("g2Ring");
  const body = byId("g2RingBody");

  let nav = [];          // zásobník obrazoviek v okne: { title, render }
  let timer = null;      // jediný bežiaci časovač okna (dych, ticho, kŕč, sprcha…)
  let nextStep = null;   // „Ďalej“ v postupe o krokoch

  function paint() {
    clearInterval(timer);
    nextStep = null;
    const top = nav[nav.length - 1];
    if (!top) return;
    byId("g2RingTitle").textContent = top.title;
    const ready = contentReady() || top.noContent;
    body.innerHTML = ready ? top.render() : "<p class='g2r-lead'>Načítavam…</p>";
    sheet.scrollTop = 0;
    if (ready) top.after?.();
    else waitForContent();
  }
  let waiting = null;
  function waitForContent() {
    if (waiting) return;
    let tries = 0;
    waiting = setInterval(() => {
      if (contentReady() || ++tries > 40) {
        clearInterval(waiting); waiting = null;
        if (!contentReady() || !overlay.classList.contains("open")) return;
        const top = nav[nav.length - 1];
        if (top?.retry) { nav.pop(); doAct(top.retry); } else paint();
      }
    }, 250);
  }
  function push(title, render, opts = {}) {
    nav.push({ title, render, ...opts });
    if (!overlay.classList.contains("open")) {
      overlay.classList.add("open");
      overlay.setAttribute("aria-hidden", "false");
    }
    paint();
    setTimeout(() => byId("g2RingTitle")?.focus({ preventScroll: true }), 60);
  }
  function back() {
    if (nav.length > 1) { nav.pop(); paint(); byId("g2RingTitle")?.focus({ preventScroll: true }); return; }
    close();
  }
  function close() {
    clearInterval(timer);
    nextStep = null;
    nav = [];
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }
  function toast(message) {
    const el = byId("g2RingToast");
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toast.t);
    toast.t = setTimeout(() => { el.hidden = true; }, 3200);
  }

  // ——— Zvuk: hnedý šum a jemný tón (Web Audio, žiadne súbory) ———
  let ac, noise, gain, stopAt, tick;
  function audio() { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === "suspended") ac.resume(); return ac; }
  function startNoise(minutes) {
    stopNoise();
    let a;
    try { a = audio(); } catch (error) { return toast("Zvuk sa v tomto prehliadači nedá spustiť."); }
    const len = a.sampleRate * 4, buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { last = (last + .02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.2; }
    noise = a.createBufferSource(); noise.buffer = buf; noise.loop = true;
    gain = a.createGain(); gain.gain.setValueAtTime(0, a.currentTime); gain.gain.linearRampToValueAtTime(.35, a.currentTime + 6);
    noise.connect(gain).connect(a.destination); noise.start();
    stopAt = Date.now() + minutes * 60000;
    byId("g2RingDim").classList.add("on"); byId("g2RingDim").tabIndex = 0; byId("g2RingDim").removeAttribute("aria-hidden"); // Master 4.0 (Audit F31): fokusovateľné len keď šum hrá
    setTimeout(() => byId("g2RingDim")?.focus({ preventScroll: true }), 60);
    clearInterval(tick);
    const show = () => {
      const s = Math.max(0, Math.round((stopAt - Date.now()) / 1000));
      byId("g2RingDimT").textContent = "ešte " + Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
      if (s <= 0) stopNoise(true);
    };
    show();
    tick = setInterval(show, 500);
  }
  function stopNoise(fade) {
    clearInterval(tick);
    byId("g2RingDim")?.classList.remove("on"); if (byId("g2RingDim")) { byId("g2RingDim").tabIndex = -1; byId("g2RingDim").setAttribute("aria-hidden", "true"); }
    if (noise && gain && ac) {
      const n = noise;
      gain.gain.cancelScheduledValues(ac.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ac.currentTime);
      gain.gain.linearRampToValueAtTime(0, ac.currentTime + (fade ? 8 : .4));
      setTimeout(() => { try { n.stop(); } catch (error) { /* už stojí */ } }, fade ? 8200 : 500);
    }
    noise = null;
  }
  function chime() {
    try {
      const a = audio();
      [523, 659].forEach((f, i) => {
        const o = a.createOscillator(), g = a.createGain();
        o.frequency.value = f; o.type = "sine";
        g.gain.setValueAtTime(0, a.currentTime + i * .5);
        g.gain.linearRampToValueAtTime(.18, a.currentTime + i * .5 + .05);
        g.gain.exponentialRampToValueAtTime(.001, a.currentTime + i * .5 + 2.5);
        o.connect(g).connect(a.destination); o.start(a.currentTime + i * .5); o.stop(a.currentTime + i * .5 + 2.6);
      });
    } catch (error) { /* bez zvuku */ }
  }

  // ——— Stavebné prvky ———
  // Master 3.0 (IKONY_NAVRH.md časť 4): ic = názov linkovej ikony z iconPaths (predtým znaky ◌ ☾ ✉ ☏ ⇡ ⏱ ≈ ↟ ♡).
  const act = (data, ic, t, s, big) => "<button class='g2r-act" + (big ? " big" : "") + "' type='button' data-g2r='" + data + "'><i aria-hidden='true'>" + V5.icon(ic) + "</i><span>" + esc(t) + (s ? "<small>" + esc(s) + "</small>" : "") + "</span></button>";
  // Master 4.0 (Audit T36): jedna podoba odkazu „Zdroj: NHS · overené D. M. RRRR ↗“ (slovo „kontrola“ len pre lekára).
  const source = (url, reviewed, label) => url ? "<p class='g2r-src'><a href='" + esc(url) + "' target='_blank' rel='noopener noreferrer'>Zdroj: " + esc(label || "NHS") + (reviewed ? " · overené " + esc(reviewed) : "") + " ↗</a></p>" : "";
  const chips = (attr, list, sel, suffix) => "<div class='g2r-chips' role='group'>" + list.map(m => "<button class='g2r-pill' type='button' " + attr + "='" + m + "' aria-pressed='" + (m === sel) + "'>" + m + suffix + "</button>").join("") + "</div>";
  const mmss = s => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  const MP = () => C().mamaPregnancy || {}, MPP = () => C().mamaPostpartum || {};
  const tr = (src, id) => (src.troubles || []).find(t => t.id === id) || { tips: [] };
  const safeSleep = () => {
    for (const p of (C().babyMonths?.periods || [])) for (const sec of Object.values(p)) if (Array.isArray(sec)) for (const it of sec) if (it?.sk && /^Keď je ospalé, polož ho na chrbát/.test(it.sk)) return it.sk;
    return "";
  };
  const breathText = () => text(C().pregnancyWeeks?.weeks?.[40]?.tip) || "";

  // ——— Prosby (UX Architekt) ———
  function requests() {
    if (phase() === "preg") return ["Môžeš dnes nakúpiť namiesto mňa? Potrebujem si oddýchnuť.", "Môžeš dnes pripraviť večeru? Ďakujem.", "Môžeš sa dnes postarať o domácnosť, kým si ľahnem s nohami hore?"].concat(week() >= 28 ? ["Pomôžeš mi tento týždeň pripraviť miesto, kde bude bábätko spať?"] : []);
    return ["Môžeš na 20 minút prevziať bábätko? Potrebujem si ľahnúť.", "Dnes nestíham jedlo. Môžeš cestou niečo kúpiť alebo uvariť?", "Môžeš ísť dnes s kočíkom von? Potrebujem chvíľu ticha.", "Vymeníme sa dnes v noci pri vstávaní?"];
  }
  const FRIEND = ["Myslím na teba. Máš dnes chvíľu na telefonát?", "Potrebujem sa s niekým porozprávať. Zavoláš mi, keď budeš mať chvíľu?"];
  const ASK_NIGHT = ["Vymeníme sa pri ďalšom zobudení? Potrebujem sa vyspať."];

  // ——— Hlavné obrazovky ———
  function center() {
    const night = isNight(), born = phase() === "born";
    if (night) return push("Nočná chvíľka", () => act("nap", "sound", "Šum na zaspávanie", "", true) + act("breath", "wind", "Dýchaj so mnou", "1 minúta") +
      (born ? act("ask-night", "paperPlane", "Vymeníme sa pri ďalšom zobudení?", "prosba blízkemu") : act("sleep", "bed", "Uložiť sa na spánok", "pohodlne na boku, potom šum")) + // Master 2.7 (audit #30): bez „Kŕč v nohe“
      act("ask", "paperPlane", "Poprosiť o pomoc", "hotová prosba") + act("hard", "alert", "Nálada a podpora", "kontakty na pomoc"), { noContent: true });
    const big = born ? ["nap", "bed", "Zdriemni si, kým spí", ""] : ["breath", "wind", "Dýchaj so mnou", "1 minúta"];
    push("Teraz pre teba", () => act(big[0], big[1], big[2], big[3], true) + act("ask", "paperPlane", "Poprosiť o pomoc", "hotová prosba") + act("hard", "alert", "Nálada a podpora", "kontakty na pomoc"), { noContent: true });
  }
  // Vstup z Mamy a zo zásuvky: okamžitá pomoc + tri časti kruhu
  function overview() {
    const night = isNight(), born = phase() === "born";
    const big = night ? ["nap", "sound", "Šum na zaspávanie", ""] : born ? ["nap", "bed", "Zdriemni si, kým spí", ""] : ["breath", "wind", "Dýchaj so mnou", "1 minúta"];
    push("Čas pre teba", () => act(big[0], big[1], big[2], big[3], true) +
      "<div class='g2r-parts'>" + [["rest", "Oddych", "g2r-p1", "feather"], ["body", "Telo", "g2r-p2", "personTaiChi"], ["sup", "Opora", "g2r-p3", "handshake"]].map(([k, t, c, ic]) => "<button type='button' class='g2r-part " + c + "' data-g2r='sec:" + k + "'>" + V5.icon(ic) + "<span>" + t + "</span></button>").join("") + "</div>", { noContent: true });
  }
  function section(k) {
    const night = isNight(), born = phase() === "born";
    // Oddych: v tehotenstve cez deň bez zdriemnutia (NHS: popoludní a večer radšej nespi) – šum len v noci a po pôrode.
    if (k === "rest") return push("Oddych", () => act("breath", "wind", "Dýchaj so mnou", "1 minúta") +
      (night || born ? act("nap", born && !night ? "bed" : "sound", born && !night ? "Zdriemni si, kým spí" : "Šum na zaspávanie", "") : "") +
      (night ? "" : act("quiet", "hourglass", "Chvíľa ticha", "5–15 minút")), { noContent: true });
    if (k === "sup") return push("Opora", () => act("ask", "paperPlane", "Poprosiť o pomoc", "hotová prosba") + (night ? "" : act("friend", "envelope", "Napísať blízkemu", "krátka správa")) + act("hard", "alert", "Nálada a podpora", "kontakty na pomoc"), { noContent: true });
    const mamaLink = "<button class='g2r-link' type='button' data-g2r='mama'>Viac o tele v Mame " + window.GugubooV5.glyph("chevronRight") + "</button>";
    // Master 2.7 (audit #30, PL): „Kŕč v nohe“ odstránený – postup pri príznaku; téma Kŕče ostáva v Mame (čo je bežné + otázka).
    if (!born) return push("Telo", () => (night ? "" : act("legs", "couch", "Nohy hore", "10 alebo 20 minút")) + act("sleep", "bed", "Uložiť sa na spánok", "pohodlne na boku" + (night ? ", potom šum" : "")) + mamaLink, { noContent: true });
    push("Telo", () => act("feed", "breastfeed", "Pohodlne pri kŕmení", "") + (night ? "" : act("shower", "shower", "Sprcha len pre mňa", "15 minút len pre seba") + act("pwalk", "walk", "Pokojná prechádzka", "10 alebo 20 minút")) + mamaLink, { noContent: true });
  }

  // Postup o krokoch (Ďalej) v jednom okne
  function steps(title, list, after) {
    let i = 0;
    const render = () => "<div class='g2r-info g2r-step'>" + (list.length > 1 ? "<p class='g2r-small' style='margin:0 0 6px'>" + (i + 1) + " z " + list.length + "</p>" : "") /* Master 4.0 (Audit T87) */ + list[i].html + "</div>" +
      (i < list.length - 1 ? "<button class='g2r-btn' type='button' data-g2r='next'>Ďalej</button>" : (after || "<button class='g2r-btn' type='button' data-g2r='close'>Hotovo</button>"));
    const show = () => { body.innerHTML = render(); list[i].onShow?.(); nextStep = () => { i = Math.min(i + 1, list.length - 1); clearInterval(timer); show(); }; };
    push(title, () => "", { after: () => { i = 0; show(); } });
  }
  function countdown(sel, done) {
    const pick = body.querySelector("[data-g2r-q][aria-pressed='true']");
    let s = (pick ? +pick.dataset.g2rQ : 10) * 60;
    try { audio(); } catch (error) { /* bez zvuku */ }
    clearInterval(timer);
    const show = () => { const el = byId("g2rTm"); if (el) el.textContent = mmss(s); };
    show();
    timer = setInterval(() => { s--; show(); if (s <= 0) { clearInterval(timer); chime(); const el = byId("g2rTm"); if (el) el.textContent = done || "Hotovo"; } }, 1000);
  }

  // ——— Akcie ———
  // Akcie Tela potrebujú overený obsah – kým sa nenačíta, okno pokojne ukáže „Načítavam…“ a potom akciu dokončí.
  const NEEDS = { cramp: "Kŕč v nohe", legs: "Nohy hore", sleep: "Uložiť sa na spánok", feed: "Pohodlne pri kŕmení", shower: "Sprcha len pre mňa", pwalk: "Pokojná prechádzka" };
  function doAct(a) {
    if (NEEDS[a] && !contentReady()) return push(NEEDS[a], () => "", { retry: a });
    if (a.startsWith("sec:")) return section(a.slice(4));
    if (a === "next") return nextStep?.();
    if (a === "close") return close();
    if (a === "breath") {
      const tip = breathText();
      return push("Dýchaj so mnou", () => "<div class='g2r-breath'><div class='g2r-bubble' id='g2rBub' aria-hidden='true'></div></div><p class='g2r-cue' id='g2rCue' aria-live='polite'>Začneme?</p>" +
        "<p class='g2r-small' style='text-align:center'>" + esc(tip || "Dýchaj pokojne nosom a pomaly vydychuj ústami.") + "</p>" +
        "<button class='g2r-btn' type='button' data-g2r='breath-go'>Začať · 1 minúta</button>" + (tip ? source("https://www.nhs.uk/pregnancy/week-by-week/", "") : "") +
        "<p class='g2r-small'>Jednoduchá pomôcka na upokojenie, nie lekársky postup.</p>", { noContent: true });
    }
    if (a === "breath-go") {
      const b = byId("g2rBub"), cue = byId("g2rCue");
      if (!b || !cue) return;
      b.classList.add("run");
      let t = 0;
      clearInterval(timer);
      try { audio(); } catch (error) { /* bez zvuku */ }
      const step = () => {
        const p = t % 10;
        cue.textContent = p < 4 ? "Nádych…" : p < 5 ? "…" : "Výdych…";
        if (t >= 60) { clearInterval(timer); b.classList.remove("run"); cue.textContent = "Hotovo. Pekne pokojne."; chime(); }
        t++;
      };
      step();
      timer = setInterval(step, 1000);
      return;
    }
    if (a === "nap") return push(phase() === "born" && !isNight() ? "Zdriemni si, kým spí" : "Šum na zaspávanie", () => chips("data-g2r-nap", [20, 45], 20, " min") /* Master 4.0 (Audit T86) */ +
      "<button class='g2r-btn' type='button' data-g2r='nap-go'>Spustiť šum</button><p class='g2r-small'>Šum sa pomaly zosilní a na konci sám stíchne.</p>", { noContent: true });
    if (a === "nap-go") { const m = +(body.querySelector("[data-g2r-nap][aria-pressed='true']")?.dataset.g2rNap || 20); close(); return startNoise(m); }
    if (a === "nap-go20") { close(); return startNoise(20); }
    if (a === "quiet") return push("Chvíľa ticha", () => chips("data-g2r-q", [5, 10, 15], 10, " min") + "<div class='g2r-timer' id='g2rTm'>10:00</div><button class='g2r-btn' type='button' data-g2r='timer-go'>Začať</button><p class='g2r-small'>Na konci zaznie jemný tón.</p>", { noContent: true });
    if (a === "timer-go") return countdown();
    if (a === "walk-go") return countdown(null, "Pekná prechádzka");
    if (a === "ask" || a === "friend" || a === "ask-night") {
      const list = a === "friend" ? FRIEND : a === "ask-night" ? ASK_NIGHT : requests();
      return push(a === "friend" ? "Napísať blízkemu" : "Poprosiť o pomoc", () => (list.length > 1 ? "<div class='g2r-chips g2r-rq' role='group' aria-label='Vyber prosbu'>" + list.map((t, i) => "<button class='g2r-pill' type='button' data-g2r-rq='" + i + "' aria-pressed='" + (i === 0) + "' aria-label='Prosba " + (i + 1) + "'>" + (i + 1) + "</button>").join("") + "</div>" : "") +
        "<p class='g2r-small' style='margin:12px 0 6px'>Uprav si text, ak chceš:</p><textarea id='g2rText' data-g2-no-guard aria-label='Text správy'>" + esc(list[0]) + "</textarea>" +
        "<button class='g2r-btn' type='button' data-g2r='send'>Poslať cez telefón</button><button class='g2r-btn ghost' type='button' data-g2r='copy'>Skopírovať text</button>" +
        "<p class='g2r-small'>Appka nič neposiela sama.</p>", { noContent: true, list });
    }
    if (a === "send") {
      const t = (byId("g2rText")?.value || "").trim();
      if (!t) return;
      if (navigator.share) return navigator.share({ text: t }).catch(() => {});
      const sms = "sms:?&body=" + encodeURIComponent(t);
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) { window.location.href = sms; return; }
      return doAct("copy");
    }
    if (a === "copy") {
      const t = (byId("g2rText")?.value || "").trim();
      const fallback = () => { byId("g2rText")?.select(); toast("Text je označený – skopíruj ho."); };
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(t).then(() => toast("Text je skopírovaný. Vlož ho do správy."), fallback);
      else fallback();
      return;
    }
    if (a === "hard") {
      return push("Nálada a podpora", () => { // Master 3.0 (Samo): bez negatívneho názvu
        const mood = MPP().mood;
        return "<div class='g2r-info'><p style='margin:0'>Porozprávať sa môžeš kedykoľvek. Linka dôvery Nezábudka je nonstop a bezplatná.</p><p style='margin:10px 0 0'><a class='g2r-btn g2r-call' href='tel:0800800566'>Zavolať 0800 800 566</a></p></div>" +
          (phase() === "born" && mood ? "<div class='g2r-info'><h3>Po pôrode</h3><p style='margin:0'>" + esc(mood.blues) + "</p><p class='g2r-small' style='margin-top:8px'>" + esc(mood.help) + "</p>" + source(mood.source, mood.reviewed) + "</div>" : "") +
          "<p class='g2r-small'>Ak hrozí nebezpečenstvo, volaj <a href='tel:112'>112</a>.</p>";
      }, { noContent: phase() !== "born" });
    }
    if (a === "mama") { close(); return V5.openFeature("mama"); }
    // —— Telo: tehotenstvo ——
    // Master 2.7 (audit #30): „Kŕč v nohe“ (postup pri príznaku) odstránený.
    // Master 2.7 (audit #31, #33): Nohy hore = len časovač oddychu + výnimka E2; Spánok = len informácia NHS (bez rady pri príznaku).
    const SAFE = id => window.G2Safety?.html(id) || "";
    if (a === "legs") {
      return push("Nohy hore", () => "<p class='g2r-lead'>Nohy si polož vyššie. Čas postrážim ja.</p>" + chips("data-g2r-q", [10, 20], 10, " min") + "<div class='g2r-timer' id='g2rTm'>10:00</div><button class='g2r-btn' type='button' data-g2r='timer-go'>Začať</button>" + SAFE("E2"));
    }
    if (a === "sleep") {
      const ti = tr(MP(), "tiredness");
      return steps("Uložiť sa na spánok", [{ html: esc((ti.info || [])[0] || "Uľahni si pohodlne.") }],
        (isNight() ? "<button class='g2r-btn' type='button' data-g2r='nap-go20'>Spustiť šum na zaspávanie</button><button class='g2r-btn ghost' type='button' data-g2r='close'>Bez šumu</button>" : "<button class='g2r-btn' type='button' data-g2r='close'>Hotovo</button>") +
        source(ti.source, ti.reviewed));
    }
    // —— Telo: po pôrode ——
    if (a === "feed") {
      return push("Pohodlne pri kŕmení", () => {
        const items = ["Podopri si spodnú časť chrbta.", "Pohár vody na dosah.", "Telefón a nabíjačka na dosah."];
        const pelvic = MPP().troubles?.find(t => t.id === "pelvic");
        return "<p class='g2r-lead'>Kým začneš, usaď sa:</p>" + items.map((x, i) => "<button class='g2r-check' type='button' data-g2r-check='" + i + "' aria-pressed='false'><span class='box' aria-hidden='true'></span><span>" + esc(x) + "</span></button>").join("") +
          act("breath", "wind", "Dýchaj so mnou", "1 minúta") + "<p class='g2r-small'>Len pre teba, nikam sa neukladá.</p>" + source(pelvic?.source, pelvic?.reviewed);
      });
    }
    if (a === "shower") {
      return push("Sprcha len pre mňa", () => {
        const stt = tr(MPP(), "stitches"), safe = safeSleep();
        return "" + // Master 2.7 (audit): bez rady o stehoch
          act("shower-ask", "paperPlane", "Poprosiť o 15 minút", "hotová prosba") + (safe ? "<p class='g2r-small' style='margin:8px 2px'>Ak bábätko nikto nestráži: " + esc(safe) + "</p>" : "") +
          act("shower-go", "hourglass", "Spustiť 15 minút", "") + source(stt.source, stt.reviewed) + (safe ? "<p class='g2r-src'>Bezpečný spánok: CDC (Learn the Signs)</p>" : "");
      });
    }
    if (a === "shower-ask") {
      return push("Poprosiť o 15 minút", () => "<textarea id='g2rText' data-g2-no-guard aria-label='Text správy'>" + esc("Postrážiš mi bábätko 15 minút? Idem sa osprchovať.") + "</textarea><button class='g2r-btn' type='button' data-g2r='send'>Poslať cez telefón</button><button class='g2r-btn ghost' type='button' data-g2r='copy'>Skopírovať text</button><p class='g2r-small'>Appka nič neposiela sama.</p>", { noContent: true });
    }
    if (a === "shower-go") {
      return push("Sprcha len pre mňa", () => "<div class='g2r-timer' id='g2rTm'>15:00</div><p class='g2r-small' style='text-align:center'>Pokojne, máš čas.</p>", {
        noContent: true,
        after: () => { let s = 900; try { audio(); } catch (error) { /* bez zvuku */ } clearInterval(timer); timer = setInterval(() => { s--; const el = byId("g2rTm"); if (el) el.textContent = mmss(s); if (s <= 0) { clearInterval(timer); chime(); if (el) el.textContent = "Hotovo"; } }, 1000); }
      });
    }
    if (a === "pwalk") {
      return push("Pokojná prechádzka", () => {
        // Master 2.7 (audit #32): bez rád po cisárskom reze, namiesto zoznamu výnimka E1
        return chips("data-g2r-q", [10, 20], 10, " min") + "<div class='g2r-timer' id='g2rTm'>10:00</div><button class='g2r-btn' type='button' data-g2r='walk-go'>Ideme von</button>" +
          (window.G2Safety?.html("E1") || "");
      });
    }
  }

  // ——— Ovládanie v okne ———
  overlay.addEventListener("click", event => {
    const t = event.target;
    if (t === overlay) return close();
    if (t.closest("[data-g2-ring-back]")) return back();
    if (t.closest("[data-g2-ring-close]")) return close();
    const ck = t.closest("[data-g2r-check]");
    if (ck) return ck.setAttribute("aria-pressed", String(ck.getAttribute("aria-pressed") !== "true"));
    const rq = t.closest("[data-g2r-rq]");
    if (rq) {
      const list = nav[nav.length - 1]?.list || [];
      rq.parentElement.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b === rq)));
      const area = byId("g2rText");
      if (area) area.value = list[+rq.dataset.g2rRq] || "";
      return;
    }
    const pick = t.closest("[data-g2r-nap], [data-g2r-q]");
    if (pick) {
      pick.parentElement.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b === pick)));
      if (pick.dataset.g2rQ && byId("g2rTm")) { clearInterval(timer); byId("g2rTm").textContent = mmss(+pick.dataset.g2rQ * 60); }
      return;
    }
    const a = t.closest("[data-g2r]");
    if (a) doAct(a.dataset.g2r);
  });
  // Stmavnutá obrazovka so šumom: ťuk (alebo Enter/Esc) zastaví
  byId("g2RingDim").addEventListener("click", () => { stopNoise(false); toast("Šum je zastavený."); });
  window.addEventListener("keydown", event => {
    if (!byId("g2RingDim").classList.contains("on")) return;
    if (["Escape", "Enter", " "].includes(event.key)) { event.preventDefault(); event.stopImmediatePropagation(); stopNoise(false); toast("Šum je zastavený."); }
  }, true);

  // ——— Napojenie: kruh na domove (diely, legenda, stred), riadok v Mame, položka v zásuvke ———
  const SECTION = { care: "rest", movement: "body", health: "sup" };
  function entry(el) {
    if (el.closest(".g2-ring-center")) return center();
    if (el.closest(".g2-ring-card")) return section(SECTION[el.closest("[data-v5-o-section]").dataset.v5OSection] || "rest");
    // Mama, zásuvka Všetko, hľadanie: „Čas pre teba“
    if (byId("v5DrawerOverlay")?.classList.contains("open")) V5.closeDrawer();
    overview();
  }
  document.addEventListener("click", event => {
    const el = event.target.closest("[data-v5-o-section]");
    if (!el || overlay.contains(el)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    entry(el);
  }, true);
  document.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const el = event.target.closest?.("[data-v5-o-section]");
    if (!el || el.tagName === "BUTTON") return;   // tlačidlá dostanú klik samy
    event.preventDefault();
    event.stopImmediatePropagation();
    entry(el);
  }, true);

  // Master 2.1: karta Čas pre teba v Mame – Oddych / Telo / Opora otvorí priamo danú časť.
  document.addEventListener("click", event => {
    const el = event.target.closest("[data-g2-ring-part]");
    if (!el) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    section(el.dataset.g2RingPart);
  }, true);
  window.G2Ring = { back, close, center, section, overview, act: doAct, stopNoise, isOpen: () => overlay.classList.contains("open"), screen: () => nav[nav.length - 1]?.title || "" };
})();

/*
 * GUGUBOO V2 – „Môj hlas pre bábätko“ (Samuel 17. 10. 2026, bod 5 plánu „spomienky“).
 * Nahrávanie uspávanky / rozprávky / pár slov už v tehotenstve. Podľa NHS (týždeň 15) bábätko približne
 * vtedy začína počuť – pozvánka sa preto ukáže od 16. týždňa. Nahrávky idú do tej istej knižnice ako
 * uspávanky (state.lullabies: { id, title, src, author, created }), takže sa po narodení samy objavia pri Spánku.
 * Beta: nahrávka max. 2 min a nízky dátový tok, aby sa zmestila do pamäte prehliadača.
 */
(function initGugubooVoice() {
  "use strict";

  if (typeof state === "undefined" || !window.GugubooV5) return;

  const V5 = window.GugubooV5;
  const esc = V5.escapeHtml;
  const byId = id => document.getElementById(id);
  const MAX_SECONDS = 120;
  const MAX_ITEMS = 6;
  const TITLES = ["Uspávanka od mamy", "Rozprávka na dobrú noc", "Pár slov pre teba", "Pesnička od tatina"];
  const HEARING_SOURCE = "https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/2nd-trimester/week-15/";

  let recorder = null;
  let stream = null;
  let chunks = [];
  let startedAt = 0;
  let timer = 0;
  let draft = null; // { src, seconds }
  let title = TITLES[0];
  let message = "";

  const fmt = seconds => Math.floor(seconds / 60) + ":" + String(Math.floor(seconds % 60)).padStart(2, "0");
  const expecting = () => state.profile?.status === "expecting";

  function render() {
    const target = byId("v5VoiceContent");
    if (!target) return;
    const items = (state.lullabies || []).slice().reverse();
    const recording = recorder && recorder.state === "recording";
    const elapsed = recording ? (Date.now() - startedAt) / 1000 : 0;
    target.innerHTML = [
      "<p class='v2-ann-intro'>",
      expecting()
        ? "Podľa NHS bábätko približne od 15. týždňa začína počuť – keď sa mu prihovoríš, pravdepodobne ťa začuje. Nahraj mu uspávanku, rozprávku alebo len pár slov. Po narodení ju nájdeš pri Spánku."
        : "Nahraj uspávanku alebo rozprávku svojím hlasom. Pustíš ju jedným ťuknutím – aj keď bábätko uspáva niekto iný.",
      "</p>",
      expecting() ? "<a class='v2-source' href='" + HEARING_SOURCE + "' target='_blank' rel='noopener noreferrer'>Zdroj: NHS, 15. týždeň ↗</a>" : "",
      "<section class='v2-voice-card'>",
      "<div class='v2-ann-chips'>", TITLES.map(text => "<button type='button' class='v2-ann-chip" + (title === text ? " is-active" : "") + "' data-v2-voice-title='" + esc(text) + "'>" + esc(text) + "</button>").join(""), "</div>",
      "<label class='v2-voice-name'>Názov<input maxlength='40' value='", esc(title), "' data-v2-voice-name></label>",
      draft ? [
        "<div class='v2-voice-preview'><audio controls src='", draft.src, "'></audio><small>", fmt(draft.seconds), "</small></div>",
        "<div class='v2-ann-share'><button type='button' class='v5-primary' data-v2-voice-save>Uložiť nahrávku</button><button type='button' class='v5-secondary' data-v2-voice-again>Nahrať znova</button></div>"
      ].join("") : [
        "<button type='button' class='v2-voice-record", recording ? " is-recording" : "", "' data-v2-voice-toggle aria-label='", recording ? "Zastaviť nahrávanie" : "Začať nahrávať", "'><span aria-hidden='true'>", recording ? "■" : "●", "</span></button>",
        "<p class='v2-voice-time' id='v2VoiceTime'>", recording ? fmt(elapsed) + " / " + fmt(MAX_SECONDS) : "Ťukni a nahrávaj (najviac " + fmt(MAX_SECONDS) + ")", "</p>"
      ].join(""),
      message ? "<p class='v2-voice-msg'>" + esc(message) + "</p>" : "",
      "</section>",
      items.length ? "<h3 class='v2-book-group'>Naše nahrávky</h3><div class='v2-pressure-list v2-voice-list'>" + items.map(item => "<div><button type='button' class='v2-voice-play' data-v5-play-lullaby='" + esc(item.id) + "' aria-label='Pustiť " + esc(item.title) + "'>▶</button><span><b>" + esc(item.title) + "</b><br>" + esc(new Date(item.created).toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" })) + "</span><button type='button' class='v2-voice-del' data-v2-voice-delete='" + esc(item.id) + "' aria-label='Vymazať nahrávku'>×</button></div>").join("") + "</div>" : "",
      "<p class='v5-book-note'>Nahrávky ostávajú len v tomto zariadení. V beta verzii najviac ", MAX_ITEMS, " nahrávok po ", MAX_SECONDS / 60, " minúty.</p>"
    ].join("");
  }

  async function start() {
    message = "";
    if ((state.lullabies || []).length >= MAX_ITEMS) { message = "V beta verzii sa zmestí " + MAX_ITEMS + " nahrávok. Ak chceš novú, jednu starú vymaž."; return render(); }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { message = "Tento prehliadač nahrávanie nepodporuje."; return render(); }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      try { recorder = new MediaRecorder(stream, { audioBitsPerSecond: 32000 }); } catch (_) { recorder = new MediaRecorder(stream); }
      recorder.addEventListener("dataavailable", event => { if (event.data?.size) chunks.push(event.data); });
      recorder.addEventListener("stop", () => {
        const seconds = Math.min(MAX_SECONDS, (Date.now() - startedAt) / 1000);
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        stream?.getTracks().forEach(track => track.stop());
        clearInterval(timer);
        const reader = new FileReader();
        reader.onload = () => { draft = { src: reader.result, seconds }; recorder = null; render(); };
        reader.readAsDataURL(blob);
      });
      recorder.start();
      startedAt = Date.now();
      timer = setInterval(() => {
        const elapsed = (Date.now() - startedAt) / 1000;
        const label = byId("v2VoiceTime");
        if (label) label.textContent = fmt(elapsed) + " / " + fmt(MAX_SECONDS);
        if (elapsed >= MAX_SECONDS) stop();
      }, 250);
      render();
    } catch (_) {
      message = "Mikrofón sa nepodarilo spustiť. Povoľ prístup k mikrofónu a skús to znova.";
      render();
    }
  }

  function stop() {
    if (recorder && recorder.state !== "inactive") recorder.stop();
  }

  function save() {
    if (!draft) return;
    const name = (byId("v5VoiceContent")?.querySelector("[data-v2-voice-name]")?.value || title).trim() || "Môj hlas";
    state.lullabies ||= [];
    const item = { id: "v2-voice-" + Date.now(), title: name, src: draft.src, author: state.parentRole || "mama", created: new Date().toISOString(), phase: expecting() ? "pre" : "post" };
    state.lullabies.push(item);
    state.selectedLullabyId ||= item.id;
    // Pamäť prehliadača má ~5 MB a uloženie zlyhá potichu – preto veľkosť skontrolujeme vopred.
    if (JSON.stringify(state).length > 4500000) {
      state.lullabies = state.lullabies.filter(entry => entry.id !== item.id);
      message = "Nahrávka sa do pamäte beta verzie nezmestila. Skús kratšiu alebo vymaž staršiu.";
      return render();
    }
    window.GugubooMoments?.mark?.("voice");
    V5.persist();
    draft = null;
    message = "Uložené. " + (expecting() ? "Po narodení ju nájdeš pri Spánku." : "Nájdeš ju aj pri Spánku.");
    render();
  }

  document.addEventListener("click", event => {
    if (event.target.closest("[data-v2-voice-toggle]")) return void (recorder && recorder.state === "recording" ? stop() : start());
    const preset = event.target.closest("[data-v2-voice-title]");
    if (preset) { title = preset.dataset.v2VoiceTitle; return render(); }
    if (event.target.closest("[data-v2-voice-save]")) return save();
    if (event.target.closest("[data-v2-voice-again]")) { draft = null; message = ""; return render(); }
    const del = event.target.closest("[data-v2-voice-delete]");
    if (del) {
      state.lullabies = (state.lullabies || []).filter(item => item.id !== del.dataset.v2VoiceDelete);
      V5.persist();
      render();
    }
  });
  document.addEventListener("input", event => {
    const name = event.target.closest("[data-v2-voice-name]");
    if (name) title = name.value;
  });

  // Pozvánka na domove od 16. týždňa (raz, dá sa zavrieť) – použije ju v2-moments ako citovú kartu.
  function inviteHtml() {
    const week = Number(window.GugubooPregnancyAvatar?.current?.().week || 0);
    if (!expecting() || week < 16 || state.v5?.voiceInviteDismissed || (state.lullabies || []).length) return "";
    return "<section class='v2-ask-card'><button type='button' class='v2-ask-never' data-v2-voice-dismiss aria-label='Skryť'>×</button><small>Pre bábätko</small><div class='v2-ask-title'><span aria-hidden='true'>🎙️</span><strong>Nahraj bábätku svoj hlas</strong></div><p>Približne od 15. týždňa začína počuť. Uspávanka alebo pár slov – po narodení ju pustíš pri spánku.</p><div class='v2-ask-actions v2-ask-actions-2'><button type='button' class='v5-primary' data-v5-feature='voice'>Nahrať</button><button type='button' class='v5-text-action' data-v2-voice-dismiss>Neskôr</button></div></section>";
  }
  document.addEventListener("click", event => {
    if (!event.target.closest("[data-v2-voice-dismiss]")) return;
    state.v5.voiceInviteDismissed = true;
    V5.persist();
    V5.renderHome();
  });

  // Odchod z okna počas nahrávania nahrávanie zastaví (mikrofón sa vypne).
  document.addEventListener("click", event => { if (event.target.closest("[data-v5-window-cancel], [data-v5-window-back]") && recorder?.state === "recording") stop(); }, true);

  window.GugubooVoice = { render, inviteHtml, stop };
  if (document.getElementById("home")?.classList.contains("active")) V5.renderHome();
})();

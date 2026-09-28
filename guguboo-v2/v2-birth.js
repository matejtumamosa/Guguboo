/*
 * GUGUBOO V2 – prechod „Bábätko je na svete“ (brief bod 30: pôrod je transformácia produktu).
 *
 * Jeden krátky formulár (dátum, čas, meno, voliteľne váha a dĺžka). Po uložení sa Guguboo samo
 * prepne z tehotenstva na prvé dni s bábätkom: Domov, Kruh, plán, GuguChat aj spodné menu.
 * História, plán, kontakty, nahrávky a spomienky ostávajú. Hneď sa ponúkne kartička narodenia.
 */
(function initGugubooBirth() {
  "use strict";

  if (typeof state === "undefined" || !window.GugubooV5) return;

  const V5 = window.GugubooV5;
  const esc = V5.escapeHtml;
  const byId = id => document.getElementById(id);
  const todayKey = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  };

  document.body.insertAdjacentHTML("beforeend", [
    "<div id='v2BirthOverlay' class='v2-birth-overlay' aria-hidden='true'>",
    "<section class='v2-birth-sheet' role='dialog' aria-modal='true' aria-labelledby='v2BirthTitle'>",
    "<button class='v5-icon-button v2-birth-close' type='button' data-v2-birth-close aria-label='Zavrieť'>×</button>",
    "<div id='v2BirthBody'></div>",
    "</section></div>"
  ].join(""));

  function formHtml() {
    const name = state.profile.name && state.profile.name !== "bábätko" ? state.profile.name : "";
    return [
      "<header class='v2-birth-head'><span class='v2-birth-heart' aria-hidden='true'>♡</span>",
      "<h2 id='v2BirthTitle'>Bábätko je na svete</h2>",
      "<p>Gratulujeme! Stačí pár údajov – zvyšok Guguboo pripraví samo.</p></header>",
      "<form class='v5-form-card v2-birth-form' id='v2BirthForm'>",
      "<label>Dátum narodenia<input id='v2BirthDate' type='date' required max='", todayKey(), "' value='", todayKey(), "'></label>",
      "<label>Čas narodenia — nepovinné<input id='v2BirthTime' type='time' value='", esc(state.profile.birthTime || ""), "'></label>",
      "<label>Meno bábätka<input id='v2BirthName' autocomplete='off' value='", esc(name), "' placeholder='napr. Oliver'></label>",
      "<div class='v2-birth-row'>",
      "<label>Váha — nepovinné<input id='v2BirthWeight' inputmode='numeric' placeholder='napr. 3030' aria-describedby='v2BirthWeightUnit'><small id='v2BirthWeightUnit'>gramov</small></label>",
      "<label>Dĺžka — nepovinné<input id='v2BirthHeight' inputmode='numeric' placeholder='napr. 50' aria-describedby='v2BirthHeightUnit'><small id='v2BirthHeightUnit'>cm</small></label>",
      "</div>",
      "<p class='v2-birth-error' id='v2BirthError' role='alert' hidden></p>",
      "<button class='v5-primary' type='submit'>Uložiť a pokračovať</button>",
      "</form>",
      "<p class='v2-birth-note'>Nič sa nestratí – plán, kontakty, nahrávky aj spomienky ostávajú.</p>"
    ].join("");
  }

  function welcomeHtml() {
    const name = state.profile.name || "bábätko";
    return [
      "<header class='v2-birth-head v2-birth-welcome'><span class='v2-birth-heart' aria-hidden='true'>❤️</span>",
      "<h2 id='v2BirthTitle'>Vitaj na svete, ", esc(name), "</h2>",
      "<p>Guguboo sa prepína na prvé dni s bábätkom. Domov ti teraz ukáže len to, čo je dôležité v najbližších dňoch – a Kruh sa postará aj o teba.</p></header>",
      "<div class='v2-birth-actions'>",
      "<button class='v5-primary' type='button' data-v2-birth-card>Vytvoriť kartičku narodenia</button>",
      "<button class='v5-secondary' type='button' data-v2-birth-home>Pokračovať domov</button>",
      "</div>"
    ].join("");
  }

  function open() {
    const overlay = byId("v2BirthOverlay");
    byId("v2BirthBody").innerHTML = formHtml();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    byId("v5BottomBar")?.classList.add("v5-hidden-for-modal");
    document.body.style.overflow = "hidden";
    window.GugubooV2?.track?.("birth_open");
    setTimeout(() => byId("v2BirthDate")?.focus(), 30);
  }

  function close() {
    const overlay = byId("v2BirthOverlay");
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    byId("v5BottomBar")?.classList.remove("v5-hidden-for-modal");
    document.body.style.overflow = "";
  }

  function digits(value) {
    const clean = String(value || "").replace(/[^\d]/g, "");
    return clean ? Number(clean) : null;
  }

  function saveBirth(event) {
    event.preventDefault();
    const date = byId("v2BirthDate").value;
    const error = byId("v2BirthError");
    const fail = text => { error.textContent = text; error.hidden = false; };
    if (!date) return fail("Vyber dátum narodenia.");
    if (date > todayKey()) return fail("Dátum narodenia nemôže byť v budúcnosti.");
    const weight = digits(byId("v2BirthWeight").value);
    const height = digits(byId("v2BirthHeight").value);
    if (weight !== null && (weight < 300 || weight > 7000)) return fail("Váhu zadaj v gramoch, napr. 3030.");
    if (height !== null && (height < 20 || height > 70)) return fail("Dĺžku zadaj v centimetroch, napr. 50.");

    const name = byId("v2BirthName").value.trim();
    state.profile.status = "born";
    state.profile.birth = date;
    state.profile.birthTime = byId("v2BirthTime").value || "";
    if (name) state.profile.name = name;
    // Pôrodné miery sa ukladajú ako pôrodné – aktuálne merania (rast) sa neprepisujú.
    if (weight !== null) state.profile.weight = weight + " g";
    if (height !== null) state.profile.height = height + " cm";
    state.welcomeStatus = "born";
    state.v2 ||= {};
    state.v2.birthRecordedAt = new Date().toISOString();
    window.GugubooV2?.track?.("birth_recorded");
    V5.persist();
    // Legacy vrstva (kartička narodenia, profil) sa prekreslí z rovnakého stavu.
    if (typeof window.save === "function") window.save();
    V5.renderBottomBar();
    V5.renderDrawer();
    V5.renderHome();
    byId("v2BirthBody").innerHTML = welcomeHtml();
  }

  document.addEventListener("submit", event => {
    if (event.target.id === "v2BirthForm") saveBirth(event);
  });

  document.addEventListener("click", event => {
    if (event.target.closest("[data-v2-birth-open]")) return open();
    if (event.target.closest("[data-v2-birth-close]")) return close();
    if (event.target.closest("[data-v2-birth-home]")) { close(); return V5.openHome(); }
    if (event.target.closest("[data-v2-birth-card]")) { close(); return V5.openFeature("cards"); }
    if (event.target.id === "v2BirthOverlay") close();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && byId("v2BirthOverlay")?.classList.contains("open")) close();
  });

  window.GugubooBirth = { open, close };
})();

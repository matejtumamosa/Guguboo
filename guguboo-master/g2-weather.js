/*
 * GUGUBOO MASTER 2.4 – Počasie a oblečenie (Samo 15. 11. 2026).
 * Počasie automaticky zo služby Open-Meteo (mesto alebo približná poloha ~1 km, poloha sa neukladá) –
 * posúdenie docs/master/POCASIE_SUKROMIE.md. Rady LEN z overených zdrojov – docs/master/POCASIE_OBSAH.md
 * (riadky [OVERIŤ] sa nezobrazujú). Hranice chladno/teplo (pocitová teplota pod 10 °C / nad 24 °C) sú
 * produktové rozhodnutie Sama, nie odporúčanie zdroja – v appke to tak aj píšeme.
 */
(function initG2Weather() {
  "use strict";
  const V5 = window.GugubooV5;
  if (!V5 || !V5.MASTER || typeof state === "undefined") return;
  const esc = V5.escapeHtml, icon = V5.icon;
  const byId = id => document.getElementById(id);
  const COLD = 10, WARM = 24; // produktové hranice (Samo 15. 11.), nie rada zo zdroja

  const SRC = {
    N1: ["NHS (Spojené kráľovstvo)", "https://www.nhs.uk/start-for-life/baby/baby-basics/caring-for-your-baby/how-to-dress-a-newborn"],
    N2: ["NHS (Spojené kráľovstvo)", "https://www.nhs.uk/conditions/baby/first-aid-and-safety/safety/safety-in-the-sun/"],
    L1: ["The Lullaby Trust (Spojené kráľovstvo)", "https://lullabytrust.org.uk/safer-sleep-advice/baby-summer-safety"],
    A1: ["AAP (USA)", "https://www.healthychildren.org/English/safety-prevention/on-the-go/Pages/Winter-Car-Seat-Safety-Tips.aspx"],
    A2: ["AAP (USA)", "https://www.healthychildren.org/English/safety-prevention/at-play/Pages/Sun-Safety.aspx"],
    A3: ["AAP (USA)", "https://www.healthychildren.org/English/safety-prevention/at-play/Pages/Winter-Safety.aspx"],
    W1: ["WHO", "https://www.who.int/news-room/q-a-detail/radiation-protecting-against-skin-cancer"]
    // Master 4.0 (Audit Z25): S1, S2 (ÚVZ SR cez TASR – spravodajský článok, nie primárny zdroj) odstránené.
  };
  const CHECKED = "15. 11. 2026";
  // Master 4.0 (Audit Z14 – pravidlo Sama 26. 11.: sprievodca, nie lekár): okno ukazuje počasie a len pár informatívnych
  // viet so zdrojom („NHS uvádza…“). Rady (čo obliecť, uber vrstvu, popruhy…), norma izby 16–20 °C a zoznam „Čo zobrať“
  // sa nezobrazujú. Pôvodné pravidlá ostávajú nižšie v OLD_RULES na prípadný návrat (s odborným potvrdením ⚕).
  const RULES = [
    { id: "V3", age: "bm", when: "cold", text: "Studené rúčky a nôžky sú u bábätka bežné a samy o sebe neznamenajú, že mu je zima.", src: ["N1"] },
    { id: "T3", age: "b", when: "sun", mode: "stroller carrier", text: "NHS uvádza, že bábätká do 6 mesiacov majú byť mimo priameho slnka.", src: ["N2"] },
    { id: "T4", age: "m", when: "sun", mode: "stroller carrier", text: "WHO uvádza, že bábätká do 12 mesiacov majú byť v tieni a že tieň neochráni úplne.", src: ["W1"] },
    { id: "T13", age: "bmk", when: "warm", mode: "car", text: "NHS uvádza, že bábätko ani dieťa sa nemá nechávať v zaparkovanom aute.", src: ["N2"] },
    { id: "AU6", age: "bm", when: "always", mode: "car", text: "The Lullaby Trust uvádza, že autosedačka je na cestu, nie na spánok.", src: ["L1"] }
  ];
  // eslint-disable-next-line no-unused-vars
  const OLD_RULES = [
    { id: "V1", age: "bm", when: "always", text: "Obleč bábätko približne o jednu vrstvu viac, než máš na sebe ty.", src: ["N1", "A1"] },
    { id: "V2", age: "bmk", when: "always", text: "Či nie je bábätku príliš teplo, zistíš dotykom hrudníka alebo zátylku.", src: ["L1"] },
    { id: "V3", age: "bm", when: "cold", text: "Studené rúčky a nôžky sú bežné, samy o sebe neznamenajú, že je bábätku zima.", src: ["N1"] },
    { id: "V4", age: "bm", when: "warm", text: "Ak je bábätko spotené alebo má teplé bruško, uber mu vrstvu.", src: ["N1"] },
    { id: "V5", age: "bmk", when: "cold", mode: "stroller carrier", text: "Keď vojdete dnu alebo do vyhriateho auta či autobusu, čiapku a vrstvu navyše hneď zlož.", src: ["N1"] },
    { id: "C1", age: "bm", when: "cold", text: "Ak je tebe chladno, bábätku pravdepodobne tiež.", src: ["N1"] },
    { id: "C2", age: "k", when: "cold", text: "Viac tenkých vrstiev zahreje a udrží v suchu lepšie než jedna hrubá.", src: ["A3"] },
    { id: "C3", age: "k", when: "cold", text: "Čiapka, rukavice a teplá obuv sa v zime hodia.", src: ["A3"] },
    { id: "D1", age: "bmk", when: "rain", text: "Mokré oblečenie a rukavice čím skôr vymeň za suché.", src: ["A3", "A1"] },
    { id: "T1", age: "bm", when: "warm", text: "Keď je teplo, väčšinou stačí jedna vrstva – najlepšie ľahká bavlna.", src: ["N1"] },
    { id: "T2", age: "bm", when: "warm", mode: "home", text: "V horúčave stačí aj body s krátkym rukávom alebo len plienka.", src: ["L1", "N1"] },
    { id: "T3", age: "b", when: "sun", mode: "stroller carrier", text: "Bábätko do 6 mesiacov drž mimo priameho slnka.", src: ["N2", "A2", "S1"] },
    { id: "T4", age: "m", when: "sun", mode: "stroller carrier", text: "Bábätko do 12 mesiacov drž v tieni – tieň však neochráni úplne.", src: ["W1", "S1"] },
    { id: "T5", age: "bmk", when: "uv", mode: "stroller carrier", text: "Dnes sa oplatí chrániť pred slnkom: tieň, oblečenie a klobúčik.", src: ["W1"] },
    { id: "T7", age: "bmk", when: "sun", mode: "stroller carrier", text: "Voľné ľahké oblečenie, ktoré zakryje telo, chráni pred slnkom najlepšie.", src: ["N2", "A2", "W1"] },
    { id: "T8", age: "bmk", when: "sun", mode: "stroller carrier", text: "Keď je slnko najsilnejšie, radšej tieň alebo dnu (NHS: 11–15 h, ÚVZ SR: 10–16 h).", src: ["N2", "S1"] },
    { id: "T11", age: "bm", when: "warm", mode: "stroller", text: "Kočík neprekrývaj plienkou, dekou ani látkou, ktorá bráni prúdeniu vzduchu – lepší je slnečník alebo priedušná clona.", src: ["N1", "N2", "L1", "S1"] },
    { id: "T12", age: "bm", when: "sun", mode: "stroller", text: "Nenechávaj bábätko spať na slnku.", src: ["W1"] },
    { id: "T13", age: "bmk", when: "warm", mode: "car", text: "Bábätko ani dieťa nenechávaj v zaparkovanom aute.", src: ["N2"] },
    { id: "T14", age: "bm", when: "always", mode: "car", text: "Na dlhšej ceste si urob prestávky, aby si mohla bábätko skontrolovať.", src: ["L1"] },
    { id: "T15", age: "bmk", when: "warm", mode: "home", text: "Ventilátor nemier priamo na dieťa.", src: ["N2"] },
    { id: "T16", age: "bm", when: "always", mode: "home", text: "Na spánok je príjemná izba so 16–20 °C.", src: ["N1", "L1"] },
    { id: "T18", age: "k", when: "warm", text: "Na smäd je pre deti najlepšia čistá pitná voda.", src: ["S2"] },
    { id: "AU1", age: "bmk", when: "always", mode: "car", text: "Do autosedačky bez hrubej bundy či kombinézy – pod popruhmi len tenké vrstvy.", src: ["A1"] },
    { id: "AU2", age: "bmk", when: "cold", mode: "car", text: "Bundu alebo deku daj až cez zapnuté popruhy, aby sa dala zložiť, keď sa auto vyhreje.", src: ["A1"] },
    { id: "AU3", age: "bmk", when: "always", mode: "car", text: "Popruhy utiahni tak, aby sa na nich pri hrudníku nedal štipnúť záhyb.", src: ["A1"] },
    { id: "AU4", age: "bm", when: "cold", mode: "car", text: "Vajíčko (autosedačku pre bábätko) maj medzi jazdami v teple doma.", src: ["A1"] },
    { id: "AU6", age: "bm", when: "always", mode: "car", text: "Autosedačka je na cestu – na spánok bábätko po príchode prelož na pevnú rovnú podložku.", src: ["L1"] },
    { id: "NO2", age: "bm", when: "warm", mode: "carrier", text: "Hrudník alebo zátylok bábätka v nosiči kontroluj častejšie.", src: ["L1"] }
  ];
  // „Čo zobrať“ (bez položiek [OVERIŤ] – krém SPF, voda pre bábätká)
  function packList(age, mode, cond) {
    if (mode === "home") return [];
    if (mode === "car") return cond.cold ? ["deka alebo bunda na prehodenie cez popruhy", "čiapka", "palčiaky", "ponožky"] : [];
    const out = [];
    if (cond.warm || cond.sun) out.push(...(age === "k" ? ["klobúk so širokou strieškou", "slnečné okuliare", "fľaša s pitnou vodou", "voľné ľahké oblečenie"] : ["klobúčik so širokou strieškou", "ľahké oblečenie, ktoré zakryje telo"].concat(mode === "stroller" ? ["slnečník alebo priedušná clona na kočík"] : [])));
    if (cond.cold) out.push(...(age === "k" ? ["viac tenkých vrstiev", "čiapka", "rukavice", "teplá obuv", "náhradné rukavice"] : ["tenká vrstva navyše", "čiapka", "palčiaky", "ponožky alebo capačky"]));
    if (cond.rain) out.push("suché náhradné oblečenie");
    return Array.from(new Set(out)).slice(0, 5);
  }

  function ageKey() {
    if (state.profile?.status === "expecting" || !state.profile?.birth) return "b";
    const days = Math.floor((Date.now() - new Date(state.profile.birth + "T12:00:00").getTime()) / 864e5);
    return days < 183 ? "b" : days < 365 ? "m" : "k";
  }

  // ——— Okno ———
  function overlay() {
    let el = byId("g2WeatherOverlay");
    if (el) return el;
    el = document.createElement("div");
    el.id = "g2WeatherOverlay";
    el.className = "g2-ring-overlay";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = "<div class='g2-ring-sheet' role='dialog' aria-modal='true' aria-labelledby='g2wTitle'><div class='g2-ring-sheet-head'><span></span><h2 id='g2wTitle' tabindex='-1'>Počasie a oblečenie</h2><button class='v5-icon-button' type='button' data-g2w='close' aria-label='Zavrieť'>" + window.GugubooV5.glyph("close") + "</button></div><div class='g2w-body'></div></div>";
    el.addEventListener("click", event => { if (event.target === el) close(); });
    document.body.appendChild(el);
    return el;
  }
  let wx = null;      // posledné počasie (len v pamäti)
  let busy = false, error = "";
  function open() {
    const el = overlay();
    el.classList.add("open");
    el.setAttribute("aria-hidden", "false");
    render();
    setTimeout(() => el.querySelector(".g2w-body button, .g2w-body input")?.focus({ preventScroll: true }), 60);
  }
  function close() {
    const el = byId("g2WeatherOverlay");
    if (!el) return;
    el.classList.remove("open");
    el.setAttribute("aria-hidden", "true");
  }
  const mode = () => state.v5.weatherMode || "stroller";
  const MODES = [["stroller", "Kočík"], ["carrier", "Nosič"], ["car", "Auto"], ["home", "Doma"]];

  function render() {
    const body = overlay().querySelector(".g2w-body");
    const city = state.v5.weatherCity || "";
    const locate = "<form class='g2w-city' data-g2w-form><label for='g2wCity'>Mesto</label><div><input id='g2wCity' type='text' autocomplete='address-level2' placeholder='napr. Žilina' value='" + esc(city) + "'><button class='g2r-pill' type='submit'>Zistiť</button></div></form>" +
      "<button class='g2r-link' type='button' data-g2w='geo'>Použiť moju polohu (približne)</button>";
    const info = state.v5.weatherInfoSeen ? "" : "<p class='g2r-small'>Počasie zistíme zo služby Open-Meteo (Švajčiarsko). Pošleme jej len mesto, ktoré zadáš – alebo približnú polohu (asi na 1 km), ak ju povolíš. Nič o tebe ani o bábätku neposielame a polohu si neukladáme.</p>";
    if (!wx) {
      body.innerHTML = "<p class='g2r-lead'>Zisti počasie tam, kde ste.</p>" /* Master 4.0 (Audit Z14): bez sľubu rád */ + locate + info +
        (busy ? "<p class='g2r-small' role='status'>Zisťujem počasie…</p>" : "") + (error ? "<p class='g2r-small' role='status'>" + esc(error) + "</p>" : "");
      return;
    }
    const age = ageKey(), m = mode();
    const cond = { cold: wx.feels < COLD, warm: wx.feels > WARM, rain: wx.rain, uv: wx.uv >= 3 && wx.day, sun: wx.day && (wx.uv >= 3 || wx.feels > WARM) };
    const rules = RULES.filter(r => r.age.includes(age) && (!r.mode || r.mode.split(" ").includes(m)) && (r.when === "always" || cond[r.when]));
    const pack = []; // Master 4.0 (Audit Z14): „Čo zobrať“ sa nezobrazuje (rada); packList() ostáva na prípadný návrat
    void packList;
    const srcLine = ids => Array.from(new Set(ids.map(id => SRC[id][0]))).join(", ");
    body.innerHTML = [
      "<div class='g2w-now'><strong>" + Math.round(wx.temp) + " °C</strong><span>pocitovo " + Math.round(wx.feels) + " °C · " + esc(wx.place) + "<br>" + esc([wx.rain ? "zrážky" : "bez zrážok", "vietor " + Math.round(wx.wind) + " km/h", wx.day ? "UV " + Math.round(wx.uv) : "noc"].join(" · ")) + "</span></div>",
      "<div class='g2r-chips g2r-rq g2w-modes' role='group' aria-label='Ako idete'>" + MODES.map(([k, t]) => "<button class='g2r-pill' type='button' data-g2w='mode' data-mode='" + k + "' aria-pressed='" + String(k === m) + "'>" + t + "</button>").join("") + "</div>",
      rules.length ? "<section class='g2r-info'><h3>Dobré vedieť</h3><ul class='g2w-rules'>" + rules.map(r => "<li>" + esc(r.text) + "<small>Podľa: " + esc(srcLine(r.src)) + "</small></li>").join("") + "</ul></section>" : "",
      pack.length ? "<section class='g2r-info'><h3>Čo zobrať</h3><ul class='g2w-pack'>" + pack.map((p, i) => "<li><label><input type='checkbox' data-g2w-pack='" + i + "'> " + esc(p) + "</label></li>").join("") + "</ul></section>" : "",
      rules.length ? "<p class='g2r-small'>Informácie sú z verejných zdrojov (" + esc(Array.from(new Set(rules.flatMap(r => r.src).map(id => SRC[id][0]))).join(", ")) + "), overené " + CHECKED + ". Nie sú od lekára. " + esc(window.G2Safety?.line.ped || "") + " " +
        "Kedy appka ukáže informácie na chladno (pocitovo pod " + COLD + " °C) a na teplo (nad " + WARM + " °C), je len orientačné nastavenie appky, nie odporúčanie zo zdroja.</p>" : "",
      !rules.length ? "" : "<details class='g2w-src'><summary>Zdroje</summary><ul>" + Array.from(new Set(rules.flatMap(r => r.src))).map(id => "<li><a href='" + esc(SRC[id][1]) + "' target='_blank' rel='noopener noreferrer'>" + esc(SRC[id][0]) + " ↗</a></li>").join("") + "</ul></details>",
      "<p class='g2r-small'>Údaje o počasí: <a href='https://open-meteo.com/' target='_blank' rel='noopener noreferrer'>Open-Meteo.com</a></p>",
      "<button class='g2r-link' type='button' data-g2w='reset'>Iné mesto alebo poloha</button>"
    ].join("");
  }

  // ——— Open-Meteo ———
  const fetchJson = url => fetch(url, { referrerPolicy: "no-referrer", credentials: "omit" }).then(r => { if (!r.ok) throw new Error("http"); return r.json(); });
  async function load(lat, lon, place) {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon +
      "&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,is_day&hourly=uv_index&forecast_days=1&timezone=auto";
    const data = await fetchJson(url);
    const c = data.current || {};
    const hour = String(c.time || "").slice(0, 13);
    const idx = (data.hourly?.time || []).findIndex(t => String(t).slice(0, 13) === hour);
    const code = Number(c.weather_code) || 0;
    wx = {
      temp: Number(c.temperature_2m), feels: Number(c.apparent_temperature), wind: Number(c.wind_speed_10m) || 0,
      rain: Number(c.precipitation) > 0 || (code >= 51 && code <= 99), day: Number(c.is_day) === 1,
      uv: idx >= 0 ? Number(data.hourly.uv_index[idx]) || 0 : 0, place
    };
    if (!Number.isFinite(wx.feels)) throw new Error("data");
  }
  async function byCity(name) {
    busy = true; error = ""; render();
    try {
      const geo = await fetchJson("https://geocoding-api.open-meteo.com/v1/search?count=1&language=sk&name=" + encodeURIComponent(name));
      const hit = geo.results?.[0];
      if (!hit) throw new Error("city");
      state.v5.weatherCity = hit.name;
      state.v5.weatherInfoSeen = true;
      V5.persist();
      await load(hit.latitude.toFixed(2), hit.longitude.toFixed(2), hit.name);
    } catch (e) {
      error = e.message === "city" ? "Toto mesto sa nenašlo. Skús iný názov." : "Počasie sa teraz nepodarilo zistiť. Skús to o chvíľu.";
    }
    busy = false; render();
  }
  function byGeo() {
    if (!navigator.geolocation) { error = "Tento prehliadač polohu nepodporuje. Napíš mesto."; return render(); }
    busy = true; error = ""; render();
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        state.v5.weatherInfoSeen = true; V5.persist();
        // zaokrúhlené na ~1 km, nikam sa neukladá
        await load(pos.coords.latitude.toFixed(2), pos.coords.longitude.toFixed(2), "tvoja poloha");
      } catch (e) { error = "Počasie sa teraz nepodarilo zistiť. Skús to o chvíľu."; }
      busy = false; render();
    }, () => { busy = false; error = "Polohu sa nepodarilo zistiť. Napíš radšej mesto."; render(); }, { maximumAge: 6e5, timeout: 10000, enableHighAccuracy: false });
  }

  document.addEventListener("submit", event => {
    if (!event.target.matches("[data-g2w-form]")) return;
    event.preventDefault();
    const name = byId("g2wCity")?.value.trim();
    if (name) byCity(name);
  });
  document.addEventListener("click", event => {
    const el = event.target.closest("[data-g2w]");
    if (!el) return;
    event.preventDefault();
    const a = el.dataset.g2w;
    if (a === "close") return close();
    if (a === "geo") return byGeo();
    if (a === "mode") { state.v5.weatherMode = el.dataset.mode; V5.persist(); return render(); }
    if (a === "reset") { wx = null; return render(); }
  });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && byId("g2WeatherOverlay")?.classList.contains("open")) close(); });

  window.G2Weather = { open, close };
})();

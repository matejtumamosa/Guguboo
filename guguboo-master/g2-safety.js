/*
 * GUGUBOO MASTER 2.7 – „Informujeme, neradíme“ (Samo 15. 11. 2026): jednotné vety na JEDNOM mieste.
 *
 * - Štandardné vety „kedy sa ozvať“ (UX Writer, docs/master/INFORMUJEME_TEXTY.md).
 * - Výnimky E1–E7 pre vážne situácie (Content & Safety, docs/master/INFORMUJEME_AUDIT.md, časť 1).
 *   155 / 112 sa v appke píšu LEN tu, aby sa nikde nelíšili (Master 4.0, Audit Z21: aj GuguChat, Zúbky a kruh len odkazujú).
 * ⚕ Položky E1–E5 pred testom s ľuďmi potvrdí pôrodná asistentka / pediater (audit, časť 5).
 * Žiadne postupy, lieky ani dávky – len to, čo uvádza zdroj, a jedna pokojná veta.
 */
(function initG2Safety() {
  "use strict";
  const NHS = "NHS (Spojené kráľovstvo)";
  const CHECKED = "15. 11. 2026";
  const line = {
    ped: "Ak ťa niečo znepokojuje alebo si nie si istá, môžeš sa kedykoľvek ozvať pediatrovi.",
    gyn: "Ak ťa niečo znepokojuje alebo si nie si istá, môžeš sa kedykoľvek ozvať svojmu gynekológovi.",
    mid: "Ak ťa niečo znepokojuje alebo si nie si istá, môžeš sa kedykoľvek ozvať pôrodnej asistentke alebo do svojej pôrodnice.",
    post: "Ak ťa niečo znepokojuje alebo si nie si istá, môžeš sa kedykoľvek ozvať pôrodnej asistentke alebo lekárovi."
  };
  const E = {
    E1: {
      text: "Ak máš bolesť, opuch alebo začervenanie lýtka, bolesť na hrudi či sa ti ťažko dýcha, náhle veľmi silné krvácanie s pocitom na odpadnutie, horúčku s bolestivým bruchom alebo bolesť hlavy so zmenou videnia, ozvi sa hneď pôrodnej asistentke alebo lekárovi. Ak ti je naozaj zle, volaj 155.",
      source: "https://www.nhs.uk/pregnancy/labour-and-birth/your-body/", sourceName: NHS, reviewed: "25. 4. 2024"
    },
    E2: {
      text: "Ak sa ti náhle zväčší opuch tváre, rúk alebo nôh, máš veľmi silnú bolesť hlavy, rozmazané videnie či záblesky, silnú bolesť pod rebrami alebo ti je veľmi zle, zavolaj hneď gynekológovi alebo do pôrodnice.",
      source: "https://www.nhs.uk/pregnancy/common-symptoms/swollen-ankles-feet-and-fingers/", sourceName: NHS, reviewed: "19. 4. 2024"
    },
    E3: {
      text: "Ak sa bábätko hýbe menej ako zvyčajne alebo sa zmení jeho obvyklý vzorec pohybov, zavolaj hneď pôrodnú asistentku alebo pôrodnicu – aj v noci.",
      source: "https://www.nhs.uk/pregnancy/keeping-well/your-babys-movements/", sourceName: NHS, reviewed: "8. 7. 2024"
    },
    E4: {
      text: "Pri bábätku mladšom ako 3 mesiace s teplotou 38 °C a viac sa podľa NHS treba ozvať lekárovi hneď – pediatrovi, alebo mimo ordinačných hodín na pohotovosť, aj v noci.",
      source: "https://www.nhs.uk/conditions/fever-in-children/", sourceName: NHS, reviewed: "3. 1. 2024"
    },
    E5: {
      text: "Ak bábätko ťažko dýcha, modrie, nereaguje alebo má kŕč, zavolaj 155.",
      source: "https://www.nhs.uk/conditions/fever-in-children/", sourceName: NHS, reviewed: "3. 1. 2024"
    },
    // Vyrážka (audit #4) – rovnaká hranica ako E5, so znením zo stránky o vyrážkach.
    E5rash: {
      text: "Ak má bábätko spolu s vyrážkou ťažkosti s dýchaním, modrú či sivú pokožku alebo náhly opuch tváre, zavolaj 155.",
      source: "https://www.nhs.uk/conditions/rashes-babies-and-children/", sourceName: NHS, reviewed: "3. 10. 2024"
    },
    // E6 (kríza) a E7 (plodová voda, krvácanie, kontrakcie) – od Master 4.0 ich guguchat.js preberá odtiaľto (pôvodne mal vlastné znenie).
    // Master 4.0 (Audit Z19): E6 a E7 so zdrojom a dátumom overenia (27. 11. 2026). guguchat.js ich už len preberá (Z21).
    // E6: číslo Linky dôvery Nezábudka overené na justice.gov.sk (Dôležité kontakty) a u Ligy za duševné zdravie.
    E6: { text: "Ak ti alebo bábätku hrozí nebezpečenstvo, volaj 112. Linka dôvery Nezábudka je nonstop a bezplatne: 0800 800 566.", source: "https://www.justice.gov.sk/sluzby/pomoc-obetiam/dolezite-kontakty/", sourceName: "Ministerstvo spravodlivosti SR", reviewed: "", checked: "27. 11. 2026" },
    // E7: NHS „Signs that labour has begun“ (stránka z 9. 11. 2023, revízia NHS bola 9. 11. 2026 – overiť znovu): „Call urgently if: your
    // waters break · you have vaginal bleeding · your baby is moving less than usual…“ ⚕
    E7: { text: "Zavolaj do svojej pôrodnice alebo svojmu lekárovi, poradia ti, čo ďalej. Ak sa cítiš naozaj zle, zavolaj 155.", source: "https://www.nhs.uk/pregnancy/labour-and-birth/signs-of-labour/signs-that-labour-has-begun/", sourceName: NHS, reviewed: "9. 11. 2023", checked: "27. 11. 2026" }
  };
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Pokojný box výnimky (bez červenej). withSource = odkaz na zdroj pod vetou.
  function html(id, withSource = true) {
    const item = E[id];
    if (!item) return "";
    return "<div class='v2-calm-box g2-safety'><p>" + esc(item.text) + "</p>" + (withSource && item.source ? "<a class='v2-source' href='" + esc(item.source) + "' target='_blank' rel='noopener noreferrer'>Zdroj: " + esc(item.sourceName) + " · overené " + esc(item.checked || CHECKED) + " ↗</a>" : "") + "</div>";
  }
  // Tlačidlo „Zapísať ako otázku…“ – obsluhuje v5-mobile.js (data-g2-askq: baby = pediater, me = lekár).
  function askButton(who, prefill, label) {
    const text = label || (who === "baby" ? "Zapísať ako otázku pre pediatra" : "Zapísať ako otázku pre lekára");
    return "<button type='button' class='v5-secondary g2-askq' data-g2-askq='" + (who === "baby" ? "baby" : "me") + "' data-g2-askq-text='" + esc(prefill || "") + "'>" + esc(text) + "</button>";
  }
  // Master 4.0 (Audit Z8): bezpečný spánok na JEDNOM mieste – jedna informatívna veta + odkaz. Stránka NHS „Sudden infant death
  // syndrome (SIDS)“ z 25. 11. 2025, overené 27. 11. 2026: „always place your baby on their back to sleep in the feet-to-foot
  // position“. Okno Sprcha, Tvoj mesiac, GuguChat a Aktivity ju len preberajú. ⚕ Pred testom potvrdí pediater.
  const safeSleep = { title: "Bezpečný spánok", text: "Podľa NHS sa bábätko ukladá spať na chrbát, nožičkami k spodnému okraju postieľky.", url: "https://www.nhs.uk/baby/caring-for-a-newborn/reduce-the-risk-of-sudden-infant-death-syndrome/", sourceName: NHS, reviewed: "25. 11. 2025", checked: "27. 11. 2026" };
  function sleepLink() {
    return "<span class='g2-safe-sleep-text'>" + esc(safeSleep.text) + "</span> <a class='v2-source g2-safe-sleep' href='" + esc(safeSleep.url) + "' target='_blank' rel='noopener noreferrer'>" + esc(safeSleep.title) + " – " + esc(safeSleep.sourceName) + " · overené " + esc(safeSleep.checked) + " ↗</a>";
  }
  window.G2Safety = {
    line, E, html, askButton, CHECKED, safeSleep, sleepLink,
    note: "Guguboo informuje, neradí – pri otázkach o zdraví ti najlepšie pomôže tvoj lekár.",
    sourceLine: (checked) => "Podľa " + NHS + " · overené " + (checked || CHECKED)
  };
})();

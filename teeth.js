(function initGugubooTeeth() {
  "use strict";

  const root = document.getElementById("teethApp");
  const view = document.getElementById("teeth");
  if (!root || !view || typeof state === "undefined") return;

  const REVIEWED_AT = "2026-09-09";
  const SOURCES = [
    ["NHS: prerezávanie zubov", "https://www.nhs.uk/conditions/baby/babys-development/teething/baby-teething-symptoms/"],
    ["EAPD: fluoridová prevencia", "https://www.eapd.eu/uploads/pdf_13092025-111659.pdf"],
    ["ADA: detská zubná starostlivosť", "https://www.ada.org/resources/ada-library/oral-health-topics/toothbrushes"],
    ["AAPD: prvá návšteva do 1 roka", "https://www.aapd.org/globalassets/media/policy-center/year1visit.pdf"]
  ];
  const TOOTH_DEFINITIONS = [
    ["55","Horná pravá druhá stolička"],["54","Horná pravá prvá stolička"],["53","Horný pravý očný zub"],["52","Horný pravý bočný rezák"],["51","Horný pravý predný rezák"],
    ["61","Horný ľavý predný rezák"],["62","Horný ľavý bočný rezák"],["63","Horný ľavý očný zub"],["64","Horná ľavá prvá stolička"],["65","Horná ľavá druhá stolička"],
    ["85","Dolná pravá druhá stolička"],["84","Dolná pravá prvá stolička"],["83","Dolný pravý očný zub"],["82","Dolný pravý bočný rezák"],["81","Dolný pravý predný rezák"],
    ["71","Dolný ľavý predný rezák"],["72","Dolný ľavý bočný rezák"],["73","Dolný ľavý očný zub"],["74","Dolná ľavá prvá stolička"],["75","Dolná ľavá druhá stolička"]
  ].map(([id,name],index) => ({ id, name, jaw:index < 10 ? "upper" : "lower" }));
  const STATUS_LABELS = { none:"Ešte nie", erupting:"Pravdepodobne sa prerezáva", erupted:"Prerezaný" };

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#039;" })[character]);
  const today = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,10);
  const tomorrowMorning = () => { const date = new Date(Date.now() + 86400000); date.setHours(8,0,0,0); return new Date(date.getTime() - date.getTimezoneOffset()*60000).toISOString().slice(0,16); };
  const isPostpartum = () => state.profile?.status === "born";
  const ageDays = () => state.profile?.birth ? Math.max(0, Math.floor((Date.now() - new Date(`${state.profile.birth}T12:00:00`).getTime()) / 86400000)) : null;
  const persist = () => appStorage.setItem(storeKey, JSON.stringify(state));
  const announce = text => { if (typeof showToast === "function") showToast(text); const live=root.querySelector("[data-teeth-live]"); if(live) live.textContent=text; };

  function migrateTeethState(value) {
    const current = value && typeof value === "object" ? value : {};
    const records = {};
    for (const tooth of TOOTH_DEFINITIONS) {
      const record = current.records?.[tooth.id];
      if (record && ["erupting","erupted"].includes(record.status)) records[tooth.id] = {
        status:record.status, teethingStart:record.teethingStart || "", appeared:record.appeared || "", note:String(record.note || "").slice(0,500)
      };
    }
    return { version:1, records, firstToothDate:current.firstToothDate || "", teethingLikely:!!current.teethingLikely, dentistPlanned:!!current.dentistPlanned };
  }
  state.teeth = migrateTeethState(state.teeth);
  let selectedId = "";

  function syncFirstToothDate() {
    const dates = Object.values(state.teeth.records).filter(record => record.status === "erupted" && record.appeared).map(record => record.appeared).sort();
    state.teeth.firstToothDate = dates[0] || (Object.values(state.teeth.records).some(record => record.status === "erupted") ? state.teeth.firstToothDate : "");
  }

  function localizedDentistNote() {
    const country = state.profile?.country || "SK";
    if (country === "SK") return "Pre Slovensko si konkrétny postup a dostupnosť over u zvoleného zubára alebo zdravotnej poisťovne.";
    if (country === "CZ") return "Pre Česko si konkrétny postup a dostupnosť over u zvoleného zubára alebo zdravotnej poisťovne.";
    return "Miestny postup a dostupnosť sa môžu líšiť; over ich u zvoleného zubára alebo poisťovne.";
  }

  function toothButton(tooth) {
    const status = state.teeth.records[tooth.id]?.status || "none";
    const mark = status === "erupted" ? "✓" : status === "erupting" ? "◐" : "○";
    return `<button class="tooth-button is-${status}" type="button" data-tooth-id="${tooth.id}" aria-label="${escapeHtml(tooth.name)}, ${STATUS_LABELS[status]}" aria-pressed="${selectedId === tooth.id}"><span class="tooth-shape" aria-hidden="true">${mark}</span><small>${tooth.id}</small></button>`;
  }

  function currentCard() {
    const records = Object.values(state.teeth.records);
    const erupted = records.some(record => record.status === "erupted");
    const erupting = state.teeth.teethingLikely || records.some(record => record.status === "erupting");
    if (erupted) return `<span class="teeth-eyebrow">Po prvom zube</span><h2>Prvý zúbok je tu</h2><p>Začnite jemne čistiť mäkkou detskou kefkou dvakrát denne. Pre dieťa do 3 rokov použite len tenkú stopu fluoridovej pasty približne ako zrnko ryže a množstvo či koncentráciu over podľa miestneho odporúčania zubára.</p><div class="teeth-actions"><button type="button" data-teeth-scroll-map>Otvoriť mapu</button><button type="button" data-teeth-diary>Pridať „Prvý zúbok“ do denníka</button></div>`;
    if (erupting) return `<span class="teeth-eyebrow">Pri prerezávaní</span><h2>Skúsme bezpečnú úľavu</h2><p>Môže pomôcť jemná masáž ďasna čistým prstom alebo bezpečné hryzadlo vychladené v chladničke, nie v mrazničke. Liek ani dávkovanie tu neodporúčame.</p><div class="teeth-actions"><button type="button" data-teeth-visible>Áno, zub je už viditeľný</button><button type="button" data-teeth-scroll-map>Vybrať zub v mape</button><button type="button" data-teeth-cancel-erupting>Bol to omyl</button></div>`;
    return `<span class="teeth-eyebrow">Pred prvým zubom</span><h2>Prvý zub často príde okolo 6. mesiaca</h2><p>Môže sa objaviť skôr aj neskôr. Bežné môže byť slinenie, hryzenie, citlivé začervenané ďasno alebo väčší nepokoj. Výraznú horúčku, hnačku či vážne ťažkosti nepripisuj automaticky zubom.</p><div class="teeth-actions"><button type="button" data-teeth-likely>Myslím, že sa prerezáva zúbok</button></div>`;
  }

  function editPanel() {
    if (!selectedId) return "";
    const tooth = TOOTH_DEFINITIONS.find(item => item.id === selectedId);
    const record = state.teeth.records[selectedId] || { status:"none", teethingStart:"", appeared:"", note:"" };
    return `<form class="teeth-edit" data-tooth-form><div class="teeth-edit-head"><div><span class="teeth-eyebrow">Zub ${tooth.id}</span><h3>${escapeHtml(tooth.name)}</h3></div><button type="button" data-tooth-close aria-label="Zatvoriť úpravu zuba">×</button></div>
      <label>Stav<select name="status"><option value="none" ${record.status === "none" ? "selected":""}>Ešte nie</option><option value="erupting" ${record.status === "erupting" ? "selected":""}>Pravdepodobne sa prerezáva</option><option value="erupted" ${record.status === "erupted" ? "selected":""}>Prerezaný</option></select></label>
      <div class="teeth-date-grid"><label>Začiatok prerezávania<input name="teethingStart" type="date" value="${escapeHtml(record.teethingStart)}"></label><label>Dátum objavenia<input name="appeared" type="date" value="${escapeHtml(record.appeared)}"></label></div>
      <label>Krátka poznámka<textarea name="note" maxlength="500" rows="3" placeholder="Nepovinná poznámka">${escapeHtml(record.note)}</textarea></label>
      <div class="teeth-actions"><button class="teeth-primary" type="submit">Uložiť zub</button></div></form>`;
  }

  function render() {
    if (!isPostpartum()) { if (view.classList.contains("active")) switchView("home"); return; }
    const days = ageDays();
    const hasFirst = Object.values(state.teeth.records).some(record => record.status === "erupted");
    const dentistRelevant = hasFirst || (days !== null && days >= 300);
    root.innerHTML = `<div class="teeth-shell">
      <header class="teeth-hero"><span aria-hidden="true">🦷</span><div><h1>Zúbky</h1><p>Orientačný sprievodca bez porovnávania detí.</p></div></header>
      <section class="teeth-card teeth-now"><h2 class="sr-only">Čo je dôležité teraz</h2>${currentCard()}</section>
      <section class="teeth-card" data-teeth-map-section><h2>Mapa zúbkov</h2><p>Pozeráte sa na dieťa spredu: pravá strana dieťaťa je naľavo na obrazovke. Symboly: ○ ešte nie, ◐ pravdepodobne sa prerezáva, ✓ prerezaný.</p>
        <div class="teeth-map" aria-label="Mapa 20 mliečnych zubov"><div class="teeth-jaw"><strong>Horná čeľusť</strong><div class="teeth-row">${TOOTH_DEFINITIONS.filter(item => item.jaw === "upper").map(toothButton).join("")}</div></div><div class="teeth-midline" aria-hidden="true"></div><div class="teeth-jaw"><strong>Dolná čeľusť</strong><div class="teeth-row">${TOOTH_DEFINITIONS.filter(item => item.jaw === "lower").map(toothButton).join("")}</div></div></div>${editPanel()}</section>
      <section class="teeth-card"><h2>Orientačná časová os</h2><p>Nie je to povinný harmonogram a neskorší zub sám osebe nie je červené upozornenie.</p><div class="teeth-timeline"><span><b>okolo 6. mesiaca</b>predné rezáky</span><span><b>okolo 8. mesiaca</b>bočné rezáky</span><span><b>okolo 12. mesiaca</b>prvé stoličky</span><span><b>okolo 18. mesiaca</b>očné zuby</span><span><b>okolo 24. mesiaca</b>druhé stoličky</span><span><b>zvyčajne 2–3 roky</b>kompletný mliečny chrup</span></div></section>
      <section class="teeth-card"><h2>Starostlivosť</h2>${hasFirst ? `<ul><li>Čistite dvakrát denne mäkkou detskou kefkou od prvého zuba.</li><li>Pre najmenšie deti použite len stopu pasty približne ako zrnko ryže; fluoridovú koncentráciu over podľa lokalizovaného odborného odporúčania.</li><li>Dospelý čistenie vykonáva alebo priamo kontroluje. Dieťa môžete bezpečne oprieť chrbtom o seba a jemne stabilizovať hlavu.</li><li>Pri odmietaní skúste kratšie čistenie, pokojný hlas a inú dennú chvíľu; nepoužívajte silu.</li><li>Obmedzujte častý kontakt zubov so sladkými jedlami a nápojmi.</li></ul>` : `<p>Pred prvým zubom netreba zavádzať povinné denné odškrtávanie. Po objavení prvého zuba sa tu zobrazí stručný návod na čistenie.</p>`}
        <div class="teeth-reminder"><label>Dobrovoľná pripomienka čistenia<input type="datetime-local" data-teeth-reminder-date value="${tomorrowMorning()}"></label><button type="button" data-teeth-reminder>Vytvoriť v Pripomienkach</button></div></section>
      <section class="teeth-card"><h2>Zubár</h2>${dentistRelevant ? `<p><strong>Je vhodný čas naplánovať prvú návštevu zubára.</strong> Preventívna návšteva po prvom zube a najneskôr okolo prvých narodenín pomáha nastaviť starostlivosť podľa dieťaťa a miestnych odporúčaní. ${escapeHtml(localizedDentistNote())}</p>` : `<p>Po prvom zaznamenanom zube alebo pred prvými narodeninami tu pripomenieme vhodný čas na preventívnu návštevu. ${escapeHtml(localizedDentistNote())}</p>`}
        ${dentistRelevant ? `<div class="teeth-reminder"><label>Termín návštevy<input type="datetime-local" data-dentist-date value="${tomorrowMorning()}"></label><button type="button" data-dentist-appointment>Pridať do kalendára</button><button type="button" data-dentist-planned aria-pressed="${state.teeth.dentistPlanned}">${state.teeth.dentistPlanned ? "✓ Návšteva je naplánovaná" : "Návšteva je už naplánovaná"}</button></div>` : ""}</section>
      <section class="teeth-card teeth-help"><h2>Kedy vyhľadať pomoc</h2><p>Kontaktujte zubára alebo lekára pri úraze či vyrazenom zube, krvácaní, ktoré sa nezastavuje, podozrení na infekciu, silnej alebo pretrvávajúcej bolesti alebo podozrení na kaz.</p><p><strong>Pri opuchu tváre alebo probléme s dýchaním či prehĺtaním nečakajte na aplikáciu a použite urgentnú pomoc.</strong></p><button type="button" data-teeth-urgent>Otvoriť Urgentnú pomoc</button></section>
      <footer class="teeth-sources"><strong>Odborný základ na revíziu</strong>${SOURCES.map(([label,url]) => `<a href="${url}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`).join("")}<small>Obsahová kontrola ${REVIEWED_AT}; nejde o individuálnu diagnózu ani lekárske schválenie.</small></footer>
      <div class="sr-only" data-teeth-live aria-live="polite"></div>
    </div>`;
  }

  root.addEventListener("click", event => {
    const tooth = event.target.closest("[data-tooth-id]");
    if (tooth) { selectedId=tooth.dataset.toothId; render(); root.querySelector("[data-tooth-form]")?.scrollIntoView({behavior:"smooth",block:"nearest"}); root.querySelector("[data-tooth-form] select")?.focus(); return; }
    if (event.target.closest("[data-tooth-close]")) { selectedId=""; return render(); }
    if (event.target.closest("[data-teeth-scroll-map]")) { root.querySelector("[data-teeth-map-section]")?.scrollIntoView({behavior:"smooth"}); return; }
    if (event.target.closest("[data-teeth-likely]")) { state.teeth.teethingLikely=true; persist(); render(); return announce("Stav prerezávania je uložený."); }
    if (event.target.closest("[data-teeth-cancel-erupting]")) { state.teeth.teethingLikely=false; for(const [id,record] of Object.entries(state.teeth.records)) if(record.status==="erupting") delete state.teeth.records[id]; persist(); render(); return announce("Stav prerezávania bol zrušený."); }
    if (event.target.closest("[data-teeth-visible]")) { const id=Object.keys(state.teeth.records).find(key=>state.teeth.records[key].status==="erupting") || "81"; state.teeth.records[id]={...(state.teeth.records[id]||{}),status:"erupted",appeared:(state.teeth.records[id]?.appeared||today()),teethingStart:state.teeth.records[id]?.teethingStart||"",note:state.teeth.records[id]?.note||""}; state.teeth.teethingLikely=false; syncFirstToothDate(); selectedId=id; persist(); render(); return announce("Prvý zúbok je zaznamenaný."); }
    if (event.target.closest("[data-teeth-reminder]")) { const date=root.querySelector("[data-teeth-reminder-date]")?.value; if(!date) return announce("Vyberte dátum pripomienky."); state.reminders.push({title:"Jemné čistenie zúbkov",date,type:"Zúbky"}); if(typeof save==="function") save(); else persist(); render(); return announce("Pripomienka je uložená v Pripomienkach."); }
    if (event.target.closest("[data-dentist-appointment]")) { const date=root.querySelector("[data-dentist-date]")?.value; if(!date) return announce("Vyberte termín návštevy."); state.reminders.push({title:"Prvá návšteva zubára",date,type:"Zubár"}); state.teeth.dentistPlanned=true; if(typeof save==="function") save(); else persist(); render(); return announce("Termín je uložený v kalendári."); }
    if (event.target.closest("[data-dentist-planned]")) { state.teeth.dentistPlanned=!state.teeth.dentistPlanned; persist(); render(); return announce("Stav návštevy je uložený."); }
    if (event.target.closest("[data-teeth-diary]")) { const option=document.getElementById("diaryMomentType"); if(option && !Array.from(option.options).some(item=>item.value==="Prvý zúbok")) option.add(new Option("Prvý zúbok","Prvý zúbok")); if(option) option.value="Prvý zúbok"; const title=document.getElementById("diaryTitle"); const date=document.getElementById("diaryDate"); const text=document.getElementById("diaryText"); if(title) title.value="Prvý zúbok"; if(date) date.value=state.teeth.firstToothDate||today(); if(text) text.value="Prvý zúbok je tu."; switchView("diary"); return; }
    if (event.target.closest("[data-teeth-urgent]")) switchView("urgent");
  });

  root.addEventListener("submit", event => {
    if (!event.target.matches("[data-tooth-form]")) return;
    event.preventDefault();
    const form=event.target; const status=form.elements.status.value;
    if(status==="none") delete state.teeth.records[selectedId]; else state.teeth.records[selectedId]={status,teethingStart:form.elements.teethingStart.value,appeared:form.elements.appeared.value || (status==="erupted" ? today():""),note:form.elements.note.value.trim()};
    state.teeth.teethingLikely=Object.values(state.teeth.records).some(record=>record.status==="erupting"); syncFirstToothDate(); persist(); render(); announce(status==="none" ? "Stav zuba bol odstránený." : "Zub je uložený.");
  });

  document.addEventListener("click", event => { if(event.target.closest("[data-open-teeth]")) switchView("teeth"); });
  let wasActive=view.classList.contains("active");
  new MutationObserver(()=>{const active=view.classList.contains("active");if(active&&!wasActive)render();wasActive=active;}).observe(view,{attributes:true,attributeFilter:["class"]});
  window.GugubooTeethCore=Object.freeze({definitions:TOOTH_DEFINITIONS,migrateTeethState,syncFirstToothDate,render});
  if(wasActive)render();
})();

/*
 * GUGUBOO V2 – Life Admin (brief body 18–22).
 *
 * Používa len overenú znalostnú vrstvu (content/life-admin-<krajina>.js) – nikdy nie pamäť AI.
 * Každá položka nesie zdroj a dátum kontroly. Položky „needs_source“ sa v pláne neukazujú ako istota.
 * Krajinu určuje profil; UI nemá žiadnu krajinu natvrdo (Country Engine: modul = dáta).
 *
 * Z položiek s časovým oknom sa stanú položky Journey Engine (TERAZ / ČOSKORO / NESKÔR).
 */
(function initGugubooAdmin() {
  "use strict";

  if (typeof state === "undefined" || !window.GugubooJourney || !window.GugubooV5) return;

  const J = window.GugubooJourney;
  const V5 = window.GugubooV5;
  const esc = V5.escapeHtml;
  const byId = id => document.getElementById(id);

  // Pravidlo „nevymýšľať“: modul sa použije len ak každý údaj prešiel kontrolou doslovných citátov.
  const countryModule = () => {
    const country = (state.profile?.country || "SK").toUpperCase();
    const module = window.GugubooContent?.lifeAdmin?.[country] || null;
    return module?.meta?.verification_status === "evidence-verified" ? module : null;
  };
  const allItems = () => countryModule()?.items || [];
  const formatDate = iso => iso ? new Date(String(iso).slice(0, 10) + "T12:00:00").toLocaleDateString("sk-SK", { day: "numeric", month: "numeric", year: "numeric" }) : "";
  const trusted = item => ["verified", "partial"].includes(item.verification_status);

  function stagesFor(item) {
    const stages = new Set();
    (item.life_stage || []).forEach(stage => {
      if (stage === "pregnancy") stages.add("pregnancy");
      if (["postpartum", "birth", "baby"].includes(stage)) { stages.add("postpartum"); stages.add("baby"); }
    });
    return [...stages];
  }

  // Čo úrad alebo pôrodnica vybaví samy, nie je úloha pre mamu – len informácia (brief: „reduce work“).
  // `automatic` je v dátach doložené citátom. Tehotenské a materské sú automatické len podmienečne
  // (e-tehotenská knižka od 1. 8. 2026), preto ich appka ukazuje ako úlohu s vysvetlením v „Ako postupovať“.
  const CONDITIONALLY_AUTOMATIC = new Set(["sk.benefit.tehotenske", "sk.benefit.materske"]);
  const isAutomatic = item => item.automatic === true && !CONDITIONALLY_AUTOMATIC.has(item.id);

  // Položka Life Admin → položka Journey Engine (len ak má časové okno zo zdroja a treba niečo urobiť).
  // Tieto kroky už plán obsahuje ako prípravu (preg.pediatrician, baby.pediatrician-visit) – bez duplicity.
  const COVERED_BY_PLAN = new Set(["sk.process.vyber_pediatra", "sk.process.prihlasenie_k_pediatrovi"]);

  function toJourneyItem(item) {
    if (isAutomatic(item) || COVERED_BY_PLAN.has(item.id)) return null;
    const when = item.when || {};
    let window = null;
    if (when.anchor === "due_date" && (when.from_days !== null || when.to_days !== null)) {
      window = { anchor: "due", from: when.from_days ?? -60, to: when.to_days ?? 0 };
    } else if (when.anchor === "birth_date" && (when.from_days !== null || when.to_days !== null)) {
      window = { anchor: "age", from: when.from_days ?? 0, to: when.to_days ?? 90 };
    }
    if (!window) return null;
    // Master 1.7 (text sweep #2): príspevok na viac súčasne narodených detí nie je úloha pre každého – appka zatiaľ nevie
    // o dvojčatách, preto ostáva len v prehľade Úradov (nie v Pláne ani v riadku „Dnes“).
    if (item.id === "sk.benefit.prispevok_viac_sucasne_narodenych_deti") return null;
    const stages = stagesFor(item);
    if (!stages.length) return null;
    return {
      id: "admin." + item.id, stage: stages, type: "task", priority: 78, window, soonLeadDays: 21,
      title: TASK_TITLE[item.id] || item.title, why: item.why || item.what || "", note: item.authority || "", action: "admin", adminId: item.id
    };
  }

  // Master 1.7 (text sweep #1, #2): názov úlohy v Pláne a na domove ako činnosť. Obsah modulu sa nemení – len UI vrstva.
  const TASK_TITLE = {
    "sk.benefit.tehotenske": "Tehotenské – ako na to",
    "sk.benefit.materske": "Materské – ako na to",
    "sk.benefit.otcovske": "Otcovské – ako na to",
    "sk.benefit.rodicovsky_prispevok": "Rodičovský príspevok – ako na to",
    "sk.benefit.pridavok_na_dieta": "Požiadaj o prídavok na dieťa",
    "sk.document.rodne_cislo": "Rodné číslo – kde ho nájdeš",
    "sk.document.dohoda_o_mene": "Dohoda o mene dieťaťa",
    "sk.benefit.prispevok_viac_sucasne_narodenych_deti": "Príspevok na súčasne narodené deti"
  };

  function registerJourney() {
    const items = allItems().filter(trusted).map(toJourneyItem).filter(Boolean);
    J.registerItems(items);
    return items.length;
  }

  // ——— Detail položky ———
  document.body.insertAdjacentHTML("beforeend", [
    "<div id='v2AdminOverlay' class='v2-birth-overlay' aria-hidden='true'>",
    "<section class='v2-birth-sheet v2-admin-sheet' role='dialog' aria-modal='true' aria-labelledby='v2AdminTitle'>",
    "<button class='v5-icon-button v2-birth-close' type='button' data-v2-admin-close aria-label='Zavrieť'>×</button>",
    "<div id='v2AdminBody'></div></section></div>"
  ].join(""));

  function row(label, value) {
    if (!value || (Array.isArray(value) && !value.length)) return "";
    const body = Array.isArray(value) ? "<ul>" + value.map(entry => "<li>" + esc(entry) + "</li>").join("") + "</ul>" : "<p>" + esc(value) + "</p>";
    return "<div class='v2-admin-row'><strong>" + esc(label) + "</strong>" + body + "</div>";
  }

  function detailHtml(item) {
    const partial = item.verification_status === "partial";
    const unverified = item.verification_status === "needs_source";
    // Master 1.7 (text sweep #51, N10): viditeľné Prečo, Kedy a prvá časť Sumy; Komu patrí, Termín a zvyšok Sumy sú v „Ako to vybaviť“. Text sa nemení.
    const amountParts = Array.isArray(item.amount) ? item.amount : String(item.amount || "").split(/(?<=\.)\s+(?=[A-ZÁČĎÉÍĽĹŇÓÔŔŠŤÚÝŽ])/).filter(Boolean);
    const amountFirst = amountParts.length ? (Array.isArray(item.amount) ? [amountParts[0]] : amountParts[0]) : null;
    const amountRest = amountParts.length > 1 ? (Array.isArray(item.amount) ? amountParts.slice(1) : amountParts.slice(1).join(" ")) : null;
    const more = [row("Komu patrí", item.eligibility), row("Termín", item.deadline), row("Suma – podrobnosti", amountRest), row("Kto to vybavuje", item.who), row("Doklady", item.documents), row("Ako postupovať", item.how), row("Kde", item.where), row("Čo potom", item.next)].join("");
    const moreHtml = more ? "<details class='v2-admin-more'><summary>Ako to vybaviť</summary><div class='v2-admin-rows'>" + more + "</div></details>" : "";
    return [
      "<header class='v2-admin-head'><small>", esc(item.authority || item.who || "Úrady a doklady"), "</small><h2 id='v2AdminTitle'>", esc(item.title), "</h2>",
      item.what ? "<p>" + esc(item.what) + "</p>" : "", "</header>",
      isAutomatic(item) ? "<p class='v2-admin-status v2-admin-auto'>✓ Toto sa vybaví samo – nemusíš nič podávať.</p>" : "",
      unverified ? "<p class='v2-admin-status'>Tieto údaje ešte overujeme z oficiálneho zdroja. Presné pravidlá nájdeš na stránke úradu.</p>"
        : partial ? "<p class='v2-admin-status'>Časť údajov ešte overujeme – pri detailoch sa riaď oficiálnou stránkou.</p>" : "",
      "<div class='v2-admin-rows'>",
      row("Prečo", item.why),
      row("Kedy", item.when?.text),
      row("Suma", amountFirst),
      "</div>",
      // Text 1.5 (Samo 13. 11.): podrobnosti ostávajú celé, len v ďalšej úrovni.
      moreHtml,
      item.source_url ? "<a class='v2-source' href='" + esc(item.source_url) + "' target='_blank' rel='noopener noreferrer'>Zdroj: " + esc(item.official_source || "oficiálna stránka") + " · kontrola " + esc(formatDate(item.last_checked)) + " ↗</a>" : "",
      "<div class='v2-birth-actions'>",
      item.source_url ? "<a class='v5-primary' href='" + esc(item.source_url) + "' target='_blank' rel='noopener noreferrer'>Otvoriť oficiálnu stránku</a>" : "",
      "<button class='v5-secondary' type='button' data-v2-admin-remind='", esc(item.id), "'>Pripomeň o týždeň</button>",
      "<button class='v5-secondary' type='button' data-v2-admin-done='", esc(item.id), "'>✓ Vybavené</button>",
      "</div>",
      "<p class='v2-birth-note'>Guguboo nenahrádza právne poradenstvo. O nároku vždy rozhoduje príslušný úrad.</p>"
    ].join("");
  }

  function open(adminId) {
    const item = allItems().find(entry => entry.id === adminId);
    if (!item) return;
    const overlay = byId("v2AdminOverlay");
    const body = byId("v2AdminBody");
    // Master 1.7 (V8): detail otvorený z prehľadu má návrat na zoznam; × zavrie okno a ostaneš tam, kde si bola.
    const fromOverview = overlay.classList.contains("open") && body.dataset.mode === "overview";
    body.dataset.mode = "detail";
    body.innerHTML = (fromOverview ? "<button type='button' class='g2-admin-back' data-v2-admin-back><span aria-hidden='true'>‹</span> Úrady a doklady</button>" : "") + detailHtml(item);
    body.scrollTop = 0;
    overlay.querySelector(".v2-birth-sheet")?.scrollTo?.(0, 0);
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    if (!V5.MASTER) byId("v5BottomBar")?.classList.add("v5-hidden-for-modal");
    document.body.style.overflow = "hidden";
    window.GugubooV2?.track?.("admin_open", { id: adminId });
  }

  function close() {
    const overlay = byId("v2AdminOverlay");
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    byId("v5BottomBar")?.classList.remove("v5-hidden-for-modal");
    document.body.style.overflow = "";
  }

  // ——— Prehľad „Úrady a doklady“ (nahrádza starú stránku so sumami natvrdo) ———
  function overviewHtml() {
    const module = countryModule();
    const stage = J.context(state).life_stage;
    if (!module) {
      return "<header class='v2-admin-head'><small>Úrady a doklady</small><h2 id='v2AdminTitle'>Pripravujeme</h2><p>Pre tvoju krajinu zatiaľ nemáme overené informácie. Presné pravidlá nájdeš na stránkach úradov.</p></header>";
    }
    const plan = J.compute(state);
    const planIds = new Set([...plan.what_is_relevant_now, ...plan.what_is_coming].map(item => item.adminId).filter(Boolean));
    const doneIds = new Set(plan.done.map(item => item.adminId).filter(Boolean));
    const forStage = relevant(stage === "setup" ? "pregnancy" : stage);
    const later = allItems().filter(item => !forStage.includes(item) && !(V5.MASTER && stage !== "pregnancy" && stagesFor(item).every(s => s === "pregnancy")));
    const group = (title, items, note) => items.length ? [
      "<section class='v2-admin-group'><h3>", esc(title), "</h3>", note ? "<p>" + esc(note) + "</p>" : "",
      items.map(item => "<button type='button' class='v2-admin-list-item' data-v2-admin-open='" + esc(item.id) + "'><span><strong>" + esc(item.title) + "</strong><small>" + esc(item.authority || item.who || "") + "</small></span><em>" +
        (doneIds.has(item.id) ? "✓ hotové" : isAutomatic(item) ? "vybaví sa samo" : planIds.has(item.id) ? "aktuálne" : "") + "</em></button>").join(""),
      "</section>"
    ].join("") : "";
    const toDo = forStage.filter(item => !isAutomatic(item));
    const automatic = forStage.filter(isAutomatic);
    return [
      "<header class='v2-admin-head'><small>Úrady a doklady · ", esc(module.meta?.country || ""), "</small><h2 id='v2AdminTitle'>Čo sa ťa týka</h2>",
      "<p>Z oficiálnych stránok úradov · kontrola ", esc(formatDate(module.meta?.last_checked)), ".</p></header>",
      group("Na vybavenie", toDo, ""),
      group("Toto sa vybaví samo", automatic, ""),
      group("Neskôr", later, ""),
      "<p class='v2-birth-note'>Guguboo nenahrádza právne poradenstvo. O nároku vždy rozhoduje príslušný úrad.</p>"
    ].join("");
  }

  function openOverview() {
    byId("v2AdminBody").innerHTML = overviewHtml();
    byId("v2AdminBody").dataset.mode = "overview";
    const overlay = byId("v2AdminOverlay");
    overlay.querySelector(".v2-birth-sheet")?.scrollTo?.(0, 0);
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    if (!window.GugubooV5?.MASTER) byId("v5BottomBar")?.classList.add("v5-hidden-for-modal"); // Master: lišta ostáva, okno nad ňou
    document.body.style.overflow = "hidden";
    window.GugubooV2?.track?.("admin_overview");
  }

  // Aplikácia „Úrady“ zo zásuvky/obľúbených otvorí nový prehľad namiesto starej stránky.
  document.addEventListener("click", event => {
    const trigger = event.target.closest("[data-v5-feature='administration'], [data-v5-choice='prenatal-admin']");
    if (!trigger) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    // Master 1.0: zo zásuvky – najprv ju zavri, inak by prehľad úradov ostal pod ňou.
    const drawer = byId("v5DrawerOverlay");
    if (drawer?.classList.contains("open")) { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); }
    // Master 1.7 (V8): bez skoku na Domov – po zatvorení ostaneš tam, odkiaľ si Úrady otvorila (napr. Rodina).
    if (!window.GugubooV5.MASTER) window.GugubooV5.openHome();
    openOverview();
  }, true);
  // Master 1.7 (V8): ťuk na lištu (Domov, Bábätko, Mama, Rodina) okno Úradov zavrie, aby nová obrazovka nebola pod ním.
  document.addEventListener("click", event => {
    if (event.target.closest("#v5BottomBar") && byId("v2AdminOverlay")?.classList.contains("open")) close();
  }, true);

  // Pre GuguChat: relevantné položky pre aktuálnu fázu (aj bez presného okna).
  function relevant(lifeStage) {
    return allItems().filter(item => stagesFor(item).includes(lifeStage === "parenthood" ? "baby" : lifeStage));
  }

  document.addEventListener("click", event => {
    const openButton = event.target.closest("[data-v2-admin-open]");
    if (openButton) return open(openButton.dataset.v2AdminOpen);
    if (event.target.closest("[data-v2-admin-back]")) return openOverview();
    if (event.target.closest("[data-v2-admin-close]") || event.target.id === "v2AdminOverlay") return close();
    const done = event.target.closest("[data-v2-admin-done]");
    if (done) {
      J.markDone(state, "admin." + done.dataset.v2AdminDone);
      V5.persist();
      close();
      V5.renderHome();
      return V5.announce("Hotovo, odškrtnuté v pláne.");
    }
    const remind = event.target.closest("[data-v2-admin-remind]");
    if (remind) {
      const item = allItems().find(entry => entry.id === remind.dataset.v2AdminRemind);
      J.snooze(state, "admin." + item.id, 7);
      const date = new Date(Date.now() + 7 * 86400000);
      date.setHours(9, 0, 0, 0);
      state.reminders ||= [];
      state.reminders.push({ id: "v2-admin-" + item.id + "-" + Date.now(), adminId: item.id, title: item.title, date: date.toISOString(), type: "Úrady", source: "life-admin" });
      V5.persist();
      close();
      V5.renderHome();
      return V5.announce("Pripomeniem ti to o týždeň.");
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && byId("v2AdminOverlay")?.classList.contains("open")) close();
  });

  window.GugubooAdmin = { open, openOverview, close, relevant, registerJourney, isAutomatic, items: allItems, module: countryModule };
})();

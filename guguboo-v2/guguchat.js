/*
 * GUGUBOO V2 – GuguChat a plán TERAZ / ČOSKORO na Domove.
 *
 * GuguChat nie je generický chatbot a zatiaľ nepoužíva AI model (rozhodnutie 28. 9. 2026):
 *   - rozumie typickým otázkam (zámery), odpovedá z obsahu Guguboo a z Journey Engine,
 *   - ku každej odpovedi ponúkne akciu (Začať, Už mám vybavené, Pripomeň mi, …),
 *   - pri varovných signáloch vždy eskaluje (155 / 112, pôrodnica, lekár) – nikdy nediagnostikuje,
 *   - čo nevie, povie úprimne a otázku si zapíše ako medzeru v znalostiach (produktové dáta).
 * Beta: všetko žije len v sessionStorage (spolu s ostatným stavom).
 */
(function initGuguChat() {
  "use strict";

  if (typeof state === "undefined" || !window.GugubooJourney || !window.GugubooV5) return;

  const J = window.GugubooJourney;
  const V5 = window.GugubooV5;
  const byId = id => document.getElementById(id);
  const esc = V5.escapeHtml;
  const icon = V5.icon;
  const norm = value => String(value || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  state.v2 ||= {};
  state.v2.chat ||= [];
  state.v2.gaps ||= [];
  state.v2.log ||= [];

  const OFFICIAL = {
    slovensko: ["slovensko.sk", "https://www.slovensko.sk"],
    socpoist: ["Sociálna poisťovňa", "https://www.socpoist.sk"],
    mpsvr: ["Ministerstvo práce, sociálnych vecí a rodiny SR", "https://www.employment.gov.sk"]
  };

  // Jednoduché lokálne meranie hodnoty (GUGUBOO moment): odporúčanie → otvorené → hotové.
  function track(type, data = {}) {
    state.v2.log.push({ type, at: new Date().toISOString(), ...data });
    if (state.v2.log.length > 300) state.v2.log.splice(0, state.v2.log.length - 300);
  }

  function save() {
    V5.persist();
  }

  // ——— Otvorenie položky cesty ———
  function openItem(item) {
    if (!item) return;
    track("journey_open", { id: item.id });
    if (item.prep && typeof window.openPrepSection === "function") return window.openPrepSection(item.prep);
    if (item.action === "quickRecord") return V5.openQuickRecord();
    if (item.feature) return V5.openFeature(item.feature);
  }

  function remind(item, days = 7) {
    J.snooze(state, item.id, days);
    const date = new Date(Date.now() + days * 86400000);
    date.setHours(9, 0, 0, 0);
    state.reminders ||= [];
    state.reminders.push({ id: "v2-" + item.id + "-" + Date.now(), title: item.title, date: date.toISOString(), type: "Pripomienka", source: "guguchat" });
    track("journey_remind", { id: item.id, days });
    save();
    return date;
  }

  // ——— Domov: TERAZ / ČOSKORO ———
  const typeIcon = { task: "checklist", moment: "memory", tool: "sparkle", transition: "baby" };

  function journeyCard(item) {
    return [
      "<article class='v2-journey-card v2-journey-", item.type, "'>",
      "<button class='v2-journey-main' type='button' data-v2-journey-open='", esc(item.id), "'>",
      "<span class='v5-icon'>", icon(typeIcon[item.type] || "sparkle"), "</span>",
      "<span class='v2-journey-text'><strong>", esc(item.title), "</strong><small>", esc(item.why || ""), "</small></span>",
      "<span class='v5-row-arrow' aria-hidden='true'>›</span></button>",
      item.type === "task" ? [
        "<div class='v2-journey-actions'>",
        "<button type='button' data-v2-journey-done='", esc(item.id), "'>✓ Už mám</button>",
        "<button type='button' data-v2-journey-snooze='", esc(item.id), "'>Pripomeň o týždeň</button>",
        "</div>"
      ].join("") : "",
      "</article>"
    ].join("");
  }

  function homeJourneyHtml() {
    const plan = J.compute(state);
    const ctx = plan.context;
    if (ctx.life_stage === "setup") {
      return "<section class='v2-journey'><header><small>Tvoja cesta</small><h2>Najprv jeden údaj</h2></header>" +
        "<button class='v5-today-card' type='button' data-v5-feature='profiles'><span class='v5-icon'>" + icon("calendar") + "</span><div><small>Teraz</small><strong>Doplň termín pôrodu alebo dátum narodenia</strong><span class='v5-today-hint'>Podľa neho Guguboo vie, čo je pre teba práve dôležité.</span></div><span class='v5-row-arrow'>›</span></button></section>";
    }
    const now = plan.what_is_relevant_now;
    const soon = plan.what_is_coming;
    const later = plan.counts.later;
    return [
      "<section class='v2-journey' aria-label='Tvoj plán'>",
      "<header><small>", esc(J.stageLabel(ctx)), "</small><h2>Teraz</h2></header>",
      now.length ? now.map(journeyCard).join("") : "<p class='v2-journey-empty'>Na dnes je všetko podstatné hotové. Užívajte si to ❤️</p>",
      soon.length ? [
        "<div class='v2-journey-soon'><h3>Čoskoro</h3>",
        soon.map(item => "<button type='button' data-v2-journey-open='" + esc(item.id) + "'><span>" + esc(item.title) + "</span><em>o " + item.startsInDays + " " + (item.startsInDays === 1 ? "deň" : item.startsInDays < 5 ? "dni" : "dní") + "</em></button>").join(""),
        "</div>"
      ].join("") : "",
      "<footer class='v2-journey-later'><span>", later ? "Ďalších " + later + " vecí zatiaľ nemusíš riešiť. Keď príde čas, ozvem sa." : "Zvyšok počká. Keď príde čas, ozvem sa.", "</span>",
      "<button type='button' data-v2-chat-ask='Čo ma teraz čaká?'>Opýtať sa GuguChatu</button></footer>",
      "</section>"
    ].join("");
  }

  function betaFooterHtml() {
    return "<aside class='v2-beta-note'><span><strong>Beta verzia</strong> · údaje sa po zatvorení okna vymažú</span><button type='button' data-v2-reset>Začať odznova</button></aside>";
  }

  // ——— GuguChat: zámery ———
  const has = (text, words) => words.some(word => text.includes(word));

  function planAnswer(ctx, plan, focus) {
    const items = [...plan.what_is_relevant_now, ...plan.what_is_coming];
    if (!items.length) return { text: "Teraz nemáš nič naliehavé. Keď sa niečo priblíži, ozvem sa sama.", actions: [] };
    const tasks = focus === "tasks" ? items.filter(item => item.type === "task") : items;
    const first = tasks[0] || items[0];
    const lines = tasks.slice(0, 4).map(item => "• " + item.title + (item.horizon === "soon" ? " (o " + item.startsInDays + " dní)" : ""));
    const intro = focus === "tasks"
      ? (tasks.length === 1 ? "Z dôležitých vecí ti zostáva jedna." : "Z dôležitých vecí ti zostávajú " + tasks.length + ".")
      : "Podľa toho, kde na svojej ceste si (" + J.stageLabel(ctx) + "), je teraz dôležité:";
    return {
      text: intro + "\n" + lines.join("\n") + "\n\nNajbližšie bude vhodné vyriešiť: " + first.title + ".",
      item: first.id,
      actions: itemActions(first)
    };
  }

  function itemActions(item) {
    const list = [{ label: "Začať", kind: "open", value: item.id }, { label: "Vysvetli mi to", kind: "explain", value: item.id }];
    if (item.type === "task") {
      list.push({ label: "Pripomeň mi", kind: "remind", value: item.id });
      list.push({ label: "Už mám vybavené", kind: "done", value: item.id });
    }
    return list;
  }

  function itemAnswer(id, fallbackText) {
    const item = J.item(id);
    const plan = J.compute(state);
    const placed = [...plan.what_is_relevant_now, ...plan.what_is_coming, ...plan.later, ...plan.done].find(entry => entry.id === id);
    if (!item) return { text: fallbackText, actions: [] };
    if (placed?.done) return { text: "„" + item.title + "“ už máš označené ako hotové. 👏", actions: [{ label: "Otvoriť", kind: "open", value: id }, { label: "Vrátiť ako nehotové", kind: "undo", value: id }] };
    const when = !placed ? "" : placed.horizon === "now" ? "Teraz je na to vhodný čas." : placed.horizon === "soon" ? "Bude to aktuálne o " + placed.startsInDays + " dní." : "Zatiaľ to nemusíš riešiť – ozvem sa, keď príde správny čas.";
    return { text: item.title + ".\n" + (item.why || "") + (when ? "\n\n" + when : ""), item: id, actions: itemActions(item) };
  }

  function answer(question) {
    const t = norm(question);
    const plan = J.compute(state);
    const ctx = plan.context;
    const pregnant = ctx.life_stage === "pregnancy";
    const withBaby = ["postpartum", "baby", "parenthood"].includes(ctx.life_stage);

    // 1. Bezpečnosť má vždy prednosť.
    if (has(t, ["nedycha", "bezvedom", "nereaguje", "modrie", "modra ", "krc", "dusi sa", "opuch jazyka", "opuch pier", "vazny uraz"])) {
      return { level: "urgent", text: "Toto môže byť vážne. Nečakaj na aplikáciu.\n\n1. Volaj 155 alebo 112.\n2. Postupuj podľa pokynov operátora.\n3. Priprav presnú adresu a odomkni dvere.\n\nGuguboo nenahrádza tiesňovú linku.", actions: [{ label: "Volať 155", kind: "tel", value: "155" }, { label: "Volať 112", kind: "tel", value: "112" }] };
    }
    if (has(t, ["krvac", "plodova voda", "odtiekla voda", "odtieka voda", "nehybe", "menej hybe", "prestal sa hybat", "prestala sa hybat", "silna bolest", "rozmazane", "kontrakci"])) {
      return { level: "urgent", text: "Toto nechcem riešiť cez aplikáciu – je dôležité, aby sa na to hneď pozrel odborník.\n\nKontaktuj teraz svoju pôrodnicu alebo lekára. Ak máš pocit ohrozenia, volaj 155 alebo 112.", actions: [{ label: "Volať 155", kind: "tel", value: "155" }, { label: "Moje kontakty", kind: "feature", value: "contacts" }] };
    }
    if (has(t, ["ublizit si", "nechcem zit", "zabit sa", "samovrazd"])) {
      return { level: "urgent", text: "Ďakujem, že si to napísala. Nie si v tom sama a zaslúžiš si pomoc hneď teraz.\n\nAk ti hrozí nebezpečenstvo, volaj 112. Povedz to aj niekomu blízkemu, kto môže byť pri tebe.", actions: [{ label: "Volať 112", kind: "tel", value: "112" }] };
    }
    if (has(t, ["smutn", "nezvladam", "depres", "uzkost", "panik", "som unaven", "vycerpan", "placem"])) {
      return { level: "support", text: "To, čo cítiš, je dôležité a nemusíš to niesť sama.\n\nSkús dnes jednu malú vec len pre seba a povedz niekomu blízkemu, ako sa máš. Ak to trvá dlhšie alebo sa to zhoršuje, porozprávaj sa so svojím lekárom alebo pôrodnou asistentkou – je to bežná a správna vec.", actions: [{ label: "Môj priestor", kind: "feature", value: "privateSpace" }, { label: "Kruh pohody", kind: "home" }] };
    }

    // 2. Plán a úlohy.
    if (has(t, ["co ma caka", "co ma teraz", "co mam urobit", "co mam robit", "plan", "dalsi krok", "co teraz"])) return planAnswer(ctx, plan, "all");
    if (has(t, ["vybavit", "co musim", "co este", "uloh", "pripravit pred porodom"])) return planAnswer(ctx, plan, "tasks");
    if (has(t, ["task", "zbal"])) return itemAnswer("preg.bag", "Taška do pôrodnice je v Mojej príprave.");
    if (has(t, ["porodnic"])) return itemAnswer("preg.hospital", "Pôrodnicu si ulož v Mojej príprave.");
    if (has(t, ["pediatr", "detsky lekar"])) return withBaby ? itemAnswer("baby.pediatrician-visit", "") : itemAnswer("preg.pediatrician", "");
    if (has(t, ["vybav", "postielk", "spanie babatka", "kde bude spat"])) return itemAnswer("preg.sleep-place", "");
    if (has(t, ["kontakt", "gynekolog"])) return itemAnswer("preg.contacts", "");

    // 3. Kde som.
    if (has(t, ["tyzden", "ako rastie", "velke", "velky", "velkost", "brusk"]) && pregnant) {
      return { text: "Si v " + ctx.pregnancy_week + ". týždni tehotenstva" + (ctx.due_days > 0 ? " – do termínu zostáva " + ctx.due_days + " dní." : ".") + "\n\nV Tehotenskej knižke nájdeš, čo sa teraz deje s bábätkom a s tebou.", actions: [{ label: "Otvoriť Tehotenskú knižku", kind: "feature", value: "pregnancy" }] };
    }
    if (has(t, ["100 dni", "sto dni", "100dni"])) {
      if (ctx.baby_age_days === null) return { text: "100 dní spolu začneme počítať od narodenia bábätka. V ten deň sa ti ozvem ❤️", actions: [] };
      const left = 100 - ctx.baby_age_days;
      return { text: left > 0 ? "Ste spolu " + ctx.baby_age_days + " dní. 100 dní spolu budete mať o " + left + " dní – v ten deň ti pripravím kartičku." : left === 0 ? "Dnes ste spolu 100 dní ❤️" : "100 dní spolu ste oslávili pred " + (-left) + " dňami ❤️", actions: [{ label: "Naše chvíle", kind: "feature", value: "memories" }] };
    }
    if (has(t, ["narodil", "narodila", "porodila", "je na svete", "uz je tu"])) {
      return { text: "Gratulujem! ❤️ V profile dieťaťa prepni obdobie na „narodené“ a doplň dátum narodenia. Guguboo sa samo prepne na prvé dni s bábätkom – tvoje údaje, plán aj spomienky ostanú.", actions: [{ label: "Otvoriť profil", kind: "feature", value: "profiles" }] };
    }

    // 4. Po pôrode – rýchle záznamy.
    if (withBaby && has(t, ["kojen", "dojc", "kŕm", "krm", "flas", "mliek"])) return { text: "Kŕmenie zapíšeš dvoma ťuknutiami – časovač beží aj keď zatvoríš obrazovku.", actions: [{ label: "Zapísať kŕmenie", kind: "feature", value: "feeding" }] };
    if (withBaby && has(t, ["plienk", "prebal"])) return { text: "Prebalenie zapíšeš jedným ťuknutím.", actions: [{ label: "Zapísať prebalenie", kind: "feature", value: "diaper" }] };
    if (withBaby && has(t, ["spank", "spi", "zaspav", "spat"])) return { text: "Spánok môžeš spustiť časovačom. V Spánku nájdeš aj pokojné zvuky na zaspávanie.", actions: [{ label: "Spánok", kind: "feature", value: "sleep" }, { label: "Zvuky", kind: "feature", value: "sounds" }] };

    // 5. Emocionálne veci.
    if (has(t, ["uspavank", "nahrat", "hlas"])) return itemAnswer("preg.voice", "Uspávanku s vlastným hlasom nahráš v časti Zvuky.");
    if (has(t, ["kartick"])) return withBaby ? itemAnswer("baby.birth-card", "") : { text: "Kartičku narodenia ti pripravím hneď, keď sa bábätko narodí.", actions: [] };

    // 6. Úrady – úprimne: overený obsah sa pripravuje, nič z pamäte.
    if (has(t, ["urad", "prispev", "matersk", "rodicovsk", "davk", "socialn", "rodny list", "matrik", "poistovn", "prihlas"])) {
      return {
        level: "admin",
        text: "Úrady a príspevky chcem robiť poriadne: každú informáciu len z oficiálneho zdroja a s dátumom overenia. Tento prehľad pre tvoju situáciu práve pripravujeme.\n\nDovtedy nájdeš presné a aktuálne pravidlá priamo na oficiálnych stránkach:",
        actions: [
          { label: OFFICIAL.slovensko[0], kind: "link", value: OFFICIAL.slovensko[1] },
          { label: OFFICIAL.socpoist[0], kind: "link", value: OFFICIAL.socpoist[1] },
          { label: "Ministerstvo práce (MPSVR)", kind: "link", value: OFFICIAL.mpsvr[1] }
        ]
      };
    }

    // 7. Zdvorilosti.
    if (has(t, ["ahoj", "dobry den", "cau", "zdravim"])) return { text: "Ahoj! Som GuguChat. Poradím ti, čo je teraz dôležité, a pomôžem ti to rovno vybaviť. Na čo sa chceš opýtať?", actions: [{ label: "Čo ma teraz čaká?", kind: "ask", value: "Čo ma teraz čaká?" }] };
    if (has(t, ["dakujem", "vdaka", "super"])) return { text: "Rado sa stalo ❤️ Keď budeš niečo potrebovať, som tu.", actions: [] };

    // 8. Neviem – úprimne a zapíšem ako medzeru v znalostiach.
    state.v2.gaps.push({ q: question, stage: ctx.life_stage, at: new Date().toISOString() });
    track("chat_gap");
    return {
      level: "unknown",
      text: "Na toto ti zatiaľ neviem odpovedať s istotou a nechcem hádať. Otázku som si zapísala, aby sme Guguboo naučili aj toto.\n\nAk ide o zdravie, obráť sa na svojho lekára. Pri ohrození volaj 155 alebo 112.",
      actions: [{ label: "Čo ma teraz čaká?", kind: "ask", value: "Čo ma teraz čaká?" }]
    };
  }

  // ——— GuguChat: UI ———
  function chips(ctx) {
    if (ctx.life_stage === "pregnancy") return ["Čo ma teraz čaká?", "Čo ešte musím vybaviť pred pôrodom?", "Kedy zbaliť tašku?", "Ako rastie bábätko?", "Úrady a príspevky"];
    if (ctx.life_stage === "setup") return ["Ako začať?", "Úrady a príspevky"];
    return ["Čo ma teraz čaká?", "Zapísať kŕmenie", "Kedy k pediatrovi?", "Kedy je 100 dní?", "Úrady po pôrode"];
  }

  function proactiveOpening(plan) {
    const ctx = plan.context;
    const name = state.user?.name ? ", " + state.user.name : "";
    if (ctx.life_stage === "setup") return { role: "bot", text: "Ahoj" + name + ". Som GuguChat. Keď doplníš termín pôrodu alebo dátum narodenia, budem vedieť, čo je pre teba práve dôležité.", actions: [{ label: "Doplniť údaje", kind: "feature", value: "profiles" }] };
    const next = plan.next_best_action;
    const soon = plan.what_is_coming[0];
    let text = "Ahoj" + name + ". Viem, kde na svojej ceste si: " + J.stageLabel(ctx) + ".";
    if (next) text += "\n\nTeraz by som začala týmto: " + next.title + ".";
    if (soon) text += "\nO " + soon.startsInDays + " dní ťa čaká: " + soon.title + " – nemusíš to riešiť dnes, ozvem sa.";
    return { role: "bot", text, actions: next ? itemActions(next) : [] };
  }

  function messageHtml(message) {
    if (message.role === "user") return "<div class='v2-msg v2-msg-user'>" + esc(message.text) + "</div>";
    const actions = (message.actions || []).map(action => {
      if (action.kind === "tel") return "<a class='v2-chat-action v2-chat-action-urgent' href='tel:" + esc(action.value) + "'>" + esc(action.label) + "</a>";
      if (action.kind === "link") return "<a class='v2-chat-action' href='" + esc(action.value) + "' target='_blank' rel='noopener noreferrer'>" + esc(action.label) + " ↗</a>";
      return "<button class='v2-chat-action' type='button' data-v2-chat-kind='" + esc(action.kind) + "' data-v2-chat-value='" + esc(action.value || "") + "'>" + esc(action.label) + "</button>";
    }).join("");
    return "<div class='v2-msg v2-msg-bot" + (message.level ? " v2-level-" + esc(message.level) : "") + "'><p>" + esc(message.text).replace(/\n/g, "<br>") + "</p>" + (actions ? "<div class='v2-chat-actions'>" + actions + "</div>" : "") + "</div>";
  }

  function render() {
    const target = byId("guguChatContent");
    if (!target) return;
    const plan = J.compute(state);
    if (!state.v2.chat.length) {
      state.v2.chat.push(proactiveOpening(plan));
      track("chat_proactive", { item: plan.next_best_action?.id || "" });
      save();
    }
    target.innerHTML = [
      "<div class='v2-chat'>",
      "<header class='v2-chat-head'><img src='guguboo-logo-3d-pastel-v2.png' alt=''><div><strong>GuguChat</strong><small>", esc(J.stageLabel(plan.context)), " · odpovedám z overeného obsahu Guguboo</small></div></header>",
      "<div class='v2-chat-emergency'><span>Pri ohrození nečakaj</span><a href='tel:155'>155</a><a href='tel:112'>112</a></div>",
      "<div class='v2-chat-log' id='v2ChatLog' aria-live='polite'>", state.v2.chat.map(messageHtml).join(""), "</div>",
      "<div class='v2-chat-chips'>", chips(plan.context).map(chip => "<button type='button' data-v2-chat-ask='" + esc(chip) + "'>" + esc(chip) + "</button>").join(""), "</div>",
      "<form class='v2-chat-form' id='v2ChatForm'><label class='v5-sr-only' for='v2ChatInput'>Napíš otázku</label><input id='v2ChatInput' autocomplete='off' placeholder='Napíš, čo riešiš…'><button class='v5-primary' type='submit'>Poslať</button></form>",
      "<p class='v2-chat-disclaimer'>GuguChat nenahrádza lekára ani tiesňovú linku. Rozhovor sa po zatvorení okna vymaže.</p>",
      "</div>"
    ].join("");
    const log = byId("v2ChatLog");
    if (log) log.scrollTop = log.scrollHeight;
  }

  function ask(text) {
    const clean = String(text || "").trim();
    if (!clean) return;
    state.v2.chat.push({ role: "user", text: clean });
    const reply = answer(clean);
    state.v2.chat.push({ role: "bot", ...reply });
    track("chat_ask", { level: reply.level || "info", item: reply.item || "" });
    save();
    render();
  }

  function openChat(question) {
    V5.openFeature("guguChat");
    if (question) setTimeout(() => ask(question), 0);
  }

  function refreshHome() {
    V5.renderHome();
  }

  document.addEventListener("click", event => {
    const open = event.target.closest("[data-v2-journey-open]");
    if (open) return openItem(J.item(open.dataset.v2JourneyOpen));
    const done = event.target.closest("[data-v2-journey-done]");
    if (done) {
      const item = J.item(done.dataset.v2JourneyDone);
      J.markDone(state, item.id);
      track("journey_done", { id: item.id, source: "home" });
      save();
      refreshHome();
      return V5.announce("Hotovo: " + item.title);
    }
    const snooze = event.target.closest("[data-v2-journey-snooze]");
    if (snooze) {
      const item = J.item(snooze.dataset.v2JourneySnooze);
      remind(item, 7);
      refreshHome();
      return V5.announce("Pripomeniem ti to o týždeň.");
    }
    const chatAsk = event.target.closest("[data-v2-chat-ask]");
    if (chatAsk) {
      if (byId("guguChat")?.classList.contains("active")) return ask(chatAsk.dataset.v2ChatAsk);
      return openChat(chatAsk.dataset.v2ChatAsk);
    }
    const chatAction = event.target.closest("[data-v2-chat-kind]");
    if (chatAction) {
      const kind = chatAction.dataset.v2ChatKind;
      const value = chatAction.dataset.v2ChatValue;
      const item = J.item(value);
      if (kind === "open") return openItem(item);
      if (kind === "feature") return V5.openFeature(value);
      if (kind === "home") return V5.openHome();
      if (kind === "ask") return ask(value);
      if (kind === "explain" && item) {
        state.v2.chat.push({ role: "bot", text: item.why + "\n\nMôžeme to spraviť hneď, alebo ti to pripomeniem.", actions: itemActions(item).filter(action => action.kind !== "explain") });
        save();
        return render();
      }
      if (kind === "remind" && item) {
        const date = remind(item, 7);
        state.v2.chat.push({ role: "bot", text: "Dobre, pripomeniem ti to " + date.toLocaleDateString("sk-SK", { day: "numeric", month: "long" }) + ". Dovtedy to nemusíš mať v hlave.", actions: [] });
        save();
        return render();
      }
      if (kind === "done" && item) {
        J.markDone(state, item.id);
        track("journey_done", { id: item.id, source: "chat" });
        const next = J.compute(state).next_best_action;
        state.v2.chat.push({ role: "bot", text: "Super, „" + item.title + "“ je hotové. 👏" + (next ? "\n\nĎalší krok: " + next.title + "." : "\n\nMomentálne nemáš nič ďalšie naliehavé."), actions: next ? itemActions(next) : [] });
        save();
        return render();
      }
      if (kind === "undo" && item) {
        J.undo(state, item.id);
        save();
        return ask(item.title);
      }
    }
    if (event.target.closest("[data-v2-reset]")) {
      if (!window.confirm("Začať odznova? Všetky údaje v tejto beta verzii sa vymažú.")) return;
      try { sessionStorage.clear(); } catch (_) { /* nič */ }
      window.location.reload();
    }
  });

  document.addEventListener("submit", event => {
    if (event.target.id !== "v2ChatForm") return;
    event.preventDefault();
    const input = byId("v2ChatInput");
    ask(input?.value);
  });

  window.GugubooChat = { render, ask, answer, open: openChat };
  window.GugubooV2 = { homeJourneyHtml, betaFooterHtml, openItem, track };
  refreshHome();
})();

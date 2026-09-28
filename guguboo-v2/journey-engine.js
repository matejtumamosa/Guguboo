/*
 * GUGUBOO V2 – Journey Engine (mozog produktu).
 *
 * Z profilu (termín / dátum narodenia / krajina) a z toho, čo už je hotové, vypočíta:
 *   - kde na ceste používateľka je (fáza, týždeň tehotenstva, vek dieťaťa),
 *   - čo je relevantné TERAZ (NOW), čo sa blíži (SOON) a čo počká (LATER),
 *   - jeden najlepší ďalší krok a kontext pre GuguChat.
 *
 * Položky cesty sú dáta (JOURNEY_ITEMS), nie logika v UI. Engine je deterministický:
 * rovnaký stav + rovnaký dátum = rovnaký výstup (dá sa testovať s pevným dátumom cez `now`).
 * Obsah zatiaľ neobsahuje žiadne legislatívne sumy ani zdravotné tvrdenia – tie prídu
 * z overenej znalostnej vrstvy (zdroj + dátum overenia).
 */
(function initGugubooJourney() {
  "use strict";

  const DAY = 86400000;
  const LIMITS = { now: 3, soon: 2 };

  // anchor "week" = týždeň tehotenstva, anchor "age" = vek dieťaťa v dňoch.
  const JOURNEY_ITEMS = [
    // ——— Tehotenstvo ———
    {
      id: "preg.contacts", stage: "pregnancy", type: "task", priority: 70,
      window: { anchor: "week", from: 1, to: 42 },
      title: "Ulož si kontakt na gynekológa a pôrodnicu",
      why: "Keď ich budeš potrebovať, nemusíš nič hľadať.",
      feature: "contacts", done: s => (s.contacts || []).length > 0
    },
    {
      id: "preg.voice", stage: "pregnancy", type: "moment", priority: 45,
      window: { anchor: "week", from: 18, to: 42 },
      title: "Nahraj bábätku svoj hlas",
      why: "Po narodení ti ho Guguboo pripraví pri zaspávaní. Stačí minúta.",
      feature: "sounds", done: s => (s.lullabies || []).length > 0
    },
    {
      id: "preg.hospital", stage: "pregnancy", type: "task", priority: 80,
      window: { anchor: "week", from: 20, to: 36 }, soonLeadDays: 21,
      title: "Vyber si pôrodnicu a zisti, ako prebieha príjem",
      why: "Aby si presne vedela, kam ísť a čo čakať.",
      feature: "beforeBirth", prep: "hospital", checkAny: ["prep-hospital-admission"], done: s => !!s.prenatal?.hospital
    },
    {
      id: "preg.pediatrician", stage: "pregnancy", type: "task", priority: 75,
      window: { anchor: "week", from: 28, to: 40 }, soonLeadDays: 14,
      title: "Vyber pediatra ešte pred pôrodom",
      why: "Vybraný vopred, nech prvá poradňa nie je zhon.",
      feature: "beforeBirth", prep: "doctor", checkAny: ["prep-doctor-pediatrician", "v5-health-pediatrician"]
    },
    {
      id: "preg.sleep-place", stage: "pregnancy", type: "task", priority: 65,
      window: { anchor: "week", from: 28, to: 38 }, soonLeadDays: 14,
      title: "Priprav miesto na spanie bábätka",
      why: "Doma pripravené, kým ešte máte na to silu.",
      feature: "beforeBirth", prep: "equipment", checkAny: ["equip-sleep-bed", "v5-home-sleep"]
    },
    {
      id: "preg.supplies", stage: "pregnancy", type: "task", priority: 55,
      window: { anchor: "week", from: 32, to: 39 }, soonLeadDays: 14,
      title: "Priprav prvé zásoby (plienky, základná hygiena)",
      why: "Nech večer nikto nehľadá plienky ani vodu.",
      feature: "beforeBirth", prep: "supplies", checkAny: ["prep-supplies-diapers"]
    },
    {
      id: "preg.bag", stage: "pregnancy", type: "task", priority: 90,
      window: { anchor: "week", from: 34, to: 42 }, soonLeadDays: 14,
      title: "Zbaľ tašku do pôrodnice",
      why: "Zbalená vopred = pokoj v deň, keď to príde.",
      feature: "beforeBirth", prep: "bag", checkAny: ["prep-bag-leave-seat"], checkAll: ["v5-bag-mother", "v5-bag-baby", "v5-bag-hygiene", "v5-bag-home"]
    },
    {
      id: "preg.home-plan", stage: "pregnancy", type: "task", priority: 60,
      window: { anchor: "week", from: 35, to: 42 }, soonLeadDays: 10,
      title: "Dohodni s blízkymi prvé dni doma",
      why: "Kto pomôže s domácnosťou, nákupom a návštevami.",
      feature: "beforeBirth", prep: "home", checkAny: ["prep-home-family", "v5-prenatal-help"]
    },
    {
      id: "preg.birth-ready", stage: "pregnancy", type: "transition", priority: 50,
      window: { anchor: "week", from: 37, to: 42 },
      title: "Bábätko je na svete? Daj Guguboo vedieť",
      why: "Stačí dátum narodenia – Guguboo sa samo prepne na prvé dni s bábätkom.",
      action: "birth"
    },

    // ——— Po pôrode a bábätko ———
    {
      id: "baby.birth-card", stage: ["postpartum", "baby"], type: "moment", priority: 85,
      window: { anchor: "age", from: 0, to: 60 },
      title: "Vytvor kartičku narodenia",
      why: "Meno, dátum a čas narodenia na jednej krásnej kartičke.",
      feature: "cards", done: s => !!s.birthCard?.complete
    },
    {
      id: "baby.first-days", stage: "postpartum", type: "tool", priority: 80,
      window: { anchor: "age", from: 0, to: 14 },
      title: "Zapisuj kŕmenie, plienky a spánok jedným ťuknutím",
      why: "Pri prvej kontrole u pediatra budeš mať všetko po ruke.",
      action: "quickRecord", done: s => (s.events || []).length >= 3
    },
    {
      id: "baby.pediatrician-visit", stage: "postpartum", type: "task", priority: 88,
      window: { anchor: "age", from: 0, to: 10 },
      title: "Ozvi sa pediatrovi po návrate domov",
      why: "Dohodnete prvú kontrolu. Kontakt si ulož do Guguboo.",
      feature: "contacts"
    },
    {
      id: "baby.activities", stage: ["postpartum", "baby"], type: "tool", priority: 40,
      window: { anchor: "age", from: 14, to: 730 },
      title: "Krátka spoločná chvíľa podľa veku",
      why: "Nápad na pár minút, ktorý sedí na vek bábätka.",
      feature: "activities", repeatable: true
    },
    {
      id: "baby.teeth", stage: "baby", type: "tool", priority: 35,
      window: { anchor: "age", from: 120, to: 1095 }, soonLeadDays: 14,
      title: "Zúbky: čo čakať a ako sa o ne starať",
      why: "Mapa mliečnych zúbkov a starostlivosť podľa veku.",
      feature: "teeth"
    },
    {
      id: "baby.100days", stage: ["postpartum", "baby"], type: "moment", priority: 95,
      window: { anchor: "age", from: 99, to: 106 }, soonLeadDays: 7,
      title: "Dnes ste spolu 100 dní ❤️",
      soonTitle: "O pár dní ste spolu 100 dní",
      why: "Guguboo ti pripraví kartičku k tomuto dňu.",
      feature: "memories"
    }
  ];

  const toDate = value => {
    if (!value) return null;
    const date = new Date(String(value).length <= 10 ? value + "T12:00:00" : value);
    return Number.isFinite(date.getTime()) ? date : null;
  };
  const daysBetween = (from, to) => Math.floor((to.getTime() - from.getTime()) / DAY);
  const asArray = value => Array.isArray(value) ? value : [value];

  function journeyState(s) {
    s.v2 ||= {};
    s.v2.journey ||= { done: {}, snoozed: {}, dismissed: {} };
    return s.v2.journey;
  }

  function context(s, now = new Date()) {
    const profile = s.profile || {};
    const due = toDate(profile.due);
    const birth = toDate(profile.birth);
    const born = profile.status === "born" && birth;
    const ctx = {
      now, country: profile.country || "SK", name: profile.name || "", userName: s.user?.name || "",
      life_stage: "setup", due_date: profile.due || "", birth_date: profile.birth || "",
      pregnancy_week: null, due_days: null, baby_age_days: null
    };
    if (born) {
      const age = daysBetween(birth, now);
      ctx.baby_age_days = age;
      ctx.life_stage = age <= 42 ? "postpartum" : age <= 365 ? "baby" : "parenthood";
    } else if (due) {
      const dueDays = Math.ceil((due.getTime() - now.getTime()) / DAY);
      ctx.due_days = dueDays;
      // Rovnaký výpočet ako vo V1 (pregnancyWeek), aby sa týždne nerozchádzali.
      ctx.pregnancy_week = Math.min(42, Math.max(1, 40 - Math.floor(dueDays / 7)));
      ctx.life_stage = "pregnancy";
    }
    return ctx;
  }

  function isDone(item, s) {
    const j = journeyState(s);
    if (j.done[item.id]) return true;
    // Príprava má vo V1 dva zoznamy (podrobný „beforeBirth“ a v5 checklisty) – rátame oba.
    if (item.checkAny?.some(key => s.checks?.[key])) return true;
    if (item.checkAll?.length && item.checkAll.every(key => s.checks?.[key])) return true;
    if (typeof item.done === "function") {
      try { return !!item.done(s); } catch (_) { return false; }
    }
    return false;
  }

  // Vráti { horizon, startsInDays, endsInDays } alebo null, ak položka nepatrí do fázy.
  function placement(item, ctx) {
    if (!asArray(item.stage).includes(ctx.life_stage)) return null;
    const lead = item.soonLeadDays ?? 14;
    let position; // dni od začiatku okna (záporné = okno ešte nezačalo)
    let length;
    if (item.window.anchor === "week") {
      if (ctx.pregnancy_week === null) return null;
      const dayOfPregnancy = (40 * 7) - ctx.due_days;
      position = dayOfPregnancy - (item.window.from - 1) * 7;
      length = (item.window.to - item.window.from + 1) * 7;
    } else if (item.window.anchor === "due") {
      // Dni voči termínu pôrodu (záporné = pred termínom) – používa Life Admin z overených zdrojov.
      if (ctx.due_days === null) return null;
      const daysFromDue = -ctx.due_days;
      position = daysFromDue - item.window.from;
      length = item.window.to - item.window.from + 1;
    } else {
      if (ctx.baby_age_days === null) return null;
      position = ctx.baby_age_days - item.window.from;
      length = item.window.to - item.window.from + 1;
    }
    const endsInDays = length - position;
    if (position >= 0 && endsInDays > 0) return { horizon: "now", startsInDays: 0, endsInDays };
    if (position < 0 && -position <= lead) return { horizon: "soon", startsInDays: -position, endsInDays };
    if (position < 0) return { horizon: "later", startsInDays: -position, endsInDays };
    return null; // okno už skončilo
  }

  function compute(s, now = new Date()) {
    const ctx = context(s, now);
    const j = journeyState(s);
    const today = now.getTime();
    const buckets = { now: [], soon: [], later: [], done: [] };
    let transition = null;
    JOURNEY_ITEMS.forEach(item => {
      const place = placement(item, ctx);
      if (!place) return;
      // Prechod (napr. „Bábätko je na svete“) nie je úloha – nezaberá miesto v limite TERAZ.
      if (item.type === "transition") { if (place.horizon === "now") transition = { ...item, ...place }; return; }
      if (j.dismissed[item.id]) return;
      const entry = { ...item, ...place, done: isDone(item, s) };
      if (entry.done && !item.repeatable) { buckets.done.push(entry); return; }
      const snoozedUntil = j.snoozed[item.id] ? new Date(j.snoozed[item.id]).getTime() : 0;
      if (snoozedUntil > today && place.horizon === "now") { buckets.later.push({ ...entry, horizon: "later", snoozed: true }); return; }
      if (place.horizon === "soon" && item.soonTitle) entry.title = item.soonTitle;
      buckets[place.horizon].push(entry);
    });
    // Poradie: priorita, potom čo skôr končí (naliehavosť).
    const rank = (a, b) => (b.priority - a.priority) || (a.endsInDays - b.endsInDays);
    buckets.now.sort(rank);
    buckets.soon.sort((a, b) => a.startsInDays - b.startsInDays || rank(a, b));
    buckets.later.sort((a, b) => a.startsInDays - b.startsInDays);
    const nowItems = buckets.now.slice(0, LIMITS.now);
    const overflow = buckets.now.slice(LIMITS.now).map(item => ({ ...item, horizon: "later", overflow: true }));
    return {
      context: ctx,
      what_is_relevant_now: nowItems,
      what_is_coming: buckets.soon.slice(0, LIMITS.soon),
      later: [...overflow, ...buckets.later],
      done: buckets.done,
      next_best_action: nowItems.find(item => item.type === "task") || nowItems[0] || null,
      emotional_moment: nowItems.find(item => item.type === "moment") || null,
      transition,
      counts: { now: buckets.now.length, soon: buckets.soon.length, later: buckets.later.length + overflow.length, done: buckets.done.length }
    };
  }

  // Ďalšie moduly (napr. Life Admin z overenej znalostnej vrstvy) pridávajú položky ako dáta.
  function registerItems(items) {
    (items || []).forEach(entry => {
      const index = JOURNEY_ITEMS.findIndex(existing => existing.id === entry.id);
      if (index >= 0) JOURNEY_ITEMS[index] = entry; else JOURNEY_ITEMS.push(entry);
    });
  }

  function markDone(s, id) { journeyState(s).done[id] = new Date().toISOString(); }
  function undo(s, id) { const j = journeyState(s); delete j.done[id]; delete j.snoozed[id]; delete j.dismissed[id]; }
  function snooze(s, id, days = 7) { journeyState(s).snoozed[id] = new Date(Date.now() + days * DAY).toISOString(); }
  function item(id) { return JOURNEY_ITEMS.find(entry => entry.id === id) || null; }

  function stageLabel(ctx) {
    if (ctx.life_stage === "pregnancy") return ctx.pregnancy_week + ". týždeň tehotenstva";
    if (ctx.life_stage === "postpartum") return "Prvé týždne s bábätkom";
    if (ctx.life_stage === "baby") return "Prvý rok s bábätkom";
    if (ctx.life_stage === "parenthood") return "Rastieme spolu";
    return "Nastavme tvoju cestu";
  }

  window.GugubooJourney = { items: JOURNEY_ITEMS, context, compute, markDone, undo, snooze, item, stageLabel, registerItems, LIMITS };
})();

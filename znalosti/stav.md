# Aktuálny stav – kde sme skončili

Krátky prehľad pre ďalší chat. **Na konci každej práce ho aktualizuj** (verzia, čo je hotové, čo ďalej).

_Naposledy aktualizované: 27. 11. 2026 (Claude – Master 3.9.2, nové ikony skratiek)_

## Verzia

- **Master 3.9.2** (vo vetve `v2`), priečinok `guguboo-master/`. 3.9.2: skratky s textom, nové ikony Starostlivosť (swaddle), Aktivity (blocks), Otázky pre lekára (doctorQ). Otvorené z kontroly 3.9.1: Prehľad dňa (bodka bez textu, výrazné „Upraviť“), koniec úvodu po pôrode (prázdny kruh, vykanie „Ako vás…“), hlavička Oznámenia.
- Náhľad: https://v2--tranquil-lamington-f829d9.netlify.app/guguboo-master/app.html
- Web (náhľad): https://v2--tranquil-lamington-f829d9.netlify.app/guguboo-master/web.html

## Čo je hotové

- **2.0 – 2.6:** pozri `znalosti/rozhodnutia.md` (kruh, lišta, počasie, údaje v telefóne, appka na plochu).
- **2.7 – informujeme, neradíme:** bez liekov, dávok a postupov pri príznakoch; Starostlivosť o bábätko =
  zapíš, čo pozoruješ + otázka pre pediatra; Otázky pre lekára na jednom mieste; vážne situácie v `g2-safety.js`;
  Zúbky bez návodov; kruh Čas pre teba bez „Kŕč v nohe“; Pripravená postieľka (NHS, The Lullaby Trust).
- **Inštalácia na plochu** overená na Androide (Samo, 15. 11.).
- **2.8 (Fáza 1):** testovacia stránka `guguboo-master/test.html` (pred commitom musí byť celá zelená); úrady a sumy k 1. 1. 2027 (Sociálna poisťovňa; rodičovský a daňový bonus 2027 ešte nezverejnené – poznámka), odvodová úľava 300 €, „Orientačná suma“ a upozornenie po dátume kontroly; skryté zvyšky Premium; oprava pádu Menštruačného kalendára.

## Rozpracované / ďalej

- Ikony namiesto textu (nové pravidlo) – najprv kruh a karty; navrhne UI dizajnér.
- **2.9:** fotky a nahrávky v IndexedDB (`g2-media.js`, `guguboo-m-media`, stav schéma 2), záloha schéma 2 aj s médiami, vlastné písmo Montserrat (`fonts/`, bez Google Fonts). 2.8.1–2.8.3: opravy úvodu a rozmazaného textu na iPhone.
- **3.0:** ikony (kruh, okná, Mama, Čas pre teba – bez emoji v ovládaní, 33 ikon Phosphor), názvy bez negatív („Čo je bežné“, „Nálada a podpora“), 84 kratších textov, hľadanie = GuguChat (zásuvka len aplikácie), ukážkový režim `app.html?ukazka=pred|po` pre web.
- **3.1:** mimo kruhu na domove vrátený vzhľad spred 3.0 (ikony, štýly, hlavička bez 2.8.3 – rozmazanie na iPhone #9 ostáva otvorené); názvy bez negatív, kratšie texty a hľadanie = GuguChat ostávajú. Ďalej: pokojnejší úvod GuguChatu (návrh UX, čaká na Sama).
- **3.4 – kruh = tracker** (schválený `prototyp-tracker.html`): esovité diely 3–5, v dieli len ikona (nová sada) a jemný stav,
  stred „Dnes“ (ikona hodín) alebo bežiaci časovač. Po pôrode Kŕmenie · Spánok · Plienky (+ Odsávanie, Na brušku – prepínač
  „Čo sledujem v kruhu“ v okne Dnes a v Nastaveniach); pred pôrodom Pohyby · Pitie · Vitamíny („Čo beriem“) · Pre lekára,
  od 36. t. Kontrakcie namiesto Pitia; od 1 roka bez zmeny. Okná dielov = miniappky (súhrn dňa, os dňa, 7 dní), Prehľad dňa
  s posunom času a zmazaním. Údaje: `state.v5.supplements`, `ringExtras`, `tummyTimer`, udalosti „Odsávanie“ a „Na brušku“
  (všetko v `guguboo-m-state`, záloha ich berie). test.html: 64 zelených.
- **3.5 (Samo 25. 11.):** album 100 dní spolu bez červeného 💯 (albumy majú linkové ikony, 🔒 → ikona zámku); skratky na domove
  jemnejšie (600, tlmená farba); v okne Dnes namiesto odkazu „Čo sledujem v kruhu“ ikony dielov + „+“; pred pôrodom vlastný
  výber dielov (Pohyby vždy, od 36. t. aj Kontrakcie; Pitie, Vitamíny, Pre lekára, Bruško, Hlas; spolu 3–5) – `state.v5.ringPre`.
- **3.5.1:** oprava textov o príprave umelého mlieka (Rodina → Úlohy v rodine → Delegovať rutinu) – pôvodne 2.6.1, bola len lokálne.
- **3.6 – 3.6.4 – jednotná typografia (Samo 26. 11.):** `g2-text.css` (posledný CSS) so 7 štýlmi (Titulok, Nadpis, Silné, Telo,
  Popis, Štítok, Číslo) – domov, lišta, huby, okná, kruh a jeho okná, Prehľad dňa, Všetko, GuguChat, nastavenia, Aktivity, úvod;
  deň aj noc. Domov: 12 → 8 kombinácií písma pred pôrodom, 12 → 9 po pôrode; na 35 obrazovkách spolu 68 → 18 po pôrode a 53 → 17 pred pôrodom (veľkú časť zvyšku tvoria šípky „›“ a „×“).
  test.html: sada Typografia (70 riadkov: 67 zelených, 3 známe nálezy). Ďalej: **3.7 upratanie** starých pravidiel písma (g2-type.css,
  `!important` v master.css, viacnásobné hlavičky vo v2.css) a odobratie `!important` z g2-text.css; šípky „›“/„×“ → ikony;
  rozhodnúť stav v dieli kruhu (10,5 px, pri 13 px sa nezmestí). 3.6.5: dorovnanie po grafickej kontrole (domov bez kapitálok, skratky Popis, pozdrav na 2 riadky).
- **3.7 – 3 úrovne textu na obrazovke (Samo 26. 11.):** Hlavné 800 18 · Bežné 500 15 · Drobné 500 14 sivá · Odkaz 700 15 fialová
  (tokeny `--t-main/-text/-small/-link` v `g2-text.css`, staré názvy sú aliasy). Domov 6 → 4 kombinácie pred pôrodom (3 úrovne + „Neskôr“) a 6 → 3 po pôrode,
  hlavné obrazovky 4–7 → 3–5, všetkých 35 obrazoviek ≤ 5. test.html: nový test hlavných obrazoviek (≤ 5), domov ≤ 4.
  Ďalej ostáva upratanie starých pravidiel (g2-type.css, `!important`) a šípky „›“/„×“ → ikony.
- **3.7.1:** čísla súhrnu v oknách kruhu (a Pitný režim, počasie) = Hlavné 18/800, nikdy väčšie ako nadpis okna (24/44 len bežiaci
  čas); v Mame rovnaký názov kariet aj riadkov (Bežné), „pridať pohár · nastaviť“ = Odkaz; drobné texty v oknách kruhu, Aktivitách
  a súkromnom denníku len v jednej sivej, akcie fialové. test.html: nové kontroly (text v okne ≤ nadpis, Mama jeden názov, domov
  pozdrav = meno = úloha).
- **3.8 (Content & Safety kolo 3 + Texty kolo 3, Samo 26. 11.):** Pohyby sa nepočítajú (v okne aj v Dnes čas posledného zápisu,
  mriežka 7 dní len „zápis áno/nie“, informatívna veta NHS „Pohyby netreba počítať – každé bábätko je iné.“ so zdrojom; E3 so zdrojom
  a dátumom z `g2-safety.js`); Pitný režim bez cieľa (preč „Denný cieľ“, výber cieľa, pruh a hláška „splnené“); jednotné názvy:
  Pitný režim, Čo beriem, Otázky pre lekára, Môj hlas pre bábätko, Odsávanie, stred „Dnes“ (aj aria a zdieľanie), „Rýchle záznamy“
  aj pred pôrodom, „kontrola“, „Spánok a zvuky ›“, „Prsník“, toasty „… sa meria“; Odsávanie bez predvolených 90 ml; prehliadka
  (v2-tour) opisuje aktuálny kruh; Hlas #101 so zdrojom a dátumom. Nepridané (Samo: rada/postup): bezpečný spánok pri Na brušku (S2),
  kofeín (S3). test.html: nové testy Pohyby bez počítania a Pitný režim bez cieľa.
- **3.9 – grafické dorovnanie:** stav v dieli kruhu 14 px (Drobné) alebo v diele vynechaný (už nie 10,5 px; ikony na mieste);
  šípky „›“ „‹“ a „×“ → linkové ikony `chevronRight` / `chevronLeft` / `close` (`GugubooV5.glyph`, 1em, currentColor) v appke
  aj v moduloch (GuguChat, Úrady, Momenty, Albumy, Menštruačný kalendár, Aktivity, Zúbky, prehliadka, okná); zámok denníka = ikona;
  malý telefón len cez CSS podľa výšky (375 × 667 kruh ~165–187 px, 320 × 568 domov bez posúvania). test.html: nová sada
  „Grafické dorovnanie (Master 3.9)“, výnimka „stav v kruhu pod 13 px“ zrušená. Zostáva: staré V1 časti (`v4-upgrade.js`,
  skrytá V1 navigácia v `app.html`) majú ešte znaky/emoji – v Master sa neukazujú. Na rozhodnutie: kratší stav („45 min“ namiesto
  „pred 45 min“), aby sa zmestil aj v dieloch po pôrode. Po vizuálnej kontrole (QA 3.9): stred malého kruhu len „Dnes“,
  320 × 568 tesnejšie medzery, v noci bez tmavého bloku v karte týždňa, nadpis okien kruhu pri okraji, nový zámok, fajka
  v Pláne ako ikona, „×“ v „3×“ hrubšie; test.html: stred kruhu vs. ikony dielov (76 zelených).
- **3.9.1 (Samo 27. 11.):** Hlavné 700 namiesto 800 (token `--t-main`, pozdrav a úloha dňa boli príliš hrubé); prehliadka
  zladená s 3 úrovňami (nadpis Hlavné, text Bežné, „Vitaj v Guguboo“ / počítadlo Drobné bez roztiahnutia, „Teraz nie“ Odkaz),
  fokus po otvorení na nadpis (aj okno Údaje a záloha); nič v okne väčšie ako nadpis (Pitný režim, Upraviť, koniec úvodu po pôrode);
  dorovnané Plán, okná kruhu, Oznámenie, úvod. test.html: Hlavné = 700, nová kontrola ďalších okien (prehliadka, úvod pred aj po,
  Poslať prehľad, Profily rodiny, záloha, oznámenie, denník, Plán, Kalendár, Upraviť, všetky okná kruhu pred aj po). Na rozhodnutie:
  koniec úvodu po pôrode (kruh s „10 dní“ pôsobí prázdnejšie – doplniť ilustráciu?).
- Otvorené po 3.8: `web.html` (riadky ~508, 623, 964–968) ešte opisuje kruh 2.x („Náš deň“, Bruško, Pre bábätko, Prvý pohyb) –
  zosúladiť pri úprave webu; N6 (Kontrakcie v 36. t., odkaz na E7) a vety ⚕ – potvrdí pôrodná asistentka; `knowledge-monitor.mjs`
  doplniť o URL NHS (movements, week-15, birth plan, foods-to-avoid). Na rozhodnutie podľa nového pravidla (bez noriem
  a odporúčaných množstiev): veta v Pitnom režime „NHS uvádza 6 až 8 pohárov tekutín denne…“ ostala (zdroj overený 26. 11. 2026).
- Na rozhodnutie po 3.5: pridať do kruhu aj ďalšie denné záznamy (napr. Teplota, Kúpanie, Prechádzka) – zatiaľ len návrh.
- Otvorené po 3.4: v 36.+ t. je na domove skratka „Otázky pre lekára“ aj diel „Pre lekára“ (duplicita – rozhodne Samo);
  Bruško a Hlas sú už len v Našich momentoch; vety o Pitie/Na brušku bez noriem – overiť v teste s mamami.
- Fáza 1 ďalej: časová os nárokov (náhľad) · rozmazanie na iPhone 16e (úloha #9) · kontrola na iPhone a Androide · test s mamami. Prototyp kvetu namiesto kruhu (`prototyp-kvet.html`) – rozpracovaný.
- Na rozhodnutie: ako počítať týždeň (39+0 = 39. alebo 40.), vek v dňoch sa mení o poludní; Menštruačný kalendár ešte sám hodnotí menštruáciu > 7 dní (audit #28).
- Spustenie guguboo.com: PR #8 (čaká na Sama – keď sa začne testovanie).
- Web guguboo.com: zapnúť Netlify Form detection, doplniť dátum účinnosti a e-mail na pozvánky v `sukromie.html`,
  právnik pred spustením. Potom web + Master nahradia V1 na guguboo.com (cez PR do `main`).
- Písmo appky: Montserrat sa načítava z Google Fonts – nahradiť vlastným hostovaním (čaká na súhlas Sama).
- Fotky a nahrávky sú v `localStorage` (~5 MB) – presun médií do IndexedDB.

## Pozor

- Vetva `main` je stará (V7.6 z 25. 9. 2026). Pracuje sa vo `v2` – v GitHub Desktop musí byť *Current branch: v2*.
- Interné analýzy agentov (hodnotenie konkurencie, návrhy) sú len lokálne na Samovom PC – repo je verejné.

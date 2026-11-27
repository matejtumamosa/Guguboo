# Rozhodnutia

Najnovšie hore. Formát: dátum – kto – čo a prečo. Staršie rozhodnutia Samuela (28. 9. 2026) sú
v `guguboo-v2/docs/00-audit-a-plan.md`.

## 2026-11-27 – Samo (Master 3.9.2: skratky ostávajú s textom, tri nové ikony)
- **Skratky na domove ostávajú s textom.** Slepý test (`guguboo-master/prototyp-skratky.html`) ukázal, že bez textu fungujú
  len Kalendár, Zúbky, Aktivity (kocky) a Starostlivosť (zavinuté bábätko); Tvoje telo, Čo je bežné, obe knižky, Otázky pre lekára
  a Príprava na pôrod nie – v každom období by bola aspoň jedna nezrozumiteľná. Sprievodca to nezachráni (skratky sa menia podľa obdobia).
- **Nové ikony všade, kde je funkcia:** Starostlivosť `swaddle` (namiesto ruky so srdcom – pôsobila ako charita),
  Aktivity `blocks` (namiesto postavy – pôsobila ako cvičenie), Otázky pre lekára `doctorQ` (rovnaká ako diel kruhu).

## 2026-11-27 – Samo (Master 3.9.1: Hlavné 700, prehliadka podľa systému)
- **Hlavné = 700 namiesto 800** (token `--t-main` v `g2-text.css`, platí všade: pozdrav, meno bábätka / týždeň, úloha
  „Dnes stačí jedno“, nadpisy okien a kariet, aj úvod). Prečo: Samo – „Dobrý deň, Kristína“ a „Ozvi sa pediatrovi po návrate
  domov“ boli „strašne hrubé“. Odkaz ostáva 700 vo farbe značky; 800 už len pri bežiacom čase (Číslo).
- **Prehliadka (`v2-tour.js`) zladená s 3 úrovňami:** nadpis = Hlavné (predtým 19–22 px), text = Bežné, „Vitaj v Guguboo“ /
  počítadlo krokov = Drobné bez roztiahnutia písmen (predtým 11 px fialové tučné), „Teraz nie“ / „Preskočiť“ = Odkaz vo farbe
  značky (predtým 16/800 sivé), popisky lišty v kroku Spodná lišta = Drobné. Texty bez zmeny. Fokus po otvorení na nadpis
  (bez rámika), ako okná kruhu v 3.9 – rovnako okno Údaje a záloha. V noci „Teraz nie“ bez tmavého obdĺžnika a iskra viditeľná.
- **Nič v okne nie je väčšie ako jeho nadpis – ani v úvode:** počet pohárov v okne Pitného režimu (bol 44 px), upravovaný čas
  v okne Upraviť (36 px) a vek bábätka na konci úvodu po pôrode (bol 44–54 px) sú Hlavné. Výnimka ostáva len pre bežiaci čas.
- Dorovnané podľa nového testu: Plán („Čoskoro“ bez kapitálok, „budúci týždeň“ 12 px → Drobné), okná kruhu (dni a hodiny
  v mriežke Pohybov a dni v Čo beriem 11–12 px → Drobné, „dnes“ len farbou; položky Čo beriem a otázky = Bežné; „Upraviť“
  v Prehľade dňa = Odkaz), Oznámenie (voľby 13,5/600 → Bežné, nadpisy kariet = Hlavné), úvod (tlačidlá a odkazy boli 500 –
  prehrávali kvôli váhe `:is()`, teraz Odkaz; „Späť“ vo farbe značky).
- **Na rozhodnutie (Samo):** koniec úvodu po pôrode – v kruhu je teraz len „10 / dní“ v Hlavnom (predtým veľké číslo), kruh pôsobí
  prázdnejšie; možnosti: nechať, alebo doplniť ilustráciu bábätka ako pred pôrodom (ovocie).

## 2026-11-27 – Product Lead (Master 3.9: grafické dorovnanie)
- **Stav v dieli kruhu má vždy 14 px (úroveň Drobné, min. 13 px), alebo sa v tom diele vynechá** (pravidlo 3.4) – už žiadna
  výnimka 10,5 px. Ikony ostávajú presne na mieste ako v 3.8 (poloha sa nepočíta s väčším stavom). Dôsledok: na 390 × 844 sa
  zmestia krátke stavy (čas, „3×“, „1 z 2“, „2 otázky“, „120 ml“, „bdie 2 h“); „pred 45 min“ sa do pásu nezmestí nikde a na
  375 × 667 / 320 × 568 ostáva v kruhu väčšinou len ikona. Stav je vždy aj v aria-label dielu a v okne dielu.
- **Šípky „›“ „‹“ a zatvorenie „×“ sú linkové ikony** (`chevronRight`, `chevronLeft`, `close` v `iconPaths`, ťah 16), v texte cez
  `GugubooV5.glyph(…)` – veľkosť 1em, farba textu. Texty a aria-labely bez zmeny. „×“ ako „krát“ pri počtoch („3×“) ostáva písmom.
- **Zámok v súkromnom denníku = ikona `lock`** (nie emoji 🔒) – v ovládaní nie emoji.
- **Malý telefón (len CSS podľa výšky):** pod 720 px kruh vyplní celú výšku karty a karta má tenší okraj (375 × 667: kruh ~165–187 px);
  pod 600 px sa karta kruhu smie zmenšiť pod 150 px, aby sa domov neposúval (320 × 568: kruh ~95–140 px); na úzkom a nízkom
  telefóne (šírka < 360, výška < 660) majú skratky len názov bez ikony (názov sa inak orezával).
- **Po vizuálnej kontrole (QA 3.9):** malý kruh (≤ 150 px) má v strede len slovo „Dnes“ bez hodín; na 320 × 568 tesnejšie
  medzery domova (kruh v 38. t. 95 → 127 px); v noci text karty týždňa/bábätka bez vlastného pozadia; okná bez tlačidla späť majú
  nadpis pri okraji; zámok s užším a vyšším oblúkom (ikona `lock` všade); „✓ Vybavené“ v Pláne a Úradoch = ikona `check`;
  „×“ v stave „3×“ hrubšie ako písmo okolo.
- **Retest QA 3.9:** názov skratky na domove je vždy celý v karte s okrajom aspoň 8 px – na šírke ≤ 380 px Drobné 14 px,
  na ≤ 359 px 13 px s tesnejším písmom a medzerou kariet 4 px (text sa neskracuje). Okno kruhu po otvorení dáva fokus nadpisu
  (nie prvému tlačidlu – bez rámika po ťuknutí). V Mame pri Pitnom režime už nie je „· nastaviť“ (zvyšok po cieli z 3.8).

## 2026-11-27 – Samo (Master 4.0, časť B: zdravotný obsah podľa pravidla „sprievodca, nie lekár“)
- Podľa auditu `AUDIT_3.9.2_ZDRAVIE.md` (opravy „podľa pravidla“) sa zo zobrazovaného obsahu **odstránilo**: limity kofeínu
  a rýb (Mama aj GuguChat – namiesto nich otázka pre lekára), cieľ 150 min pohybu a počítadlá v Cvikoch, postup a dávka cvikov
  po pôrode (ostáva na čo sú + odkaz NHS + otázka), „Tip na tento týždeň“ (rady), rady a normy vo vetách „Ty“ (skrátené na
  informatívnu časť), vety „by sa malo hýbať“ (nahrádza E3 v Tvojom týždni od 24. t.), rada o urýchlení pôrodu (42. t.),
  míľniky „Väčšina … do N mesiacov“ (→ „V tomto období mnohé…“), zoznam „ak zatiaľ nerobí…“ (→ štandardná veta + otázka),
  rady a limit obrazovky v Tvojom mesiaci, obdobia po 12. mesiaci (skryté, dáta ostávajú), postupy bezpečného spánku
  (→ jeden odkaz „Bezpečný spánok – NHS“ v `g2-safety.js`, ⚕), vyhodnocovanie menštruácie („> 7 dní“, špinenie) a norma
  „cyklus okolo 28 dní“, predvyplnená teplota fľaše, rada pri Zúbkoch (→ informatívna veta NHS so zdrojom), rady v Počasí
  (ostáva počasie + pár viet „NHS/WHO uvádza…“ so zdrojom; bez „Čo zobrať“, bez normy izby 16–20 °C, bez zdrojov cez TASR),
  pokyny k telu v kruhu („Nohy si polož vyššie“, „Podopri si chrbát“) a nesúvisiace zdroje.
- **155 / 112 a bezpečnostné vety len v `g2-safety.js`:** GuguChat, Zúbky a kruh preberajú E1/E3/E5/E6/E7 doslovne. E6 a E7
  majú zdroj a dátum overenia (27. 11. 2026).
- Prečo: Guguboo je sprievodca, nie lekár – len ľahké informatívne tvrdenia so zdrojom; radšej menej obsahu ako rada či norma.
- Kontrola: `test.html`, sada „Sprievodca, nie lekár“ (zakázané formulácie: mg, „najviac N“, „mala by si“, „by sa malo“,
  „aspoň N-krát“, „N minút týždenne“, „Väčšina … do N“, limit obrazovky, „cieľ“ v zdravotných textoch; 155/112 mimo g2-safety.js).
- Na rozhodnutie Sama ostáva: Z10 (Dýchaj so mnou), Z12 postupy v úlohách Rodiny, Z15 (zoznam „vynechať“, alkohol, tipy pri
  pohybe), Z32, Z33, Z35. Úradné sumy 2027 (Z28–Z30) bez zmeny – treba overiť po zverejnení.

## 2026-11-26 – Samo (Master 3.8: sprievodca, nie lekár; jednotné názvy kruhu)
- **Guguboo je sprievodca, nie lekár:** smú byť len ľahké informatívne tvrdenia so zdrojom a dátumom overenia; nikdy rada,
  postup, diagnóza, norma ani cieľ (za tie nenesieme zodpovednosť). Existujúce bezpečnostné odkazy na lekára/pôrodnicu
  (`g2-safety.js`) ostávajú. Preto sa v 3.8 nepridala veta o bezpečnom spánku pri Na brušku (postup) ani o kofeíne (odporúčanie).
- **Pohyby bez počítania (NHS Your baby's movements, overené 26. 11. 2026: „You do not need to count…“, „every baby is different“):**
  appka nikde neukazuje počet pohybov – v okne Pohybov aj v okne Dnes len čas posledného zápisu, mriežka 7 dní ukazuje len,
  v ktorej hodine je zápis (bez sýtosti podľa počtu). Informatívna veta „Pohyby netreba počítať – každé bábätko je iné.“ so zdrojom;
  pod ňou E3 so zdrojom a dátumom z `g2-safety.js`. Prečo: počítanie pôsobí ako norma a zápisy nie sú skutočné pohyby.
- **Pitný režim bez cieľa:** len počet pohárov dnes (a 7 dní v okne kruhu); preč „Denný cieľ“, jeho nastavenie, pruh k cieľu
  a hláška „Denný cieľ pitia je splnený“. Staré pole `goal` v údajoch sa ignoruje.
- **Jednotné názvy (jedna vec = jeden názov):** Pitný režim (aj diel kruhu), Čo beriem (nie Vitamíny), Otázky pre lekára,
  Môj hlas pre bábätko, Odsávanie, Prsník; stred kruhu „Dnes“ (aj aria-label a zdieľaná správa „Dnes do …“); kruh = „Rýchle
  záznamy“ pred aj po pôrode; termín „kontrola“ (nie prehliadka); odkaz „Spánok a zvuky ›“; bežiaci čas „… sa meria“.
- Odsávanie bez predvoleného množstva pri prvom zápise (Uložiť až po voľbe) – predvolba pôsobila ako „očakávané“ množstvo.
- Plán pôrodu: veta „Pôrod sa nie vždy dá naplánovať.“ ostáva (NHS, emocionálna ochrana) – skrátenie zamietnuté.

## 2026-11-26 – Samo (Master 3.7: 3 úrovne textu na obrazovke)
- **Na jednej obrazovke najviac 3 úrovne textu + odkaz** (prísnejšie ako 7 štýlov z 3.6): **Hlavné** 800 18 tmavá (pozdrav, meno
  bábätka / týždeň, úloha „Dnes stačí jedno“, hlavičky okien) · **Bežné** 500 15 tmavá (skratky, hľadanie, „Dnes“ v kruhu, obsah) ·
  **Drobné** 500 14 jediná sivá (podnadpisy, štítky bez kapitálok, lišta, stav) · **Odkaz** 700 15 farba značky (len ťukateľné
  textové odkazy a text tlačidiel). Číslo (časovač, počty) len v oknách. Prečo: Samo po 3.6.5 videl na domove stále „asi
  10 veľkostí“ – domov mal 6 podôb textu, teraz 3 úrovne (+ odkaz „Neskôr“ pred pôrodom).
- 3.7.1: v okne nie je žiadny text väčší ako nadpis okna (čísla súhrnu = Hlavné; 24/44 len bežiaci čas); rovnocenné karty
  a riadky majú rovnaký názov (napr. v Mame „Čas pre teba“ = „Pitný režim“ = riadky).
- Aktívna položka lišty/záložky len farbou; fialová len na odkazy; kapitálky už nikde. Rozloženie, farby plôch, ikony a texty bez zmeny.
- Test (`test.html`): domov ≤ 4 kombinácie veľkosť + hrúbka, Bábätko · Mama · Rodina · Prehľad dňa · Kŕmenie · Všetko · GuguChat ≤ 5.

## 2026-11-26 – Samo (Master 3.6: jednotná typografia)
- **7 štýlov písma pre celú appku** (`guguboo-master/g2-text.css`, načítava sa ako posledný CSS, tokeny `--t-*` pre deň aj noc):
  Titulok 800 20/26 · Nadpis 800 17/22 · Silné 700 15/20 · Telo 500 16/24 · Popis 500 14/20 (jediná sivá) ·
  Štítok 700 13/16 · Číslo 800 24/28 (veľké 44/48). Prečo: appka mala 24 veľkostí, 6 hrúbok a 6 druhov kapitálok –
  pôsobilo to ako „rôzne fonty“.
- **Pravidlá:** hrúbky len 500/700/800; kapitálky len pri Štítku sekcie („Dnes stačí jedno“, kicker týždňa/mesiaca, skupiny Plánu);
  jedna čierna `#29243a` a jedna sivá `#5d5768` (noc `#f5f2fb` / `#c9c3d8`); sekundárny text min. 14 px, 13 px len Štítok;
  stav (aktívne/vybrané) len farbou, nie hrúbkou; jeden Titulok na obrazovku – vnútorný nadpis okna je Nadpis.
- **Domov:** pozdrav = Titulok (rovnako ako hlavičky Bábätko/Mama/Rodina), meno bábätka / týždeň = Nadpis; skratky na domove
  = Štítok bez kapitálok, tlmené ako popisky v lište (nahrádza 600 a sivú z 3.5).
- **3.6.5 (po nezávislej grafickej kontrole):** „Dnes stačí jedno“ je Štítok bez kapitálok v tlmenej farbe – na domove už
  nie sú kapitálky; odkazy („Neskôr“, „Zapísať spätne ›“) jednotne Silné vo farbe značky; skratky na domove = Popis
  (500 14/20 – tenšie, väčšie riadkovanie; 600 je mimo systému); stred kruhu „Dnes“ = Silné; súhrn v oknách kruhu
  („dnes / naposledy“) = Popis; pozdrav sa na úzkom displeji neoreže, smie mať dva riadky.
- **Kontrola:** `test.html` – sada Typografia (na domove pred aj po pôrode ≤ 12 kombinácií písma, nič pod 13 px, hrúbky 500/700/800).
- Zatiaľ ostáva: šípky „›“ a „×“ ako písmo (neskôr ikony), stav v dieli kruhu 10,5 px (pri 13 px sa do dielu nezmestí) –
  na rozhodnutie. Upratanie starých pravidiel písma (g2-type.css, master.css…) = Master 3.7.

## 2026-11-24 – Samo (Master 3.4: kruh = tracker)
- **Kruh na domove = tracker** podľa schváleného `guguboo-master/prototyp-tracker.html` (tvar 2.9, esovité diely, 3–5 dielov).
  V dieli len ikona (názov je v aria-label a hlavičke okna) a pod ňou jemný stav, ak sa zmestí; inak sa stav vynechá len v tom diele.
  Ikony jemne (priehľadnosť .58, v noci .7). Stred: ikona hodín + slovo „Dnes“ (Prehľad dňa), alebo bežiaci časovač.
- **Obsah:** po pôrode Kŕmenie · Spánok · Plienky + voliteľne Odsávanie a Na brušku („Čo sledujem v kruhu“); pred pôrodom
  Pohyby · Pitie · Vitamíny · Pre lekára, od 36. týždňa Kontrakcie namiesto Pitia; od 1 roka Jedlo · Spánok · Aktivita.
  Bruško a Hlas z kruhu vypadli (ostávajú v Našich momentoch). Prvý pohyb: kým nie je zapísaný, okno Pohybov ukáže pokojné očakávanie.
- **„Ak to má byť v kruhu, musí to byť funkčná miniaplikácia“:** každé okno dielu má súhrn dňa a malú os dňa / 7 dní, veľké
  tlačidlá, jednu obrazovku – bez rád, noriem, cieľov a hodnotenia. Pohyby „Tvoj rytmus“ (mriežka 7 × 24, veta len z g2-safety E3),
  Pitie (ten istý stav ako Pitný režim v Mame), Čo beriem (vlastný zoznam, appka nič nenavrhuje, 7 bodiek týždňa, pripomienka
  cez .ics), Pre lekára (otázky na prehliadku, najbližší termín Zdravie z Kalendára, „zodpovedané“).
- **Nová sada ikon** (po slepých testoch): breastfeed, sleepZ, diaperFront, breastPump, tummyTime, bellyKick, glassWater, capsule,
  doctorQ, bellyWave – v `iconPaths`, linkové (ťah 16).

## 2026-11-17 – Samo (kruh)
- **Verzie kruhu** sú uložené ako snímky v `znalosti/kruh-verzie/` (README s poznámkami). Smer: návrat k originálu (Master 2.9) alebo k variantu D (živá scéna), prípadne niečo medzi.
- **Pravidlo pre návrhy:** pochopí to unavená mama za 2 sekundy bez vysvetlenia – žiadne farebné kódy ani abstraktné grafy; pred ukázaním Samovi návrh posúdi nezávislý agent len zo snímky.
- **Ikony ostávajú** (3.0), texty čo najkratšie (3.3); 3.1 (návrat ikon) bol omyl.

## 2026-11-25 – Samo (Master 3.5)
- **Umelé mlieko (Master 3.5.1, pôvodne 2.6.1):** appka neuvádza žiadnu teplotu vody ani pomer – presný postup je na balení
  každého mlieka a výrobcovia sa líšia. Úloha „Pripraviť fľašu“ odkazuje na návod na balení + spoločné body NHS: čerstvo na jedno
  kŕmenie, nie mikrovlnka, test na zápästí, zvyšok vyliať. Pole „Voda / teplota“ → „Voda / príprava“. Zdroj: NHS 111 Wales
  (overené 16. 11. 2026).
- **Bez červeného 💯:** albumy majú linkové ikony (Naše čakanie srdce, 100 dní spolu kalendár, Moje prvé iskra, Prvý rok slnko);
  míľnik 100 dní na časovej osi 🌼. Emoji ostáva len v obrázku albumu na zdieľanie.
- **Skratky na domove:** názov jemnejším písmom (600) a tlmenou farbou – ikona nesie význam, text len tam, kde treba.
- **Kruh sa dá prispôsobiť:** v okne Dnes ikony dielov + „+“ (nie skrytý textový odkaz). Po pôrode Kŕmenie, Spánok, Plienky vždy
  (+ Odsávanie, Na brušku). Pred pôrodom Pohyby vždy, od 36. t. aj Kontrakcie; voliteľne Pitie, Vitamíny, Pre lekára, Bruško, Hlas.
  V kruhu je 3 až 5 dielov (viac sa nezmestí čitateľne). Tým sa dá vyriešiť aj duplicita „Pre lekára“ v 36.+ t.

## 2026-11-16 – Samo (plán k 9–10/10, spustenie)
- **Plán Fáza 1 schválený** (zhoda tímu: hodnotiteľ, stratég, UI, UX, Content & Safety, architekt):
  testovacia stránka · úrady a sumy k 1. 1. 2027 · skryť zvyšky Premium · fotky a hlas do IndexedDB + záloha ·
  overenie na iPhone (Samo) · vlastné písmo · ikony (v kruhu ikona + slovo, „Dnes stačí jedno“ ostáva slovom) ·
  časová os nárokov ako náhľad · test s mamami. Fáza 2 až po teste.
- **Bez garanta a bez režimu pre stratu tehotenstva / vážne situácie** – appka na to nie je zameraná.
- **Spustenie guguboo.com:** nová úvodná stránka + appka Master nahradí V1 cez PR do `main` (Samo zlúči, keď sa začne testovanie).
- **Testy:** pred každým commitom appky musí byť `guguboo-master/test.html` celý zelený.
- **Spoplatnenie zatiaľ nerozhodnuté:** nikde nesľubovať „zadarmo“ natrvalo ani ceny – len „počas testovania zadarmo“.
- **Smer spoplatnenia (podľa analytika, Samo súhlasí):** jeden balík na celú cestu (tehotenstvo až 1. narodeniny), nie zvlášť
  pred a po pôrode; 14 dní na vyskúšanie; časť natrvalo zadarmo (týždeň a veľkosť bábätka, základný zápis, otázky pre lekára,
  základ úradov, bezpečnostné vety); orientačne „Celá cesta“ jednorazovo 39–49 € alebo mesačne 4–5 €; od 36. týždňa
  do 6 týždňov po pôrode žiadna výzva na platbu; možnosť darčeka (partner, starí rodičia). Po skončení predplatného sa
  vlastné záznamy a záloha nikdy nezamknú. Nespoplatňovať pred testom s mamami – presnú cenu overiť v teste.
  Technika (keď príde čas): platobná brána ako predajca (Stripe Managed Payments, náhradne Paddle), lístok o platbe v telefóne,
  bez vlastných účtov; právne texty a DPH s právnikom a účtovníkom.

## 2026-11-16 – Samo (Master 2.7)
- **Jeden spôsob práce:** všetci pracujú vo vetve `v2`, priamo v `guguboo-master/` (Claude na Samovom PC predtým
  pracoval v lokálnej vetve a do `guguboo-master/` len kopíroval – zrušené, aby sa si práca neprepisovala).
- **Informujeme, neradíme (platí pre celú appku aj GuguChat):** pri zdravotnej téme len *čo je bežné* (zo zdroja,
  „každé … je iné“) + jedna pokojná veta, kedy sa ozvať lekárovi + tlačidlo **„Zapísať ako otázku pre lekára“**.
  Nikdy postupy pri príznakoch, „mala by si“, vek ako pokyn (príkrmy appka nediktuje), lieky a dávky, samohodnotenie
  ani zoznam toho, čo robí lekár na prehliadke. Vážne situácie (E1–E7) majú jednu pokojnú vetu na jednom mieste:
  `g2-safety.js`. Vety označené ⚕ má pred testom s ľuďmi potvrdiť pediater / pôrodná asistentka (garant).
- **Otázky pre lekára** sú na jednom mieste s časťami *Pre mňa* a *Pre bábätko* (`state.v5.doctorQuestions`).
- **Rozsah:** appka sa rieši do 1. roka bábätka; obdobie od 1 roka sa dopracuje po spustení.
- **Ikony namiesto textu (nové pravidlo):** kde sa dá, nahradiť text peknou, jemnou ikonou, ktorá navodzuje pokoj
  a vysvetľuje význam (napr. diely kruhu). Texty stále minimalizovať.
- **Web guguboo.com** (náhľad `web.html`): formulár testeriek cez Netlify Forms s minimom údajov (bez týždňa
  tehotenstva – zdravotný údaj), web bez Google Fonts. Pôvodnú V1 nikto nepoužíva – pri spustení ju Master nahradí.
- **GuguChat ako AI** až po testoch, hlavne ako navigátor po appke; **odborný garant** (pediater) – hľadáme.

## 2026-11-16 – Samo
- `CLAUDE.md` zosúladený s praxou (úložisko `guguboo-m-*`, `sw.js` CACHE, prototypy, QA, verejné repo).
  Každé nové rozhodnutie o dizajne, textoch alebo postupe sa zapisuje sem, aby ho videl aj Matej.
- Oprava prípravy umelého mlieka – odložené, vyriešené v Master 3.5.1 (25. 11.).

## 2026-11-15 – Samo (Master 2.0 – 2.6)
- **Čas pre teba (2.0 – 2.1):** kruh z prototypu `prototyp-kruh.html` – stred = okamžitá pomoc bez otázok, Oddych · Telo · Opora
  ako priamo použiteľné nástroje; bez odmien, počtov a otázky na náladu, nič sa neukladá. Presunutý z domova navrch sekcie Mama.
- **Kruh na domove = rýchle záznamy (2.1 – 2.2):** jedno pravidlo pre všetky obdobia. Tehotenstvo: Pohyby · Bruško · Hlas
  (od 36. týždňa Kontrakcie); 0–12 mesiacov: Kŕmenie · Spánok · Plienky; od 1 roka: Jedlo · Spánok · Aktivita.
  Ťuk nikdy hneď neuloží – otvorí malé okno; po uložení „Uložené · Vrátiť“. Stred = bežiaci časovač alebo „Náš deň“.
- **Bez duplicít (2.2.2):** čo je v kruhu, nie je skratkou; kŕmenie, spánok a plienky sa zapisujú všade rovnako.
- **Pokojné názvy (2.2):** napr. „Keď sa bábätko trápi“ → „Starostlivosť o bábätko“.
  **Rozsah zmien (Samo 16. 11.): meniť sa má LEN kruh (→ kvet); ostatný dizajn appky ostáva, ak Samo výslovne nepovie inak.**
  **Kvet prípravy (Samo 16. 11., smer – rozhodne sa po prototype):** v tehotenstve kvet namiesto kruhu – lupene = kategórie Plánu (pôrodnica, úrady, výbava, pediater…), farbia sa aj plynutím času, nikdy nepôsobia ako „nesplnené“; nahrádza vizualizáciu Plánu (bez duplicity), riadok Dnes ukáže lupeň na rade; podržanie stredu otvorí ikony (s viditeľným náznakom a náhradou ťuknutím). Po pôrode ostáva kruh rýchlych záznamov. Prototyp `guguboo-master/prototyp-kvet.html`.
  **Hľadanie = GuguChat (Samo 16. 11.):** pole „Hľadaj alebo sa opýtaj“ a lupa otvárajú len GuguChat; zásuvka Všetko (spodná lišta) obsahuje len aplikácie.
  **Pravidlo (Samo 16. 11.): v názvoch a ikonách nekomunikujeme negatíva** – „Bežné ťažkosti“ → „Čo je bežné“, „Keď je mi ťažko“ → „Nálada a podpora“, bez náplastí a varovných ikon. Bezpečnostné vety (g2-safety.js) ostávajú.
- **Zdieľanie s partnerom (2.2):** cez telefón (text + .ics do kalendára, pozvánka do Guguboo), bez servera.
  Účty a synchronizácia prídu neskôr (Matej).
- **Lišta ako záložky (2.3):** Bábätko, Mama, Rodina sú záložky – bez šípky späť a ×; tie majú len okná otvorené z nich.
- **Počasie automaticky (2.4):** mesto alebo približná poloha, poloha sa neukladá; rady len z overených zdrojov.
  Hranice chladno/teplo (pocitovo pod 10 °C / nad 24 °C) sú produktové rozhodnutie, v appke to tak aj píšeme.
- **Kruh podľa zhody tímu (2.5):** „naposledy“ do hodiny v minútach, potom v hodinách, po 24 h nič – žiadna výčitka.
  Pohyby bábätka sa zapisujú z kruhu, appka sa na ne nepýta (žiadny tlak).
- **Údaje v telefóne (2.6):** natrvalo len v telefóne (`localStorage`, kľúče `guguboo-m-*`), nič na server;
  záloha = súbor, ktorý si používateľ uloží sám. Appka sa dá pridať na plochu (manifest a service worker len
  pre `guguboo-master/`, aby sa V1 na doméne nezmenila).

## 2026-11-14 – Samo (Master 1.8 – 1.9.1)
- **Nový úvod (1.9):** 5 obrazoviek, len 3 otázky (obdobie → termín alebo narodenie → oslovenie),
  na konci „aha moment“. Všetko na stred, tlačidlá pevne dole, vlastný otočný výber dátumu so živým náhľadom.
  Najprv schválený prototyp `prototyp-uvod.html`. Prečo: rýchlejší štart bez formulára.
- **Jeden systém okien (1.8):** všetky okná v jednom zásobníku – späť = o krok, × = zavrie okno a ostaneš tam,
  odkiaľ si ho otvorila (nie vždy Domov), Esc, systémové späť a fokus fungujú rovnako; rozpísané údaje
  sa bez upozornenia nestratia. Prečo: každé okno sa predtým správalo inak.
- **Kruh Čas pre teba:** návrh v prototype (`prototyp-kruh.html`), zapracovaný až v Master 2.0. Stred = okamžitá
  pomoc bez otázok; bez odmien, počtov a hodnotenia nálady.
- **QA postup:** po väčšej verzii nezávislá kontrola, opravy podľa závažnosti v samostatných verziách
  (1.9.1 vysoké nálezy, 1.9.2 stredné), jeden výpočet týždňa tehotenstva pre celú appku.

## 2026-11-13 – Samo (Master 0.1 – 1.7)
- **Nový domov K-4 (0.1):** samostatná vývojová verzia `guguboo-master/` s vlastnými kľúčmi `guguboo-m-*`,
  V2 ostáva nedotknutá. Domov v jednom pevnom poradí: hľadanie · hero (týždeň/vek) · 3 skratky podľa obdobia ·
  kruh · jeden riadok „Dnes stačí jedno“. Prečo: pokoj namiesto zoznamu povinností.
- **Domov bez posúvania (1.3):** všetko na jednu obrazovku. Celý zoznam úloh je v okne Plán, na domove len jedna vec.
- **„Dnes“ = úloha (1.6.8):** v riadku je vždy vec, ktorú treba vybaviť, kúpiť alebo pripraviť; v noci po pôrode
  žiadne úlohy (len Spánok a zvuky).
- **Kruh na domove:** len Pohoda – bez percent a počtov; príprava je v okne Plán.
- **Lišta:** 4 položky Domov · Bábätko · Mama · Rodina (GuguChat nie je v lište, je na domove ako pole).
  Hľadanie v hlavičke (lupa), nie pilulka na lište (0.1.1). Lišta sa dá vytiahnuť nahor – úchyt vnútri lišty
  otvorí Všetko ťuknutím aj potiahnutím (1.6.5 – 1.6.7).
- **Zásuvka „Hľadaj alebo sa opýtaj“ (1.0):** pevné pole hľadania + krátke návrhy podľa obdobia, pod tým všetky
  funkcie v skupinách Bábätko · Mama · Rodina (poradie ako lišta). Hľadá aj hovorové slová a preklepy.
  Na domove samostatné tlačidlo „Všetko“ (1.2), lebo samotné pole nehovorí, že ukáže aj ostatné časti.
- **Starostlivosť o bábätko** (pôvodne „Keď sa bábätko trápi“) ostáva skratkou na domove celý 1. rok – vtedy je
  najviac neistoty.
- **Vývoj bábätka (1.6):** v tehotenstve odznak s okrúhlym ovocím + „N. týždeň“ + veľkosť; podrobnosti
  so štylizovanou ilustráciou až v Tvojom týždni. Po pôrode Tvoj mesiac (0–36 mesiacov, len overené vety so zdrojom).
- **Typografia (1.4 – 1.6):** čitateľnosť na mobile – bežný text ~16 px, sekundárny min. 14 px, 12 px len výnimočne;
  kontrast aj v noci.
- **Texty (1.7):** viditeľná len prvá krátka veta, zvyšok toho istého textu pod „Viac“ (text sa nemení, len rozdelí).
  Úlohy pomenované ako činnosť. Chyba sa ukáže pri poli, nie ako hlásenie.

## 2026-11-14 – Matej
- Spoločné pokyny pre Claude sú v `CLAUDE.md` a `znalosti/` v repe. Projekt v Claude chate ich načíta
  cez integráciu GitHub (po zmene „Sync now“); Claude Code ich číta sám.

## 2026-11-04 – Matej (úpravy vo V2; kód je aj v `guguboo-master/`)
- **Domov:** namiesto okna „Pre teba dnes“ je rozbaľovacie tlačidlo **Dnešný malý moment**
  (Stalo sa už?, Fotka dňa, Jedna veta, Prvé razy, Môj hlas pre bábätko, Naše momenty).
  Okno „Pre teba dnes“ (termín, súhrn dňa, tento týždeň) je vypnuté, nie zmazané – `deckHtml()` v `v2-moments.js`.
  „Oznámiť tehotenstvo“ nie je v menu, je to úloha v Kruhu prípravy.
- **Domov pred pôrodom:** okienka Tehotenská knižka, Mama, Dieťa sú len s piktogramom; vysvetlenie je v sprievodcovi.
- **Sprievodca:** všetky názvy a piktogramy presne ako v appke (nie emoji); odznak týždňa je zmenšený odznak z domova.
- **Úvod – meno:** pole „Meno bábätka“ + box „Ešte nemáme vybrané meno“ → uloží sa „Bábätko“
  (box je len pred pôrodom). Meno sa doplní pri pôrode alebo v profile.
- **Úvod – termín pôrodu:** najprv výber spôsobu (lekár / menštruácia / počatie), polia až podľa voľby.
- **Úvod – dátumy:** termín najviac 42 týždňov dopredu, menštruácia najviac 42 a počatie 40 týždňov dozadu,
  dieťa do 3 rokov.
- **Úvod – posledná stránka:** náhľad domova s okienkami len s piktogramami a karta **„Ideme na to!“** –
  cesta, po ktorej pomaly dokola chodí pulzujúci bežec po „ste tu“. Pred pôrodom cieľ „Narodenie“,
  po pôrode od „Narodenia“ k „1. narodeninám“.

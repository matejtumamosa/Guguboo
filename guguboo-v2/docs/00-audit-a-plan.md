# GUGUBOO MASTER V2 – audit a produktový plán (A–L)

> ## ✅ Rozhodnutia Samuela (28. 9. 2026) – majú prednosť pred textom nižšie
> 1. **Názov asistenta: GuguChat** (nie „GugU“). V celom dokumente čítaj GugU = GuguChat.
> 2. **Beta bez ukladania dát a bez servera.** Testerka otvorí appku, vyplní ju a pozerá. Po zatvorení
>    sa dáta zahodia (sessionStorage); pri ďalšom otvorení je appka prázdna. Server, účty, synchronizácia
>    a notifikácie mimo appky nie sú súčasťou bety.
> 3. **Zdroje:** len voľne dostupné oficiálne/overené stránky (slovensko.sk, socpoist.sk, employment.gov.sk…),
>    vždy so zdrojom a dátumom overenia.
> 4. **V2 = samostatná aplikácia, len náhľad** (vetva `v2`), nenasadzuje sa na guguboo.com.
> 5. **Matejov PR #3** – dobré zmeny (6 kľúčových krokov prípravy, hodnotové texty) preniesť do V2.
> 6. **Odstrániť:** falošnú „AI“ (nahradí GuguChat), predajnú stránku plagát/video/fotokniha (možno neskôr).
>    **Hlavný emocionálny moment: 100 dní spolu.**
> 7. **Onboarding ponechá dátum narodenia rodiča** (vek prvorodičky ovplyvňuje odporúčania, napr. pohyb)
>    **aj polohu** (lokálne služby a B2B partneri: plávanie s bábätkom, pediatri, fyzioterapeuti).
>    → V2 musí pri oboch povedať prečo sa pýta; z polohy uchová len mesto/región, nie súradnice.
> 8. **Spodné vysúvacie menu ostáva** (4 obľúbené + zásuvka), opraví sa výber obľúbených.
>    **Do stredu lišty pribudne okrúhle tlačidlo GuguChat** (ako spúšť fotoaparátu v iPhone).
>    → nahrádza návrh „3 záložky Domov/GugU/Moje“ z kap. E.
> 9. **Kruh pohody:** 3 časti podľa fázy; **pracovné/organizačné povinnosti oddeliť od psychickej
>    pohody matky** (Kruh = len pohoda; povinnosti = plán). Obsah Kruhu treba ešte vypracovať – V2 dá návrh.
> 10. **GuguChat najprv bez AI** (overené odpovede + akcie) – OK.
> 11. **Tehotenstvo:** týždenne krátko Bábätko + Ty; zdravie/príprava/úrady podľa míľnikov – OK.
> 12. **Platobný model** sa rieši až keď bude appka hotová (kap. K/O sú len podklad).
>
> ## 🛠 Stav implementácie (28. 9. 2026, V2 2.1.0)
> | Oblasť (P0) | Stav | Súbory |
> |---|---|---|
> | Samostatná V2, vlastné úložisko, beta bez ukladania (sessionStorage) | ✅ | `app.html`, `private-space.js` |
> | Journey Engine (fáza, týždeň/vek, NOW/SOON/LATER, limity 3+2, prechody) | ✅ | `journey-engine.js` |
> | Domov: Tento týždeň + Teraz/Čoskoro + „Bábätko je na svete?“ | ✅ | `guguchat.js` |
> | GuguChat v1 (zámery, akcie, pokojná eskalácia, „neviem“ → medzery) | ✅ | `guguchat.js` |
> | Spodná lišta: 2 + okrúhly GuguChat + 2, bez „Ďalšie aplikácie“, editor obľúbených | ✅ | `v5-mobile.js`, `v2.css` |
> | Kruh pohody: len pohoda mamy, 3 časti podľa fázy, bez prepínača | ✅ | `v5-mobile.js` |
> | Prechod pôrod → popôrodné obdobie + kartička narodenia | ✅ | `v2-birth.js` |
> | Tehotenstvo týždeň po týždni 4.–42. (NHS, vlastnými slovami) | ✅ `review_required` | `content/pregnancy-weeks.js` |
> | Life Admin SK (20 položiek, 14 overených, 6 čiastočne; sumy overené v pôvodnom texte stránok) | ✅ `review_required` | `content/life-admin-sk.js`, `v2-admin.js` |
> | Automatický monitoring zdrojov + kontrola súm → PR na kontrolu človekom | ✅ (beží na GitHub Actions pri zmene obsahu vo `v2`) | `tools/knowledge-monitor.mjs`, `.github/workflows/…` |
> | Matejov PR #3 (6 kľúčových krokov, hodnotové texty) | ✅ | `app.html` |
> | Tykanie v celej V2 | ✅ (správy pre úrad/HR ostávajú vo vykaní zámerne) | všetky |
> | Pokojný tón (bez trvalých núdzových pásov) | ✅ | `guguchat.js`, `v5-mobile.js` |
> | Spätná väzba z bety + metrika „GUGUBOO moment“ (lokálne, stiahnuteľný súbor) | ✅ | `guguchat.js` |
> | Odstránené: falošná AI, predajná stránka plagát/video/fotokniha, ručné počasie | ✅ | `v5-mobile.js` |
>
> **Ostáva (P1/P2):** AI vrstva GuguChatu (potrebuje server a kľúč), push notifikácie (PWA + server),
> účty/partner/synchronizácia, Document Center (predvyplnenie formulárov), trackery s dôvodom (kontrakcie,
> pohyby), očkovanie z overeného zdroja, percentily rastu, CZ modul, odborná kontrola obsahu pred ostrým spustením,
> postupné odstránenie mŕtvej vrstvy v4 a legacy obrazoviek.

> **Dôsledok pre techniku (mení kap. C2):** keďže sa ponecháva väčšina súčasných vzorov (menu, Kruh,
> moduly) a beta nič neukladá, V2 sa stavia **postupným upgradom východiskovej kópie** v `guguboo-v2/`
> (brief bod 6 „UPGRADE, NIE REDESIGN“), nie novou kostrou. Nové časti pribúdajú ako samostatné súbory
> (Journey Engine, GuguChat, obsah týždňov, znalostná báza); mŕtve vrstvy sa odstraňujú postupne s testom.

Verzia 1.0 · 28. 9. 2026 · pripravené na schválenie pred implementáciou (brief, bod 43)

Základ auditu: produkčná verzia **V7.6** (GitHub `main`, commit `09468b5`, zhodná s guguboo.com),
existujúce dokumenty (produktová mapa 23. 9., popôrodná navigačná mapa, prehľady zmien 9.–11. 9.,
UX audit 9. 9., Adaptívne O 21. 9.) a otvorené vetvy/PR.

---

## 0. Zhrnutie na jednu stranu

**Čo máme:** veľmi dobrú vizuálnu DNA a niekoľko skutočne silných modulov (Kruh pohody, kartička
narodenia, uspávanka s vlastným hlasom, šifrovaný Môj priestor, zúbky a aktivity so zdrojmi,
rýchle záznamy, pôrodná taška). Aplikácia však dnes pôsobí ako **~47 funkcií v troch
prekrývajúcich sa vrstvách kódu** (legacy app.html → v4 → v5) a veľa sľubuje, čo reálne nerobí:
pripomienky sa neozvú, „AI“ je vyhľadávanie kľúčových slov, zdieľanie s partnerom je iba lokálne,
Premium nič neodomyká, výstupy „100 dní“ sa negenerujú. Všetko žije v jednom prehliadači.

**Čo navrhujem:** V2 postaviť ako **nové jadro (Journey Engine) s pôvodným dizajnom a
prenesenými najlepšími modulmi** – nie ako štvrtú vrstvu nad tromi existujúcimi. Navigácia
**Domov / GugU / Moje**. Všetko ostatné prináša Journey Engine v správnom momente (NOW / SOON / LATER).

**Kľúčové rozhodnutia, ktoré potrebujem od teba** (detail v kap. L a M):
1. Backend – áno/nie a kedy (bez neho nie je GugU s AI, notifikácie, partner, synchronizácia).
2. Kto bude odborne kontrolovať zdravotný a legislatívny obsah (menovite).
3. Či V2 náhľad môže byť verejne na `guguboo.com/guguboo-v2/` (bez indexovania) alebo len na Netlify náhľade.

---

## A. Audit súčasného produktu (čo máme)

### A1. Technický stav
| Oblasť | Stav |
|---|---|
| Architektúra | Statický web bez build kroku. `app.html` (9 600 riadkov, inline CSS+JS) + vrstva `v4-upgrade.js` (UI skryté, ale stále beží) + `v5-mobile.js` (aktuálne UI, prekresľuje obsah). Tri navigačné systémy naraz, 5 MutationObserverov. |
| Dáta | Jeden JSON v `localStorage["guguboo-upgrade-v4"]` + šifrovaný `guguboo-private-space-v1`. Fotky a nahrávky ako base64 v tom istom kľúči → riziko prekročenia ~5 MB limitu. |
| Backend / účty / API | Žiadne. Jediný sieťový dopyt: Nominatim (krajina z GPS). |
| Notifikácie | Žiadne. UI tvrdí „Pripomenieme ju v zvolenom čase“ – nič sa neozve. |
| Platby / Premium | Žiadny kód. Štítky free/premium/dokup sú len nálepky a navzájom si protirečia. |
| Analytika | Žiadna. |
| Lokalizácia | Len slovenčina; 27 krajín EÚ na výber, obsah špecifický len pre SK (čiastočne CZ). |
| PWA | Nie (žiadny manifest, service worker, ikona). |
| Bezpečnosť | Môj priestor: AES-GCM + PBKDF2 310k – solídne. Inde nešpecifikované vkladanie textu cez `innerHTML` (dnes self-XSS, pri zdieľaní dát reálne riziko). |
| Kvalita kódu | Vysoké riziko regresií: každé `save()` prekreslí celé skryté legacy DOM; v4 pri načítaní prepíše rolu na „rodina“ (prepínač Mama/Otec nefunguje). |

### A2. Produktový stav
- **Onboarding (7 krokov):** meno + **dátum narodenia rodiča (povinný, bez účelu)**, poloha/krajina,
  čakáme/narodené, meno a termín/dátum, partner, náhľad domova (V7.6 – dobrý nápad).
- **Životná fáza:** jediný prepínač `profile.status` = `expecting | born`. Žiadny automatický
  prechod pri pôrode – v novom UI zmena statusu ani nespustí kartičku narodenia.
- **Tehotenstvo:** týždeň z termínu, ale len **8 hrubých pásiem** (ovocie) a 3 trimestrálne texty.
  Toto nesplní pravidlo „No second pregnancy app“.
- **Kruh pohody (Adaptívne O):** SVG kruh s 3 segmentmi (Oddych / Telo / Opora) × 4 denné ciele,
  prepínač Pohoda/Organizácia. Vizuálne silné; logika čiastočne mŕtva (partner rola nedostupná,
  automatické ciele nepoužité, záznamy nikdy nemiznú).
- **Úrady / štátna podpora:** statické texty so sumami natvrdo (napr. 829,86 €, 364,80 € / 500,10 €,
  60 €) bez dátumu overenia – presne „ručne udržiavaná encyklopédia“, ktorej sa brief chce vyhnúť.
- **Emocionálne funkcie:** kartička narodenia (najdokonalejší modul, 12 znamení, PNG), uspávanka
  (nahrávanie mikrofónom, max. 10), denník/momenty, 100 dní (počítadlo + predajná stránka bez výstupu).
- **Tón:** V7.6 vykanie, staršie časti tykanie, rodovo nejednotné („Napila som sa“).

### A3. Dizajnová DNA (zachovať)
- Farby (`v5-mobile.css`): pozadie `#fbf8f7`, text `#29243a`, tlmený `#746f80`, značka `#7866cb` /
  `#5f4fb1` / jemná `#eee9ff`, broskyňová `#f3b2a8`, úspech `#3f806d`, varovanie `#b96f28`,
  nebezpečenstvo `#b64b59`. Nočný režim existuje.
- Typografia Montserrat; radius 24 px karty, 999 px pilulky; mäkké tiene; vlastná sada čiarových SVG
  ikon (1,9 px); 3D pastelové logo; pastelové gradienty Kruhu; jemné animácie (breathe, float, twinkle).
- Komponenty: `v5-card`, `v5-row-card`, `v5-today-card`, `v5-glance`, `v5-primary/secondary`,
  `v5-quick-tile`, univerzálne okno so Späť/×, rýchly záznam ako krokový flow.

---

## B. Rozhodnutie ku každej funkcii

Legenda: **KEEP** ponechať · **IMPROVE** vylepšiť · **MERGE** zlúčiť do jednoduchšieho toku ·
**CONTEXTUALIZE** zobraziť len keď je relevantná · **REMOVE** odstrániť (s dôvodom).

| # | Funkcia (V1) | Rozhodnutie | Dôvod / kam |
|---|---|---|---|
| 1 | Onboarding (7 krokov) | IMPROVE | Na 4 kroky: meno/oslovenie, fáza + dátum, krajina, (voliteľne) partner. **Dátum narodenia rodiča odstrániť** – nemá účel. GPS nahradiť výberom krajiny. Zachovať náhľad domova z V7.6. |
| 2 | Profily (Mama/Dieťa/Rodina) | MERGE → Moje | Pýtať sa až keď údaj treba („ask once, reuse“). |
| 3 | Týždeň + ovocie (8 pásiem) | IMPROVE | Týždeň po týždni (4.–42.), vizuál veľkosti zachovať. |
| 4 | Tehotenská knižka | MERGE → Domov (tehotenstvo) | Týždenný obsah BABY/YOU; otázky pre lekára → príprava na prehliadku. |
| 5 | Pred narodením / Moja príprava (9 kariet) | MERGE → Journey plán | Úlohy s časovým oknom (NOW/SOON/LATER). |
| 6 | Taška do pôrodnice | KEEP (kontextovo) | Objaví sa ~32. týždeň ako SOON, 35.+ ako NOW. |
| 7 | Výbava / prvé zásoby / pre mamu / pediater / cesta domov | MERGE → plán | Jeden checklist engine, kontextové okná. |
| 8 | v5 Checklisty (7 kategórií) | MERGE | Duplicita s #5–7, #9. |
| 9 | Legacy Checklisty („Čo je normálne“) | REMOVE UI / obsah → znalostná báza | Tretí checklist systém. „Čo je normálne“ → odpovede GugU. |
| 10 | Denný záznam „Dnes“ | MERGE → rýchly záznam | Duplicita s #11. |
| 11 | Rýchle záznamy (kŕmenie s časovačom, prebalenie, kúpanie, teplota, poznámka) | KEEP | Po pôrode; vstup zo stredu Kruhu (existujúci vzor). |
| 12 | Spánok + časovač | KEEP | Po pôrode. |
| 13 | Zvuky / biely šum (11 syntetických) | KEEP → pod Spánok | Kontextovo po pôrode. |
| 14 | Moja uspávanka (nahrávka) | KEEP + IMPROVE | Nahrávky do IndexedDB (nie base64 v localStorage). **Sprístupniť už v tehotenstve** („hlas pre bábätko“) – prirodzené emocionálne prepojenie fáz. |
| 15 | Hlas „Oliver hovorí Guguboo“ (autoplay) | CONTEXTUALIZE | Autoplay pri načítaní ruší (noc, verejné miesto). Ponechať na ťuknutie na logo. |
| 16 | Nočná pomoc „O tretej“ | MERGE → GugU | GugU pozná čas dňa; v noci ponúkne pokojný režim. |
| 17 | Sprievodca (rozhodovací strom) | MERGE → GugU | GugU akcie. |
| 18 | „AI“ Otázka a odporúčanie (kľúčové slová) | REMOVE → nahradí GugU | Dnes zavádza („Rýchla AI pomoc“). GugU bude úprimný: overené odpovede + akcie. |
| 19 | Urgent „Čo sa deje?“ + 155/112 | KEEP | Bezpečnosť – vždy dostupná, nikdy za paywallom; GugU eskaluje sem. |
| 20 | Pripomienky / Kalendár | IMPROVE | Termíny (prehliadky, úrady) sú vstup Journey Engine. Pripomienky musia reálne fungovať (P0 v aplikácii, P1 push). |
| 21 | Rast (váha, výška, obvod) | KEEP (kontextovo) | Percentily (WHO) až z overeného zdroja – P1. |
| 22 | Zdravotná karta + report pre pediatra | KEEP → Moje | Silná praktická hodnota. |
| 23 | Návšteva lekára | MERGE → termíny | Po návšteve: pokyny, nákup, ďalší termín. |
| 24 | Očkovanie | (chýba) P1 | Len z overeného oficiálneho zdroja cez znalostnú vrstvu. |
| 25 | Zúbky | CONTEXTUALIZE | Objaví sa okolo 4.–6. mesiaca. |
| 26 | Aktivity (32, podľa korigovaného veku) | CONTEXTUALIZE | „Dnes môžete skúsiť…“ na Domove. |
| 27 | Prvý rok (etapy) | MERGE → Journey obsah | Obsah podľa veku dieťaťa. |
| 28 | Momenty / Denník | KEEP + zjednodušiť | Jeden vstup „Okamih“ (foto + veta). |
| 29 | Naše chvíle (prvé razy, príbeh) | MERGE → #28 | Duplicita. |
| 30 | Pamätné výstupy (plagát 5,99 €, video, fotokniha) | REMOVE | Predajná stránka bez produktu – poškodzuje dôveru. Vrátiť, až keď bude výstup reálny. |
| 31 | Kartička narodenia | KEEP | Spúšťa ju prechod „narodilo sa“. |
| 32 | v5 Kartičky (náhľad) | MERGE → #31 | Duplicita. |
| 33 | Môj priestor (šifrovaný) | KEEP + rozšíriť | Dostupný počas celej cesty (aj v tehotenstve). |
| 34 | Kruh pohody | KEEP + IMPROVE | Kap. C3. |
| 35 | Požiadať o pomoc (partner) | IMPROVE | Kým nie sú účty: poslať cez systémové zdieľanie/SMS – úprimne. |
| 36 | Rodina / delegovanie úlohy s receptom | CONTEXTUALIZE → P2 partner mode | Zachovať „delegovať úlohu“ cez zdieľanie. |
| 37 | Členovia rodiny a oprávnenia | REMOVE | Maketa bez funkcie; vráti sa s backendom (P2). |
| 38 | Nákup (47 ovládacích prvkov) | IMPROVE + CONTEXTUALIZE | Jednoduchý zoznam, plnený z plánu (výbava) a z návštevy lekára. |
| 39 | Produkty (rady v 15 kategóriách) | MERGE → znalostná báza / GugU | |
| 40 | Kontakty | KEEP → Moje | Pôrodnica, gynekológ, pediater sú vstupy Journey Engine. |
| 41 | Cestujem | CONTEXTUALIZE | Len keď rodina plánuje cestu; zjednodušiť. |
| 42 | Úrady / štátna podpora | REMOVE → nahradí Life Admin | Sumy natvrdo bez dátumu overenia. |
| 43 | Počasie (ručné zadanie teploty) | REMOVE | Ručné zadávanie počasia nemá hodnotu; P2 s API. |
| 44 | Prehľady (1/7/30 dní) | MERGE → „Ako sa darí“ + GugU | |
| 45 | Premium / Darček / Súrodenci (stránky) | REMOVE | Placeholdery („pracovná hypotéza“). Monetizácia – kap. K. Súrodenci P2. |
| 46 | Záloha (export) | KEEP + import | Pridať obnovu zo zálohy a **import z V1** (čítanie `guguboo-upgrade-v4`, bez zápisu). |
| 47 | Nočný režim / 4 obľúbené + zásuvka / rola Mama-Otec | nočný KEEP; obľúbené REMOVE; rola P2 | Obľúbené nahradí kontextový Domov. Zostane plochý zoznam „Všetky nástroje“ v Moje. |

**Výsledok:** z ~47 funkcií ostane používateľke na očiach **3 záložky**. Na Domove budú 1–3 veci
NOW, 1–2 SOON a Kruh. Približne 20 nástrojov bude kontextových, 9 sa zlúči a 8 sa odstráni.

---

## C. Produktová architektúra

```
                ┌───────────────────────────────┐
  Profil ──►    │        JOURNEY ENGINE         │  ◄── Verified Knowledge (krajina)
  Termíny ──►   │  life stage · okná · pravidlá │  ◄── Content Engine (týždne/vek)
  Záznamy ──►   │  NOW / SOON / LATER · ranking │  ◄── Emotional moments
  Úlohy ──►     └──────────────┬────────────────┘
                               │ what_is_relevant_now, next_best_action, gugu_context …
          ┌──────────────┬─────┴─────────┬──────────────┬──────────────┐
          ▼              ▼               ▼              ▼              ▼
        DOMOV          GUGU            MOJE        Pripomienky    Emotional layer
   (NOW/SOON, Kruh) (odpovedá, koná) (plán, doklady,   (v appke →     (momenty,
                                      spomienky)       push P1)        kartičky)
```

### C1. Princípy
- **Jeden zdroj pravdy o fáze:** fáza sa odvodí z dátumov (termín, narodenie), nie z ručného prepínača.
- **Obsah a pravidlá sú dáta, nie kód:** JSON moduly s metadátami (zdroj, platnosť, overenie).
  UI nikdy neobsahuje krajinu natvrdo.
- **Local-first:** dáta ostávajú v zariadení (dôvera, GDPR). Synchronizácia je voliteľná vrstva neskôr.
- **Anti-overload limity:** na Domove max. 3 NOW a 2 SOON; zvyšok je LATER („ozvem sa“).
- **Žiadny sľub bez funkcie:** UI nesmie tvrdiť nič, čo systém nerobí.

### C2. Technické rozhodnutie
V2 **nebude štvrtou vrstvou** nad V1 (tri vrstvy už dnes spôsobujú regresie). Navrhujem:
- **Nová čistá kostra** v `guguboo-v2/` – moduly v obyčajnom JavaScripte (ES moduly, bez build
  kroku, beží na Netlify rovnako ako dnes).
- **Design system prenesený z `v5-mobile.css`:** tokeny a komponenty vyextrahované do
  `v2/styles/` (bez 5 500 riadkov historických prepisov).
- **Prenesené moduly:** Môj priestor, Zúbky, Aktivity, kartička narodenia (canvas), uspávanka,
  rýchle záznamy, SVG Kruhu, Urgent. Prispôsobia sa novému stavu, logika sa zachová.
- **Úložisko:** `localStorage["guguboo-v2-state"]` pre stav a **IndexedDB** pre fotky a nahrávky.
- **Import z V1** jedným ťuknutím (V1 dáta sa len čítajú, nikdy nemenia).
- Súčasná kópia v `guguboo-v2/` (baseline) sa uloží ako značka `v2-baseline` v gite na porovnanie.

### C3. Kruh pohody – návrh
- **Ponechať 3 segmenty** (nie 6). Jednoduchosť a vizuálna DNA sú silnejšie ako úplnosť.
  Obsah segmentov sa mení podľa fázy:

| Fáza | Segment 1 | Segment 2 | Segment 3 |
|---|---|---|---|
| Tehotenstvo | **Oddych** (spánok, psychika) | **Telo** (pohyb, pitný režim, fyzická pohoda) | **Príprava** (jeden malý krok z plánu) |
| Popôrodné obdobie | **Zotavenie** (oddych, spánok, telo) | **Výživa a pitie** | **Opora** (psychická pohoda, pomoc od blízkych) |
| Neskôr (dieťa 3+ mes.) | Oddych | Telo | Opora |

- **Prepínač Pohoda/Organizácia zrušiť.** Organizácia patrí do NOW/SOON plánu, Kruh je len pohoda.
  Jeden význam = menej rozmýšľania.
- **Pravidlá z vašich dokumentov platia:** Kruh mamu nehodnotí, nekrmia ho záznamy o dieťati,
  nemá sériu (streak) ani „zlyhanie“, každý deň začína nanovo bez výčitiek.
- Stred Kruhu po pôrode = „+ Zaznamenať“ (zachovať vzor V1).

---

## D. Používateľské cesty (skrátene)

Formát: **NOW** (Domov dnes) · **SOON** · **LATER** · GugU proaktívne · Kruh · Life Admin · Moment.

**1. Skoré tehotenstvo (8. týždeň, prvé otvorenie)**
Onboarding za menej než 60 s (meno, „čakáme“, termín alebo dátum poslednej menštruácie, krajina).
NOW: „Si v 8. týždni“ (veľkosť, 2 vety BABY, 2 vety YOU), prvá prehliadka u gynekológa, ak ešte
nebola (termín → pripomienka). SOON: ďalší zdravotný míľnik podľa overeného obsahu. LATER: taška,
výbava, úrady – skryté. GugU: „Nič z prípravy teraz nemusíš riešiť. Keď príde čas, ozvem sa.“
Kruh: Oddych/Telo/Príprava. Moment: „Prvý týždeň s GUGUBOO“ (voliteľné foto bruška nie je nutné).

**2. Stred tehotenstva (22. týždeň)**
NOW: týždenný obsah, prípadný zdravotný míľnik, pohyby dieťaťa (vysvetlenie, nie tracker).
SOON: Life Admin sa prvýkrát ozve („O X týždňov bude vhodné riešiť …“ – položka z overenej bázy).
GugU odpovedá na otázky s kontextom týždňa, pri rizikových slovách eskaluje.
Moment: „Nahraj bábätku svoj hlas“ (uspávanka ešte pred narodením).

**3. 38. týždeň**
NOW: taška (zostávajúce položky), kontakty pôrodnice, plán cesty. Kontrakcie – jednoduchý časovač
s jasnou eskaláciou (P1). SOON: „Po pôrode ťa čakajú tieto 3 veci – pripravíme ich spolu.“
Life Admin: pripravené doklady do pôrodnice. GugU: „Máš všetko podstatné. Zvyšok počká.“

**4. Pôrod (prechod)**
Tlačidlo „Bábätko je na svete ❤️“ na Domove (od 37. týždňa výrazne, skôr v Moje).
Opýta sa len: dátum/čas, meno (voliteľne), váha/dĺžka (voliteľne).
→ **transformácia**: Domov, Kruh (Zotavenie/Výživa/Opora), GugU kontext, plán, Life Admin, obsah
a nástroje sa prepnú. Hneď sa ponúkne **kartička narodenia**. História, spomienky, nahrávky ostávajú.

**5. Prvý týždeň doma**
NOW: rýchle záznamy (kŕmenie, prebalenie, spánok) zo stredu Kruhu; Life Admin NOW – povinnosti
s termínom (z overenej bázy, napr. prihlásenie dieťaťa k poisťovni/pediatrovi, ak to krajina vyžaduje);
1 obsahová karta „čo je normálne v 1. týždni“. GugU v noci: pokojný režim. Moment: „Prvé dni doma“.

**6. Prvý mesiac**
NOW: prehliadka u pediatra (termín), Kruh opory (popôrodná psychika – informácia + eskalácia,
nikdy diagnóza). SOON: ďalšie dávky Life Admin. Aktivity podľa veku (kontextovo).

**7. 100 dní**
Journey Engine rozpozná deň 100 → Domov + (P1 push): „Dnes ste spolu 100 dní ❤️“ → vygeneruje
kartičku (rovnaký canvas engine ako kartička narodenia) z mena, dátumu a voliteľnej fotky.
Low effort → high emotional value.

---

## E. Informačná architektúra

```
DOMOV                         GUGU                          MOJE
├ Kde som (týždeň / vek)      ├ Konverzácia s kontextom     ├ Môj plán (NOW/SOON/LATER, hotové)
├ Kruh pohody                 ├ Rýchle otázky podľa fázy    ├ Termíny a pripomienky
├ NOW (max 3 karty)           ├ Akcie: [Vysvetli][Začať]    ├ Doklady a úrady (Life Admin)
├ SOON (max 2)                │  [Pridať termín][Pripomeň]  ├ Zdravie (karta, rast, zúbky…)
├ Moment (ak je)              │  [Už mám vybavené]          ├ Spomienky (okamihy, kartičky, hlas)
└ (po pôrode) + Zaznamenať    └ Urgent / 155 / 112 vždy     ├ Môj priestor (šifrovaný)
                                                            ├ Kontakty
                                                            ├ Všetky nástroje (plochý zoznam)
                                                            └ Nastavenia, záloha, import z V1
```

- **Spodná lišta:** 3 položky (Domov · GugU · Moje). Nie 4 obľúbené + zásuvka.
- **„Všetky nástroje“** ostáva ako núdzový východ – kontextovosť nesmie znamenať, že niečo nenájdem.
- Každý nástroj má jeden domov; skratky vedú do toho istého toku (pravidlo z vašej navigačnej mapy).

---

## F. Journey Engine – dátový a rozhodovací model

### F1. Vstupy (`JourneyContext`)
```js
{
  life_stage: "pregnancy" | "postpartum" | "baby" | "parenthood",   // odvodené
  due_date, birth_date,                                               // ISO dátumy
  pregnancy_week, pregnancy_day,                                      // odvodené z due_date
  baby_age: { days, weeks, months, corrected_days },                  // odvodené z birth_date (+ gestačný týždeň)
  country: "SK",
  user_profile: { name, role: "mother"|"partner", preferences },
  completed_tasks: { [task_id]: { status, at } },                     // done | snoozed | not_relevant
  appointments: [ { id, type, date, source: "user"|"plan" } ],
  admin_state: { [admin_item_id]: status },
  relevant_preferences: { quiet_hours, notifications, topics_muted },
  available_verified_knowledge: KnowledgeIndex,                       // pre krajinu + fázu
  emotional_milestones: { [moment_id]: { seen, created_artifact } }
}
```
Fáza: `pregnancy` (due_date a bez birth_date) → `postpartum` (0–42 dní po narodení) → `baby`
(do 12 mesiacov) → `parenthood`. Ručná zmena je len oprava, nie prepínač.

### F2. Pravidlo / položka cesty (dáta)
```json
{
  "id": "sk.admin.birth-allowance",
  "type": "task | content | admin | tool | moment | health",
  "stages": ["postpartum"],
  "window": { "anchor": "birth_date", "from_days": 0, "to_days": 180 },
  "soon_lead_days": 14,
  "conditions": [{ "field": "country", "eq": "SK" }],
  "priority": 80,
  "knowledge_ref": "sk.benefit.birth-allowance@v3",
  "actions": ["explain", "start", "add_appointment", "remind", "mark_done"],
  "copy": { "title": "...", "why": "..." }
}
```

### F3. Výpočet
1. Vyber položky platné pre krajinu a fázu, ktorých podmienky platia a ktoré nie sú hotové ani odmietnuté.
2. Horizont: **NOW** = dnes je v okne · **SOON** = okno začne do `soon_lead_days` · **LATER** = inak.
3. Poradie: priorita × naliehavosť (koniec okna) × bezpečnosť (zdravie a termíny úradov prvé),
   s bonusom za nadväznosť na posledný krok.
4. Limity: Domov 3 NOW + 2 SOON. Zvyšok sa zobrazí v Moje → Plán.
5. Výstupy: `what_is_relevant_now`, `what_is_coming`, `next_best_action` (1 položka),
   `recommended_content`, `relevant_tool`, `notification` (len ak má relevance + reason + action),
   `admin_requirement`, `gugu_context` (kompaktný súhrn pre GugU), `emotional_moment`.
6. **Deterministické a testovateľné:** rovnaký kontext → rovnaký výstup. Každý typ cesty z kap. D
   má automatický test (fixný dátum → očakávané NOW/SOON).

### F4. GugU nad enginom
- **Vrstva 1 (P0, bez backendu):** zámery (intents) + vyhľadávanie v overenej báze + akcie.
  Príklad: „Čo ešte musím vybaviť pred pôrodom?“ → intent `plan.remaining` → engine vráti 3 položky
  → GugU: „Z dôležitých vecí ti zostávajú tri. Najbližšie bude vhodné vyriešiť X.“ + tlačidlá akcií.
- **Vrstva 2 (P1, backend):** LLM (napr. Claude) len na **formuláciu a porozumenie otázke**, odpovedá
  výhradne z overených položiek (retrieval), s uvedením zdroja; pri neistote povie „toto neviem
  s istotou“ a ponúkne kontakt. Zdravotné červené vlajky rieši vždy pravidlo, nie model.
- Proaktivita: engine vyberie max. 1 proaktívnu správu denne (bez marketingu).

---

## G. Architektúra znalostí (Verified Knowledge)

### G1. Tok
```
Dôveryhodné zdroje (zoznam URL na krajinu)
 → automatický monitoring (GitHub Actions, denne)
 → detekcia zmeny (normalizovaný text + hash)
 → extrakcia (AI navrhne štruktúrovanú zmenu: staré → nové pravidlo)
 → klasifikácia rizika (rutinná / kritická)
 → validácia (schéma, rozsahy súm, dátumy platnosti)
 → PR do repozitára  ─ rutinná: automaticky (napr. len last_checked)
                     ─ CRITICAL CHANGE DETECTED: čaká na človeka
 → merge = publikovanie (Netlify)
 → Knowledge Base → Journey Engine → GugU / plán / notifikácie / UI
```
Výhoda: celý tok beží na existujúcom GitHub + Netlify bez vlastného servera a každá zmena má históriu.
Schválenie zmeny je rovnaký úkon ako schválenie nasadenia (Merge).

### G2. Položka znalosti
```json
{
  "id": "sk.benefit.birth-allowance", "version": 3,
  "country": "SK", "category": "benefit", "life_stage": ["pregnancy","postpartum"],
  "conditions": [...], "effective_from": "…", "effective_until": null,
  "official_source": "MPSVR SR", "source_url": "https://…", "last_checked": "…",
  "verification_status": "verified | draft | stale | disputed",
  "review_required": false,
  "facts": { "amount": {...}, "deadline": {...}, "documents": [...], "authority": "..." }
}
```
- UI a GugU zobrazujú **zdroj + dátum overenia** pri každej administratívnej či zdravotnej informácii.
- `stale` (dlho neoverené) alebo `draft` → GugU to nesmie podať ako istotu („overujeme“).
- **Žiadne pravidlá z pamäte AI.** Súčasné sumy z V1 sa neprenesú, kým ich nepotvrdí pipeline zo zdroja.

### G3. Človek v slučke
Pri kritickej zmene PR obsahuje: čo sa zmenilo, staré a nové pravidlo, zdroj, dotknuté segmenty
používateľov, checklisty, notifikácie a odpovede GugU. Odborník kontroluje len výnimky a rizikové zmeny.

---

## H. Country Engine

- Spoločné entity: `Benefit`, `Obligation`, `Eligibility`, `Deadline`, `Authority`, `Document`, `Form`,
  `Process`, `LifeEvent`, `Source`, `Rule`.
- Štruktúra dát: `knowledge/sk/…`, `knowledge/cz/…`, `countries/sk.json` (jazyk, mena, tiesňové čísla,
  úrady, zoznam zdrojov pre monitoring).
- **Pridanie krajiny = pridanie dátového modulu + zoznamu zdrojov + odborná kontrola.** Žiadny nový kód UI.
- Krajina bez modulu dostane „európsky základ“ (112, univerzálny obsah) a úprimnú hlášku, že lokálny
  obsah zatiaľ nie je.
- Poradie: SK (P0), CZ (P2).

---

## I. Emocionálna cesta

| Moment | Spúšťač (engine) | Úsilie | Výstup |
|---|---|---|---|
| Nahraj bábätku svoj hlas | tehotenstvo ~20. týždeň + kedykoľvek | 1 min | nahrávka, po narodení sa objaví pri Spánku |
| Pol cesty | 20. týždeň | 0 | krátka karta „Si v polovici“ |
| Posledné týždne | 36. týždeň | 0–1 foto | spomienka „čakáme ťa“ |
| Narodenie | prechod „je na svete“ | 1 min | **kartička narodenia** (existujúci engine) |
| Prvé dni doma | 3.–7. deň | 1 veta/foto | okamih |
| Prvé razy | voliteľne (úsmev, kúpeľ…) | 1 ťuk | okamih |
| **100 dní spolu** | deň 100 | 0–1 foto | kartička 100 dní |
| 1. narodeniny | deň 365 | 0–1 foto | kartička + „náš rok“ (P2) |

Pravidlá: žiadne série, výčitky ani FOMO. Moment sa ponúkne raz, dá sa odložiť a nikdy sa necyklí.
Nahrávky a fotky ostávajú na zariadení (IndexedDB), v zálohe voliteľne.

---

## J. Mapa automatizácie

| Oblasť | Automaticky | AI s pomocou | Overí človek | Vyžaduje človeka |
|---|---|---|---|---|
| Výber obsahu podľa fázy (Journey) | ✓ | | | |
| Pripomienky a proaktívne správy | ✓ | | | |
| Monitoring zdrojov, detekcia zmien | ✓ | | | |
| Extrakcia zmien z úradných stránok | | ✓ | ✓ (kritické) | |
| Rutinné zmeny (overené, bez zmeny faktov) | ✓ | | | |
| Legislatívne zmeny súm, termínov, nárokov | | ✓ návrh | ✓ | |
| Zdravotný obsah (nový / zmenený) | | ✓ návrh | ✓ | odborník |
| Týždenný obsah tehotenstva – formulácie | | ✓ | ✓ | |
| Preklady (CZ a ďalšie) | | ✓ | ✓ | |
| Odpovede GugU (formulácia) | ✓ z overenej bázy | ✓ (P1) | vzorky | |
| Neznáme otázky → medzery v znalostiach | ✓ zber | ✓ zoskupenie | ✓ priorita | |
| Klasifikácia spätnej väzby | ✓ | ✓ | | |
| Tiesňové čísla, bezpečnostné pravidlá | | | ✓ | ✓ vždy |

---

## K. Roadmapa

### P0 – musí definovať produkt (poradie implementácie)
1. **Baseline** ✓ (kópia V7.6 v `guguboo-v2/`, vlastné úložisko, noindex) → značka `v2-baseline`.
2. **Kostra V2:** design system z v5, 3 záložky, univerzálne okno, úložisko + IndexedDB, import z V1.
3. **Journey Engine** (F) + testy pre 7 ciest z kap. D.
4. **Onboarding V2** (4 kroky, náhľad domova).
5. **Pregnancy Mode:** Domov (Kde som / Čo sa deje / Ako sa mi darí / Čo ma čaká / Mám niečo urobiť),
   týždenný obsah BABY/YOU pre 4.–42. týždeň (stav `draft` až do odbornej kontroly).
6. **Kruh pohody V2** (C3).
7. **GugU vrstva 1** (intenty, akcie, urgent eskalácia).
8. **Plán / kontextový checklist** (z modulov 5–9 V1).
9. **Verified Knowledge + Life Admin SK:** schéma, prvé položky zo zdrojov, zobrazenie zdroja a dátumu.
10. **Knowledge pipeline:** GitHub Action (monitoring, diff, PR s reportom).
11. **Prechod pôrod → popôrodné obdobie** + kartička narodenia + prenesené popôrodné moduly.
12. **Emocionálna vrstva P0:** uspávanka v tehotenstve, 100 dní.
13. **Analytika (lokálne udalosti)** pripravená na odoslanie po súhlase; „GUGUBOO moment“ metrika.
14. Regresné testy (Playwright, ako vo V1), UX simplification pass, kontrola kvality.

### P1 – vysoká hodnota
Backend (účty voliteľné, synchronizácia, push notifikácie cez PWA), GugU vrstva 2 (LLM nad overenou
bázou), Document Center (predvyplnenie → otvorenie oficiálneho podania), trackery s dôvodom
(kontrakcie, pohyby dieťaťa – s bezpečnou eskaláciou), očkovanie z overeného zdroja, percentily rastu,
ďalšie emocionálne momenty.

### P2 – škálovanie
CZ modul, partner mode (zdieľaný plán, požiadať o pomoc cez účet), rozšírená cesta po 1. roku,
integrácie, prémiové workflowy, tlačené výstupy (plagát 100 dní, fotokniha – až keď budú reálne).

### Monetizácia (návrh na rozhodnutie, nie implementácia v P0)
- **Zadarmo:** celá tehotenská cesta a základný obsah, Kruh, základný plán, **všetky bezpečnostné
  informácie a Urgent**, emocionálne momenty v základnej podobe.
- **Premium (jedno kontinuálne členstvo):** GugU vrstva 2 (AI), personalizovaný Life Admin s Document
  Centrom a predvyplnením, synchronizácia a partner, pokročilé výstupy spomienok.
- Paywall v P0 **nezavádzať** – najprv merať hodnotu (metriky nižšie), potom rozhodnúť cenu.

### Metriky
Dokončenie onboardingu · retencia 1. a 4. týždeň · retencia tehotenstvo → popôrodné obdobie ·
dokončené odporúčané akcie · úspešnosť GugU (vyriešené bez „neviem“) · notifikácia → užitočná akcia ·
dokončenie Life Admin položiek · využitie momentov · podiel používateliek s paralelnou tehotenskou
appkou (1 otázka v appke po 4 týždňoch).
**GUGUBOO moment:** proaktívna správa/odporúčanie → otvorené → vykonaná akcia → úloha hotová
(meria sa lokálne, odosiela sa až po súhlase).

---

## L. Riziká

| Typ | Riziko | Opatrenie |
|---|---|---|
| Zdravotné | Nesprávna alebo zastaraná zdravotná informácia; dojem diagnózy | Informácia / podpora / eskalácia; stav `draft` až po odbornej kontrole; červené vlajky pravidlom; Urgent vždy zadarmo |
| Legislatívne | Sumy a termíny sa menia | Pipeline + zdroj + dátum overenia; bez overenia sa nezobrazujú ako istota |
| Právne / GDPR | Údaje o tehotenstve sú osobitná kategória údajov (čl. 9 GDPR) | Local-first; pri backende právne posúdenie, súhlasy, šifrovanie, DPA s dodávateľmi |
| Produktové | V2 stratí veci, ktoré ľudia z V1 majú radi | Import z V1, „Všetky nástroje“, porovnanie s baseline, testovanie s používateľkami pred nahradením V1 |
| Technické | Limit localStorage (fotky, audio) | IndexedDB pre médiá; záloha/obnova |
| Technické | Web push na iOS funguje len pre nainštalovanú PWA | P0 proaktivita v aplikácii; P1 PWA + push |
| Obsahové | Objem obsahu (39 týždňov × sekcie) a jeho kontrola | Týždenne len BABY + YOU (krátko); HEALTH/PREPARE/ADMIN podľa míľnikov, nie každý týždeň |
| Škálovanie | Ručná údržba obsahu | Obsah ako dáta, pipeline, AI s pomocou + kontrola výnimiek |
| AI | Halucinácie GugU | Vrstva 1 bez LLM; vrstva 2 len retrieval z overenej bázy so zdrojom |
| Organizačné | V1 a V2 bežia súbežne na jednej doméne | Oddelené úložisko (`guguboo-v2-*`), noindex, V1 sa nemení |

---

## M. Kde nesúhlasím s briefom (bod 45)

1. **GugU ako AI chat v P0**
   *Problém:* bez backendu a overenej bázy by LLM odpovedal z pamäte – brief to sám zakazuje
   (zdravie, legislatíva). *Alternatíva:* GugU vrstva 1 (kontext + intenty + overená báza + akcie)
   v P0; LLM až v P1 len nad overenými položkami. *Dopad:* GugU je od prvého dňa užitočný a dôveryhodný,
   AI príde bez rizika.

2. **Plný obsah BABY/YOU/WELLBEING/HEALTH/PREPARE/ADMIN pre každý týždeň**
   *Problém:* ~39 × 6 ≈ 230 blokov na odbornú kontrolu – úzke hrdlo a veľa textu (proti „nie magazín“).
   *Alternatíva:* týždenne len BABY + YOU (2–3 vety + „rozbaliť“), ostatné sekcie podľa míľnikov.
   *Dopad:* ~60 % menej obsahu na kontrolu, kratší Domov, rovnaká hodnota „no second pregnancy app“.

3. **Kruh so 6 oblasťami**
   *Problém:* 6 segmentov na mobile = drobné, horšie čitateľné, viac rozhodovania.
   *Alternatíva:* 3 segmenty s obsahom podľa fázy (C3), zrušenie prepínača Pohoda/Organizácia.
   *Dopad:* zachovaná DNA, jednoduchší význam.

4. **Paywall a monetizácia v P0**
   *Problém:* dnes nie je čo spoplatniť (žiadny backend, AI ani Document Center) a chýbajú dáta o hodnote.
   *Alternatíva:* P0 bez paywallu s meraním hodnoty, návrh cien po prvých metrikách.
   *Dopad:* dôvera a lepšie rozhodnutie o cene.

5. **Úplné odstránenie prístupu k nástrojom (len kontext)**
   *Problém:* keď kontext netrafí, používateľka nemá kam ísť – stratí dôveru.
   *Alternatíva:* plochý zoznam „Všetky nástroje“ v Moje (bez kategórií).
   *Dopad:* jednoduchosť bez pocitu straty kontroly.

6. **Proaktívne notifikácie od začiatku**
   *Problém:* web push na iPhone funguje len pre nainštalovanú PWA a potrebuje server.
   *Alternatíva:* P0 proaktivita v aplikácii (Domov, GugU, pripomienky pri otvorení), P1 PWA + push.

7. **Onboarding „krajina z GPS“ a dátum narodenia rodiča**
   Odstrániť – nemajú účel, znižujú dôveru (princíp „nežiadaj údaje bez účelu“).

---

## O. Jedna aplikácia, alebo dve prostredia (predpôrodné a popôrodné)?

**Odporúčanie: jeden produkt, jeden účet, jeden kód – dve fázy (režimy) vo vnútri.**
Aplikácia sa pri pôrode sama premení (kap. D4). Navonok môže mať dva vstupy (dve landing stránky:
„GUGUBOO tehotenstvo“ a „GUGUBOO bábätko“), ale oba vedú do tej istej aplikácie.

### O1. Porovnanie

| Kritérium | Dve samostatné aplikácie | Jedna aplikácia, dve fázy |
|---|---|---|
| Moment pôrodu | Treba inštalovať/registrovať druhú appku v najvyčerpanejšom momente života → najväčší odpad používateliek presne tam | Nič netreba robiť, aplikácia sa prepne sama |
| Dáta a kontinuita | Kontakty, termíny, plán, nahrávky, spomienky treba preniesť alebo zadať znova | Všetko ostáva („ask once, reuse“) |
| Emocionálna väzba | Preruší sa (hlas nahratý v tehotenstve, cesta „od bruška“) | Rastie – najsilnejší diferenciátor oproti konkurencii |
| Jednoduchosť jednej fázy | ✓ Každá appka je jednoduchšia | ✓ Rovnako – Journey Engine ukazuje len aktuálnu fázu |
| Marketing / vyhľadávanie | ✓ Dve jasné pozície v obchodoch | ✓ Dosiahnuteľné dvoma vstupmi do jednej appky |
| Vývoj a údržba | 2× kód, 2× testy, 2× obsah, rozchádzajúci sa dizajn (dnes už vidno V1 vs. „partnerova verzia“) | 1× jadro; fázy sú dáta, nie kód |
| Používateľka, ktorá príde až po pôrode | ✓ | ✓ (onboarding „bábätko je už s nami“ – už dnes funguje) |

Jediná reálna výhoda dvoch aplikácií (dve jasné pozície) sa dá získať aj v jednej aplikácii.
Nevýhody dvoch aplikácií sa odstrániť nedajú.

### O2. Pohľad platenia

- **Ochota platiť nie je rovnaká počas celej cesty.** Tehotenských aplikácií zadarmo je veľa, takže
  za základné sledovanie tehotenstva ľudia platiť nebudú. Najväčšia neistota a práca (príprava na pôrod,
  úrady, doklady, prvé týždne, spánok, kŕmenie) – a teda aj najvyššia ochota platiť – prichádza
  **v 3. trimestri a po pôrode**.
- **Jedna aplikácia mení tehotenstvo na zdarma získanú dôveru, ktorá sa zaplatí neskôr.** Používateľka
  mesiace zadarmo zažíva, že GUGUBOO „vie, kde je“. Keď príde drahá a náročná fáza, rozhoduje sa medzi
  produktom, ktorému už dôveruje, a začínaním odznova. Pri dvoch aplikáciách by sa lievik pretrhol
  presne v momente, keď by mala platiť.
- **Odporúčaný model (na overenie metrikami, nie teraz implementovať):**
  - Tehotenstvo zadarmo (celá cesta, obsah, Kruh, základný plán, všetka bezpečnosť).
  - Premium ponúknuť **v 3. trimestri** s konkrétnou hodnotou (Life Admin na mieru, pripravené doklady,
    GugU s AI) – nie „odomkni funkcie“, ale „vyriešime ti úrady“.
  - Nepredávať tvrdo v prvých dňoch po pôrode. Vhodnejšie je napríklad „prvý mesiac po pôrode Premium
    zadarmo“ a pokračovanie po ňom – rešpektuje situáciu (žiadna vina, žiadny strach).
  - **Jedno kontinuálne členstvo**, nie dve predplatné. Ročná rodinná varianta.
  - **Darček:** členstvo ako dar od starých rodičov či priateľov (nápad z V1) – funguje len s jednou appkou.
- **Technicky:** pokiaľ je GUGUBOO web/PWA, platby cez Stripe (bez 15–30 % poplatku obchodov).
  Pri natívnej aplikácii neskôr treba počítať s poplatkom obchodu.

### O3. Čo to znamená pre existujúce dokumenty
Navigačná mapa (sept.) oddeľovala predpôrodnú časť ako „partnerovu verziu“. Odporúčam toto rozhodnutie
**zmeniť**: predpôrodná časť sa stane fázou 1 tej istej aplikácie. Obsah partnerovej verzie sa zlúči
do Pregnancy Mode V2 (porovnať a vybrať to lepšie).

---

## N. Otázky na rozhodnutie (potrebujem od teba)

1. **Backend (P1):** súhlasíš s cestou Netlify Functions + databáza (napr. Supabase v EÚ) + Claude API?
   Rozpočet a kto bude prevádzkovateľ (GDPR)?
2. **Odborná kontrola:** kto skontroluje zdravotný obsah (gynekológ / pôrodná asistentka / pediater)
   a kto legislatívu (Life Admin SK)? Bez toho ostane obsah v stave `draft`.
3. **Náhľad V2:** stačí Netlify náhľad vetvy `vyvoj` (chránený prihlásením), alebo chceš V2 aj na
   `guguboo.com/guguboo-v2/` pre testerky?
4. **Otvorený PR #3 (Matej, „hodnota v sekcii Pred narodením“):** navrhujem ho nezlučovať do V1
   (konflikt s V7.6), ale jeho myšlienku (6 kľúčových krokov, hodnotové texty) preniesť do plánu V2.
5. **Súhlasíš s rozhodnutiami v kap. B a M?** Po schválení začnem P0 krokom 2 (kostra V2).

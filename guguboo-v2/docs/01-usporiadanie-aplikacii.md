# Guguboo V2 – plán upratania aplikácií (usporiadanie, viditeľnosť, bez duplicít)

Verzia 1.0 · 7. 11. 2026 · stav appky V2 2.35.0 · **len návrh na diskusiu, v aplikácii sa zatiaľ nič nemení**

> ## Stav (10. 11. 2026) – lokálna vetva `v2-upratanie`, V2 2.37.x, NENASADENÉ
> Samuel 7. 11.: „obe verzie (pred aj po pôrode) musia vyzerať rovnako“ a „celé spodné menu mi nepríde ako dôležité aplikácie“.
> Preto namiesto 5 oblastí v zásuvke a 4 obľúbených (bod 8 z 28. 9.) je spravené:
> - **Pevná spodná lišta:** Domov · Bábätko · (GuguChat) · Mama · Rodina – rovnaká v tehotenstve aj po pôrode, bez obľúbených a pripínania.
> - **Bábätko** = tehotenstvo (Knižka, Aké veľké je bábätko, Príprava, Môj hlas) / po pôrode (Zapísať záznam, Zdravotná knižka, Spánok a zvuky, Aktivity, Niečo ma trápi).
> - **Mama** = okno Mama (telo, pitie, nálada, menštruačný kalendár, denník).
> - **Rodina** = Naše momenty, Kalendár, Nákup (+ Výbava), Úrady a doklady, Kontakty, Spoločné úlohy, (Praktické zoznamy), Cestovanie.
> - **Hlavička domova** má v oboch fázach 6 dlaždíc s údajmi (tehotenstvo: Do termínu, Trimester, Veľkosť, Kontrola, Pitný režim, Otázky).
> - Zdravotná knižka obsahuje Teplotu a merania aj Zúbky; jednotné názvy (sekcia 6); riadok Kalendára na domove.
> - Kruh: pitie a nálada už berú údaje z Mamy a denníka (bez dvojitého zápisu) – bez zmeny.
> - **Ostáva rozhodnúť:** Praktické zoznamy (zrušiť/presunúť), viditeľnosť podľa veku (hranice overiť zo zdroja), odstránenie starých aliasov (`diary`, `first100`, `health`, `growth`…), či má byť lišta viditeľná aj v oknách.

Cieľ: aby rodič vždy vedel, **kde čo je**, nič nebolo na dvoch miestach ako dve rôzne veci
a appka ukazovala len to, čo sa v danej fáze naozaj hodí.

---

## 1. Princípy (pravidlá, podľa ktorých sa rozhoduje)

1. **Jedna vec = jeden domov.** Každá funkcia má práve jednu „domovskú“ aplikáciu. Všade inde je len
   **vchod** (odkaz), ktorý otvorí to isté miesto – nikdy kópia s vlastnými dátami alebo iným vzhľadom.
2. **Šípka späť = o krok späť** – aj keď sa do aplikácie prišlo vchodom z inej (napr. Mama → Menštruačný kalendár → späť do Mamy).
3. **Jeden názov pre jednu vec.** Rovnaká vec sa nesmie volať raz „Naše momenty“, raz „Rodinný denník“ a raz „Náš príbeh“.
4. **Fáza rozhoduje o viditeľnosti.** Čo sa v danej fáze nehodí, sa neukazuje (nie je sivé, jednoducho tam nie je).
5. **Max. 2 ťuknutia** z domova k čomukoľvek, čo sa robí denne.
6. **Domov = dnešok, zásuvka = všetko, lišta = moje obľúbené, GuguChat = „neviem, kde to je“.**
7. **Kruh má jasnú úlohu** a nezdvojuje aplikácie (len do nich odkazuje).

---

## 2. Súčasný stav – inventár (V2 2.35.0)

### Kde sa dnes dá niečo otvoriť (vchody)

| Vchod | Tehotenstvo | Po pôrode |
|---|---|---|
| Hlavička domova | týždeň (→ Aké veľké je bábätko), 3 ikony: Tehotenská knižka / Mama / Dieťa | Spánok, Kŕmenie, Prebalenie, Výška, Váha, Zdravotná knižka |
| Pod hlavičkou | Dnešný malý moment (Matej 2.33.0) | Dnešný malý moment |
| Kruh | Príprava: Domov / Pôrodnica (Taška) / Vybaviť + Pohoda: Oddych / Telo / Opora | Doma / Doklady / Rodina + Pohoda |
| Journey (Teraz / Čoskoro) | áno | áno |
| Zásuvka (Praktické / Spomienky) | 12 aplikácií | 15 aplikácií + Naše momenty |
| Spodná lišta (4 + GuguChat) | Príprava, Kontakty, Nákup, Cesty | Denník, Momenty, Aktivity, Nákup |
| Okno „Pomoc a starostlivosť“ | – | Návšteva lekára, Bábätko niečo trápi, Zdravotné záznamy, Spánok a náročná noc, Kontakty na pomoc |
| Menu ☰ | profil, nastavenia | profil, nastavenia |
| GuguChat | navigácia na všetko | navigácia na všetko |

### Zistené duplicity a nejasnosti

| # | Téma | Kde všade je dnes | Problém |
|---|---|---|---|
| D1 | **Naše momenty** | `memories`, `diary` („Rodinný denník“), `first100` („Náš príbeh“) – 3 názvy, 1 obrazovka; + karta v zásuvke Spomienky, lišta, Dnešný malý moment | 3 mená pre jednu vec |
| D2 | **Zdravie dieťaťa** | Zdravotná knižka, „Zdravie“ (health), „Rast a váha“ (growth), Pomoc → „Zdravotné záznamy“, Pomoc → „Návšteva lekára“, Teplota (flow), Zúbky | 5–7 miest pre to isté: kontroly, merania, teplota, návštevy |
| D3 | **Spánok** | glance Spánok, flow sleep, „Zvuky“ (view má titulok „Spánok“), „Nočná pomoc“, Pomoc → „Spánok a náročná noc“, Môj hlas → nahrávky pri Spánku | Spánok vs. Zvuky vs. Noc – nie je jasné, čo je čo |
| D4 | **Výbava a nákup** | Nákup, „Výbava a produkty“, Moja príprava (taška), Kruh → Domov (výbava), GuguChat výbava → Pridať do Nákupu | Čo kúpiť / čo už mám / čo zbaliť je na 4 miestach |
| D5 | **Kontakty** | Kontakty, Urgentná pomoc, Pomoc → Kontakty na pomoc, úlohy v Kruhu (uložiť kontakt) | 2 zoznamy kontaktov (moje vs. tiesňové) bez jasného rozdielu |
| D6 | **Úrady a doklady** | Úrady (administration), Kruh → Vybaviť / Doklady, Kalendár (zákonné termíny) | Úrady ako aplikácia aj ako časť Kruhu |
| D7 | **Zoznamy** | Praktické zoznamy (checklists), Moja príprava, úlohy v Kruhu | 3 druhy „checklistov“ |
| D8 | **Rodina** | Rodina (family), Profily rodiny (profiles), Kruh → Rodina | Rodina vs. Profily |
| D9 | **Pitie, nálada, telo mamy** | Mama (pitný režim, nálada), Kruh Pohoda (Napila som sa, Ako sa dnes cítim), Súkromný denník (nálada) | Pitie a nálada sa zapisujú na 2–3 miestach |
| D10 | **Kartička narodenia / oznámenia** | úloha v Kruhu, Naše momenty, `cards` v starom kóde | OK po upratovaní 2.2x – len dočistiť starý `cards` |
| D11 | **Kalendár** | zásuvka, lišta, termíny z Knižiek, Mama → kontrola po pôrode; karta na domove po 2.33.0 chýba | Kalendár nie je na domove viditeľný |
| D12 | **Telo mamy v tehotenstve** | Mama → Tvoje telo, Tehotenská knižka (týždeň), Dieťa (Aké veľké je bábätko) | treba dodržať: bábätko = Dieťa, mama = Mama, knižka = záznamy z kontrol |

---

## 3. Navrhovaná štruktúra – 5 domovov

Každá aplikácia patrí do **jednej** z 5 oblastí. Oblasti sú zároveň skupiny v zásuvke.

| Oblasť | Čo tam patrí (domov funkcie) | Poznámka |
|---|---|---|
| **1. Bábätko** | Denné záznamy (spánok, kŕmenie, plienky, kúpanie), **Zdravotná knižka** (kontroly, rast, očkovanie, teplota, zúbky, návštevy lekára, otázky pre pediatra), Spánok a zvuky, Aktivity podľa veku | Zdravie, Rast a váha, Teplota, Zúbky, Zdravotné záznamy → **zlúčiť do Zdravotnej knižky** (D2) |
| **2. Mama** | Mama (telo, ťažkosti, jedlo, pitný režim, nálada, kontrola po pôrode), **Menštruačný kalendár**, Môj súkromný denník | Pitie a nálada sa zapisujú len tu; Kruh na ne len odkazuje (D9) |
| **3. Tehotenstvo** (len pred pôrodom) | Tehotenská knižka, Dieťa (Aké veľké je bábätko), Moja príprava (taška, pôrodnica), Môj hlas pre bábätko | Po pôrode zmizne zo zásuvky; dáta zostanú v Naše momenty / albume Naše čakanie |
| **4. Organizácia** | Kalendár, Nákup (vrátane výbavy), Úrady a doklady, Kontakty, Rodina (vrátane profilov), Cestovanie | Výbava a produkty → časť Nákupu (D4); Profily → časť Rodiny (D8); Praktické zoznamy → časť Kalendára/Úradov alebo zrušiť (D7) |
| **5. Spomienky** | Naše momenty (časová os, prvé razy, albumy, kartičky) | jeden názov: **Naše momenty** (D1) |

**Pomoc a starostlivosť** prestane byť samostatnou aplikáciou s vlastným obsahom – stane sa
**rozcestníkom** „Niečo ma trápi“ (bábätko / ja / noc / kontakty), ktorý len otvára domovy vyššie.
Rovnakú úlohu má GuguChat, takže ho možno časom úplne nahradí.

**Urgentná pomoc / Kontakty na pomoc** = jeden pokojný panel „Kontakty na pomoc“ (155/112, pôrodnica,
pediater z Kontaktov). Nie samostatná aplikácia v zásuvke; vchod z Kontaktov, GuguChatu a pri ťažkostiach (D5).

---

## 4. Viditeľnosť podľa fázy

| Aplikácia | Tehotenstvo | 0–6 týž. (šestonedelie) | 6 týž.–1 rok | 1–3 roky |
|---|---|---|---|---|
| Tehotenská knižka, Dieťa, Moja príprava, Môj hlas | ✅ | ❌ (dáta v Momentoch) | ❌ | ❌ |
| Oznámiť tehotenstvo | len úloha v Kruhu | ❌ | ❌ | ❌ |
| Denné záznamy, Spánok a zvuky | ❌ | ✅ | ✅ | ✅ |
| Zdravotná knižka | ❌ | ✅ | ✅ | ✅ |
| Zúbky (v Knižke) | ❌ | ❌ | od ~6 mes. | ✅ |
| Aktivity | ❌ | ❌ (alebo veľmi jemné) | ✅ | ✅ |
| Mama | ✅ (tehotenstvo) | ✅ (šestonedelie) | ✅ | ✅ |
| Menštruačný kalendár | ❌ | ✅ (s textom „zapíš až menštruáciu“) | ✅ | ✅ |
| Súkromný denník | ✅ | ✅ | ✅ | ✅ |
| Kalendár, Nákup, Kontakty, Rodina | ✅ | ✅ | ✅ | ✅ |
| Úrady a doklady | ✅ (pred pôrodom) | ✅ (po narodení – najviac) | ✅ | menej |
| Cestovanie | ✅ | ❌ | ✅ | ✅ |
| Naše momenty | ✅ (Naše čakanie) | ✅ | ✅ | ✅ |

*Konkrétne vekové hranice (napr. zúbky, aktivity) treba pred zapnutím overiť z oficiálneho zdroja – tu sú len ako návrh.*

---

## 5. Miesta v appke – kto má akú úlohu

| Miesto | Úloha | Čo tam NEpatrí |
|---|---|---|
| **Domov** | Dnešok: hlavička (stav bábätka / týždeň), Dnešný malý moment, najbližší termín z Kalendára, Kruh, Teraz/Čoskoro | zoznamy aplikácií, dlhé texty |
| **Kruh** | Pred pôrodom: kroky prípravy. Po pôrode: kroky organizácie + Pohoda mamy. Úlohy len **odkazujú** do domovov. | vlastné zápisy pitia/nálady – tie robí Mama (Kruh ich len zobrazí ako hotové) |
| **Zásuvka** | Všetky aplikácie fázy, zoskupené podľa 5 oblastí (namiesto 2 kariet Praktické/Spomienky) | duplicitné aliasy |
| **Spodná lišta** | 4 obľúbené + GuguChat; predvolené podľa fázy (nižšie) | – |
| **GuguChat** | „Kde je…?“, overené odpovede, ďalší krok | vlastné obrazovky s obsahom |
| **Menu ☰** | Profil, nastavenia, súkromie, o appke | aplikácie |

**Návrh predvolenej lišty:**
- Tehotenstvo: **Knižka · Príprava · (GuguChat) · Mama · Nákup**
- Po pôrode: **Záznamy · Knižka · (GuguChat) · Spánok · Momenty**
  (Denník, Menštruačný kalendár, Aktivity a ďalšie si mama pripne sama.)

---

## 6. Názvy (zjednotiť)

| Dnes | Návrh |
|---|---|
| Naše momenty / Rodinný denník / Náš príbeh | **Naše momenty** |
| Zvuky / Spánok / Nočná pomoc / Spánok a náročná noc | **Spánok** (časovač + zvuky + nahrávky + rady na noc) |
| Zdravie / Zdravotné záznamy / Rast a váha / Teplota | **Zdravotná knižka** |
| Výbava a produkty / Nákup | **Nákup** (sekcie Nákup a Výbava) |
| Profily rodiny / Rodina | **Rodina** |
| Urgentná pomoc / Kontakty na pomoc | **Kontakty na pomoc** (panel) |
| Úrady / Vybaviť / Doklady | **Úrady a doklady** (aplikácia); Kruh používa rovnaký názov časti |

---

## 7. Pravidlá pre každú novú aplikáciu (checklist)

1. Do ktorej z 5 oblastí patrí? Ak do žiadnej, nepatrí do appky (alebo je to časť existujúcej).
2. Nie je to už časť inej aplikácie? → pridať ako sekciu, nie novú aplikáciu.
3. V ktorých fázach je viditeľná?
4. Aké sú vchody (Kruh, Mama, GuguChat…) – a vedú všetky na to isté miesto? Šípka späť ide o krok?
5. Jeden názov, jedna ikona.
6. NAV záznam v GuguChate („kde je…“).
7. Obsah len z overeného zdroja s dátumom.

---

## 8. Postup (navrhované poradie, každý krok samostatne a so schválením)

| Krok | Čo | Riziko |
|---|---|---|
| 1 | **Zjednotiť názvy** (sekcia 6) – len texty, žiadne presuny | nízke |
| 2 | **Zásuvka podľa 5 oblastí** + viditeľnosť podľa fázy (sekcia 4) | nízke |
| 3 | **Zdravotná knižka ako jediný domov zdravia** (zlúčiť Zdravie, Rast, Teplotu, Zdravotné záznamy, Návštevu lekára; Zúbky ako sekcia) | stredné – veľa starého kódu V4/V5 |
| 4 | **Spánok** – jedna aplikácia (časovač, zvuky, nahrávky, noc) | stredné |
| 5 | **Nákup + Výbava** spolu; GuguChat a Moja príprava pridávajú do toho istého zoznamu | nízke |
| 6 | **Pomoc a starostlivosť → rozcestník**, Urgentná pomoc → panel Kontakty na pomoc | nízke |
| 7 | **Kruh**: úlohy len odkazujú, pitie/nálada len z Mamy | nízke |
| 8 | **Predvolená lišta** podľa fázy | nízke |
| 9 | **Domov**: vrátiť nenápadný riadok s najbližším termínom z Kalendára (pod Matejov Dnešný malý moment) | nízke |
| 10 | Odstrániť mŕtve aliasy a staré obrazovky V4/V5 (`diary`, `first100`, `cards`, `health`, `growth`, `night`, `guide`…) | stredné – s testom každej cesty |

Po každom kroku: prejsť appku v tehotenstve aj po pôrode, otestovať všetky vchody a šípku späť,
GuguChat „kde je…“.

---

## 9. Otvorené otázky (rozhodne Samuel / Matej)

1. Súhlasíte s 5 oblasťami (Bábätko, Mama, Tehotenstvo, Organizácia, Spomienky) ako skupinami v zásuvke namiesto kariet Praktické / Spomienky?
2. Má Kruh po pôrode ostať **Organizácia + Pohoda**, alebo len Pohoda (pôvodné rozhodnutie 28. 9., bod 9)?
3. Pomoc a starostlivosť – ponechať ako rozcestník, alebo ju úplne nahradiť GuguChatom?
4. Predvolená spodná lišta po pôrode – súhlasíte s Záznamy · Knižka · Spánok · Momenty?
5. Praktické zoznamy – zrušiť, alebo presunúť ich obsah (lekár, choroba, cestovanie) do Zdravotnej knižky a Cestovania?
6. Kalendár na domove – vrátiť malý riadok s najbližším termínom pod Dnešný malý moment?

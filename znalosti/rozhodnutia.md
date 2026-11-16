# Rozhodnutia

Najnovšie hore. Formát: dátum – kto – čo a prečo. Staršie rozhodnutia Samuela (28. 9. 2026) sú
v `guguboo-v2/docs/00-audit-a-plan.md`.

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
- Oprava prípravy umelého mlieka (vetva `oprava-umele-mlieko`, len pre starú V1) je v `guguboo-master` len čiastočne –
  zatiaľ odložené, rozhodne sa neskôr.

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

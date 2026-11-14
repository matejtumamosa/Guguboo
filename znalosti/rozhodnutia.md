# Rozhodnutia

Najnovšie hore. Formát: dátum – kto – čo a prečo. Staršie rozhodnutia Samuela (28. 9. 2026) sú
v `guguboo-v2/docs/00-audit-a-plan.md`.

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

# Guguboo – pokyny pre Claude

Spoločný súbor pre Mateja aj Sama. Claude Code ho číta pri každom otvorení repa. Keď sa na niečom
dohodneme, zapíš to sem alebo do `znalosti/` – nie len do chatu, inak sa to rozíde.

Guguboo je slovenská webová appka pre tehotenstvo, prvé roky s bábätkom a rodinu. Statická stránka
(HTML/CSS/JS), bez buildu a bez servera, nasadená na Netlify.

## Kde je čo

| Priečinok | Čo to je |
|---|---|
| `guguboo-master/` | **Aktuálny vývoj (verzie „Master X.Y“).** Tu sa robia úpravy. |
| `guguboo-v2/` | Staršia beta (V2 2.x). Meniť len keď o to niekto výslovne požiada. |
| `guguboo-v2-upratanie/` | Len kópia na pozretie – tu nepracovať (pozri jej `README.md`). |
| koreň repa (`index.html`, `app.html`, `v5-*.js`…) | Staršia verzia; bez dohody nemeniť. |
| `znalosti/` | Spoločné znalosti: dizajn, rozhodnutia, `stav.md` (kde sme skončili). |
| `guguboo-master/prototyp-*.html` | Schválené prototypy (kruh, úvod) – vzor pre appku, appka na ne neodkazuje. |
| `guguboo-master/web.html`, `sukromie.html`, `dakujeme.html` | Náhľad webu guguboo.com (zatiaľ nenasadený namiesto koreňového `index.html`). |
| `guguboo-v2/docs/00-audit-a-plan.md` | Produktový plán a rozhodnutia Samuela z 28. 9. 2026. |

Náhľad (vetva `v2`, Netlify, za prihlásením):
- Master: https://v2--tranquil-lamington-f829d9.netlify.app/guguboo-master/app.html
- V2: https://v2--tranquil-lamington-f829d9.netlify.app/guguboo-v2/app.html

## Postup práce

- Na začiatku prečítaj `znalosti/stav.md`, na konci práce ho aktualizuj.
- Pracuje sa vo vetve **`v2`**. Push do nej Netlify sám nasadí do minúty-dvoch. Vetva `main` je stará –
  ak je priečinok na `main`, upozorni a nepokračuj.
- Na appke robíme dvaja: **pred úpravou vždy stiahni najnovšiu `v2`** (`git pull --rebase`).
  Pri konflikte zachovaj obe zmeny; nikdy neprepíš cudziu prácu. Necommitnuté zmeny najprv ukáž.
- Cudzí kód (od druhého človeka) radšej vypni a napíš prečo, než by si ho zmazal – dá sa vrátiť.
- Väčšia zmena (nový domov, úvod, kruh): najprv prototyp `prototyp-*.html` → schválenie → zapracovanie
  do appky. Commit prototypu: `Prototyp …`.
- QA: po väčšej verzii nezávislá kontrola (UX, vizuál, texty, funkcie) → nálezy podľa závažnosti
  (vysoké, stredné…) → opravy v samostatných verziách (napr. 1.9.1 vysoké, 1.9.2 stredné) → retest.
  V komentári pri oprave uveď verziu a číslo nálezu, napr. `// Master 1.9.2 (QA S2): …`.
- Pred pushom over zmenu lokálne v prehliadači (stačí ľubovoľný statický server v koreni repa),
  pred aj po pôrode, na šírke mobilu (375 px, aj nízka obrazovka 375 × 667), cez deň aj v noci,
  a skontroluj konzolu.
- Commit a push robí človek (GitHub Desktop) alebo Claude len po jeho súhlase. Po úpravách napíš text do Summary.
- Každé nové rozhodnutie o dizajne, textoch alebo postupe zapíš do `znalosti/rozhodnutia.md`.

## Verzie a cache

- Commit: `Master X.Y.Z: krátky popis po slovensky` (napr. `Master 1.9.1: opravy vysokých nálezov`).
- V `guguboo-master/app.html` zvýš `window.GUGUBOO_V2_VERSION = "Master X.Y.Z"`.
- Verzia môže mať aj dve čísla (`Master 2.6`) – tretie číslo len pre opravy.
- Pri zmene CSS/JS súboru zvýš jeho `?v=` v `app.html` (formát `m1.9.1`; druhá oprava v tej istej verzii
  `m1.9.1a`), inak prehliadač načíta starú verziu.
- V `guguboo-master/sw.js` zvýš `CACHE` (`guguboo-m-app-X.Y`), inak appka na ploche drží staré súbory.
- Commity mimo appky: `Prototyp …`, `Web guguboo.com – …`, `PWA: …`.

## Pravidlá obsahu

- Jazyk slovenský, tykanie. Kde to ide, bez rodu (appku používa mama aj partner).
- **Názvy a piktogramy vždy presne ako v appke** – v sprievodcovi, náhľadoch aj textoch.
  Ikony sú linkové SVG z `iconPaths` vo `v5-mobile.js` (`GugubooV5.icon(...)`); v ovládaní nie emoji.
- Zdravie, vývoj a úrady: nič nevymýšľať. Len overené oficiálne zdroje (NHS, CDC, WHO, ACOG,
  slovensko.sk, socpoist.sk…) so zdrojom a dátumom overenia. Termíny slúžia na načasovanie, nie na hodnotenie.

## Údaje a úložisko

- Master (od 2.6) ukladá údaje natrvalo len v telefóne (`localStorage`), nič neposiela na server.
  Záloha = súbor JSON, ktorý si používateľ uloží sám (`g2-backup.js`).
- Master používa **len kľúče `guguboo-m-*`** (`guguboo-m-state`, `guguboo-m-private-space`…), aby sa
  nebil s V1/V2 na tej istej doméne. Nový kľúč vždy s touto predponou (záloha berie všetko s ňou).
- Service worker a manifest majú rozsah len `guguboo-master/`, nikdy koreň domény.
- V2 beta (`guguboo-v2/`) ukladá len do `sessionStorage` – po zatvorení okna sa dáta zmažú.

## Verejné repo

Repo je verejné. Do kódu, `CLAUDE.md`, `znalosti/` ani commitov nedávaj e-maily, heslá, kľúče,
zmluvy ani financie.

## Znalosti

@znalosti/dizajn.md
@znalosti/rozhodnutia.md

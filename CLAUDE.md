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
| `znalosti/` | Spoločné znalosti: dizajn, rozhodnutia. |
| `guguboo-v2/docs/00-audit-a-plan.md` | Produktový plán a rozhodnutia Samuela z 28. 9. 2026. |

Náhľad (vetva `v2`, Netlify, za prihlásením):
- Master: https://v2--tranquil-lamington-f829d9.netlify.app/guguboo-master/app.html
- V2: https://v2--tranquil-lamington-f829d9.netlify.app/guguboo-v2/app.html

## Postup práce

- Pracuje sa vo vetve **`v2`**. Push do nej Netlify sám nasadí do minúty-dvoch.
- Na appke robíme dvaja: **pred úpravou vždy stiahni najnovšiu `v2`** (`git pull --rebase`).
  Pri konflikte zachovaj obe zmeny; nikdy neprepíš cudziu prácu.
- Cudzí kód (od druhého človeka) radšej vypni a napíš prečo, než by si ho zmazal – dá sa vrátiť.
- Pred pushom over zmenu lokálne v prehliadači (stačí ľubovoľný statický server v koreni repa),
  pred aj po pôrode, na šírke mobilu (375 px), a skontroluj konzolu.
- Push len po súhlase človeka, s ktorým práve pracuješ.

## Verzie a cache

- Commit: `Master X.Y.Z: krátky popis po slovensky` (napr. `Master 1.9.1: opravy vysokých nálezov`).
- V `guguboo-master/app.html` zvýš `window.GUGUBOO_V2_VERSION = "Master X.Y.Z"`.
- Pri zmene CSS/JS súboru zvýš jeho `?v=` v `app.html` (formát `m1.9.1`), inak prehliadač načíta starú verziu.

## Pravidlá obsahu

- Jazyk slovenský, tykanie. Kde to ide, bez rodu (appku používa mama aj partner).
- **Názvy a piktogramy vždy presne ako v appke** – v sprievodcovi, náhľadoch aj textoch.
  Ikony sú linkové SVG z `iconPaths` vo `v5-mobile.js` (`GugubooV5.icon(...)`); v ovládaní nie emoji.
- Zdravie, vývoj a úrady: nič nevymýšľať. Len overené oficiálne zdroje (NHS, CDC, WHO, ACOG,
  slovensko.sk, socpoist.sk…) so zdrojom a dátumom overenia. Termíny slúžia na načasovanie, nie na hodnotenie.
- Beta neukladá dáta natrvalo (`sessionStorage`) – po zatvorení okna sa zmažú.

## Znalosti

@znalosti/dizajn.md
@znalosti/rozhodnutia.md

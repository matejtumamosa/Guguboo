# Dizajn Guguboo

Zdroj pravdy sú tokeny v CSS (`guguboo-master/g2-text.css` pre písmo, `v5-mobile.css`, `master.css`). Tu je prehľad,
aby nové veci vyzerali rovnako.

## Písmo
- **Montserrat** (záložne `Segoe UI`, `system-ui`). Zdroj pravdy: `guguboo-master/g2-text.css` (Master 3.7), tokeny `--t-*`.
- **3 úrovne textu na obrazovke (Master 3.7, platí prednostne):** na jednej obrazovke najviac tri podoby textu + odkaz:

| Úroveň | Token | Hodnota | Farba | Kde |
|---|---|---|---|---|
| Hlavné | `--t-main` | 800 · 18/24 px | `--t-ink` | pozdrav, meno bábätka / týždeň, úloha „Dnes stačí jedno“, hlavička obrazovky a okna, nadpis karty |
| Bežné | `--t-text` | 500 · 15/22 px | `--t-ink` | skratky, hľadanie, „Dnes“ v kruhu, názvy riadkov, odseky, voľby, záložky |
| Drobné | `--t-small` | 500 · 14/20 px | `--t-muted` (jediná sivá) | podnadpisy, štítky (bez kapitálok), popisky lišty, stav, poznámky, zdroje |
| Odkaz | `--t-link` | 700 · 15/20 px | `--t-brand` (tlačidlá farbou tlačidla) | ťukateľné textové odkazy („Neskôr“, „… ›“), text tlačidiel |

  Výnimky: Číslo 800 24/28 (44/48) len v oknách a v strede kruhu pri bežiacom čase; polia formulárov 16 px (iPhone nepribližuje);
  ikony a znaky bez písmen sa nerátajú. Aktívna položka lišty a záložky = len farba značky, nie hrúbka. Fialová len na odkazy.
  Test: domov ≤ 4 kombinácie (veľkosť + hrúbka), hlavné obrazovky ≤ 5 (`test.html`, sada Typografia).
- Pôvodných 7 štýlov (3.6) ostáva ako aliasy tokenov (`--t-title`/`--t-head` = Hlavné, `--t-strong`/`--t-body` = Bežné,
  `--t-caption`/`--t-label` = Drobné); tabuľka nižšie je história:

| Štýl | Hodnota | Farba | Kde |
|---|---|---|---|
| Titulok | 800 · 20/26 px | `--t-ink` | jeden na obrazovku: hlavička domova, záložky, okna |
| Nadpis | 800 · 17/22 px | `--t-ink` | nadpis karty alebo sekcie, meno bábätka / týždeň na domove |
| Silné | 700 · 15/20 px | ink alebo farba tlačidla | názov riadku, úloha, tlačidlá, odkazy, popisky polí, záložky |
| Telo | 500 · 16/24 px | `--t-ink` | odseky, správy GuguChatu, polia formulárov |
| Popis | 500 · 14/20 px | `--t-muted` | jediná sivá: podnadpisy, text pod názvom, poznámky, zdroje, skratky na domove, súhrn v oknách kruhu |
| Štítok | 700 · 13/16 px | sekcia: KAPITÁLKY +.06em `--t-brand` (len v oknách – kicker, skupiny Plánu); inak bez kapitálok `--t-muted` | „Dnes stačí jedno“, lišta, os grafu, kicker týždňa/mesiaca |
| Číslo | 800 · 24/28 px (veľké 44/48) | `--t-ink` | časovač, počty, Pitný režim |

- Hrúbky len 500/700/800. Kapitálky len Štítok sekcie. Min. 14 px (13 px len Štítok). Stav = farba, nie hrúbka.
- Farby textu: `--t-ink` `#29243a`, `--t-muted` `#5d5768`, `--t-brand` `#5f4fb1`; noc `#f5f2fb` / `#c9c3d8` / `#c6bcff`.
- Výnimky: odznak týždňa (`.v2-week-badge`). Master 3.9: stav v dieli kruhu = Drobné 14 px (alebo sa v diele vynechá); šípky „›“ „‹“ a „×“ sú ikony `chevronRight` / `chevronLeft` / `close` cez `GugubooV5.glyph(…)` (1em, farba textu).

## Farby
| Použitie | Hodnota |
|---|---|
| Text | `--v5-ink` / `--g2-ink` `#29243a` |
| Tlmený text | `--v5-muted` `#5d5768` |
| Značka (fialová, tmavá) | `--v5-brand-dark` `#5f4fb1`, ikony `#6a4fc4` |
| Fialová svetlá | `#8171ce` |
| Ružová (srdce, cieľ) | `#f07f98`, text `#d4627d` |
| Broskyňová (akcent, iskričky) | `#f6c89f` |
| Pozadie kariet | prechod `#f6f0ff` → `#fff1ec` (hero `#f4f0ff` → `#fff4f0`) |
| Oblasti | Bábätko `#eaf4fb`/`#2f6a8f`, Mama `#fdecf1`/`#a24766`, Rodina `#e5f3ee`/`#24715f`, Ja `#fff7dc`/`#7d5a10` |

Nočný režim (`body.night`) má vlastné hodnoty tých istých tokenov – nové farby pridávaj ako token aj pre noc.

## Tvary
- Karty zaoblené 22–24 px, jemný tieň, tenký fialový okraj `rgba(117, 96, 181, .14)`.
- Ikona v štvorčeku: 34–46 px, zaoblenie 12–15 px, pozadie `rgba(123, 97, 200, .12)`, ikona `#6a4fc4`.
- Odznak týždňa (`.v2-week-badge`): číslo + „TÝŽDEŇ“, prechod `#f3eeff` → `#fff1ea`.

## Ikony
- Linkové SVG 24×24 z `iconPaths` vo `v5-mobile.js`, volané cez `GugubooV5.icon("meno")`.
- Rovnaká vec = rovnaká ikona všade (domov, lišta, zásuvka, sprievodca). Nová ikona sa pridá do `iconPaths`.

## Pohyb
- Jemné animácie; vždy rešpektuj `prefers-reduced-motion` (bez animácie, rovno výsledok).

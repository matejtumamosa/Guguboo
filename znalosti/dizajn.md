# Dizajn Guguboo

Zdroj pravdy sú tokeny v CSS (`guguboo-master/v5-mobile.css`, `g2-type.css`, `master.css`). Tu je prehľad,
aby nové veci vyzerali rovnako.

## Písmo
- **Montserrat** (záložne `Segoe UI`, `system-ui`). Nadpisy hrubé (800–900), texty 600.

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

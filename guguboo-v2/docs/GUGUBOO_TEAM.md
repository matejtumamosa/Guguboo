# Guguboo – Master Product & Development Team

13. 11. 2026 · platí pre všetkých agentov a prácu na Master Beta 1.0

## Jeden Product Lead
**Product Lead = hlavná relácia Claude Code (koordinátor).** Zodpovedá za to, aby z práce celého tímu vznikla **jedna konzistentná aplikácia**:
- prideľuje úlohy, zbiera návrhy agentov a **rozhoduje pri rozpore**,
- jediný zapisuje rozhodnutia do `docs/DECISIONS.md` a mení zdroje pravdy nižšie,
- implementáciu integruje sám alebo ju výslovne pridelí; agenti nemenia appku na vlastnú päsť,
- každý výsledok overuje v skutočnej appke (nie podľa tvrdení agentov),
- Samuelovi predkladá len zásadné zmeny rozsahu, nákladov, vízie alebo zážitku.

## Zdroje pravdy (žiadne paralelné verzie)
| Čo | Súbor | Mení |
|---|---|---|
| Produktová filozofia | `docs/GUGUBOO_PRODUCT_PHILOSOPHY.md` | Samo |
| Mapa funkcií a umiestnenie | `docs/master/feature-map.json` (+ vizuálna mapa) | Product Lead |
| Dizajnový systém | `docs/master/GUGUBOO_DESIGN_SYSTEM.md` + `master.css` | Product Lead (návrh UI Designer) |
| Technická architektúra | `docs/master/GUGUBOO_TECH_ARCHITECTURE.md` | Product Lead (návrh Software Architect, dáta/účty schvaľuje Matej) |
| Rozhodnutia | `docs/DECISIONS.md` | Product Lead |

Návrh agenta, ktorý je v rozpore so zdrojom pravdy, sa nepoužije, kým ho Product Lead nezapracuje do zdroja pravdy.

## Roly → agenti
| Rola | Agent |
|---|---|
| Product Lead | hlavná relácia (koordinátor) |
| Product Strategist | `guguboo-product-strategist` |
| Senior UX Architect | `guguboo-ux-architect` |
| Senior UI / Visual Designer + Accessibility | `guguboo-ui-designer` |
| UX Researcher + QA Engineer | `guguboo-qa-tester` |
| UX Copywriter / Content Designer | `guguboo-ux-copywriter` |
| Content & Safety | `guguboo-content-reviewer` |
| Software Architect + Frontend + Backend | `guguboo-software-architect` (nový) |
| Security & Privacy | `guguboo-security-privacy` (nový) |
| Produktová analytika | `guguboo-product-analyst` |

## Kontrola kvality každej významnej funkcie
1. Produkt (hodnota, pilier) → 2. UX (umiestnenie, cesta) → 3. vizuál a obsah → 4. technika → 5. funkčný a regresný test v prehliadači (tehotenstvo aj po pôrode). Až potom „hotové“.

## Poradie
A – produktová architektúra (mapa, navigácia, cesty) · B – interaktívny návrh · C – vývoj vo vetve `guguboo-master-dev` · D – overenie · E – pripravenosť na betu. Produkcia sa nemení bez výslovného schválenia.

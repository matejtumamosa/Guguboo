# Aktuálny stav – kde sme skončili

Krátky prehľad pre ďalší chat. **Na konci každej práce ho aktualizuj** (verzia, čo je hotové, čo ďalej).

_Naposledy aktualizované: 16. 11. 2026 (Samo)_

## Verzia

- **Master 2.6** vo vetve `v2`, priečinok `guguboo-master/`.
- Náhľad: https://v2--tranquil-lamington-f829d9.netlify.app/guguboo-master/app.html
- Posledné commity (15. 11. 2026): Master 2.6, náhľad webu guguboo.com, PWA manifest s prihlásením.

## Čo je hotové (Master 2.x, 15. 11. 2026)

- **2.0 – 2.1:** nový kruh *Čas pre teba*, kruh ako rýchle ovládanie, *Čas pre teba* v sekcii Mama.
- **2.2:** jedinečný kruh, pokojné názvy, zdieľanie s partnerom; 2.2.1 fľaša a hlásenia; 2.2.2 bez duplicít.
- **2.3:** lišta ako záložky.
- **2.4:** počasie automaticky (`g2-weather.js`).
- **2.5:** kruh podľa zhody tímu (`g2-ring.js`).
- **2.6:** údaje natrvalo v telefóne, záloha (`g2-backup.js`), appka na plochu (`manifest.webmanifest`, `sw.js`, ikony).
- **Web guguboo.com:** náhľad úvodnej stránky – `web.html`, `sukromie.html`, `dakujeme.html`.

## Rozpracované / ďalej

- Overiť pridanie na plochu na Androide aj iPhone (náhľad je za prihlásením).
- Web guguboo.com: zatiaľ len náhľad v `guguboo-master/web.html` – ešte nie je nasadený namiesto `index.html` v koreni.
- Oprava prípravy umelého mlieka: v `guguboo-master/app.html` ešte chýba text úlohy „Pripraviť fľašu“
  (návod na balení, čerstvo, nie mikrovlnka, test na zápästí, zvyšok vyliať), automatické doplnenie bez
  „bezpečnej teploty podľa rutiny“ a pole „Voda / teplota“ → „Voda / príprava“. Návrh: Master 2.6.1. Čaká na Sama.
- Komentáre v kóde odkazujú na `docs/master/…` (VISUAL_SWEEP, UVOD_NAVRH, HLAVNA_VETA, KRUH_ZHODA, POCASIE_…) –
  tie súbory nie sú v repe. Zistiť, kde sú.

## Posledná práca (16. 11. 2026)

- `CLAUDE.md` zosúladený s praxou; do `znalosti/rozhodnutia.md` doplnené rozhodnutia Master 0.1 – 2.6.

## Pozor

- Vetva `main` je stará (V7.6 z 25. 9. 2026). Pracuje sa vo `v2` – v GitHub Desktop musí byť *Current branch: v2*.

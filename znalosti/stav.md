# Aktuálny stav – kde sme skončili

Krátky prehľad pre ďalší chat. **Na konci každej práce ho aktualizuj** (verzia, čo je hotové, čo ďalej).

_Naposledy aktualizované: 16. 11. 2026 (Samo, Claude)_

## Verzia

- **Master 2.7** vo vetve `v2`, priečinok `guguboo-master/`.
- Náhľad: https://v2--tranquil-lamington-f829d9.netlify.app/guguboo-master/app.html
- Web (náhľad): https://v2--tranquil-lamington-f829d9.netlify.app/guguboo-master/web.html

## Čo je hotové

- **2.0 – 2.6:** pozri `znalosti/rozhodnutia.md` (kruh, lišta, počasie, údaje v telefóne, appka na plochu).
- **2.7 – informujeme, neradíme:** bez liekov, dávok a postupov pri príznakoch; Starostlivosť o bábätko =
  zapíš, čo pozoruješ + otázka pre pediatra; Otázky pre lekára na jednom mieste; vážne situácie v `g2-safety.js`;
  Zúbky bez návodov; kruh Čas pre teba bez „Kŕč v nohe“; Pripravená postieľka (NHS, The Lullaby Trust).
- **Inštalácia na plochu** overená na Androide (Samo, 15. 11.).

## Rozpracované / ďalej

- Ikony namiesto textu (nové pravidlo) – najprv kruh a karty; navrhne UI dizajnér.
- Vety ⚕ v `g2-safety.js` a Pripravená postieľka – potvrdí odborný garant (pediater), keď sa nájde.
- Web guguboo.com: zapnúť Netlify Form detection, doplniť dátum účinnosti a e-mail na pozvánky v `sukromie.html`,
  právnik pred spustením. Potom web + Master nahradia V1 na guguboo.com (cez PR do `main`).
- Písmo appky: Montserrat sa načítava z Google Fonts – nahradiť vlastným hostovaním (čaká na súhlas Sama).
- Fotky a nahrávky sú v `localStorage` (~5 MB) – presun médií do IndexedDB.
- Oprava prípravy umelého mlieka – odložené (pozri rozhodnutie 16. 11.).

## Pozor

- Vetva `main` je stará (V7.6 z 25. 9. 2026). Pracuje sa vo `v2` – v GitHub Desktop musí byť *Current branch: v2*.
- Interné analýzy agentov (hodnotenie konkurencie, návrhy) sú len lokálne na Samovom PC – repo je verejné.

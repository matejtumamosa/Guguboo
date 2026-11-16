# Aktuálny stav – kde sme skončili

Krátky prehľad pre ďalší chat. **Na konci každej práce ho aktualizuj** (verzia, čo je hotové, čo ďalej).

_Naposledy aktualizované: 16. 11. 2026 večer (Claude)_

## Verzia

- **Master 3.0** vo vetve `v2`, priečinok `guguboo-master/`.
- Náhľad: https://v2--tranquil-lamington-f829d9.netlify.app/guguboo-master/app.html
- Web (náhľad): https://v2--tranquil-lamington-f829d9.netlify.app/guguboo-master/web.html

## Čo je hotové

- **2.0 – 2.6:** pozri `znalosti/rozhodnutia.md` (kruh, lišta, počasie, údaje v telefóne, appka na plochu).
- **2.7 – informujeme, neradíme:** bez liekov, dávok a postupov pri príznakoch; Starostlivosť o bábätko =
  zapíš, čo pozoruješ + otázka pre pediatra; Otázky pre lekára na jednom mieste; vážne situácie v `g2-safety.js`;
  Zúbky bez návodov; kruh Čas pre teba bez „Kŕč v nohe“; Pripravená postieľka (NHS, The Lullaby Trust).
- **Inštalácia na plochu** overená na Androide (Samo, 15. 11.).
- **2.8 (Fáza 1):** testovacia stránka `guguboo-master/test.html` (pred commitom musí byť celá zelená); úrady a sumy k 1. 1. 2027 (Sociálna poisťovňa; rodičovský a daňový bonus 2027 ešte nezverejnené – poznámka), odvodová úľava 300 €, „Orientačná suma“ a upozornenie po dátume kontroly; skryté zvyšky Premium; oprava pádu Menštruačného kalendára.

## Rozpracované / ďalej

- Ikony namiesto textu (nové pravidlo) – najprv kruh a karty; navrhne UI dizajnér.
- **2.9:** fotky a nahrávky v IndexedDB (`g2-media.js`, `guguboo-m-media`, stav schéma 2), záloha schéma 2 aj s médiami, vlastné písmo Montserrat (`fonts/`, bez Google Fonts). 2.8.1–2.8.3: opravy úvodu a rozmazaného textu na iPhone.
- **3.0:** ikony (kruh, okná, Mama, Čas pre teba – bez emoji v ovládaní, 33 ikon Phosphor), názvy bez negatív („Čo je bežné“, „Nálada a podpora“), 84 kratších textov, hľadanie = GuguChat (zásuvka len aplikácie), ukážkový režim `app.html?ukazka=pred|po` pre web.
- Fáza 1 ďalej: časová os nárokov (náhľad) · rozmazanie na iPhone 16e (úloha #9) · kontrola na iPhone a Androide · test s mamami. Prototyp kvetu namiesto kruhu (`prototyp-kvet.html`) – rozpracovaný.
- Na rozhodnutie: ako počítať týždeň (39+0 = 39. alebo 40.), vek v dňoch sa mení o poludní; Menštruačný kalendár ešte sám hodnotí menštruáciu > 7 dní (audit #28).
- Spustenie guguboo.com: PR #8 (čaká na Sama – keď sa začne testovanie).
- Web guguboo.com: zapnúť Netlify Form detection, doplniť dátum účinnosti a e-mail na pozvánky v `sukromie.html`,
  právnik pred spustením. Potom web + Master nahradia V1 na guguboo.com (cez PR do `main`).
- Písmo appky: Montserrat sa načítava z Google Fonts – nahradiť vlastným hostovaním (čaká na súhlas Sama).
- Fotky a nahrávky sú v `localStorage` (~5 MB) – presun médií do IndexedDB.
- Oprava prípravy umelého mlieka – odložené (pozri rozhodnutie 16. 11.).

## Pozor

- Vetva `main` je stará (V7.6 z 25. 9. 2026). Pracuje sa vo `v2` – v GitHub Desktop musí byť *Current branch: v2*.
- Interné analýzy agentov (hodnotenie konkurencie, návrhy) sú len lokálne na Samovom PC – repo je verejné.

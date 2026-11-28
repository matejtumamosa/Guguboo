/* GUGUBOO V2 – okienko Mama (tehotenstvo). Texty sú zhrnuté vlastnými slovami len z uvedených stránok NHS;
 * pri každej téme je doslovná citácia (evidence) a dátum, kedy NHS stránku naposledy kontrolovalo.
 * Overené 16. 10. 2026 (Samuel: nič z pamäte AI).
 * Master 2.7 – „informujeme, neradíme“ (Samo 15. 11. 2026, docs/master/INFORMUJEME_AUDIT.md P1-A):
 * pri ťažkostiach len „čo je bežné“ (common, citát overený 15. 11. 2026) + jedna veta, kedy sa ozvať (ask = kľúč
 * v G2Safety.line, alebo vlastná veta askText) + otázka pre lekára (askPrompt) + výnimka (safety = E1–E7 v g2-safety.js).
 * Žiadne postupy pri príznaku, lieky ani dávky. ⚕ Pred testom overí odborník. */
window.GugubooContent = window.GugubooContent || {};
window.GugubooContent.mamaPregnancy = {
  checked: "15. 11. 2026",
  troubles: [
    {
      id: "nausea",
      title: "Nevoľnosť a vracanie",
      emoji: "🍋",
      common: ["Nevoľnosť a vracanie sú na začiatku tehotenstva veľmi časté. Zvyčajne prejdú medzi 16. a 20. týždňom a bábätku neublížia."],
      ask: "gyn",
      askPrompt: "Mám nevoľnosť a vraciam.",
      source: "https://www.nhs.uk/pregnancy/common-symptoms/vomiting-and-morning-sickness/",
      reviewed: "17. 4. 2024",
      evidence: "Nausea and vomiting in pregnancy … is very common in early pregnancy … usually clears up by weeks 16 to 20 … does not put your baby at any increased risk"
    },
    {
      id: "heartburn",
      title: "Pálenie záhy",
      emoji: "🔥",
      common: ["Pálenie záhy je v tehotenstve časté. Spôsobujú ho hormonálne zmeny a rastúce bábätko, ktoré tlačí na žalúdok."],
      ask: "gyn",
      askPrompt: "Trápi ma pálenie záhy.",
      source: "https://www.nhs.uk/pregnancy/common-symptoms/indigestion-and-heartburn/",
      reviewed: "14. 11. 2023",
      reviewDue: "14. 11. 2026", // Master 4.0 (Audit Z18): stránka znovu prečítaná 27. 11. 2026 – citát sedí; NHS revíziu zatiaľ nevydala
      evidence: "Indigestion and heartburn is common in pregnancy … hormonal changes and the growing baby pressing against your stomach"
    },
    {
      id: "cramp",
      title: "Kŕče v nohách",
      emoji: "🦵",
      common: ["Kŕč je náhla ostrá bolesť, zvyčajne v lýtku alebo chodidle. Najčastejšie prichádza v noci."],
      ask: "gyn",
      askPrompt: "Mávam kŕče v nohách.",
      source: "https://www.nhs.uk/pregnancy/common-symptoms/common-health-problems/",
      reviewed: "22. 4. 2024",
      evidence: "Cramp is a sudden, sharp pain, usually in your calf muscles or feet. It's most common at night."
    },
    {
      id: "swelling",
      title: "Opuchy nôh, chodidiel a prstov",
      emoji: "🦶",
      common: ["Určitý opuch nôh, členkov, chodidiel a prstov je v tehotenstve normálny. Býva horší večer a v neskoršom tehotenstve."],
      ask: "gyn",
      safety: "E2",
      askPrompt: "Mám opuchy nôh.",
      source: "https://www.nhs.uk/pregnancy/common-symptoms/swollen-ankles-feet-and-fingers/",
      reviewed: "19. 4. 2024",
      evidence: "It's normal to get some swelling … It's often worse at the end of the day and further into your pregnancy … Call your midwife, GP or labour ward immediately if you have: a sudden increase in swelling in your face, hands or feet"
    },
    {
      id: "tiredness",
      title: "Únava a spánok",
      emoji: "🌙",
      common: ["Únava, aj veľká, je v tehotenstve bežná, najmä v prvých 12 týždňoch."],
      // Informácia (nie rada pri príznaku) – audit #19e, #33.
      info: ["NHS uvádza, že najbezpečnejšie je zaspávať na boku – ľavom alebo pravom."],
      askText: "Ak sa cítiš smutne alebo beznádejne, môže pomôcť porozprávať sa s lekárom alebo pôrodnou asistentkou.", // Master 4.0.1 (Kontrola OBSAH N25): bez rozkazu
      askPrompt: "Som veľmi unavená a zle spím.",
      source: "https://www.nhs.uk/pregnancy/common-symptoms/tiredness/",
      reviewed: "11. 3. 2024",
      evidence: "It's common to feel tired, or even exhausted … especially in the first 12 weeks … The safest position to go to sleep is on your side, either left or right."
    },
    {
      id: "constipation",
      title: "Zápcha",
      emoji: "🥦",
      common: ["Hormonálne zmeny môžu spôsobiť zápchu už na začiatku tehotenstva."],
      askText: "Ak užívaš železo, môžeš sa na zápchu opýtať lekára.",
      askPrompt: "Mám zápchu – súvisí to so železom?",
      source: "https://www.nhs.uk/pregnancy/common-symptoms/common-health-problems/",
      reviewed: "22. 4. 2024",
      evidence: "hormonal changes … may cause you to become constipated very early on"
    }
  ],
  food: {
    avoid: [
      "nepasterizované mlieko a výrobky z neho (aj kozie a ovčie)",
      "mäkké syry s bielou plesňou (brie, camembert, kozí chèvre) a s modrou plesňou (gorgonzola, roquefort) – iba dôkladne tepelne upravené",
      "surové alebo nedostatočne tepelne upravené mäso",
      "pečeň a výrobky z pečene",
      "surové ryby a surové morské plody",
      "mečúň, žralok a marlín",
      "surové alebo nedovarené kačacie, husacie a prepeličie vajcia",
      "bylinkové čaje so sladkým drievkom"
    ],
    // Master 4.0 (Audit Z1, spresnené pravidlo Sama 27. 11.): množstvá ostávajú ako informácia „NHS uvádza…“ so zdrojom
    // a dátumom, nie ako príkaz; k tomu otázka pre lekára.
    limitTitle: "Čo NHS uvádza o množstve",
    limit: [
      "kofeín – najviac 200 mg denne" /* Master 4.0.1 (Kontrola N9): zdroj nesie nadpis „Čo NHS uvádza o množstve“ */,
      "tuniak – najviac 4 konzervy alebo 2 steaky týždenne",
      "tučné ryby (losos, pstruh, makrela, sardinky, sleď) – najviac 2 porcie týždenne"
    ],
    askPrompt: "Koľko kávy a rýb môžem v tehotenstve?",
    alcohol: "Alkohol môže bábätku dlhodobo uškodiť – podľa NHS je najbezpečnejšie nepiť ho vôbec.",
    source: "https://www.nhs.uk/pregnancy/keeping-well/foods-to-avoid/",
    reviewed: "15. 6. 2026",
    evidence: "you should not have more than 200mg of caffeine a day … It's safest to avoid alcohol."
  },
  // Master 2.7 (audit #11): dávky a obdobia doplnkov ODSTRÁNENÉ – appka neurčuje doplnky. Len otázka pre lekára.
  // Pečeň a výrobky z pečene sú v zozname potravín (food.avoid) ako informácia NHS.
  vitamins: {
    text: "O vitamínoch a doplnkoch v tehotenstve sa porozprávaj s gynekológom.",
    askPrompt: "Aké vitamíny alebo doplnky mám v tehotenstve užívať?",
    source: "https://www.nhs.uk/pregnancy/keeping-well/pregnancy-vitamins-and-supplements/",
    reviewed: "3. 6. 2026"
  },
  exercise: {
    // Doplnené 10. 11. 2026 z tej istej stránky NHS (stránka z 24. 9. 2026).
    moveExamples: "Napríklad chôdza, plávanie alebo joga. Mierna aktivita je taká, pri ktorej sa ešte dá rozprávať, ale nie spievať.",
    strengthExamples: "Napríklad joga, nosenie nákupu alebo detí; posilňovňa, ak tam chodíš už teraz.",
    examplesEvidence: "Walking, swimming and yoga … can count towards the 150 minutes a week. … you should be able to talk but not sing. | Try to include 2 sessions of muscle strengthening exercises each week … yoga, carrying shopping and carrying children",
    // Master 4.0 (Audit Z2): cieľ „150 minút týždenne / 2-krát posilňovanie / 10 minút denne“ (pole `goal`) ODSTRÁNENÝ –
    // je to cieľ a norma. Ostávajú len príklady pohybu (informácia so zdrojom) a otázka pre lekára.
    // Master 4.0 (spresnené pravidlo 27. 11.): bez rozkazov – mäkko „môže…“, „NHS uvádza…“.
    tips: [
      "Trénerovi alebo inštruktorke môžeš povedať, že si tehotná.",
      "Môže pomôcť piť vodu a obliecť sa tak, aby ti nebolo horúco.",
      "Prestať, keď je nepríjemne, príliš teplo alebo zle." /* Master 4.0.1 (Kontrola N9): nadpis „Čo uvádza NHS“ */
    ],
    avoid: [
      "športy s rizikom pádu alebo úderu do brucha (hokej, rugby, horská cyklistika)",
      "cvičenie nalačno",
      "potápanie s prístrojom",
      "začínať nový náročný šport, napríklad beh",
      "v neskoršom tehotenstve dlhšie ležať na chrbte"
    ],
    note: "Aký pohyb je pre teba vhodný, sa môžeš opýtať lekára.",
    askPrompt: "Aký pohyb je pre mňa v tehotenstve vhodný?",
    source: "https://www.nhs.uk/pregnancy/keeping-well/exercise/",
    reviewed: "24. 9. 2026",
    evidence: "Stop if you feel uncomfortable, too hot, or unwell."  // cieľ 150 min ostáva mimo appky (Audit Z2)
  }
};

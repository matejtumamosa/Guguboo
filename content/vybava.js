/* GUGUBOO V2 – Výbava pre bábätko: čo, koľko a kedy (pre GuguChat a Moju prípravu).
 * Len z NHS: „What to buy for your newborn baby“ (zoznamy, koľko kusov, čo má byť nové) a
 * „Pack your bag for labour“ (taška aspoň 3 týždne pred termínom). Overené 4. 11. 2026.
 * Konkrétne slovenské pravidlá pre autosedačky sme z oficiálneho zdroja zatiaľ neoverili – preto ich neuvádzame. */
window.GugubooContent = window.GugubooContent || {};
window.GugubooContent.vybava = {
  checked: "4. 11. 2026",
  buySource: "https://www.nhs.uk/best-start-in-life/pregnancy/preparing-for-labour-and-birth/what-to-buy-for-your-newborn-baby/",
  bagSource: "https://www.nhs.uk/pregnancy/labour-and-birth/preparing-for-the-birth/pack-your-bag-for-labour/",
  general: "Netreba kupovať všetko naraz – začni so základom a ostatné dokúp podľa potreby. Nové má byť len matrac do postieľky a autosedačka, zvyšok môže byť aj z druhej ruky.",
  bagWhen: "Tašku do pôrodnice je dobré mať zbalenú aspoň 3 týždne pred termínom – pre prípad, že bábätko príde skôr.",
  evidence: "Start with the essentials and add other items as you need them. … Not everything needs to be brand new, except the cot mattress and the car seat. | It might be a good idea to get your hospital bag packed at least 3 weeks ahead of the due date.",
  topics: [
    {
      id: "clothes", checklist: "home",
      words: ["dupac", "body", "bodic", "overal", "obleceni", "oblecen", "ponozk", "ciapk", "rukavick", "svetrik", "kombinez", "velkost oblecen"],
      title: "Oblečenie pre bábätko",
      items: ["aspoň 6 overalov na spanie (dupačiek)", "4–6 body s cvočkami pod plienkou", "2 svetríky z vlny alebo bavlny", "rukavičky proti škriabaniu, ponožky alebo papučky", "čiapka podľa ročného obdobia", "kombinéza, ak je chladno"],
      when: "Oblečenie na prvé dni patrí aj do tašky do pôrodnice – maj ho preto doma pár týždňov pred termínom. Bábätká rýchlo rastú, preto stačí základ a ostatné dokúpiš."
    },
    {
      id: "carseat", checklist: "home",
      words: ["autosedac", "vajicko", "vajicko do auta", "sedacka do auta", "isofix"],
      title: "Autosedačka",
      items: ["autosedačka pre novorodenca, montovaná proti smeru jazdy", "má byť nová (nie z druhej ruky)"],
      when: "Ak pôjdete z pôrodnice autom, potrebuješ ju už na cestu domov – maj ju pripravenú spolu s taškou do pôrodnice, teda aspoň 3 týždne pred termínom."
    },
    {
      id: "sleep", checklist: "home",
      words: ["postielk", "matrac", "kosik", "spaci vak", "plachty", "perink", "vankus", "kde bude spat", "spanie babatka"],
      title: "Spánok",
      items: ["postieľka, prenosná postieľka alebo košík", "pevný rovný matrac, ktorý presne sedí – bez medzier (nový)", "nepremokavý chránič matraca", "aspoň 4 napínacie plachty", "2 spacie vaky alebo plachty a deka – bez periny a vankúša"],
      when: "Miesto na spánok priprav ešte pred pôrodom – bábätko ho potrebuje hneď po príchode domov."
    },
    {
      id: "pram", checklist: "home",
      words: ["kocik", "kocár", "kocar", "nosic", "satka na nosenie"],
      title: "Kočík",
      items: ["kočík s úplne sklopiteľným sedadlom, aby bábätko mohlo ležať"],
      when: "Kočík je dobré mať pred prvou prechádzkou – stačí ho kúpiť pred pôrodom, netreba hneď na začiatku tehotenstva."
    },
    {
      id: "nappies", checklist: "home",
      words: ["plienk", "pampers", "obrusk", "prebal", "krem na zapar", "zapar"],
      title: "Prebaľovanie",
      items: ["niekoľko balení plienok pre novorodenca (jednorazové alebo látkové)", "vata alebo jemné obrúsky bez parfumu a alkoholu", "prebaľovacia podložka alebo uterák", "ochranný krém proti zapareninám"],
      when: "Plienky a obrúsky patria do tašky do pôrodnice aj domov. Veľkosť plienok je na balení podľa váhy bábätka – začína sa najmenšou (pre novorodenca)."
    },
    {
      id: "bath", checklist: "home",
      words: ["vanick", "kupanie", "kupat", "uterak", "osusk"],
      title: "Kúpanie",
      items: ["vanička (stačí aj lavór)", "uteráky"],
      when: "Stačí mať doma pred príchodom bábätka – netreba špeciálne vybavenie."
    },
    {
      id: "feeding", checklist: "home",
      words: ["odsavack", "flas", "flias", "cumlik", "sterilizat", "umele mlieko", "podprsenk", "vlozky do podprsenk", "musel", "na dojcenie"],
      title: "Kŕmenie",
      items: ["podprsenky na dojčenie – zmeraj sa okolo 36.–38. týždňa", "vložky do podprsenky a krém na bradavky", "odsávačka (ak ju chceš)", "mušelínky na odgrgnutie", "pri umelom mlieku: fľaše s cumlíkmi, sterilizátor, kefky a mlieko"],
      when: "Podprsenky na dojčenie kúp okolo 36.–38. týždňa, keď sa veľkosť prsníkov už ustáli. Ostatné stačí mať pred pôrodom."
    }
  ]
};

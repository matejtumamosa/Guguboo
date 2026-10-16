/* GUGUBOO V2 – okienko Mama po pôrode (šestonedelie). Len NHS, zhrnuté vlastnými slovami, pri každej téme
 * citácia (evidence) a dátum, kedy NHS stránku naposledy kontrolovalo. Overené 16. 10. 2026.
 * Tiesňové číslo: NHS uvádza britské 999 – v appke slovenské 155 / 112 (rovnako ako Kontakty na pomoc). */
window.GugubooContent = window.GugubooContent || {};
window.GugubooContent.mamaPostpartum = {
  checked: "16. 10. 2026",
  troubles: [
    {
      id: "bleeding",
      title: "Krvácanie po pôrode",
      emoji: "🩸",
      tips: [
        "Krvácanie trvá niekoľko týždňov. Spočiatku je dosť silné, pri dojčení môže byť červenšie a silnejšie.",
        "Postupne hnedne a slabne, až prestane. Môžeš cítiť aj kŕče podobné menštruačným.",
        "Používaj veľmi savé vložky a pravidelne ich meň. Pred a po si umy ruky.",
        "Tampóny radšej až po kontrole po pôrode (okolo 6. týždňa)."
      ],
      doctorIntro: "Povedz pôrodnej asistentke alebo lekárovi,",
      doctor: ["ak odchádzajú veľké krvné zrazeniny"],
      emergency: "Ak je krvácanie náhle a veľmi silné a cítiš sa na odpadnutie, máš závrat alebo búšenie srdca, volaj záchrannú službu 155 alebo 112.",
      source: "https://www.nhs.uk/pregnancy/labour-and-birth/your-body/",
      reviewed: "25. 4. 2024",
      evidence: "The bleeding will carry on for a few weeks. It will be quite heavy at first. … If you're losing blood in large clots, tell your midwife. | early-days (27. 1. 2026): Call 999 if you've got postnatal bleeding and: the bleeding is sudden and very heavy; you feel faint, dizzy or have a pounding heart"
    },
    {
      id: "stitches",
      title: "Stehy a hrádza",
      emoji: "🛁",
      tips: [
        "Každý deň sa okúpaj alebo osprchuj len čistou teplou vodou a jemne sa osuš – pomáha to predísť infekcii.",
        "Pri stolici si na stehy prilož čistý papierový obrúsok a netlač.",
        "Pomôcť môžu lieky proti bolesti. Ak dojčíš, predtým sa poraď s lekárnikom, pôrodnou asistentkou alebo lekárom."
      ],
      doctorIntro: "Povedz pôrodnej asistentke,",
      doctor: ["ak ťa stehy bolia alebo sú nepríjemné"],
      source: "https://www.nhs.uk/pregnancy/labour-and-birth/your-body/",
      reviewed: "25. 4. 2024",
      evidence: "bathe them every day to help prevent infection … If your stitches are sore or uncomfortable, tell your midwife. … check with a pharmacist, midwife or GP before you buy over-the-counter painkillers"
    },
    {
      id: "csection",
      title: "Po cisárskom reze",
      emoji: "🩹",
      tips: [
        "Ranu každý deň jemne umy a osuš. Nos voľné pohodlné oblečenie a bavlnenú spodnú bielizeň.",
        "Nenos nič ťažšie ako bábätko, kým sa necítiš pripravená.",
        "Zostaň jemne aktívna, napríklad denná prechádzka, ale nepreťažuj sa.",
        "Úplné zotavenie trvá niekoľko týždňov. Šoférovanie, cvičenie a sex zvyčajne až okolo 6 týždňov – keď ti to je príjemné."
      ],
      doctorIntro: "Ozvi sa hneď pôrodnej asistentke alebo lekárovi, ak máš:",
      doctor: [
        "silnú bolesť, únik moču alebo bolesť pri močení",
        "silné krvácanie",
        "ranu, ktorá je červenšia, bolestivejšia, opuchnutá alebo z nej vyteká hnis či zapáchajúca tekutina",
        "kašeľ alebo dýchavičnosť",
        "opuch alebo bolesť v lýtku"
      ],
      source: "https://www.nhs.uk/conditions/caesarean-section/recovery/",
      reviewed: "4. 1. 2023",
      evidence: "gently clean and dry the wound every day … carrying anything heavier than your baby … severe pain; leaking urine or pain when peeing; heavy vaginal bleeding; a wound that becomes redder, more painful, or swollen …"
    },
    {
      id: "toilet",
      title: "Močenie, stolica a hemoroidy",
      emoji: "🚽",
      tips: [
        "Pi veľa vody – moč je redší a menej štípe.",
        "Je bežné, že stolicu nemáš niekoľko dní po pôrode. Netlač.",
        "Hemoroidy sú po pôrode veľmi časté a zvyčajne zmiznú do pár dní či týždňov. Netlač, zhoršuje ich to.",
        "Lekárnik alebo pôrodná asistentka ti poradí upokojujúci krém či masť."
      ],
      doctorIntro: "Povedz pôrodnej asistentke,",
      doctor: ["ak ti je naozaj ťažké vymočiť sa", "ak má moč nepríjemný zápach"],
      source: "https://www.nhs.uk/pregnancy/labour-and-birth/your-body/",
      reviewed: "25. 4. 2024",
      evidence: "Drinking lots of water dilutes your urine, which may make it sting less. … Piles (haemorrhoids) are very common after birth but usually disappear within a few days or weeks."
    },
    {
      id: "breasts",
      title: "Prsia",
      emoji: "🤱",
      tips: [
        "Na 3. – 4. deň môžu byť prsia napäté a citlivé, keď sa začína tvoriť mlieko. Pomôže dobrá podprsenka na dojčenie.",
        "Pri zápale prsníka (mastitíde) býva jedno miesto opuchnuté, horúce a bolestivé, niekedy s príznakmi ako pri chrípke.",
        "Pri zápale pokračuj v dojčení, kedykoľvek bábätko chce, a oddychuj. Pri bolesti či horúčke pomôže paracetamol alebo ibuprofén."
      ],
      doctorIntro: "Ozvi sa,",
      doctor: [
        "pôrodnej asistentke, ak ti je s prsiami veľmi nepríjemne",
        "lekárovi, ak sa zápal nezlepší do 12 – 24 hodín domácej starostlivosti",
        "lekárovi, ak sa nezlepší ani 48 hodín po začatí antibiotík"
      ],
      source: "https://www.nhs.uk/conditions/mastitis/",
      reviewed: "17. 3. 2023",
      evidence: "continue to breastfeed your baby when they want and for as long as they want … take paracetamol or ibuprofen … symptoms don't improve within 12 to 24 hours | your-body: the third or fourth day, they may feel tight and tender as they start to produce milk"
    },
    {
      id: "pelvic",
      title: "Brucho a panvové dno",
      emoji: "🧘",
      tips: [
        "Cviky panvového dna posilňujú svaly okolo močového mechúra, pošvy a konečníka. Postupne do 10 opakovaní, aspoň 3-krát denne, a dýchaj normálne.",
        "Rozostúpené brušné svaly sú po tehotenstve bežné a zvyčajne sa zatiahnu do 8 týždňov.",
        "Spočiatku vynechaj sedy-ľahy, plank, skoky, tlačenie na WC a dvíhanie ťažkého.",
        "Pri kŕmení si podopri spodnú časť chrbta, bábätko prebaľuj vo výške a pri dvíhaní pokrč kolená. Na vyvýšenom mieste ho nikdy nenechávaj samé."
      ],
      doctorIntro: "Ozvi sa lekárovi,",
      doctor: ["ak je medzera v bruchu po 8 týždňoch stále zreteľná", "ak ťa akýkoľvek telesný problém trápi – kedykoľvek"],
      source: "https://www.nhs.uk/baby/support-and-services/your-post-pregnancy-body/",
      reviewed: "20. 7. 2026",
      evidence: "Aim to build up to 10 repeats of each exercise, at least 3 times a day. … If a physical problem is bothering you, ask a GP or health visitor for help at any time. … Never leave your baby unattended on a raised surface"
    },
    {
      id: "serious",
      title: "Na čo si dať pozor",
      emoji: "🔔",
      tips: [
        "Väčšina ťažkostí po pôrode je bežná a prejde. Pri týchto príznakoch sa ale oplatí ozvať hneď."
      ],
      doctorIntro: "Povedz to hneď pôrodnej asistentke alebo lekárovi:",
      doctor: [
        "horúčka a citlivé, bolestivé brucho",
        "bolesť hlavy, zmeny videnia alebo vracanie",
        "bolesť na hrudi alebo ťažké dýchanie",
        "bolesť, opuch alebo začervenanie lýtka jednej nohy",
        "náhle alebo veľmi silné krvácanie, pocit na odpadnutie, rýchly tep"
      ],
      source: "https://www.nhs.uk/pregnancy/labour-and-birth/your-body/",
      reviewed: "25. 4. 2024",
      evidence: "Tell your midwife, health visitor or GP straight away if you get any of these symptoms."
    }
  ],
  check: {
    when: "Okolo 6. – 8. týždňa po pôrode býva kontrola, ktorá overí, že sa dobre zotavuješ. Termín si dohodni so svojím gynekológom.",
    items: [
      "ako sa cítiš a ako sa máš psychicky",
      "či ešte krváciaš alebo máš výtok a či si už mala menštruáciu",
      "tlak, ak si mala ťažkosti v tehotenstve alebo hneď po pôrode",
      "ako sa hoja stehy po nastrihnutí alebo cisárskom reze",
      "antikoncepcia",
      "ako ide kŕmenie bábätka"
    ],
    source: "https://www.nhs.uk/baby/support-and-services/your-6-week-postnatal-check/",
    reviewed: "9. 10. 2026",
    evidence: "6 to 8 weeks after your baby's birth … You'll be asked how you're feeling … You'll be asked about contraception."
  },
  mood: {
    blues: "V prvom týždni po pôrode je bežné cítiť sa smutne, plačlivo alebo úzkostne. Hovorí sa tomu baby blues a zvyčajne to prejde do 2 týždňov.",
    signsIntro: "Ak to trvá dlhšie alebo sa pridá niečo z tohto, môže ísť o popôrodnú depresiu – a tá sa dá liečiť:",
    signs: [
      "smútok a nič ťa neteší",
      "pocit beznádeje alebo že to nezvládaš",
      "vina, pocit, že si zlá mama",
      "neustály strach, úzkosť alebo podráždenosť",
      "nespavosť, aj keď máš čas oddychovať",
      "ťažkosti so sústredením a rozhodovaním",
      "ťažké pocity k bábätku",
      "myšlienky ublížiť sebe alebo bábätku"
    ],
    help: "Porozprávaj sa s lekárom čo najskôr – aj keď máš len niektoré z týchto prejavov. Nie si v tom sama.",
    sleep: [
      "Oddychuj, keď spí bábätko.",
      "Požiadaj partnera, rodinu alebo kamarátku, nech bábätko chvíľu postrážia, kým si zdriemneš.",
      "Pravidelný pohyb môže únavu zmierniť.",
      "Obdobie, keď sa bábätko budí viackrát za noc, nebude trvať večne."
    ],
    source: "https://www.nhs.uk/mental-health/conditions/post-natal-depression/overview/",
    reviewed: "18. 3. 2026",
    sleepSource: "https://www.nhs.uk/baby/support-and-services/sleep-and-tiredness-after-having-a-baby/",
    sleepReviewed: "24. 8. 2026",
    evidence: "it usually goes away within 2 weeks of the birth … It's important to get help even if you only have some of the signs. | Try to rest when your baby sleeps."
  }
};

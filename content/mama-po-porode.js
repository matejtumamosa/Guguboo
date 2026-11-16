/* GUGUBOO V2 – okienko Mama po pôrode (šestonedelie). Len NHS, zhrnuté vlastnými slovami, pri každej téme
 * citácia (evidence) a dátum, kedy NHS stránku naposledy kontrolovalo. Overené 16. 10. 2026.
 * Master 2.7 – „informujeme, neradíme“ (Samo 15. 11. 2026, docs/master/INFORMUJEME_AUDIT.md P0 #9, #10, #13, P1-B, #21, #22, #27):
 * len „čo je bežné“ (common) + jedna veta (ask = kľúč G2Safety.line alebo askText) + otázka (askPrompt) + výnimka E1 (safety).
 * Bez postupov, liekov, termínov ako pokynu a samohodnotenia. Tiesňové čísla len v g2-safety.js. ⚕ Pred testom overí odborník. */
window.GugubooContent = window.GugubooContent || {};
window.GugubooContent.mamaPostpartum = {
  checked: "15. 11. 2026",
  troubles: [
    {
      id: "bleeding",
      title: "Krvácanie po pôrode",
      emoji: "🩸",
      common: ["Krvácanie po pôrode trvá niekoľko týždňov. Spočiatku je dosť silné, potom postupne hnedne a slabne, až prestane."],
      ask: "post",
      safety: "E1",
      askPrompt: "Mám otázku ku krvácaniu po pôrode.",
      source: "https://www.nhs.uk/pregnancy/labour-and-birth/your-body/",
      reviewed: "25. 4. 2024",
      evidence: "The bleeding will carry on for a few weeks. It will be quite heavy at first. … Gradually the bleeding will become a brownish colour and may continue for a few weeks, getting less and less until it stops."
    },
    {
      id: "stitches",
      title: "Stehy a hrádza",
      emoji: "🛁",
      common: ["Stehy sa zvyčajne samy rozpustia, kým sa rana zahojí."],
      askText: "Ak ťa stehy bolia alebo sú nepríjemné, povedz to pôrodnej asistentke.",
      askPrompt: "Mám otázku k stehom.",
      source: "https://www.nhs.uk/pregnancy/labour-and-birth/your-body/",
      reviewed: "25. 4. 2024",
      evidence: "the stitches should dissolve by the time the wound has healed … If your stitches are sore or uncomfortable, tell your midwife."
    },
    {
      id: "csection",
      title: "Po cisárskom reze",
      emoji: "🩹",
      common: ["Zotavenie po cisárskom reze trvá niekoľko týždňov."],
      askText: "Ak ťa rana bolí, je červenšia alebo opuchnutá, ozvi sa hneď pôrodnej asistentke alebo lekárovi.",
      safety: "E1",
      askPrompt: "Mám otázku k rane po cisárskom reze.",
      source: "https://www.nhs.uk/conditions/caesarean-section/recovery/",
      reviewed: "4. 1. 2023",
      reviewDue: "4. 1. 2026", // revízia NHS prešla – overiť aktuálne znenie (audit, časť 4)
      evidence: "it usually takes several weeks to recover … a wound that becomes redder, more painful, or swollen"
    },
    {
      id: "toilet",
      title: "Močenie, stolica a hemoroidy",
      emoji: "🚽",
      common: ["Spočiatku môže byť močenie pre citlivosť nepríjemné a stolicu zvyčajne niekoľko dní po pôrode nemáš. Hemoroidy sú po pôrode veľmi časté a zvyčajne zmiznú do pár dní či týždňov."],
      ask: "post",
      askPrompt: "Mám otázku k močeniu alebo stolici po pôrode.",
      source: "https://www.nhs.uk/pregnancy/labour-and-birth/your-body/",
      reviewed: "25. 4. 2024",
      evidence: "You probably won't have a poo for a few days after the birth … Piles (haemorrhoids) are very common after birth but usually disappear within a few days or weeks."
    },
    {
      id: "breasts",
      title: "Prsia",
      emoji: "🤱",
      common: ["Najprv sa tvorí žltkasté mledzivo. Na 3.–4. deň môžu byť prsia napäté a citlivé, keď sa začína tvoriť mlieko."],
      askText: "Ak ťa prsník bolí, je horúci alebo opuchnutý, ozvi sa pôrodnej asistentke alebo lekárovi.",
      askPrompt: "Mám otázku k prsiam a dojčeniu.",
      source: "https://www.nhs.uk/pregnancy/labour-and-birth/your-body/",
      reviewed: "25. 4. 2024",
      evidence: "colostrum … On the third or fourth day, they may feel tight and tender as they start to produce milk"
    },
    {
      id: "pelvic",
      title: "Brucho a panvové dno",
      emoji: "🧘",
      common: ["Rozostúpené brušné svaly sú po tehotenstve bežné a zvyčajne sa zatiahnu do 8 týždňov."],
      info: ["Cviky panvového dna a brucha nájdeš v Cvikoch."],
      askText: "Ak ťa niečo v tele trápi, môžeš sa kedykoľvek opýtať lekára.",
      askPrompt: "Mám otázku k bruchu a panvovému dnu.",
      source: "https://www.nhs.uk/baby/support-and-services/your-post-pregnancy-body/",
      reviewed: "20. 7. 2026",
      evidence: "It's common for the 2 halves of the stomach muscles to separate during pregnancy … usually close within 8 weeks … If a physical problem is bothering you, ask a GP or health visitor for help at any time."
    },
    {
      id: "serious",
      title: "Kedy sa ozvať hneď",
      emoji: "🔔",
      common: ["Väčšina ťažkostí po pôrode je bežná a prejde."],
      safety: "E1",
      askPrompt: "",
      source: "https://www.nhs.uk/pregnancy/labour-and-birth/your-body/",
      reviewed: "25. 4. 2024",
      evidence: "Tell your midwife, health visitor or GP straight away if you get any of these symptoms."
    }
  ],
  // Audit #21: kontrola po pôrode = len termín + otázky (zoznam „čo sa preberá“ odstránený).
  check: {
    askPrompt: "",
    source: "https://www.nhs.uk/baby/support-and-services/your-6-week-postnatal-check/",
    reviewed: "9. 10. 2026"
  },
  // Audit #22 + rozhodnutie PL 15. 11.: baby blues (bežné) + jedna veta „kedy sa ozvať“ + kontakty na pomoc + otázka.
  mood: {
    blues: "V prvom týždni po pôrode je bežné cítiť sa smutne, plačlivo alebo úzkostne. Hovorí sa tomu baby blues a zvyčajne to prejde do 2 týždňov.",
    help: "Ak smútok, úzkosť alebo pocit, že to nezvládaš, trvá dlhšie ako 2 týždne alebo sa ťa niečo z toho veľmi dotýka, porozprávaj sa s lekárom – dá sa to liečiť a nie si v tom sama.",
    askPrompt: "Chcem sa porozprávať o tom, ako sa po pôrode cítim.",
    sleep: [
      "NHS uvádza, že pomáha oddychovať, keď spí bábätko.",
      "Partner, rodina alebo kamarátka môžu bábätko chvíľu postrážiť, kým si zdriemneš.",
      "Obdobie, keď sa bábätko budí viackrát za noc, nebude trvať večne."
    ],
    source: "https://www.nhs.uk/mental-health/conditions/post-natal-depression/overview/",
    reviewed: "18. 3. 2026",
    sleepSource: "https://www.nhs.uk/baby/support-and-services/sleep-and-tiredness-after-having-a-baby/",
    sleepReviewed: "24. 8. 2026",
    evidence: "it usually goes away within 2 weeks of the birth … It's important to get help even if you only have some of the signs. | Try to rest when your baby sleeps."
  },
  // Cviky na zotavenie po pôrode – NHS „Your post-pregnancy body“ (stránka z 20. 7. 2026). Overené 10. 11. 2026.
  // Masážny valec ani loptička na stránke nie sú – preto ich neuvádzame.
  exercises: {
    checked: "10. 11. 2026",
    source: "https://www.nhs.uk/baby/support-and-services/your-post-pregnancy-body/",
    reviewed: "20. 7. 2026",
    items: [
      {
        id: "pelvic", title: "Cviky panvového dna", perDay: 3,
        why: "Pomáhajú pri úniku moču a pocite ťažoby v podbrušku.",
        steps: [
          "Cvičiť môžeš poležiačky, v sede aj v stoji.",
          "Stiahni konečník, akoby si zadržiavala plyny.",
          "Stiahni svaly okolo pošvy a močového mechúra, akoby si zastavovala močenie.",
          "Dlhé stiahnutie: drž, kým vládzeš, najviac 10 sekúnd, potom uvoľni.",
          "Krátke stiahnutia: rýchlo stiahni a hneď pusť – opakuj, kým sa svaly neunavia.",
          "Dýchaj normálne a pritom nevťahuj brucho."
        ],
        dose: "Postupne do 10 opakovaní každého cviku, aspoň 3-krát denne."
      },
      {
        id: "tummy", title: "Cvik na brucho", perDay: 1,
        why: "Posilňuje brušné svaly; spolu s panvovým dnom pomáha aj pri rozostúpených svaloch.",
        steps: [
          "Ľahni si na bok s mierne pokrčenými kolenami.",
          "Uvoľni brucho a jemne sa nadýchni.",
          "S výdychom jemne vtiahni spodnú časť brucha ako korzet.",
          "Zároveň stiahni panvové dno.",
          "Drž, kým napočítaš do 10, dýchaj normálne a jemne uvoľni."
        ],
        dose: "Opakuj najviac 10-krát."
      }
      // Master 2.7 (audit #13): „Kontrola brušných svalov“ (samohodnotenie) odstránená.
    ],
    avoid: ["sedy-ľahy, plank a skákanie (spočiatku)", "tlačenie na WC a dvíhanie ťažkého"],
    evidence: "Aim to build up to 10 repeats of each exercise, at least 3 times a day. | Lie on your side with your knees slightly bent … Hold for a count of 10 … Repeat up to 10 times. | Try to avoid exercises such as sit-ups, planks and high-impact exercises to start with."
  },
  // Menštruácia po pôrode – NHS „Your body after the birth“ (stránka z 25. 4. 2024) a „Irregular periods“ (26. 6. 2026). Overené 7. 11. 2026.
  period: {
    checked: "7. 11. 2026",
    returnTitle: "Kedy sa vráti",
    returnItems: [
      "Je to u každej iné – presný čas sa povedať nedá.",
      "Ak kŕmiš z fľaše alebo kombinuješ fľašu s dojčením, prvá menštruácia môže prísť už 5 až 6 týždňov po pôrode.",
      "Ak výlučne dojčíš (aj v noci) bez fľaše, menštruácia sa často vráti až keď začneš dojčiť menej."
    ],
    pregnancyTitle: "Otehotnieť sa dá skôr, ako príde menštruácia",
    pregnancyItems: [
      "Otehotnieť sa dá už 3 týždne po pôrode, aj keď dojčíš a menštruáciu ešte nemáš.",
      "O antikoncepcii sa môžeš porozprávať s gynekológom."
    ],
    pregnancyAsk: "Akú antikoncepciu po pôrode zvoliť?",
    // Master 2.7 (audit #27): bez pokynu – len otázka na kontrolu po pôrode.
    padsTitle: "Tampóny a kalíšok",
    padsItems: [
      "Kedy znova používať tampóny či kalíšok, sa môžeš opýtať gynekológa na kontrole po pôrode."
    ],
    padsAsk: "Kedy môžem znova používať tampóny alebo kalíšok?",
    source: "https://www.nhs.uk/pregnancy/labour-and-birth/your-body/",
    reviewed: "25. 4. 2024",
    evidence: "If you bottle feed your baby, or combine bottle feeding with breastfeeding, your first period could start as soon as 5 to 6 weeks after you give birth. … If you fully breastfeed (including at night) without any bottle feeding, your periods may not start again until you start to reduce breastfeeding. | You can get pregnant again just 3 weeks after the birth of your baby, even if you're breastfeeding and your periods have not started again yet. It's important to start using contraception within 21 days of giving birth … | You should not use tampons until you've had your 6-week postnatal check.",
    // Master 2.7 (audit #28): appka nič nevyhodnocuje („> 7 dní“ apod.) – len štandardná veta a otázka pre gynekológa.
    doctorLine: "Ak ťa niečo znepokojuje alebo si nie si istá, môžeš sa kedykoľvek ozvať svojmu gynekológovi.",
    askPrompt: "Mám otázku k menštruácii po pôrode.",
    cycleNote: "Bežný cyklus (od začiatku jednej menštruácie po začiatok ďalšej) má okolo 28 dní, môže byť trochu kratší aj dlhší.",
    doctorSource: "https://www.nhs.uk/conditions/irregular-periods/",
    doctorReviewed: "26. 6. 2026",
    doctorEvidence: "The average gap between periods starting (the menstrual cycle) is around 28 days. It can sometimes be a bit shorter or longer. | See a GP if: … your periods last longer than 7 days … you have bleeding between periods"
  }
};

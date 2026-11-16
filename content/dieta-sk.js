/* GUGUBOO V2 – Zdravotná knižka dieťaťa (SK). Preventívne prehliadky podľa zákona č. 577/2004 Z. z., § 2 ods. 1
 * (doslovné znenie: content/evidence/sk/zakon-577-2004-par2.txt). Overené na Slov-Lex 16. 10. 2026.
 * Očkovací kalendár zámerne NIE JE prepísaný: oficiálny dokument ÚVZ SR sa nepodarilo spoľahlivo prečítať a správy
 * o termínoch sa líšia – appka preto len zapisuje očkovania a termíny určí pediater (Samuel: nič z pamäte AI). */
window.GugubooContent = window.GugubooContent || {};
window.GugubooContent.childHealthSK = {
  checked: "16. 10. 2026",
  source: "https://www.slov-lex.sk/ezbierky/pravne-predpisy/SK/ZZ/2004/577/",
  sourceName: "Zákon č. 577/2004 Z. z., § 2",
  checks: [
    { id: "year1", title: "Do 1 roka", text: "9 preventívnych prehliadok u pediatra, z toho aspoň 3 do troch mesiacov veku.", count: 9, fromMonths: 0, toMonths: 12,
      evidence: "deväť preventívnych prehliadok poistenca … do jedného roku veku … z toho najmenej tri preventívne prehliadky do troch mesiacov veku" },
    { id: "m18", title: "18 mesiacov", text: "1 preventívna prehliadka u pediatra vo veku 18 mesiacov.", count: 1, atMonths: 18,
      evidence: "jedna preventívna prehliadka poistenca vo veku 18 mesiacov" },
    { id: "y3", title: "Od 3 rokov", text: "1 preventívna prehliadka u pediatra raz za dva roky (až do 18 rokov).", everyMonths: 24, fromMonths: 36,
      evidence: "jedna preventívna prehliadka poistenca od troch rokov veku do 18 rokov veku raz za dva roky" }
  ],
  dentist: { text: "U zubného lekára 2 preventívne prehliadky v kalendárnom roku (do 18 rokov).", evidence: "jedna preventívna prehliadka poistenca do 18 rokov veku dva razy v kalendárnom roku u zubného lekára" },
  covered: "Tieto prehliadky plne hradí zdravotná poisťovňa.",
  vaccines: {
    note: "Ktoré očkovanie a kedy, ti povie pediater – zvyčajne na preventívnej prehliadke. Oficiálny očkovací kalendár zverejňuje Úrad verejného zdravotníctva SR.",
    sourceName: "Úrad verejného zdravotníctva SR",
    source: "https://www.uvzsr.sk"
  },
  mother: {
    text: "Šesť týždňov po pôrode máš nárok na preventívnu prehliadku u gynekológa. Plne ju hradí zdravotná poisťovňa.",
    evidence: "jedna preventívna prehliadka šesť týždňov po pôrode u lekára so špecializáciou v špecializačnom odbore gynekológia a pôrodníctvo"
  }
};

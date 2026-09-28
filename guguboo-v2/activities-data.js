(function defineGugubooActivitiesData() {
  "use strict";

  const source = "CDC Learn the Signs. Act Early.";
  const sourceUrl = "https://www.cdc.gov/act-early/milestones/index.html";
  const reviewedAt = "2026-09-09";
  const commonSafety = "Zostaňte pri dieťati, rešpektuj jeho polohu a skonči pri nepohode alebo nezvyčajnej reakcii.";
  const periods = [
    { id: "0-2", label: "narodenie až 2 mesiace", minDays: 0, maxDays: 60 },
    { id: "2-4", label: "2 až 4 mesiace", minDays: 61, maxDays: 121 },
    { id: "4-6", label: "4 až 6 mesiacov", minDays: 122, maxDays: 182 },
    { id: "6-9", label: "6 až 9 mesiacov", minDays: 183, maxDays: 273 },
    { id: "9-12", label: "9 až 12 mesiacov", minDays: 274, maxDays: 364 },
    { id: "12-15", label: "12 až 15 mesiacov", minDays: 365, maxDays: 455 },
    { id: "15-18", label: "15 až 18 mesiacov", minDays: 456, maxDays: 547 },
    { id: "18-24", label: "18 až 24 mesiacov", minDays: 548, maxDays: 730 }
  ];

  const make = (id, period, title, domain, minutes, supplies, steps, support, tags, safety = commonSafety) => ({
    id, version: 1, period, title, domain, minutes, supplies, steps, support, tags,
    safety, source, sourceUrl, reviewedAt
  });

  const activities = [
    make("a001","0-2","Tvár nablízku","vzťah",2,"bez pomôcok",["Keď je dieťa bdelé a pokojné, priblíž tvár.","Pomaly sa usmej a chvíľu počkajte na reakciu."],"vzájomnú pozornosť a pocit bezpečia",["two-minutes","calm","no-tools"]),
    make("a002","0-2","Pokojný hlas pri prebaľovaní","komunikácia",3,"bez pomôcok",["Počas prebaľovania pokojne pomenujte, čo robíte.","Urobte pauzu, akoby ste sa rozprávali."],"počúvanie hlasu a striedanie kontaktu",["calm","no-tools"]),
    make("a003","0-2","Pomalé sledovanie","poznávanie",2,"bezpečná kontrastná kartička",["Držte kartičku približne pred tvárou bdelého dieťaťa.","Pomaly ju posuň malý kúsok do strany."],"zrakovú pozornosť",["two-minutes","calm"],"Kartičku držte dospelý; nič nenechávaj v postieľke ani pri tvári počas spánku."),
    make("a004","0-2","Chvíľka na brušku","motorika",2,"pevná podložka",["Položte bdelé dieťa na bruško na pevný povrch.","Buďte pri ňom tvárou nablízku a skonči pri únave."],"krátku skúsenosť s polohou na brušku",["two-minutes","movement","no-tools"],"Iba v bdelosti a pod priamym dohľadom; na spánok vždy položte dieťa na chrbát."),

    make("a005","2-4","Odpoveď na zvuky","komunikácia",3,"bez pomôcok",["Zopakujte zvuk, ktorý dieťa vydá.","Počkajte a nechajte priestor na ďalší zvuk."],"striedanie zvukov v rozhovore",["calm","no-tools"]),
    make("a006","2-4","Ruky sa stretávajú","motorika",3,"ľahká látková hračka",["Ponúknite hračku do stredu zorného poľa.","Nechajte dieťa, aby sa jej dotklo oboma rukami."],"objavovanie rúk a dosahovanie",["calm"]),
    make("a007","2-4","Zrkadlo a úsmev","vzťah",4,"bezpečné nerozbitné zrkadlo",["Držte zrkadlo pri bdelom dieťati.","Ukážte na odraz a pokojne sa prihováraj."],"sociálnu pozornosť",["calm"]),
    make("a008","2-4","Bruško s uterákom","motorika",3,"zrolovaný uterák",["Pri bdelosti podoprite hrudník malým zrolovaným uterákom.","Sadnite si pred dieťa a hovorte naň."],"zdvíhanie hlavy a oporu na predlaktiach",["movement"],"Iba na pevnej podložke, v bdelosti a pod priamym dohľadom; dieťa do polohy nenúťte."),

    make("a009","4-6","Siahni po hračke","motorika",4,"ľahká bezpečná hračka",["Položte hračku na dosah bdelého dieťaťa.","Nechajte ho skúšať siahnuť bez posúvania tela nasilu."],"dosahovanie a koordináciu ruka–oko",["movement"]),
    make("a010","4-6","Pesnička s pauzou","komunikácia",3,"bez pomôcok",["Zaspievajte krátku známu melódiu.","Pred posledným zvukom urobte pauzu a sledujte reakciu."],"počúvanie a očakávanie",["calm","no-tools","bedtime"]),
    make("a011","4-6","Čo počujeme vonku","poznávanie",5,"bez pomôcok",["Choďte na krátku chvíľu von alebo k otvorenému oknu.","Pomenúvajte jemné zvuky a smer, odkiaľ prichádzajú."],"pozornosť k okoliu",["calm","no-tools","outside"]),
    make("a012","4-6","Kde je tvár?","vzťah",3,"ľahká látka",["Na chvíľu si zakry vlastnú tvár látkou.","Hneď ju odkry a usmej sa."],"spoločnú hru a očakávanie",["calm"],"Látku držte dospelý a nikdy ju nenechávaj na tvári dieťaťa ani v priestore na spánok."),

    make("a013","6-9","Dve bezpečné nádoby","poznávanie",5,"dve veľké plastové nádoby",["Ukážte vloženie jednej nádoby do druhej.","Nechajte dieťa skúšať a opisujte výsledok."],"skúmanie príčiny a priestoru",["calm"]),
    make("a014","6-9","Bľabotavý rozhovor","komunikácia",3,"bez pomôcok",["Zopakujte slabiky dieťaťa.","Pridajte jednoduchú slabiku a počkajte."],"striedanie zvukov",["calm","no-tools"]),
    make("a015","6-9","Hračka kúsok bokom","motorika",5,"väčšia bezpečná hračka",["Položte hračku kúsok mimo priameho dosahu.","Nechajte dieťa zvoliť vlastný bezpečný spôsob priblíženia."],"otáčanie a presuny podľa vlastných možností",["movement"],"Nenúťte dieťa do sedu, lezenia ani inej polohy, ktorú samo bezpečne nezvláda."),
    make("a016","6-9","Kuk spoza plienky","vzťah",3,"látková plienka",["Skryte za plienku svoju tvár, nie tvár dieťaťa.","Odkryte sa a povedzte „kuk“ pokojne."],"spoločnú pozornosť a radosť z opakovania",["calm"],"Látku držte stále v ruke a odložte ju pred spánkom mimo dosahu."),

    make("a017","9-12","Dnu a von","poznávanie",6,"veľká nádoba a veľké predmety",["Vložte veľký bezpečný predmet do nádoby.","Nechajte dieťa predmet vyberať a vracať."],"chápanie priestoru a opakovania",["calm"],"Použite iba predmety väčšie než rizikové malé časti a zostaňte pri dieťati."),
    make("a018","9-12","Zamávame spolu","komunikácia",3,"bez pomôcok",["Pri odchode alebo príchode pomaly zamávajte.","Povedzte jednoduché „pá-pá“ a počkajte na pokus."],"gestá a porozumenie rutine",["two-minutes","no-tools"]),
    make("a019","9-12","Bezpečná cesta za cieľom","motorika",6,"vankúš a obľúbená hračka",["Na pevnej podlahe vytvorte nízku mäkkú prekážku.","Položte hračku na dohľad a nechajte dieťa zvoliť pohyb."],"pohybové plánovanie",["movement"],"Odstráňte ostré hrany a malé predmety; nenúťte dieťa liezť ani stáť."),
    make("a020","9-12","Tlieskame v rytme","vzťah",4,"bez pomôcok",["Zatlieskajte jednoduchý rytmus.","Ponúknite dieťaťu čas napodobniť alebo reagovať po svojom."],"napodobňovanie a spoločnú hru",["calm","no-tools"]),

    make("a021","12-15","Veža z dvoch","motorika",5,"dve veľké ľahké kocky",["Ukážte položenie jednej kocky na druhú.","Nechajte dieťa skúšať aj búrať."],"jemnú motoriku a koordináciu",["calm"],"Použite veľké nepoškodené kocky bez oddeliteľných malých častí."),
    make("a022","12-15","Pomenujte a ukážte","komunikácia",4,"obrázková knižka",["Ukážte na jeden veľký obrázok a pomenujte ho.","Počkajte, kam sa dieťa pozrie alebo ukáže."],"spájanie slov s predmetmi",["calm","bedtime"]),
    make("a023","12-15","Krabička s viečkom","poznávanie",5,"ľahká krabička s voľným viečkom",["Ukážte otvorenie a zatvorenie.","Nechajte dieťa skúšať bez opravovania každého pokusu."],"riešenie jednoduchého problému",["calm"],"Krabička musí byť čistá, bez ostrých hrán a malých oddeliteľných častí."),
    make("a024","12-15","Spoločné kroky","vzťah",5,"bez pomôcok",["Ponúknite stabilnú ruku, ak ju dieťa chce.","Prejdite pár krokov jeho tempom a opisujte cestu."],"istotu v spoločnom pohybe",["movement","no-tools","outside"],"Neťahajte dieťa za ruky a nenúťte ho kráčať, ak ešte samo nie je pripravené."),

    make("a025","15-18","Pomocník s ponožkami","motorika",5,"čisté ponožky a košík",["Položte pár ponožiek vedľa košíka.","Ukážte vloženie a nechajte dieťa pomáhať po svojom."],"prenášanie a koordináciu",["movement"]),
    make("a026","15-18","Jedno slovo navyše","komunikácia",3,"bez pomôcok",["Keď dieťa použije zvuk alebo slovo, zopakujte ho.","Pridajte jedno jednoduché slovo navyše."],"prirodzené rozširovanie komunikácie",["calm","no-tools"]),
    make("a027","15-18","Čo patrí k sebe","poznávanie",6,"dve lyžice a dve misky",["Položte bezpečné predmety pred dieťa.","Ukážte jednu dvojicu a nechajte ho skúmať ostatné."],"triedenie a vzťahy medzi predmetmi",["calm"],"Použite iba veľké tupé predmety a zostaňte pri dieťati."),
    make("a028","15-18","Napodobníme domácnosť","vzťah",5,"mäkká handrička",["Ukážte jednoduché utretie stolíka.","Ponúknite handričku a poďakuj za akýkoľvek pokus."],"napodobňovanie a spoločnú rutinu",["calm"],"Použite čistú handričku bez čistiacich prostriedkov."),

    make("a029","18-24","Cesta po čiare","motorika",5,"maliarska papierová páska",["Nalepte na zem krátku rovnú čiaru.","Kráčajte popri nej alebo po nej vlastným tempom."],"rovnováhu a plánovanie pohybu",["movement"],"Povrch musí byť protišmykový; odstráňte prekážky a dieťa nepridŕžaj nasilu."),
    make("a030","18-24","Dve slová v hre","komunikácia",4,"obľúbená hračka",["Opisujte hru krátkym spojením dvoch slov.","Počkajte na gesto, zvuk alebo vlastnú odpoveď dieťaťa."],"porozumenie a rozširovanie slov",["calm"]),
    make("a031","18-24","Nájdite rovnaké","poznávanie",7,"dva páry veľkých bežných predmetov",["Položte pred dieťa dva známe predmety.","Ukážte zhodný predmet a hľadajte jeho pár."],"porovnávanie a pozornosť",["calm"],"Predmety musia byť veľké, čisté a bez ostrých alebo oddeliteľných častí."),
    make("a032","18-24","Prechádzka s pomenovaním","vzťah",8,"bez pomôcok",["Vonku nechajte dieťa vybrať smer na krátkom bezpečnom úseku.","Pomenujte jednu vec, ktorú spolu vidíte."],"spoločnú pozornosť a samostatné voľby",["outside","movement","no-tools"],"Držte sa mimo premávky a vody; dieťa zostáva stále pod priamym dohľadom.")
  ];

  const observationText = {
    "0-2": ["Môže na chvíľu sledovať tvár.","Môže reagovať na hlas alebo hlasný zvuk.","Môže pri polohe na brušku skúšať zdvihnúť hlavu.","Môže sa upokojiť pri hlase alebo dotyku blízkej osoby."],
    "2-4": ["Môže sa usmievať, keď sa mu prihovárate.","Môže vydávať zvuky iné než plač.","Môže držať hlavu stabilnejšie pri držaní.","Môže sledovať pohybujúcu sa osobu alebo predmet."],
    "4-6": ["Môže sa smiať alebo striedať zvuky s vami.","Môže siahať po hračke, ktorú chce.","Môže sa pretáčať z bruška na chrbát.","Môže spoznávať známych ľudí."],
    "6-9": ["Môže vydávať opakované slabiky.","Môže sa dostať do sedu vlastným spôsobom.","Môže búchať dvoma predmetmi o seba.","Môže reagovať na odchod blízkej osoby."],
    "9-12": ["Môže zamávať alebo používať iné gesto.","Môže vložiť predmet do nádoby.","Môže sa vytiahnuť do stoja s oporou.","Môže sa zapájať do jednoduchej hry s vami."],
    "12-15": ["Môže skúšať jedno či dve ďalšie slová.","Môže ukázať na vec, o ktorú žiada.","Môže urobiť niekoľko krokov sám.","Môže napodobniť jednoduché použitie predmetu."],
    "15-18": ["Môže skúšať viac slov okrem pomenovania rodiča.","Môže chodiť bez držania.","Môže napodobňovať jednoduchú domácu činnosť.","Môže sa vzdialiť a kontrolovať, či si nablízku."],
    "18-24": ["Môže spájať dve slová.","Môže behať alebo skúšať kopať do lopty.","Môže sa hrať s viac než jedným predmetom naraz.","Môže sledovať vašu tvár v novej situácii."]
  };
  const observations = Object.fromEntries(Object.entries(observationText).map(([period, texts]) => [period, texts.map((text, index) => ({
    id: `o-${period}-${index + 1}`, text, source, sourceUrl, reviewedAt
  }))]));

  window.GugubooActivitiesData = Object.freeze({ version: 1, reviewedAt, periods, activities, observations });
})();

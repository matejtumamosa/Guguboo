/* GUGUBOO V2 – obsah tehotenstva týždeň po týždni. Zhrnutia vlastnými slovami zo zdrojov nižšie. */
window.GugubooContent = window.GugubooContent || {};
(function () {
  var B = "https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/";
  function u(week) {
    var tri = week <= 12 ? "1st-trimester" : (week <= 27 ? "2nd-trimester" : "3rd-trimester");
    return B + tri + "/week-" + week + "/";
  }

  window.GugubooContent.pregnancyWeeks = {
    meta: {
      country: "*",
      language: "sk",
      last_checked: "2026-09-28",
      verification_status: "withdrawn",
      review_required: true,
      note: "Zhrnutia z verejných zdrojov; pred ostrým spustením odporúčaná odborná kontrola. Dĺžky do 19. týždňa sú od hlavičky po zadoček, od 20. týždňa od hlavičky po päty (podľa NHS)."
    },
    sources: {
      nhs: { name: "NHS Best Start in Life – Week-by-week guide to pregnancy", url: "https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/" },
      nhs_42: { name: "NHS – You and your baby at 42 weeks pregnant", url: "https://www.nhs.uk/pregnancy/week-by-week/28-to-40-plus/42-weeks/" },
      nhs_overdue: { name: "NHS Best Start in Life – Overdue: past your due date?", url: "https://www.nhs.uk/best-start-in-life/pregnancy/preparing-for-labour-and-birth/overdue-have-you-gone-past-your-due-date/" },
      nhs_induction: { name: "NHS – Inducing labour", url: "https://www.nhs.uk/pregnancy/labour-and-birth/signs-of-labour/inducing-labour/" }
    },
    weeks: {
      4: {
        size: "približne 2 mm (ako makové zrnko)",
        baby: "Zárodok rýchlo rastie v plodovom vaku, ktorý ho chráni tekutinou. Výživu mu zatiaľ dáva malý žĺtkový vak. Z jeho vonkajšej vrstvy sa neskôr vytvorí placenta.",
        you: "Navonok ešte nič nevidno. Niektoré ženy zatiaľ nemajú žiadne príznaky, iné môžu cítiť citlivé prsia, únavu alebo kovovú chuť v ústach.",
        tip: "Doprej si viac oddychu a pokojne začni s krátkymi prechádzkami.",
        milestone: null, sources: ["nhs"], source_urls: [u(4)]
      },
      5: {
        size: "približne 2 mm (ako sezamové semienko)",
        baby: "Tvorí sa mozog, miecha a nervová sústava. Začína sa formovať drobné srdiečko a vznikajú cievy aj pupočná šnúra. Na tvári sa objavujú základy nosa a očí.",
        you: "Často si žena všimne, že jej mešká menštruácia. Môžeš sa cítiť veľmi unavená, mať citlivé prsia, nevoľnosť alebo zmeny nálad.",
        tip: "Ak sa ti dá, dopraj si skorší spánok – únava je teraz úplne bežná.",
        milestone: null, sources: ["nhs"], source_urls: [u(5)]
      },
      6: {
        size: "približne 6 mm (ako hrášok)",
        baby: "Objavujú sa pupene budúcich rúk a nôh a jamky, kde budú uši. Vyvíja sa pečeň, mozog aj svaly a kosti. Pokožka je zatiaľ priesvitná.",
        you: "Niektoré ženy trápi nevoľnosť, často hneď po prebudení. Môžeš mať aj bolesti hlavy, citlivejší čuch alebo chuť na iné jedlá než zvyčajne.",
        tip: "Menšie jedlá častejšie a desiata pri posteli môžu ranné chvíle uľahčiť.",
        milestone: null, sources: ["nhs"], source_urls: [u(6)]
      },
      7: {
        size: "približne 1 cm (ako hrozno)",
        baby: "Mozog rastie veľmi rýchlo. V končatinách sa tvorí chrupavka, z ktorej budú kosti. Začínajú sa formovať viečka a na tvári sú viditeľné základy nosa a uší.",
        you: "Objem krvi v tele postupne stúpa, preto môžeš mať väčší smäd. Maternica má zhruba veľkosť citróna, no bruško zvyčajne ešte nevidno.",
        tip: "Maj po ruke fľašu s vodou a pi počas dňa priebežne.",
        milestone: null, sources: ["nhs"], source_urls: [u(7)]
      },
      8: {
        size: "približne 1,6 cm (ako malina)",
        baby: "Hlavička sa začína narovnávať a ručičky sa predlžujú. Nožičky rastú, no kolená a prsty ešte nie sú hotové. Od tohto obdobia sa bábätku odborne hovorí plod.",
        you: "Môžeš sa cítiť nafúknutá a prsia môžu byť trochu väčšie. Rastúca maternica tlačí na močový mechúr, preto môžeš chodiť častejšie na toaletu.",
        tip: "Ak ťa niečo znepokojuje, zapíš si to a spýtaj sa pri najbližšej prehliadke.",
        milestone: null, sources: ["nhs"], source_urls: [u(8)]
      },
      9: {
        size: "približne 2,2 cm (ako jahoda)",
        baby: "Tvár dostáva jasnejšie črty a oči chránia viečka. Na rúčkach a nožičkách sú ryhy budúcich prstov. Srdce, mozog, pľúca, obličky aj črevá sa ďalej vyvíjajú.",
        you: "Pás sa môže mierne rozširovať a prsia rastú. Niektoré ženy zažívajú výkyvy nálad – raz radosť, o chvíľu slzy. Aj to je v poriadku.",
        tip: "Malé zdravé desiaty počas dňa môžu pomôcť udržať energiu.",
        milestone: null, sources: ["nhs"], source_urls: [u(9)]
      },
      10: {
        size: "približne 3 cm (ako malá marhuľa)",
        baby: "Bábätko robí drobné trhavé pohyby, ktoré sa dajú zachytiť na ultrazvuku. Formujú sa uši, horná pera a čeľusť so základmi mliečnych zúbkov. Srdiečko bije veľmi rýchlo.",
        you: "Maternica je už približne veľká ako pomaranč. Môže ťa trápiť nafukovanie, pálenie záhy alebo závraty. Pokožka môže byť mastnejšia.",
        tip: "Jedz pomalšie a po jedle skús krátku prechádzku.",
        milestone: null, sources: ["nhs"], source_urls: [u(10)]
      },
      11: {
        size: "približne 4,1 cm (ako figa)",
        baby: "Prsty na rukách aj nohách sa oddeľujú a tvoria sa nechtíky. Bábätko sa hýbe, hoci ho ešte necítiš. Placenta sa pripravuje prevziať jeho výživu.",
        you: "V tele ti prúdi viac krvi, takže môžeš cítiť teplo, potiť sa alebo mať závraty. Svaly a väzy sa naťahujú, čo môže byť cítiť ako ťahanie v brušku.",
        tip: "Ľahký pohyb, napríklad prechádzka, môže pomôcť proti únave.",
        milestone: null, sources: ["nhs"], source_urls: [u(11)]
      },
      12: {
        size: "približne 5,4 cm (ako slivka)",
        baby: "Vnútorné orgány a svaly sú už vytvorené. Kostra sa postupne mení z mäkkého tkaniva na kosť. Pohlavné orgány sú hotové, aj keď na ultrazvuku ich zvyčajne ešte nevidno.",
        you: "Nevoľnosť u mnohých žien začína ustupovať a môže sa vrátiť chuť do jedla. Pás a prsia sa môžu ďalej zväčšovať.",
        tip: "Je dobrý čas pozrieť sa, aké pôrodnice sú v tvojom okolí.",
        milestone: "Koniec prvého trimestra", sources: ["nhs"], source_urls: [u(12)]
      },
      13: {
        size: "približne 7,4 cm (ako broskyňa)",
        baby: "Vaječníky alebo semenníky sú plne vyvinuté. Pohyby bábätka sú čoraz cielenejšie a niektoré si už cmúľu palec.",
        you: "Maternica rastie nahor, takže sa môže objaviť malé bruško a menej často potrebuješ na toaletu. Niektoré ženy majú citlivejšie ďasná alebo cítia ťahanie po stranách brucha.",
        tip: "Môžeš začať s cvikmi panvového dna – stačí pár minút denne.",
        milestone: "Začiatok druhého trimestra", sources: ["nhs"], source_urls: [u(13)]
      },
      14: {
        size: "približne 8,5 cm (ako kivi)",
        baby: "Hlavička sa zaobľuje a je úmernejšia k telu. Obličky už pracujú – bábätko prehĺta plodovú vodu a vylučuje ju ako moč. Kope, hoci to zatiaľ necítiš.",
        you: "Únava a nevoľnosť sa často zmierňujú a chuť do jedla rastie. Niektoré ženy si všimnú v podprsenke kvapky mledziva, prvého mlieka.",
        tip: "Na chuť medzi jedlami si priprav ovocie alebo orechy.",
        milestone: null, sources: ["nhs"], source_urls: [u(14)]
      },
      15: {
        size: "približne 10 cm (ako jablko)",
        baby: "Telíčko pokrýva jemné chĺpky (lanugo) a tvoria sa obočie a mihalnice. Oči reagujú na svetlo. Približne v tomto čase sa začína rozvíjať sluch.",
        you: "Pokožka na brušku môže svrbieť. Môžeš mať viac výtoku, občas krvácanie z nosa či ďasien alebo opuchnuté ruky a nohy.",
        tip: "Nosiť voľné bavlnené oblečenie a používať jemný krém bez parfumu môže pomôcť.",
        milestone: null, sources: ["nhs"], source_urls: [u(15)]
      },
      16: {
        size: "približne 11,6 cm (ako avokádo)",
        baby: "Bábätko robí grimasy, zatiaľ bez vedomej kontroly. Nervová sústava dozrieva, ručičky a nožičky sa hýbu a pästičky sa vedia zovrieť.",
        you: "Začína ďalšia fáza rastu a pribúdajú kilá. Na prehliadke možno počuješ tlkot srdiečka. Niektoré ženy trápi zápcha.",
        tip: "Vláknina, voda a pravidelný pohyb pomáhajú tráveniu.",
        milestone: null, sources: ["nhs"], source_urls: [u(16)]
      },
      17: {
        size: "približne 12 cm (ako granátové jablko)",
        baby: "Bábätko hýbe očami, aj keď ich má stále zatvorené. Reaguje na hlasné zvuky a otvára a zatvára ústa. Tvoria sa nechty a jedinečné odtlačky prstov.",
        you: "Pás sa pomaly stráca, ako maternica rastie. Niektoré ženy už cítia prvé jemné pohyby – ako bublinky alebo trepotanie. Môžeš byť citlivejšia na stres.",
        tip: "Pomaly premýšľaj, kde by si chcela rodiť.",
        milestone: null, sources: ["nhs"], source_urls: [u(17)]
      },
      18: {
        size: "približne 14,2 cm (ako paprika)",
        baby: "Rozvíja sa sluch a hmat, bábätko prehĺta a cmúľe. Aktívne hýbe ručičkami aj nožičkami.",
        you: "Môžeš sa cítiť nemotornejšia a pri rýchlom vstávaní sa ti môže zatočiť hlava. Na brušku sa môže objaviť tmavá čiara (linea nigra), ktorá po pôrode zmizne.",
        tip: "Vstávaj z postele či zo stoličky pomaly, bez náhlenia.",
        milestone: null, sources: ["nhs"], source_urls: [u(18)]
      },
      19: {
        size: "približne 15,3 cm (ako veľká paradajka)",
        baby: "Za mliečnymi zúbkami sa už zakladajú aj trvalé zuby. Bábätko postupne priberá.",
        you: "Hormón relaxín uvoľňuje väzy, čo môžeš cítiť v chrbte, kolenách či členkoch. Niektoré ženy horšie spia alebo si všimnú prvé strie.",
        tip: "Skús spať na boku s vankúšom pod bruškom alebo medzi kolenami.",
        milestone: null, sources: ["nhs"], source_urls: [u(19)]
      },
      20: {
        size: "približne 25,6 cm od hlavičky po päty (ako banán)",
        baby: "Kožu chráni biela mazľavá vrstva (mázok). Bábätko kope, otáča sa a cmúľe palec – trénuje tak sanie, ktoré bude potrebovať pri kŕmení.",
        you: "Môžu ťa trápiť kŕče v lýtkach alebo ťahanie po stranách bruška, ako sa maternica zväčšuje. Aj pálenie záhy či zápcha sú teraz bežné.",
        tip: "Pred spaním si jemne ponaťahuj lýtka.",
        milestone: "Polovica tehotenstva", sources: ["nhs"], source_urls: [u(20)]
      },
      21: {
        size: "približne 26,7 cm (ako mrkva)",
        baby: "Bábätko je už ťažšie ako placenta. Rastú mu vlásky a obočie a počuje zvuky a hlasy zvonka. Postupne si vytvára rytmus spánku a bdenia.",
        you: "Ťažisko sa posúva, takže môžeš byť menej stabilná. Pohyby bábätka môžeš cítiť častejšie, často práve keď si ľahneš.",
        tip: "Ak ťa budí v noci, dopraj si cez deň krátky šlofík.",
        milestone: null, sources: ["nhs"], source_urls: [u(21)]
      },
      22: {
        size: "približne 27,8 cm (ako batát)",
        baby: "Pľúca sa vyvíjajú a bábätko nacvičuje dýchacie pohyby. Prehĺta plodovú vodu a rozvíjajú sa mu chuťové poháriky.",
        you: "Na brušku, stehnách či prsiach sa môžu objaviť strie – po pôrode zvyčajne vyblednú. Môže ti byť častejšie teplo alebo sa ti zatočí hlava.",
        tip: "Svižná denná prechádzka je príjemný spôsob, ako zostať v pohybe.",
        milestone: null, sources: ["nhs"], source_urls: [u(22)]
      },
      23: {
        size: "približne 28,9 cm (ako väčšie mango)",
        baby: "Ručičky a nožičky sú už v pomere k telu. Bábätko trénuje dýchanie a jeho pohyby sa stávajú koordinovanejšími.",
        you: "Hrudník sa rozširuje, takže môžeš cítiť tlak pri rebrách alebo sa ľahšie zadýchať. Pokožka je teraz citlivejšia na slnko.",
        tip: "Na slnku chráň pokožku klobúkom a tieňom.",
        milestone: null, sources: ["nhs"], source_urls: [u(23)]
      },
      24: {
        size: "približne 30 cm (ako kukuričný klas)",
        baby: "Bábätko už vyzerá ako malý novorodenec, všetky časti tela sú v správnom pomere. Stále však rastie a silnie.",
        you: "Môžeš byť hladnejšia než zvyčajne. Uvoľnené väzy môžu spôsobovať bolesti v chrbte, pri rebrách či v brušku.",
        tip: "Začni si zapisovať, čo by si si želala pri pôrode – napríklad v podobe pôrodného plánu.",
        milestone: null, sources: ["nhs"], source_urls: [u(24)]
      },
      25: {
        size: "približne 34,6 cm (ako cuketa)",
        baby: "Bábätko reaguje na hlasné zvuky. Vylučuje moč do plodovej vody, ktorá ho chráni a udržiava mu teplo. Občas môžeš cítiť jeho štikútanie.",
        you: "Tvár, ruky či chodidlá môžu byť opuchnuté od zadržiavania vody. Bábätko zaberá viac miesta, preto sa môže ozvať pálenie záhy a nafukovanie.",
        tip: "Keď sedíš, vylož si nohy vyššie.",
        milestone: null, sources: ["nhs"], source_urls: [u(25)]
      },
      26: {
        size: "približne 35,6 cm (ako uhorka)",
        baby: "Bábätko prvýkrát otvára oči a učí sa žmurkať. Farba očí závisí od génov a môže sa meniť ešte dlho po narodení.",
        you: "Môžeš byť unavenejšia a nemotornejšia. Niektoré ženy trápia nočné kŕče v nohách alebo zábudlivosť, ktorej sa hovorí „tehotenský mozog“.",
        tip: "Nechaj si na bežné veci viac času. Ak si všimneš, že sa bábätko hýbe inak než zvyčajne, ozvi sa svojej pôrodnej asistentke alebo lekárovi.",
        milestone: null, sources: ["nhs"], source_urls: [u(26)]
      },
      27: {
        size: "približne 36,6 cm (ako karfiol)",
        baby: "Pľúca by už dokázali dýchať. Pod kožou pribúda tuk a orgány dozrievajú na život mimo brucha.",
        you: "Nafukovanie a zápcha môžu byť výraznejšie. Opuchnutá nosová sliznica môže spôsobiť, že v noci chrápeš.",
        tip: "Skús si zvyknúť spávať na boku, s vankúšom pod bruškom.",
        milestone: null, sources: ["nhs"], source_urls: [u(27)]
      },
      28: {
        size: "približne 37,6 cm (ako baklažán)",
        baby: "Srdiečko bije o niečo pomalšie ako predtým a dá sa počuť aj cez fonendoskop. Bábätko ďalej priberá a dozrieva.",
        you: "Môže ťa bolieť chrbát od váhy navyše a trápiť pálenie záhy. Niektorým ženám opúchajú členky, chodidlá alebo tvár a horšie sa im spí.",
        tip: "Oddych je teraz rovnako dôležitý ako pohyb.",
        milestone: "Začiatok tretieho trimestra", sources: ["nhs"], source_urls: [u(28)]
      },
      29: {
        size: "približne 38,6 cm (ako maslová tekvica)",
        baby: "Bábätko je úplne vytvorené, orgány dozrievajú a pribúda tuk. Má už jasný rytmus spánku a bdenia.",
        you: "Bábätko tlačí na pľúca, takže sa môžeš ľahšie zadýchať. V noci častejšie chodíš na toaletu a bábätko býva živšie práve pri zaspávaní.",
        tip: "Vankúš pod bruškom a medzi kolenami môže spánok spríjemniť.",
        milestone: null, sources: ["nhs"], source_urls: [u(29)]
      },
      30: {
        size: "približne 39,9 cm (ako hlávka kapusty)",
        baby: "Oči už vedia zaostriť. Zrak sa bude rozvíjať ďalej v brušku aj po pôrode.",
        you: "Dýchanie môže byť ťažšie a spánok prerušovaný. Niektoré ženy majú veľmi živé sny, čo súvisí s hormónmi.",
        tip: "Môžeš začať zháňať prvé oblečenie pre bábätko – stačí pár kúskov, rýchlo z neho vyrastie.",
        milestone: null, sources: ["nhs"], source_urls: [u(30)]
      },
      31: {
        size: "približne 41,1 cm (ako kokosový orech)",
        baby: "Bábätko je bacuľatejšie a menej vráskavé. Cmúľe prstíky, robí kotrmelce a začína rozoznávať hlasy zvonka.",
        you: "Môžeš cítiť poslíčky (Braxton-Hicksove kontrakcie) – krátke stiahnutie bruška. Bábätko sa môže otáčať hlavičkou dole.",
        tip: "Priprav postieľku s pevným matracom a vhodnou posteľnou bielizňou.",
        milestone: null, sources: ["nhs"], source_urls: [u(31)]
      },
      32: {
        size: "približne 42,4 cm (ako zväzok zeleru)",
        baby: "Bábätko je hotové a teraz hlavne priberá tuk, ktorý mu po pôrode pomôže udržať teplo. Mnohé sú už otočené hlavičkou dole.",
        you: "Môžeš pribúdať asi pol kila týždenne a chôdza sa môže zmeniť na kolísavú. Únava a horší spánok sú bežné.",
        tip: "Pozri sa na kočíky a nosiče, kým ich budeš potrebovať.",
        milestone: null, sources: ["nhs"], source_urls: [u(32)]
      },
      33: {
        size: "približne 43,7 cm (ako ananás)",
        baby: "Mozog a nervová sústava sú vyvinuté. Kosti tvrdnú, len lebka ostáva mäkšia ešte veľa mesiacov po narodení.",
        you: "Poslíčky môžu prichádzať ako krátke stiahnutie bruška na pol minúty. Môžeš cítiť ťažobu v panve a bolesť chrbta.",
        tip: "Začni baliť tašku do pôrodnice a ulož si dôležité čísla do telefónu.",
        milestone: null, sources: ["nhs"], source_urls: [u(33)]
      },
      34: {
        size: "približne 45 cm (ako cukrový melón)",
        baby: "Bábätko leží schúlené, s nožičkami pritiahnutými k hrudi. U chlapcov zostupujú semenníky.",
        you: "Ak bábätko zostúpi nižšie do panvy, môže sa ti ľahšie dýchať a menej páliť záha. Za to častejšie chodíš na toaletu a chôdza môže byť náročnejšia.",
        tip: "Premysli si, kedy by si chcela začať materskú dovolenku.",
        milestone: null, sources: ["nhs"], source_urls: [u(34)]
      },
      35: {
        size: "približne 46,2 cm (ako medový melón)",
        baby: "Bábätko je čoraz bacuľatejšie, aby si po narodení udržalo teplo. Aj keď má málo miesta, stále sa pravidelne hýbe.",
        you: "V podprsenke si môžeš všimnúť žlté škvrnky od mledziva. Kopance môžu byť cítiť pri rebrách a poslíčky sú častejšie.",
        tip: "Ak plánuješ dojčiť, môžeš si vybrať pohodlnú podprsenku na dojčenie.",
        milestone: null, sources: ["nhs"], source_urls: [u(35)]
      },
      36: {
        size: "približne 47,4 cm (ako rímsky šalát)",
        baby: "Pľúca sú už pravdepodobne dosť zrelé na samostatné dýchanie. Bábätko vie sať a stráviť materské mlieko.",
        you: "Bábätko môže byť už hlavičkou nižšie v panve. Pri smiechu alebo kašli môže uniknúť trocha moču, keďže sa panvové dno uvoľňuje.",
        tip: "Dobaľ tašku do pôrodnice a pridaj k nej doklady.",
        milestone: null, sources: ["nhs"], source_urls: [u(36)]
      },
      37: {
        size: "približne 48,6 cm (ako pór)",
        baby: "Bábätko je donosené – dosť veľké a zrelé na život vonku. Väčšina je otočená hlavičkou dole a trénuje mimiku, napríklad mračenie či úsmev.",
        you: "Keď bábätko zostúpi, pálenie záhy sa môže zmierniť. Môžeš mať viac výtoku a niektoré ženy zrazu pociťujú silnú chuť pripravovať domov.",
        tip: "Pri sedení sa trochu nakloň dopredu, s bokmi nad kolenami.",
        milestone: "Donosené tehotenstvo", sources: ["nhs"], source_urls: [u(37)]
      },
      38: {
        size: "približne 49,8 cm (ako stonka rebarbory)",
        baby: "Väčšina jemných chĺpkov už opadla. V črevách sa hromadí prvá stolica (smolka), ktorú bábätko vylúči po narodení. Môže prísť ktorýkoľvek deň.",
        you: "Poslíčky, bolesť chrbta, opuchy či horší spánok môžu pokračovať. Každé telo sa na pôrod pripravuje svojím tempom.",
        tip: "Keď ideš von, maj pri sebe tehotenský preukaz.",
        milestone: null, sources: ["nhs"], source_urls: [u(38)]
      },
      39: {
        size: "približne 50,7 cm (ako malý melón)",
        baby: "Koža je pevnejšia a už nie priesvitná. Chráni ju mázok, ktorý uľahčuje cestu na svet. Krvný obeh sa ešte dolaďuje, preto môžu byť ručičky a nožičky po pôrode namodralé.",
        you: "Výtoku môže byť viac a môže ťa bolieť chrbát. Niektoré ženy zažívajú nečakané návaly energie a chuť všetko pripraviť.",
        tip: "Nechaj si čas aj na obyčajný oddych, nielen na prípravy.",
        milestone: null, sources: ["nhs"], source_urls: [u(39)]
      },
      40: {
        size: "približne 51,2 cm (ako tekvica)",
        baby: "Bábätko je pripravené na príchod. Aj teraz sa hýbe podľa svojho zvyčajného rytmu.",
        you: "Pokračujú poslíčky, bolesť chrbta a opuchy. Niektoré ženy cítia podobnú nepohodu ako pred menštruáciou. Termín je len odhad – rodiť pred ním aj po ňom je bežné.",
        tip: "Ľahké jedlá ako banán alebo jogurt ti dodajú energiu.",
        milestone: "Predpokladaný termín pôrodu", sources: ["nhs"], source_urls: [u(40)]
      },
      41: {
        size: "približne 3–4 kg",
        baby: "Rast sa už výrazne spomalil a bábätko je úplne pripravené na život vonku. Keďže sa mázok stráca, pokožka môže byť po pôrode suchšia a šúpať sa.",
        you: "Poslíčky, bolesti chrbta, opuchy a horší spánok môžu pretrvávať. Čakanie po termíne môže byť psychicky náročné.",
        tip: "Dopraj si pokojné chvíle, krátke prechádzky a rozhovory s blízkymi.",
        milestone: null, sources: ["nhs"], source_urls: [u(41)]
      },
      42: {
        size: null,
        baby: "Tehotenstvo zvyčajne trvá 37 až 42 týždňov, takže bábätko je úplne pripravené na svet.",
        you: "Rodiť po termíne je bežné. Môžeš byť netrpezlivá alebo unavená z čakania. Pôrodná asistentka alebo lekár s tebou prejde ďalšie možnosti a rozhodnutie je na tebe.",
        tip: "Skôr než skúsiš domáce rady na vyvolanie pôrodu, poraď sa s pôrodnou asistentkou alebo lekárom.",
        milestone: null, sources: ["nhs_42", "nhs_overdue", "nhs_induction"],
        source_urls: [
          "https://www.nhs.uk/pregnancy/week-by-week/28-to-40-plus/42-weeks/",
          "https://www.nhs.uk/best-start-in-life/pregnancy/preparing-for-labour-and-birth/overdue-have-you-gone-past-your-due-date/",
          "https://www.nhs.uk/pregnancy/labour-and-birth/signs-of-labour/inducing-labour/"
        ]
      }
    }
  };
})();

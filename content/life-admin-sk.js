/* GUGUBOO V2 – Life Admin SK. Každé faktické pole je doložené doslovnou citáciou z uloženého textu oficiálnej stránky (evidence -> content/evidence/sk/*.txt). */
window.GugubooContent = window.GugubooContent || {};
window.GugubooContent.lifeAdmin = window.GugubooContent.lifeAdmin || {};
window.GugubooContent.lifeAdmin.SK = {
  "meta": {
    "country": "SK",
    "language": "sk",
    "last_checked": "2026-09-28",
    "verification_status": "evidence-verified", "reviewed": "Nezávislá kontrola 28. 9. 2026: 425/425 citátov doslovne v uložených textoch oficiálnych stránok, každé vecné pole má citát; sumy overené aj monitoringom na GitHube. Pozor: slovensko.sk (8/2025) vs. Sociálna poisťovňa (8/2026) sa líšia v automatickom materskom – platí novší zdroj, review_required.",
    "evidence_dir": "content/evidence/sk",
    "note": "Prehľad vychádza výlučne z oficiálnych stránok (Sociálna poisťovňa, MPSVR SR, slovensko.sk, Finančná správa, zdravotné poisťovne) a zo znenia zákona o rodnom čísle na zakonypreludi.sk. Každé faktické pole má v 'evidence' doslovnú citáciu zo stránky. Nejde o právne poradenstvo – pred rozhodnutím si vždy over aktuálny stav na uvedenom zdroji alebo priamo na úrade. Dni v poli 'when' sú orientačné (7 dní = 1 týždeň) a počítajú sa od očakávaného dňa pôrodu (due_date) alebo dňa narodenia (birth_date)."
  },

  "authorities": {
    "socpoist": { "name": "Sociálna poisťovňa", "url": "https://www.socpoist.sk" },
    "socpoist_esluzby": { "name": "Sociálna poisťovňa – eSlužby", "url": "https://esluzby.socpoist.sk" },
    "mpsvr": { "name": "Ministerstvo práce, sociálnych vecí a rodiny SR", "url": "https://www.employment.gov.sk" },
    "upsvr": { "name": "Úrad práce, sociálnych vecí a rodiny (ÚPSVaR)", "url": "https://www.upsvr.gov.sk" },
    "slovensko": { "name": "Ústredný portál verejnej správy – slovensko.sk", "url": "https://www.slovensko.sk" },
    "financnasprava": { "name": "Finančná správa SR", "url": "https://www.financnasprava.sk" },
    "matrika": { "name": "Matričný úrad (Ministerstvo vnútra SR)", "url": "https://www.minv.sk" },
    "zdravotna_poistovna": { "name": "Zdravotná poisťovňa (VšZP, Dôvera, Union)", "url": "https://www.vszp.sk" },
    "zamestnavatel": { "name": "Zamestnávateľ", "url": null },
    "pediatr": { "name": "Pediater (všeobecný lekár pre deti a dorast)", "url": null }
  },

  "items": [
    {
      "id": "sk.obligation.oznamenie_tehotenstva_zamestnavatelovi",
      "type": "obligation",
      "title": "Oznám tehotenstvo zamestnávateľovi",
      "life_stage": ["pregnancy"],
      "automatic": false,
      "what": "Písomne informuješ zamestnávateľa, že si tehotná, a predložíš lekárske potvrdenie.",
      "why": "Písomným oznámením ti začne plynúť ochranná doba – počas nej ti zamestnávateľ nemôže dať výpoveď (okrem osobitných prípadov).",
      "who": "Ty (zamestnankyňa) voči zamestnávateľovi",
      "authority": "Zamestnávateľ",
      "eligibility": "Zamestnankyne.",
      "when": { "anchor": "due_date", "from_days": null, "to_days": null, "text": "Pred narodením dieťaťa. Ochranná doba ti začne plynúť až od predloženia písomného oznámenia." },
      "deadline": null,
      "amount": null,
      "documents": ["Písomné oznámenie zamestnávateľovi", "Potvrdenie o tehotenstve od gynekológa"],
      "how": "1. Vyžiadaj si od gynekológa potvrdenie o tehotenstve. 2. Napíš oznámenie zamestnávateľovi. 3. Doruč oznámenie aj potvrdenie zamestnávateľovi.",
      "where": "U zamestnávateľa.",
      "next": "Nástup na materskú dovolenku.",
      "official_source": "slovensko.sk – Narodenie (sprievodca); Zákonník práce § 40 ods. 6",
      "source_url": "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/",
      "source_urls": [
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/",
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": true,
      "evidence": {
        "what": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Podľa Zákonníka práce je zamestnankyňa považovaná za tehotnú, ak o tom písomne informovala zamestnávateľa, a zároveň predložila lekárske potvrdenie" }],
        "why": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Predložením písomného oznámenia o tehotenstve zamestnávateľovi začína plynúť zamestnankyni ochranná doba" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "počas ktorej jej zamestnávateľ nemôže dať výpoveď (okrem osobitných prípadov" }
        ],
        "who": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "zamestnankyňa považovaná za tehotnú, ak o tom písomne informovala zamestnávateľa" }],
        "authority": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Napísať oznámenie zamestnávateľovi a doručiť dokumenty zamestnávateľovi." }],
        "eligibility": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Podľa Zákonníka práce je zamestnankyňa považovaná za tehotnú" }],
        "when": [
          { "file": "content/evidence/sk/sk-narodenie.txt", "quote": "Dôležité úkony pred narodením dieťaťa Informovanie zamestnávateľa o tehotenstve" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Predložením písomného oznámenia o tehotenstve zamestnávateľovi začína plynúť zamestnankyni ochranná doba" }
        ],
        "documents": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Vyžiadať od gynekológa potvrdenie o tehotenstve." },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Napísať oznámenie zamestnávateľovi a doručiť dokumenty zamestnávateľovi." }
        ],
        "how": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Vyžiadať od gynekológa potvrdenie o tehotenstve." },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Napísať oznámenie zamestnávateľovi a doručiť dokumenty zamestnávateľovi." }
        ],
        "where": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "doručiť dokumenty zamestnávateľovi" }],
        "next": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Informovanie zamestnávateľa o tehotenstve Nástup na materskú dovolenku" }]
      }
    },
    {
      "id": "sk.benefit.tehotenske",
      "type": "benefit",
      "title": "Tehotenské",
      "life_stage": ["pregnancy"],
      "automatic": true,
      "what": "Dávka nemocenského poistenia pre tehotnú ženu, ktorá je nemocensky poistená v Sociálnej poisťovni.",
      "why": "Vypláca sa za kalendárne dni – aj za dni, keď máš príjem.",
      "who": "Vypláca Sociálna poisťovňa",
      "authority": "Sociálna poisťovňa",
      "eligibility": "Tehotná zamestnankyňa, SZČO, dobrovoľne nemocensky poistená osoba alebo poistenka v ochrannej lehote, ktorá má v posledných dvoch rokoch najmenej 270 dní nemocenského poistenia.",
      "when": { "anchor": "due_date", "from_days": -189, "to_days": 0, "text": "Nárok vzniká od začiatku 27. týždňa pred očakávaným dňom pôrodu a zaniká dňom skončenia tehotenstva." },
      "deadline": "Nárok na výplatu sa premlčí uplynutím troch rokov odo dňa, za ktorý dávka patrila.",
      "amount": "15 % denného vymeriavacieho základu (najmenej 10 % maximálneho denného vymeriavacieho základu). Maximum pri dôvode vzniknutom v roku 2026: 451 eura mesačne (30-dňový mesiac) / 466 eur mesačne (31-dňový mesiac).",
      "documents": [
        "Žiadosť o tehotenské, na ktorej lekár potvrdí očakávaný deň pôrodu (len ak ho lekár nezapíše do elektronickej tehotenskej knižky)",
        "Podpísané „Vyhlásenie poistenky“ na druhej strane žiadosti",
        "Potvrdenie od lekára zo štátu, s ktorým SR nemá zmluvu o sociálnom zabezpečení: apostila alebo superlegalizácia a úradný preklad"
      ],
      "how": "1. Ak ti gynekológ zapíše očakávaný deň pôrodu do elektronickej tehotenskej knižky, od 1. 8. 2026 žiadosť nepodávaš – Sociálna poisťovňa začne konanie sama. 2. Žiadosť podať musíš, ak si u lekára vyjadrila nesúhlas so zasielaním údajov o tehotenstve alebo ak tvoje tehotenstvo potvrdil lekár v zahraničí. 3. Inak ti lekár vystaví žiadosť o tehotenské na prvej preventívnej prehliadke na začiatku II. trimestra; vyplň a podpíš Vyhlásenie poistenky. 4. Žiadosť doruč cez eSlužby, poštou alebo osobne – najlepšie hneď po vystavení.",
      "where": "Elektronicky cez eSlužby (Elektronický účet poistenca); poštou alebo osobne na pobočke Sociálnej poisťovne podľa sídla zamestnávateľa (SZČO a dobrovoľne poistené podľa trvalého pobytu).",
      "next": "Materské – od začiatku 6. týždňa pred očakávaným dňom pôrodu, najskôr od 8. týždňa.",
      "official_source": "Sociálna poisťovňa – Tehotenské",
      "source_url": "https://www.socpoist.sk/socialne-poistenie/nemocenske-poistenie/tehotenske/dalsie-informacie-tehotenske",
      "source_urls": [
        "https://www.socpoist.sk/socialne-poistenie/nemocenske-poistenie/tehotenske/dalsie-informacie-tehotenske",
        "https://www.socpoist.sk/kto-som/zamestnanec/poziadat-o-davku/ako-poziadat-o-tehotenske",
        "https://socpoist.sk/news/zmena-2026-socialna-poistovna-bude-vyplacat-vyssie-maximalne-sumy-davok-nemocenske-materske",
        "https://socpoist.sk/news/digitalna-revolucia-v-socialnej-poistovni-prinasame-36-zlepseni-obcan-si-vybavi-viac-zivotnych",
        "https://www.socpoist.sk/socialne-poistenie/nemocenske-poistenie/materske/dalsie-informacie-materske"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": true,
      "evidence": {
        "what": [
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "Tehotenské sa poskytuje tehotnej žene, ktorá je nemocensky poistená v Sociálnej poisťovni." },
          { "file": "content/evidence/sk/sp-tehotenske-info.txt", "quote": "Sociálne poistenie Nemocenské poistenie Tehotenské" }
        ],
        "why": [{ "file": "content/evidence/sk/sp-tehotenske-info.txt", "quote": "Tehotenské sa vypláca za kalendárne dni a na rozdiel od iných nemocenských dávok aj za dni, kedy má zamestnankyňa príjem" }],
        "who": [{ "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "Sociálna poisťovňa bude vyplácať vyššie maximálne sumy dávok nemocenské, materské, tehotenské a ošetrovné" }],
        "authority": [{ "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "Sociálna poisťovňa bude vyplácať vyššie maximálne sumy dávok nemocenské, materské, tehotenské a ošetrovné" }],
        "eligibility": [
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "Nárok na tehotenské má tehotná: zamestnankyňa, povinne nemocensky poistená samostatne zárobkovo činná osoba (SZČO), dobrovoľne nemocensky poistená osoba (DNPO), poistenka, ktorej vznikol nárok na tehotenské po zániku nemocenského poistenia v ochrannej lehote" },
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "v posledných dvoch rokoch pred vznikom dôvodu na poskytnutie tehotenského máte najmenej 270 dní nemocenského poistenia" }
        ],
        "when": [
          { "file": "content/evidence/sk/sp-tehotenske-info.txt", "quote": "Nárok na tehotenské vzniká odo dňa zodpovedajúceho začiatku 27. týždňa pred očakávaným dňom pôrodu." },
          { "file": "content/evidence/sk/sp-tehotenske-info.txt", "quote": "Nárok na tehotenské a jeho výplatu zaniká dňom skončenia tehotenstva" }
        ],
        "deadline": [{ "file": "content/evidence/sk/sp-tehotenske-info.txt", "quote": "Nárok na výplatu dávky alebo jej časti sa premlčí uplynutím troch rokov odo dňa, za ktorý dávka alebo jej časť patrili." }],
        "amount": [
          { "file": "content/evidence/sk/sp-tehotenske-info.txt", "quote": "Výška tehotenského predstavuje 15 % denného vymeriavacieho základu" },
          { "file": "content/evidence/sk/sp-tehotenske-info.txt", "quote": "výška nesmie byť nižšia ako 10 % maximálneho denného vymeriavacieho základu" },
          { "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "Ak dôvod na poskytnutie nemocenskej dávky vznikne v období od 1. januára do 31. decembra 2026" },
          { "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "budúce mamičky dostanú najviac 451 eura mesačne pri 30-dňovom kalendárnom mesiaci" },
          { "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "466 eur mesačne pri 31-dňovom kalendárnom mesiaci" }
        ],
        "documents": [
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "Ak vám lekár nezaznamená očakávaný deň pôrodu do elektronickej tehotenskej knižky, v prechodnom období vám vystaví tlačivo „Žiadosť o tehotenské“" },
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "Lekár na žiadosti potvrdí očakávaný dátum vášho pôrodu." },
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "Vyplňte a podpíšte „Vyhlásenie poistenky“ na druhej strane žiadosti." },
          { "file": "content/evidence/sk/sp-tehotenske-info.txt", "quote": "musí byť osvedčené apostilou" },
          { "file": "content/evidence/sk/sp-tehotenske-info.txt", "quote": "musí byť overené formou superlegalizácie, v oboch prípadoch sa vyžaduje úradný preklad potvrdení" }
        ],
        "how": [
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "Ak vám lekár zaznamená očakávaný deň pôrodu do elektronickej tehotenskej knižky, žiadosť o tehotenské nepodávate (od 1. 8. 2026)." },
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "Sociálna poisťovňa začne proaktívne (bez žiadosti poistenky) konanie o nároku na tehotenské" },
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "musíte podať žiadosť o dávku, keďže v takomto prípade konanie nezačne proaktívne" },
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "Ak vaše tehotenstvo potvrdil lekár mimo územia Slovenskej republiky." },
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "Lekár túto žiadosť vystavuje na prvej preventívnej prehliadke na začiatku II. trimestra" },
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "Vyplňte a podpíšte „Vyhlásenie poistenky“ na druhej strane žiadosti." },
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "Cez portál eSlužieb" },
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "Písomne Poštou" },
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "Vyplnenú a podpísanú žiadosť osobne doručíte do pobočky Sociálnej poisťovne" },
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "Žiadosť o tehotenské odporúčame predložiť ihneď po vystavení žiadosti lekárom" }
        ],
        "where": [
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "Službu môžete využiť po prihlásení do Elektronického účtu poistenca" },
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "sídla zamestnávateľa, ak ste zamestnankyňa" },
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "miesta vášho trvalého pobytu, ak ste SZČO alebo DNPO" }
        ],
        "next": [
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "Nárok na materské matke dieťaťa vzniká od začiatku šiesteho týždňa pred očakávaným dňom pôrodu" },
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "najskôr od začiatku ôsmeho týždňa pred týmto dňom" }
        ],
        "automatic": [
          { "file": "content/evidence/sk/sp-ako-tehotenske.txt", "quote": "Nárok na tehotenské vám vzniká automaticky, žiadosť o tehotenské nepodávate" },
          { "file": "content/evidence/sk/sp-news-digitalna.txt", "quote": "Ak tehotenstvo lekár zaznamená elektronicky do systému elektronickej tehotenskej knižky, Sociálna poisťovňa tieto dáta automaticky využije na posúdenie nároku na dávku a následne ju poistenke vyplatí." }
        ]
      }
    },
    {
      "id": "sk.process.urcenie_otcovstva",
      "type": "process",
      "title": "Určenie otcovstva (ak nie ste manželia)",
      "life_stage": ["pregnancy", "postpartum"],
      "automatic": false,
      "what": "Ak nie ste manželia, môžete otcovstvo určiť súhlasným vyhlásením rodičov – pred narodením dieťaťa alebo po ňom.",
      "why": "Zápisnicu o určení otcovstva budeš potrebovať v nemocnici – pri nezosobášenom páre nahrádza sobášny list.",
      "who": "Obaja rodičia – osobne na matrike alebo elektronicky",
      "authority": "Matričný úrad",
      "eligibility": "Rodičia, ktorí nie sú manželia.",
      "when": { "anchor": "due_date", "from_days": null, "to_days": null, "text": "Pred narodením alebo po narodení dieťaťa." },
      "deadline": null,
      "amount": null,
      "documents": [
        "Občianske preukazy oboch rodičov",
        "Rozvedená alebo ovdovená matka: aj rozsudok o rozvode, prípadne sobášny list a úmrtný list manžela",
        "Pri elektronickej službe: elektronický občiansky preukaz s čipom"
      ],
      "how": "1. Elektronicky: služba „Zápisnica o určení otcovstva súhlasným vyhlásením rodičov k nenarodenému dieťaťu“ (potrebuješ elektronický občiansky preukaz s čipom). 2. Alebo osobne – obaja rodičia prídu na príslušnú matriku s občianskymi preukazmi. 3. Ak to nestihnete pred pôrodom, dá sa to aj po pôrode – elektronicky, osobne na matrike alebo pred súdom.",
      "where": "Príslušná matrika alebo elektronicky.",
      "next": "Dohoda rodičov o mene a priezvisku dieťaťa – matka ju môže podpísať ešte v nemocnici.",
      "official_source": "slovensko.sk – Narodenie (sprievodca)",
      "source_url": "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/",
      "source_urls": [
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": false,
      "evidence": {
        "what": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Tento krok je len pre rodičov, ktorí nie sú manželia." },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Rodičia môžu pred alebo po narodení dieťaťa určiť otcovstvo dieťaťa súhlasným vyhlásením rodičov." }
        ],
        "why": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Mať so sebou (v nemocnici) potrebné doklady" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "sobášny list - originál v prípade nezosobášneho páru je to „Zápisnica o určení otcovstva súhlasným vyhlásením rodičov k nenarodenému dieťaťu“" }
        ],
        "who": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "písomne na príslušnej matrike – musia tak urobiť osobne obaja rodičia s občianskymi preukazmi" }],
        "authority": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "písomne na príslušnej matrike" }],
        "eligibility": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Tento krok je len pre rodičov, ktorí nie sú manželia." }],
        "when": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Rodičia môžu pred alebo po narodení dieťaťa určiť otcovstvo dieťaťa súhlasným vyhlásením rodičov." }],
        "documents": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "musia tak urobiť osobne obaja rodičia s občianskymi preukazmi" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "rozvedené, prípadne ovdovené matky predložia aj rozsudok o rozvode, prípadne sobášny list a úmrtný list manžela" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "pre využitie služby je potrebné mať elektronický občiansky preukaz s čipom" }
        ],
        "how": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Zápisnica o určení otcovstva súhlasným vyhlásením rodičov k nenarodenému dieťaťu“ – pre využitie služby je potrebné mať elektronický občiansky preukaz s čipom" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "písomne na príslušnej matrike – musia tak urobiť osobne obaja rodičia s občianskymi preukazmi" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Ak sa daný úkon nestihol zrealizovať kedykoľvek pred pôrodom , môže byť realizovaný aj po pôrode - buď elektronicky cez službu" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "alebo osobne na matrike alebo pred súdom" }
        ],
        "where": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "písomne na príslušnej matrike" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Môžu tak urobiť: elektronicky" }
        ],
        "next": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "matka má možnosť podpísať Dohodu ešte v nemocnici" }]
      }
    },
    {
      "id": "sk.process.vyber_pediatra",
      "type": "process",
      "title": "Vyber si pediatra",
      "life_stage": ["pregnancy", "postpartum"],
      "automatic": false,
      "what": "Ešte pred pôrodom si dohodni pediatra – jeho kontaktné údaje budeš nahlasovať v pôrodnici.",
      "why": "Dohoda s pediatrom je aj podmienkou príspevku pri narodení dieťaťa – bez nej nárok nevzniká.",
      "who": "Ty (rodičia)",
      "authority": "Pediater",
      "eligibility": null,
      "when": { "anchor": "due_date", "from_days": null, "to_days": 0, "text": "Pred narodením dieťaťa." },
      "deadline": null,
      "amount": null,
      "documents": [],
      "how": "1. Dohodni sa s pediatrom ešte pred pôrodom. 2. Maj pripravené jeho meno, adresu a telefónne číslo – v pôrodnici ich nahlásiš. 3. Ak pediatra dohodnutého nemáš, dieťa má automaticky nárok na lekára v obvode trvalého bydliska matky.",
      "where": null,
      "next": "Prihlásenie dieťaťa k pediatrovi – ideálne do troch dní od prepustenia z pôrodnice.",
      "official_source": "slovensko.sk – Narodenie (sprievodca); MPSVR SR – Príspevok pri narodení dieťaťa",
      "source_url": "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/",
      "source_urls": [
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/",
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie",
        "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/prispevok-pri-narodeni-dietata/"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": false,
      "evidence": {
        "what": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Neodkladajte ani výber pediatra , jeho kontaktné údaje (meno, adresu a telefónne číslo) je potrebné v pôrodnici nahlásiť." },
          { "file": "content/evidence/sk/sk-narodenie.txt", "quote": "výber nemocnice a pediatra." }
        ],
        "why": [{ "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "Nárok na príspevok pri narodení dieťaťa nevzniká oprávnenej osobe, ak: pre dieťa neuzatvorila dohodu o poskytovaní všeobecnej ambulantnej starostlivosti" }],
        "who": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Povinnosti: Mať dohodnutého pediatra a poznať jeho kontaktné údaje." }],
        "authority": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Mať dohodnutého pediatra a poznať jeho kontaktné údaje." }],
        "when": [
          { "file": "content/evidence/sk/sk-narodenie.txt", "quote": "Dôležité úkony pred narodením dieťaťa" },
          { "file": "content/evidence/sk/sk-narodenie.txt", "quote": "výber nemocnice a pediatra." }
        ],
        "how": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Mať dohodnutého pediatra a poznať jeho kontaktné údaje." },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "jeho kontaktné údaje (meno, adresu a telefónne číslo) je potrebné v pôrodnici nahlásiť" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "V prípade, že nemáte dohodnutého žiadneho pediatra, dieťa má automaticky nárok na starostlivosť lekára v územnom obvode trvalého bydliska jeho matky." }
        ],
        "next": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Prihlásenie dieťaťa k vybranému pediatrovi by sa malo uskutočniť do troch dní od prepustenia z pôrodnice." }]
      }
    },
    {
      "id": "sk.benefit.materske",
      "type": "benefit",
      "title": "Materské",
      "life_stage": ["pregnancy", "postpartum"],
      "automatic": true,
      "what": "Dávka nemocenského poistenia pre poistenku z dôvodu tehotenstva alebo starostlivosti o narodené dieťa.",
      "why": "Dostávaš 75 % denného vymeriavacieho základu a po materskom ti patrí vyššia suma rodičovského príspevku.",
      "who": "Vypláca Sociálna poisťovňa",
      "authority": "Sociálna poisťovňa",
      "eligibility": "Zamestnankyňa, SZČO, dobrovoľne nemocensky poistená osoba alebo osoba v ochrannej lehote s najmenej 270 dňami nemocenského poistenia v posledných dvoch rokoch. Poberá ho matka alebo iný poistenec, ktorý sa stará o dieťa (napr. otec).",
      "when": { "anchor": "due_date", "from_days": -56, "to_days": null, "text": "Matka: od začiatku 6. týždňa pred očakávaným dňom pôrodu, na žiadosť najskôr od začiatku 8. týždňa. Nárok zaniká spravidla po 34 týždňoch (osamelá matka najdlhšie 37, pri dvoch a viac súčasne narodených deťoch najdlhšie 43 týždňov); nesmie byť kratší ako 14 týždňov a nezanikne skôr ako 6 týždňov po pôrode." },
      "deadline": null,
      "amount": "75 % denného vymeriavacieho základu. Maximum pri dôvode vzniknutom v roku 2026: 2 254,70 eura mesačne (30-dňový mesiac) / 2 329,90 eura mesačne (31-dňový mesiac).",
      "documents": [
        "Ak žiadosť podávaš: žiadosť o materské (vystaví ju gynekológ, alebo formulár „Žiadosť o materské - tehotná žena“)",
        "Podpísané Vyhlásenie poistenca na druhej strane žiadosti",
        "Vo vybraných prípadoch potvrdenie lekára o očakávanom dni pôrodu"
      ],
      "how": "1. Ak ti gynekológ zapíše očakávaný deň pôrodu do elektronickej tehotenskej knižky, od 1. 8. 2026 Sociálna poisťovňa začne konanie o materskom sama od začiatku 6. týždňa pred pôrodom – žiadosť podávať nemusíš. 2. Žiadosť podávaš, ak chceš materské od iného dňa (napr. od 8. týždňa), ak si u lekára vyjadrila nesúhlas so zasielaním údajov o tehotenstve, alebo ak tvoje tehotenstvo potvrdil lekár v zahraničí. 3. Ak ti lekár vystavuje papierovú žiadosť, robí to spravidla na začiatku 8. až 6. týždňa pred pôrodom. 4. Žiadosť podaj cez eSlužby, poštou alebo osobne.",
      "where": "Elektronicky cez eSlužby (Elektronický účet poistenca); poštou alebo osobne na pobočke Sociálnej poisťovne podľa sídla zamestnávateľa (SZČO a dobrovoľne poistené podľa trvalého pobytu).",
      "next": "Po materskom rodičovský príspevok – 500,10 € mesačne, ak ti predtým vyplácali materské.",
      "official_source": "Sociálna poisťovňa – Materské",
      "source_url": "https://www.socpoist.sk/kto-som/zamestnanec/poziadat-o-davku/ako-poziadat-o-materske",
      "source_urls": [
        "https://www.socpoist.sk/kto-som/zamestnanec/poziadat-o-davku/ako-poziadat-o-materske",
        "https://www.socpoist.sk/socialne-poistenie/nemocenske-poistenie/materske/dalsie-informacie-materske",
        "https://socpoist.sk/news/zmena-2026-socialna-poistovna-bude-vyplacat-vyssie-maximalne-sumy-davok-nemocenske-materske",
        "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/sumy-prispevkov-pre-rodicov.html"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": true,
      "evidence": {
        "what": [
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Materské sa poskytuje poistenke z dôvodu tehotenstva alebo starostlivosti o narodené dieťa" },
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "Sociálne poistenie Nemocenské poistenie Materské" }
        ],
        "why": [
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "Výška materského predstavuje 75 % denného vymeriavacieho základu" },
          { "file": "content/evidence/sk/mpsvr-sumy.txt", "quote": "500,10 € mesačne, ak sa oprávnenej osobe, ktorá o rodičovský príspevok požiadala, pred vznikom nároku na rodičovský príspevok vyplácalo z dôvodu starostlivosti o toto dieťa materské" }
        ],
        "who": [{ "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "Sociálna poisťovňa bude vyplácať vyššie maximálne sumy dávok nemocenské, materské, tehotenské a ošetrovné" }],
        "authority": [{ "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "Sociálna poisťovňa bude vyplácať vyššie maximálne sumy dávok nemocenské, materské, tehotenské a ošetrovné" }],
        "eligibility": [
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Nárok na materské má: zamestnankyňa / zamestnanec, povinne nemocensky poistená samostatne zárobkovo činná osoba (SZČO), dobrovoľne nemocensky poistená osoba (DNPO), fyzická osoba, ktorej vznikol nárok na materské po zániku nemocenského poistenia v ochrannej lehote" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "máte najmenej 270 dní nemocenského poistenia v posledných dvoch rokoch" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "musí ísť o matku dieťaťa alebo iného poistenca , ktorý sa stará o dieťa do troch rokov veku alebo otca dieťaťa ako iného poistenca" }
        ],
        "when": [
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "Nárok na materské matke dieťaťa vzniká od začiatku šiesteho týždňa pred očakávaným dňom pôrodu" },
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "najskôr od začiatku ôsmeho týždňa pred týmto dňom, ak poistenka požiada o výplatu materského v rozmedzí 8-6 týždňov pred očakávaným dňom pôrodu" },
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "Nárok na materské matke dieťaťa zaniká spravidla uplynutím 34 týždňov od vzniku nároku na materské" },
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "najdlhšie 37 týždňov od vzniku nároku na materské, ak je poistenka osamelá" },
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "najdlhšie 43 týždňov od vzniku nároku na materské, ak poistenka porodila zároveň dve alebo viac detí a aspoň o dve z narodených detí sa stará" },
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "nesmie byť kratšie ako 14 týždňov od vzniku nároku na materské a nesmie zaniknúť pred uplynutím šiestich týždňov odo dňa pôrodu" }
        ],
        "amount": [
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "Výška materského predstavuje 75 % denného vymeriavacieho základu" },
          { "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "Ak dôvod na poskytnutie nemocenskej dávky vznikne v období od 1. januára do 31. decembra 2026" },
          { "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "2 254,70 eura mesačne pri 30-dňovom mesiaci" },
          { "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "2 329,90 eura mesačne pri 31-dňovom mesiaci" }
        ],
        "documents": [
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Ak ste tehotná, žiadosť vám vystaví lekár (gynekológ)." },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Formulár „Žiadosť o materské - tehotná žena“ môžete podať nasledovným spôsobom" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Vyplňte a podpíšte Vyhlásenie poistenca na druhej strane žiadosti." },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Vo vybraných prípadoch je potrebné k formuláru priložiť aj potvrdenie príslušného lekára o očakávanom dni pôrodu." }
        ],
        "how": [
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Ako požiadam o materské ako matka dieťaťa od 1. 8. 2026 (ak vám lekár zaznamená očakávaný deň pôrodu do elektronickej tehotenskej knižky)" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Proaktívny vznik nároku na materské, žiadosť o materské podávať nemusíte" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Sociálna poisťovňa začne proaktívne (bez žiadosti poistenky) konanie o nároku na materské od začiatku šiesteho týždňa pred očakávaným dňom pôrodu" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Ak o materské chcete požiadať od iného dátumu ako od začiatku 6. týždňa pred očakávaným dňom pôrodu" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "musíte podať žiadosť o dávku, keďže v takomto prípade konanie nezačne proaktívne" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Ak vaše tehotenstvo potvrdil lekár mimo územia Slovenskej republiky." },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Lekár túto žiadosť vystavuje spravidla na začiatku ôsmeho až šiesteho týždňa pred očakávaným dňom pôrodu." },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Cez portál eSlužieb" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Písomne Poštou" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Vyplnenú a podpísanú žiadosť osobne doručíte do pobočky Sociálnej poisťovne" }
        ],
        "where": [
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Službu môžete využiť po prihlásení do eSlužieb (Elektronického účtu poistenca)" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "sídla zamestnávateľa, ak ste zamestnancom" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "miesta vášho trvalého pobytu, ak ste SZČO alebo DNPO" }
        ],
        "next": [{ "file": "content/evidence/sk/mpsvr-sumy.txt", "quote": "500,10 € mesačne, ak sa oprávnenej osobe, ktorá o rodičovský príspevok požiadala, pred vznikom nároku na rodičovský príspevok vyplácalo z dôvodu starostlivosti o toto dieťa materské" }],
        "automatic": [{ "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Sociálna poisťovňa začne proaktívne (bez žiadosti poistenky) konanie o nároku na materské" }]
      }
    },
    {
      "id": "sk.document.dohoda_o_mene",
      "type": "document",
      "title": "Dohoda rodičov o mene a priezvisku dieťaťa",
      "life_stage": ["pregnancy", "postpartum"],
      "automatic": false,
      "what": "Obaja rodičia podpíšu „Dohodu rodičov o mene a priezvisku dieťaťa“.",
      "why": "Keď je dohoda podpísaná, rodný list sa vystaví automaticky.",
      "who": "Obaja rodičia",
      "authority": "Matričný úrad",
      "eligibility": null,
      "when": { "anchor": "birth_date", "from_days": null, "to_days": 1, "text": "Osobne už počas tehotenstva, v pôrodnici najneskôr na nasledujúci deň po narodení, alebo elektronicky. Ak to v nemocnici nestihnete, podpíšete ju elektronicky alebo osobne na matrike." },
      "deadline": null,
      "amount": null,
      "documents": [
        "Občiansky preukaz (prípadne pas)",
        "Sobášny list (originál); pri nezosobášenom páre zápisnica o určení otcovstva",
        "Pri elektronickom podpise: elektronický občiansky preukaz s čipom"
      ],
      "how": "1. Do nemocnice si prineste potrebné doklady – bez nich dohodu v nemocnici nepodpíšete. 2. Podpíšte dohodu v nemocnici najneskôr na nasledujúci deň po narodení. 3. Ak to nestihnete, podpíšte ju elektronicky (s eID s čipom) alebo osobne na matrike.",
      "where": "Pôrodnica, príslušný matričný úrad alebo elektronicky.",
      "next": "Matrika pošle rodný list – je v ňom aj rodné číslo dieťaťa.",
      "official_source": "slovensko.sk – Rodný list; Narodenie (sprievodca)",
      "source_url": "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/",
      "source_urls": [
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/",
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_rodny-list/"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": false,
      "evidence": {
        "what": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "podpísanie „Dohody rodičov o mene a priezvisku dieťaťa“ (ďalej len Dohoda) ešte v nemocnici" }],
        "why": [{ "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Rodný list je vystavený automaticky za predpokladu, že bola podpísaná „Dohoda rodičov o mene a priezvisku dieťaťa“." }],
        "who": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "aby obaja rodičia podpísali „Dohodu rodičov o mene a priezvisku dieťaťa“ ešte v nemocnici" }],
        "authority": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "osobne na príslušnom matričnom úrade" }],
        "when": [
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "(osobne počas tehotenstva alebo priamo v pôrodnici alebo elektronicky )" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "ešte v nemocnici , a to najneskôr na nasledujúci deň po narodení dieťaťa" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "môžete danú Dohodu podpísať: elektronicky" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "písomne: osobne na príslušnom matričnom úrade" }
        ],
        "documents": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "občiansky preukaz (prípadne pas), tehotenskú knižku, sobášny list - originál v prípade nezosobášneho páru je to „Zápisnica o určení otcovstva súhlasným vyhlásením rodičov k nenarodenému dieťaťu“" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "„Dohoda rodičov o mene a priezvisku dieťaťa“ s elektronickým občianskym preukazom s čipom" }
        ],
        "how": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Bez predloženia potrebných dokladov nebude možné napríklad, aby obaja rodičia podpísali „Dohodu rodičov o mene a priezvisku dieťaťa“ ešte v nemocnici" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "ešte v nemocnici , a to najneskôr na nasledujúci deň po narodení dieťaťa" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "„Dohoda rodičov o mene a priezvisku dieťaťa“ s elektronickým občianskym preukazom s čipom" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "písomne: osobne na príslušnom matričnom úrade" }
        ],
        "where": [
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "(osobne počas tehotenstva alebo priamo v pôrodnici alebo elektronicky )" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "osobne na príslušnom matričnom úrade" }
        ],
        "next": [
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Príslušná matrika ho zasiela (spôsobom „do vlastných rúk“) bezodkladne" },
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "deň, mesiac, rok, miesto narodenia a rodné číslo dieťaťa" }
        ]
      }
    },
    {
      "id": "sk.process.zapis_narodenia_matrika",
      "type": "process",
      "title": "Oznámenie narodenia matrike",
      "life_stage": ["postpartum"],
      "automatic": false,
      "what": "Narodenie dieťaťa sa oznamuje matrike. Pri pôrode v zdravotníckom zariadení to urobí zariadenie (lekár), pri pôrode doma rodič.",
      "why": "Pri zápise narodenia matrika pridelí dieťaťu rodné číslo.",
      "who": "Zdravotnícke zariadenie (pri pôrode doma rodič)",
      "authority": "Matričný úrad",
      "eligibility": null,
      "when": { "anchor": "birth_date", "from_days": 0, "to_days": null, "text": "Najneskôr do 3 pracovných dní od narodenia – platí pre zariadenie aj pre rodiča pri pôrode doma." },
      "deadline": "Najneskôr do 3 pracovných dní od narodenia. Matka môže oznámenie urobiť aj neskôr – hneď, ako je schopná.",
      "amount": null,
      "documents": [],
      "how": "Pri pôrode v zdravotníckom zariadení narodenie oznámi matrike zariadenie. Pri pôrode doma ho oznámi rodič.",
      "where": "Príslušná matrika",
      "next": "Rodný list – vydáva ho matričný úrad.",
      "official_source": "slovensko.sk – Rodný list; Zákon č. 301/1995 Z. z. o rodnom čísle, § 5 ods. 2",
      "source_url": "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_rodny-list/",
      "source_urls": [
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_rodny-list/",
        "https://www.zakonypreludi.sk/zz/1995-301"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": false,
      "evidence": {
        "what": [
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Matrike oznamuje narodenie dieťaťa: zdravotnícke zariadenie , resp. lekár, ktorý pôsobil pri pôrode" },
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "prípadne rodič (v prípade narodenia doma)" }
        ],
        "why": [{ "file": "content/evidence/sk/zpl-1995-301.txt", "quote": "Príslušný matričný úrad prideľuje rodné číslo pri zápise narodenia každej osobe, ktorá sa narodila na území Slovenskej republiky." }],
        "who": [
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Matrike oznamuje narodenie dieťaťa: zdravotnícke zariadenie" },
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "prípadne rodič (v prípade narodenia doma)" }
        ],
        "authority": [{ "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Kto oznamuje narodenie dieťaťa na matrike" }],
        "when": [{ "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "najneskôr do 3 pracovných dní od narodenia dieťaťa, prípadne rodič (v prípade narodenia doma), na ktorého sa vzťahuje oznamovacia povinnosť, najneskôr do 3 pracovných dní od narodenia dieťaťa" }],
        "deadline": [
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "najneskôr do 3 pracovných dní od narodenia dieťaťa" },
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Matka môže splniť svoju oznamovaciu povinnosť aj neskôr, a to hneď, ako je schopná urobiť oznámenie." }
        ],
        "how": [
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Matrike oznamuje narodenie dieťaťa: zdravotnícke zariadenie" },
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "prípadne rodič (v prípade narodenia doma)" }
        ],
        "where": [{ "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "na príslušnej matrike" }],
        "next": [{ "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Rodný list je verejná listina, ktorú vydáva matričný úrad pri narodení dieťaťa." }]
      }
    },
    {
      "id": "sk.document.rodne_cislo",
      "type": "document",
      "title": "Rodné číslo",
      "life_stage": ["postpartum"],
      "automatic": false,
      "what": "Rodné číslo prideľuje príslušný matričný úrad pri zápise narodenia každému, kto sa narodil na Slovensku.",
      "why": "Je to trvalý identifikačný údaj dieťaťa – budeš ho potrebovať napr. u pediatra.",
      "who": "Matričný úrad",
      "authority": "Matričný úrad",
      "eligibility": "Osoby narodené na území Slovenskej republiky.",
      "when": { "anchor": "birth_date", "from_days": 0, "to_days": null, "text": "Pri zápise narodenia do matriky; nájdeš ho v rodnom liste." },
      "deadline": null,
      "amount": null,
      "documents": [],
      "how": "Rodné číslo pridelí matrika pri zápise narodenia; je uvedené v rodnom liste.",
      "where": null,
      "next": "Rodný list – pri podpísanej dohode o mene ho matrika pošle na adresu trvalého pobytu matky.",
      "official_source": "Zákon č. 301/1995 Z. z. o rodnom čísle, § 5 ods. 2; slovensko.sk – Rodný list",
      "source_url": "https://www.zakonypreludi.sk/zz/1995-301",
      "source_urls": [
        "https://www.zakonypreludi.sk/zz/1995-301",
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_rodny-list/",
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": false,
      "evidence": {
        "what": [{ "file": "content/evidence/sk/zpl-1995-301.txt", "quote": "Príslušný matričný úrad prideľuje rodné číslo pri zápise narodenia každej osobe, ktorá sa narodila na území Slovenskej republiky." }],
        "why": [
          { "file": "content/evidence/sk/zpl-1995-301.txt", "quote": "Rodné číslo je trvalý identifikačný osobný údaj fyzickej osoby" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Pre jej uzatvorenie je potrebné oznámiť pediatrovi rodné číslo dieťaťa" }
        ],
        "who": [{ "file": "content/evidence/sk/zpl-1995-301.txt", "quote": "Príslušný matričný úrad prideľuje rodné číslo pri zápise narodenia" }],
        "authority": [{ "file": "content/evidence/sk/zpl-1995-301.txt", "quote": "Príslušný matričný úrad prideľuje rodné číslo pri zápise narodenia" }],
        "eligibility": [{ "file": "content/evidence/sk/zpl-1995-301.txt", "quote": "každej osobe, ktorá sa narodila na území Slovenskej republiky" }],
        "when": [
          { "file": "content/evidence/sk/zpl-1995-301.txt", "quote": "prideľuje rodné číslo pri zápise narodenia" },
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "deň, mesiac, rok, miesto narodenia a rodné číslo dieťaťa" }
        ],
        "how": [
          { "file": "content/evidence/sk/zpl-1995-301.txt", "quote": "prideľuje rodné číslo pri zápise narodenia" },
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "deň, mesiac, rok, miesto narodenia a rodné číslo dieťaťa" }
        ],
        "next": [
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Rodný list je vystavený automaticky za predpokladu, že bola podpísaná „Dohoda rodičov o mene a priezvisku dieťaťa“." },
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "na adresu trvalého pobytu matky" }
        ]
      }
    },
    {
      "id": "sk.document.rodny_list",
      "type": "document",
      "title": "Rodný list",
      "life_stage": ["postpartum"],
      "automatic": true,
      "what": "Verejná listina, ktorú vydáva matričný úrad pri narodení dieťaťa.",
      "why": "Budeš ho potrebovať napr. pri vybavovaní občianskeho preukazu alebo pasu pre dieťa.",
      "who": "Matričný úrad",
      "authority": "Matričný úrad",
      "eligibility": null,
      "when": { "anchor": "birth_date", "from_days": 4, "to_days": 5, "text": "Ak je podpísaná dohoda o mene a priezvisku, rodný list sa vystaví automaticky a matrika ho pošle bezodkladne – zväčša na 4. – 5. deň od narodenia." },
      "deadline": null,
      "amount": "Prvý originál bezplatne; duplikát 7 €; elektronická žiadosť o duplikát 3,50 €.",
      "documents": [
        "Pri automatickom vystavení: podpísaná dohoda rodičov o mene a priezvisku dieťaťa",
        "Manželia (vyzdvihuje otec): sobášny list a platné preukazy totožnosti rodičov",
        "Slobodná matka, ktorá chce určiť otcovstvo: prítomnosť oboch rodičov s občianskymi preukazmi",
        "Slobodná matka: platný preukaz totožnosti a vyhlásenie o osobnom stave"
      ],
      "how": "1. Podpíšte dohodu o mene a priezvisku dieťaťa. 2. Ešte v pôrodnici požiadaj o zaslanie rodného listu poštou. 3. Matrika ho pošle do vlastných rúk na adresu tvojho trvalého pobytu. 4. Inak si ho prevezmeš na príslušnej matrike.",
      "where": "Poštou na adresu trvalého pobytu matky alebo osobne na príslušnej matrike (podľa miesta narodenia dieťaťa).",
      "next": "Po vystavení rodného listu štát sám rieši príspevok pri narodení dieťaťa. Bábätko je automaticky poistené v poisťovni matky a má rovnaký trvalý pobyt ako matka.",
      "official_source": "slovensko.sk – Rodný list; Narodenie (sprievodca)",
      "source_url": "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_rodny-list/",
      "source_urls": [
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_rodny-list/",
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": true,
      "evidence": {
        "what": [{ "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Rodný list je verejná listina, ktorú vydáva matričný úrad pri narodení dieťaťa." }],
        "why": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Žiadosť o vydanie cestovného dokladu ako aj vydanie občianskeho preukazu pre dieťa (teda osoby mladšie ako 15 rokov) predkladá rodič dieťaťa, ku ktorej priloží originál rodný list dieťaťa" }],
        "who": [{ "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "ktorú vydáva matričný úrad pri narodení dieťaťa" }],
        "authority": [{ "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "ktorú vydáva matričný úrad pri narodení dieťaťa" }],
        "when": [
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Rodný list je vystavený automaticky za predpokladu, že bola podpísaná „Dohoda rodičov o mene a priezvisku dieťaťa“." },
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "bezodkladne (zväčša na 4. – 5. deň od narodenia dieťaťa)" }
        ],
        "amount": [
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Vydanie prvého originálu rodného listu bezplatné" },
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Vydanie duplikátu rodného listu 7 €" },
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Podanie žiadosti o vydanie duplikátu rodného listu elektronicky 3,50 €" }
        ],
        "documents": [
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Rodný list je vystavený automaticky za predpokladu, že bola podpísaná „Dohoda rodičov o mene a priezvisku dieťaťa“." },
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "dieťa sa narodilo v platnom manželstve – rodný list vyzdvihne otec, predloží sobášny list , platné preukazy totožnosti rodičov" },
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "ak ide o slobodnú matku, ktorá chce určiť otcovstvo , vyžaduje sa prítomnosť oboch rodičov, ktorí predložia občianske preukazy" },
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "rodný list vyzdvihne matka, predloží platný preukaz totožnosti a vyhlásenie o osobnom stave" }
        ],
        "how": [
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Rodný list je vystavený automaticky za predpokladu, že bola podpísaná „Dohoda rodičov o mene a priezvisku dieťaťa“." },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "V prípade prejaveného záujmu o zaslanie Rodného listu poštou je taktiež potrebné, aby o to matka požiadala ešte v pôrodnici." },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Adresa pre doručenie rodného listu je vždy nastavená na trvalý pobyt matky. Prebieha vždy len „Do vlastných rúk“." },
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "V opačnom prípade je možné Rodný list prevziať aj na príslušnej matrike (podľa miesta narodenia dieťaťa)." }
        ],
        "where": [
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "na adresu trvalého pobytu matky" },
          { "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "V opačnom prípade je možné Rodný list prevziať aj na príslušnej matrike (podľa miesta narodenia dieťaťa)." }
        ],
        "next": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Proces schvaľovania a vyplácania príspevku si riadi štát ihneď potom ako matrika vystaví rodný list dieťaťa/detí." },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Od 1.8.2022 už nie je potrebné prihlasovať dieťa do zdravotnej poisťovne, automaticky bude prihlásené do zdravotnej poisťovne matky." },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Dieťaťu je automaticky pridelený trvalý pobyt rovnaký, ako má matka dieťaťa" }
        ],
        "automatic": [{ "file": "content/evidence/sk/sk-rodny-list.txt", "quote": "Rodný list je vystavený automaticky za predpokladu, že bola podpísaná „Dohoda rodičov o mene a priezvisku dieťaťa“." }]
      }
    },
    {
      "id": "sk.process.trvaly_pobyt_dietata",
      "type": "process",
      "title": "Trvalý pobyt dieťaťa",
      "life_stage": ["postpartum"],
      "automatic": true,
      "what": "Dieťaťu narodenému na Slovensku sa automaticky pridelí rovnaký trvalý pobyt, ako má matka – začína dňom narodenia.",
      "why": "Na adresu pobytu posiela zdravotná poisťovňa preukaz poistenca bábätka.",
      "who": "Nikto nič neohlasuje – pobyt sa pridelí automaticky",
      "authority": "Ohlasovňa pobytu (mestský alebo obecný úrad)",
      "eligibility": null,
      "when": { "anchor": "birth_date", "from_days": 0, "to_days": 0, "text": "Ku dňu narodenia, automaticky." },
      "deadline": null,
      "amount": null,
      "documents": [],
      "how": "1. Pri narodení na Slovensku nemusíš nič ohlasovať. 2. Nového člena domácnosti nahlás na mestskom úrade kvôli poplatkom za odvoz smetí. 3. Dieťa narodené v zahraničí treba prihlásiť na ohlasovni pobytu – bez pridelenia rodného čísla to nejde.",
      "where": "Pri zmene alebo pri narodení v zahraničí: ohlasovňa pobytu (mestský alebo obecný úrad v mieste bydliska).",
      "next": "Ak chceš mať dieťa prihlásené inde ako matka, pobyt sa dá zmeniť na ohlasovni pobytu.",
      "official_source": "slovensko.sk – Narodenie (sprievodca)",
      "source_url": "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/",
      "source_urls": [
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/",
        "https://www.vszp.sk/poistenci/pre-mamicky/ako-poistit-dieta.html",
        "https://www.dovera.sk/poistenec/potrebujem-poradit/ako-sa-poistit-prava-a-povinnosti/poistenie-novorodenca"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": false,
      "evidence": {
        "what": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Pre dieťa narodené na území Slovenskej republiky je začiatkom trvalého pobytu deň narodenia dieťaťa" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Dieťaťu je automaticky pridelený trvalý pobyt rovnaký, ako má matka dieťaťa – teda rodič nemusí nič ohlasovať." }
        ],
        "why": [
          { "file": "content/evidence/sk/dovera-novorodenec.txt", "quote": "pošleme vám ho poštou na adresu trvalého pobytu bábätka" },
          { "file": "content/evidence/sk/vszp-poistenie-dietata.txt", "quote": "Preukaz poistenca pre bábätko Vám zašleme poštou na adresu trvalého alebo prechodného pobytu na území SR" }
        ],
        "who": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "teda rodič nemusí nič ohlasovať" }],
        "authority": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "zmeniť na mestskom alebo obecnom úrade v mieste bydliska (ohlasovňa pobytu)" }],
        "when": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "je začiatkom trvalého pobytu deň narodenia dieťaťa" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Dieťaťu je automaticky pridelený trvalý pobyt rovnaký, ako má matka dieťaťa" }
        ],
        "how": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "teda rodič nemusí nič ohlasovať" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Nahláste nového člena aj v súvislosti s poplatkami za odvoz smetí (mestský úrad)." },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Začiatkom trvalého pobytu je deň jeho prihlásenia na ohlasovni, je však nutné ho na ohlasovni prihlásiť." },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Pozor, pokiaľ dieťa nemá pridelené rodné číslo, nie je možné prihlásenie na trvalý pobyt." }
        ],
        "where": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "zmeniť na mestskom alebo obecnom úrade v mieste bydliska (ohlasovňa pobytu)" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "je však nutné ho na ohlasovni prihlásiť" }
        ],
        "next": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Samozrejme je ho možné zmeniť na mestskom alebo obecnom úrade v mieste bydliska (ohlasovňa pobytu)" }],
        "automatic": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Dieťaťu je automaticky pridelený trvalý pobyt rovnaký, ako má matka dieťaťa" }]
      }
    },
    {
      "id": "sk.process.zdravotne_poistenie_novorodenca",
      "type": "process",
      "title": "Zdravotné poistenie bábätka",
      "life_stage": ["postpartum"],
      "automatic": true,
      "what": "Od 1. 8. 2022 sa bábätko automaticky stáva poistencom zdravotnej poisťovne, v ktorej je (alebo pri jeho narodení bola) poistená matka.",
      "why": "Prihlášku za bábätko podávať nemusíš – preukaz poistenca ti príde poštou.",
      "who": "Zdravotná poisťovňa matky – informáciu o narodení dostane z Úradu pre dohľad nad zdravotnou starostlivosťou",
      "authority": "Zdravotná poisťovňa",
      "eligibility": "Bábätko, ktorého matka je (alebo v čase jeho narodenia bola) poistená v zdravotnej poisťovni.",
      "when": { "anchor": "birth_date", "from_days": 0, "to_days": null, "text": "Automaticky po narodení. Ak chceš inú poisťovňu: prihláška do 30. septembra, zmena platí od 1. januára nasledujúceho roka." },
      "deadline": "Ak chceš inú poisťovňu: prihlášku na zmenu podaj najneskôr do 30. septembra – bábätko bude poistencom novej poisťovne od 1. januára nasledujúceho roka. Dovtedy je poistené v poisťovni matky.",
      "amount": null,
      "documents": ["Pri zmene poisťovne: tvoj doklad totožnosti (ako zákonného zástupcu) a rodné číslo bábätka z rodného listu"],
      "how": "1. Ak poisťovňu meniť nechceš, nemusíš vypisovať žiadnu prihlášku. 2. Preukaz poistenca ti poisťovňa pošle poštou. 3. Ak sa bábätko narodí v zahraničí a nemá slovenský rodný list, kontaktuj poisťovňu čo najskôr. 4. Ak chceš inú poisťovňu, podaj prihlášku na zmenu do 30. 9.",
      "where": "Elektronicky, cez call centrum alebo osobne na pobočke zdravotnej poisťovne.",
      "next": "Prihlás bábätko k pediatrovi – oznámiš mu rodné číslo a zdravotnú poisťovňu dieťaťa.",
      "official_source": "VšZP – Poistenie bábätka; Dôvera – Poistenie novorodenca; slovensko.sk",
      "source_url": "https://www.vszp.sk/poistenci/pre-mamicky/ako-poistit-dieta.html",
      "source_urls": [
        "https://www.vszp.sk/poistenci/pre-mamicky/ako-poistit-dieta.html",
        "https://www.dovera.sk/poistenec/potrebujem-poradit/ako-sa-poistit-prava-a-povinnosti/poistenie-novorodenca",
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/"
      ],
      "last_checked": "2026-09-28",
      "effective_from": "2022-08-01",
      "effective_until": null,
      "verification_status": "verified",
      "review_required": false,
      "evidence": {
        "what": [{ "file": "content/evidence/sk/vszp-poistenie-dietata.txt", "quote": "Od 1.8.2022 sa bábätko automaticky stáva poistencom zdravotnej poisťovne, v ktorej je alebo v čase jeho narodenia bola poistená matka." }],
        "why": [
          { "file": "content/evidence/sk/dovera-novorodenec.txt", "quote": "Ak mu neplánujete poisťovňu zmeniť, nie je potrebné vypisovať žiadnu prihlášku." },
          { "file": "content/evidence/sk/dovera-novorodenec.txt", "quote": "vydáme mu preukaz poistenca a pošleme vám ho poštou" }
        ],
        "who": [{ "file": "content/evidence/sk/dovera-novorodenec.txt", "quote": "Informáciu o jeho narodení dostaneme z Úradu pre dohľad nad zdravotnou starostlivosťou." }],
        "authority": [{ "file": "content/evidence/sk/dovera-novorodenec.txt", "quote": "narodené bábätko automaticky poistené v zdravotnej poisťovni matky" }],
        "eligibility": [{ "file": "content/evidence/sk/vszp-poistenie-dietata.txt", "quote": "v ktorej je alebo v čase jeho narodenia bola poistená matka" }],
        "when": [
          { "file": "content/evidence/sk/dovera-novorodenec.txt", "quote": "narodené bábätko automaticky poistené v zdravotnej poisťovni matky" },
          { "file": "content/evidence/sk/dovera-novorodenec.txt", "quote": "Ak to stihnete najneskôr do 30. septembra, naším poistencom sa stane od 1. januára nasledujúceho roka." }
        ],
        "deadline": [
          { "file": "content/evidence/sk/vszp-poistenie-dietata.txt", "quote": "ak podáte prihlášku najneskôr do 30. septembra, našim poistencom sa Vaše bábätko stane od 1. januára nasledujúceho roka" },
          { "file": "content/evidence/sk/dovera-novorodenec.txt", "quote": "Dovtedy bude bábätko poistené v poisťovni matky." }
        ],
        "documents": [
          { "file": "content/evidence/sk/vszp-poistenie-dietata.txt", "quote": "Váš doklad totožnosti, ako zákonného zástupcu bábätka" },
          { "file": "content/evidence/sk/vszp-poistenie-dietata.txt", "quote": "rodné číslo bábätka z jeho rodného listu" }
        ],
        "how": [
          { "file": "content/evidence/sk/dovera-novorodenec.txt", "quote": "Ak mu neplánujete poisťovňu zmeniť, nie je potrebné vypisovať žiadnu prihlášku." },
          { "file": "content/evidence/sk/dovera-novorodenec.txt", "quote": "vydáme mu preukaz poistenca a pošleme vám ho poštou" },
          { "file": "content/evidence/sk/vszp-poistenie-dietata.txt", "quote": "Ak sa vám bábätko narodí v zahraničí a nemá vydaný slovenský rodný list, odporúčame vám čo najskôr nás kontaktovať" },
          { "file": "content/evidence/sk/vszp-poistenie-dietata.txt", "quote": "na základe podania prihlášky na zmenu zdravotnej poisťovne do 30.9." }
        ],
        "where": [{ "file": "content/evidence/sk/vszp-poistenie-dietata.txt", "quote": "vyplnením elektronickej prihlášky prostredníctvom call centra osobne na ktorejkoľvek pobočke" }],
        "next": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Pre jej uzatvorenie je potrebné oznámiť pediatrovi rodné číslo dieťaťa a tiež zdravotnú poisťovňu, do ktorej je dieťa prihlásené." }],
        "automatic": [{ "file": "content/evidence/sk/vszp-poistenie-dietata.txt", "quote": "sa bábätko automaticky stáva poistencom zdravotnej poisťovne" }]
      }
    },
    {
      "id": "sk.process.prihlasenie_k_pediatrovi",
      "type": "process",
      "title": "Prihlás bábätko k pediatrovi",
      "life_stage": ["postpartum"],
      "automatic": false,
      "what": "S vybraným pediatrom podpíšeš Dohodu o poskytovaní všeobecnej ambulantnej starostlivosti.",
      "why": "Dohoda s pediatrom je aj podmienkou príspevku pri narodení dieťaťa.",
      "who": "Rodič s pediatrom",
      "authority": "Pediater",
      "eligibility": null,
      "when": { "anchor": "birth_date", "from_days": null, "to_days": null, "text": "Ideálne do troch dní od prepustenia z pôrodnice." },
      "deadline": "Odporúčané do troch dní od prepustenia z pôrodnice.",
      "amount": null,
      "documents": ["Rodné číslo dieťaťa", "Údaj o zdravotnej poisťovni dieťaťa", "Prepúšťacia správa z nemocnice"],
      "how": "1. Dohodni si s pediatrom termín a miesto návštevy – v ambulancii alebo doma. 2. Na návštevu si vezmi prepúšťaciu správu z nemocnice. 3. Podpíš Dohodu o poskytovaní všeobecnej ambulantnej starostlivosti.",
      "where": "V ambulancii pediatra alebo doma.",
      "next": null,
      "official_source": "slovensko.sk – Narodenie (sprievodca); MPSVR SR – Príspevok pri narodení dieťaťa",
      "source_url": "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/",
      "source_urls": [
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/",
        "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/prispevok-pri-narodeni-dietata/"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": false,
      "evidence": {
        "what": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Starostlivosť o dieťa a výber pediatra je potrebné odsúhlasiť podpísaním Dohody o poskytovaní všeobecnej ambulantnej starostlivosti" }],
        "why": [{ "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "Nárok na príspevok pri narodení dieťaťa nevzniká oprávnenej osobe, ak: pre dieťa neuzatvorila dohodu o poskytovaní všeobecnej ambulantnej starostlivosti" }],
        "who": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Podpísať Dohodu o poskytovaní všeobecnej ambulantnej starostlivosti s pediatrom." }],
        "authority": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Podpísať Dohodu o poskytovaní všeobecnej ambulantnej starostlivosti s pediatrom." }],
        "when": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Prihlásenie dieťaťa k vybranému pediatrovi by sa malo uskutočniť do troch dní od prepustenia z pôrodnice." }],
        "deadline": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "by sa malo uskutočniť do troch dní od prepustenia z pôrodnice" }],
        "documents": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Pre jej uzatvorenie je potrebné oznámiť pediatrovi rodné číslo dieťaťa a tiež zdravotnú poisťovňu, do ktorej je dieťa prihlásené." },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Dohodnúť návštevu s pediatrom, mať pri nej prepúšťaciu správu z nemocnice." }
        ],
        "how": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "S pediatrom je možné dohodnúť si termín a aj miesto návštevy (v ambulancii alebo v domácnosti rodiny)." },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Dohodnúť návštevu s pediatrom, mať pri nej prepúšťaciu správu z nemocnice." },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Podpísať Dohodu o poskytovaní všeobecnej ambulantnej starostlivosti s pediatrom." }
        ],
        "where": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "(v ambulancii alebo v domácnosti rodiny)" }]
      }
    },
    {
      "id": "sk.benefit.otcovske",
      "type": "benefit",
      "title": "Otcovské",
      "life_stage": ["postpartum"],
      "automatic": false,
      "what": "Typ dávky materské pre otca pri starostlivosti o dieťa – najviac 2 týždne v období šiestich týždňov po narodení.",
      "why": "Otec ho môže poberať bez ohľadu na to, či matka v tom čase poberá materské alebo rodičovský príspevok.",
      "who": "Vypláca Sociálna poisťovňa",
      "authority": "Sociálna poisťovňa",
      "eligibility": "Otec – zamestnanec, SZČO, dobrovoľne nemocensky poistený alebo v ochrannej lehote – ktorý sa stará o dieťa a má najmenej 270 dní nemocenského poistenia v posledných dvoch rokoch.",
      "when": { "anchor": "birth_date", "from_days": 0, "to_days": 42, "text": "Najviac 2 týždne v období 6 týždňov od narodenia. Obdobie sa predĺži o dni, keď bolo dieťa alebo matka zo zdravotných dôvodov v ústavnej starostlivosti." },
      "deadline": "Uplatniť v období od narodenia dieťaťa do 6 týždňov po narodení.",
      "amount": "Ako materské: 75 % denného vymeriavacieho základu (maximá pre rok 2026 pozri materské).",
      "documents": [
        "Žiadosť o materské – iný poistenec/otcovské",
        "Pri predĺžení kvôli hospitalizácii: potvrdenie o hospitalizácii dieťaťa alebo matky s dieťaťom"
      ],
      "how": "1. Podaj „Žiadosť o materské – iný poistenec/otcovské“ cez eSlužby, poštou alebo osobne. 2. V žiadosti uveď dátum, odkedy si otcovské uplatňuješ. 3. Po otcovskom môžeš poberať aj materské – v zásade ešte 26 týždňov, uplatniť si ho môžeš do 3 rokov veku dieťaťa.",
      "where": "Elektronicky cez eSlužby (Elektronický účet poistenca); poštou alebo osobne na pobočke Sociálnej poisťovne podľa sídla zamestnávateľa (SZČO a DNPO podľa trvalého pobytu).",
      "next": "Materské pre otca – po otcovskom ešte v zásade 26 týždňov.",
      "official_source": "Sociálna poisťovňa – Ako požiadať o otcovské",
      "source_url": "https://www.socpoist.sk/zivotne-situacie/tehotenstvo-materstvo/ako-poziadat-o-otcovske",
      "source_urls": [
        "https://www.socpoist.sk/zivotne-situacie/tehotenstvo-materstvo/ako-poziadat-o-otcovske",
        "https://www.socpoist.sk/socialne-poistenie/nemocenske-poistenie/materske/dalsie-informacie-materske",
        "https://socpoist.sk/news/zmena-2026-socialna-poistovna-bude-vyplacat-vyssie-maximalne-sumy-davok-nemocenske-materske"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": true,
      "evidence": {
        "what": [{ "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "Otcovské je typ dávky materské , ktoré sa poskytuje otcovi z dôvodu starostlivosti o svoje dieťa maximálne 2 týždne v období šiestich týždňov po narodení dieťaťa." }],
        "why": [{ "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "ktoré môže otec poberať bez ohľadu na to, či matka v tomto období poberá materské na to isté dieťa alebo rodičovský príspevok" }],
        "who": [
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "Otcovské je typ dávky materské" },
          { "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "Sociálna poisťovňa bude vyplácať vyššie maximálne sumy dávok nemocenské, materské, tehotenské a ošetrovné" }
        ],
        "authority": [{ "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "Sociálna poisťovňa bude vyplácať vyššie maximálne sumy dávok nemocenské, materské, tehotenské a ošetrovné" }],
        "eligibility": [
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "Nárok na otcovské má otec dieťaťa: zamestnanec, povinne nemocensky poistená samostatne zárobkovo činná osoba (SZČO), dobrovoľne nemocensky poistená osoba (DNPO), fyzická osoba, ktorej vznikol nárok na otcovské po zániku nemocenského poistenia v ochrannej lehote" },
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "ste osobou poskytujúcou dieťaťu starostlivosť" },
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "máte najmenej 270 dní nemocenského poistenia v posledných dvoch rokoch pred dňom, od ktorého žiadate o priznanie otcovského" }
        ],
        "when": [
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "maximálne 2 týždne v období šiestich týždňov po narodení dieťaťa" },
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "Toto obdobie sa predlžuje o kalendárne dni, počas ktorých bolo dieťa prijaté do ústavnej starostlivosti zdravotníckeho zariadenia zo zdravotných dôvodov na strane dieťaťa alebo jeho matky" }
        ],
        "deadline": [{ "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "deň, od ktorého žiadate o priznanie otcovského v období od narodenia dieťaťa do šiestich týždňov po narodení dieťaťa" }],
        "amount": [
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "Otcovské je typ dávky materské" },
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "Výška materského predstavuje 75 % denného vymeriavacieho základu" }
        ],
        "documents": [
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "Žiadosť o materské – iný poistenec/otcovské" },
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "k žiadosti priložte potvrdenie o období hospitalizácie dieťaťa, resp. matky s dieťaťom (lekárska správa/lekárske potvrdenie)" }
        ],
        "how": [
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "O dávku požiadate podaním Žiadosti o materské - iný poistenec/otcovské elektronicky alebo písomne" },
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "Vyplnenú a podpísanú žiadosť osobne doručíte do pobočky Sociálnej poisťovne" },
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "V žiadosti uveďte dátum, odkedy si uplatňujete nárok na otcovské a jeho výplatu." },
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "Na čerpanie materského pre to isté dieťa po poberaní otcovského zostane otcom v zásade 26 týždňov (pri starostlivosti o jedno narodené dieťa) a uplatniť si ju môžu do troch rokov veku dieťaťa." }
        ],
        "where": [
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "Službu môžete využiť po prihlásení do eSlužieb (Elektronického účtu poistenca)" },
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "sídla zamestnávateľa, ak ste zamestnancom" },
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "miesta vášho trvalého pobytu, ak ste SZČO alebo DNPO" }
        ],
        "next": [
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "Po dvojtýždňovom poberaní dávky otcovské môžu otcovia poberať aj dávku materské" },
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "zostane otcom v zásade 26 týždňov" }
        ]
      }
    },
    {
      "id": "sk.benefit.materske_otec",
      "type": "benefit",
      "title": "Materské pre otca (iný poistenec)",
      "life_stage": ["postpartum"],
      "automatic": false,
      "what": "Materské môže poberať aj iný poistenec, ktorý sa stará o dieťa do troch rokov – napríklad otec.",
      "why": "Otcovia si môžu materské rozdeliť na otcovské a materské; materské je 75 % denného vymeriavacieho základu.",
      "who": "Vypláca Sociálna poisťovňa",
      "authority": "Sociálna poisťovňa",
      "eligibility": "Poistenec, ktorý sa stará o dieťa, s najmenej 270 dňami nemocenského poistenia v posledných dvoch rokoch pred dňom, od ktorého žiada materské. Otec najskôr po 6 týždňoch od pôrodu, ak matka na to isté dieťa nepoberá materské ani rodičovský príspevok.",
      "when": { "anchor": "birth_date", "from_days": null, "to_days": null, "text": "Od dňa, od ktorého o materské žiadaš. Nárok zaniká po 28. týždni (osamelý otec po 31., pri starostlivosti o dve a viac detí po 37. týždni); obdobie otcovského sa odpočíta." },
      "deadline": null,
      "amount": "75 % denného vymeriavacieho základu. Maximum pri dôvode vzniknutom v roku 2026: 2 254,70 eura mesačne (30-dňový mesiac) / 2 329,90 eura mesačne (31-dňový mesiac).",
      "documents": ["Žiadosť o materské – iný poistenec/otcovské", "Ak sa matka nemôže starať zo zdravotných dôvodov: lekársky posudok"],
      "how": "1. Podaj „Žiadosť o materské – iný poistenec/otcovské“ cez eSlužby, poštou alebo osobne. 2. V žiadosti uveď dátum, odkedy si nárok uplatňuješ. 3. Materské sa za to isté obdobie poskytuje len jednému poistencovi.",
      "where": "Elektronicky cez eSlužby (Elektronický účet poistenca); poštou alebo osobne na pobočke Sociálnej poisťovne podľa sídla zamestnávateľa (SZČO a DNPO podľa trvalého pobytu).",
      "next": "Rodičovský príspevok – vyššia suma 500,10 €, ak sa pred ním vyplácalo materské.",
      "official_source": "Sociálna poisťovňa – Materské",
      "source_url": "https://www.socpoist.sk/socialne-poistenie/nemocenske-poistenie/materske/dalsie-informacie-materske",
      "source_urls": [
        "https://www.socpoist.sk/socialne-poistenie/nemocenske-poistenie/materske/dalsie-informacie-materske",
        "https://www.socpoist.sk/kto-som/zamestnanec/poziadat-o-davku/ako-poziadat-o-materske",
        "https://www.socpoist.sk/zivotne-situacie/tehotenstvo-materstvo/ako-poziadat-o-otcovske",
        "https://socpoist.sk/news/zmena-2026-socialna-poistovna-bude-vyplacat-vyssie-maximalne-sumy-davok-nemocenske-materske",
        "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/sumy-prispevkov-pre-rodicov.html"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": true,
      "evidence": {
        "what": [{ "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "musí ísť o matku dieťaťa alebo iného poistenca , ktorý sa stará o dieťa do troch rokov veku alebo otca dieťaťa ako iného poistenca" }],
        "why": [
          { "file": "content/evidence/sk/sp-ako-otcovske.txt", "quote": "Otcovia si môžu materské rozdeliť na otcovské a materské" },
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "Výška materského predstavuje 75 % denného vymeriavacieho základu" }
        ],
        "who": [{ "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "Sociálna poisťovňa bude vyplácať vyššie maximálne sumy dávok nemocenské, materské, tehotenské a ošetrovné" }],
        "authority": [{ "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "Sociálna poisťovňa bude vyplácať vyššie maximálne sumy dávok nemocenské, materské, tehotenské a ošetrovné" }],
        "eligibility": [
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "ste osobou poskytujúcou dieťaťu starostlivosť" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "máte najmenej 270 dní nemocenského poistenia v posledných dvoch rokoch" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "pred dňom, od ktorého žiadate o priznanie materského, ak ste iným poistencom" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "najskôr po uplynutí šiestich týždňov odo dňa pôrodu, ak matka nepoberá materské na to isté dieťa ani rodičovský príspevok na akékoľvek dieťa" }
        ],
        "when": [
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "Inému poistencovi nárok vzniká odo dňa, od ktorého žiada o priznanie materského" },
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "28. týždňa od vzniku nároku na materské 31. týždňa od vzniku nároku na materské, ak je osamelý 37. týždňa od vzniku nároku na materské, ak sa súčasne stará o dve a viac detí" },
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "obdobie poskytovania otcovského sa odpočíta z celkového nároku na materské" }
        ],
        "amount": [
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "Výška materského predstavuje 75 % denného vymeriavacieho základu" },
          { "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "Ak dôvod na poskytnutie nemocenskej dávky vznikne v období od 1. januára do 31. decembra 2026" },
          { "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "2 254,70 eura mesačne pri 30-dňovom mesiaci" },
          { "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "2 329,90 eura mesačne pri 31-dňovom mesiaci" }
        ],
        "documents": [
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Žiadosť o materské – iný poistenec/otcovské" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Ak ste iný poistenec ktorý o materské žiada z dôvodu, že matka sa o dieťa nemôže starať zo zdravotných dôvodov, k žiadosti priložte lekársky posudok" }
        ],
        "how": [
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "O dávku požiadate podaním Žiadosti o materské - iný poistenec/otcovské elektronicky alebo písomne" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "V žiadosti uveďte dátum, odkedy si uplatňujete nárok na materské a jeho výplatu." },
          { "file": "content/evidence/sk/sp-materske-info.txt", "quote": "poskytuje sa za to isté obdobie len raz a len jednému poistencovi" }
        ],
        "where": [
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "Službu môžete využiť po prihlásení do eSlužieb (Elektronického účtu poistenca)" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "sídla zamestnávateľa, ak ste zamestnancom" },
          { "file": "content/evidence/sk/sp-ako-materske.txt", "quote": "miesta vášho trvalého pobytu, ak ste SZČO alebo DNPO" }
        ],
        "next": [{ "file": "content/evidence/sk/mpsvr-sumy.txt", "quote": "500,10 € mesačne, ak sa oprávnenej osobe, ktorá o rodičovský príspevok požiadala, pred vznikom nároku na rodičovský príspevok vyplácalo z dôvodu starostlivosti o toto dieťa materské" }]
      }
    },
    {
      "id": "sk.benefit.prispevok_pri_narodeni",
      "type": "benefit",
      "title": "Príspevok pri narodení dieťaťa",
      "life_stage": ["postpartum"],
      "automatic": true,
      "what": "Jednorazová štátna sociálna dávka na pokrytie výdavkov na nevyhnutné potreby novorodenca.",
      "why": "Pri dieťati narodenom po 1. 4. 2022 žiadosť nepodávaš – ak splníš podmienky, vyplatí sa automaticky.",
      "who": "Úrad práce, sociálnych vecí a rodiny",
      "authority": "ÚPSVaR / MPSVR SR",
      "eligibility": "Matka, ktorá dieťa porodila (otec, ak matka zomrela, bolo po nej vyhlásené pátranie alebo mu súd dieťa zveril). Trvalý pobyt a bydlisko na Slovensku; pre dieťa je uzatvorená dohoda o všeobecnej ambulantnej starostlivosti; od 4. mesiaca tehotenstva do pôrodu preventívna prehliadka u gynekológa raz za mesiac; po pôrode si neopustila nemocnicu v rozpore s pravidlami prepustenia.",
      "when": { "anchor": "birth_date", "from_days": 0, "to_days": 365, "text": "Konanie sa začne po zápise dieťaťa do registra fyzických osôb; štandardne do 30 dní od vystavenia rodného listu. Nárok zaniká uplynutím dvanástich mesiacov od narodenia." },
      "deadline": "Nárok zaniká uplynutím 12 mesiacov od narodenia dieťaťa.",
      "amount": "829,86 € (dieťa z 1. až 4. pôrodu); 151,37 € (5. a ďalší pôrod); pri súčasne narodených deťoch +75,69 € na každé dieťa. Sumu môže k 1. septembru zvýšiť nariadenie vlády.",
      "documents": ["Pri narodení v zahraničí: úradný preklad rodného listu alebo potvrdenia o narodení (z češtiny netreba)"],
      "how": "1. Pri narodení na Slovensku žiadosť nepodávaš – úrad dostane údaje z registra. 2. Nepovinne môžeš vopred oznámiť, kam chceš príspevok poslať (účet alebo adresa); inak štát použije účet alebo adresu, kam ti chodilo tehotenské. 3. Ak sa dieťa narodilo v zahraničí, doruč na úrad práce úradný preklad rodného listu.",
      "where": "Príslušný úrad práce, sociálnych vecí a rodiny (oznámenie o spôsobe výplaty aj elektronicky alebo poštou).",
      "next": "Prídavok na dieťa a rodičovský príspevok – o tie treba požiadať.",
      "official_source": "MPSVR SR – Príspevok pri narodení dieťaťa",
      "source_url": "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/prispevok-pri-narodeni-dietata/",
      "source_urls": [
        "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/prispevok-pri-narodeni-dietata/",
        "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/prispevok-pri-narodeni-dietata/nova-web-stranka.html",
        "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/prispevok-pri-narodeni-dietata/vyplata-prispevku.html",
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": true,
      "evidence": {
        "what": [
          { "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "Príspevok pri narodení dieťaťa je štátna sociálna dávka, ktorou štát prispieva na pokrytie výdavkov spojených so zabezpečením nevyhnutných potrieb novorodenca." },
          { "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "Príspevok pri narodení dieťaťa sa poskytuje jednorazovo" }
        ],
        "why": [
          { "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "dieťa narodené po 1.4.2022" },
          { "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "uplatnenie nároku prebieha automaticky cez informačný systém bez nutnosti podávania listinnej/elektronickej žiadosti" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Táto dávka je od 1. apríla 2022 vyplácaná automaticky, ak budú splnené všetky podmienky nároku stanovené zákonom" }
        ],
        "who": [{ "file": "content/evidence/sk/mpsvr-pri-narodeni-vyplata.txt", "quote": "Úrad vyplatí oprávnenej osobe príspevok pri narodení dieťaťa" }],
        "authority": [{ "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "príslušný úrad práce, sociálnych vecí a rodiny vydá rozhodnutie o nevyplatení príspevku pri narodení dieťaťa" }],
        "eligibility": [
          { "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "matka, ktorá dieťa porodila, otec dieťaťa, ak matka dieťaťa zomrela alebo po nej bolo vyhlásené pátranie alebo bolo dieťa zverené do osobnej starostlivosti otca na základe právoplatného rozhodnutia súdu" },
          { "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "trvalý pobyt a bydlisko oprávnenej osoby na území Slovenskej republiky" },
          { "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "pre dieťa neuzatvorila dohodu o poskytovaní všeobecnej ambulantnej starostlivosti" },
          { "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "od štvrtého mesiaca tehotenstva do pôrodu sa nezúčastňovala raz za mesiac na preventívnych prehliadkach u lekára so špecializáciou v špecializačnom odbore gynekológia a pôrodníctvo" },
          { "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "po pôrode opustila zdravotnícke zariadenie ústavnej starostlivosti spôsobom, ktorý je v rozpore s ustanovením osobitného predpisu o prepustení osoby z ústavnej zdravotnej starostlivosti" }
        ],
        "when": [
          { "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "Konanie o príspevku pri narodení dieťaťa začína dňom doručenia informácie úradu práce, sociálnych vecí a rodiny o zápise dieťaťa do registra fyzických osôb" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Štandardná lehota pre priznanie príspevku je do 30 dní od vystavenia rodného listu" },
          { "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "Nárok na príspevok pri narodení dieťaťa zaniká uplynutím dvanástich mesiacov od narodenia dieťaťa." }
        ],
        "deadline": [{ "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "Nárok na príspevok pri narodení dieťaťa zaniká uplynutím dvanástich mesiacov od narodenia dieťaťa." }],
        "amount": [
          { "file": "content/evidence/sk/mpsvr-pri-narodeni-nova.txt", "quote": "829,86 €, ak ide o dieťa narodené z prvého pôrodu až štvrtého pôrodu" },
          { "file": "content/evidence/sk/mpsvr-pri-narodeni-nova.txt", "quote": "151,37 €, ak ide o dieťa narodené z piateho pôrodu a ďalšieho pôrodu" },
          { "file": "content/evidence/sk/mpsvr-pri-narodeni-nova.txt", "quote": "Ak sa súčasne narodilo viac detí, suma príspevku pri narodení dieťaťa sa zvyšuje o 75,69 eura na každé dieťa." },
          { "file": "content/evidence/sk/mpsvr-pri-narodeni-nova.txt", "quote": "Uvedenú sumu môže k 1. septembru kalendárneho roka zvýšiť nariadenie vlády Slovenskej republiky." }
        ],
        "documents": [{ "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "sa nárok na príspevok môže uplatniť aj doručením úradného prekladu rodného listu/potvrdenia o narodení dieťaťa v cudzine (nevyžaduje sa preklad z českého jazyka)" }],
        "how": [
          { "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "Informácie o narodení dieťaťa budú automaticky dostupné z registra fyzických osôb" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Toto oznámenie nie je povinné." },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "V oznámení je možné zadať spôsob výplaty príspevku a to buď na bankový účet alebo na adresu" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "štát použije už existujúce údaje - bankový účet alebo adresu, kde sa vyplácalo tehotenské" },
          { "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "na príslušný úrad práce, sociálnych vecí a rodiny" }
        ],
        "where": [
          { "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "na príslušný úrad práce, sociálnych vecí a rodiny" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Oznámenie je možné podať: elektronicky" },
          { "file": "content/evidence/sk/mpsvr-pri-narodeni-vyplata.txt", "quote": "doručením písomného oznámenia o spôsobe výplaty príspevku pri narodení dieťaťa (poštou alebo osobne)" }
        ],
        "next": [{ "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "O prídavok na dieťa, či rodičovský príspevok je aj naďalej potrebné žiadať, tzn. nepriznáva sa automaticky ako príspevok pri narodení dieťaťa." }],
        "automatic": [
          { "file": "content/evidence/sk/mpsvr-pri-narodeni.txt", "quote": "uplatnenie nároku prebieha automaticky cez informačný systém bez nutnosti podávania listinnej/elektronickej žiadosti" },
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "Táto dávka je od 1. apríla 2022 vyplácaná automaticky" }
        ]
      }
    },
    {
      "id": "sk.benefit.pridavok_na_dieta",
      "type": "benefit",
      "title": "Prídavok na dieťa",
      "life_stage": ["postpartum"],
      "automatic": false,
      "what": "Mesačná štátna sociálna dávka na výchovu a výživu nezaopatreného dieťaťa.",
      "why": "Nepríde automaticky – treba oň požiadať, a spätne ho dostaneš najviac za 6 mesiacov.",
      "who": "Úrad práce, sociálnych vecí a rodiny",
      "authority": "ÚPSVaR / MPSVR SR",
      "eligibility": "Rodič nezaopatreného dieťaťa (alebo osoba, ktorej súd dieťa zveril do starostlivosti nahrádzajúcej starostlivosť rodičov), ktorý sa o dieťa stará a má trvalý pobyt na Slovensku (cudzinci prechodný pobyt).",
      "when": { "anchor": "birth_date", "from_days": 0, "to_days": 180, "text": "Spätne sa dá uplatniť najviac za šesť mesiacov." },
      "deadline": "Spätne najviac za obdobie šiestich mesiacov.",
      "amount": "60 € mesačne (v mesiaci, keď dieťa prvýkrát nastúpi do 1. ročníka ZŠ, sa zvýši o 110 €).",
      "documents": ["Písomná žiadosť o prídavok na dieťa"],
      "how": "1. Vyplň žiadosť o prídavok na dieťa (tlačivo je na úrade práce alebo na stiahnutie). 2. Podaj ju na úrade práce, alebo elektronicky so zaručeným elektronickým podpisom. 3. Prídavok sa vypláca mesačne pozadu.",
      "where": "Úrad práce, sociálnych vecí a rodiny podľa trvalého pobytu; alebo elektronicky.",
      "next": "Daňový bonus na dieťa – uplatníš ho u zamestnávateľa alebo v daňovom priznaní.",
      "official_source": "MPSVR SR – Prídavok na dieťa",
      "source_url": "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/pridavok-dieta/",
      "source_urls": [
        "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/pridavok-dieta/",
        "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/pridavok-dieta/vyska-pridavku.html",
        "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_narodenie-sprievodca/",
        "https://podpora.financnasprava.sk/215354-Da%C5%88ov%C3%BD-bonus-na-die%C5%A5a-v-roku-2026"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": true,
      "evidence": {
        "what": [
          { "file": "content/evidence/sk/mpsvr-pridavok.txt", "quote": "Prídavok na dieťa je štátna sociálna dávka, ktorou štát prispieva oprávnenej osobe na výchovu a výživu nezaopatreného dieťaťa" },
          { "file": "content/evidence/sk/mpsvr-pridavok.txt", "quote": "Prídavok sa vypláca mesačne" }
        ],
        "why": [
          { "file": "content/evidence/sk/sk-narodenie-sprievodca.txt", "quote": "O prídavok na dieťa, či rodičovský príspevok je aj naďalej potrebné žiadať, tzn. nepriznáva sa automaticky" },
          { "file": "content/evidence/sk/mpsvr-pridavok.txt", "quote": "Žiadateľ si môže uplatniť nárok na prídavok spätne najviac za obdobie šiestich mesiacov" }
        ],
        "who": [{ "file": "content/evidence/sk/mpsvr-pridavok.txt", "quote": "Úrad práce, sociálnych vecí a rodiny vyplatí prídavok oprávnenej osobe" }],
        "authority": [{ "file": "content/evidence/sk/mpsvr-pridavok.txt", "quote": "Úrad práce, sociálnych vecí a rodiny vyplatí prídavok oprávnenej osobe" }],
        "eligibility": [
          { "file": "content/evidence/sk/mpsvr-pridavok.txt", "quote": "Oprávnená osoba na uplatnenie nároku na prídavok na dieťa je: rodič nezaopatreného dieťaťa" },
          { "file": "content/evidence/sk/mpsvr-pridavok.txt", "quote": "osoba, ktorej je nezaopatrené dieťa zverené do starostlivosti nahrádzajúcej starostlivosť rodičov na základe právoplatného rozhodnutia súdu" },
          { "file": "content/evidence/sk/mpsvr-pridavok.txt", "quote": "starostlivosť oprávnenej osoby o nezaopatrené dieťa, trvalý pobyt alebo prechodný pobyt oprávnenej osoby (platí pre cudzincov) na území Slovenskej republiky" }
        ],
        "when": [{ "file": "content/evidence/sk/mpsvr-pridavok.txt", "quote": "Žiadateľ si môže uplatniť nárok na prídavok spätne najviac za obdobie šiestich mesiacov" }],
        "deadline": [{ "file": "content/evidence/sk/mpsvr-pridavok.txt", "quote": "spätne najviac za obdobie šiestich mesiacov" }],
        "amount": [
          { "file": "content/evidence/sk/mpsvr-pridavok-vyska.txt", "quote": "Výška prídavku na dieťa je 60 € ." },
          { "file": "content/evidence/sk/mpsvr-pridavok-vyska.txt", "quote": "Táto suma sa zvýši o 110 eur za kalendárny mesiac, v ktorom nezaopatrené dieťa prvýkrát nastúpilo do prvého ročníka základnej školy." }
        ],
        "documents": [{ "file": "content/evidence/sk/mpsvr-pridavok.txt", "quote": "podaním písomnej žiadosti na úrade práce, sociálnych vecí a rodiny" }],
        "how": [
          { "file": "content/evidence/sk/mpsvr-pridavok.txt", "quote": "Tlačivo žiadosti je k dispozícii na úradoch práce, sociálnych vecí a rodiny" },
          { "file": "content/evidence/sk/mpsvr-pridavok.txt", "quote": "žiadosťou podanou elektronickými prostriedkami a podpísanou zaručeným elektronickým podpisom oprávnenej osoby" },
          { "file": "content/evidence/sk/mpsvr-pridavok.txt", "quote": "vypláca sa mesačne pozadu" }
        ],
        "where": [
          { "file": "content/evidence/sk/mpsvr-pridavok.txt", "quote": "podaním písomnej žiadosti na úrade práce, sociálnych vecí a rodiny príslušnom podľa miesta jej trvalého pobytu" },
          { "file": "content/evidence/sk/mpsvr-pridavok.txt", "quote": "žiadosťou podanou elektronickými prostriedkami" }
        ],
        "next": [
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "O túto sumu znižuje zamestnávateľ preddavky na daň zamestnanca, ktorý si uplatňuje daňový bonus na dieťa v priebehu zdaňovacieho obdobia." },
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "pri podaní daňového priznania" }
        ]
      }
    },
    {
      "id": "sk.benefit.danovy_bonus",
      "type": "benefit",
      "title": "Daňový bonus na dieťa",
      "life_stage": ["postpartum"],
      "automatic": false,
      "what": "Suma, o ktorú sa ti znižuje daň, na každé vyživované dieťa, ktoré s tebou žije v domácnosti.",
      "why": "Pri dieťati do 15 rokov ide v roku 2026 o 100 eur mesačne – uplatníš ho u zamestnávateľa alebo v daňovom priznaní.",
      "who": "Zamestnávateľ (počas roka) alebo správca dane (v daňovom priznaní)",
      "authority": "Finančná správa SR (správca dane)",
      "eligibility": "Daňovník s príjmami podľa § 5 alebo § 6 ods. 1 a 2 zákona o dani z príjmov a s vyživovaným dieťaťom v domácnosti; zdaniteľné príjmy zo SR za rok 2026 tvoria najmenej 90 % všetkých jeho príjmov. Bonus je obmedzený percentom zo základu dane (pri 1 dieťati 29 %) a pri základe dane nad 1,5-násobok 12-násobku priemernej mesačnej mzdy za rok 2024 sa znižuje.",
      "when": { "anchor": "birth_date", "from_days": null, "to_days": null, "text": "Počas roka cez zamestnávateľa alebo v daňovom priznaní. Uplatňuje sa za každý mesiac, na ktorého začiatku boli splnené podmienky." },
      "deadline": null,
      "amount": "Rok 2026: 100 eur mesačne na dieťa do 15 rokov; 50 eur mesačne na dieťa od 15 do 18 rokov.",
      "documents": [],
      "how": "1. Ak si zamestnanec, bonus si môžeš uplatňovať počas roka – zamestnávateľ ti o jeho sumu zníži preddavky na daň. 2. Inak si ho uplatníš v daňovom priznaní; správca dane ho zasiela do 40 dní po uplynutí lehoty na podanie priznania.",
      "where": "U zamestnávateľa alebo v daňovom priznaní.",
      "next": null,
      "official_source": "Finančná správa SR – Daňový bonus na dieťa v roku 2026",
      "source_url": "https://podpora.financnasprava.sk/215354-Da%C5%88ov%C3%BD-bonus-na-die%C5%A5a-v-roku-2026",
      "source_urls": [
        "https://podpora.financnasprava.sk/215354-Da%C5%88ov%C3%BD-bonus-na-die%C5%A5a-v-roku-2026",
        "https://podpora.financnasprava.sk/549090-Da%C5%88ov%C3%BD-bonus-na-vy%C5%BEivovan%C3%A9-die%C5%A5a-v-roku-2026"
      ],
      "last_checked": "2026-09-28",
      "effective_from": "2026-01-01",
      "effective_until": "2026-12-31",
      "verification_status": "verified",
      "review_required": true,
      "evidence": {
        "what": [
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "si môže uplatniť daňový bonus na každé vyživované dieťa žijúce v domácnosti s daňovníkom" },
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "Suma daňového bonusu, o ktorú sa znižuje daň, je" }
        ],
        "why": [
          { "file": "content/evidence/sk/fs-bonus-549090.txt", "quote": "100 eur mesačne, ak vyživované dieťa nedovŕšilo 15 rokov veku" },
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "O túto sumu znižuje zamestnávateľ preddavky na daň zamestnanca, ktorý si uplatňuje daňový bonus na dieťa v priebehu zdaňovacieho obdobia." },
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "pri podaní daňového priznania" }
        ],
        "who": [
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "O túto sumu znižuje zamestnávateľ preddavky na daň zamestnanca" },
          { "file": "content/evidence/sk/fs-bonus-549090.txt", "quote": "Daňový bonus správca dane zasiela do 40 dní po uplynutí lehoty na podanie daňového priznania." }
        ],
        "authority": [{ "file": "content/evidence/sk/fs-bonus-549090.txt", "quote": "Daňový bonus správca dane zasiela" }],
        "eligibility": [
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "Daňovník, ktorý v zdaňovacom období dosiahol zdaniteľné príjmy zo závislej činnosti podľa § 5 zákona o dani z príjmov alebo § 6 ods. 1 a 2 zákona o dani z príjmov, si môže uplatniť daňový bonus na každé vyživované dieťa žijúce v domácnosti s daňovníkom" },
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "ak úhrn jeho zdaniteľných príjmov zo zdrojov na území SR za rok 2026 tvorí najmenej 90 % zo všetkých príjmov tohto daňovníka" },
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "Nárok na daňový bonus možno uplatniť najviac do výšky ustanoveného percenta základu dane" },
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "1 29 %" },
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "vyšší ako 1,5-násobok 12-násobku priemernej mesačnej mzdy zamestnanca v hospodárstve SR" },
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "t. j. v roku 2026 za rok 2024)" }
        ],
        "when": [
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "ktorý si uplatňuje daňový bonus na dieťa v priebehu zdaňovacieho obdobia" },
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "pri podaní daňového priznania" },
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "len o sumu daňového bonusu za každý kalendárny mesiac, na ktorého začiatku boli splnené podmienky na jeho uplatnenie" }
        ],
        "amount": [
          { "file": "content/evidence/sk/fs-bonus-549090.txt", "quote": "V roku 2026 si môže daňovník uplatniť daňový bonus na vyživované dieťa vo výške" },
          { "file": "content/evidence/sk/fs-bonus-549090.txt", "quote": "100 eur mesačne, ak vyživované dieťa nedovŕšilo 15 rokov veku" },
          { "file": "content/evidence/sk/fs-bonus-549090.txt", "quote": "50 eur mesačne, ak vyživované dieťa dovŕšilo 15 rokov veku a nedovŕšilo 18 rokov veku" }
        ],
        "how": [
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "O túto sumu znižuje zamestnávateľ preddavky na daň zamestnanca, ktorý si uplatňuje daňový bonus na dieťa v priebehu zdaňovacieho obdobia." },
          { "file": "content/evidence/sk/fs-bonus-549090.txt", "quote": "Daňový bonus správca dane zasiela do 40 dní po uplynutí lehoty na podanie daňového priznania." }
        ],
        "where": [
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "O túto sumu znižuje zamestnávateľ preddavky na daň zamestnanca" },
          { "file": "content/evidence/sk/fs-bonus-215354.txt", "quote": "pri podaní daňového priznania" }
        ]
      }
    },
    {
      "id": "sk.benefit.rodicovsky_prispevok",
      "type": "benefit",
      "title": "Rodičovský príspevok",
      "life_stage": ["postpartum"],
      "automatic": false,
      "what": "Mesačná štátna sociálna dávka pre rodiča, ktorý zabezpečuje riadnu starostlivosť o dieťa do 3 rokov (pri dlhodobo nepriaznivom zdravotnom stave do 6 rokov).",
      "why": "Ak ti pred ním vyplácali materské, patrí ti vyššia suma.",
      "who": "Úrad práce, sociálnych vecí a rodiny",
      "authority": "ÚPSVaR / MPSVR SR",
      "eligibility": "Rodič dieťaťa (aj osoba, ktorej bolo dieťa zverené, alebo manžel rodiča žijúci s ním v domácnosti), ktorý zabezpečuje riadnu starostlivosť o dieťa a má trvalý alebo prechodný pobyt na Slovensku. Nárok má len jedna oprávnená osoba podľa dohody.",
      "when": { "anchor": "birth_date", "from_days": 0, "to_days": null, "text": "Do 3 rokov veku dieťaťa (pri dlhodobo nepriaznivom zdravotnom stave do 6 rokov). Kým je materské vyššie ako rodičovský príspevok, nárok nevzniká; ak je nižšie, dostaneš rozdiel. Spätne najviac za 6 mesiacov." },
      "deadline": "Spätne najviac za obdobie šiestich mesiacov od posledného dňa v mesiaci, za ktorý patril.",
      "amount": "364,80 € mesačne; 500,10 € mesačne, ak sa ti pred vznikom nároku vyplácalo materské (alebo obdobná dávka v členskom štáte). Pri súčasne narodených deťoch sa zvyšuje o 120,60 € na každé súčasne narodené dieťa. Sumy sa upravujú od 1. januára.",
      "documents": ["Písomná žiadosť o rodičovský príspevok (alebo elektronická so zaručeným elektronickým podpisom)", "Dieťa narodené v zahraničí bez slovenského rodného listu: úradný preklad rodného listu"],
      "how": "1. Podaj žiadosť o rodičovský príspevok – písomne alebo elektronicky so zaručeným elektronickým podpisom. 2. Podáva sa na úrade práce podľa trvalého pobytu. 3. Nepremeškaj 6-mesačnú lehotu na spätné uplatnenie.",
      "where": "Úrad práce, sociálnych vecí a rodiny podľa trvalého pobytu (cudzinci podľa prechodného).",
      "next": null,
      "official_source": "MPSVR SR – Rodičovský príspevok",
      "source_url": "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/rodicovsky-prispevok/",
      "source_urls": [
        "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/rodicovsky-prispevok/",
        "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/rodicovsky-prispevok/vyska-prispevku.html",
        "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/sumy-prispevkov-pre-rodicov.html"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": true,
      "evidence": {
        "what": [
          { "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "Rodičovský príspevok je štátna sociálna dávka, ktorou štát prispieva oprávnenej osobe na zabezpečenie riadnej starostlivosti o dieťa do troch rokov veku alebo do šesť rokov veku, ak má dieťa dlhodobo nepriaznivý zdravotný stav." },
          { "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "vypláca sa mesačne pozadu" }
        ],
        "why": [{ "file": "content/evidence/sk/mpsvr-rodicovsky-vyska.txt", "quote": "500,10 € mesačne, ak sa oprávnenej osobe, ktorá o rodičovský príspevok požiadala, pred vznikom nároku na rodičovský príspevok vyplácalo z dôvodu starostlivosti o toto dieťa materské" }],
        "who": [{ "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "Rodičovský príspevok priznáva a vypláca oprávnenej osobe príslušný úrad práce, sociálnych vecí a rodiny" }],
        "authority": [{ "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "Rodičovský príspevok priznáva a vypláca oprávnenej osobe príslušný úrad práce, sociálnych vecí a rodiny" }],
        "eligibility": [
          { "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "rodič dieťaťa, fyzická osoba, ktorej je dieťa zverené do starostlivosti nahrádzajúcej starostlivosť rodičov na základe rozhodnutia súdu alebo úradu práce, sociálnych vecí a rodiny alebo manžel rodiča dieťaťa, ak žije s rodičom dieťaťa v domácnosti" },
          { "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "zabezpečuje riadnu starostlivosť o dieťa (osobne alebo inou plnoletou fyzickou alebo právnickou osobou) a má trvalý pobyt alebo prechodný pobyt na území Slovenskej republiky" },
          { "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "Nárok na rodičovský príspevok má len jedna oprávnená osoba určená podľa dohody osôb, ktoré sa o dieťa starajú." }
        ],
        "when": [
          { "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "nárok na rodičovský príspevok trvá do troch rokov veku alebo najdlhšie do šiestich rokov veku dieťaťa, ktoré má podľa posudku dlhodobo nepriaznivý zdravotný stav" },
          { "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "ak aspoň jedna z oprávnených osôb má nárok na materské alebo má nárok na obdobnú dávku ako materské v členskom štáte a suma materského alebo obdobnej dávky ako materské v členskom štáte za celý kalendárny mesiac je vyššia ako suma rodičovského príspevku" },
          { "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "rodičovský príspevok je počas obdobia vyplácania materského alebo obdobnej dávky ako materské v členskom štáte v sume určenej ako rozdiel medzi sumou rodičovského príspevku a sumou materského" },
          { "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "Žiadateľ si môže uplatniť nárok na rodičovský príspevok spätne najviac za obdobie šiestich mesiacov" }
        ],
        "deadline": [{ "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "Žiadateľ si môže uplatniť nárok na rodičovský príspevok spätne najviac za obdobie šiestich mesiacov od posledného dňa v mesiaci, za ktorý patril." }],
        "amount": [
          { "file": "content/evidence/sk/mpsvr-rodicovsky-vyska.txt", "quote": "Výška rodičovského príspevku je: a) 364,80 € mesačne, b) 500,10 € mesačne, ak sa oprávnenej osobe, ktorá o rodičovský príspevok požiadala, pred vznikom nároku na rodičovský príspevok vyplácalo z dôvodu starostlivosti o toto dieťa materské alebo obdobná dávka ako materské v členskom štáte." },
          { "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "rodičovský príspevok sa zvyšuje o 120, 60 € (zvýšenie sumy o 25 %) na každé dieťa, ktoré sa narodilo súčasne" },
          { "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "Sumy rodičovského príspevku platné k 31. decembru sa upravujú od 1. januára" }
        ],
        "documents": [
          { "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "podaním písomnej žiadosti alebo žiadosti podanej elektronickými prostriedkami podpísanej zaručeným elektronickým podpisom" },
          { "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "oprávnená osoba k písomnej žiadosti o rodičovský príspevok priloží úradný preklad rodného listu dieťaťa" }
        ],
        "how": [
          { "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "podaním písomnej žiadosti alebo žiadosti podanej elektronickými prostriedkami podpísanej zaručeným elektronickým podpisom" },
          { "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "na úrade práce, sociálnych vecí a rodiny príslušnom podľa miesta jej trvalého pobytu" },
          { "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "spätne najviac za obdobie šiestich mesiacov" }
        ],
        "where": [{ "file": "content/evidence/sk/mpsvr-rodicovsky.txt", "quote": "na úrade práce, sociálnych vecí a rodiny príslušnom podľa miesta jej trvalého pobytu alebo prechodného pobytu (týka sa len cudzincov)" }]
      }
    },
    {
      "id": "sk.benefit.prispevok_viac_sucasne_narodenych_deti",
      "type": "benefit",
      "title": "Príspevok na viac súčasne narodených detí",
      "life_stage": ["postpartum"],
      "automatic": false,
      "what": "Príspevok raz za rok pre rodičov troch a viac súčasne narodených detí alebo dvojčiat, ktoré sa narodili opakovane v priebehu dvoch rokov.",
      "why": "Pomoc pri zvýšených výdavkoch – treba oň žiadať každý kalendárny rok.",
      "who": "Úrad práce, sociálnych vecí a rodiny",
      "authority": "ÚPSVaR / MPSVR SR",
      "eligibility": "Rodič (alebo osoba, ktorej súd deti zveril), ktorý sa o deti riadne stará; deti vo veku najviac 15 rokov; rodič aj deti majú trvalý pobyt na Slovensku. Ak sa rodičia nedohodnú, prednostné právo má matka.",
      "when": { "anchor": "birth_date", "from_days": 365, "to_days": null, "text": "Prvýkrát po dovŕšení 1 roka detí, potom v každom kalendárnom roku." },
      "deadline": null,
      "amount": "110,36 € (sumu môže k 1. septembru zmeniť nariadenie vlády).",
      "documents": ["Písomná žiadosť (potvrdzuje ju úrad práce podľa miesta narodenia dieťaťa)"],
      "how": "1. Po prvých narodeninách detí podaj písomnú žiadosť (alebo elektronicky so zaručeným elektronickým podpisom). 2. Opakuj každý kalendárny rok.",
      "where": "Úrad práce, sociálnych vecí a rodiny podľa trvalého pobytu; aj elektronicky.",
      "next": null,
      "official_source": "MPSVR SR – Príspevok na viac súčasne narodených detí",
      "source_url": "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/prispevok-rodicom-ktorym-sucasne-narodili-tri-deti/",
      "source_urls": [
        "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/podpora-rodinam-detmi/penazna-pomoc/prispevok-rodicom-ktorym-sucasne-narodili-tri-deti/",
        "https://www.employment.gov.sk/sk/rodina-socialna-pomoc/sumy-prispevkov-pre-rodicov.html"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": true,
      "evidence": {
        "what": [{ "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "štát prispieva raz za rok na zvýšené výdavky, ktoré vznikajú v súvislosti s riadnou starostlivosťou o: súčasne narodené tri deti alebo súčasne narodených viac detí alebo v priebehu dvoch rokov opakovane narodené dve deti súčasne" }],
        "why": [
          { "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "štát prispieva raz za rok na zvýšené výdavky" },
          { "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "Oprávnená osoba si uplatňuje nárok na príspevok rodičom v každom kalendárnom roku" }
        ],
        "who": [{ "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "Príspevok na viac súčasne narodených detí vyplatí oprávnenej osobe úrad práce, sociálnych vecí a rodiny" }],
        "authority": [{ "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "Príspevok na viac súčasne narodených detí vyplatí oprávnenej osobe úrad práce, sociálnych vecí a rodiny" }],
        "eligibility": [
          { "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "rodič detí alebo fyzická osoba, ktorá prevzala deti do starostlivosti nahrádzajúcej starostlivosť rodičov na základe právoplatného rozhodnutia súdu" },
          { "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "sú vo veku najviac 15 rokov" },
          { "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "riadna starostlivosť oprávnenej osoby o vyššie uvedené deti, trvalý pobyt oprávnenej osoby a vyššie uvedených detí na území Slovenskej republiky" },
          { "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "Ak sa rodičia nedohodnú , kto z nich uplatní nárok na príspevok, prednostné právo na tento príspevok má matka detí." }
        ],
        "when": [{ "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "Oprávnená osoba si uplatňuje nárok na príspevok rodičom v každom kalendárnom roku ; prvýkrát po dovŕšení jedného roku veku troch alebo viac súčasne narodených detí alebo v priebehu dvoch rokov opakovane narodených dvojčiat." }],
        "amount": [
          { "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "Suma príspevku na viac súčasne narodených detí je 110,36 €." },
          { "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "Uvedené sumy môže k 1. septembru kalendárneho roka zmeniť nariadenie vlády Slovenskej republiky." },
          { "file": "content/evidence/sk/mpsvr-sumy.txt", "quote": "príspevok na viac súčasne narodených detí 110,36 €" }
        ],
        "documents": [
          { "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "podaním písomnej žiadosti na úrade práce, sociálnych vecí a rodiny príslušnom podľa miesta jej trvalého pobytu" },
          { "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "Žiadosť o príspevok potvrdzuje úrad práce, sociálnych vecí a rodiny podľa miesta narodenia dieťaťa." }
        ],
        "how": [
          { "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "prvýkrát po dovŕšení jedného roku veku troch alebo viac súčasne narodených detí" },
          { "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "žiadosťou podanou elektronickými prostriedkami a podpísanou zaručeným elektronickým podpisom oprávnenej osoby" },
          { "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "Oprávnená osoba si uplatňuje nárok na príspevok rodičom v každom kalendárnom roku" }
        ],
        "where": [
          { "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "podaním písomnej žiadosti na úrade práce, sociálnych vecí a rodiny príslušnom podľa miesta jej trvalého pobytu" },
          { "file": "content/evidence/sk/mpsvr-sucasne-narodene.txt", "quote": "žiadosťou podanou elektronickými prostriedkami" }
        ]
      }
    },
    {
      "id": "sk.benefit.osetrovne",
      "type": "benefit",
      "title": "Ošetrovné",
      "life_stage": ["postpartum"],
      "automatic": false,
      "what": "Nemocenská dávka pri osobnom a celodennom ošetrovaní chorého člena rodiny alebo pri starostlivosti o dieťa do 11 rokov (s dlhodobo nepriaznivým zdravotným stavom do 18 rokov), napr. keď je jeho škola či škôlka uzavretá.",
      "why": "Aby si vedela, na čo máš nárok, keď dieťa ochorie.",
      "who": "Vypláca Sociálna poisťovňa",
      "authority": "Sociálna poisťovňa",
      "eligibility": "Nemocensky poistený zamestnanec, SZČO alebo dobrovoľne poistená osoba (aj v ochrannej lehote) s najmenej 270 dňami nemocenského poistenia v posledných dvoch rokoch.",
      "when": { "anchor": "birth_date", "from_days": null, "to_days": null, "text": "Keď lekár potvrdí, že dieťa potrebuje ošetrovanie, alebo keď je jeho škola či predškolské zariadenie rozhodnutím úradov uzavreté." },
      "deadline": null,
      "amount": "Maximum pri dôvode vzniknutom v roku 2026: krátkodobé ošetrovné (najviac za 14 dní) 771,70 eura; dlhodobé ošetrovné 1 653,50 eura mesačne (30-dňový mesiac) / 1 708,60 eura mesačne (31-dňový mesiac).",
      "documents": ["Žiadosť o ošetrovné potvrdená lekárom (ak lekár nepotvrdí potrebu elektronicky cez eZdravie)", "Pri uzavretí zariadenia: potvrdenie od zariadenia"],
      "how": "1. Lekár ti potvrdí potrebu ošetrovania – elektronicky cez eZdravie alebo na tlačive „Žiadosť o ošetrovné“. 2. Pri tlačive vyplň a podpíš Vyhlásenie poistenca a doruč ho pobočke; pri elektronickom potvrdení podaj žiadosť cez eSlužby, poštou alebo osobne. 3. Pri skončení ošetrovania pošli pobočke potvrdenie o skončení (II. diel tlačiva).",
      "where": "Sociálna poisťovňa – eSlužby, pošta alebo pobočka (podľa sídla zamestnávateľa; SZČO a DNPO podľa trvalého pobytu).",
      "next": null,
      "official_source": "Sociálna poisťovňa – Ako požiadať o ošetrovné",
      "source_url": "https://socpoist.sk/kto-som/zivnostnik-szco/poziadat-o-davku/ako-poziadat-o-osetrovne",
      "source_urls": [
        "https://socpoist.sk/kto-som/zivnostnik-szco/poziadat-o-davku/ako-poziadat-o-osetrovne",
        "https://socpoist.sk/news/zmena-2026-socialna-poistovna-bude-vyplacat-vyssie-maximalne-sumy-davok-nemocenske-materske"
      ],
      "last_checked": "2026-09-28",
      "effective_from": null,
      "effective_until": null,
      "verification_status": "verified",
      "review_required": true,
      "evidence": {
        "what": [
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "Ošetrovné sa poskytuje poistencovi počas osobného a celodenného ošetrovania osoby alebo osobnej a celodennej starostlivosti o dieťa do dovŕšenia jedenásteho roku veku, alebo do dovŕšenia osemnásteho roku veku, ak ide o dieťa s dlhodobo nepriaznivým zdravotným stavom." },
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "alebo škola, ktorú dieťa navštevuje, boli rozhodnutím príslušných orgánov uzavreté" },
          { "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "štyroch druhov nemocenských dávok: nemocenské, materské, tehotenské a ošetrovné" }
        ],
        "who": [{ "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "Sociálna poisťovňa bude vyplácať vyššie maximálne sumy dávok nemocenské, materské, tehotenské a ošetrovné" }],
        "authority": [{ "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "Sociálna poisťovňa bude vyplácať vyššie maximálne sumy dávok nemocenské, materské, tehotenské a ošetrovné" }],
        "eligibility": [
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "Nárok na ošetrovné (krátkodobé aj dlhodobé) má: zamestnanec, povinne nemocensky poistená samostatne zárobkovo činná osoba (SZČO), dobrovoľne nemocensky poistená osoba (DNPO)" },
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "po zániku nemocenského poistenia v ochrannej lehote" },
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "v posledných dvoch rokoch pred vznikom potreby osobného a celodenného ošetrovania alebo osobnej a celodennej starostlivosti ste boli nemocensky poistený aspoň 270 dní" }
        ],
        "when": [
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "Ku vzniku nároku na ošetrovné budete potrebovať potvrdenie príslušného lekára" },
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "predškolské zariadenie alebo zariadenie sociálnych služieb, v ktorých sa dieťaťu poskytuje starostlivosť, alebo škola, ktorú dieťa navštevuje, boli rozhodnutím príslušných orgánov uzavreté" }
        ],
        "amount": [
          { "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "Ak dôvod na poskytnutie nemocenskej dávky vznikne v období od 1. januára do 31. decembra 2026" },
          { "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "Dávka ošetrovné, ktorú Sociálna poisťovňa podľa zákona vypláca najviac za 14 dní, tak dosiahne maximálnu výšku 771,70 eura." },
          { "file": "content/evidence/sk/sp-news-sumy-2026.txt", "quote": "bude jeho maximálna výška 1 653,50 eura mesačne pri 30-dňovom kalendárnom mesiaci, resp. 1 708,60 eura mesačne pri 31 dňovom kalendárnom mesiaci" }
        ],
        "documents": [
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "Ak lekár nepotvrdí potrebu krátkodobej osobnej starostlivosti elektronicky prostredníctvom eZdravia, ale vám vystaví tlačivo „Žiadosť o ošetrovné“" },
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "Žiadosťou o ošetrovné, ktorú potvrdí príslušný lekár" },
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "V prípade uzatvorenia zariadenia nepotrebujete potvrdenie od lekára, ale od samotného zariadenia." }
        ],
        "how": [
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "Ak lekár potvrdí potrebu krátkodobej osobnej starostlivosti elektronicky prostredníctvom eZdravia (od 1. 8. 2026), postup je nasledovný" },
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "vystaví tlačivo „Žiadosť o ošetrovné“" },
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "vyplňte a podpíšte „Vyhlásenie poistenca“ na druhej strane tlačiva" },
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "Žiadosť doručte pobočke Sociálnej poisťovne" },
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "O ošetrovné môžete požiadať predložením na to určeného formulára elektronicky alebo písomne" },
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "pri ukončení potreby ošetrovania/starostlivosti II. diel tlačiva – Potvrdenie o skončení potreby osobného a celodenného ošetrovania/starostlivosti, potvrdenie zašlite pobočke Sociálnej poisťovne, ktorá vám vypláca ošetrovné" }
        ],
        "where": [
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "Cez portál eSlužieb" },
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "Písomne Poštou" },
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "sídla zamestnávateľa, ak ste zamestnanec" },
          { "file": "content/evidence/sk/sp-ako-osetrovne.txt", "quote": "miesta vášho trvalého pobytu, ak ste SZČO alebo DNPO" }
        ]
      }
    }
  ]
};

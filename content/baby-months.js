/* GUGUBOO V2 – „Tvoj mesiac“ (0–36 mesiacov). Každá veta má doslovný citát zo zdroja (evidence).
   Všeobecné informácie o bežnom vývine, nie zdravotná rada, diagnostika ani test. */
window.GugubooContent = window.GugubooContent || {};
window.GugubooContent.babyMonths = {
  meta: {
    language: "sk",
    country: "*",
    last_checked: "2026-11-13",
    review_due: "2027-05-13",
    verification_status: "evidence-quoted",
    review_required: true,
    note: "Všeobecné informácie, nie zdravotná rada. Guguboo nediagnostikuje ani nelieči. Míľniky sú to, čo väčšina detí zvyčajne robí do daného veku – nie test. Každé dieťa sa vyvíja vlastným tempom; s otázkami sa obráť na detského lekára.",
    method: "Citáty (evidence) boli 13. 11. 2026 prečítané zo zdrojových stránok nástrojom na čítanie webu (krátke doslovné úryvky). Pred zverejnením odporúčame ľudskú kontrolu citátov priamo na stránkach a kontrolu významu prekladu.",
    expert_review: "Vyžaduje overenie kvalifikovaným odborníkom (pediater / detská sestra) a oficiálnym zdrojom. Automatická AI kontrola nie je odborné medicínske schválenie.",
    milestone_framing: "CDC uvádza míľniky ako „čo väčšina detí robí do daného veku“. Obdobie X–Y používa CDC stránku pre vek Y (napr. 1–2 mesiace = CDC 2 mesiace). CDC nemá stránku pre 1 a 3 mesiace – pre obdobia 0–1 a 2–3 je použitý zdroj Pregnancy, Birth and Baby (Healthdirect Australia, vládou financovaná služba).",
    excluded: "Bez dávok liekov, bez diagnostiky, bez kŕmenia na čísla, bez slovenských zákonných termínov (tie sú v life-admin-sk.js a dieta-sk.js).",
    sources: [
      { id: "cdc-2m", name: "CDC – Learn the Signs. Act Early. – Milestones by 2 Months", url: "https://www.cdc.gov/act-early/milestones/2-months.html", read: "2026-11-13" },
      { id: "cdc-4m", name: "CDC – Learn the Signs. Act Early. – Milestones by 4 Months", url: "https://www.cdc.gov/act-early/milestones/4-months.html", read: "2026-11-13" },
      { id: "cdc-6m", name: "CDC – Learn the Signs. Act Early. – Milestones by 6 Months", url: "https://www.cdc.gov/act-early/milestones/6-months.html", read: "2026-11-13" },
      { id: "cdc-9m", name: "CDC – Learn the Signs. Act Early. – Milestones by 9 Months", url: "https://www.cdc.gov/act-early/milestones/9-months.html", read: "2026-11-13" },
      { id: "cdc-1y", name: "CDC – Learn the Signs. Act Early. – Milestones by 1 Year", url: "https://www.cdc.gov/act-early/milestones/1-year.html", read: "2026-11-13" },
      { id: "cdc-15m", name: "CDC – Learn the Signs. Act Early. – Milestones by 15 Months", url: "https://www.cdc.gov/act-early/milestones/15-months.html", read: "2026-11-13" },
      { id: "cdc-18m", name: "CDC – Learn the Signs. Act Early. – Milestones by 18 Months", url: "https://www.cdc.gov/act-early/milestones/18-months.html", read: "2026-11-13" },
      { id: "cdc-2y", name: "CDC – Learn the Signs. Act Early. – Milestones by 2 Years", url: "https://www.cdc.gov/act-early/milestones/2-years.html", read: "2026-11-13" },
      { id: "cdc-30m", name: "CDC – Learn the Signs. Act Early. – Milestones by 30 Months", url: "https://www.cdc.gov/act-early/milestones/30-months.html", read: "2026-11-13" },
      { id: "cdc-3y", name: "CDC – Learn the Signs. Act Early. – Milestones by 3 Years", url: "https://www.cdc.gov/act-early/milestones/3-years.html", read: "2026-11-13" },
      { id: "pbb-1m", name: "Pregnancy, Birth and Baby (Healthdirect Australia) – Baby's growth and development – 1 month old (last reviewed December 2025)", url: "https://www.pregnancybirthbaby.org.au/babys-growth-and-development-1-month-old", read: "2026-11-13" },
      { id: "pbb-2m", name: "Pregnancy, Birth and Baby (Healthdirect Australia) – Baby's growth and development – 2 months old (last reviewed December 2025)", url: "https://www.pregnancybirthbaby.org.au/babys-growth-and-development-2-months-old", read: "2026-11-13" },
      { id: "pbb-3m", name: "Pregnancy, Birth and Baby (Healthdirect Australia) – Baby's growth and development – 3 months old (last reviewed December 2025)", url: "https://www.pregnancybirthbaby.org.au/babys-growth-and-development-3-months-old", read: "2026-11-13" }
    ]
  },
  periods: [
    {
      id: "0-1",
      title: "Prvý mesiac",
      age_label: "narodenie až 1 mesiac",
      verified: true,
      activities_period: "0-2",
      source_urls: ["https://www.pregnancybirthbaby.org.au/babys-growth-and-development-1-month-old"],
      development: [
        { sk: "Bábätko zvyčajne vie sať a prehĺtať pri kŕmení a chytí prst, ktorý mu vložíš do dlane.", evidence: ["suck and swallow to feed", "grasp a finger or object placed in the palm of their hand"], source: "pbb-1m" },
        { sk: "Ešte nevidí ostro, ale rozozná svetlo a tmu.", evidence: ["Your baby can’t see clearly yet but they can tell apart light and dark."], source: "pbb-1m" },
        { sk: "Môže otáčať hlavičku za tvojím hlasom a ku koncu prvého mesiaca ju možno na chvíľku nadvihne.", evidence: ["Your baby may turn their head toward the sound of your voice.", "may be able to briefly lift their head"], source: "pbb-1m" },
        { sk: "Plač je zatiaľ jeho hlavný spôsob, ako ukázať hlad, nepohodlie alebo únavu.", evidence: ["your baby’s main way of showing hunger, discomfort or tiredness"], source: "pbb-1m" }
      ],
      everyday: [
        { sk: "Túlenie a držanie v náručí môže bábätko upokojiť – pomáha mu cítiť sa v bezpečí.", evidence: ["Holding and cuddling your baby may help comfort them.", "Comforting your baby helps them feel safe and supported."], source: "pbb-1m" },
        { sk: "Na spanie ho ukladaj vždy na chrbát a pri hre na brušku buď stále pri ňom.", evidence: ["Always stay with your baby during tummy time and always place your baby on their back for sleep."], source: "pbb-1m" }
      ],
      play: { sk: "Rozprávaj sa s ním, čítaj a spievaj mu – rado počúva tvoj hlas.", evidence: ["Talk, read and sing to your baby. They enjoy hearing your voice."], source: "pbb-1m", activities_period: "0-2" },
      talk_to_doctor: { sk: "Ak sa mu nedarí dobre jesť, nereaguje na hlasné zvuky alebo ťa znepokojuje jeho plač či spánok, pokojne sa porozprávaj s detským lekárom alebo detskou sestrou.", evidence: ["Talk to your doctor or maternal child health nurse if your baby:", "isn’t feeding well", "doesn’t react to loud sounds", "has crying or sleeping patterns that worry you"], source: "pbb-1m" }
    },
    {
      id: "1-2",
      title: "Druhý mesiac",
      age_label: "1 až 2 mesiace",
      verified: true,
      activities_period: "0-2",
      source_urls: ["https://www.cdc.gov/act-early/milestones/2-months.html"],
      development: [
        { sk: "Väčšina bábätiek sa do 2 mesiacov upokojí, keď sa im prihováraš alebo ich zoberieš na ruky.", evidence: ["Calms down when spoken to or picked up"], source: "cdc-2m" },
        { sk: "Pozerá ti do tváre a usmieva sa, keď sa mu prihováraš alebo sa naň usmievaš.", evidence: ["Looks at your face", "Smiles when you talk to or smile at her"], source: "cdc-2m" },
        { sk: "Vydáva aj iné zvuky ako plač a reaguje na hlasné zvuky.", evidence: ["Makes sounds other than crying", "Reacts to loud sounds"], source: "cdc-2m" },
        { sk: "Na brušku drží hlavičku hore a hýbe oboma rúčkami aj nožičkami.", evidence: ["Holds head up when on tummy", "Moves both arms and both legs"], source: "cdc-2m" }
      ],
      everyday: [
        { sk: "Pravidelný rytmus spánku a kŕmenia pomáha bábätku začať chápať, čo ho čaká.", evidence: ["Have routines for sleeping and feeding. This will help your baby begin to learn what to expect."], source: "cdc-2m" },
        { sk: "Keď je ospalé, polož ho na chrbát na bezpečné miesto na spanie – pevný matrac bez dečiek, vankúšov, mantinelov a hračiek.", evidence: ["If he seems sleepy, place him on his back in a safe sleep area", "(firm mattress with no blankets, pillows, bumper pads, or toys)."], source: "cdc-2m" },
        { sk: "Mysli aj na seba – rodičovstvo býva náročné a bábätko si ľahšie užiješ, keď sa cítiš dobre.", evidence: ["Take care of yourself. Parenting can be hard work!", "It's easier to enjoy your new baby when you feel good yourself."], source: "cdc-2m" }
      ],
      play: { sk: "Keď je hore, polož ho na bruško a hračky daj pred neho do výšky očí – precvičuje tak dvíhanie hlavičky; nenechávaj ho pritom samé.", evidence: ["Lay your baby on his tummy when he is awake and put toys at eye level in front of him.", "This will help him practice lifting his head up.", "Do not leave your baby alone."], source: "cdc-2m", activities_period: "0-2" },
      talk_to_doctor: { sk: "Ak bábätko zatiaľ nerobí jeden alebo viac z týchto krokov, stratilo zručnosť, ktorú už vedelo, alebo máš iné obavy, pokojne sa včas porozprávaj s detským lekárom a opýtaj sa na vývinový skríning.", evidence: ["If your child is not meeting one or more milestones, has lost skills he or she once had", "you have other concerns, act early", "Talk with your child's doctor, share your concerns, and ask about developmental screening."], source: "cdc-2m" }
    },
    {
      id: "2-3",
      title: "Tretí mesiac",
      age_label: "2 až 3 mesiace",
      verified: true,
      activities_period: "2-4",
      source_urls: ["https://www.pregnancybirthbaby.org.au/babys-growth-and-development-3-months-old", "https://www.pregnancybirthbaby.org.au/babys-growth-and-development-2-months-old"],
      development: [
        { sk: "Mnohé bábätká už pri hre na brušku zdvihnú hlavičku a môžu začať trochu nadvihovať aj hrudník.", evidence: ["Many babies can lift their head during tummy time and may start to lift their chest a little."], source: "pbb-3m" },
        { sk: "Na tvoj úsmev môže odpovedať úsmevom.", evidence: ["smile back when you smile at them"], source: "pbb-3m" },
        { sk: "Keď je pokojné a spokojné, môže viac vrkať a gurgať.", evidence: ["Your baby may also make more cooing or gurgling sounds when calm and content."], source: "pbb-3m" },
        { sk: "Na chrbte môže mávať rúčkami a nožičkami a začať siahať po visiacich predmetoch.", evidence: ["When lying on their back, your baby may wave their arms and legs and start to reach for dangling objects."], source: "pbb-2m" }
      ],
      everyday: [
        { sk: "Ako si bábätko zvyká na denný rytmus, cez deň býva dlhšie hore.", evidence: ["As your baby starts to settle into a daily routine, they are often awake more during the day."], source: "pbb-3m" },
        { sk: "Mnohé bábätká sa v 3 mesiacoch v noci stále budia.", evidence: ["Many babies still wake during the night at 3 months old."], source: "pbb-3m" },
        { sk: "Keď reaguješ na jeho signály, cíti sa v bezpečí a pochopené.", evidence: ["Responding to your baby's signals helps them feel safe and understood."], source: "pbb-3m" }
      ],
      play: { sk: "Nechaj ho pozerať sa na veci rôznych farieb, tvarov, vzorov a materiálov a dotýkať sa ich.", evidence: ["letting them look at and touch objects with different colours, shapes, designs and textures"], source: "pbb-3m", activities_period: "2-4" },
      talk_to_doctor: { sk: "Ak sa mu nedarí dobre jesť, nereaguje, keď sa s ním hráš, alebo prestalo robiť niečo, čo už vedelo, pokojne sa porozprávaj s detským lekárom alebo detskou sestrou.", evidence: ["Talk to your doctor or maternal child health nurse if your baby:", "isn't feeding well", "isn't responding when you play with them", "it's important to speak to your doctor if your baby has stopped doing something they had already learned to do"], source: "pbb-3m" }
    },
    {
      id: "3-4",
      title: "Štvrtý mesiac",
      age_label: "3 až 4 mesiace",
      verified: true,
      activities_period: "2-4",
      source_urls: ["https://www.cdc.gov/act-early/milestones/4-months.html"],
      development: [
        { sk: "Väčšina bábätiek sa do 4 mesiacov samo usmeje, aby upútala tvoju pozornosť, a zachichoce sa, keď ho rozosmievaš.", evidence: ["Smiles on his own to get your attention", "Chuckles (not yet a full laugh) when you try to make him laugh"], source: "cdc-4m" },
        { sk: "Vrká („óóó“, „ááá“), odpovedá zvukmi, keď sa mu prihováraš, a otáča hlavičku za tvojím hlasom.", evidence: ["Makes sounds like \"oooo\", \"aahh\" (cooing)", "Makes sounds back when you talk to him", "Turns head towards the sound of your voice"], source: "cdc-4m" },
        { sk: "Keď ho držíš, udrží hlavičku pevne aj bez opory a na brušku sa vzoprie na predlaktia.", evidence: ["Holds head steady without support when you are holding him", "Pushes up onto elbows/forearms when on tummy"], source: "cdc-4m" },
        { sk: "So záujmom si prezerá rúčky a dáva si ich do úst.", evidence: ["Looks at her hands with interest", "Brings hands to mouth"], source: "cdc-4m" }
      ],
      everyday: [
        { sk: "Drž stály rytmus spánku a kŕmenia.", evidence: ["Set steady routines for sleeping and feeding."], source: "cdc-4m" },
        { sk: "Rozprávaj, čítaj a spievaj mu – neskôr mu to pomôže hovoriť a rozumieť slovám.", evidence: ["Talk, read, and sing to your baby. This will help her learn to speak and understand words later."], source: "cdc-4m" },
        { sk: "Obrazovky (televízor, mobil, tablet) obmedz na videohovory s blízkymi – deťom do 2 rokov sa čas pri obrazovke neodporúča.", evidence: ["Limit screen time (TV, phones, tablets, etc.) to video calling with loved ones.", "Screen time is not recommended for children younger than 2 years of age."], source: "cdc-4m" }
      ],
      play: { sk: "Daj mu bezpečnú príležitosť siahať po hračkách, kopať do nich a objavovať, čo je okolo neho.", evidence: ["Provide safe opportunities for your baby to reach for toys, kick at toys and explore what is around her."], source: "cdc-4m", activities_period: "2-4" },
      talk_to_doctor: { sk: "Svoje bábätko poznáš najlepšie – ak zatiaľ nerobí jeden alebo viac z týchto krokov, stratilo zručnosť, ktorú už vedelo, alebo máš iné obavy, pokojne sa včas porozprávaj s detským lekárom a opýtaj sa na vývinový skríning.", evidence: ["You know your child best.", "If your child is not meeting one or more milestones, has lost skills he or she once had, or you have other concerns, act early.", "Talk with your child's doctor, share your concerns, and ask about developmental screening."], source: "cdc-4m" }
    },
    {
      id: "4-6",
      title: "4 až 6 mesiacov",
      age_label: "4 až 6 mesiacov",
      verified: true,
      activities_period: "4-6",
      source_urls: ["https://www.cdc.gov/act-early/milestones/6-months.html"],
      development: [
        { sk: "Väčšina bábätiek do 6 mesiacov pozná známych ľudí, smeje sa a rado sa pozerá do zrkadla.", evidence: ["Knows familiar people", "Laughs", "Likes to look at self in a mirror"], source: "cdc-6m" },
        { sk: "Striedavo s tebou „rozpráva“ zvukmi, piští a robí jazýčkom „prdíky“.", evidence: ["Takes turns making sounds with you", "Makes squealing noises", "Blows “raspberries” (sticks tongue out and blows)"], source: "cdc-6m" },
        { sk: "Siaha po hračke, ktorú chce, a veci skúma ústami.", evidence: ["Reaches to grab a toy she wants", "Puts things in her mouth to explore them"], source: "cdc-6m" },
        { sk: "Pretočí sa z bruška na chrbát a v sede sa opiera o rúčky.", evidence: ["Rolls from tummy to back", "Leans on hands to support herself when sitting"], source: "cdc-6m" }
      ],
      everyday: [
        { sk: "Pomôž mu naučiť sa upokojiť – hovor potichu, drž ho, hojdaj, spievaj mu alebo mu dovoľ cmúľať prstíky či cumlík.", evidence: ["Help your baby learn she can calm down.", "Talk softly, hold, rock, or sing to her, or let her suck on her fingers or a pacifier."], source: "cdc-6m" },
        { sk: "Všímaj si jeho nálady a uč sa im rozumieť.", evidence: ["Learn to read your baby's moods."], source: "cdc-6m" },
        { sk: "Každodenná hra na zemi alebo na hracej deke mu pomáha hýbať sa, učiť sa a objavovať.", evidence: ["Playing on the floor or play mat with your baby every day helps him to move, learn, and explore."], source: "cdc-6m" }
      ],
      play: { sk: "Polož ho na bruško alebo na chrbát a hračky daj kúsok mimo jeho dosahu.", evidence: ["Put your baby on her tummy or back and put toys just out of reach."], source: "cdc-6m", activities_period: "4-6" },
      talk_to_doctor: { sk: "Sleduj, ako sa vyvíja, a ak máš obavy, poraď sa včas – s detským lekárom môžeš prebrať akékoľvek otázky o jeho vývine.", evidence: ["Track your child's development and act early if you have a concern.", "Talk with your baby's doctor and teachers if you have questions or for more ideas on how to help your baby's development."], source: "cdc-6m" }
    },
    {
      id: "6-9",
      title: "6 až 9 mesiacov",
      age_label: "6 až 9 mesiacov",
      verified: true,
      activities_period: "6-9",
      source_urls: ["https://www.cdc.gov/act-early/milestones/9-months.html"],
      development: [
        { sk: "Väčšina bábätiek je do 9 mesiacov pri cudzích ľuďoch hanblivá alebo sa drží pri tebe a reaguje, keď odchádzaš.", evidence: ["Is shy, clingy, or fearful around strangers", "Reacts when you leave (looks, reaches for you, or cries)"], source: "cdc-9m" },
        { sk: "Pozrie sa, keď ho zavoláš menom, a džavoce rôzne slabiky ako „mamama“ či „bababa“.", evidence: ["Looks when you call her name", "Makes a lot of different sounds like \"mamamama\" and \"bababababa\""], source: "cdc-9m" },
        { sk: "Dvíha rúčky, aby ho niekto zobral na ruky, a hľadá veci, ktoré mu spadli z dohľadu.", evidence: ["Lifts arms up to be picked up", "Looks for objects when dropped out of sight (like his spoon or toy)"], source: "cdc-9m" },
        { sk: "Samo sa dostane do sedu, sedí bez opory a prekladá veci z ruky do ruky.", evidence: ["Gets to a sitting position by herself", "Sits without support", "Moves things from one hand to her other hand"], source: "cdc-9m" }
      ],
      everyday: [
        { sk: "Bábätkám je lepšie, keď vedia, čo ich čaká – pomáha pravidelný rytmus spánku a jedla.", evidence: ["Have routines for sleeping and feeding.", "Babies do better when they know what to expect."], source: "cdc-9m" },
        { sk: "Pri odchode sa rozlúč krátko a veselo, nevytrácaj sa potajomky – aj keď možno zaplače, bude vedieť, že odchádzaš.", evidence: ["Say a quick and cheerful goodbye instead of sneaking away so your baby knows you are leaving, even if he cries."], source: "cdc-9m" },
        { sk: "Keď skúma a pohybuje sa po byte, buď nablízku, nech vie, že si pri ňom.", evidence: ["Stay close by as your baby explores and moves around your home so she knows that you are near."], source: "cdc-9m" }
      ],
      play: { sk: "Pred jeho očami schovaj hračku pod deku a nechaj ho hľadať ju.", evidence: ["Play a game that teaches your baby to look for things she sees you hide, such as a toy under a blanket."], source: "cdc-9m", activities_period: "6-9" },
      talk_to_doctor: { sk: "Svoje bábätko poznáš najlepšie – ak zatiaľ nerobí jeden alebo viac z týchto krokov, stratilo zručnosť, ktorú už vedelo, alebo máš iné obavy, pokojne sa včas porozprávaj s detským lekárom a opýtaj sa na vývinový skríning.", evidence: ["You know your child best.", "If your child is not meeting one or more milestones, has lost skills he or she once had, or you have other concerns", "act early.", "Talk with your child's doctor, share your concerns, and ask about developmental screening."], source: "cdc-9m" }
    },
    {
      id: "9-12",
      title: "9 až 12 mesiacov",
      age_label: "9 až 12 mesiacov",
      verified: true,
      activities_period: "9-12",
      source_urls: ["https://www.cdc.gov/act-early/milestones/1-year.html"],
      development: [
        { sk: "Väčšina detí sa okolo prvých narodenín s tebou hrá hry ako „paci-paci“ a zamáva „pápá“.", evidence: ["Plays games with you, like pat-a-cake", "Waves \"bye-bye\""], source: "cdc-1y" },
        { sk: "Volá rodiča „mama“, „tata“ alebo iným zvláštnym menom a rozumie slovu „nie“ – na chvíľu sa zastaví.", evidence: ["Calls a parent \"mama\" or \"dada\" or another special name", "Understands \"no\" (pauses briefly or stops when you say it)"], source: "cdc-1y" },
        { sk: "Vloží vec do nádoby, napríklad kocku do hrnčeka, a hľadá veci, ktoré videlo schovať, napríklad hračku pod dekou.", evidence: ["Puts something in a container, like a block in a cup", "Looks for things he sees you hide, like a toy under a blanket"], source: "cdc-1y" },
        { sk: "Postaví sa s oporou, chodí popri nábytku a drobnosti zdvihne medzi palcom a ukazovákom.", evidence: ["Pulls up to stand", "Walks, holding on to furniture", "Picks things up between thumb and pointer finger, like small bits of food"], source: "cdc-1y" }
      ],
      everyday: [
        { sk: "Pravidelné časy spánku všetko uľahčujú.", evidence: ["Consistent sleep times make it easier!"], source: "cdc-1y" },
        { sk: "Priprav mu bezpečné miesta, kde môže objavovať.", evidence: ["Give your baby safe places to explore."], source: "cdc-1y" },
        { sk: "Keď prichádza nová opatrovateľka či opatrovateľ, daj bábätku čas, aby sa spoznali.", evidence: ["Give your baby time to get to know a new caregiver."], source: "cdc-1y" }
      ],
      play: { sk: "Daj mu hrnce a pokrievky alebo malý bubienok a nechaj ho robiť hluk.", evidence: ["Give your baby pots and pans or a small musical instrument like a drum or cymbals."], source: "cdc-1y", activities_period: "9-12" },
      talk_to_doctor: { sk: "Svoje dieťa poznáš najlepšie – ak zatiaľ nerobí jeden alebo viac z týchto krokov, stratilo zručnosť, ktorú už vedelo, alebo máš iné obavy, pokojne sa včas porozprávaj s detským lekárom a opýtaj sa na vývinový skríning.", evidence: ["You know your child best.", "If your child is not meeting one or more milestones, has lost skills he or she once had,", "or you have other concerns, act early.", "Talk with your child's doctor, share your concerns, and ask about developmental screening."], source: "cdc-1y" }
    },
    {
      id: "12-15",
      title: "12 až 15 mesiacov",
      age_label: "12 až 15 mesiacov",
      verified: true,
      activities_period: "12-15",
      source_urls: ["https://www.cdc.gov/act-early/milestones/15-months.html"],
      development: [
        { sk: "Väčšina detí do 15 mesiacov ti ukáže vec, ktorá sa im páči, tlieska od radosti a prejavuje ti nehu – objíme ťa, pritúli sa alebo ťa pobozká.", evidence: ["Shows you an object she likes", "Claps when excited", "Shows you affection (hugs, cuddles, or kisses you)"], source: "cdc-15m" },
        { sk: "Skúša povedať jedno-dve slová okrem „mama“ či „tata“ a ukazuje, keď niečo chce alebo potrebuje pomoc.", evidence: ["Tries to say one or two words besides \"mama\" or \"dada,\"", "Points to ask for something or to get help"], source: "cdc-15m" },
        { sk: "Skúša používať veci správne – telefón, hrnček či knižku – a postaví na seba aspoň dve kocky.", evidence: ["Tries to use things the right way, like a phone, cup, or book", "Stacks at least two small objects, like blocks"], source: "cdc-15m" },
        { sk: "Urobí pár krokov samo a niektoré jedlo si dáva do úst prstami.", evidence: ["Takes a few steps on his own", "Uses fingers to feed herself some food"], source: "cdc-15m" }
      ],
      everyday: [
        { sk: "Pripravte si pokojné, tiché uspávanie – pyžamo, umyť zúbky a jedna-dve knižky; pravidelné časy spánku všetko uľahčujú.", evidence: ["Create a calm, quiet bedtime for your child.", "Put on his pajamas, brush his teeth, and read 1 or 2 books to him.", "Consistent sleep times make it easier!"], source: "cdc-15m" },
        { sk: "Záchvaty zlosti sú v tomto veku bežné, častejšie prichádzajú, keď je dieťa unavené alebo hladné, a postupne budú kratšie a zriedkavejšie.", evidence: ["Expect tantrums. They are normal at this age", "are more likely if your child is tired or hungry.", "Tantrums should become shorter and happen less as he gets older."], source: "cdc-15m" },
        { sk: "Nájdi spôsoby, ako ti môže pomáhať pri bežných činnostiach.", evidence: ["Find ways to let your child help with everyday activities."], source: "cdc-15m" }
      ],
      play: { sk: "Fúkaj bublinky a nechaj ho praskať ich.", evidence: ["Blow bubbles and let your child pop them."], source: "cdc-15m", activities_period: "12-15" },
      talk_to_doctor: { sk: "Ak dieťa zatiaľ nerobí jeden alebo viac z týchto krokov, stratilo zručnosť, ktorú už vedelo, alebo máš iné obavy, pokojne sa včas porozprávaj s detským lekárom a opýtaj sa na vývinový skríning.", evidence: ["If your child is not meeting one or more milestones, has lost skills he or she once had", "Talk with your child's doctor, share your concerns, and ask about developmental screening."], source: "cdc-15m" }
    },
    {
      id: "15-18",
      title: "15 až 18 mesiacov",
      age_label: "15 až 18 mesiacov",
      verified: true,
      activities_period: "15-18",
      source_urls: ["https://www.cdc.gov/act-early/milestones/18-months.html"],
      development: [
        { sk: "Väčšina detí do 18 mesiacov sa od teba vzdiali, no obzerá sa, či si nablízku, a ukazuje ti, čo ich zaujalo.", evidence: ["Moves away from you, but looks to make sure you are close by", "Points to show you something interesting"], source: "cdc-18m" },
        { sk: "Skúša povedať tri a viac slov okrem „mama“ či „tata“ a splní jednoduchú prosbu aj bez gesta, napríklad „Daj mi to.“", evidence: ["Tries to say three or more words besides", "Follows one-step directions without any gestures"], source: "cdc-18m" },
        { sk: "Napodobňuje ťa pri domácich prácach, napríklad pri zametaní.", evidence: ["Copies you doing chores, like sweeping with a broom"], source: "cdc-18m" },
        { sk: "Chodí bez držania, čmára a samo vylezie na gauč či stoličku aj z nej zlezie.", evidence: ["Walks without holding on to anyone or anything", "Scribbles", "Climbs on and off a couch or chair without help"], source: "cdc-18m" }
      ],
      everyday: [
        { sk: "Drž stály rytmus spánku a jedla.", evidence: ["Have steady routines for sleeping and eating."], source: "cdc-18m" },
        { sk: "Záchvaty zlosti sú v tomto veku bežné – môžeš skúsiť odpútať pozornosť, ale je v poriadku záchvat aj nechať tak a dať dieťaťu čas upokojiť sa.", evidence: ["Expect tantrums. They are normal at this age", "You can try distractions, but it's ok to ignore the tantrum.", "Give him some time to calm down and move on."], source: "cdc-18m" },
        { sk: "Dávaj mu jednoduché možnosti na výber.", evidence: ["Give simple choices."], source: "cdc-18m" }
      ],
      play: { sk: "Podporuj hru „na niečo“ – napríklad s bábikou a dečkou.", evidence: ["Encourage \"pretend\" play.", "such as a doll and a baby blanket"], source: "cdc-18m", activities_period: "15-18" },
      talk_to_doctor: { sk: "Ak dieťa zatiaľ nerobí jeden alebo viac z týchto krokov, stratilo zručnosť, ktorú už vedelo, alebo máš iné obavy, pokojne sa včas porozprávaj s detským lekárom a opýtaj sa na vývinový skríning.", evidence: ["If your child is not meeting one or more milestones, has lost skills he or she once had,", "or you have other concerns, act early.", "Talk with your child's doctor, share your concerns, and ask about developmental screening."], source: "cdc-18m" }
    },
    {
      id: "18-24",
      title: "1,5 až 2 roky",
      age_label: "18 až 24 mesiacov",
      verified: true,
      activities_period: "18-24",
      source_urls: ["https://www.cdc.gov/act-early/milestones/2-years.html"],
      development: [
        { sk: "Väčšina detí si do 2 rokov všimne, keď je niekto zranený alebo smutný, a v novej situácii sa pozrie na tvoju tvár, ako reagovať.", evidence: ["Notices when others are hurt or upset", "Looks at your face to see how to react in a new situation"], source: "cdc-2y" },
        { sk: "Spojí aspoň dve slová, napríklad „Ešte mlieko“, a na požiadanie ukáže aspoň dve časti tela.", evidence: ["Says at least two words together, like \"More milk.\"", "Points to at least two body parts when you ask him to show you"], source: "cdc-2y" },
        { sk: "Skúša vypínače, gombíky a tlačidlá na hračke a hrá sa s viacerými hračkami naraz.", evidence: ["Tries to use switches, knobs, or buttons on a toy", "Plays with more than one toy at the same time"], source: "cdc-2y" },
        { sk: "Kope do lopty, behá a je lyžičkou.", evidence: ["Kicks a ball", "Runs", "Eats with a spoon"], source: "cdc-2y" }
      ],
      everyday: [
        { sk: "Pripravte si pokojné, tiché uspávanie – pyžamo, umyť zúbky a jedna-dve knižky; pravidelné časy spánku všetko uľahčujú.", evidence: ["Create a calm, quiet bedtime for your child.", "Put on his pajamas, brush his teeth, and read 1 or 2 books to him.", "Consistent sleep times make it easier."], source: "cdc-2y" },
        { sk: "Nechaj ho pri každom jedle zjesť toľko, koľko samo chce – viac či menej.", evidence: ["Allow your child to eat as much or as little as she wants at each meal."], source: "cdc-2y" },
        { sk: "Či je dieťa pripravené na nočník, sa môžeš opýtať detského lekára.", evidence: ["Ask your child's doctor and/or teachers about toilet training to know if your child is ready to start."], source: "cdc-2y" }
      ],
      play: { sk: "Kopte, kotúľajte a hádžte si loptu.", evidence: ["Give your child balls to kick, roll, and throw."], source: "cdc-2y", activities_period: "18-24" },
      talk_to_doctor: { sk: "Svoje dieťa poznáš najlepšie – ak zatiaľ nerobí jeden alebo viac z týchto krokov, stratilo zručnosť, ktorú už vedelo, alebo máš iné obavy, pokojne sa včas porozprávaj s detským lekárom a opýtaj sa na vývinový skríning.", evidence: ["You know your child best.", "If your child is not meeting one or more milestones, has lost skills he or she once had,", "or you have other concerns, act early.", "Talk with your child's doctor, share your concerns, and ask about developmental screening."], source: "cdc-2y" }
    },
    {
      id: "24-30",
      title: "2 až 2,5 roka",
      age_label: "24 až 30 mesiacov",
      verified: true,
      activities_period: null,
      source_urls: ["https://www.cdc.gov/act-early/milestones/30-months.html"],
      development: [
        { sk: "Väčšina detí sa do 2,5 roka hrá vedľa iných detí a niekedy aj s nimi a rado ti ukazuje, čo už dokáže.", evidence: ["Plays next to other children and sometimes plays with them", "Shows you what she can do"], source: "cdc-30m" },
        { sk: "Povie približne 50 slov a spojí dve či viac slov s jedným slovesom, napríklad „Psík beží“.", evidence: ["Says about 50 words", "Says two or more words together, with one action word"], source: "cdc-30m" },
        { sk: "Používa veci na hru „na niečo“ – napríklad kŕmi bábiku kockou – a zvládne pokyn o dvoch krokoch, napríklad „Polož hračku a zavri dvere“.", evidence: ["Uses things to pretend, like feeding a block to a doll as if it were food", "Follows two-step instructions"], source: "cdc-30m" },
        { sk: "Rukami otáča kľučky či odskrutkuje viečka, odrazí sa zo zeme oboma nohami a niečo z oblečenia si vyzlečie samo.", evidence: ["Uses hands to twist things, like turning doorknobs or unscrewing lids", "Jumps off the ground with both feet", "Takes some clothes off by himself, like loose pants or an open jacket"], source: "cdc-30m" }
      ],
      everyday: [
        { sk: "Pokojné, tiché uspávanie a pravidelné časy spánku všetko uľahčujú.", evidence: ["Create a calm, quiet bedtime for your child.", "Consistent sleep times make it easier."], source: "cdc-30m" },
        { sk: "Keď sa dá, jedzte spolu ako rodina.", evidence: ["Eat family meals together as much as you can."], source: "cdc-30m" },
        { sk: "Čas pri obrazovke obmedz najviac na 1 hodinu denne detského programu, a to s dospelým pri dieťati.", evidence: ["Limit screen time (TV, tablets, phones, etc.) to no more than 1 hour per day of a children's program with an adult present."], source: "cdc-30m" }
      ],
      play: { sk: "Doprajte mu „voľnú hru“, pri ktorej sleduje svoje záujmy, skúša nové veci a používa ich po svojom.", evidence: ["Encourage \"free play,\"", "where your child can follow her interests, try new things, and use things in new ways."], source: "cdc-30m", activities_period: null },
      talk_to_doctor: { sk: "Svoje dieťa poznáš najlepšie – ak zatiaľ nerobí jeden alebo viac z týchto krokov, stratilo zručnosť, ktorú už vedelo, alebo máš iné obavy, pokojne sa včas porozprávaj s detským lekárom a opýtaj sa na vývinový skríning.", evidence: ["You know your child best.", "If your child is not meeting one or more milestones, has lost skills he or she once had", "or you have other concerns, act early.", "Talk with your child's doctor, share your concerns, and ask about developmental screening."], source: "cdc-30m" }
    },
    {
      id: "30-36",
      title: "2,5 až 3 roky",
      age_label: "30 až 36 mesiacov",
      verified: true,
      activities_period: null,
      source_urls: ["https://www.cdc.gov/act-early/milestones/3-years.html"],
      development: [
        { sk: "Väčšina detí si do 3 rokov všíma iné deti a pridá sa k ich hre; pri odovzdaní, napríklad v škôlke, sa do 10 minút po tvojom odchode upokojí.", evidence: ["Notices other children and joins them to play", "Calms down within 10 minutes after you leave her, like at a childcare drop off"], source: "cdc-3y" },
        { sk: "Rozpráva sa s tebou aspoň v dvoch výmenách, pýta sa „kto“, „čo“, „kde“ či „prečo“ a na otázku povie svoje krstné meno.", evidence: ["Talks with you in conversation using at least two back-and-forth exchanges", "Asks \"who,\" \"what,\" \"where,\" or \"why\" questions", "Says first name, when asked"], source: "cdc-3y" },
        { sk: "Väčšinou už hovorí tak, že mu rozumejú aj iní.", evidence: ["Talks well enough for others to understand, most of the time"], source: "cdc-3y" },
        { sk: "Nakreslí kruh, keď mu ukážeš ako, navlečie veľké korálky alebo cestoviny a používa vidličku.", evidence: ["Draws a circle, when you show him how", "Strings items together, like large beads or macaroni", "Uses a fork"], source: "cdc-3y" }
      ],
      everyday: [
        { sk: "Stanov pár jednoduchých a jasných pravidiel, napríklad „pri hre sme jemní“.", evidence: ["Set a few simple and clear rules that your child can follow, such as use gentle hands when playing."], source: "cdc-3y" },
        { sk: "Rozprávajte sa o jeho pocitoch a daj mu slová, ktorými ich vie opísať.", evidence: ["Talk about your child's emotions and give him words to help him explain how he's feeling."], source: "cdc-3y" },
        { sk: "Pripravuj ho na nové miesta a stretnutia s novými ľuďmi.", evidence: ["Help your child be ready for new places and meeting new people."], source: "cdc-3y" }
      ],
      play: { sk: "Hrajte sa vonku – choďte do parku alebo na prechádzku po chodníku v prírode.", evidence: ["Play outside with your child.", "Go to the park or a walking trail."], source: "cdc-3y", activities_period: null },
      talk_to_doctor: { sk: "Svoje dieťa poznáš najlepšie – ak zatiaľ nerobí jeden alebo viac z týchto krokov, stratilo zručnosť, ktorú už vedelo, alebo máš iné obavy, pokojne sa včas porozprávaj s detským lekárom a opýtaj sa na vývinový skríning.", evidence: ["You know your child best.", "If your child is not meeting one or more milestones, has lost skills he or she once had", "or you have other concerns, act early.", "Talk with your child's doctor, share your concerns, and ask about developmental screening."], source: "cdc-3y" }
    }
  ]
};

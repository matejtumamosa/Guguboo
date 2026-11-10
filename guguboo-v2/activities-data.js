/*
 * GUGUBOO V2 – Aktivity s dieťaťom (prepracované 10. 11. 2026, Samuel: „je toho málo, hrozné obrázky“).
 * Zdroj: CDC „Learn the Signs. Act Early.“ – časť „What You Can Do for Your …-old“ na stránkach míľnikov
 * (publikované 4. 9. 2025, aktualizované a skontrolované 16. 5. 2026; overené 10. 11. 2026).
 * Zhrnuté vlastnými slovami, pri každej aktivite začiatok pôvodného tipu (evidence). Len hry a činnosti s dieťaťom –
 * rady o jedle, obrazovkách, spánku či bezpečnosti domácnosti sem nepatria (sú inde v appke).
 * Obdobie appky → stránka CDC: 0–2 m → 2 mesiace, 2–4 → 4, 4–6 → 6, 6–9 → 9, 9–12 → 1 rok, 12–15 → 15, 15–18 → 18, 18–24 → 2 roky.
 */
(function defineGugubooActivitiesData() {
  "use strict";

  const source = "CDC – Learn the Signs. Act Early.";
  const reviewedAt = "2026-05-16";
  const checkedAt = "2026-11-10";
  const pages = {
    "0-2": "https://www.cdc.gov/act-early/milestones/2-months.html",
    "2-4": "https://www.cdc.gov/act-early/milestones/4-months.html",
    "4-6": "https://www.cdc.gov/act-early/milestones/6-months.html",
    "6-9": "https://www.cdc.gov/act-early/milestones/9-months.html",
    "9-12": "https://www.cdc.gov/act-early/milestones/1-year.html",
    "12-15": "https://www.cdc.gov/act-early/milestones/15-months.html",
    "15-18": "https://www.cdc.gov/act-early/milestones/18-months.html",
    "18-24": "https://www.cdc.gov/act-early/milestones/2-years.html"
  };
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
  // Oblasti (namiesto obrázkov ikona a farba).
  const domains = {
    pohyb: { label: "Pohyb", icon: "exercise" },
    rec: { label: "Reč", icon: "chat" },
    vztah: { label: "Blízkosť", icon: "family" },
    objavovanie: { label: "Objavovanie", icon: "sparkle" }
  };

  const make = (period, title, domain, steps, evidence, safety = "") => ({ period, title, domain, steps, evidence, safety, source, sourceUrl: pages[period], reviewedAt });

  const list = [
    // 0–2 mesiace (CDC 2 mesiace)
    make("0-2", "Rozhovor na striedačku", "rec", ["Keď bábätko vydá zvuk, usmej sa a odpovedz mu.", "Počkaj, či sa ozve znova – tak sa učí rozhovor."], "Respond positively to your baby. Act excited, smile, and talk to him when he makes sounds."),
    make("0-2", "Rozprávaj, čítaj, spievaj", "rec", ["Rozprávaj bábätku, čo práve robíš.", "Zaspievaj mu alebo prečítaj pár viet – pomáha to rozvoju reči."], "Talk, read, and sing to your baby to help her develop and understand language."),
    make("0-2", "Túlenie a nosenie", "vztah", ["Pritúľ si bábätko a nos ho v náručí.", "Nemusíš sa báť, že ho rozmaznáš – cíti sa tak v bezpečí."], "Spend time cuddling and holding your baby. … You will not spoil your baby by holding or responding to him."),
    make("0-2", "Čítaj signály bábätka", "vztah", ["Pozoruj, či sa chce „hrať“ – vydáva zvuky a pozerá na teba.", "Ak odvracia hlavu, zíva alebo je mrzuté, potrebuje pauzu."], "Learn to notice and respond to your baby's signals to know what she's feeling and needs."),
    make("0-2", "Na brušku s hračkou", "pohyb", ["Keď je bábätko hore, polož ho na bruško.", "Hračku daj pred neho do výšky očí – precvičuje dvíhanie hlavičky."], "Lay your baby on his tummy when he is awake and put toys at eye level in front of him.", "Nenechávaj ho samé. Keď je ospalé, polož ho na chrbát na bezpečné miesto na spanie (pevný matrac bez dečiek, vankúšov a hračiek)."),
    make("0-2", "Kde je hrkálka?", "objavovanie", ["Drž hrkálku bokom od hlavičky a zatras ňou.", "Sleduj, či bábätko hľadá, odkiaľ zvuk ide."], "Hold a rattle off to one side of your baby's head, shake it, and see if your baby looks for the noise."),
    make("0-2", "Pokoj, keď plače", "vztah", ["Hovor potichu, drž ho, hojdaj alebo spievaj.", "Tvoj pokoj mu pomáha upokojiť sa."], "Practice staying calm when your baby is upset by talking softly, holding, rocking, or singing to her."),
    make("0-2", "Hra pri bežných veciach", "rec", ["Pri kŕmení, obliekaní a kúpaní sa s bábätkom rozprávaj a hraj."], "Talk and play with your baby while feeding, dressing, and bathing."),
    make("0-2", "Opakuj jeho zvuky", "rec", ["Zopakuj zvuk, ktorý bábätko vydá.", "Skús, ako dlho si takto spolu „hovoríte“."], "Copy your baby's sounds and see how long your baby \"talks\" by making sounds back and forth with you."),
    make("0-2", "Zrkadielko", "objavovanie", ["Polož bezpečné detské zrkadielko blízko bábätka, nech sa vidí."], "Place a baby-safe mirror near your baby so she can look at herself."),
    make("0-2", "Farby a tváre", "objavovanie", ["Pozerajte spolu obrázky s výraznými farbami alebo tvárami.", "Rozprávaj, čo na nich je."], "Look at pictures with bright colors or faces with your baby and talk about them."),

    // 2–4 mesiace (CDC 4 mesiace)
    make("2-4", "Odpovedaj na zvuky", "rec", ["Keď bábätko vydá zvuk, potešene mu odpovedz a usmej sa.", "Striedajte sa ako v rozhovore."], "Respond positively to your baby. Act excited, smile, and talk to him when he makes sounds."),
    make("2-4", "Deka a hračky na dosah", "pohyb", ["Polož bábätko na deku a daj k nemu bezpečné hračky.", "Nech po nich siaha a kope."], "Provide safe opportunities for your baby to reach for toys, kick at toys and explore what is around her."),
    make("2-4", "Spoznávanie ústami", "objavovanie", ["Nechaj bábätko skúmať bezpečné veci aj ústami – tak sa učí."], "Allow your baby to put safe things in his mouth to explore them.", "Len veci, ktoré nie sú ostré, horúce ani také malé, že by sa nimi mohlo zadusiť."),
    make("2-4", "Rozprávaj a spievaj", "rec", ["Rozprávaj, čítaj a spievaj mu – neskôr mu to pomôže hovoriť a rozumieť."], "Talk, read, and sing to your baby. This will help her learn to speak and understand words later."),
    make("2-4", "Hračky do rúčok", "objavovanie", ["Daj mu hračky, ktoré sa dajú ľahko chytiť – hrkálku alebo látkovú knižku s farebnými obrázkami."], "Give your baby safe toys to play with that are easy to hold, like rattles or cloth books"),
    make("2-4", "Čas na pohyb", "pohyb", ["Počas dňa mu daj čas hýbať sa a byť s ľuďmi a vecami.", "Nenechávaj ho príliš dlho v hojdačke, kočíku či ležadle."], "Let your baby have time to move and interact with people and objects throughout the day."),
    make("2-4", "Sleduj hračku", "objavovanie", ["Polož bábätko na chrbát a ukáž mu farebnú hračku.", "Pomaly ňou pohybuj zľava doprava a hore-dole – sleduje ju?"], "Lay your baby on her back and show her a bright-colored toy. Move the toy slowly from left to right"),
    make("2-4", "Cvičenie s pesničkou", "pohyb", ["Spievaj a pritom jemne ohýbaj a pohybuj jeho rúčkami a nožičkami."], "Sing and talk to your baby as you help her \"exercise\" (move her body) for a few minutes."),
    make("2-4", "Hopkanie na kolenách", "pohyb", ["Pevne ho drž pod pazuchami, nožičky má na tvojich kolenách.", "Nechaj ho hopkať hore-dole."], "Play with your baby by holding him securely under his arms with his feet on your lap."),
    make("2-4", "Kuk-kuk", "vztah", ["Zakry si oči rukami, odkry ich a povedz „kuk-kuk“.", "Sleduj, či sa usmieva."], "Play games, such as peek-a-boo."),
    make("2-4", "Čo má rado", "vztah", ["Všímaj si, ako reaguje na rôzne veci – zistíš, čo má rado a čo nie."], "Pay close attention to how your baby reacts to different things."),
    make("2-4", "Opakuj jeho zvuky", "rec", ["Zopakuj jeho zvuky a skús, ako dlho si odpovedáte."], "Copy your baby's sounds and see how long your baby \"talks\" back and forth with you."),
    make("2-4", "Volaj ho menom", "rec", ["Oslovuj ho menom, napríklad „Šteklí to, Ema?“", "Svoje meno začne poznávať okolo 9. mesiaca."], "Call your baby by his name to help him learn it. He will start to recognize it around 9 months."),
    make("2-4", "Hra na zemi", "pohyb", ["Každý deň sa s ním hraj na zemi alebo na hracej deke."], "Playing on the floor or play mat with your baby every day helps him to move, learn, and explore."),
    make("2-4", "Tichá chvíľka", "rec", ["Dopraj si s ním pokojnú chvíľu – „čítaj“ mu alebo spievaj."], "Have quiet play times when you \"read\" or sing to your baby."),

    // 4–6 mesiacov (CDC 6 mesiacov)
    make("4-6", "Hra na striedačku", "vztah", ["Keď sa usmeje, usmej sa aj ty; keď vydá zvuk, zopakuj ho."], "Use \"back and forth\" play with your baby. When your baby smiles, you smile; when he makes sounds, you copy them."),
    make("4-6", "Každý deň obrázky", "rec", ["Pozerajte farebné obrázky v knižke a rozprávaj o nich.", "Keď džavoce, odpovedz: „Áno, to je psík!“"], "\"Read\" to your baby every day by looking at colorful pictures in magazines or books and talk about them."),
    make("4-6", "Pomenuj, čo vidíte", "rec", ["Na prechádzke mu ukazuj a pomenúvaj autá, stromy a zvieratá."], "Point out new things to your baby and name them. For example, when on a walk, point out cars, trees, and animals."),
    make("4-6", "Spev a hudba", "rec", ["Spievaj mu a púšťaj hudbu."], "Sing to your baby and play music. This will help his brain develop."),
    make("4-6", "Ukáž a povedz", "rec", ["Keď sa na niečo pozerá, ukáž na to a povedz, čo to je."], "When your baby looks at something, point to it and talk about it."),
    make("4-6", "Hračka kúsok ďalej", "pohyb", ["Polož ho na bruško alebo chrbát a hračku kúsok mimo dosahu.", "Povzbudzuj ho, nech sa k nej pretočí."], "Put your baby on her tummy or back and put toys just out of reach. Encourage her to roll over to reach the toys."),
    make("4-6", "Čítaj jeho náladu", "vztah", ["Keď je spokojné, pokračuj v tom, čo robíte.", "Keď je rozladené, dajte si pauzu a uteš ho."], "Learn to read your baby's moods. If he's happy, keep doing what you are doing."),
    make("4-6", "Upokojenie", "vztah", ["Hovor potichu, drž ho, hojdaj, spievaj.", "Pomôcť môže aj obľúbená hračka alebo cumlík."], "Help your baby learn she can calm down. Talk softly, hold, rock, or sing to her"),
    make("4-6", "Sedenie s oporou", "pohyb", ["Pridŕžaj ho v sede, nech sa rozhliada.", "Daj mu hračky – učí sa udržať rovnováhu."], "Hold your baby up while she sits. Let her look around and give her toys to look at while she learns to balance herself."),
    make("4-6", "Postavenie s oporou", "pohyb", ["Pevne ho drž oboma rukami pod pazuchami a nechaj ho stáť.", "Rozhliadnite sa a pomenuj, čo vidíte."], "Hold your baby with both of your hands securely under her arms and let her stand."),
    make("4-6", "Rôzne zvuky", "objavovanie", ["Šepkaj, tlieskaj alebo vydávaj zábavné zvuky.", "Sleduj, ktoré ho zaujímajú najviac."], "Introduce your baby to different sounds and voices. For example, whisper, clap, or make funny noises."),
    make("4-6", "Hra na zemi", "pohyb", ["Každý deň sa s ním hraj na zemi alebo na hracej deke."], "Playing on the floor or play mat with your baby every day helps him to move, learn, and explore."),
    make("4-6", "Spadla hračka", "objavovanie", ["Keď hodí hračku na zem, zdvihni ju a vráť mu ju.", "Učí sa, že čin má následok."], "When he drops a toy on the floor, pick it up and give it back. This game helps him learn cause and effect."),

    // 6–9 mesiacov (CDC 9 mesiacov)
    make("6-9", "Z „bababa“ slovo", "rec", ["Zopakuj jeho slabiky, napríklad „bababa“.", "Potom povedz jednoduché slovo s tým zvukom, napríklad „baba“."], "Repeat your baby's sounds and say simple words using those sounds."),
    make("6-9", "Hračka mimo dosahu", "pohyb", ["Polož hračky na zem kúsok od neho.", "Povzbudzuj ho, nech sa k nim doplazí, posunie alebo pretočí – a osláv, keď sa mu to podarí."], "Place toys on the ground or on a play mat a little out of reach and encourage your baby to crawl, scoot, or roll to get them."),
    make("6-9", "Pápá a nie", "rec", ["Pri odchode zamávaj a povedz „pápá“.", "Skúste aj jednoduché znaky rukami, kým nevie slová."], "Teach your baby to wave \"bye-bye\" or shake his head \"no.\""),
    make("6-9", "Kuk-kuk s handričkou", "vztah", ["Zakry si hlavu handričkou a sleduj, či ti ju stiahne."], "Play games, such as peek-a-boo. You can cover your head with a cloth and see if your baby pulls it off."),
    make("6-9", "Vysypať a pozbierať", "objavovanie", ["Vysypte kocky z nádoby a spolu ich dajte naspäť."], "Play with your baby by dumping blocks from a container and putting them back in together."),
    make("6-9", "Ja a ty", "vztah", ["Podávajte si hračku – raz ty, raz ono."], "Play games with your baby, such as my turn, your turn. Try this by passing a toy back and forth."),
    make("6-9", "Čítanie obrázkov", "rec", ["Pri knižke ukazuj na obrázky a pomenúvaj ich."], "\"Read\" to your baby. Reading can be talking about pictures."),
    make("6-9", "Veselé dovidenia", "vztah", ["Keď odchádzaš, rozlúč sa krátko a veselo, nevytrácaj sa potajomky.", "Po návrate povedz: „Mama je späť!“"], "Say a quick and cheerful goodbye instead of sneaking away so your baby knows you are leaving, even if he cries."),
    make("6-9", "Hádzanie ako hra", "objavovanie", ["Keď niečo hodí na zem, podaj mu to znova, nech to môže hodiť zas."], "Make it a game when your baby drops things. Hand the item back to her so she can drop it again."),
    make("6-9", "Opisuj, čo vidí", "rec", ["Opíš, na čo sa pozerá, napríklad „červená okrúhla lopta“."], "Describe what your baby is looking at; for example, \"red, round ball.\""),
    make("6-9", "Schovaj hračku", "objavovanie", ["Pred jeho očami schovaj hračku pod deku.", "Nech ju hľadá."], "Play a game that teaches your baby to look for things she sees you hide, such as a toy under a blanket."),
    make("6-9", "Pomenuj pocity", "vztah", ["Slovami, tvárou aj hlasom ukáž, čo podľa teba cíti: „Si smutný, skúsme ťa potešiť.“"], "Use your words, facial expressions, and voice to show what you think your baby is feeling (sad, mad, happy)."),
    make("6-9", "Postav sa pri opore", "pohyb", ["Daj ho blízko vecí, o ktoré sa môže bezpečne pritiahnuť do stoja."], "Put your baby close to things that she can pull up on safely."),

    // 9–12 mesiacov (CDC 1 rok)
    make("9-12", "Ukáž, ako na to", "vztah", ["Ukáž mu, čo má robiť – napríklad jemne pohladkať zvieratko.", "Keď to urobí, pochváľ ho alebo objím."], "Teach your baby \"wanted behaviors.\" Show her what to do and use positive words or give her hugs and kisses when she does it."),
    make("9-12", "Rozprávaj, čo robíš", "rec", ["Rozprávaj alebo spievaj o tom, čo práve robíš: „Mama ti umýva rúčky.“"], "Talk or sing to your baby about what you're doing."),
    make("9-12", "Dopovedz slovo", "rec", ["Keď povie „au“, povedz „Áno, auto“.", "Keď povie „auto“, pridaj: „Áno, veľké modré auto.“"], "Build on what your baby tries to say."),
    make("9-12", "Odpovedz na ukazovanie", "rec", ["Keď ukáže na pohár, povedz: „Chceš pohár? Tu je tvoj pohár.“"], "Respond with words when your baby points. Babies point to ask for things."),
    make("9-12", "Ukazuj zaujímavé veci", "objavovanie", ["Ukazuj mu, čo je okolo – auto, autobus, zvieratá."], "Point to interesting things you see, such as a truck, bus, or animals."),
    make("9-12", "Hrnce a pokrievky", "objavovanie", ["Daj mu hrnce a pokrievky alebo malý bubienok.", "Nech robí hluk."], "Give your baby pots and pans or a small musical instrument like a drum or cymbals. Encourage your baby to make noise."),
    make("9-12", "Knižka s klapkami", "rec", ["„Čítajte“ spolu – stačí rozprávať o obrázkoch.", "Bábätká v tomto veku majú rady knižky na ohmatanie a s klapkami."], "\"Read\" books with your baby. Reading can be talking about pictures."),
    make("9-12", "Kocky do rúk", "objavovanie", ["Hrajte sa spolu s kockami a hračkami, pri ktorých používa ruky."], "Play together with blocks and other toys that encourage your baby to use her hands."),
    make("9-12", "Pokojná náruč", "vztah", ["Keď je rozrušené, hovor potichu, drž ho, hojdaj alebo spievaj."], "Babies learn to calm themselves from caregivers who are calm and make them feel safe."),
    make("9-12", "Tlačenie krabice", "pohyb", ["Nechaj ho tlačiť prázdnu krabicu, stoličku alebo hračku na tlačenie – precvičuje chôdzu."], "Let your baby push things around, such as empty boxes, a \"kiddie chair,\" or \"push toys,\" so he can practice walking."),
    make("9-12", "Prvé kroky", "pohyb", ["Nech sa drží tvojich rúk alebo pevného nábytku."], "Encourage your baby to practice walking on her own. Baby walkers are not recommended.", "Chodítka sa neodporúčajú."),

    // 12–15 mesiacov (CDC 15 mesiacov)
    make("12-15", "Opakuj a pridaj", "rec", ["Keď povie „lo“, povedz „Lopta, áno, to je lopta.“"], "Help your child learn to speak. A child's early words are not complete. Repeat and add to what he says."),
    make("12-15", "Pomenuj a počkaj", "rec", ["Keď na niečo ukáže, pomenuj to a pár sekúnd počkaj, či sa ozve.", "Ak vydá zvuk, zopakuj slovo: „Áno! Hrnček.“"], "Tell your child the names of objects when he points to them and wait a few seconds to see if he makes any sounds"),
    make("12-15", "Malý pomocník", "vztah", ["Nech ti pomáha – prinesie topánky, dá desiatu do tašky, ponožky do koša."], "Find ways to let your child help with everyday activities."),
    make("12-15", "Čo sa robí s čiapkou?", "objavovanie", ["Ukáž čiapku: „Čo sa robí s čiapkou? Dáva sa na hlavu.“", "Daj mu ju a sleduj, či ťa napodobní. Skúste aj knižku či hrnček."], "Show your child different things, such as a hat. Ask him, \"What do you do with a hat?"),
    make("12-15", "Pesnička s pohybmi", "pohyb", ["Spievajte pesničku s pohybmi a sleduj, či skúša pohyby s tebou."], "Sing songs with gestures, such as \"Wheels on the Bus.\" See if your child tries to do some of the actions."),
    make("12-15", "Pomenuj pocity", "vztah", ["Povedz, čo podľa teba cíti: smútok, hnev, radosť."], "Say what you think your child is feeling (for example, sad, mad, frustrated, happy)."),
    make("12-15", "Postav a zbúraj", "objavovanie", ["Postav vežu z kociek a nech ju zbúra."], "Encourage your child to play with blocks. You can stack the blocks and she can knock them down."),
    make("12-15", "Rodinná knižka", "rec", ["Urob knižku s fotkami ľudí a zvieratiek z jeho života – aj s ním.", "Pri prezeraní ich pomenúvaj."], "Make a \"book\" with pictures of people and pets in your child's life."),
    make("12-15", "Tanec", "pohyb", ["Pusti detské pesničky alebo tie, ktoré máte radi, a zatancujte si."], "Sing or play children's songs and songs your family enjoys. Dance with your child."),
    make("12-15", "Nová knižka po obľúbenej", "rec", ["Po obľúbenej knižke skúste novú."], "Read a new book after a favorite one to explore and try new books."),
    make("12-15", "Schovávačka", "vztah", ["Nech vidí, ako sa schováš za stoličku, a počkaj, kým ťa „nájde“."], "Play simple games, such as hide and seek."),
    make("12-15", "Pesnička na upratovanie", "vztah", ["Vymyslite krátku pesničku a pri nej dávajte hračky do koša."], "Make up a simple \"cleanup song\" and sing it while you teach your child to help \"clean up.\""),
    make("12-15", "Gestá", "rec", ["Nauč ho jednoduché gestá, napríklad ukazovanie a mávanie, nech ti vie ukázať, čo chce."], "You can teach simple gestures and sign language (for example, pointing and waving)"),
    make("12-15", "Rozhovor s plyšákom", "rec", ["„Rozprávaj“ sa s ním cez plyšáka.", "Sleduj, či ti odpovie on alebo iný plyšák."], "\"Pretend talk\" to your child with a stuffed animal."),
    make("12-15", "Bublinky", "objavovanie", ["Fúkaj bublinky a nech ich praská.", "Pritom hovor „puk, puk“."], "Blow bubbles and let your child pop them. Say things as she pops them, such as \"Pop, pop.\""),

    // 15–18 mesiacov (CDC 18 mesiacov)
    make("15-18", "Pochváľ, čo sa podarilo", "vztah", ["Všímaj si, čo robí dobre: „Pekne si upratal hračku.“"], "Use positive words and give more attention to behaviors you want to see (\"wanted behaviors\")."),
    make("15-18", "Kŕmenie plyšáka", "objavovanie", ["Daj mu lyžičku, nech „kŕmi“ plyšáka.", "Striedajte sa v hre."], "Encourage \"pretend\" play. Give your child a spoon so she can pretend to feed her stuffed animal. Take turns pretending."),
    make("15-18", "Ako sa cítia iní", "vztah", ["Keď vidí smutné dieťa, povedz: „Vyzerá smutne. Prinesieme mu macka?“"], "Help your child learn about others' feelings and about positive ways to react."),
    make("15-18", "Čo je to?", "rec", ["Pýtaj sa jednoduché otázky o tom, čo je okolo: „Čo je to?“"], "Ask simple questions to help your child think about what's around her."),
    make("15-18", "Dve možnosti", "vztah", ["Daj mu vybrať z dvoch vecí: „Červené alebo modré tričko?“"], "Give simple choices. Let your child choose between two things."),
    make("15-18", "Na úrovni očí", "rec", ["Keď sa rozprávate, zohni sa k nemu, nech ti vidí do tváre."], "Talk with your child by facing her and getting down to her eye level when possible."),
    make("15-18", "Časti tela", "rec", ["Ukazuj a pomenúvaj: „Tu je tvoj nos, tu je môj nos.“"], "Start to teach your child the names for body parts by pointing them out"),
    make("15-18", "Pridaj slovo", "rec", ["Keď povie „hav“, dopovedz: „Áno, to je psík. Psík robí hav-hav.“"], "Teach your child more words by adding to the words she says."),
    make("15-18", "Lopta, autíčko, nádoba", "pohyb", ["Kotúľajte si loptu, tlačte autíčka a dávajte kocky do nádoby a von."], "Play with your child by rolling balls back and forth, pushing toy cars, and putting blocks or other items in and out of containers."),
    make("15-18", "Knižka jednoduchými slovami", "rec", ["Čítajte a rozprávajte o obrázkoch jednoduchými slovami."], "Read books and talk about the pictures using simple words."),
    make("15-18", "Bublinky na striedačku", "vztah", ["Ty fúkaš, ono praská – „puk, puk“."], "Play simple games where both of you have a part to play. Blow bubbles and let your child pop them."),
    make("15-18", "Kútik na upokojenie", "vztah", ["Pripravte doma miesto, kam môže ísť, keď je rozrušené.", "Buď nablízku, nech vie, že je v bezpečí."], "Create a spot in your home for your child to go to when he's upset."),
    make("15-18", "Tlačiť a ťahať", "pohyb", ["Daj mu hračky, ktoré môže bezpečne tlačiť alebo ťahať."], "Give toys that your child can push or pull safely."),
    make("15-18", "Bábika a dečka", "objavovanie", ["Daj mu bábiku a dečku – podporíš hru „na niečo“."], "Give toys and things to your child that encourage \"pretend\" play, such as a doll and a baby blanket."),

    // 18–24 mesiacov (CDC 2 roky)
    make("18-24", "Ako znie slovo", "rec", ["Keď povie „ešte nana“, zopakuj celou vetou: „Chceš ešte banán.“"], "Help your child learn how words sound, even if he can't say them clearly yet."),
    make("18-24", "Hra s kamarátom", "vztah", ["Pri hre s inými deťmi buď nablízku.", "Ukáž, ako sa podeliť, striedať a povedať, čo chce."], "Watch your child closely during playdates."),
    make("18-24", "Pomoc pri stolovaní", "vztah", ["Nech nosí na stôl plastové poháre či obrúsky – a poďakuj mu."], "Have your child help you get ready for mealtime, by letting him carry things to the table"),
    make("18-24", "Lopta", "pohyb", ["Kopte, kotúľajte a hádžte si loptu."], "Give your child balls to kick, roll, and throw."),
    make("18-24", "Ako to funguje?", "objavovanie", ["Hračky, kde po stlačení tlačidla niečo nastane, ho učia riešiť problémy."], "Give toys that teach your child how to make things work and how to solve problems."),
    make("18-24", "Prezliekanie", "objavovanie", ["Nechaj ho obliecť si tvoje topánky, klobúky a košele – začína hru „na niečo“."], "Let your child play dress up with grown-up clothes, such as shoes, hats, and shirts."),
    make("18-24", "Šikovný pomocník", "vztah", ["Nech pomáha s jednoduchými prácami – hračky alebo bielizeň do koša.", "Pochváľ ho."], "Use positive words when your child is being a good helper."),
    make("18-24", "Pripraviť, pozor, štart!", "pohyb", ["Na hojdačke povedz „Pripraviť, pozor…“, chvíľu počkaj a pri „štart!“ ho rozhojdaj."], "Play with your child outside, by playing \"ready, set, go.\""),
    make("18-24", "Maľovanie", "objavovanie", ["Daj mu pastelky alebo prstové farby.", "Hotové dielko zaveste na chladničku."], "Let your child create simple art projects with you."),
    make("18-24", "Piesok a voda", "objavovanie", ["Vo vani alebo pieskovisku mu daj nádobky, lyžice či lievik."], "Let your child play with sand toys or plastic containers, spoons, or a funnel in the tub or in a sandbox."),
    make("18-24", "Puzzle", "objavovanie", ["Skladajte jednoduché puzzle s tvarmi, farbami alebo zvieratkami.", "Pomenuj každý kúsok, keď ho dá na miesto."], "Help your child do simple puzzles with shapes, colors, or animals."),
    make("18-24", "Objavovanie vonku", "objavovanie", ["Choďte do parku, na prechádzku alebo sa povozte autobusom."], "Encourage your child's curiosity and help her learn and explore new things."),
    make("18-24", "Hlava, ramená, kolená, palce", "rec", ["Spievajte a ukazujte časti tela.", "Po pár kolách sa dotkni časti tela, počkaj a sleduj, či dospieva slovo."], "Sing songs, such as \"Head, Shoulders, Knees, and Toes,\" to teach names of body parts."),
    make("18-24", "Veže na striedačku", "pohyb", ["Striedajte sa pri stavaní veže z kociek a jej zbúraní."], "Encourage your child to play with blocks. Take turns building towers and knocking them down."),
    make("18-24", "Otvor šuplík", "pohyb", ["Nech ti pomôže otvoriť šuplík pri odkladaní oblečenia alebo dvere, keď idete von."], "Ask your child to help you open the drawer when you put away clothes or open the door when you go outside.")
  ];

  // Dva nápady z NHS „Baby and toddler play ideas“ (stránka z 27. 8. 2024, overené 10. 11. 2026).
  const nhs = { source: "NHS – Baby and toddler play ideas", sourceUrl: "https://www.nhs.uk/baby/babys-development/play-and-learning/baby-and-toddler-play-ideas/", reviewedAt: "2024-08-27" };
  list.push(
    { ...make("9-12", "Hra s vodou", "objavovanie", ["Vo vani, v lavóri alebo pri umývadle sa hrajte s vodou.", "Prelievajte ju plastovými fľaškami, hubkou, sitkom, lievikom či lyžicami – čímkoľvek, čo sa nerozbije."], "Babies, toddlers and young children love playing with water … Use plastic bottles for pouring and squirting each other", "Nikdy nenechávaj malé dieťa samé vo vani ani pri hre s vodou – utopiť sa môže aj v menej ako 5 cm vody."), ...nhs },
    { ...make("18-24", "Ponožkové bábky", "rec", ["Z ponožky urob bábku – nakresli tvár alebo niečo prilep.", "Nech sa bábky „rozprávajú“ medzi sebou alebo s vami."], "Use socks and envelopes to make hand puppets. … Get the puppets to \"talk\" to each other, or to you and your child."), ...nhs }
  );

  const activities = list.map((item, index) => ({ id: "c" + String(index + 1).padStart(3, "0"), ...item }));

  // Pozorovania pre rodiča – pôvodný text z verzie 1 tohto súboru (bez zmeny; zdroj CDC míľniky, kontrola 9. 9. 2026).
  const observationText = {
    "0-2": ["Môže na chvíľu sledovať tvár.","Môže reagovať na hlas alebo hlasný zvuk.","Môže pri polohe na brušku skúšať zdvihnúť hlavu.","Môže sa upokojiť pri hlase alebo dotyku blízkej osoby."],
    "2-4": ["Môže sa usmievať, keď sa mu prihováraš.","Môže vydávať zvuky iné než plač.","Môže držať hlavu stabilnejšie pri držaní.","Môže sledovať pohybujúcu sa osobu alebo predmet."],
    "4-6": ["Môže sa smiať alebo striedať zvuky s tebou.","Môže siahať po hračke, ktorú chce.","Môže sa pretáčať z bruška na chrbát.","Môže spoznávať známych ľudí."],
    "6-9": ["Môže vydávať opakované slabiky.","Môže sa dostať do sedu vlastným spôsobom.","Môže búchať dvoma predmetmi o seba.","Môže reagovať na odchod blízkej osoby."],
    "9-12": ["Môže zamávať alebo používať iné gesto.","Môže vložiť predmet do nádoby.","Môže sa vytiahnuť do stoja s oporou.","Môže sa zapájať do jednoduchej hry s tebou."],
    "12-15": ["Môže skúšať jedno či dve ďalšie slová.","Môže ukázať na vec, o ktorú žiada.","Môže urobiť niekoľko krokov sám.","Môže napodobniť jednoduché použitie predmetu."],
    "15-18": ["Môže skúšať viac slov okrem pomenovania rodiča.","Môže chodiť bez držania.","Môže napodobňovať jednoduchú domácu činnosť.","Môže sa vzdialiť a kontrolovať, či si nablízku."],
    "18-24": ["Môže spájať dve slová.","Môže behať alebo skúšať kopať do lopty.","Môže sa hrať s viac než jedným predmetom naraz.","Môže sledovať tvoju tvár v novej situácii."]
  };
  const observations = Object.fromEntries(Object.entries(observationText).map(([period, texts]) => [period, texts.map((text, index) => ({
    id: "o-" + period + "-" + (index + 1), text, source, sourceUrl: "https://www.cdc.gov/act-early/milestones/index.html", reviewedAt: "2026-09-09"
  }))]));

  window.GugubooActivitiesData = Object.freeze({ version: 2, reviewedAt, checkedAt, source, periods, domains, activities, observations });
})();

# Môj priestor – bezpečnostný model V1

Môj priestor je v tejto statickej verzii dostupný iba v popôrodnej fáze aplikácie. Používa samostatné, verziované úložisko `guguboo-private-space-v1`; jeho obsah nie je súčasťou spoločného objektu `state` ani hlavného `storeKey`.

## Ochrana dát

- Celý payload zápisov vrátane textu, nálady, typu a časových údajov sa ukladá ako AES-GCM ciphertext.
- Kľúč sa odvodzuje z presne štvormiestneho PIN-u pomocou PBKDF2/SHA-256, náhodného 128-bitového saltu a centrálne nastavenej hodnoty 310 000 iterácií.
- Každé uloženie používa nový náhodný 96-bitový IV. PIN ani odvodený kľúč sa neukladajú.
- Dešifrovaný payload a kľúč existujú iba počas odomknutej relácie. Uzamknutie nahradí obsah obrazovky a zahodí referencie na obe hodnoty.
- Relácia sa uzamkne po dvoch minútach neaktivity, pri `visibilitychange` do stavu `hidden`, pri `pagehide` a pri odchode zo sekcie.
- Po neúspešných pokusoch sa v rámci relácie používa postupne rastúce oneskorenie. Stav oneskorenia neobsahuje súkromný obsah ani PIN.
- Reset odstráni iba súkromné úložisko a jeho autentifikačný stav.

## Limity statickej webovej aplikácie

Štvormiestny PIN má nízku entropiu. PBKDF2 spomaľuje skúšanie PIN-ov, ale nedáva rovnakú ochranu ako silné heslo, používateľský účet, hardvérové úložisko kľúčov alebo zabezpečenie operačného systému. Osoba s prístupom k profilu prehliadača môže ciphertext kopírovať a skúšať PIN offline. Dáta sa nestratia pri bežnom obnovení stránky, môžu sa však stratiť po vymazaní dát webu, v súkromnom režime alebo pri poškodení úložiska. Lokálna V1 tiež nevie bezpečne rozlíšiť viacerých ľudí používajúcich rovnaký profil prehliadača.

## Budúce rozšírenie

Rozhranie je oddelené od objektu úložiska a kryptografických funkcií, aby sa dalo zachovať pri výmene lokálneho adaptéru za účet a serverové úložisko. Pred takou zmenou treba rozhodnúť o identite vlastníka priestoru, obnove účtu a kľúčov, synchronizácii medzi zariadeniami, serverovom threat modeli a o tom, či biometria iba odomkne lokálne uložený kľúč alebo bude súčasťou platformovej autentifikácie (napríklad WebAuthn/passkey).

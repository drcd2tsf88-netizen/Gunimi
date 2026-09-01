# Gunimi — AI-First Workspace Operating System

**Verzia 2.0 — August 2026 — Dôverné**

---

## Zhrnutie

Gunimi je AI-natívny pracovný operačný systém pre moderné podniky. Nahrádza fragmentovaný stack CRM nástrojov, aplikácií pre správu projektov, emailových klientov, kalendárnych aplikácií a nástrojov na tvorbu poznámok — jedným inteligentným pracovným priestorom, ktorý rozumie celému kontextu podnikania: ľuďom, vzťahom, obchodom, úlohám, komunikácii, signálom a stretnutiam.

Gunimi nie je CRM. Nie je klónom Notionu. Je to živý pracovný priestor, ktorý sa učí, pozoruje a automaticky zobrazuje inteligenciu — aby sa tímy mohli sústrediť na vzťahy a výkon, nie na zadávanie dát.

**Aktuálny stav:** Open Beta. Aktívne používaný v produkcii. Kompletná sada funkcií je funkčná.

---

## Problém

Moderné obchodné tímy pracujú súčasne s 5–10 nespojenými nástrojmi:

- **CRM** (HubSpot, Pipedrive) — kontakty a obchody, ale bez skutočnej inteligencie
- **Správa projektov** (Linear, Asana, Monday) — úlohy a výkon, izolované od vzťahov
- **Poznámky** (Notion, Obsidian) — znalosti, odpojené od kontextu
- **Email** (Gmail, Outlook) — komunikácia, neviditeľná pre zvyšok stacku
- **Kalendár** (Google Calendar) — stretnutia bez CRM kontextu
- **Analytika** (dashboardy) — reaktívna, nie proaktívna

Výsledok: kontext sa stráca pri každom odovzdaní. Obchody stagnujú potichu. Vzťahy sa rozpadajú bez povšimnutia. Tímy trávia viac času správou nástrojov než správou práce.

---

## Riešenie

Gunimi zjednocuje celý obchodný kontext do jedného pracovného priestoru:

```
Spoločnosti → Kontakty → Obchody → Úlohy → Poznámky → Email → Kalendár → Inteligencia
```

Každá entita sa prepája s každou inou. Každá interakcia generuje signál. Každý signál napája inteligentnú vrstvu. Pracovný priestor sa časom učí a zobrazuje to, na čom záleží — bez nutnosti pýtať sa.

### Základné princípy

- **Kontext na prvom mieste** — každá informácia je prepojená s ľuďmi, spoločnosťami a obchodmi
- **Inteligencia predvolene** — systém pozoruje a zobrazuje, užívateľ nekonfiguruje
- **AI natívne** — nie AI pridané na vrch, ale AI vpletená do každej vrstvy
- **Minimálny povrch** — prémiové, podnikové UI bez vizuálneho chaosu
- **Pracovný priestor, nie aplikácia** — živé prostredie, nie statický nástroj

---

## Základné moduly

### 1. Kontakty (Správa vzťahov)

Kompletná správa životného cyklu kontaktov postavená na `workspace_people` — základnom grafe ľudí Gunimi.

**Funkcie:**
- Kompletné profily kontaktov (meno, email, telefón, pozícia, spoločnosť, status, poznámky)
- Označenie priority s vizuálnymi indikátormi
- Životný cyklus statusu: Potenciálny zákazník → Aktívny → Získaný
- Systém tagov s farebnými štítkami a AI-generovanou inteligenciou tagov
- Hromadné operácie: viacnásobný výber, hromadné taggovanie, hromadné mazanie, zlúčenie duplikátov
- Import CSV
- **Skóre zdravia vzťahu** — automatické skóre 0–100 na kontakt na základe:
  - Aktuality a frekvencie emailov (posledných 30 dní)
  - Aktívnych obchodov
  - Otvorených úloh
  - Úrovne: Zdravý (≥60) / Sledovaný (30–59) / Ohrozený (10–29) / Studený (0–9)
- **Nadchádzajúce stretnutia** — najbližšie udalosti z Google Kalendára s týmto kontaktom zobrazené na stránke detailu kontaktu (zhoda podľa emailu)

### 2. Spoločnosti

Správa spoločností s úplným grafom vzťahov:
- Profily spoločností (názov, odvetvie, webstránka, veľkosť, popis)
- Prepojené kontakty, obchody, úlohy, poznámky, objednávky
- Integrácia signálov — sledovanie aktivít na úrovni spoločnosti
- Podpora tagov a AI inteligencia

### 3. Obchody (Správa pipeline)

Obchodná pipeline so štruktúrovaným životným cyklom:
- Názov obchodu, hodnota (EUR), fáza, priorita, prepojený kontakt a spoločnosť
- Zobrazenia Kanban + zoznam
- Sledovanie fáz: Potenciálny → Kvalifikovaný → Návrh → Vyjednávanie → Získaný / Stratený
- Generovanie signálov pri vytvorení obchodu, zmene fázy, detekcii stagnácie
- Kompletná história objednávok na obchod

### 4. Úlohy (Vrstva výkonu)

Správa úloh v celom pracovnom priestore:
- Úrovne priority: Vysoká / Stredná / Nízka
- Status: K vykonaniu / V priebehu / Hotové
- Dátumy splatnosti s detekciou omeškania
- Prepojenie s kontaktmi, spoločnosťami, obchodmi
- Podpora priradeného zodpovedného pre členov tímu
- Generovanie signálov pre oneskorené úlohy a udalosti dokončenia
- Rýchle vytvorenie ⌘K odkiaľkoľvek v pracovnom priestore

### 5. Poznámky (Znalostná vrstva)

Štruktúrované zachytávanie znalostí s podporou formátovaného textu:
- Editor formátovaného textu Tiptap
- Systém zmienok `#tag` a `@člen` s kartami pri prejdení myšou
- Prepojenie s kontaktmi, spoločnosťami, obchodmi
- Celoplošný feed poznámok pracovného priestoru
- Rýchle vytvorenie ⌘K

### 6. Email (Komunikačná vrstva — V2)

Natívna Gmail integrácia — kompletné čítanie aj písanie:
- Spojenie cez OAuth 2.0 (Gmail API — rozsahy: `gmail.readonly`, `gmail.send`, `userinfo.email`)
- Automatická synchronizácia vlákien a prepojenie s CRM (vlákna priraďované ku kontaktom/spoločnostiam podľa emailovej adresy)
- **Email Command Center** — zjednotená schránka s:
  - Widgetom neprečítaných priorít
  - Detekciou potreby nadväzujúcej komunikácie (prečítané vlákno, prepojený kontakt, žiadna odpoveď 3+ dní)
  - Posledné vlákna s prepojenými kontaktmi a spoločnosťami
  - Widgetom emailovej inteligencie (miera pokrytia CRM, miera neprečítaných, top kontakty/spoločnosti)
- **Tvorba a odpovede:**
  - Odpoveď na vlákno priamo z Gunimi
  - Tvorba nového emailu pre akéhokoľvek príjemcu
  - Návrh pomocou AI — GPT-4o-mini generuje telo správy z kontextu vzťahu (história kontaktu, otvorené obchody, otvorené úlohy, dátum posledného kontaktu)
  - Automatický signál `email_sent` pri každom odoslaní
  - Tok pre rozšírenie rozsahu s jantárovým bannerom opätovného pripojenia pre existujúcich užívateľov

### 7. Kalendár (Vrstva inteligencie stretnutí — V2)

Integrácia Google Kalendára s plnou CRM inteligenciou:
- Spojenie cez OAuth 2.0 (Google Calendar API)
- Kompletná synchronizácia udalostí (čítanie + písanie + aktualizácia + mazanie)
- **Calendar Command Center:**
  - Zobrazenie Mesiac / Týždeň / Zoznam s jednotným prekrytím úloh, obchodov a udalostí kalendára
  - Udalosti Google Kalendára v modrej; úlohy vo fialovej; obchody v smaragdovej
  - Rýchle pridanie úlohy priamo do bunky ľubovoľného dňa
  - Vytvorenie novej udalosti z pracovného priestoru (názov, dátum, čas začiatku/konca)
  - Úprava / mazanie synchronizovaných udalostí Google Kalendára z Gunimi
  - Widget Meeting Intelligence — najrušnejší deň v týždni, celkové hodiny stretnutí, odpočítavanie do ďalšieho stretnutia, hodnotenie záťaže
  - Pás štatistík: nadchádzajúce stretnutia, počet tento týždeň, pripojené kalendáre, obchodné stretnutia (prepojené s CRM)
- **Panel detailu udalosti (V2 inteligencia):**
  - Prepojenie s CRM kontaktom — stretnutia sa automaticky priradí ku kontaktom podľa emailu organizátora
  - **AI príprava stretnutia** — jedným kliknutím vygenerovaný GPT-4o-mini brief: súhrn kontextu vzťahu, 3 navrhované témy diskusie, 2–3 kľúčové body vychádzajúce z otvorených obchodov, otvorených úloh a dátumu posledného kontaktu
  - **Označiť ako absolvované** — tlačidlo jedným kliknutím vytvorí signál `meeting_held` pre prepojený kontakt; tlačidlo sa po zaznamenaní zmení na smaragdové
  - Vytvorenie poznámky zo stretnutia — automaticky generuje poznámku predvyplnenú názvom udalosti a popisom
  - Rýchle prepojenie na záznamy kontaktu a spoločnosti
  - Úprava názvu a časov udalosti v paneli; zmeny sa odošlú do Google Kalendára
- **Integrácia s detailom kontaktu:** Karta nadchádzajúcich stretnutí na záložke Prehľad kontaktu zobrazuje najbližšie naplánované stretnutia s daným kontaktom

### 8. Objednávky

Správa obchodných objednávok prepojená s kontaktmi, obchodmi, spoločnosťami:
- Názov objednávky, hodnota, mena (predvolene EUR), status
- Stavový stroj: Návrh → Potvrdená → Odoslaná → Doručená / Zrušená / Vrátená
- Generovanie signálov pri vytvorení, potvrdení, splnení objednávky
- Rýchle vytvorenie ⌘K, konverzia Email → Objednávka
- Kompletná história objednávok na kontakt, obchod a spoločnosť

### 9. Tagy

Systém tagov naprieč entitami s AI inteligenciou:
- Farebne kódované štítky (8 farebných variantov)
- Aplikovateľné na kontakty, spoločnosti, obchody, úlohy, poznámky
- Stránka detailu tagu: všetky otagované entity na jednom mieste
- **AI inteligencia tagov** — GPT-4o-mini analyzuje všetky entity pod tagom a generuje 2–3 vety obchodného pohľadu o klastri tagov
- TagHoverCard pre náhľad pri prejdení myšou
- Systém zmienok: `#názovtagu` v komentároch a poznámkach

---

## Inteligentná vrstva

### Signal Engine

Signal Engine je základná inteligentná infraštruktúra Gunimi — vrstva spracovania udalostí v reálnom čase, ktorá sleduje všetky aktivity pracovného priestoru a generuje akcionovateľné signály.

**Architektúra:**
- 25+ typov signálov naprieč všetkými doménami entít
- Životný cyklus signálu: `aktívny → vyriešený → vypršaný`
- Logika deduplikácie a potlačenia
- Identita signálu: `signalId`, `workspaceId`, `origin`, `correlationId`, `parentSignalId`
- Evolúcia signálu (signál môže meniť stav pri zachovaní identity)
- Vysvetliteľnosť: každý signál odpovedá na 7 otázok (čo, kto, kedy, prečo, čo sa zmenilo, čo robiť, čo ak ignorujeme)

**Kategórie signálov:**
- Vzťahové signály: kontakt vychladol, potrebná nadväzujúca komunikácia, obchod stagnuje
- Výkonové signály: úloha oneskorená, obchod bez úloh, žiadna nedávna aktivita
- Komunikačné signály: email odoslaný, email prijatý, žiadna odpoveď po N dňoch
- Signály stretnutí: stretnutie sa konalo (zo „Označiť ako absolvované"), nadchádzajúce stretnutie
- Obchodné signály: objednávka potvrdená, objednávka odoslaná, obchod získaný/stratený
- Signály pracovného priestoru: nový člen, importovaný nový kontakt

**Skenovací engine:**
- Vercel Cron: spúšťa sa každých 6 hodín (`0 */6 * * *`)
- Skenuje všetky aktívne pracovné priestory
- Ukladá `lastRunAt` v preferenciách pracovného priestoru
- Endpoint `/api/signals/health` pre monitorovanie
- Plná pozorovateľnosť: všetky skenery hlásia skutočné počty

### Skóre zdravia vzťahu

Automatické skóre zdravia 0–100 na kontakt. Vypočítané zo 4 zdrojov signálov:

| Signál | Max bodov | Logika |
|---|---|---|
| Aktualita emailu | 40 | ≤7d=40, ≤14d=32, ≤30d=22, ≤60d=12, ≤90d=5 |
| Frekvencia emailov (30d) | 25 | 5+=25, 3+=18, 1+=10 |
| Celkové obchody | 20 | 2+=20, 1=14 |
| Otvorené úlohy | 15 | 2+=15, 1=10 |

Zobrazené ako farebná bodka + skóre v zozname CRM kontaktov. Dávkovo vypočítané — 3 paralelné DB dopyty pre všetky kontakty, agregované v TypeScripte.

**Úrovne zdravia:**
- 🟢 Zdravý (≥60): smaragdová — vzťah je aktívny
- 🟡 Sledovaný (30–59): jantárová — čoskoro je potrebná pozornosť
- 🔴 Ohrozený (10–29): červená — vzťah sa zhoršuje
- ⚫ Studený (0–9): zinková — kontakt odmlčal

### AI príprava stretnutia

Brief prípravy AI na stretnutie aktivovaný z panelu detailu udalosti Kalendára:
- Meno kontaktu, pozícia, dátum posledného kontaktu
- Otvorené obchody (názov + fáza)
- Otvorené úlohy
- GPT-4o-mini generuje: súhrn kontextu, 3 navrhované témy, 2–3 kľúčové body
- Na vyžiadanie (spustené užívateľom), nie predpočítané
- Výstup nezávislý od jazyka

### AI inteligencia tagov

Analýza AI na tag pomocou GPT-4o-mini:
- Analyzuje všetky entity pod tagom
- Detekuje vzory: odvetvové klastre, koncentráciu fázy obchodu, stagnujúce pipeline
- Dostupné v jazyku pracovného priestoru (EN/SK/CS)

### AI návrh emailu

Generovanie tela emailu pomocou AI na vlákno / na tvorbu:
- Získava kontext vzťahu: meno kontaktu, pozícia, posledný kontakt, otvorené úlohy, aktívne obchody
- GPT-4o-mini generuje stručné, profesionálne telo emailu
- Píše v jazyku pracovného priestoru (EN/SK/CS)
- Bez zástupných závoreniek — používa skutočné dáta

---

## Technická architektúra

### Stack

| Vrstva | Technológia |
|---|---|
| Frontend | Next.js 15 (App Router, Server Components) |
| Jazyk | TypeScript (strict) |
| Štýlovanie | TailwindCSS v4 |
| Backend | Supabase (PostgreSQL + Row Level Security) |
| Autentifikácia | Supabase Auth (email/heslo, magic link) |
| AI | OpenAI GPT-4o-mini (cez openai SDK) |
| Email | Gmail API (OAuth 2.0), Postmark (transakčné) |
| Kalendár | Google Calendar API (OAuth 2.0) |
| Sledovanie chýb | Sentry |
| Nasadenie | Vercel (Edge + Serverless) |
| Internacionalizácia | next-intl (EN / SK / CS) |
| Cron | Vercel Cron Jobs |

### Dátová vrstva

```
workspace (pracovný priestor)
├── workspace_people        (kontakty — základný graf ľudí)
├── workspace_contacts      (SQL VIEW — spätná kompatibilita)
├── workspace_companies     (spoločnosti)
├── workspace_deals         (obchodná pipeline)
├── workspace_tasks         (vrstva výkonu)
├── workspace_notes         (znalosti)
├── workspace_orders        (obchodné objednávky)
├── workspace_tags          (medzientitné štítky)
├── workspace_teams         (organizačná štruktúra)
├── workspace_members       (členstvo používateľ ↔ pracovný priestor)
├── email_connections       (Gmail OAuth tokeny + rozsahy)
├── email_threads           (synchronizované emailové vlákna)
├── email_messages          (jednotlivé správy)
├── calendar_connections    (Google Calendar OAuth tokeny)
├── calendar_events         (synchronizované udalosti kalendára)
├── signals                 (inteligenčné udalosti)
├── comments                (tiptap-based so zmienkami)
└── dogfood_feedback        (interné monitorovanie kvality)
```

`workspace_people` je primárny graf ľudí. `workspace_contacts` je SQL VIEW pre spätnú kompatibilitu.

### Serverová architektúra

- **Server Actions** — všetky mutácie dát používajú Next.js Server Actions (žiadne REST API pre interné použitie)
- **supabaseAdmin** — serverový klient so servisnou rolou pre všetky server actions
- **supabase (klient)** — browserový klient s RLS-vynútenou užívateľskou reláciou pre realtime
- **logger.ts** — štruktúrované logovanie na strane servera; nulový `console.log` v produkcii
- **Sentry** — všetky neošetrené chyby zachytené automaticky; žiadny console.error v klientských komponentoch

### Architektúra AI platformy

11-vrstvová AI platforma zdokumentovaná v `docs/blueprints/AI_PLATFORM_ARCHITECTURE.md`:

1. Vrstva príjmu dát
2. Vrstva produkcie signálov
3. Pamäťová vrstva
4. Vrstva zostavenia kontextu
5. Vrstva AI rozpočtu
6. Vrstva prompt inžinierstva
7. Vrstva vykonania modelu
8. Vrstva spracovania odpovedí
9. Vrstva vysvetliteľnosti
10. Vrstva pozorovateľnosti
11. Vrstva dôvery a bezpečnosti

**Kontroly AI rozpočtu:**
- Denný limit tokenov na pracovný priestor (predvolene: 100 000 tokenov)
- Kill switch pozastavenia (na úrovni admina)
- `checkAIBudget()` volaný pred každou AI požiadavkou
- Admin dashboard: ukazovatele rizika, inline editor limitu, prepínač pozastavenia

---

## Bezpečnosť

### Autentifikácia
- Supabase Auth s emailom/heslom a magic linkom
- Správa relácie cez httpOnly cookies
- Serverová validácia relácie pri každej požiadavke

### Bezpečnosť na úrovni riadkov (RLS)
- Všetky dáta pracovného priestoru chránené PostgreSQL RLS politikami
- Používatelia môžu pristupovať len k dátam v rámci svojho členstva v pracovnom priestore
- Servisná rola (`supabaseAdmin`) používaná len v server actions — nikdy nevystavená klientovi

### Email a Calendar OAuth
- Gmail a Google Calendar OAuth tokeny uložené v šifrovaných stĺpcoch Supabase
- Prístupové tokeny sa automaticky obnovia pred vypršaním (okno 60s)
- Zrušenie tokenu sa zistí a spracuje (prihlasovacie údaje sa vymažú pri ďalšej požiadavke)
- Tok rozšírenia rozsahu s jantárovým bannerom opätovného pripojenia (napr. pridanie `gmail.send`)
- Rozsahy uložené na spojenie — kontrola rozsahu pred každou operáciou zápisu

### Admin konzola
- 9-sekčná admin konzola na `/dashboard/admin` s oddeleným riadením prístupu
- Auditný log: každá mutácia admina zaznamenaná s aktérom, akciou, časovou pečiatkou a dátami
- Systém vysielania s bannerom + komponentom tvorby
- Správca pracovného priestoru s príznakmi funkcií a kontrolami AI rozpočtu

### Produkčné štandardy
- Nulový `console.log` / `console.debug` / `console.info` v produkcii
- Nulový `console.error` v klientských komponentoch — Sentry zachytáva všetky chyby
- Všetky HTTP-only cookies, žiadny localStorage pre citlivé dáta
- CSP hlavičky nakonfigurované

---

## Škálovateľnosť

### Databáza
- PostgreSQL cez Supabase — overené, ACID kompatibilné
- Združovanie spojení cez Supabase PgBouncer
- Indexy na všetkých cudzích kľúčoch a často dopytovaných stĺpcoch
- RLS politiky sú výkonné (indexované na workspace_id + user_id)

### Aplikačná vrstva
- Vercel Edge Network — globálna CDN pre statické aktíva
- Serverless funkcie — automatické škálovanie
- Server Components — minimálny JS bundle klienta, predvolene renderovaný na serveri
- Vzor `Promise.all()` — paralelné načítanie dát na každej stránke (bez vodopádu)

### AI vrstva
- Denné tokeny na pracovný priestor zabraňujú neríadeným nákladom na AI
- GPT-4o-mini — nákladovo efektívny pre vysokofrekvenčné volania (inteligencia tagov, návrhy emailov, príprava stretnutí)
- Generovanie na vyžiadanie pre prípravu stretnutí a návrhy emailov (žiadne predpočítanie)

### Synchronizácia emailu a kalendára
- Dávkové spracovanie: 10 vlákien na dávku (konfigurovateľné)
- Inkrementálna synchronizácia: filter `afterDate` pri následných synchronizáciách
- Obmedzenie rýchlosti na endpoint synchronizácie
- Obnova tokenu spracovaná automaticky v pipeline synchronizácie

### Cron joby
- Skenovanie signálov: každých 6 hodín, všetky pracovné priestory
- `lastRunAt` na úrovni pracovného priestoru — idempotentné skenovania
- Endpoint chránený CRON_SECRET

---

## Internacionalizácia

- **3 jazyky**: Angličtina (EN), Slovenčina (SK), Čeština (CS)
- **3 000+ lokalizačných kľúčov** pokrývajúcich každý viditeľný reťazec v aplikácii
- `next-intl` — serverové aj klientské komponenty sú pokryté
- Cookie-based prepínanie jazyka s podporou SSR
- AI odpovede generované v jazyku pracovného priestoru (EN/SK/CS)
- Nulové napevno zakódované reťazce v produkcii

---

## Admin konzola

9-sekčný dashboard správy platformy na `/dashboard/admin`:

| Sekcia | Funkcia |
|---|---|
| Hub | Prehľad platformy, kľúčové metriky |
| Správca pracovného priestoru | Všetky pracovné priestory, príznaky funkcií, AI rozpočet |
| Správca používateľov | Všetci používatelia, kontrola pozvaní |
| AI Ops | Limity tokenov na pracovný priestor, kill switch pozastavenia, vizualizácia rizika |
| Zdravie platformy | Stav systému, zdravie cronu, miery chýb |
| Kontrola pozvaní | Globálne nastavenia pozvaní, čakajúce pozvánky |
| Vysielanie | Plošný banner + komponent tvorby správ |
| Auditný log | Kompletná história akcií admina |
| Dogfood | Interný feedback dashboard |

---

## Produktová mapa

### Dokončené ✅

- ✅ Základné CRM: Kontakty, Spoločnosti, Obchody
- ✅ Úlohy s priradenými zodpovednými, prioritami, termínmi
- ✅ Poznámky s formátovaným textom, zmienkami `#tag` a `@člen`
- ✅ Tagy s AI inteligenciou (analýza klastrov tagov GPT-4o-mini)
- ✅ Email Command Center (synchronizácia Gmail + čítanie)
- ✅ Email V2 — tvorba, odpovede, AI návrh, signály `email_sent`
- ✅ Kalendár V2 — synchronizácia Google Kalendára, zobrazenia mesiac/týždeň/zoznam, vytváranie/úprava/mazanie udalostí
- ✅ AI príprava stretnutia Kalendára — kontextový brief na udalosť, GPT-4o-mini
- ✅ Označiť ako absolvované — jedným kliknutím signál `meeting_held`
- ✅ Nadchádzajúce stretnutia na stránke detailu kontaktu
- ✅ Objednávky s integráciou signálov, Email→Objednávka, ⌘K vytvorenie
- ✅ Signal Engine — 25 typov signálov, skenovací engine (cron každých 6h)
- ✅ Skóre zdravia vzťahu — 0–100, model 4 signálov, bodka + skóre v zozname CRM
- ✅ AI Brief — denný súhrn inteligencie pracovného priestoru
- ✅ AI návrh emailu — kontextovo vedomý, píše v jazyku pracovného priestoru
- ✅ Kontroly AI rozpočtu — denný limit tokenov na pracovný priestor + kill switch
- ✅ Admin konzola — 9 sekcií, kompletný auditný log
- ✅ Tímy (organizačné štítky, UI)
- ✅ Základ domény — graf workspace_people, migrácia 37 súborov
- ✅ Preferencie pracovného priestoru — jazyk, AI jazyk, regionálne, cookie-based prepínanie
- ✅ Internacionalizácia — EN/SK/CS, 3000+ kľúčov
- ✅ Sledovanie chýb Sentry — klient + server
- ✅ Systém pozvaní — Resend email + fallback kopírovania linku
- ✅ Command Center ⌘K — globálne rýchle vytvorenie pre úlohy, poznámky, emaily, objednávky
- ✅ Systém dogfoodingu — interná slučka kvality

### Plánované

- 📅 Vrstva obchodnej pamäte — perzistentná AI pamäť na pracovný priestor
- 📅 Verejné REST API — externé integrácie
- 📅 Webhooky pre externé udalosti
- 📅 Outlook / Microsoft 365 integrácia emailu + kalendára
- 📅 Zobrazenia optimalizované pre mobil
- 📅 Izolácia tímu V2 — RLS prepínač na pracovný priestor (enterprise)
- 📅 Natívny Gunimi Kalendár (nezávislý od Google)

---

## Cenový model

| Úroveň | Cena | Čo je zahrnuté |
|---|---|---|
| **Free** | €0/mesiac | Do 200 kontaktov, základné CRM, úlohy, poznámky — žiadna AI, žiadne signály |
| **Standard** | €29/používateľ/mesiac | Neobmedzené CRM, Signal Engine, Zdravie vzťahov, AI (obmedzený rozpočet), synchronizácia emailu |
| **Pro** | €79/používateľ/mesiac | Plná AI (návrh emailu, príprava stretnutí, inteligencia tagov), objednávky, tímy, AI Brief, inteligencia kalendára, prioritná podpora |
| **Enterprise** | Vlastné | Admin konzola, auditný log, vlastný AI rozpočet, izolácia tímu, SLA, SSO |

---

## Prečo Gunimi

### vs. HubSpot / Pipedrive
HubSpot a Pipedrive sú v prvom rade CRM — sledujú obchody a kontakty, ale nemajú žiadnu ambientnú inteligenciu, prípravu stretnutí, skórovanie zdravia vzťahov ani prepojenie email-signál. Gunimi sleduje celý pracovný priestor a proaktívne zobrazuje signály. Bez nutnosti konfigurácie.

### vs. Notion / Obsidian
Notion je nástroj na správu znalostí. Nemá žiadnu koncepciu vzťahov, obchodov, signálov ani AI, ktorá rozumie obchodnému kontextu. Gunimi je postavené okolo entít a ich prepojení — poznámky sú prepojené s kontaktmi, spoločnosťami a obchodmi.

### vs. Linear / Asana
Nástroje na úlohy bez CRM, bez grafu vzťahov, bez komunikačnej vrstvy. Gunimi prepája výkon so vzťahmi — úlohy sú prepojené s kontaktmi, spoločnosťami, obchodmi a generujú inteligenčné signály.

### vs. Google Kalendár + Gmail (samostatné)
Kalendár a email bez CRM kontextu. Gunimi integruje oboje a pridáva inteligentnú vrstvu: s kým sa stretávate, aké obchody s nimi máte otvorené, aké úlohy sú nevybavené a AI brief pred každým stretnutím.

### Rozdiel Gunimi
- **Jeden pracovný priestor, plný kontext** — kontakty, obchody, úlohy, poznámky, email, kalendár, objednávky na jednom mieste
- **Signal Engine** — proaktívna inteligencia, nie reaktívne dashboardy
- **Skóre zdravia vzťahu** — automatické, viacsignálové skórovanie na kontakt
- **AI príprava stretnutia** — kontextový brief generovaný pred každým stretnutím s CRM kontaktom
- **AI, ktorá rozumie obchodnému kontextu** — nie chatbot, ale vbudovaná inteligentná vrstva
- **Enterprise architektúra** — RLS, auditné logy, kontroly AI rozpočtu, admin konzola
- **Budované pre Európu** — Slovenčina/Čeština/Angličtina, EUR mena, architektúra vedomá GDPR

---

*Gunimi — Váš pracovný priestor vám rozumie.*

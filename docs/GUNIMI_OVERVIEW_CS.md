# Gunimi — AI-First Workspace Operating System

**Verze 2.0 — Srpen 2026 — Důvěrné**

---

## Shrnutí

Gunimi je AI-nativní pracovní operační systém pro moderní podniky. Nahrazuje fragmentovaný stack CRM nástrojů, aplikací pro správu projektů, emailových klientů, kalendářních aplikací a nástrojů pro tvorbu poznámek — jedním inteligentním pracovním prostorem, který rozumí celému kontextu podnikání: lidem, vztahům, obchodům, úkolům, komunikaci, signálům a schůzkám.

Gunimi není CRM. Není klonem Notionu. Je to živý pracovní prostor, který se učí, pozoruje a automaticky zobrazuje inteligenci — aby se týmy mohly soustředit na vztahy a výkon, nikoli na zadávání dat.

**Aktuální stav:** Open Beta. Aktivně používán v produkci. Kompletní sada funkcí je funkční.

---

## Problém

Moderní obchodní týmy pracují současně s 5–10 odpojenými nástroji:

- **CRM** (HubSpot, Pipedrive) — kontakty a obchody, ale bez skutečné inteligence
- **Správa projektů** (Linear, Asana, Monday) — úkoly a výkon, izolované od vztahů
- **Poznámky** (Notion, Obsidian) — znalosti, odpojené od kontextu
- **Email** (Gmail, Outlook) — komunikace, neviditelná pro zbytek stacku
- **Kalendář** (Google Calendar) — schůzky bez CRM kontextu
- **Analytika** (dashboardy) — reaktivní, nikoli proaktivní

Výsledek: kontext se ztrácí při každém předání. Obchody tiše stagnují. Vztahy se rozpadají nepozorovaně. Týmy tráví více času správou nástrojů než správou práce.

---

## Řešení

Gunimi sjednocuje celý obchodní kontext do jednoho pracovního prostoru:

```
Společnosti → Kontakty → Obchody → Úkoly → Poznámky → Email → Kalendář → Inteligence
```

Každá entita se propojuje s každou jinou. Každá interakce generuje signál. Každý signál napájí inteligentní vrstvu. Pracovní prostor se časem učí a zobrazuje to, na čem záleží — bez nutnosti ptát se.

### Základní principy

- **Kontext na prvním místě** — každá informace je propojena s lidmi, společnostmi a obchody
- **Inteligence jako výchozí** — systém pozoruje a zobrazuje, uživatel nekonfiguruje
- **AI nativní** — ne AI přidaná na vrch, ale AI vetkána do každé vrstvy
- **Minimální povrch** — prémiové, podnikové UI bez vizuálního chaosu
- **Pracovní prostor, ne aplikace** — živé prostředí, ne statický nástroj

---

## Základní moduly

### 1. Kontakty (Správa vztahů)

Kompletní správa životního cyklu kontaktů postavená na `workspace_people` — základním grafu lidí Gunimi.

**Funkce:**
- Kompletní profily kontaktů (jméno, email, telefon, pozice, společnost, status, poznámky)
- Označení priority s vizuálními indikátory
- Životní cyklus statusu: Potenciální zákazník → Aktivní → Získaný
- Systém tagů s barevně kódovanými štítky a AI-generovanou inteligencí tagů
- Hromadné operace: vícenásobný výběr, hromadné tagování, hromadné mazání, sloučení duplikátů
- Import CSV
- **Skóre zdraví vztahu** — automatické skóre 0–100 na kontakt na základě:
  - Aktuálnosti a frekvence emailů (posledních 30 dní)
  - Aktivních obchodů
  - Otevřených úkolů
  - Úrovně: Zdravý (≥60) / Sledovaný (30–59) / Ohrožený (10–29) / Studený (0–9)
- **Nadcházející schůzky** — nejbližší události z Google Kalendáře s tímto kontaktem zobrazené na stránce detailu kontaktu (shoda podle emailu)

### 2. Společnosti

Správa společností s úplným grafem vztahů:
- Profily společností (název, odvětví, webová stránka, velikost, popis)
- Propojené kontakty, obchody, úkoly, poznámky, objednávky
- Integrace signálů — sledování aktivit na úrovni společnosti
- Podpora tagů a AI inteligence

### 3. Obchody (Správa pipeline)

Obchodní pipeline se strukturovaným životním cyklem:
- Název obchodu, hodnota (EUR), fáze, priorita, propojený kontakt a společnost
- Zobrazení Kanban + seznam
- Sledování fází: Potenciální → Kvalifikovaný → Návrh → Vyjednávání → Získaný / Ztracený
- Generování signálů při vytvoření obchodu, změně fáze, detekci stagnace
- Kompletní historie objednávek na obchod

### 4. Úkoly (Vrstva výkonu)

Správa úkolů v celém pracovním prostoru:
- Úrovně priority: Vysoká / Střední / Nízká
- Status: K provedení / V průběhu / Hotovo
- Termíny s detekcí zpoždění
- Propojení s kontakty, společnostmi, obchody
- Podpora přiřazeného zodpovědného pro členy týmu
- Generování signálů pro zpožděné úkoly a události dokončení
- Rychlé vytvoření ⌘K odkudkoli v pracovním prostoru

### 5. Poznámky (Znalostní vrstva)

Strukturované zachycování znalostí s podporou formátovaného textu:
- Editor formátovaného textu Tiptap
- Systém zmínek `#tag` a `@člen` s kartami při přejetí myší
- Propojení s kontakty, společnostmi, obchody
- Celoplošný feed poznámek pracovního prostoru
- Rychlé vytvoření ⌘K

### 6. Email (Komunikační vrstva — V2)

Nativní Gmail integrace — kompletní čtení i psaní:
- Připojení přes OAuth 2.0 (Gmail API — rozsahy: `gmail.readonly`, `gmail.send`, `userinfo.email`)
- Automatická synchronizace vláken a propojení s CRM (vlákna přiřazována ke kontaktům/společnostem podle emailové adresy)
- **Email Command Center** — sjednocená schránka s:
  - Widgetem nepřečtených priorit
  - Detekcí potřeby navazující komunikace (přečtené vlákno, propojený kontakt, žádná odpověď 3+ dní)
  - Posledními vlákny s propojenými kontakty a společnostmi
  - Widgetem emailové inteligence (míra pokrytí CRM, míra nepřečtených, top kontakty/společnosti)
- **Tvorba a odpovědi:**
  - Odpověď na vlákno přímo z Gunimi
  - Tvorba nového emailu pro jakéhokoli příjemce
  - Návrh pomocí AI — GPT-4o-mini generuje tělo zprávy z kontextu vztahu (historie kontaktu, otevřené obchody, otevřené úkoly, datum posledního kontaktu)
  - Automatický signál `email_sent` při každém odeslání
  - Tok pro rozšíření rozsahu s jantarovým bannerem opětovného připojení pro stávající uživatele

### 7. Kalendář (Vrstva inteligence schůzek — V2)

Integrace Google Kalendáře s plnou CRM inteligencí:
- Připojení přes OAuth 2.0 (Google Calendar API)
- Kompletní synchronizace událostí (čtení + zápis + aktualizace + mazání)
- **Calendar Command Center:**
  - Zobrazení Měsíc / Týden / Seznam s jednotným překrytím úkolů, obchodů a událostí kalendáře
  - Události Google Kalendáře v modré; úkoly ve fialové; obchody ve smaragdové
  - Rychlé přidání úkolu přímo do buňky libovolného dne
  - Vytvoření nové události z pracovního prostoru (název, datum, čas začátku/konce)
  - Úprava / mazání synchronizovaných událostí Google Kalendáře z Gunimi
  - Widget Meeting Intelligence — nejrušnější den v týdnu, celkové hodiny schůzek, odpočítávání do příští schůzky, hodnocení zátěže
  - Pás statistik: nadcházející schůzky, počet tento týden, připojené kalendáře, obchodní schůzky (propojené s CRM)
- **Panel detailu události (V2 inteligence):**
  - Propojení s CRM kontaktem — schůzky se automaticky přiřadí ke kontaktům podle emailu organizátora
  - **AI příprava schůzky** — jedním kliknutím generovaný GPT-4o-mini brief: souhrn kontextu vztahu, 3 navrhovaná témata diskuse, 2–3 klíčové body vycházející z otevřených obchodů, otevřených úkolů a data posledního kontaktu
  - **Označit jako absolvované** — tlačítko jedním kliknutím vytvoří signál `meeting_held` pro propojený kontakt; tlačítko se po zaznamenání změní na smaragdové
  - Vytvoření poznámky ze schůzky — automaticky generuje poznámku předvyplněnou názvem události a popisem
  - Rychlé propojení na záznamy kontaktu a společnosti
  - Úprava názvu a časů události v panelu; změny se odešlou do Google Kalendáře
- **Integrace s detailem kontaktu:** Karta nadcházejících schůzek na záložce Přehled kontaktu zobrazuje nejbližší naplánované schůzky s daným kontaktem

### 8. Objednávky

Správa obchodních objednávek propojená s kontakty, obchody, společnostmi:
- Název objednávky, hodnota, měna (výchozí EUR), status
- Stavový stroj: Návrh → Potvrzena → Odeslána → Doručena / Zrušena / Vrácena
- Generování signálů při vytvoření, potvrzení, splnění objednávky
- Rychlé vytvoření ⌘K, konverze Email → Objednávka
- Kompletní historie objednávek na kontakt, obchod a společnost

### 9. Tagy

Systém tagů napříč entitami s AI inteligencí:
- Barevně kódované štítky (8 barevných variant)
- Aplikovatelné na kontakty, společnosti, obchody, úkoly, poznámky
- Stránka detailu tagu: všechny otagované entity na jednom místě
- **AI inteligence tagů** — GPT-4o-mini analyzuje všechny entity pod tagem a generuje 2–3 věty obchodného pohledu o klastru tagů
- TagHoverCard pro náhled při přejetí myší
- Systém zmínek: `#názevtagu` v komentářích a poznámkách

---

## Inteligentní vrstva

### Signal Engine

Signal Engine je základní inteligentní infrastruktura Gunimi — vrstva zpracování událostí v reálném čase, která sleduje všechny aktivity pracovního prostoru a generuje akcionovatelné signály.

**Architektura:**
- 25+ typů signálů napříč všemi doménami entit
- Životní cyklus signálu: `aktivní → vyřešený → prošlý`
- Logika deduplikace a potlačení
- Identita signálu: `signalId`, `workspaceId`, `origin`, `correlationId`, `parentSignalId`
- Evoluce signálu (signál může měnit stav při zachování identity)
- Vysvětlitelnost: každý signál odpovídá na 7 otázek (co, kdo, kdy, proč, co se změnilo, co dělat, co když ignorujeme)

**Kategorie signálů:**
- Vztahové signály: kontakt vychladl, potřebná navazující komunikace, obchod stagnuje
- Výkonové signály: úkol zpožděn, obchod bez úkolů, žádná nedávná aktivita
- Komunikační signály: email odeslán, email přijat, žádná odpověď po N dnech
- Signály schůzek: schůzka se konala (z „Označit jako absolvované"), nadcházející schůzka
- Obchodní signály: objednávka potvrzena, objednávka odeslána, obchod získán/ztracen
- Signály pracovního prostoru: nový člen, importovaný nový kontakt

**Skenovací engine:**
- Vercel Cron: spouští se každých 6 hodin (`0 */6 * * *`)
- Skenuje všechny aktivní pracovní prostory
- Ukládá `lastRunAt` v preferencích pracovního prostoru
- Endpoint `/api/signals/health` pro monitorování
- Plná pozorovatelnost: všechny skenery hlásí skutečné počty

### Skóre zdraví vztahu

Automatické skóre zdraví 0–100 na kontakt. Vypočítáno ze 4 zdrojů signálů:

| Signál | Max bodů | Logika |
|---|---|---|
| Aktuálnost emailu | 40 | ≤7d=40, ≤14d=32, ≤30d=22, ≤60d=12, ≤90d=5 |
| Frekvence emailů (30d) | 25 | 5+=25, 3+=18, 1+=10 |
| Celkové obchody | 20 | 2+=20, 1=14 |
| Otevřené úkoly | 15 | 2+=15, 1=10 |

Zobrazeno jako barevná tečka + skóre v seznamu CRM kontaktů. Dávkově vypočítáno — 3 paralelní DB dotazy pro všechny kontakty, agregované v TypeScriptu.

**Úrovně zdraví:**
- 🟢 Zdravý (≥60): smaragdová — vztah je aktivní
- 🟡 Sledovaný (30–59): jantarová — brzy je potřeba pozornost
- 🔴 Ohrožený (10–29): červená — vztah se zhoršuje
- ⚫ Studený (0–9): zinkovaná — kontakt utichl

### AI příprava schůzky

Brief přípravy AI na schůzku aktivovaný z panelu detailu události Kalendáře:
- Jméno kontaktu, pozice, datum posledního kontaktu
- Otevřené obchody (název + fáze)
- Otevřené úkoly
- GPT-4o-mini generuje: souhrn kontextu, 3 navrhovaná témata, 2–3 klíčové body
- Na vyžádání (spuštěno uživatelem), nepředpočítáno
- Výstup nezávislý na jazyce

### AI inteligence tagů

Analýza AI na tag pomocí GPT-4o-mini:
- Analyzuje všechny entity pod tagem
- Detekuje vzory: odvětvové klastry, koncentraci fáze obchodu, stagnující pipeline
- Dostupné v jazyce pracovního prostoru (EN/SK/CS)

### AI návrh emailu

Generování těla emailu pomocí AI na vlákno / na tvorbu:
- Získává kontext vztahu: jméno kontaktu, pozice, poslední kontakt, otevřené úkoly, aktivní obchody
- GPT-4o-mini generuje stručné, profesionální tělo emailu
- Píše v jazyce pracovního prostoru (EN/SK/CS)
- Bez zástupných závorek — používá skutečná data

---

## Technická architektura

### Stack

| Vrstva | Technologie |
|---|---|
| Frontend | Next.js 15 (App Router, Server Components) |
| Jazyk | TypeScript (strict) |
| Stylování | TailwindCSS v4 |
| Backend | Supabase (PostgreSQL + Row Level Security) |
| Autentifikace | Supabase Auth (email/heslo, magic link) |
| AI | OpenAI GPT-4o-mini (přes openai SDK) |
| Email | Gmail API (OAuth 2.0), Postmark (transakční) |
| Kalendář | Google Calendar API (OAuth 2.0) |
| Sledování chyb | Sentry |
| Nasazení | Vercel (Edge + Serverless) |
| Internacionalizace | next-intl (EN / SK / CS) |
| Cron | Vercel Cron Jobs |

### Datová vrstva

```
workspace (pracovní prostor)
├── workspace_people        (kontakty — základní graf lidí)
├── workspace_contacts      (SQL VIEW — zpětná kompatibilita)
├── workspace_companies     (společnosti)
├── workspace_deals         (obchodní pipeline)
├── workspace_tasks         (vrstva výkonu)
├── workspace_notes         (znalosti)
├── workspace_orders        (obchodní objednávky)
├── workspace_tags          (meziientitní štítky)
├── workspace_teams         (organizační struktura)
├── workspace_members       (členství uživatel ↔ pracovní prostor)
├── email_connections       (Gmail OAuth tokeny + rozsahy)
├── email_threads           (synchronizovaná emailová vlákna)
├── email_messages          (jednotlivé zprávy)
├── calendar_connections    (Google Calendar OAuth tokeny)
├── calendar_events         (synchronizované události kalendáře)
├── signals                 (inteligenční události)
├── comments                (tiptap-based se zmínkami)
└── dogfood_feedback        (interní monitorování kvality)
```

`workspace_people` je primární graf lidí. `workspace_contacts` je SQL VIEW pro zpětnou kompatibilitu.

### Serverová architektura

- **Server Actions** — všechny mutace dat používají Next.js Server Actions (žádné REST API pro interní použití)
- **supabaseAdmin** — serverový klient se servisní rolí pro všechny server actions
- **supabase (klient)** — browserový klient s RLS-vynucenou uživatelskou relací pro realtime
- **logger.ts** — strukturované logování na straně serveru; nulový `console.log` v produkci
- **Sentry** — všechny neošetřené chyby zachyceny automaticky; žádný console.error v klientských komponentách

### Architektura AI platformy

11-vrstvová AI platforma zdokumentovaná v `docs/blueprints/AI_PLATFORM_ARCHITECTURE.md`:

1. Vrstva příjmu dat
2. Vrstva produkce signálů
3. Paměťová vrstva
4. Vrstva sestavení kontextu
5. Vrstva AI rozpočtu
6. Vrstva prompt inženýrství
7. Vrstva provedení modelu
8. Vrstva zpracování odpovědí
9. Vrstva vysvětlitelnosti
10. Vrstva pozorovatelnosti
11. Vrstva důvěry a bezpečnosti

**Kontroly AI rozpočtu:**
- Denní limit tokenů na pracovní prostor (výchozí: 100 000 tokenů)
- Kill switch pozastavení (na úrovni admina)
- `checkAIBudget()` volaný před každým AI požadavkem
- Admin dashboard: ukazatele rizika, inline editor limitu, přepínač pozastavení

---

## Bezpečnost

### Autentifikace
- Supabase Auth s emailem/heslem a magic linkem
- Správa relace přes httpOnly cookies
- Serverová validace relace při každém požadavku

### Zabezpečení na úrovni řádků (RLS)
- Všechna data pracovního prostoru chráněna PostgreSQL RLS politikami
- Uživatelé mohou přistupovat pouze k datům v rámci svého členství v pracovním prostoru
- Servisní role (`supabaseAdmin`) používána pouze v server actions — nikdy nevystavená klientovi

### Email a Calendar OAuth
- Gmail a Google Calendar OAuth tokeny uloženy v šifrovaných sloupcích Supabase
- Přístupové tokeny se automaticky obnoví před vypršením (okno 60s)
- Odvolání tokenu je detekováno a zpracováno (přihlašovací údaje vymazány při dalším požadavku)
- Tok rozšíření rozsahu s jantarovým bannerem opětovného připojení (např. přidání `gmail.send`)
- Rozsahy uloženy na připojení — kontrola rozsahu před každou operací zápisu

### Admin konzola
- 9-sekční admin konzola na `/dashboard/admin` s odděleným řízením přístupu
- Auditní log: každá mutace admina zaznamenána s aktérem, akcí, časovým razítkem a daty
- Systém vysílání s bannerem + komponentou tvorby
- Správce pracovního prostoru s příznaky funkcí a kontrolami AI rozpočtu

### Produkční standardy
- Nulový `console.log` / `console.debug` / `console.info` v produkci
- Nulový `console.error` v klientských komponentách — Sentry zachycuje všechny chyby
- Všechny HTTP-only cookies, žádný localStorage pro citlivá data
- CSP hlavičky nakonfigurovány

---

## Škálovatelnost

### Databáze
- PostgreSQL přes Supabase — prověřené, ACID kompatibilní
- Sdružování připojení přes Supabase PgBouncer
- Indexy na všech cizích klíčích a často dotazovaných sloupcích
- RLS politiky jsou výkonné (indexované na workspace_id + user_id)

### Aplikační vrstva
- Vercel Edge Network — globální CDN pro statická aktiva
- Serverless funkce — automatické škálování
- Server Components — minimální JS bundle klienta, výchozí renderování na serveru
- Vzor `Promise.all()` — paralelní načítání dat na každé stránce (bez vodopádu)

### AI vrstva
- Denní tokeny na pracovní prostor zabraňují nekontrolovaným nákladům na AI
- GPT-4o-mini — nákladově efektivní pro vysokofrekvenční volání (inteligence tagů, návrhy emailů, příprava schůzek)
- Generování na vyžádání pro přípravu schůzek a návrhy emailů (žádné předpočítávání)

### Synchronizace emailu a kalendáře
- Dávkové zpracování: 10 vláken na dávku (konfigurovatelné)
- Inkrementální synchronizace: filtr `afterDate` při následných synchronizacích
- Omezení rychlosti na endpoint synchronizace
- Obnova tokenů zpracována automaticky v pipeline synchronizace

### Cron joby
- Skenování signálů: každých 6 hodin, všechny pracovní prostory
- `lastRunAt` na úrovni pracovního prostoru — idempotentní skenování
- Endpoint chráněn CRON_SECRET

---

## Internacionalizace

- **3 jazyky**: Angličtina (EN), Slovenština (SK), Čeština (CS)
- **3 000+ lokalizačních klíčů** pokrývajících každý viditelný řetězec v aplikaci
- `next-intl` — serverové i klientské komponenty jsou pokryty
- Cookie-based přepínání jazyka s podporou SSR
- AI odpovědi generované v jazyce pracovního prostoru (EN/SK/CS)
- Nulové napevno zakódované řetězce v produkci

---

## Admin konzola

9-sekční dashboard správy platformy na `/dashboard/admin`:

| Sekce | Funkce |
|---|---|
| Hub | Přehled platformy, klíčové metriky |
| Správce pracovního prostoru | Všechny pracovní prostory, příznaky funkcí, AI rozpočet |
| Správce uživatelů | Všichni uživatelé, kontrola pozvánek |
| AI Ops | Limity tokenů na pracovní prostor, kill switch pozastavení, vizualizace rizika |
| Zdraví platformy | Stav systému, zdraví cronu, míry chyb |
| Kontrola pozvánek | Globální nastavení pozvánek, čekající pozvánky |
| Vysílání | Plošný banner + komponenta tvorby zpráv |
| Auditní log | Kompletní historie akcí admina |
| Dogfood | Interní feedback dashboard |

---

## Produktová mapa

### Dokončeno ✅

- ✅ Základní CRM: Kontakty, Společnosti, Obchody
- ✅ Úkoly s přiřazenými zodpovědnými, prioritami, termíny
- ✅ Poznámky s formátovaným textem, zmínkami `#tag` a `@člen`
- ✅ Tagy s AI inteligencí (analýza klastrů tagů GPT-4o-mini)
- ✅ Email Command Center (synchronizace Gmail + čtení)
- ✅ Email V2 — tvorba, odpovědi, AI návrh, signály `email_sent`
- ✅ Kalendář V2 — synchronizace Google Kalendáře, zobrazení měsíc/týden/seznam, vytváření/úprava/mazání událostí
- ✅ AI příprava schůzky Kalendáře — kontextový brief na událost, GPT-4o-mini
- ✅ Označit jako absolvované — jedním kliknutím signál `meeting_held`
- ✅ Nadcházející schůzky na stránce detailu kontaktu
- ✅ Objednávky s integrací signálů, Email→Objednávka, ⌘K vytvoření
- ✅ Signal Engine — 25 typů signálů, skenovací engine (cron každých 6h)
- ✅ Skóre zdraví vztahu — 0–100, model 4 signálů, tečka + skóre v seznamu CRM
- ✅ AI Brief — denní souhrn inteligence pracovního prostoru
- ✅ AI návrh emailu — kontextově vědomý, píše v jazyce pracovního prostoru
- ✅ Kontroly AI rozpočtu — denní limit tokenů na pracovní prostor + kill switch
- ✅ Admin konzola — 9 sekcí, kompletní auditní log
- ✅ Týmy (organizační štítky, UI)
- ✅ Základ domény — graf workspace_people, migrace 37 souborů
- ✅ Preference pracovního prostoru — jazyk, AI jazyk, regionální, cookie-based přepínání
- ✅ Internacionalizace — EN/SK/CS, 3000+ klíčů
- ✅ Sledování chyb Sentry — klient + server
- ✅ Systém pozvánek — Resend email + fallback kopírování odkazu
- ✅ Command Center ⌘K — globální rychlé vytvoření pro úkoly, poznámky, emaily, objednávky
- ✅ Systém dogfoodingu — interní smyčka kvality

### Plánováno

- 📅 Vrstva obchodní paměti — perzistentní AI paměť na pracovní prostor
- 📅 Veřejné REST API — externí integrace
- 📅 Webhooky pro externí události
- 📅 Outlook / Microsoft 365 integrace emailu + kalendáře
- 📅 Zobrazení optimalizovaná pro mobil
- 📅 Izolace týmu V2 — RLS přepínač na pracovní prostor (enterprise)
- 📅 Nativní Gunimi Kalendář (nezávislý na Google)

---

## Cenový model

| Úroveň | Cena | Co je zahrnuto |
|---|---|---|
| **Free** | €0/měsíc | Do 200 kontaktů, základní CRM, úkoly, poznámky — žádná AI, žádné signály |
| **Standard** | €29/uživatel/měsíc | Neomezené CRM, Signal Engine, Zdraví vztahů, AI (omezený rozpočet), synchronizace emailu |
| **Pro** | €79/uživatel/měsíc | Plná AI (návrh emailu, příprava schůzek, inteligence tagů), objednávky, týmy, AI Brief, inteligence kalendáře, prioritní podpora |
| **Enterprise** | Vlastní | Admin konzola, auditní log, vlastní AI rozpočet, izolace týmu, SLA, SSO |

---

## Proč Gunimi

### vs. HubSpot / Pipedrive
HubSpot a Pipedrive jsou především CRM — sledují obchody a kontakty, ale nemají žádnou ambientní inteligenci, přípravu schůzek, skórování zdraví vztahů ani propojení email-signál. Gunimi sleduje celý pracovní prostor a proaktivně zobrazuje signály. Bez nutnosti konfigurace.

### vs. Notion / Obsidian
Notion je nástroj pro správu znalostí. Nemá žádný koncept vztahů, obchodů, signálů ani AI, která rozumí obchodnímu kontextu. Gunimi je postaveno kolem entit a jejich propojení — poznámky jsou propojeny s kontakty, společnostmi a obchody.

### vs. Linear / Asana
Nástroje pro úkoly bez CRM, bez grafu vztahů, bez komunikační vrstvy. Gunimi propojuje výkon se vztahy — úkoly jsou propojeny s kontakty, společnostmi, obchody a generují inteligenční signály.

### vs. Google Kalendář + Gmail (samostatné)
Kalendář a email bez CRM kontextu. Gunimi integruje obojí a přidává inteligentní vrstvu: s kým se setkáváte, jaké obchody s nimi máte otevřené, jaké úkoly jsou nevyřízené a AI brief před každou schůzkou.

### Rozdíl Gunimi
- **Jeden pracovní prostor, plný kontext** — kontakty, obchody, úkoly, poznámky, email, kalendář, objednávky na jednom místě
- **Signal Engine** — proaktivní inteligence, ne reaktivní dashboardy
- **Skóre zdraví vztahu** — automatické, vícesignálové skórování na kontakt
- **AI příprava schůzky** — kontextový brief generovaný před každou schůzkou s CRM kontaktem
- **AI, která rozumí obchodnímu kontextu** — ne chatbot, ale vestavěná inteligentní vrstva
- **Enterprise architektura** — RLS, auditní logy, kontroly AI rozpočtu, admin konzola
- **Budováno pro Evropu** — Slovenština/Čeština/Angličtina, EUR měna, architektura vědomá GDPR

---

*Gunimi — Váš pracovní prostor vám rozumí.*

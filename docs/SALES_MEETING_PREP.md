# Gunimi — Príprava na obchodné stretnutie

**Verzia:** 1.0 | **Aktualizované:** Október 2026  
**Kontakt:** hello@gunimi.com | michal@gunimi.com

---

## Čo je Gunimi? (30-sekundová verzia)

Gunimi je pracovný priestor pre malé obchodné tímy, ktoré spravujú vzťahy, príležitosti a komunikáciu.  
Kombinuje kontakty, firmy, obchody, úlohy, poznámky a email do jedného miesta — a na pozadí pracuje AI, ktorá sleduje vzťahy a upozorňuje, kedy treba konať.

**Nie je to CRM v tradičnom zmysle.** Je to workspace — menej formulárov, viac kontextu a inteligencie.

---

## Pre koho je Gunimi?

- Malé obchodné tímy (2–15 ľudí)
- Poradcovia, makléri, konzultanti s väčším portfóliom klientov
- Firmy, ktoré spravujú B2B vzťahy a doteraz používali Excel alebo nič
- Tímy, ktoré chcú aby AI sledovala vzťahy namiesto nich

**Nie je vhodný pre:** veľké korporácie s enterprise compliance požiadavkami, e-commerce B2C.

---

## Čo Gunimi reálne vie dnes

### Kontakty a firmy
- Zoznam kontaktov a firiem s profilom, históriou a tagmi
- Každý kontakt má prehľad: posledný kontakt, otvorené obchody, úlohy, poznámky, emaily
- Zdravotné skóre vzťahu (0–100) — automaticky vypočítané podľa aktivity
- **AI First Look** — pri pridaní nového kontaktu AI automaticky vygeneruje 2-vetový business brief (odvetvie, seniority, potenciál)

### Obchody (Pipeline)
- Kanban pipeline s fázami: Lead → Qualified → Proposal → Negotiation → Won/Lost
- Hodnota obchodu, pravdepodobnosť, dátum uzavretia
- Zdravotné skóre obchodu — upozornenie keď deal stagnuje
- Prepojenie obchodu na kontakt a firmu

### Úlohy
- Správa úloh s dátumom splatnosti, priradenými členmi a prioritou
- Opakovajúce sa úlohy
- Prepojenie úlohy na kontakt alebo obchod

### Email (Gmail)
- Pripojenie Gmail cez OAuth — Gunimi nikdy neuloží vaše heslo
- Zobrazenie emailovej histórie priamo na profile kontaktu
- **AI Email Insight** — po pripojení Gmailu AI naskenuje históriu a vygeneruje prehľad vzťahu pre každého kontaktu

### Kalendár a stretnutia
- Vytvorenie stretnutia priamo z profilu kontaktu alebo obchodu
- **AI Meeting Prep** — pred stretnutím AI vygeneruje brief: kto je kontakt, aký je stav vzťahu, čo bolo naposledy riešené
- Označenie stretnutia ako uskutočneného (signal pre AI)

### Signály (Relationship Intelligence)
- Systém 25+ typov signálov, ktoré sledujú vzťahy automaticky
- Príklady: "Vzťah sa ochladzuje" (90+ dní bez kontaktu), "Obchod stagnuje", "Opakovanie termínu"
- Denný prehľad signálov na Today stránke
- Denný email digest s úlohami, stretnutiami a signálmi

### AI asistent
- Chat s AI o konkrétnom kontakte, firme alebo obchode
- Návrh ďalšieho kroku (Next Action) — kontextová odporúčanie čo robiť ďalej
- Podpora SK/CS/EN jazyka podľa nastavenia workspace

### Import a migrácia
- Import zo súboru CSV: **kontakty, firmy, obchody** (až 500 záznamov naraz)
- Automatické mapovanie stĺpcov + manuálna úprava
- Náhľad pred importom — vidíte čo sa importuje
- Automatické prepojenie kontaktu/obchodu na existujúcu firmu podľa názvu
- **Kde nájdete import:** Dashboard → ⚙️ Nastavenia → Import (alebo priamo `/dashboard/import`)

### Export
- Export kontaktov, firiem, obchodov a objednávok do CSV
- Kdykoľvek, bez obmedzenia

### Ďalšie
- Tagy na kontaktoch, firmách, obchodoch a poznámkach
- Globálne vyhľadávanie (⌘K / Ctrl+K) — kontakty, firmy, obchody, poznámky
- Tímový workspace — viacero členov, spoločné dáta
- Notifikácie
- Changelog a roadmap na gunimi.com

---

## Čo Gunimi zatiaľ nevie (buďte úprimní)

| Čo | Stav | Kedy |
|---|---|---|
| Mobilná appka | Nie — web je responzívny | Roadmap 2027 |
| Natívne integrácie (Slack, HubSpot...) | Nie | Roadmap |
| SAML / SSO enterprise prihlásenie | Nie | Roadmap |
| Import úloh cez CSV | Nie | Čoskoro |
| Formálny penetračný test | Nie (manuálne testy prebehli) | Roadmap |
| SOC 2 vlastný certifikát | Nie (infraštruktúra má) | Roadmap |

---

## GDPR a ochrana dát

### Kde sú dáta uložené?
Všetky dáta sú uložené v **Európskej únii** (EU-West región). Žiadne dáta neopúšťajú EÚ.

### Kto spravuje infraštruktúru?
| Vrstva | Provider | Certifikácia |
|---|---|---|
| Aplikácia (hosting) | Vercel | SOC 2 Type II |
| Databáza a autentifikácia | Supabase | SOC 2 Type II |
| Email doručovanie | Postmark | SOC 2 Type II |
| Monitoring chýb | Sentry | SOC 2 Type II |

### Sú dáta jednotlivých zákazníkov oddelené?
Áno. Každý workspace je izolovaný na úrovni databázy pomocou **Row Level Security (RLS)** v PostgreSQL. Aj keby existovala chyba v aplikácii, jeden workspace nemôže čítať dáta iného. Garantuje to databáza — nie aplikačný kód.

### Môžem exportovať alebo zmazať dáta?
- Export: kedykoľvek, bez obmedzenia
- Zmazanie: na žiadosť cez hello@gunimi.com — všetky dáta workspacu sú vymazané
- DPA (Data Processing Agreement) je k dispozícii na vyžiadanie

### Ako je zabezpečená AI?
Gunimi používa **OpenAI API**. Podľa podmienok OpenAI API: dáta odoslané cez API **nie sú použité na trénovanie modelov**. Žiadne vaše dáta neopúšťajú vaše prostredie za účelom trénovania AI.

### Šifrovanie
| Čo | Ako |
|---|---|
| Dáta v databáze | AES-256 (Supabase) |
| Prenos dát | TLS 1.3 |
| OAuth tokeny (Gmail) | Šifrované v databáze |
| Heslá | bcrypt — nikdy nie v čitateľnej forme |

### Email integrácia — bezpečnosť
Gmail sa pripája cez OAuth 2.0. Gunimi **nikdy neobdrží ani neuloží vaše heslo**. Token možno kedykoľvek odvolať priamo v nastaveniach Google účtu — tým okamžite zanikne prístup Gunimi.

---

## Bezpečnostné testy (manuálne, september 2026)

| Test | Výsledok |
|---|---|
| Prístup User B k dátam User A (priamy URL) | 404 — žiadne dáta nevystavené |
| Neautentifikovaný prístup na `/dashboard` | Presmerovaný na `/login` |
| Brute force prihlásenie (6 pokusov) | Zablokovaný po 5 pokusoch |
| API bez autentifikácie | 401 Unauthorized |
| XSS injekcia v mene kontaktu | Bezpečne escapovaný — nespustený |

---

## Otázky na stretnutí — Vaše odpovede

### "Prečo Gunimi a nie HubSpot / Pipedrive?"
> HubSpot aj Pipedrive sú silné nástroje — ale sú navrhnuté pre väčšie tímy s dedikovanými sales ops. Pre tím 2–10 ľudí je to ako kúpiť nákladiak na rozvoz chleba. Gunimi je navrhnuté presne pre vašu veľkosť — rýchle nasadenie, žiadne zložité nastavovanie, AI funguje od prvého dňa.

### "Ako dlho trvá nasadenie?"
> Workspace je funkčný do 5 minút od registrácie. Import existujúcich kontaktov z CSV trvá ďalších 10 minút. Gmail sa pripojí za 2 kliknutia.

### "Čo sa stane s mojimi dátami ak Gunimi zanikne?"
> Kedykoľvek môžete exportovať všetky dáta do CSV. Ste vlastníkom svojich dát — nie my. V prípade ukončenia prevádzky poskytneme export pred vypnutím.

### "Viete importovať z nášho súčasného systému?"
> Ak váš súčasný systém (Excel, Pipedrive, HubSpot, Notion...) vie exportovať CSV, vieme importovať. Podporujeme kontakty, firmy a obchody — až 500 záznamov naraz. Pre väčšie migrások kontaktujte nás priamo.

### "Funguje to v slovenčine / češtine?"
> Áno. Gunimi je plne lokalizovaný do slovenčiny, češtiny a angličtiny. AI asistent tiež odpovedá v jazyku vášho workspace.

### "Koľko to stojí?"
> V súčasnosti je Gunimi v Open Alpha — prístup je zadarmo. Pre zakladateľov a prvých zákazníkov je k dispozícii **Founder Plan za €10 jednorazovo** — trvalý prístup bez predplatného. Platené plány pre tímy prídu pri spustení verzie 1.0.

### "Je to bezpečné pre firemné dáta?"
> Dáta sú uložené v EÚ, šifrované AES-256, prenos TLS 1.3. Každý workspace je databázovo izolovaný. Naša infraštruktúra (Vercel, Supabase) má SOC 2 Type II. DPA je k dispozícii na podpis.

### "Čo ak potrebujeme viac používateľov?"
> Workspace podporuje viacero členov — môžete pozvať celý tím. Každý člen má prístup k zdieľaným kontaktom, firmám a obchodom.

### "Kde nájdem import?"
> Dashboard →ľavé menu → **Nastavenia** (ozubené koliesko) → záložka **Import**. Alebo priamo na adrese `[vaša_domena]/dashboard/import`.

---

## Cenník (aktuálny stav)

| Plán | Cena | Pre koho |
|---|---|---|
| Open Alpha | Zdarma | Všetci v Open Alpha |
| Founder Plan | €10 jednorazovo | Prví zákazníci, trvalý prístup |
| Pro (pripravujeme) | TBD | Tímy pri spustení 1.0 |

---

## Čo povedať na začiatku stretnutia

> *"Gunimi je workspace pre malé obchodné tímy. Nesnažím sa vám predať ďalší CRM systém — viem, že ich je dosť. Chcem vám ukázať, čo sa stane keď dáte kontakty, emaily, úlohy a AI do jedného miesta a necháte systém sledovať vzťahy za vás. Trvá to 15 minút. Ak to nedáva zmysel pre váš tím, poviem vám to sám."*

---

*Dokumentácia: gunimi.com | Security: gunimi.com/security | Kontakt: michal@gunimi.com*

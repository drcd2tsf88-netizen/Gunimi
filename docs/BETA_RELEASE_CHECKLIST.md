# Gunimi — Beta Release Checklist

> Verdict troch nezávislých architektov: Beta ~85–90%. Blocker: Gate 7 + Stripe lifecycle.
> Prejdi každú sekciu v poradí. Nepokračuj ďalej ak niečo zlyhá.

---

## SEKCIA 1 — Automatické gates (5 min)

- [-] `npm run type-check` — exit 0, zero errors
- [-] `npm run lint` — exit 0, zero errors
- [-] `npm run build` — exit 0, všetky routes skompilované
- [-] `npm run check:locales` — EN/SK/CS v parite

---

## SEKCIA 2 — Infraštruktúra (overiť v Vercel)

- [-] `SENTRY_DSN` a `NEXT_PUBLIC_SENTRY_DSN` nastavené
- [-] `POSTMARK_SERVER_TOKEN` nastavený — invite emaily fungujú
- [-] `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` nastavené (rate limiting)
- [ ] `CRON_SECRET` nastavený (signal scan cron)
- [-] `OAUTH_STATE_SECRET` — 32+ znakov, nie development default
- [-] `OPENAI_API_KEY` nastavený

---

## SEKCIA 3 — Health check

```bash
curl https://gunimi.com/api/health
```

- [-] HTTP 200, `status: "ok"`
- [-] `supabase: true`
- [-] `openai: true`
- [-] `upstash: true`
- [-] `email: true`

---

## SEKCIA 4 — Browser verification (Gate 4)

Otvor Chrome DevTools → Console. Na každej stránke: zero errors.

| Stránka | Console errors | Hydration errors | MISSING_MESSAGE | OK? |
|---|---|---|---|---|
| `/dashboard` (Today) | | | | | ok
| `/dashboard/contacts` | | | [Violation] 'setTimeout' handler took 51ms | |A form field element should have an id or name attribute
A form field element has neither an id nor a name attribute. This might prevent the browser from correctly autofilling the form.

To fix this issue, add a unique id or name attribute to a form field. This is not strictly needed, but still recommended even if you have an autocomplete attribute on the same element.

2 resources
| `/dashboard/contacts/[id]` | | | | |ok

| `/dashboard/companies` | | | | |ok
| `/dashboard/companies/[id]` | | | | |ok
| `/dashboard/deals` | | | | |ok
| `/dashboard/deals/[id]` | | [Violation] 'requestAnimationFrame' handler took 54ms| |A form field element should have an id or name attribute
A form field element has neither an id nor a name attribute. This might prevent the browser from correctly autofilling the form.

To fix this issue, add a unique id or name attribute to a form field. This is not strictly needed, but still recommended even if you have an autocomplete attribute on the same element.

3 resources
Learn more: The form input el |
| `/dashboard/tasks` | A form field element should have an id or name attribute
A form field element has neither an id nor a name attribute. This might prevent the browser from correctly autofilling the form.

To fix this issue, add a unique id or name attribute to a form field. This is not strictly needed, but still recommended even if you have an autocomplete attribute on the same element.

1 resource
Violating node
TASK DETAIL --1bsh_l98m3l_-.js:47 [tiptap warn]: Duplicate extension names found: ['underline']. This can lead to issues.

taaassk popiss na hlavnej page task nerenderuje dobre (/p)



| | |[Violation] 'requestAnimationFrame' handler took 82ms |
| `/dashboard/settings` | | A form field element should have an id or name attribute
A form field element has neither an id nor a name attribute. This might prevent the browser from correctly autofilling the form.

To fix this issue, add a unique id or name attribute to a form field. This is not strictly needed, but still recommended even if you have an autocomplete attribute on the same element.

1 resource
Violating node
Learn more: The form input element
No label associated with a form field
A <label> isn't associated with a form field.

To fix this issue, nest the <input> in the <label> or provide a for attribute on the <label> that matches a form field id.

1 resource
Violating node
| | |
| `/dashboard/ai` | | | | | ok
| `/demo` | | | | |  ok

- [ napissli ssme ku kzdej pge co s naaslo] Všetky stránky: 0 console errors
- [ ] Všetky stránky: 0 hydration errors
- [ ] Všetky stránky: 0 MISSING_MESSAGE
- [ ] Všetky stránky: 0 CSP violations

---

## SEKCIA 5 — Smoke testy (Gate 7) — 19 workflows

Spustiť na **produkčnom prostredí** s reálnym accountom.

| # | Workflow | PASS/FAIL | Poznámky |
|---|---|---|---|
| 1 | Registrácia nového accountu | | | ok
| 2 | Login | | | ok
| 3 | Logout + login späť | | | ok
| 4 | Vytvoriť Workspace | | | ok
| 5 | Today Experience načíta (Daily Brief viditeľný) | | | ok
| 6 | Vytvoriť Company | [Violation] Forced reflow while executing JavaScript took 30ms
1bsh_l98m3l_-.js:47 Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.
[Violation] Forced reflow while executing JavaScript took 40ms| | inak prebehlo creaate, mussssel som naaa tvrdo refreesh sprvit nezobrzilo company hned 
| 7 | Upraviť Company, otvoriť Company Workspace | upravit ok| otvorit  detail hodilo mi taama niekde nieco 404, ked som z detailu presiel naa diel znova mi hodilo 404 : 
[Violation] Forced reflow while executing JavaScript took 49ms
1bsh_l98m3l_-.js:47  GET https://www.gunimi.com/dashboard/crm/49ffbd3b-3e0b-48fe-b0f4-3f453960d658?_rsc=F0aUoGqSmhdNxjrl 404 (Not Found)
(anonymous) @ 1bsh_l98m3l_-.js:47
n @ 3z5aukxaw9o_0.js:3
C @ 3z5aukxaw9o_0.js:2
await in C
eI @ 3z5aukxaw9o_0.js:3
ey @ 3z5aukxaw9o_0.js:3
(anonymous) @ 3z5aukxaw9o_0.js:3
(anonymous) @ 3z5aukxaw9o_0.js:3
w @ 3z5aukxaw9o_0.js:3
1bsh_l98m3l_-.js:47  GET https://www.gunimi.com/dashboard/crm/49ffbd3b-3e0b-48fe-b0f4-3f453960d658?_rsc=F0aUoGqSmhdNxjrl 404 (Not Found)
| 8 | Vytvoriť Contact | | | ok
| 9 | Upraviť Contact, otvoriť Contact Workspace | | |ok
| 10 | Priradiť Contact ku Company | | |ok
| 11 | Vytvoriť Deal, priradiť Contact + Company | | | ok aale nepridalo ju do zoznaamu muism znovaa refresh webu 
| 12 | Otvoriť Deal Workspace, všetky záložky funkčné |nefunguje pridnie ulohy v deal detile, hadze tam 404 chybu 
| 13 | Vytvoriť Task, priradiť member, nastaviť due date |create task -> [Violation] Forced reflow while executing JavaScript took 30ms, ostatne prebehlo ok 
| 14 | Označiť Task ako done | | | ok
| 15 | Vytvoriť Note, uložiť, upraviť | | | NEJDE VYTVARAAT NOTE NEVIEM UPRAVIT, Staare poznamky ide uprvit 
| 16 | Settings uložiť (language switch SK → EN → SK) | | |ok
| 17 | Pozvať nového člena (invite email príde) | | |prisiel le emaail paad do spamu ? preco 
| 18 | AI Chat — správa odoslaná, odpoveď príde | | | upl ny fail nefunguje haardtexty aako predvolene otazky pises otaazku a vyhodi ti ze workspce nebol njdeny nefunguje to vuobec 
| 19 | Admin Control načíta | | | naacitaa admin/alphaa

- [ ] Všetkých 19 workflows: PASS

---

## SEKCIA 6 — Workspace izolácia (KRITICKÉ — Architekt 3)

Použiť **dva rôzne účty** v dvoch rôznych workspacoch.

- [ ] User A vytvorí Contact "Test Izolacia A" vo Workspace A
- [ ] User B sa prihlási do Workspace B — Contact "Test Izolacia A" **nie je viditeľný**
- [ ] User A nemá prístup k žiadnym dátam Workspace B
- [ ] RLS izolácia potvrdená

---

## SEKCIA 7 — Stripe lifecycle (KRITICKÉ — Architekt 2)

Otestovať kompletný billing flow end-to-end.

- [ ] Checkout — prejsť celým platobným flow, predplatné vytvorené
- [ ] Vercel function logs: webhook event `customer.subscription.created` spracovaný bez chyby
- [ ] Dashboard Settings → Billing: zobrazuje aktívne predplatné
- [ ] Zrušiť predplatné v Stripe dashboard
- [ ] Webhook `customer.subscription.deleted` spracovaný
- [ ] Po zrušení: prístup správne obmedzený (alebo nie — podľa biznisovej logiky — overiť že je to zámerné)
- [ ] Znova aktivovať predplatné — prístup obnovený
- [ ] Počas celého flow: **žiadne** duplikátne spracovanie (webhook idempotencia)

---

## SEKCIA 8 — Signal Engine cron (Architekt 2)

- [ ] Manuálne triggernúť scan: `POST /api/cron/scan` s `Authorization: Bearer {CRON_SECRET}`
- [ ] Vercel function logs: scan prebehol bez timeoutu
- [ ] `/api/signals/health` vracia OK
- [ ] Skontrolovať že scan neprekračuje 10 sekúnd na workspace (Vercel function limit)

---

## SEKCIA 9 — Email verification

- [ ] Workspace invite odoslaný → email doručený do inbox
- [ ] Postmark Activity dashboard: invite zobrazený ako `Delivered`
- [ ] Registrácia nového accountu → confirmation email doručený
- [ ] Forgot password → reset email doručený

---

## SEKCIA 10 — Sentry verification

- [ ] Sentry dashboard: project aktívny, prijíma events
- [ ] Žiadne neočakávané error spiky po prvom načítaní
- [ ] Alert rules nastavené (notifikácia pri nových issues)

---

## SEKCIA 11 — Vercel function logs (po smoke testoch)

- [ ] 0 unhandled exceptions
- [ ] 0 PGRST116 errors
- [ ] 0 ReferenceError / TypeError
- [ ] 0 `[env] Missing required` pri štarte

---

## FINÁLNY SÚHLAS

- [ ] Sekcie 1–4: všetko checked
- [ ] Sekcia 5: všetkých 19 smoke testov PASS
- [ ] Sekcia 6: workspace izolácia potvrdená
- [ ] Sekcia 7: Stripe lifecycle end-to-end PASS
- [ ] Sekcia 8: Signal Engine cron bez timeoutu
- [ ] Sekcia 9: email doručenie potvrdené
- [ ] Sekcia 10: Sentry aktívny
- [ ] Sekcia 11: function logs čisté

**Beta approved by:** ___________________
**Dátum:** ___________________
**Commit SHA:** ___________________

---

> *Vytvorené: 2026-08-09 | Podklad: 3 nezávislí architekti*
> *Pred spustením workspace_people migrácie: najprv stabilizuj Beta s reálnymi zákazníkmi.*

# Gunimi Production Quality Gates v2.0

> **CRITICAL RULE**: No Evidence = FAIL. A gate cannot be marked PASS based on assumption.
> A feature is not complete. A sprint is not done. A release is not approved.
> Until ALL seven gates PASS with attached evidence.

---

## Definition of Production Ready

A codebase is Production Ready when:

1. Zero TypeScript errors
2. Zero ESLint errors
3. Production build compiles cleanly
4. Browser console is silent on all affected pages
5. Zero unexpected HTTP errors on all affected routes
6. Runtime logs are clean (Sentry, Vercel function logs)
7. Every affected workflow executes end-to-end without failure

All seven gates must PASS simultaneously. Partial passes do not count.

---

## Automated Gates (run `npm run gates`)

### Gate 1 — TypeScript

**Command**: `npm run type-check`

**Pass criteria**:
- Exit code 0
- Zero errors
- Zero `any` suppressions added without justification

**Evidence required**: Terminal output showing `Found 0 errors.`

---

### Gate 2 — ESLint

**Command**: `npm run lint`

**Pass criteria**:
- Exit code 0
- Zero errors
- Zero new warnings (existing warning baseline must not grow)

**Evidence required**: Terminal output showing `0 problems`

**Enforced rules include**:
- `no-console` — all `console.*` calls banned except in `lib/logger.ts` and `lib/server/env.ts`
- `@typescript-eslint/no-unused-vars` — no unused identifiers

---

### Gate 3 — Production Build

**Command**: `npm run build`

**Pass criteria**:
- Exit code 0
- All routes compiled
- No unexpected `○ (Static)` where `ƒ (Dynamic)` is required
- No unexpected build warnings beyond `DYNAMIC_SERVER_USAGE` on authenticated routes

**Evidence required**: Terminal output showing route manifest and `✓ Compiled successfully`

---

### Gate 3a — Locale Parity (automated)

**Command**: `npm run check:locales`

**Pass criteria**:
- Exit code 0
- `EN == SK == CS` key count
- Zero missing keys in SK or CS
- Zero orphan keys in SK or CS

**Evidence required**: `[locales] PASS — EN:N SK:N CS:N — all in sync.`

---

### Gate 3b — Environment Variables (automated)

**Command**: `npm run check:env`

**Pass criteria**:
- Exit code 0
- All REQUIRED variables present

**Evidence required**: `[env] PASS — All required variables present.`

**Required variables**:
| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side only |
| `NEXT_PUBLIC_APP_URL` | Yes | Canonical app URL |
| `OAUTH_STATE_SECRET` | Yes | 32+ char random secret |
| `POSTMARK_SERVER_TOKEN` | Optional | Email disabled if missing |
| `EMAIL_FROM` | Optional | Falls back to `noreply@gunimi.com` |
| `OPENAI_API_KEY` | Optional | AI features disabled if missing |
| `UPSTASH_REDIS_REST_URL` | Optional | Rate limiting disabled if missing |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Rate limiting disabled if missing |
| `SENTRY_DSN` | Optional | Error tracking blind if missing |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Client error tracking blind if missing |
| `SENTRY_AUTH_TOKEN` | Optional | Source maps not uploaded if missing |
| `SUPPORT_EMAIL` | Optional | Falls back to `support@gunimi.com` |
| `GOOGLE_CLIENT_ID` | Optional | Calendar/email OAuth disabled if missing |
| `GOOGLE_CLIENT_SECRET` | Optional | Calendar/email OAuth disabled if missing |

---

## Manual Gates (human verification required)

### Gate 4 — Browser Console

**Method**: Open Chrome DevTools → Console on every affected page

**Minimum pages for any release**:
- `/dashboard` (Today)
- `/dashboard/deals`
- `/dashboard/deals/[id]`
- `/dashboard/contacts`
- `/dashboard/contacts/[id]`
- `/dashboard/companies`
- `/dashboard/tasks`
- `/dashboard/settings`
- `/dashboard/ai`
- `/dashboard/admin/ai`
- `/orbit-control`

**Pass criteria** (zero tolerance):
- No `console.error`
- No `console.log`
- No React hydration errors
- No `MISSING_MESSAGE` locale warnings
- No CSP violations
- No unhandled promise rejections
- No failed JS chunk loads

**Evidence required**: Screenshot or screen recording of DevTools console on each page showing 0 errors.

---

### Gate 5 — Network

**Method**: Chrome DevTools → Network tab, navigate all affected routes

**Pass criteria** (zero tolerance):
- No HTTP 500
- No HTTP 404 on expected resources
- No failed fetch calls
- No aborted requests (excluding page navigations)

**Evidence required**: Screenshot of Network tab filtered to errors, showing 0 results.

---

### Gate 6 — Runtime Logs

**Method**: Vercel dashboard → Functions logs, or local terminal

**Pass criteria**:
- No unhandled exceptions
- No unhandled rejections
- No `[env] Missing required environment variables` warnings
- No PGRST116 errors (use `.maybeSingle()` where 0 rows is valid)
- No ReferenceError or TypeError in server logs

**Local evidence**: Dev server terminal showing no error lines during full workflow execution.
**Production evidence**: Vercel function logs + Sentry dashboard showing zero new issues.

---

### Gate 7 — Production Smoke Test

**Method**: Manual execution of every affected workflow

**Minimum workflow set for Open Alpha release**:

| # | Workflow | Expected result |
|---|---|---|
| 1 | Register new account | Account created, onboarding starts |
| 2 | Login | Session established, Today page loads |
| 3 | Logout | Session cleared, redirected to login |
| 4 | Create Workspace | Workspace created, user lands in dashboard |
| 5 | Today Experience | All sections render, no errors |
| 6 | Create Company | Company saved, appears in list |
| 7 | Edit Company | Changes persist after page reload |
| 8 | Create Contact | Contact saved, appears in list |
| 9 | Edit Contact | Changes persist after page reload |
| 10 | Create Deal | Deal appears in pipeline |
| 11 | Edit Deal | Changes persist |
| 12 | Deal Workspace | Deal detail page loads, all panels render |
| 13 | Contact Workspace | Contact detail page loads, all panels render |
| 14 | Create Task | Task appears in list |
| 15 | Complete Task | Task marked complete |
| 16 | Settings Save | Preferences saved, reload confirms persistence |
| 17 | Workspace Invite | Invite saved in DB, email sent (verify in Postmark) |
| 18 | Contact Form | Form submits, email received at support inbox |
| 19 | AI Chat | Response returned, no errors |
| 20 | Admin Control | Users table loads, role update works |

**Evidence required**: Each workflow marked PASS or FAIL with notes on any failures.

---

## Running All Automated Gates

```bash
npm run gates
```

Equivalent to:
```bash
npm run type-check && npm run lint && npm run build && npm run check:locales && npm run check:env
```

Gates 4, 5, 6, 7 require human execution — they cannot be automated with the current tooling.

---

## Release Decision Rules

A release is approved when:

- Gates 1, 2, 3, 3a, 3b: ALL PASS (automated, must be shown in CI output)
- Gates 4, 5, 6, 7: ALL PASS (human evidence attached in the sprint report)

A release is **blocked** when:

- Any gate FAILS
- Any gate has no evidence (No Evidence = FAIL)
- Any gate was not executed

---

## Merge Policy

No code merges to `main` without:

1. Gates 1–3b passing in CI or shown via terminal output
2. Explicit sign-off from a human that Gates 4–7 were checked

No exceptions. No "it probably works" merges.

---

## Sprint Report Format

Every sprint must close with a Quality Gates section:

```
QUALITY GATES

Gate 1 — TypeScript:     PASS  (0 errors)
Gate 2 — ESLint:         PASS  (0 errors, 0 warnings)
Gate 3 — Build:          PASS  (71/71 routes, clean)
Gate 3a — Locales:       PASS  (EN:1751 SK:1751 CS:1751)
Gate 3b — Env Vars:      PASS  (all required present, N optional missing)
Gate 4 — Console:        PASS / FAIL / NOT VERIFIED (reason)
Gate 5 — Network:        PASS / FAIL / NOT VERIFIED (reason)
Gate 6 — Runtime:        PASS / FAIL / NOT VERIFIED (reason)
Gate 7 — Smoke Tests:    PASS / FAIL / NOT VERIFIED (reason)

RELEASE DECISION: YES / NO
```

If any gate is NOT VERIFIED, the release decision is NO until evidence is provided.

---

*This document is mandatory for every sprint. Supersedes `docs/production/QUALITY_GATES.md`.*
*Updated: 2026-07-10*

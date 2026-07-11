# Gunimi Open Alpha Release Checklist

> Complete every item in order. Do not skip ahead. Each section depends on the previous.
> Mark each item ✅ when done, ❌ if blocked (add notes).

---

## Section 1 — Pre-Deployment (Code Quality)

### Automated Gates

- [ ] `npm run type-check` — exit 0, zero errors
- [ ] `npm run lint` — exit 0, zero errors
- [ ] `npm run build` — exit 0, all routes compiled
- [ ] `npm run check:locales` — EN/SK/CS in parity
- [ ] `npm run check:env` — all required variables set

### Code Review

- [ ] No hardcoded user-facing strings (Rule #1)
- [ ] No `console.log / console.debug / console.info` in any file (Rule #2)
- [ ] No `console.error` in client components (Rule #2)
- [ ] All server-side errors use `logger.error()` from `lib/logger.ts`
- [ ] No `.single()` on standalone reads where 0 rows is a valid state
- [ ] No new database schema changes without migration file
- [ ] No secrets committed to git (`.env.local` is in `.gitignore`)

---

## Section 2 — Pre-Deployment (Infrastructure)

### Supabase

- [ ] All migrations applied in production (`supabase/migrations/` in order)
- [ ] Row Level Security (RLS) enabled on all user-data tables
- [ ] Admin user promoted via `supabase/seed.sql`
- [ ] Auth email templates configured in Supabase dashboard
- [ ] Supabase `NEXT_PUBLIC_SUPABASE_URL` and keys match production project

### Vercel Environment Variables

Required (deployment fails without these):

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_APP_URL` = `https://gunimi.com`
- [ ] `OAUTH_STATE_SECRET` (32+ char, generated fresh for production)

Email (Postmark):

- [ ] `POSTMARK_SERVER_TOKEN`
- [ ] `EMAIL_FROM` = `Gunimi <noreply@gunimi.com>`
- [ ] `SUPPORT_EMAIL` = monitored inbox address

AI:

- [ ] `OPENAI_API_KEY`

Rate Limiting:

- [ ] `UPSTASH_REDIS_REST_URL`
- [ ] `UPSTASH_REDIS_REST_TOKEN`

Error Tracking (Sentry):

- [ ] `SENTRY_DSN`
- [ ] `NEXT_PUBLIC_SENTRY_DSN`
- [ ] `SENTRY_AUTH_TOKEN` (source map upload at build time)

OAuth (Calendar / Email):

- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`

### DNS (Cloudflare)

- [ ] CNAME `@` → `cname.vercel-dns.com` configured
- [ ] Cloudflare proxy OFF (gray cloud) on apex record
- [ ] `www` → apex redirect configured
- [ ] SSL/TLS certificate issued by Vercel (Let's Encrypt)

### Postmark

- [ ] Sender signature verified for `noreply@gunimi.com`
- [ ] Domain DKIM/SPF records configured
- [ ] Outbound message stream active
- [ ] Server token added to Vercel (`POSTMARK_SERVER_TOKEN`)

### Sentry

- [ ] Project created in Sentry dashboard
- [ ] DSN copied to Vercel (`SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`)
- [ ] Auth token added for source map upload (`SENTRY_AUTH_TOKEN`)
- [ ] Alert rules configured for new issues

---

## Section 3 — Deployment

- [ ] Merge `main` to production branch (or deploy `main` directly)
- [ ] Vercel deploy completes without build errors
- [ ] All 71 routes compiled in Vercel build log
- [ ] No unexpected static/dynamic route misclassification
- [ ] Instrumentation runs without `[env] Missing required` errors in function logs

---

## Section 4 — Post-Deployment Verification

### Health Check

```bash
curl https://gunimi.com/api/health
```

Expected:
```json
{
  "status": "ok",
  "checks": {
    "supabase": true,
    "openai": true,
    "upstash": true,
    "email": true
  }
}
```

- [ ] `/api/health` returns `{ "status": "ok" }` with HTTP 200
- [ ] All four dependency probes return `true`
- [ ] `status: "degraded"` must be investigated and resolved before user traffic

---

## Section 5 — Browser Verification

Open Chrome DevTools on each page. Verify zero errors in Console tab.

### Console (Gate 4)

| Page | Console Errors | Hydration Errors | MISSING_MESSAGE | Result |
|---|---|---|---|---|
| `/dashboard` (Today) | | | | |
| `/dashboard/deals` | | | | |
| `/dashboard/deals/[id]` | | | | |
| `/dashboard/contacts` | | | | |
| `/dashboard/contacts/[id]` | | | | |
| `/dashboard/companies` | | | | |
| `/dashboard/tasks` | | | | |
| `/dashboard/settings` | | | | |
| `/dashboard/ai` | | | | |
| `/dashboard/admin/ai` | | | | |
| `/orbit-control` | | | | |

- [ ] All pages: 0 console errors
- [ ] All pages: 0 hydration errors
- [ ] All pages: 0 `MISSING_MESSAGE` locale warnings
- [ ] All pages: 0 CSP violations

---

## Section 6 — Network Verification

Open Chrome DevTools → Network tab. Navigate all routes.

### Network (Gate 5)

- [ ] 0 × HTTP 500
- [ ] 0 × HTTP 404 (on API routes and assets)
- [ ] 0 × failed fetch calls
- [ ] 0 × aborted non-navigation requests

---

## Section 7 — Runtime Verification

### Server Logs (Gate 6)

Check Vercel → Functions logs after running the smoke test.

- [ ] 0 unhandled exceptions
- [ ] 0 unhandled rejections
- [ ] 0 PGRST116 errors
- [ ] 0 ReferenceError / TypeError
- [ ] No `[env] Missing required` in startup logs

### Sentry Dashboard

- [ ] Sentry receiving events (send a test error or verify session replay starts)
- [ ] No unexpected error spikes after first page load
- [ ] Error rate baseline established

---

## Section 8 — Smoke Tests (Gate 7)

Execute every workflow. Mark PASS or FAIL.

| # | Workflow | Result | Notes |
|---|---|---|---|
| 1 | Register new account | | |
| 2 | Login | | |
| 3 | Logout | | |
| 4 | Create Workspace | | |
| 5 | Today Experience loads | | |
| 6 | Create Company | | |
| 7 | Edit Company | | |
| 8 | Create Contact | | |
| 9 | Edit Contact | | |
| 10 | Create Deal | | |
| 11 | Edit Deal | | |
| 12 | Deal Workspace | | |
| 13 | Contact Workspace | | |
| 14 | Create Task | | |
| 15 | Complete Task | | |
| 16 | Settings Save | | |
| 17 | Workspace Invite | | |
| 18 | AI Chat | | |
| 19 | Admin Control | | |

- [ ] All 19 workflows: PASS

---

## Section 9 — Email Verification

### Postmark (Transactional)

- [ ] Send a workspace invite → email arrives in recipient inbox
- [ ] Check Postmark Activity dashboard: invite appears as delivered
- [ ] Bounce/spam rate < 5%

### Contact Form

- [ ] Submit contact form → email arrives at `SUPPORT_EMAIL` inbox
- [ ] Check Postmark Activity: contact message appears as delivered

### Supabase Auth (Registration / Password Reset)

- [ ] Register a new account → confirmation email received
- [ ] Use forgot password → reset email received
- [ ] Note: these emails are controlled by Supabase Auth settings, not Postmark

---

## Section 10 — Rollback Plan

If any critical issue is found post-deployment:

1. **Vercel instant rollback**: Vercel dashboard → Deployments → previous deployment → Promote
2. **Database**: Supabase has point-in-time recovery. If a migration caused data issues, open a Supabase support ticket immediately.
3. **Trigger rollback if**:
   - `/api/health` returns `status: "degraded"`
   - Authentication is broken (users cannot log in)
   - Data corruption detected
   - Unhandled exception rate > 1% of requests

See `docs/production/rollback.md` for detailed rollback procedures.

---

## Release Approval

Before opening alpha access to users, confirm:

- [ ] Sections 1–7 all checked
- [ ] Section 8 smoke tests all PASS
- [ ] Section 9 email delivery confirmed
- [ ] Sentry active and receiving events
- [ ] Rollback plan understood and ready
- [ ] Support email inbox monitored

**Approved by**: ___________________
**Date**: ___________________
**Commit SHA**: ___________________

---

*Document version: 1.0*
*Created: 2026-07-10*

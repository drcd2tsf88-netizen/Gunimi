# Deployment Guide

## Overview

Gunimi deploys to **Vercel** (Next.js 16) with **Supabase** as the database/auth backend.

---

## Pre-deployment checklist

- [ ] All environment variables set in Vercel (see `environment-variables.md`)
- [ ] `npm run lint` — zero errors
- [ ] `npm run type-check` — zero errors
- [ ] `npm run build` — successful
- [ ] Supabase RLS enabled on all tables
- [ ] `OAUTH_STATE_SECRET` rotated from any dev value
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is **not** prefixed with `NEXT_PUBLIC_`
- [ ] Sentry DSN configured and source maps uploading

---

## First deploy

1. Push `main` branch to GitHub
2. Connect repo in Vercel dashboard
3. Set all required environment variables
4. Vercel auto-detects Next.js — no framework configuration needed
5. Deploy

---

## Supabase setup

1. Run all migrations from `supabase/migrations/` in order via Supabase SQL Editor
2. Promote admin user: copy `supabase/seed.sql.example` → `supabase/seed.sql`, set email, run in SQL Editor
3. Enable Google/Microsoft OAuth providers in Supabase Auth settings if using calendar/email integrations

---

## DNS (gunimi.com via Cloudflare)

1. Add domain in Vercel → Project → Domains
2. Set Cloudflare DNS: CNAME `@` → `cname.vercel-dns.com`, **proxy OFF** (gray cloud)
3. Vercel handles TLS automatically via Let's Encrypt

---

## Post-deploy verification

```bash
curl https://gunimi.com/api/health
# Expected: { "status": "ok", ... }
```

Check all dependency probes return `true`. A `"degraded"` status with HTTP 503 means a required service is unreachable.

---

## Rollback

See `rollback.md`.

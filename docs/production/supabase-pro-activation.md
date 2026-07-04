# Supabase Pro Activation Guide

## When to upgrade

Upgrade to Supabase Pro when:
- Monthly active users exceed the free tier limit (50k MAU)
- Database size exceeds 500 MB
- You need daily backups (Pro provides 7-day PITR)
- You need PgBouncer connection pooling for direct pg connections

The Gunimi JS SDK uses PostgREST (REST API), not raw pg connections, so PgBouncer is **not required** for the current architecture.

---

## Pre-upgrade checklist

- [ ] Billing information added to Supabase organization
- [ ] All RLS policies verified — run the RLS audit query below
- [ ] `SUPABASE_SERVICE_ROLE_KEY` stored only in server-side env vars

### RLS audit query
```sql
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

All tables should show `rowsecurity = true`.

---

## Post-upgrade steps

1. Enable **Point-in-Time Recovery** in Supabase dashboard → Database → Backups
2. Enable **PgBouncer** if adding raw pg connections (add `SUPABASE_DB_POOLER_URL` env var)
3. Set up **Read Replicas** if needed (enterprise tier)
4. Configure **Network Restrictions** in Supabase dashboard to restrict by IP if possible

---

## Connection pooling

If you add direct PostgreSQL access in future (e.g., for complex migrations or analytics queries):

1. Get the pooler connection string from Supabase dashboard → Database → Connection Pooling
2. Add to Vercel: `SUPABASE_DB_POOLER_URL=postgresql://...`
3. Use `DB_CONFIG.dbPoolerUrl` from `lib/db/config.ts` for direct connections

Do **not** use `DB_CONFIG.dbUrl` (direct connection) from serverless functions — it will exhaust connection limits. Always use the pooler URL.

---

## Is the platform production-ready after only infrastructure configuration?

**YES** — provided all environment variables from `environment-variables.md` are configured correctly and Supabase Pro is activated:

- Auth: Supabase JWT + HMAC OAuth state ✓
- Database: RLS on all 23 tables, NOT NULL constraints enforced ✓
- Security: Service role key server-only, no PII in Sentry ✓
- Branding: Gunimi brand throughout ✓
- Monitoring: `/api/health` endpoint, Sentry error tracking ✓
- Env validation: Fails loudly on startup if config missing ✓
- Emails: Resend with `RESEND_FROM_EMAIL` override ✓

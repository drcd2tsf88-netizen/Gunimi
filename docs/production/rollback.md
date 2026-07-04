# Rollback Procedures

## Application rollback (Vercel)

Vercel keeps all previous deployments. To roll back:

1. Vercel dashboard → Project → Deployments
2. Find the last known-good deployment
3. Click `...` → **Promote to Production**

The rollback is instant (no redeploy required). Previous deployment URL remains active.

---

## Database rollback (Supabase)

### Supabase Pro (PITR enabled)

1. Supabase dashboard → Database → Backups → Point-in-Time Recovery
2. Select the timestamp to restore to
3. Confirm restore — this creates a new database branch or replaces current

### Free tier (no PITR)

Daily backups only. To restore:
1. Supabase dashboard → Database → Backups
2. Download SQL dump
3. Restore to a new Supabase project
4. Update `NEXT_PUBLIC_SUPABASE_URL` and keys in Vercel to point to new project

---

## Migration rollback

Supabase migrations in `supabase/migrations/` are forward-only by convention.

For emergency rollback of a specific migration:
1. Write a new migration that reverses the change
2. Name it with the next timestamp: `supabase/migrations/YYYYMMDDHHMMSS_revert_description.sql`
3. Run it in Supabase SQL Editor

---

## Environment variable rollback

If a bad env var was deployed:
1. Vercel → Settings → Environment Variables → edit the bad value
2. Vercel → Deployments → Redeploy the current deployment (picks up new env vars)

---

## Emergency contacts

- Supabase status: https://status.supabase.com
- Vercel status: https://www.vercel-status.com
- Resend status: https://resend-status.com

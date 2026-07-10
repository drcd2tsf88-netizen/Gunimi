# Operations Runbook

## Health check

```bash
curl https://gunimi.com/api/health | jq .
```

Expected response (all healthy):
```json
{
  "status": "ok",
  "version": "0.1.0-alpha",
  "commit": "abc1234",
  "env": "production",
  "checks": {
    "supabase": true,
    "openai": true,
    "upstash": true,
    "email": true
  }
}
```

---

## Common incidents

### Supabase check failing

1. Check Supabase status page
2. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct in Vercel
3. Check Supabase project is not paused (free tier pauses after inactivity)
4. Check RLS policies haven't locked out the anon key

### Auth broken (users can't log in)

1. Verify Supabase Auth is enabled
2. Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Verify `proxy.ts` is not blocking the `/login` route
4. Check Supabase Auth → Logs for error details

### Rate limiting too aggressive

Upstash Redis controls write rate limits. If legitimate users are being blocked:
1. Check Upstash console for Redis key patterns `rl:*`
2. Increase limits in the `checkWriteRateLimit` utility
3. In an emergency, flush the rate limit keys: `DEL rl:*` in Upstash console

### Email not sending

1. Verify `POSTMARK_SERVER_TOKEN` is set
2. Check Postmark dashboard → Activity for delivery errors
3. Verify `EMAIL_FROM` domain is verified in Postmark → Sender Signatures

### Environment validation failure on startup

If you see `[env] Missing required environment variables` in Vercel function logs:
1. Check all variables in `lib/server/env.ts` REQUIRED array are set in Vercel
2. Redeploy after adding missing variables

---

## Monitoring

- **Sentry**: Error tracking with 10% trace sampling in production
- **Health endpoint**: `/api/health` — use Vercel Cron or external monitor (UptimeRobot) to ping every 5 minutes
- **Vercel Analytics**: Enabled by default on Vercel deployments

---

## Logs

Vercel function logs: Vercel dashboard → Project → Functions tab

Supabase logs: Supabase dashboard → Logs → API / Auth / Database

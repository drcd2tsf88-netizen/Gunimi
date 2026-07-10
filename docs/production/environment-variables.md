# Environment Variables

All variables must be set in **Vercel → Project → Settings → Environment Variables**.

---

## Required (deployment fails without these)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key — **server-side only, never expose to client** |
| `NEXT_PUBLIC_APP_URL` | Canonical app URL, e.g. `https://gunimi.com` |
| `OAUTH_STATE_SECRET` | 32+ char random secret for HMAC-SHA256 OAuth state signing |

Generate `OAUTH_STATE_SECRET`:
```bash
openssl rand -base64 32
```

---

## Email (Postmark)

| Variable | Description | Default |
|---|---|---|
| `POSTMARK_SERVER_TOKEN` | Postmark Server API token | — (email disabled) |
| `EMAIL_FROM` | FROM address | `Gunimi <noreply@gunimi.com>` |
| `SUPPORT_EMAIL` | Support contact | `support@gunimi.com` |

---

## AI (OpenAI)

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key for Orbit Intelligence features |

---

## Rate Limiting (Upstash Redis)

| Variable | Description |
|---|---|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |

---

## Error Tracking (Sentry)

| Variable | Description |
|---|---|
| `SENTRY_DSN` | Sentry DSN — server-side (not public) |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN — client-side |
| `SENTRY_AUTH_TOKEN` | Sentry auth token for source map upload (build time) |

---

## Calendar / Email OAuth (optional)

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

---

## Build / Release (Vercel auto-injects)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` | Git commit SHA (auto) |
| `VERCEL_ENV` | `production` / `preview` / `development` (auto) |
| `NEXT_BUILD_TIMESTAMP` | Optional — set in `vercel.json` buildCommand |

---

## Local Development

Copy `.env.local.example` to `.env.local` and fill in values. Never commit `.env.local`.

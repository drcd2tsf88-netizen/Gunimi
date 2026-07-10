// Startup environment validation — called from instrumentation.ts on Node.js boot.
// Missing required variables throw immediately so the deploy fails loudly rather
// than silently serving broken responses.

const REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_APP_URL",
  "OAUTH_STATE_SECRET",
] as const;

const OPTIONAL_WARN = [
  "POSTMARK_SERVER_TOKEN",
  "EMAIL_FROM",
  "OPENAI_API_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "SENTRY_DSN",
  "NEXT_PUBLIC_SENTRY_DSN",
  "SUPPORT_EMAIL",
] as const;

export function validateEnv(): void {
  const missing = REQUIRED.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `[env] Missing required environment variables:\n  ${missing.join("\n  ")}\n` +
        "Set them in .env.local (dev) or Vercel Environment Variables (prod)."
    );
  }

  const warned = OPTIONAL_WARN.filter((key) => !process.env[key]);
  if (warned.length > 0) {
    console.warn(
      `[env] Optional environment variables not set (some features may be disabled):\n  ${warned.join(", ")}`
    );
  }
}

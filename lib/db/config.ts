// ============================================================
// Gunimi — Database Connection Configuration
//
// CONNECTION MODEL
//
// The Supabase JavaScript SDK (@supabase/supabase-js) communicates
// via the REST API (PostgREST), NOT raw PostgreSQL connections.
// This means:
//
//   - PgBouncer is NOT required for SDK-based operations.
//   - PostgREST manages its own internal connection pool to Postgres.
//   - The pool size is configured in Supabase → Settings → API.
//
// Raw pg:// connections are only needed for:
//   - Direct SQL (Drizzle ORM, Prisma, node-postgres)
//   - Supabase CLI migrations
//   - Diagnostic / admin scripts
//
// ENABLING PGROUTER / VISOR (when ready)
//
// Supabase provides a transaction-mode pooler (Supabase Visor) at:
//   postgresql://postgres.[project]:[password]@[region].pooler.supabase.com:6543/postgres
//
// To enable it:
//   1. Turn on "Connection Pooling" in Supabase → Settings → Database
//   2. Set SUPABASE_DB_POOLER_URL in Vercel environment variables
//   3. Any code using raw pg:// should prefer SUPABASE_DB_POOLER_URL
//      for serverless contexts and SUPABASE_DB_URL for long-lived processes.
//
// The SDK URL (NEXT_PUBLIC_SUPABASE_URL) never changes — it is always
// the REST API endpoint, regardless of pooler configuration.
// ============================================================

export const DB_CONFIG = {
  // REST API endpoint — used by @supabase/supabase-js (SDK)
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,

  // Public anon key — safe to expose in browser (RLS enforced)
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

  // Service role key — server-side only, bypasses RLS
  // Never expose this to the client
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,

  // Direct PostgreSQL connection (non-pooled, port 5432)
  // Use for: Supabase CLI migrations, long-lived server processes
  // Not currently used by the application — reserved for future direct-SQL needs
  dbUrl: process.env.SUPABASE_DB_URL ?? null,

  // Transaction-mode pooler connection (port 6543)
  // Use for: serverless functions requiring raw pg:// connections
  // Not currently used by the application — reserved for future direct-SQL needs
  dbPoolerUrl: process.env.SUPABASE_DB_POOLER_URL ?? null,
} as const;

/**
 * Asserts that all required database configuration is present.
 * Call this during application startup for early failure detection.
 */
export function assertDbConfig(): void {
  const missing: string[] = [];
  if (!DB_CONFIG.supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!DB_CONFIG.supabaseAnonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!DB_CONFIG.supabaseServiceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length > 0) {
    throw new Error(
      `Database configuration error — missing environment variables: ${missing.join(", ")}`
    );
  }
}

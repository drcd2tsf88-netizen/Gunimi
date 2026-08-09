import { headers } from "next/headers";

// Reads the x-rate-limited header injected by the middleware (proxy.ts).
// Returns false when the current user has exceeded the write rate limit,
// so the action can return null without touching the database.
export async function checkWriteRateLimit(): Promise<boolean> {
  const h = await headers();
  return h.get("x-rate-limited") !== "1";
}

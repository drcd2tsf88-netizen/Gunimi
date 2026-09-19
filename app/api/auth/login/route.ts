import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { sendSecurityAlert } from "@/lib/email/sendSecurityAlert";
import { logger } from "@/lib/logger";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  prefix: "gunimi:login",
});

const ALERT_THRESHOLD = 3;

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// POST /api/auth/login?action=check — rate limit check before Supabase auth
// POST /api/auth/login?action=fail  — report a failed attempt (triggers alert)
export async function POST(req: NextRequest) {
  try {
    const action = req.nextUrl.searchParams.get("action") ?? "check";
    const ip = getIP(req);

    if (action === "check") {
      const { success, reset } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "too_many_attempts" },
          {
            status: 429,
            headers: { "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)) },
          }
        );
      }
      return NextResponse.json({ allowed: true });
    }

    if (action === "fail") {
      const body = await req.json().catch(() => ({}));
      const email = (body as { email?: string }).email ?? "unknown";

      const failKey = `gunimi:login:fails:${ip}`;
      const fails = await redis.incr(failKey);
      await redis.expire(failKey, 15 * 60);

      if (fails === ALERT_THRESHOLD) {
        const timestamp = new Date().toLocaleString("en-GB", {
          timeZone: "Europe/Prague",
          dateStyle: "full",
          timeStyle: "short",
        });
        sendSecurityAlert({ email, ip, attempts: fails, timestamp }).catch((err) =>
          logger.error("[security-alert] send failed:", err)
        );
      }

      return NextResponse.json({ recorded: true });
    }

    return NextResponse.json({ error: "unknown_action" }, { status: 400 });
  } catch (err) {
    logger.error("[api/auth/login] error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

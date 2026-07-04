import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { APP_VERSION, GIT_COMMIT, BUILD_TIMESTAMP, ENVIRONMENT } from "@/lib/version";

// Lightweight dependency probes — each returns true/false within a short timeout
async function probeSupabase(): Promise<boolean> {
  try {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    // A lightweight auth health check that doesn't require a real session
    const { error } = await client.auth.getSession();
    return !error;
  } catch {
    return false;
  }
}

async function probeOpenAI(): Promise<boolean> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function probeUpstash(): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;
  try {
    const res = await fetch(`${url}/ping`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function probeResend(): Promise<boolean> {
  return !!process.env.RESEND_API_KEY;
}

export async function GET() {
  const [supabase, openai, upstash, email] = await Promise.all([
    probeSupabase(),
    probeOpenAI(),
    probeUpstash(),
    probeResend(),
  ]);

  const allHealthy = supabase && openai && upstash && email;

  const body = {
    status: allHealthy ? "ok" : "degraded",
    version: APP_VERSION,
    commit: GIT_COMMIT,
    built: BUILD_TIMESTAMP,
    env: ENVIRONMENT,
    checks: {
      supabase,
      openai,
      upstash,
      email,
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, { status: allHealthy ? 200 : 503 });
}

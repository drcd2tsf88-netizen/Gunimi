#!/usr/bin/env node
// Environment variable gate — verifies required vars are set.
// Loads .env.local automatically when run locally.
// Exits 1 if any REQUIRED variable is missing.

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Load .env.local for local development runs
const envLocal = resolve(ROOT, ".env.local");
if (existsSync(envLocal)) {
  for (const line of readFileSync(envLocal, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (key && !process.env[key]) {
      process.env[key] = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
}

const REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_APP_URL",
  "OAUTH_STATE_SECRET",
];

const OPTIONAL = [
  "POSTMARK_SERVER_TOKEN",
  "EMAIL_FROM",
  "OPENAI_API_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "SENTRY_DSN",
  "NEXT_PUBLIC_SENTRY_DSN",
  "SUPPORT_EMAIL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "SENTRY_AUTH_TOKEN",
];

const missingRequired = REQUIRED.filter((k) => !process.env[k]);
const missingOptional = OPTIONAL.filter((k) => !process.env[k]);

if (missingRequired.length > 0) {
  console.error(`\n[env] FAIL — Missing REQUIRED variables (${missingRequired.length}):`);
  missingRequired.forEach((k) => console.error(`  ✗ ${k}`));
}

if (missingOptional.length > 0) {
  console.warn(`\n[env] WARN — Missing optional variables (${missingOptional.length}):`);
  missingOptional.forEach((k) => console.warn(`  - ${k}`));
}

if (missingRequired.length === 0) {
  if (missingOptional.length === 0) {
    console.log("[env] PASS — All environment variables present.");
  } else {
    console.log(`[env] PASS — All required variables present. ${missingOptional.length} optional var(s) missing (features may be degraded).`);
  }
  process.exit(0);
} else {
  process.exit(1);
}

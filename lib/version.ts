// Release metadata — exposed through /api/health and /api/version

export const APP_VERSION = "0.1.0-alpha";

// Vercel injects NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA automatically
export const GIT_COMMIT =
  (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "local").slice(0, 7);

// Set NEXT_BUILD_TIMESTAMP in vercel.json buildCommand or CI to capture build time
export const BUILD_TIMESTAMP =
  process.env.NEXT_BUILD_TIMESTAMP ?? new Date().toISOString();

export const ENVIRONMENT =
  (process.env.VERCEL_ENV as "production" | "preview" | "development" | undefined) ??
  (process.env.NODE_ENV === "production" ? "production" : "development");

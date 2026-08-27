export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Turbopack dev mode creates many concurrent SSR requests, each attaching
    // close listeners to ServerResponse. Raise the limit to silence false-positive
    // MaxListenersExceededWarning — not a real leak, just dev-mode concurrency.
    const { EventEmitter } = await import("events");
    EventEmitter.defaultMaxListeners = 30;

    await import("./sentry.server.config");
    const { validateEnv } = await import("./lib/server/env");
    validateEnv();
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export { captureRequestError as onRequestError } from "@sentry/nextjs";

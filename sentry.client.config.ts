import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: isProd ? 0.1 : 1.0,

  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: isProd ? 0.05 : 0.0,

  integrations: [
    Sentry.replayIntegration({
      // Mask all text/inputs to avoid capturing PII in session replays
      maskAllText: true,
      blockAllMedia: false,
    }),
  ],

  debug: false,
});

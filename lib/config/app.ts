// ──────────────────────────────────────────────────────────────
// Gunimi — Application Branding & Configuration Constants
//
// All user-facing strings, URLs, and email addresses are
// centralised here. Change this file to update the entire app.
// ──────────────────────────────────────────────────────────────

export const APP_CONFIG = {
  name: "Gunimi",
  tagline: "Every client. Always remembered.",
  description: "Gunimi watches your clients and tells you what needs attention today, before a deal goes cold. Free during Open Alpha.",

  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://gunimi.com",

  email: {
    from: process.env.EMAIL_FROM ?? "Gunimi <noreply@gunimi.com>",
    support: process.env.SUPPORT_EMAIL ?? "support@gunimi.com",
    noreply: "noreply@gunimi.com",
  },

  social: {
    twitter: "@gunimi_app",
  },

  legal: {
    company: "Gunimi",
    year: "2026",
  },
} as const;

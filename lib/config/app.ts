// ──────────────────────────────────────────────────────────────
// Gunimi — Application Branding & Configuration Constants
//
// All user-facing strings, URLs, and email addresses are
// centralised here. Change this file to update the entire app.
// ──────────────────────────────────────────────────────────────

export const APP_CONFIG = {
  name: "Gunimi",
  tagline: "AI Workspace Operating System",
  description: "AI-powered workspace for teams — manage relationships, knowledge, and communication in one place.",

  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://gunimi.com",

  email: {
    // Transactional FROM address — set RESEND_FROM_EMAIL in Vercel to override
    from: process.env.RESEND_FROM_EMAIL ?? "Gunimi <noreply@gunimi.com>",
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

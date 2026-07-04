import type { NextConfig }
from "next";

import { withSentryConfig }
from "@sentry/nextjs";

import createNextIntlPlugin
from "next-intl/plugin";

const withNextIntl =
  createNextIntlPlugin();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseWss = supabaseUrl.replace(/^https:\/\//, "wss://");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",

        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=()",
          },

          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';

              script-src
                'self'
                'unsafe-inline'
                'unsafe-eval';

              style-src
                'self'
                'unsafe-inline';

              img-src
                'self'
                data:
                blob:
                https:;

              font-src
                'self'
                data:;

              connect-src
                'self'
                ${supabaseUrl}
                ${supabaseWss}
                https://*.upstash.io
                https://*.sentry.io
                ${process.env.NODE_ENV === "development" ? "ws://localhost:3000 ws://127.0.0.1:3000" : ""};

              worker-src
                blob:
                'self';

              frame-ancestors 'none';

              base-uri 'self';

              form-action 'self';
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(
  withNextIntl(nextConfig),
  {
    silent: true,
    widenClientFileUpload: true,
  }
);

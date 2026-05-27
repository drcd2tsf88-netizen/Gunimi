import type { NextConfig }
from "next";

const nextConfig: NextConfig =
{
  async headers() {
    return [
      {
        source: "/(.*)",

        headers: [
          {
            key:
              "X-Frame-Options",

            value: "DENY",
          },

          {
            key:
              "X-Content-Type-Options",

            value:
              "nosniff",
          },

          {
            key:
              "Referrer-Policy",

            value:
              "strict-origin-when-cross-origin",
          },

          {
            key:
              "Permissions-Policy",

            value:
              "camera=(), microphone=(), geolocation=()",
          },

          {
            key:
              "Content-Security-Policy",

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
                https://urrpqkqwwgjpfccuodmo.supabase.co
                wss://urrpqkqwwgjpfccuodmo.supabase.co
                https://*.upstash.io
                ws://localhost:3000
                ws://127.0.0.1:3000;

              frame-ancestors 'none';

              base-uri 'self';

              form-action 'self';
            `
              .replace(
                /\s{2,}/g,
                " "
              )
              .trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
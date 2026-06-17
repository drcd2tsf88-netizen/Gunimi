"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        className="
          min-h-screen
          bg-black
          text-white
        "
        style={{ background: "#000", color: "#fff" }}
      >
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: "24px",
            padding: "32px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background:
                "linear-gradient(135deg, #7c3aed, #22d3ee)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              marginBottom: 8,
            }}
          >
            ✦
          </div>

          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              margin: 0,
            }}
          >
            Something went wrong
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 360,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            An unexpected error occurred. Our team has been notified
            automatically. You can try refreshing the page.
          </p>

          {error.digest && (
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.2)",
                fontFamily: "monospace",
                margin: 0,
              }}
            >
              {error.digest}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 8,
            }}
          >
            <button
              onClick={reset}
              style={{
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(124,58,237,0.3)",
                color: "#c4b5fd",
                padding: "10px 20px",
                borderRadius: 12,
                fontSize: 14,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Try again
            </button>

            <a
              href="/dashboard"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.6)",
                padding: "10px 20px",
                borderRadius: 12,
                fontSize: 14,
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Go to Dashboard
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}

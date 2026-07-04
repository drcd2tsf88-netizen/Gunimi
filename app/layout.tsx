import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/locales/en.json";
import { OrbitRuntimeProvider } from "@/core/runtime/OrbitRuntimeProvider";
import { APP_CONFIG } from "@/lib/config/app";
import CookieConsent from "@/components/public/CookieConsent";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_CONFIG.url),
  title: {
    default: APP_CONFIG.name,
    template: `%s — ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  openGraph: {
    type: "website",
    siteName: APP_CONFIG.name,
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    url: APP_CONFIG.url,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: APP_CONFIG.social.twitter,
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    images: ["/og-image.png"],
  },
  applicationName: APP_CONFIG.name,
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-black text-white`}
      >
        <NextIntlClientProvider locale="en" messages={messages}>
        <OrbitRuntimeProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background:
                  "rgba(10,15,31,0.92)",

                color: "#fff",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter:
                  "blur(24px)",

                borderRadius:
                  "20px",

                padding:
                  "16px 18px",

                fontSize:
                  "14px",
              },

              success: {
                iconTheme: {
                  primary:
                    "#8b5cf6",

                  secondary:
                    "#ffffff",
                },
              },

              error: {
                iconTheme: {
                  primary:
                    "#ef4444",

                  secondary:
                    "#ffffff",
                },
              },
            }}
          />

          {children}
          <CookieConsent />
        </OrbitRuntimeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
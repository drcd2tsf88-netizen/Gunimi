import "./globals.css";

import { Inter }
from "next/font/google";

import { Toaster }
from "react-hot-toast";

import { NextIntlClientProvider }
from "next-intl";

import messages
from "@/locales/en.json";

import {
  OrbitRuntimeProvider,
} from "@/core/runtime/OrbitRuntimeProvider";

import { SpeedInsights }
from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],

  display: "swap",

  preload: false,
});

export const metadata = {
  title: "OrbitDesk",

  description:
    "AI Business Operating System",
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
        </OrbitRuntimeProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { APP_CONFIG } from "@/lib/config/app";
import { MotionProvider, GenesisNavbar } from "@/components/genesis";
import { V13Hero } from "@/components/landing/v13/V13Hero";
import { V13Problem } from "@/components/landing/v13/V13Problem";
import { V13Features } from "@/components/landing/v13/V13Features";
import { V13Cta } from "@/components/landing/v13/V13Cta";
import { V13Footer } from "@/components/landing/v13/V13Footer";

export const metadata: Metadata = {
  title: { absolute: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}` },
  description: APP_CONFIG.description,
  openGraph: {
    title: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
    description: APP_CONFIG.description,
    type: "website",
    url: APP_CONFIG.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
    description: APP_CONFIG.description,
  },
};

export default function HomePage() {
  return (
    <MotionProvider>
      <main className="min-h-screen overflow-hidden bg-[#020307] text-[#F0F2FA]">
        <GenesisNavbar />
        <V13Hero />
        <V13Problem />
        <V13Features />
        <V13Cta />
        <V13Footer />
      </main>
    </MotionProvider>
  );
}

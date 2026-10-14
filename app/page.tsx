import type { Metadata } from "next";
import { APP_CONFIG } from "@/lib/config/app";
import dynamic from "next/dynamic";
import { MotionProvider, GenesisNavbar } from "@/components/genesis";
import { V13Hero } from "@/components/landing/v13/V13Hero";
import { V13Footer } from "@/components/landing/v13/V13Footer";

const V13Problem = dynamic(() => import("@/components/landing/v13/V13Problem").then((m) => ({ default: m.V13Problem })));
const V13Features = dynamic(() => import("@/components/landing/v13/V13Features").then((m) => ({ default: m.V13Features })));
const V13Cta = dynamic(() => import("@/components/landing/v13/V13Cta").then((m) => ({ default: m.V13Cta })));

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

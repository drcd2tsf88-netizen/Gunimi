import type { Metadata } from "next";
import { APP_CONFIG } from "@/lib/config/app";
import LandingFooter from "@/components/landing/LandingFooter";
import {
  MotionProvider,
  GenesisNavbar,
  GenesisHeroDuo,
  GenesisBridge,
  GenesisEmailMoment,
  GenesisActIV,
} from "@/components/genesis";

export const metadata: Metadata = {
  title: { absolute: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}` },
  description: APP_CONFIG.description,
};

export default function HomePage() {
  return (
    <MotionProvider>
      <main className="min-h-screen overflow-hidden bg-[var(--g-bg)] text-[var(--g-text)]">
        {/* Navigation */}
        <GenesisNavbar />

        {/* 1 — Two-panel hero: cosmic headline + CTA */}
        <GenesisHeroDuo />

        {/* 2 — Bridge: why this matters in 3 sentences */}
        <GenesisBridge />

        {/* 3 — Email moment: concrete proof of what Gunimi sees */}
        <GenesisEmailMoment />

        {/* 3 — Live demo: try it yourself */}
        <GenesisActIV />

        <LandingFooter />
      </main>
    </MotionProvider>
  );
}

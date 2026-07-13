import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingObservatory from "@/components/landing/LandingObservatory";
import LandingActivity from "@/components/landing/LandingActivity";
import LandingPricingButtons from "@/components/landing/LandingPircingButtons";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import { MotionProvider, GenesisNavbar, GenesisHero, GenesisActI, GenesisActII, GenesisActIII, GenesisActIV } from "@/components/genesis";

export default function HomePage() {
  return (
    <MotionProvider>
      <main className="min-h-screen overflow-hidden bg-[var(--g-bg)] text-[var(--g-text)]">
        {/* Navigation */}
        <GenesisNavbar />

        {/* 1 — Hero */}
        <GenesisHero />

        {/* 2 — Act I: the narrative transition */}
        <GenesisActI />

        {/* 3 — Act II: the fragmentation problem */}
        <GenesisActII />

        {/* 4 — Act III: the workspace awakens */}
        <GenesisActIII />

        {/* 5 — Act IV: the reveal */}
        <GenesisActIV />

        {/* 6 — Features: 11 intelligent modules */}
        <LandingFeatures />

        {/* 4 — AI Ecosystem: The intelligence layer */}
        <LandingObservatory />

        {/* 5 — Trust: Enterprise, security, privacy */}
        <LandingActivity />

        {/* 6 — Pricing */}
        <LandingPricingButtons />

        {/* 7 — Final CTA */}
        <LandingCTA />

        <LandingFooter />
      </main>
    </MotionProvider>
  );
}

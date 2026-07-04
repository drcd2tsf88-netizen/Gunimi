import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingWorkspacePreview from "@/components/landing/LandingWorkspacePreview";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingObservatory from "@/components/landing/LandingObservatory";
import LandingActivity from "@/components/landing/LandingActivity";
import LandingPricingButtons from "@/components/landing/LandingPircingButtons";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05060A] text-white">
      <LandingNavbar />

      {/* 1 — Hero: First impression, AI Core center stage */}
      <LandingHero />

      {/* 2 — Product Preview: Show the workspace early */}
      <LandingWorkspacePreview />

      {/* 3 — Features: 11 intelligent modules */}
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
  );
}

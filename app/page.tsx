import LandingNavbar
from "@/components/landing/LandingNavbar";

import LandingHero
from "@/components/landing/LandingHero";

import LandingObservatory
from "@/components/landing/LandingObservatory";

import LandingActivity
from "@/components/landing/LandingActivity";

import LandingFeatures
from "@/components/landing/LandingFeatures";

import LandingWorkspacePreview
from "@/components/landing/LandingWorkspacePreview";

import LandingCTA
from "@/components/landing/LandingCTA";

import LandingFooter
from "@/components/landing/LandingFooter";
import LandingPricingButtons from "@/components/landing/LandingPircingButtons"; 

export default function HomePage() {
  return (
    <main
      className="
        min-h-screen

        overflow-hidden

        bg-[#050816]

        text-white
      "
    >
      <LandingNavbar />

      <LandingHero />

      <LandingObservatory />

      <LandingActivity />

      <LandingFeatures />

      <LandingPricingButtons />

      <LandingWorkspacePreview />

      <LandingCTA />

      <LandingFooter />
    </main>
  );
}
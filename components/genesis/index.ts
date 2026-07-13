// ─────────────────────────────────────────────────────────────
// Genesis Runtime — barrel export
//
// Shared animation and layout infrastructure for Homepage,
// Genesis experience, and all future landing surfaces.
//
// Import from this barrel:
// import { Reveal, Section, SectionHeading } from "@/components/genesis";
// ─────────────────────────────────────────────────────────────

// Providers
export { MotionProvider } from "./MotionProvider";
export { ReducedMotionProvider, useReducedMotionContext } from "./ReducedMotionProvider";

// Animation primitives
export { FadeIn } from "./FadeIn";
export { Reveal } from "./Reveal";
export { Stagger, StaggerItem } from "./Stagger";

// Scroll
export { ScrollTimeline, useScrollTimeline } from "./ScrollTimeline";

// Layout
export { Section } from "./Section";
export { SectionContainer } from "./SectionContainer";
export { SectionHeading } from "./SectionHeading";

// Visual identity
export { AiCore } from "./AiCore";

// Surface components
export { GenesisNavbar } from "./GenesisNavbar";
export { GenesisHero } from "./GenesisHero";
export { GenesisActI } from "./GenesisActI";
export { GenesisActII } from "./GenesisActII";
export { GenesisActIII } from "./GenesisActIII";
export { GenesisActIV } from "./GenesisActIV";

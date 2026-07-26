"use client";

import { useTranslations } from "next-intl";
import { motion, useTransform, useReducedMotion } from "framer-motion";
import { Section } from "./Section";
import { SectionContainer } from "./SectionContainer";
import { ScrollTimeline, useScrollTimeline } from "./ScrollTimeline";
import { AiCore } from "./AiCore";
import { Reveal } from "./Reveal";
import DemoWorkspace from "@/components/demo/DemoWorkspace";

// ── AiCoreDissolveIV ──────────────────────────────────────────
// The conceptual AiCore dissolves as the product appears.
// Starts at the faint level left by Act III, slowly reaches 0.

function AiCoreDissolveIV() {
  const { scrollYProgress } = useScrollTimeline();
  const shouldReduceMotion = useReducedMotion();

  const opacity = useTransform(
    scrollYProgress,
    [0.0, 0.18, 0.42, 0.72, 1.0],
    [0.05, 0.07, 0.04, 0.01, 0.0],
  );

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      style={{ opacity, top: "26%" }}
    >
      <AiCore size={360} showRings showParticles={false} intensity="subtle" />
    </motion.div>
  );
}

// ── GenesisActIV ─────────────────────────────────────────────

export function GenesisActIV() {
  const t = useTranslations("landing.actIV");

  return (
    <Section id="the-reveal" ambient="none" className="pb-0">
      <ScrollTimeline className="relative w-full">

        {/* AiCore: conceptual dissolves as the product takes over */}
        <AiCoreDissolveIV />

        {/* ── Demo intro heading ───────────────────────────── */}
        <SectionContainer maxWidth="text" className="relative z-10 pb-14">

          <Reveal y={10} duration={0.7}>
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9AA3B2]/40">
              {t("eyebrow")}
            </p>
          </Reveal>

          <Reveal y={24} duration={1.1} delay={0.05}>
            <h2 className="text-[36px] font-bold leading-[1.05] tracking-[-0.04em] text-[var(--g-text)] md:text-[54px]">
              {t("beat1")}
            </h2>
          </Reveal>

          <Reveal y={14} duration={0.9} delay={0.18}>
            <p className="mt-4 text-[17px] leading-[1.6] text-[#9AA3B2] md:text-[19px]">
              {t("beat2")}
            </p>
          </Reveal>

        </SectionContainer>

        {/* ── Living Demo — edge-to-edge, Genesis dissolves into product */}
        <div className="relative z-10 md:-mx-20">
          <DemoWorkspace />
        </div>

      </ScrollTimeline>
    </Section>
  );
}

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

        {/* ── Text beats — constrained reading column ────────── */}
        <SectionContainer maxWidth="text" className="relative z-10">

          {/* Beat 1: acknowledging the journey */}
          <div className="pb-[16vh]">
            <Reveal y={22} duration={1.1}>
              <p className="text-[22px] font-semibold leading-[1.15] tracking-[-0.025em] text-[var(--g-text)] md:text-[32px]">
                {t("beat1")}
              </p>
            </Reveal>
          </div>

          {/* Beat 2: the invitation */}
          <div className="pb-[18vh]">
            <Reveal y={16} duration={1.0} delay={0.1}>
              <p className="text-[22px] font-semibold leading-[1.15] tracking-[-0.025em] text-[var(--g-text)] md:text-[32px]">
                {t("beat2")}
              </p>
            </Reveal>
          </div>

        </SectionContainer>

        {/* ── Living Demo — edge-to-edge, Genesis dissolves into product */}
        <div className="relative z-10 -mx-6 md:-mx-20">
          <DemoWorkspace />
        </div>

      </ScrollTimeline>
    </Section>
  );
}

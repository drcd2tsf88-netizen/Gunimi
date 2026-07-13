"use client";

import { useTranslations } from "next-intl";
import { motion, useTransform, useReducedMotion } from "framer-motion";
import { Section } from "./Section";
import { SectionContainer } from "./SectionContainer";
import { ScrollTimeline, useScrollTimeline } from "./ScrollTimeline";
import { AiCore } from "./AiCore";
import { FadeIn } from "./FadeIn";

// ── SceneReveal ────────────────────────────────────────────────
// A deeper viewport margin than the shared Reveal (-28% vs -15%)
// so each statement must enter further before it fires.
// Creates deliberate scroll pacing — the reader finishes one beat
// before the next begins.

interface SceneRevealProps {
  children: React.ReactNode;
  y?: number;
  duration?: number;
  className?: string;
}

function SceneReveal({
  children,
  y = 28,
  duration = 1.1,
  className,
}: SceneRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-28%" }}
      transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── AiCoreAmbient ──────────────────────────────────────────────
// Scroll-linked presence. Materialises as the user enters Act I,
// holds through the narrative, dissolves on exit.
// Not interactive — listens, does not perform.

function AiCoreAmbient() {
  const { scrollYProgress } = useScrollTimeline();

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.75, 1.0],
    [0, 0.11, 0.13, 0],
  );

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute hidden lg:block"
      style={{ opacity, right: -180, top: "32%" }}
    >
      <AiCore size={460} showRings showParticles={false} intensity="subtle" />
    </motion.div>
  );
}

// ── GenesisActI ────────────────────────────────────────────────

export function GenesisActI() {
  const t = useTranslations("landing.actI");

  return (
    <Section id="act-i" ambient="none">
      <ScrollTimeline className="relative w-full">

        {/* Listening presence — responds to how deep the user has read */}
        <AiCoreAmbient />

        {/* The Shift — a single signal that marks the threshold.
            Felt on entry, not consciously noticed. */}
        <div className="mb-12">
          <FadeIn duration={1.4}>
            <div
              aria-hidden="true"
              className="h-[5px] w-[5px] rounded-full"
              style={{
                background: "rgba(109,91,255,0.7)",
                boxShadow:
                  "0 0 8px rgba(109,91,255,0.5), 0 0 20px rgba(109,91,255,0.22)",
              }}
            />
          </FadeIn>
        </div>

        <SectionContainer maxWidth="text" className="relative z-10 pt-[10vh]">
          <div className="flex flex-col gap-[32vh]">

            {/* Statement 1 — The hook: an immediate, settled certainty */}
            <SceneReveal y={32} duration={1.1}>
              <p className="text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-[var(--g-text)] md:max-w-[440px] md:text-[42px]">
                {t("statement1")}
              </p>
            </SceneReveal>

            {/* Statement 2 — The context: intimate, almost a whisper */}
            <SceneReveal y={20} duration={0.95}>
              <p className="text-[16px] font-light leading-[1.75] tracking-[0em] text-[#9AA3B2] md:text-[19px]">
                {t("statement2")}
              </p>
            </SceneReveal>

            {/* Statement 3 — The resolution: short, direct, no qualifier */}
            <SceneReveal y={28} duration={1.1}>
              <p className="text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-[var(--g-text)] md:text-[38px]">
                {t("statement3")}
              </p>
            </SceneReveal>

          </div>
        </SectionContainer>

      </ScrollTimeline>
    </Section>
  );
}

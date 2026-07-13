"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  AnimatePresence,
  useTransform,
  useReducedMotion,
  useInView,
} from "framer-motion";
import { Section } from "./Section";
import { SectionContainer } from "./SectionContainer";
import { ScrollTimeline, useScrollTimeline } from "./ScrollTimeline";
import { AiCore } from "./AiCore";
import { Reveal } from "./Reveal";

// ── ObservationCycle ──────────────────────────────────────────
// Beats 2 & 3: one observation visible at any time.
// 4s interval, 500ms cross-fade via AnimatePresence mode="wait".
// Exit completes before enter begins — silence between each.
// Timer pauses when the component leaves the viewport.
// Reduced motion: all observations rendered statically.

interface ObservationCycleProps {
  observations: string[];
}

function ObservationCycle({ observations }: ObservationCycleProps) {
  const [idx, setIdx] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-20%", once: false });

  useEffect(() => {
    if (!isInView || shouldReduceMotion) return;
    const id = setInterval(() => {
      setIdx((prev) => (prev + 1) % observations.length);
    }, 4000);
    return () => clearInterval(id);
  }, [isInView, shouldReduceMotion, observations.length]);

  if (shouldReduceMotion) {
    return (
      <div className="flex flex-col gap-3 py-[8vh]">
        {observations.map((obs) => (
          <p
            key={obs}
            className="text-[17px] font-light leading-[1.5] text-[#9AA3B2] md:text-[20px]"
          >
            {obs}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="py-[14vh]">
      <div className="relative h-[2em]">
        <AnimatePresence mode="wait">
          <motion.p
            key={observations[idx]}
            className="absolute inset-x-0 text-[17px] font-light leading-[1.5] text-[#9AA3B2] md:text-[20px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.75, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {observations[idx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── AiCoreAmbientIII ──────────────────────────────────────────
// The workspace awakening. Slightly more present than Act II
// (peak 0.14 vs 0.10), coinciding with Beat 4 — "The workspace
// begins to understand." AiCore and statement arrive together.

function AiCoreAmbientIII() {
  const { scrollYProgress } = useScrollTimeline();
  const shouldReduceMotion = useReducedMotion();

  const opacity = useTransform(
    scrollYProgress,
    [0.0, 0.10, 0.38, 0.62, 0.78, 0.92, 1.0],
    [0,   0.04, 0.07, 0.11, 0.14, 0.09, 0.05],
  );

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      style={{ opacity, top: "72%" }}
    >
      <AiCore size={360} showRings showParticles={false} intensity="subtle" />
    </motion.div>
  );
}

// ── GenesisActIII ─────────────────────────────────────────────

export function GenesisActIII() {
  const t = useTranslations("landing.actIII");
  const observations = t.raw("observations") as string[];

  return (
    <Section id="act-iii" ambient="none">
      <ScrollTimeline className="relative w-full">

        {/* Workspace awakening — slightly more present than Act II */}
        <AiCoreAmbientIII />

        <SectionContainer maxWidth="text" className="relative z-10">

          {/* ── Beat 1 ────────────────────────────────────────────
              The consequence of a signal. The visitor witnessed
              the first signal in Act II — now: what changes? */}
          <div className="pb-[24vh]">
            <Reveal y={26} duration={1.2}>
              <p className="text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--g-text)] md:text-[42px]">
                {t("beat1")}
              </p>
            </Reveal>
          </div>

          {/* ── Beats 2 & 3 ───────────────────────────────────────
              Observations cycle one at a time. 4s per observation,
              500ms cross-fade. Exit completes before enter begins.
              No overlap. No notifications. Calm awareness. */}
          <div className="pb-[26vh]">
            <ObservationCycle observations={observations} />
          </div>

          {/* ── Beat 4 ────────────────────────────────────────────
              The naming of what is happening. Slightly smaller
              than Beats 1 and 5 — understanding is a process,
              not an announcement. AiCore peaks here. */}
          <div className="pb-[22vh]">
            <Reveal y={22} duration={1.2}>
              <p className="text-[26px] font-semibold leading-[1.12] tracking-[-0.025em] text-[var(--g-text)] md:text-[40px]">
                {t("beat4")}
              </p>
            </Reveal>
          </div>

          {/* ── Beat 5 ────────────────────────────────────────────
              The emotional turning point. Returns to Beat 1's full
              weight — this is not a summary, it is a shift in how
              the visitor understands what software can be. */}
          <Reveal y={14} duration={1.6}>
            <p className="text-[28px] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--g-text)] md:text-[42px]">
              {t("beat5")}
            </p>
          </Reveal>

        </SectionContainer>

      </ScrollTimeline>
    </Section>
  );
}

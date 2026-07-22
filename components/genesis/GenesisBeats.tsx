"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "./Section";
import { SectionContainer } from "./SectionContainer";

// ── BeatReveal ────────────────────────────────────────────────
// Each sentence gets its own scroll trigger so the reader
// processes one thought before the next arrives.
// Margin "-22%" means the sentence must travel a quarter of
// the viewport before it fires — enforcing deliberate pacing.

interface BeatRevealProps {
  children: React.ReactNode;
  y?: number;
  duration?: number;
  className?: string;
}

function BeatReveal({ children, y = 24, duration = 1.05, className }: BeatRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-22% 0px" }}
      transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Beat ──────────────────────────────────────────────────────
// Three sentences. One thought.
// Diagnosis → Explanation → Answer.
// No icons. No borders. No background. Only weight and air.

interface BeatProps {
  diagnosis:   string;
  explanation: string;
  answer:      string;
}

function Beat({ diagnosis, explanation, answer }: BeatProps) {
  return (
    <div className="flex flex-col gap-[18vh] md:gap-[22vh]">

      {/* Sentence 1 — Diagnosis. Short, settled, certain. */}
      <BeatReveal y={28} duration={1.1}>
        <p className="text-[26px] font-semibold leading-[1.12] tracking-[-0.03em] text-[var(--g-text)] md:text-[38px] lg:text-[44px]">
          {diagnosis}
        </p>
      </BeatReveal>

      {/* Sentence 2 — Explanation. Longer, quieter, honest. */}
      <BeatReveal y={18} duration={0.95}>
        <p className="text-[16px] font-light leading-[1.75] tracking-[0em] text-[#9AA3B2] md:text-[19px]">
          {explanation}
        </p>
      </BeatReveal>

      {/* Sentence 3 — Answer. The inevitable conclusion. Not a slogan. */}
      <BeatReveal y={22} duration={1.0}>
        <p
          className="text-[18px] font-semibold leading-[1.25] tracking-[-0.02em] md:text-[24px]"
          style={{ color: "#D8DDF8" }}
        >
          {answer}
        </p>
      </BeatReveal>

    </div>
  );
}

// ── GenesisBeats ──────────────────────────────────────────────
// The bridge between Genesis narrative and the Living Demo.
// Three truths about work. Arrived at, not announced.
// Placed between Act III (workspace awakens) and Act IV (demo).

export function GenesisBeats() {
  const t = useTranslations("landing.beats");

  return (
    <Section id="genesis-beats" ambient="none">
      <SectionContainer maxWidth="text">
        <div className="flex flex-col gap-[38vh]">

          <Beat
            diagnosis={t("b1diagnosis")}
            explanation={t("b1explanation")}
            answer={t("b1answer")}
          />

          <Beat
            diagnosis={t("b2diagnosis")}
            explanation={t("b2explanation")}
            answer={t("b2answer")}
          />

          <Beat
            diagnosis={t("b3diagnosis")}
            explanation={t("b3explanation")}
            answer={t("b3answer")}
          />

        </div>
      </SectionContainer>
    </Section>
  );
}

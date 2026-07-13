"use client";

import { useTranslations } from "next-intl";
import { motion, useTransform, useReducedMotion } from "framer-motion";
import { Section } from "./Section";
import { SectionContainer } from "./SectionContainer";
import { ScrollTimeline, useScrollTimeline } from "./ScrollTimeline";
import { AiCore } from "./AiCore";
import { FadeIn } from "./FadeIn";
import { Reveal } from "./Reveal";

// ── Beat 4 convergence offsets ─────────────────────────────────
// Matched positionally to fragment order in locale.
// Positive = drifts in from the right, negative = from the left.
// Small values: the drift is felt, not watched.
const BEAT4_OFFSETS = [-44, 30, -26, 50, -16, 36, -38, 20, -32, 14];

// ── ConvergingFragment ─────────────────────────────────────────
// A single fragment that slides toward x=0 as the user scrolls
// through ConvergenceCloud. Must live inside a ScrollTimeline.
// Hooks called unconditionally; reduced motion handled last.

interface ConvergingFragmentProps {
  word: string;
  xOffset: number;
}

function ConvergingFragment({ word, xOffset }: ConvergingFragmentProps) {
  const { scrollYProgress } = useScrollTimeline();
  const shouldReduceMotion = useReducedMotion();

  const x = useTransform(scrollYProgress, [0.1, 0.72], [xOffset, 0]);
  const opacity = useTransform(
    scrollYProgress,
    [0.0, 0.18, 0.65, 0.9],
    [0, 0.54, 0.72, 0.48],
  );

  if (shouldReduceMotion) {
    return (
      <span className="text-[14px] font-medium tracking-[0.04em] text-[#9AA3B2] opacity-[0.58] md:text-[16px]">
        {word}
      </span>
    );
  }

  return (
    <motion.span
      className="inline-block text-[14px] font-medium tracking-[0.04em] text-[#9AA3B2] md:text-[16px]"
      style={{ x, opacity }}
    >
      {word}
    </motion.span>
  );
}

// ── ConvergenceCloud ───────────────────────────────────────────
// Beat 4: the same fragments gathered into a loose cluster,
// each holding a horizontal offset that resolves to 0 as the
// user scrolls. The fragments appear to drift toward each other.
// Uses its own ScrollTimeline so progress is local to this cloud.

interface ConvergenceCloudProps {
  fragments: string[];
}

function ConvergenceCloud({ fragments }: ConvergenceCloudProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="flex flex-wrap gap-x-8 gap-y-4 py-[6vh]">
        {fragments.map((word) => (
          <span
            key={word}
            className="text-[14px] font-medium tracking-[0.04em] text-[#9AA3B2] opacity-[0.58] md:text-[16px]"
          >
            {word}
          </span>
        ))}
      </div>
    );
  }

  return (
    <ScrollTimeline className="flex flex-wrap justify-center gap-x-8 gap-y-5 py-[12vh]">
      {fragments.map((word, i) => (
        <ConvergingFragment
          key={word}
          word={word}
          xOffset={BEAT4_OFFSETS[i] ?? 0}
        />
      ))}
    </ScrollTimeline>
  );
}

// ── AiCoreAmbientII ────────────────────────────────────────────
// The invisible center the fragments drift toward.
// Nearly imperceptible through Beat 1–2, barely perceptible
// in Beat 3–4 (opacity peaks at 0.10), fades on exit.
// Centered so it sits behind the convergence point of the cloud.

function AiCoreAmbientII() {
  const { scrollYProgress } = useScrollTimeline();
  const shouldReduceMotion = useReducedMotion();

  const opacity = useTransform(
    scrollYProgress,
    [0.0, 0.12, 0.54, 0.72, 0.88, 1.0],
    [0,   0.04, 0.05, 0.10, 0.06, 0.03],
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

// ── GenesisActII ───────────────────────────────────────────────

export function GenesisActII() {
  const t = useTranslations("landing.actII");
  const fragments = t.raw("fragments") as string[];

  return (
    <Section id="first-signal" ambient="none">
      <ScrollTimeline className="relative w-full">

        {/* The invisible center — grows barely perceptible as fragments gather */}
        <AiCoreAmbientII />

        <SectionContainer maxWidth="text" className="relative z-10">

          {/* ── Beat 1 ────────────────────────────────────────────
              Opening statement. Settled, not aggressive.
              Sets the register for everything that follows. */}
          <div className="pb-[22vh]">
            <Reveal y={28} duration={1.2}>
              <p className="text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--g-text)] md:text-[42px]">
                {t("beat1")}
              </p>
            </Reveal>
          </div>

          {/* ── Beat 2 ────────────────────────────────────────────
              Fragments surface individually as the user scrolls.
              Light weight, muted — present but not demanding.
              gap-[8vh] ensures each appears in its own moment. */}
          <div className="flex flex-col gap-[8vh] pb-[24vh]">
            {fragments.map((fragment) => (
              <FadeIn key={fragment} duration={0.7}>
                <span className="text-[17px] font-light leading-none tracking-[-0.005em] text-[#9AA3B2] md:text-[21px]">
                  {fragment}
                </span>
              </FadeIn>
            ))}
          </div>

          {/* ── Beat 3 ────────────────────────────────────────────
              The realization: they are real, but separate.
              Slightly smaller than Beat 1 — not a second claim,
              a quiet observation that lands harder for its calm. */}
          <div className="pb-[24vh]">
            <Reveal y={24} duration={1.1}>
              <p className="text-[24px] font-semibold leading-[1.12] tracking-[-0.025em] text-[var(--g-text)] md:text-[38px]">
                {t("beat3")}
              </p>
            </Reveal>
          </div>

          {/* ── Beat 4 ────────────────────────────────────────────
              The same fragments, now gathering.
              No UI, no dashboard — only the motion of words
              finding their way toward a center that isn't named.
              The AiCore at 0.10 opacity is that center. */}
          <div className="pb-[18vh]">
            <ConvergenceCloud fragments={fragments} />
          </div>

          {/* ── Beat 5 ────────────────────────────────────────────
              The observation: something emerged.
              Arrives quietly — smaller than Beat 1 because this is
              not a claim, it's a witnessed moment.
              "A pattern forms." */}
          <div className="pb-[20vh]">
            <Reveal y={20} duration={1.2}>
              <p className="text-[22px] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--g-text)] md:text-[34px]">
                {t("beat5")}
              </p>
            </Reveal>
          </div>

          {/* ── Beat 6 ────────────────────────────────────────────
              The naming: what the pattern is.
              Returns to Beat 1's full weight because this sentence
              is not a conclusion — it's a declaration.
              The visitor has now experienced the first signal
              before Gunimi is ever mentioned.
              "That is the first signal." */}
          <Reveal y={14} duration={1.6}>
            <p className="text-[28px] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--g-text)] md:text-[42px]">
              {t("beat6")}
            </p>
          </Reveal>

        </SectionContainer>

      </ScrollTimeline>
    </Section>
  );
}

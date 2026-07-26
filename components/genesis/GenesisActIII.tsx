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

// ── Signal card data shape ─────────────────────────────────────
interface SignalData {
  dot: string;
  title: string;
  context: string;
  detail: string;
}

const DOT_COLORS: Record<string, string> = {
  amber: "bg-amber-400",
  red: "bg-red-400",
  green: "bg-emerald-400",
  blue: "bg-blue-400",
};

// ── SignalCardCycle ────────────────────────────────────────────
// One signal card visible at a time. 3.5s interval, 400ms cross-
// fade via AnimatePresence mode="wait". Timer pauses when the
// component leaves the viewport. Reduced motion: all cards shown
// as a static list.

interface SignalCardCycleProps {
  cards: SignalData[];
}

function SignalCardCycle({ cards }: SignalCardCycleProps) {
  const [idx, setIdx] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-20%", once: false });

  useEffect(() => {
    if (!isInView || shouldReduceMotion) return;
    const id = setInterval(() => {
      setIdx((prev) => (prev + 1) % cards.length);
    }, 3500);
    return () => clearInterval(id);
  }, [isInView, shouldReduceMotion, cards.length]);

  if (shouldReduceMotion) {
    return (
      <div className="flex flex-col gap-3 py-[8vh]">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-white/[0.08] bg-[#080910] p-5"
          >
            <SignalCardContent card={card} />
          </div>
        ))}
      </div>
    );
  }

  const card = cards[idx];
  if (!card) return null;

  return (
    <div ref={ref} className="py-[10vh]">
      <div className="relative min-h-[90px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-white/[0.08] bg-[#080910] p-5"
          >
            <SignalCardContent card={card} />
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Pip indicators */}
      <div className="mt-4 flex gap-1.5">
        {cards.map((_, i) => (
          <div
            key={i}
            className={[
              "h-1 rounded-full transition-all duration-500",
              i === idx
                ? "w-5 bg-white/40"
                : "w-1.5 bg-white/[0.12]",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}

function SignalCardContent({ card }: { card: SignalData }) {
  const dotClass = DOT_COLORS[card.dot] ?? "bg-zinc-400";
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
      <div>
        <p className="text-[14px] font-semibold leading-snug text-white/90">{card.title}</p>
        <p className="mt-0.5 text-[12px] text-white/40">{card.context}</p>
        <p className="mt-1 text-[11px] text-white/25">{card.detail}</p>
      </div>
    </div>
  );
}

// ── AiCoreAmbientIII ──────────────────────────────────────────

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
  const cards = t.raw("signals") as SignalData[];

  return (
    <Section id="act-iii" ambient="none">
      <ScrollTimeline className="relative w-full">

        <AiCoreAmbientIII />

        <SectionContainer maxWidth="text" className="relative z-10">

          {/* Beat 1: what Gunimi does */}
          <div className="pb-[12vh]">
            <Reveal y={26} duration={1.2}>
              <p className="text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--g-text)] md:text-[42px]">
                {t("beat1")}
              </p>
            </Reveal>
          </div>

          {/* Signal cards cycle — replaces ObservationCycle */}
          <div className="pb-[12vh]">
            <SignalCardCycle cards={cards} />
          </div>

          {/* Beat 5: the payoff */}
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

"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Section } from "./Section";
import { SectionContainer } from "./SectionContainer";
import { AiCore } from "./AiCore";
import { Reveal } from "./Reveal";
import { FadeIn } from "./FadeIn";

export function GenesisHero() {
  const t = useTranslations("landing.hero");
  const principles = t.raw("trustSignals") as string[];

  return (
    <Section
      id="hero"
      fullHeight
      ambient="none"
      className="bg-[var(--g-bg)]"
    >
      {/* ── Mobile: AiCore centered background — hidden on desktop ── */}
      <FadeIn
        duration={1.6}
        className="pointer-events-none absolute inset-0 flex items-center justify-center lg:hidden"
      >
        <AiCore size={500} showRings showParticles intensity="subtle" />
      </FadeIn>

      {/* ── Horizon glow ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(109,91,255,0.18), transparent)",
        }}
      />

      {/* ── mt-[50px] shifts content below visual center — gives navbar breathing room ── */}
      <SectionContainer
        maxWidth="wide"
        className="relative z-10 mt-[50px] w-full"
      >
        <div
          className="flex flex-col items-center gap-16 text-center
                     lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:text-left"
        >
          {/* ── Text column ── */}
          <div className="flex w-full flex-col items-center gap-10 lg:max-w-[500px] lg:shrink-0 lg:items-start">

            {/* ── Badge + Headline: tight group so badge reads as headline context ── */}
            <div className="flex flex-col items-center gap-4 lg:items-start">

              {/* 1 — Badge */}
              <FadeIn delay={0} duration={0.4}>
                <div
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1",
                    "border border-[rgba(255,255,255,0.1)] bg-[var(--g-surface)]",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--g-success)]"
                  />
                  <span className="text-[11px] font-medium tracking-[0.08em] text-[#9AA3B2]">
                    {t("badge")}
                  </span>
                </div>
              </FadeIn>

              {/* 2 — H1 Headline */}
              <div className="flex flex-col gap-1">
                <Reveal delay={0.2} duration={0.8} y={20}>
                  <h1 className="text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--g-text)] md:text-[52px] md:tracking-[-0.025em]">
                    {t("headlineLine1")}
                  </h1>
                </Reveal>
                <Reveal delay={0.32} duration={0.8} y={20}>
                  {/* Line 2 in text-2 (#C8CDD8) — cadence without gradient */}
                  <span className="block text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--g-text-2)] md:text-[52px] md:tracking-[-0.025em]">
                    {t("headlineLine2")}
                  </span>
                </Reveal>
              </div>
            </div>

            {/* 3 — Product sentence */}
            <Reveal delay={0.5} duration={0.8} y={14}>
              <p className="max-w-[28rem] text-[17px] leading-[1.65] text-[var(--g-text-2)] md:text-[18px]">
                {t("productSentenceLine1")}{" "}
                <span className="text-[#9AA3B2]">{t("productSentenceLine2")}</span>
              </p>
            </Reveal>

            {/* ── Descriptor + CTA: tight group — descriptor qualifies the action ── */}
            <div className="flex flex-col items-center gap-5 lg:items-start">

              {/* 4 — Descriptor */}
              <FadeIn delay={0.7} duration={0.6}>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#9AA3B2]">
                  {t("descriptor")}
                </p>
              </FadeIn>

              {/* 5 — CTAs */}
              <Reveal delay={0.9} duration={0.6} y={8}>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4 lg:items-start">
                  <Link
                    href="/register"
                    className={cn(
                      "inline-flex items-center justify-center rounded-[12px] px-6 py-3",
                      "bg-[var(--g-primary)] text-[15px] font-medium text-white",
                      "transition-colors duration-150 hover:bg-[var(--g-primary-2)]",
                      "outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g-bg)]",
                    )}
                  >
                    {t("ctaPrimary")}
                  </Link>
                  <Link
                    href="/sign-in"
                    className={cn(
                      "inline-flex items-center justify-center rounded-[12px] px-6 py-3",
                      "text-[15px] font-medium text-[#9AA3B2]",
                      "transition-colors duration-150 hover:text-[var(--g-text)]",
                      "outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g-bg)]",
                    )}
                  >
                    {t("ctaSecondary")}
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* 6 — Principles */}
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6 lg:items-start">
              {principles.map((principle, i) => (
                <FadeIn key={principle} delay={1.1 + i * 0.08} duration={0.4}>
                  <span className="flex items-center gap-1.5 text-[12px] text-[#9AA3B2]">
                    <span
                      aria-hidden="true"
                      className="h-[3px] w-[3px] rounded-full bg-current opacity-50"
                    />
                    <span className="opacity-60">{principle}</span>
                  </span>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* ── AiCore column — desktop only, 800px (+8% from 740) ── */}
          <FadeIn
            duration={1.6}
            className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center"
          >
            <AiCore size={800} showRings showParticles intensity="subtle" showImpulse />
          </FadeIn>
        </div>
      </SectionContainer>
    </Section>
  );
}

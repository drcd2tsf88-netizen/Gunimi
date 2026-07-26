"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { AiCore } from "./AiCore";
import { FadeIn } from "./FadeIn";
import { Reveal } from "./Reveal";

// ── GenesisHeroDuo ────────────────────────────────────────────
// Full-viewport two-panel hero.
//
// Left (60%): Cosmic ambient + AiCore orbit + aspirational headline
//             from landing.cta — emotional anchor: "Your business,
//             at full intelligence."
//
// Right (40%): Functional hero — badge, direct headline, product
//              sentence, CTAs from landing.hero.
//
// Mobile: Panels stack vertically. Left collapses to a shorter
//         cosmic header; right holds the CTA below it.
//
// Narrative arc: top = clarity (right panel tells you what it is),
//                bottom = conviction (live demo seals it).

export function GenesisHeroDuo() {
  const tc = useTranslations("landing.cta");
  const th = useTranslations("landing.hero");
  const principles = th.raw("trustSignals") as string[];

  return (
    <section
      className="relative flex min-h-dvh flex-col overflow-hidden bg-[var(--g-bg)] lg:flex-row"
      aria-label="hero"
    >
      {/* ══ LEFT PANEL — cosmic / aspirational ═══════════════ */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden px-8 py-28 text-center lg:min-h-dvh lg:w-[58%] lg:flex-row lg:items-center lg:px-12 lg:py-0 lg:text-left">

        {/* Ambient glow layer */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-[38%] h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(ellipse, rgba(109,91,255,0.13) 0%, transparent 58%)",
              filter: "blur(90px)",
            }}
          />
          <div
            className="absolute bottom-[-10%] right-[-5%] h-[420px] w-[420px]"
            style={{
              background:
                "radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 65%)",
              filter: "blur(110px)",
            }}
          />
          {/* Vertical divider — desktop only */}
          <div
            aria-hidden="true"
            className="absolute inset-y-[10%] right-0 hidden w-px lg:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(109,91,255,0.18) 40%, rgba(109,91,255,0.18) 60%, transparent)",
            }}
          />
        </div>

        {/* ── Text sub-column (left half of left panel) ── */}
        <div className="relative z-10 flex flex-col items-center gap-6 lg:flex-1 lg:items-start">
          <Reveal delay={0.1} duration={1.1} y={28}>
            <h1
              className="text-[44px] font-bold leading-[0.93] tracking-[-0.052em] text-[#F7F8FC] sm:text-[56px] lg:text-[60px]"
            >
              {tc("headlineLine1")}
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #A998FF 0%, #F7F8FC 45%, #22D3EE 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {tc("headlineLine2")}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.4} duration={0.9} y={14}>
            <p className="max-w-[30ch] text-[14px] leading-[1.7] text-[#9AA3B2] lg:text-[15px]">
              {tc("subtitle")}
            </p>
          </Reveal>
        </div>

        {/* ── AiCore sub-column (right half of left panel) — always visible ── */}
        <FadeIn
          duration={1.8}
          className="pointer-events-none mt-10 flex shrink-0 items-center justify-center lg:mt-0 lg:w-[280px]"
        >
          <AiCore
            size={340}
            showRings
            showParticles={false}
            intensity="subtle"
            showImpulse
          />
        </FadeIn>
      </div>

      {/* ══ RIGHT PANEL — functional / CTA ═══════════════════ */}
      <div className="relative flex flex-col items-center justify-center border-t border-white/[0.05] px-8 py-16 lg:min-h-dvh lg:w-[42%] lg:shrink-0 lg:border-l lg:border-t-0 lg:px-14 lg:py-0 lg:items-start">
        <div className="flex w-full max-w-[400px] flex-col gap-8">

          {/* Badge */}
          <FadeIn delay={0.2} duration={0.5}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-[var(--g-surface)] px-3 py-1.5">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--g-success)]"
              />
              <span className="text-[11px] font-medium tracking-[0.08em] text-[#9AA3B2]">
                {th("badge")}
              </span>
            </div>
          </FadeIn>

          {/* Direct headline */}
          <div className="flex flex-col gap-0.5">
            <Reveal delay={0.35} duration={0.8} y={18}>
              <h2 className="text-[24px] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--g-text)] sm:text-[30px]">
                {th("headlineLine1")}
              </h2>
            </Reveal>
            <Reveal delay={0.45} duration={0.8} y={18}>
              <span className="block text-[24px] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--g-text-2)] sm:text-[30px]">
                {th("headlineLine2")}
              </span>
            </Reveal>
          </div>

          {/* Product sentence */}
          <Reveal delay={0.58} duration={0.7} y={12}>
            <p className="text-[15px] leading-[1.7] text-[var(--g-text-2)]">
              {th("productSentenceLine1")}{" "}
              <span className="text-[#9AA3B2]">{th("productSentenceLine2")}</span>
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={0.72} duration={0.6} y={8}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className={cn(
                  "inline-flex flex-1 items-center justify-center rounded-[12px] px-6 py-3",
                  "bg-[var(--g-primary)] text-[15px] font-medium text-white",
                  "transition-colors duration-150 hover:bg-[var(--g-primary-2)]",
                  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g-bg)]",
                )}
              >
                {th("ctaPrimary")}
              </Link>
              <Link
                href="/login"
                className={cn(
                  "inline-flex flex-1 items-center justify-center rounded-[12px] px-6 py-3",
                  "text-[15px] font-medium text-[#9AA3B2]",
                  "border border-white/[0.08]",
                  "transition-colors duration-150 hover:border-white/[0.16] hover:text-[var(--g-text)]",
                  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g-bg)]",
                )}
              >
                {th("ctaSecondary")}
              </Link>
            </div>
          </Reveal>

          {/* Alpha note */}
          <FadeIn delay={0.88} duration={0.5}>
            <p className="text-[11px] font-medium tracking-[0.06em] text-[#9AA3B2]/45">
              {th("alphaNote")}
            </p>
          </FadeIn>

          {/* Trust signals */}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-5">
            {principles.map((principle, i) => (
              <FadeIn key={principle} delay={0.98 + i * 0.08} duration={0.4}>
                <span className="flex items-center gap-1.5 text-[12px] text-[#9AA3B2]">
                  <span
                    aria-hidden="true"
                    className="h-[3px] w-[3px] shrink-0 rounded-full bg-current opacity-40"
                  />
                  <span className="opacity-55">{principle}</span>
                </span>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

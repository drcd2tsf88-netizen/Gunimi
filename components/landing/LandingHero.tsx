"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AiCore from "@/components/ui/AiCore";

// ─────────────────────────────────────────────────────────────
// LandingHero — Cinematic first impression. GDL v1.0.
// AI Core is the visual center. Whitespace. Confidence.
// Apple-style: short, declarative, unmistakable.
// ─────────────────────────────────────────────────────────────

const TRUST_SIGNALS = [
  "SOC 2 Type II",
  "End-to-end encrypted",
  "GDPR compliant",
];

export default function LandingHero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-32 md:px-12">

      {/* ── DEEP SPACE BACKGROUND ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Primary nebula — top center */}
        <div
          className="absolute left-1/2 top-[-10%] h-[800px] w-[800px] -translate-x-1/2"
          style={{
            background: "radial-gradient(ellipse, rgba(109,91,255,0.12) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />

        {/* AI accent nebula — bottom right */}
        <div
          className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px]"
          style={{
            background: "radial-gradient(ellipse, rgba(34,211,238,0.05) 0%, transparent 65%)",
            filter: "blur(100px)",
          }}
        />

        {/* Horizon glow — bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background: "linear-gradient(to right, transparent, rgba(109,91,255,0.15), transparent)",
          }}
        />
      </div>

      {/* ── AI CORE — the visual center ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 opacity-35 sm:top-[10%] sm:opacity-40"
      >
        <AiCore size={640} showRings showParticles intensity="subtle" />
      </motion.div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 mx-auto max-w-6xl text-center">

        {/* EYEBROW BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="
            mx-auto mb-12 flex w-fit items-center gap-2
            rounded-full border border-[#6D5BFF]/[0.18]
            bg-[rgba(109,91,255,0.06)] px-5 py-2.5
            text-[11.5px] font-medium uppercase tracking-[0.14em] text-[#A998FF]
            backdrop-blur-xl
          "
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22c55e]" />
          AI Workspace Operating System
        </motion.div>

        {/* HEADLINE */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[18ch] text-[52px] font-bold leading-[0.92] tracking-[-0.055em] text-[#F7F8FC] md:text-[88px]"
        >
          Your business,
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #A998FF 0%, #F7F8FC 50%, #22D3EE 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            fully intelligent.
          </span>
        </motion.h1>

        {/* SUBTITLE */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-10 max-w-[52ch] text-[16px] leading-[1.65] text-[#9AA3B2] md:text-[18px]"
        >
          Gunimi unifies your relationships, deals, tasks, and knowledge
          into a single workspace — with AI that actually understands your business.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          {/* Primary */}
          <Link
            href="/register"
            className="
              group relative flex items-center gap-2.5 overflow-hidden
              rounded-[14px] border border-[#6D5BFF]/30 bg-[#6D5BFF]
              px-8 py-4 text-[14px] font-semibold text-white
              shadow-[0_0_28px_rgba(109,91,255,0.42),0_4px_16px_rgba(109,91,255,0.30)]
              transition-all duration-300
              hover:bg-[#7B6BFF]
              hover:shadow-[0_0_48px_rgba(109,91,255,0.58),0_8px_24px_rgba(109,91,255,0.36)]
              hover:scale-[1.02] active:scale-[0.99]
            "
          >
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_55%)]" />
            <span className="relative z-10">Start for free</span>
            <ArrowRight size={15} className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          {/* Secondary */}
          <Link
            href="/login"
            className="
              flex items-center gap-2
              rounded-[14px] border border-white/[0.08]
              bg-white/[0.03] px-8 py-4
              text-[14px] font-medium text-[#9AA3B2]
              backdrop-blur-xl transition-all duration-300
              hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-[#F7F8FC]
            "
          >
            Sign in to workspace
          </Link>
        </motion.div>

        {/* TRUST SIGNALS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.52, duration: 0.8 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6"
        >
          {TRUST_SIGNALS.map((s) => (
            <div key={s} className="flex items-center gap-2 text-[12px] text-[#9AA3B2]/45">
              <span className="h-1 w-1 rounded-full bg-[#9AA3B2]/30" />
              {s}
            </div>
          ))}
        </motion.div>

      </div>

      {/* ── SCROLL FADE — connects to next section ── */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#05060A] to-transparent" />
    </section>
  );
}

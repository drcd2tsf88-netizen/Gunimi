"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import AiCore from "@/components/ui/AiCore";

export default function WaitlistPage() {
  const t = useTranslations("public.waitlist");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05060A] px-6 py-12 text-white">

      {/* DEEP SPACE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/4"
          style={{
            background: "radial-gradient(ellipse, rgba(109,91,255,0.09), transparent 65%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute bottom-[-80px] right-[-60px] h-[400px] w-[400px]"
          style={{
            background: "radial-gradient(circle, rgba(109,91,255,0.04), transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* AMBIENT AI CORE */}
      <div className="pointer-events-none absolute left-1/2 top-[8%] -translate-x-1/2 opacity-[0.07]">
        <AiCore size={560} showRings showParticles={false} intensity="subtle" />
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/[0.055] bg-[#0A0E17] p-10 text-center shadow-[0_8px_60px_rgba(109,91,255,0.14)]"
      >
        {/* TOP SHEEN */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />
        {/* INNER AMBIENT */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at top, rgba(109,91,255,0.07), transparent 55%)" }}
        />

        <div className="relative z-10">

          {/* FOCAL VISUAL */}
          <div className="mb-7 flex justify-center">
            <motion.div
              animate={{ scale: [0.97, 1.03, 0.97], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <AiCore size={100} showRings showParticles intensity="strong" />
            </motion.div>
          </div>

          {/* BADGE */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8B7DFF]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8B7DFF]">
              {t("badgeLabel")}
            </span>
          </div>

          {/* TITLE */}
          <h1 className="mx-auto mt-7 max-w-[440px] text-[40px] font-bold leading-[1] tracking-[-0.04em] text-[#F7F8FC] md:text-[52px]">
            {t("headlinePart1")}{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #A998FF 0%, #F7F8FC 50%, #22D3EE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("headlinePart2")}
            </span>
          </h1>

          {/* SUBTITLE */}
          <p className="mx-auto mt-5 max-w-[380px] text-[15px] leading-[1.65] text-[#9AA3B2]">
            {t("subtitle")}
          </p>

          {/* PRIMARY CTA */}
          <Link
            href="/register"
            className="group relative mt-9 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-[12px] border border-[#6D5BFF]/30 bg-[#6D5BFF] text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(109,91,255,0.40)] transition-all duration-300 hover:bg-[#7B6BFF] hover:shadow-[0_0_32px_rgba(109,91,255,0.55)]"
          >
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.10),transparent_55%)]" />
            <span className="relative z-10">{t("ctaButton")}</span>
            <ArrowRight size={14} className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          {/* SECONDARY ACTIONS */}
          <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-[12px] border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-[13px] font-medium text-[#9AA3B2] transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-[#F7F8FC]"
            >
              {t("ctaSecondary")}
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-[12px] border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-[13px] font-medium text-[#9AA3B2] transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-[#F7F8FC]"
            >
              {t("backToHome")}
            </Link>
          </div>

          {/* FOOTER NOTE */}
          <p className="mt-9 border-t border-white/[0.04] pt-7 text-[12px] leading-relaxed text-[#9AA3B2]/35">
            {t("footerNote")}
          </p>

        </div>
      </motion.div>
    </main>
  );
}

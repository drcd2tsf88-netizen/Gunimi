"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import AiCore from "@/components/ui/AiCore";

export default function LandingCTA() {
  const t = useTranslations("landing.cta");
  const statusItems = t.raw("statusItems") as string[];

  return (
    <section className="relative overflow-hidden px-6 py-36 md:px-12">

      {/* DEEP SPACE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-[-5%] h-[700px] w-[700px] -translate-x-1/2"
          style={{ background: "radial-gradient(ellipse, rgba(109,91,255,0.14) 0%, transparent 60%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-[-15%] right-[-5%] h-[500px] w-[500px]"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 65%)", filter: "blur(100px)" }}
        />
        <div
          className="absolute left-0 right-0 top-0 h-[1px]"
          style={{ background: "linear-gradient(to right, transparent, rgba(109,91,255,0.12), transparent)" }}
        />
      </div>

      {/* AI Core — large, centered behind content — hidden on mobile to prevent overflow */}
      <div className="pointer-events-none absolute left-1/2 top-[-10%] hidden -translate-x-1/2 opacity-25 md:block">
        <AiCore size={680} showRings showParticles intensity="subtle" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-5xl text-center"
      >

        {/* AI CORE — small centered above headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex justify-center"
        >
          <AiCore size={100} showRings showParticles intensity="strong" />
        </motion.div>

        {/* HEADLINE */}
        <h2 className="text-[48px] font-bold leading-[0.92] tracking-[-0.055em] text-[#F7F8FC] md:text-[80px]">
          {t("headlineLine1")}
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #A998FF 0%, #F7F8FC 45%, #22D3EE 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("headlineLine2")}
          </span>
        </h2>

        {/* SUBTITLE */}
        <p className="mx-auto mt-10 max-w-[46ch] text-[16px] leading-[1.65] text-[#9AA3B2] md:text-[18px]">
          {t("subtitle")}
        </p>

        {/* CTAs */}
        <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="
              group relative flex items-center gap-2.5 overflow-hidden
              rounded-[14px] border border-[#6D5BFF]/30 bg-[#6D5BFF]
              px-9 py-4 text-[15px] font-semibold text-white
              shadow-[0_0_36px_rgba(109,91,255,0.48),0_6px_20px_rgba(109,91,255,0.32)]
              transition-all duration-300
              hover:bg-[#7B6BFF]
              hover:shadow-[0_0_56px_rgba(109,91,255,0.62),0_8px_28px_rgba(109,91,255,0.38)]
              hover:scale-[1.02] active:scale-[0.99]
            "
          >
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.14),transparent_55%)]" />
            <span className="relative z-10">{t("ctaPrimary")}</span>
            <ArrowRight size={16} className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/login"
            className="
              flex items-center gap-2
              rounded-[14px] border border-white/[0.08]
              bg-white/[0.03] px-9 py-4
              text-[15px] font-medium text-[#9AA3B2]
              backdrop-blur-xl transition-all duration-300
              hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-[#F7F8FC]
            "
          >
            {t("ctaSecondary")}
          </Link>
        </div>

        {/* STATUS LINE */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          {statusItems.map((s) => (
            <span key={s} className="flex items-center gap-1.5 text-[12px] text-[#9AA3B2]/40">
              <span className="h-1 w-1 rounded-full bg-[#9AA3B2]/30" />
              {s}
            </span>
          ))}
        </div>

      </motion.div>
    </section>
  );
}

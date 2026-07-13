"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LogOut, Shield, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import AiCore from "@/components/ui/AiCore";

export default function WaitlistPage() {
  const t = useTranslations("public.waitlist");
  const [checking, setChecking] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  async function handleCheckStatus() {
    setChecking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("platform_role")
        .eq("id", user.id)
        .maybeSingle();

      const role = (profile as { platform_role?: string } | null)?.platform_role;
      const isApproved = role === "beta" || role === "team" || role === "admin";

      if (isApproved) {
        toast.success(t("accessGranted"));
        window.location.href = "/register/setup";
      } else {
        toast(t("stillPending"));
      }
    } finally {
      setChecking(false);
    }
  }

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
        className="relative z-10 w-full max-w-[600px] overflow-hidden rounded-[28px] border border-white/[0.055] bg-[#0A0E17] p-10 text-center shadow-[0_8px_60px_rgba(109,91,255,0.14)]"
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
            <AiCore size={100} showRings showParticles intensity="strong" />
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
          <p className="mx-auto mt-5 max-w-[400px] text-[15px] leading-[1.65] text-[#9AA3B2]">
            {t("subtitle")}
          </p>

          {/* CHECK ACCESS — primary CTA */}
          <button
            type="button"
            onClick={handleCheckStatus}
            disabled={checking}
            className="group relative mt-9 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-[12px] border border-[#6D5BFF]/30 bg-[#6D5BFF] text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(109,91,255,0.40)] transition-all duration-300 hover:bg-[#7B6BFF] hover:shadow-[0_0_32px_rgba(109,91,255,0.55)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.10),transparent_55%)]" />
            <Sparkles size={14} className="relative z-10 shrink-0" />
            <span className="relative z-10">
              {checking ? t("checkingStatus") : t("checkStatusButton")}
            </span>
          </button>

          {/* STATUS PANEL */}
          <div className="mt-5 rounded-[14px] border border-[#6D5BFF]/[0.12] bg-[#6D5BFF]/[0.05] p-5">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#6D5BFF]/[0.14] bg-[#6D5BFF]/[0.08]">
                <Shield className="h-5 w-5 text-[#8B7DFF]" />
              </div>
              <div className="text-left">
                <h2 className="text-[15px] font-semibold text-[#F7F8FC]">{t("panelTitle")}</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-[#9AA3B2]">
                  {t("panelDescription")}
                </p>
              </div>
            </div>
          </div>

          {/* SECONDARY ACTIONS */}
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="group flex items-center justify-center gap-2 rounded-[12px] border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-[13px] font-medium text-[#9AA3B2] transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-[#F7F8FC]"
            >
              {t("backToHome")}
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-[12px] border border-red-500/[0.10] bg-red-500/[0.04] px-6 py-3 text-[13px] font-medium text-red-300/70 transition-all duration-300 hover:border-red-500/[0.18] hover:bg-red-500/[0.08] hover:text-red-300"
            >
              <LogOut size={14} />
              {t("signOut")}
            </button>
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

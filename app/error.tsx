"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import AiCore from "@/components/ui/AiCore";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("public.error");

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      console.error("[Gunimi Error]", error.digest ?? error.message);
    }
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#05060A] px-6 text-white">

      {/* DEEP SPACE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/4"
          style={{ background: "radial-gradient(ellipse, rgba(109,91,255,0.07), transparent 65%)", filter: "blur(80px)" }}
        />
      </div>

      {/* AI CORE — ambient */}
      <div className="pointer-events-none absolute left-1/2 top-[15%] -translate-x-1/2 opacity-[0.07]">
        <AiCore size={420} showRings showParticles={false} intensity="subtle" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-[480px] text-center">

        {/* ICON */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[22px] border border-red-500/[0.14] bg-red-500/[0.07]">
            <AlertTriangle size={32} className="text-red-400/80" />
          </div>
        </div>

        {/* LABEL */}
        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9AA3B2]/60">
            {t("label")}
          </span>
        </div>

        {/* HEADLINE */}
        <h1 className="text-[36px] font-bold leading-[1] tracking-[-0.03em] text-[#F7F8FC] md:text-[44px]">
          {t("headline")}
        </h1>
        <p className="mt-4 text-[15px] leading-[1.65] text-[#9AA3B2]">
          {t("description")}
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-[11px] text-[#9AA3B2]/30">
            ref: {error.digest}
          </p>
        )}

        {/* ACTIONS */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-[12px] border border-[#6D5BFF]/30 bg-[#6D5BFF] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(109,91,255,0.40)] transition-all duration-300 hover:bg-[#7B6BFF]"
          >
            <RotateCcw size={14} />
            {t("tryAgain")}
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-[12px] border border-white/[0.07] bg-white/[0.03] px-6 py-3 text-[14px] font-medium text-[#9AA3B2] transition-all duration-300 hover:border-white/[0.12] hover:text-[#C8CDD8]"
          >
            <Home size={14} />
            {t("home")}
          </Link>
        </div>
      </div>
    </main>
  );
}

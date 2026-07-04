import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { getTranslations } from "next-intl/server";
import AiCore from "@/components/ui/AiCore";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default async function NotFoundPage() {
  const t = await getTranslations("public.notFound");

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#05060A] px-6 text-white">

      {/* DEEP SPACE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/4"
          style={{ background: "radial-gradient(ellipse, rgba(109,91,255,0.08), transparent 65%)", filter: "blur(80px)" }}
        />
      </div>

      {/* AI CORE — ambient */}
      <div className="pointer-events-none absolute left-1/2 top-[15%] -translate-x-1/2 opacity-[0.08]">
        <AiCore size={480} showRings showParticles={false} intensity="subtle" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 text-center">

        {/* GLYPH */}
        <div className="mb-8 flex justify-center">
          <AiCore size={88} showRings showParticles intensity="strong" />
        </div>

        {/* LABEL */}
        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3 py-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8B7DFF]">
            {t("label")}
          </span>
        </div>

        {/* HEADLINE */}
        <h1 className="text-[48px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC] md:text-[68px]">
          {t("headline")}
        </h1>
        <p className="mt-3 text-[20px] font-medium tracking-[-0.02em] text-[#9AA3B2] md:text-[24px]">
          {t("subline")}
        </p>

        <p className="mx-auto mt-5 max-w-[36ch] text-[15px] leading-[1.65] text-[#9AA3B2]/60">
          {t("description")}
        </p>

        {/* ACTIONS */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-[12px] border border-[#6D5BFF]/30 bg-[#6D5BFF] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(109,91,255,0.40)] transition-all duration-300 hover:bg-[#7B6BFF] hover:shadow-[0_0_32px_rgba(109,91,255,0.55)]"
          >
            <Home size={15} />
            {t("returnHome")}
          </Link>
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 rounded-[12px] border border-white/[0.07] bg-white/[0.03] px-6 py-3 text-[14px] font-medium text-[#9AA3B2] transition-all duration-300 hover:border-white/[0.12] hover:text-[#C8CDD8]"
          >
            {t("goToWorkspace")}
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}

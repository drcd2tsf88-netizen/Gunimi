import type { Metadata } from "next";
import { Wrench } from "lucide-react";
import { getTranslations } from "next-intl/server";
import AiCore from "@/components/ui/AiCore";

export const metadata: Metadata = {
  title: "Maintenance",
  robots: { index: false, follow: false },
};

export default async function MaintenancePage() {
  const t = await getTranslations("public.maintenance");

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#05060A] px-6 text-white">

      {/* DEEP SPACE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/4"
          style={{ background: "radial-gradient(ellipse, rgba(109,91,255,0.09), transparent 65%)", filter: "blur(80px)" }}
        />
      </div>

      {/* AMBIENT AI CORE */}
      <div className="pointer-events-none absolute left-1/2 top-[12%] -translate-x-1/2 opacity-[0.08]">
        <AiCore size={500} showRings showParticles={false} intensity="subtle" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-[520px] text-center">

        {/* FOCAL */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <AiCore size={88} showRings showParticles={false} intensity="medium" />
            <div className="absolute -bottom-2 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-amber-500/[0.18] bg-[#0A0E17]">
              <Wrench size={13} className="text-amber-400/70" />
            </div>
          </div>
        </div>

        {/* BADGE */}
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-amber-500/[0.16] bg-amber-500/[0.07] px-3 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400/70" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-400/80">
            {t("badge")}
          </span>
        </div>

        {/* HEADLINE */}
        <h1 className="text-[40px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC] md:text-[56px]">
          {t("headline")}
        </h1>
        <p className="mt-4 text-[16px] leading-[1.65] text-[#9AA3B2]">
          {t("description")}
        </p>

        {/* STATUS */}
        <div className="mt-8 inline-flex items-center gap-3 rounded-[14px] border border-white/[0.055] bg-[#0A0E17] px-5 py-3.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400/70" />
          <span className="text-[13px] text-[#9AA3B2]">{t("statusLabel")}</span>
        </div>

        {/* CONTACT */}
        <p className="mt-8 text-[13px] text-[#9AA3B2]/45">
          {t("urgent")}{" "}
          <a
            href="mailto:support@gunimi.com"
            className="text-[#8B7DFF]/60 underline underline-offset-2 transition-colors hover:text-[#8B7DFF]"
          >
            support@gunimi.com
          </a>
        </p>
      </div>
    </main>
  );
}

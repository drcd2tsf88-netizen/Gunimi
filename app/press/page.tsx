import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PublicLayout from "@/components/public/PublicLayout";
import AiCore from "@/components/ui/AiCore";
import { Download, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Press — Gunimi",
  description: "Press kit, brand assets, and media contact for Gunimi.",
  openGraph: {
    title: "Press — Gunimi",
    description: "Press kit, brand assets, and media contact for Gunimi.",
    type: "website",
    url: "https://gunimi.com/press",
  },
};

type BrandColor = { name: string; hex: string; description: string };
type Fact = { label: string; value: string };

export default async function PressPage() {
  const t = await getTranslations("public.press");
  const brandColors = t.raw("brandColors") as BrandColor[];
  const facts = t.raw("facts") as Fact[];

  return (
    <PublicLayout>
      <div className="relative overflow-hidden">

        {/* AMBIENT */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2"
            style={{ background: "radial-gradient(ellipse, rgba(109,91,255,0.07), transparent 65%)", filter: "blur(80px)" }}
          />
        </div>

        {/* HERO */}
        <section className="relative mx-auto max-w-4xl px-6 pb-16 pt-24 text-center md:pt-32">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8B7DFF]">
              {t("badge")}
            </span>
          </div>
          <h1 className="text-[44px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC] md:text-[60px]">
            {t("headline")}
          </h1>
          <p className="mx-auto mt-5 max-w-[48ch] text-[16px] leading-[1.7] text-[#9AA3B2]">
            {t("subline")}
          </p>
        </section>

        <div className="relative mx-auto max-w-4xl space-y-8 px-6 pb-32">

          {/* BRAND MARK */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/[0.055] bg-[#0A0E17] p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
            <h2 className="mb-6 text-[16px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
              {t("brandmarkTitle")}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {/* DARK */}
              <div className="flex flex-col gap-4">
                <div className="flex h-36 items-center justify-center rounded-[16px] border border-white/[0.055] bg-[#05060A]">
                  <div className="flex items-center gap-2.5">
                    <AiCore size={32} showRings={false} showParticles={false} intensity="medium" />
                    <span className="text-[22px] font-bold tracking-[-0.04em] text-[#F7F8FC]">Gunimi</span>
                  </div>
                </div>
                <p className="text-center text-[12px] text-[#9AA3B2]/40">{t("brandmarkDarkLabel")}</p>
              </div>
              {/* LIGHT */}
              <div className="flex flex-col gap-4">
                <div className="flex h-36 items-center justify-center rounded-[16px] border border-black/10 bg-white">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-[#6D5BFF] opacity-90" />
                    <span className="text-[22px] font-bold tracking-[-0.04em] text-[#0A0E17]">Gunimi</span>
                  </div>
                </div>
                <p className="text-center text-[12px] text-[#9AA3B2]/40">{t("brandmarkLightLabel")}</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-[11px] border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-[13px] font-medium text-[#9AA3B2]/40"
              >
                <Download size={14} />
                {t("downloadAssetsLabel")}
              </button>
            </div>
          </div>

          {/* BRAND COLORS */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/[0.055] bg-[#0A0E17] p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
            <h2 className="mb-6 text-[16px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
              {t("brandColorsTitle")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {brandColors.map(({ name, hex, description }) => (
                <div
                  key={hex}
                  className="flex items-center gap-3 rounded-[12px] border border-white/[0.04] p-3"
                >
                  <div
                    className="h-9 w-9 shrink-0 rounded-[8px] border border-white/[0.06]"
                    style={{ backgroundColor: hex }}
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[#C8CDD8]">{name}</p>
                    <p className="font-mono text-[11px] text-[#9AA3B2]/50">{hex}</p>
                    <p className="text-[11px] text-[#9AA3B2]/40">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMPANY FACTS */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/[0.055] bg-[#0A0E17] p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
            <h2 className="mb-6 text-[16px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
              {t("companyTitle")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {facts.map(({ label, value }) => (
                <div key={label} className="rounded-[12px] border border-white/[0.04] p-4">
                  <p className="mb-1 text-[11px] uppercase tracking-[0.12em] text-[#9AA3B2]/50">{label}</p>
                  <p className="text-[15px] font-semibold text-[#F7F8FC]">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-white/[0.04] pt-6">
              <p className="text-[14px] leading-[1.7] text-[#9AA3B2]">
                {t("companyBody")}
              </p>
            </div>
          </div>

          {/* MEDIA CONTACT */}
          <div className="relative overflow-hidden rounded-[24px] border border-[#6D5BFF]/[0.10] bg-[#6D5BFF]/[0.04] p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6D5BFF]/[0.12] to-transparent" />
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] border border-[#6D5BFF]/[0.14] bg-[#6D5BFF]/[0.08] text-[#8B7DFF]">
                <Mail size={18} strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="mb-1 text-[16px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
                  {t("mediaContactTitle")}
                </h2>
                <p className="mb-4 text-[14px] text-[#9AA3B2]">
                  {t("mediaContactDescription")}
                </p>
                <a
                  href="mailto:press@gunimi.com"
                  className="text-[14px] font-medium text-[#8B7DFF]/70 underline underline-offset-2 transition-colors hover:text-[#8B7DFF]"
                >
                  press@gunimi.com
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}

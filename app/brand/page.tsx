import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PublicLayout from "@/components/public/PublicLayout";
import AiCore from "@/components/ui/AiCore";

export const metadata: Metadata = {
  title: "Brand — Gunimi",
  description: "Gunimi brand guidelines: logo, colors, typography, and voice.",
  openGraph: {
    title: "Brand — Gunimi",
    description: "Gunimi brand guidelines: logo, colors, typography, and voice.",
    type: "website",
    url: "https://gunimi.com/brand",
  },
};

type Swatch = { name: string; hex: string };
type ColorGroup = { group: string; swatches: Swatch[] };
type TypographyItem = { sample: string; size: string; weight: string; tracking: string; use: string };
type VoiceItem = { title: string; do: string; dont: string };

export default async function BrandPage() {
  const t = await getTranslations("public.brand");
  const colors = t.raw("colors") as ColorGroup[];
  const typography = t.raw("typography") as TypographyItem[];
  const voice = t.raw("voice") as VoiceItem[];

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

          {/* LOGOMARK */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/[0.055] bg-[#0A0E17] p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
            <h2 className="mb-6 text-[16px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
              {t("logomarkTitle")}
            </h2>
            <div className="flex flex-wrap items-center gap-10">
              <div className="flex items-center gap-3">
                <AiCore size={36} showRings={false} showParticles={false} intensity="strong" />
                <span className="text-[28px] font-bold tracking-[-0.04em] text-[#F7F8FC]">Gunimi</span>
              </div>
              <div className="text-[13px] leading-[1.8] text-[#9AA3B2]">
                <p>{t("logomarkBody")}</p>
                <p className="mt-1">{t("logomarkMinSize")}</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <div className="rounded-[10px] border border-emerald-500/[0.16] bg-emerald-500/[0.05] px-3.5 py-2 text-[12px] text-emerald-400/80">
                {t("logomarkCorrect")}
              </div>
              <div className="rounded-[10px] border border-red-500/[0.14] bg-red-500/[0.05] px-3.5 py-2 text-[12px] text-red-400/70">
                {t("logomarkIncorrect")}
              </div>
            </div>
          </div>

          {/* COLORS */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/[0.055] bg-[#0A0E17] p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
            <h2 className="mb-6 text-[16px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
              {t("colorSystemTitle")}
            </h2>
            <div className="space-y-6">
              {colors.map(({ group, swatches }) => (
                <div key={group}>
                  <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-[#9AA3B2]/50">{group}</p>
                  <div className="flex flex-wrap gap-3">
                    {swatches.map(({ name, hex }) => (
                      <div key={hex} className="flex items-center gap-3 rounded-[12px] border border-white/[0.04] p-3">
                        <div
                          className="h-9 w-9 rounded-[8px] border border-white/[0.06]"
                          style={{ backgroundColor: hex }}
                        />
                        <div>
                          <p className="text-[13px] font-medium text-[#C8CDD8]">{name}</p>
                          <p className="font-mono text-[11px] text-[#9AA3B2]/50">{hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TYPOGRAPHY */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/[0.055] bg-[#0A0E17] p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
            <h2 className="mb-6 text-[16px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
              {t("typographyTitle")}
            </h2>
            <div className="mb-5 text-[13px] text-[#9AA3B2]">
              {t("typefaceLabel")}{" "}
              <span className="font-medium text-[#C8CDD8]">{t("typefaceName")}</span>{" "}
              {t("typefaceDesc")}
            </div>
            <div className="space-y-6 divide-y divide-white/[0.04]">
              {typography.map(({ sample, size, weight, tracking, use }) => (
                <div key={use} className="pt-5 first:pt-0">
                  <p
                    className="mb-3 text-[#F7F8FC]"
                    style={{ fontSize: `clamp(14px, ${size}, ${size})`, fontWeight: 700, letterSpacing: tracking, lineHeight: 1.05 }}
                  >
                    {sample}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-[#9AA3B2]/50">
                    <span>{size}</span>
                    <span>{weight}</span>
                    <span>{t("trackingLabel")} {tracking}</span>
                    <span className="text-[#9AA3B2]/40">{use}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VOICE */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/[0.055] bg-[#0A0E17] p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
            <h2 className="mb-2 text-[16px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
              {t("voiceTitle")}
            </h2>
            <p className="mb-6 text-[14px] text-[#9AA3B2]">
              {t("voiceDescription")}
            </p>
            <div className="space-y-5">
              {voice.map(({ title, do: doText, dont }) => (
                <div key={title} className="rounded-[16px] border border-white/[0.04] p-5">
                  <p className="mb-3 text-[13px] font-semibold text-[#C8CDD8]">{title}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-[10px] border border-emerald-500/[0.14] bg-emerald-500/[0.05] p-3">
                      <p className="mb-1 text-[10px] uppercase tracking-[0.12em] text-emerald-400/60">{t("doLabel")}</p>
                      <p className="text-[13px] text-[#9AA3B2]">{doText}</p>
                    </div>
                    <div className="rounded-[10px] border border-red-500/[0.12] bg-red-500/[0.04] p-3">
                      <p className="mb-1 text-[10px] uppercase tracking-[0.12em] text-red-400/60">{t("dontLabel")}</p>
                      <p className="text-[13px] text-[#9AA3B2]">{dont}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}

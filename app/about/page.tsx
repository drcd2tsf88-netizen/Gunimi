import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PublicLayout from "@/components/public/PublicLayout";
import AiCore from "@/components/ui/AiCore";
import { Orbit, Zap, Shield, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Gunimi",
  description:
    "Gunimi is an AI-first Workspace Operating System built for the way modern teams actually work.",
  openGraph: {
    title: "About — Gunimi",
    description:
      "Gunimi is an AI-first Workspace Operating System built for the way modern teams actually work.",
    type: "website",
    url: "https://gunimi.com/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Gunimi",
    description:
      "Gunimi is an AI-first Workspace Operating System built for the way modern teams actually work.",
  },
};

const PILLAR_ICONS = [Orbit, Zap, Shield, Users];

export default async function AboutPage() {
  const t = await getTranslations("public.about");
  const pillars = t.raw("pillars") as Array<{ title: string; body: string }>;

  return (
    <PublicLayout>
      <div className="relative overflow-hidden">

        {/* HERO AMBIENT */}
        <div className="pointer-events-none absolute inset-0 -top-24">
          <div
            className="absolute left-1/2 top-0 h-[560px] w-[800px] -translate-x-1/2"
            style={{ background: "radial-gradient(ellipse, rgba(109,91,255,0.09), transparent 65%)", filter: "blur(80px)" }}
          />
        </div>

        {/* HERO */}
        <section className="relative mx-auto max-w-5xl px-6 pb-24 pt-24 text-center md:pt-32">
          <div className="mb-8 flex justify-center">
            <div className="pointer-events-none opacity-[0.36]">
              <AiCore size={100} showRings showParticles={false} intensity="medium" />
            </div>
          </div>

          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8B7DFF]">
              {t("badge")}
            </span>
          </div>

          <h1 className="mx-auto max-w-3xl text-[46px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC] md:text-[64px]">
            {t("headline")}
          </h1>
          <p className="mx-auto mt-6 max-w-[56ch] text-[17px] leading-[1.7] text-[#9AA3B2]">
            {t("subline")}
          </p>
        </section>

        {/* STORY */}
        <section className="relative mx-auto max-w-3xl px-6 pb-24">
          <div className="space-y-6 text-[16px] leading-[1.8] text-[#9AA3B2]">
            <p>{t("story0")}</p>
            <p>
              {t("story1Start")}{" "}
              <span className="font-medium text-[#C8CDD8]">
                {t("story1Emphasis")}
              </span>{" "}
              {t("story1End")}
            </p>
            <p>{t("story2")}</p>
          </div>
        </section>

        {/* PILLARS */}
        <section className="relative mx-auto max-w-5xl px-6 pb-28">
          <div className="mb-12 text-center">
            <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#F7F8FC] md:text-[40px]">
              {t("pillarsHeadline")}
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {pillars.map(({ title, body }, i) => {
              const Icon = PILLAR_ICONS[i];
              return (
                <div
                  key={title}
                  className="group relative overflow-hidden rounded-[20px] border border-white/[0.055] bg-[#0A0E17] p-6 transition-all duration-500 hover:border-[#6D5BFF]/[0.15] hover:shadow-[0_8px_32px_rgba(109,91,255,0.08)]"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(109,91,255,0.07),transparent_55%)]" />
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[11px] border border-[#6D5BFF]/[0.14] bg-[#6D5BFF]/[0.08] text-[#8B7DFF]">
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  <h3 className="mb-2 text-[16px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
                    {title}
                  </h3>
                  <p className="text-[14px] leading-[1.7] text-[#9AA3B2]">{body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CLOSING */}
        <section className="relative mx-auto max-w-3xl px-6 pb-32 text-center">
          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.055] bg-[#0A0E17] p-10 shadow-[0_8px_60px_rgba(109,91,255,0.08)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse at top, rgba(109,91,255,0.06), transparent 55%)" }}
            />
            <div className="relative z-10">
              <p className="text-[22px] font-semibold leading-[1.35] tracking-[-0.02em] text-[#F7F8FC] md:text-[26px]">
                {t("quote")}
              </p>
              <p className="mt-5 text-[13px] text-[#9AA3B2]/50">
                {t("quoteAttrib")}
              </p>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}

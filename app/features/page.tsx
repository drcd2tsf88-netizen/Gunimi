import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import PublicLayout from "@/components/public/PublicLayout";
import {
  Brain,
  Database,
  Zap,
  Terminal,
  Users,
  TrendingUp,
  BarChart3,
  Calendar,
  Mail,
  FileText,
  Radio,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features — Gunimi",
  description:
    "Eleven integrated modules in one AI-first workspace operating system. Contacts, deals, email, notes, automation, and AI intelligence — unified.",
  openGraph: {
    title: "Features — Gunimi",
    description:
      "Eleven integrated modules in one AI-first workspace operating system.",
    type: "website",
    url: "https://gunimi.com/features",
  },
  twitter: {
    card: "summary_large_image",
    title: "Features — Gunimi",
    description:
      "Eleven integrated modules in one AI-first workspace operating system.",
  },
};

const MODULE_ICONS = [
  Brain,
  Database,
  Zap,
  Terminal,
  Users,
  TrendingUp,
  BarChart3,
  Calendar,
  Mail,
  FileText,
  Radio,
];

export default async function FeaturesPage() {
  const t = await getTranslations("landing.features");
  const tf = await getTranslations("public.features");
  const modules = t.raw("modules") as Array<{ title: string; desc: string }>;

  return (
    <PublicLayout>
      <div className="relative overflow-hidden">

        {/* AMBIENT */}
        <div className="pointer-events-none absolute inset-0 -top-24">
          <div
            className="absolute left-1/2 top-0 h-[560px] w-[800px] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(ellipse, rgba(109,91,255,0.08), transparent 65%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        {/* HERO */}
        <section className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 text-center md:pt-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#8B7DFF]">
              {t("eyebrow")}
            </span>
          </div>

          <h1 className="mx-auto max-w-3xl text-[46px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC] md:text-[62px]">
            {t("headlineLine1")}{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #A998FF 0%, #6D5BFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("headlineLine2")}
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-[54ch] text-[17px] leading-[1.75] text-[#9AA3B2]">
            {t("subtitle")}
          </p>

          <div className="mt-4 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
            <span className="text-[12px] text-[#9AA3B2]/50">{t("statusLive")}</span>
          </div>
        </section>

        {/* MODULES GRID */}
        <section className="relative mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map(({ title, desc }, i) => {
              const Icon = MODULE_ICONS[i];
              return (
                <div
                  key={title}
                  className="group relative overflow-hidden rounded-[20px] border border-white/[0.055] bg-[#0A0E17] p-6 transition-all duration-500 hover:border-[#6D5BFF]/[0.18] hover:shadow-[0_8px_32px_rgba(109,91,255,0.08)]"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(109,91,255,0.07),transparent_55%)]" />
                  <div className="relative z-10">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[11px] border border-[#6D5BFF]/[0.14] bg-[#6D5BFF]/[0.08] text-[#8B7DFF] transition-colors duration-300 group-hover:border-[#6D5BFF]/[0.25] group-hover:bg-[#6D5BFF]/[0.13]">
                      <Icon size={18} strokeWidth={1.75} />
                    </div>
                    <h3 className="mb-2 text-[16px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
                      {title}
                    </h3>
                    <p className="text-[14px] leading-[1.75] text-[#9AA3B2]">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="relative mx-auto max-w-3xl px-6 pb-32 text-center">
          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#0A0E17] p-12 shadow-[0_8px_60px_rgba(109,91,255,0.07)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at top, rgba(109,91,255,0.07), transparent 55%)",
              }}
            />
            <div className="relative z-10">
              <h2 className="text-[26px] font-bold tracking-[-0.03em] text-[#F7F8FC] md:text-[32px]">
                {tf("ctaHeadline")}
              </h2>
              <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-[#6D5BFF] px-8 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#5a49e6] hover:shadow-[0_4px_20px_rgba(109,91,255,0.35)]"
                >
                  {tf("ctaButton")}
                </Link>
              </div>
              <p className="mt-4 text-[12px] text-[#9AA3B2]/35">{tf("ctaNote")}</p>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}

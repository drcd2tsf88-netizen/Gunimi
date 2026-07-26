import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import PublicLayout from "@/components/public/PublicLayout";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — Gunimi",
  description:
    "Gunimi is free during Open Alpha. Full access to all 11 modules, no credit card required.",
  openGraph: {
    title: "Pricing — Gunimi",
    description: "Gunimi is free during Open Alpha. Full access, no credit card required.",
    type: "website",
    url: "https://gunimi.com/pricing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Gunimi",
    description: "Gunimi is free during Open Alpha. Full access, no credit card required.",
  },
};

export default async function PricingPage() {
  const t = await getTranslations("public.pricing");
  const planFeatures = t.raw("planFeatures") as string[];
  const faq = t.raw("faq") as Array<{ q: string; a: string }>;

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
        <section className="relative mx-auto max-w-4xl px-6 pb-16 pt-24 text-center md:pt-32">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9AA3B2]/60">
              {t("badge")}
            </span>
          </div>

          <h1 className="mx-auto max-w-2xl text-[46px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC] md:text-[62px]">
            {t("headline")}{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #A998FF 0%, #6D5BFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("headlineAccent")}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-[50ch] text-[17px] leading-[1.75] text-[#9AA3B2]">
            {t("subtitle")}
          </p>
        </section>

        {/* PLAN CARD */}
        <section className="relative mx-auto max-w-md px-6 pb-20">
          <div className="relative overflow-hidden rounded-[28px] border border-[#6D5BFF]/[0.22] bg-[#0A0E17] p-8 shadow-[0_0_80px_rgba(109,91,255,0.1)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6D5BFF]/40 to-transparent" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at top, rgba(109,91,255,0.07), transparent 55%)",
              }}
            />

            <div className="relative z-10">
              {/* Plan badge */}
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/[0.2] bg-emerald-500/[0.07] px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-400/80">
                  {t("planBadge")}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="text-[56px] font-bold leading-none tracking-[-0.04em] text-[#F7F8FC]">
                  {t("planPrice")}
                </span>
                <span className="mb-1 self-end text-[16px] text-[#9AA3B2]/50">
                  {t("planPeriod")}
                </span>
              </div>

              <p className="mt-3 text-[14px] leading-[1.65] text-[#9AA3B2]">
                {t("planDesc")}
              </p>

              <Link
                href="/register"
                className="mt-6 flex h-12 w-full items-center justify-center rounded-[12px] bg-[#6D5BFF] text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#5a49e6] hover:shadow-[0_4px_20px_rgba(109,91,255,0.3)]"
              >
                {t("planCta")}
              </Link>

              {/* Features list */}
              <ul className="mt-8 space-y-3.5">
                {planFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#6D5BFF]/[0.22] bg-[#6D5BFF]/[0.1]">
                      <Check size={11} className="text-[#8B7DFF]" strokeWidth={2.5} />
                    </div>
                    <span className="text-[14px] leading-[1.6] text-[#9AA3B2]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* AFTER ALPHA */}
        <section className="relative mx-auto max-w-lg px-6 pb-20 text-center">
          <div className="rounded-[16px] border border-amber-500/[0.12] bg-amber-500/[0.04] p-6">
            <h3 className="mb-2 text-[16px] font-semibold tracking-[-0.01em] text-[#C8CDD8]">
              {t("afterAlphaTitle")}
            </h3>
            <p className="text-[13px] leading-[1.8] text-[#9AA3B2]/60">
              {t("afterAlphaDesc")}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative mx-auto max-w-2xl px-6 pb-32">
          <h2 className="mb-8 text-center text-[24px] font-bold tracking-[-0.02em] text-[#F7F8FC]">
            {t("faqTitle")}
          </h2>
          <div className="space-y-4">
            {faq.map(({ q, a }) => (
              <div
                key={q}
                className="relative overflow-hidden rounded-[16px] border border-white/[0.055] bg-[#0A0E17] p-6"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
                  {q}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.75] text-[#9AA3B2]">{a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}

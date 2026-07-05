import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PublicLayout from "@/components/public/PublicLayout";
import AiCore from "@/components/ui/AiCore";
import { CheckCircle2, XCircle, AlertTriangle, Brain } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Transparency — Gunimi",
  description:
    "What Gunimi's AI can and cannot do, how it accesses your data, memory policy, training policy, and human responsibility.",
  openGraph: {
    title: "AI Transparency — Gunimi",
    description:
      "What Gunimi's AI can and cannot do, how it accesses your data, memory policy, and training data policy.",
    type: "website",
    url: "https://gunimi.com/ai-transparency",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Transparency — Gunimi",
  },
};

export default async function AiTransparencyPage() {
  const t = await getTranslations("public.aiTransparency");
  const can = t.raw("can") as string[];
  const cannot = t.raw("cannot") as string[];
  const principles = t.raw("principles") as Array<{ title: string; body: string }>;

  return (
    <PublicLayout>
      <div className="relative overflow-hidden">

        {/* AMBIENT */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2"
            style={{ background: "radial-gradient(ellipse, rgba(109,91,255,0.08), transparent 65%)", filter: "blur(80px)" }}
          />
        </div>

        {/* HERO */}
        <section className="relative mx-auto max-w-4xl px-6 pb-20 pt-24 text-center md:pt-32">
          <div className="mb-8 flex justify-center">
            <div className="pointer-events-none opacity-[0.38]">
              <AiCore size={92} showRings showParticles={false} intensity="medium" />
            </div>
          </div>

          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3 py-1">
            <Brain size={11} className="text-[#8B7DFF]" strokeWidth={1.75} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8B7DFF]">
              {t("badge")}
            </span>
          </div>

          <h1 className="mx-auto max-w-3xl text-[46px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC] md:text-[60px]">
            {t("headline")}{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #6D5BFF, #A998FF)" }}
            >
              {t("headlineAccent")}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-[52ch] text-[17px] leading-[1.7] text-[#9AA3B2]">
            {t("subline")}
          </p>
        </section>

        {/* CAN / CANNOT */}
        <section className="relative mx-auto max-w-4xl px-6 pb-20">
          <div className="grid gap-5 md:grid-cols-2">
            {/* CAN */}
            <div className="relative overflow-hidden rounded-[20px] border border-white/[0.055] bg-[#0A0E17] p-7">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
              <div className="mb-5 flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-400/80" strokeWidth={1.75} />
                <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">{t("canTitle")}</h2>
              </div>
              <ul className="space-y-3">
                {can.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-emerald-500/40" />
                    <span className="text-[13.5px] leading-[1.65] text-[#9AA3B2]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CANNOT */}
            <div className="relative overflow-hidden rounded-[20px] border border-white/[0.055] bg-[#0A0E17] p-7">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
              <div className="mb-5 flex items-center gap-2.5">
                <XCircle size={18} className="text-red-400/70" strokeWidth={1.75} />
                <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">{t("cannotTitle")}</h2>
              </div>
              <ul className="space-y-3">
                {cannot.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-red-500/40" />
                    <span className="text-[13.5px] leading-[1.65] text-[#9AA3B2]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* PRINCIPLES */}
        <section className="relative mx-auto max-w-4xl px-6 pb-20">
          <div className="mb-10 text-center">
            <h2 className="text-[30px] font-bold tracking-[-0.03em] text-[#F7F8FC]">
              {t("principlesHeadline")}
            </h2>
          </div>
          <div className="space-y-4">
            {principles.map(({ title, body }) => (
              <div
                key={title}
                className="relative overflow-hidden rounded-[18px] border border-white/[0.055] bg-[#0A0E17] p-6"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <h3 className="mb-2 text-[15px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">{title}</h3>
                <p className="text-[14px] leading-[1.7] text-[#9AA3B2]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HALLUCINATION WARNING */}
        <section className="relative mx-auto max-w-4xl px-6 pb-32">
          <div className="relative overflow-hidden rounded-[20px] border border-amber-500/[0.12] bg-amber-500/[0.04] p-7">
            <div className="flex items-start gap-4">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-400/70" strokeWidth={1.75} />
              <div>
                <h3 className="mb-2 text-[15px] font-semibold text-[#F7F8FC]">
                  {t("warningTitle")}
                </h3>
                <p className="text-[14px] leading-[1.7] text-[#9AA3B2]">
                  {t("warningBody")}
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}

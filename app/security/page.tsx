import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PublicLayout from "@/components/public/PublicLayout";
import { Lock, Shield, Server, UserCheck, Eye, Globe, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Security — Gunimi",
  description:
    "How Gunimi protects your data: encryption, workspace isolation, access control, and responsible AI infrastructure.",
  openGraph: {
    title: "Security — Gunimi",
    description:
      "How Gunimi protects your data: encryption, workspace isolation, access control, and responsible AI infrastructure.",
    type: "website",
    url: "https://gunimi.com/security",
  },
  twitter: {
    card: "summary_large_image",
    title: "Security — Gunimi",
    description:
      "How Gunimi protects your data: encryption, workspace isolation, access control, and responsible AI infrastructure.",
  },
};

const SECTION_ICONS = [Lock, Server, Shield, UserCheck, Eye, Cpu, Globe];

export default async function SecurityPage() {
  const t = await getTranslations("public.security");
  const sections = t.raw("sections") as Array<{ title: string; items: string[] }>;

  return (
    <PublicLayout>
      <div className="relative overflow-hidden">

        {/* AMBIENT */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2"
            style={{ background: "radial-gradient(ellipse, rgba(109,91,255,0.07), transparent 65%)", filter: "blur(100px)" }}
          />
        </div>

        {/* HERO */}
        <section className="relative mx-auto max-w-4xl px-6 pb-20 pt-24 text-center md:pt-32">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8B7DFF]">
              {t("badge")}
            </span>
          </div>
          <h1 className="text-[46px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC] md:text-[60px]">
            {t("headline")}<br />
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

        {/* SECTIONS */}
        <section className="relative mx-auto max-w-4xl px-6 pb-28">
          <div className="space-y-5">
            {sections.map(({ title, items }, i) => {
              const Icon = SECTION_ICONS[i];
              return (
                <div
                  key={title}
                  className="relative overflow-hidden rounded-[20px] border border-white/[0.055] bg-[#0A0E17] p-7"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
                  <div className="flex items-start gap-5">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] border border-[#6D5BFF]/[0.14] bg-[#6D5BFF]/[0.08] text-[#8B7DFF]">
                      <Icon size={18} strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="mb-4 text-[16px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
                        {title}
                      </h2>
                      <ul className="space-y-2.5">
                        {items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#6D5BFF]/50" />
                            <span className="text-[14px] leading-[1.65] text-[#9AA3B2]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="relative mx-auto max-w-2xl px-6 pb-32 text-center">
          <p className="text-[15px] leading-[1.7] text-[#9AA3B2]/60">
            {t("ctaText")}{" "}
            <a
              href="mailto:security@gunimi.com"
              className="font-medium text-[#8B7DFF]/70 underline underline-offset-2 transition-colors hover:text-[#8B7DFF]"
            >
              security@gunimi.com
            </a>
          </p>
        </section>

      </div>
    </PublicLayout>
  );
}

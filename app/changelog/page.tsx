import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PublicLayout from "@/components/public/PublicLayout";
import { Sparkles, Zap, Shield, Bug } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog — Gunimi",
  description: "What's new in Gunimi. Product updates, improvements, and fixes.",
  openGraph: {
    title: "Changelog — Gunimi",
    description: "What's new in Gunimi. Product updates, improvements, and fixes.",
    type: "website",
    url: "https://gunimi.com/changelog",
  },
};

type ChangeTag = "new" | "improved" | "security" | "fixed";

type ReleaseChange = { tag: ChangeTag; text: string };
type Release = {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: ReleaseChange[];
};

const TAG_STYLES: Record<ChangeTag, { colors: string; icon: React.ElementType }> = {
  new:      { colors: "border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] text-[#8B7DFF]",           icon: Sparkles },
  improved: { colors: "border-emerald-500/[0.16] bg-emerald-500/[0.06] text-emerald-400/80",   icon: Zap },
  security: { colors: "border-amber-500/[0.16] bg-amber-500/[0.06] text-amber-400/80",         icon: Shield },
  fixed:    { colors: "border-white/[0.07] bg-white/[0.03] text-[#9AA3B2]/60",                 icon: Bug },
};

export default async function ChangelogPage() {
  const t = await getTranslations("public.changelog");
  const releases = t.raw("releases") as Release[];

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
        <section className="relative mx-auto max-w-3xl px-6 pb-20 pt-24 text-center md:pt-32">
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

        {/* TIMELINE */}
        <section className="relative mx-auto max-w-3xl px-6 pb-32">
          <div className="relative space-y-10">
            {/* VERTICAL LINE */}
            <div className="pointer-events-none absolute bottom-0 left-[19px] top-2 w-px bg-gradient-to-b from-[#6D5BFF]/30 via-[#6D5BFF]/10 to-transparent" />

            {releases.map((release) => (
              <div key={release.version} className="relative flex gap-7">
                {/* DOT */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#6D5BFF]/[0.20] bg-[#0A0E17]">
                  <span className="text-[10px] font-bold text-[#8B7DFF]">{release.version}</span>
                </div>

                {/* CARD */}
                <div className="flex-1 pb-2">
                  <div className="relative overflow-hidden rounded-[20px] border border-white/[0.055] bg-[#0A0E17] p-7">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

                    {/* META */}
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
                        {release.title}
                      </h2>
                      <span className="shrink-0 text-[12px] text-[#9AA3B2]/40">{release.date}</span>
                    </div>

                    <p className="mb-6 text-[14px] leading-[1.7] text-[#9AA3B2]">
                      {release.description}
                    </p>

                    {/* CHANGES */}
                    <ul className="space-y-2.5">
                      {release.changes.map(({ tag, text }) => {
                        const config = TAG_STYLES[tag];
                        const Icon = config.icon;
                        return (
                          <li key={text} className="flex items-start gap-3">
                            <span
                              className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.10em] ${config.colors}`}
                            >
                              <Icon size={9} strokeWidth={2} />
                              {t(`tags.${tag}`)}
                            </span>
                            <span className="text-[13.5px] leading-[1.6] text-[#9AA3B2]">{text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PublicLayout from "@/components/public/PublicLayout";
import { Loader2, Circle, Telescope } from "lucide-react";

export const metadata: Metadata = {
  title: "Roadmap — Gunimi",
  description: "What's in progress, what's planned, and where Gunimi is heading.",
  openGraph: {
    title: "Roadmap — Gunimi",
    description: "What's in progress, what's planned, and where Gunimi is heading.",
    type: "website",
    url: "https://gunimi.com/roadmap",
  },
};

type RoadmapItem = { title: string; description: string };

type ColumnConfig = {
  id: string;
  icon: React.ElementType;
  badgeColors: string;
  accent: string;
  labelKey: string;
  descriptionKey: string;
  itemsKey: string;
};

const COLUMN_CONFIGS: ColumnConfig[] = [
  {
    id: "in-progress",
    icon: Loader2,
    badgeColors: "border-[#6D5BFF]/[0.20] bg-[#6D5BFF]/[0.09] text-[#8B7DFF]",
    accent: "#6D5BFF",
    labelKey: "columns.inProgress.label",
    descriptionKey: "columns.inProgress.description",
    itemsKey: "inProgress",
  },
  {
    id: "planned",
    icon: Circle,
    badgeColors: "border-cyan-500/[0.18] bg-cyan-500/[0.06] text-cyan-400/80",
    accent: "#22D3EE",
    labelKey: "columns.planned.label",
    descriptionKey: "columns.planned.description",
    itemsKey: "planned",
  },
  {
    id: "future",
    icon: Telescope,
    badgeColors: "border-white/[0.08] bg-white/[0.03] text-[#9AA3B2]/60",
    accent: "#9AA3B2",
    labelKey: "columns.future.label",
    descriptionKey: "columns.future.description",
    itemsKey: "future",
  },
];

export default async function RoadmapPage() {
  const t = await getTranslations("public.roadmap");
  const inProgress = t.raw("inProgress") as RoadmapItem[];
  const planned = t.raw("planned") as RoadmapItem[];
  const future = t.raw("future") as RoadmapItem[];

  const ITEMS_MAP: Record<string, RoadmapItem[]> = { inProgress, planned, future };

  return (
    <PublicLayout>
      <div className="relative overflow-hidden">

        {/* AMBIENT */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-0 h-[440px] w-[700px] -translate-x-1/2"
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
          <p className="mx-auto mt-5 max-w-[50ch] text-[16px] leading-[1.7] text-[#9AA3B2]">
            {t("subline")}
          </p>
        </section>

        {/* COLUMNS */}
        <section className="relative mx-auto max-w-6xl px-6 pb-32">
          <div className="grid gap-6 lg:grid-cols-3">
            {COLUMN_CONFIGS.map(({ id, icon: Icon, badgeColors, labelKey, descriptionKey, itemsKey }) => {
              const items = ITEMS_MAP[itemsKey] ?? [];
              return (
                <div key={id} className="flex flex-col gap-4">

                  {/* COLUMN HEADER */}
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${badgeColors}`}
                    >
                      <Icon size={10} strokeWidth={2} />
                      {t(labelKey)}
                    </span>
                    <span className="text-[12px] text-[#9AA3B2]/40">{t(descriptionKey)}</span>
                  </div>

                  {/* ITEMS */}
                  <div className="flex flex-col gap-3">
                    {items.map(({ title, description: desc }) => (
                      <div
                        key={title}
                        className="relative overflow-hidden rounded-[16px] border border-white/[0.055] bg-[#0A0E17] p-5 transition-all duration-300 hover:border-white/[0.08]"
                      >
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                        <h3 className="mb-1.5 text-[14px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
                          {title}
                        </h3>
                        <p className="text-[13px] leading-[1.6] text-[#9AA3B2]/70">{desc}</p>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>

          {/* DISCLAIMER */}
          <p className="mt-12 text-center text-[12px] text-[#9AA3B2]/30">
            {t("disclaimer")}
          </p>
        </section>

      </div>
    </PublicLayout>
  );
}

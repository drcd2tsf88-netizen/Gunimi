"use client";

import Link from "next/link";
import { Radio } from "lucide-react";
import { useTranslations } from "next-intl";
import GunimiCard from "@/components/ui/GunimiCard";

type Props = {
  activeCount: number;
  criticalCount: number;
};

export default function TodaySignalsPulse({ activeCount, criticalCount }: Props) {
  const t = useTranslations("today");

  return (
    <Link href="/dashboard/signals" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060A] rounded-[18px]">
      <GunimiCard hoverable className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
              <Radio size={13} className="text-violet-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                {t("signalsPulseTitle")}
              </p>
              <p className="mt-0.5 text-sm font-medium text-white/70">
                {activeCount === 0
                  ? t("signalsPulseEmpty")
                  : t("signalsPulseCount", { count: activeCount })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {criticalCount > 0 && (
              <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-300">
                {criticalCount} critical
              </span>
            )}
            <span className="text-[10px] text-zinc-600 transition-colors group-hover:text-zinc-400">
              {t("signalsPulseViewAll")} →
            </span>
          </div>
        </div>
      </GunimiCard>
    </Link>
  );
}

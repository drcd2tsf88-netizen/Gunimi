"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { AlertCircle, ArrowRight, AlertTriangle } from "lucide-react";
import GunimiCard from "@/components/ui/GunimiCard";
import type { TodayAttentionItem } from "@/lib/today/types";

type Props = {
  items: TodayAttentionItem[];
};

export default function TodayAttentionSection({ items }: Props) {
  const t = useTranslations("today");

  if (items.length === 0) return null;

  return (
    <GunimiCard className="p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {t("attentionSectionLabel")}
      </p>

      <div className="mt-4 space-y-1">
        {items.map((item) => {
          const label = t(item.labelKey, item.labelParams ?? {});
          const Icon = item.urgency === "critical" ? AlertCircle : AlertTriangle;
          const iconClass =
            item.urgency === "critical"
              ? "text-red-400/70 group-hover:text-red-400"
              : "text-amber-400/50 group-hover:text-amber-400";

          return (
            <Link
              key={item.id}
              href={item.href}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.03]"
            >
              <Icon size={13} className={`shrink-0 transition-colors ${iconClass}`} aria-hidden />
              <span className="min-w-0 flex-1 truncate text-sm text-white/60 transition-colors group-hover:text-white/85">
                {label}
              </span>
              <ArrowRight
                size={12}
                className="shrink-0 text-white/10 transition-colors group-hover:text-white/35"
                aria-hidden
              />
            </Link>
          );
        })}
      </div>
    </GunimiCard>
  );
}

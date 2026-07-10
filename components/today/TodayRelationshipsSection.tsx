"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, User } from "lucide-react";
import GunimiCard from "@/components/ui/GunimiCard";
import type { TodayRelationshipItem } from "@/lib/today/types";

type Props = {
  items: TodayRelationshipItem[];
};

export default function TodayRelationshipsSection({ items }: Props) {
  const t = useTranslations("today");

  if (items.length === 0) return null;

  return (
    <GunimiCard className="p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {t("relationshipsSectionLabel")}
      </p>

      <div className="mt-4 space-y-1">
        {items.map((item) => {
          const label = t(item.labelKey, item.labelParams ?? {});
          return (
            <Link
              key={item.id}
              href={item.href}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.03]"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.04] transition-colors group-hover:bg-white/[0.07]">
                <User size={12} className="text-white/30 transition-colors group-hover:text-white/60" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white/75 transition-colors group-hover:text-white">
                  {item.name}
                </p>
                <p className="text-[11px] text-white/30 transition-colors group-hover:text-white/45">
                  {label}
                </p>
              </div>
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

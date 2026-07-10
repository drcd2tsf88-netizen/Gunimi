"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import GunimiCard from "@/components/ui/GunimiCard";
import type { TodayFocus } from "@/lib/today/types";

type Props = {
  focus: TodayFocus;
};

export default function TodayFocusCard({ focus }: Props) {
  const t = useTranslations("today");

  const sectionLabel = t("focusSectionLabel");

  if (!focus) {
    return (
      <GunimiCard className="p-5">
        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          {sectionLabel}
        </p>
        <div className="mt-4 flex items-start gap-3">
          <CheckCircle2
            size={14}
            className="mt-0.5 shrink-0 text-emerald-400"
            aria-hidden
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white/60">
              {t("focusEmptyAction")}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/35">
              {t("focusEmptyReason")}
            </p>
          </div>
        </div>
      </GunimiCard>
    );
  }

  const action = t(focus.actionKey, focus.actionParams ?? {});
  const reason = t(focus.reasonKey, focus.reasonParams ?? {});

  return (
    <Link href={focus.href} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5BFF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060A] rounded-[18px]">
      <GunimiCard hoverable className="p-5">
        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          {sectionLabel}
        </p>
        <div className="mt-4 flex items-start gap-3">
          <ArrowRight
            size={14}
            className="mt-0.5 shrink-0 text-[#6D5BFF] transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white transition-colors group-hover:text-white/90">
              {action}
            </p>
            {reason && (
              <p className="mt-1 text-xs leading-relaxed text-white/45">
                {reason}
              </p>
            )}
          </div>
          <ArrowRight
            size={12}
            className="mt-1 shrink-0 text-white/10 transition-colors group-hover:text-white/40"
            aria-hidden
          />
        </div>
      </GunimiCard>
    </Link>
  );
}

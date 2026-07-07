"use client";

import { useTranslations } from "next-intl";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
} from "lucide-react";
import GunimiCard from "@/components/ui/GunimiCard";
import { LARGE_DEAL_THRESHOLD, MS_PER_DAY, STALE_THRESHOLD_DAYS } from "@/lib/deals/constants";
import type { DealActionType } from "@/lib/deals/decision";
import { Deal } from "@/types/deal";

type Signal = {
  icon: typeof CheckCircle2;
  color: string;
  text: string;
};

type Props = {
  deal: Deal;
  activeDecisionAction?: DealActionType;
};

export default function DealIntelligence({ deal, activeDecisionAction }: Props) {
  const t = useTranslations("deals");

  const now = new Date();

  const daysSinceUpdate = deal.updated_at
    ? Math.floor((now.getTime() - new Date(deal.updated_at).getTime()) / MS_PER_DAY)
    : null;

  const daysUntilClose = deal.expected_close_date
    ? Math.floor((new Date(deal.expected_close_date).getTime() - now.getTime()) / MS_PER_DAY)
    : null;

  const dealValue = Number(deal.value || 0);

  const signals: Signal[] = [];

  // Stale signal — suppressed when "follow_up" is the active decision (already communicated)
  if (
    daysSinceUpdate !== null &&
    daysSinceUpdate > STALE_THRESHOLD_DAYS &&
    activeDecisionAction !== "follow_up"
  ) {
    signals.push({
      icon: Clock,
      color: "text-amber-300",
      text: t("intelligenceStale", { days: daysSinceUpdate }),
    });
  }

  if (daysUntilClose !== null) {
    // Overdue — suppressed when "update_close_date" is the active decision
    if (daysUntilClose < 0 && activeDecisionAction !== "update_close_date") {
      signals.push({
        icon: AlertCircle,
        color: "text-red-300",
        text: t("intelligenceOverdue"),
      });
    // Close soon — suppressed when "prepare_close" is the active decision
    } else if (daysUntilClose <= 7 && activeDecisionAction !== "prepare_close") {
      signals.push({
        icon: Flame,
        color: "text-orange-300",
        text: t("intelligenceCloseSoon", { days: daysUntilClose }),
      });
    }
  }

  // No close date — suppressed when "set_close_date" is the active decision
  if (
    daysUntilClose === null &&
    deal.stage !== "won" &&
    deal.stage !== "lost" &&
    activeDecisionAction !== "set_close_date"
  ) {
    signals.push({
      icon: Calendar,
      color: "text-white/40",
      text: t("intelligenceNoCloseDate"),
    });
  }

  // Large deal — secondary signal, never suppressed
  if (dealValue >= LARGE_DEAL_THRESHOLD) {
    signals.push({
      icon: TrendingUp,
      color: "text-violet-300",
      text: t("intelligenceLargeOpportunity"),
    });
  }

  // No signals remain after suppression
  if (signals.length === 0) {
    // Decision card owns the primary signal — don't double-render
    if (activeDecisionAction) return null;
    // No decision and no signals — deal is healthy
    signals.push({
      icon: CheckCircle2,
      color: "text-emerald-300",
      text: t("intelligenceHealthy"),
    });
  }

  return (
    <GunimiCard className="p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {t("situationBadge")}
      </p>

      <div className="mt-4 space-y-2.5">
        {signals.map((s, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <s.icon size={13} className={`mt-0.5 shrink-0 ${s.color}`} aria-hidden />
            <p className="text-xs leading-relaxed text-white/60">{s.text}</p>
          </div>
        ))}
      </div>
    </GunimiCard>
  );
}

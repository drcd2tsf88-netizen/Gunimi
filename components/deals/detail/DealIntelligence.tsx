"use client";

import { useTranslations } from "next-intl";
import {
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
  Flame,
  Calendar,
  TrendingUp,
} from "lucide-react";
import OrbitCard from "@/components/ui/OrbitCard";
import { Deal } from "@/types/deal";

const NOW = new Date();
const MS_PER_DAY = 86_400_000;
const LARGE_DEAL_THRESHOLD = 50_000;

type Signal = {
  icon: typeof CheckCircle2;
  color: string;
  text: string;
};

export default function DealIntelligence({ deal }: { deal: Deal }) {
  const t = useTranslations("deals");

  const daysSinceUpdate = deal.updated_at
    ? Math.floor((NOW.getTime() - new Date(deal.updated_at).getTime()) / MS_PER_DAY)
    : null;

  const daysUntilClose = deal.expected_close_date
    ? Math.floor((new Date(deal.expected_close_date).getTime() - NOW.getTime()) / MS_PER_DAY)
    : null;

  const dealValue = Number(deal.value || 0);

  const signals: Signal[] = [];

  if (daysSinceUpdate !== null && daysSinceUpdate > 14) {
    signals.push({
      icon: Clock,
      color: "text-amber-300",
      text: t("intelligenceStale", { days: daysSinceUpdate }),
    });
  }

  if (daysUntilClose !== null) {
    if (daysUntilClose < 0) {
      signals.push({
        icon: AlertCircle,
        color: "text-red-300",
        text: t("intelligenceOverdue"),
      });
    } else if (daysUntilClose <= 7) {
      signals.push({
        icon: Flame,
        color: "text-orange-300",
        text: t("intelligenceCloseSoon", { days: daysUntilClose }),
      });
    }
  }

  if (daysUntilClose === null && deal.stage !== "won" && deal.stage !== "lost") {
    signals.push({
      icon: Calendar,
      color: "text-white/40",
      text: t("intelligenceNoCloseDate"),
    });
  }

  if (dealValue >= LARGE_DEAL_THRESHOLD) {
    signals.push({
      icon: TrendingUp,
      color: "text-violet-300",
      text: t("intelligenceLargeOpportunity"),
    });
  }

  if (signals.length === 0) {
    signals.push({
      icon: CheckCircle2,
      color: "text-emerald-300",
      text: t("intelligenceHealthy"),
    });
  }

  return (
    <OrbitCard className="p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
          <Sparkles size={14} className="text-violet-300" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            {t("intelligenceBadge")}
          </p>
          <p className="mt-0.5 text-sm font-medium">{t("intelligenceTitle")}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {signals.map((s, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <s.icon size={13} className={`mt-0.5 shrink-0 ${s.color}`} />
            <p className="text-xs leading-relaxed text-white/60">{s.text}</p>
          </div>
        ))}
      </div>
    </OrbitCard>
  );
}

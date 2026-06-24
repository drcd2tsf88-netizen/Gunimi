"use client";

import { useTranslations } from "next-intl";
import { Sparkles, TrendingUp, Users, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import OrbitCard from "@/components/ui/OrbitCard";
import { Company } from "@/types/company";
import { Deal } from "@/types/deal";
import { Contact } from "@/types/contact";

const NOW = new Date();

type Props = {
  company: Company;
  deals: Deal[];
  contacts: Contact[];
};

export default function CompanyIntelligence({ company, deals, contacts }: Props) {
  const t = useTranslations("companies");

  const openDeals = deals.filter((d) => d.stage !== "won" && d.stage !== "lost");
  const wonDeals = deals.filter((d) => d.stage === "won");
  const totalPipeline = openDeals.reduce((sum, d) => sum + Number(d.value || 0), 0);

  const daysSinceActivity = company.last_activity_at
    ? Math.floor((NOW.getTime() - new Date(company.last_activity_at).getTime()) / 86_400_000)
    : null;

  const signals: { icon: typeof CheckCircle2; color: string; text: string }[] = [];

  if (openDeals.length > 0) {
    signals.push({
      icon: TrendingUp,
      color: "text-violet-300",
      text: t("intelligenceOpenDeals", { count: openDeals.length, value: totalPipeline.toLocaleString() }),
    });
  }

  if (wonDeals.length > 0) {
    signals.push({
      icon: CheckCircle2,
      color: "text-emerald-300",
      text: t("intelligenceWonDeals", { count: wonDeals.length }),
    });
  }

  if (contacts.length > 0) {
    signals.push({
      icon: Users,
      color: "text-cyan-300",
      text: t("intelligenceContacts", { count: contacts.length }),
    });
  }

  if (daysSinceActivity !== null) {
    if (daysSinceActivity > 30) {
      signals.push({
        icon: AlertCircle,
        color: "text-red-300",
        text: t("intelligenceInactive", { days: daysSinceActivity }),
      });
    } else if (daysSinceActivity > 14) {
      signals.push({
        icon: Clock,
        color: "text-amber-300",
        text: t("intelligenceLastActivity", { days: daysSinceActivity }),
      });
    } else {
      signals.push({
        icon: CheckCircle2,
        color: "text-emerald-300",
        text: t("intelligenceActiveRelationship"),
      });
    }
  }

  if (signals.length === 0) {
    signals.push({
      icon: AlertCircle,
      color: "text-white/30",
      text: t("intelligenceNoData"),
    });
  }

  return (
    <div className="px-6 pb-8 lg:px-8">
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
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import {
  Sparkles,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Activity,
} from "lucide-react";
import GunimiCard from "@/components/ui/GunimiCard";
import { Contact } from "@/types/contact";
import { Deal } from "@/types/deal";

const NOW = new Date();

type RelationshipStrength = "Frequent" | "Regular" | "Infrequent" | "Cold";

function getStrength(daysSinceContact: number | null): RelationshipStrength {
  if (daysSinceContact === null) return "Cold";
  if (daysSinceContact <= 7) return "Frequent";
  if (daysSinceContact <= 30) return "Regular";
  if (daysSinceContact <= 90) return "Infrequent";
  return "Cold";
}

const STRENGTH_STYLE: Record<RelationshipStrength, { badge: string; dot: string }> = {
  Frequent: {
    badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400",
  },
  Regular: {
    badge: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
    dot: "bg-cyan-400",
  },
  Infrequent: {
    badge: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    dot: "bg-amber-400",
  },
  Cold: {
    badge: "border-red-500/20 bg-red-500/10 text-red-300",
    dot: "bg-red-400",
  },
};

const STRENGTH_LABEL_KEY: Record<
  RelationshipStrength,
  "intelligenceStrengthFrequent" | "intelligenceStrengthRegular" | "intelligenceStrengthInfrequent" | "intelligenceStrengthCold"
> = {
  Frequent: "intelligenceStrengthFrequent",
  Regular: "intelligenceStrengthRegular",
  Infrequent: "intelligenceStrengthInfrequent",
  Cold: "intelligenceStrengthCold",
};

type Props = {
  contact: Contact;
  deals: Deal[];
};

export default function ContactIntelligence({ contact, deals }: Props) {
  const t = useTranslations("contacts");

  const daysSinceContact = contact.last_contacted_at
    ? Math.floor((NOW.getTime() - new Date(contact.last_contacted_at).getTime()) / 86_400_000)
    : null;

  const openDeals = deals.filter((d) => d.stage !== "won" && d.stage !== "lost");
  const totalPipelineValue = openDeals.reduce((sum, d) => sum + Number(d.value || 0), 0);

  const strength = getStrength(daysSinceContact);
  const strengthStyle = STRENGTH_STYLE[strength];

  const signals: { icon: typeof CheckCircle2; color: string; text: string }[] = [];

  if (daysSinceContact !== null) {
    if (daysSinceContact > 30) {
      signals.push({
        icon: AlertCircle,
        color: "text-red-300",
        text: t("intelligenceNotContacted", { days: daysSinceContact }),
      });
    } else if (daysSinceContact > 14) {
      signals.push({
        icon: Clock,
        color: "text-amber-300",
        text: t("intelligenceLastContact", { days: daysSinceContact }),
      });
    } else {
      signals.push({
        icon: CheckCircle2,
        color: "text-emerald-300",
        text: t("intelligenceRecentContact", { days: daysSinceContact }),
      });
    }
  } else {
    signals.push({
      icon: AlertCircle,
      color: "text-red-300",
      text: t("intelligenceNeverContacted"),
    });
  }

  if (openDeals.length > 0) {
    signals.push({
      icon: TrendingUp,
      color: "text-violet-300",
      text: t("intelligenceOpenDeals", { count: openDeals.length, value: totalPipelineValue.toLocaleString() }),
    });
  }

  if (contact.status === "customer") {
    signals.push({
      icon: CheckCircle2,
      color: "text-emerald-300",
      text: t("intelligenceCustomer"),
    });
  } else if (contact.status === "lead" || !contact.status) {
    signals.push({
      icon: AlertCircle,
      color: "text-amber-300",
      text: t("intelligenceLeadNotConverted"),
    });
  }

  let nextAction: string;
  if (daysSinceContact === null || daysSinceContact > 30) {
    nextAction = t("intelligenceActionScheduleCall");
  } else if (daysSinceContact > 14) {
    nextAction = t("intelligenceActionCheckIn", { days: daysSinceContact });
  } else if (contact.status === "lead" || !contact.status) {
    nextAction = t("intelligenceActionConvert");
  } else {
    nextAction = t("intelligenceActionMaintain");
  }

  return (
    <div className="px-6 pb-8 lg:px-8">
      <GunimiCard className="p-5">
        <div className="flex items-center justify-between gap-3">
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
          <span
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${strengthStyle.badge}`}
          >
            <Activity size={9} className={strengthStyle.dot.replace("bg-", "text-").replace("-400", "-300")} />
            {t(STRENGTH_LABEL_KEY[strength])}
          </span>
        </div>

        <div className="mt-4 space-y-2.5">
          {signals.map((s, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <s.icon size={13} className={`mt-0.5 shrink-0 ${s.color}`} />
              <p className="text-xs leading-relaxed text-white/60">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-violet-500/10 bg-violet-500/[0.04] px-3 py-3">
          <Lightbulb size={13} className="mt-0.5 shrink-0 text-violet-300/70" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
              {t("intelligenceNextAction")}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-white/55">{nextAction}</p>
          </div>
        </div>
      </GunimiCard>
    </div>
  );
}

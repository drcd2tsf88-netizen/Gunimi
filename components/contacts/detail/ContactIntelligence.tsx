"use client";

import { useTranslations } from "next-intl";
import { Sparkles, Clock, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import OrbitCard from "@/components/ui/OrbitCard";
import { Contact } from "@/types/contact";
import { Deal } from "@/types/deal";

const NOW = new Date();

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

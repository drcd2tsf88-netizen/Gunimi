"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Clock, TrendingUp, AlertCircle, UserX, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import GunimiCard from "@/components/ui/GunimiCard";
import type { Contact } from "@/types/contact";
import type { Deal } from "@/types/deal";
import type { ContactActionType } from "@/lib/contacts/decision";
import { MS_PER_DAY } from "@/lib/workspace/constants";
import { STALE_RELATIONSHIP_DAYS } from "@/lib/contacts/constants";

type Signal = {
  key: string;
  Icon: LucideIcon;
  color: string;
  label: string;
};

type Props = {
  contact: Contact;
  deals: Deal[];
  activeDecisionAction?: ContactActionType;
};

export default function ContactIntelligence({
  contact,
  deals,
  activeDecisionAction,
}: Props) {
  const t = useTranslations("contacts");

  const signals = useMemo((): Signal[] => {
    const now = new Date().getTime();
    const result: Signal[] = [];

    const daysSinceContact = contact.last_contacted_at
      ? Math.floor(
          (now - new Date(contact.last_contacted_at).getTime()) / MS_PER_DAY,
        )
      : null;

    if (
      activeDecisionAction !== "follow_up" &&
      daysSinceContact !== null &&
      daysSinceContact > STALE_RELATIONSHIP_DAYS
    ) {
      result.push({
        key: "stale",
        Icon: Clock,
        color: "text-amber-400",
        label: t("situationSignalStale", { days: daysSinceContact }),
      });
    }

    if (
      activeDecisionAction !== "initiate_relationship" &&
      !contact.last_contacted_at
    ) {
      result.push({
        key: "never_contacted",
        Icon: UserX,
        color: "text-white/40",
        label: t("situationSignalNeverContacted"),
      });
    }

    const openDeals = deals.filter(
      (d) => d.stage !== "won" && d.stage !== "lost",
    );
    if (
      activeDecisionAction !== "deal_attention" &&
      openDeals.length > 0
    ) {
      result.push({
        key: "open_deals",
        Icon: TrendingUp,
        color: "text-violet-400",
        label: t("situationSignalOpenDeals", { count: openDeals.length }),
      });
    }

    if (
      activeDecisionAction !== "add_contact_info" &&
      !contact.email &&
      !contact.phone
    ) {
      result.push({
        key: "no_contact_info",
        Icon: AlertCircle,
        color: "text-red-400",
        label: t("situationSignalNoContactInfo"),
      });
    }

    return result;
  }, [contact, deals, activeDecisionAction, t]);

  if (signals.length === 0 && activeDecisionAction) return null;

  return (
    <GunimiCard className="p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {t("situationBadge")}
      </p>

      {signals.length === 0 ? (
        <div className="mt-4 flex items-center gap-2.5">
          <CheckCircle2
            size={14}
            className="shrink-0 text-emerald-400"
            aria-hidden
          />
          <p className="text-sm text-white/60">{t("situationSignalHealthy")}</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {signals.map((signal) => (
            <li key={signal.key} className="flex items-center gap-2.5">
              <signal.Icon
                size={13}
                className={`shrink-0 ${signal.color}`}
                aria-hidden
              />
              <p className="text-sm text-white/70">{signal.label}</p>
            </li>
          ))}
        </ul>
      )}
    </GunimiCard>
  );
}

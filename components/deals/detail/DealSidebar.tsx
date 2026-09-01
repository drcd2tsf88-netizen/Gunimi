"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import {
  Activity,
  Briefcase,
  Building2,
  Calendar,
  ShieldCheck,
  Target,
  TrendingUp,
  User,
} from "lucide-react";

import { useTranslations } from "next-intl";

import GunimiCard from "@/components/ui/GunimiCard";

import { updateDeal } from "@/server/actions/deals/updateDeal";
import { Deal } from "@/types/deal";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { computeDealHealth } from "@/lib/deals/dealHealth";

type Props = {
  deal: Deal;
};

const CREATED_AT_NOW = new Date();

export default function DealSidebar({ deal }: Props) {
  const t = useTranslations("deals");

  const [editingDate, setEditingDate] = useState(false);
  const [closeDateValue, setCloseDateValue] = useState(
    deal.expected_close_date ? deal.expected_close_date.split("T")[0] : ""
  );
  const [, startDateSave] = useTransition();

  function handleDateSave() {
    setEditingDate(false);
    startDateSave(async () => {
      await updateDeal({
        dealId: deal.id,
        title: deal.title,
        stage: deal.stage,
        companyId: deal.company?.id,
        contactId: deal.contact?.id,
        value: deal.value ?? 0,
        paidAmount: deal.paid_amount ?? 0,
        currency: deal.currency ?? "EUR",
        probability: deal.probability ?? 25,
        description: deal.description,
        expectedCloseDate: closeDateValue || undefined,
        expiryDate: deal.expiry_date ?? undefined,
        lostReason: deal.lost_reason ?? undefined,
      });
    });
  }

  const expectedRevenue =
    Number(deal.value || 0) *
    (Number(deal.probability || 0) / 100);

  const daysOpen = Math.max(
    0,
    Math.floor(
      (CREATED_AT_NOW.getTime() - new Date(deal.created_at).getTime()) /
        86400000
    )
  );

  const health = computeDealHealth(
    deal.probability,
    deal.updated_at,
    deal.expected_close_date,
    deal.stage
  );

  const closeLabel = deal.expected_close_date
    ? new Date(deal.expected_close_date).toLocaleDateString(
        undefined,
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      )
    : "—";

  const metrics = [
    {
      icon: TrendingUp,
      label: t("value"),
      value: formatCurrency(Number(deal.value || 0)),
    },
    {
      icon: Target,
      label: t("probability"),
      value: `${deal.probability || 0}%`,
    },
    {
      icon: Activity,
      label: t("expectedRevenue"),
      value: formatCurrency(Math.round(expectedRevenue)),
    },
    {
      icon: Briefcase,
      label: t("daysOpen"),
      value: String(daysOpen),
    },
  ];

  const hasRelations =
    deal.company || deal.contact || deal.owner;

  const healthColor = { bar: health.barClass, text: health.textClass, badge: health.badgeClass };

  return (
    <div className="space-y-4">
      {/* DEAL HEALTH */}

      <GunimiCard className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={13} className={healthColor.text} />
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {t("dealHealth")}
            </p>
          </div>
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${healthColor.badge}`}>
            {health.label}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-end justify-between">
            <span className={`text-3xl font-bold ${healthColor.text}`}>{health.score}</span>
            <span className="text-xs text-white/30">/100</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${healthColor.bar}`}
              style={{ width: `${health.score}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-white/25">
            {t("healthScoreHint")}
          </p>
        </div>
      </GunimiCard>

      {/* DEAL METRICS */}

      <GunimiCard className="p-5">
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.18em]

            text-zinc-500
          "
        >
          {t("dealDetails")}
        </p>

        <div className="mt-4 space-y-3">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2

                  text-white/40
                "
              >
                <item.icon size={12} />

                <span className="text-xs">
                  {item.label}
                </span>
              </div>

              <span
                className="
                  text-sm
                  font-medium
                  text-white
                "
              >
                {item.value}
              </span>
            </div>
          ))}

          {/* Expected close date — editable */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-white/40">
              <Calendar size={12} />
              <span className="text-xs">{t("expectedClose")}</span>
            </div>
            {editingDate ? (
              <input
                type="date"
                autoFocus
                value={closeDateValue}
                onChange={(e) => setCloseDateValue(e.target.value)}
                onBlur={handleDateSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleDateSave();
                  if (e.key === "Escape") setEditingDate(false);
                }}
                className="rounded-lg border border-violet-500/30 bg-white/[0.04] px-2 py-0.5 text-xs font-medium text-white outline-none focus:border-violet-500/50 [color-scheme:dark]"
              />
            ) : (
              <button
                onClick={() => setEditingDate(true)}
                className="text-sm font-medium text-white transition-colors hover:text-violet-300"
              >
                {closeLabel}
              </button>
            )}
          </div>
        </div>

        {deal.stage === "lost" && deal.lost_reason && (
          <div
            className="
              mt-4

              rounded-xl

              border
              border-red-500/10

              bg-red-500/[0.05]

              p-3
            "
          >
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.14em]

                text-red-400/70
              "
            >
              {t("lostReason")}
            </p>

            <p
              className="
                mt-1

                text-xs
                text-red-300/80
              "
            >
              {deal.lost_reason}
            </p>
          </div>
        )}
      </GunimiCard>

      {/* RELATIONS */}

      {hasRelations && (
        <GunimiCard className="p-5">
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.18em]

              text-zinc-500
            "
          >
            {t("relationships")}
          </p>

          <div className="mt-4 space-y-2">
            {deal.company && (
              <Link
                href={`/dashboard/companies/${deal.company.id}`}
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3

                    rounded-xl

                    border
                    border-white/[0.06]

                    bg-white/[0.02]

                    px-3
                    py-2.5

                    transition-all

                    hover:border-violet-500/20
                    hover:bg-white/[0.04]
                  "
                >
                  <Building2
                    size={13}
                    className="shrink-0 text-white/40"
                  />

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        text-[10px]
                        text-white/35
                      "
                    >
                      {t("organization")}
                    </p>

                    <p
                      className="
                        truncate
                        text-sm
                        font-medium
                      "
                    >
                      {deal.company.name}
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {deal.contact && (
              <Link
                href={`/dashboard/contacts/${deal.contact.id}`}
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3

                    rounded-xl

                    border
                    border-white/[0.06]

                    bg-white/[0.02]

                    px-3
                    py-2.5

                    transition-all

                    hover:border-violet-500/20
                    hover:bg-white/[0.04]
                  "
                >
                  <User
                    size={13}
                    className="shrink-0 text-white/40"
                  />

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        text-[10px]
                        text-white/35
                      "
                    >
                      {t("contact")}
                    </p>

                    <p
                      className="
                        truncate
                        text-sm
                        font-medium
                      "
                    >
                      {deal.contact.name}
                    </p>

                    {deal.contact.email && (
                      <p
                        className="
                          truncate
                          text-[11px]
                          text-white/40
                        "
                      >
                        {deal.contact.email}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )}

            {deal.owner && (
              <div
                className="
                  flex
                  items-center
                  gap-3

                  rounded-xl

                  border
                  border-white/[0.06]

                  bg-white/[0.02]

                  px-3
                  py-2.5
                "
              >
                <Briefcase
                  size={13}
                  className="shrink-0 text-white/40"
                />

                <div className="min-w-0 flex-1">
                  <p
                    className="
                      text-[10px]
                      text-white/35
                    "
                  >
                    {t("owner")}
                  </p>

                  <p
                    className="
                      truncate
                      text-sm
                      font-medium
                    "
                  >
                    {deal.owner.full_name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </GunimiCard>
      )}
    </div>
  );
}

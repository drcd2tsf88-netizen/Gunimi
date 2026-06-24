"use client";

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

import OrbitCard from "@/components/ui/OrbitCard";

import { Deal } from "@/types/deal";

type Props = {
  deal: Deal;
};

const STAGE_WEIGHTS: Record<string, number> = {
  negotiation: 1.2,
  proposal: 1.0,
  qualified: 0.85,
  lead: 0.7,
};

function computeDealHealth(
  probability: number | undefined,
  updatedAt: string | undefined,
  expectedCloseDate: string | undefined,
  stage: string
): { healthScore: number; healthLabel: "Healthy" | "Warning" | "At Risk" } {
  const now = Date.now();
  const MS_PER_DAY = 86_400_000;

  const daysSinceUpdated = updatedAt
    ? Math.floor((now - new Date(updatedAt).getTime()) / MS_PER_DAY)
    : 30;

  const daysUntilClose = expectedCloseDate
    ? Math.floor((new Date(expectedCloseDate).getTime() - now) / MS_PER_DAY)
    : null;

  const stageWeight = STAGE_WEIGHTS[stage.toLowerCase()] ?? 1.0;
  const base = probability != null ? probability : stageWeight * 50;
  const staleFactor = Math.max(0, 1 - daysSinceUpdated / 30);

  let urgencyFactor = 1.0;
  if (daysUntilClose !== null) {
    if (daysUntilClose < 0) urgencyFactor = 0.5;
    else if (daysUntilClose === 0) urgencyFactor = 1.5;
    else if (daysUntilClose <= 7) urgencyFactor = 1.3;
    else if (daysUntilClose <= 14) urgencyFactor = 1.15;
  }

  const raw = base * staleFactor * urgencyFactor;
  const healthScore = Math.max(0, Math.min(100, Math.round(raw)));
  const healthLabel =
    healthScore >= 70 ? "Healthy" : healthScore >= 40 ? "Warning" : "At Risk";

  return { healthScore, healthLabel };
}

const CREATED_AT_NOW = new Date();

export default function DealSidebar({ deal }: Props) {
  const t = useTranslations("deals");

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

  const { healthScore, healthLabel } = computeDealHealth(
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
      value: `€${Number(deal.value || 0).toLocaleString()}`,
    },
    {
      icon: Target,
      label: t("probability"),
      value: `${deal.probability || 0}%`,
    },
    {
      icon: Activity,
      label: t("expectedRevenue"),
      value: `€${Math.round(expectedRevenue).toLocaleString()}`,
    },
    {
      icon: Calendar,
      label: t("expectedClose"),
      value: closeLabel,
    },
    {
      icon: Briefcase,
      label: t("daysOpen"),
      value: String(daysOpen),
    },
  ];

  const hasRelations =
    deal.company || deal.contact || deal.owner;

  const healthColor =
    healthLabel === "Healthy"
      ? { bar: "bg-emerald-400", text: "text-emerald-300", badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" }
      : healthLabel === "Warning"
        ? { bar: "bg-amber-400", text: "text-amber-300", badge: "border-amber-500/20 bg-amber-500/10 text-amber-300" }
        : { bar: "bg-red-400", text: "text-red-300", badge: "border-red-500/20 bg-red-500/10 text-red-300" };

  return (
    <div className="space-y-4">
      {/* DEAL HEALTH */}

      <OrbitCard className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={13} className={healthColor.text} />
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {t("dealHealth")}
            </p>
          </div>
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${healthColor.badge}`}>
            {healthLabel}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-end justify-between">
            <span className={`text-3xl font-bold ${healthColor.text}`}>{healthScore}</span>
            <span className="text-xs text-white/30">/100</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${healthColor.bar}`}
              style={{ width: `${healthScore}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-white/25">
            {t("healthScoreHint")}
          </p>
        </div>
      </OrbitCard>

      {/* DEAL METRICS */}

      <OrbitCard className="p-5">
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
      </OrbitCard>

      {/* RELATIONS */}

      {hasRelations && (
        <OrbitCard className="p-5">
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
                href={`/dashboard/crm/${deal.contact.id}`}
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
        </OrbitCard>
      )}
    </div>
  );
}

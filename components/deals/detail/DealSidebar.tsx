"use client";

import Link from "next/link";

import {
  Activity,
  Briefcase,
  Building2,
  Calendar,
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

export default function DealSidebar({ deal }: Props) {
  const t = useTranslations("deals");

  const expectedRevenue =
    Number(deal.value || 0) *
    (Number(deal.probability || 0) / 100);

  const daysOpen = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(deal.created_at).getTime()) /
        86400000
    )
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

  return (
    <div className="space-y-4">
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
        </OrbitCard>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Activity } from "lucide-react";
import OrbitCard from "@/components/ui/OrbitCard";
import getRelativeTime from "@/lib/utils/getRelativeTime";

export type DashboardActivityItem = {
  id: string;
  type?: string | null;
  title?: string | null;
  description?: string | null;
  created_at: string;
  company_id?: string | null;
  deal_id?: string | null;
};

type Props = {
  activities: DashboardActivityItem[];
};

function formatType(type?: string | null): string | undefined {
  if (!type) return undefined;
  return type.replaceAll("_", " ");
}

function getEntityHref(item: DashboardActivityItem): string | undefined {
  if (item.deal_id) return `/dashboard/deals/${item.deal_id}`;
  if (item.company_id) return `/dashboard/companies/${item.company_id}`;
  return undefined;
}

export default function RecentActivityWidget({ activities }: Props) {
  const t = useTranslations("dashboard");

  return (
    <OrbitCard className="flex flex-col p-5">
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            {t("recentActivity")}
          </p>
          <p className="mt-0.5 text-xs text-white/30">{t("activityLabel")}</p>
        </div>
        <Link
          href="/dashboard/activity"
          className="text-[10px] uppercase tracking-[0.14em] text-violet-400/70 transition-colors hover:text-violet-300"
        >
          {t("viewAll")}
        </Link>
      </div>

      <div className="mt-4 flex-1 space-y-1">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <Activity className="h-6 w-6 text-white/20" />
            <p className="mt-3 text-sm font-medium text-white/60">{t("noActivity")}</p>
            <p className="mt-1 text-xs text-white/30">{t("noActivityDescription")}</p>
          </div>
        ) : (
          activities.map((item) => {
            const href = getEntityHref(item);
            const typeLabel = formatType(item.type);

            const content = (
              <div className="flex items-start gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/[0.02]">
                <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400/60" />
                <div className="min-w-0 flex-1">
                  {typeLabel && (
                    <p className="text-[9px] uppercase tracking-wide text-violet-400/60">{typeLabel}</p>
                  )}
                  <p className="truncate text-xs text-white/70">{item.title || item.description || t("workspaceEvent")}</p>
                </div>
                <span className="shrink-0 text-[10px] text-white/25">
                  {getRelativeTime(item.created_at)}
                </span>
              </div>
            );

            return href ? (
              <Link key={item.id} href={href} className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500/50 rounded-xl">
                {content}
              </Link>
            ) : (
              <div key={item.id}>{content}</div>
            );
          })
        )}
      </div>
    </OrbitCard>
  );
}

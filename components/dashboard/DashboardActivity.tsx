"use client";

import { useTranslations }
from "next-intl";

import OrbitActivityFeed
from "@/components/ui/OrbitActivityFeed";

type ActivityItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  company_id?: string | null;
  deal_id?: string | null;
};

type Props = {
  loading: boolean;
  activity: ActivityItem[];
};

export default function DashboardActivity({
  loading,
  activity,
}: Props) {
  const t = useTranslations();

  return (
    <OrbitActivityFeed
      items={activity}
      loading={loading}
      badge={t("dashboard.activityCenter")}
      feedTitle={t("dashboard.operationsFeed")}
      subtitle={t("dashboard.operationsFeedSubtitle")}
      emptyTitle={t("dashboard.noActivity")}
      emptyDescription={t(
        "dashboard.noActivityDescription"
      )}
      compact
      dateDisplay="relative"
      itemFallback={t("dashboard.workspaceEvent")}
      getItemHref={(item) => {
        if (item.deal_id) return `/dashboard/deals/${item.deal_id}`;
        if (item.company_id) return `/dashboard/companies/${item.company_id}`;
        return undefined;
      }}
    />
  );
}

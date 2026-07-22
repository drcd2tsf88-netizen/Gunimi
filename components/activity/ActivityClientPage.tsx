"use client";

import { useEffect, useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import CountUp from "react-countup";

import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiSection from "@/components/layout/GunimiSection";
import GunimiCard from "@/components/ui/GunimiCard";
import GunimiActivityFeed from "@/components/ui/GunimiActivityFeed";

import { supabase } from "@/lib/supabase";

import { getWorkspaceActivity, getWorkspaceActivityCount } from "@/server/actions/activity/getWorkspaceActivity";

type ActivityItem = {
  id: string;
  type: string;
  title?: string;
  description?: string;
  message?: string;
  created_at: string;
  company_id?: string | null;
  deal_id?: string | null;
  contact_id?: string | null;
};

export default function ActivityClientPage() {
  const t = useTranslations("activity");

  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivity() {
      try {
        setLoading(true);

        const [data, count] = await Promise.all([
          getWorkspaceActivity(20),
          getWorkspaceActivityCount(),
        ]);

        setActivity(data);
        setTotalCount(count);
      } catch {
        // silent — activity feed degrades gracefully
      } finally {
        setLoading(false);
      }
    }

    void loadActivity();

    const channel = supabase
      .channel("workspace-activity-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workspace_activity" },
        () => { void loadActivity(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const aiCount = useMemo(
    () => activity.filter((item) => item.type?.includes("ai")).length,
    [activity]
  );

  const taskCount = useMemo(
    () => activity.filter((item) => item.type?.includes("task")).length,
    [activity]
  );

  return (
    <div className="space-y-8">
      <GunimiSection>
        <GunimiHeading
          badge={t("badge")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
      </GunimiSection>

      <GunimiSection>
        <div className="grid gap-5 md:grid-cols-3">
          <GunimiCard className="p-6">
            <p className="text-sm text-white/50">{t("totalEvents")}</p>
            <h2 className="mt-4 text-4xl font-semibold">
              <CountUp end={totalCount} />
            </h2>
          </GunimiCard>

          <GunimiCard className="p-6">
            <p className="text-sm text-white/50">{t("aiExecutions")}</p>
            <h2 className="mt-4 text-4xl font-semibold">
              <CountUp end={aiCount} />
            </h2>
          </GunimiCard>

          <GunimiCard className="p-6">
            <p className="text-sm text-white/50">{t("taskEvents")}</p>
            <h2 className="mt-4 text-4xl font-semibold">
              <CountUp end={taskCount} />
            </h2>
          </GunimiCard>
        </div>
      </GunimiSection>

      {loading && (
        <GunimiSection>
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <GunimiCard key={item} className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 w-40 rounded-full bg-white/10" />
                  <div className="mt-5 h-5 w-full rounded-full bg-white/10" />
                </div>
              </GunimiCard>
            ))}
          </div>
        </GunimiSection>
      )}

      {!loading && (
        <GunimiActivityFeed
          items={activity}
          emptyTitle={t("noActivity")}
          emptyDescription={t("noActivityDescription")}
          dateDisplay="localeString"
          itemFallback={t("workspaceEvent")}
          getItemHref={(item) => {
            if (item.deal_id) return `/dashboard/deals/${item.deal_id}`;
            if (item.company_id) return `/dashboard/companies/${item.company_id}`;
            if (item.contact_id) return `/dashboard/contacts/${item.contact_id}`;
            return undefined;
          }}
        />
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import { useTranslations } from "next-intl";
import OrbitSection from "@/components/layout/OrbitSection";
import OrbitHeading from "@/components/ui/OrbitHeading";
import OrbitCard from "@/components/ui/OrbitCard";
import OrbitEmptyState from "@/components/ui/OrbitEmptyState";
import { WorkspaceActivity } from "@/types/activity";

type ActivityWithLinks = WorkspaceActivity & {
  company_id?: string | null;
  deal_id?: string | null;
};

type Props = {
  activity: ActivityWithLinks[];
};

function getEntityHref(item: ActivityWithLinks): string | undefined {
  if (item.deal_id) return `/dashboard/deals/${item.deal_id}`;
  if (item.company_id) return `/dashboard/companies/${item.company_id}`;
  return undefined;
}

export default function ContactActivity({ activity }: Props) {
  const t = useTranslations("contacts");

  return (
    <OrbitSection>
      <OrbitHeading
        badge={t("activityBadge")}
        title={t("activity")}
        subtitle={t("activitySubtitle")}
      />

      {activity.length === 0 ? (
        <OrbitEmptyState
          title={t("noActivity")}
          description={t("noActivityDescription")}
          icon={Activity}
        />
      ) : (
        <div className="mt-6 space-y-3">
          {activity.map((item) => {
            const href = getEntityHref(item);

            const card = (
              <OrbitCard className="p-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium">{item.title}</h3>
                    <p className="mt-2 text-sm text-white/60">
                      {item.description || item.message}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-xs text-white/40">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </OrbitCard>
            );

            return href ? (
              <Link
                key={item.id}
                href={href}
                className="block rounded-2xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500/50"
              >
                {card}
              </Link>
            ) : (
              <div key={item.id}>{card}</div>
            );
          })}
        </div>
      )}
    </OrbitSection>
  );
}

"use client";

import { TrendingUp, Briefcase, Users, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

import GunimiSection from "@/components/layout/GunimiSection";
import GunimiStatCard from "@/components/ui/GunimiStatCard";
import { formatCurrency } from "@/lib/utils/formatCurrency";

import type { Company } from "@/types/company";
import type { Deal } from "@/types/deal";
import type { Contact } from "@/types/contact";

type Props = {
  company: Company;
  contacts: Contact[];
  deals: Deal[];
};

export default function CompanyWorkspaceMetrics({ company, contacts, deals }: Props) {
  const t = useTranslations("companies");

  const openDealsCount = deals.filter(
    (d) => d.stage !== "won" && d.stage !== "lost",
  ).length;

  const lastActivityValue = company.last_activity_at
    ? new Date(company.last_activity_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : t("metricNever");

  return (
    <GunimiSection>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <GunimiStatCard
          title={t("metricPipelineValue")}
          value={formatCurrency(Number(company.pipeline_value || 0))}
          icon={TrendingUp}
        />
        <GunimiStatCard
          title={t("metricActiveDeals")}
          value={String(openDealsCount)}
          icon={Briefcase}
        />
        <GunimiStatCard
          title={t("metricContacts")}
          value={String(contacts.length)}
          icon={Users}
        />
        <GunimiStatCard
          title={t("metricLastActivity")}
          value={lastActivityValue}
          icon={Clock}
        />
      </div>
    </GunimiSection>
  );
}

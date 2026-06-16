"use client";

import {
  Users,
  Briefcase,
  TrendingUp,
  Activity,
} from "lucide-react";

import { useTranslations }
from "next-intl";

import OrbitMetricGrid
from "@/components/ui/OrbitMetricGrid";

import { Company }
from "@/types/company";

import { Contact }
from "@/types/contact";

import { Deal }
from "@/types/deal";

type Props = {
  company: Company;
  contacts: Contact[];
  deals: Deal[];
};

export default function CompanyMetrics({
  company,
  contacts,
  deals,
}: Props) {
  const t = useTranslations();

  const pipelineValue = deals.reduce(
    (sum, deal) => sum + Number(deal.value || 0),
    0
  );

  return (
    <OrbitMetricGrid
      items={[
        {
          label: t("companies.relationships"),
          value: String(contacts.length),
          icon: Users,
        },
        {
          label: t("companies.openDeals"),
          value: String(
            deals.filter(
              (deal) =>
                deal.stage !== "won" &&
                deal.stage !== "lost"
            ).length
          ),
          icon: Briefcase,
        },
        {
          label: t("companies.pipelineValue"),
          value: `€${pipelineValue.toLocaleString()}`,
          icon: TrendingUp,
        },
        {
          label: t("companies.annualValue"),
          value: `€${Number(company?.annual_value || 0).toLocaleString()}`,
          icon: Activity,
        },
      ]}
    />
  );
}

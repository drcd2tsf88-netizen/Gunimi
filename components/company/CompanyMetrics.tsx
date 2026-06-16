"use client";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitStatCard
from "@/components/ui/OrbitStatCard";

import {
  Users,
  Briefcase,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useTranslations }from "next-intl"; 

type Props = {
  company: any;
  contacts: any[];
  deals: any[];
};

export default function CompanyMetrics({
  company,
  contacts,
  deals,
}: Props) {
  const t = useTranslations();

  const pipelineValue =
    deals.reduce(
      (sum, deal) =>
        sum +
        Number(
          deal.value || 0
        ),
      0
    );

  return (
    <OrbitSection>
      <div
        className="
          grid
          gap-4

          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        <OrbitStatCard
          title={t(
  "companies.relationships"
)}
          value={String(
            contacts.length
          )}
          icon={Users}
        />

        <OrbitStatCard
          title={t(
  "companies.openDeals"
)}
          value={String(
            deals.filter(
              (deal) =>
                deal.stage !==
                  "won" &&
                deal.stage !==
                  "lost"
            ).length
          )}
          icon={Briefcase}
        />

        <OrbitStatCard
          title={t(
  "companies.pipelineValue"
)}
          value={`€${pipelineValue.toLocaleString()}`}
          icon={TrendingUp}
        />

        <OrbitStatCard
          title={t(
  "companies.annualValue"
)}
          value={`€${Number(
            company?.annual_value ||
            0
          ).toLocaleString()}`}
          icon={Activity}
        />
      </div>
    </OrbitSection>
  );
}
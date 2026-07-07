"use client";

import {
  Building2,
  Users,
  TrendingUp,
  Landmark,
} from "lucide-react";

import { useTranslations }
from "next-intl";

import GunimiMetricGrid
from "@/components/ui/GunimiMetricGrid";

import { Company }
from "@/types/company";

import { formatCurrency } from "@/lib/utils/formatCurrency";

type Props = {
  companies: Company[];
};

export default function CompaniesMetrics({
  companies,
}: Props) {
  const t = useTranslations();

  const organizations = companies.length;

  const relationships = companies.reduce(
    (total, company) =>
      total + Number(company.contacts_count || 0),
    0
  );

  const pipelineValue = companies.reduce(
    (total, company) =>
      total + Number(company.pipeline_value || 0),
    0
  );

  const annualValue = companies.reduce(
    (total, company) =>
      total + Number(company.annual_value || 0),
    0
  );

  return (
    <GunimiMetricGrid
      items={[
        {
          label: t("companies.organizations"),
          value: organizations,
          icon: Building2,
        },
        {
          label: t("companies.relationships"),
          value: relationships,
          icon: Users,
        },
        {
          label: t("companies.pipelineValue"),
          value: formatCurrency(pipelineValue),
          icon: TrendingUp,
        },
        {
          label: t("companies.annualValue"),
          value: formatCurrency(annualValue),
          icon: Landmark,
        },
      ]}
      variant="metric"
    />
  );
}

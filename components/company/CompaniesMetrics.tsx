"use client";

import {
  Building2,
  Users,
  TrendingUp,
  Landmark,
} from "lucide-react";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitCard
from "@/components/ui/OrbitCard";

import { useTranslations }
from "next-intl";

import { Company } from "@/types/company";

type Props = {
  companies: Company[];
};

export default function CompaniesMetrics({
  companies,
}: Props) {
  const t =
    useTranslations();

  const organizations =
    companies.length;

  const relationships =
    companies.reduce(
      (
        total,
        company
      ) =>
        total +
        Number(
          company.contacts_count ||
            0
        ),
      0
    );

  const pipelineValue =
    companies.reduce(
      (
        total,
        company
      ) =>
        total +
        Number(
          company.pipeline_value ||
            0
        ),
      0
    );

  const annualValue =
    companies.reduce(
      (
        total,
        company
      ) =>
        total +
        Number(
          company.annual_value ||
            0
        ),
      0
    );

  const metrics = [
    {
      label:
        t(
          "companies.organizations"
        ),
      value:
        organizations,
      icon:
        Building2,
    },

    {
      label:
        t(
          "companies.relationships"
        ),
      value:
        relationships,
      icon:
        Users,
    },

    {
      label:
        t(
          "companies.pipelineValue"
        ),
      value:
        `€${pipelineValue.toLocaleString()}`,
      icon:
        TrendingUp,
    },

    {
      label:
        t(
          "companies.annualValue"
        ),
      value:
        `€${annualValue.toLocaleString()}`,
      icon:
        Landmark,
    },
  ];

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
        {metrics.map(
          (metric) => {
            const Icon =
              metric.icon;

            return (
              <OrbitCard
                key={
                  metric.label
                }
                className="
                  p-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <p
                    className="
                      text-sm
                      text-white/50
                    "
                  >
                    {
                      metric.label
                    }
                  </p>

                  <Icon
                    size={18}
                    className="
                      text-violet-300
                    "
                  />
                </div>

                <h3
                  className="
                    mt-4

                    text-2xl
                    font-semibold
                  "
                >
                  {
                    metric.value
                  }
                </h3>
              </OrbitCard>
            );
          }
        )}
      </div>
    </OrbitSection>
  );
}
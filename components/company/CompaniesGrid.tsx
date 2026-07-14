"use client";

import { useState } from "react";

import { useRouter }
from "next/navigation";

import {
  ArrowRight,
  Building2,
  PlusCircle,
} from "lucide-react";

import GunimiSection
from "@/components/layout/GunimiSection";

import GunimiCard
from "@/components/ui/GunimiCard";

import GunimiEmptyState
from "@/components/ui/GunimiEmptyState";

import GunimiButton
from "@/components/ui/GunimiButton";

import { useTranslations }
from "next-intl";

import CreateOrganizationModal
from "@/components/company/CreateOrganizationModal";

import getRelativeTime
from "@/lib/utils/getRelativeTime";

import { Company } from "@/types/company";
import { formatCurrency } from "@/lib/utils/formatCurrency";

type Props = {
  companies: Company[];
};

export default function CompaniesGrid({
  companies,
}: Props) {
  const router =
    useRouter();

  const t =
    useTranslations();

  const [createOpen, setCreateOpen] = useState(false);

  if (companies.length === 0) {
    return (
      <GunimiSection>
        <GunimiEmptyState
          icon={Building2}
          title={t("companies.onboardingEmptyTitle")}
          description={t("companies.onboardingEmptyDescription")}
          action={
            <GunimiButton onClick={() => setCreateOpen(true)}>
              <PlusCircle size={14} />
              {t("companies.onboardingCreateCompany")}
            </GunimiButton>
          }
        />
        <CreateOrganizationModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        />
      </GunimiSection>
    );
  }

  return (
    <GunimiSection>
      <div
        className="
          grid
          gap-4

          md:grid-cols-2
        "
      >
        {companies.map(
          (company) => (
            <GunimiCard
              key={
                company.id
              }
              onClick={() =>
                router.push(
                  `/dashboard/companies/${company.id}`
                )
              }
              className="
                cursor-pointer

                p-5

                transition-all

                hover:border-violet-500/30
                hover:bg-violet-500/[0.04]
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                "
              >
                <div>
                  <h3
                    className="
                      text-lg
                      font-semibold
                    "
                  >
                    {
                      company.name
                    }
                  </h3>

                  <p
                    className="
                      mt-2

                      text-sm

                      text-white/50
                    "
                  >
                    {[
                      company.industry,
                      company.country,
                    ]
                      .filter(
                        Boolean
                      )
                      .join(
                        " • "
                      )}
                  </p>
                </div>

                <Building2
                  size={18}
                  className="
                    text-violet-300
                  "
                />
              </div>

              <div
                className="
                  mt-6

                  grid
                  grid-cols-2
                  gap-4
                "
              >
                <div>
                  <p
                    className="
                      text-xs
                      text-white/40
                    "
                  >
                    {t(
                      "companies.relationships"
                    )}
                  </p>

                  <p
                    className="
                      mt-1
                    "
                  >
                    {
                      company.contacts_count
                    }
                  </p>
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      text-white/40
                    "
                  >
                    {t(
                      "companies.commercialOpportunities"
                    )}
                  </p>

                  <p
                    className="
                      mt-1
                    "
                  >
                    {
                      company.deals_count
                    }
                  </p>
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      text-white/40
                    "
                  >
                    {t(
                      "companies.annualValue"
                    )}
                  </p>

                  <p
                    className="
                      mt-1
                    "
                  >
                    {formatCurrency(Number(company.annual_value || 0))}
                  </p>
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      text-white/40
                    "
                  >
                    {t(
                      "companies.owner"
                    )}
                  </p>

                  <p
                    className="
                      mt-1
                    "
                  >
                    {company.owner
                      ?.full_name ||
                      t(
                        "companies.unassigned"
                      )}
                  </p>
                  
                </div>
              </div>

              <div
                className="
                  mt-6

                  flex
                  items-center
                  justify-between
                "
              >
                <span
                  className="
                    text-xs
                    text-white/40
                  "
                >
                  <p
  className="
    text-xs
    text-white/40
  "
>
  {t(
    "companies.lastActivity"
  )}
</p>
                  {company.last_activity_at
                    ? getRelativeTime(
                        company.last_activity_at
                      )
                      
                    : "-"}
                </span>

                <ArrowRight
                  size={16}
                  className="
                    text-violet-300
                  "
                />
              </div>
            </GunimiCard>
          )
        )}
      </div>
    </GunimiSection>
  );
}
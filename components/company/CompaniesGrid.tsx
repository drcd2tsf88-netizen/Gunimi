"use client";

import { useState } from "react";

import { useRouter }
from "next/navigation";

import {
  ArrowRight,
  Building2,
  PlusCircle,
} from "lucide-react";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitCard
from "@/components/ui/OrbitCard";

import { useTranslations }
from "next-intl";

import CreateOrganizationModal
from "@/components/company/CreateOrganizationModal";

import getRelativeTime
from "@/lib/utils/getRelativeTime";

import { Company } from "@/types/company";

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
      <OrbitSection>
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-8 py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <Building2 size={22} className="text-violet-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white/90">
              {t("companies.onboardingEmptyTitle")}
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/35">
              {t("companies.onboardingEmptyDescription")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition-all hover:bg-violet-500/15"
          >
            <PlusCircle size={14} />
            {t("companies.onboardingCreateCompany")}
          </button>
        </div>
        <CreateOrganizationModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        />
      </OrbitSection>
    );
  }

  return (
    <OrbitSection>
      <div
        className="
          grid
          gap-4

          xl:grid-cols-2
        "
      >
        {companies.map(
          (company) => (
            <OrbitCard
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
                    €
                    {Number(
                      company.annual_value ||
                        0
                    ).toLocaleString()}
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
            </OrbitCard>
          )
        )}
      </div>
    </OrbitSection>
  );
}
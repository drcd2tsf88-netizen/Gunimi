"use client";

import { useState, useCallback } from "react";

import { useRouter }
from "next/navigation";

import {
  ArrowRight,
  Building2,
  PlusCircle,
  Search,
  Star,
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
import { toggleCompanyPriority } from "@/server/actions/company/toggleCompanyPriority";

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
  const [localCompanies, setLocalCompanies] = useState(companies);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"name_asc" | "name_desc" | "contacts_desc" | "deals_desc" | "value_desc" | "recent">("name_asc");

  const handleTogglePriority = useCallback(async (company: Company, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !company.is_priority;
    setLocalCompanies((prev) => prev.map((c) => c.id === company.id ? { ...c, is_priority: next } : c));
    await toggleCompanyPriority(company.id, next);
  }, []);

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

  const filtered = (() => {
    const list = query.trim()
      ? localCompanies.filter((c) =>
          [c.name, c.industry, c.country]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(query.toLowerCase()))
        )
      : localCompanies;
    const sorted = [...list];
    if (sortOrder === "name_asc") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortOrder === "name_desc") sorted.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortOrder === "contacts_desc") sorted.sort((a, b) => (b.contacts_count ?? 0) - (a.contacts_count ?? 0));
    else if (sortOrder === "deals_desc") sorted.sort((a, b) => (b.deals_count ?? 0) - (a.deals_count ?? 0));
    else if (sortOrder === "value_desc") sorted.sort((a, b) => (b.annual_value ?? 0) - (a.annual_value ?? 0));
    else if (sortOrder === "recent") sorted.sort((a, b) => new Date(b.last_activity_at ?? b.created_at ?? "").getTime() - new Date(a.last_activity_at ?? a.created_at ?? "").getTime());
    return sorted;
  })();

  return (
    <GunimiSection>
      {/* Search + Sort */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
          <Search size={14} className="shrink-0 text-zinc-600" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("companies.searchOrganizations")}
            className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/25 outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-xs text-white/25 hover:text-white/60">
              ×
            </button>
          )}
        </div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
          className="h-10 rounded-xl border border-white/[0.08] bg-zinc-900 px-3 text-sm text-zinc-300 outline-none focus:border-violet-500/40 cursor-pointer"
        >
          <option value="name_asc">{t("common.sortNameAz")}</option>
          <option value="name_desc">{t("common.sortNameZa")}</option>
          <option value="contacts_desc">{t("common.sortMostContacts")}</option>
          <option value="deals_desc">{t("common.sortMostDeals")}</option>
          <option value="value_desc">{t("common.sortValueDesc")}</option>
          <option value="recent">{t("common.sortRecentActivity")}</option>
        </select>
      </div>

      <div
        className="
          grid
          gap-4

          md:grid-cols-2
        "
      >
        {filtered.length === 0 && (
          <div className="col-span-2 py-12 text-center text-sm text-white/25">
            {t("companies.noSearchResults" as Parameters<typeof t>[0])}
          </div>
        )}
        {filtered.map(
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleTogglePriority(company, e)}
                    className="p-1 transition-colors"
                  >
                    <Star
                      size={15}
                      className={company.is_priority ? "fill-amber-400 text-amber-400" : "text-white/20 hover:text-amber-300"}
                    />
                  </button>
                  <Building2 size={18} className="text-violet-300" />
                </div>
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
"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import GunimiWorkspaceHeader from "@/components/ui/GunimiWorkspaceHeader";
import type { WorkspaceHealth } from "@/components/ui/GunimiWorkspaceHeader";
import GunimiButton from "@/components/ui/GunimiButton";

import type { Company } from "@/types/company";
import { MS_PER_DAY, STALE_COMPANY_DAYS, WARNING_COMPANY_DAYS } from "@/lib/companies/constants";

type Props = {
  company: Company;
  contactsCount: number;
  openDealsCount: number;
  onEdit: () => void;
};

export default function CompanyWorkspaceHeader({
  company,
  contactsCount,
  openDealsCount,
  onEdit,
}: Props) {
  const t = useTranslations("companies");
  const tCommon = useTranslations("common");

  const [now] = useState(() => Date.now());
  const daysSinceActivity = company.last_activity_at
    ? Math.floor((now - new Date(company.last_activity_at).getTime()) / MS_PER_DAY)
    : null;

  let health: WorkspaceHealth;
  if (daysSinceActivity === null || daysSinceActivity > STALE_COMPANY_DAYS) {
    health = { level: "at-risk", label: t("healthStatusAtRisk") };
  } else if (
    daysSinceActivity > WARNING_COMPANY_DAYS ||
    contactsCount === 0 ||
    openDealsCount === 0
  ) {
    health = { level: "warning", label: t("healthStatusCoolingDown") };
  } else {
    health = { level: "healthy", label: t("healthStatusActive") };
  }

  const contextParts = [company.industry, company.country].filter(Boolean);
  const context =
    contextParts.length > 0 ? (
      <p className="text-xs text-white/40">{contextParts.join(" · ")}</p>
    ) : undefined;

  const actions = (
    <GunimiButton
      variant="secondary"
      onClick={onEdit}
      className="flex items-center gap-1.5 px-3"
    >
      <Pencil size={13} />
      {tCommon("edit")}
    </GunimiButton>
  );

  return (
    <GunimiWorkspaceHeader
      type={t("workspaceType")}
      title={company.name}
      context={context}
      owner={company.owner?.full_name}
      health={health}
      backHref="/dashboard/companies"
      backLabel={t("backToCompanies")}
      actions={actions}
    />
  );
}

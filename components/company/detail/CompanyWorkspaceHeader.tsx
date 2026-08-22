"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  ExternalLink,
  Pencil,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

import GunimiButton from "@/components/ui/GunimiButton";
import TagPicker from "@/components/ui/TagPicker";
import { formatCurrency } from "@/lib/utils/formatCurrency";

import type { Company } from "@/types/company";
import type { Deal } from "@/types/deal";
import type { Contact } from "@/types/contact";
import type { WorkspaceTag } from "@/types/tag";
import { MS_PER_DAY, STALE_COMPANY_DAYS, WARNING_COMPANY_DAYS } from "@/lib/companies/constants";

type HealthKey = "active" | "cooling" | "risk";

const HEALTH_STYLES: Record<HealthKey, string> = {
  active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  cooling: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  risk: "border-red-500/20 bg-red-500/10 text-red-300",
};

function companyInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

type Props = {
  company: Company;
  contacts: Contact[];
  deals: Deal[];
  onEdit: () => void;
  allTags: WorkspaceTag[];
  entityTags: WorkspaceTag[];
};

export default function CompanyWorkspaceHeader({
  company,
  contacts,
  deals,
  onEdit,
  allTags,
  entityTags,
}: Props) {
  const t = useTranslations("companies");
  const tc = useTranslations("common");

  const [now] = useState(() => Date.now());
  const openDeals = deals.filter((d) => d.stage !== "won" && d.stage !== "lost");
  const pipelineValue = openDeals.reduce((sum, d) => sum + Number(d.value || 0), 0);

  const days = company.last_activity_at
    ? Math.floor((now - new Date(company.last_activity_at).getTime()) / MS_PER_DAY)
    : null;

  let healthKey: HealthKey;
  let healthLabelKey: "healthStatusActive" | "healthStatusCoolingDown" | "healthStatusAtRisk";
  if (days === null || days > STALE_COMPANY_DAYS) {
    healthKey = "risk";
    healthLabelKey = "healthStatusAtRisk";
  } else if (days > WARNING_COMPANY_DAYS || contacts.length === 0 || openDeals.length === 0) {
    healthKey = "cooling";
    healthLabelKey = "healthStatusCoolingDown";
  } else {
    healthKey = "active";
    healthLabelKey = "healthStatusActive";
  }

  const subLine = [company.industry, company.country].filter(Boolean).join(" · ");

  const lastActivityLabel = company.last_activity_at
    ? new Date(company.last_activity_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : t("metricNever");

  return (
    <>
      {/* Back */}
      <Link
        href="/dashboard/companies"
        className="inline-flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
      >
        <ArrowLeft size={12} />
        {t("backToCompanies")}
      </Link>

      {/* Compact identity strip */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#080C14] px-5 py-4 sm:flex-row sm:items-start sm:justify-between">

        {/* Left — icon + info */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-base font-bold text-violet-300">
            {companyInitials(company.name)}
          </div>

          {/* Info block */}
          <div className="min-w-0 space-y-1.5">
            {/* Name + health */}
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold leading-tight text-white">{company.name}</h1>
              <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", HEALTH_STYLES[healthKey])}>
                {t(healthLabelKey)}
              </span>
              {company.status && (
                <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] capitalize text-zinc-500">
                  {company.status}
                </span>
              )}
            </div>

            {/* Industry · Country */}
            {subLine && (
              <p className="text-xs text-zinc-500">{subLine}</p>
            )}

            {/* Website chip */}
            {company.website && (
              <a
                href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-400 transition-colors hover:border-violet-500/30 hover:text-violet-300"
              >
                <ExternalLink size={10} />
                {company.website.replace(/^https?:\/\//, "")}
              </a>
            )}

            {/* Tags */}
            <TagPicker
              entityType="company"
              entityId={company.id}
              allTags={allTags}
              initialTags={entityTags}
            />

            {/* Inline metrics strip */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <TrendingUp size={11} className="text-zinc-600" />
                <span className="font-medium tabular-nums text-white/70">{formatCurrency(pipelineValue)}</span>
                <span className="text-zinc-600">{t("metricPipelineValue")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Briefcase size={11} className="text-zinc-600" />
                <span className="font-medium tabular-nums text-white/70">{openDeals.length}</span>
                <span className="text-zinc-600">{t("metricActiveDeals")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Users size={11} className="text-zinc-600" />
                <span className="font-medium tabular-nums text-white/70">{contacts.length}</span>
                <span className="text-zinc-600">{t("metricContacts")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Building2 size={11} className="text-zinc-600" />
                <span className="font-medium text-white/70">{lastActivityLabel}</span>
                <span className="text-zinc-600">{t("metricLastActivity")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Edit */}
        <div className="shrink-0 sm:pt-0.5">
          <GunimiButton
            variant="secondary"
            className="h-8 gap-1.5 px-3 text-xs"
            onClick={onEdit}
          >
            <Pencil size={12} />
            {tc("edit")}
          </GunimiButton>
        </div>
      </div>
    </>
  );
}

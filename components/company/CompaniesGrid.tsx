"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  PlusCircle,
  Search,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

import GunimiSection from "@/components/layout/GunimiSection";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import GunimiButton from "@/components/ui/GunimiButton";
import CreateOrganizationModal from "@/components/company/CreateOrganizationModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import getRelativeTime from "@/lib/utils/getRelativeTime";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { toggleCompanyPriority } from "@/server/actions/company/toggleCompanyPriority";
import { MS_PER_DAY, STALE_COMPANY_DAYS, WARNING_COMPANY_DAYS } from "@/lib/companies/constants";
import type { Company } from "@/types/company";

type HealthKey = "active" | "cooling" | "risk";

const HEALTH_BORDER: Record<HealthKey, string> = {
  active: "border-l-emerald-500/70",
  cooling: "border-l-amber-500/70",
  risk: "border-l-red-500/70",
};

const COMPANY_GROUPS: { key: HealthKey; labelKey: "healthStatusActive" | "healthStatusCoolingDown" | "healthStatusAtRisk"; dotClass: string }[] = [
  { key: "active", labelKey: "healthStatusActive", dotClass: "bg-emerald-400" },
  { key: "cooling", labelKey: "healthStatusCoolingDown", dotClass: "bg-amber-400" },
  { key: "risk", labelKey: "healthStatusAtRisk", dotClass: "bg-red-400" },
];

function getCompanyHealth(company: Company): HealthKey {
  if (!company.last_activity_at) return "risk";
  const days = Math.floor((Date.now() - new Date(company.last_activity_at).getTime()) / MS_PER_DAY);
  if (days <= WARNING_COMPANY_DAYS) return "active";
  if (days <= STALE_COMPANY_DAYS) return "cooling";
  return "risk";
}

function companyInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

type RowProps = {
  company: Company;
  health: HealthKey;
  onNavigate: (id: string) => void;
  onTogglePriority: (company: Company, e: React.MouseEvent) => void;
};

function CompanyRow({ company, health, onNavigate, onTogglePriority }: RowProps) {
  const t = useTranslations("companies");

  const subLine = [company.industry, company.country].filter(Boolean).join(" · ");

  return (
    <div
      onClick={() => onNavigate(company.id)}
      className={cn(
        "group relative flex cursor-pointer items-center gap-4 border-l-2 px-4 py-3",
        "border-b border-b-white/[0.04] transition-colors hover:bg-white/[0.025]",
        HEALTH_BORDER[health],
      )}
    >
      {/* Icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-[11px] font-bold text-violet-400">
        {companyInitials(company.name)}
      </div>

      {/* Name + subline */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white/90">{company.name}</p>
        {subLine && <p className="truncate text-xs text-zinc-600">{subLine}</p>}
      </div>

      {/* Contacts */}
      <div className="hidden w-20 shrink-0 text-right sm:block">
        <p className="text-sm tabular-nums text-white/60">{company.contacts_count ?? 0}</p>
        <p className="text-[10px] text-zinc-600">{t("metricContacts")}</p>
      </div>

      {/* Deals */}
      <div className="hidden w-20 shrink-0 text-right md:block">
        <p className="text-sm tabular-nums text-white/60">{company.deals_count ?? 0}</p>
        <p className="text-[10px] text-zinc-600">{t("metricActiveDeals")}</p>
      </div>

      {/* Value */}
      <div className="hidden w-28 shrink-0 text-right lg:block">
        <p className="text-sm tabular-nums text-white/60">
          {formatCurrency(Number(company.annual_value ?? 0))}
        </p>
        <p className="text-[10px] text-zinc-600">{t("annualValue")}</p>
      </div>

      {/* Last activity */}
      <div className="hidden w-24 shrink-0 text-right xl:block">
        <p className="text-xs text-zinc-500">
          {company.last_activity_at ? getRelativeTime(company.last_activity_at) : "—"}
        </p>
      </div>

      {/* Star — always visible on mobile, hover-only on desktop */}
      <button
        onClick={(e) => onTogglePriority(company, e)}
        className="shrink-0 p-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
      >
        <Star
          size={13}
          className={company.is_priority ? "fill-amber-400 text-amber-400 opacity-100" : "text-white/20 hover:text-amber-300"}
        />
      </button>
      {company.is_priority && (
        <Star
          size={13}
          className="absolute right-[52px] top-1/2 -translate-y-1/2 fill-amber-400 text-amber-400 group-hover:hidden"
        />
      )}

      {/* Arrow */}
      <ArrowRight size={14} className="shrink-0 text-zinc-700 transition-colors group-hover:text-violet-400" />
    </div>
  );
}

type GroupHeaderProps = {
  label: string;
  count: number;
  dotClass: string;
  open: boolean;
  onToggle: () => void;
};

function GroupHeader({ label, count, dotClass, open, onToggle }: GroupHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-2 px-4 py-2 text-left transition-colors hover:bg-white/[0.02]"
    >
      <ChevronRight
        size={12}
        className={cn("shrink-0 text-zinc-600 transition-transform", open && "rotate-90")}
      />
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClass)} />
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      <span className="ml-1 rounded-full bg-white/[0.05] px-1.5 py-0.5 text-[10px] tabular-nums text-zinc-600">
        {count}
      </span>
    </button>
  );
}

type Props = {
  companies: Company[];
};

export default function CompaniesGrid({ companies }: Props) {
  const router = useRouter();
  const t = useTranslations("companies");
  const tc = useTranslations("common");
  const tcrm = useTranslations("crm");

  const [createOpen, setCreateOpen] = useState(false);
  const [localCompanies, setLocalCompanies] = useState(companies);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"name_asc" | "name_desc" | "contacts_desc" | "deals_desc" | "value_desc" | "recent">("name_asc");
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<HealthKey>>(new Set());

  const handleTogglePriority = useCallback(async (company: Company, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !company.is_priority;
    setLocalCompanies((prev) => prev.map((c) => c.id === company.id ? { ...c, is_priority: next } : c));
    await toggleCompanyPriority(company.id, next);
  }, []);

  const handleNavigate = useCallback((id: string) => {
    router.push(`/dashboard/companies/${id}`);
  }, [router]);

  const toggleGroup = useCallback((key: HealthKey) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    let list = query.trim()
      ? localCompanies.filter((c) =>
          [c.name, c.industry, c.country]
            .filter(Boolean)
            .some((f) => f!.toLowerCase().includes(query.toLowerCase()))
        )
      : localCompanies;
    if (priorityOnly) list = list.filter((c) => c.is_priority);
    const sorted = [...list];
    if (sortOrder === "name_asc") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortOrder === "name_desc") sorted.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortOrder === "contacts_desc") sorted.sort((a, b) => (b.contacts_count ?? 0) - (a.contacts_count ?? 0));
    else if (sortOrder === "deals_desc") sorted.sort((a, b) => (b.deals_count ?? 0) - (a.deals_count ?? 0));
    else if (sortOrder === "value_desc") sorted.sort((a, b) => (b.annual_value ?? 0) - (a.annual_value ?? 0));
    else if (sortOrder === "recent") sorted.sort((a, b) =>
      new Date(b.last_activity_at ?? b.created_at ?? "").getTime() -
      new Date(a.last_activity_at ?? a.created_at ?? "").getTime()
    );
    return sorted;
  }, [localCompanies, query, priorityOnly, sortOrder]);

  const shouldGroup = !query.trim() && !priorityOnly;

  const grouped = useMemo(() => {
    if (!shouldGroup) return null;
    const map: Record<HealthKey, Company[]> = { active: [], cooling: [], risk: [] };
    for (const c of filtered) map[getCompanyHealth(c)].push(c);
    return map;
  }, [filtered, shouldGroup]);

  const healthMap = useMemo(() => {
    const m = new Map<string, HealthKey>();
    for (const c of filtered) m.set(c.id, getCompanyHealth(c));
    return m;
  }, [filtered]);

  if (companies.length === 0) {
    return (
      <GunimiSection>
        <GunimiEmptyState
          icon={Building2}
          title={t("onboardingEmptyTitle")}
          description={t("onboardingEmptyDescription")}
          action={
            <GunimiButton onClick={() => setCreateOpen(true)}>
              <PlusCircle size={14} />
              {t("onboardingCreateCompany")}
            </GunimiButton>
          }
        />
        <CreateOrganizationModal open={createOpen} onClose={() => setCreateOpen(false)} />
      </GunimiSection>
    );
  }

  return (
    <GunimiSection>
      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
          <Search size={14} className="shrink-0 text-zinc-600" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchOrganizations")}
            className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/25 outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-xs text-white/25 hover:text-white/60">
              ×
            </button>
          )}
        </div>

        <button
          onClick={() => setPriorityOnly((v) => !v)}
          className={cn(
            "flex h-10 items-center gap-1.5 rounded-xl border px-3 text-xs transition-colors",
            priorityOnly
              ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
              : "border-white/[0.08] bg-white/[0.02] text-zinc-500 hover:text-zinc-300",
          )}
        >
          <Star size={12} className={priorityOnly ? "fill-amber-400 text-amber-400" : ""} />
          {tcrm("priorityOnly")}
        </button>

        <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as typeof sortOrder)}>
          <SelectTrigger className="h-10 w-auto min-w-[150px] px-3 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name_asc">{tc("sortNameAz")}</SelectItem>
            <SelectItem value="name_desc">{tc("sortNameZa")}</SelectItem>
            <SelectItem value="contacts_desc">{tc("sortMostContacts")}</SelectItem>
            <SelectItem value="deals_desc">{tc("sortMostDeals")}</SelectItem>
            <SelectItem value="value_desc">{tc("sortValueDesc")}</SelectItem>
            <SelectItem value="recent">{tc("sortRecentActivity")}</SelectItem>
          </SelectContent>
        </Select>

        <GunimiButton onClick={() => setCreateOpen(true)} className="h-10">
          <PlusCircle size={14} />
          {t("onboardingCreateCompany")}
        </GunimiButton>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080C14]">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-white/25">
            {String(t.raw("noSearchResults"))}
          </div>
        ) : shouldGroup && grouped ? (
          COMPANY_GROUPS.map(({ key, labelKey, dotClass }) => {
            const items = grouped[key];
            if (items.length === 0) return null;
            const isOpen = !collapsedGroups.has(key);
            return (
              <div key={key} className="border-b border-white/[0.04] last:border-b-0">
                <GroupHeader
                  label={t(labelKey)}
                  count={items.length}
                  dotClass={dotClass}
                  open={isOpen}
                  onToggle={() => toggleGroup(key)}
                />
                {isOpen && items.map((company) => (
                  <CompanyRow
                    key={company.id}
                    company={company}
                    health={key}
                    onNavigate={handleNavigate}
                    onTogglePriority={handleTogglePriority}
                  />
                ))}
              </div>
            );
          })
        ) : (
          filtered.map((company) => (
            <CompanyRow
              key={company.id}
              company={company}
              health={healthMap.get(company.id) ?? "risk"}
              onNavigate={handleNavigate}
              onTogglePriority={handleTogglePriority}
            />
          ))
        )}
      </div>

      <CreateOrganizationModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </GunimiSection>
  );
}

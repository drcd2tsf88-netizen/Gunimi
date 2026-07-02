"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  CircleSlash,
  Cpu,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import OrbitCard from "@/components/ui/OrbitCard";
import { AUTOMATION_REGISTRY } from "@/lib/automation/registry";
import type { AutomationHistoryItem } from "@/server/actions/automation/getAutomationHistory";

type Stats = {
  total: number;
  successful: number;
  failed: number;
};

type Props = {
  history: AutomationHistoryItem[];
  stats: Stats;
};

const TRIGGER_LABEL: Record<string, string> = {
  "deal.won": "Deal Won",
  "deal.lost": "Deal Lost",
  "deal.created": "Deal Created",
  "contact.created": "Contact Created",
  "company.created": "Company Created",
  "task.completed": "Task Completed",
};

const TRIGGER_COLOR: Record<string, string> = {
  "deal.won": "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  "deal.lost": "border-red-500/20 bg-red-500/10 text-red-300",
  "deal.created": "border-violet-500/20 bg-violet-500/10 text-violet-300",
  "contact.created": "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
  "company.created": "border-blue-500/20 bg-blue-500/10 text-blue-300",
  "task.completed": "border-amber-500/20 bg-amber-500/10 text-amber-300",
};

function formatDate(ts: string): string {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: "success" | "partial" | "failed" }) {
  const t = useTranslations("automations");
  if (status === "success") {
    return (
      <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
        <CheckCircle2 size={9} />
        {t("statusSuccess")}
      </span>
    );
  }
  if (status === "partial") {
    return (
      <span className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
        <CircleAlert size={9} />
        {t("statusPartial")}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-300">
      <CircleSlash size={9} />
      {t("statusFailed")}
    </span>
  );
}

export default function AutomationCenterView({ history, stats }: Props) {
  const t = useTranslations("automations");

  const successRate =
    stats.total > 0
      ? Math.round((stats.successful / stats.total) * 100)
      : 100;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          {t("badge")}
        </p>
        <h1 className="mt-2 text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-white/40">{t("subtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <OrbitCard className="p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
            {t("activeCount")}
          </p>
          <p className="mt-2 text-3xl font-bold text-white/90">
            {AUTOMATION_REGISTRY.length}
          </p>
        </OrbitCard>
        <OrbitCard className="p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
            {t("totalExecutions")}
          </p>
          <p className="mt-2 text-3xl font-bold text-white/90">{stats.total}</p>
        </OrbitCard>
        <OrbitCard className="p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
            {t("successRate")}
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-300">
            {successRate}
            <span className="text-sm font-normal text-white/30">%</span>
          </p>
        </OrbitCard>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Automation Registry */}
        <OrbitCard className="flex flex-col">
          <div className="border-b border-white/[0.06] px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                <Zap size={12} className="text-violet-300" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  {t("registryBadge")}
                </p>
                <p className="mt-0.5 text-sm font-semibold">{t("registryTitle")}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-white/35">{t("registrySubtitle")}</p>
          </div>

          <div className="flex-1 divide-y divide-white/[0.04]">
            {AUTOMATION_REGISTRY.map((rule) => {
              const triggerColor =
                TRIGGER_COLOR[rule.trigger] ??
                "border-white/[0.06] bg-white/[0.03] text-white/50";
              return (
                <div key={rule.id} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-white/85">{rule.name}</p>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${triggerColor}`}
                    >
                      {TRIGGER_LABEL[rule.trigger] ?? rule.trigger}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-white/40">
                    {rule.description}
                  </p>
                </div>
              );
            })}
          </div>
        </OrbitCard>

        {/* Execution History */}
        <OrbitCard className="flex flex-col">
          <div className="border-b border-white/[0.06] px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                <Activity size={12} className="text-cyan-300" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  {t("historyBadge")}
                </p>
                <p className="mt-0.5 text-sm font-semibold">{t("historyTitle")}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-white/35">{t("historySubtitle")}</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Cpu size={28} className="text-white/10" />
                <p className="mt-4 text-sm font-medium text-white/40">{t("noHistory")}</p>
                <p className="mt-1 text-xs text-white/25">{t("noHistoryDescription")}</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {history.map((item) => {
                  const meta = item.metadata;
                  const trigger = meta?.trigger ?? "";
                  const status = meta?.status ?? "success";
                  const actionCount = meta?.actions?.length ?? 0;
                  const triggerColor =
                    TRIGGER_COLOR[trigger] ??
                    "border-white/[0.06] bg-white/[0.03] text-white/50";

                  return (
                    <div key={item.id} className="px-5 py-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white/85">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="mt-0.5 truncate text-xs text-white/35">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <StatusBadge status={status as "success" | "partial" | "failed"} />
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${triggerColor}`}
                        >
                          {TRIGGER_LABEL[trigger] ?? trigger}
                        </span>

                        {actionCount > 0 && (
                          <span className="text-[10px] text-white/25">
                            {actionCount} action{actionCount !== 1 ? "s" : ""}
                          </span>
                        )}

                        <span className="text-[10px] text-white/20">
                          {formatDate(item.created_at)}
                        </span>

                        {item.deal_id && (
                          <Link
                            href={`/dashboard/deals/${item.deal_id}`}
                            className="flex items-center gap-1 text-[10px] text-violet-400/60 hover:text-violet-300"
                          >
                            <TrendingUp size={9} />
                            {t("viewDeal")}
                            <ChevronRight size={8} />
                          </Link>
                        )}
                        {item.contact_id && !item.deal_id && (
                          <Link
                            href={`/dashboard/contacts/${item.contact_id}`}
                            className="flex items-center gap-1 text-[10px] text-cyan-400/60 hover:text-cyan-300"
                          >
                            <User size={9} />
                            {t("viewContact")}
                            <ChevronRight size={8} />
                          </Link>
                        )}
                        {item.company_id && !item.deal_id && !item.contact_id && (
                          <Link
                            href={`/dashboard/companies/${item.company_id}`}
                            className="flex items-center gap-1 text-[10px] text-blue-400/60 hover:text-blue-300"
                          >
                            <Building2 size={9} />
                            {t("viewCompany")}
                            <ChevronRight size={8} />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </OrbitCard>
      </div>

      {/* Architecture Note */}
      <OrbitCard className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
            <Cpu size={14} className="text-violet-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{t("architectureTitle")}</p>
              <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-300">
                {t("architectureBadge")}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-white/40">
              {t("architectureDesc")}
            </p>
          </div>
          <ArrowRight size={14} className="mt-0.5 shrink-0 text-white/15" />
        </div>
      </OrbitCard>
    </div>
  );
}

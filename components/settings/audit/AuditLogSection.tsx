"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronRight, ScrollText } from "lucide-react";
import type { AuditLogEntry } from "@/server/actions/workspace/getAuditLogs";

// ─── helpers ────────────────────────────────────────────────

function humanizeAction(action: string): string {
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function humanizeEntity(entity: string | null): string {
  if (!entity) return "—";
  return entity
    .replace(/^workspace_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

const ACTION_COLOR: Record<string, string> = {
  created: "text-emerald-400",
  won:     "text-emerald-400",
  updated: "text-blue-400",
  changed: "text-blue-400",
  deleted: "text-rose-400",
  lost:    "text-rose-400",
  removed: "text-rose-400",
  invited: "text-violet-400",
  left:    "text-amber-400",
};

function actionColor(action: string): string {
  for (const [key, cls] of Object.entries(ACTION_COLOR)) {
    if (action.includes(key)) return cls;
  }
  return "text-white/60";
}

const ENTITY_FILTERS = [
  "all",
  "workspace_contact",
  "workspace_company",
  "workspace_deal",
  "workspace_task",
  "workspace_note",
  "workspace_member",
  "workspace",
] as const;

type EntityFilter = (typeof ENTITY_FILTERS)[number];

// ─── component ──────────────────────────────────────────────

type Props = {
  logs: AuditLogEntry[];
};

export default function AuditLogSection({ logs }: Props) {
  const t = useTranslations("settings");
  const [filter, setFilter] = useState<EntityFilter>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered =
    filter === "all"
      ? logs
      : logs.filter((l) => l.entity === filter || (filter === "workspace" && !l.entity));

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-base font-semibold text-white">{t("auditLogTitle")}</h2>
        <p className="mt-1 text-sm text-white/40">{t("auditLogSubtitle")}</p>
      </div>

      {/* FILTER PILLS */}
      <div className="flex flex-wrap gap-1.5">
        {ENTITY_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              "rounded-full border px-3 py-1 text-xs font-medium transition-all",
              filter === f
                ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                : "border-white/[0.08] bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white/70",
            ].join(" ")}
          >
            {t(`auditFilter_${f}`)}
          </button>
        ))}
      </div>

      {/* COUNT */}
      {filtered.length > 0 && (
        <p className="text-xs text-white/30">
          {t("auditLogShowing", { count: filtered.length })}
        </p>
      )}

      {/* LOG LIST */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-14 text-center">
          <ScrollText size={28} className="text-white/20" />
          <p className="text-sm font-medium text-white/40">{t("auditLogEmpty")}</p>
          <p className="max-w-xs text-xs text-white/25">{t("auditLogEmptyDescription")}</p>
        </div>
      ) : (
        <div className="space-y-1 overflow-hidden rounded-2xl border border-white/[0.06]">
          {filtered.map((log, i) => {
            const isExpanded = expanded.has(log.id);
            const hasMetadata = log.metadata && Object.keys(log.metadata).length > 0;

            return (
              <div
                key={log.id}
                className={[
                  "group transition-colors",
                  i !== 0 ? "border-t border-white/[0.04]" : "",
                  isExpanded ? "bg-white/[0.04]" : "hover:bg-white/[0.02]",
                ].join(" ")}
              >
                {/* ROW */}
                <button
                  onClick={() => hasMetadata && toggleExpand(log.id)}
                  className={[
                    "flex w-full items-center gap-4 px-4 py-3 text-left",
                    hasMetadata ? "cursor-pointer" : "cursor-default",
                  ].join(" ")}
                >
                  {/* EXPAND CHEVRON */}
                  <span className="shrink-0 text-white/20">
                    {hasMetadata ? (
                      isExpanded ? (
                        <ChevronDown size={13} />
                      ) : (
                        <ChevronRight size={13} />
                      )
                    ) : (
                      <span className="inline-block w-[13px]" />
                    )}
                  </span>

                  {/* ACTION */}
                  <span className={`min-w-0 flex-1 truncate text-sm font-medium ${actionColor(log.action)}`}>
                    {humanizeAction(log.action)}
                  </span>

                  {/* ENTITY */}
                  <span className="hidden w-32 shrink-0 truncate text-xs text-white/40 sm:block">
                    {humanizeEntity(log.entity)}
                  </span>

                  {/* USER */}
                  <span className="hidden w-28 shrink-0 truncate text-xs text-white/40 md:block">
                    {log.user_name ?? "—"}
                  </span>

                  {/* TIME */}
                  <span className="shrink-0 text-[11px] tabular-nums text-white/25">
                    {relativeTime(log.created_at)}
                  </span>
                </button>

                {/* METADATA DRAWER */}
                {isExpanded && hasMetadata && (
                  <div className="border-t border-white/[0.04] px-5 pb-4 pt-3">
                    <pre className="overflow-x-auto rounded-xl bg-white/[0.03] p-3 text-[11px] leading-relaxed text-white/40">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* COLUMN HEADERS — shown only when there's data */}
      {filtered.length > 0 && (
        <p className="text-[10px] uppercase tracking-[0.14em] text-white/20">
          {t("auditLogAction")} · {t("auditLogEntity")} · {t("auditLogUser")} · {t("auditLogTime")}
        </p>
      )}
    </div>
  );
}

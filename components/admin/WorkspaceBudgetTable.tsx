"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { setWorkspaceAISuspension, setWorkspaceDailyTokenLimit } from "@/server/actions/admin/workspaceAIControls";
import type { WorkspaceUsageStat } from "@/server/actions/admin/getAIUsageStats";
import { Ban, CheckCircle2, Pencil, X, Check } from "lucide-react";

function fmtTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

type RiskLevel = "safe" | "warning" | "critical" | "over" | "suspended";

function getRisk(ws: WorkspaceUsageStat): RiskLevel {
  if (ws.isSuspended) return "suspended";
  const pct = ws.dailyLimit > 0 ? (ws.todayTokens / ws.dailyLimit) * 100 : 0;
  if (pct >= 100) return "over";
  if (pct >= 80) return "critical";
  if (pct >= 50) return "warning";
  return "safe";
}

const RISK_DOT: Record<RiskLevel, string> = {
  safe: "bg-emerald-500",
  warning: "bg-amber-400",
  critical: "bg-red-500",
  over: "bg-red-600",
  suspended: "bg-zinc-600",
};

const RISK_BAR: Record<RiskLevel, string> = {
  safe: "bg-emerald-500/50",
  warning: "bg-amber-400/60",
  critical: "bg-red-500/70",
  over: "bg-red-600/80",
  suspended: "bg-zinc-700/40",
};

const RISK_TEXT: Record<RiskLevel, string> = {
  safe: "text-emerald-400",
  warning: "text-amber-400",
  critical: "text-red-400",
  over: "text-red-400",
  suspended: "text-zinc-500",
};

function LimitEditor({
  workspaceId,
  initial,
  onSaved,
}: {
  workspaceId: string;
  initial: number;
  onSaved: (newLimit: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(initial));
  const [pending, startTransition] = useTransition();

  function save() {
    const parsed = parseInt(value.replace(/[^0-9]/g, ""), 10);
    if (isNaN(parsed) || parsed < 1_000) {
      setValue(String(initial));
      setEditing(false);
      return;
    }
    startTransition(async () => {
      await setWorkspaceDailyTokenLimit(workspaceId, parsed);
      onSaved(parsed);
      setEditing(false);
    });
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="group flex items-center gap-1.5 text-xs tabular-nums text-white/50 transition-colors hover:text-white/80"
      >
        {fmtTokens(initial)}
        <Pencil size={10} className="opacity-0 group-hover:opacity-60" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") { setEditing(false); setValue(String(initial)); }
        }}
        className="w-20 rounded-md border border-white/[0.12] bg-white/[0.05] px-2 py-0.5 text-xs text-white/80 outline-none focus:border-violet-500/50"
        disabled={pending}
      />
      <button
        onClick={save}
        disabled={pending}
        className="rounded p-0.5 text-emerald-400 hover:bg-emerald-500/10"
      >
        <Check size={12} />
      </button>
      <button
        onClick={() => { setEditing(false); setValue(String(initial)); }}
        className="rounded p-0.5 text-white/30 hover:bg-white/[0.05]"
      >
        <X size={12} />
      </button>
    </div>
  );
}

function WorkspaceRow({ ws }: { ws: WorkspaceUsageStat }) {
  const t = useTranslations("adminAI");
  const [isSuspended, setIsSuspended] = useState(ws.isSuspended);
  const [dailyLimit, setDailyLimit] = useState(ws.dailyLimit);
  const [todayTokens] = useState(ws.todayTokens);
  const [suspendPending, startSuspendTransition] = useTransition();

  const pct = dailyLimit > 0 ? Math.min((todayTokens / dailyLimit) * 100, 100) : 0;
  const risk = isSuspended ? "suspended" : getRisk({ ...ws, isSuspended, dailyLimit, todayTokens });

  function toggleSuspension() {
    startSuspendTransition(async () => {
      const next = !isSuspended;
      await setWorkspaceAISuspension(ws.workspaceId, next);
      setIsSuspended(next);
    });
  }

  return (
    <tr className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015]">
      {/* Workspace */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className={`h-2 w-2 shrink-0 rounded-full ${RISK_DOT[risk]}`} />
          <span className="text-sm text-white/80">{ws.workspaceName}</span>
        </div>
      </td>

      {/* Today usage */}
      <td className="px-4 py-3.5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-xs tabular-nums ${RISK_TEXT[risk]}`}>
              {fmtTokens(todayTokens)}
            </span>
            <span className="text-[10px] text-white/25">{Math.round(pct)}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={`h-full rounded-full transition-all ${RISK_BAR[risk]}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </td>

      {/* Daily limit (editable) */}
      <td className="px-4 py-3.5">
        <LimitEditor
          workspaceId={ws.workspaceId}
          initial={dailyLimit}
          onSaved={setDailyLimit}
        />
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        {isSuspended ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-300">
            <Ban size={9} />
            {t("budgetSuspended")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/[0.07] px-2 py-0.5 text-[11px] font-medium text-emerald-400">
            <CheckCircle2 size={9} />
            {t("budgetActive")}
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <button
          onClick={toggleSuspension}
          disabled={suspendPending}
          className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all disabled:opacity-50 ${
            isSuspended
              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
              : "border border-red-500/20 bg-red-500/[0.07] text-red-300 hover:bg-red-500/15"
          }`}
        >
          {suspendPending
            ? "..."
            : isSuspended
              ? t("budgetResume")
              : t("budgetSuspend")}
        </button>
      </td>
    </tr>
  );
}

export default function WorkspaceBudgetTable({ workspaces }: { workspaces: WorkspaceUsageStat[] }) {
  const t = useTranslations("adminAI");

  if (workspaces.length === 0) {
    return (
      <p className="px-5 py-8 text-center text-sm text-white/25">{t("noDataYet")}</p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.05] bg-white/[0.02]">
            {[
              t("budgetColWorkspace"),
              t("budgetColToday"),
              t("budgetColLimit"),
              t("budgetColStatus"),
              t("budgetColActions"),
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-left text-[10px] font-normal uppercase tracking-[0.14em] text-zinc-600"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {workspaces.map((ws) => (
            <WorkspaceRow key={ws.workspaceId} ws={ws} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setWorkspaceAISuspension } from "@/server/actions/admin/workspaceAIControls";
import type {
  FounderMetrics,
  DailyCount,
  WorkspaceActivity,
  SignalTypeCount,
} from "@/server/actions/founder/getFounderMetrics";

// ─── Utilities ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function fmtCost(usd: number): string {
  if (usd === 0) return "$0.00";
  if (usd < 0.001) return "<$0.001";
  return "$" + usd.toFixed(usd < 1 ? 4 : 2);
}

function fmtPct(a: number, b: number): string {
  if (b === 0) return "—";
  return Math.round((a / b) * 100) + "%";
}

function timeAgo(iso: string | null): string {
  if (!iso) return "never";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function fmtSignalType(type: string): string {
  return type.replace(/_/g, " ");
}

// ─── Live Clock ───────────────────────────────────────────────────────────────

function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums text-white/35 text-xs">{time}</span>;
}

// ─── Metric Tile ──────────────────────────────────────────────────────────────

function MetricTile({
  label,
  value,
  sub,
  accent,
  alert,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  alert?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 border-r border-white/[0.05] px-5 py-4 last:border-r-0">
      <p
        className={`text-[22px] font-semibold tabular-nums tracking-tight leading-none ${
          alert ? "text-red-400" : accent ? "text-violet-300" : "text-white/90"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/30">{label}</p>
      {sub && <p className="text-[9px] text-white/18">{sub}</p>}
    </div>
  );
}

// ─── Conversion Funnel ────────────────────────────────────────────────────────

function ConversionFunnel({
  funnel,
}: {
  funnel: FounderMetrics["funnel"];
}) {
  const steps = [
    { label: "Signed up", value: funnel.signups, pct: null },
    { label: "Created workspace", value: funnel.workspaceActivated, pct: fmtPct(funnel.workspaceActivated, funnel.signups) },
    { label: "Used AI", value: funnel.aiActivated, pct: fmtPct(funnel.aiActivated, funnel.signups) },
    { label: "Returned D7", value: funnel.retainedD7, pct: fmtPct(funnel.retainedD7, funnel.signups) },
  ];

  function convColor(pct: string | null): string {
    if (!pct || pct === "—") return "text-white/20";
    const n = parseInt(pct);
    if (n >= 60) return "text-emerald-400/80";
    if (n >= 30) return "text-amber-400/80";
    return "text-red-400/70";
  }

  return (
    <div className="flex items-stretch divide-x divide-white/[0.05]">
      {steps.map((step, i) => (
        <div key={step.label} className="flex flex-1 flex-col gap-1.5 px-5 py-4">
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] text-white/20 tabular-nums">{i + 1}</span>
            <span className="text-[22px] font-semibold tabular-nums text-white/85 tracking-tight leading-none">
              {step.value}
            </span>
            {step.pct && (
              <span className={`text-[11px] tabular-nums font-medium ${convColor(step.pct)}`}>
                {step.pct}
              </span>
            )}
          </div>
          <p className="text-[9px] uppercase tracking-[0.12em] text-white/30">{step.label}</p>
          {/* Mini funnel bar */}
          <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                i === 0
                  ? "bg-white/30"
                  : step.pct && parseInt(step.pct) >= 60
                  ? "bg-emerald-500/60"
                  : step.pct && parseInt(step.pct) >= 30
                  ? "bg-amber-500/60"
                  : "bg-red-500/50"
              }`}
              style={{
                width:
                  i === 0
                    ? "100%"
                    : step.pct && step.pct !== "—"
                    ? `${Math.min(parseInt(step.pct), 100)}%`
                    : "0%",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Spark Bars ───────────────────────────────────────────────────────────────

function SparkBars({ data, color = "bg-violet-500/60" }: { data: DailyCount[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const total = data.reduce((s, d) => s + d.count, 0);
  const recent = new Set(data.slice(-7).map((d) => d.date));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-14 items-end gap-[2px]">
        {data.map((d) => {
          const pct = Math.round((d.count / max) * 100);
          return (
            <div
              key={d.date}
              title={`${d.date}: ${d.count}`}
              className={`flex-1 rounded-sm transition-all ${color} ${recent.has(d.date) ? "opacity-100" : "opacity-30"} ${d.count === 0 ? "opacity-[0.07]" : ""}`}
              style={{ height: `${Math.max(pct, d.count > 0 ? 10 : 2)}%` }}
            />
          );
        })}
      </div>
      <p className="text-right text-[9px] text-white/20">
        {total} total · 30d
      </p>
    </div>
  );
}

// ─── Signal Breakdown ─────────────────────────────────────────────────────────

function SignalBreakdown({ data }: { data: SignalTypeCount[] }) {
  if (data.length === 0) {
    return <p className="py-3 text-[11px] text-white/20">No active signals.</p>;
  }
  const max = data[0].count;

  return (
    <div className="space-y-2">
      {data.map((s) => (
        <div key={s.type}>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] text-white/50 font-sans">{fmtSignalType(s.type)}</span>
            <span className="text-[10px] tabular-nums text-white/35">{s.count}</span>
          </div>
          <div className="h-[2px] overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-violet-500/50"
              style={{ width: `${Math.round((s.count / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Workspace Row ────────────────────────────────────────────────────────────

function WorkspaceRow({ ws }: { ws: WorkspaceActivity }) {
  const [aiSuspended, setAISuspended] = useState(ws.aiSuspended);
  const [pending, startTransition] = useTransition();
  const budgetPct = ws.dailyLimit > 0 ? Math.round((ws.todayTokens / ws.dailyLimit) * 100) : 0;

  function toggleAI() {
    const next = !aiSuspended;
    setAISuspended(next);
    startTransition(async () => {
      const res = await setWorkspaceAISuspension(ws.id, next);
      if (!res.success) setAISuspended(!next);
    });
  }

  const statusDot = ws.isSuspended
    ? "bg-red-500"
    : aiSuspended
    ? "bg-amber-500"
    : ws.lastAIActivity
    ? "bg-emerald-500/70"
    : "bg-white/[0.12]";

  return (
    <div
      className={`group flex items-center gap-3 rounded px-3 py-2.5 transition-colors ${
        ws.isSuspended
          ? "bg-red-500/[0.06]"
          : aiSuspended
          ? "bg-amber-500/[0.04]"
          : "bg-white/[0.018] hover:bg-white/[0.03]"
      }`}
    >
      <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDot}`} />

      {/* Name */}
      <p className="min-w-0 flex-1 truncate text-[11px] text-white/75 font-sans">{ws.name}</p>

      {/* Budget bar */}
      {ws.todayTokens > 0 && (
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <div className="h-1 w-16 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={`h-full rounded-full ${
                budgetPct >= 90 ? "bg-red-500/70" : budgetPct >= 60 ? "bg-amber-500/60" : "bg-emerald-500/40"
              }`}
              style={{ width: `${Math.min(budgetPct, 100)}%` }}
            />
          </div>
          <span className="text-[9px] tabular-nums text-white/20">{budgetPct}%</span>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-5 shrink-0 text-[10px] tabular-nums text-white/25">
        <span>{ws.memberCount}m</span>
        <span>{ws.signalCount}s</span>
        <span className={ws.lastAIActivity ? "text-white/40" : "text-white/15"}>
          {ws.lastAIActivity ? timeAgo(ws.lastAIActivity) : "no AI"}
        </span>
        <span className="text-white/15">
          {new Date(ws.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>

      {/* Suspension badges */}
      {ws.isSuspended && (
        <span className="text-[8px] uppercase tracking-wider text-red-400 px-1.5 py-0.5 rounded border border-red-500/30">
          susp
        </span>
      )}

      {/* AI toggle */}
      {!ws.isSuspended && (
        <button
          onClick={toggleAI}
          disabled={pending}
          title={aiSuspended ? "Enable AI for this workspace" : "Suspend AI for this workspace"}
          className={`shrink-0 rounded px-2 py-1 text-[9px] uppercase tracking-wider transition-all border ${
            pending
              ? "opacity-40 cursor-wait border-white/10 text-white/20"
              : aiSuspended
              ? "border-amber-500/40 text-amber-400/80 hover:border-amber-500/60"
              : "border-white/[0.07] text-white/20 hover:border-white/20 hover:text-white/50 opacity-0 group-hover:opacity-100"
          }`}
        >
          {aiSuspended ? "AI off" : "AI on"}
        </button>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function FounderDashboard({ metrics }: { metrics: FounderMetrics }) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { platform, funnel, growth, signalBreakdown, recentSignups, workspaceActivity, aiBudgetAlerts } = metrics;

  const refresh = useCallback(() => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 1200);
  }, [router]);

  useEffect(() => {
    const id = setInterval(() => router.refresh(), 60_000);
    return () => clearInterval(id);
  }, [router]);

  const hasCritical = platform.criticalSignals > 0;

  return (
    <div className="flex min-h-dvh flex-col text-[13px]">

      {/* ── HEADER ── */}
      <header className="flex items-center justify-between border-b border-white/[0.05] px-6 py-3 bg-black/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/today"
            className="text-[9px] uppercase tracking-[0.2em] text-white/20 hover:text-white/50 transition-colors"
          >
            ← Workspace
          </Link>
          <div className="h-3 w-px bg-white/[0.06]" />
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 font-semibold">
            Gunimi Operations
          </p>
        </div>
        <div className="flex items-center gap-6">
          <LiveClock />
          <Link
            href="/dashboard/admin"
            className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors"
          >
            Admin →
          </Link>
          <div className="flex items-center gap-1.5">
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                hasCritical ? "bg-red-500 animate-pulse" : "bg-emerald-500"
              }`}
            />
            <span
              className={`text-[9px] uppercase tracking-widest ${
                hasCritical ? "text-red-400" : "text-emerald-500/60"
              }`}
            >
              {hasCritical ? `${platform.criticalSignals} critical` : "Operational"}
            </span>
          </div>
          <button
            onClick={refresh}
            disabled={refreshing}
            className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors disabled:opacity-30 tabular-nums"
          >
            {refreshing ? "···" : "↻ Refresh"}
          </button>
        </div>
      </header>

      {/* ── PLATFORM METRICS ── */}
      <div className="border-b border-white/[0.05] bg-[#030508]">
        <div className="flex divide-x divide-white/[0.05] overflow-x-auto">
          <MetricTile label="Workspaces" value={platform.workspaceCount} />
          <MetricTile label="Users" value={platform.userCount} />
          <MetricTile label="Active today" value={platform.activeUsersToday} accent />
          <MetricTile label="AI requests" value={fmt(platform.aiRequestsToday)} sub="today" />
          <MetricTile label="AI tokens" value={fmt(platform.aiTokensToday)} sub="today" />
          <MetricTile
            label="Cost today"
            value={fmtCost(platform.aiCostToday)}
            sub={`all time ${fmtCost(platform.aiCostAllTime)}`}
          />
          <MetricTile
            label="Active signals"
            value={platform.activeSignals}
            alert={hasCritical}
            sub={hasCritical ? `${platform.criticalSignals} critical` : `last ${timeAgo(platform.lastSignalAt)}`}
          />
          <MetricTile label="Invites pending" value={platform.pendingInvites} />
        </div>
      </div>

      {/* ── CONVERSION FUNNEL ── */}
      <div className="border-b border-white/[0.05] bg-[#020406]">
        <div className="px-5 pt-3 pb-1">
          <p className="text-[9px] uppercase tracking-[0.15em] text-white/20 mb-1">
            Conversion Funnel — all time
          </p>
        </div>
        <ConversionFunnel funnel={funnel} />
      </div>

      {/* ── MAIN GRID ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/[0.03]">

        {/* LEFT 2/3 */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-px bg-white/[0.03]">

          {/* Growth charts */}
          <div className="grid grid-cols-2 gap-px bg-white/[0.03]">
            <div className="bg-[#020305] px-5 pt-4 pb-5">
              <p className="mb-3 text-[9px] uppercase tracking-[0.15em] text-white/20">
                Workspace Growth · 30d
              </p>
              <SparkBars data={growth.workspacesByDay} color="bg-violet-500/55" />
            </div>
            <div className="bg-[#020305] px-5 pt-4 pb-5">
              <p className="mb-3 text-[9px] uppercase tracking-[0.15em] text-white/20">
                User Growth · 30d
              </p>
              <SparkBars data={growth.usersByDay} color="bg-blue-500/45" />
            </div>
          </div>

          {/* Workspace activity */}
          <div className="bg-[#020305] flex-1 px-5 pt-4 pb-5">
            <p className="mb-3 text-[9px] uppercase tracking-[0.15em] text-white/20">
              Workspace Activity
              <span className="ml-2 text-white/15 normal-case tracking-normal">
                hover to see AI toggle
              </span>
            </p>
            <div className="space-y-[2px]">
              {workspaceActivity.length === 0 && (
                <p className="py-4 text-[11px] text-white/20">No workspaces yet.</p>
              )}
              {workspaceActivity.map((ws) => (
                <WorkspaceRow key={ws.id} ws={ws} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT 1/3 */}
        <div className="col-span-1 flex flex-col gap-px bg-white/[0.03]">

          {/* Recent signups */}
          <div className="bg-[#020305] flex-1 px-5 pt-4 pb-5">
            <p className="mb-3 text-[9px] uppercase tracking-[0.15em] text-white/20">
              Recent Signups
            </p>
            <div className="space-y-[2px]">
              {recentSignups.length === 0 && (
                <p className="py-4 text-[11px] text-white/20">No signups yet.</p>
              )}
              {recentSignups.map((u) => (
                <div
                  key={u.id}
                  className="flex items-start justify-between gap-3 rounded px-3 py-2 bg-white/[0.018]"
                >
                  <div className="min-w-0 flex items-start gap-2">
                    <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${u.aiUsed ? "bg-violet-500/60" : u.workspaceCount > 0 ? "bg-emerald-500/40" : "bg-white/10"}`} />
                    <div className="min-w-0">
                      <p className="text-[11px] text-white/70 truncate font-sans leading-tight">{u.email}</p>
                      {u.fullName && (
                        <p className="text-[9px] text-white/25 truncate font-sans">{u.fullName}</p>
                      )}
                      <div className="mt-0.5 flex gap-2">
                        {u.workspaceCount === 0 && (
                          <span className="text-[8px] text-amber-500/50 uppercase">no workspace</span>
                        )}
                        {u.aiUsed && (
                          <span className="text-[8px] text-violet-400/50 uppercase">AI used</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[9px] text-white/25 tabular-nums whitespace-nowrap">{timeAgo(u.createdAt)}</p>
                    {u.role && u.role !== "user" && (
                      <p className="text-[8px] uppercase tracking-wider text-violet-400/60">{u.role}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signal breakdown */}
          <div className="bg-[#020305] px-5 pt-4 pb-5">
            <div className="mb-3 flex items-baseline justify-between">
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/20">
                Active Signals by Type
              </p>
              <span className="text-[9px] tabular-nums text-white/20">{platform.activeSignals} total</span>
            </div>
            <SignalBreakdown data={signalBreakdown} />
          </div>

          {/* AI Budget Alerts */}
          <div className="bg-[#020305] px-5 pt-4 pb-5">
            <p className="mb-3 text-[9px] uppercase tracking-[0.15em] text-white/20">
              AI Budget
            </p>
            {aiBudgetAlerts.length === 0 ? (
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
                <p className="text-[10px] text-white/20">All workspaces within budget</p>
              </div>
            ) : (
              <div className="space-y-3">
                {aiBudgetAlerts.map((alert) => (
                  <div key={alert.workspaceId}>
                    <div className="mb-1 flex justify-between">
                      <span className="text-[10px] text-white/50 font-sans truncate max-w-[150px]">
                        {alert.workspaceName}
                      </span>
                      <span
                        className={`text-[10px] tabular-nums font-semibold ${
                          alert.pct >= 90 ? "text-red-400" : "text-amber-400"
                        }`}
                      >
                        {alert.pct}%
                      </span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-white/[0.05]">
                      <div
                        className={`h-full rounded-full ${
                          alert.pct >= 90 ? "bg-red-500/70" : "bg-amber-500/60"
                        }`}
                        style={{ width: `${Math.min(alert.pct, 100)}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-[9px] text-white/18">
                      {fmt(alert.todayTokens)} / {fmt(alert.dailyLimit)} tokens
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.04] px-6 py-2.5 flex items-center justify-between bg-black/20">
        <p className="text-[8px] uppercase tracking-[0.2em] text-white/12">
          Gunimi · Founder Operations
        </p>
        <p className="text-[8px] text-white/12 tabular-nums">
          {new Date(metrics.generatedAt).toLocaleTimeString("en-US", { hour12: false })} ·{" "}
          auto-refresh 60s
        </p>
      </footer>
    </div>
  );
}

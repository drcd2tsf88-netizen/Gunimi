"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { FounderMetrics, DailyCount } from "@/server/actions/founder/getFounderMetrics";

// ─── Utilities ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function fmtCost(usd: number): string {
  if (usd < 0.01) return "$0.00";
  return "$" + usd.toFixed(usd < 1 ? 4 : 2);
}

function timeAgo(iso: string | null): string {
  if (!iso) return "never";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Live Clock ───────────────────────────────────────────────────────────────

function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function tick() {
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="tabular-nums text-white/40 text-xs">{time}</span>;
}

// ─── Stat Tile ────────────────────────────────────────────────────────────────

function StatTile({
  label,
  value,
  sub,
  accent = false,
  alert = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  alert?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 border-r border-white/[0.05] px-5 py-4 last:border-r-0">
      <p className={`text-2xl font-semibold tabular-nums tracking-tight ${alert ? "text-red-400" : accent ? "text-violet-300" : "text-white/90"}`}>
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-widest text-white/30">{label}</p>
      {sub && <p className="text-[10px] text-white/20">{sub}</p>}
    </div>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function SparkBars({ data, color = "bg-violet-500/60" }: { data: DailyCount[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const last7 = data.slice(-7);
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-16 items-end gap-[3px]">
        {data.map((d) => {
          const pct = Math.round((d.count / max) * 100);
          const isRecent = last7.some((r) => r.date === d.date);
          return (
            <div
              key={d.date}
              title={`${d.date}: ${d.count}`}
              className={`flex-1 rounded-sm transition-all ${color} ${isRecent ? "opacity-100" : "opacity-40"} ${d.count === 0 ? "opacity-10" : ""}`}
              style={{ height: `${Math.max(pct, d.count > 0 ? 8 : 2)}%` }}
            />
          );
        })}
      </div>
      <p className="text-right text-[10px] text-white/25">
        {total} total · last 30 days
      </p>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[9px] uppercase tracking-[0.15em] text-white/25">
      {children}
    </p>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function FounderDashboard({ metrics }: { metrics: FounderMetrics }) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { platform, growth, recentSignups, workspaceActivity, aiBudgetAlerts } = metrics;

  const refresh = useCallback(async () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 1200);
  }, [router]);

  // Auto-refresh every 60s
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 60_000);
    return () => clearInterval(id);
  }, [router]);

  const hasCritical = platform.criticalSignals > 0;

  return (
    <div className="flex flex-col min-h-dvh">

      {/* ── TOP BAR ── */}
      <header className="flex items-center justify-between border-b border-white/[0.06] px-6 py-3">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/today" className="text-[10px] uppercase tracking-[0.2em] text-white/20 hover:text-white/40 transition-colors">
            ← Back
          </Link>
          <div className="h-3 w-px bg-white/[0.08]" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">
            Gunimi Operations
          </p>
        </div>

        <div className="flex items-center gap-5">
          <LiveClock />
          <div className="flex items-center gap-1.5">
            <div className={`h-1.5 w-1.5 rounded-full ${hasCritical ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} />
            <span className={`text-[10px] uppercase tracking-widest ${hasCritical ? "text-red-400" : "text-emerald-500/70"}`}>
              {hasCritical ? `${platform.criticalSignals} critical` : "Operational"}
            </span>
          </div>
          <button
            onClick={refresh}
            disabled={refreshing}
            className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors disabled:opacity-30"
          >
            {refreshing ? "···" : "↻ Refresh"}
          </button>
        </div>
      </header>

      {/* ── PLATFORM METRICS STRIP ── */}
      <div className="border-b border-white/[0.05] bg-white/[0.015]">
        <div className="flex divide-x divide-white/[0.05] overflow-x-auto">
          <StatTile label="Workspaces" value={platform.workspaceCount} />
          <StatTile label="Users" value={platform.userCount} />
          <StatTile label="Active Today" value={platform.activeUsersToday} accent />
          <StatTile label="AI Requests" value={fmt(platform.aiRequestsToday)} sub="today" />
          <StatTile label="AI Tokens" value={fmt(platform.aiTokensToday)} sub="today" />
          <StatTile
            label="AI Cost Today"
            value={fmtCost(platform.aiCostToday)}
            sub={`all time ${fmtCost(platform.aiCostAllTime)}`}
          />
          <StatTile
            label="Active Signals"
            value={platform.activeSignals}
            alert={platform.criticalSignals > 0}
            sub={platform.criticalSignals > 0 ? `${platform.criticalSignals} critical` : "last: " + timeAgo(platform.lastSignalAt)}
          />
          <StatTile label="Pending Invites" value={platform.pendingInvites} />
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/[0.04]">

        {/* LEFT COL — Growth */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-px bg-white/[0.04]">

          {/* Growth charts */}
          <div className="grid grid-cols-2 gap-px bg-white/[0.04]">
            <div className="bg-[#020305] p-5">
              <SectionLabel>Workspace Growth · 30d</SectionLabel>
              <SparkBars data={growth.workspacesByDay} color="bg-violet-500/60" />
            </div>
            <div className="bg-[#020305] p-5">
              <SectionLabel>User Growth · 30d</SectionLabel>
              <SparkBars data={growth.usersByDay} color="bg-blue-500/50" />
            </div>
          </div>

          {/* Workspace activity table */}
          <div className="bg-[#020305] flex-1 p-5">
            <SectionLabel>Workspace Activity</SectionLabel>
            <div className="space-y-[1px]">
              {workspaceActivity.length === 0 && (
                <p className="text-xs text-white/20 py-4">No workspaces yet.</p>
              )}
              {workspaceActivity.map((ws) => (
                <div
                  key={ws.id}
                  className={`flex items-center justify-between rounded px-3 py-2.5 ${
                    ws.isSuspended ? "bg-red-500/5" : ws.aiSuspended ? "bg-amber-500/5" : "bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      ws.isSuspended ? "bg-red-500" : ws.aiSuspended ? "bg-amber-500" : ws.lastAIActivity ? "bg-emerald-500/60" : "bg-white/10"
                    }`} />
                    <p className="text-xs text-white/80 truncate font-sans">{ws.name}</p>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 text-[10px] text-white/30 tabular-nums">
                    <span>{ws.memberCount} {ws.memberCount === 1 ? "member" : "members"}</span>
                    <span>{ws.signalCount} signals</span>
                    <span className={ws.lastAIActivity ? "text-white/40" : "text-white/15"}>
                      {ws.lastAIActivity ? "AI " + timeAgo(ws.lastAIActivity) : "no AI"}
                    </span>
                    <span className="text-white/20">
                      {new Date(ws.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    {ws.isSuspended && <span className="text-red-400 uppercase text-[9px]">suspended</span>}
                    {!ws.isSuspended && ws.aiSuspended && <span className="text-amber-400 uppercase text-[9px]">AI off</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COL */}
        <div className="col-span-1 flex flex-col gap-px bg-white/[0.04]">

          {/* Recent signups */}
          <div className="bg-[#020305] p-5 flex-1">
            <SectionLabel>Recent Signups</SectionLabel>
            <div className="space-y-[1px]">
              {recentSignups.length === 0 && (
                <p className="text-xs text-white/20 py-4">No signups yet.</p>
              )}
              {recentSignups.map((u) => (
                <div key={u.id} className="flex items-start justify-between gap-3 rounded px-3 py-2.5 bg-white/[0.02]">
                  <div className="min-w-0">
                    <p className="text-[11px] text-white/70 truncate font-sans">{u.email}</p>
                    {u.fullName && (
                      <p className="text-[10px] text-white/30 truncate font-sans">{u.fullName}</p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] text-white/30 tabular-nums">{timeAgo(u.createdAt)}</p>
                    {u.role && u.role !== "user" && (
                      <p className="text-[9px] uppercase tracking-wider text-violet-400/70">{u.role}</p>
                    )}
                    {u.workspaceCount === 0 && (
                      <p className="text-[9px] text-amber-500/50">no workspace</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Budget Alerts */}
          <div className="bg-[#020305] p-5">
            <SectionLabel>AI Budget Alerts</SectionLabel>
            {aiBudgetAlerts.length === 0 ? (
              <div className="flex items-center gap-2 py-3">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
                <p className="text-[10px] text-white/25">All workspaces within budget</p>
              </div>
            ) : (
              <div className="space-y-2">
                {aiBudgetAlerts.map((alert) => (
                  <div key={alert.workspaceId} className="space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/50 font-sans truncate max-w-[160px]">{alert.workspaceName}</span>
                      <span className={`tabular-nums ${alert.pct >= 90 ? "text-red-400" : "text-amber-400"}`}>
                        {alert.pct}%
                      </span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className={`h-full rounded-full transition-all ${alert.pct >= 90 ? "bg-red-500/70" : "bg-amber-500/60"}`}
                        style={{ width: `${Math.min(alert.pct, 100)}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-white/20">
                      {fmt(alert.todayTokens)} / {fmt(alert.dailyLimit)} tokens today
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Signal Engine status */}
          <div className="bg-[#020305] p-5">
            <SectionLabel>Signal Engine</SectionLabel>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded bg-white/[0.03] px-3 py-2.5 text-center">
                  <p className="text-xl font-semibold tabular-nums text-white/80">{platform.activeSignals}</p>
                  <p className="text-[9px] text-white/25 uppercase tracking-wider mt-0.5">active</p>
                </div>
                <div className={`rounded px-3 py-2.5 text-center ${platform.criticalSignals > 0 ? "bg-red-500/10" : "bg-white/[0.03]"}`}>
                  <p className={`text-xl font-semibold tabular-nums ${platform.criticalSignals > 0 ? "text-red-400" : "text-white/80"}`}>
                    {platform.criticalSignals}
                  </p>
                  <p className="text-[9px] text-white/25 uppercase tracking-wider mt-0.5">critical</p>
                </div>
                <div className="rounded bg-white/[0.03] px-3 py-2.5 text-center">
                  <p className="text-[11px] font-medium text-white/60 leading-tight pt-1">
                    {timeAgo(platform.lastSignalAt)}
                  </p>
                  <p className="text-[9px] text-white/25 uppercase tracking-wider mt-0.5">last</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.04] px-6 py-2.5 flex items-center justify-between">
        <p className="text-[9px] uppercase tracking-widest text-white/15">
          Gunimi Founder Operations
        </p>
        <p className="text-[9px] text-white/15 tabular-nums">
          Generated {formatDate(metrics.generatedAt)}
        </p>
      </footer>

    </div>
  );
}

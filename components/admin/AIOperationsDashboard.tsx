import { getTranslations } from "next-intl/server";
import {
  Activity,
  BarChart3,
  Bot,
  Brain,
  Building2,
  CalendarDays,
  Cpu,
  DollarSign,
  FileText,
  Hash,
  MessageSquare,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type {
  AIUsageStats,
  FeatureUsageStat,
  TierLimit,
  WorkspaceUsageStat,
  UserUsageStat,
} from "@/server/actions/admin/getAIUsageStats";

type Props = { stats: AIUsageStats };

function fmt(n: number, decimals = 2): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtCost(usd: number): string {
  if (usd === 0) return "$0.00";
  if (usd < 0.001) return `$${usd.toFixed(6)}`;
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  return `$${fmt(usd)}`;
}

function fmtTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
      <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${iconBg}`}>
        <Icon size={14} className={iconColor} />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">{label}</p>
        <p className="mt-1 text-xl font-semibold tabular-nums text-white/90">{value}</p>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
          <Icon size={12} className="text-violet-300" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white/85">{title}</p>
          {subtitle && <p className="text-xs text-white/35">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

const FEATURE_LABELS: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  chat:      { label: "Chat",           icon: MessageSquare, color: "text-blue-300" },
  brief:     { label: "Daily Brief",    icon: Brain,         color: "text-violet-300" },
  assistant: { label: "Orbit Assistant",icon: Bot,           color: "text-emerald-300" },
  summary:   { label: "Note Summary",   icon: FileText,      color: "text-amber-300" },
};

function FeatureBar({ stat, maxRequests }: { stat: FeatureUsageStat; maxRequests: number }) {
  const meta = FEATURE_LABELS[stat.feature] ?? {
    label: stat.feature,
    icon: Activity,
    color: "text-white/50",
  };
  const Icon = meta.icon;
  const pct = maxRequests > 0 ? Math.max(2, Math.round((stat.requests / maxRequests) * 100)) : 0;

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4">
      <div className="flex items-center gap-2">
        <Icon size={12} className={meta.color} />
        <span className="text-sm text-white/70">{meta.label}</span>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
          <div
            className="h-full rounded-full bg-violet-500/40"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className="text-right text-xs tabular-nums text-white/40">
        {stat.requests.toLocaleString()}
      </span>
      <span className="text-right text-xs tabular-nums text-white/40">
        {fmtTokens(stat.totalTokens)}
      </span>
      <span className="min-w-[60px] text-right text-xs tabular-nums text-white/55">
        {fmtCost(stat.costUsd)}
      </span>
    </div>
  );
}

const TIER_ICONS: Record<string, React.ElementType> = {
  free:     Zap,
  standard: TrendingUp,
  pro:      Sparkles,
  business: Building2,
};

function TierCard({
  tier,
  reqLabel,
  tokensLabel,
  foundationLabel,
  comingSoonLabel,
}: {
  tier: TierLimit;
  reqLabel: string;
  tokensLabel: string;
  foundationLabel: string;
  comingSoonLabel: string;
}) {
  const Icon = TIER_ICONS[tier.name] ?? Shield;
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03]">
          <Icon size={11} className="text-white/40" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
          {tier.name}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/30">{reqLabel}</span>
          <span className="text-xs tabular-nums text-white/60">
            {tier.requestsPerDay.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/30">{tokensLabel}</span>
          <span className="text-xs tabular-nums text-white/60">
            {fmtTokens(tier.tokensPerMonth)}
          </span>
        </div>
      </div>
      <div className="mt-auto">
        <div className="h-1 overflow-hidden rounded-full bg-white/[0.04]">
          <div className="h-full w-0 rounded-full bg-violet-500/30" />
        </div>
        <p className="mt-1.5 text-[10px] text-white/20">
          {tier.name === "free" ? foundationLabel : comingSoonLabel}
        </p>
      </div>
    </div>
  );
}

export default async function AIOperationsDashboard({ stats }: Props) {
  const t = await getTranslations("adminAI");

  const { overview, workspaces, users, features, projection, tierLimits } = stats;

  const maxFeatureRequests = features.length > 0 ? features[0].requests : 1;
  const totalTokens = overview.totalInputTokens + overview.totalOutputTokens;

  return (
    <div className="space-y-10">
      {/* PAGE HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-red-300">
              {t("badge")}
            </span>
            <span className="text-[10px] text-white/20">
              {t("generatedAt")} {fmtDate(stats.generatedAt)}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white/90">{t("pageTitle")}</h1>
          <p className="mt-1 text-sm text-white/35">{t("pageSubtitle")}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/15 bg-red-500/[0.07]">
          <Shield size={16} className="text-red-300/70" />
        </div>
      </div>

      {/* PHASE 2: USAGE OVERVIEW */}
      <Section icon={Activity} title={t("overviewTitle")} subtitle={t("overviewSubtitle")}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          <StatCard
            label={t("statsRequests")}
            value={overview.totalRequests.toLocaleString()}
            icon={Hash}
            iconColor="text-violet-300"
            iconBg="border-violet-500/20 bg-violet-500/10"
          />
          <StatCard
            label={t("statsInputTokens")}
            value={fmtTokens(overview.totalInputTokens)}
            icon={Cpu}
            iconColor="text-blue-300"
            iconBg="border-blue-500/20 bg-blue-500/10"
          />
          <StatCard
            label={t("statsOutputTokens")}
            value={fmtTokens(overview.totalOutputTokens)}
            icon={MessageSquare}
            iconColor="text-emerald-300"
            iconBg="border-emerald-500/20 bg-emerald-500/10"
          />
          <StatCard
            label={t("statsTotalCost")}
            value={fmtCost(overview.totalCostUsd)}
            icon={DollarSign}
            iconColor="text-amber-300"
            iconBg="border-amber-500/20 bg-amber-500/10"
          />
          <StatCard
            label={t("statsAvgCost")}
            value={fmtCost(overview.avgCostPerRequest)}
            icon={TrendingUp}
            iconColor="text-pink-300"
            iconBg="border-pink-500/20 bg-pink-500/10"
          />
          <StatCard
            label={t("statsAvgTokens")}
            value={fmt(overview.avgTokensPerRequest, 0)}
            icon={BarChart3}
            iconColor="text-cyan-300"
            iconBg="border-cyan-500/20 bg-cyan-500/10"
          />
        </div>

        {/* Model / pricing context */}
        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/25">{t("provider")}</span>
            <span className="text-xs font-medium text-white/60">OpenAI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/25">{t("model")}</span>
            <span className="text-xs font-medium text-white/60">gpt-4.1-mini</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/25">{t("inputPricingLabel")}</span>
            <span className="text-xs tabular-nums text-white/60">$0.40 / 1M</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/25">{t("outputPricingLabel")}</span>
            <span className="text-xs tabular-nums text-white/60">$1.60 / 1M</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/25">{t("totalTokensLabel")}</span>
            <span className="text-xs tabular-nums text-white/60">{fmtTokens(totalTokens)}</span>
          </div>
        </div>
      </Section>

      {/* PHASE 5: COST PROJECTION */}
      <Section icon={DollarSign} title={t("projectionTitle")} subtitle={t("projectionSubtitle")}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex flex-col gap-1.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">{t("projectionToday")}</p>
            <p className="text-xl font-semibold tabular-nums text-white/90">
              {fmtCost(projection.todayCostUsd)}
            </p>
            <p className="text-[11px] text-white/25">{t("projectionTodayHint")}</p>
          </div>
          <div className="flex flex-col gap-1.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">{t("projectionSevenDay")}</p>
            <p className="text-xl font-semibold tabular-nums text-white/90">
              {fmtCost(projection.sevenDayActualUsd)}
            </p>
            <p className="text-[11px] text-white/25">{t("projectionSevenDayHint")}</p>
          </div>
          <div className="flex flex-col gap-1.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">{t("projectionThirtyDay")}</p>
            <p className="text-xl font-semibold tabular-nums text-white/90">
              {fmtCost(projection.thirtyDayProjectionUsd)}
            </p>
            <p className="text-[11px] text-white/25">{t("projectionThirtyDayHint")}</p>
          </div>
          <div className="flex flex-col gap-1.5 rounded-2xl border border-amber-500/10 bg-amber-500/[0.04] p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-amber-600/70">
              {t("projectionMonthly")}
            </p>
            <p className="text-xl font-semibold tabular-nums text-amber-300/90">
              {fmtCost(projection.monthToDateUsd)}
            </p>
            <p className="text-[11px] text-white/25">{t("projectionMonthlyHint")}</p>
          </div>
        </div>
      </Section>

      {/* PHASE 6: FEATURE USAGE */}
      <Section icon={BarChart3} title={t("featuresTitle")} subtitle={t("featuresSubtitle")}>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          {features.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-white/25">{t("noDataYet")}</p>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-2.5">
                <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                  {t("featureColFeature")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                  {t("featureColRequests")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                  {t("featureColTokens")}
                </span>
                <span className="min-w-[60px] text-right text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                  {t("featureColCost")}
                </span>
              </div>
              {features.map((feat) => (
                <div key={feat.feature} className="px-5 py-3">
                  <FeatureBar stat={feat} maxRequests={maxFeatureRequests} />
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* PHASE 3: WORKSPACE ANALYTICS */}
      <Section icon={Building2} title={t("workspacesTitle")} subtitle={t("workspacesSubtitle")}>
        <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                {[
                  t("wsWorkspace"),
                  t("wsRequests"),
                  t("wsTokens"),
                  t("wsCost"),
                  t("wsLastActivity"),
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
              {workspaces.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-white/25">
                    {t("noDataYet")}
                  </td>
                </tr>
              ) : (
                workspaces.map((ws: WorkspaceUsageStat) => (
                  <tr
                    key={ws.workspaceId}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015]"
                  >
                    <td className="px-4 py-3 text-sm text-white/75">{ws.workspaceName}</td>
                    <td className="px-4 py-3 text-sm tabular-nums text-white/55">
                      {ws.requests.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm tabular-nums text-white/55">
                      {fmtTokens(ws.totalTokens)}
                    </td>
                    <td className="px-4 py-3 text-sm tabular-nums text-white/70">
                      {fmtCost(ws.costUsd)}
                    </td>
                    <td className="px-4 py-3 text-xs text-white/30">
                      {fmtDate(ws.lastActivity)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* PHASE 4: USER ANALYTICS */}
      <Section icon={Users} title={t("usersTitle")} subtitle={t("usersSubtitle")}>
        <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                {[
                  t("userUser"),
                  t("userWorkspace"),
                  t("userRequests"),
                  t("userTokens"),
                  t("userCost"),
                  t("userLastRequest"),
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
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-white/25">
                    {t("noDataYet")}
                  </td>
                </tr>
              ) : (
                users.map((u: UserUsageStat) => (
                  <tr
                    key={`${u.userId}::${u.workspaceName}`}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015]"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm text-white/75">{u.userName}</p>
                      <p className="text-xs text-white/25">{u.userEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/40">{u.workspaceName}</td>
                    <td className="px-4 py-3 text-sm tabular-nums text-white/55">
                      {u.requests.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm tabular-nums text-white/55">
                      {fmtTokens(u.totalTokens)}
                    </td>
                    <td className="px-4 py-3 text-sm tabular-nums text-white/70">
                      {fmtCost(u.costUsd)}
                    </td>
                    <td className="px-4 py-3 text-xs text-white/30">
                      {fmtDate(u.lastRequest)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* PHASE 7: TIER LIMITS FOUNDATION */}
      <Section icon={Shield} title={t("tiersTitle")} subtitle={t("tiersSubtitle")}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tierLimits.map((tier: TierLimit) => (
            <TierCard
              key={tier.name}
              tier={tier}
              reqLabel={t("tierReqPerDay")}
              tokensLabel={t("tierTokensPerMonth")}
              foundationLabel={t("tierFoundation")}
              comingSoonLabel={t("tierComingSoon")}
            />
          ))}
        </div>
        <p className="text-[11px] text-white/20">{t("tiersNote")}</p>
      </Section>

      {/* PHASE 8: ARCHITECTURE NOTE */}
      <div className="flex items-center gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.015] px-5 py-3.5">
        <CalendarDays size={13} className="shrink-0 text-white/20" />
        <p className="text-xs text-white/25">{t("architectureNote")}</p>
      </div>
    </div>
  );
}

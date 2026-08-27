import { getTranslations } from "next-intl/server";
import {
  Activity,
  Building2,
  Users,
  Zap,
  AlertTriangle,
  Bot,
  Mail,
  Clock,
} from "lucide-react";
import { getPlatformHealth } from "@/server/actions/admin/getPlatformHealth";

function fmtTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function fmtCost(usd: number): string {
  if (usd === 0) return "$0.00";
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(2)}`;
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function HealthCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  iconBg,
  alert,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  alert?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-3 rounded-2xl border p-5 ${alert ? "border-red-500/20 bg-red-500/[0.04]" : "border-white/[0.07] bg-white/[0.03]"}`}>
      <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${iconBg}`}>
        <Icon size={14} className={iconColor} />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">{label}</p>
        <p className={`mt-1 text-xl font-semibold tabular-nums ${alert ? "text-red-300" : "text-white/90"}`}>
          {value}
        </p>
        {sub && <p className="mt-0.5 text-[11px] text-white/25">{sub}</p>}
      </div>
    </div>
  );
}

export default async function AdminHealthPage() {
  const [t, health] = await Promise.all([
    getTranslations("admin"),
    getPlatformHealth(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
            <Activity size={12} className="text-amber-300" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-white/90">{t("healthTitle")}</h1>
        <p className="mt-1 text-sm text-white/35">{t("healthSubtitle")}</p>
      </div>

      {/* Platform scale */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-white/25">{t("healthSectionScale")}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <HealthCard label={t("healthWorkspaces")} value={health.workspaceCount.toLocaleString()} icon={Building2} iconColor="text-blue-300" iconBg="border-blue-500/20 bg-blue-500/10" />
          <HealthCard label={t("healthUsers")} value={health.userCount.toLocaleString()} icon={Users} iconColor="text-violet-300" iconBg="border-violet-500/20 bg-violet-500/10" />
          <HealthCard label={t("healthInvitesPending")} value={health.invites.pending.toLocaleString()} sub={`${health.invites.accepted} ${t("healthInvitesAccepted")}`} icon={Mail} iconColor="text-pink-300" iconBg="border-pink-500/20 bg-pink-500/10" />
          <HealthCard label={t("healthSignalsActive")} value={health.signals.active.toLocaleString()} sub={`${health.signals.total} ${t("healthSignalsTotal")}`} icon={Zap} iconColor="text-amber-300" iconBg="border-amber-500/20 bg-amber-500/10" />
        </div>
      </div>

      {/* Signal engine */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-white/25">{t("healthSectionSignals")}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <HealthCard
            label={t("healthCritical")}
            value={health.signals.critical.toLocaleString()}
            icon={AlertTriangle}
            iconColor={health.signals.critical > 0 ? "text-red-300" : "text-white/30"}
            iconBg={health.signals.critical > 0 ? "border-red-500/20 bg-red-500/10" : "border-white/[0.06] bg-white/[0.02]"}
            alert={health.signals.critical > 0}
          />
          <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]">
              <Clock size={14} className="text-white/30" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">{t("healthLastSignal")}</p>
              <p className="mt-1 text-sm text-white/70">{fmtDate(health.signals.lastProducedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI today */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-white/25">{t("healthSectionAI")}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <HealthCard label={t("healthAIRequests")} value={health.ai.requestsToday.toLocaleString()} icon={Bot} iconColor="text-emerald-300" iconBg="border-emerald-500/20 bg-emerald-500/10" />
          <HealthCard label={t("healthAITokens")} value={fmtTokens(health.ai.tokensToday)} icon={Zap} iconColor="text-cyan-300" iconBg="border-cyan-500/20 bg-cyan-500/10" />
          <HealthCard label={t("healthAICost")} value={fmtCost(health.ai.costToday)} icon={Activity} iconColor="text-amber-300" iconBg="border-amber-500/20 bg-amber-500/10" />
        </div>
      </div>

      <p className="text-[11px] text-white/20">
        {t("generatedAt")} {fmtDate(health.generatedAt)}
      </p>
    </div>
  );
}

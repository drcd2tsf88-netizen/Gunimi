import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Building2, Users, Bot, Activity, Mail, MessageSquareText } from "lucide-react";
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

export default async function AdminHubPage() {
  const [t, health] = await Promise.all([
    getTranslations("admin"),
    getPlatformHealth(),
  ]);

  const cards = [
    {
      href: "/dashboard/admin/workspaces",
      icon: Building2,
      iconColor: "text-blue-300",
      iconBg: "border-blue-500/20 bg-blue-500/10",
      label: t("hubWorkspaces"),
      value: health.workspaceCount.toLocaleString(),
    },
    {
      href: "/dashboard/admin/users",
      icon: Users,
      iconColor: "text-violet-300",
      iconBg: "border-violet-500/20 bg-violet-500/10",
      label: t("hubUsers"),
      value: health.userCount.toLocaleString(),
    },
    {
      href: "/dashboard/admin/ai",
      icon: Bot,
      iconColor: "text-emerald-300",
      iconBg: "border-emerald-500/20 bg-emerald-500/10",
      label: t("hubAIToday"),
      value: `${health.ai.requestsToday} req · ${fmtTokens(health.ai.tokensToday)} tok · ${fmtCost(health.ai.costToday)}`,
    },
    {
      href: "/dashboard/admin/health",
      icon: Activity,
      iconColor: "text-amber-300",
      iconBg: "border-amber-500/20 bg-amber-500/10",
      label: t("hubSignals"),
      value: `${health.signals.active} active${health.signals.critical > 0 ? ` · ${health.signals.critical} critical` : ""}`,
    },
    {
      href: "/dashboard/admin/invites",
      icon: Mail,
      iconColor: "text-pink-300",
      iconBg: "border-pink-500/20 bg-pink-500/10",
      label: t("hubInvites"),
      value: `${health.invites.pending} pending`,
    },
    {
      href: "/dashboard/admin/dogfood",
      icon: MessageSquareText,
      iconColor: "text-cyan-300",
      iconBg: "border-cyan-500/20 bg-cyan-500/10",
      label: t("hubDogfood"),
      value: t("hubDogfoodHint"),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white/90">{t("hubTitle")}</h1>
        <p className="mt-1 text-sm text-white/35">{t("hubSubtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ href, icon: Icon, iconColor, iconBg, label, value }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.05]"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconBg}`}>
              <Icon size={16} className={iconColor} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-500">{label}</p>
              <p className="mt-0.5 truncate text-sm font-medium text-white/80">{value}</p>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-[11px] text-white/20">
        {t("generatedAt")} {new Date(health.generatedAt).toLocaleString("en-US", {
          month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
        })}
      </p>
    </div>
  );
}

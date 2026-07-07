"use client";

import { useState } from "react";
import Link from "next/link";

import { useTranslations } from "next-intl";

import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Building2,
  BarChart3,
  TrendingUp,
  CheckSquare2,
  ChevronRight,
  MessageSquare,
  Zap,
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiSection from "@/components/layout/GunimiSection";
import GunimiStatCard from "@/components/ui/GunimiStatCard";
import GunimiCard from "@/components/ui/GunimiCard";
import OrbitAssistant from "@/components/ai/OrbitAssistant";

import { AnalyticsOverview } from "@/server/actions/analytics/getAnalyticsOverview";

type Props = {
  stats: AnalyticsOverview;
};

type ColorKey = "emerald" | "violet" | "cyan" | "amber";

const COLOR_CLASSES: Record<
  ColorKey,
  { border: string; bg: string; text: string }
> = {
  emerald: {
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
  },
  violet: {
    border: "border-violet-500/20",
    bg: "bg-violet-500/15",
    text: "text-violet-300",
  },
  cyan: {
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/15",
    text: "text-cyan-300",
  },
  amber: {
    border: "border-amber-500/20",
    bg: "bg-amber-500/15",
    text: "text-amber-300",
  },
};

type ModuleDef = {
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
  href: string;
  color: ColorKey;
};

const INTELLIGENCE_MODULES: ModuleDef[] = [
  {
    titleKey: "moduleAutomationsTitle",
    descKey: "moduleAutomationsDesc",
    icon: Zap,
    href: "/dashboard/automations",
    color: "emerald",
  },
  {
    titleKey: "moduleMemoryTitle",
    descKey: "moduleMemoryDesc",
    icon: Brain,
    href: "/dashboard/memory",
    color: "violet",
  },
  {
    titleKey: "moduleAnalyticsTitle",
    descKey: "moduleAnalyticsDesc",
    icon: BarChart3,
    href: "/dashboard/analytics",
    color: "cyan",
  },
  {
    titleKey: "moduleRecommendationsTitle",
    descKey: "moduleRecommendationsDesc",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "amber",
  },
];

const QUICK_PROMPTS = [
  "prompt1",
  "prompt2",
  "prompt3",
  "prompt4",
] as const;

export default function AIPageView({ stats }: Props) {
  const t = useTranslations("ai");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  function openWithPrompt(prompt: string) {
    setPendingPrompt(prompt);
    setAssistantOpen(true);
  }

  function handleClose() {
    setAssistantOpen(false);
    setPendingPrompt(null);
  }

  return (
    <div className="space-y-10">
      <GunimiSection>
        <GunimiHeading
          badge={t("badge")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
      </GunimiSection>

      {/* WORKSPACE CONTEXT */}
      <GunimiSection>
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {t("contextCardTitle")}
          </p>
          <h2 className="mt-1.5 text-xl font-semibold">{t("overviewTitle")}</h2>
          <p className="mt-1 text-sm text-white/40">{t("overviewSubtitle")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <GunimiStatCard
            title={t("statCompanies")}
            value={stats.companies}
            icon={Building2}
            animated
          />
          <GunimiStatCard
            title={t("statDeals")}
            value={stats.deals}
            icon={TrendingUp}
            animated
          />
          <GunimiStatCard
            title={t("statOpenTasks")}
            value={stats.openTasks}
            icon={CheckSquare2}
            animated
          />
          <GunimiStatCard
            title={t("statUpcomingMeetings")}
            value={stats.upcomingMeetings}
            icon={CalendarDays}
            animated
          />
        </div>
      </GunimiSection>

      {/* AI CHAT — PRIMARY CTA */}
      <GunimiSection>
        <GunimiCard className="relative overflow-hidden p-0">
          <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-[240px] w-[240px] rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/15">
                <MessageSquare size={20} className="text-violet-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold">{t("chatTitle")}</h3>
                  <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-violet-300">
                    {t("alphaBadge")}
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/40">{t("chatDesc")}</p>
              </div>
            </div>
            <button
              onClick={() => setAssistantOpen(true)}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/15 px-5 py-2.5 text-sm font-semibold text-violet-200 transition-all hover:border-violet-500/50 hover:bg-violet-500/20"
            >
              <Sparkles size={14} />
              {t("openChat")}
            </button>
          </div>

          {/* QUICK PROMPTS */}
          <div className="border-t border-white/[0.05] px-8 py-5">
            <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {t("promptsLabel")}
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((key) => (
                <button
                  key={key}
                  onClick={() => openWithPrompt(t(key as Parameters<typeof t>[0]))}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/60 transition-all hover:border-violet-500/25 hover:bg-violet-500/[0.06] hover:text-violet-200"
                >
                  {t(key as Parameters<typeof t>[0])}
                  <ArrowRight size={10} className="opacity-50" />
                </button>
              ))}
            </div>
          </div>
        </GunimiCard>
      </GunimiSection>

      {/* LIVE INTELLIGENCE MODULES */}
      <GunimiSection>
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {t("intelligenceLabel")}
          </p>
          <h2 className="mt-1.5 text-xl font-semibold">{t("intelligenceTitle")}</h2>
          <p className="mt-1 text-sm text-white/40">{t("intelligenceSubtitle")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {INTELLIGENCE_MODULES.map((mod) => {
            const Icon = mod.icon;
            const c = COLOR_CLASSES[mod.color];
            return (
              <Link key={mod.titleKey} href={mod.href} className="group block">
                <GunimiCard className="flex h-full flex-col gap-4 p-5 transition-all group-hover:border-white/[0.1]">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${c.border} ${c.bg}`}
                    >
                      <Icon size={18} className={c.text} />
                    </div>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${c.border} ${c.bg} ${c.text}`}
                    >
                      {t("activeBadge")}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-semibold">
                      {t(mod.titleKey as Parameters<typeof t>[0])}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/40">
                      {t(mod.descKey as Parameters<typeof t>[0])}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-white/25 transition-colors group-hover:text-white/50">
                    <span>{t("openModule")}</span>
                    <ChevronRight size={9} />
                  </div>
                </GunimiCard>
              </Link>
            );
          })}
        </div>
      </GunimiSection>

      <OrbitAssistant
        open={assistantOpen}
        onClose={handleClose}
        initialPrompt={pendingPrompt ?? undefined}
      />
    </div>
  );
}

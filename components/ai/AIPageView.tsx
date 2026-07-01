"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import {
  Building2,
  TrendingUp,
  CheckSquare2,
  MessageSquare,
  Zap,
  BarChart2,
  BookOpen,
  CalendarDays,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import OrbitHeading from "@/components/ui/OrbitHeading";
import OrbitSection from "@/components/layout/OrbitSection";
import OrbitStatCard from "@/components/ui/OrbitStatCard";
import OrbitCard from "@/components/ui/OrbitCard";
import OrbitAssistant from "@/components/ai/OrbitAssistant";

import { AnalyticsOverview } from "@/server/actions/analytics/getAnalyticsOverview";

type Props = {
  stats: AnalyticsOverview;
};

const COMING_SOON_MODULES = [
  { key: "automation", icon: Zap },
  { key: "insights", icon: BarChart2 },
  { key: "knowledge", icon: BookOpen },
] as const;

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
      <OrbitSection>
        <OrbitHeading
          badge={t("badge")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
      </OrbitSection>

      {/* WORKSPACE CONTEXT */}
      <OrbitSection>
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {t("contextCardTitle")}
          </p>
          <h2 className="mt-1.5 text-xl font-semibold">{t("overviewTitle")}</h2>
          <p className="mt-1 text-sm text-white/40">{t("overviewSubtitle")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OrbitStatCard
            title={t("statCompanies")}
            value={stats.companies}
            icon={Building2}
            animated
          />
          <OrbitStatCard
            title={t("statDeals")}
            value={stats.deals}
            icon={TrendingUp}
            animated
          />
          <OrbitStatCard
            title={t("statOpenTasks")}
            value={stats.openTasks}
            icon={CheckSquare2}
            animated
          />
          <OrbitStatCard
            title={t("statUpcomingMeetings")}
            value={stats.upcomingMeetings}
            icon={CalendarDays}
            animated
          />
        </div>
      </OrbitSection>

      {/* AI CHAT — PRIMARY CTA */}
      <OrbitSection>
        <OrbitCard className="relative overflow-hidden p-0">
          {/* Glow */}
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
        </OrbitCard>
      </OrbitSection>

      {/* COMING SOON MODULES */}
      <OrbitSection>
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {t("modulesLabel")}
          </p>
          <h2 className="mt-1.5 text-xl font-semibold">{t("modulesTitle")}</h2>
          <p className="mt-1 text-sm text-white/40">{t("modulesSubtitle")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {COMING_SOON_MODULES.map(({ key, icon: Icon }) => (
            <OrbitCard key={key} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                    <Icon className="h-4 w-4 text-violet-300" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">
                      {t(`${key}Title` as Parameters<typeof t>[0])}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/40">
                      {t(`${key}Desc` as Parameters<typeof t>[0])}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-300">
                  {t("comingSoonBadge")}
                </span>
              </div>
            </OrbitCard>
          ))}
        </div>
      </OrbitSection>

      <OrbitAssistant
        open={assistantOpen}
        onClose={handleClose}
        initialPrompt={pendingPrompt ?? undefined}
      />
    </div>
  );
}

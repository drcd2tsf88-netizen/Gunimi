"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Building2,
  TrendingUp,
  CheckSquare2,
  CalendarDays,
  Mail,
  Users,
} from "lucide-react";

import OrbitStatCard from "@/components/ui/OrbitStatCard";
import OrbitAssistant from "@/components/ai/OrbitAssistant";

import PriorityTasksWidget, { type DashboardTask } from "./PriorityTasksWidget";
import UpcomingMeetingsWidget from "./UpcomingMeetingsWidget";
import RecentEmailsWidget from "./RecentEmailsWidget";
import RecentActivityWidget, { type DashboardActivityItem } from "./RecentActivityWidget";
import DailyBriefWidget from "./DailyBriefWidget";
import OnboardingWidget from "./OnboardingWidget";

import type { AnalyticsOverview } from "@/server/actions/analytics/getAnalyticsOverview";
import type { CalendarEventRow } from "@/types/calendar";
import type { EmailThread } from "@/types/email";
import type { OnboardingStatus } from "@/server/actions/onboarding/getOnboardingStatus";

type Props = {
  displayName: string;
  analytics: AnalyticsOverview;
  tasks: DashboardTask[];
  events: CalendarEventRow[];
  threads: EmailThread[];
  activities: DashboardActivityItem[];
  onboardingStatus: OnboardingStatus;
};

export default function DashboardView({
  displayName,
  analytics,
  tasks,
  events,
  threads,
  activities,
  onboardingStatus,
}: Props) {
  const t = useTranslations("dashboard");
  const [assistantOpen, setAssistantOpen] = useState(false);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t("goodMorning") : hour < 18 ? t("goodAfternoon") : t("goodEvening");

  // Show onboarding widget until all 5 server-tracked steps are done
  const serverStepsDone = [
    onboardingStatus.emailConnected,
    onboardingStatus.calendarConnected,
    onboardingStatus.contactsCount > 0,
    onboardingStatus.companiesCount > 0,
    onboardingStatus.dealsCount > 0,
  ].filter(Boolean).length;
  const showOnboarding = serverStepsDone < 5;

  const isNewWorkspace =
    onboardingStatus.contactsCount === 0 &&
    onboardingStatus.dealsCount === 0 &&
    !onboardingStatus.emailConnected &&
    !onboardingStatus.calendarConnected;

  const stats = [
    { title: t("statsCompanies"), value: analytics.companies, icon: Building2 },
    { title: t("statsDeals"), value: analytics.deals, icon: TrendingUp },
    { title: t("statsOpenTasks"), value: analytics.openTasks, icon: CheckSquare2 },
    { title: t("statsMeetings"), value: analytics.upcomingMeetings, icon: CalendarDays },
    { title: t("statsEmails"), value: analytics.emailThreads, icon: Mail },
    { title: t("statsMembers"), value: analytics.members, icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* ONBOARDING WIDGET — shown until 5 server steps complete */}
      {showOnboarding && (
        <OnboardingWidget
          status={onboardingStatus}
          onOpenAI={() => setAssistantOpen(true)}
        />
      )}

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {t("commandCenter")}
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight">
            {greeting}, {displayName}
          </h1>
          <p className="mt-1 text-sm text-white/40">{t("heroSubtitle")}</p>
        </div>

        <button
          onClick={() => setAssistantOpen(true)}
          className="shrink-0 rounded-2xl border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition-all hover:border-violet-500/30 hover:bg-violet-500/15"
        >
          {t("openOrbit")}
        </button>
      </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <OrbitStatCard
            key={s.title}
            title={s.title}
            value={s.value}
            icon={s.icon}
            animated
          />
        ))}
      </div>

      {/* ROW 1: Priority Tasks + Upcoming Meetings */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PriorityTasksWidget tasks={tasks} />
        <UpcomingMeetingsWidget events={events} />
      </div>

      {/* ROW 2: Recent Emails + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentEmailsWidget threads={threads} />
        <RecentActivityWidget activities={activities} />
      </div>

      {/* ROW 3: Daily Brief */}
      <DailyBriefWidget displayName={displayName} isNewWorkspace={isNewWorkspace} />

      <OrbitAssistant
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />
    </div>
  );
}

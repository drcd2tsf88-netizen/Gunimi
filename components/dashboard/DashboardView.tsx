"use client";

import { useState } from "react";
import OrbitAssistant from "@/components/ai/OrbitAssistant";
import MorningIntelligenceCard from "./MorningIntelligenceCard";

import MorningSummaryWidget, {
  type DashboardActivityItem,
} from "./MorningSummaryWidget";
import TodaysPrioritiesWidget, { type DashboardTask } from "./TodaysPrioritiesWidget";
import BusinessHealthWidget from "./BusinessHealthWidget";
import OrbitRecommendationsWidget from "./OrbitRecommendationsWidget";
import OnboardingWidget from "./OnboardingWidget";

import type { AnalyticsOverview } from "@/server/actions/analytics/getAnalyticsOverview";
import type { CalendarEventRow } from "@/types/calendar";
import type { OnboardingStatus } from "@/server/actions/onboarding/getOnboardingStatus";
import type { PipelineBreakdown } from "@/server/actions/dashboard/getPipelineBreakdown";
import type { DashboardInsights } from "@/server/actions/dashboard/getDashboardInsights";

type Props = {
  displayName: string;
  analytics: AnalyticsOverview;
  tasks: DashboardTask[];
  events: CalendarEventRow[];
  activities: DashboardActivityItem[];
  onboardingStatus: OnboardingStatus;
  pipeline: PipelineBreakdown;
  insights: DashboardInsights;
};

export default function DashboardView({
  displayName,
  analytics,
  tasks,
  events,
  activities,
  onboardingStatus,
  pipeline,
  insights,
}: Props) {
  const [assistantOpen, setAssistantOpen] = useState(false);

  const showOnboarding = !(
    onboardingStatus.contactsCount > 0 &&
    onboardingStatus.companiesCount > 0 &&
    onboardingStatus.dealsCount > 0
  );

  return (
    <div className="space-y-6">
      <MorningIntelligenceCard onOpenAI={() => setAssistantOpen(true)} displayName={displayName} />

      {showOnboarding && (
        <OnboardingWidget
          status={onboardingStatus}
          onOpenAI={() => setAssistantOpen(true)}
        />
      )}

      <MorningSummaryWidget
        displayName={displayName}
        analytics={analytics}
        activities={activities}
        onOpenAI={() => setAssistantOpen(true)}
      />

      <TodaysPrioritiesWidget
        tasks={tasks}
        events={events}
        staleDealsCount={pipeline.staleDealsCount}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <BusinessHealthWidget
          tasks={tasks}
          pipeline={pipeline}
        />
        <OrbitRecommendationsWidget
          tasks={tasks}
          analytics={analytics}
          onboardingStatus={onboardingStatus}
          insights={insights}
        />
      </div>

      <OrbitAssistant
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />
    </div>
  );
}

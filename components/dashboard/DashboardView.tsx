"use client";

import { useState } from "react";
import OrbitAssistant from "@/components/ai/OrbitAssistant";
import MorningIntelligenceCard from "./MorningIntelligenceCard";
import TodaysPrioritiesWidget, { type DashboardTask } from "./TodaysPrioritiesWidget";
import OnboardingWidget from "./OnboardingWidget";

import type { CalendarEventRow } from "@/types/calendar";
import type { OnboardingStatus } from "@/server/actions/onboarding/getOnboardingStatus";
import type { PipelineBreakdown } from "@/server/actions/dashboard/getPipelineBreakdown";

type Props = {
  displayName: string;
  tasks: DashboardTask[];
  events: CalendarEventRow[];
  onboardingStatus: OnboardingStatus;
  pipeline: PipelineBreakdown;
};

export default function DashboardView({
  displayName,
  tasks,
  events,
  onboardingStatus,
  pipeline,
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

      <TodaysPrioritiesWidget
        tasks={tasks}
        events={events}
        staleDealsCount={pipeline.staleDealsCount}
      />

      <OrbitAssistant
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />
    </div>
  );
}

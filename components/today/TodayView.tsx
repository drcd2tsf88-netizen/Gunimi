"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { resolveTodayData } from "@/lib/today/resolver";
import TodayFocusCard from "./TodayFocusCard";
import TodayAttentionSection from "./TodayAttentionSection";
import TodayRelationshipsSection from "./TodayRelationshipsSection";
import TodayWorkSection from "./TodayWorkSection";
import type { TodayRawDeal, TodayRawContact, TodayRawTask } from "@/lib/today/types";

type Props = {
  displayName: string;
  deals: TodayRawDeal[];
  contacts: TodayRawContact[];
  tasks: TodayRawTask[];
};

function getGreetingKey(): "greetingMorning" | "greetingAfternoon" | "greetingEvening" {
  const hour = new Date().getHours();
  if (hour < 12) return "greetingMorning";
  if (hour < 17) return "greetingAfternoon";
  return "greetingEvening";
}

function extractFirstName(displayName: string): string {
  const first = displayName.trim().split(/\s+/)[0];
  return first ?? displayName;
}

export default function TodayView({ displayName, deals, contacts, tasks }: Props) {
  const t = useTranslations("today");

  const { health, focus, attention, relationships, work } = useMemo(
    () => resolveTodayData(deals, contacts, tasks),
    [deals, contacts, tasks],
  );

  const greeting = t(getGreetingKey());
  const firstName = extractFirstName(displayName);
  const healthLabel = t(health.labelKey, health.labelParams ?? {});

  const healthColorClass =
    health.level === "healthy"
      ? "text-emerald-400/80"
      : health.level === "urgent"
        ? "text-red-400/80"
        : "text-amber-400/80";

  return (
    <div className="space-y-4">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="pb-2">
        <p className="text-[13px] text-white/35">
          {greeting}, {firstName}.
        </p>
        <p className={cn("mt-1 text-sm font-medium", healthColorClass)}>
          {healthLabel}
        </p>
      </div>

      {/* ── Section 1: Focus ──────────────────────────────────────────────── */}
      <TodayFocusCard focus={focus} />

      {/* ── Section 2: Attention Required ────────────────────────────────── */}
      <TodayAttentionSection items={attention} />

      {/* ── Section 3: Relationships ─────────────────────────────────────── */}
      <TodayRelationshipsSection items={relationships} />

      {/* ── Section 4: Today's Work ───────────────────────────────────────── */}
      <TodayWorkSection items={work} />
    </div>
  );
}

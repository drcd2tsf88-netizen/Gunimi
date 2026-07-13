// Today Experience — Presentation Types
// Authority: docs/blueprints/TODAY_EXPERIENCE_BLUEPRINT.md
//
// These types define the PRESENTATION MODEL for Today.
// All business intelligence is computed by the Signal Engine and stored in the
// Signal Archive. The Signal Query Layer (lib/signals/queries/today.ts) reads
// the archive and produces these types. No raw entity data flows through Today.

export type TodayFocus = {
  actionKey: string;
  actionParams?: Record<string, string | number>;
  reasonKey: string;
  reasonParams?: Record<string, string | number>;
  href: string;
} | null;

export type TodayAttentionItem = {
  id: string;
  labelKey: string;
  labelParams?: Record<string, string | number>;
  href: string;
  urgency: "critical" | "warning";
};

export type TodayRelationshipItem = {
  id: string;
  name: string;
  labelKey: string;
  labelParams?: Record<string, string | number>;
  href: string;
};

export type TodayWorkItem = {
  id: string;
  title: string;
  tag: "overdue" | "today";
};

export type TodayHealth = {
  level: "healthy" | "attention" | "urgent";
  labelKey: string;
  labelParams?: Record<string, string | number>;
};

export type ResolvedTodayData = {
  health: TodayHealth;
  focus: TodayFocus;
  attention: TodayAttentionItem[];
  relationships: TodayRelationshipItem[];
  work: TodayWorkItem[];
};

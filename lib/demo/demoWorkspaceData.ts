import type { ResolvedTodayData } from "@/lib/today/types";

export const DEMO_DISPLAY_NAME = "Jan";
export const DEMO_WORKSPACE_NAME = "Acme Holdings";
export const DEMO_PROFILE = { full_name: "Jan Novák", avatar_url: null as string | null };

export const DEMO_TODAY_DATA: ResolvedTodayData = {
  health: {
    level: "attention",
    labelKey: "healthAttention",
    labelParams: { count: 3 },
  },
  focus: {
    actionKey: "focusContactStaleAction",
    actionParams: { name: "Jana at Acme Corp", days: 12 },
    reasonKey: "focusContactStaleReason",
    reasonParams: { days: 12, deal: "Acme Corp renewal" },
    href: "/register?ref=demo",
  },
  attention: [
    {
      id: "demo-a1",
      labelKey: "attentionDealStale",
      labelParams: { title: "Acme Corp", days: 14 },
      href: "/register?ref=demo",
      urgency: "warning",
    },
    {
      id: "demo-a2",
      labelKey: "attentionTaskOverdue",
      labelParams: { title: "StarBridge proposal", days: 2 },
      href: "/register?ref=demo",
      urgency: "critical",
    },
    {
      id: "demo-a3",
      labelKey: "attentionContactStale",
      labelParams: { name: "Martin Novák", days: 21 },
      href: "/register?ref=demo",
      urgency: "warning",
    },
  ],
  relationships: [
    {
      id: "demo-r1",
      name: "Martin Novák",
      labelKey: "relationshipStale",
      labelParams: { days: 21 },
      href: "/register?ref=demo",
    },
    {
      id: "demo-r2",
      name: "Jana Horáková",
      labelKey: "relationshipStale",
      labelParams: { days: 12 },
      href: "/register?ref=demo",
    },
  ],
  work: [],
};

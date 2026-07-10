// Raw shapes from the database — minimal fields needed for Today resolution
export type TodayRawDeal = {
  id: string;
  title: string;
  stage: string;
  value?: number | null;
  expected_close_date?: string | null;
  updated_at?: string | null;
  contact?: { id: string; name: string } | null;
};

export type TodayRawContact = {
  id: string;
  name: string;
  last_contacted_at?: string | null;
};

export type TodayRawTask = {
  id: string;
  title: string;
  status: string;
  priority?: string | null;
  due_date?: string | null;
};

// Resolved shapes for view components — all use locale keys, never raw strings

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

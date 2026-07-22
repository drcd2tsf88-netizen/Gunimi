import type { ResolvedTodayData } from "@/lib/today/types";

// ─── Identity ────────────────────────────────────────────────
export const DEMO_DISPLAY_NAME   = "Jan";
export const DEMO_WORKSPACE_NAME = "Acme Holdings";
export const DEMO_PROFILE = { full_name: "Jan Novák", avatar_url: null as string | null };

// ─── Today view ──────────────────────────────────────────────
export const DEMO_TODAY_DATA: ResolvedTodayData = {
  health: {
    level: "attention",
    labelKey: "healthAttention",
    labelParams: { count: 3 },
  },
  focus: {
    actionKey:    "focusContactStaleAction",
    actionParams: { name: "Jana at Acme Corp", days: 12 },
    reasonKey:    "focusContactStaleReason",
    reasonParams: { days: 12, deal: "Acme Corp renewal" },
    href: "/register?ref=demo",
  },
  attention: [
    {
      id: "demo-a1",
      labelKey:    "attentionDealStale",
      labelParams: { title: "Acme Corp", days: 14 },
      href: "/register?ref=demo",
      urgency: "warning",
    },
    {
      id: "demo-a2",
      labelKey:    "attentionTaskOverdue",
      labelParams: { title: "StarBridge proposal", days: 2 },
      href: "/register?ref=demo",
      urgency: "critical",
    },
    {
      id: "demo-a3",
      labelKey:    "attentionContactStale",
      labelParams: { name: "Martin Novák", days: 21 },
      href: "/register?ref=demo",
      urgency: "warning",
    },
  ],
  relationships: [
    {
      id: "demo-r1",
      name:        "Martin Novák",
      labelKey:    "relationshipStale",
      labelParams: { days: 21 },
      href: "/register?ref=demo",
    },
    {
      id: "demo-r2",
      name:        "Jana Horáková",
      labelKey:    "relationshipStale",
      labelParams: { days: 12 },
      href: "/register?ref=demo",
    },
  ],
  work: [],
};

// ─── Contacts ────────────────────────────────────────────────
export type DemoContact = {
  id: string;
  name: string;
  company: string;
  role: string;
  lastContact: string;
  status: "active" | "stale" | "cold";
};

export const DEMO_CONTACTS: DemoContact[] = [
  { id: "c1", name: "Jana Horáková",   company: "Acme Corp",   role: "Head of Procurement", lastContact: "12 days ago", status: "stale"  },
  { id: "c2", name: "Peter Svoboda",   company: "StarBridge",  role: "CFO",                 lastContact: "3 days ago",  status: "active" },
  { id: "c3", name: "Martin Novák",    company: "Acme Corp",   role: "CEO",                 lastContact: "21 days ago", status: "cold"   },
  { id: "c4", name: "Eva Kratochvíl",  company: "Nexus Ltd",   role: "Operations Lead",     lastContact: "45 days ago", status: "cold"   },
  { id: "c5", name: "Tomáš Blažek",    company: "StarBridge",  role: "Product Director",    lastContact: "1 day ago",   status: "active" },
];

// ─── Companies ───────────────────────────────────────────────
export type DemoCompany = {
  id: string;
  name: string;
  industry: string;
  contacts: number;
  openDeals: number;
  totalValue: string;
  health: "healthy" | "attention" | "cold";
};

export const DEMO_COMPANIES: DemoCompany[] = [
  { id: "co1", name: "Acme Corp",  industry: "Technology", contacts: 2, openDeals: 2, totalValue: "€73,000", health: "attention" },
  { id: "co2", name: "StarBridge", industry: "Finance",    contacts: 2, openDeals: 1, totalValue: "€28,000", health: "healthy"   },
  { id: "co3", name: "Nexus Ltd",  industry: "Healthcare", contacts: 1, openDeals: 0, totalValue: "—",        health: "cold"      },
];

// ─── Deals ───────────────────────────────────────────────────
export type DemoDeal = {
  id: string;
  title: string;
  company: string;
  value: string;
  stage: string;
  stageColor: string;
  daysOpen: number;
};

export const DEMO_DEALS: DemoDeal[] = [
  { id: "d1", title: "Acme Corp renewal",   company: "Acme Corp",  value: "€45,000", stage: "Negotiation", stageColor: "#F59E0B", daysOpen: 42 },
  { id: "d2", title: "StarBridge proposal", company: "StarBridge", value: "€28,000", stage: "Proposal",    stageColor: "#6D5BFF", daysOpen: 14 },
  { id: "d3", title: "Acme integration",    company: "Acme Corp",  value: "€28,000", stage: "Discovery",   stageColor: "#22D3EE", daysOpen: 7  },
];

// ─── Tasks ───────────────────────────────────────────────────
export type DemoTask = {
  id: string;
  title: string;
  due: string;
  dueColor: string;
  priority: "high" | "medium" | "low";
};

export const DEMO_TASKS: DemoTask[] = [
  { id: "t1", title: "Call Martin Novák — deal is going cold",   due: "Overdue",    dueColor: "#EF4444", priority: "high"   },
  { id: "t2", title: "Follow up with Jana Horáková",             due: "Today",      dueColor: "#F59E0B", priority: "high"   },
  { id: "t3", title: "Send StarBridge proposal draft",           due: "Tomorrow",   dueColor: "#9AA3B2", priority: "high"   },
  { id: "t4", title: "Review Acme Corp contract terms",          due: "This week",  dueColor: "#9AA3B2", priority: "medium" },
  { id: "t5", title: "Schedule Nexus Ltd discovery call",        due: "This week",  dueColor: "#9AA3B2", priority: "low"    },
];

// ─── Signals ─────────────────────────────────────────────────
export type DemoSignal = {
  id: string;
  type: "stale_contact" | "deal_risk" | "opportunity" | "task_overdue";
  title: string;
  description: string;
  urgency: "critical" | "warning" | "info";
  entityType: "contact" | "company" | "deal" | "task";
  entityId: string;
  createdAt: string;
};

export const DEMO_SIGNALS: DemoSignal[] = [
  { id: "s1", type: "deal_risk",       title: "Acme Corp renewal at risk",             description: "No communication in 14 days during negotiation phase.",              urgency: "critical", entityType: "deal",    entityId: "d1", createdAt: "2 hours ago"  },
  { id: "s2", type: "stale_contact",   title: "Martin Novák — relationship cooling",   description: "21 days since last contact. Key decision maker for Acme integration.", urgency: "warning",  entityType: "contact", entityId: "c3", createdAt: "5 hours ago"  },
  { id: "s3", type: "task_overdue",    title: "Follow-up with Jana Horáková overdue",  description: "Scheduled follow-up is 2 days past due.",                            urgency: "critical", entityType: "task",    entityId: "t2", createdAt: "1 day ago"    },
  { id: "s4", type: "opportunity",     title: "StarBridge buying signals detected",    description: "Tomáš Blažek engaged yesterday. Proposal decision may be imminent.", urgency: "info",     entityType: "deal",    entityId: "d2", createdAt: "1 day ago"    },
  { id: "s5", type: "stale_contact",   title: "Nexus Ltd — 45 days inactive",          description: "Eva Kratochvíl hasn't been contacted since initial discovery.",       urgency: "warning",  entityType: "contact", entityId: "c4", createdAt: "3 days ago"   },
];

// ─── Memory ──────────────────────────────────────────────────
export type DemoMemory = {
  id: string;
  content: string;
  type: "fact" | "pattern" | "relationship" | "decision";
  confidence: number;
  source: string;
  observedAt: string;
};

export const DEMO_MEMORIES: DemoMemory[] = [
  { id: "m1", content: "Acme Corp Q3 renewal was discussed during a call on July 1st.",                      type: "fact",         confidence: 0.95, source: "Email",            observedAt: "21 days ago" },
  { id: "m2", content: "Martin Novák is the primary decision maker for both Acme Corp deals.",               type: "relationship", confidence: 0.88, source: "Pattern Analysis", observedAt: "14 days ago" },
  { id: "m3", content: "StarBridge typically responds to proposals within 10 business days.",                 type: "pattern",      confidence: 0.82, source: "Historical Data",  observedAt: "30 days ago" },
  { id: "m4", content: "Q3 is the strongest quarter for Acme Corp procurement decisions.",                    type: "pattern",      confidence: 0.76, source: "Historical Data",  observedAt: "45 days ago" },
  { id: "m5", content: "Prioritized StarBridge proposal over Nexus Ltd discovery this week.",                 type: "decision",     confidence: 0.99, source: "Manual Entry",     observedAt: "7 days ago"  },
  { id: "m6", content: "Jana Horáková and Martin Novák collaborate closely within Acme Corp.",                type: "relationship", confidence: 0.71, source: "Email Analysis",   observedAt: "10 days ago" },
  { id: "m7", content: "Eva Kratochvíl prefers written communication (email) over calls.",                    type: "fact",         confidence: 0.68, source: "Pattern Analysis", observedAt: "40 days ago" },
];

// ─── Activities (per entity) ─────────────────────────────────
export type DemoActivity = {
  id: string;
  typeKey: "activityEmail" | "activityCall" | "activityNote" | "activityDealUpdate" | "activityCreated";
  timeAgo: string;
};

export const DEMO_ACTIVITIES: Record<string, DemoActivity[]> = {
  c1: [
    { id: "a-c1-1", typeKey: "activityEmail", timeAgo: "12 days ago" },
    { id: "a-c1-2", typeKey: "activityCall",  timeAgo: "18 days ago" },
    { id: "a-c1-3", typeKey: "activityNote",  timeAgo: "20 days ago" },
  ],
  c2: [
    { id: "a-c2-1", typeKey: "activityEmail", timeAgo: "1 day ago"   },
    { id: "a-c2-2", typeKey: "activityCall",  timeAgo: "5 days ago"  },
  ],
  c3: [
    { id: "a-c3-1", typeKey: "activityEmail", timeAgo: "21 days ago" },
    { id: "a-c3-2", typeKey: "activityCall",  timeAgo: "28 days ago" },
  ],
  c4: [
    { id: "a-c4-1", typeKey: "activityCreated", timeAgo: "45 days ago" },
    { id: "a-c4-2", typeKey: "activityEmail",   timeAgo: "45 days ago" },
  ],
  c5: [
    { id: "a-c5-1", typeKey: "activityEmail", timeAgo: "1 day ago"  },
    { id: "a-c5-2", typeKey: "activityCall",  timeAgo: "3 days ago" },
    { id: "a-c5-3", typeKey: "activityNote",  timeAgo: "6 days ago" },
  ],
  co1: [
    { id: "a-co1-1", typeKey: "activityEmail",      timeAgo: "12 days ago" },
    { id: "a-co1-2", typeKey: "activityDealUpdate", timeAgo: "14 days ago" },
    { id: "a-co1-3", typeKey: "activityCall",       timeAgo: "18 days ago" },
  ],
  co2: [
    { id: "a-co2-1", typeKey: "activityEmail",      timeAgo: "1 day ago"   },
    { id: "a-co2-2", typeKey: "activityDealUpdate", timeAgo: "7 days ago"  },
  ],
  co3: [
    { id: "a-co3-1", typeKey: "activityCreated", timeAgo: "45 days ago" },
  ],
  d1: [
    { id: "a-d1-1", typeKey: "activityDealUpdate", timeAgo: "14 days ago" },
    { id: "a-d1-2", typeKey: "activityEmail",      timeAgo: "16 days ago" },
    { id: "a-d1-3", typeKey: "activityCall",       timeAgo: "21 days ago" },
  ],
  d2: [
    { id: "a-d2-1", typeKey: "activityEmail",      timeAgo: "1 day ago"  },
    { id: "a-d2-2", typeKey: "activityDealUpdate", timeAgo: "7 days ago" },
  ],
  d3: [
    { id: "a-d3-1", typeKey: "activityDealUpdate", timeAgo: "7 days ago" },
    { id: "a-d3-2", typeKey: "activityEmail",      timeAgo: "7 days ago" },
  ],
};

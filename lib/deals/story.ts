import type { Deal } from "@/types/deal";
import type { WorkspaceActivity } from "@/types/activity";

export type StoryIconKey =
  | "begin"
  | "meeting"
  | "email"
  | "call"
  | "stage"
  | "group";

export type StoryEvent = {
  id: string;
  iconKey: StoryIconKey;
  badgeKey: string;
  titleRaw?: string;
  titleKey?: string;
  titleParams?: Record<string, string | number>;
  detail?: string;
  who?: string;
  date: string;
};

const PRIMARY_TYPE_MAP: Record<string, StoryIconKey> = {
  meeting: "meeting",
  meeting_scheduled: "meeting",
  meeting_completed: "meeting",
  call: "call",
  phone_call: "call",
  email: "email",
  email_sent: "email",
  email_received: "email",
  stage_change: "stage",
  stage_changed: "stage",
};

const PRIMARY_ICONS: StoryIconKey[] = ["meeting", "call", "email", "stage"];

function classify(type?: string): StoryIconKey | "secondary" {
  if (!type) return "secondary";
  const mapped = PRIMARY_TYPE_MAP[type.toLowerCase()];
  return mapped && PRIMARY_ICONS.includes(mapped) ? mapped : "secondary";
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function resolveDealStory(
  deal: Deal,
  activities: WorkspaceActivity[],
): StoryEvent[] {
  const events: StoryEvent[] = [];

  // Synthetic first milestone — always present, derived from deal.created_at
  events.push({
    id: "deal-created",
    iconKey: "begin",
    badgeKey: "storyBeginBadge",
    titleKey: "storyBeginTitle",
    detail: deal.company?.name ?? deal.contact?.name,
    who: deal.owner?.full_name,
    date: deal.created_at,
  });

  if (activities.length === 0) return events;

  // Oldest → newest
  const sorted = [...activities].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  const secondary: WorkspaceActivity[] = [];

  for (const activity of sorted) {
    const iconKey = classify(activity.type);

    if (iconKey === "secondary") {
      secondary.push(activity);
      continue;
    }

    events.push({
      id: activity.id,
      iconKey,
      badgeKey: `story${capitalize(iconKey)}Badge`,
      titleRaw: activity.title || undefined,
      titleKey: activity.title ? undefined : `storyFallback${capitalize(iconKey)}`,
      who: activity.user?.full_name,
      date: activity.created_at,
    });
  }

  // Collapse all secondary events into one grouped milestone
  if (secondary.length > 0) {
    const latest = secondary[secondary.length - 1];
    events.push({
      id: "story-group",
      iconKey: "group",
      badgeKey: "storyGroupBadge",
      titleKey: "storyGroupTitle",
      titleParams: { count: secondary.length },
      date: latest.created_at,
    });
  }

  // Final chronological sort
  events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return events;
}

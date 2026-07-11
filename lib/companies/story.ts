import type { Company } from "@/types/company";
import type { WorkspaceActivity } from "@/types/activity";
import type { StoryIconKey, StoryEvent } from "@/lib/workspace/types";

export type { StoryIconKey, StoryEvent };

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

export function resolveCompanyStory(
  company: Company,
  activities: WorkspaceActivity[],
): StoryEvent[] {
  const events: StoryEvent[] = [];

  const originDate = company.created_at ?? new Date(0).toISOString();

  events.push({
    id: "company-created",
    iconKey: "begin",
    badgeKey: "storyBeginBadge",
    titleKey: "storyBeginTitle",
    detail: company.industry ?? company.country,
    who: company.owner?.full_name,
    date: originDate,
  });

  if (activities.length === 0) return events;

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

  events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return events;
}

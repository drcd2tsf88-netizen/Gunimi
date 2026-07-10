import type { Contact } from "@/types/contact";
import type { WorkspaceActivity } from "@/types/activity";
import type { Deal } from "@/types/deal";
import type { StoryEvent, StoryIconKey } from "@/lib/workspace/types";

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

export function resolveContactStory(
  contact: Contact,
  activities: WorkspaceActivity[],
  deals: Deal[],
): StoryEvent[] {
  const events: StoryEvent[] = [];

  events.push({
    id: "contact-created",
    iconKey: "begin",
    badgeKey: "storyBeginBadge",
    titleKey: "storyBeginTitle",
    detail: contact.company_name,
    who: contact.owner?.full_name,
    date: contact.created_at ?? new Date().toISOString(),
  });

  for (const deal of deals) {
    if (deal.stage === "won") {
      events.push({
        id: `deal-won-${deal.id}`,
        iconKey: "stage",
        badgeKey: "storyDealWonBadge",
        titleKey: "storyDealWonTitle",
        detail: deal.title,
        date: deal.updated_at ?? deal.created_at,
      });
    } else if (deal.stage === "lost") {
      events.push({
        id: `deal-lost-${deal.id}`,
        iconKey: "stage",
        badgeKey: "storyDealLostBadge",
        titleKey: "storyDealLostTitle",
        detail: deal.title,
        date: deal.updated_at ?? deal.created_at,
      });
    }
  }

  if (activities.length === 0) {
    events.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    return events;
  }

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
      titleRaw: activity.title ?? undefined,
      titleKey: activity.title ? undefined : `storyFallback${capitalize(iconKey)}`,
      who: activity.user?.full_name,
      date: activity.created_at,
    });
  }

  if (secondary.length > 0) {
    const latest = secondary[secondary.length - 1];
    events.push({
      id: "contact-story-group",
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

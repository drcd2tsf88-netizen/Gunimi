import type { Deal } from "@/types/deal";
import type { DealRelatedTask } from "@/server/actions/deals/getDealRelatedTasks";
import type { DealRelatedNote } from "@/server/actions/deals/getDealRelatedNotes";
import type { WorkspaceActivity } from "@/types/activity";

export type RawContextEntry = {
  id: string;
  labelKey?: string;
  primary: string;
  secondary?: string;
  href?: string;
  metaRaw?: string;
};

export type RawContextSection = {
  id: string;
  titleKey: string;
  iconKey: "relationships" | "notes" | "tasks" | "meeting";
  entries: RawContextEntry[];
};

const MEETING_TYPES = new Set([
  "meeting",
  "meeting_scheduled",
  "meeting_completed",
  "call",
  "phone_call",
]);

function shortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function shortDateNoYear(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function resolveDealContext(
  deal: Deal,
  notes: DealRelatedNote[],
  tasks: DealRelatedTask[],
  activities: WorkspaceActivity[],
): RawContextSection[] {
  const sections: RawContextSection[] = [];

  // ── RELATIONSHIPS ──────────────────────────────────────────────
  const relEntries: RawContextEntry[] = [];

  if (deal.company) {
    relEntries.push({
      id: `company-${deal.company.id}`,
      labelKey: "contextLabelCompany",
      primary: deal.company.name,
      href: `/dashboard/companies/${deal.company.id}`,
    });
  }

  if (deal.contact) {
    relEntries.push({
      id: `contact-${deal.contact.id}`,
      labelKey: "contextLabelContact",
      primary: deal.contact.name,
      secondary: deal.contact.email,
      href: `/dashboard/crm/${deal.contact.id}`,
    });
  }

  if (deal.owner) {
    relEntries.push({
      id: "owner",
      labelKey: "contextLabelOwner",
      primary: deal.owner.full_name,
    });
  }

  if (relEntries.length > 0) {
    sections.push({
      id: "relationships",
      titleKey: "contextSectionRelationships",
      iconKey: "relationships",
      entries: relEntries,
    });
  }

  // ── RELATED NOTES ──────────────────────────────────────────────
  const topNotes = notes.slice(0, 3);
  if (topNotes.length > 0) {
    sections.push({
      id: "notes",
      titleKey: "contextSectionNotes",
      iconKey: "notes",
      entries: topNotes.map((note) => ({
        id: note.id,
        primary: note.title,
        secondary:
          note.source === "contact"
            ? (deal.contact?.name ?? undefined)
            : (deal.company?.name ?? undefined),
        metaRaw: shortDate(note.created_at),
      })),
    });
  }

  // ── PENDING TASKS ──────────────────────────────────────────────
  const pendingTasks = tasks.filter((t) => t.status !== "done").slice(0, 3);
  if (pendingTasks.length > 0) {
    sections.push({
      id: "tasks",
      titleKey: "contextSectionWork",
      iconKey: "tasks",
      entries: pendingTasks.map((task) => ({
        id: task.id,
        primary: task.title,
        metaRaw: task.due_date ? shortDateNoYear(task.due_date) : undefined,
      })),
    });
  }

  // ── RECENT MEETING ────────────────────────────────────────────
  const recentMeeting = [...activities]
    .filter((a) => MEETING_TYPES.has((a.type ?? "").toLowerCase()))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  if (recentMeeting) {
    sections.push({
      id: "meeting",
      titleKey: "contextSectionMeeting",
      iconKey: "meeting",
      entries: [
        {
          id: recentMeeting.id,
          primary: recentMeeting.title ?? recentMeeting.type ?? "Meeting",
          secondary: recentMeeting.user?.full_name,
          metaRaw: shortDate(recentMeeting.created_at),
        },
      ],
    });
  }

  return sections;
}

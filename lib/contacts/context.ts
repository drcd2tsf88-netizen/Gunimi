import type { Contact } from "@/types/contact";
import type { ContactTask } from "@/server/actions/crm/getContactTasks";
import type { ContactNote } from "@/server/actions/crm/getContactNotes";
import type { Deal } from "@/types/deal";
import type { WorkspaceActivity } from "@/types/activity";
import type { RawContextSection, RawContextEntry } from "@/lib/workspace/types";

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

export function resolveContactContext(
  contact: Contact,
  deals: Deal[],
  notes: ContactNote[],
  tasks: ContactTask[],
  activities: WorkspaceActivity[],
): RawContextSection[] {
  const sections: RawContextSection[] = [];

  // ── ORGANIZATION ───────────────────────────────────────────────
  if (contact.company_id || contact.owner) {
    const entries: RawContextEntry[] = [];

    if (contact.company_id && contact.company_name) {
      entries.push({
        id: `company-${contact.company_id}`,
        labelKey: "contextLabelCompany",
        primary: contact.company_name,
        href: `/dashboard/companies/${contact.company_id}`,
      });
    }

    if (contact.owner) {
      entries.push({
        id: "owner",
        labelKey: "contextLabelOwner",
        primary: contact.owner.full_name,
      });
    }

    if (entries.length > 0) {
      sections.push({
        id: "company",
        titleKey: "contextSectionCompany",
        iconKey: "relationships",
        entries,
      });
    }
  }

  // ── ACTIVE DEALS ───────────────────────────────────────────────
  const openDeals = deals
    .filter((d) => d.stage !== "won" && d.stage !== "lost")
    .slice(0, 3);

  if (openDeals.length > 0) {
    sections.push({
      id: "deals",
      titleKey: "contextSectionDeals",
      iconKey: "relationships",
      entries: openDeals.map((deal) => ({
        id: deal.id,
        labelKey: "contextLabelDeal",
        primary: deal.title,
        secondary: deal.stage,
        href: `/dashboard/deals/${deal.id}`,
      })),
    });
  }

  // ── RECENT NOTES ───────────────────────────────────────────────
  const topNotes = notes.slice(0, 3);

  if (topNotes.length > 0) {
    sections.push({
      id: "notes",
      titleKey: "contextSectionNotes",
      iconKey: "notes",
      entries: topNotes.map((note) => ({
        id: note.id,
        primary: note.title,
        metaRaw: shortDate(note.created_at),
      })),
    });
  }

  // ── OPEN WORK ──────────────────────────────────────────────────
  const pendingTasks = tasks.filter((task) => task.status !== "done").slice(0, 3);

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

  // ── RECENT MEETING ─────────────────────────────────────────────
  const recentMeeting = [...activities]
    .filter((a) => MEETING_TYPES.has((a.type ?? "").toLowerCase()))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )[0];

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

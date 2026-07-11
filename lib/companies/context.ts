import type { Contact } from "@/types/contact";
import type { Deal } from "@/types/deal";
import type { WorkspaceActivity } from "@/types/activity";
import type { RawContextEntry, RawContextSection } from "@/lib/workspace/types";

export type { RawContextEntry, RawContextSection };

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

function isOpenDeal(deal: Deal): boolean {
  return deal.stage !== "won" && deal.stage !== "lost";
}

export function resolveCompanyContext(
  contacts: Contact[],
  deals: Deal[],
  activities: WorkspaceActivity[],
  notes: { id: string; title: string; created_at: string }[],
): RawContextSection[] {
  const sections: RawContextSection[] = [];

  // ── KEY CONTACTS ──────────────────────────────────────────────
  const topContacts = contacts.slice(0, 3);
  if (topContacts.length > 0) {
    sections.push({
      id: "relationships",
      titleKey: "contextSectionContacts",
      iconKey: "relationships",
      entries: topContacts.map((contact): RawContextEntry => ({
        id: contact.id,
        labelKey: "contextLabelContact",
        primary: contact.name,
        secondary: contact.email ?? undefined,
        href: `/dashboard/crm/${contact.id}`,
      })),
    });
  }

  // ── ACTIVE DEALS ──────────────────────────────────────────────
  const openDeals = deals.filter(isOpenDeal).slice(0, 3);
  if (openDeals.length > 0) {
    sections.push({
      id: "deals",
      titleKey: "contextSectionDeals",
      iconKey: "deals",
      entries: openDeals.map((deal): RawContextEntry => ({
        id: deal.id,
        primary: deal.title,
        secondary: deal.stage,
        href: `/dashboard/deals/${deal.id}`,
        metaRaw: deal.value ? `$${Number(deal.value).toLocaleString()}` : undefined,
      })),
    });
  }

  // ── RECENT NOTES ──────────────────────────────────────────────
  const topNotes = notes.slice(0, 3);
  if (topNotes.length > 0) {
    sections.push({
      id: "notes",
      titleKey: "contextSectionNotes",
      iconKey: "notes",
      entries: topNotes.map((note): RawContextEntry => ({
        id: note.id,
        primary: note.title,
        metaRaw: shortDate(note.created_at),
      })),
    });
  }

  // ── LAST MEETING ──────────────────────────────────────────────
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

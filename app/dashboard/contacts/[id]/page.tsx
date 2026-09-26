import { notFound } from "next/navigation";
import { getContact } from "@/server/actions/crm/getContact";
import { getContactDeals } from "@/server/actions/crm/getContactDeals";
import { getContactTasks } from "@/server/actions/crm/getContactTasks";
import { getContactActivity } from "@/server/actions/crm/getContactActivity";
import { getContactNotes } from "@/server/actions/crm/getContactNotes";
import { getContactEmails } from "@/server/actions/crm/getContactEmails";
import { getTags } from "@/server/actions/tags/getTags";
import { getEntityTags } from "@/server/actions/tags/getEntityTags";
import { getAttachments } from "@/server/actions/attachments/getAttachments";
import { getTeams } from "@/server/actions/organization/getTeams";
import { getWorkspaceMembers } from "@/server/actions/workspace/getWorkspaceMembers";
import { getContactOrders } from "@/server/actions/crm/getContactOrders";
import { getContactUpcomingMeetings } from "@/server/actions/calendar/getContactUpcomingMeetings";
import { getCalendarConnections } from "@/server/actions/calendar/getCalendarConnections";
import { getEntityBusinessMemories } from "@/server/actions/memory/getEntityBusinessMemories";
import ContactDetailView from "@/components/contacts/detail/ContactDetailView";
import type { WorkspaceMember } from "@/types/task";
import { Suspense } from "react";
import NextActionCard from "@/components/ai/NextActionCard";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContactDetailPage({ params }: Props) {
  const { id: contactId } = await params;

  const [contact, deals, tasks, activities, notes, emails, allTags, entityTags, attachments, teams, members, orders] = await Promise.all([
    getContact(contactId),
    getContactDeals(contactId),
    getContactTasks(contactId),
    getContactActivity(contactId),
    getContactNotes(contactId),
    getContactEmails(contactId),
    getTags(),
    getEntityTags("contact", contactId),
    getAttachments("contact", contactId),
    getTeams(),
    getWorkspaceMembers(),
    getContactOrders(contactId),
  ]);

  if (!contact) notFound();

  const [upcomingMeetings, businessMemories, calendarConnections] = await Promise.all([
    getContactUpcomingMeetings(contactId, contact.email ?? null),
    getEntityBusinessMemories("contact", contactId, 4),
    getCalendarConnections(),
  ]);

  return (
    <div className="space-y-4">
      <Suspense fallback={null}>
        <NextActionCard entityType="contact" entityId={contactId} />
      </Suspense>
      <ContactDetailView
        contact={contact}
      deals={deals}
      tasks={tasks}
      activities={activities}
      notes={notes}
      emails={emails}
      allTags={allTags}
      entityTags={entityTags}
      attachments={attachments}
      teams={teams}
      members={members as unknown as WorkspaceMember[]}
      orders={orders}
      upcomingMeetings={upcomingMeetings}
      hasCalendar={calendarConnections.length > 0}
      businessMemories={businessMemories}
      />
    </div>
  );
}

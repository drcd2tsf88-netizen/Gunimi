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
import ContactDetailView from "@/components/contacts/detail/ContactDetailView";
import type { WorkspaceMember } from "@/types/task";

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

  const upcomingMeetings = await getContactUpcomingMeetings(contact.email ?? null);

  return (
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
    />
  );
}

import { notFound } from "next/navigation";
import { getContact } from "@/server/actions/crm/getContact";
import { getContactDeals } from "@/server/actions/crm/getContactDeals";
import { getContactTasks } from "@/server/actions/crm/getContactTasks";
import { getContactActivity } from "@/server/actions/crm/getContactActivity";
import { getContactNotes } from "@/server/actions/crm/getContactNotes";
import { getContactEmails } from "@/server/actions/crm/getContactEmails";
import ContactDetailView from "@/components/contacts/detail/ContactDetailView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContactDetailPage({ params }: Props) {
  const { id: contactId } = await params;

  const [contact, deals, tasks, activities, notes, emails] = await Promise.all([
    getContact(contactId),
    getContactDeals(contactId),
    getContactTasks(contactId),
    getContactActivity(contactId),
    getContactNotes(contactId),
    getContactEmails(contactId),
  ]);

  if (!contact) notFound();

  return (
    <ContactDetailView
      contact={contact}
      deals={deals}
      tasks={tasks}
      activities={activities}
      notes={notes}
      emails={emails}
    />
  );
}

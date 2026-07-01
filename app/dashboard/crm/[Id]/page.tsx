import { getTranslations } from "next-intl/server";
import { getContact } from "@/server/actions/crm/getContact";
import { getContactDeals } from "@/server/actions/crm/getContactDeals";
import { getContactTasks } from "@/server/actions/crm/getContactTasks";
import { getContactActivity } from "@/server/actions/crm/getContactActivity";
import { getContactNotes } from "@/server/actions/crm/getContactNotes";
import { getContactEmails } from "@/server/actions/crm/getContactEmails";

import ContactHeader from "@/components/contacts/detail/ContactHeader";
import ContactCompanyCard from "@/components/contacts/detail/ContactCompanyCard";
import ContactDeals from "@/components/contacts/detail/ContactDeals";
import ContactTasks from "@/components/contacts/detail/ContactTasks";
import ContactNotes from "@/components/contacts/detail/ContactNotes";
import ContactEmails from "@/components/contacts/detail/ContactEmails";
import ContactActivity from "@/components/contacts/detail/ContactActivity";
import ContactIntelligence from "@/components/contacts/detail/ContactIntelligence";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContactDetailPage({ params }: Props) {
  const t = await getTranslations("contacts");
  const { id: contactId } = await params;

  const [contact, deals, tasks, activity, notes, emails] = await Promise.all([
    getContact(contactId),
    getContactDeals(contactId),
    getContactTasks(contactId),
    getContactActivity(contactId),
    getContactNotes(contactId),
    getContactEmails(contactId),
  ]);

  if (!contact) {
    return <div className="p-8 text-white">{t("notFound")}</div>;
  }

  return (
    <div className="space-y-8">
      <ContactHeader contact={contact} />
      <ContactCompanyCard contact={contact} />
      <ContactDeals deals={deals} />
      <ContactTasks tasks={tasks} />
      <ContactNotes contact={contact} notes={notes} />
      <ContactEmails threads={emails} />
      <ContactActivity activity={activity} />
      <ContactIntelligence contact={contact} deals={deals} />
    </div>
  );
}

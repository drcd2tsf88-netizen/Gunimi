import { notFound } from "next/navigation";

import { getDeal } from "@/server/actions/deals/getDeal";
import { getCompanies } from "@/server/actions/company/getCompanies";
import { getContacts } from "@/server/actions/crm/getContacts";
import { getDealRelatedNotes } from "@/server/actions/deals/getDealRelatedNotes";
import { getDealRelatedTasks } from "@/server/actions/deals/getDealRelatedTasks";

import DealDetailView from "@/components/deals/detail/DealDetailView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DealPage({ params }: Props) {
  const { id } = await params;

  const dealData = await getDeal(id);
  if (!dealData) notFound();

  const companyId = dealData.deal.company?.id ?? null;
  const contactId = dealData.deal.contact?.id ?? null;

  const [companies, contacts, notes, tasks] = await Promise.all([
    getCompanies(),
    getContacts(),
    getDealRelatedNotes(companyId, contactId),
    getDealRelatedTasks(contactId),
  ]);

  return (
    <DealDetailView
      deal={dealData.deal}
      activities={dealData.activities}
      companies={companies}
      contacts={contacts}
      notes={notes}
      tasks={tasks}
    />
  );
}

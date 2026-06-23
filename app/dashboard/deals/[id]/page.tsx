import { notFound } from "next/navigation";

import { getDeal } from "@/server/actions/deals/getDeal";
import { getCompanies } from "@/server/actions/company/getCompanies";
import { getContacts } from "@/server/actions/crm/getContacts";

import DealDetailView from "@/components/deals/detail/DealDetailView";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DealPage({ params }: Props) {
  const { id } = await params;

  const [data, companies, contacts] = await Promise.all([
    getDeal(id),
    getCompanies(),
    getContacts(),
  ]);

  if (!data) {
    notFound();
  }

  return (
    <DealDetailView
      deal={data.deal}
      activities={data.activities}
      companies={companies}
      contacts={contacts}
    />
  );
}

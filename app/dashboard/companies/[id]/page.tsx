import { notFound } from "next/navigation";

import { getCompany } from "@/server/actions/company/getCompany";
import { getCompanyContacts } from "@/server/actions/company/getCompanyContacts";
import { getCompanyDeals } from "@/server/actions/company/getCompanyDeals";
import { getCompanyActivity } from "@/server/actions/company/getCompanyActivity";
import { getCompanyNotes } from "@/server/actions/company/getCompanyNotes";
import { getCompanyEmails } from "@/server/actions/company/getCompanyEmails";

import CompanyDetailView from "@/components/company/detail/CompanyDetailView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CompanyPage({ params }: Props) {
  const { id: companyId } = await params;

  const [company, contacts, deals, activity, notes, emails] = await Promise.all([
    getCompany(companyId),
    getCompanyContacts(companyId),
    getCompanyDeals(companyId),
    getCompanyActivity(companyId),
    getCompanyNotes(companyId),
    getCompanyEmails(companyId),
  ]);

  if (!company) notFound();

  return (
    <CompanyDetailView
      company={company}
      contacts={contacts}
      deals={deals}
      activities={activity}
      notes={notes}
      emails={emails}
    />
  );
}

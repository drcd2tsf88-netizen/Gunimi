import { getCompany } from "@/server/actions/company/getCompany";
import { getCompanyContacts } from "@/server/actions/company/getCompanyContacts";
import { getCompanyDeals } from "@/server/actions/company/getCompanyDeals";
import { getCompanyActivity } from "@/server/actions/company/getCompanyActivity";
import { getCompanyNotes } from "@/server/actions/company/getCompanyNotes";
import { getCompanyEmails } from "@/server/actions/company/getCompanyEmails";
import { getTranslations } from "next-intl/server";

import OrbitBreadcrumbs from "@/components/ui/OrbitBreadcrumbs";
import CompanyHero from "@/components/company/CompanyHero";
import CompanyMetrics from "@/components/company/CompanyMetrics";
import CompanyContacts from "@/components/company/CompanyContacts";
import CompanyDeals from "@/components/company/CompanyDeals";
import CompanyNotes from "@/components/company/CompanyNotes";
import CompanyEmails from "@/components/company/CompanyEmails";
import CompanyActivity from "@/components/company/CompanyActivity";
import CompanyIntelligence from "@/components/company/CompanyIntelligence";
import EntityMemoryPanel from "@/components/memory/EntityMemoryPanel";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CompanyPage({ params }: Props) {
  const t = await getTranslations("companies");
  const { id: companyId } = await params;

  const [company, contacts, deals, activity, notes, emails] = await Promise.all([
    getCompany(companyId),
    getCompanyContacts(companyId),
    getCompanyDeals(companyId),
    getCompanyActivity(companyId),
    getCompanyNotes(companyId),
    getCompanyEmails(companyId),
  ]);

  if (!company) {
    return <div className="p-8 text-white">{t("notFound")}</div>;
  }

  return (
    <div className="space-y-8">
      <OrbitBreadcrumbs
        items={[
          { label: t("breadcrumbCompanies"), href: "/dashboard/companies" },
          { label: company.name },
        ]}
      />
      <CompanyHero company={company} />
      <CompanyMetrics company={company} contacts={contacts} deals={deals} />
      <CompanyContacts contacts={contacts} />
      <CompanyDeals deals={deals} />
      <CompanyNotes notes={notes} />
      <CompanyEmails threads={emails} />
      <CompanyActivity activity={activity} />
      <EntityMemoryPanel activities={activity} />
      <CompanyIntelligence company={company} deals={deals} contacts={contacts} />
    </div>
  );
}

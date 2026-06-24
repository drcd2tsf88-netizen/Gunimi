import {
  getCompany,
} from "@/server/actions/company/getCompany";

import {
  getCompanyContacts,
} from "@/server/actions/company/getCompanyContacts";

import {
  getCompanyDeals,
} from "@/server/actions/company/getCompanyDeals";

import {
  getCompanyActivity,
} from "@/server/actions/company/getCompanyActivity";

import { getTranslations }
from "next-intl/server";

import CompanyHero
from "@/components/company/CompanyHero";

import CompanyMetrics
from "@/components/company/CompanyMetrics";

import CompanyContacts
from "@/components/company/CompanyContacts";

import CompanyDeals
from "@/components/company/CompanyDeals";

import CompanyActivity
from "@/components/company/CompanyActivity";

import CompanyIntelligence
from "@/components/company/CompanyIntelligence";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CompanyPage({
  params,
}: Props) {
  const t = await getTranslations("companies");

  const { id: companyId } =
    await params;

  const [
    company,
    contacts,
    deals,
    activity,
  ] = await Promise.all([
    getCompany(
      companyId
    ),

    getCompanyContacts(
      companyId
    ),

    getCompanyDeals(
      companyId
    ),

    getCompanyActivity(
      companyId
    ),
  ]);

  if (!company) {
    return (
      <div
        className="
          p-8
          text-white
        "
      >
        {t("notFound")}
      </div>
    );
  }

  return (
    <div
      className="
        space-y-8
      "
    >
      <CompanyHero
        company={company}
      />

      <CompanyMetrics
        company={company}
        contacts={contacts}
        deals={deals}
      />

      <CompanyContacts
        contacts={contacts}
      />

      <CompanyDeals
        deals={deals}
      />

      <CompanyActivity
        activity={activity}
      />

      <CompanyIntelligence
        company={company}
        deals={deals}
        contacts={contacts}
      />
    </div>
  );
}

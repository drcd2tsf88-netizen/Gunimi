import CompaniesHero
from "@/components/company/CompaniesHero";

import CompaniesMetrics
from "@/components/company/CompaniesMetrics";

import CompaniesGrid
from "@/components/company/CompaniesGrid";

import { getCompanies }
from "@/server/actions/company/getCompanies";

export default async function CompaniesPage() {
  const companies =
    await getCompanies();

  return (
    <main
      className="
        space-y-8
      "
    >
      <CompaniesHero />

      <CompaniesMetrics
        companies={companies}
      />

      <CompaniesGrid
        companies={companies}
      />
    </main>
  );
}
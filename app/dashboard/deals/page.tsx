import {
  getDeals,
} from "@/server/actions/deals/getDeals";

import {
  getCompanies,
} from "@/server/actions/company/getCompanies";

import {
  getContacts,
} from "@/server/actions/crm/getContacts";

import DealsPageView
from "@/components/deals/DealsPageView";

export default async function DealsPage() {
  const [
    deals,
    companies,
    contacts,
  ] = await Promise.all([
    getDeals(),
    getCompanies(),
    getContacts(),
  ]);

  return (
    <DealsPageView
      deals={deals}
      companies={companies}
      contacts={contacts}
    />
  );
}
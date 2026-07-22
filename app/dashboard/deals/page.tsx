import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getDeals } from "@/server/actions/deals/getDeals";
import { getCompanies } from "@/server/actions/company/getCompanies";
import { getContacts } from "@/server/actions/crm/getContacts";
import DealsPageView from "@/components/deals/DealsPageView";
import PageLoadingSkeleton from "@/components/ui/PageLoadingSkeleton";

export async function generateMetadata() {
  const t = await getTranslations("deals");
  return { title: t("pageTitle") };
}

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
    <Suspense fallback={<PageLoadingSkeleton variant="list" />}>
      <DealsPageView
        deals={deals}
        companies={companies}
        contacts={contacts}
      />
    </Suspense>
  );
}

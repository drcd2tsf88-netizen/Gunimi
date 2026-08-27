import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getOrders } from "@/server/actions/orders/getOrders";
import { getCompanies } from "@/server/actions/company/getCompanies";
import { getContacts } from "@/server/actions/crm/getContacts";
import { getDeals } from "@/server/actions/deals/getDeals";
import OrdersPageView from "@/components/orders/OrdersPageView";
import PageLoadingSkeleton from "@/components/ui/PageLoadingSkeleton";

export async function generateMetadata() {
  const t = await getTranslations("orders");
  return { title: t("pageTitle") };
}

export default async function OrdersPage() {
  const [orders, companies, contacts, deals] = await Promise.all([
    getOrders(),
    getCompanies(),
    getContacts(),
    getDeals(),
  ]);

  return (
    <Suspense fallback={<PageLoadingSkeleton variant="list" />}>
      <OrdersPageView orders={orders} companies={companies} contacts={contacts} deals={deals} />
    </Suspense>
  );
}

import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getOrder } from "@/server/actions/orders/getOrder";
import { getCompanies } from "@/server/actions/company/getCompanies";
import { getContacts } from "@/server/actions/crm/getContacts";
import { getDeals } from "@/server/actions/deals/getDeals";
import { getTeams } from "@/server/actions/organization/getTeams";
import { getWorkspaceMembers } from "@/server/actions/workspace/getWorkspaceMembers";
import { getOrderAssignee } from "@/server/actions/orders/getOrderAssignee";
import OrderDetailView from "@/components/orders/OrderDetailView";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations("orders");
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return { title: t("pageTitle") };
  return { title: `${order.number} · ${order.title}` };
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params;

  const order = await getOrder(id);
  if (!order) notFound();

  const [companies, contacts, deals, teams, rawMembers, initialAssignee] = await Promise.all([
    getCompanies(),
    getContacts(),
    getDeals(),
    getTeams(),
    getWorkspaceMembers(),
    getOrderAssignee(id),
  ]);

  type ProfileShape = { full_name: string | null; email: string };
  const members = rawMembers.map((m) => {
    const profile = Array.isArray(m.profiles)
      ? (m.profiles[0] as ProfileShape | undefined)
      : (m.profiles as ProfileShape | null);
    return {
      user_id: m.user_id,
      full_name: profile?.full_name ?? null,
      email: profile?.email ?? "",
    };
  });

  return (
    <OrderDetailView
      order={order}
      companies={companies}
      contacts={contacts}
      deals={deals}
      teams={teams}
      members={members}
      initialAssignee={initialAssignee}
    />
  );
}

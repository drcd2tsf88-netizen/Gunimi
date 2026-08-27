"use client";

import { useTranslations } from "next-intl";
import GunimiWorkspaceTabs from "@/components/ui/GunimiWorkspaceTabs";
import type { WorkspaceTab } from "@/components/ui/GunimiWorkspaceTabs";
import ResponsibilitiesPanel from "@/components/organization/ResponsibilitiesPanel";
import OrderHeader from "./OrderHeader";
import OrderItemsTab from "./OrderItemsTab";
import WorkspaceTimeline from "@/components/timeline/WorkspaceTimeline";
import type { Order } from "@/types/order";
import type { Company } from "@/types/company";
import type { Contact } from "@/types/contact";
import type { Deal } from "@/types/deal";
import type { WorkspaceTeam } from "@/types/organization";
import type { OrderAssignee } from "@/server/actions/orders/getOrderAssignee";

type WorkspaceMemberFlat = {
  user_id: string;
  full_name: string | null;
  email: string;
};

type Props = {
  order: Order;
  companies: Company[];
  contacts: Contact[];
  deals: Deal[];
  teams: WorkspaceTeam[];
  members: WorkspaceMemberFlat[];
  initialAssignee: OrderAssignee | null;
};

export default function OrderDetailView({ order, companies, contacts, deals, teams, members, initialAssignee }: Props) {
  const t = useTranslations("orders");

  const tabs: WorkspaceTab[] = [
    {
      id: "items",
      label: t("tabs.items"),
      content: <OrderItemsTab order={order} />,
    },
    {
      id: "activity",
      label: t("tabs.activity"),
      content: <WorkspaceTimeline />,
    },
    {
      id: "assignments",
      label: t("tabs.assignments"),
      content: (
        <ResponsibilitiesPanel
          entityType="order"
          entityId={order.id}
          teams={teams}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <OrderHeader order={order} companies={companies} contacts={contacts} deals={deals} members={members} initialAssignee={initialAssignee} />
      <GunimiWorkspaceTabs tabs={tabs} defaultTab="items" />
    </div>
  );
}

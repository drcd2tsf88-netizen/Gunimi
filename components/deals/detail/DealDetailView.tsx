"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import DealHeader from "./DealHeader";
import DealSidebar from "./DealSidebar";
import DealActivity from "./DealActivity";
import EditDealSheet from "@/components/deals/EditDealSheet";

import { Deal } from "@/types/deal";
import { WorkspaceActivity } from "@/types/activity";
import { Company } from "@/types/company";
import { Contact } from "@/types/contact";

type Props = {
  deal: Deal;
  activities: WorkspaceActivity[];
  companies: Company[];
  contacts: Contact[];
};

export default function DealDetailView({
  deal,
  activities,
  companies,
  contacts,
}: Props) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <DealHeader deal={deal} onEdit={() => setEditOpen(true)} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DealActivity activities={activities} />
        </div>

        <div>
          <DealSidebar deal={deal} />
        </div>
      </div>

      <EditDealSheet
        key={deal.id}
        deal={deal}
        open={editOpen}
        onOpenChange={setEditOpen}
        companies={companies}
        contacts={contacts}
        onUpdated={() => router.refresh()}
        onDeleted={() => router.push("/dashboard/deals")}
      />
    </div>
  );
}

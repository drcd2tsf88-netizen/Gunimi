"use client";

import DealHeader from "./DealHeader";
import DealSidebar from "./DealSidebar";
import DealActivity from "./DealActivity";

import { Deal } from "@/types/deal";
import { WorkspaceActivity } from "@/types/activity";

type Props = {
  deal: Deal;
  activities: WorkspaceActivity[];
};

export default function DealDetailView({ deal, activities }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <DealHeader deal={deal} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DealActivity activities={activities} />
        </div>

        <div>
          <DealSidebar deal={deal} />
        </div>
      </div>
    </div>
  );
}

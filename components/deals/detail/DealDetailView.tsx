"use client";

import DealHeader
from "./DealHeader";

import DealMetrics
from "./DealMetrics";

import DealOverview
from "./DealOverview";

import DealRelations
from "./DealRelations";

import DealActivity
from "./DealActivity";

import { Deal } from "@/types/deal";
import { WorkspaceActivity } from "@/types/activity";

type Props = {
  deal: Deal;
  activities: WorkspaceActivity[];
};

export default function DealDetailView({
  deal,
  activities,
}: Props) {
  return (
    <div
      className="
        space-y-6
      "
    >
      <DealHeader
        deal={deal}
      />

      <DealMetrics
        deal={deal}
      />

      <div
        className="
          grid
          gap-6

          xl:grid-cols-3
        "
      >
        <div
          className="
            space-y-6

            xl:col-span-2
          "
        >
          <DealOverview
            deal={deal}
          />

          <DealActivity
            activities={
              activities
            }
          />
        </div>

        <div
          className="
            space-y-6
          "
        >
          <DealRelations
            deal={deal}
          />
        </div>
      </div>
    </div>
  );
}
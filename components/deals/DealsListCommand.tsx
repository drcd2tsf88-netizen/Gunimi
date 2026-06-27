"use client";

import { useState } from "react";

import DealsStagePicker from "./DealsStagePicker";
import DealsListView from "./DealsListView";

import { Deal } from "@/types/deal";

export type DealStage =
  | "lead"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

type Props = {
  deals: Deal[];
  onEdit: (deal: Deal) => void;
  initialStage?: DealStage;
};

export default function DealsListCommand({ deals, onEdit, initialStage }: Props) {
  const [activeStage, setActiveStage] =
    useState<DealStage>(initialStage ?? "lead");

  const stageDeals = deals.filter(
    (d) => d.stage === activeStage
  );

  return (
    <div
      className="
        flex

        min-h-[520px]

        overflow-hidden

        rounded-2xl

        border
        border-white/[0.08]

        bg-white/[0.02]
      "
    >
      {/* STAGE PICKER */}

      <div
        className="
          w-52
          shrink-0

          border-r
          border-white/[0.06]

          p-4
        "
      >
        <DealsStagePicker
          deals={deals}
          selected={activeStage}
          onSelect={setActiveStage}
        />
      </div>

      {/* DEAL LIST */}

      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
        "
      >
        <DealsListView
          deals={stageDeals}
          stage={activeStage}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
}

"use client";

import { LucideIcon } from "lucide-react";
import GunimiCard from "@/components/ui/GunimiCard";

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
};

export default function GunimiMetricCard({ label, value, icon: Icon }: Props) {
  return (
    <GunimiCard className="p-5">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#9AA3B2]/55">
          {label}
        </p>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#6D5BFF]/[0.10] text-[#8B7DFF]">
          <Icon size={13} strokeWidth={1.75} />
        </div>
      </div>

      {/* VALUE — numbers dominate */}
      <h3 className="mt-4 text-[36px] font-bold leading-none tracking-[-0.05em] text-[#F7F8FC]">
        {value}
      </h3>
    </GunimiCard>
  );
}

"use client";

import { LucideIcon }
from "lucide-react";

import OrbitCard
from "@/components/ui/OrbitCard";

type Props = {
  label: string;

  value:
    | string
    | number;

  icon: LucideIcon;
};

export default function OrbitMetricCard({
  label,
  value,
  icon: Icon,
}: Props) {
  return (
    <OrbitCard
      className="
        p-5
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <p
          className="
            text-sm
            text-white/50
          "
        >
          {label}
        </p>

        <Icon
          size={18}
          className="
            text-violet-300
          "
        />
      </div>

      <h3
        className="
          mt-4

          text-2xl
          font-semibold
        "
      >
        {value}
      </h3>
    </OrbitCard>
  );
}
"use client";

import { LucideIcon } from "lucide-react";

import GunimiSection
from "@/components/layout/GunimiSection";

import GunimiStatCard
from "@/components/ui/GunimiStatCard";

import GunimiMetricCard
from "@/components/ui/GunimiMetricCard";

export type OrbitMetricItem = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
};

type Props = {
  items: OrbitMetricItem[];
  variant?: "stat" | "metric";
  breakpoint?: "lg" | "xl";
};

export default function GunimiMetricGrid({
  items,
  variant = "stat",
  breakpoint = "xl",
}: Props) {
  const colClass =
    breakpoint === "lg"
      ? "md:grid-cols-2 lg:grid-cols-4"
      : "md:grid-cols-2 xl:grid-cols-4";

  return (
    <GunimiSection>
      <div className={`grid gap-4 ${colClass}`}>
        {items.map((item) =>
          variant === "stat" ? (
            <GunimiStatCard
              key={item.label}
              title={item.label}
              value={item.value}
              icon={item.icon}
              description={item.description}
            />
          ) : (
            <GunimiMetricCard
              key={item.label}
              label={item.label}
              value={item.value}
              icon={item.icon}
            />
          )
        )}
      </div>
    </GunimiSection>
  );
}

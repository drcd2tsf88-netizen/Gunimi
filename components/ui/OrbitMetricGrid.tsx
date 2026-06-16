"use client";

import { LucideIcon } from "lucide-react";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitStatCard
from "@/components/ui/OrbitStatCard";

import OrbitMetricCard
from "@/components/ui/OrbitMetricCard";

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

export default function OrbitMetricGrid({
  items,
  variant = "stat",
  breakpoint = "xl",
}: Props) {
  const colClass =
    breakpoint === "lg"
      ? "md:grid-cols-2 lg:grid-cols-4"
      : "md:grid-cols-2 xl:grid-cols-4";

  return (
    <OrbitSection>
      <div className={`grid gap-4 ${colClass}`}>
        {items.map((item) =>
          variant === "stat" ? (
            <OrbitStatCard
              key={item.label}
              title={item.label}
              value={item.value}
              icon={item.icon}
              description={item.description}
            />
          ) : (
            <OrbitMetricCard
              key={item.label}
              label={item.label}
              value={item.value}
              icon={item.icon}
            />
          )
        )}
      </div>
    </OrbitSection>
  );
}

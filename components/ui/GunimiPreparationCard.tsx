"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import GunimiCard from "@/components/ui/GunimiCard";

export type PreparationItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  secondary?: string;
};

type Props = {
  label: string;
  items: PreparationItem[];
};

export default function GunimiPreparationCard({ label, items }: Props) {
  return (
    <GunimiCard className="p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>

      <div className="mt-4 space-y-3.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={`${item.label}:${item.value}`} className="flex items-start gap-3">
              <Icon size={13} className="mt-0.5 shrink-0 text-white/30" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                  {item.label}
                </p>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="mt-0.5 block truncate text-sm font-medium text-white/80 transition-colors hover:text-violet-300"
                  >
                    {item.value}
                  </Link>
                ) : (
                  <p className="mt-0.5 truncate text-sm font-medium text-white/80">
                    {item.value}
                  </p>
                )}
                {item.secondary && (
                  <p className="mt-0.5 truncate text-xs text-white/40">{item.secondary}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </GunimiCard>
  );
}

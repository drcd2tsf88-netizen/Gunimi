"use client";

import type { LucideIcon } from "lucide-react";
import { CornerDownLeft } from "lucide-react";
import { CommandItem } from "cmdk";

interface PanelSubmitItemProps {
  value: string;
  title: string;
  hint: string;
  badgeLabel: string;
  icon: LucideIcon;
  onSubmit: () => void;
}

export function PanelSubmitItem({
  value,
  title,
  hint,
  badgeLabel,
  icon: Icon,
  onSubmit,
}: PanelSubmitItemProps) {
  return (
    <CommandItem
      value={value}
      onSelect={onSubmit}
      className="
        group
        mb-2
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-transparent
        bg-transparent
        px-4
        py-4
        text-white
        transition-all
        duration-300
        hover:border-white/10
        hover:bg-white/[0.04]
        data-[selected=true]:border-violet-500/20
        data-[selected=true]:bg-violet-500/10
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            transition-all
            duration-300
            group-hover:border-violet-500/20
            group-hover:bg-violet-500/10
          "
        >
          <Icon className="h-5 w-5 text-zinc-300" />
        </div>

        <div>
          <p className="font-medium text-white">{title}</p>
          <p className="mt-1 text-sm text-zinc-500">{hint}</p>
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="
          flex
          items-center
          gap-1
          rounded-lg
          border
          border-white/10
          bg-white/[0.03]
          px-2
          py-1
          text-xs
          text-zinc-500
        "
      >
        <CornerDownLeft className="h-3 w-3" />
        {badgeLabel}
      </div>
    </CommandItem>
  );
}

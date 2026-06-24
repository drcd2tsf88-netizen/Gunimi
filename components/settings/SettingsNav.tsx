"use client";

import { Building2, Shield, Sliders, User, Users } from "lucide-react";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export type SettingsSection = "workspace" | "members" | "preferences" | "profile" | "danger";

const NAV_ITEMS: { id: SettingsSection; icon: typeof Building2 }[] = [
  { id: "workspace", icon: Building2 },
  { id: "members", icon: Users },
  { id: "preferences", icon: Sliders },
  { id: "profile", icon: User },
  { id: "danger", icon: Shield },
];

type Props = {
  active: SettingsSection;
  onChange: (section: SettingsSection) => void;
};

export default function SettingsNav({ active, onChange }: Props) {
  const t = useTranslations("settings");

  return (
    <>
      {/* DESKTOP: vertical sidebar */}
      <nav className="hidden w-52 shrink-0 md:block">
        <div className="space-y-0.5">
          {NAV_ITEMS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={cn(
                `flex w-full items-center gap-3 rounded-xl px-3 py-2.5
                 text-sm font-medium transition-all`,
                id === "danger"
                  ? active === "danger"
                    ? "bg-red-500/10 text-red-300"
                    : "text-white/40 hover:bg-white/[0.04] hover:text-red-300/70"
                  : active === id
                    ? "bg-white/[0.08] text-white"
                    : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
              )}
            >
              <Icon size={15} className="shrink-0" />
              {t(`nav_${id}`)}
            </button>
          ))}
        </div>
      </nav>

      {/* MOBILE: horizontal scroll tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 md:hidden">
        {NAV_ITEMS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              `flex shrink-0 items-center gap-2 rounded-xl px-3 py-2
               text-xs font-medium transition-all`,
              id === "danger"
                ? active === "danger"
                  ? "bg-red-500/10 text-red-300"
                  : "text-white/40 hover:text-red-300/70"
                : active === id
                  ? "bg-white/[0.08] text-white"
                  : "text-white/40 hover:text-white/70"
            )}
          >
            <Icon size={13} className="shrink-0" />
            {t(`nav_${id}`)}
          </button>
        ))}
      </div>
    </>
  );
}

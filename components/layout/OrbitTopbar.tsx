"use client";

import { Menu, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import OrbitTeamPresence    from "@/components/layout/OrbitTeamPresence";
import OrbitNotifications   from "@/components/layout/OrbitNotifications";
import OrbitProfileDropdown from "@/components/layout/OrbitProfileDropdown";

import { useOrbitCommandStore } from "@/lib/store/orbit-command-store";

type OrbitTopbarProps = {
  mobileOpen:    boolean;
  setMobileOpen: (value: boolean) => void;
};

// ─────────────────────────────────────────────────────────────
// OrbitTopbar — Minimal, almost invisible.
// The product should speak, not the chrome.
// ─────────────────────────────────────────────────────────────

export default function OrbitTopbar({ mobileOpen, setMobileOpen }: OrbitTopbarProps) {
  const t      = useTranslations("command");
  const { setOpen } = useOrbitCommandStore();

  return (
    <header
      className="
        sticky top-0 z-topbar
        border-b border-white/[0.04]
        bg-[#05060A]/80
        backdrop-blur-[18px]
      "
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 lg:px-5">

        {/* LEFT */}
        <div className="flex flex-1 items-center gap-3">

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t("toggleNavigation")}
            className="
              flex h-11 w-11 shrink-0 items-center justify-center
              rounded-lg
              border border-white/[0.06] bg-white/[0.02]
              text-[#9AA3B2]/60
              transition-all duration-[220ms]
              hover:border-white/[0.10] hover:text-white/80
              lg:hidden
            "
          >
            <Menu size={16} strokeWidth={1.75} />
          </button>

          {/* Command search */}
          <button
            onClick={() => setOpen(true)}
            aria-label={t("topbarPlaceholder")}
            className="
              relative hidden h-10 w-full max-w-[340px] items-center
              rounded-[10px]
              border border-white/[0.05]
              bg-white/[0.02]
              pl-10 pr-12
              text-left
              transition-all duration-[220ms]
              hover:border-white/[0.09] hover:bg-white/[0.035]
              md:flex
            "
          >
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA3B2]/40"
            />

            <span className="text-[13px] text-[#9AA3B2]/40">
              {t("topbarPlaceholder")}
            </span>

            <div
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                rounded-[5px]
                border border-white/[0.07]
                bg-white/[0.025]
                px-1.5 py-0.5
                text-[9px] font-medium text-[#9AA3B2]/45
              "
            >
              ⌘K
            </div>
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1.5">
          <OrbitTeamPresence />
          <OrbitNotifications />
          <OrbitProfileDropdown />
        </div>

      </div>
    </header>
  );
}

"use client";

import {
  Menu,
  Search,
} from "lucide-react";

import { useTranslations } from "next-intl";

import OrbitTeamPresence
from "@/components/layout/OrbitTeamPresence";

import OrbitNotifications
from "@/components/layout/OrbitNotifications";

import OrbitProfileDropdown
from "@/components/layout/OrbitProfileDropdown";

import OrbitAIStatus
from "../ai/OrbitAIStatus";

import { useOrbitCommandStore }
from "@/lib/store/orbit-command-store";

type OrbitTopbarProps = {
  mobileOpen: boolean;

  setMobileOpen: (
    value: boolean
  ) => void;
};

export default function OrbitTopbar({
  mobileOpen,

  setMobileOpen,
}: OrbitTopbarProps) {
  const t = useTranslations("command");

  const {
    setOpen,
  } =
    useOrbitCommandStore();

  return (
    <header
      className="
        sticky
        top-0
        z-50

        border-b
        border-white/5

        bg-[#050816]/75

        backdrop-blur-2xl
      "
    >
      <div
        className="
          flex
          items-center
          justify-between

          gap-3

          px-4
          py-3

          lg:px-6
        "
      >
        {/* LEFT */}

        <div
          className="
            flex
            flex-1
            items-center

            gap-3
          "
        >
          {/* MOBILE */}

          <button
            onClick={() =>
              setMobileOpen(
                !mobileOpen
              )
            }
            className="
              flex
              h-10
              w-10

              shrink-0

              items-center
              justify-center

              rounded-xl

              border
              border-white/10

              bg-white/[0.03]

              text-white/70

              transition-all

              hover:border-white/20

              lg:hidden
            "
          >
            <Menu
              size={18}
            />
          </button>

          {/* COMMAND */}

          <button
            onClick={() =>
              setOpen(true)
            }
            className="
              relative

              hidden
              h-11
              w-full
              max-w-md

              items-center

              rounded-xl

              border
              border-white/10

              bg-white/[0.03]

              pl-11
              pr-4

              text-left

              transition-all

              hover:border-white/20
              hover:bg-white/[0.05]

              md:flex
            "
          >
            <Search
              size={16}
              className="
                absolute
                left-4
                top-1/2

                -translate-y-1/2

                text-white/30
              "
            />

            <span
              className="
                text-sm
                text-white/30
              "
            >
              {t("topbarPlaceholder")}
            </span>

            <div
              className="
                absolute
                right-3
                top-1/2

                -translate-y-1/2

                rounded-md

                border
                border-white/10

                bg-white/[0.03]

                px-1.5
                py-1

                text-[9px]
                text-white/40
              "
            >
              ⌘K
            </div>
          </button>
        </div>

        {/* RIGHT */}

        <div
          className="
            flex
            items-center

            gap-2
          "
        >
          <OrbitAIStatus />

          <OrbitTeamPresence />

          <OrbitNotifications />

          <OrbitProfileDropdown />
        </div>
      </div>
    </header>
  );
}
"use client";

import Link
from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  LayoutDashboard,
  CheckSquare,
  Users,
  FileText,
  Activity,
  Settings,
  Sparkles,
  X,
  MessageSquare,
} from "lucide-react";

const items = [
  {
    label:
      "Dashboard",

    href:
      "/dashboard",

    icon:
      LayoutDashboard,
  },

  {
    label:
      "Tasks",

    href:
      "/dashboard/tasks",

    icon:
      CheckSquare,
  },

  {
    label:
      "CRM",

    href:
      "/dashboard/crm",

    icon:
      Users,
  },

  {
    label:
      "Notes",

    href:
      "/dashboard/notes",

    icon:
      FileText,
  },

  {
    label:
      "Activity",

    href:
      "/dashboard/activity",

    icon:
      Activity,
  },

  {
    label:
      "Settings",

    href:
      "/dashboard/settings",

    icon:
      Settings,
  },
];

type OrbitSidebarProps = {
  mobileOpen: boolean;

  setMobileOpen: (
    value: boolean
  ) => void;
};

export default function OrbitSidebar({
  mobileOpen,

  setMobileOpen,
}: OrbitSidebarProps) {
  const pathname =
    usePathname();

  return (
    <>
      {/* MOBILE OVERLAY */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() =>
              setMobileOpen(
                false
              )
            }
            className="
              fixed
              inset-0
              z-40

              bg-black/60

              backdrop-blur-sm

              lg:hidden
            "
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50

          flex
          h-screen
          w-[240px]
          flex-col

          overflow-hidden

          border-r
          border-white/10

          bg-[#060816]/95

          backdrop-blur-3xl

          transition-transform
          duration-300

          lg:translate-x-0

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* GLOW */}

        <div
          className="
            pointer-events-none

            absolute
            inset-0

            bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.14),transparent_35%)]
          "
        />

        {/* HEADER */}

        <div
          className="
            relative
            z-10

            flex
            items-center
            justify-between

            border-b
            border-white/[0.06]

            px-5
            py-5
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                relative

                flex
                h-10
                w-10

                items-center
                justify-center

                rounded-2xl

                bg-gradient-to-br
                from-violet-500
                to-cyan-400

                shadow-[0_0_30px_rgba(124,58,237,0.25)]
              "
            >
              <Sparkles
                size={16}
                className="
                  text-white
                "
              />
            </div>

            <div>
              <h1
                className="
                  text-sm
                  font-semibold
                "
              >
                OrbitDesk
              </h1>

              <p
                className="
                  mt-0.5

                  text-[10px]
                  text-zinc-500
                "
              >
                AI Workspace OS
              </p>
            </div>
          </div>

          {/* MOBILE CLOSE */}

          <button
            onClick={() =>
              setMobileOpen(
                false
              )
            }
            className="
              flex
              h-8
              w-8

              items-center
              justify-center

              rounded-lg

              border
              border-white/10

              bg-white/[0.03]

              text-zinc-400

              lg:hidden
            "
          >
            <X
              size={14}
            />
          </button>
        </div>

        {/* NAVIGATION */}

        <div
          className="
            relative
            z-10

            flex-1

            overflow-y-auto

            px-3
            py-4
          "
        >
          <div
            className="
              space-y-1.5
            "
          >
            {items.map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  pathname ===
                  item.href;

                return (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    onClick={() =>
                      setMobileOpen(
                        false
                      )
                    }
                  >
                    <motion.div
                      whileHover={{
                        x: 2,
                      }}
                      className={`
                        group

                        flex
                        items-center
                        gap-3

                        rounded-2xl

                        px-3
                        py-3

                        transition-all

                        ${
                          active
                            ? `
                              border
                              border-violet-500/20

                              bg-violet-500/10

                              text-white
                            `
                            : `
                              border
                              border-transparent

                              text-zinc-400

                              hover:border-white/10
                              hover:bg-white/[0.03]
                              hover:text-white
                            `
                        }
                      `}
                    >
                      <div
                        className={`
                          flex
                          h-9
                          w-9

                          items-center
                          justify-center

                          rounded-xl

                          ${
                            active
                              ? `
                                bg-violet-500/10

                                text-violet-300
                              `
                              : `
                                bg-white/[0.03]

                                text-zinc-500
                              `
                          }
                        `}
                      >
                        <Icon
                          size={16}
                        />
                      </div>

                      <span
                        className="
                          text-sm
                          font-medium
                        "
                      >
                        {
                          item.label
                        }
                      </span>
                    </motion.div>
                  </Link>
                );
              }
            )}
          </div>
        </div>

        {/* FOOTER */}

        <div
          className="
            relative
            z-10

            border-t
            border-white/5

            space-y-3
            p-4
          "
        >
          {/* FEEDBACK */}

          <a
            href="mailto:feedback@orbitdesk.online"
            className="
              flex
              items-center
              gap-2.5

              rounded-xl

              border
              border-white/[0.06]

              bg-white/[0.02]

              px-3
              py-2.5

              text-xs
              text-zinc-500

              transition

              hover:border-white/10
              hover:bg-white/[0.05]
              hover:text-zinc-300
            "
          >
            <MessageSquare
              size={13}
              className="shrink-0"
            />
            <span>Send Feedback</span>
          </a>

          {/* ORBIT AI ACTIVE */}

          <div
            className="
              rounded-2xl

              border
              border-violet-500/20

              bg-violet-500/10

              p-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <div
                className="
                  h-2
                  w-2

                  animate-pulse

                  rounded-full

                  bg-emerald-400
                "
              />

              <p
                className="
                  text-xs
                  font-medium

                  text-violet-200
                "
              >
                Orbit AI Active
              </p>
            </div>

            <p
              className="
                mt-2

                text-[11px]
                leading-relaxed

                text-zinc-400
              "
            >
              Workspace cognition
              systems operational.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
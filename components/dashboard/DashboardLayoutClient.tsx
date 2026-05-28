"use client";

import Link
from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import OrbitCommand
from "@/components/command/OrbitCommand";

import OrbitTopbar
from "@/components/layout/OrbitTopbar";

import OrbitLoader
from "@/components/system/OrbitLoader";

import { supabase }
from "@/lib/supabase";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname =
    usePathname();

  const [loading, setLoading] =
    useState(true);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
    },

    {
      name: "CRM",
      href: "/dashboard/crm",
    },

    {
      name: "Tasks",
      href: "/dashboard/tasks",
    },

    {
      name: "Analytics",
      href:
        "/dashboard/analytics",
    },

    {
      name: "Activity",
      href:
        "/dashboard/activity",
    },

    {
      name: "AI Assistant",
      href: "/dashboard/ai",
    },

    {
      name: "Settings",
      href:
        "/dashboard/settings",
    },
  ];

  useEffect(() => {
    async function initialize() {
      try {
        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!session) {
          window.location.href =
            "/login";

          return;
        }

        const { data: profile } =
          await supabase
            .from("profiles")
            .select("platform_role, status")
            .eq("id", session.user.id)
            .single();

        if (profile?.status === "suspended") {
          await supabase.auth.signOut();
          window.location.href = "/login";
          return;
        }

        const role = profile?.platform_role || "user";
        const hasAccess =
          role === "beta" ||
          role === "team" ||
          role === "admin";

        if (!hasAccess) {
          window.location.href = "/waitlist";
          return;
        }

        setTimeout(() => {
          setLoading(false);
        }, 1200);
      } catch (error) {
        console.error(error);

        setLoading(false);
      }
    }

    initialize();
  }, []);

  if (loading) {
    return <OrbitLoader />;
  }

  return (
    <div
      className="
        flex
        min-h-screen

        bg-[#050816]

        text-white
      "
    >
      {/* SIDEBAR */}

      <aside
        className="
          hidden

          w-[280px]
          shrink-0

          border-r
          border-white/5

          bg-white/[0.02]

          backdrop-blur-2xl

          lg:flex
          lg:flex-col
        "
      >
        <div
          className="
            border-b
            border-white/5

            px-8
            py-8
          "
        >
          <h1
            className="
              text-2xl
              font-semibold
            "
          >
            OrbitDesk
          </h1>

          <p
            className="
              mt-2

              text-sm
              text-white/40
            "
          >
            AI Workspace OS
          </p>
        </div>

        <nav
          className="
            flex-1

            space-y-2

            px-4
            py-6
          "
        >
          {links.map((link) => {
            const active =
              pathname ===
              link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
              >
                <div
                  className={`
                    rounded-2xl

                    px-5
                    py-4

                    text-sm
                    font-medium

                    transition-all

                    ${
                      active
                        ? `
                          bg-violet-500/15
                          text-violet-200
                        `
                        : `
                          text-white/60
                          hover:bg-white/[0.03]
                          hover:text-white
                        `
                    }
                  `}
                >
                  {link.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div
          className="
            border-t
            border-white/5

            p-5
          "
        >
          <div
            className="
              rounded-2xl

              border
              border-violet-500/20

              bg-violet-500/10

              p-5
            "
          >
            <p
              className="
                text-sm
                text-violet-200
              "
            >
              Orbit AI systems
              operational
            </p>

            <div
              className="
                mt-4

                flex
                items-center
                gap-3
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
                  text-white/50
                "
              >
                Realtime sync active
              </p>
            </div>
          </div>
        </div>
      </aside>
      {/* MOBILE SIDEBAR */}

<AnimatePresence>
  {mobileOpen && (
    <>
      {/* OVERLAY */}

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
          setMobileOpen(false)
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

      {/* SIDEBAR */}

      <motion.aside
        initial={{
          x: -320,
        }}
        animate={{
          x: 0,
        }}
        exit={{
          x: -320,
        }}
        transition={{
          type: "spring",
          damping: 24,
        }}
        className="
          fixed
          left-0
          top-0
          z-50

          flex
          h-screen
          w-[280px]
          flex-col

          border-r
          border-white/10

          bg-[#050816]

          backdrop-blur-2xl

          lg:hidden
        "
      >
        {/* HEADER */}

        <div
          className="
            border-b
            border-white/5

            px-6
            py-8
          "
        >
          <h1
            className="
              text-2xl
              font-semibold
            "
          >
            OrbitDesk
          </h1>

          <p
            className="
              mt-2

              text-sm
              text-white/40
            "
          >
            AI Workspace OS
          </p>
        </div>

        {/* NAV */}

        <nav
          className="
            flex-1

            space-y-2

            px-4
            py-6
          "
        >
          {links.map((link) => {
            const active =
              pathname ===
              link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
              >
                <div
                  className={`
                    rounded-2xl

                    px-5
                    py-4

                    text-sm
                    font-medium

                    transition-all

                    ${
                      active
                        ? `
                          bg-violet-500/15
                          text-violet-200
                        `
                        : `
                          text-white/60
                          hover:bg-white/[0.03]
                          hover:text-white
                        `
                    }
                  `}
                >
                  {link.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}

        <div
          className="
            border-t
            border-white/5

            p-5
          "
        >
          <div
            className="
              rounded-2xl

              border
              border-violet-500/20

              bg-violet-500/10

              p-5
            "
          >
            <p
              className="
                text-sm
                text-violet-200
              "
            >
              Orbit AI systems
              operational
            </p>

            <div
              className="
                mt-4

                flex
                items-center
                gap-3
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
                  text-white/50
                "
              >
                Realtime sync active
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )}
</AnimatePresence>

      {/* MAIN */}

      <div
        className="
          flex
          min-h-screen
          flex-1
          flex-col
        "
      >
        <OrbitTopbar
          mobileOpen={
            mobileOpen
          }
          setMobileOpen={
            setMobileOpen
          }
        />

        <OrbitCommand />

        <AnimatePresence
          mode="wait"
        >
          <motion.main
            key={pathname}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.25,
            }}
            className="
              flex-1
            "
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}

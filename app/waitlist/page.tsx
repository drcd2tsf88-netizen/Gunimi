"use client";

import Link
from "next/link";

import {
  motion,
} from "framer-motion";

import {
  ArrowRight,
  Clock3,
  LogOut,
  Shield,
  Sparkles,
} from "lucide-react";

import {
  supabase,
} from "@/lib/supabase";

export default function WaitlistPage() {

  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href =
      "/login";
  }

  return (
    <main
      className="
        relative

        flex
        min-h-screen

        items-center
        justify-center

        overflow-hidden

        bg-[#050816]

        px-6

        text-white
      "
    >
      {/* BACKGROUND */}

      <div
        className="
          absolute
          inset-0

          overflow-hidden
        "
      >
        {/* ORB */}

        <div
          className="
            absolute
            left-[-180px]
            top-[-160px]

            h-[520px]
            w-[520px]

            rounded-full

            bg-violet-500/15

            blur-[180px]
          "
        />

        <div
          className="
            absolute
            bottom-[-200px]
            right-[-120px]

            h-[520px]
            w-[520px]

            rounded-full

            bg-cyan-500/10

            blur-[200px]
          "
        />

        {/* GRID */}

        <div
          className="
            absolute
            inset-0

            opacity-[0.03]

            [background-image:linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)]

            [background-size:80px_80px]
          "
        />

        {/* RADIAL */}

        <div
          className="
            absolute
            inset-0

            bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.08),transparent_60%)]
          "
        />
      </div>

      {/* CONTENT */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          relative
          z-10

          w-full
          max-w-3xl
        "
      >
        <div
          className="
            relative

            overflow-hidden

            rounded-[36px]

            border
            border-white/[0.08]

            bg-white/[0.035]

            p-10

            text-center

            backdrop-blur-3xl

            shadow-[0_0_120px_rgba(124,58,237,0.10)]
          "
        >
          {/* LIGHT */}

          <div
            className="
              absolute
              inset-x-0
              top-0

              h-px

              bg-gradient-to-r
              from-transparent
              via-white/20
              to-transparent
            "
          />

          {/* GLOW */}

          <div
            className="
              pointer-events-none

              absolute
              right-[-120px]
              top-[-120px]

              h-[260px]
              w-[260px]

              rounded-full

              bg-violet-500/10

              blur-[120px]
            "
          />

          {/* ICON */}

          <motion.div
            animate={{
              boxShadow: [
                "0 0 0px rgba(124,58,237,0)",

                "0 0 40px rgba(124,58,237,0.25)",

                "0 0 0px rgba(124,58,237,0)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="
              relative

              mx-auto

              flex
              h-24
              w-24

              items-center
              justify-center

              rounded-[30px]

              border
              border-violet-500/20

              bg-violet-500/10
            "
          >
            <motion.div
              animate={{
                scale: [
                  1,
                  1.4,
                  1,
                ],

                opacity: [
                  0.5,
                  0,
                  0.5,
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
              className="
                absolute

                h-10
                w-10

                rounded-full

                bg-violet-400/40
              "
            />

            <Clock3
              className="
                relative
                z-10

                h-10
                w-10

                text-violet-200
              "
            />
          </motion.div>

          {/* BADGE */}

          <div
            className="
              mt-8

              inline-flex
              items-center
              gap-2

              rounded-full

              border
              border-violet-500/20

              bg-violet-500/10

              px-4
              py-2

              text-[11px]
              uppercase

              tracking-[0.18em]

              text-violet-300
            "
          >
            <Sparkles
              size={12}
            />

            Orbit Closed Beta Access
          </div>

          {/* TITLE */}

          <h1
            className="
              mx-auto
              mt-8

              max-w-3xl

              text-5xl
              font-semibold
              leading-[1]

              tracking-[-0.04em]

              md:text-7xl
            "
          >
            Access
            <span
              className="
                bg-gradient-to-r
                from-violet-300
                via-white
                to-cyan-300

                bg-clip-text

                text-transparent
              "
            >
              {" "}
              Pending
            </span>
          </h1>

          {/* SUBTITLE */}

          <p
            className="
              mx-auto
              mt-8

              max-w-2xl

              text-lg
              leading-relaxed

              text-white/60
            "
          >
            Your Orbit identity has
            been successfully
            synchronized with the
            Orbit AI Operating System.

            <br />
            <br />

            Platform access is
            currently awaiting closed
            beta approval from the
            Orbit internal team.
          </p>

          {/* STATUS PANEL */}

          <div
            className="
              mt-12

              rounded-[28px]

              border
              border-cyan-500/10

              bg-cyan-500/[0.04]

              p-6

              backdrop-blur-xl
            "
          >
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-4

                md:flex-row
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14

                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-cyan-500/10

                  bg-cyan-500/5
                "
              >
                <Shield
                  className="
                    h-6
                    w-6

                    text-cyan-300
                  "
                />
              </div>

              <div>
                <h2
                  className="
                    text-xl
                    font-semibold

                    text-white
                  "
                >
                  Orbit Access Queue
                </h2>

                <p
                  className="
                    mt-2

                    text-sm
                    leading-relaxed

                    text-cyan-100/60
                  "
                >
                  Your account is now
                  securely registered
                  within the Orbit
                  infrastructure and
                  pending platform
                  activation.
                </p>
              </div>
            </div>
          </div>

          {/* ACTIONS */}

          <div
            className="
              mt-10

              flex
              flex-col
              justify-center
              gap-4

              sm:flex-row
            "
          >
            <Link
              href="/"
              className="
                group

                inline-flex
                items-center
                justify-center
                gap-2

                rounded-2xl

                border
                border-white/10

                bg-white/[0.03]

                px-6
                py-4

                text-sm
                font-medium

                text-white/70

                backdrop-blur-xl

                transition-all
                duration-300

                hover:border-white/20
                hover:bg-white/[0.05]
                hover:text-white
              "
            >
              Orbit Homepage

              <ArrowRight
                size={16}
              />
            </Link>

            <button
              onClick={handleLogout}
              className="
                inline-flex
                items-center
                justify-center
                gap-2

                rounded-2xl

                border
                border-red-500/10

                bg-red-500/[0.04]

                px-6
                py-4

                text-sm
                font-medium

                text-red-200

                transition-all
                duration-300

                hover:border-red-500/20
                hover:bg-red-500/[0.08]
              "
            >
              <LogOut
                size={16}
              />

              Logout
            </button>
          </div>

          {/* FOOTER */}

          <div
            className="
              mt-12

              border-t
              border-white/[0.06]

              pt-6

              text-sm
              leading-relaxed

              text-zinc-500
            "
          >
            Orbit AI Operating System
            closed beta infrastructure
            is currently onboarding
            selected companies,
            operators and internal
            collaborators.
          </div>
        </div>
      </motion.div>
    </main>
  );
}
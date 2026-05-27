"use client";

import Link
from "next/link";

import {
  motion,
} from "framer-motion";

import {
  ArrowRight,
  Brain,
  Shield,
  Sparkles,
} from "lucide-react";

export default function LandingHero() {
  const liveSignals = [
    "Orbit AI synchronized workspace cognition",

    "Realtime operational awareness online",

    "Enterprise automation pipeline stabilized",
  ];

  return (
    <section
      className="
        relative
        overflow-hidden

        px-6
        pb-36
        pt-44

        md:px-12
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
            left-[-160px]
            top-[-140px]

            h-[520px]
            w-[520px]

            rounded-full

            bg-violet-500/20

            blur-[180px]
          "
        />

        <div
          className="
            absolute
            bottom-[-220px]
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

            opacity-[0.04]

            [background-image:linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)]

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

      <div
        className="
          relative
          z-10

          mx-auto
          max-w-7xl
        "
      >
        {/* BADGE */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="
            mx-auto

            flex
            w-fit
            items-center
            gap-2

            rounded-full

            border
            border-violet-500/20

            bg-violet-500/10

            px-5
            py-2.5

            text-sm
            text-violet-200

            backdrop-blur-xl
          "
        >
          <Sparkles
            size={14}
          />

          Orbit AI Operating System
        </motion.div>

        {/* TITLE */}

        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.08,
            duration: 0.7,
          }}
          className="
            mx-auto
            mt-10

            max-w-6xl

            text-center

            text-5xl
            font-semibold
            leading-[0.95]
            tracking-[-0.05em]

            text-white

            md:text-8xl
          "
        >
          The Future Of
          <br />

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
            Autonomous Work
          </span>
        </motion.h1>

        {/* SUBTITLE */}

        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.16,
            duration: 0.7,
          }}
          className="
            mx-auto
            mt-10

            max-w-3xl

            text-center
            text-lg
            leading-relaxed

            text-white/60

            md:text-xl
          "
        >
          Orbit transforms your
          company into an intelligent
          operational system with
          AI cognition, realtime
          coordination, automation
          layers and enterprise
          workspace orchestration.
        </motion.p>

        {/* ACTIONS */}

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
            delay: 0.24,
            duration: 0.7,
          }}
          className="
            mt-14

            flex
            flex-col
            items-center
            justify-center
            gap-4

            sm:flex-row
          "
        >
          <Link
            href="/register"
            className="
              group
              relative

              flex
              items-center
              gap-2

              overflow-hidden

              rounded-2xl

              border
              border-violet-400/20

              bg-violet-500/90

              px-7
              py-4

              text-sm
              font-medium

              text-white

              transition-all
              duration-300

              hover:scale-[1.02]
              hover:bg-violet-400
            "
          >
            <div
              className="
                absolute
                inset-0

                opacity-0

                transition-opacity
                duration-500

                group-hover:opacity-100

                bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]
              "
            />

            <span
              className="
                relative
                z-10
              "
            >
              Launch Orbit
            </span>

            <ArrowRight
              size={16}
              className="
                relative
                z-10
              "
            />
          </Link>

          <Link
            href="/login"
            className="
              flex
              items-center
              gap-2

              rounded-2xl

              border
              border-white/10

              bg-white/[0.03]

              px-7
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
            Access Workspace
          </Link>
        </motion.div>

        {/* AI PANEL */}

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
            delay: 0.34,
            duration: 0.7,
          }}
          className="
            mx-auto
            mt-20

            max-w-5xl
          "
        >
          <div
            className="
              relative

              overflow-hidden

              rounded-[34px]

              border
              border-white/10

              bg-white/[0.04]

              backdrop-blur-3xl
            "
          >
            {/* GLOW */}

            <div
              className="
                absolute
                inset-0

                bg-gradient-to-r
                from-violet-500/5
                via-transparent
                to-cyan-500/5
              "
            />

            <div
              className="
                relative
                z-10

                flex
                flex-col
                gap-8

                p-8

                lg:flex-row
                lg:items-center
              "
            >
              {/* ICON */}

              <div
                className="
                  flex
                  h-20
                  w-20

                  shrink-0

                  items-center
                  justify-center

                  rounded-[28px]

                  border
                  border-violet-500/20

                  bg-violet-500/10

                  text-violet-300
                "
              >
                <Brain
                  size={34}
                />
              </div>

              {/* CONTENT */}

              <div className="flex-1">
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2

                    rounded-full

                    border
                    border-cyan-500/10

                    bg-cyan-500/5

                    px-3
                    py-1.5

                    text-[11px]
                    uppercase

                    tracking-[0.18em]

                    text-cyan-300
                  "
                >
                  Autonomous Intelligence Core
                </div>

                <h3
                  className="
                    mt-5

                    text-3xl
                    font-semibold

                    tracking-tight

                    text-white
                  "
                >
                  Orbit AI Command Layer
                </h3>

                <p
                  className="
                    mt-5

                    max-w-2xl

                    text-base
                    leading-relaxed

                    text-white/60
                  "
                >
                  AI-powered workspace
                  orchestration with
                  operational memory,
                  enterprise automation,
                  realtime awareness and
                  intelligent execution
                  systems designed for
                  modern organizations.
                </p>
              </div>

              {/* SIDE */}

              <div
                className="
                  flex
                  flex-col
                  gap-4
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3

                    rounded-2xl

                    border
                    border-white/10

                    bg-white/[0.03]

                    px-4
                    py-4

                    text-sm
                    text-white/70
                  "
                >
                  <Shield
                    size={18}
                    className="
                      text-emerald-300
                    "
                  />

                  Enterprise Secure
                </div>

                <Link
                  href="/register"
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2

                    rounded-2xl

                    bg-violet-500/15

                    px-5
                    py-4

                    text-sm
                    font-medium

                    text-violet-200

                    transition-all
                    duration-300

                    hover:bg-violet-500/25
                  "
                >
                  Initialize Workspace

                  <ArrowRight
                    size={16}
                  />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* LIVE SIGNALS */}

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
            delay: 0.46,
            duration: 0.7,
          }}
          className="
            mx-auto
            mt-12

            flex
            max-w-6xl
            flex-wrap
            items-center
            justify-center
            gap-4
          "
        >
          {liveSignals.map(
            (item) => (
              <div
                key={item}
                className="
                  flex
                  items-center
                  gap-3

                  rounded-2xl

                  border
                  border-white/10

                  bg-white/[0.03]

                  px-5
                  py-3.5

                  text-sm
                  text-white/60

                  backdrop-blur-xl
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

                {item}
              </div>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
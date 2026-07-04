"use client";

import Link
from "next/link";

import {
  motion,
} from "framer-motion";

import {
  Activity,
  ArrowRight,
  Brain,
  Command,
  Cpu,
  Database,
  Orbit,
  Sparkles,
  Users,
} from "lucide-react";

const features = [
  {
    title:
      "Realtime AI Consciousness",

    description:
      "Orbit AI continuously monitors workspace cognition, detects execution pressure and generates autonomous operational signals.",

    icon: Brain,

    glow:
      "from-violet-500/20 to-fuchsia-500/10",
  },

  {
    title:
      "Autonomous Execution Engine",

    description:
      "AI systems generate contextual actions, workflows and intelligent execution recommendations across the entire workspace.",

    icon: Cpu,

    glow:
      "from-cyan-500/20 to-blue-500/10",
  },

  {
    title:
      "Orbit Command Center",

    description:
      "Unified AI command interface with intelligent routing, workspace orchestration and realtime operational awareness.",

    icon: Command,

    glow:
      "from-emerald-500/20 to-teal-500/10",
  },

  {
    title:
      "Workspace Memory System",

    description:
      "Persistent cognitive memory stream tracking behavioral patterns, execution history and AI generated workspace intelligence.",

    icon: Database,

    glow:
      "from-orange-500/20 to-amber-500/10",
  },

  {
    title:
      "Realtime Collaboration",

    description:
      "Multi-user AI workspace infrastructure with live synchronization, intelligent presence systems and collaborative execution flows.",

    icon: Users,

    glow:
      "from-pink-500/20 to-rose-500/10",
  },

  {
    title:
      "AI Observatory",

    description:
      "Living cognition stream visualizing AI awareness, workspace signals, autonomous activity and operational evolution in realtime.",

    icon: Activity,

    glow:
      "from-indigo-500/20 to-violet-500/10",
  },
];

export default function LandingFeatures() {
  return (
    <section
      id="systems"
      className="
        relative
        overflow-hidden

        px-6
        py-32

        md:px-12
      "
    >
      {/* ATMOSPHERE */}

      <div
        className="
          absolute
          inset-0
        "
      >
        <div
          className="
            absolute
            left-[10%]
            top-[15%]

            h-[320px]
            w-[320px]

            rounded-full

            bg-violet-500/10

            blur-[120px]
          "
        />

        <div
          className="
            absolute
            bottom-[10%]
            right-[10%]

            h-[340px]
            w-[340px]

            rounded-full

            bg-cyan-500/10

            blur-[140px]
          "
        />
      </div>

      <div
        className="
          relative
          z-10

          mx-auto
          max-w-7xl
        "
      >
        {/* HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            mx-auto
            max-w-4xl

            text-center
          "
        >
          <div
            className="
              mx-auto

              flex
              w-fit
              items-center
              gap-2

              rounded-full

              border
              border-cyan-500/20

              bg-cyan-500/10

              px-4
              py-2

              text-sm
              text-cyan-200
            "
          >
            <Sparkles
              size={14}
            />

            AI Operating System Architecture
          </div>

          <h2
            className="
              mt-8

              text-4xl
              font-semibold
              leading-tight
              tracking-[-0.04em]

              md:text-6xl
            "
          >
            Autonomous Intelligence
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
              Embedded Into Everything
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-8

              max-w-3xl

              text-lg
              leading-relaxed

              text-white/60
            "
          >
            Gunimi combines
            realtime cognition,
            autonomous orchestration,
            AI memory and intelligent
            execution systems into a
            unified workspace operating
            system.
          </p>
        </motion.div>

        {/* FEATURES GRID */}

        <div
          className="
            mt-20

            grid
            gap-6

            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {features.map(
            (
              feature,
              index
            ) => {
              const Icon =
                feature.icon;

              return (
                <motion.div
                  key={
                    feature.title
                  }
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay:
                      index * 0.08,

                    duration: 0.6,
                  }}
                  className="
                    group
                    relative

                    overflow-hidden

                    rounded-[32px]

                    border
                    border-white/10

                    bg-white/[0.03]

                    p-7

                    transition-all

                    hover:border-white/20
                    hover:bg-white/[0.05]
                  "
                >
                  {/* GLOW */}

                  <div
                    className={`
                      absolute
                      inset-0

                      opacity-0

                      transition-opacity
                      duration-500

                      group-hover:opacity-100

                      bg-gradient-to-br
                      ${feature.glow}
                    `}
                  />

                  {/* CONTENT */}

                  <div
                    className="
                      relative
                      z-10
                    "
                  >
                    {/* ICON */}

                    <div
                      className="
                        flex
                        h-16
                        w-16

                        items-center
                        justify-center

                        rounded-3xl

                        border
                        border-white/10

                        bg-white/[0.04]
                      "
                    >
                      <Icon
                        size={28}
                      />
                    </div>

                    {/* TEXT */}

                    <h3
                      className="
                        mt-8

                        text-2xl
                        font-semibold
                      "
                    >
                      {
                        feature.title
                      }
                    </h3>

                    <p
                      className="
                        mt-5

                        text-sm
                        leading-relaxed

                        text-white/60
                      "
                    >
                      {
                        feature.description
                      }
                    </p>

                    {/* FOOTER */}

                    <div
                      className="
                        mt-8

                        flex
                        items-center
                        justify-between
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-2

                          text-xs
                          uppercase
                          tracking-[0.2em]

                          text-white/30
                        "
                      >
                        <div
                          className="
                            h-2
                            w-2

                            rounded-full

                            bg-emerald-400
                          "
                        />

                        Live System
                      </div>

                      <div
                        className="
                          flex
                          h-11
                          w-11

                          items-center
                          justify-center

                          rounded-2xl

                          border
                          border-white/10

                          bg-white/[0.03]

                          transition-all

                          group-hover:border-white/20
                          group-hover:bg-white/[0.06]
                        "
                      >
                        <ArrowRight
                          size={16}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }
          )}
        </div>

        {/* BOTTOM CTA */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.2,
            duration: 0.7,
          }}
          className="
            relative

            mt-20
            overflow-hidden

            rounded-[40px]

            border
            border-white/10

            bg-white/[0.04]

            p-10
          "
        >
          {/* AMBIENT */}

          <div
            className="
              absolute
              inset-0

              bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.16),transparent_60%)]
            "
          />

          <div
            className="
              relative
              z-10

              flex
              flex-col
              gap-8

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            {/* LEFT */}

            <div
              className="
                max-w-3xl
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
                    flex
                    h-14
                    w-14

                    items-center
                    justify-center

                    rounded-3xl

                    bg-violet-500/10

                    text-violet-300
                  "
                >
                  <Orbit
                    size={24}
                  />
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      uppercase
                      tracking-[0.3em]

                      text-violet-300/60
                    "
                  >
                    Orbit AI OS
                  </p>

                  <h3
                    className="
                      mt-2

                      text-3xl
                      font-semibold
                    "
                  >
                    Enter Autonomous
                    Workspace Intelligence
                  </h3>
                </div>
              </div>

              <p
                className="
                  mt-6

                  text-lg
                  leading-relaxed

                  text-white/60
                "
              >
                Launch a living AI
                workspace system with
                realtime cognition,
                intelligent orchestration
                and autonomous operational
                awareness.
              </p>
            </div>

            {/* ACTIONS */}

            <div
              className="
                flex
                flex-col
                gap-4

                sm:flex-row
              "
            >
              <Link
                href="/dashboard"
                className="
                  flex
                  items-center
                  justify-center
                  gap-2

                  rounded-2xl

                  bg-violet-500

                  px-6
                  py-4

                  text-sm
                  font-medium

                  text-white

                  transition-all

                  hover:bg-violet-400
                "
              >
                Launch Orbit

                <ArrowRight
                  size={16}
                />
              </Link>

              <Link
                href="/login"
                className="
                  flex
                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-white/10

                  bg-white/[0.03]

                  px-6
                  py-4

                  text-sm
                  font-medium

                  text-white/70

                  transition-all

                  hover:border-white/20
                  hover:bg-white/[0.05]
                "
              >
                Access Workspace
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
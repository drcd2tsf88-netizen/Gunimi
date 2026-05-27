"use client";

import Link
from "next/link";

import {
  motion,
} from "framer-motion";

import {
  Activity,
  ArrowRight,
  Bot,
  Brain,
  Cpu,
  Orbit,
  Sparkles,
} from "lucide-react";

const systems = [
  {
    title:
      "Orbit AI Core",

    status:
      "Operational",

    description:
      "Realtime cognition engine continuously analyzing workspace execution systems and operational awareness.",

    icon: Brain,

    glow:
      "from-violet-500/20 to-fuchsia-500/10",
  },

  {
    title:
      "Workflow Engine",

    status:
      "Realtime Active",

    description:
      "Autonomous workflow orchestration system generating intelligent execution sequences and recovery flows.",

    icon: Cpu,

    glow:
      "from-cyan-500/20 to-blue-500/10",
  },

  {
    title:
      "Agent System",

    status:
      "4 Agents Online",

    description:
      "AI agents coordinating collaborative execution, observatory monitoring and workspace cognition.",

    icon: Bot,

    glow:
      "from-emerald-500/20 to-teal-500/10",
  },

  {
    title:
      "Workspace Stream",

    status:
      "Live Sync",

    description:
      "Realtime operational synchronization layer connecting memory, activity and autonomous intelligence.",

    icon: Activity,

    glow:
      "from-orange-500/20 to-amber-500/10",
  },
];

export default function LandingObservatory() {
  return (
    <section
      id="workflows"
      className="
        relative
        overflow-hidden

        px-6
        py-28
      "
    >
      {/* ATMOSPHERE */}

      <div
        className="
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            left-[5%]
            top-[10%]

            h-[320px]
            w-[320px]

            rounded-full

            bg-violet-500/10

            blur-[140px]
          "
        />

        <div
          className="
            absolute
            bottom-[5%]
            right-[10%]

            h-[300px]
            w-[300px]

            rounded-full

            bg-cyan-500/10

            blur-[120px]
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

            AI Observatory Systems
          </div>

          <h2
            className="
              mx-auto
              mt-8

              max-w-4xl

              text-5xl
              font-semibold
              leading-tight

              tracking-[-0.04em]

              md:text-6xl
            "
          >
            Realtime Workspace
            Intelligence Architecture
          </h2>

          <p
            className="
              mx-auto
              mt-6

              max-w-3xl

              text-lg
              leading-relaxed

              text-white/60
            "
          >
            OrbitDesk unifies cognition,
            orchestration, AI memory,
            observatory systems and
            autonomous execution into
            a living workspace operating
            system.
          </p>
        </motion.div>

        {/* GRID */}

        <div
          className="
            mt-20

            grid
            gap-6

            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          {systems.map(
            (
              system,
              index
            ) => {
              const Icon =
                system.icon;

              return (
                <motion.div
                  key={
                    system.title
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

                    rounded-[34px]

                    border
                    border-white/10

                    bg-white/[0.03]

                    p-7

                    backdrop-blur-2xl

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
                      ${system.glow}
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

                    {/* TITLE */}

                    <h3
                      className="
                        mt-8

                        text-2xl
                        font-semibold
                      "
                    >
                      {
                        system.title
                      }
                    </h3>

                    {/* DESCRIPTION */}

                    <p
                      className="
                        mt-5

                        text-sm
                        leading-relaxed

                        text-white/60
                      "
                    >
                      {
                        system.description
                      }
                    </p>

                    {/* STATUS */}

                    <div
                      className="
                        mt-8

                        flex
                        items-center
                        gap-3
                      "
                    >
                      <div
                        className="
                          relative
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

                        <div
                          className="
                            absolute
                            inset-0

                            animate-ping

                            rounded-full

                            bg-emerald-400/40
                          "
                        />
                      </div>

                      <p
                        className="
                          text-sm
                          text-white/60
                        "
                      >
                        {
                          system.status
                        }
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            }
          )}
        </div>

        {/* COMMAND CENTER */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
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
            duration: 0.8,
          }}
          className="
            relative

            mt-20
            overflow-hidden

            rounded-[40px]

            border
            border-white/10

            bg-white/[0.04]

            p-8

            backdrop-blur-2xl

            md:p-10
          "
        >
          {/* GLOW */}

          <div
            className="
              absolute
              inset-0

              bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.14),transparent_60%)]
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
                  gap-4
                "
              >
                <div
                  className="
                    flex
                    h-16
                    w-16

                    items-center
                    justify-center

                    rounded-3xl

                    bg-violet-500/10

                    text-violet-300
                  "
                >
                  <Orbit
                    size={28}
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
                    Orbit Command Layer
                  </p>

                  <h3
                    className="
                      mt-2

                      text-3xl
                      font-semibold
                    "
                  >
                    Autonomous Operational
                    Intelligence
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
                AI systems continuously
                monitoring workspace
                execution, generating
                contextual intelligence
                and orchestrating realtime
                operational awareness.
              </p>
            </div>

            {/* ACTION */}

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
              Open AI Observatory

              <ArrowRight
                size={16}
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
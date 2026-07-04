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
  Cpu,
  Database,
  Orbit,
  Sparkles,
  Users,
} from "lucide-react";

const systems = [
  {
    title:
      "AI Cognition",

    description:
      "Realtime workspace awareness and operational intelligence.",

    icon: Brain,
  },

  {
    title:
      "Memory Stream",

    description:
      "Persistent cognitive memory and behavioral intelligence.",

    icon: Database,
  },

  {
    title:
      "Workflow Engine",

    description:
      "Autonomous orchestration and execution sequencing.",

    icon: Cpu,
  },

  {
    title:
      "Workspace Sync",

    description:
      "Realtime collaboration and intelligent synchronization.",

    icon: Users,
  },
];

const activity = [
  "Orbit AI generated recovery workflow",

  "Workspace execution stabilized",

  "Realtime cognition systems synchronized",

  "Autonomous observatory stream active",
];

export default function LandingWorkspacePreview() {
  return (
    <section
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
            left-[10%]
            top-[15%]

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
              border-violet-500/20

              bg-violet-500/10

              px-4
              py-2

              text-sm
              text-violet-200
            "
          >
            <Sparkles
              size={14}
            />

            Orbit Workspace Preview
          </div>

          <h2
            className="
              mx-auto
              mt-8

              max-w-5xl

              text-5xl
              font-semibold
              leading-tight

              tracking-[-0.04em]

              md:text-6xl
            "
          >
            A Living Autonomous
            Workspace Interface
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
            Gunimi transforms
            traditional dashboards
            into intelligent realtime
            operational environments
            powered by AI cognition
            and autonomous execution.
          </p>
        </motion.div>

        {/* PREVIEW */}

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
            delay: 0.15,
            duration: 0.8,
          }}
          className="
            relative

            mt-20
            overflow-hidden

            rounded-[42px]

            border
            border-white/10

            bg-white/[0.03]

            backdrop-blur-2xl
          "
        >
          {/* GLOW */}

          <div
            className="
              absolute
              inset-0

              bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.12),transparent_60%)]
            "
          />

          {/* TOPBAR */}

          <div
            className="
              relative
              z-10

              flex
              flex-col
              gap-5

              border-b
              border-white/5

              px-8
              py-5

              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            {/* LEFT */}

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
                  items-center
                  gap-2
                "
              >
                <div
                  className="
                    h-3
                    w-3

                    rounded-full

                    bg-red-400
                  "
                />

                <div
                  className="
                    h-3
                    w-3

                    rounded-full

                    bg-yellow-400
                  "
                />

                <div
                  className="
                    h-3
                    w-3

                    rounded-full

                    bg-emerald-400
                  "
                />
              </div>

              <div
                className="
                  h-5
                  w-px

                  bg-white/10
                "
              />

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
                    h-10
                    w-10

                    items-center
                    justify-center

                    rounded-2xl

                    bg-violet-500/10

                    text-violet-300
                  "
                >
                  <Orbit
                    size={18}
                  />
                </div>

                <div>
                  <p
                    className="
                      text-sm
                      font-medium
                    "
                  >
                    Gunimi OS
                  </p>

                  <p
                    className="
                      mt-1

                      text-xs
                      text-white/40
                    "
                  >
                    Autonomous Workspace
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div
              className="
                flex
                items-center
                gap-3

                rounded-2xl

                border
                border-white/10

                bg-white/[0.03]

                px-5
                py-3
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
                Orbit AI Consciousness
                Online
              </p>
            </div>
          </div>

          {/* CONTENT */}

          <div
            className="
              relative
              z-10

              grid
              gap-8

              p-8

              lg:grid-cols-[1.2fr_0.8fr]
            "
          >
            {/* LEFT */}

            <div
              className="
                rounded-[34px]

                border
                border-white/10

                bg-[#0A0F1F]

                p-7
              "
            >
              {/* HEADER */}

              <div
                className="
                  flex
                  flex-col
                  gap-5

                  md:flex-row
                  md:items-center
                  md:justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-sm
                      uppercase

                      tracking-[0.2em]

                      text-cyan-300
                    "
                  >
                    Orbit Observatory
                  </p>

                  <h3
                    className="
                      mt-4

                      text-3xl
                      font-semibold
                    "
                  >
                    Workspace Systems
                  </h3>
                </div>

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
                    py-3
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
                      text-sm
                      text-white/50
                    "
                  >
                    Live Systems
                  </p>
                </div>
              </div>

              {/* GRID */}

              <div
                className="
                  mt-10

                  grid
                  gap-5

                  md:grid-cols-2
                "
              >
                {systems.map(
                  (
                    item
                  ) => {
                    const Icon =
                      item.icon;

                    return (
                      <div
                        key={
                          item.title
                        }
                        className="
                          group

                          rounded-3xl

                          border
                          border-white/5

                          bg-white/[0.03]

                          p-6

                          transition-all

                          hover:border-white/10
                          hover:bg-white/[0.05]
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
                          <Icon
                            size={24}
                          />
                        </div>

                        <h4
                          className="
                            mt-6

                            text-xl
                            font-semibold
                          "
                        >
                          {
                            item.title
                          }
                        </h4>

                        <p
                          className="
                            mt-4

                            text-sm
                            leading-relaxed

                            text-white/60
                          "
                        >
                          {
                            item.description
                          }
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* RIGHT */}

            <div
              className="
                rounded-[34px]

                border
                border-white/10

                bg-[#0A0F1F]

                p-7
              "
            >
              {/* HEADER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-sm
                      uppercase

                      tracking-[0.2em]

                      text-violet-300
                    "
                  >
                    AI Activity Stream
                  </p>

                  <h3
                    className="
                      mt-4

                      text-2xl
                      font-semibold
                    "
                  >
                    Autonomous Signals
                  </h3>
                </div>

                <div
                  className="
                    flex
                    h-14
                    w-14

                    items-center
                    justify-center

                    rounded-3xl

                    bg-cyan-500/10

                    text-cyan-300
                  "
                >
                  <Activity
                    size={24}
                  />
                </div>
              </div>

              {/* STREAM */}

              <div
                className="
                  mt-10
                  space-y-5
                "
              >
                {activity.map(
                  (
                    item
                  ) => (
                    <div
                      key={item}
                      className="
                        flex
                        items-start
                        gap-4

                        rounded-3xl

                        border
                        border-white/5

                        bg-white/[0.03]

                        p-5
                      "
                    >
                      <div
                        className="
                          mt-1

                          flex
                          h-10
                          w-10

                          shrink-0

                          items-center
                          justify-center

                          rounded-2xl

                          bg-violet-500/10

                          text-violet-300
                        "
                      >
                        <Brain
                          size={18}
                        />
                      </div>

                      <div>
                        <p
                          className="
                            text-sm
                            leading-relaxed

                            text-white/70
                          "
                        >
                          {item}
                        </p>

                        <p
                          className="
                            mt-3

                            text-xs
                            uppercase
                            tracking-[0.2em]

                            text-white/30
                          "
                        >
                          Orbit AI
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* CTA */}

              <Link
                href="/dashboard"
                className="
                  mt-8

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
                Launch Workspace

                <ArrowRight
                  size={16}
                />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
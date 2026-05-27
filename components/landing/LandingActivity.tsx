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
  Sparkles,
} from "lucide-react";

const activity = [
  {
    title:
      "CRM Recovery Workflow Generated",

    description:
      "Orbit AI detected inactive customer pipeline and initialized autonomous recovery orchestration.",

    type:
      "Autonomous Workflow",
  },

  {
    title:
      "Workspace Productivity Elevated",

    description:
      "AI cognition systems detected increased execution efficiency across collaborative operations.",

    type:
      "Productivity Signal",
  },

  {
    title:
      "Realtime Anomaly Detection Active",

    description:
      "Orbit Observatory continuously monitoring execution pressure and operational inconsistencies.",

    type:
      "AI Monitoring",
  },

  {
    title:
      "Task Recovery Sequence Initialized",

    description:
      "Orbit AI generated contextual execution actions for unresolved high-priority workload clusters.",

    type:
      "Execution Engine",
  },
];

export default function LandingActivity() {
  return (
    <section
      id="observatory"
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

            bg-cyan-500/10

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

            bg-violet-500/10

            blur-[120px]
          "
        />
      </div>

      <div
        className="
          relative
          z-10

          mx-auto
          max-w-6xl
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

            Live Workspace Cognition
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
            Orbit AI Observatory
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
            Realtime intelligence stream
            visualizing autonomous AI
            cognition, workspace
            execution flow and operational
            awareness systems.
          </p>
        </motion.div>

        {/* OBSERVATORY */}

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

            mt-16
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

              bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_60%)]
            "
          />

          {/* TOPBAR */}

          <div
            className="
              relative
              z-10

              flex
              flex-col
              gap-6

              border-b
              border-white/5

              pb-8

              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            {/* LEFT */}

            <div>
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
                  "
                >
                  <div
                    className="
                      h-3
                      w-3

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
                    uppercase

                    tracking-[0.2em]

                    text-cyan-300
                  "
                >
                  Live AI Activity
                </p>
              </div>

              <h3
                className="
                  mt-5

                  text-3xl
                  font-semibold
                "
              >
                Autonomous Cognition Stream
              </h3>
            </div>

            {/* STATUS */}

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
                py-4
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12

                  items-center
                  justify-center

                  rounded-2xl

                  bg-violet-500/10

                  text-violet-300
                "
              >
                <Brain
                  size={22}
                />
              </div>

              <div>
                <p
                  className="
                    text-sm
                    font-medium
                  "
                >
                  Orbit AI Consciousness
                </p>

                <p
                  className="
                    mt-1

                    text-xs
                    text-white/40
                  "
                >
                  Monitoring workspace
                  execution systems
                </p>
              </div>
            </div>
          </div>

          {/* STREAM */}

          <div
            className="
              relative
              z-10

              mt-10
              space-y-5
            "
          >
            {activity.map(
              (
                item,
                index
              ) => (
                <motion.div
                  key={item.title}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
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

                    flex
                    flex-col
                    gap-5

                    rounded-3xl

                    border
                    border-white/5

                    bg-white/[0.02]

                    p-6

                    transition-all

                    hover:border-white/10
                    hover:bg-white/[0.04]

                    md:flex-row
                    md:items-start
                    md:justify-between
                  "
                >
                  {/* LEFT */}

                  <div
                    className="
                      flex
                      gap-5
                    "
                  >
                    {/* SIGNAL */}

                    <div
                      className="
                        mt-1

                        flex
                        h-12
                        w-12

                        shrink-0

                        items-center
                        justify-center

                        rounded-2xl

                        bg-cyan-500/10

                        text-cyan-300
                      "
                    >
                      <Activity
                        size={20}
                      />
                    </div>

                    {/* CONTENT */}

                    <div>
                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-3
                        "
                      >
                        <p
                          className="
                            text-xs
                            uppercase

                            tracking-[0.2em]

                            text-cyan-300/70
                          "
                        >
                          {item.type}
                        </p>

                        <div
                          className="
                            h-1
                            w-1

                            rounded-full

                            bg-white/20
                          "
                        />

                        <p
                          className="
                            text-xs
                            text-white/30
                          "
                        >
                          AI generated
                        </p>
                      </div>

                      <h4
                        className="
                          mt-3

                          text-xl
                          font-semibold
                        "
                      >
                        {item.title}
                      </h4>

                      <p
                        className="
                          mt-4

                          max-w-3xl

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
                  </div>

                  {/* RIGHT */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2

                      rounded-2xl

                      border
                      border-white/10

                      bg-white/[0.03]

                      px-4
                      py-3

                      text-xs
                      uppercase
                      tracking-[0.2em]

                      text-white/40
                    "
                  >
                    <Cpu
                      size={14}
                    />

                    Active
                  </div>
                </motion.div>
              )
            )}
          </div>

          {/* CTA */}

          <div
            className="
              relative
              z-10

              mt-10

              flex
              justify-center
            "
          >
            <Link
              href="/dashboard"
              className="
                flex
                items-center
                gap-2

                rounded-2xl

                border
                border-white/10

                bg-white/[0.04]

                px-6
                py-4

                text-sm
                font-medium

                text-white/70

                transition-all

                hover:border-white/20
                hover:bg-white/[0.06]
              "
            >
              Open Live Observatory

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
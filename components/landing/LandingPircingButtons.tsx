"use client";

import Link
from "next/link";

import {
  motion,
} from "framer-motion";

import {
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

const plans = [
  {
    title:
      "Starter",

    price:
      "$0",

    description:
      "Autonomous AI workspace foundation for personal execution systems.",

    features: [
      "Realtime AI workspace",

      "Orbit observatory",

      "Workspace memory",

      "AI cognition systems",
    ],

    glow:
      "from-violet-500/20 to-fuchsia-500/10",
  },

  {
    title:
      "Orbit Pro",

    price:
      "$29",

    description:
      "Advanced autonomous orchestration for growing AI operational workflows.",

    features: [
      "Autonomous execution",

      "AI workflow engine",

      "Realtime collaboration",

      "Priority cognition",
    ],

    featured: true,

    glow:
      "from-cyan-500/20 to-blue-500/10",
  },

  {
    title:
      "Enterprise",

    price:
      "Custom",

    description:
      "Multi-workspace AI operating system architecture for enterprise intelligence.",

    features: [
      "Custom AI agents",

      "Workspace federation",

      "Advanced orchestration",

      "Enterprise cognition",
    ],

    glow:
      "from-emerald-500/20 to-teal-500/10",
  },
];

export default function LandingPricingButtons() {
  return (
    <section
      className="
        relative
        overflow-hidden

        px-6
        py-28
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
        "
      >
        {/* HEADER */}

        <div
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

            Orbit Intelligence Plans
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
            Choose Your AI
            Workspace Evolution
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
            Scale from personal
            autonomous workflows to
            enterprise AI operating
            systems powered by Orbit
            cognition architecture.
          </p>
        </div>

        {/* GRID */}

        <div
          className="
            mt-20

            grid
            gap-6

            lg:grid-cols-3
          "
        >
          {plans.map(
            (
              plan,
              index
            ) => (
              <motion.div
                key={plan.title}
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
                className={`
                  relative
                  overflow-hidden

                  rounded-[36px]

                  border

                  p-8

                  backdrop-blur-2xl

                  ${
                    plan.featured
                      ? `
                        border-cyan-500/30
                        bg-cyan-500/[0.05]
                      `
                      : `
                        border-white/10
                        bg-white/[0.03]
                      `
                  }
                `}
              >
                {/* GLOW */}

                <div
                  className={`
                    absolute
                    inset-0

                    bg-gradient-to-br
                    ${plan.glow}
                  `}
                />

                <div
                  className="
                    relative
                    z-10
                  "
                >
                  {/* FEATURED */}

                  {plan.featured && (
                    <div
                      className="
                        mb-6

                        w-fit

                        rounded-full

                        border
                        border-cyan-500/20

                        bg-cyan-500/10

                        px-3
                        py-1

                        text-xs
                        uppercase

                        tracking-[0.2em]

                        text-cyan-200
                      "
                    >
                      Most Advanced
                    </div>
                  )}

                  {/* TITLE */}

                  <h3
                    className="
                      text-3xl
                      font-semibold
                    "
                  >
                    {plan.title}
                  </h3>

                  <div
                    className="
                      mt-6

                      flex
                      items-end
                      gap-2
                    "
                  >
                    <span
                      className="
                        text-5xl
                        font-semibold
                      "
                    >
                      {plan.price}
                    </span>

                    {plan.price !==
                      "Custom" && (
                      <span
                        className="
                          mb-1

                          text-white/40
                        "
                      >
                        /month
                      </span>
                    )}
                  </div>

                  <p
                    className="
                      mt-6

                      text-sm
                      leading-relaxed

                      text-white/60
                    "
                  >
                    {
                      plan.description
                    }
                  </p>

                  {/* FEATURES */}

                  <div
                    className="
                      mt-8
                      space-y-4
                    "
                  >
                    {plan.features.map(
                      (
                        feature
                      ) => (
                        <div
                          key={
                            feature
                          }
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >
                          <div
                            className="
                              flex
                              h-6
                              w-6

                              items-center
                              justify-center

                              rounded-full

                              bg-emerald-500/10

                              text-emerald-300
                            "
                          >
                            <Check
                              size={14}
                            />
                          </div>

                          <p
                            className="
                              text-sm
                              text-white/70
                            "
                          >
                            {
                              feature
                            }
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  {/* BUTTON */}

                  <Link
                    href="/login"
                    className={`
                      mt-10

                      flex
                      items-center
                      justify-center
                      gap-2

                      rounded-2xl

                      px-5
                      py-4

                      text-sm
                      font-medium

                      transition-all

                      ${
                        plan.featured
                          ? `
                            bg-cyan-500
                            text-white

                            hover:bg-cyan-400
                          `
                          : `
                            bg-white/[0.06]
                            text-white/80

                            hover:bg-white/[0.1]
                          `
                      }
                    `}
                  >
                    Launch Orbit

                    <ArrowRight
                      size={16}
                    />
                  </Link>
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
}